import {
  generateQuestion as generatePreviousQuestion,
  isNumCp014QuestionStudioRequest,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp014.ts";
import {
  generateSriQuestionStudioBatchV1,
  isSriQuestionStudioRequestV1,
  listSriQuestionStudioPackagesV1,
  type SriQuestionStudioRequestV1,
} from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/question-studio-v1.ts";
import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  isDsf001NormalQuestionStudioRequest,
  previewDsf001NormalQuestionStudioReview,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-review-v1.ts";

export {
  isDsf001NormalQuestionStudioRequest,
  isNumCp014QuestionStudioRequest,
  isSriQuestionStudioRequestV1,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
};
export type { SharedQuestionStudioGenerationRequest, SriQuestionStudioRequestV1 };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];

  if (previous.some((entry) => String(entry.packageId) === DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId)) {
    throw new Error("Question Studio package DSF-001 already exists before CP017 normal-workflow activation.");
  }
  previous.push(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE);

  const sri = listSriQuestionStudioPackagesV1();
  for (const pkg of sri) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before SRI activation.`);
    }
    previous.push(pkg);
  }
  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest | SriQuestionStudioRequestV1 = {}) {
  if (isDsf001NormalQuestionStudioRequest(request as any)) {
    return previewDsf001NormalQuestionStudioReview(request as any);
  }
  if (isSriQuestionStudioRequestV1(request)) return generateSriQuestionStudioBatchV1(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
