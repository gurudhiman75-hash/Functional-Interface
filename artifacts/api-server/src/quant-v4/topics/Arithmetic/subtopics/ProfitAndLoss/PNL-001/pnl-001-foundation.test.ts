import assert from "node:assert/strict";
import {
  compareRational,
  moneyFromRupees,
  rational,
  solveFundamental,
} from "./foundation";

const equalMoney = (actual: { paise: bigint }, rupees: number) =>
  assert.deepEqual(actual, moneyFromRupees(rupees));

assert.deepEqual(rational(2, 6), rational(1, 3));

const amount = solveFundamental({
  mode: "CP_SP_TO_AMOUNT",
  costPrice: moneyFromRupees(800),
  sellingPrice: moneyFromRupees(1000),
});
assert.equal(amount.mode, "CP_SP_TO_AMOUNT");
assert.equal(amount.direction, "PROFIT");
equalMoney(amount.amount, 200);

const sp = solveFundamental({
  mode: "CP_RATE_TO_SP",
  costPrice: moneyFromRupees(800),
  direction: "PROFIT",
  ratePercent: rational(25),
});
assert.equal(sp.mode, "CP_RATE_TO_SP");
equalMoney(sp.sellingPrice, 1000);

const cp = solveFundamental({
  mode: "SP_RATE_TO_CP",
  sellingPrice: moneyFromRupees(900),
  direction: "LOSS",
  ratePercent: rational(10),
});
assert.equal(cp.mode, "SP_RATE_TO_CP");
equalMoney(cp.costPrice, 1000);

const cpFromAmount = solveFundamental({
  mode: "AMOUNT_RATE_TO_CP",
  amount: moneyFromRupees(240),
  direction: "PROFIT",
  ratePercent: rational(20),
});
assert.equal(cpFromAmount.mode, "AMOUNT_RATE_TO_CP");
equalMoney(cpFromAmount.costPrice, 1200);

const ratioRate = solveFundamental({
  mode: "CP_SP_RATIO_TO_RATE",
  costPart: rational(4),
  sellingPart: rational(5),
});
assert.equal(ratioRate.mode, "CP_SP_RATIO_TO_RATE");
assert.equal(ratioRate.direction, "PROFIT");
assert.equal(compareRational(ratioRate.ratePercent, rational(25)), 0);

const margin = solveFundamental({
  mode: "PROFIT_CP_TO_MARGIN_SP",
  profitPercent: rational(25),
});
assert.equal(margin.mode, "PROFIT_CP_TO_MARGIN_SP");
assert.equal(compareRational(margin.marginPercent, rational(20)), 0);

const fractionRate = solveFundamental({
  mode: "FRACTION_TO_RATE",
  direction: "PROFIT",
  amountFraction: rational(1, 5),
  fractionBase: "SELLING_PRICE",
});
assert.equal(fractionRate.mode, "FRACTION_TO_RATE");
assert.equal(compareRational(fractionRate.ratePercent, rational(25)), 0);

const difference = solveFundamental({
  mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
  costPrice: moneyFromRupees(1000),
  firstDirection: "PROFIT",
  firstRatePercent: rational(20),
  secondDirection: "LOSS",
  secondRatePercent: rational(10),
});
assert.equal(difference.mode, "CP_TWO_RATES_TO_SP_DIFFERENCE");
equalMoney(difference.difference, 300);

const cpFromDifference = solveFundamental({
  mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
  difference: moneyFromRupees(300),
  firstDirection: "PROFIT",
  firstRatePercent: rational(20),
  secondDirection: "LOSS",
  secondRatePercent: rational(10),
});
assert.equal(cpFromDifference.mode, "SP_DIFFERENCE_TWO_RATES_TO_CP");
equalMoney(cpFromDifference.costPrice, 1000);

const secondCondition = solveFundamental({
  mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE",
  firstSellingPrice: moneyFromRupees(1200),
  firstDirection: "PROFIT",
  firstRatePercent: rational(20),
  secondSellingPrice: moneyFromRupees(900),
});
assert.equal(secondCondition.mode, "TWO_SELLING_CONDITIONS_TO_SECOND_RATE");
assert.equal(secondCondition.direction, "LOSS");
assert.equal(compareRational(secondCondition.ratePercent, rational(10)), 0);

console.log("PNL-001 CP-001 runtime proof passed.");
