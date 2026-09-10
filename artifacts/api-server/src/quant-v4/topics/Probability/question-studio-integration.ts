import {
  generateProbabilityStandardQuestionStudioBatch,
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages as listRuntimePackages,
  type ProbabilityStandardQuestionStudioRequest,
} from "./question-studio-runtime";

export { isProbabilityStandardQuestionStudioRequest };
export type { ProbabilityStandardQuestionStudioRequest };

function selectedExamMode(request: ProbabilityStandardQuestionStudioRequest) {
  return String((request as any).runtimeMode ?? "").trim().toUpperCase();
}

function isExamProfile(value: string) {
  return value === "SSC_CGL_CHSL"
    || value === "SSC_CGL_JSO"
    || value === "BANKING_PRELIMS"
    || value === "BANKING_MAINS"
    || value === "GENERIC_PRACTICE";
}

function resolveRequest(request: ProbabilityStandardQuestionStudioRequest) {
  const mode = selectedExamMode(request);
  return isExamProfile(mode) && !request.examProfile
    ? { ...request, examProfile: mode as any }
    : request;
}

export function listProbabilityStandardQuestionStudioPackages() {
  return listRuntimePackages().map((entry) => ({
    ...entry,
    runtimeMode: "ENGLISH_MOCK_READY",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE_WITH_FAMILY_LIMIT",
    publiclyPublishable: false,
    freezeStatus: "ENGLISH_MOCK_READY",
    maxPerMockPerFamily: 1,
  }));
}

function preserveEnglishProfileDelivery(result: any) {
  if (!Array.isArray(result?.questions) || !Array.isArray(result?.questionPackages)) {
    return result;
  }

  const questions = result.questions.map((question: any, index: number) => {
    const source = result.questionPackages[index];
    if (!source || !Array.isArray(source.options) || source.options.length < 2) {
      return question;
    }
    const correctIndex = Number.isInteger(source.correctIndex)
      ? source.correctIndex
      : question.correctIndex;
    const examProfile = source.examProfile
      ?? source.parameters?.examProfile
      ?? source.traceability?.examProfile;
    const optionCount = Number.isInteger(source.optionCount)
      ? source.optionCount
      : source.options.length;

    return {
      ...question,
      options: [...source.options],
      correct: correctIndex,
      correctIndex,
      examProfile,
      optionCount,
      metadata: {
        ...(question.metadata ?? {}),
        examProfile,
        optionCount,
      },
      debugMetadata: {
        ...(question.debugMetadata ?? {}),
        examProfile,
        optionCount,
      },
    };
  });

  return {
    ...result,
    questions,
  };
}

export function generateProbabilityQuestionStudioBatch(
  request: ProbabilityStandardQuestionStudioRequest = {},
) {
  const cockpitRequest = isExamProfile(selectedExamMode(request));
  const resolved = resolveRequest(request);
  const generated = generateProbabilityStandardQuestionStudioBatch(resolved);
  const result = (resolved.language ?? "en") === "en"
    ? preserveEnglishProfileDelivery(generated)
    : generated;
  if ((resolved.language ?? "en") !== "en") return result;

  const readinessContext = {
    ...result.generationContext,
    runtimeMode: "ENGLISH_MOCK_READY",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE_WITH_FAMILY_LIMIT",
    publiclyPublishable: false,
    freezeStatus: "ENGLISH_MOCK_READY",
    maxPerMockPerFamily: 1,
  };

  if (!cockpitRequest) {
    return {
      ...result,
      generationContext: readinessContext,
    };
  }

  const { publiclyPublishable: _publicRelease, ...generationContext } = readinessContext;
  const questions = result.questions.map((question: any) => {
    const { publiclyPublishable: _questionPublicRelease, ...payload } = question as Record<string, unknown>;
    return {
      ...payload,
      automaticStudentPublication: false,
      publicReleaseStatus: "LOCKED",
    };
  });

  return {
    ...result,
    generationContext: {
      ...generationContext,
      automaticStudentPublication: false,
      publicReleaseStatus: "LOCKED",
    },
    questions,
  };
}
