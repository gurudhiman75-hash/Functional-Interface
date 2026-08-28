import {
  generateQuestion as generatePreviousQuestion,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp013";
import {
  generateTrg001QuestionStudioBatch,
  isTrg001QuestionStudioRequest as isTrg001QuestionStudioRequestBase,
  TRG_001_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/question-studio-runtime";
import {
  generateTrg002V4QuestionStudioBatch,
  isTrg002V4GenerationRequest as isTrg002V4GenerationRequestBase,
  TRG_002_V4_QUESTION_STUDIO_PACKAGE,
} from "../quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/question-studio-v4-runtime";

export type { SharedQuestionStudioGenerationRequest };

const TRG_002_AGGREGATE_CAPABILITY = Object.freeze({
  ...TRG_002_V4_QUESTION_STUDIO_PACKAGE,
  permanentQlCount: 96,
  questionBankWritable: true,
  testEligible: true,
  mockTestEligible: true,
  automaticStudentPublication: false,
});

function selector(request: any) {
  return String(request?.questionLanguageId ?? request?.canonicalProblemId ?? request?.cpId ?? "").trim().toUpperCase();
}

export function isTrg001QuestionStudioRequest(request: any) {
  const selected = selector(request);
  return selected.startsWith("TRG-001-QL-")
    || /^TRG-CP-00[1-6]$/u.test(selected)
    || isTrg001QuestionStudioRequestBase(request as any);
}

export function isTrg002V4GenerationRequest(request: any) {
  const selected = selector(request);
  return selected.startsWith("TRG-002-QL-")
    || /^TRG-CP-0(?:07|08|09|10)$/u.test(selected)
    || isTrg002V4GenerationRequestBase(request as any);
}

function upsertPackage(packages: any[], capability: any) {
  const packageId = String(capability.packageId);
  const index = packages.findIndex((entry) => String(entry.packageId) === packageId);
  if (index >= 0) packages.splice(index, 1, capability);
  else packages.push(capability);
}

function applyInternalLifecycleBooleans(result: any) {
  const lifecycle = {
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
  } as const;

  const questionPackages = Object.freeze((result.questionPackages ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
  })));
  const questions = Object.freeze((result.questions ?? []).map((entry: any) => Object.freeze({
    ...entry,
    ...lifecycle,
  })));

  return Object.freeze({
    ...result,
    generationContext: Object.freeze({
      ...(result.generationContext ?? {}),
      ...lifecycle,
    }),
    questionPackages,
    questions,
  });
}

export function listQuestionStudioPackages() {
  const packages = [...listPreviousPackages()] as any[];
  upsertPackage(packages, TRG_001_QUESTION_STUDIO_PACKAGE);
  upsertPackage(packages, TRG_002_AGGREGATE_CAPABILITY);
  return packages.sort((left, right) => String(left.packageId).localeCompare(String(right.packageId)));
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest = {}) {
  // Keep TRG-001 first because the TRG-002 base detector intentionally accepts
  // broader Trigonometry topic selectors.
  if (isTrg001QuestionStudioRequest(request)) {
    return generateTrg001QuestionStudioBatch(request as any);
  }
  if (isTrg002V4GenerationRequest(request)) {
    return applyInternalLifecycleBooleans(generateTrg002V4QuestionStudioBatch(request as any));
  }
  return generatePreviousQuestion(request);
}
