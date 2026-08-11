import {
  listPrb001QuestionEntries,
} from "./PRB-001";
import {
  listPrb002QuestionEntries,
} from "./PRB-002";
import type { ProbabilityNativeLanguage } from "./multilingual-foundation";
import {
  PROBABILITY_NATIVE_PREVIEW_STATUS,
  runProbabilityNativePreview,
} from "./multilingual-runtime";
import type {
  ProbabilityCanonicalProblemId,
  ProbabilityDifficulty,
  ProbabilityPackageId,
} from "./shared/types";

export const PROBABILITY_NATIVE_REVIEW_LANGUAGES = ["hi", "pa"] as const;
export const PROBABILITY_NATIVE_REVIEW_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const PROBABILITY_NATIVE_REVIEW_PACKAGES = ["PRB-001", "PRB-002"] as const;
export const PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE = "PRB-ML06-NATIVE-REVIEW-v1" as const;
export const PROBABILITY_NATIVE_REVIEW_AUTHORITY = "PRB-ML05-PARITY-REVIEW-SURFACE-v1" as const;

export type ProbabilityNativeReviewLanguage = (typeof PROBABILITY_NATIVE_REVIEW_LANGUAGES)[number];
export type ProbabilityNativeReviewDifficulty = (typeof PROBABILITY_NATIVE_REVIEW_DIFFICULTIES)[number];

export type ProbabilityNativeReviewRequest = Readonly<{
  language?: ProbabilityNativeReviewLanguage;
  packageId?: ProbabilityPackageId;
  qlId?: string;
  difficulty?: ProbabilityNativeReviewDifficulty;
  seed?: string;
  count?: number;
}>;

type CatalogEntry = Readonly<{
  packageId: ProbabilityPackageId;
  cpId: ProbabilityCanonicalProblemId;
  qlId: string;
  difficulty: ProbabilityDifficulty;
}>;

const REVIEW_CATALOG: readonly CatalogEntry[] = Object.freeze([
  ...listPrb001QuestionEntries().map((entry) => ({
    packageId: "PRB-001" as const,
    cpId: entry.cpId,
    qlId: entry.qlId,
    difficulty: entry.difficulty,
  })),
  ...listPrb002QuestionEntries().map((entry) => ({
    packageId: "PRB-002" as const,
    cpId: entry.cpId,
    qlId: entry.qlId,
    difficulty: entry.difficulty,
  })),
]);

export const PROBABILITY_NATIVE_REVIEW_PACKAGE = Object.freeze({
  id: "PRB-ML06-NATIVE-REVIEW",
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Probability",
  chapterId: "Probability",
  name: "Probability — Hindi/Punjabi parity review",
  label: "Probability · 216 QLs · Hindi/Punjabi review",
  generationDomain: "quant-v4",
  qlIds: REVIEW_CATALOG.map((entry) => entry.qlId),
  packageIds: [...PROBABILITY_NATIVE_REVIEW_PACKAGES],
  supportedDifficulties: [...PROBABILITY_NATIVE_REVIEW_DIFFICULTIES],
  supportedLanguages: [...PROBABILITY_NATIVE_REVIEW_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
  reviewStatus: PROBABILITY_NATIVE_PREVIEW_STATUS,
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
  integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
  permanentQlCount: REVIEW_CATALOG.length,
  nativeReviewSurfaceCount: REVIEW_CATALOG.length * PROBABILITY_NATIVE_REVIEW_LANGUAGES.length,
  bulkSyncSupported: false,
  releaseFreezeStatus: "PENDING_HUMAN_REVIEW",
} as const);

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableOrder(entries: readonly CatalogEntry[], seed: string) {
  return [...entries]
    .map((entry) => ({ entry, score: hashSeed(`${seed}:${entry.packageId}:${entry.qlId}`) }))
    .sort((left, right) => left.score - right.score || left.entry.qlId.localeCompare(right.entry.qlId))
    .map(({ entry }) => entry);
}

function toReviewPreview(
  preview: ReturnType<typeof runProbabilityNativePreview>,
  catalog: CatalogEntry,
  language: ProbabilityNativeReviewLanguage,
) {
  const source = preview.source;
  const native = preview.presentation;
  if (!source.validation.valid || !native.validation.valid) {
    throw new Error(`${catalog.qlId}/${language}: invalid ML-05 authority cannot enter review.`);
  }
  if (native.options.length !== source.options.length || native.correctIndex !== source.correctIndex) {
    throw new Error(`${catalog.qlId}/${language}: answer-key parity drifted before review.`);
  }
  if (native.options.some((option, index) => option !== source.options[index]) || native.answer !== source.answer) {
    throw new Error(`${catalog.qlId}/${language}: option/answer parity drifted before review.`);
  }

  return Object.freeze({
    archetypeId: source.archetypeId,
    packageId: source.packageId,
    canonicalProblemId: source.canonicalProblemId,
    qlId: source.questionLanguageId,
    questionId: native.localizedQuestionId,
    canonicalItemId: `${source.questionLanguageId}:${source.seed}`,
    questionLanguageId: native.localizedQuestionId,
    explanationId: native.localizedExplanationId,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    difficultyBand: source.difficultyBand,
    useMode: "GENERATED_NATIVE_PARITY_REVIEW",
    sharedPrompt: "",
    stem: native.stem,
    options: [...native.options],
    optionDetails: native.options.map((text, index) => Object.freeze({
      label: String.fromCharCode(65 + index),
      text,
      studentExplanation: "",
      isCorrect: index === native.correctIndex,
      semanticKey: `option-${index}`,
    })),
    correctIndex: native.correctIndex,
    answer: native.answer,
    decodedStatements: [] as string[],
    explanation: Object.freeze({
      explanationId: native.localizedExplanationId,
      whatAsked: native.eventWording,
      steps: [...native.explanation.lines],
      conclusion: native.answer,
      shortcut: "",
      commonTrap: "",
      optionAnalysis: [] as unknown[],
      familyTree: null,
      diagramProof: null,
      visuals: [...native.explanation.visuals],
    }),
    reasoningGraph: null,
    renderer: Object.freeze({
      kind: "text-math",
      renderingContract: "probability-mathjax-v1",
      textFallbackAvailable: true,
    }),
    runtimeMode: PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
    reviewStatus: PROBABILITY_NATIVE_PREVIEW_STATUS,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
    parameters: Object.freeze({
      ...source.parameters,
      sourceQuestionId: source.questionId,
      sourceExplanationId: source.explanation.explanationId,
      sourceSeed: source.seed,
      sourceLanguage: "en" as const,
      targetLanguage: language,
      runtimeMode: PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
      reviewStatus: PROBABILITY_NATIVE_PREVIEW_STATUS,
      integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      ...source.traceability,
      sourceQuestionId: source.questionId,
      sourceExplanationId: source.explanation.explanationId,
      sourceSeed: source.seed,
      parameterFingerprint: source.parameterFingerprint,
      mathematicalFingerprint: source.mathematicalFingerprint,
      parityAuthority: "ML-05",
      reviewAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
      localizationStatus: native.localizationStatus,
      answerKeyAuthority: preview.parity.answerKeyAuthority,
      solverAuthority: preview.parity.solverAuthority,
      mockPolicyAuthority: preview.parity.mockPolicyAuthority,
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
      releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
    }),
    validation: Object.freeze({
      valid: true as const,
      sourceEnglishValid: source.validation.valid,
      nativePresentationValid: native.validation.valid,
      optionByteParity: true as const,
      correctIndexParity: true as const,
      answerParity: true as const,
      parameterFingerprint: source.parameterFingerprint,
      mathematicalFingerprint: source.mathematicalFingerprint,
      sourceLifecycleLocked: true as const,
    }),
  });
}

export function listProbabilityNativeReviewCatalog(): readonly CatalogEntry[] {
  return REVIEW_CATALOG.map((entry) => ({ ...entry }));
}

export function previewProbabilityNativeReview(
  request: ProbabilityNativeReviewRequest = {},
) {
  const language = request.language ?? "hi";
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [
    "PRB-ML06",
    language,
    request.packageId ?? "all-packages",
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
  ].join(":");

  const eligible = REVIEW_CATALOG.filter((entry) =>
    (!request.packageId || entry.packageId === request.packageId)
    && (!request.qlId || entry.qlId === request.qlId)
    && (!request.difficulty || entry.difficulty === request.difficulty)
  );
  if (!eligible.length) throw new Error("No Probability QLs match the requested native-review filters.");

  const ordered = stableOrder(eligible, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const rounds = Math.max(2, Math.ceil(count / ordered.length) + 1);
  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const entry of ordered) {
      const preview = runProbabilityNativePreview(entry.packageId, entry.cpId, language, {
        questionLanguageId: entry.qlId,
        seed: `${seed}:${round}:${entry.packageId}:${entry.qlId}`,
      });
      questions.push(toReviewPreview(preview, entry, language));
      if (questions.length >= count) break;
    }
  }
  if (questions.length !== count) throw new Error(`Unable to produce ${count} Probability native review question(s).`);

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      chapterId: "Probability" as const,
      seed,
      language,
      runtimeMode: PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
      reviewStatus: PROBABILITY_NATIVE_PREVIEW_STATUS,
      integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
    }),
    questions: Object.freeze(questions),
  });
}
