import {
  INT_CP007_ENGLISH_FREEZE_APPROVAL,
  INT_CP007_ENGLISH_FREEZE_ID,
  generateIntCp007EnglishFrozenQuestion,
} from "./cp007-scheme-equivalence-english-v8-frozen";
import {
  INT_CP007_LOCALIZED_FREEZE_APPROVAL,
  INT_CP007_LOCALIZED_FREEZE_ID,
  generateIntCp007LocalizedFrozenQuestion,
} from "./cp007-scheme-equivalence-localized-v5-frozen";
import {
  INT_CP007_QL_CONTRACTS,
  INT_CP007_QL_IDS,
  type IntCp007QlId,
} from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID = "INT-CP-007" as const;
export const INT_CP007_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const INT_CP007_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const INT_CP007_QUESTION_STUDIO_RUNTIME_MODE = "INT-CP-007-FROZEN-REVIEW-v1" as const;
export const INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY = "INT-CP-007-QS-REVIEW-v1" as const;

export type IntCp007QuestionStudioLanguage = (typeof INT_CP007_QUESTION_STUDIO_LANGUAGES)[number];
export type IntCp007QuestionStudioDifficulty = (typeof INT_CP007_QUESTION_STUDIO_DIFFICULTIES)[number];

export type IntCp007QuestionStudioReviewRequest = Readonly<{
  language?: IntCp007QuestionStudioLanguage;
  qlId?: IntCp007QlId;
  difficulty?: IntCp007QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

const DIFFICULTY_BY_QL = Object.freeze({
  "INT-QL-109": "Easy",
  "INT-QL-110": "Easy",
  "INT-QL-111": "Medium",
  "INT-QL-112": "Medium",
  "INT-QL-113": "Medium",
  "INT-QL-114": "Hard",
  "INT-QL-115": "Medium",
} as const satisfies Readonly<Record<IntCp007QlId, IntCp007QuestionStudioDifficulty>>);

export const INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
  packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Interest",
  chapterId: "INT-001",
  checkpointId: INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
  name: "INT-001 Interest — CP-007 Frozen Multilingual Review",
  label: "Interest · CP-007 · 7 Frozen QLs",
  generationDomain: "quant-v4",
  qlIds: [...INT_CP007_QL_IDS],
  supportedDifficulties: [...INT_CP007_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...INT_CP007_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: INT_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: "APPROVED_EN_HI_PA_FROZEN",
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
  integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  englishFreezeId: INT_CP007_ENGLISH_FREEZE_ID,
  localizedFreezeId: INT_CP007_LOCALIZED_FREEZE_ID,
  frozenQlCount: INT_CP007_QL_IDS.length,
  bulkSyncSupported: false,
} as const);

function localeForLanguage(language: IntCp007QuestionStudioLanguage) {
  if (language === "en") return "en-IN" as const;
  if (language === "hi") return "hi-IN" as const;
  return "pa-IN" as const;
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableQlOrder(qlIds: readonly IntCp007QlId[], seed: string) {
  return [...qlIds]
    .map((qlId) => ({ qlId, score: hashSeed(`${seed}:${qlId}`) }))
    .sort((left, right) => left.score - right.score || left.qlId.localeCompare(right.qlId))
    .map(({ qlId }) => qlId);
}

function frozenSource(qlId: IntCp007QlId, seed: string, language: IntCp007QuestionStudioLanguage) {
  if (language === "en") return generateIntCp007EnglishFrozenQuestion(qlId, seed, "en-IN") as any;
  return generateIntCp007LocalizedFrozenQuestion(qlId, seed, localeForLanguage(language) as "hi-IN" | "pa-IN") as any;
}

function sourceFreezeId(source: any, language: IntCp007QuestionStudioLanguage): string {
  return language === "en" ? source.freezeId : source.localizedVersion;
}

function sourceApproval(source: any, language: IntCp007QuestionStudioLanguage): string {
  if (language === "en") return source.freezeApproval?.authority ?? "";
  return source.approvalStatus ?? "";
}

function assertFrozenSource(source: any, language: IntCp007QuestionStudioLanguage) {
  const expectedFreeze = language === "en" ? INT_CP007_ENGLISH_FREEZE_ID : INT_CP007_LOCALIZED_FREEZE_ID;
  const expectedApproval = language === "en"
    ? INT_CP007_ENGLISH_FREEZE_APPROVAL.authority
    : INT_CP007_LOCALIZED_FREEZE_APPROVAL;
  if (sourceFreezeId(source, language) !== expectedFreeze) {
    throw new Error(`${source.qlId}: CP007 Question Studio source freeze drifted.`);
  }
  if (sourceApproval(source, language) !== expectedApproval) {
    throw new Error(`${source.qlId}: CP007 Question Studio approval authority drifted.`);
  }
  if (!source.permanentIdentityFrozen || !source.learnerContentFrozen) {
    throw new Error(`${source.qlId}: CP007 source is not fully frozen.`);
  }
  if (
    source.enabled
    || source.stagingStatus !== "NOT_STAGED"
    || source.registrationStatus !== "NOT_REGISTERED"
    || source.questionStudioDiscoverable
    || source.questionBankStatus !== "NOT_STORED"
    || source.testEligibility !== "INELIGIBLE"
    || source.publiclyPublishable
  ) {
    throw new Error(`${source.qlId}: CP007 source lifecycle boundary changed.`);
  }
  if (source.options.length !== 4 || new Set(source.options.map((option: any) => option.text)).size !== 4) {
    throw new Error(`${source.qlId}: CP007 frozen options are invalid.`);
  }
  if (source.options[source.correctIndex]?.text !== source.correctAnswer) {
    throw new Error(`${source.qlId}: CP007 correct answer ownership changed.`);
  }
  const learnerText = [
    source.presentation.markdown,
    ...source.options.map((option: any) => option.text),
    source.explanation.keyIdea,
    ...source.explanation.steps,
    source.explanation.finalAnswer,
    source.explanation.commonMistake,
  ].join("\n");
  if (learnerText.includes("ब्याज हर वर्ष मूलधन में जुड़ता है") || learnerText.includes("ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")) {
    throw new Error(`${source.qlId}: removed compound-interest definition clause returned.`);
  }
  if (language === "pa" && learnerText.includes("ਚੱਕਰਵੱਧੀ")) {
    throw new Error(`${source.qlId}: deprecated Punjabi compound-interest term returned.`);
  }
}

function toReviewPreview(source: any, language: IntCp007QuestionStudioLanguage) {
  assertFrozenSource(source, language);
  const locale = localeForLanguage(language);
  const questionId = [INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID, source.qlId, locale, source.seed].join(":");
  const explanationId = `${questionId}:EXPLANATION`;
  const difficultyBand = DIFFICULTY_BY_QL[source.qlId as IntCp007QlId];
  return Object.freeze({
    archetypeId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
    qlId: source.qlId as IntCp007QlId,
    questionId,
    canonicalItemId: `${source.qlId}:${source.seed}`,
    questionLanguageId: questionId,
    explanationId,
    language,
    locale,
    difficultyBand,
    useMode: "GENERATED_FROZEN_CP007_QL",
    stem: source.presentation.markdown,
    options: source.options.map((option: any) => option.text),
    optionDetails: source.options.map((option: any, index: number) => Object.freeze({
      label: String.fromCharCode(65 + index),
      text: option.text,
      studentExplanation: "",
      isCorrect: index === source.correctIndex,
      semanticKey: `option-${index + 1}`,
    })),
    correctIndex: source.correctIndex,
    answer: source.correctAnswer,
    explanation: Object.freeze({
      explanationId,
      whatAsked: "",
      keyIdea: source.explanation.keyIdea,
      steps: [...source.explanation.steps],
      conclusion: source.explanation.finalAnswer,
      shortcut: "",
      commonTrap: source.explanation.commonMistake,
    }),
    renderer: Object.freeze({
      kind: "text-mathjax",
      renderingContract: "markdown-inline-latex-v1",
      textFallbackAvailable: true,
    }),
    runtimeMode: INT_CP007_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "APPROVED_EN_HI_PA_FROZEN" as const,
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
    integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    sourceFreezeId: sourceFreezeId(source, language),
    sourceApprovalAuthority: sourceApproval(source, language),
    parameters: Object.freeze({
      chapterId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
      qlId: source.qlId,
      seed: source.seed,
      answerSemantic: source.answerSemantic,
      stemFamilyId: source.presentation.stemFamilyId,
      runtimeMode: INT_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_EN_HI_PA_FROZEN",
      integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      sourceFreezeId: sourceFreezeId(source, language),
      sourceApprovalAuthority: sourceApproval(source, language),
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      permanentQlId: source.qlId,
      answerSemantic: source.answerSemantic,
      stemFamilyId: source.presentation.stemFamilyId,
      mathematicalFingerprint: source.mathematicalFingerprint,
      englishFreezeId: INT_CP007_ENGLISH_FREEZE_ID,
      localizedFreezeId: INT_CP007_LOCALIZED_FREEZE_ID,
      activeSourceFreezeId: sourceFreezeId(source, language),
      sourceApprovalAuthority: sourceApproval(source, language),
      qlTitle: INT_CP007_QL_CONTRACTS[source.qlId as IntCp007QlId].title,
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
      learnerPayloadPreserved: true as const,
      latexPreserved: true as const,
      sourceLifecycleLocked: true as const,
      blockedCiDefinitionAbsent: true as const,
      deprecatedPunjabiCiAbsent: true as const,
    }),
  });
}

export function previewIntCp007QuestionStudioReview(request: IntCp007QuestionStudioReviewRequest = {}) {
  const language = request.language ?? "en";
  if (!INT_CP007_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported CP007 Question Studio language '${String(language)}'.`);
  }
  if (request.qlId && !INT_CP007_QL_IDS.includes(request.qlId)) {
    throw new Error(`Unsupported CP007 QL '${String(request.qlId)}'.`);
  }
  if (request.difficulty && !INT_CP007_QUESTION_STUDIO_DIFFICULTIES.includes(request.difficulty)) {
    throw new Error(`Unsupported CP007 difficulty '${String(request.difficulty)}'.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [
    INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
  ].join(":");
  const eligibleQls = INT_CP007_QL_IDS.filter((qlId) =>
    (!request.qlId || qlId === request.qlId)
    && (!request.difficulty || DIFFICULTY_BY_QL[qlId] === request.difficulty)
  );
  if (!eligibleQls.length) throw new Error("No frozen CP007 QLs match the requested filters.");
  const orderedQls = stableQlOrder(eligibleQls, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const rounds = Math.max(2, Math.ceil(count / orderedQls.length) + 1);
  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const qlId of orderedQls) {
      const generated = frozenSource(qlId, `${seed}:${round}:${qlId}`, language);
      questions.push(toReviewPreview(generated, language));
      if (questions.length >= count) break;
    }
  }
  if (questions.length !== count) throw new Error(`Unable to produce ${count} CP007 frozen review question(s).`);
  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: INT_CP007_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: INT_CP007_QUESTION_STUDIO_CHECKPOINT_ID,
      seed,
      language,
      locale: localeForLanguage(language),
      runtimeMode: INT_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "APPROVED_EN_HI_PA_FROZEN" as const,
      integrationAuthority: INT_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      englishFreezeId: INT_CP007_ENGLISH_FREEZE_ID,
      localizedFreezeId: INT_CP007_LOCALIZED_FREEZE_ID,
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
