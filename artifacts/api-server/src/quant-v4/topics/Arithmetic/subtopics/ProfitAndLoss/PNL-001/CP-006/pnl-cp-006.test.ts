import assert from "node:assert/strict";
import {
  moneyFromRupees,
  rational,
  solveEffectiveCostRecovery,
} from "../foundation";

const effectiveCost = solveEffectiveCostRecovery({
  mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
  purchasePrice: moneyFromRupees(10000),
  expenses: [moneyFromRupees(500), moneyFromRupees(300), moneyFromRupees(200)],
});
assert.equal(effectiveCost.totalExpense.paise, 100000n);
assert.equal(effectiveCost.effectiveCost.paise, 1100000n);

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
