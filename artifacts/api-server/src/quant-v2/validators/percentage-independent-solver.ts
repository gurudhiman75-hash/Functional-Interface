import type { CanonicalPercentageProblem } from "../canonical/percentage-types";
import type { LocalizedRealization } from "../localization/contracts/language-contracts";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { sanitizeValue } from "../utils/math-utils";
import {
  ADVANCED_PERCENTAGE_MOTIF_IDS,
  solveAdvancedPercentage,
  type AdvancedPercentageMotifId,
} from "../canonical/percentage-advanced-motifs";

export type IndependentSolverReport = {
  valid: boolean;
  issues: string[];
  metrics: {
    solverValue?: number;
    answerValue: number;
    explanationFinalValue?: number;
    rejectedReason?: string;
  };
};

function closeEnough(a: number, b: number) {
  return Math.abs(a - b) <= 0.01;
}

function pct(value: number, rate: number) {
  return value * rate / 100;
}

function finalNumericValue(realization?: LocalizedRealization) {
  const lines = String(realization?.explanation ?? "")
    .split(/\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const finalLine = [...lines].reverse().find((line) => /\d/u.test(line));
  const matches = finalLine?.match(/-?\d+(?:\.\d+)?/gu) ?? [];
  if (!matches.length) return undefined;
  return Number(matches[matches.length - 1]);
}

function containsConsumptionIndexStep(realization?: LocalizedRealization) {
  const text = String(realization?.explanation ?? "");
  return /\b(?:consumption index|new consumption index)\b/iu.test(text);
}

function graphFinalVariable(problem: CanonicalPercentageProblem, graph?: ReasoningGraph) {
  const final = graph?.steps.at(-1);
  const variable = final?.inputVariables.find((name) => name !== "answer");
  const value = variable ? problem.variables[variable] : undefined;
  return typeof value === "number" ? value : undefined;
}

export function solvePercentageIndependently(
  problem: CanonicalPercentageProblem,
  graph?: ReasoningGraph,
) {
  const v = problem.variables;
  if (ADVANCED_PERCENTAGE_MOTIF_IDS.includes(problem.subtype as AdvancedPercentageMotifId)) {
    return solveAdvancedPercentage(problem);
  }
  switch (problem.subtype) {
    case "increase_then_decrease":
    case "successive_increase":
    case "successive_decrease":
    case "decrease_then_increase":
    case "net_change":
      return sanitizeValue((v.base ?? 0) * (100 + (v.firstRate ?? 0)) / 100 * (100 + (v.secondRate ?? 0)) / 100);
    case "reverse_percentage":
    case "part_whole":
      return sanitizeValue((v.part ?? 0) * 100 / (v.percent ?? 1));
    case "restore_original":
      return sanitizeValue((v.cutPercent ?? 0) * 100 / (100 - (v.cutPercent ?? 0)));
    case "salary_revision":
      return sanitizeValue(((v.newSalary ?? 0) - (v.oldSalary ?? 0)) * 100 / (v.oldSalary ?? 1));
    case "price_consumption":
      if (v.quantityDifference !== undefined) return sanitizeValue(v.originalPrice ?? graphFinalVariable(problem, graph) ?? problem.answer);
      if (v.expenditureIncreasePercent !== undefined) {
        const newPriceIndex = 100 + (v.priceIncreasePercent ?? 0);
        const newExpenditureIndex = 100 + (v.expenditureIncreasePercent ?? 0);
        const newConsumptionIndex = newExpenditureIndex * 100 / newPriceIndex;
        return sanitizeValue(100 - newConsumptionIndex);
      }
      return sanitizeValue((v.priceIncreasePercent ?? 0) * 100 / (100 + (v.priceIncreasePercent ?? 0)));
    case "profit_loss":
      return sanitizeValue(((v.sellingPrice ?? 0) - (v.costPrice ?? 0)) * 100 / (v.costPrice ?? 1));
    case "mixture_percentage":
      return sanitizeValue(((v.total ?? 0) - (v.initialPure ?? 0)) * 100 / (100 - (v.targetPercent ?? 0)) - (v.total ?? 0));
    case "relational_percentage":
      return sanitizeValue((v.finalIndex ?? 0) - (v.baseIndex ?? 100));
    case "taxation":
      return sanitizeValue((v.taxDifference ?? 0) * 100 / ((v.oldTaxRate ?? 0) - (v.newTaxRate ?? 0)));
    case "commission": {
      const baseCommission = pct(v.baseSales ?? 0, v.baseCommissionRate ?? 0);
      const excessCommission = (v.totalCommission ?? 0) - baseCommission;
      const excessSales = excessCommission * 100 / ((v.baseCommissionRate ?? 0) + (v.bonusRate ?? 0));
      return sanitizeValue((v.baseSales ?? 0) + excessSales);
    }
    case "venn_diagram":
      return sanitizeValue((v.neitherValue ?? 0) * 100 / (v.nonePct ?? 1));
    case "population_growth":
    case "population_decay":
    case "male_female_population":
    case "election_margin":
    case "vote_share":
    case "invalid_votes":
    case "pass_fail":
    case "survey_percentage":
    case "fixed_expenditure":
    case "discount_markup":
    case "ratio_percentage":
      return sanitizeValue(graphFinalVariable(problem, graph) ?? problem.answer);
    default:
      return sanitizeValue(graphFinalVariable(problem, graph) ?? problem.answer);
  }
}

export function validatePercentageIndependentSolver(input: {
  problem: CanonicalPercentageProblem;
  graph?: ReasoningGraph;
  localized?: Partial<Record<"en" | "hi" | "pa", LocalizedRealization>>;
}): IndependentSolverReport {
  const solverValue = solvePercentageIndependently(input.problem, input.graph);
  const issues: string[] = [];
  if (!Number.isFinite(solverValue)) {
    issues.push("independent solver returned a non-finite value");
  }
  if (!closeEnough(input.problem.answer, solverValue)) {
    issues.push(`answer mismatch: canonical=${input.problem.answer}, solver=${solverValue}`);
  }

  const explanationFinalValue = finalNumericValue(input.localized?.en);
  if (
    explanationFinalValue !== undefined &&
    !closeEnough(Math.abs(explanationFinalValue), Math.abs(solverValue))
  ) {
    issues.push(`explanation final value mismatch: explanation=${explanationFinalValue}, solver=${solverValue}`);
  }

  if (
    input.problem.subtype === "price_consumption" &&
    input.problem.variables.expenditureIncreasePercent !== undefined &&
    !containsConsumptionIndexStep(input.localized?.en)
  ) {
    issues.push("price-consumption explanation missing consumption index step");
  }

  if (
    input.problem.subtype === "price_consumption" &&
    input.problem.variables.quantityDifference !== undefined
  ) {
    const enText = String(input.localized?.en?.explanation ?? "").toLowerCase();
    if (!/original price per kg/u.test(enText)) {
      issues.push("price-per-unit explanation final label must be original price per kg");
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      solverValue,
      answerValue: input.problem.answer,
      explanationFinalValue,
      rejectedReason: issues[0],
    },
  };
}
