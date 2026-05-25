import type {
  CanonicalPercentageProblem,
  PercentageCategory,
} from "../canonical/percentage-types";
import {
  isControlledFractionalPercentage,
  profileForDomain,
  type RealismDomain,
} from "../realism/realism-number-profiles";
import { roundClean } from "../utils/math-utils";
import type { ValidationResult } from "./problem-validator";

export type RealismMetrics = {
  visualCleanliness: number;
  divisibilityQuality: number;
  distractorRealism: number;
  humanReadability: number;
  scaleRealism: number;
};

const PERCENTAGE_SUBTYPES = new Set([
  "salary_revision",
  "price_consumption",
  "profit_loss",
  "restore_original",
]);

function closeEnough(left: number, right: number, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function decimalPlaces(value: number) {
  const text = String(roundClean(value, 4));
  const [, decimals = ""] = text.split(".");
  return decimals.length;
}

function isPercentageKey(key: string) {
  return /percent|rate/i.test(key);
}

function isCountKey(key: string) {
  return /votes|voters|population|marks|salary|price|total|margin|part|pure|quantity|component/i.test(
    key,
  );
}

function inferDomain(problem: CanonicalPercentageProblem): RealismDomain {
  if (problem.category === "election") {
    return "election";
  }
  if (problem.subtype === "pass_fail") {
    return "exam_marks";
  }
  if (problem.category === "population") {
    return "population";
  }
  if (problem.subtype === "salary_revision") {
    return "salary";
  }
  if (problem.category === "mixture") {
    return "mixture";
  }
  if (
    problem.category === "finance" ||
    problem.category === "commercial" ||
    problem.category === "expenditure"
  ) {
    return "finance";
  }
  if (problem.category === "ratio_mapping") {
    return "ratio";
  }

  return "finance";
}

function score(issues: number, total: number) {
  if (total <= 0) {
    return 100;
  }

  return Math.max(0, Math.round(100 - (issues / total) * 100));
}

function naturalInteger(value: number) {
  const magnitude = Math.abs(value);
  if (!Number.isInteger(value)) {
    return false;
  }
  if (magnitude < 1000) {
    return true;
  }
  if (magnitude < 10000) {
    return value % 5 === 0 || value % 10 === 0 || value % 25 === 0;
  }
  if (magnitude < 100000) {
    return value % 25 === 0 || value % 100 === 0 || value % 1000 === 0;
  }

  return value % 25 === 0 || value % 1000 === 0 || value % 5000 === 0;
}

function valueIsReadable(
  key: string,
  value: number,
  problem: CanonicalPercentageProblem,
) {
  if (!Number.isFinite(value)) {
    return false;
  }

  if (isPercentageKey(key)) {
    return isControlledFractionalPercentage(value);
  }

  if (
    key === "answer" &&
    PERCENTAGE_SUBTYPES.has(problem.subtype) &&
    Math.abs(value) <= 100
  ) {
    return decimalPlaces(value) <= 2;
  }

  if (isCountKey(key) || Math.abs(value) >= 1000) {
    return naturalInteger(value);
  }

  return decimalPlaces(value) <= 2;
}

function scaleLooksRealistic(
  problem: CanonicalPercentageProblem,
  value: number,
) {
  const domain = inferDomain(problem);
  const profile = profileForDomain(domain);
  const magnitude = Math.abs(value);

  if (/^perc_/u.test(problem.subtype) && magnitude <= 200) {
    return true;
  }

  if (magnitude <= 100 && domain !== "mixture") {
    return true;
  }

  return (
    magnitude >= profile.realisticRange.min * 0.1 &&
    magnitude <= profile.realisticRange.max * 1.5
  );
}

function divisibilityLooksGood(value: number) {
  const magnitude = Math.abs(value);
  if (!Number.isInteger(value)) {
    return magnitude < 100 && decimalPlaces(value) <= 2;
  }
  if (magnitude < 1000) {
    return value % 1 === 0;
  }
  if (magnitude < 100000) {
    return value % 25 === 0 || value % 10 === 0 || value % 100 === 0;
  }

  return value % 25 === 0 || value % 1000 === 0 || value % 5000 === 0;
}

export function createRealismMetrics(
  problem: CanonicalPercentageProblem,
): RealismMetrics {
  const entries = [
    ...Object.entries(problem.variables),
    ["answer", problem.answer] as const,
  ];
  const allValues = [
    ...entries.map(([, value]) => value),
    ...problem.distractors,
  ];

  const unreadable = entries.filter(
    ([key, value]) => !valueIsReadable(key, value, problem),
  ).length;
  const poorDivisibility = allValues.filter(
    (value) => !divisibilityLooksGood(value),
  ).length;
  const poorScale = entries.filter(
    ([, value]) => !scaleLooksRealistic(problem, value),
  ).length;
  const distractorIssues = problem.distractors.filter(
    (value) =>
      !Number.isFinite(value) ||
      !divisibilityLooksGood(value) ||
      closeEnough(value, problem.answer),
  ).length;
  const machineLooking = allValues.filter(
    (value) =>
      decimalPlaces(value) > 2 ||
      (Math.abs(value) >= 10000 &&
        Number.isInteger(value) &&
        !naturalInteger(value)),
  ).length;

  return {
    visualCleanliness: score(machineLooking, allValues.length),
    divisibilityQuality: score(poorDivisibility, allValues.length),
    distractorRealism: score(distractorIssues, problem.distractors.length),
    humanReadability: score(unreadable, entries.length),
    scaleRealism: score(poorScale, entries.length),
  };
}

export function validateRealism(
  problem: CanonicalPercentageProblem,
): ValidationResult {
  const issues: string[] = [];
  const entries = [
    ...Object.entries(problem.variables),
    ["answer", problem.answer] as const,
  ];

  for (const [key, value] of entries) {
    if (!valueIsReadable(key, value, problem)) {
      issues.push(`Unrealistic value shape for ${key}: ${value}.`);
    }
    if (!scaleLooksRealistic(problem, value)) {
      issues.push(`Unrealistic scale for ${key}: ${value}.`);
    }
  }

  problem.distractors.forEach((value, index) => {
    if (!divisibilityLooksGood(value)) {
      issues.push(`Distractor ${index + 1} is visually awkward: ${value}.`);
    }
    if (decimalPlaces(value) > 2) {
      issues.push(`Distractor ${index + 1} is over-precise: ${value}.`);
    }
  });

  const metrics = createRealismMetrics(problem);
  if (metrics.visualCleanliness < 90) {
    issues.push("Visual cleanliness score is below threshold.");
  }
  if (metrics.distractorRealism < 90) {
    issues.push("Distractor realism score is below threshold.");
  }
  if (metrics.humanReadability < 90) {
    issues.push("Human readability score is below threshold.");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
