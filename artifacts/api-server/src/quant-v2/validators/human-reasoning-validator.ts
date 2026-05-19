import type { EditorialRealization } from "../editorial/editorial-types";
import type { ValidationResult } from "./problem-validator";

export interface HumanReasoningMetrics {
  humanizationScore: number;
  solverLeakageScore: number;
  equationReadabilityScore: number;
  teacherStyleRealismScore: number;
}

const SOLVER_LANGUAGE = [
  "use this percentage change",
  "apply the multiplier",
  "convert the given share",
  "work out the total from the given part",
  "use the updated base here",
  "reconstruct the previous base",
  "recover the hidden base",
  "scale it to the full base",
  "use the given percentages",
  "map the percentage",
  "operation",
  "transform",
  "node",
  "graph",
] as const;

const INTERNAL_NAME_PATTERN =
  /\b(?:gapPercent|remainingPercent|consumptionIndex|firstMultiplier|secondMultiplier|growthMultiplier|afterFirst|finalValue|totalVotes|validVotes|totalMarks|projectedPopulation|salaryDifference|revisionPercent|priceDifference|profitLossPercent|fixedComponent|finalMixtureTotal|addedQuantity)\b/u;
const CAMEL_CASE_PATTERN = /\b[a-z]+[A-Z][A-Za-z0-9]*\b/u;
const ARITHMETIC_SYMBOL_PATTERN = /[=×/%+\-^]/u;

function countMatches(text: string, pattern: RegExp) {
  return [...text.matchAll(new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`))].length;
}

function scoreFromDeductions(base: number, deductions: readonly number[]) {
  return Math.max(0, base - deductions.reduce((sum, value) => sum + value, 0));
}

export function createHumanReasoningMetrics(
  realization: EditorialRealization,
): HumanReasoningMetrics {
  const explanation = realization.explanation;
  const lower = explanation.toLowerCase();
  const solverHits = SOLVER_LANGUAGE.filter((phrase) =>
    lower.includes(phrase),
  ).length;
  const internalHits =
    countMatches(explanation, INTERNAL_NAME_PATTERN) +
    countMatches(explanation, CAMEL_CASE_PATTERN);
  const starHits = explanation.includes("*") ? 1 : 0;
  const equationLines = explanation
    .split("\n")
    .filter((line) => ARITHMETIC_SYMBOL_PATTERN.test(line));
  const multilineEquations = explanation.includes("=\n") ||
    equationLines.some((line) => line.trim().startsWith("="));
  const shortcutIsClean = !explanation.includes("Shortcut:") ||
    /\d+(?:\.\d+)?%\s*=\s*\d/u.test(explanation) ||
    /\d+(?:\.\d+)?%\s+of\s+\d/u.test(explanation) ||
    /(?:Required value|Required increase|Required reduction|Reduction in consumption|(?:Profit|Loss) percentage|Maximum marks|Total (?:value|votes|quantity))\s*=/u.test(explanation);

  const solverLeakageScore = scoreFromDeductions(100, [
    solverHits * 18,
    internalHits * 14,
  ]);
  const equationReadabilityScore = scoreFromDeductions(100, [
    starHits * 25,
    multilineEquations ? 0 : 8,
    equationLines.length === 0 ? 30 : 0,
  ]);
  const teacherStyleRealismScore = scoreFromDeductions(100, [
    lower.includes("use the given") ? 20 : 0,
    lower.includes("next compute") ? 20 : 0,
    shortcutIsClean ? 0 : 15,
  ]);
  const humanizationScore = Math.round(
    (
      solverLeakageScore +
      equationReadabilityScore +
      teacherStyleRealismScore
    ) / 3,
  );

  return {
    humanizationScore,
    solverLeakageScore,
    equationReadabilityScore,
    teacherStyleRealismScore,
  };
}

export function validateHumanReasoningRealization(
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const lower = realization.explanation.toLowerCase();
  const metrics = createHumanReasoningMetrics(realization);

  for (const phrase of SOLVER_LANGUAGE) {
    if (lower.includes(phrase)) {
      issues.push(`Solver language leaked into explanation: ${phrase}.`);
    }
  }
  if (INTERNAL_NAME_PATTERN.test(realization.explanation)) {
    issues.push("Explanation exposes internal variable names.");
  }
  if (CAMEL_CASE_PATTERN.test(realization.explanation)) {
    issues.push("Explanation contains camelCase solver terms.");
  }
  if (realization.explanation.includes("*")) {
    issues.push("Explanation uses programming-style multiplication.");
  }
  if (metrics.humanizationScore < 85) {
    issues.push(`Humanization score is too low: ${metrics.humanizationScore}.`);
  }
  if (metrics.solverLeakageScore < 90) {
    issues.push(`Solver leakage score is too low: ${metrics.solverLeakageScore}.`);
  }
  if (metrics.equationReadabilityScore < 80) {
    issues.push(
      `Equation readability score is too low: ${metrics.equationReadabilityScore}.`,
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
