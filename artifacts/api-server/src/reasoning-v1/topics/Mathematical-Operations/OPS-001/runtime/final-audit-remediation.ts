import type { ApprovedOpsQuestion } from "../pilot/approved-teaching-canonical";

export type OpsInstanceDifficulty = "Easy" | "Medium" | "Hard";

export type OpsDifficultyAssessment = {
  readonly difficulty: OpsInstanceDifficulty;
  readonly score: number;
  readonly factors: readonly string[];
};

const OPTION_EVALUATION_CANDIDATES = new Set([
  "OPS-CAND-003",
  "OPS-CAND-007",
  "OPS-CAND-008",
  "OPS-CAND-019",
  "OPS-CAND-022",
  "OPS-CAND-025",
  "OPS-CAND-029",
  "OPS-CAND-032",
  "OPS-CAND-034",
]);

const INVERSE_SEARCH_CANDIDATES = new Set([
  "OPS-CAND-016",
  "OPS-CAND-017",
  "OPS-CAND-018",
  "OPS-CAND-020",
  "OPS-CAND-023",
  "OPS-CAND-026",
  "OPS-CAND-027",
]);

const COMPOUND_CANDIDATES = new Set([
  "OPS-CAND-015",
  "OPS-CAND-017",
  "OPS-CAND-026",
  "OPS-CAND-027",
  "OPS-CAND-028",
  "OPS-CAND-029",
]);

const HIDDEN_MAPPING_CANDIDATES = new Set([
  "OPS-CAND-030",
  "OPS-CAND-032",
  "OPS-CAND-033",
  "OPS-CAND-034",
]);

function optionValues(question: ApprovedOpsQuestion): readonly string[] {
  return question.options.map((option) => option.value);
}

function hasCloseNumericDistractor(question: ApprovedOpsQuestion): boolean {
  const answer = Number(question.answer);
  if (!Number.isFinite(answer)) return false;
  const wrong = optionValues(question)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value !== answer);
  if (wrong.length === 0) return false;
  const closest = Math.min(...wrong.map((value) => Math.abs(value - answer)));
  return closest <= Math.max(2, Math.abs(answer) * 0.08);
}

/**
 * Difficulty is derived only from the visible/generated instance and its
 * solver topology. Seed identity and raw number magnitude never contribute.
 */
export function assessOpsInstanceDifficulty(question: ApprovedOpsQuestion): OpsDifficultyAssessment {
  let score = 0;
  const factors: string[] = [];

  const stepCount = question.explanation.steps.length;
  if (stepCount >= 7) {
    score += 2;
    factors.push("LONG_MULTI_STAGE_TRACE");
  } else if (stepCount >= 4) {
    score += 1;
    factors.push("MULTI_STAGE_TRACE");
  }

  const uniqueOperators = new Set(question.stem.match(/[+−×÷]/gu) ?? []).size;
  if (uniqueOperators >= 4) {
    score += 2;
    factors.push("FOUR_OPERATOR_BURDEN");
  } else if (uniqueOperators >= 2) {
    score += 1;
    factors.push("MULTI_OPERATOR_BURDEN");
  }

  if (OPTION_EVALUATION_CANDIDATES.has(question.candidateId)) {
    score += 2;
    factors.push("OPTION_EVALUATION");
  }
  if (INVERSE_SEARCH_CANDIDATES.has(question.candidateId)) {
    score += 2;
    factors.push("INVERSE_SEARCH");
  }
  if (COMPOUND_CANDIDATES.has(question.candidateId)) {
    score += 2;
    factors.push("COMPOUND_TRANSFORMATION");
  }
  if (HIDDEN_MAPPING_CANDIDATES.has(question.candidateId)) {
    score += 2;
    factors.push("HIDDEN_MAPPING_INFERENCE");
  }

  if (/relation|statement|true equation/iu.test(`${question.taskKind} ${question.solveMode} ${question.stem}`)) {
    score += 1;
    factors.push("RELATION_OR_TRUTH_BOUNDARY");
  }

  if (/digit/iu.test(`${question.taskKind} ${question.solveMode}`)) {
    score += 1;
    factors.push("GLOBAL_DIGIT_REBUILD");
  }

  if (/^-|\/|\./u.test(question.answer)) {
    score += 1;
    factors.push("SIGNED_OR_NON_INTEGER_RESULT");
  }

  if (hasCloseNumericDistractor(question)) {
    score += 1;
    factors.push("CLOSE_NUMERIC_DISTRACTOR");
  }

  const evidenceCount = Number(question.metadata.evidenceCount ?? 0);
  if (Number.isFinite(evidenceCount) && evidenceCount >= 2) {
    score += 1;
    factors.push("MULTIPLE_EVIDENCE_ITEMS");
  }

  const difficulty: OpsInstanceDifficulty = score >= 8 ? "Hard" : score >= 4 ? "Medium" : "Easy";
  return { difficulty, score, factors };
}

export function withOpsInstanceDifficulty<T extends ApprovedOpsQuestion>(question: T): T & {
  readonly instanceDifficulty: OpsDifficultyAssessment;
} {
  const instanceDifficulty = assessOpsInstanceDifficulty(question);
  return {
    ...question,
    metadata: {
      ...question.metadata,
      instanceDifficulty: instanceDifficulty.difficulty,
      instanceDifficultyScore: instanceDifficulty.score,
      instanceDifficultyFactors: instanceDifficulty.factors.join("|"),
      difficultyDerivedFromInstance: true,
      seedUsedAsDifficultyInput: false,
    },
    instanceDifficulty,
  };
}
