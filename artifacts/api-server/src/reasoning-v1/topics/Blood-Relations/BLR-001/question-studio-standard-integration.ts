import {
  BLR_CP001_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP002_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP003_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP004_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP005_QUESTION_STUDIO_PACKAGE_ID,
  previewBlrChapterQuestionStudio,
  releaseAuthorityForBlrChapterPackage,
  type BlrChapterStudioDifficulty,
  type BlrChapterStudioLanguage,
  type BlrChapterStudioPackageId,
} from "./question-studio-chapter-adapter";
import {
  BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP006_QUESTION_STUDIO_QL_IDS,
  previewBlrCp006QuestionStudioReview,
} from "./BLR-CP-006/question-studio-review-adapter";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_QL_IDS,
  previewBlrCp007QuestionStudioReview,
} from "./BLR-CP-007/question-studio-review-adapter";

export const BLR_001_STANDARD_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export type Blr001StandardLanguage = (typeof BLR_001_STANDARD_QUESTION_STUDIO_LANGUAGES)[number];
export type Blr001StandardDifficulty = "Easy" | "Medium" | "Hard";

export type Blr001StandardPackageId =
  | BlrChapterStudioPackageId
  | typeof BLR_CP006_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID;

export type Blr001StandardQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: Blr001StandardDifficulty | string | number;
  language?: Blr001StandardLanguage;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

const PACKAGE_SPECS = [
  {
    packageId: BLR_CP001_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-001",
    label: "Named Blood Relations",
    qlIds: ["BLR-QL-001", "BLR-QL-002", "BLR-QL-003", "BLR-QL-004", "BLR-QL-005", "BLR-QL-006", "BLR-QL-007"],
    supportedLanguages: ["en"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP002_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-002",
    label: "Pointing & Introduction Relations",
    qlIds: ["BLR-QL-008"],
    supportedLanguages: ["en"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP003_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-003",
    label: "Family Sets, Status & Lineage",
    qlIds: ["BLR-QL-009", "BLR-QL-010", "BLR-QL-011", "BLR-QL-012"],
    supportedLanguages: ["en", "hi", "pa"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP004_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-004",
    label: "Family Counting & Composition",
    qlIds: ["BLR-QL-013", "BLR-QL-014", "BLR-QL-015", "BLR-QL-016", "BLR-QL-017"],
    supportedLanguages: ["en", "hi", "pa"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP005_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-005",
    label: "Possibility & Uncertainty",
    qlIds: ["BLR-QL-018", "BLR-QL-019", "BLR-QL-020", "BLR-QL-021", "BLR-QL-022", "BLR-QL-023", "BLR-QL-024", "BLR-QL-025"],
    supportedLanguages: ["en", "hi", "pa"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-006",
    label: "Coded Relation Decoding",
    qlIds: [...BLR_CP006_QUESTION_STUDIO_QL_IDS],
    supportedLanguages: ["en", "hi", "pa"],
    releaseEligibleAfterApproval: false,
  },
  {
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: "BLR-CP-007",
    label: "Advanced Coded Blood Relations",
    qlIds: [...BLR_CP007_QUESTION_STUDIO_QL_IDS],
    supportedLanguages: ["en", "hi", "pa"],
    releaseEligibleAfterApproval: true,
  },
] as const;

type PackageSpec = (typeof PACKAGE_SPECS)[number];

type SourcePreview = Readonly<{
  generationContext: Record<string, any>;
  questions: readonly Record<string, any>[];
}>;

function selectedPackage(request: Blr001StandardQuestionStudioRequest): PackageSpec | undefined {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
  if (explicit) {
    return PACKAGE_SPECS.find((entry) => entry.packageId === explicit);
  }
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (pattern) {
    const byPattern = PACKAGE_SPECS.find((entry) => pattern === entry.packageId || pattern.includes(entry.checkpointId));
    if (byPattern) return byPattern;
  }
  const qlId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (qlId) {
    const byQl = PACKAGE_SPECS.find((entry) => (entry.qlIds as readonly string[]).includes(qlId));
    if (byQl) return byQl;
  }
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  if (topic === "blood relations" || subtopic === "blood relations" || (topic === "reasoning" && subtopic.includes("blood"))) {
    return PACKAGE_SPECS[0];
  }
  return undefined;
}

function normalizeDifficulty(value: unknown): Blr001StandardDifficulty | undefined {
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

function requestedQlId(spec: PackageSpec, request: Blr001StandardQuestionStudioRequest) {
  const explicit = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (!explicit) return undefined;
  if (!(spec.qlIds as readonly string[]).includes(explicit)) {
    throw new Error(`${explicit} does not belong to ${spec.checkpointId}.`);
  }
  return explicit;
}

function sourcePreview(
  spec: PackageSpec,
  request: Blr001StandardQuestionStudioRequest,
): SourcePreview {
  const language = request.language ?? "en";
  if (!(spec.supportedLanguages as readonly string[]).includes(language)) {
    throw new Error(`${spec.checkpointId} does not support Question Studio language '${language}'.`);
  }
  const common = {
    language,
    qlId: requestedQlId(spec, request),
    difficulty: normalizeDifficulty(request.difficulty),
    questionLanguageId: request.questionLanguageId,
    seed: request.seed,
    count: request.count,
  };

  if (
    spec.packageId === BLR_CP001_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP002_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP003_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP004_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP005_QUESTION_STUDIO_PACKAGE_ID
  ) {
    return previewBlrChapterQuestionStudio({
      packageId: spec.packageId,
      language: language as BlrChapterStudioLanguage,
      qlId: common.qlId,
      difficulty: common.difficulty as BlrChapterStudioDifficulty | undefined,
      questionLanguageId: common.questionLanguageId,
      seed: common.seed,
      count: common.count,
    }) as SourcePreview;
  }
  if (spec.packageId === BLR_CP006_QUESTION_STUDIO_PACKAGE_ID) {
    return previewBlrCp006QuestionStudioReview(common as any) as SourcePreview;
  }
  return previewBlrCp007QuestionStudioReview(common as any) as SourcePreview;
}

function sourceAuthority(spec: PackageSpec, language: Blr001StandardLanguage, source: Record<string, any>) {
  if (
    spec.packageId === BLR_CP001_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP002_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP003_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP004_QUESTION_STUDIO_PACKAGE_ID
    || spec.packageId === BLR_CP005_QUESTION_STUDIO_PACKAGE_ID
  ) {
    return releaseAuthorityForBlrChapterPackage(spec.packageId, language as BlrChapterStudioLanguage);
  }
  return String(source.traceability?.recordAuthority ?? source.parameters?.recordAuthority ?? "BLR_001_FROZEN_AUTHORITY");
}

function explanationText(source: Record<string, any>) {
  const explanation = source.explanation ?? {};
  return [
    ...(Array.isArray(explanation.steps) ? explanation.steps : []),
    explanation.conclusion,
    explanation.shortcut ? `Shortcut: ${explanation.shortcut}` : "",
    explanation.commonTrap ? `Common trap: ${explanation.commonTrap}` : "",
  ].filter(Boolean).map(String).join("\n\n");
}

function toStandardQuestion(
  spec: PackageSpec,
  language: Blr001StandardLanguage,
  source: Record<string, any>,
) {
  const releaseEligible = spec.releaseEligibleAfterApproval;
  const prompt = String(source.sharedPrompt ?? "").trim();
  const learnerStem = String(source.stem ?? "").trim();
  const text = prompt ? `${prompt}\n\n${learnerStem}` : learnerStem;
  const authority = sourceAuthority(spec, language, source);
  const questionBankStatus = releaseEligible ? "READY_FOR_STORAGE" : "NOT_STORED";
  const testEligibility = releaseEligible ? "ELIGIBLE" : "INELIGIBLE";
  const reviewStatus = "REVIEW_REQUIRED";

  return {
    text,
    stem: text,
    originalStem: learnerStem,
    sharedPrompt: prompt,
    options: [...(source.options ?? [])],
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: source.answer,
    canonicalAnswer: source.answer,
    explanation: explanationText(source),
    richExplanation: source.explanation,
    difficulty: source.difficultyBand,
    difficultyLabel: source.difficultyBand,
    patternId: spec.packageId,
    packageId: spec.packageId,
    section: "Reasoning",
    topic: "Reasoning",
    subtopic: "Blood Relations",
    chapterId: "BLR-001",
    checkpointId: spec.checkpointId,
    qlId: source.qlId,
    language,
    locale: source.locale,
    generationBackend: "reasoning-v1",
    debugSource: "reasoning-v1-blr-001-standard-question-studio",
    traceability: source.traceability,
    validation: source.validation,
    questionId: source.questionId,
    localizedQuestionId: source.questionLanguageId,
    canonicalItemId: source.canonicalItemId,
    questionLanguageId: source.questionLanguageId,
    explanationId: source.explanationId,
    seed: source.parameters?.seed,
    renderer: source.renderer,
    reasoningGraph: source.reasoningGraph,
    runtimeMode: "STANDARD_QUESTION_STUDIO",
    reviewStatus,
    questionBankStatus,
    questionBankWritable: releaseEligible,
    questionBankEligible: releaseEligible,
    testEligibility,
    testEligible: releaseEligible,
    mockTestEligible: releaseEligible,
    publiclyPublishable: releaseEligible,
    automaticStudentPublication: false,
    publicReleaseStatus: "LOCKED",
    reviewOnly: !releaseEligible,
    manualApprovalRequired: true,
    releaseFreezeStatus: releaseEligible ? "MULTILINGUAL_FROZEN_APPROVED" : "REVIEW_ONLY",
    integrationAuthority: authority,
    sourceSafety: source.safety,
    sourceParameters: source.parameters,
  } as const;
}

export function isBlr001StandardQuestionStudioRequest(request: Blr001StandardQuestionStudioRequest) {
  return Boolean(selectedPackage(request));
}

export function listBlr001StandardQuestionStudioPackages() {
  return PACKAGE_SPECS.map((spec) => ({
    id: spec.packageId,
    packageId: spec.packageId,
    type: "reasoning-v1",
    section: "Reasoning",
    domain: "reasoning",
    topic: "Reasoning",
    subtopic: "Blood Relations",
    chapterId: "BLR-001",
    checkpointId: spec.checkpointId,
    name: `${spec.checkpointId} ${spec.label}`,
    label: `${spec.checkpointId} · ${spec.label}`,
    generationDomain: "reasoning-v1",
    cpIds: [...spec.qlIds],
    qlIds: [...spec.qlIds],
    canonicalProblems: spec.qlIds.map((qlId) => ({ id: qlId, label: qlId })),
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    supportedLanguages: [...spec.supportedLanguages],
    enabled: true,
    runtimeMode: "STANDARD_QUESTION_STUDIO",
    supportedRuntimeModes: ["STANDARD_QUESTION_STUDIO"],
  }));
}

export function generateBlr001StandardQuestionStudioBatch(
  request: Blr001StandardQuestionStudioRequest = {},
) {
  const spec = selectedPackage(request);
  if (!spec) throw new Error("A Blood Relations Question Studio package is required.");
  const language = request.language ?? "en";
  const source = sourcePreview(spec, request);
  const questions = source.questions.map((question) =>
    toStandardQuestion(spec, language, question),
  );
  return {
    generationContext: {
      ...source.generationContext,
      generationDomain: "reasoning-v1" as const,
      chapterId: "BLR-001" as const,
      checkpointId: spec.checkpointId,
      packageId: spec.packageId,
      language,
      runtimeMode: "STANDARD_QUESTION_STUDIO" as const,
      questionStudioRegistrationStatus: "REGISTERED_STANDARD" as const,
      questionStudioStagingStatus: "STANDARD_REVIEW_QUEUE" as const,
      persistenceAllowed: true as const,
      reviewStatus: "REVIEW_REQUIRED" as const,
      questionBankStatus: spec.releaseEligibleAfterApproval ? "READY_FOR_STORAGE" as const : "NOT_STORED" as const,
      testEligibility: spec.releaseEligibleAfterApproval ? "ELIGIBLE" as const : "INELIGIBLE" as const,
      publiclyPublishable: spec.releaseEligibleAfterApproval,
      automaticStudentPublication: false as const,
      manualApprovalRequired: true as const,
    },
    questionPackages: [],
    questions,
  };
}