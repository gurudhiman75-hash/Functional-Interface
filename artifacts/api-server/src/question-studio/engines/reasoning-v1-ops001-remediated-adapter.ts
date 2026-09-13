import {
  reasoningV1QuestionStudioAdapter as baseAdapter,
  OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
} from "./reasoning-v1-adapter";
import type {
  QuestionStudioDifficulty,
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioGeneratedQuestion,
  QuestionStudioPackageDefinition,
} from "../engine-types";

const DIFFICULTIES: readonly QuestionStudioDifficulty[] = ["Easy", "Medium", "Hard"];
const MAX_ATTEMPTS_PER_ITEM = 120;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function requestedDifficulty(value: unknown): QuestionStudioDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function numeric(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

/**
 * Difficulty is derived from the generated visible reasoning burden rather than
 * from QL identity or the seed itself. The score deliberately ignores operand
 * magnitude, string length and raw seed values.
 */
export function deriveOps001InstanceDifficulty(
  question: QuestionStudioGeneratedQuestion,
): { difficulty: QuestionStudioDifficulty; score: number; factors: string[] } {
  const solveMode = text(question.solveMode);
  const taskKind = text(question.taskKind);
  const validation = record(question.validation);
  const packageExplanation = record(question.packageExplanation);
  const steps = Array.isArray(packageExplanation.steps) ? packageExplanation.steps.length : 0;
  const eligible = numeric(validation.eligibleCandidateCount, 1);
  const factors: string[] = [];
  let score = 0;

  if (/infer|recoverOneUnknown|hidden/iu.test(solveMode) || /INFER_/u.test(taskKind)) {
    score += 3;
    factors.push("hidden-rule inference");
  }
  if (/compound|double/iu.test(solveMode)) {
    score += 2;
    factors.push("multiple simultaneous transformations");
  }
  if (/select|identify/iu.test(solveMode)) {
    score += 1;
    factors.push("option-wise verification or inverse search");
  }
  if (/relation/iu.test(solveMode) || /RELATION/u.test(taskKind)) {
    score += 1;
    factors.push("relation-boundary reasoning");
  }
  if (/digit/iu.test(solveMode)) {
    score += 1;
    factors.push("global digit reconstruction");
  }
  if (eligible >= 12) {
    score += 2;
    factors.push("large ambiguity/search pool");
  } else if (eligible >= 4) {
    score += 1;
    factors.push("multi-candidate search pool");
  }
  if (steps >= 8) {
    score += 2;
    factors.push("long verified reasoning chain");
  } else if (steps >= 5) {
    score += 1;
    factors.push("multi-step verified reasoning chain");
  }

  const difficulty: QuestionStudioDifficulty = score >= 6 ? "Hard" : score >= 3 ? "Medium" : "Easy";
  return { difficulty, score, factors };
}

function annotate(
  result: QuestionStudioGenerationResult,
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  const questions = result.questions.map((question) => {
    const derived = deriveOps001InstanceDifficulty(question);
    return {
      ...question,
      difficulty: derived.difficulty,
      difficultyLabel: derived.difficulty,
      difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty(request.difficulty) != null,
      difficultyScore: derived.score,
      difficultyFactors: derived.factors,
    };
  });
  return {
    ...result,
    questions,
    generationContext: {
      ...(result.generationContext ?? {}),
      requestedDifficulty: request.difficulty ?? null,
      difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
      difficultyFilterApplied: requestedDifficulty(request.difficulty) != null,
      productionDifficultyClaimsAuthorized: false,
    },
  };
}

async function generateOne(
  request: QuestionStudioGenerationRequest,
  seed: string,
): Promise<QuestionStudioGeneratedQuestion> {
  const result = annotate(await baseAdapter.generate({ ...request, count: 1, seed }), request);
  const question = result.questions[0];
  if (!question) throw new Error("OPS-001 remediation adapter generated no question");
  return question;
}

async function generateFiltered(
  request: QuestionStudioGenerationRequest,
  difficulty: QuestionStudioDifficulty,
): Promise<QuestionStudioGenerationResult> {
  const count = request.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("OPS-001 review batches require count between 1 and 50");
  }
  const baseSeed = text(request.seed) || "ops001-instance-difficulty-v1";
  const questions: QuestionStudioGeneratedQuestion[] = [];
  let attempts = 0;

  while (questions.length < count && attempts < count * MAX_ATTEMPTS_PER_ITEM) {
    const question = await generateOne(
      { ...request, difficulty: undefined },
      `${baseSeed}:difficulty:${difficulty}:${attempts}`,
    );
    const derived = deriveOps001InstanceDifficulty(question);
    if (derived.difficulty === difficulty) {
      questions.push({
        ...question,
        requestedDifficulty: difficulty,
        requestedDifficultyApplied: true,
      });
    }
    attempts += 1;
  }

  if (questions.length !== count) {
    throw new Error(
      `OPS-001 could produce only ${questions.length}/${count} ${difficulty} items after ${attempts} bounded attempts for the selected scope.`,
    );
  }

  return {
    questions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: "OPS-001",
      runtimeMode: "review-only",
      requestedDifficulty: difficulty,
      difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
      difficultyFilterApplied: true,
      attempts,
      count,
      seed: baseSeed,
      publiclyPublishable: false,
      productionReleaseAuthorized: false,
    },
  };
}

function remediatedPackage(): QuestionStudioPackageDefinition {
  return {
    ...OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
    supportedDifficulties: [...DIFFICULTIES],
    difficultyFilterSupported: true,
    metadata: {
      ...(OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}),
      difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
      difficultySelectionStatus: "BOUNDED_FILTER_SUPPORTED",
      productionDifficultyClaimsAuthorized: false,
      auditRemediationVersion: "OPS-001-AUDIT-REMEDIATION-V1",
    },
  };
}

export const reasoningV1Ops001RemediatedAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [remediatedPackage()];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const difficulty = requestedDifficulty(request.difficulty);
    if (difficulty) return generateFiltered(request, difficulty);
    return annotate(await baseAdapter.generate(request), request);
  },
};
