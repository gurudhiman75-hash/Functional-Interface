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
import {
  INT_CP004_ENGLISH_FREEZE_V2_ID,
} from "./cp004-english-freeze-authority-v2";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import {
  assertInterestDirectCalculationExplanation,
  retrofitInterestFrozenSourceExplanation,
} from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP004_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID = "INT-CP-004" as const;
export const INT_CP004_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const INT_CP004_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const INT_CP004_QUESTION_STUDIO_RUNTIME_MODE = "INT-CP-004-TRILINGUAL-FROZEN-REVIEW-v2" as const;
export const INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY = "INT-CP-004-EN-v2+HI-PA-v9" as const;

export type IntCp004QuestionStudioLanguage = (typeof INT_CP004_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp004QuestionStudioDifficulty = (typeof INT_CP004_QUESTION_STUDIO_DIFFICULTIES)[number];

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
  name: "INT-001 Interest — CP-004 Trilingual Frozen Review",
  label: "Interest · CP-004 · 19 Frozen QLs · EN/HI/PA",
  generationDomain: "quant-v4",
  qlIds: [...INT_CP004_QL_IDS],
  supportedDifficulties: [...INT_CP004_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...INT_CP004_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: "APPROVED_TRILINGUAL_FROZEN",
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
  englishStatus: "REGISTERED_FROM_APPROVED_ENGLISH_V2_FREEZE",
} as const);

const DECIMAL_TOKEN = /\d+\.\d+/u;

function localeForLanguage(language: IntCp004QuestionStudioLanguage) {
  if (language === "en") return "en-IN" as const;
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

type NormalizedFrozenSource = Readonly<{
  qlId: IntCp004QlId;
  seed: string;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficulty: Cp004Difficulty;
  representation: unknown;
  stemFamilyId: string;
  answerSemantic: string;
  solveContract: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  correctAnswer: string;
  explanationLines: readonly string[];
  commonMistake: string;
  sourceFreezeId: string;
  canonicalEnglishFreezeId: string;
  canonicalSeed: string;
  canonicalQlId: IntCp004QlId;
}>;

function normalizedLocalizedSource(
  qlId: IntCp004QlId,
  seed: string,
  language: "hi" | "pa",
): NormalizedFrozenSource {
  const locale = localeForLanguage(language);
  const source = generateIntCp004MultilingualFrozenQuestionV9({ qlId, seed, locale });
  if (source.options.length !== 4 || source.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${qlId}/${language}: CP004 frozen option ownership failed.`);
  }
  const optionTexts = source.options.map((option) => option.text);
  if (new Set(optionTexts).size !== 4 || source.options[source.correctIndex]?.text !== source.correctAnswer) {
    throw new Error(`${qlId}/${language}: CP004 frozen option display drifted.`);
  }
  if (source.options.some((option) => option.feedback !== "")) throw new Error(`${qlId}/${language}: option feedback leaked.`);
  const learnerText = [source.stem, ...optionTexts, ...source.explanation.steps].join("\n");
  if (DECIMAL_TOKEN.test(learnerText)) throw new Error(`${qlId}/${language}: decimal token leaked into frozen learner content.`);
  if (
    source.enabled || source.lifecycle.enabled || source.lifecycle.questionStudioDiscoverable
    || source.lifecycle.questionBankStatus !== "NOT_STORED"
    || source.lifecycle.testEligibility !== "INELIGIBLE" || source.lifecycle.publiclyPublishable
  ) throw new Error(`${qlId}/${language}: localized frozen lifecycle opened unexpectedly.`);
  return Object.freeze({
    qlId,
    seed: source.seed,
    locale: source.locale,
    difficulty: source.difficulty,
    representation: source.representation,
    stemFamilyId: source.stemFamilyId,
    answerSemantic: source.answerSemantic,
    solveContract: source.solveContract,
    stem: source.stem,
    options: Object.freeze(optionTexts),
    correctIndex: source.correctIndex,
    correctAnswer: source.correctAnswer,
    explanationLines: Object.freeze([...source.explanation.steps]),
    commonMistake: source.explanation.commonMistake,
    sourceFreezeId: source.multilingualFreeze.freezeId,
    canonicalEnglishFreezeId: source.multilingualFreeze.canonicalEnglishFreezeId,
    canonicalSeed: source.localization.canonicalSeed,
    canonicalQlId: source.localization.canonicalQlId,
  });
}

function normalizedEnglishSource(qlId: IntCp004QlId, seed: string): NormalizedFrozenSource {
  const frozen = generateIntCp004EnglishFrozenV2Question(qlId, seed);
  if (!frozen.permanentIdentityFrozen || !frozen.learnerContentFrozen || frozen.enabled || frozen.questionStudioDiscoverable) {
    throw new Error(`${qlId}/en: approved English freeze boundary changed.`);
  }
  const direct = retrofitInterestFrozenSourceExplanation(frozen, qlId, "en");
  const lines = Object.freeze([...(direct.explanation.steps ?? [])].map(String));
  assertInterestDirectCalculationExplanation(qlId, "en", lines);
  const options = Object.freeze(frozen.options.map((option) => option.text));
  if (options.length !== 4 || new Set(options).size !== 4 || options[frozen.correctIndex] !== frozen.correctAnswer) {
    throw new Error(`${qlId}/en: approved English frozen options drifted.`);
  }
  return Object.freeze({
    qlId,
    seed: frozen.seed,
    locale: "en-IN",
    difficulty: frozen.difficulty,
    representation: frozen.representation,
    stemFamilyId: frozen.stemFamilyId,
    answerSemantic: frozen.answerSemantic,
    solveContract: frozen.solveContract,
    stem: frozen.stem,
    options,
    correctIndex: frozen.correctIndex,
    correctAnswer: frozen.correctAnswer,
    explanationLines: lines,
    commonMistake: "",
    sourceFreezeId: INT_CP004_ENGLISH_FREEZE_V2_ID,
    canonicalEnglishFreezeId: INT_CP004_ENGLISH_FREEZE_V2_ID,
    canonicalSeed: frozen.seed,
    canonicalQlId: qlId,
  });
}

function toReviewPreview(source: NormalizedFrozenSource, language: IntCp004QuestionStudioLanguage) {
  const questionId = [INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID, source.qlId, source.locale, source.seed].join(":");
  const explanationId = `${questionId}:EXPLANATION`;
  return Object.freeze({
    archetypeId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
    qlId: source.qlId,
    permanentQlId: source.qlId,
    questionId,
    canonicalItemId: `${source.qlId}:${source.seed}`,
    questionLanguageId: `${source.qlId}:${language}`,
    explanationId,
    language,
    locale: source.locale,
    difficultyBand: source.difficulty,
    useMode: "GENERATED_TRILINGUAL_FROZEN_QL",
    sharedPrompt: "",
    stem: source.stem,
    options: [...source.options],
    optionDetails: source.options.map((text, index) => Object.freeze({
      label: String.fromCharCode(65 + index), text, studentExplanation: "", isCorrect: index === source.correctIndex, semanticKey: `option-${index + 1}`,
    })),
    correctIndex: source.correctIndex,
    answer: source.correctAnswer,
    decodedStatements: [] as string[],
    explanation: Object.freeze({
      explanationId,
      whatAsked: "",
      steps: [...source.explanationLines],
      conclusion: source.correctAnswer,
      shortcut: "",
      commonTrap: source.commonMistake,
      optionAnalysis: [] as unknown[],
      familyTree: null,
      diagramProof: null,
    }),
    reasoningGraph: null,
    renderer: Object.freeze({ kind: "text-math", renderingContract: "plain-unicode-math-v1", textFallbackAvailable: true }),
    runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "APPROVED_TRILINGUAL_FROZEN" as const,
    questionStudioDiscoverable: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
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
      reviewStatus: "APPROVED_TRILINGUAL_FROZEN",
      integrationAuthority: INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      permanentQlId: source.qlId,
      sourceFreezeId: source.sourceFreezeId,
      canonicalEnglishFreezeId: source.canonicalEnglishFreezeId,
      canonicalSeed: source.canonicalSeed,
      canonicalQlId: source.canonicalQlId,
      representation: source.representation,
      stemFamilyId: source.stemFamilyId,
      permanentIdentityFrozen: true as const,
      learnerContentFrozen: true as const,
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
      completeCalculation: true as const,
      optionFeedbackSuppressed: true as const,
      sourceLifecycleLocked: true as const,
    }),
  });
}

export function previewIntCp004QuestionStudioReview(request: IntCp004QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  const locale = localeForLanguage(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID, language, request.qlId ?? "all-qls", request.difficulty ?? "all-difficulties"].join(":");
  const eligibleQls = INT_CP004_QL_IDS.filter((qlId) => (!request.qlId || qlId === request.qlId) && (!request.difficulty || difficultyForQl(qlId) === request.difficulty));
  if (!eligibleQls.length) throw new Error("No frozen CP-004 QLs match the requested filters.");
  const orderedQls = stableQlOrder(eligibleQls, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const rounds = Math.max(2, Math.ceil(count / orderedQls.length) + 1);

  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const qlId of orderedQls) {
      const itemSeed = `${seed}:${round}:${qlId}`;
      const source = language === "en"
        ? normalizedEnglishSource(qlId, itemSeed)
        : normalizedLocalizedSource(qlId, itemSeed, language);
      questions.push(toReviewPreview(source, language));
      if (questions.length >= count) break;
    }
  }
  if (questions.length !== count) throw new Error(`Unable to produce the requested ${count} frozen CP-004 review question(s).`);

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: INT_CP004_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP004_QUESTION_STUDIO_CHECKPOINT_ID,
      seed,
      language,
      locale,
      runtimeMode: INT_CP004_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_TRILINGUAL_FROZEN" as const,
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