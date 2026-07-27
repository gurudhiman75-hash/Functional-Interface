import assert from "node:assert/strict";
import {
  moneyFromPaise,
  rational,
  solveInventory,
  solveInventoryAdvanced,
  verifyInventoryIdentity,
  verifyMultipleLotsResult,
} from "../foundation";

const multipleLots = [
  { quantity: 10n, unitCostPrice: moneyFromPaise(10000n), unitSellingPrice: moneyFromPaise(12000n) },
  { quantity: 5n, unitCostPrice: moneyFromPaise(20000n), unitSellingPrice: moneyFromPaise(18000n) },
] as const;
const lotsResult = solveInventory({ mode: "MULTIPLE_LOTS_TO_OVERALL_RESULT", lots: multipleLots });
assert.equal(lotsResult.direction, "PROFIT");
assert.equal(verifyMultipleLotsResult(multipleLots, lotsResult).valid, true);

const equalSpecial = solveInventoryAdvanced({ mode: "EQUAL_SP_EQUAL_RATES_SPECIAL", ratePercent: rational(20) });
assert.equal(equalSpecial.direction, "LOSS");
assert.equal(equalSpecial.ratePercent.numerator, equalSpecial.ratePercent.denominator * 4n);

const unsold = solveInventoryAdvanced({
  mode: "UNSOLD_STOCK_REQUIRED_UNIT_PRICE",
  totalQuantity: 100n,
  unitCostPrice: moneyFromPaise(10000n),
  soldGroups: [{ quantity: 60n, unitSellingPrice: moneyFromPaise(12000n) }],
  targetDirection: "PROFIT",
  targetRatePercent: rational(10),
});
assert.equal(unsold.requiredUnitSellingPrice.paise, 9500n);

const spoilage = solveInventoryAdvanced({
  mode: "SPOILED_STOCK_REQUIRED_RECOVERY",
  totalQuantity: 100n,
  unitCostPrice: moneyFromPaise(10000n),
  goodQuantity: 80n,
  goodUnitSellingPrice: moneyFromPaise(12000n),
  spoiledQuantity: 20n,
  targetDirection: "PROFIT",
  targetRatePercent: rational(0),
});
assert.equal(spoilage.requiredRecoveryPerSpoiledUnit.paise, 2000n);

const fraction = solveInventoryAdvanced({
  mode: "RECOVERY_FRACTION_TO_OVERALL_RESULT",
  totalCostPrice: moneyFromPaise(1000000n),
  recoveredFraction: rational(9, 10),
});
assert.equal(fraction.direction, "LOSS");
assert.equal(fraction.ratePercent.numerator, fraction.ratePercent.denominator * 10n);

verifyInventoryIdentity(lotsResult.totalCost.paise === 200000n, "multiple-lot total cost");
verifyInventoryIdentity(lotsResult.totalSelling.paise === 210000n, "multiple-lot total selling");
