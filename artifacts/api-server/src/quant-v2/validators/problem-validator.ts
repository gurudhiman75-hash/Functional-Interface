import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import {
  DIFFICULTIES,
  PERCENTAGE_CATEGORIES,
  PERCENTAGE_SUBTYPES,
  REASONING_PATTERNS,
  TRAPS,
} from "../canonical/percentage-types";

export type ValidationResult = {
  valid: boolean;
  issues: string[];
};

function closeEnough(left: number, right: number, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function hasCleanDecimals(value: number) {
  if (!Number.isFinite(value)) {
    return false;
  }
  return closeEnough(value, Math.round(value * 100) / 100, 0.000001);
}

function isPercentageVariable(key: string) {
  return /percent|rate/i.test(key);
}

function validateTaxonomy(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  if (!problem.id.trim()) {
    issues.push("Problem id is missing.");
  }
  if (problem.concept !== "percentage") {
    issues.push("Problem concept must be percentage.");
  }
  if (!PERCENTAGE_CATEGORIES.includes(problem.category)) {
    issues.push(`Unknown category: ${problem.category}`);
  }
  if (!PERCENTAGE_SUBTYPES.includes(problem.subtype)) {
    issues.push(`Unknown subtype: ${problem.subtype}`);
  }
  if (!REASONING_PATTERNS.includes(problem.reasoningPattern)) {
    issues.push(`Unknown reasoning pattern: ${problem.reasoningPattern}`);
  }
  if (!DIFFICULTIES.includes(problem.difficulty)) {
    issues.push(`Unknown difficulty: ${problem.difficulty}`);
  }
  if (problem.traps.length === 0) {
    issues.push("Problem must include at least one trap.");
  }
  for (const trap of problem.traps) {
    if (!TRAPS.includes(trap)) {
      issues.push(`Unknown trap: ${trap}`);
    }
  }
}

function validateNumbers(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const entries = Object.entries(problem.variables);

  if (entries.length === 0) {
    issues.push("Problem variables are missing.");
  }

  for (const [key, value] of entries) {
    if (!Number.isFinite(value)) {
      issues.push(`Variable ${key} is not finite.`);
      continue;
    }
    if (!hasCleanDecimals(value)) {
      issues.push(`Variable ${key} has an ugly decimal: ${value}.`);
    }
    if (Math.abs(value) > 1_000_000_000) {
      issues.push(`Variable ${key} is outside realistic range.`);
    }
    if (
      key !== "direction" &&
      !isPercentageVariable(key) &&
      value < 0
    ) {
      issues.push(`Variable ${key} must not be negative.`);
    }
    if (
      isPercentageVariable(key) &&
      (value <= -100 || value > 100)
    ) {
      issues.push(`Percentage variable ${key} is invalid: ${value}.`);
    }
  }

  if (!Number.isFinite(problem.answer)) {
    issues.push("Answer is not finite.");
  } else if (!hasCleanDecimals(problem.answer)) {
    issues.push(`Answer has an ugly decimal: ${problem.answer}.`);
  } else if (Math.abs(problem.answer) > 1_000_000_000) {
    issues.push("Answer is outside realistic range.");
  }

  if (problem.distractors.length < 3) {
    issues.push("At least three distractors are required.");
  }

  for (const distractor of problem.distractors) {
    if (!Number.isFinite(distractor)) {
      issues.push(`Distractor is not finite: ${distractor}.`);
    } else if (!hasCleanDecimals(distractor)) {
      issues.push(`Distractor has an ugly decimal: ${distractor}.`);
    }
  }
}

function validateDistractors(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const seen = new Set<string>();

  for (const distractor of problem.distractors) {
    const key = distractor.toFixed(2);
    if (seen.has(key)) {
      issues.push(`Duplicate distractor: ${distractor}.`);
    }
    seen.add(key);

    if (closeEnough(distractor, problem.answer)) {
      issues.push(`Distractor duplicates answer: ${distractor}.`);
    }
  }
}

function validateContradictions(
  problem: CanonicalPercentageProblem,
  issues: string[],
) {
  const v = problem.variables;
  const numericDistractors = problem.distractors.filter((d) => Number.isFinite(d));

  if (problem.id === "election_margin") {
    const variant = problem.topology?.variant;
    const requiresTwoCandidateShare =
      !variant ||
      variant === "direct_margin" ||
      variant === "invalid_vote_margin" ||
      variant === "turnout_margin" ||
      variant === "filtered_valid_vote_margin";

    if (
      requiresTwoCandidateShare &&
      (v.winnerPercent ?? 0) <= 50
    ) {
      issues.push("Election winner percent must be above 50.");
    }
    if (
      requiresTwoCandidateShare &&
      !closeEnough((v.winnerPercent ?? 0) + (v.loserPercent ?? 0), 100)
    ) {
      issues.push("Election winner and loser percentages must total 100.");
    }
    if ((v.gapPercent ?? 0) <= 0 || (v.margin ?? 0) <= 0) {
      issues.push("Election gap and margin must be positive.");
    }
  }

  if (problem.id === "pass_fail") {
    if (
      typeof v.passPercent === "number" &&
      typeof v.scoredPercent === "number" &&
      v.passPercent <= v.scoredPercent
    ) {
      issues.push("Pass percentage must exceed scored percentage.");
    }
    if (
      typeof v.shortBy === "number" &&
      v.shortBy <= 0
    ) {
      issues.push("Pass/fail shortfall must be positive.");
    }
  }

  if (problem.id === "restore_original") {
    if (
      (v.cutPercent ?? 0) <= 0 ||
      (v.cutPercent ?? 0) >= 100 ||
      !closeEnough((v.cutPercent ?? 0) + (v.remainingPercent ?? 0), 100)
    ) {
      issues.push("Restore setup has contradictory cut and remaining percentages.");
    }
  }

  if (problem.id === "price_consumption") {
    if ((v.priceIncreasePercent ?? 0) <= 0) {
      issues.push("Price-consumption increase must be positive.");
    }
    if (v.quantityDifference !== undefined) {
      if ((v.totalExpenditure ?? 0) <= 0) {
        issues.push("Price-per-unit setup requires positive total expenditure.");
      }
      for (const d of numericDistractors) {
        if (d <= 0) {
          issues.push(`Price-per-unit distractor must be positive: ${d}.`);
        }
      }
    }
  }

  if (problem.id === "mixture_percentage") {
    if ((v.targetPercent ?? 0) <= (v.initialPercent ?? 0)) {
      issues.push("Mixture target percent must exceed initial percent.");
    }
    if ((v.targetPercent ?? 0) >= 100) {
      issues.push("Mixture target percent must be below 100.");
    }
  }

  if (problem.id === "salary_revision") {
    if ((v.oldSalary ?? 0) <= 0 || (v.newSalary ?? 0) <= 0) {
      issues.push("Salary values must be positive.");
    }
    if (closeEnough(v.oldSalary ?? 0, v.newSalary ?? 0)) {
      issues.push("Salary revision must change the salary.");
    }
    for (const d of numericDistractors) {
      if (Math.abs(d) > 500) {
        issues.push(`Salary revision distractor is unrealistic: ${d}.`);
      }
    }
  }

  if (problem.id === "reverse_percentage") {
    if ((v.part ?? 0) <= 0 || (v.percent ?? 0) <= 0) {
      issues.push("Reverse percentage requires positive part and percent.");
    }
    if ((problem.answer ?? 0) <= (v.part ?? 0)) {
      issues.push("Reverse percentage total must exceed the given part.");
    }
    for (const d of numericDistractors) {
      if (d <= 0) {
        issues.push(`Reverse percentage distractor must be positive: ${d}.`);
      }
      if (d <= (v.part ?? 0)) {
        issues.push(`Reverse percentage distractor cannot be less than or equal to the given part: ${d}.`);
      }
    }
  }

  if (problem.id === "election_margin") {
    for (const d of numericDistractors) {
      if (d <= 0) {
        issues.push(`Election distractor must be positive: ${d}.`);
      }
    }
  }

  if (problem.id === "profit_loss") {
    if ((v.costPrice ?? 0) <= 0 || (v.sellingPrice ?? 0) <= 0) {
      issues.push("Profit-loss values must be positive.");
    }
  }
}

export function validatePercentageProblem(
  problem: CanonicalPercentageProblem,
): ValidationResult {
  const issues: string[] = [];

  validateTaxonomy(problem, issues);
  validateNumbers(problem, issues);
  validateDistractors(problem, issues);
  validateContradictions(problem, issues);

  return {
    valid: issues.length === 0,
    issues,
  };
}
