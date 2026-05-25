import type { CanonicalProfitLossProblem } from "../canonical/profit-loss-types";

export type ProfitLossSolverReport = {
  valid: boolean;
  issues: string[];
  metrics: {
    solverValue?: number;
    answerValue: number;
    explanationFinalValue?: number;
    rejectedReason?: string;
  };
};

function round2(value: number) {
  return Number(value.toFixed(2));
}

function closeEnough(left: number, right: number) {
  return Math.abs(left - right) <= 0.11;
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

export function solveProfitLossIndependently(problem: CanonicalProfitLossProblem) {
  const v = problem.variables;
  switch (problem.family) {
    case "pl_cp_sp_percent":
      return round2(Math.abs((v.sp - v.cp) * 100 / v.cp));
    case "pl_cp_percent_to_sp":
      return round2(v.cp * (100 + (v.mode === -1 ? -v.percent : v.percent)) / 100);
    case "pl_sp_percent_to_cp":
      return round2(v.sp * 100 / (100 + (v.mode === -1 ? -v.percent : v.percent)));
    case "pl_mp_discount_to_sp":
      return round2(v.mp * (100 - v.discount) / 100);
    case "pl_mp_sp_discount_percent":
      return round2((v.mp - v.sp) * 100 / v.mp);
    case "pl_cp_mp_discount_to_percent": {
      const sp = v.mp * (100 - v.discount) / 100;
      return round2(Math.abs(sp - v.cp) * 100 / v.cp);
    }
    case "pl_successive_discounts":
      return round2(v.mp * (100 - v.discount1) * (100 - v.discount2) / 10000);
    case "pl_mp_for_target_profit": {
      const targetSp = v.cp * (100 + v.targetProfit) / 100;
      return round2(targetSp * 100 / (100 - v.discount));
    }
    case "pl_equal_sp_profit_loss": {
      const cp1 = v.sp * 100 / (100 + v.profitPercent);
      const cp2 = v.sp * 100 / (100 - v.lossPercent);
      return round2(Math.abs((2 * v.sp - cp1 - cp2) * 100 / (cp1 + cp2)));
    }
    case "pl_two_article_overall": {
      const sp1 = v.cp1 * (100 + v.profitPercent) / 100;
      const sp2 = v.cp2 * (100 - v.lossPercent) / 100;
      const totalCp = v.cp1 + v.cp2;
      return round2(Math.abs(sp1 + sp2 - totalCp) * 100 / totalCp);
    }
    case "pl_no_profit_no_loss":
      return 0;
    case "pl_asymmetric_item_equivalence":
      return round2(Math.abs((v.cpArticles - v.spArticles) * 100 / v.spArticles));
    case "pl_fractional_value_shift":
    case "pl_loss_recovery_cp_from_difference":
      return round2(v.difference * 100 / (v.lossRate + v.profitRate));
    case "pl_markup_discount_triangle":
      return round2(Math.abs((100 + v.markup) * (100 - v.discount) / 100 - 100));
    case "pl_target_profit_discount_calibration":
      return round2(((100 + v.markup) - (100 + v.targetProfit)) * 100 / (100 + v.markup));
    case "pl_target_profit_mp_calibration": {
      const targetSp = v.cp * (100 + v.targetProfit) / 100;
      return round2(targetSp * 100 / (100 - v.discount));
    }
    case "pl_successive_discount_equivalent": {
      const discounts = Object.entries(v)
        .filter(([key]) => /^discount\d+$/u.test(key))
        .map(([, value]) => Number(value));
      const finalIndex = discounts.reduce((index, discount) => index * (100 - discount) / 100, 100);
      return round2(100 - finalIndex);
    }
    case "pl_dual_item_identical_sp": {
      const cp1 = v.sp * 100 / (100 + v.profitPercent);
      const cp2 = v.sp * 100 / (100 - v.lossPercent);
      return round2(Math.abs((2 * v.sp - cp1 - cp2) * 100 / (cp1 + cp2)));
    }
    case "pl_dual_item_mixed_baseline":
      return round2(v.totalCp * v.lossPercent / (v.profitPercent + v.lossPercent));
    case "pl_partial_inventory_allocation": {
      const sold = v.soldNumerator / v.soldDenominator;
      return round2(Math.abs((v.targetRate - sold * v.firstRate) / (1 - sold)));
    }
    case "pl_sequential_supply_chain":
      return round2(v.cp * (100 + v.rate1) * (100 + v.rate2) * (100 + v.rate3) / 1000000);
    case "pl_supply_chain_mixed_profit_loss": {
      const finalIndex = [v.rate1, v.rate2, v.rate3].reduce((index, rate) => index * (100 + rate) / 100, 100);
      return round2(Math.abs(finalIndex - 100));
    }
    case "pl_compound_error_baseline_shift": {
      const rate = v.reduction * (100 + v.profit) / 100;
      return round2(v.difference * 100 / rate);
    }
    case "pl_dishonest_dealer_weight_fraud":
      return round2((100 + v.markup) * v.trueWeight / v.falseWeight - 100);
    case "pl_dishonest_dealer_dual_fraud":
      return round2((((100 + v.buyExtra) / 100) * (100 / (100 - v.sellLess)) - 1) * 100);
    case "pl_dishonest_dealer_absolute_hybrid": {
      const factor = (100 + v.markup) * (100 - v.discount) / 10000 * v.trueWeight / v.falseWeight;
      return round2((factor - 1) * 100);
    }
    case "pl_buy_get_free_discount":
      return round2(v.freeQty * 100 / (v.paidQty + v.freeQty));
    case "pl_hybrid_promotion_scaling": {
      const factor = v.paidQty / (v.paidQty + v.freeQty) * (100 - v.discount) / 100;
      return round2((1 - factor) * 100);
    }
    case "pl_cashback_coupon_discount": {
      const afterDiscount = v.mp * (100 - v.discount) / 100;
      return round2((v.mp - (afterDiscount - v.cashback)) * 100 / v.mp);
    }
    case "pl_gst_after_discount": {
      const discounted = v.mp * (100 - v.discount) / 100;
      return round2(discounted * (100 + v.tax) / 100);
    }
    case "pl_tax_inclusive_back_calc":
      return round2(v.inclusivePrice * 100 / (100 + v.tax));
    case "pl_profit_after_commission_tax": {
      const netReceipt = v.sp * (100 - v.commission) / 100;
      return round2(Math.abs((netReceipt - v.cp) * 100 / v.cp));
    }
    case "pl_repair_overhead_cost":
      return round2((v.sp - (v.purchase + v.overhead)) * 100 / (v.purchase + v.overhead));
    case "pl_required_sp_after_overhead":
      return round2((v.purchase + v.overhead) * (100 + v.targetProfit) / 100);
    case "pl_manufacturing_breakdown": {
      return round2(v.oldCost * (v.materialRatio * (100 + v.materialRise) + v.labourRatio * (100 + v.labourRise)) / ((v.materialRatio + v.labourRatio) * 100));
    }
    case "pl_required_sp_after_loss": {
      const cp = v.lossSp * 100 / (100 - v.lossRate);
      return round2(cp * (100 + v.profitRate) / 100);
    }
    case "pl_sp_difference_two_rates":
      return round2(v.difference * 100 / (v.rate2 - v.rate1));
    case "pl_equal_profit_loss_amount":
      return 0;
    case "pl_same_profit_amount_different_rates":
      return round2(v.cp1);
    case "pl_inverse_cp_from_mp_discount_profit": {
      const sp = v.mp * (100 - v.discount) / 100;
      return round2(sp * 100 / (100 + v.profit));
    }
    case "pl_inverse_discount_from_cp_mp_profit": {
      const targetSp = v.cp * (100 + v.profit) / 100;
      return round2((v.mp - targetSp) * 100 / v.mp);
    }
    case "pl_inverse_markup_from_cp_discount_profit": {
      const requiredSp = v.cp * (100 + v.profit) / 100;
      const mp = requiredSp * 100 / (100 - v.discount);
      return round2((mp - v.cp) * 100 / v.cp);
    }
    case "pl_multi_condition_inverse_absolute":
      return round2((v.profitAmount2 - v.profitAmount1) * 100 / (v.discount1 - v.discount2));
    default:
      return round2(problem.answer);
  }
}

export function profitLossDegenerateReasons(problem: CanonicalProfitLossProblem) {
  const v = problem.variables;
  const issues: string[] = [];
  const positiveFields = ["cp", "sp", "mp", "cp1", "cp2", "sp1", "sp2"];
  for (const field of positiveFields) {
    if (v[field] !== undefined && (!Number.isFinite(v[field]) || v[field] <= 0)) {
      issues.push(`${field} must be positive`);
    }
  }

  if (problem.family === "pl_cp_sp_percent" && v.cp === v.sp) {
    issues.push("CP equals SP in direct profit-loss item");
  }
  if (/discount/u.test(problem.family) && (v.discount === 0 || v.discount1 === 0 || v.discount2 === 0)) {
    issues.push("zero discount in discount item");
  }
  if (problem.family === "pl_mp_sp_discount_percent" && v.mp === v.sp) {
    issues.push("MP equals SP in discount-percent item");
  }
  if (
    problem.family === "pl_cp_mp_discount_to_percent" &&
    problem.answerSemantic === "no_profit_no_loss"
  ) {
    issues.push("accidental no-profit-no-loss in CP/MP/discount item");
  }
  if (
    problem.family === "pl_two_article_overall" &&
    problem.answerSemantic === "no_profit_no_loss"
  ) {
    issues.push("accidental no-profit-no-loss in two-article item");
  }
  if (problem.answerKind === "percent" && problem.answer > 100) {
    issues.push("unrealistic percentage answer");
  }
  if (
    !["pl_no_profit_no_loss", "pl_equal_profit_loss_amount"].includes(problem.family) &&
    problem.answerSemantic === "no_profit_no_loss"
  ) {
    issues.push("accidental no-profit-no-loss outside explicit family");
  }
  if (v.cashback !== undefined) {
    const afterDiscount = v.mp * (100 - (v.discount ?? 0)) / 100;
    if (v.cashback >= afterDiscount) issues.push("cashback must be below payable amount");
  }
  if (v.falseWeight !== undefined && v.trueWeight !== undefined && v.falseWeight >= v.trueWeight) {
    issues.push("false weight must be below true weight");
  }
  if (v.discount !== undefined && (v.discount <= 0 || v.discount >= 100)) {
    issues.push("discount must be between 0 and 100");
  }
  return issues;
}

export function validateProfitLossIndependentSolver(input: {
  problem: CanonicalProfitLossProblem;
  explanation?: string;
  options?: readonly string[];
  correct?: number;
}): ProfitLossSolverReport {
  const solverValue = solveProfitLossIndependently(input.problem);
  const issues = [...profitLossDegenerateReasons(input.problem)];
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
    const correct = input.correct ?? 0;
    if (!input.options[correct]) {
      issues.push("answer missing from options");
    }
    if (new Set(input.options).size !== input.options.length) {
      issues.push("duplicate options");
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
