import { parentPort, workerData } from "node:worker_threads";
import { generateProfiledQuantBatch } from "./quant-exam-profile";
import type { QuestionStudioGenerationRequest } from "./engine-types";
import { generateTrg002V4QuestionStudioBatch } from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime";

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
  parentPort?.postMessage({ ok: true, batch });
}

void run().catch((error: unknown) => {
  const failure = error as { message?: string; code?: string; statusCode?: number; details?: unknown };
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
