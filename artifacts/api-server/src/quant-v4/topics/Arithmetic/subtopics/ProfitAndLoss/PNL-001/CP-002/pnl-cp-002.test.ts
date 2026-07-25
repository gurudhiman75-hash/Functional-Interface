import assert from "node:assert/strict";
import {
  rational,
  moneyFromRupees,
  solveDiscount,
  solvePromotion,
  solveConditionalPromotion,
} from "../foundation";

const rupees = (value: number) => moneyFromRupees(value);

assert.equal(
  solveDiscount({ mode: "MP_DISCOUNT_TO_SP", markedPrice: rupees(2000), discountPercent: rational(15) }).sellingPrice.paise,
  rupees(1700).paise,
);

assert.deepEqual(
  solveDiscount({ mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT", discountPercents: [rational(20), rational(10)] }).equivalentDiscountPercent,
  rational(28),
);

assert.deepEqual(
  solveDiscount({ mode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT", knownDiscountPercent: rational(20), equivalentDiscountPercent: rational(28) }).missingDiscountPercent,
  rational(10),
);

const calibration = solveDiscount({
  mode: "CP_MARKUP_DISCOUNT_TO_RESULT",
  costPrice: rupees(1000),
  markupPercent: rational(25),
  discountPercent: rational(20),
});
assert.equal(calibration.direction, "NO_CHANGE");
assert.equal(calibration.sellingPrice.paise, rupees(1000).paise);

assert.deepEqual(
  solvePromotion({ mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT", paidUnits: 2n, freeUnits: 1n }).equivalentDiscountPercent,
  rational(100, 3),
);

assert.equal(
  solvePromotion({ mode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE", unitMarkedPrice: rupees(300), paidUnits: 2n, freeUnits: 1n }).effectiveUnitPrice.paise,
  rupees(200).paise,
);

assert.equal(
  solvePromotion({ mode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE", markedPrice: rupees(2000), discountPercent: rational(10), couponAmount: rupees(200) }).effectivePrice.paise,
  rupees(1600).paise,
);

const comparison = solvePromotion({
  mode: "DISCOUNT_VS_CASHBACK_COMPARE",
  markedPrice: rupees(2000),
  discountPercent: rational(15),
  cashbackAmount: rupees(250),
});
assert.equal(comparison.betterOffer, "DISCOUNT");
assert.equal(comparison.differenceAmount.paise, rupees(50).paise);

assert.equal(
  solveConditionalPromotion({
    mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP",
    markedPrice: rupees(1000),
    discountPercents: [rational(10), rational(20), rational(25)],
  }).sellingPrice.paise,
  rupees(540).paise,
);

const capped = solveConditionalPromotion({
  mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
  billedPrice: rupees(5000),
  cashbackPercent: rational(10),
  cashbackCap: rupees(300),
});
assert.equal(capped.cashbackAmount.paise, rupees(300).paise);
assert.equal(capped.effectivePrice.paise, rupees(4700).paise);

assert.deepEqual(
  solveConditionalPromotion({ mode: "DISCOUNT_FRACTION_TO_PERCENT", discountFraction: rational(1, 5) }).discountPercent,
  rational(20),
);

assert.deepEqual(
  solveConditionalPromotion({ mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT", paidPart: rational(4), markedPart: rational(5) }).discountPercent,
  rational(20),
);

console.log("PNL-CP-002 runtime proof passed.");
