import assert from "node:assert/strict";
import {
  moneyFromPaise,
  rational,
  solveDishonestTrade,
  solveDishonestTradeAdvanced,
  verifyBuyHeavySellLightRate,
  verifyCustomerOverchargeRate,
  verifyFalseQuantityRate,
} from "../foundation";

function assertPercent(value: { numerator: bigint; denominator: bigint }, expected: bigint, scale = 1n): void {
  assert.equal(value.numerator * scale, value.denominator * expected);
}

const falseWeightAtCost = solveDishonestTrade({
  mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
  costPricePerTrueQuantity: moneyFromPaise(10000n),
  quotedSellingPricePerNominalQuantity: moneyFromPaise(10000n),
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
});
assert.equal(falseWeightAtCost.direction, "PROFIT");
assertPercent(falseWeightAtCost.ratePercent, 25n);
assert.equal(
  verifyFalseQuantityRate(
    moneyFromPaise(10000n),
    moneyFromPaise(10000n),
    1000n,
    800n,
    falseWeightAtCost.ratePercent,
  ).valid,
  true,
);

const declaredProfit = solveDishonestTrade({
  mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
  costPricePerTrueQuantity: moneyFromPaise(10000n),
  declaredDirection: "PROFIT",
  declaredRatePercent: rational(10),
  trueQuantity: 1000n,
  deliveredQuantity: 900n,
});
assert.equal(declaredProfit.direction, "PROFIT");
assert.equal(declaredProfit.ratePercent.numerator * 9n, declaredProfit.ratePercent.denominator * 200n);

const targetQuantity = solveDishonestTrade({
  mode: "TARGET_RATE_TO_DELIVERED_QUANTITY",
  costPricePerTrueQuantity: moneyFromPaise(10000n),
  quotedSellingPricePerNominalQuantity: moneyFromPaise(10000n),
  trueQuantity: 1000n,
  targetDirection: "PROFIT",
  targetRatePercent: rational(25),
});
assert.equal(targetQuantity.deliveredQuantity.numerator, 800n);
assert.equal(targetQuantity.deliveredQuantity.denominator, 1n);

const dualCheating = solveDishonestTrade({
  mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
  purchasePricePerNominalQuantity: moneyFromPaise(10000n),
  sellingPricePerNominalQuantity: moneyFromPaise(10000n),
  nominalQuantity: 1000n,
  receivedQuantity: 1100n,
  deliveredQuantity: 900n,
});
assert.equal(dualCheating.direction, "PROFIT");
assert.equal(dualCheating.ratePercent.numerator * 9n, dualCheating.ratePercent.denominator * 200n);
assert.equal(
  verifyBuyHeavySellLightRate(
    moneyFromPaise(10000n),
    moneyFromPaise(10000n),
    1100n,
    900n,
    dualCheating.ratePercent,
  ).valid,
  true,
);

const markupDiscount = solveDishonestTrade({
  mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
  costPricePerTrueQuantity: moneyFromPaise(10000n),
  markupPercent: rational(25),
  discountPercent: rational(20),
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
});
assert.equal(markupDiscount.quotedSellingPrice.paise, 10000n);
assertPercent(markupDiscount.ratePercent, 25n);

const priceCutAndShortQuantity = solveDishonestTrade({
  mode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE",
  costPricePerTrueQuantity: moneyFromPaise(10000n),
  priceDirection: "DECREASE",
  priceChangePercent: rational(10),
  trueQuantity: 1000n,
  shortQuantityPercent: rational(20),
});
assert.equal(priceCutAndShortQuantity.direction, "PROFIT");
assert.equal(priceCutAndShortQuantity.ratePercent.numerator * 2n, priceCutAndShortQuantity.ratePercent.denominator * 25n);

const customerOvercharge = solveDishonestTrade({
  mode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE",
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
});
assertPercent(customerOvercharge.overchargePercent, 25n);
assert.equal(verifyCustomerOverchargeRate(1000n, 800n, customerOvercharge.overchargePercent).valid, true);

const declaredRateInverse = solveDishonestTrade({
  mode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE",
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
  actualDirection: "PROFIT",
  actualRatePercent: rational(25),
});
assert.equal(declaredRateInverse.declaredDirection, "NO_CHANGE");
assert.equal(declaredRateInverse.declaredRatePercent.numerator, 0n);

const recoveredCost = solveDishonestTradeAdvanced({
  mode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
  quotedSellingPricePerNominalQuantity: moneyFromPaise(10000n),
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
  actualDirection: "PROFIT",
  actualRatePercent: rational(25),
});
assert.equal(recoveredCost.costPricePerTrueQuantity.paise, 10000n);

const effectivePrice = solveDishonestTradeAdvanced({
  mode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY",
  quotedSellingPricePerNominalQuantity: moneyFromPaise(10000n),
  trueQuantity: 1000n,
  deliveredQuantity: 800n,
});
assert.equal(effectivePrice.effectivePricePerTrueQuantity.numerator, 12500n);
assert.equal(effectivePrice.effectivePricePerTrueQuantity.denominator, 1n);

const comparison = solveDishonestTradeAdvanced({
  mode: "COMPARE_TWO_DISHONEST_SCHEMES",
  firstScheme: {
    costPricePerTrueQuantity: moneyFromPaise(10000n),
    quotedSellingPricePerNominalQuantity: moneyFromPaise(10000n),
    trueQuantity: 1000n,
    deliveredQuantity: 800n,
  },
  secondScheme: {
    costPricePerTrueQuantity: moneyFromPaise(10000n),
    quotedSellingPricePerNominalQuantity: moneyFromPaise(11000n),
    trueQuantity: 1000n,
    deliveredQuantity: 900n,
  },
});
assert.equal(comparison.moreProfitableScheme, "FIRST");
