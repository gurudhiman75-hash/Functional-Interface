import { parentPort, workerData } from "node:worker_threads";
import type { QuestionStudioGenerationRequest } from "./engine-types";

type Input = {
  request: QuestionStudioGenerationRequest;
  count: number;
  selectedCpIds: string[];
  examProfileId?: unknown;
  difficultyPreset?: unknown;
  difficultyDistribution?: unknown;
};

// The approved NUM-001 editorial and Quant exam-profile authorities run
// outside Render's HTTP event loop and have no access to production DB.
async function run() {
  const input = workerData as Input;
  const [{ generateProfiledQuantBatch }, { generateNum001EngineBatch }] = await Promise.all([
    import("./quant-exam-profile"),
    import("./quant-number-system-num001"),
  ]);
  const batch = await generateProfiledQuantBatch({
    request: input.request,
    count: input.count,
    selectedCpIds: input.selectedCpIds,
    examProfileId: input.examProfileId,
    difficultyPreset: input.difficultyPreset,
    difficultyDistribution: input.difficultyDistribution,
    forwardLegacyExamProfile: true,
    difficultyFilterSupported: false,
    generateCandidateBatch: async (request) => {
      const result = await generateNum001EngineBatch(request);
      if (!result) {
        throw Object.assign(new Error("NUM-001 adapter rejected its own package"), {
          statusCode: 422, code: "NUM001_ADAPTER_REJECTED",
        });
      }
      return result;
    },
  });
  parentPort?.postMessage({ ok: true, batch });
}

void run().catch((caught: unknown) => {
  const e = caught as { message?: string; code?: string; statusCode?: number };
  parentPort?.postMessage({
    ok: false,
    error: { message: e.message ?? "NUM-001 generation failed", code: e.code ?? "NUM001_WORKER_FAILED", statusCode: e.statusCode ?? 422 },
  });
});
