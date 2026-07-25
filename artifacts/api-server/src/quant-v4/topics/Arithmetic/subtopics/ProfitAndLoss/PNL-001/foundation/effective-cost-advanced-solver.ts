import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational } from "./rational";

export type OverheadBase = "PURCHASE_PRICE" | "PURCHASE_PLUS_FLAT";

export type ProductMixItem = Readonly<{
  unitsPerBundle: bigint;
  sellingPricePerUnit: Money;
  variableCostPerUnit: Money;
}>;

export type EffectiveCostAdvancedRequest =
  | { mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST"; purchasePrice: Money; flatExpenses: readonly Money[]; overheadPercent: Rational; overheadBase: OverheadBase }
  | { mode: "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE"; purchasePrice: Money; effectiveCost: Money }
  | { mode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE"; purchasePrice: Money; flatExpenses: readonly Money[]; effectiveCost: Money; overheadBase: OverheadBase }
  | { mode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST"; rawMaterialCost: Money; labourCost: Money; factoryOverheadPercentOnPrimeCost: Rational; packagingCost: Money; outputQuantity: bigint; scrapRecovery: Money }
  | { mode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST"; totalInputCost: Money; inputQuantity: bigint; wastedQuantity: bigint; scrapRecovery: Money }
  | { mode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST"; breakEvenQuantity: bigint; variableCostPerUnit: Money; sellingPricePerUnit: Money }
  | { mode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST"; fixedCost: Money; breakEvenQuantity: bigint; sellingPricePerUnit: Money }
  | { mode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP"; fixedCost: Money; variableCostPerUnit: Money; quantity: bigint; targetProfit: Money }
  | { mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE"; fixedCost: Money; contributionMarginPercent: Rational }
  | { mode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO"; fixedCost: Money; breakEvenRevenue: Money }
  | { mode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES"; fixedCost: Money; products: readonly ProductMixItem[] }
  | { mode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY"; actualRevenue: Money; breakEvenRevenue: Money }
  | { mode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY"; totalCost: Money; priorRecoveries: readonly Money[]; targetDirection: "PROFIT" | "LOSS"; targetRatePercent: Rational }
  | { mode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL"; lossPercent: Rational }
  | { mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT"; effectiveCost: Money; grossSellingPrice: Money; commissionPercent: Rational }
  | { mode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP"; effectiveCost: Money; targetDirection: "PROFIT" | "LOSS"; targetRatePercent: Rational; commissionPercent: Rational };

export type EffectiveCostAdvancedResult =
  | { mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST"; flatExpenseTotal: Money; overheadAmount: Money; effectiveCost: Money }
  | { mode: "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE"; totalExpense: Money }
  | { mode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE"; overheadAmount: Money; overheadPercent: Rational }
  | { mode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST"; primeCost: Money; factoryOverheadAmount: Money; netProductionCost: Money; effectiveUnitCost: Money }
  | { mode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST"; usableQuantity: bigint; netRecoverableCost: Money; effectiveUnitCost: Money }
  | { mode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST"; unitContribution: Money; fixedCost: Money }
  | { mode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST"; unitContribution: Money; variableCostPerUnit: Money }
  | { mode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP"; requiredSellingPricePerUnit: Money }
  | { mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE"; breakEvenRevenue: Money }
  | { mode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO"; contributionMarginPercent: Rational }
  | { mode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES"; contributionPerBundle: Money; breakEvenBundles: bigint }
  | { mode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY"; marginOfSafetyAmount: Money; marginOfSafetyPercent: Rational }
  | { mode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY"; targetTotalRecovery: Money; priorRecoveryTotal: Money; requiredFinalRecovery: Money }
  | { mode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL"; requiredProfitPercent: Rational }
  | { mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT"; commissionAmount: Money; netRecovery: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP"; targetNetRecovery: Money; requiredGrossSellingPrice: Money };

function requireNonNegativeMoney(value: Money, label: string): void {
  if (value.paise < 0n) throw new Error(`${label} cannot be negative.`);
}

function requirePositiveMoney(value: Money, label: string): void {
  if (value.paise <= 0n) throw new Error(`${label} must be positive.`);
}

function validateNonNegativeRate(rate: Rational, label: string): void {
  if (rate.denominator <= 0n || rate.numerator < 0n) throw new Error(`${label} must be non-negative.`);
}

function validateRateBelowHundred(rate: Rational, label: string): void {
  validateNonNegativeRate(rate, label);
  if (rate.numerator >= 100n * rate.denominator) throw new Error(`${label} must be below 100%.`);
}

function sumMoney(values: readonly Money[]): Money {
  let total = 0n;
  for (const value of values) {
    requireNonNegativeMoney(value, "Expense or recovery component");
    total += value.paise;
  }
  return moneyFromPaise(total);
}

function exactDivideMoney(numerator: bigint, denominator: bigint, label: string): Money {
  if (denominator <= 0n) throw new Error(`${label} denominator must be positive.`);
  if (numerator % denominator !== 0n) throw new Error(`${label} is not an exact paise amount.`);
  return moneyFromPaise(numerator / denominator);
}

function priceFromRate(base: Money, direction: "PROFIT" | "LOSS", rate: Rational): Money {
  requirePositiveMoney(base, "Cost base");
  validateNonNegativeRate(rate, "Commercial rate");
  if (direction === "LOSS" && rate.numerator >= 100n * rate.denominator) throw new Error("Loss rate must be below 100%.");
  const change = multiplyMoney(base, divideRational(rate, rational(100)));
  return moneyFromPaise(direction === "PROFIT" ? base.paise + change.paise : base.paise - change.paise);
}

function summarize(cost: Money, recovery: Money) {
  requirePositiveMoney(cost, "Effective cost");
  requireNonNegativeMoney(recovery, "Recovery");
  const difference = recovery.paise - cost.paise;
  const absolute = difference < 0n ? -difference : difference;
  return {
    direction: difference > 0n ? "PROFIT" as const : difference < 0n ? "LOSS" as const : "NO_CHANGE" as const,
    amount: moneyFromPaise(absolute),
    ratePercent: asPercent(rational(absolute, cost.paise)),
  };
}

function ceilDivide(numerator: bigint, denominator: bigint): bigint {
  if (numerator < 0n || denominator <= 0n) throw new Error("Ceiling division requires valid non-negative values.");
  return (numerator + denominator - 1n) / denominator;
}

export function solveEffectiveCostAdvanced(request: EffectiveCostAdvancedRequest): EffectiveCostAdvancedResult {
  switch (request.mode) {
    case "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      validateNonNegativeRate(request.overheadPercent, "Overhead rate");
      const flatExpenseTotal = sumMoney(request.flatExpenses);
      const overheadBase = request.overheadBase === "PURCHASE_PRICE"
        ? request.purchasePrice
        : moneyFromPaise(request.purchasePrice.paise + flatExpenseTotal.paise);
      const overheadAmount = multiplyMoney(overheadBase, divideRational(request.overheadPercent, rational(100)));
      return {
        mode: request.mode,
        flatExpenseTotal,
        overheadAmount,
        effectiveCost: moneyFromPaise(request.purchasePrice.paise + flatExpenseTotal.paise + overheadAmount.paise),
      };
    }
    case "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      if (request.effectiveCost.paise < request.purchasePrice.paise) throw new Error("Effective cost cannot be below purchase price.");
      return { mode: request.mode, totalExpense: moneyFromPaise(request.effectiveCost.paise - request.purchasePrice.paise) };
    }
    case "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE": {
      requirePositiveMoney(request.purchasePrice, "Purchase price");
      const flatExpenseTotal = sumMoney(request.flatExpenses);
      const overheadAmountPaise = request.effectiveCost.paise - request.purchasePrice.paise - flatExpenseTotal.paise;
      if (overheadAmountPaise < 0n) throw new Error("Effective cost is below purchase plus flat expenses.");
      const basePaise = request.overheadBase === "PURCHASE_PRICE"
        ? request.purchasePrice.paise
        : request.purchasePrice.paise + flatExpenseTotal.paise;
      return {
        mode: request.mode,
        overheadAmount: moneyFromPaise(overheadAmountPaise),
        overheadPercent: asPercent(rational(overheadAmountPaise, basePaise)),
      };
    }
    case "MANUFACTURING_COMPONENTS_TO_UNIT_COST": {
      requireNonNegativeMoney(request.rawMaterialCost, "Raw-material cost");
      requireNonNegativeMoney(request.labourCost, "Labour cost");
      requireNonNegativeMoney(request.packagingCost, "Packaging cost");
      requireNonNegativeMoney(request.scrapRecovery, "Scrap recovery");
      if (request.outputQuantity <= 0n) throw new Error("Output quantity must be positive.");
      validateNonNegativeRate(request.factoryOverheadPercentOnPrimeCost, "Factory-overhead rate");
      const primeCost = moneyFromPaise(request.rawMaterialCost.paise + request.labourCost.paise);
      const factoryOverheadAmount = multiplyMoney(primeCost, divideRational(request.factoryOverheadPercentOnPrimeCost, rational(100)));
      const netPaise = primeCost.paise + factoryOverheadAmount.paise + request.packagingCost.paise - request.scrapRecovery.paise;
      if (netPaise < 0n) throw new Error("Scrap recovery cannot exceed gross production cost.");
      const netProductionCost = moneyFromPaise(netPaise);
      return {
        mode: request.mode,
        primeCost,
        factoryOverheadAmount,
        netProductionCost,
        effectiveUnitCost: exactDivideMoney(netPaise, request.outputQuantity, "Manufacturing unit cost"),
      };
    }
    case "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST": {
      requirePositiveMoney(request.totalInputCost, "Input cost");
      requireNonNegativeMoney(request.scrapRecovery, "Scrap recovery");
      if (request.inputQuantity <= 0n || request.wastedQuantity < 0n || request.wastedQuantity >= request.inputQuantity) {
        throw new Error("Wastage must leave at least one usable unit.");
      }
      const usableQuantity = request.inputQuantity - request.wastedQuantity;
      const netPaise = request.totalInputCost.paise - request.scrapRecovery.paise;
      if (netPaise < 0n) throw new Error("Scrap recovery cannot exceed input cost.");
      return {
        mode: request.mode,
        usableQuantity,
        netRecoverableCost: moneyFromPaise(netPaise),
        effectiveUnitCost: exactDivideMoney(netPaise, usableQuantity, "Wastage-adjusted unit cost"),
      };
    }
    case "BREAK_EVEN_QUANTITY_TO_FIXED_COST": {
      if (request.breakEvenQuantity <= 0n) throw new Error("Break-even quantity must be positive.");
      const contribution = request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise;
      if (contribution <= 0n) throw new Error("Selling price must exceed variable cost.");
      return {
        mode: request.mode,
        unitContribution: moneyFromPaise(contribution),
        fixedCost: moneyFromPaise(request.breakEvenQuantity * contribution),
      };
    }
    case "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      if (request.breakEvenQuantity <= 0n) throw new Error("Break-even quantity must be positive.");
      const unitContribution = exactDivideMoney(request.fixedCost.paise, request.breakEvenQuantity, "Unit contribution");
      const variablePaise = request.sellingPricePerUnit.paise - unitContribution.paise;
      if (variablePaise < 0n) throw new Error("Derived variable cost cannot be negative.");
      return { mode: request.mode, unitContribution, variableCostPerUnit: moneyFromPaise(variablePaise) };
    }
    case "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      requireNonNegativeMoney(request.variableCostPerUnit, "Variable cost");
      requireNonNegativeMoney(request.targetProfit, "Target profit");
      if (request.quantity <= 0n) throw new Error("Quantity must be positive.");
      const fixedAndProfitPerUnit = exactDivideMoney(request.fixedCost.paise + request.targetProfit.paise, request.quantity, "Fixed-cost and profit allocation");
      return {
        mode: request.mode,
        requiredSellingPricePerUnit: moneyFromPaise(request.variableCostPerUnit.paise + fixedAndProfitPerUnit.paise),
      };
    }
    case "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      validateRateBelowHundred(request.contributionMarginPercent, "Contribution-margin ratio");
      if (request.contributionMarginPercent.numerator === 0n) throw new Error("Contribution-margin ratio must be positive.");
      return {
        mode: request.mode,
        breakEvenRevenue: multiplyMoney(request.fixedCost, rational(100n * request.contributionMarginPercent.denominator, request.contributionMarginPercent.numerator)),
      };
    }
    case "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      requirePositiveMoney(request.breakEvenRevenue, "Break-even revenue");
      if (request.fixedCost.paise > request.breakEvenRevenue.paise) throw new Error("Fixed cost cannot exceed break-even revenue when the contribution ratio is at most 100%.");
      return {
        mode: request.mode,
        contributionMarginPercent: asPercent(rational(request.fixedCost.paise, request.breakEvenRevenue.paise)),
      };
    }
    case "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES": {
      requireNonNegativeMoney(request.fixedCost, "Fixed cost");
      if (request.products.length === 0) throw new Error("At least one product is required.");
      let contributionPerBundle = 0n;
      for (const product of request.products) {
        if (product.unitsPerBundle <= 0n) throw new Error("Each product mix quantity must be positive.");
        const unitContribution = product.sellingPricePerUnit.paise - product.variableCostPerUnit.paise;
        if (unitContribution <= 0n) throw new Error("Every product must have positive unit contribution.");
        contributionPerBundle += product.unitsPerBundle * unitContribution;
      }
      return {
        mode: request.mode,
        contributionPerBundle: moneyFromPaise(contributionPerBundle),
        breakEvenBundles: ceilDivide(request.fixedCost.paise, contributionPerBundle),
      };
    }
    case "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY": {
      requirePositiveMoney(request.actualRevenue, "Actual revenue");
      requireNonNegativeMoney(request.breakEvenRevenue, "Break-even revenue");
      if (request.breakEvenRevenue.paise > request.actualRevenue.paise) throw new Error("Actual revenue is below break-even revenue.");
      const amountPaise = request.actualRevenue.paise - request.breakEvenRevenue.paise;
      return {
        mode: request.mode,
        marginOfSafetyAmount: moneyFromPaise(amountPaise),
        marginOfSafetyPercent: asPercent(rational(amountPaise, request.actualRevenue.paise)),
      };
    }
    case "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY": {
      requirePositiveMoney(request.totalCost, "Total cost");
      const priorRecoveryTotal = sumMoney(request.priorRecoveries);
      const targetTotalRecovery = priceFromRate(request.totalCost, request.targetDirection, request.targetRatePercent);
      const requiredPaise = targetTotalRecovery.paise - priorRecoveryTotal.paise;
      if (requiredPaise < 0n) throw new Error("Prior recoveries already exceed the target total recovery.");
      return {
        mode: request.mode,
        targetTotalRecovery,
        priorRecoveryTotal,
        requiredFinalRecovery: moneyFromPaise(requiredPaise),
      };
    }
    case "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL": {
      validateRateBelowHundred(request.lossPercent, "Loss rate");
      const retained = 100n * request.lossPercent.denominator - request.lossPercent.numerator;
      return {
        mode: request.mode,
        requiredProfitPercent: rational(100n * request.lossPercent.numerator, retained),
      };
    }
    case "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT": {
      requirePositiveMoney(request.effectiveCost, "Effective cost");
      requireNonNegativeMoney(request.grossSellingPrice, "Gross selling price");
      validateRateBelowHundred(request.commissionPercent, "Commission rate");
      const commissionAmount = multiplyMoney(request.grossSellingPrice, divideRational(request.commissionPercent, rational(100)));
      const netRecovery = moneyFromPaise(request.grossSellingPrice.paise - commissionAmount.paise);
      return { mode: request.mode, commissionAmount, netRecovery, ...summarize(request.effectiveCost, netRecovery) };
    }
    case "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP": {
      requirePositiveMoney(request.effectiveCost, "Effective cost");
      validateRateBelowHundred(request.commissionPercent, "Commission rate");
      const targetNetRecovery = priceFromRate(request.effectiveCost, request.targetDirection, request.targetRatePercent);
      const retained = 100n * request.commissionPercent.denominator - request.commissionPercent.numerator;
      return {
        mode: request.mode,
        targetNetRecovery,
        requiredGrossSellingPrice: multiplyMoney(targetNetRecovery, rational(100n * request.commissionPercent.denominator, retained)),
      };
    }
  }
}
