export type ReasoningV1QuestionStudioLifecycle = Readonly<{
  generationAllowed: false;
  persistenceAllowed: false;
  approvalAllowed: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  localizationStatus: "NOT_STARTED";
  screenReaderValidation: "PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION";
}>;

export type ReasoningV1CheckpointFreeze = Readonly<{
  checkpointId: "RNK-CP-004" | "RNK-CP-005";
  freezeVersion:
    | "RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1"
    | "RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2";
  runtimeVersion:
    | "RNK_CP004_PERMANENT_RUNTIME_V1"
    | "RNK_CP005_PERMANENT_RUNTIME_V2";
  permanentQlRange: Readonly<{
    first: string;
    last: string;
    count: number;
  }>;
  permanentQuestionCount: number;
  projectionSha256: string;
}>;

export type ReasoningV1QuestionStudioPackage = Readonly<{
  id: string;
  packageId: string;
  type: "reasoning-v1";
  section: "Reasoning";
  domain: "reasoning";
  topic: string;
  subtopic: string;
  name: string;
  label: string;
  generationDomain: "reasoning-v1";
  cpIds: readonly ["RNK-CP-004", "RNK-CP-005"];
  supportedDifficulties: readonly ["easy", "medium", "hard"];
  supportedLanguages: readonly ["en"];
  enabled: false;
  runtimeMode: "DISCOVERY_ONLY";
  supportedRuntimeModes: readonly ["DISCOVERY_ONLY"];
  dynamicCandidateCpIds: readonly [];
  freezeState: "PARTIAL_CHAPTER_ENGLISH_DISCOVERY_FROZEN";
  freezeVersion: "RNK_CP004_AND_CP005_ENGLISH_DISCOVERY_FREEZE_V2";
  runtimeVersion: "RNK_CP004_AND_CP005_PERMANENT_RUNTIME_V2";
  permanentQlRange: Readonly<{
    first: "RNK-QL-027";
    last: "RNK-QL-043";
    count: 17;
  }>;
  permanentQuestionCount: 3264;
  projectionSha256: "080af7fa6787f6752208c0504dce45bc0498c23eb7df7091a4130619ecfb4c2e";
  checkpointFreezes: readonly [ReasoningV1CheckpointFreeze, ReasoningV1CheckpointFreeze];
}> & ReasoningV1QuestionStudioLifecycle;

export type ReasoningV1QuestionStudioSelection = Readonly<{
  packageId?: unknown;
  patternId?: unknown;
  topic?: unknown;
  subtopic?: unknown;
}>;

export type ReasoningV1GenerationBlock = Readonly<{
  statusCode: 409;
  body: Readonly<{
    error: string;
    code: "REASONING_PACKAGE_DISCOVERY_ONLY";
    packageId: string;
    freezeState: string;
    generationAllowed: false;
    persistenceAllowed: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
    screenReaderValidation: "PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION";
  }>;
}>;

const RNK_001_PACKAGE: ReasoningV1QuestionStudioPackage = Object.freeze({
  id: "RNK-001",
  packageId: "RNK-001",
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Reasoning",
  subtopic: "Ranking and Order",
  name: "RNK-001 Ranking and Order",
  label: "Ranking and Order — Discovery Only",
  generationDomain: "reasoning-v1",
  cpIds: Object.freeze(["RNK-CP-004", "RNK-CP-005"]),
  supportedDifficulties: Object.freeze(["easy", "medium", "hard"]),
  supportedLanguages: Object.freeze(["en"]),
  enabled: false,
  runtimeMode: "DISCOVERY_ONLY",
  supportedRuntimeModes: Object.freeze(["DISCOVERY_ONLY"]),
  dynamicCandidateCpIds: Object.freeze([]),
  freezeState: "PARTIAL_CHAPTER_ENGLISH_DISCOVERY_FROZEN",
  freezeVersion: "RNK_CP004_AND_CP005_ENGLISH_DISCOVERY_FREEZE_V2",
  runtimeVersion: "RNK_CP004_AND_CP005_PERMANENT_RUNTIME_V2",
  permanentQlRange: Object.freeze({
    first: "RNK-QL-027",
    last: "RNK-QL-043",
    count: 17,
  }),
  permanentQuestionCount: 3264,
  projectionSha256:
    "080af7fa6787f6752208c0504dce45bc0498c23eb7df7091a4130619ecfb4c2e",
  checkpointFreezes: Object.freeze([
    Object.freeze({
      checkpointId: "RNK-CP-004",
      freezeVersion: "RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1",
      runtimeVersion: "RNK_CP004_PERMANENT_RUNTIME_V1",
      permanentQlRange: Object.freeze({
        first: "RNK-QL-027",
        last: "RNK-QL-035",
        count: 9,
      }),
      permanentQuestionCount: 1728,
      projectionSha256:
        "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f",
    }),
    Object.freeze({
      checkpointId: "RNK-CP-005",
      freezeVersion: "RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2",
      runtimeVersion: "RNK_CP005_PERMANENT_RUNTIME_V2",
      permanentQlRange: Object.freeze({
        first: "RNK-QL-036",
        last: "RNK-QL-043",
        count: 8,
      }),
      permanentQuestionCount: 1536,
      projectionSha256:
        "c1d205d2d49d3fe97bf3049d65c8d2b57e8594eb99abb57982384a4fa6605d8f",
    }),
  ]),
  generationAllowed: false,
  persistenceAllowed: false,
  approvalAllowed: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  localizationStatus: "NOT_STARTED",
  screenReaderValidation: "PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION",
});

const REASONING_V1_PACKAGES = Object.freeze([RNK_001_PACKAGE]);

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function listReasoningV1QuestionStudioPackages(): readonly ReasoningV1QuestionStudioPackage[] {
  return REASONING_V1_PACKAGES;
}

export function listQuestionStudioPackagesWithReasoning<T>(
  existingPackages: readonly T[],
): readonly (T | ReasoningV1QuestionStudioPackage)[] {
  return [...existingPackages, ...REASONING_V1_PACKAGES];
}

export function resolveReasoningV1QuestionStudioPackage(
  selection: ReasoningV1QuestionStudioSelection,
): ReasoningV1QuestionStudioPackage | undefined {
  const packageId = String(selection.packageId ?? "").trim().toUpperCase();
  const patternId = String(selection.patternId ?? "").trim().toUpperCase();
  if (packageId === RNK_001_PACKAGE.packageId) return RNK_001_PACKAGE;
  if (patternId === RNK_001_PACKAGE.packageId || patternId.includes("RNK-001")) {
    return RNK_001_PACKAGE;
  }

  const topic = normalizeSelector(selection.topic);
  const subtopic = normalizeSelector(selection.subtopic);
  const rankingSelector = new Set([
    "ranking and order",
    "ranking order",
    "rank and order",
    "order and ranking",
  ]);

  if (rankingSelector.has(topic)) return RNK_001_PACKAGE;
  if (topic === "reasoning" && rankingSelector.has(subtopic)) {
    return RNK_001_PACKAGE;
  }
  return undefined;
}

export function getReasoningV1GenerationBlock(
  selection: ReasoningV1QuestionStudioSelection,
): ReasoningV1GenerationBlock | undefined {
  const pkg = resolveReasoningV1QuestionStudioPackage(selection);
  if (!pkg) return undefined;

  return Object.freeze({
    statusCode: 409,
    body: Object.freeze({
      error:
        `${pkg.packageId} is registered for capability discovery only. ` +
        "Live generation and persistence remain disabled until the remaining safety gates pass.",
      code: "REASONING_PACKAGE_DISCOVERY_ONLY",
      packageId: pkg.packageId,
      freezeState: pkg.freezeState,
      generationAllowed: pkg.generationAllowed,
      persistenceAllowed: pkg.persistenceAllowed,
      questionBankStatus: pkg.questionBankStatus,
      testEligibility: pkg.testEligibility,
      publiclyPublishable: pkg.publiclyPublishable,
      screenReaderValidation: pkg.screenReaderValidation,
    }),
  });
}
