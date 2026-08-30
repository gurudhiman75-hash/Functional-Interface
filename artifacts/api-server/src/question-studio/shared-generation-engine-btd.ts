import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp014";
import {
  generateBtdCp012QuestionBankAdmissionBatchV1,
  isBtdCp012QuestionStudioRequest,
  listBtdCp012QuestionStudioPackages,
  type BtdCp012QuestionStudioRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-012/btd-cp012-question-bank-admission-v1";

export { isBtdCp012QuestionStudioRequest };
export type { BtdCp012QuestionStudioRequest };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];
  for (const pkg of listBtdCp012QuestionStudioPackages()) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before BTD activation.`);
    }
    previous.push(pkg);
  }
  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest | BtdCp012QuestionStudioRequest = {}) {
  if (isBtdCp012QuestionStudioRequest(request)) return generateBtdCp012QuestionBankAdmissionBatchV1(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
