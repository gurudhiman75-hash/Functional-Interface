import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { generateWfm001Question, WFM_001_CHECKPOINT_IDS, WFM_001_QL_IDS } from "./runtime";
import type { WfmDifficulty, WfmExamProfile, WfmLanguage, WfmQlId } from "./types";

export const WFM001_QUESTION_STUDIO_PACKAGE_ID_V1 = "WFM-001" as const;
export const WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const WFM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "WFM-001-CURRENT-MAIN-TAXONOMY-AND-DEEP-AUDIT-20260929" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = [...WFM_001_QL_IDS];
const cpIds = [...WFM_001_CHECKPOINT_IDS];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("WFM-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): {
  language: QuestionStudioLanguage;
  locale: WfmLanguage;
} {
  const language = value ?? "en";
  if (language === "en") return { language, locale: "en-IN" };
  if (language === "hi") return { language, locale: "hi-IN" };
  if (language === "pa") return { language, locale: "pa-IN" };
  throw new Error(`WFM-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: unknown): WfmDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error(`WFM-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function displayDifficulty(value: WfmDifficulty): "Easy" | "Medium" | "Hard" {
  return value === "EASY" ? "Easy" : value === "MEDIUM" ? "Medium" : "Hard";
}

function resolveExamProfile(value: unknown): WfmExamProfile {
  const normalized = text(value).toLowerCase();
  if (/bank|ibps|sbi|rrb officer|po\b/u.test(normalized)) {
    throw new Error("WFM-001 current source authority supports SSC/Punjab four-option profiles, not Banking delivery");
  }
  if (/punjab|psssb|ppsc|patwari|pspcl|punjab police/u.test(normalized)) return "PUNJAB_4";
  return "SSC_CGL_4";
}

function isQlId(value: string): value is WfmQlId {
  return qlIds.includes(value as WfmQlId);
}

function isCheckpointId(value: string): value is (typeof WFM_001_CHECKPOINT_IDS)[number] {
  return cpIds.includes(value as (typeof WFM_001_CHECKPOINT_IDS)[number]);
}

function qlsForCheckpoint(cpId: (typeof WFM_001_CHECKPOINT_IDS)[number]): WfmQlId[] {
  if (cpId === "WFM-CP-001") return ["WFM-QL-001", "WFM-QL-002"];
  if (cpId === "WFM-CP-002") return ["WFM-QL-003"];
  return ["WFM-QL-004"];
}

function checkpointForQl(qlId: WfmQlId): (typeof WFM_001_CHECKPOINT_IDS)[number] {
  if (qlId === "WFM-QL-001" || qlId === "WFM-QL-002") return "WFM-CP-001";
  if (qlId === "WFM-QL-003") return "WFM-CP-002";
  return "WFM-CP-003";
}

function resolveQlPool(request: QuestionStudioGenerationRequest): WfmQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];
  const allowed = new Set<string>([WFM001_QUESTION_STUDIO_PACKAGE_ID_V1, ...qlIds, ...cpIds]);
  const unknown = selectors.find((selector) => selector.startsWith("WFM-") && !allowed.has(selector));

  if (unknown) throw new Error(`Unknown WFM-001 selector ${unknown}`);
  if (qlMatches.length > 1) throw new Error(`Conflicting WFM-001 QL selectors ${qlMatches.join(", ")}`);
  if (cpMatches.length > 1) throw new Error(`Conflicting WFM-001 checkpoint selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const cpId = cpMatches[0];
  if (qlId && cpId && checkpointForQl(qlId) !== cpId) {
    throw new Error(`${qlId} is owned by ${checkpointForQl(qlId)}, not ${cpId}`);
  }
  if (qlId) return [qlId];
  if (cpId) return qlsForCheckpoint(cpId);
  return [...qlIds];
}

export function isWfm001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === WFM001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("WFM-QL-") || selector.startsWith("WFM-CP-"))) return true;

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "word formation" || subtopic === "word formation";
}

export const WFM001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Word Formation",
  subtopic: "Word Formation",
  label: "Reasoning · Word Formation · WFM-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    registrationAuthorityId: WFM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    taxonomyAuthority: "REASONING-V1-TAXONOMY-AMENDMENT-WFM-001",
    permanentQlCount: qlIds.length,
    permanentQlRange: "WFM-QL-001..WFM-QL-004",
    checkpointCount: cpIds.length,
    deterministicGeneration: true,
    supportedExamProfiles: ["SSC_CGL_4", "PUNJAB_4"],
    optionCount: 4,
    difficultyCalibrationStatus: "GENERATED_INSTANCE_V2",
    multilingualParityStatus: "EN_HI_PA",
    reviewOnly: true,
  },
};

export function generateWfm001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (request.runtimeMode && request.runtimeMode !== WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
    throw new Error(`WFM-001 only supports ${WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
  }

  const count = normalizeCount(request.count);
  const { language, locale } = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const examProfile = resolveExamProfile(request.exam);
  const pool = resolveQlPool(request);
  const baseSeed = text(request.seed) || "wfm001-current-main-review-v1";
  const start = hash(`${baseSeed}:ql-start`) % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(start + index) % pool.length]!;
    const itemSeed = `${baseSeed}:${qlId}:${index}`;
    const numericSeed = hash(itemSeed);
    const generated = generateWfm001Question({
      qlId,
      seed: numericSeed,
      language: locale,
      examProfile,
      difficulty,
    });
    const correctIndex = generated.options.findIndex((option) => option.id === generated.correctOptionId);
    if (correctIndex < 0) throw new Error(`${qlId}: correct option id missing from generated options`);

    const options = generated.options.map((option) => option.text);
    const questionId = `WFM-001:${qlId}:${numericSeed}:${language}`;

    questions.push({
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      id: questionId,
      questionId,
      packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: qlId,
      canonicalProblemId: qlId,
      qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      task: generated.task,
      renderer: generated.renderer,
      subject: "Reasoning",
      topic: "Word Formation",
      subtopic: "Word Formation",
      language,
      locale,
      stem: generated.stem,
      text: generated.stem,
      sourceWord: generated.sourceWord ?? null,
      structuredPrompt: generated.structuredPrompt,
      options,
      optionRecords: generated.options,
      correctIndex,
      correct: correctIndex,
      canonicalAnswer: options[correctIndex],
      explanation: generated.explanation,
      difficulty: displayDifficulty(generated.difficulty),
      difficultyLabel: displayDifficulty(generated.difficulty),
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: difficulty ? generated.difficulty === difficulty : false,
      requestedExam: request.exam ?? null,
      examProfile,
      examProfileApplied: Boolean(request.exam),
      generationSeed: itemSeed,
      numericSeed,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WFM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      validation: {
        runtimeLifecycle: generated.metadata.lifecycle,
        sourceEvidenceStatus: generated.metadata.sourceEvidenceStatus,
        difficultyDerivedFromGeneratedInstance: generated.metadata.difficultyBasis === "GENERATED_INSTANCE",
        rawRuntimeQuestionStudioVisible: generated.metadata.questionStudioVisible,
        optionCountVerified: generated.options.length === 4,
      },
      traceability: {
        packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
        qlId,
        checkpointId: generated.checkpointId,
        runtimeVersion: generated.metadata.runtimeVersion,
        taxonomyAuthority: "REASONING-V1-TAXONOMY-AMENDMENT-WFM-001",
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      engineId: "reasoning-v1",
      packageId: WFM001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: WFM001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WFM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      permanentQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      cpIds: [...cpIds],
      language,
      requestedDifficulty: difficulty ? displayDifficulty(difficulty) : "Mixed",
      difficultyFilterApplied: Boolean(difficulty),
      examProfile,
      seed: baseSeed,
      count,
    },
  };
}
