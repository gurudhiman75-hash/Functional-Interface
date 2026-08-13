import {
  toQuestionStudioPreview,
  type QuantV4Difficulty,
  type QuantV4Language,
  type QuantV4PackageDefinition,
} from "../../generation-engine-core";
import {
  getPrb001ActiveCanonicalProblemIds,
  runPrb001Pipeline,
  type Prb001CanonicalProblemId,
} from "./PRB-001";
import {
  getPrb002ActiveCanonicalProblemIds,
  runPrb002Pipeline,
  type Prb002CanonicalProblemId,
} from "./PRB-002";
import {
  listProbabilityNativeReviewCatalog,
  previewProbabilityNativeReview,
  PROBABILITY_NATIVE_REVIEW_AUTHORITY,
  PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
  type ProbabilityNativeReviewLanguage,
} from "./native-review-adapter";
import type {
  ProbabilityCanonicalProblemId,
  ProbabilityExamProfile,
  ProbabilityPackageId,
} from "./shared";

export const PROBABILITY_STANDARD_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;

export type ProbabilityStandardQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: QuantV4Difficulty | string | number;
  language?: QuantV4Language;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
  examProfile?: ProbabilityExamProfile;
}>;

type ProbabilityRuntimeDefinition = Omit<QuantV4PackageDefinition, "run"> & {
  packageId: ProbabilityPackageId;
  run: (
    cpId: ProbabilityCanonicalProblemId,
    input: {
      difficulty?: QuantV4Difficulty;
      questionLanguageId?: string;
      seed?: string;
      examProfile?: ProbabilityExamProfile;
    },
  ) => any;
};

const PACKAGES: readonly ProbabilityRuntimeDefinition[] = [
  {
    packageId: "PRB-001",
    topic: "Arithmetic",
    subtopic: "Probability",
    label: "Classical Probability & Standard Experiments",
    cpIds: getPrb001ActiveCanonicalProblemIds(),
    supportedLanguages: PROBABILITY_STANDARD_QUESTION_STUDIO_LANGUAGES,
    run: (cpId, input) =>
      runPrb001Pipeline(cpId as Prb001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: "en",
        questionLanguageId: input.questionLanguageId,
        examProfile: input.examProfile,
        seed: input.seed,
      }),
  },
  {
    packageId: "PRB-002",
    topic: "Arithmetic",
    subtopic: "Probability",
    label: "Compound, Conditional & Counting-Based Probability",
    cpIds: getPrb002ActiveCanonicalProblemIds(),
    supportedLanguages: PROBABILITY_STANDARD_QUESTION_STUDIO_LANGUAGES,
    run: (cpId, input) =>
      runPrb002Pipeline(cpId as Prb002CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: "en",
        questionLanguageId: input.questionLanguageId,
        examProfile: input.examProfile,
        seed: input.seed,
      }),
  },
];

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDifficulty(value: unknown): QuantV4Difficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "easy") return "Easy";
    if (normalized === "medium" || normalized === "moderate") return "Medium";
    if (normalized === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function seedHash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function stableOrder<T extends { packageId: string; qlId: string }>(items: readonly T[], seed: string) {
  return [...items]
    .map((item) => ({ item, score: seedHash(`${seed}:${item.packageId}:${item.qlId}`) }))
    .sort((left, right) => left.score - right.score || left.item.qlId.localeCompare(right.item.qlId))
    .map(({ item }) => item);
}

function selectedPackage(request: ProbabilityStandardQuestionStudioRequest) {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
  if (explicit === "PRB-001" || explicit === "PRB-002") {
    return PACKAGES.find((entry) => entry.packageId === explicit)!;
  }

  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  const byPattern = PACKAGES.find((entry) => pattern === entry.packageId || pattern.includes(entry.packageId));
  if (byPattern) return byPattern;

  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId) {
    const byCp = PACKAGES.find((entry) => entry.cpIds.includes(cpId));
    if (byCp) return byCp;
  }

  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  if (
    topic === "probability"
    || subtopic === "probability"
    || (topic === "arithmetic" && subtopic.includes("probability"))
  ) {
    return PACKAGES[0]!;
  }
  return undefined;
}

export function isProbabilityStandardQuestionStudioRequest(
  request: ProbabilityStandardQuestionStudioRequest,
) {
  return Boolean(selectedPackage(request));
}

export function listProbabilityStandardQuestionStudioPackages() {
  return PACKAGES.map((pkg) => ({
    id: pkg.packageId,
    packageId: pkg.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    name: `${pkg.packageId} ${pkg.label}`,
    label: pkg.label,
    generationDomain: "quant-v4",
    cpIds: [...pkg.cpIds],
    canonicalProblems: pkg.cpIds.map((cpId) => ({ id: cpId, label: cpId })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: [...PROBABILITY_STANDARD_QUESTION_STUDIO_LANGUAGES],
    supportedExamProfiles: [
      "SSC_CGL_CHSL",
      "SSC_CGL_JSO",
      "BANKING_PRELIMS",
      "BANKING_MAINS",
      "GENERIC_PRACTICE",
    ],
    optionCountByExamProfile: {
      SSC_CGL_CHSL: 4,
      SSC_CGL_JSO: 4,
      BANKING_PRELIMS: 5,
      BANKING_MAINS: 5,
      GENERIC_PRACTICE: 4,
    },
    enabled: true,
    runtimeMode: "STANDARD_QUESTION_STUDIO",
    reviewStatus: "LANGUAGE_POLICY",
    questionBankStatus: "LANGUAGE_AND_ITEM_POLICY",
    testEligibility: "LANGUAGE_AND_ITEM_POLICY",
    publiclyPublishable: false,
    languagePolicies: {
      en: {
        reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
        questionBankStatus: "ITEM_POLICY",
        testEligibility: "ELIGIBLE_WITH_FAMILY_LIMIT",
        publiclyPublishable: false,
      },
      hi: {
        reviewStatus: "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      },
      pa: {
        reviewStatus: "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      },
    },
    freezeStatus: "LANGUAGE_POLICY",
    itemPolicyAuthority: "QUESTION_TRACEABILITY",
    maxPerMockPerFamily: 1,
    exactArithmetic: "BIGINT_RATIONAL",
  }));
}

function resolveCpId(
  pkg: ProbabilityRuntimeDefinition,
  request: ProbabilityStandardQuestionStudioRequest,
) {
  const explicit = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  if (explicit) {
    if (pkg.cpIds.includes(explicit)) return explicit as ProbabilityCanonicalProblemId;
    throw new Error(`Unknown canonical problem '${explicit}' for package ${pkg.packageId}`);
  }
  return pkg.cpIds[0]! as ProbabilityCanonicalProblemId;
}

function toEnglishStandardQuestion(
  pkg: ProbabilityRuntimeDefinition,
  source: any,
  context: { index: number; count: number; seed: string },
) {
  const preview = toQuestionStudioPreview(source, {
    packageDefinition: pkg as QuantV4PackageDefinition,
    questionIndex: context.index + 1,
    questionCount: context.count,
    seed: context.seed,
  }) as Record<string, any>;
  const questionBankStatus = String(preview.questionBankStatus ?? "").toUpperCase();
  const questionBankWritable = questionBankStatus === "WRITABLE";
  const testEligibility = String(preview.testEligibility ?? "").toUpperCase();

  return {
    ...preview,
    stem: preview.text,
    questionBankStatus,
    questionBankWritable,
    questionBankEligible: questionBankWritable,
    testEligible: testEligibility !== "INELIGIBLE" && testEligibility !== "LEARNING_ONLY",
    mockTestEligible: testEligibility === "ELIGIBLE_WITH_FAMILY_LIMIT" || testEligibility === "ELIGIBLE",
    publiclyPublishable: false,
    automaticStudentPublication: false,
    reviewOnly: !questionBankWritable,
    manualApprovalRequired: true,
    releaseFreezeStatus: questionBankWritable ? "ENGLISH_MOCK_READY" : "LEARNING_ONLY",
  };
}

function toNativeStandardQuestion(
  question: ReturnType<typeof previewProbabilityNativeReview>["questions"][number],
) {
  return {
    text: question.stem,
    stem: question.stem,
    options: [...question.options],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: question.explanation.steps.join("\n\n"),
    richExplanation: question.explanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.packageId,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Probability",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-probability-native-parity",
    traceability: question.traceability,
    validation: question.validation,
    questionId: question.questionId,
    localizedQuestionId: question.questionId,
    seed: question.parameters.sourceSeed,
    runtimeMode: question.runtimeMode,
    reviewStatus: question.reviewStatus,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankEligible: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
    integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
    packageSource: "quant-v4-probability-native-parity",
    packageId: question.packageId,
    language: question.language,
    locale: question.locale,
    canonicalProblemId: question.canonicalProblemId,
    questionLanguageId: question.qlId,
    explanationId: question.explanation.explanationId,
    proceduralLogic: question.parameters,
    logic: question.parameters,
    renderer: question.renderer,
    metadata: {
      language: question.language,
      locale: question.locale,
      packageId: question.packageId,
      canonicalProblemId: question.canonicalProblemId,
      questionLanguageId: question.qlId,
      localizedQuestionId: question.questionId,
      explanationId: question.explanation.explanationId,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
    },
  };
}

function buildBatchSeed(
  pkg: ProbabilityRuntimeDefinition,
  request: ProbabilityStandardQuestionStudioRequest,
  language: QuantV4Language,
) {
  return request.seed?.trim() || [
    "quant-v4",
    "question-studio",
    pkg.packageId,
    language,
    request.canonicalProblemId ?? request.cpId ?? "mixed",
    request.questionLanguageId ?? "mixed",
    Date.now(),
    Math.random().toString(36).slice(2),
  ].join(":");
}

function generateEnglishBatch(
  pkg: ProbabilityRuntimeDefinition,
  request: ProbabilityStandardQuestionStudioRequest,
  count: number,
  batchSeed: string,
) {
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  const cpIds = explicitCp ? [resolveCpId(pkg, request)] : [...pkg.cpIds] as ProbabilityCanonicalProblemId[];
  const cpOffset = seedHash(`${batchSeed}:${pkg.packageId}:cp-offset`) % cpIds.length;
  const questions: any[] = [];
  const questionPackages: any[] = [];

  for (let index = 0; index < count; index += 1) {
    const cpId = cpIds[(cpOffset + index) % cpIds.length]!;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const source = pkg.run(cpId, {
      difficulty,
      questionLanguageId: request.questionLanguageId,
      examProfile: request.examProfile,
      seed,
    });
    questionPackages.push(source);
    questions.push(toEnglishStandardQuestion(pkg, source, { index, count, seed }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "Probability" as const,
      packageId: pkg.packageId,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: request.examProfile,
      runtimeMode: "ENGLISH_MOCK_READY" as const,
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH" as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      itemPolicyAuthority: "QUESTION_TRACEABILITY" as const,
      maxPerMockPerFamily: 1,
      freezeStatus: "ENGLISH_MOCK_READY" as const,
    },
    questionPackages,
    questions,
  };
}

function generateNativeBatch(
  pkg: ProbabilityRuntimeDefinition,
  request: ProbabilityStandardQuestionStudioRequest,
  language: ProbabilityNativeReviewLanguage,
  count: number,
  batchSeed: string,
) {
  const difficulty = normalizeDifficulty(request.difficulty);
  const requestedCpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  const requestedQlId = String(request.questionLanguageId ?? "").trim();

  if (!requestedCpId) {
    const result = previewProbabilityNativeReview({
      language,
      packageId: pkg.packageId,
      qlId: requestedQlId || undefined,
      difficulty,
      seed: batchSeed,
      count,
    });
    return {
      generationContext: {
        ...result.generationContext,
        packageId: pkg.packageId,
        timestamp: Date.now(),
        questionStudioRegistrationStatus: "REGISTERED_STANDARD" as const,
        questionStudioStagingStatus: "STANDARD_REVIEW_QUEUE" as const,
      },
      questionPackages: [],
      questions: result.questions.map(toNativeStandardQuestion),
    };
  }

  const eligible = listProbabilityNativeReviewCatalog().filter((entry) =>
    entry.packageId === pkg.packageId
    && entry.cpId === requestedCpId
    && (!requestedQlId || entry.qlId === requestedQlId)
    && (!difficulty || entry.difficulty === difficulty)
  );
  if (!eligible.length) {
    throw new Error(`No ${pkg.packageId} native Probability QLs match ${requestedCpId}.`);
  }
  const ordered = stableOrder(eligible, batchSeed);
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const entry = ordered[index % ordered.length]!;
    const result = previewProbabilityNativeReview({
      language,
      packageId: pkg.packageId,
      qlId: entry.qlId,
      difficulty,
      seed: `${batchSeed}:${entry.qlId}:${Math.floor(index / ordered.length)}`,
      count: 1,
    });
    questions.push(toNativeStandardQuestion(result.questions[0]!));
  }
  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "Probability" as const,
      packageId: pkg.packageId,
      seed: batchSeed,
      timestamp: Date.now(),
      language,
      runtimeMode: PROBABILITY_NATIVE_REVIEW_RUNTIME_MODE,
      reviewStatus: "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW" as const,
      integrationAuthority: PROBABILITY_NATIVE_REVIEW_AUTHORITY,
      questionStudioRegistrationStatus: "REGISTERED_STANDARD" as const,
      questionStudioStagingStatus: "STANDARD_REVIEW_QUEUE" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
      releaseFreezeStatus: "PENDING_HUMAN_REVIEW" as const,
    },
    questionPackages: [],
    questions,
  };
}

export function generateProbabilityStandardQuestionStudioBatch(
  request: ProbabilityStandardQuestionStudioRequest = {},
) {
  const pkg = selectedPackage(request);
  if (!pkg) throw new Error("Probability Question Studio package selection is required.");
  const language = request.language ?? "en";
  if (!PROBABILITY_STANDARD_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`${pkg.packageId} does not support Question Studio language '${language}'.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = buildBatchSeed(pkg, request, language);

  return language === "en"
    ? generateEnglishBatch(pkg, request, count, batchSeed)
    : generateNativeBatch(pkg, request, language, count, batchSeed);
}
