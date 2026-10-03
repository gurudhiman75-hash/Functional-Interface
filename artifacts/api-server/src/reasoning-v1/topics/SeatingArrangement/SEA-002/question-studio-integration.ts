import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";

import {
  generateSea002Cp006QuestionStudioBatch,
} from "./cp006/question-studio-integration.ts";
import {
  SEA002_CP006_PERMANENT_QL_IDS,
} from "./cp006/permanent/registry.ts";
import {
  generateSea002Cp007QuestionStudioPreview,
} from "./cp007/question-studio-preintegration-v1.ts";
import {
  SEA002_CP007_PERMANENT_QL_IDS,
} from "./cp007/permanent/registry.ts";
import {
  generateSea002Cp008QuestionStudioBatchV1,
} from "./cp008/question-studio-integration-v1.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
} from "./cp008/permanent/registry.ts";
import {
  SEA002_ADVANCED_QL_AUTHORITIES,
  SEA002_CP009_PERMANENT_QL_IDS,
  SEA002_CP010_PERMANENT_QL_IDS,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
  type Sea002AdvancedQlId,
} from "./advanced-authority.ts";
import {
  generateSea002AdvancedQuestion,
  type Sea002AdvancedDifficulty,
  type Sea002AdvancedLanguage,
} from "./advanced-runtime.ts";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

type Sea002QlId =
  | (typeof SEA002_CP006_PERMANENT_QL_IDS)[number]
  | (typeof SEA002_CP007_PERMANENT_QL_IDS)[number]
  | (typeof SEA002_CP008_PERMANENT_QL_IDS)[number]
  | Sea002AdvancedQlId;

type Sea002CheckpointId =
  | "SEA-CP-006"
  | "SEA-CP-007"
  | "SEA-CP-008"
  | "SEA-CP-009"
  | "SEA-CP-010";

const CP_TO_QLS: Readonly<Record<Sea002CheckpointId, readonly Sea002QlId[]>> = Object.freeze({
  "SEA-CP-006": SEA002_CP006_PERMANENT_QL_IDS,
  "SEA-CP-007": SEA002_CP007_PERMANENT_QL_IDS,
  "SEA-CP-008": SEA002_CP008_PERMANENT_QL_IDS,
  "SEA-CP-009": SEA002_CP009_PERMANENT_QL_IDS,
  "SEA-CP-010": SEA002_CP010_PERMANENT_QL_IDS,
});

const ALL_QLS: readonly Sea002QlId[] = Object.freeze(
  Object.values(CP_TO_QLS).flat(),
);

const MIXED_QL_ORDER: readonly Sea002QlId[] = Object.freeze(
  Array.from({ length: Math.max(...Object.values(CP_TO_QLS).map((qls) => qls.length)) }, (_, offset) =>
    (Object.keys(CP_TO_QLS) as Sea002CheckpointId[])
      .map((cp) => CP_TO_QLS[cp][offset])
      .filter((ql): ql is Sea002QlId => Boolean(ql)),
  ).flat(),
);

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 25) {
    throw new Error("SEA-002 review batches require count between 1 and 25.");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): Sea002AdvancedLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("SEA-002 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): "Easy" | "Medium" | "Hard" | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed") return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error("SEA-002 difficulty must be Easy, Medium, Hard or Mixed.");
}

function isQl(value: string): value is Sea002QlId {
  return (ALL_QLS as readonly string[]).includes(value);
}

function isCp(value: string): value is Sea002CheckpointId {
  return Object.prototype.hasOwnProperty.call(CP_TO_QLS, value);
}

function checkpointForQl(qlId: Sea002QlId): Sea002CheckpointId {
  const found = (Object.keys(CP_TO_QLS) as Sea002CheckpointId[])
    .find((cp) => (CP_TO_QLS[cp] as readonly string[]).includes(qlId));
  if (!found) throw new Error("SEA-002 QL is missing checkpoint ownership: " + qlId);
  return found;
}

function qlSupportsDifficulty(qlId: Sea002QlId, difficulty: "Easy" | "Medium" | "Hard"): boolean {
  if ((SEA002_CP006_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) return true;
  if ((SEA002_CP007_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) return true;
  if ((SEA002_CP008_PERMANENT_QL_IDS as readonly string[]).includes(qlId)) return true;
  const authority = SEA002_ADVANCED_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  return Boolean(authority && (authority.supportedDifficulties as readonly string[]).includes(difficulty));
}

function explicitQl(request: QuestionStudioGenerationRequest): Sea002QlId | undefined {
  for (const raw of [request.questionLanguageId, request.patternId]) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (!value) continue;
    if (isQl(value)) return value;
    if (value.startsWith("SEA-QL-")) throw new Error("Unknown SEA-002 QL: " + value);
  }
  return undefined;
}

function explicitCp(request: QuestionStudioGenerationRequest): Sea002CheckpointId | undefined {
  for (const raw of [request.canonicalProblemId, request.patternId]) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (!value) continue;
    if (isCp(value)) return value;
    if (value.startsWith("SEA-CP-")) throw new Error("Unknown SEA-002 checkpoint: " + value);
  }
  return undefined;
}

function resolvePool(
  request: QuestionStudioGenerationRequest,
  difficulty: "Easy" | "Medium" | "Hard" | undefined,
): Sea002QlId[] {
  const ql = explicitQl(request);
  if (ql) {
    if (difficulty && !qlSupportsDifficulty(ql, difficulty)) {
      throw new Error(ql + " does not support " + difficulty + " difficulty.");
    }
    return [ql];
  }
  const cp = explicitCp(request);
  const source = cp ? [...CP_TO_QLS[cp]] : [...MIXED_QL_ORDER];
  const filtered = difficulty ? source.filter((id) => qlSupportsDifficulty(id, difficulty)) : source;
  if (filtered.length === 0) throw new Error("SEA-002 has no QL for the requested scope/difficulty.");
  return filtered;
}

function subtopicForCheckpoint(cp: Sea002CheckpointId): string {
  if (cp === "SEA-CP-006") return "Parallel Rows — Facing Each Other";
  if (cp === "SEA-CP-007") return "Parallel Rows — Mixed Facing";
  if (cp === "SEA-CP-008") return "Square Seating";
  if (cp === "SEA-CP-009") return "Rectangular and Polygonal Seating";
  return "Concentric and Dual-Group Seating";
}

function overlay(
  source: Record<string, unknown>,
  qlId: Sea002QlId,
  cp: Sea002CheckpointId,
  language: Sea002AdvancedLanguage,
  itemSeed: string,
  index: number,
): Record<string, unknown> {
  const options = Array.isArray(source.options) ? source.options : [];
  const correctIndex = Number(source.correctIndex ?? source.correct ?? 0);
  return {
    ...source,
    ...lifecycle,
    id: String(source.questionId ?? `SEA-002:${qlId}:${language}:${hash(itemSeed)}:${index}`),
    questionId: String(source.questionId ?? `SEA-002:${qlId}:${language}:${hash(itemSeed)}:${index}`),
    packageId: "SEA-002",
    patternId: qlId,
    qlId,
    cpId: cp,
    checkpointId: cp,
    canonicalProblemId: cp,
    questionLanguageId: qlId,
    subject: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: subtopicForCheckpoint(cp),
    language,
    runtimeMode: "review-only",
    reviewOnly: true,
    readOnly: true,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    questionStudioRegistered: true,
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    options,
    correct: correctIndex,
    correctIndex,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  };
}

async function generateOne(
  qlId: Sea002QlId,
  request: QuestionStudioGenerationRequest,
  language: Sea002AdvancedLanguage,
  difficulty: "Easy" | "Medium" | "Hard" | undefined,
  itemSeed: string,
  index: number,
): Promise<Record<string, unknown>> {
  const cp = checkpointForQl(qlId);
  const requestedDifficulty = difficulty ?? (hash(itemSeed + ":difficulty") % 2 === 0 ? "Medium" : "Hard");

  if (cp === "SEA-CP-006") {
    const batch = await generateSea002Cp006QuestionStudioBatch({
      canonicalProblemId: cp,
      questionLanguageId: qlId,
      language,
      difficulty: requestedDifficulty,
      seed: itemSeed,
      count: 1,
    });
    return overlay(batch.questions[0] as Record<string, unknown>, qlId, cp, language, itemSeed, index);
  }

  if (cp === "SEA-CP-007") {
    const questions = generateSea002Cp007QuestionStudioPreview({
      canonicalProblemId: cp,
      questionLanguageId: qlId,
      language,
      difficulty: requestedDifficulty,
      seed: itemSeed,
      count: 1,
    });
    return overlay(questions[0] as Record<string, unknown>, qlId, cp, language, itemSeed, index);
  }

  if (cp === "SEA-CP-008") {
    const batch = generateSea002Cp008QuestionStudioBatchV1({
      canonicalProblemId: cp,
      questionLanguageId: qlId,
      language,
      difficulty: requestedDifficulty,
      seed: itemSeed,
      count: 1,
    });
    return overlay(batch.questions[0] as Record<string, unknown>, qlId, cp, language, itemSeed, index);
  }

  const advancedDifficulty = (difficulty
    ?? (cp === "SEA-CP-010" || qlId === "SEA-QL-037" || qlId === "SEA-QL-039" ? "Hard" : "Medium")) as Sea002AdvancedDifficulty;
  const question = generateSea002AdvancedQuestion(
    qlId as Sea002AdvancedQlId,
    itemSeed,
    language,
    advancedDifficulty,
  );
  return overlay(question as unknown as Record<string, unknown>, qlId, cp, language, itemSeed, index);
}

export const SEA_002_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: "SEA-002",
  subject: "Reasoning",
  topic: "Seating Arrangement",
  subtopic: "Advanced Seating Arrangement",
  label: "Reasoning · Advanced Seating Arrangement · SEA-002",
  enabled: true,
  cpIds: ["SEA-CP-006", "SEA-CP-007", "SEA-CP-008", "SEA-CP-009", "SEA-CP-010"],
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
    permanentQlRange: "SEA-QL-021..SEA-QL-042",
    permanentQlCount: ALL_QLS.length,
    nextAvailablePermanentQl: SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
    checkpointCount: 5,
    cp006Status: "FROZEN_LEGACY_AUTHORITY_REVIEW_ROUTE",
    cp007Status: "CONTENT_REVIEWED_MANUAL_FREEZE_GATE_RETAINED",
    cp008Status: "APPROVED_FROZEN_REVIEW_ROUTE",
    cp009Status: "EXACT_ENUMERATION_REVIEW_ROUTE",
    cp010Status: "EXACT_ENUMERATION_REVIEW_ROUTE",
    deterministicGeneration: true,
    reviewOnly: true,
  },
};

export function isSea002QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === "SEA-002";
  const values = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  if (values.some((value) => isCp(value) || isQl(value))) return true;
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return [
    "advanced seating arrangement",
    "parallel rows",
    "mixed facing parallel rows",
    "square seating",
    "rectangular seating",
    "polygonal seating",
    "concentric seating",
    "concentric circles",
  ].includes(subtopic);
}

export async function generateSea002QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== "review-only") {
    throw new Error("SEA-002 only supports review-only runtime.");
  }
  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const pool = resolvePool(request, difficulty);
  const baseSeed = String(request.seed ?? "").trim() || "sea002-question-studio-v1";
  const broadDefault = !explicitQl(request) && !explicitCp(request) && !difficulty;
  const start = broadDefault
    ? hash(baseSeed + ":checkpoint-start") % Math.min(5, pool.length)
    : hash(baseSeed + ":ql-start") % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(start + index) % pool.length]!;
    const itemSeed = baseSeed + ":" + qlId + ":" + index;
    questions.push(await generateOne(qlId, request, language, difficulty, itemSeed, index));
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "SEA-002",
      runtimeMode: "review-only",
      permanentQlCount: ALL_QLS.length,
      permanentQlRange: "SEA-QL-021..SEA-QL-042",
      permanentQlIds: [...ALL_QLS],
      checkpointIds: [...SEA_002_QUESTION_STUDIO_PACKAGE.cpIds],
      requestedDifficulty: difficulty ?? "Mixed",
      language,
      seed: baseSeed,
      count,
    },
  };
}

export const SEA002_ALL_PERMANENT_QL_IDS = ALL_QLS;
export const SEA002_MIXED_QL_ORDER = MIXED_QL_ORDER;
