import {
  evaluateNumberSystemSolverModel,
} from "../canonical/number-system-motif-factories";
import type { CanonicalNumberSystemProblem } from "../canonical/number-system-types";

function normalize(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\s]+/gu, " ").trim();
}

function numericPart(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/u);
  return match ? Number(match[0]) : NaN;
}

function closeEnough(left: unknown, right: unknown) {
  if (typeof right === "string" && Number.isNaN(Number(right))) return normalize(left) === normalize(right);
  const l = numericPart(left);
  const r = Number(right);
  return Number.isFinite(l) && Number.isFinite(r) && Math.abs(l - r) < 0.001;
}

export function validateNumberSystemIndependentSolver(input: {
  problem?: CanonicalNumberSystemProblem;
  explanation?: string;
  options?: string[];
  correct?: number;
}) {
  const issues: string[] = [];
  const problem = input.problem;
  if (!problem) return { valid: false, issues: ["number-system canonical problem missing"] };
  let solverAnswer: number | string;
  try {
    solverAnswer = evaluateNumberSystemSolverModel(problem.solverModel);
  } catch (error) {
    return { valid: false, issues: [error instanceof Error ? error.message : "number-system solver failed"] };
  }
  if (!closeEnough(problem.answer, solverAnswer)) {
    issues.push(`solver mismatch: expected ${problem.answer}, got ${solverAnswer}`);
  }
  const answerOption = input.options?.[input.correct ?? problem.correct] ?? "";
  if (!answerOption || !normalize(answerOption).includes(String(solverAnswer))) {
    issues.push("correct option does not contain solver answer");
  }
  if (!input.explanation?.includes(problem.answerText)) {
    issues.push("explanation final answer mismatch");
  }
  if (problem.topology?.family !== "number_system") {
    issues.push("number-system topology metadata missing");
  }
  if (!/^ns_/u.test(problem.family)) {
    issues.push("number-system routing prefix invalid");
  }
  if (problem.questionTrivialityScore > 0.2) {
    issues.push("question triviality score too high");
  }
  return { valid: issues.length === 0, issues, solverAnswer };
}

export function numberSystemDegenerateReasons(problem?: CanonicalNumberSystemProblem) {
  const issues: string[] = [];
  if (!problem) return ["missing canonical problem"];
  const values = Object.values(problem.variables).flatMap((value) => Array.isArray(value) ? value : [value]);
  if (values.some((value) => typeof value === "number" && (!Number.isFinite(value) || value < 0))) {
    issues.push("invalid numeric variable");
  }
  if (!/^ns_/u.test(problem.family)) {
    issues.push("routing leakage from another Quant V2 chapter");
  }
  if (problem.answerUnit === "digit") {
    const n = Number(problem.answer);
    if (!Number.isInteger(n) || n < 0 || n > 9) issues.push("invalid digit answer");
  }
  return issues;
}
