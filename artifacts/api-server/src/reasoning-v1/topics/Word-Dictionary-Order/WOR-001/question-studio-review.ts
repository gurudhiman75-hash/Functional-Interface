import type {
  WorCheckpointId,
  WorDifficulty,
  WorLocale,
  WorPrototypeContract,
} from "./foundation/types";
import {
  WOR_001_ALL_CHECKPOINTS,
  WOR_001_ALL_PROTOTYPES,
} from "./prototype-registry";
import {
  WOR_001_QUESTION_STUDIO_ADAPTER,
  type WorQuestionStudioGeneratedQuestion,
} from "./question-studio-adapter";

export const WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "WOR-001-QUESTION-STUDIO-REVIEW-V1" as const;
export const WOR_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const WOR_001_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const WOR_001_QUESTION_STUDIO_REVIEW_STATUS = "EDITORIAL_REMEDIATED_REVIEW_ONLY" as const;

export type WorQuestionStudioLanguage = typeof WOR_001_QUESTION_STUDIO_LANGUAGES[number];
export type WorQuestionStudioDifficulty = typeof WOR_001_QUESTION_STUDIO_DIFFICULTIES[number];

const LOCALE_BY_LANGUAGE: Record<WorQuestionStudioLanguage, WorLocale> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

const RUNTIME_DIFFICULTY: Record<WorQuestionStudioDifficulty, WorDifficulty> = {
  Easy: "EASY",
  Medium: "MEDIUM",
  Hard: "HARD",
};

const STUDIO_DIFFICULTY: Record<WorDifficulty, WorQuestionStudioDifficulty> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

function supportedRuntimeDifficulties(contract: WorPrototypeContract): readonly WorDifficulty[] {
  if (contract.hardOnly) return ["HARD"];
  return contract.supportedDifficulties ?? ["EASY", "MEDIUM", "HARD"];
}

function studioDifficulties(contract: WorPrototypeContract): readonly WorQuestionStudioDifficulty[] {
  return supportedRuntimeDifficulties(contract).map((difficulty) => STUDIO_DIFFICULTY[difficulty]);
}

export const WOR_001_QUESTION_STUDIO_CATALOG = WOR_001_ALL_PROTOTYPES.map((prototype) => Object.freeze({
  prototypeId: prototype.prototypeId,
  checkpointId: prototype.checkpointId,
  title: prototype.title,
  taskKind: prototype.taskKind,
  answerType: prototype.answerType,
  optionCount: prototype.optionCount ?? 4,
  supportedDifficulties: studioDifficulties(prototype),
  allocationDecision: prototype.allocationDecision,
  sourceEvidenceStatus: prototype.sourceEvidenceStatus,
}));

export const WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: "WOR-001" as const,
  chapterId: "WOR-001" as const,
  label: "Word & Dictionary Order",
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Word & Dictionary Order",
  checkpointCount: WOR_001_ALL_CHECKPOINTS.length,
  prototypeCount: WOR_001_ALL_PROTOTYPES.length,
  permanentQlCount: 0 as const,
  recommendedPermanentQlRootCount: 8 as const,
  checkpoints: WOR_001_ALL_CHECKPOINTS,
  prototypes: WOR_001_QUESTION_STUDIO_CATALOG,
  supportedLanguages: WOR_001_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: WOR_001_QUESTION_STUDIO_DIFFICULTIES,
  runtimeMode: "WOR-001-RUNTIME-V2-COMPOSITE",
  reviewStatus: WOR_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
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
  nativeHumanSignoffRequired: true as const,
  permanentQlAllocationRequired: true as const,
});

function stableSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 1;
}

function promptLabels(locale: WorLocale) {
  if (locale === "hi-IN") return { words: "शब्द", insertion: "जोड़ा जाने वाला शब्द", order: "दिया गया क्रम" };
  if (locale === "pa-IN") return { words: "ਸ਼ਬਦ", insertion: "ਜੋੜਿਆ ਜਾਣ ਵਾਲਾ ਸ਼ਬਦ", order: "ਦਿੱਤਾ ਕ੍ਰਮ" };
  return { words: "Words", insertion: "Word to insert", order: "Given order" };
}

function promptLines(question: WorQuestionStudioGeneratedQuestion): string[] {
  const labels = promptLabels(question.locale);
  if (question.structuredPrompt.partialSequence) {
    return [`${labels.order}: ${question.structuredPrompt.partialSequence.join(" → ")}`];
  }
  if (question.structuredPrompt.presentedSequence) {
    return [`${labels.order}: ${question.structuredPrompt.presentedSequence.join(" → ")}`];
  }
  const lines = [`${labels.words}: ${question.structuredPrompt.words.join(", ")}`];
  if (question.structuredPrompt.insertionWord) {
    lines.push(`${labels.insertion}: ${question.structuredPrompt.insertionWord}`);
  }
  return lines;
}

function displayStem(question: WorQuestionStudioGeneratedQuestion): string {
  return [question.stem, ...promptLines(question)].join("\n");
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export interface WorQuestionStudioReviewQuestion {
  readonly packageId: "WOR-001";
  readonly chapterId: "WOR-001";
  readonly checkpointId: WorCheckpointId;
  readonly prototypeId: string;
  readonly patternId: string;
  readonly permanentQlId: null;
  readonly qlId: null;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly language: WorQuestionStudioLanguage;
  readonly locale: WorLocale;
  readonly difficultyBand: WorQuestionStudioDifficulty;
  readonly taskKind: string;
  readonly instruction: string;
  readonly displayStem: string;
  readonly structuredPrompt: WorQuestionStudioGeneratedQuestion["structuredPrompt"];
  readonly options: readonly string[];
  readonly optionDetails: readonly {
    label: string;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly renderer: "STRUCTURED_TEXT";
  readonly seed: number;
  readonly questionStudioVisible: true;
  readonly lifecycleStatus: "REVIEW_ONLY";
  readonly integrationAuthority: typeof WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewStatus: typeof WOR_001_QUESTION_STUDIO_REVIEW_STATUS;
  readonly validation: {
    readonly valid: boolean;
    readonly independentSolverVerified: true;
    readonly lexicallyUnique: true;
    readonly optionsDistinct: boolean;
    readonly exactlyOneCorrect: boolean;
  };
  readonly source: {
    readonly evidenceStatus: string;
    readonly allocationDecision: string;
    readonly objectMode: string;
    readonly familyId: string;
  };
}

function reviewQuestion(
  question: WorQuestionStudioGeneratedQuestion,
  language: WorQuestionStudioLanguage,
): WorQuestionStudioReviewQuestion {
  const values = question.options.map((option) => option.value);
  const questionId = `WOR-001:${question.prototypeId}:${question.seed}:${language}`;
  const optionsDistinct = new Set(values).size === values.length;
  const exactlyOneCorrect = question.options.filter((option) => option.misconceptionId === null).length === 1
    && question.options[question.correctIndex]?.value === question.answer;
  return {
    packageId: "WOR-001",
    chapterId: "WOR-001",
    checkpointId: question.checkpointId,
    prototypeId: question.prototypeId,
    patternId: question.prototypeId,
    permanentQlId: null,
    qlId: null,
    questionId,
    canonicalItemId: `${question.checkpointId}:${question.prototypeId}`,
    questionLanguageId: questionId,
    language,
    locale: question.locale,
    difficultyBand: STUDIO_DIFFICULTY[question.difficulty],
    taskKind: question.taskKind,
    instruction: question.stem,
    displayStem: displayStem(question),
    structuredPrompt: question.structuredPrompt,
    options: values,
    optionDetails: question.options.map((option, index) => ({
      label: optionLabel(index),
      text: option.value,
      isCorrect: index === question.correctIndex,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    renderer: question.renderer,
    seed: question.seed,
    questionStudioVisible: true,
    lifecycleStatus: "REVIEW_ONLY",
    integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: WOR_001_QUESTION_STUDIO_REVIEW_STATUS,
    validation: {
      valid: question.metadata.independentSolverVerified
        && question.metadata.ambiguityAudit === "LEXICALLY_UNIQUE"
        && optionsDistinct
        && exactlyOneCorrect,
      independentSolverVerified: true,
      lexicallyUnique: true,
      optionsDistinct,
      exactlyOneCorrect,
    },
    source: {
      evidenceStatus: question.metadata.sourceEvidenceStatus,
      allocationDecision: question.metadata.allocationDecision,
      objectMode: question.metadata.objectMode ?? "REAL_WORD",
      familyId: question.metadata.sourceFamilyId,
    },
  };
}

export interface PreviewWor001QuestionStudioInput {
  readonly language?: WorQuestionStudioLanguage;
  readonly checkpointId?: WorCheckpointId;
  readonly prototypeId?: string;
  readonly difficulty?: WorQuestionStudioDifficulty;
  readonly seed?: string;
  readonly count?: number;
}

export function previewWor001QuestionStudioReview(
  input: PreviewWor001QuestionStudioInput = {},
): {
  readonly questions: readonly WorQuestionStudioReviewQuestion[];
  readonly integrationAuthority: typeof WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewOnly: true;
} {
  const language = input.language ?? "en";
  if (!WOR_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported WOR-001 language '${language}'.`);
  }
  if (input.checkpointId && !WOR_001_ALL_CHECKPOINTS.some((entry) => entry.checkpointId === input.checkpointId)) {
    throw new Error(`Unsupported WOR-001 checkpoint '${input.checkpointId}'.`);
  }
  const requestedDifficulty = input.difficulty ? RUNTIME_DIFFICULTY[input.difficulty] : undefined;
  let candidates = WOR_001_ALL_PROTOTYPES.filter((prototype) => !input.checkpointId || prototype.checkpointId === input.checkpointId);
  if (input.prototypeId) {
    candidates = candidates.filter((prototype) => prototype.prototypeId === input.prototypeId);
    if (candidates.length === 0) throw new Error(`Unsupported WOR-001 prototype '${input.prototypeId}'.`);
  }
  if (requestedDifficulty) {
    if (input.prototypeId && !supportedRuntimeDifficulties(candidates[0]!).includes(requestedDifficulty)) {
      throw new Error(`${input.prototypeId} does not support ${input.difficulty} difficulty.`);
    }
    candidates = candidates.filter((prototype) => supportedRuntimeDifficulties(prototype).includes(requestedDifficulty));
  }
  if (candidates.length === 0) throw new Error("No WOR-001 prototypes match the requested review filters.");

  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seedText = input.seed?.trim() || "wor-001-question-studio-review";
  const locale = LOCALE_BY_LANGUAGE[language];
  const questions = Array.from({ length: count }, (_, index) => {
    const prototype = candidates[index % candidates.length]!;
    const seed = stableSeed(`${seedText}:${prototype.prototypeId}:${index}`);
    const generated = WOR_001_QUESTION_STUDIO_ADAPTER.generate(
      prototype.prototypeId,
      seed,
      locale,
      requestedDifficulty,
    );
    return reviewQuestion(generated, language);
  });

  return {
    questions,
    integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true,
  };
}
