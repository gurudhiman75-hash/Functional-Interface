import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp013";
import {
  generateTrg001QuestionStudioBatch,
  isTrg001QuestionStudioRequest,
  TRG_001_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/question-studio-runtime";
import {
  generateTrg002V4QuestionStudioBatch,
  isTrg002V4GenerationRequest,
  TRG_002_V4_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime";

export {
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
};
export type { SharedQuestionStudioGenerationRequest };

function upsertPackage(packages: any[], capability: any) {
  const packageId = String(capability.packageId);
  const index = packages.findIndex((entry) => String(entry.packageId) === packageId);
  if (index >= 0) packages.splice(index, 1, capability);
  else packages.push(capability);
}

export function listQuestionStudioPackages() {
  const packages = [...listPreviousPackages()] as any[];
  upsertPackage(packages, TRG_001_QUESTION_STUDIO_PACKAGE);
  upsertPackage(packages, TRG_002_V4_QUESTION_STUDIO_PACKAGE);
  return packages.sort((left, right) => String(left.packageId).localeCompare(String(right.packageId)));
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  // Keep the explicit/fundamentals TRG-001 detector first because the TRG-002
  // detector intentionally accepts broader Trigonometry selectors.
  if (isTrg001QuestionStudioRequest(request)) {
    return generateTrg001QuestionStudioBatch(request);
  }
  if (isTrg002V4GenerationRequest(request)) {
    return generateTrg002V4QuestionStudioBatch(request);
  }
  return generatePreviousQuestion(request);
}
