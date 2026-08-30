import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp014";
import {
  generateBtdCp010QuestionStudioBatch,
  isBtdCp010QuestionStudioRequest,
  listBtdCp010QuestionStudioPackages,
  type BtdCp010QuestionStudioRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-010/btd-cp010-multilingual-question-studio-v1";

export { isBtdCp010QuestionStudioRequest };
export type { BtdCp010QuestionStudioRequest };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];
  for (const pkg of listBtdCp010QuestionStudioPackages()) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before BTD activation.`);
    }
    previous.push(pkg);
  }
  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest | BtdCp010QuestionStudioRequest = {}) {
  if (isBtdCp010QuestionStudioRequest(request)) return generateBtdCp010QuestionStudioBatch(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
