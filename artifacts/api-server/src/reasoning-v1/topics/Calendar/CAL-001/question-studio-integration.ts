import {
  CALENDAR_PERMANENT_QL_IDS,
} from "./permanent-contracts";
import {
  CAL_001_PACKAGE_ID,
  generateCal001QuestionStudioBatch,
  isCal001GenerationRequest,
} from "./question-studio-runtime";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";

export const CAL001_STANDARD_QUESTION_STUDIO_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CAL_001_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Calendar",
  subtopic: "Calendar",
  label: "Reasoning · Calendar · CAL-001",
  enabled: true,
  cpIds: [...CALENDAR_PERMANENT_QL_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  metadata: {
    permanentQlRange: "CAL-QL-001..036",
    permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
    sourceRuntime: "CAL_001_QUESTION_STUDIO_V1",
    deterministicGeneration: true,
  },
};

export function isCal001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  return isCal001GenerationRequest(request);
}

export async function generateCal001StandardQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
) {
  const result = await generateCal001QuestionStudioBatch(request);
  return {
    ...result,
    generationContext: {
      ...(result.generationContext ?? {}),
      engineId: "reasoning-v1",
      packageId: CAL_001_PACKAGE_ID,
      runtimeMode: "review-only",
      lifecycleId: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
      lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleStage,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
    questions: result.questions.map((question) => ({
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      ...question,
      packageId: CAL_001_PACKAGE_ID,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    })),
  };
}
