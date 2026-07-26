import type { CodDifficulty, GeneratedOption } from "./types";

export interface CodDifficultyInput {
  checkpointId: string;
  ruleId: string;
  taskKind: string;
  targetLength: number;
  evidenceCount: number;
  options: readonly GeneratedOption[];
  allowedDifficulties?: readonly CodDifficulty[];
}

export interface CodDifficultyAssessment {
  difficulty: CodDifficulty;
  score: number;
  factors: {
    ruleComplexity: number;
    transformationDepth: number;
    inferenceBurden: number;
    informationDensity: number;
    distractorProximity: number;
  };
}

const ORDER: readonly CodDifficulty[] = ["EASY", "MEDIUM", "HARD"];

function ruleComplexity(checkpointId: string, ruleId: string): number {
  if (checkpointId === "COD-CP-001") return 0;
  if (checkpointId === "COD-CP-002") {
    if (ruleId === "POSITION_WEIGHTED_SUM") return 2;
    if ([
      "RANK_PLUS_CONSTANT_SEQUENCE",
      "RANK_MINUS_CONSTANT_SEQUENCE",
      "SUM_OF_FORWARD_RANKS",
      "SUM_PLUS_WORD_LENGTH",
      "SUM_MINUS_WORD_LENGTH",
      "ODD_EVEN_POSITION_DIFFERENCE",
    ].includes(ruleId)) return 1;
    return 0;
  }
  if (checkpointId === "COD-CP-003") return ruleId === "UNIFORM_CYCLIC_SHIFT" ? 1 : 0;
  if (checkpointId === "COD-CP-004") return 1;
  if (checkpointId === "COD-CP-005") {
    if (ruleId === "OUTER_INNER_INTERLEAVING") return 2;
    if (ruleId === "REVERSE_SEQUENCE") return 0;
    return 1;
  }
  if (checkpointId === "COD-CP-006") {
    if (["ROTATE_THEN_CLASS_SHIFT", "OPPOSITE_MAP_WITH_POSITION_PERMUTATION", "TRANSFORM_THEN_RANK_SEQUENCE"].includes(ruleId)) return 2;
    return 1;
  }
  return 1;
}

function transformationDepth(checkpointId: string): number {
  return checkpointId === "COD-CP-006" ? 1 : 0;
}

function inferenceBurden(taskKind: string, checkpointId: string, targetLength: number): number {
  if (taskKind.includes("INFER")) return 1;
  if (taskKind.includes("RECOVER") && targetLength >= 5) return 1;
  if (taskKind.includes("DECODE") && (checkpointId === "COD-CP-004" || checkpointId === "COD-CP-005" || checkpointId === "COD-CP-006")) return 1;
  if (taskKind.includes("CHOOSE") && checkpointId !== "COD-CP-001") return 1;
  return 0;
}

function informationDensity(targetLength: number, evidenceCount: number): number {
  return evidenceCount >= 4 || (targetLength >= 6 && evidenceCount >= 3) ? 1 : 0;
}

function distractorProximity(options: readonly GeneratedOption[]): number {
  const close = options.filter((option) => !option.isCorrect && /OFF_BY_ONE|NEIGHBOUR|ARITHMETIC|POSITION_SWAP|PHASE|DIRECTION|SWAPPED|OMITTED|SKIPPED|ZERO_BASED|REVERSED/i.test(option.errorLabel ?? ""));
  return close.length >= 2 ? 1 : 0;
}

function mapScore(score: number): CodDifficulty {
  if (score <= 2) return "EASY";
  if (score === 3) return "MEDIUM";
  return "HARD";
}

function nearestAllowed(difficulty: CodDifficulty, allowed?: readonly CodDifficulty[]): CodDifficulty {
  if (!allowed || allowed.length === 0 || allowed.includes(difficulty)) return difficulty;
  const desired = ORDER.indexOf(difficulty);
  return [...allowed].sort((left, right) => Math.abs(ORDER.indexOf(left) - desired) - Math.abs(ORDER.indexOf(right) - desired))[0]!;
}

export function assessCodDifficulty(input: CodDifficultyInput): CodDifficultyAssessment {
  const factors = {
    ruleComplexity: ruleComplexity(input.checkpointId, input.ruleId),
    transformationDepth: transformationDepth(input.checkpointId),
    inferenceBurden: inferenceBurden(input.taskKind, input.checkpointId, input.targetLength),
    informationDensity: informationDensity(input.targetLength, input.evidenceCount),
    distractorProximity: distractorProximity(input.options),
  };

  let score = 1 + factors.ruleComplexity + factors.transformationDepth + factors.inferenceBurden + factors.informationDensity + factors.distractorProximity;
  score = Math.max(1, Math.min(5, score));

  // Direct substitution is never a genuinely difficult competitive-exam task.
  if (input.checkpointId === "COD-CP-001") score = Math.min(score, 3);

  // A short, direct two-stage application is normally Medium; inference or denser targets may rise to Hard.
  if (
    input.checkpointId === "COD-CP-006"
    && ["REVERSE_THEN_INDEXED_SHIFT", "PAIR_SWAP_THEN_ALTERNATING_SHIFT", "HALF_SWAP_THEN_ODD_EVEN_SHIFT"].includes(input.ruleId)
    && ["ENCODE_TARGET", "CHOOSE_MATCHING_CODE"].includes(input.taskKind)
    && input.targetLength <= 4
  ) score = Math.min(score, 3);

  return {
    difficulty: nearestAllowed(mapScore(score), input.allowedDifficulties),
    score,
    factors,
  };
}
