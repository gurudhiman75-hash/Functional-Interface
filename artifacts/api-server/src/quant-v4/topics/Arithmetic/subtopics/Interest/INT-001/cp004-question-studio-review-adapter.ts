import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  type Cp004Difficulty,
  type IntCp004QlId,
} from "./cp004-frequency-math";
import {
  INT_CP004_MULTILINGUAL_FREEZE_V9,
  generateIntCp004MultilingualFrozenQuestionV9,
} from "./cp004-multilingual-freeze-v9";

export const INT_CP004_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID = "INT-CP-004" as const;
export const INT_CP004_QUESTION_STUDIO_LANGUAGES = ["hi", "pa"] as const;
export const INT_CP004_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const INT_CP004_QUESTION_STUDIO_RUNTIME_MODE =
  "INT-CP-004-MULTILINGUAL-FROZEN-REVIEW-v1" as const;
export const INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY =
  INT_CP004_MULTILINGUAL_FREEZE_V9.freezeId;

export type IntCp004QuestionStudioLanguage =
  (typeof INT_CP004_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp004QuestionStudioDifficulty =
  (typeof INT_CP004_QUESTION_STUDIO_DIFFICULTIES)[number];

export type IntCp004QuestionStudioReviewRequest = Readonly<{
  language?: IntCp004QuestionStudioLanguage;
  qlId?: IntCp004QlId;
  difficulty?: IntCp004QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

export const INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
  packageId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Interest",
  chapterId: "INT-001",
  checkpointId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
  name: "INT-001 Interest — CP-004 Multilingual Frozen Review",
  label: "Interest · CP-004 · 19 Frozen QLs",
  generationDomain: "quant-v4",
  qlIds: [...INT_CP004_QL_IDS],
  supportedDifficulties: [...INT_CP004_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...INT_CP004_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
  mockTestEligible: false,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  questionBankEligible: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  integrationAuthority: INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  frozenQlCount: INT_CP004_QL_IDS.length,
  approvedReviewPayloadCount: INT_CP004_MULTILINGUAL_FREEZE_V9.reviewQuestionCount,
  bulkSyncSupported: false,
  englishStatus: "NOT_REGISTERED_FROM_HISTORICAL_FREEZE",
} as const);

const DECIMAL_TOKEN = /\d+\.\d+/u;

function localeForLanguage(language: IntCp004QuestionStudioLanguage) {
  return language === "hi" ? "hi-IN" as const : "pa-IN" as const;
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableQlOrder(qlIds: readonly IntCp004QlId[], seed: string) {
  return [...qlIds]
    .map((qlId) => ({ qlId, score: hashSeed(`${seed}:${qlId}`) }))
    .sort((left, right) => left.score - right.score || left.qlId.localeCompare(right.qlId))
    .map(({ qlId }) => qlId);
}

function difficultyForQl(qlId: IntCp004QlId): Cp004Difficulty {
  const entry = INT_CP004_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: missing CP-004 registry metadata.`);
  return entry.difficulty;
}

function assertFrozenReviewQuestion(
  question: ReturnType<typeof generateIntCp004MultilingualFrozenQuestionV9>,
) {
  if (question.options.length !== 4) {
    throw new Error(`${question.qlId}: expected exactly four frozen options.`);
  }
  const optionTexts = question.options.map((option) => option.text);
  if (new Set(optionTexts).size !== optionTexts.length) {
    throw new Error(`${question.qlId}: duplicate learner options detected.`);
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${question.qlId}: expected exactly one correct option.`);
  }
  if (question.options.some((option) => option.feedback !== "")) {
    throw new Error(`${question.qlId}: learner-facing option feedback is not suppressed.`);
  }
  if (question.options[question.correctIndex]?.text !== question.correctAnswer) {
    throw new Error(`${question.qlId}: correct-answer ownership changed.`);
  }
  const formulaPrefix = question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  if (!(question.explanation.steps[0] ?? "").startsWith(formulaPrefix)) {
    throw new Error(`${question.qlId}: frozen explanation no longer starts with the formula.`);
  }
  if (!question.explanation.steps.slice(1).some((step) => /[=×÷+−^/]/u.test(step))) {
    throw new Error(`${question.qlId}: frozen explanation lacks explicit calculation.`);
  }
  const learnerText = [
    question.stem,
    ...optionTexts,
    question.correctAnswer,
    question.explanation.whatAsked,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
  ].join("\n");
  if (DECIMAL_TOKEN.test(learnerText)) {
    throw new Error(`${question.qlId}: decimal token leaked into the frozen learner surface.`);
  }
  if (
    question.enabled
    || question.lifecycle.enabled
    || question.lifecycle.questionStudioDiscoverable
    || question.lifecycle.questionBankStatus !== "NOT_STORED"
    || question.lifecycle.testEligibility !== "INELIGIBLE"
    || question.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${question.qlId}: source freeze lifecycle changed unexpectedly.`);
  }
  if (question.multilingualFreeze.freezeId !== INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY) {
    throw new Error(`${question.qlId}: multilingual freeze authority changed.`);
  }
}

function toReviewPreview(
  source: ReturnType<typeof generateIntCp004MultilingualFrozenQuestionV9>,
  language: IntCp004QuestionStudioLanguage,
) {
  assertFrozenReviewQuestion(source);
  const questionId = [
    INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
    source.qlId,
    source.locale,
    source.seed,
  ].join(":");
  const explanationId = `${questionId}:EXPLANATION`;

  return Object.freeze({
    archetypeId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
    qlId: source.qlId,
    questionId,
    canonicalItemId: `${source.qlId}:${source.seed}`,
    questionLanguageId: questionId,
    explanationId,
    language,
    locale: source.locale,
    difficultyBand: source.difficulty,
    useMode: "GENERATED_MULTILINGUAL_FROZEN_QL",
    sharedPrompt: "",
    stem: source.stem,
    options: source.options.map((option) => option.text),
    optionDetails: source.options.map((option) => Object.freeze({
      label: option.id,
      text: option.text,
      studentExplanation: "",
      isCorrect: option.isCorrect,
      semanticKey: `option-${option.id}`,
    })),
    correctIndex: source.correctIndex,
    answer: source.correctAnswer,
    decodedStatements: [] as string[],
    explanation: Object.freeze({
      explanationId,
      whatAsked: source.explanation.whatAsked,
      steps: [...source.explanation.steps],
      conclusion: source.explanation.finalAnswer,
      shortcut: "",
      commonTrap: source.explanation.commonMistake,
      optionAnalysis: [] as unknown[],
      familyTree: null,
      diagramProof: null,
    }),
    reasoningGraph: null,
    renderer: Object.freeze({
      kind: "text-math",
      renderingContract: "plain-unicode-math-v1",
      textFallbackAvailable: true,
    }),
    runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    parameters: Object.freeze({
      chapterId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
      qlId: source.qlId,
      seed: source.seed,
      representation: source.representation,
      stemFamilyId: source.stemFamilyId,
      answerSemantic: source.answerSemantic,
      solveContract: source.solveContract,
      runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      integrationAuthority: INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      multilingualFreezeId: source.multilingualFreeze.freezeId,
      approvedReviewedHead: source.multilingualFreeze.approvedReviewedHead,
      approvalCommentId: source.multilingualFreeze.approvalCommentId,
      canonicalEnglishFreezeId: source.multilingualFreeze.canonicalEnglishFreezeId,
      canonicalSeed: source.localization.canonicalSeed,
      canonicalQlId: source.localization.canonicalQlId,
      representation: source.representation,
      stemFamilyId: source.stemFamilyId,
    }),
    safety: Object.freeze({
      reviewOnly: true as const,
      questionStudioVisible: true as const,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      questionBankWritable: false as const,
      questionBankEligible: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    validation: Object.freeze({
      valid: true as const,
      frozenAuthority: true as const,
      decimalFree: true as const,
      formulaFirst: true as const,
      completeCalculation: true as const,
      optionFeedbackSuppressed: true as const,
      sourceLifecycleLocked: true as const,
    }),
  });
}

export function previewIntCp004QuestionStudioReview(
  request: IntCp004QuestionStudioReviewRequest = {},
) {
  const language = request.language ?? "hi";
  const locale = localeForLanguage(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [
    INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
  ].join(":");

  const eligibleQls = INT_CP004_QL_IDS.filter((qlId) =>
    (!request.qlId || qlId === request.qlId)
    && (!request.difficulty || difficultyForQl(qlId) === request.difficulty)
  );
  if (!eligibleQls.length) {
    throw new Error("No frozen CP-004 QLs match the requested filters.");
  }

  const orderedQls = stableQlOrder(eligibleQls, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const rounds = Math.max(2, Math.ceil(count / orderedQls.length) + 1);

  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const qlId of orderedQls) {
      const generated = generateIntCp004MultilingualFrozenQuestionV9({
        qlId,
        seed: `${seed}:${round}:${qlId}`,
        locale,
      });
      questions.push(toReviewPreview(generated, language));
      if (questions.length >= count) break;
    }
  }

  if (questions.length !== count) {
    throw new Error(`Unable to produce the requested ${count} frozen CP-004 review question(s).`);
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
      seed,
      language,
      locale,
      runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
      integrationAuthority: INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
    }),
    questions: Object.freeze(questions),
  });
}
