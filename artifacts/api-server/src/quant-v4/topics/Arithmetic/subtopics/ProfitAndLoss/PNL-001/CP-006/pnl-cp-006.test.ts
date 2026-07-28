import assert from "node:assert/strict";
import {
  moneyFromRupees,
  rational,
  solveEffectiveCostRecovery,
  solveEffectiveCostAdvanced,
  verifyBreakEvenQuantity,
  verifyCommissionAdjustedResult,
  verifyContributionMarginRatio,
  verifyEffectiveCost,
  verifyManufacturingUnitCost,
  verifyRecoveryRateAfterLoss,
} from "../foundation";

const effectiveCost = solveEffectiveCostRecovery({
  mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
  purchasePrice: moneyFromRupees(10000),
  expenses: [moneyFromRupees(500), moneyFromRupees(300), moneyFromRupees(200)],
});
assert.equal(effectiveCost.totalExpense.paise, 100000n);
assert.equal(effectiveCost.effectiveCost.paise, 1100000n);
assert.equal(verifyEffectiveCost(
  moneyFromRupees(10000),
  [moneyFromRupees(500), moneyFromRupees(300), moneyFromRupees(200)],
  effectiveCost.effectiveCost,
).valid, true);

const overhead = solveEffectiveCostRecovery({
  mode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST",
  purchasePrice: moneyFromRupees(8000),
  overheadPercent: rational(10),
});
assert.equal(overhead.overheadAmount.paise, 80000n);
assert.equal(overhead.effectiveCost.paise, 880000n);

const result = solveEffectiveCostRecovery({
  mode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT",
  purchasePrice: moneyFromRupees(10000),
  expenses: [moneyFromRupees(1000)],
  sellingPrice: moneyFromRupees(13200),
});
assert.equal(result.direction, "PROFIT");
assert.equal(result.amount.paise, 220000n);
assert.equal(result.ratePercent.numerator, 20n);
assert.equal(result.ratePercent.denominator, 1n);

const allowableExpense = solveEffectiveCostRecovery({
  mode: "SP_TARGET_RATE_TO_MAX_EXPENSE",
  purchasePrice: moneyFromRupees(8000),
  sellingPrice: moneyFromRupees(11000),
  direction: "PROFIT",
  targetRatePercent: rational(10),
});
assert.equal(allowableExpense.targetEffectiveCost.paise, 1000000n);
assert.equal(allowableExpense.maximumExpense.paise, 200000n);

const wastage = solveEffectiveCostRecovery({
  mode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP",
  totalInputCost: moneyFromRupees(9000),
  inputQuantity: 100n,
  wastedQuantity: 10n,
  direction: "PROFIT",
  ratePercent: rational(25),
});
assert.equal(wastage.usableQuantity, 90n);
assert.equal(wastage.effectiveUnitCost.paise, 10000n);
assert.equal(wastage.requiredUnitSellingPrice.paise, 12500n);

const breakEven = solveEffectiveCostRecovery({
  mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY",
  fixedCost: moneyFromRupees(10000),
  variableCostPerUnit: moneyFromRupees(50),
  sellingPricePerUnit: moneyFromRupees(75),
});
assert.equal(breakEven.breakEvenQuantity, 400n);
assert.equal(verifyBreakEvenQuantity({
  fixedCost: moneyFromRupees(10000),
  variableCostPerUnit: moneyFromRupees(50),
  sellingPricePerUnit: moneyFromRupees(75),
  actualQuantity: breakEven.breakEvenQuantity,
}).valid, true);

const targetQuantity = solveEffectiveCostRecovery({
  mode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY",
  fixedCost: moneyFromRupees(10000),
  targetProfit: moneyFromRupees(5000),
  variableCostPerUnit: moneyFromRupees(50),
  sellingPricePerUnit: moneyFromRupees(75),
});
assert.equal(targetQuantity.requiredQuantity, 600n);

const breakEvenPrice = solveEffectiveCostRecovery({
  mode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP",
  fixedCost: moneyFromRupees(12000),
  variableCostPerUnit: moneyFromRupees(70),
  quantity: 400n,
});
assert.equal(breakEvenPrice.breakEvenSellingPricePerUnit.paise, 10000n);

const secondBreakEvenSale = solveEffectiveCostRecovery({
  mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP",
  firstCostPrice: moneyFromRupees(5000),
  firstSellingPrice: moneyFromRupees(4000),
  secondCostPrice: moneyFromRupees(3000),
  targetDirection: "PROFIT",
  targetRatePercent: rational(0),
});
assert.equal(secondBreakEvenSale.requiredSecondSellingPrice.paise, 400000n);

const secondTargetSale = solveEffectiveCostRecovery({
  mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP",
  firstCostPrice: moneyFromRupees(5000),
  firstSellingPrice: moneyFromRupees(4000),
  secondCostPrice: moneyFromRupees(3000),
  targetDirection: "PROFIT",
  targetRatePercent: rational(10),
});
assert.equal(secondTargetSale.requiredSecondSellingPrice.paise, 480000n);

const recoveredCost = solveEffectiveCostRecovery({
  mode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST",
  totalRecovery: moneyFromRupees(13200),
  direction: "PROFIT",
  ratePercent: rational(20),
});
assert.equal(recoveredCost.effectiveCost.paise, 1100000n);

const mixedOverhead = solveEffectiveCostAdvanced({
  mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
  purchasePrice: moneyFromRupees(10000),
  flatExpenses: [moneyFromRupees(600), moneyFromRupees(400)],
  overheadPercent: rational(10),
  overheadBase: "PURCHASE_PLUS_FLAT",
});
assert.equal(mixedOverhead.flatExpenseTotal.paise, 100000n);
assert.equal(mixedOverhead.overheadAmount.paise, 110000n);
assert.equal(mixedOverhead.effectiveCost.paise, 1210000n);

const inverseOverhead = solveEffectiveCostAdvanced({
  mode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE",
  purchasePrice: moneyFromRupees(10000),
  flatExpenses: [moneyFromRupees(600), moneyFromRupees(400)],
  effectiveCost: moneyFromRupees(12100),
  overheadBase: "PURCHASE_PLUS_FLAT",
});
assert.equal(inverseOverhead.overheadPercent.numerator, 10n);
assert.equal(inverseOverhead.overheadPercent.denominator, 1n);

const manufacturing = solveEffectiveCostAdvanced({
  mode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST",
  rawMaterialCost: moneyFromRupees(5000),
  labourCost: moneyFromRupees(3000),
  factoryOverheadPercentOnPrimeCost: rational(25),
  packagingCost: moneyFromRupees(1000),
  outputQuantity: 100n,
  scrapRecovery: moneyFromRupees(1000),
});
assert.equal(manufacturing.primeCost.paise, 800000n);
assert.equal(manufacturing.factoryOverheadAmount.paise, 200000n);
assert.equal(manufacturing.netProductionCost.paise, 1000000n);
assert.equal(manufacturing.effectiveUnitCost.paise, 10000n);
assert.equal(verifyManufacturingUnitCost({
  rawMaterialCost: moneyFromRupees(5000),
  labourCost: moneyFromRupees(3000),
  factoryOverheadPercent: rational(25),
  packagingCost: moneyFromRupees(1000),
  scrapRecovery: moneyFromRupees(1000),
  outputQuantity: 100n,
  actualUnitCost: manufacturing.effectiveUnitCost,
}).valid, true);

const scrapAdjusted = solveEffectiveCostAdvanced({
  mode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST",
  totalInputCost: moneyFromRupees(9000),
  inputQuantity: 100n,
  wastedQuantity: 10n,
  scrapRecovery: moneyFromRupees(900),
});
assert.equal(scrapAdjusted.usableQuantity, 90n);
assert.equal(scrapAdjusted.effectiveUnitCost.paise, 9000n);

const fixedCostInverse = solveEffectiveCostAdvanced({
  mode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST",
  breakEvenQuantity: 400n,
  variableCostPerUnit: moneyFromRupees(50),
  sellingPricePerUnit: moneyFromRupees(75),
});
assert.equal(fixedCostInverse.fixedCost.paise, 1000000n);

const variableCostInverse = solveEffectiveCostAdvanced({
  mode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST",
  fixedCost: moneyFromRupees(10000),
  breakEvenQuantity: 400n,
  sellingPricePerUnit: moneyFromRupees(75),
});
assert.equal(variableCostInverse.variableCostPerUnit.paise, 5000n);

const targetPrice = solveEffectiveCostAdvanced({
  mode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP",
  fixedCost: moneyFromRupees(10000),
  variableCostPerUnit: moneyFromRupees(50),
  quantity: 600n,
  targetProfit: moneyFromRupees(5000),
});
assert.equal(targetPrice.requiredSellingPricePerUnit.paise, 7500n);

const breakEvenRevenue = solveEffectiveCostAdvanced({
  mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
  fixedCost: moneyFromRupees(12000),
  contributionMarginPercent: rational(40),
});
assert.equal(breakEvenRevenue.breakEvenRevenue.paise, 3000000n);

const contributionRatio = solveEffectiveCostAdvanced({
  mode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO",
  fixedCost: moneyFromRupees(12000),
  breakEvenRevenue: moneyFromRupees(30000),
});
assert.equal(contributionRatio.contributionMarginPercent.numerator, 40n);
assert.equal(verifyContributionMarginRatio(
  moneyFromRupees(12000),
  moneyFromRupees(30000),
  contributionRatio.contributionMarginPercent,
).valid, true);

const productMix = solveEffectiveCostAdvanced({
  mode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES",
  fixedCost: moneyFromRupees(12000),
  products: [
    { unitsPerBundle: 2n, sellingPricePerUnit: moneyFromRupees(100), variableCostPerUnit: moneyFromRupees(60) },
    { unitsPerBundle: 1n, sellingPricePerUnit: moneyFromRupees(150), variableCostPerUnit: moneyFromRupees(90) },
  ],
});
assert.equal(productMix.contributionPerBundle.paise, 14000n);
assert.equal(productMix.breakEvenBundles, 86n);

const marginOfSafety = solveEffectiveCostAdvanced({
  mode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY",
  actualRevenue: moneyFromRupees(50000),
  breakEvenRevenue: moneyFromRupees(30000),
});
assert.equal(marginOfSafety.marginOfSafetyAmount.paise, 2000000n);
assert.equal(marginOfSafety.marginOfSafetyPercent.numerator, 40n);

const finalRecovery = solveEffectiveCostAdvanced({
  mode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY",
  totalCost: moneyFromRupees(10000),
  priorRecoveries: [moneyFromRupees(4000), moneyFromRupees(3000)],
  targetDirection: "PROFIT",
  targetRatePercent: rational(10),
});
assert.equal(finalRecovery.requiredFinalRecovery.paise, 400000n);

const recoveryRate = solveEffectiveCostAdvanced({
  mode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL",
  lossPercent: rational(20),
});
assert.equal(recoveryRate.requiredProfitPercent.numerator, 25n);
assert.equal(recoveryRate.requiredProfitPercent.denominator, 1n);
assert.equal(verifyRecoveryRateAfterLoss(rational(20), recoveryRate.requiredProfitPercent).valid, true);

const commissionResult = solveEffectiveCostAdvanced({
  mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
  effectiveCost: moneyFromRupees(10000),
  grossSellingPrice: moneyFromRupees(12500),
  commissionPercent: rational(4),
});
assert.equal(commissionResult.commissionAmount.paise, 50000n);
assert.equal(commissionResult.netRecovery.paise, 1200000n);
assert.equal(commissionResult.direction, "PROFIT");
assert.equal(commissionResult.amount.paise, 200000n);
assert.equal(commissionResult.ratePercent.numerator, 20n);
assert.equal(verifyCommissionAdjustedResult({
  effectiveCost: moneyFromRupees(10000),
  grossSellingPrice: moneyFromRupees(12500),
  commissionPercent: rational(4),
  actualNetRecovery: commissionResult.netRecovery,
  actualAmount: commissionResult.amount,
}).valid, true);

const commissionTarget = solveEffectiveCostAdvanced({
  mode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP",
  effectiveCost: moneyFromRupees(10000),
  targetDirection: "PROFIT",
  targetRatePercent: rational(20),
  commissionPercent: rational(4),
});
assert.equal(commissionTarget.targetNetRecovery.paise, 1200000n);
assert.equal(commissionTarget.requiredGrossSellingPrice.paise, 1250000n);
