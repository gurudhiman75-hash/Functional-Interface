import {
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
  getGeometryPermanentEnglishRuntimeDefinitionV1,
} from "./permanent-review/geometry-permanent-english-runtime-v1";
import { generateGeometryPermanentEnglishFrozenV1 } from "./permanent-review/geometry-permanent-english-freeze-v1";
import { generateGeometryPermanentMultilingualFrozenV1 } from "./permanent-review/geometry-permanent-multilingual-freeze-v1";
import { GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1 } from "./permanent-review/geometry-permanent-multilingual-freeze-proof-v1";

export type Geo001QuestionStudioLanguage = "en" | "hi" | "pa";
export type Geo001QuestionStudioCpId = `GEO-CP-${string}`;
export type Geo001QuestionStudioQlId = `GEO-QL-${string}`;
export type Geo001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Geo001StandardQuestionStudioRequest = {
  packageId?: unknown;
  archetypeId?: unknown;
  patternId?: unknown;
  topic?: unknown;
  subtopic?: unknown;
  canonicalProblemId?: unknown;
  cpId?: unknown;
  questionLanguageId?: unknown;
  difficulty?: unknown;
  language?: unknown;
  count?: unknown;
  seed?: string;
};

if (!GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.lifecycle.questionStudioIntegrationAllowed) {
  throw new Error("GEO-001 Question Studio integration requires the proven multilingual freeze.");
}
if (!GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.lifecycle.multilingualFreezeProven) {
  throw new Error("GEO-001 Question Studio integration cannot run before multilingual freeze proof.");
}
if (GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length !== 75) {
  throw new Error("GEO-001 Question Studio integration requires exactly 75 permanent QLs.");
}

export const GEO_001_QUESTION_STUDIO_LANGUAGES = Object.freeze([
  "en",
  "hi",
  "pa",
] as const);

export const GEO_001_QUESTION_STUDIO_QL_IDS: readonly Geo001QuestionStudioQlId[] = Object.freeze(
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.map(
    (definition) => definition.qlId as Geo001QuestionStudioQlId,
  ),
);

export const GEO_001_QUESTION_STUDIO_CP_IDS: readonly Geo001QuestionStudioCpId[] = Object.freeze(
  [...new Set(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.map((definition) => definition.cpId))]
    .sort()
    .map((cpId) => cpId as Geo001QuestionStudioCpId),
);

if (GEO_001_QUESTION_STUDIO_QL_IDS.length !== 75) {
  throw new Error("GEO-001 Question Studio QL registry must contain exactly 75 QLs.");
}
if (GEO_001_QUESTION_STUDIO_CP_IDS.length !== 14) {
  throw new Error("GEO-001 Question Studio CP registry must contain exactly 14 checkpoints.");
}

const GEO_PACKAGE_DEFINITION = Object.freeze({
  packageId: "GEO-001" as const,
  topic: "Advanced Mathematics" as const,
  subtopic: "Geometry" as const,
  label: "Geometry" as const,
  cpIds: GEO_001_QUESTION_STUDIO_CP_IDS,
  qlIds: GEO_001_QUESTION_STUDIO_QL_IDS,
  supportedLanguages: GEO_001_QUESTION_STUDIO_LANGUAGES,
});

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDifficulty(value: unknown): Geo001QuestionStudioDifficulty {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "hard") return "Hard";
  return "Medium";
}

function normalizeLanguage(value: unknown): Geo001QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (!GEO_001_QUESTION_STUDIO_LANGUAGES.includes(language as Geo001QuestionStudioLanguage)) {
    throw new Error(`GEO-001 does not support Question Studio language ${language}.`);
  }
  return language as Geo001QuestionStudioLanguage;
}

function seededHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function inferGeo001QuestionStudioCpFromQl(
  value: unknown,
): Geo001QuestionStudioCpId | undefined {
  const qlId = String(value ?? "").trim();
  if (!/^GEO-QL-\d{3}$/u.test(qlId)) return undefined;
  const definition = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.find(
    (candidate) => candidate.qlId === qlId,
  );
  return definition?.cpId as Geo001QuestionStudioCpId | undefined;
}

export function isGeo001StandardQuestionStudioRequest(
  request: Geo001StandardQuestionStudioRequest,
): boolean {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const advancedMathSelectors = new Set([
    "advanced mathematics",
    "advanced math",
    "advanced maths",
    "advanced mathematics quant",
  ]);
  return (
    packageId === "geo 001"
    || patternId.includes("geo 001")
    || (topic === "geometry" && !subtopic)
    || (advancedMathSelectors.has(topic) && subtopic === "geometry")
  );
}

export function listGeo001StandardQuestionStudioPackages() {
  return [
    {
      id: GEO_PACKAGE_DEFINITION.packageId,
      packageId: GEO_PACKAGE_DEFINITION.packageId,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: GEO_PACKAGE_DEFINITION.topic,
      subtopic: GEO_PACKAGE_DEFINITION.subtopic,
      name: `${GEO_PACKAGE_DEFINITION.packageId} ${GEO_PACKAGE_DEFINITION.label}`,
      label: GEO_PACKAGE_DEFINITION.label,
      generationDomain: "quant-v4",
      cpIds: [...GEO_PACKAGE_DEFINITION.cpIds],
      canonicalProblems: GEO_PACKAGE_DEFINITION.cpIds.map((cpId) => ({
        id: cpId,
        label: cpId,
      })),
      questionLanguageIds: [...GEO_PACKAGE_DEFINITION.qlIds],
      supportedDifficulties: ["easy", "medium", "hard"],
      supportedLanguages: [...GEO_PACKAGE_DEFINITION.supportedLanguages],
      enabled: true,
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: true,
    },
  ];
}

function generateFrozenGeometryItem(
  qlId: string,
  seed: string,
  language: Geo001QuestionStudioLanguage,
) {
  if (language === "en") {
    return generateGeometryPermanentEnglishFrozenV1(qlId, seed);
  }
  return generateGeometryPermanentMultilingualFrozenV1(
    qlId,
    seed,
    language === "hi" ? "hi-IN" : "pa-IN",
  );
}

function buildQuestionStudioPackage(
  qlId: string,
  seed: string,
  language: Geo001QuestionStudioLanguage,
  difficulty: Geo001QuestionStudioDifficulty,
) {
  const item = generateFrozenGeometryItem(qlId, seed, language) as any;
  const questionId = `GEO-001:${item.qlId}:${item.prototypeId}:${seed}`;
  const explanationId = `${item.qlId}:${language}:EXP`;
  const traceability = Object.freeze({
    packageId: "GEO-001",
    cpId: item.cpId,
    qlId: item.qlId,
    canonicalSolveModeFamilyId: item.canonicalSolveModeFamilyId,
    proposalKey: item.proposalKey,
    prototypeId: item.prototypeId,
    prototypeSolveMode: item.prototypeSolveMode,
    variantIndex: item.variantIndex,
    englishFreezeAuthorityId: item.freezeAuthorityId,
    multilingualFreezeAuthorityId: item.multilingualFreezeAuthorityId ?? null,
    multilingualFreezeProofAuthorityId: GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.authorityId,
    approvedMultilingualReviewArtifactId:
      GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.provenClaims.approvedReviewArtifactId,
    approvedMultilingualReviewArtifactDigest:
      GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.provenClaims.approvedReviewArtifactDigest,
  });

  return Object.freeze({
    packageId: "GEO-001" as const,
    questionId,
    canonicalProblemId: item.cpId,
    questionLanguageId: item.qlId,
    explanationId,
    qlId: item.qlId,
    qlName: item.learnerDecision,
    stem: item.question,
    options: Object.freeze([...item.options]),
    correctIndex: item.correctIndex,
    answer: item.canonicalAnswer,
    canonicalAnswer: item.canonicalAnswer,
    explanation: Object.freeze({
      lines: Object.freeze([...item.explanationLines]),
      theoremNames: Object.freeze([...item.theoremNames]),
    }),
    explanationText: item.explanation,
    difficultyBand: difficulty,
    language,
    stemSvg: item.stemSvg,
    diagramModel: item.diagramModel,
    canonicalGeometryFingerprint: item.canonicalGeometryFingerprint,
    diagramFingerprint: item.diagramFingerprint,
    validation: item.rawPrototypeQuestion.validation,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false,
    publiclyPublishable: false,
    traceability,
    parameters: Object.freeze({
      qlId: item.qlId,
      cpId: item.cpId,
      canonicalSolveModeFamilyId: item.canonicalSolveModeFamilyId,
      prototypeId: item.prototypeId,
      prototypeSolveMode: item.prototypeSolveMode,
      variantIndex: item.variantIndex,
      difficultyRoutingMode: "QUESTION_STUDIO_REQUEST_LABEL_ONLY",
    }),
  });
}

function toQuestionStudioPreview(
  pkg: ReturnType<typeof buildQuestionStudioPackage>,
  context: { questionIndex: number; questionCount: number; seed: string },
) {
  const hasDiagram = Boolean(pkg.stemSvg);
  const canonicalAnswer = {
    kind: "symbolic",
    value: pkg.answer,
    display: pkg.answer,
    rendered: pkg.answer,
    rounding: "exact",
  };

  return {
    text: pkg.stem,
    stem: pkg.stem,
    options: [...pkg.options],
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    explanation: pkg.explanationText,
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: "GEO-001",
    packageId: "GEO-001",
    section: "Quant",
    topic: GEO_PACKAGE_DEFINITION.topic,
    subtopic: GEO_PACKAGE_DEFINITION.subtopic,
    generationBackend: "quant-v4",
    debugSource: "geo-001-question-studio-standard-runtime",
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    validation: pkg.validation,
    questionId: pkg.questionId,
    seed: context.seed,
    answer: pkg.answer,
    canonicalAnswer,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionStudioDiscoverable: pkg.questionStudioDiscoverable,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    packageSource: "geo-001-question-studio-standard-runtime",
    taskKind: pkg.traceability.canonicalSolveModeFamilyId,
    language: pkg.language,
    qlId: pkg.qlId,
    qlName: pkg.qlName,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    stemSvg: pkg.stemSvg,
    canonicalGeometryFingerprint: pkg.canonicalGeometryFingerprint,
    diagramFingerprint: pkg.diagramFingerprint,
    ...(hasDiagram
      ? {
          stimulusSvgs: [pkg.stemSvg],
          renderer: "svg",
          contentFingerprint:
            pkg.diagramFingerprint ?? pkg.canonicalGeometryFingerprint ?? undefined,
        }
      : {
          renderer: "text",
          contentFingerprint: pkg.canonicalGeometryFingerprint ?? undefined,
        }),
    metadata: {
      language: pkg.language,
      packageId: "GEO-001",
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      qlId: pkg.qlId,
      prototypeId: pkg.traceability.prototypeId,
      prototypeSolveMode: pkg.traceability.prototypeSolveMode,
      variantIndex: pkg.traceability.variantIndex,
      canonicalSolveModeFamilyId: pkg.traceability.canonicalSolveModeFamilyId,
      runtimeMode: pkg.runtimeMode,
      reviewStatus: pkg.reviewStatus,
      questionBankStatus: pkg.questionBankStatus,
      questionBankWritable: pkg.questionBankWritable,
      testEligibility: pkg.testEligibility,
      publiclyPublishable: pkg.publiclyPublishable,
      multilingualFreezeProofAuthorityId:
        pkg.traceability.multilingualFreezeProofAuthorityId,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    proceduralLogic: pkg.parameters,
    logic: pkg.parameters,
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: "GEO-001",
      selectedArchetype: "GEO-001",
      selectedMotif: pkg.canonicalProblemId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      qlId: pkg.qlId,
      taskKind: pkg.traceability.canonicalSolveModeFamilyId,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "geo-001-question-studio-standard-runtime",
      seed: context.seed,
      semanticMetadata: pkg.traceability,
      validatorReports: pkg.validation,
    },
  };
}

export async function generateGeo001StandardQuestionStudioBatch(
  request: Geo001StandardQuestionStudioRequest = {},
) {
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );

  const explicitQlRaw = String(request.questionLanguageId ?? "").trim();
  const explicitQl = explicitQlRaw || undefined;
  if (explicitQl && !GEO_001_QUESTION_STUDIO_QL_IDS.includes(explicitQl as Geo001QuestionStudioQlId)) {
    throw new Error(`Unknown question language '${explicitQl}' for package GEO-001.`);
  }

  const explicitCpRaw = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  const explicitCp = explicitCpRaw || undefined;
  if (explicitCp && !GEO_001_QUESTION_STUDIO_CP_IDS.includes(explicitCp as Geo001QuestionStudioCpId)) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package GEO-001.`);
  }

  const inferredCp = explicitQl ? inferGeo001QuestionStudioCpFromQl(explicitQl) : undefined;
  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(`${explicitQl} belongs to ${inferredCp}, not ${explicitCp}.`);
  }
  const fixedCp = (explicitCp ?? inferredCp) as Geo001QuestionStudioCpId | undefined;

  const eligibleDefinitions = explicitQl
    ? [getGeometryPermanentEnglishRuntimeDefinitionV1(explicitQl)]
    : fixedCp
      ? GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.filter(
          (definition) => definition.cpId === fixedCp,
        )
      : [...GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1];

  if (eligibleDefinitions.length === 0) {
    throw new Error(`GEO-001 has no Question Studio QLs for ${fixedCp ?? "the selected scope"}.`);
  }

  const batchSeed =
    request.seed
    ?? `quant-v4:GEO-001:${language}:${fixedCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const qlOffset = seededHash(`${batchSeed}:ql-offset`) % eligibleDefinitions.length;
  const questionPackages: any[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const definition = eligibleDefinitions[(qlOffset + index) % eligibleDefinitions.length]!;
    const seed = `${batchSeed}:${definition.qlId}:${index}`;
    const pkg = buildQuestionStudioPackage(definition.qlId, seed, language, difficulty);
    questionPackages.push(pkg);
    questions.push(
      toQuestionStudioPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      questionStudioDiscoverable: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      language,
      packageId: "GEO-001",
      canonicalProblemId: fixedCp ?? "MIXED",
      questionLanguageId: explicitQl ?? "MIXED",
      mathematicalAuthorityLanguage: "en",
      lifecyclePolicy: "QUESTION_STUDIO_ONLY_FROZEN_MULTILINGUAL",
      multilingualFreezeProofAuthorityId:
        GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.authorityId,
      multilingualFreezeArtifactId:
        GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.proof.artifactId,
      approvedMultilingualReviewArtifactId:
        GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.provenClaims.approvedReviewArtifactId,
    },
    questionPackages,
    questions,
  };
}

export const GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1 = Object.freeze({
  authorityId: "GEO-001-QUESTION-STUDIO-STANDARD-INTEGRATION-V1",
  authorityRevision: 3,
  status: "NORMAL_QUESTION_STUDIO_INTEGRATION_IMPLEMENTED__CI_PROOF_PENDING",
  sourceMultilingualFreezeProofAuthorityId:
    GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.authorityId,
  packageId: "GEO-001",
  permanentQlCount: GEO_001_QUESTION_STUDIO_QL_IDS.length,
  cpCount: GEO_001_QUESTION_STUDIO_CP_IDS.length,
  supportedLanguages: GEO_001_QUESTION_STUDIO_LANGUAGES,
  lifecycle: Object.freeze({
    multilingualFreezeProven: true,
    normalQuestionStudioIntegrationImplemented: true,
    questionStudioActivationApplied: true,
    questionStudioDiscoverable: true,
    questionStudioIntegrationProven: false,
    questionBankWriteAllowed: false,
    questionBankWritable: false,
    testEligibilityAllowed: false,
    testEligible: false,
    publicPublicationAllowed: false,
    publiclyPublishable: false,
    prMergeAuthorized: false,
  }),
  postProofNextGate: "QUESTION_STUDIO_NORMAL_WORKFLOW_OPERATIONAL_REVIEW",
} as const);
