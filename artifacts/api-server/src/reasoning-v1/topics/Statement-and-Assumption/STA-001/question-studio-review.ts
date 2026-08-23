import { STA_EXAM_FORMAT_PROVENANCE_V2 } from "./exam-format-provenance-v2.ts";
import type { StaExamProfileIdV2 } from "./exam-format-extension-v2.ts";
import type { StaExamLocale } from "./exam-format-extension.ts";
import { STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST } from "./multilingual-freeze-manifest.ts";
import {
  generateSta001MultilingualFrozenQuestion,
  STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS,
  type Sta001MultilingualFrozenQuestion,
} from "./multilingual-frozen-runtime.ts";
import { STA_PERMANENT_QL_AUTHORITIES } from "./permanent-authorities.ts";
import type { StaCheckpointId, StaDifficulty, StaQlId } from "./types.ts";

export const STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "STA-001-QUESTION-STUDIO-MULTILINGUAL-FROZEN-V1" as const;
export const STA_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const STA_001_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const STA_001_QUESTION_STUDIO_REVIEW_STATUS = "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const;
export const STA_001_QUESTION_STUDIO_RUNTIME_MODE = "STA-001-MULTILINGUAL-FROZEN-V1" as const;
export const STA_001_QUESTION_STUDIO_RELEASE_FREEZE = STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.freezeId;

export type StaQuestionStudioLanguage = typeof STA_001_QUESTION_STUDIO_LANGUAGES[number];
export type StaQuestionStudioDifficulty = typeof STA_001_QUESTION_STUDIO_DIFFICULTIES[number];

const LOCALE_BY_LANGUAGE: Record<StaQuestionStudioLanguage, StaExamLocale> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

const QL_CATALOG = STA_PERMANENT_QL_AUTHORITIES.map((authority) => Object.freeze({
  qlId: authority.qlId,
  checkpointId: authority.checkpointId,
  semanticAuthority: authority.semanticAuthority,
  sourceState: authority.sourceState,
  status: authority.status,
}));

const PROFILE_CATALOG = STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS.map((profileId) => {
  const provenance = STA_EXAM_FORMAT_PROVENANCE_V2[profileId];
  return Object.freeze({
    profileId,
    evidenceClass: provenance.evidenceClass,
    freezeEligible: provenance.freezeEligible,
    directPunjabPyqBacked: provenance.directPunjabPyqBacked,
    officialVerbatim: provenance.officialVerbatim,
  });
});

export const STA_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: "STA-001" as const,
  chapterId: "REAS-STA" as const,
  label: "Statement & Assumption",
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Statement & Assumption",
  checkpointCount: 2 as const,
  checkpoints: [
    { checkpointId: "STA-CP-001" as const, title: "Core prerequisite and feasibility assumptions" },
    { checkpointId: "STA-CP-002" as const, title: "Prescriptive, institutional and claim/prediction assumptions" },
  ],
  permanentQlCount: STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.permanentQlCount,
  permanentQlIds: STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.permanentQlIds,
  permanentQlAllocationStatus: "FROZEN_PERMANENT_AUTHORITY" as const,
  qls: QL_CATALOG,
  presentationProfiles: PROFILE_CATALOG,
  supportedLanguages: STA_001_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: STA_001_QUESTION_STUDIO_DIFFICULTIES,
  runtimeMode: STA_001_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
  sourceRuntimeQuestionStudioDiscoverable: false as const,
});

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function displayStem(question: Sta001MultilingualFrozenQuestion): string {
  return [
    question.statement,
    ...question.candidates.map((candidate) => `${candidate.label}. ${candidate.text}`),
  ].join("\n");
}

function checkpointForQl(qlId: StaQlId): StaCheckpointId {
  const authority = STA_PERMANENT_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!authority) throw new Error(`Missing STA permanent authority for ${qlId}.`);
  return authority.checkpointId;
}

export interface StaQuestionStudioReviewQuestion {
  readonly packageId: "STA-001";
  readonly chapterId: "REAS-STA";
  readonly checkpointId: StaCheckpointId;
  readonly permanentQlId: StaQlId;
  readonly qlId: StaQlId;
  readonly presentationProfile: StaExamProfileIdV2;
  readonly patternId: StaExamProfileIdV2;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly language: StaQuestionStudioLanguage;
  readonly locale: StaExamLocale;
  readonly difficultyBand: StaDifficulty;
  readonly sourceProfile: string;
  readonly candidateCount: number;
  readonly optionCount: number;
  readonly queryPolarity: string;
  readonly instruction: string;
  readonly displayStem: string;
  readonly statement: string;
  readonly candidates: Sta001MultilingualFrozenQuestion["candidates"];
  readonly options: readonly string[];
  readonly optionDetails: readonly {
    label: string;
    text: string;
    isCorrect: boolean;
    kind: string;
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
    readonly valid: boolean;
    readonly oracleParity: true;
    readonly optionsDistinct: boolean;
    readonly exactlyOneCorrect: boolean;
    readonly multilingualFrozen: true;
  };
  readonly source: {
    readonly freezeId: typeof STA_001_QUESTION_STUDIO_RELEASE_FREEZE;
    readonly evidenceClass: string;
    readonly officialVerbatim: boolean;
    readonly directPunjabPyqBacked: boolean;
  };
}

function toReviewQuestion(
  question: Sta001MultilingualFrozenQuestion,
  language: StaQuestionStudioLanguage,
): StaQuestionStudioReviewQuestion {
  const values = question.options.map((option) => option.display);
  const optionsDistinct = new Set(values).size === values.length;
  const exactlyOneCorrect = question.options.filter((option) => option.isCorrect).length === 1
    && question.options[question.answerIndex]?.isCorrect === true;
  const provenance = STA_EXAM_FORMAT_PROVENANCE_V2[question.presentationProfile];
  const questionLanguageId = `${question.questionId}:${language}`;
  return {
    packageId: "STA-001",
    chapterId: "REAS-STA",
    checkpointId: checkpointForQl(question.qlId),
    permanentQlId: question.qlId,
    qlId: question.qlId,
    presentationProfile: question.presentationProfile,
    patternId: question.presentationProfile,
    questionId: question.questionId,
    canonicalItemId: `${question.qlId}:${question.presentationProfile}:${question.scenarioId}`,
    questionLanguageId,
    language,
    locale: question.locale,
    difficultyBand: question.difficulty,
    sourceProfile: question.sourceProfile,
    candidateCount: question.candidateCount,
    optionCount: question.optionCount,
    queryPolarity: question.queryPolarity,
    instruction: question.instruction,
    displayStem: displayStem(question),
    statement: question.statement,
    candidates: question.candidates,
    options: values,
    optionDetails: question.options.map((option, index) => ({
      label: optionLabel(index),
      text: option.display,
      isCorrect: index === question.answerIndex,
      kind: option.kind,
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
      valid: question.oracleParity && optionsDistinct && exactlyOneCorrect && question.lifecycle.multilingualChapterFrozen,
      oracleParity: true,
      optionsDistinct,
      exactlyOneCorrect,
      multilingualFrozen: true,
    },
    source: {
      freezeId: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
      evidenceClass: provenance.evidenceClass,
      officialVerbatim: provenance.officialVerbatim,
      directPunjabPyqBacked: provenance.directPunjabPyqBacked,
    },
  };
}

export interface PreviewSta001QuestionStudioInput {
  readonly language?: StaQuestionStudioLanguage;
  readonly qlId?: StaQlId;
  readonly checkpointId?: StaCheckpointId;
  readonly profileId?: StaExamProfileIdV2;
  readonly difficulty?: StaQuestionStudioDifficulty;
  readonly seed?: string;
  readonly count?: number;
}

function orderedProfiles(seed: string, requested?: StaExamProfileIdV2): readonly StaExamProfileIdV2[] {
  if (requested) {
    if (!STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS.includes(requested)) throw new Error(`Unsupported STA presentation profile '${requested}'.`);
    return [requested];
  }
  return [...STA_001_MULTILINGUAL_FROZEN_PROFILE_IDS].sort((left, right) => {
    const leftRank = stableHash(`${seed}:profile:${left}`);
    const rightRank = stableHash(`${seed}:profile:${right}`);
    return leftRank - rightRank || left.localeCompare(right);
  });
}

function findQuestion(
  baseSeed: string,
  locale: StaExamLocale,
  profiles: readonly StaExamProfileIdV2[],
  qlId?: StaQlId,
  checkpointId?: StaCheckpointId,
  difficulty?: StaQuestionStudioDifficulty,
): Sta001MultilingualFrozenQuestion {
  const maxSearch = 20_000;
  for (let probe = 0; probe < maxSearch; probe += 1) {
    const profileId = profiles[probe % profiles.length]!;
    const seed = `${baseSeed}:probe:${probe}`;
    const question = generateSta001MultilingualFrozenQuestion(seed, locale, profileId);
    if (qlId && question.qlId !== qlId) continue;
    if (checkpointId && checkpointForQl(question.qlId) !== checkpointId) continue;
    if (difficulty && question.difficulty !== difficulty) continue;
    return question;
  }
  throw new Error(`No frozen STA question matched the requested filters after ${maxSearch} deterministic probes.`);
}

export function previewSta001QuestionStudioReview(
  input: PreviewSta001QuestionStudioInput = {},
): {
  readonly questions: readonly StaQuestionStudioReviewQuestion[];
  readonly integrationAuthority: typeof STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewOnly: true;
} {
  const language = input.language ?? "en";
  if (!STA_001_QUESTION_STUDIO_LANGUAGES.includes(language)) throw new Error(`Unsupported STA-001 language '${language}'.`);
  if (input.qlId && !STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.permanentQlIds.includes(input.qlId)) throw new Error(`Unsupported STA QL '${input.qlId}'.`);
  if (input.checkpointId && !STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpoints.some((entry) => entry.checkpointId === input.checkpointId)) {
    throw new Error(`Unsupported STA checkpoint '${input.checkpointId}'.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seedText = input.seed?.trim() || "sta-001-question-studio-review";
  const locale = LOCALE_BY_LANGUAGE[language];
  const profiles = orderedProfiles(seedText, input.profileId);
  const questions = Array.from({ length: count }, (_, index) => {
    const source = findQuestion(
      `${seedText}:item:${index}`,
      locale,
      profiles,
      input.qlId,
      input.checkpointId,
      input.difficulty,
    );
    return toReviewQuestion(source, language);
  });
  return {
    questions,
    integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true,
  };
}

export function assertSta001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "STA-001 persistence is enabled only through the authenticated shared Question Studio review-run route so RBAC, audit events and release locks are preserved.",
  );
}
