import { parentPort, workerData } from "node:worker_threads";
import type { QuestionStudioGenerationRequest } from "./engine-types";

type WorkInput = {
  request: QuestionStudioGenerationRequest;
  count: number;
  selectedCpIds: string[];
  examProfileId?: unknown;
  difficultyPreset?: unknown;
  difficultyDistribution?: unknown;
};

// The expensive TRG-002 frozen question authority and exam-profile candidate
// ranking run in a worker, not on the API/health-check event loop. Keep the
// exact existing profile planner, question generator and lifecycle flags.
async function run() {
  const input = workerData as WorkInput;
  const startedAt = Date.now();
  const snapshot = (phase: string) => ({
    event: "trg002_worker_memory",
    phase,
    count: input.count,
    elapsedMs: Date.now() - startedAt,
    rssBytes: process.memoryUsage().rss,
    heapUsedBytes: process.memoryUsage().heapUsed,
  });
  console.info(JSON.stringify(snapshot("startup")));
  // Import the specific chapter authority only after the worker starts.
  // Keep the large registry / other subject authorities out of this process.
  const [{ generateProfiledQuantBatch }, { generateTrg002V4QuestionStudioBatch }] = await Promise.all([
    import("./quant-exam-profile"),
    import("../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime"),
  ]);
  console.info(JSON.stringify(snapshot("authority_loaded")));
  const batch = await generateProfiledQuantBatch({
    request: input.request,
    count: input.count,
    selectedCpIds: input.selectedCpIds,
    examProfileId: input.examProfileId,
    difficultyPreset: input.difficultyPreset,
    difficultyDistribution: input.difficultyDistribution,
    difficultyFilterSupported: true,
    forwardLegacyExamProfile: false,
    generateCandidateBatch: async (candidateRequest) => {
      const result = generateTrg002V4QuestionStudioBatch(candidateRequest);
      const lifecycle = {
        questionBankWritable: true,
        testEligible: true,
        mockTestEligible: true,
        publiclyPublishable: false,
        publicReleaseAuthorized: false,
        automaticStudentPublication: false,
      };
      return {
        ...result,
        generationContext: { ...result.generationContext, ...lifecycle },
        questions: result.questions.map((question) => ({ ...question, ...lifecycle })),
      };
    },
  });
  console.info(JSON.stringify(snapshot("batch_ready")));
  parentPort?.postMessage({ ok: true, batch });
}

void run().catch((error: unknown) => {
  const failure = error as { message?: string; code?: string; statusCode?: number; details?: unknown };
  console.error(JSON.stringify({ event: "trg002_worker_failed", code: failure?.code ?? "TRG002_GENERATION_FAILED", rssBytes: process.memoryUsage().rss }));
  parentPort?.postMessage({
    ok: false,
    error: {
      message: failure?.message ?? "TRG-002 generation failed",
      code: failure?.code ?? "TRG002_GENERATION_FAILED",
      statusCode: failure?.statusCode ?? 422,
      details: failure?.details,
    },
  });
});
