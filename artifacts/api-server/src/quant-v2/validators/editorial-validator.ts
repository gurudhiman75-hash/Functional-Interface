import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { EditorialRealization } from "../editorial/editorial-types";
import { roundClean } from "../utils/math-utils";
import type { ValidationResult } from "./problem-validator";

const ROBOTIC_PHRASES = [
  "core idea",
  "key insight",
  "quick trick",
  "dramatically",
  "it is important to note",
  "let us delve",
  "therefore we can conclude",
  "as an ai",
] as const;

const UNSAFE_MATH_PATTERN = /[<>\[\]`]/u;
const WORD_PATTERN = /\b[A-Za-z][A-Za-z-]*\b/gu;

function wordCount(text: string) {
  return [...text.matchAll(WORD_PATTERN)].length;
}

function sentenceOpening(stem: string) {
  return stem.split(/[,.]/u)[0]?.trim().toLowerCase() ?? "";
}

function hasReasoningEquation(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
  graph: ReasoningGraph,
) {
  const visibleStepValues = graph.steps
    .filter((step) => step.type !== "final_answer")
    .map((step) =>
      step.outputVariable
        ? problem.variables[step.outputVariable] ?? problem.answer
        : undefined,
    )
    .filter((value): value is number => typeof value === "number");

  return visibleStepValues.some((value) => {
    const rounded = roundClean(value, 2);
    const text = Number.isInteger(rounded)
      ? String(rounded)
      : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
    const semanticText =
      value < 0
        ? String(Math.abs(rounded)).replace(/0+$/u, "").replace(/\.$/u, "")
        : text;
    return realization.explanation.includes(text) ||
      realization.explanation.includes(semanticText);
  });
}

function includesCanonicalAnswer(
  problem: CanonicalPercentageProblem,
  realization: EditorialRealization,
) {
  if (realization.explanation.includes(String(problem.answer))) {
    return true;
  }
  if (problem.answer < 0 && realization.explanation.includes(String(Math.abs(problem.answer)))) {
    return true;
  }
  if (problem.subtype === "profit_loss" && problem.answer < 0) {
    return realization.explanation.includes(`${Math.abs(problem.answer)}% loss`);
  }

  return false;
}

export function validateEditorialRealization(
  problem: CanonicalPercentageProblem,
  graph: ReasoningGraph,
  realization: EditorialRealization,
): ValidationResult {
  const issues: string[] = [];
  const stemWords = wordCount(realization.stem);
  const explanationWords = wordCount(realization.explanation);
  const lowerText = `${realization.stem}\n${realization.explanation}`.toLowerCase();

  if (stemWords < 18) {
    issues.push("Question stem is too short.");
  }
  if (stemWords > 90) {
    issues.push("Question stem is too verbose.");
  }
  if (explanationWords < 6) {
    issues.push("Explanation is too short.");
  }
  if (explanationWords > 220) {
    issues.push("Explanation is too verbose.");
  }
  if (!realization.stem.includes("?") && !/\bfind\b/iu.test(realization.stem)) {
    issues.push("Question stem must clearly ask for a value.");
  }
  for (const phrase of ROBOTIC_PHRASES) {
    if (lowerText.includes(phrase)) {
      issues.push(`Editorial text contains robotic phrase: ${phrase}.`);
    }
  }
  if (UNSAFE_MATH_PATTERN.test(realization.explanation)) {
    issues.push("Explanation contains MathJax-unsafe rendering characters.");
  }
  if (!hasReasoningEquation(problem, realization, graph)) {
    issues.push("Explanation does not align with reasoning graph equations.");
  }
  if (!includesCanonicalAnswer(problem, realization)) {
    issues.push("Explanation does not include the canonical answer.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateEditorialBatch(
  realizations: readonly EditorialRealization[],
): ValidationResult {
  const issues: string[] = [];
  const openingCounts = new Map<string, number>();
  const scenarioCounts = new Map<string, number>();
  let repeatedRun = 1;
  let previousOpening = "";
  let maxRepeatedRun = 1;

  for (const realization of realizations) {
    const opening = sentenceOpening(realization.stem);
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);
    scenarioCounts.set(
      realization.scenario.family,
      (scenarioCounts.get(realization.scenario.family) ?? 0) + 1,
    );

    if (opening === previousOpening) {
      repeatedRun += 1;
    } else {
      repeatedRun = 1;
      previousOpening = opening;
    }
    maxRepeatedRun = Math.max(maxRepeatedRun, repeatedRun);
  }

  if (openingCounts.size < Math.min(8, realizations.length)) {
    issues.push("Scenario openings are too repetitive.");
  }
  if (scenarioCounts.size < Math.min(8, realizations.length)) {
    issues.push("Scenario diversity is too narrow.");
  }
  if (maxRepeatedRun > 2) {
    issues.push(`Repeated opening run is too long: ${maxRepeatedRun}.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
