import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  FLR_001_CHECKPOINT_IDS,
  FLR_001_CONTENT_CLOSURE,
  FLR_001_FREEZE_VERSION,
  FLR_001_PACKAGE_ID,
  FLR_001_PERMANENT_QL_IDS,
  FLR_001_QL_AUTHORITIES,
  FLR_001_RUNTIME_MODE,
  flr001AuthorityForQl,
  isFlr001QlId,
  type FlrQlId,
} from "./flr-001-authority";
import {
  generateFlr001Question,
  type FlrDifficulty,
  type FlrLanguage,
} from "./flr-001-runtime";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 30) {
    throw new Error("FLR-001 review batches require count between 1 and 30.");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): FlrLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("FLR-001 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): FlrDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed") return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error("FLR-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function requestedQl(request: QuestionStudioGenerationRequest): FlrQlId | undefined {
  const selectors = [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ].map((value) => String(value ?? "").trim().toUpperCase()).filter(Boolean);

  const qls = selectors.filter(isFlr001QlId);
  if (new Set(qls).size > 1) throw new Error("Conflicting FLR-001 QL selectors.");
  const unknown = selectors.find((value) => value.startsWith("FLR-QL-") && !isFlr001QlId(value));
  if (unknown) throw new Error("Unknown FLR-001 QL: " + unknown);
  return qls[0] as FlrQlId | undefined;
}

function requestedCheckpoint(request: QuestionStudioGenerationRequest): string | undefined {
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (!pattern.startsWith("FLR-CP-")) return undefined;
  if (!(FLR_001_CHECKPOINT_IDS as readonly string[]).includes(pattern)) {
    throw new Error("Unknown FLR-001 checkpoint: " + pattern);
  }
  return pattern;
}

function qlPool(request: QuestionStudioGenerationRequest, difficulty?: FlrDifficulty): FlrQlId[] {
  const selected = requestedQl(request);
  if (selected) return [selected];

  const cp = requestedCheckpoint(request);
  let pool = cp
    ? FLR_001_QL_AUTHORITIES.filter((entry) => entry.checkpointId === cp).map((entry) => entry.qlId)
    : [...FLR_001_PERMANENT_QL_IDS];

  if (difficulty) {
    pool = pool.filter((qlId) =>
      (flr001AuthorityForQl(qlId).supportedDifficulties as readonly string[]).includes(difficulty),
    );
  }
  if (pool.length === 0) {
    throw new Error("No FLR-001 QL supports the requested scope/difficulty.");
  }
  return pool;
}

export const FLR_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: FLR_001_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Reasoning",
  subtopic: "Floor and Flat Arrangement",
  label: "Reasoning · Floor and Flat Arrangement · FLR-001",
  enabled: true,
  cpIds: [...FLR_001_CHECKPOINT_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: FLR_001_RUNTIME_MODE,
  supportedRuntimeModes: [FLR_001_RUNTIME_MODE],
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
    freezeVersion: FLR_001_FREEZE_VERSION,
    closureAuthorityId: FLR_001_CONTENT_CLOSURE.authorityId,
    permanentQlCount: FLR_001_PERMANENT_QL_IDS.length,
    permanentQlRange: FLR_001_CONTENT_CLOSURE.permanentQlRange,
    nextAvailablePermanentQl: FLR_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
    sourcePosture: FLR_001_CONTENT_CLOSURE.sourcePosture,
    sourceSaturationClaim: FLR_001_CONTENT_CLOSURE.sourceSaturationClaim,
    deterministicGeneration: true,
    exactFiniteEnumeration: true,
    solverVerified: true,
    multilingual: true,
    reviewOnly: true,
  },
};

export function isFlr001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === FLR_001_PACKAGE_ID;
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (pattern === FLR_001_PACKAGE_ID || pattern.startsWith("FLR-QL-") || pattern.startsWith("FLR-CP-")) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return [
    "floor arrangement",
    "floor puzzle",
    "floor and flat arrangement",
    "floor flat arrangement",
    "flat puzzle",
  ].includes(topic) || [
    "floor arrangement",
    "floor puzzle",
    "floor and flat arrangement",
    "floor flat arrangement",
    "flat puzzle",
  ].includes(subtopic);
}

export async function generateFlr001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== FLR_001_RUNTIME_MODE) {
    throw new Error("FLR-001 only supports review-only runtime.");
  }

  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const pool = qlPool(request, difficulty);
  const baseSeed = String(request.seed ?? "").trim() || "flr001-question-studio-v1";
  const start = hash(baseSeed + ":ql-start") % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(start + index) % pool.length]!;
    const authority = flr001AuthorityForQl(qlId);
    const itemSeed = baseSeed + ":" + qlId + ":" + index;
    const generated = generateFlr001Question(qlId, itemSeed, language, difficulty);
    const questionId = "FLR-001:" + qlId + ":" + language + ":" + hash(itemSeed);
    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: FLR_001_PACKAGE_ID,
      patternId: qlId,
      qlId,
      cpId: authority.checkpointId,
      checkpointId: authority.checkpointId,
      subject: "Reasoning",
      topic: "Reasoning",
      subtopic: "Floor and Flat Arrangement",
      language,
      locale: generated.locale,
      stem: generated.stem,
      text: generated.stem,
      options: [...generated.options],
      correct: generated.correctIndex,
      correctIndex: generated.correctIndex,
      answer: generated.options[generated.correctIndex],
      canonicalAnswer: generated.canonicalAnswer,
      explanation: generated.explanation,
      difficulty: generated.difficulty,
      difficultyLabel: generated.difficulty,
      generationSeed: itemSeed,
      runtimeMode: FLR_001_RUNTIME_MODE,
      reviewOnly: true,
      readOnly: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: FLR_001_CONTENT_CLOSURE.authorityId,
      traceability: {
        packageId: FLR_001_PACKAGE_ID,
        qlId,
        checkpointId: authority.checkpointId,
        solveContract: authority.solveContract,
        answerSemantic: authority.answerSemantic,
        sourceEvidenceRefs: [...authority.sourceEvidenceRefs],
        freezeVersion: FLR_001_FREEZE_VERSION,
      },
      validation: {
        solverVerified: generated.metadata.solverVerified,
        deterministic: generated.metadata.deterministic,
        exactFiniteEnumeration: generated.metadata.exactFiniteEnumeration,
        sourceBackedCore: generated.metadata.sourceBackedCore,
        worldCountBefore: generated.proof.worldCountBefore,
        worldCountAfter: generated.proof.worldCountAfter,
        uniqueSolution: generated.proof.uniqueSolution,
        clueCount: generated.proof.clueCount,
        uniqueOptions: new Set(generated.options).size === generated.options.length,
        exactlyOneCorrectIndex: generated.correctIndex >= 0 && generated.correctIndex < generated.options.length,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: FLR_001_PACKAGE_ID,
      runtimeMode: FLR_001_RUNTIME_MODE,
      closureAuthorityId: FLR_001_CONTENT_CLOSURE.authorityId,
      freezeVersion: FLR_001_FREEZE_VERSION,
      permanentQlCount: FLR_001_PERMANENT_QL_IDS.length,
      permanentQlIds: [...FLR_001_PERMANENT_QL_IDS],
      checkpointIds: [...FLR_001_CHECKPOINT_IDS],
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed: baseSeed,
      count,
    },
  };
}
