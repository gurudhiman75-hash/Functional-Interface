import {
  generateSapBankingQuestionStudioBatch,
  isSapBankingQuestionStudioRequest,
  SAP_BANKING_QUESTION_STUDIO_CAPABILITY,
  type SapBankingQuestionStudioRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/question-studio-banking-integration";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
} from "../quant-v4/topics/Arithmetic/subtopics/SimplificationAndApproximation/question-studio-adapter";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "./engine-types";

export function isSapBankingEngineRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  return isSapBankingQuestionStudioRequest(request as SapBankingQuestionStudioRequest);
}

function asClientError(error: unknown): never {
  if (error && typeof error === "object" && "statusCode" in error) throw error;
  const message = error instanceof Error ? error.message : String(error ?? "SAP Banking generation failed");
  throw Object.assign(new Error(message), {
    statusCode: 400,
    code: "SAP_BANKING_REQUEST_INVALID",
  });
}

export async function generateSapBankingEngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isSapBankingEngineRequest(request)) return null;

  try {
    return await generateSapBankingQuestionStudioBatch(
      request as SapBankingQuestionStudioRequest,
    ) as unknown as QuestionStudioGenerationResult;
  } catch (error) {
    return asClientError(error);
  }
}

export const SAP_BANKING_ENGINE_METADATA = Object.freeze({
  packageId: "SAP",
  cpIds: [...SAP_QUESTION_STUDIO_CP_IDS],
  supportedExamProfiles: [
    ...SAP_BANKING_QUESTION_STUDIO_CAPABILITY.supportedExamProfiles,
  ],
  optionCountByExamProfile: {
    ...SAP_BANKING_QUESTION_STUDIO_CAPABILITY.optionCountByExamProfile,
  },
  language: "en",
  runtimeMode: "SAP_BANKING_SPEED_PROFILE_V1",
  reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  manualApprovalRequired: true,
});
