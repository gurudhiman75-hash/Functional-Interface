import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type EffectiveCostRecoveryRequest =
  | { mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST"; purchasePrice: Money; expenses: readonly Money[] }
  | { mode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST"; purchasePrice: Money; overheadPercent: Rational }
  | { mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE"; effectiveCost: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT"; purchasePrice: Money; expenses: readonly Money[]; sellingPrice: Money }
  | { mode: "SP_TARGET_RATE_TO_MAX_EXPENSE"; purchasePrice: Money; sellingPrice: Money; direction: "PROFIT" | "LOSS"; targetRatePercent: Rational }
  | { mode: "WASTAGE_TO_EFFECTIVE_UNIT_COST"; totalInputCost: Money; inputQuantity: bigint; wastedQuantity: bigint }
  | { mode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP"; totalInputCost: Money; inputQuantity: bigint; wastedQuantity: bigint; direction: "PROFIT" | "LOSS"; ratePercent: Rational }
  | { mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY"; fixedCost: Money; variableCostPerUnit: Money; sellingPricePerUnit: Money }
  | { mode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY"; fixedCost: Money; targetProfit: Money; variableCostPerUnit: Money; sellingPricePerUnit: Money }
  | { mode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP"; fixedCost: Money; variableCostPerUnit: Money; quantity: bigint }
  | { mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP"; firstCostPrice: Money; firstSellingPrice: Money; secondCostPrice: Money; targetDirection: "PROFIT" | "LOSS"; targetRatePercent: Rational }
  | { mode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST"; totalRecovery: Money; direction: "PROFIT" | "LOSS"; ratePercent: Rational };

export type EffectiveCostRecoveryResult =
  | { mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST"; effectiveCost: Money; totalExpense: Money }
  | { mode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST"; effectiveCost: Money; overheadAmount: Money }
  | { mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE"; sellingPrice: Money }
  | { mode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT"; effectiveCost: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "SP_TARGET_RATE_TO_MAX_EXPENSE"; maximumExpense: Money; targetEffectiveCost: Money }
  | { mode: "WASTAGE_TO_EFFECTIVE_UNIT_COST"; usableQuantity: bigint; effectiveUnitCost: Money }
  | { mode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP"; usableQuantity: bigint; effectiveUnitCost: Money; requiredUnitSellingPrice: Money }
  | { mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY"; breakEvenQuantity: bigint }
  | { mode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY"; requiredQuantity: bigint }
  | { mode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP"; breakEvenSellingPricePerUnit: Money }
  | { mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP"; requiredSecondSellingPrice: Money }
  | { mode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST"; effectiveCost: Money };

function validateRate(rate: Rational, direction: "PROFIT" | "LOSS"): void {
  if (rate.denominator <= 0n || rate.numerator < 0n) throw new Error("Rate must be non-negative.");
  if (direction === "LOSS" && rate.numerator >= 100n * rate.denominator) {
    throw new Error("Loss rate must be below 100% for an inverse price.");
  }
}

function addExpenses(purchasePrice: Money, expenses: readonly Money[]): { effectiveCost: Money; totalExpense: Money } {
  if (purchasePrice.paise <= 0n) throw new Error("Purchase price must be positive.");
  let totalExpense = 0n;
  for (const expense of expenses) {
    if (expense.paise < 0n) throw new Error("Expense cannot be negative.");
    totalExpense += expense.paise;
  }
  return {
    totalExpense: moneyFromPaise(totalExpense),
    effectiveCost: moneyFromPaise(purchasePrice.paise + totalExpense),
  };
}

function priceFromRate(base: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  validateRate(rate, direction);
  const change = multiplyMoney(base, divideRational(rate, rational(100)));
  return moneyFromPaise(direction === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}

function baseFromRecovery(recovery: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  validateRate(rate, direction);
  const base = 100n * rate.denominator;
  const denominator = direction === "PROFIT" ? base + rate.numerator : base - rate.numerator;
  return multiplyMoney(recovery, rational(base, denominator));
}

function summarize(cost: Money, recovery: Money) {
  if (cost.paise <= 0n) throw new Error("Effective cost must be positive.");
  const difference = recovery.paise - cost.paise;
  const absolute = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" as const : difference < 0n ? "LOSS" as const : "NO_CHANGE" as const,
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(rational(absolute, cost.paise)),
  };
}

function ceilDivide(numerator: bigint, denominator: bigint): bigint {
  if (numerator < 0n || denominator <= 0n) throw new Error("Ceiling division requires non-negative numerator and positive denominator.");
  return (numerator + denominator - 1n) / denominator;
}

export function solveEffectiveCostRecovery(request: EffectiveCostRecoveryRequest): EffectiveCostRecoveryResult {
  switch (request.mode) {
    case "FLAT_COMPONENTS_TO_EFFECTIVE_COST": {
      const result = addExpenses(request.purchasePrice, request.expenses);
      return { mode: request.mode, ...result };
    }
    case "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST": {
      validateRate(request.overheadPercent, "PROFIT");
      const overheadAmount = multiplyMoney(request.purchasePrice, divideRational(request.overheadPercent, rational(100)));
      return {
        mode: request.mode,
        overheadAmount,
        effectiveCost: moneyFromPaise(request.purchasePrice.paise + overheadAmount.paise),
      };
    }
    case "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE":
      return { mode: request.mode, sellingPrice: priceFromRate(request.effectiveCost, request.direction, request.ratePercent) };
    case "PURCHASE_EXPENSES_AND_SP_TO_RESULT": {
      const { effectiveCost } = addExpenses(request.purchasePrice, request.expenses);
      return { mode: request.mode, effectiveCost, ...summarize(effectiveCost, request.sellingPrice) };
    }
    case "SP_TARGET_RATE_TO_MAX_EXPENSE": {
      const targetEffectiveCost = baseFromRecovery(request.sellingPrice, request.direction, request.targetRatePercent);
      const expense = targetEffectiveCost.paise - request.purchasePrice.paise;
      if (expense < 0n) throw new Error("The purchase price already exceeds the target effective cost.");
      return { mode: request.mode, targetEffectiveCost, maximumExpense: moneyFromPaise(expense) };
    }
    case "WASTAGE_TO_EFFECTIVE_UNIT_COST": {
      if (request.inputQuantity <= 0n || request.wastedQuantity < 0n || request.wastedQuantity >= request.inputQuantity) {
        throw new Error("Wastage quantities must leave at least one usable unit.");
      }
      const usableQuantity = request.inputQuantity - request.wastedQuantity;
      if (request.totalInputCost.paise % usableQuantity !== 0n) throw new Error("Effective unit cost is not an exact paise amount.");
      return {
        mode: request.mode,
        usableQuantity,
        effectiveUnitCost: moneyFromPaise(request.totalInputCost.paise / usableQuantity),
      };
    }
    case "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP": {
      const unitCostResult = solveEffectiveCostRecovery({
        mode: "WASTAGE_TO_EFFECTIVE_UNIT_COST",
        totalInputCost: request.totalInputCost,
        inputQuantity: request.inputQuantity,
        wastedQuantity: request.wastedQuantity,
      });
      return {
        mode: request.mode,
        usableQuantity: unitCostResult.usableQuantity,
        effectiveUnitCost: unitCostResult.effectiveUnitCost,
        requiredUnitSellingPrice: priceFromRate(unitCostResult.effectiveUnitCost, request.direction, request.ratePercent),
      };
    }
    case "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY": {
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (request.fixedCost.paise < 0n || contribution <= 0n) throw new Error("Selling price must exceed variable cost per unit.");
      return { mode: request.mode, breakEvenQuantity: ceilDivide(request.fixedCost.paise, contribution) };
    }
    case "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY": {
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (request.fixedCost.paise < 0n || request.targetProfit.paise < 0n || contribution <= 0n) {
        throw new Error("Costs and target profit must be valid, with positive unit contribution.");
      }
      return {
        mode: request.mode,
        requiredQuantity: ceilDivide(request.fixedCost.paise + request.targetProfit.paise, contribution),
      };
    }
    case "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP": {
      if (request.fixedCost.paise < 0n || request.variableCostPerUnit.paise < 0n || request.quantity <= 0n) {
        throw new Error("Cost values and quantity must be valid.");
      }
      if (request.fixedCost.paise % request.quantity !== 0n) throw new Error("Break-even unit price is not an exact paise amount.");
      return {
        mode: request.mode,
        breakEvenSellingPricePerUnit: moneyFromPaise(request.variableCostPerUnit.paise + request.fixedCost.paise / request.quantity),
      };
    }
    case "EARLIER_LOSS_TO_REQUIRED_NEXT_SP": {
      if (request.firstCostPrice.paise <= 0n || request.secondCostPrice.paise <= 0n || request.firstSellingPrice.paise < 0n) {
        throw new Error("Cost prices must be positive and selling price cannot be negative.");
      }
      const totalCost = moneyFromPaise(request.firstCostPrice.paise + request.secondCostPrice.paise);
      const targetRecovery = priceFromRate(totalCost, request.targetDirection, request.targetRatePercent);
      const required = targetRecovery.paise - request.firstSellingPrice.paise;
      if (required < 0n) throw new Error("The first sale already exceeds the target total recovery.");
      return { mode: request.mode, requiredSecondSellingPrice: moneyFromPaise(required) };
    }
    case "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST":
      return {
        mode: request.mode,
        effectiveCost: baseFromRecovery(request.totalRecovery, request.direction, request.ratePercent),
      };
  }
}
