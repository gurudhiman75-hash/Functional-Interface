import {
  generateProbabilityStandardQuestionStudioBatch,
  isProbabilityStandardQuestionStudioRequest,
  listProbabilityStandardQuestionStudioPackages as listRuntimePackages,
  type ProbabilityStandardQuestionStudioRequest,
} from "./question-studio-runtime";

export { isProbabilityStandardQuestionStudioRequest };
export type { ProbabilityStandardQuestionStudioRequest };

export const PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY =
  "PRB-PUNJAB-PROFILE-EVIDENCE-GATE-P2" as const;

export const PROBABILITY_PUNJAB_PROFILE_GATE = Object.freeze({
  examProfile: "PUNJAB_STATE" as const,
  status: "EVIDENCE_GATED" as const,
  centralOptionCount: 4 as const,
  generationAllowed: false,
  fallbackAllowed: false,
  requiredEvidence: Object.freeze([
    "Punjab exam-family Probability question observations with identifiable exam/paper provenance",
    "CP/solve-mode coverage sufficient to justify an allowed-content contract",
    "difficulty and representation evidence sufficient to avoid copying SSC rules by assumption",
  ]),
  authority: PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY,
});

export class ProbabilityPunjabProfileEvidenceError extends Error {
  readonly statusCode = 409;
  readonly code = "PRB_PUNJAB_PROFILE_EVIDENCE_REQUIRED";
  readonly examProfile = "PUNJAB_STATE" as const;
  readonly authority = PROBABILITY_PUNJAB_PROFILE_GATE_AUTHORITY;

  constructor() {
    super(
      "PUNJAB_STATE Probability generation is evidence-gated. No Punjab-specific Probability CP/solve-mode contract is approved, and SSC/generic fallback is forbidden.",
    );
    this.name = "ProbabilityPunjabProfileEvidenceError";
  }
}

function selectedExamMode(request: ProbabilityStandardQuestionStudioRequest) {
  return String((request as any).runtimeMode ?? "").trim().toUpperCase();
}

function requestedExamProfile(request: ProbabilityStandardQuestionStudioRequest) {
  return String((request as any).examProfile ?? selectedExamMode(request))
    .trim()
    .toUpperCase();
}

function assertPunjabProfileEvidenceGate(
  request: ProbabilityStandardQuestionStudioRequest,
) {
  if (requestedExamProfile(request) === "PUNJAB_STATE") {
    throw new ProbabilityPunjabProfileEvidenceError();
  }
}

function isExamProfile(value: string) {
  return value === "PUNJAB_STATE"
    || value === "SSC_CGL_CHSL"
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
    evidenceGatedExamProfiles: ["PUNJAB_STATE"],
    punjabProfileGate: PROBABILITY_PUNJAB_PROFILE_GATE,
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
  assertPunjabProfileEvidenceGate(request);
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
