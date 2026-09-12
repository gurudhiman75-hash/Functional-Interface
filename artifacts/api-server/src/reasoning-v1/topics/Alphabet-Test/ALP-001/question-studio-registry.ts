import { ALP_001_CHECKPOINTS, ALP_001_QLS, alp001QlsForCheckpoint } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpCheckpointId, AlpDifficulty, AlpLocale } from "./types";

export type AlpExamProfile = "SSC_CGL_TIER_I" | "PUNJAB_STATE_4_OPTION" | "BANKING_GENERIC_5_OPTION";

export const ALP_001_EXAM_PROFILES = {
  SSC_CGL_TIER_I: {
    optionCount: 4,
    supported: true,
    stemStyle: "CONCISE_COMPETITIVE",
    timePressure: "HIGH",
  },
  PUNJAB_STATE_4_OPTION: {
    optionCount: 4,
    supported: true,
    stemStyle: "DIRECT_STATE_EXAM",
    timePressure: "STANDARD",
  },
  BANKING_GENERIC_5_OPTION: {
    optionCount: 5,
    supported: false,
    stemStyle: "BANKING_PRELIMS",
    timePressure: "HIGH",
  },
} as const;

export interface AlpControlledGenerationRequest {
  readonly seed: number;
  readonly locale: AlpLocale;
  readonly examProfile: AlpExamProfile;
  readonly difficulty?: AlpDifficulty;
  readonly checkpointId?: AlpCheckpointId;
  readonly qlId?: string;
}

function candidateQls(request: AlpControlledGenerationRequest) {
  const scoped = request.qlId
    ? ALP_001_QLS.filter((ql) => ql.qlId === request.qlId)
    : request.checkpointId
      ? alp001QlsForCheckpoint(request.checkpointId)
      : ALP_001_QLS;
  if (!scoped.length) throw new Error("ALP-001 controlled generation has no QL matching the requested scope.");
  return scoped;
}

function generateControlled(request: AlpControlledGenerationRequest) {
  const profile = ALP_001_EXAM_PROFILES[request.examProfile];
  if (!profile.supported) {
    throw new Error(`${request.examProfile} requires ${profile.optionCount} options; ALP-001 remains four-option only until the shared Reasoning exam-profile layer is upgraded.`);
  }

  const qls = candidateQls(request);
  const baseSeed = Math.abs(request.seed);
  const attempts = request.difficulty ? Math.max(qls.length * 8, 64) : 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const ql = qls[(baseSeed + attempt) % qls.length]!;
    const candidateSeed = request.seed + Math.floor(attempt / qls.length);
    const question = generateAlp001Question(ql.qlId, candidateSeed, request.locale);
    if (request.difficulty && question.difficulty !== request.difficulty) continue;
    if (question.options.length !== profile.optionCount) throw new Error(`${request.examProfile} option-count contract failed.`);
    return {
      ...question,
      deliveryProfile: {
        examProfile: request.examProfile,
        optionCount: profile.optionCount,
        stemStyle: profile.stemStyle,
        timePressure: profile.timePressure,
        requestedDifficulty: request.difficulty ?? null,
      },
    };
  }

  throw new Error(`ALP-001 cannot satisfy requested difficulty ${request.difficulty ?? "ANY"} inside the requested QL/checkpoint scope.`);
}

export const ALP_001_QUESTION_STUDIO_REGISTRY = {
  subject: "Reasoning",
  family: "SYMBOLIC_SEQUENCE",
  topicCode: "REAS-ALP",
  chapterId: "ALP-001",
  chapterTitle: "Alphabet Test",
  runtimeVersion: "ALP-001-RUNTIME-V3",
  editorialSchema: "ALP-001-PEDAGOGY-V2",
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  status: "CHAPTER_COMPLETE_REVIEW_CP001_CP010",
  qlCount: ALP_001_QLS.length,
  checkpoints: ALP_001_CHECKPOINTS,
  examProfiles: ALP_001_EXAM_PROFILES,
  listQuestionLogics(checkpointId?: AlpCheckpointId) {
    return checkpointId ? alp001QlsForCheckpoint(checkpointId) : ALP_001_QLS;
  },
  generate(qlId: string, seed: number, locale: AlpLocale) {
    return generateAlp001Question(qlId, seed, locale);
  },
  generateControlled,
} as const;
