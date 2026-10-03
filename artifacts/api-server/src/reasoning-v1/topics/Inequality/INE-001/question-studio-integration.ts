import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  INE_001_CHECKPOINT_IDS,
  INE_001_CONTENT_CLOSURE,
  INE_001_FREEZE_VERSION,
  INE_001_PACKAGE_ID,
  INE_001_PERMANENT_QL_IDS,
  INE_001_QL_AUTHORITIES,
  INE_001_RUNTIME_MODE,
  ine001AuthorityForQl,
  isIne001QlId,
  type IneQlId,
} from "./ine-001-authority";
import {
  generateIne001Question,
  type IneDifficulty,
  type IneLanguage,
} from "./ine-001-runtime";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("INE-001 review batches require count between 1 and 50.");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): IneLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("INE-001 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): IneDifficulty | undefined {
  const difficulty = String(value ?? "").trim().toLowerCase();
  if (!difficulty || difficulty === "mixed") return undefined;
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error("INE-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function requestedQl(request: QuestionStudioGenerationRequest): IneQlId | undefined {
  const selectors = [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ].map((value) => String(value ?? "").trim().toUpperCase()).filter(Boolean);

  const qls = selectors.filter(isIne001QlId);
  if (new Set(qls).size > 1) throw new Error("Conflicting INE-001 QL selectors.");
  const unknown = selectors.find((value) => value.startsWith("INE-QL-") && !isIne001QlId(value));
  if (unknown) throw new Error("Unknown INE-001 QL: " + unknown);
  return qls[0] as IneQlId | undefined;
}

function requestedCheckpoint(request: QuestionStudioGenerationRequest): string | undefined {
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (!pattern.startsWith("INE-CP-")) return undefined;
  if (!(INE_001_CHECKPOINT_IDS as readonly string[]).includes(pattern)) {
    throw new Error("Unknown INE-001 checkpoint: " + pattern);
  }
  return pattern;
}

function qlPool(request: QuestionStudioGenerationRequest): IneQlId[] {
  const ql = requestedQl(request);
  if (ql) return [ql];
  const cp = requestedCheckpoint(request);
  if (cp) {
    return INE_001_QL_AUTHORITIES
      .filter((entry) => entry.checkpointId === cp)
      .map((entry) => entry.qlId);
  }
  return [...INE_001_PERMANENT_QL_IDS];
}

export const INE_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: INE_001_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Reasoning",
  subtopic: "Inequality",
  label: "Reasoning · Inequality · INE-001",
  enabled: true,
  cpIds: [...INE_001_CHECKPOINT_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: INE_001_RUNTIME_MODE,
  supportedRuntimeModes: [INE_001_RUNTIME_MODE],
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
    freezeVersion: INE_001_FREEZE_VERSION,
    closureAuthorityId: INE_001_CONTENT_CLOSURE.authorityId,
    permanentQlCount: INE_001_PERMANENT_QL_IDS.length,
    permanentQlRange: INE_001_CONTENT_CLOSURE.permanentQlRange,
    nextAvailablePermanentQl: INE_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
    sourcePosture: INE_001_CONTENT_CLOSURE.sourcePosture,
    sourceSaturationClaim: INE_001_CONTENT_CLOSURE.sourceSaturationClaim,
    deterministicGeneration: true,
    solverVerified: true,
    multilingual: true,
    reviewOnly: true,
  },
};

export function isIne001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === INE_001_PACKAGE_ID;
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (pattern === INE_001_PACKAGE_ID || pattern.startsWith("INE-QL-") || pattern.startsWith("INE-CP-")) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return topic === "inequality" || subtopic === "inequality" || subtopic === "inequalities";
}

export async function generateIne001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== INE_001_RUNTIME_MODE) {
    throw new Error("INE-001 only supports review-only runtime.");
  }

  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const pool = qlPool(request);
  const baseSeed = String(request.seed ?? "").trim() || "ine001-question-studio-v1";
  const start = hash(baseSeed + ":ql-start") % pool.length;
  const questions: Record<string, unknown>[] = [];
  const maxAttempts = Math.max(count * 80, 200);
  let attempt = 0;

  while (questions.length < count && attempt < maxAttempts) {
    const qlId = pool[(start + attempt) % pool.length]!;
    const itemSeed = baseSeed + ":" + qlId + ":" + attempt;
    const generated = generateIne001Question(qlId, itemSeed, language);
    attempt += 1;
    if (difficulty && generated.difficulty !== difficulty) continue;

    const authority = ine001AuthorityForQl(qlId);
    const questionId = "INE-001:" + qlId + ":" + language + ":" + hash(itemSeed);
    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: INE_001_PACKAGE_ID,
      patternId: qlId,
      qlId,
      cpId: authority.checkpointId,
      checkpointId: authority.checkpointId,
      subject: "Reasoning",
      topic: "Reasoning",
      subtopic: "Inequality",
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
      runtimeMode: INE_001_RUNTIME_MODE,
      reviewOnly: true,
      readOnly: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: INE_001_CONTENT_CLOSURE.authorityId,
      traceability: {
        packageId: INE_001_PACKAGE_ID,
        qlId,
        checkpointId: authority.checkpointId,
        solveContract: authority.solveContract,
        answerSemantic: authority.answerSemantic,
        sourceEvidenceRefs: [...authority.sourceEvidenceRefs],
        freezeVersion: INE_001_FREEZE_VERSION,
      },
      validation: {
        solverVerified: generated.metadata.solverVerified,
        deterministic: generated.metadata.deterministic,
        sourceBackedCore: generated.metadata.sourceBackedCore,
        worldCount: generated.proof.worldCount,
        optionCount: generated.options.length,
        uniqueOptions: new Set(generated.options).size === generated.options.length,
        exactlyOneCorrectIndex: generated.correctIndex >= 0 && generated.correctIndex < generated.options.length,
      },
    });
  }

  if (questions.length !== count) {
    throw new Error(
      "Unable to generate " + count + " INE-001 questions matching " +
      String(difficulty ?? "Mixed") + " within deterministic candidate budget.",
    );
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: INE_001_PACKAGE_ID,
      runtimeMode: INE_001_RUNTIME_MODE,
      closureAuthorityId: INE_001_CONTENT_CLOSURE.authorityId,
      freezeVersion: INE_001_FREEZE_VERSION,
      permanentQlCount: INE_001_PERMANENT_QL_IDS.length,
      permanentQlIds: [...INE_001_PERMANENT_QL_IDS],
      checkpointIds: [...INE_001_CHECKPOINT_IDS],
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed: baseSeed,
      count,
    },
  };
}
