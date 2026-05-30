import type { CanonicalMixtureAlligationProblem } from "../canonical/mixture-alligation-types";
import { evaluateMixtureSolverModel } from "../canonical/mixture-alligation-motif-factories";

function normalize(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\s]+/gu, " ").trim();
}

function numericPart(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : NaN;
}

function closeEnough(left: unknown, right: unknown) {
  if (typeof right === "string") return normalize(left) === normalize(right);
  const l = numericPart(left);
  const r = Number(right);
  return Number.isFinite(l) && Number.isFinite(r) && Math.abs(l - r) < 0.03;
}

export function validateMixtureAlligationIndependentSolver(input: {
  problem?: CanonicalMixtureAlligationProblem;
  explanation?: string;
  options?: string[];
  correct?: number;
}) {
  const issues: string[] = [];
  const problem = input.problem;
  if (!problem) return { valid: false, issues: ["mixture-alligation canonical problem missing"] };
  let solverAnswer: number | string;
  try {
    solverAnswer = evaluateMixtureSolverModel(problem.solverModel);
  } catch (error) {
    return { valid: false, issues: [error instanceof Error ? error.message : "mixture-alligation solver failed"] };
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
  if (!problem.topology?.variant || problem.topology.family !== "mixture_alligation") {
    issues.push("mixture-alligation topology metadata missing");
  }
  if (!/^(mix|alligation|replacement|dilution|concentration|vessel|dealer|alloy|solution)_/u.test(problem.family)) {
    issues.push("mixture-alligation routing prefix invalid");
  }
  if (typeof problem.answer === "number" && (!Number.isFinite(problem.answer) || problem.answer <= 0)) {
    issues.push("non-positive or invalid answer");
  }
  return { valid: issues.length === 0, issues, solverAnswer };
}

export function mixtureAlligationDegenerateReasons(problem?: CanonicalMixtureAlligationProblem) {
  const issues: string[] = [];
  if (!problem) return ["missing canonical problem"];
  const values = Object.values(problem.variables).flatMap((value) => Array.isArray(value) ? value : [value]);
  if (values.some((value) => typeof value === "number" && (!Number.isFinite(value) || value < 0))) {
    issues.push("invalid numeric variable");
  }
  if (/^(pct|pl|int|rp|tw|tsd|train|boat|race)_/u.test(problem.family)) {
    issues.push("routing leakage from another Quant V2 chapter");
  }
  if (problem.answerUnit === "percent" && typeof problem.answer === "number" && problem.answer > 300) {
    issues.push("impossible percent value");
  }
  return issues;
}
