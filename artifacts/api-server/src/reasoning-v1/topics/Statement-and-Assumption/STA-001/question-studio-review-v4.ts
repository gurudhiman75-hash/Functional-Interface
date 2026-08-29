import {
  STA_V4_CHECKPOINT_BY_QL,
  STA_V4_DIFFICULTIES,
  STA_V4_LANGUAGES,
  STA_V4_PRESENTATION_PROFILES,
  STA_V4_PROFILE_IDS,
  STA_V4_QL_IDS,
  STA_V4_SEMANTIC_AUTHORITY,
  assertStaV4QuestionIntegrity,
  generateStaV4Question,
  type StaV4CheckpointId,
  type StaV4Difficulty,
  type StaV4Language,
  type StaV4Locale,
  type StaV4ProfileId,
  type StaV4QlId,
  type StaV4Question,
} from "./exam-realness-v4-runtime.ts";

export const STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "STA-001-QUESTION-STUDIO-EXAM-REALNESS-V4" as const;
export const STA_001_QUESTION_STUDIO_LANGUAGES = STA_V4_LANGUAGES;
export const STA_001_QUESTION_STUDIO_DIFFICULTIES = STA_V4_DIFFICULTIES;
export const STA_001_QUESTION_STUDIO_REVIEW_STATUS = "EXAM_REALNESS_V4_REVIEW_CANDIDATE" as const;
export const STA_001_QUESTION_STUDIO_RUNTIME_MODE = "STA-001-EXAM-REALNESS-V4" as const;
export const STA_001_QUESTION_STUDIO_RELEASE_FREEZE = "STA-001-V4-REVIEW-CANDIDATE" as const;

export type StaQuestionStudioLanguage = StaV4Language;
export type StaQuestionStudioDifficulty = StaV4Difficulty;
export type StaQuestionStudioQlId = StaV4QlId;
export type StaQuestionStudioCheckpointId = StaV4CheckpointId;
export type StaQuestionStudioProfileId = StaV4ProfileId;

const LOCALE_BY_LANGUAGE: Readonly<Record<StaV4Language, StaV4Locale>> = Object.freeze({
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
});

export const STA_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: "STA-001" as const,
  chapterId: "REAS-STA" as const,
  label: "Statement & Assumption",
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Statement & Assumption",
  checkpointCount: 4 as const,
  checkpoints: Object.freeze([
    { checkpointId: "STA-CP-001" as const, title: "Prerequisite, feasibility and prescriptive assumptions" },
    { checkpointId: "STA-CP-002" as const, title: "Institutional direction and causal-claim assumptions" },
    { checkpointId: "STA-CP-003" as const, title: "Advertisement, appeal and audience-response assumptions" },
    { checkpointId: "STA-CP-004" as const, title: "Comparison, measurement and evidence-validity assumptions" },
  ]),
  permanentQlCount: 6 as const,
  permanentQlIds: STA_V4_QL_IDS,
  permanentQlAllocationStatus: "V4_REVIEW_CANDIDATE" as const,
  qls: Object.freeze(STA_V4_QL_IDS.map((qlId) => Object.freeze({
    qlId,
    checkpointId: STA_V4_CHECKPOINT_BY_QL[qlId],
    semanticAuthority: STA_V4_SEMANTIC_AUTHORITY[qlId],
    status: "V4_REVIEW_CANDIDATE" as const,
  }))),
  presentationProfiles: STA_V4_PRESENTATION_PROFILES,
  supportedLanguages: STA_V4_LANGUAGES,
  supportedDifficulties: STA_V4_DIFFICULTIES,
  runtimeMode: STA_001_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  multilingualChapterFrozen: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
  sourceRuntimeQuestionStudioDiscoverable: false as const,
  supersedesRuntimeMode: "STA-001-MULTILINGUAL-FROZEN-V1" as const,
});

function displayStem(question: StaV4Question): string {
  return [
    question.statement,
    ...question.candidates.map((candidate) => `${candidate.label}. ${candidate.text}`),
  ].join("\n");
}

export interface StaQuestionStudioReviewQuestion {
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly checkpointId: StaV4CheckpointId;
  readonly permanentQlId: StaV4QlId;
  readonly qlId: StaV4QlId;
  readonly presentationProfile: StaV4ProfileId;
  readonly patternId: StaV4ProfileId;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly contentFingerprint: string;
  readonly language: StaV4Language;
  readonly locale: StaV4Locale;
  readonly difficultyBand: StaV4Difficulty;
  readonly sourceProfile: string;
  readonly candidateCount: number;
  readonly optionCount: number;
  readonly queryPolarity: string;
  readonly instruction: string;
  readonly displayStem: string;
  readonly statement: string;
  readonly candidates: readonly {
    readonly label: string;
    readonly candidateId: string;
    readonly text: string;
    readonly oracle: {
      readonly classification: "IMPLICIT" | "NOT_IMPLICIT";
      readonly evidenceCode: "REQUIRED_HIDDEN_DEPENDENCY" | "NO_REQUIRED_DEPENDENCY";
    };
    readonly misconception: string;
  }[];
  readonly options: readonly string[];
  readonly optionDetails: readonly {
    readonly label: string;
    readonly text: string;
    readonly isCorrect: boolean;
    readonly kind: "CODED_SEMANTIC_SET";
  }[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly answerSet: readonly number[];
  readonly explanation: string;
  readonly renderer: "STRUCTURED_TEXT";
  readonly seed: string;
  readonly scenarioId: string;
  readonly questionStudioVisible: true;
  readonly lifecycleStatus: "REVIEW_ONLY";
  readonly integrationAuthority: typeof STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewStatus: typeof STA_001_QUESTION_STUDIO_REVIEW_STATUS;
  readonly validation: {
    readonly valid: true;
    readonly oracleParity: true;
    readonly optionsDistinct: boolean;
    readonly exactlyOneCorrect: boolean;
    readonly crossLanguageSemanticParity: true;
    readonly antiCueV4: true;
    readonly multilingualFrozen: false;
  };
  readonly source: {
    readonly freezeId: typeof STA_001_QUESTION_STUDIO_RELEASE_FREEZE;
    readonly evidenceClass: string;
    readonly officialVerbatim: false;
    readonly directPunjabPyqBacked: boolean;
  };
}

function toReviewQuestion(question: StaV4Question): StaQuestionStudioReviewQuestion {
  assertStaV4QuestionIntegrity(question);
  const options = question.options.map((option) => option.display);
  const optionsDistinct = new Set(options).size === options.length;
  const exactlyOneCorrect = question.options.filter((option) => option.isCorrect).length === 1
    && question.options[question.answerIndex]?.isCorrect === true;
  if (!optionsDistinct || !exactlyOneCorrect) throw new Error(`${question.questionId}: invalid V4 option surface`);
  return {
    packageId: "STA-001",
    chapterId: "REAS-STA",
    checkpointId: question.checkpointId,
    permanentQlId: question.qlId,
    qlId: question.qlId,
    presentationProfile: question.presentationProfile,
    patternId: question.presentationProfile,
    questionId: question.questionId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    contentFingerprint: question.contentFingerprint,
    language: question.language,
    locale: question.locale,
    difficultyBand: question.difficulty,
    sourceProfile: question.sourceProfile,
    candidateCount: question.candidateCount,
    optionCount: question.optionCount,
    queryPolarity: question.queryPolarity,
    instruction: question.instruction,
    displayStem: displayStem(question),
    statement: question.statement,
    candidates: question.candidates.map((candidate) => ({
      label: candidate.label,
      candidateId: candidate.candidateId,
      text: candidate.text,
      oracle: {
        classification: candidate.classification,
        evidenceCode: candidate.classification === "IMPLICIT" ? "REQUIRED_HIDDEN_DEPENDENCY" : "NO_REQUIRED_DEPENDENCY",
      },
      misconception: candidate.misconception,
    })),
    options,
    optionDetails: question.options.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: option.display,
      isCorrect: option.isCorrect,
      kind: "CODED_SEMANTIC_SET" as const,
    })),
    correctIndex: question.answerIndex,
    answer: question.options[question.answerIndex]!.display,
    answerSet: question.answerSet,
    explanation: question.explanation,
    renderer: "STRUCTURED_TEXT",
    seed: question.seed,
    scenarioId: question.scenarioId,
    questionStudioVisible: true,
    lifecycleStatus: "REVIEW_ONLY",
    integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
    validation: {
      valid: true,
      oracleParity: true,
      optionsDistinct,
      exactlyOneCorrect,
      crossLanguageSemanticParity: true,
      antiCueV4: true,
      multilingualFrozen: false,
    },
    source: {
      freezeId: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
      evidenceClass: question.evidenceClass,
      officialVerbatim: false,
      directPunjabPyqBacked: question.presentationProfile === "PUNJAB_2X4",
    },
  };
}

export interface PreviewSta001QuestionStudioInput {
  readonly language?: StaV4Language;
  readonly qlId?: StaV4QlId;
  readonly checkpointId?: StaV4CheckpointId;
  readonly profileId?: StaV4ProfileId;
  readonly difficulty?: StaV4Difficulty;
  readonly seed?: string;
  readonly count?: number;
}

function orderedProfiles(seed: string, requested?: StaV4ProfileId): readonly StaV4ProfileId[] {
  if (requested) {
    if (!STA_V4_PROFILE_IDS.includes(requested)) throw new Error(`Unsupported STA V4 presentation profile '${requested}'.`);
    return [requested];
  }
  return [...STA_V4_PROFILE_IDS].sort((left, right) => {
    const score = (value: string) => {
      let hash = 2166136261;
      for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619) >>> 0;
      }
      return hash >>> 0;
    };
    return score(`${seed}:${left}`) - score(`${seed}:${right}`) || left.localeCompare(right);
  });
}

function findQuestion(
  baseSeed: string,
  locale: StaV4Locale,
  profiles: readonly StaV4ProfileId[],
  qlId?: StaV4QlId,
  checkpointId?: StaV4CheckpointId,
  difficulty?: StaV4Difficulty,
): StaV4Question {
  for (let probe = 0; probe < 10_000; probe += 1) {
    const profileId = profiles[probe % profiles.length]!;
    const seed = `${baseSeed}:probe:${probe}`;
    const candidateQl = qlId ?? STA_V4_QL_IDS[probe % STA_V4_QL_IDS.length]!;
    if (checkpointId && STA_V4_CHECKPOINT_BY_QL[candidateQl] !== checkpointId) continue;
    const question = generateStaV4Question({ seed, locale, profileId, qlId: candidateQl });
    if (difficulty && question.difficulty !== difficulty) continue;
    return question;
  }
  throw new Error(`No STA V4 review question matched the requested filters.`);
}

export function previewSta001QuestionStudioReview(
  input: PreviewSta001QuestionStudioInput = {},
): {
  readonly questions: readonly StaQuestionStudioReviewQuestion[];
  readonly integrationAuthority: typeof STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewOnly: true;
} {
  const language = input.language ?? "en";
  if (!STA_V4_LANGUAGES.includes(language)) throw new Error(`Unsupported STA-001 V4 language '${language}'.`);
  if (input.qlId && !STA_V4_QL_IDS.includes(input.qlId)) throw new Error(`Unsupported STA V4 QL '${input.qlId}'.`);
  if (input.checkpointId && !STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpoints.some((entry) => entry.checkpointId === input.checkpointId)) {
    throw new Error(`Unsupported STA V4 checkpoint '${input.checkpointId}'.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "sta-001-v4-review";
  const locale = LOCALE_BY_LANGUAGE[language];
  const profiles = orderedProfiles(seed, input.profileId);
  return {
    questions: Array.from({ length: count }, (_, index) => toReviewQuestion(findQuestion(
      `${seed}:item:${index}`,
      locale,
      profiles,
      input.qlId,
      input.checkpointId,
      input.difficulty,
    ))),
    integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true,
  };
}

export function assertSta001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STA-001 V4 remains review-only; Question Bank/test/mock/public delivery stays locked until a separate V4 approval and freeze.",
  );
}
