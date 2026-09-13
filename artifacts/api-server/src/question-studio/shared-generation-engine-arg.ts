import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-sri.ts";
import {
  generateArg001QuestionStudioBatch,
  isArg001QuestionStudioRequest,
  listArg001QuestionStudioPackages,
} from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp005-question-studio-integration.ts";

export { isArg001QuestionStudioRequest };
export type { SharedQuestionStudioGenerationRequest };

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];
  const argPackages = listArg001QuestionStudioPackages();
  for (const pkg of argPackages) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before ARG-001 CP005 activation.`);
    }
    previous.push(pkg);
  }
  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  if (isArg001QuestionStudioRequest(request)) {
    return generateArg001QuestionStudioBatch(request);
  }
  return generatePreviousQuestion(request);
}
