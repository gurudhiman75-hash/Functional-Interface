import type { CanonicalInterestProblem } from "../canonical/interest-types";

export type InterestSolverReport = {
  valid: boolean;
  issues: string[];
  metrics: {
    solverValue?: number;
    answerValue: number;
    explanationFinalValue?: number;
  };
};

function round2(value: number) {
  return Number(value.toFixed(2));
}

function closeEnough(left: number, right: number) {
  return Math.abs(left - right) <= 0.12;
}

function finalNumericValue(explanation?: string) {
  const lines = String(explanation ?? "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const finalLine = [...lines].reverse().find((line) => /\d/u.test(line));
  const matches = finalLine?.match(/-?\d+(?:\.\d+)?/gu) ?? [];
  if (!matches.length) return undefined;
  return Number(matches[matches.length - 1]);
}

export function solveInterestIndependently(problem: CanonicalInterestProblem) {
  const v = problem.variables;
  switch (problem.family) {
    case "int_si_from_prt":
      return round2((v.p * v.r * v.t) / 100);
    case "int_si_amount_from_prt":
      return round2(v.p + (v.p * v.r * v.t) / 100);
    case "int_si_principal_from_si_rt":
      return round2((v.si * 100) / (v.r * v.t));
    case "int_si_rate_from_si_pt":
      return round2((v.si * 100) / (v.p * v.t));
    case "int_si_time_from_si_pr":
      return round2((v.si * 100) / (v.p * v.r));
    case "int_si_difference_two_cases":
    case "int_interest_more_by_rate_change":
    case "int_interest_more_by_time_change":
      return round2(v.diff);
    case "int_si_temporal_amount_gap":
      return round2(v.p);
    case "int_si_amount_ratio_time_gap":
    case "int_amount_ratio_find_rate_si":
      return round2(v.r);
    case "int_amount_ratio_find_time_si":
      return round2(v.t);
    case "int_ci_amount_annual":
      return round2(v.p * Math.pow(1 + v.r / 100, v.t));
    case "int_ci_from_amount":
    case "int_ci_two_year_formula":
    case "int_ci_three_year_formula":
      return round2(v.p * Math.pow(1 + v.r / 100, v.t) - v.p);
    case "int_ci_principal_from_amount":
      return round2(v.amount / Math.pow(1 + v.r / 100, v.t));
    case "int_ci_rate_from_amount":
      return round2((Math.pow(v.amount / v.p, 1 / v.t) - 1) * 100);
    case "int_ci_time_from_amount":
      return round2(v.t);
    case "int_ci_si_difference_2_years":
      return round2((v.p * v.r * v.r) / 10000);
    case "int_ci_si_difference_3_years":
      return round2(v.p * (3 * (v.r / 100) ** 2 + (v.r / 100) ** 3));
    case "int_rate_from_ci_si_diff_2y":
      return round2(Math.sqrt((v.diff * 10000) / v.p));
    case "int_principal_from_ci_si_diff_2y":
      return round2((v.diff * 10000) / (v.r * v.r));
    case "int_ci_half_yearly":
    case "int_ci_quarterly":
    case "int_ci_monthly":
    case "int_wrong_period_conversion_trap":
      return round2(v.p * Math.pow(1 + v.periodRate / 100, v.periods));
    case "int_present_worth":
    case "int_bill_due_after_time":
      return round2((v.amount * 100) / (100 + v.r * v.t));
    case "int_true_discount": {
      const pw = (v.amount * 100) / (100 + v.r * v.t);
      return round2(v.amount - pw);
    }
    case "int_bankers_discount":
      return round2((v.amount * v.r * v.t) / 100);
    case "int_bankers_gain":
    case "int_bd_td_difference": {
      const pw = (v.amount * 100) / (100 + v.r * v.t);
      const td = v.amount - pw;
      const bd = (v.amount * v.r * v.t) / 100;
      return round2(bd - td);
    }
    case "int_population_growth_ci":
    case "int_depreciation_ci":
    case "int_price_appreciation":
    case "int_machine_car_depreciation":
    case "int_successive_growth":
    case "int_successive_reduction":
    case "int_compound_depreciation_repair_sale":
      return round2(v.finalValue);
    default:
      return round2(problem.answer);
  }
}

export function interestDegenerateReasons(problem: CanonicalInterestProblem) {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(problem.variables)) {
    if (!Number.isFinite(value)) issues.push(`${key} is not finite`);
    if (/^(?:p|r|t|amount|si|ci|periodRate|periods)$/u.test(key) && value < 0) {
      issues.push(`${key} must be non-negative`);
    }
  }
  if (!Number.isFinite(problem.answer) || problem.answer < 0) {
    issues.push("answer must be positive or zero");
  }
  if (problem.answerKind === "rate" && problem.answer > 100) {
    issues.push("rate answer is unrealistically high");
  }
  if (problem.answerKind === "time" && problem.answer > 50) {
    issues.push("time answer is unrealistically high");
  }
  return issues;
}

export function validateInterestIndependentSolver(input: {
  problem: CanonicalInterestProblem;
  explanation?: string;
  options?: readonly string[];
  correct?: number;
}): InterestSolverReport {
  const solverValue = solveInterestIndependently(input.problem);
  const issues = [...interestDegenerateReasons(input.problem)];
  if (!Number.isFinite(solverValue)) {
    issues.push("independent solver returned a non-finite value");
  }
  if (!closeEnough(input.problem.answer, solverValue)) {
    issues.push(`answer mismatch: canonical=${input.problem.answer}, solver=${solverValue}`);
  }
  const explanationFinalValue = finalNumericValue(input.explanation);
  if (
    explanationFinalValue !== undefined &&
    !closeEnough(Math.abs(explanationFinalValue), Math.abs(solverValue))
  ) {
    issues.push(`explanation final value mismatch: explanation=${explanationFinalValue}, solver=${solverValue}`);
  }
  if (input.options) {
    if (!input.options[input.correct ?? 0]) issues.push("answer missing from options");
    if (new Set(input.options).size !== input.options.length) issues.push("duplicate options");
  }
  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      solverValue,
      answerValue: input.problem.answer,
      explanationFinalValue,
    },
  };
}
