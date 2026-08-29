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

export {
  isNumCp014QuestionStudioRequest,
  isSriQuestionStudioRequestV1,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
};
export type { SharedQuestionStudioGenerationRequest, SriQuestionStudioRequestV1 };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];
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
  if (isSriQuestionStudioRequestV1(request)) return generateSriQuestionStudioBatchV1(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
