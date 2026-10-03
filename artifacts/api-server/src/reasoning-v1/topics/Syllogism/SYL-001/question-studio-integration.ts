import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle";
import {
  previewSyl001QuestionStudio,
  SYL_001_QUESTION_STUDIO_QL_IDS,
  SYL_001_QUESTION_STUDIO_RUNTIME_MODE,
  type Syl001QuestionStudioDifficulty,
  type Syl001QuestionStudioLanguage,
} from "./question-studio-adapter";
import type { SylQlId } from "./runtime/types";

const CP_TO_QLS: Readonly<Record<string, readonly SylQlId[]>> = Object.freeze({
  "SYL-CP-001": ["SYL-QL-001", "SYL-QL-002"],
  "SYL-CP-002": ["SYL-QL-003", "SYL-QL-004"],
  "SYL-CP-003": ["SYL-QL-005", "SYL-QL-006", "SYL-QL-007"],
  "SYL-CP-004": ["SYL-QL-008", "SYL-QL-009"],
  "SYL-CP-005": ["SYL-QL-010", "SYL-QL-011", "SYL-QL-012"],
  "SYL-CP-006": ["SYL-QL-013", "SYL-QL-014", "SYL-QL-015"],
  "SYL-CP-007": ["SYL-QL-016", "SYL-QL-017", "SYL-QL-018"],
});

const CANONICAL_MOCK_QLS: readonly SylQlId[] = [
  "SYL-QL-001",
  "SYL-QL-003",
  "SYL-QL-004",
  "SYL-QL-008",
];

const MIXED_REVIEW_ORDER: readonly SylQlId[] = Object.freeze([
  ...CANONICAL_MOCK_QLS,
  ...SYL_001_QUESTION_STUDIO_QL_IDS.filter(
    (qlId) => !CANONICAL_MOCK_QLS.includes(qlId),
  ),
]);

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isQl(value: string): value is SylQlId {
  return (SYL_001_QUESTION_STUDIO_QL_IDS as readonly string[]).includes(value);
}

function isCp(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(CP_TO_QLS, value);
}

function normalizeLanguage(
  value: QuestionStudioGenerationRequest["language"],
): Syl001QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("SYL-001 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): Syl001QuestionStudioDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error("SYL-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 25) {
    throw new Error("SYL-001 review batches require count between 1 and 25.");
  }
  return value;
}

function explicitQl(request: QuestionStudioGenerationRequest): SylQlId | undefined {
  for (const raw of [request.questionLanguageId, request.patternId]) {
    const value = text(raw).toUpperCase();
    if (!value) continue;
    if (isQl(value)) return value;
    if (value.startsWith("SYL-QL-")) throw new Error("Unknown SYL-001 QL: " + value);
  }
  return undefined;
}

function explicitCp(
  request: QuestionStudioGenerationRequest,
): keyof typeof CP_TO_QLS | undefined {
  for (const raw of [request.canonicalProblemId, request.patternId]) {
    const value = text(raw).toUpperCase();
    if (!value || value === "SYL-001") continue;
    if (isCp(value)) return value as keyof typeof CP_TO_QLS;
    if (value.startsWith("SYL-CP-")) throw new Error("Unknown SYL-001 checkpoint: " + value);
  }
  return undefined;
}

function checkpointForQl(qlId: SylQlId): string {
  const found = Object.entries(CP_TO_QLS).find(([, qls]) => qls.includes(qlId));
  if (!found) throw new Error("Missing SYL checkpoint ownership for " + qlId);
  return found[0];
}

function resolvePool(request: QuestionStudioGenerationRequest): SylQlId[] {
  const ql = explicitQl(request);
  if (ql) return [ql];
  const cp = explicitCp(request);
  if (cp) return [...CP_TO_QLS[cp]];
  return [...MIXED_REVIEW_ORDER];
}

export const SYL_001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: "SYL-001",
  subject: "Reasoning",
  topic: "Syllogism",
  subtopic: "Syllogism",
  label: "Reasoning · Syllogism · SYL-001",
  enabled: true,
  cpIds: Object.keys(CP_TO_QLS),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
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
    runtimeAuthority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
    generatorVersion: "generator-v5",
    permanentQlRange: "SYL-QL-001..SYL-QL-018",
    compatibilityQlCount: 18,
    canonicalLegacyMockQlIds: [...CANONICAL_MOCK_QLS],
    canonicalLegacyMockArchetypeCount: 4,
    diagramArchitecture: "SYL_V5_EXACT_VENN_WITH_VEN_001_SHARED_GEOMETRY",
    diagramPolicy: "VERIFIED_SIMPLE_VENN_OR_OMIT",
    sourceWeightingStatus: "NOT_FROZEN",
    productionDifficultyCalibrationStatus: "NOT_FROZEN",
    reviewOnly: true,
  },
};

export function isSyl001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === "SYL-001";
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase());
  if (selectors.some((value) => isQl(value) || isCp(value))) return true;
  return text(request.topic).toLowerCase() === "syllogism"
    || text(request.subtopic).toLowerCase() === "syllogism";
}

export async function generateSyl001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== "review-only") {
    throw new Error("SYL-001 only supports review-only runtime.");
  }

  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = normalizeCount(request.count);
  const pool = resolvePool(request);
  const seedText = text(request.seed) || "syl001-standard-review-v1";
  const baseSeed = hash(seedText);
  const broadDefault = !explicitQl(request) && !explicitCp(request);
  const start = broadDefault ? 0 : hash(seedText + ":start") % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(start + index) % pool.length]!;
    const preview = previewSyl001QuestionStudio({
      language,
      qlId,
      difficulty,
      seed: baseSeed + index * 1009,
      count: 1,
    }).questions[0]!;
    const cpId = checkpointForQl(qlId);
    const explanationDetails = preview.explanation;
    const explanation = [
      preview.explanation.preTestDirection,
      ...preview.explanation.shortReasoning,
      preview.explanation.conclusion,
    ].filter(Boolean).join("\n\n");

    questions.push({
      ...preview,
      ...lifecycle,
      id: preview.questionId,
      packageId: "SYL-001",
      patternId: qlId,
      qlId,
      cpId,
      checkpointId: cpId,
      canonicalProblemId: cpId,
      questionLanguageId: qlId,
      subject: "Reasoning",
      topic: "Syllogism",
      subtopic: "Syllogism",
      language,
      runtimeMode: "review-only",
      reviewOnly: true,
      readOnly: true,
      text: preview.stem,
      stem: preview.stem,
      difficulty: preview.difficultyBand,
      difficultyLabel: preview.difficultyBand,
      explanation,
      explanationDetails,
      diagramSvg: preview.renderer.diagramSvg,
      diagramCaption: preview.renderer.diagramCaption,
      correct: preview.correctIndex,
      correctIndex: preview.correctIndex,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "SYL-001",
      runtimeMode: "review-only",
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed: seedText,
      count,
      permanentQlIds: [...SYL_001_QUESTION_STUDIO_QL_IDS],
      canonicalLegacyMockQlIds: [...CANONICAL_MOCK_QLS],
      sourceWeightingStatus: "NOT_FROZEN",
      productionDifficultyCalibrationStatus: "NOT_FROZEN",
      legacyRuntimeMode: SYL_001_QUESTION_STUDIO_RUNTIME_MODE,
    },
  };
}
