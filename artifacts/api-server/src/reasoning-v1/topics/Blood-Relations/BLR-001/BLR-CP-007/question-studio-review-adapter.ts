import {
  BLR_CP007_ENGLISH_FREEZE_AUTHORITY,
  generateBlrCp007EnglishFrozenBank,
  type GeneratedBlrCp007EnglishFrozenQuestion,
} from "./cp007-english-frozen";
import {
  BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
  generateBlrCp007MultilingualFrozenBank,
  type GeneratedBlrCp007MultilingualFrozenQuestion,
} from "./cp007-multilingual-frozen";

export const BLR_CP007_QUESTION_STUDIO_PACKAGE_ID =
  "REASONING_V1_BLR_001_CP_007" as const;
export const BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE =
  "MULTILINGUAL_FROZEN_REVIEW" as const;
export const BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS =
  "REVIEW_ADAPTER_READY__ACTIVATION_LOCKED" as const;

export const BLR_CP007_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const BLR_CP007_QUESTION_STUDIO_QL_IDS = [
  "BLR-QL-031",
  "BLR-QL-032",
  "BLR-QL-033",
  "BLR-QL-034",
  "BLR-QL-035",
] as const;

export type BlrCp007QuestionStudioLanguage =
  (typeof BLR_CP007_QUESTION_STUDIO_LANGUAGES)[number];
export type BlrCp007QuestionStudioQlId =
  (typeof BLR_CP007_QUESTION_STUDIO_QL_IDS)[number];
export type BlrCp007QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

type FrozenQuestion =
  | GeneratedBlrCp007EnglishFrozenQuestion
  | GeneratedBlrCp007MultilingualFrozenQuestion;

export type BlrCp007QuestionStudioReviewRequest = Readonly<{
  language?: BlrCp007QuestionStudioLanguage;
  qlId?: BlrCp007QuestionStudioQlId;
  difficulty?: BlrCp007QuestionStudioDifficulty;
  canonicalItemId?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

export const BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Blood Relations",
  subtopic: "Coded Blood Relations",
  chapterId: "BLR-001",
  checkpointId: "BLR-CP-007",
  name: "BLR-CP-007 Coded Blood Relations — Multilingual Frozen Review",
  label: "Coded Blood Relations — Multilingual Frozen Review",
  generationDomain: "reasoning-v1",
  qlIds: [...BLR_CP007_QUESTION_STUDIO_QL_IDS],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...BLR_CP007_QUESTION_STUDIO_LANGUAGES],
  enabled: false,
  reviewPreviewAvailable: true,
  runtimeMode: BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE],
  integrationStatus: BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
  corpusAuthority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  persistenceAllowed: false,
  publiclyPublishable: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
} as const);

function bankFor(language: BlrCp007QuestionStudioLanguage): readonly FrozenQuestion[] {
  if (language === "en") return generateBlrCp007EnglishFrozenBank();
  return generateBlrCp007MultilingualFrozenBank(language === "hi" ? "hi-IN" : "pa-IN");
}

function shortLanguage(question: FrozenQuestion): BlrCp007QuestionStudioLanguage {
  if (question.locale === "en-IN") return "en";
  if (question.locale === "hi-IN") return "hi";
  return "pa";
}

function recordAuthority(question: FrozenQuestion) {
  return question.locale === "en-IN"
    ? BLR_CP007_ENGLISH_FREEZE_AUTHORITY
    : BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY;
}

function studioDifficulty(question: FrozenQuestion): BlrCp007QuestionStudioDifficulty {
  const value = String(question.metadata.difficulty).toUpperCase();
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableOrder<T>(items: readonly T[], seed: string): T[] {
  return [...items]
    .map((item, index) => ({ item, score: hashSeed(`${seed}:${index}`) }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
}

function canonicalQuestionLanguageId(question: FrozenQuestion) {
  return `${question.itemId}:${shortLanguage(question)}`;
}

function matchingQuestions(request: BlrCp007QuestionStudioReviewRequest) {
  const language = request.language ?? "en";
  const source = bankFor(language);

  if (request.canonicalItemId || request.questionLanguageId) {
    const forced = source.find((question) =>
      request.canonicalItemId
        ? question.itemId === request.canonicalItemId
        : canonicalQuestionLanguageId(question) === request.questionLanguageId,
    );
    if (!forced) {
      throw new Error(
        `Unknown BLR-CP-007 frozen question selector for language '${language}'.`,
      );
    }
    if (request.qlId && forced.qlId !== request.qlId) {
      throw new Error(`${forced.itemId} belongs to ${forced.qlId}, not ${request.qlId}.`);
    }
    if (request.difficulty && studioDifficulty(forced) !== request.difficulty) {
      throw new Error(
        `${forced.itemId} is ${studioDifficulty(forced)}, not ${request.difficulty}.`,
      );
    }
    return [forced] as const;
  }

  const eligible = source.filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.difficulty || studioDifficulty(question) === request.difficulty),
  );
  if (!eligible.length) {
    throw new Error("No BLR-CP-007 frozen questions match the review filters.");
  }
  return eligible;
}

export function toBlrCp007QuestionStudioReviewPreview(question: FrozenQuestion) {
  const language = shortLanguage(question);
  const explanationId = `${question.itemId}:${language}:EXPLANATION`;
  const questionLanguageId = canonicalQuestionLanguageId(question);
  const validationChecks = [
    {
      name: "frozen-authority",
      passed:
        recordAuthority(question) === BLR_CP007_ENGLISH_FREEZE_AUTHORITY ||
        recordAuthority(question) === BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
      message: "Preview is sourced only from a frozen learner-facing authority.",
    },
    {
      name: "single-reviewed-answer",
      passed:
        question.options.length === 4 &&
        question.correctIndex >= 0 &&
        question.correctIndex < question.options.length &&
        question.options.filter((option) => option.isCorrectAnswerForTask).length === 1 &&
        question.options[question.correctIndex]?.isCorrectAnswerForTask === true,
      message: "Preview retains four options and exactly one reviewed answer.",
    },
    {
      name: "activation-lock",
      passed:
        question.reviewOnly === true &&
        question.publiclyPublishable === false &&
        question.questionStudioVisible === false &&
        question.questionBankEligible === false &&
        question.mockTestEligible === false,
      message: "Question Studio visibility, storage, tests and publication remain locked.",
    },
  ] as const;

  return {
    archetypeId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: "BLR-CP-007",
    qlId: question.qlId,
    questionId: `${question.itemId}:${language}:question-studio-review`,
    canonicalItemId: question.itemId,
    questionLanguageId,
    explanationId,
    language,
    locale: question.locale,
    difficultyBand: studioDifficulty(question),
    useMode: question.delivery.useMode,
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => option.text),
    optionDetails: question.options.map((option, index) => ({
      label: ["A", "B", "C", "D"][index],
      text: option.text,
      studentExplanation: option.studentExplanation,
      isCorrect: option.isCorrectAnswerForTask,
      semanticKey: option.semanticKey,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    decodedStatements: question.decodedStatements,
    explanation: {
      explanationId,
      steps: question.explanation.steps,
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
      optionAnalysis: question.explanation.optionAnalysis,
      familyTree: question.explanation.familyTree,
      diagramProof: question.explanation.diagramProof,
    },
    reasoningGraph: question.graph,
    renderer: {
      kind: "RELATION_GRAPH",
      familyTreeAvailable: true,
      diagramProofAvailable: true,
      textFallbackAvailable: true,
    },
    parameters: {
      chapterId: "BLR-001",
      checkpointId: "BLR-CP-007",
      qlId: question.qlId,
      seed: String(question.seed),
      runtimeMode: BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "MULTILINGUAL_FROZEN",
      recordAuthority: recordAuthority(question),
      corpusAuthority: BLR_CP007_MULTILINGUAL_FREEZE_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    traceability: {
      itemId: question.itemId,
      sourcePrototypeId: question.sourcePrototypeId,
      semanticScenarioId: question.semanticScenarioId,
      semanticFingerprint: question.metadata.semanticFingerprint,
      v4EditorialFingerprint: question.metadata.v4EditorialFingerprint,
      targetRelation: question.reviewProof.targetRelation,
      targetPath: question.reviewProof.targetPath,
      recordAuthority: recordAuthority(question),
    },
    safety: {
      integrationStatus: BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
      reviewOnly: true,
      questionStudioVisible: false,
      persistenceAllowed: false,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
    validation: {
      valid: validationChecks.every((check) => check.passed),
      checks: validationChecks,
    },
  } as const;
}

export function listBlrCp007QuestionStudioReviewEntries() {
  return BLR_CP007_QUESTION_STUDIO_LANGUAGES.flatMap((language) =>
    bankFor(language).map(toBlrCp007QuestionStudioReviewPreview),
  );
}

export function previewBlrCp007QuestionStudioReview(
  request: BlrCp007QuestionStudioReviewRequest = {},
) {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const language = request.language ?? "en";
  const eligible = matchingQuestions({ ...request, language });
  const seed = request.seed ?? [
    BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
    request.canonicalItemId ?? request.questionLanguageId ?? "mixed",
  ].join(":");
  const ordered = stableOrder(eligible, seed);
  const selected = Array.from({ length: count }, (_, index) =>
    ordered[index % ordered.length]!,
  );

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
      seed,
      runtimeMode: BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      integrationStatus: BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
      reviewStatus: "MULTILINGUAL_FROZEN",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    questions: selected.map(toBlrCp007QuestionStudioReviewPreview),
  } as const;
}

export function assertBlrCp007QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "BLR-CP-007 Question Studio integration is review-only; persistence and activation require a separate explicit approval gate.",
  );
}
