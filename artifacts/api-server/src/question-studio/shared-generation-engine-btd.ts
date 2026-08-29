import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp014";
import {
  generateBtdCp006QuestionStudioBatch,
  isBtdCp006QuestionStudioRequest,
  listBtdCp006QuestionStudioPackages,
  type BtdCp006QuestionStudioRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-006/btd-cp006-question-studio-review-v1";

export { isBtdCp006QuestionStudioRequest };
export type { BtdCp006QuestionStudioRequest };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];
  for (const pkg of listBtdCp006QuestionStudioPackages()) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before BTD activation.`);
    }
    previous.push(pkg);
  }
  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest | BtdCp006QuestionStudioRequest = {}) {
  if (isBtdCp006QuestionStudioRequest(request)) return generateBtdCp006QuestionStudioBatch(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
