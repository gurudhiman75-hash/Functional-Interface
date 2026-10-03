import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";

import {
  SEA003_CHECKPOINTS,
  SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID,
  SEA003_PERMANENT_QL_IDS,
  SEA003_QL_AUTHORITIES,
  type Sea003CheckpointId,
  type Sea003QlId,
} from "./authority.ts";
import {
  generateSea003Question,
  type Sea003Difficulty,
  type Sea003Language,
} from "./runtime.ts";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

const QL_DIFFICULTY: Readonly<Record<Sea003QlId, Sea003Difficulty>> = Object.freeze({
  "SEA-QL-043": "Medium",
  "SEA-QL-044": "Hard",
  "SEA-QL-045": "Hard",
  "SEA-QL-046": "Medium",
  "SEA-QL-047": "Hard",
  "SEA-QL-048": "Hard",
  "SEA-QL-049": "Easy",
  "SEA-QL-050": "Hard",
  "SEA-QL-051": "Easy",
});

const MIXED_ORDER: readonly Sea003QlId[] = Object.freeze([
  "SEA-QL-043",
  "SEA-QL-045",
  "SEA-QL-047",
  "SEA-QL-049",
  "SEA-QL-051",
  "SEA-QL-044",
  "SEA-QL-046",
  "SEA-QL-048",
  "SEA-QL-050",
]);

function hash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function isQl(value: string): value is Sea003QlId {
  return (SEA003_PERMANENT_QL_IDS as readonly string[]).includes(value);
}

function isCp(value: string): value is Sea003CheckpointId {
  return SEA003_CHECKPOINTS.some((entry) => entry.id === value);
}

function normalizeLanguage(value: unknown): Sea003Language {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("SEA-003 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): Sea003Difficulty | undefined {
  const difficulty = String(value ?? "").trim().toLowerCase();
  if (!difficulty || difficulty === "mixed") return undefined;
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error("SEA-003 difficulty must be Easy, Medium, Hard or Mixed.");
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 25) {
    throw new Error("SEA-003 review batches require count between 1 and 25.");
  }
  return value;
}

function explicitQl(request: QuestionStudioGenerationRequest): Sea003QlId | undefined {
  for (const raw of [request.questionLanguageId, request.patternId]) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (!value) continue;
    if (isQl(value)) return value;
    if (value.startsWith("SEA-QL-")) throw new Error("Unknown SEA-003 QL: " + value);
  }
  return undefined;
}

function explicitCp(request: QuestionStudioGenerationRequest): Sea003CheckpointId | undefined {
  for (const raw of [request.canonicalProblemId, request.patternId]) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (!value) continue;
    if (isCp(value)) return value;
    if (value.startsWith("SEA-CP-")) throw new Error("Unknown SEA-003 checkpoint: " + value);
  }
  return undefined;
}

function qlsForCp(cp: Sea003CheckpointId): Sea003QlId[] {
  return SEA003_QL_AUTHORITIES.filter((entry) => entry.checkpointId === cp).map((entry) => entry.qlId);
}

function resolvePool(
  request: QuestionStudioGenerationRequest,
  difficulty: Sea003Difficulty | undefined,
): Sea003QlId[] {
  const ql = explicitQl(request);
  if (ql) {
    if (difficulty && QL_DIFFICULTY[ql] !== difficulty) {
      throw new Error(ql + " is calibrated as " + QL_DIFFICULTY[ql] + ", not " + difficulty + ".");
    }
    return [ql];
  }

  const cp = explicitCp(request);
  const source = cp ? qlsForCp(cp) : [...MIXED_ORDER];
  const filtered = difficulty ? source.filter((id) => QL_DIFFICULTY[id] === difficulty) : source;
  if (filtered.length === 0) throw new Error("SEA-003 has no permanent QL for the requested scope/difficulty.");
  return filtered;
}

export const SEA_003_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: "SEA-003",
  subject: "Reasoning",
  topic: "Seating Arrangement",
  subtopic: "Conditional and Advanced Seating",
  label: "Reasoning · Conditional and Advanced Seating · SEA-003",
  enabled: true,
  cpIds: SEA003_CHECKPOINTS.map((entry) => entry.id),
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
    checkpointCount: SEA003_CHECKPOINTS.length,
    permanentQlCount: SEA003_PERMANENT_QL_IDS.length,
    permanentQlRange: "SEA-QL-043..SEA-QL-051",
    nextAvailablePermanentQl: SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID,
    exactFiniteEnumeration: true,
    deterministicGeneration: true,
    reviewOnly: true,
  },
};

export function isSea003QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === "SEA-003";

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  if (selectors.some((value) => isQl(value) || isCp(value))) return true;

  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return [
    "conditional and advanced seating",
    "attribute-linked seating",
    "vacant-seat seating",
    "vacant seat seating",
    "conditional seating",
    "uncertain-number seating",
    "uncertain number seating",
    "post-arrangement transformation",
  ].includes(subtopic);
}

export async function generateSea003QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== "review-only") {
    throw new Error("SEA-003 only supports review-only runtime.");
  }

  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const pool = resolvePool(request, difficulty);
  const seed = String(request.seed ?? "").trim() || "sea003-question-studio-v1";
  const broadDefault = !explicitQl(request) && !explicitCp(request) && !difficulty;
  const start = broadDefault ? hash(seed + ":cp-start") % Math.min(5, pool.length) : hash(seed + ":ql-start") % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(start + index) % pool.length]!;
    const generated = generateSea003Question(qlId, seed + ":" + qlId + ":" + index, language);
    const questionId = "SEA-003:" + qlId + ":" + language + ":" + hash(seed + ":" + index);
    questions.push({
      ...generated,
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: "SEA-003",
      patternId: qlId,
      qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      canonicalProblemId: generated.checkpointId,
      questionLanguageId: qlId,
      subject: "Reasoning",
      topic: "Seating Arrangement",
      subtopic: SEA003_CHECKPOINTS.find((entry) => entry.id === generated.checkpointId)?.label ?? "Advanced Seating",
      runtimeMode: "review-only",
      reviewOnly: true,
      readOnly: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      questionStudioRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      text: generated.stem,
      correct: generated.correctIndex,
      correctIndex: generated.correctIndex,
      difficulty: generated.difficulty,
      difficultyLabel: generated.difficulty,
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
      packageId: "SEA-003",
      runtimeMode: "review-only",
      checkpointIds: SEA003_CHECKPOINTS.map((entry) => entry.id),
      permanentQlIds: [...SEA003_PERMANENT_QL_IDS],
      permanentQlRange: "SEA-QL-043..SEA-QL-051",
      permanentQlCount: SEA003_PERMANENT_QL_IDS.length,
      nextAvailablePermanentQl: SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID,
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed,
      count,
    },
  };
}

export const SEA003_MIXED_QL_ORDER = MIXED_ORDER;
export const SEA003_QL_DIFFICULTY = QL_DIFFICULTY;
