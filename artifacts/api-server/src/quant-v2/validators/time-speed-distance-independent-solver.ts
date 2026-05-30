import type { CanonicalTimeSpeedDistanceProblem } from "../canonical/time-speed-distance-types";
import { evaluateTsdSolverModel } from "../canonical/time-speed-distance-motif-factories";

function normalize(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[,\s]+/gu, " ")
    .trim();
}

function numericPart(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : NaN;
}

function closeEnough(left: unknown, right: unknown) {
  if (typeof right === "string") return normalize(left) === normalize(right);
  const l = numericPart(left);
  const r = Number(right);
  return Number.isFinite(l) && Number.isFinite(r) && Math.abs(l - r) < 0.02;
}

export function validateTimeSpeedDistanceIndependentSolver(input: {
  problem?: CanonicalTimeSpeedDistanceProblem;
  explanation?: string;
  options?: string[];
  correct?: number;
}) {
  const issues: string[] = [];
  const problem = input.problem;
  if (!problem) {
    return { valid: false, issues: ["time-speed-distance canonical problem missing"] };
  }
  let solverAnswer: number | string;
  try {
    solverAnswer = evaluateTsdSolverModel(problem.solverModel);
  } catch (error) {
    return {
      valid: false,
      issues: [error instanceof Error ? error.message : "time-speed-distance solver failed"],
    };
  }
  if (!closeEnough(problem.answer, solverAnswer)) {
    issues.push(`solver mismatch: expected ${problem.answer}, got ${solverAnswer}`);
  }
  const answerOption = input.options?.[input.correct ?? problem.correct] ?? "";
  if (!answerOption || !normalize(answerOption).includes(normalize(problem.answerText).split(" ")[0] ?? "")) {
    issues.push("correct option does not contain solver answer");
  }
  if (!input.explanation?.includes(problem.answerText)) {
    issues.push("explanation final answer mismatch");
  }
  if (!problem.topology?.variant || problem.topology.family !== "time_speed_distance") {
    issues.push("time-speed-distance topology metadata missing");
  }
  if (!/^(tsd|train|boat|race|circular|escalator|moving_walkway|dog)_/u.test(problem.family)) {
    issues.push("time-speed-distance routing prefix invalid");
  }
  if (problem.answerUnit !== "ratio" && typeof problem.answer === "number" && (!Number.isFinite(problem.answer) || problem.answer <= 0)) {
    issues.push("non-positive or invalid answer");
  }
  return { valid: issues.length === 0, issues, solverAnswer };
}

export function timeSpeedDistanceDegenerateReasons(problem?: CanonicalTimeSpeedDistanceProblem) {
  const issues: string[] = [];
  if (!problem) return ["missing canonical problem"];
  const values = Object.values(problem.variables).flatMap((value) => Array.isArray(value) ? value : [value]);
  if (values.some((value) => typeof value === "number" && (!Number.isFinite(value) || value < 0))) {
    issues.push("invalid numeric variable");
  }
  if (/^(pct|pl|int|rp|tw|pc)_/u.test(problem.family)) {
    issues.push("routing leakage from another Quant V2 chapter");
  }
  return issues;
}
