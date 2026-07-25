import assert from "node:assert/strict";
import {
  moneyFromPaise,
  rational,
  solveConditionalPromotion,
  solveDiscount,
  solvePromotion,
} from "../foundation";

const rupees = (value: number) => moneyFromPaise(BigInt(value * 100));

{
  const result = solveDiscount({
    mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
    discountPercents: [rational(20), rational(10)],
  });
  assert.deepEqual(result.equivalentDiscountPercent, rational(28));
}

{
  const result = solvePromotion({
    mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT",
    paidUnits: 3n,
    freeUnits: 1n,
  });
  assert.deepEqual(result.equivalentDiscountPercent, rational(25));
}

{
  const result = solveConditionalPromotion({
    mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP",
    markedPrice: rupees(10000),
    discountPercents: [rational(10), rational(20), rational(25)],
  });
  assert.equal(result.sellingPrice.paise, rupees(5400).paise);
}

{
  const eligible = solveConditionalPromotion({
    mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE",
    billedPrice: rupees(2500),
    minimumSpend: rupees(2000),
    couponAmount: rupees(300),
  });
  assert.equal(eligible.couponApplied, true);
  assert.equal(eligible.effectivePrice.paise, rupees(2200).paise);

  const ineligible = solveConditionalPromotion({
    mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE",
    billedPrice: rupees(1800),
    minimumSpend: rupees(2000),
    couponAmount: rupees(300),
  });
  assert.equal(ineligible.couponApplied, false);
  assert.equal(ineligible.effectivePrice.paise, rupees(1800).paise);
}

{
  const result = solveConditionalPromotion({
    mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
    billedPrice: rupees(6000),
    cashbackPercent: rational(10),
    cashbackCap: rupees(400),
  });
  assert.equal(result.cashbackAmount.paise, rupees(400).paise);
  assert.equal(result.effectivePrice.paise, rupees(5600).paise);
}

{
  const result = solveConditionalPromotion({
    mode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT",
    markedPrice: rupees(5000),
    discountPercent: rational(20),
    cashbackPercent: rational(10),
    cashbackCap: rupees(600),
  });
  assert.equal(result.billedPrice.paise, rupees(4000).paise);
  assert.equal(result.cashbackAmount.paise, rupees(500).paise);
  assert.equal(result.effectivePrice.paise, rupees(3500).paise);
}

{
  const fraction = solveConditionalPromotion({
    mode: "DISCOUNT_FRACTION_TO_PERCENT",
    discountFraction: rational(1, 5),
  });
  assert.deepEqual(fraction.discountPercent, rational(20));

  const ratio = solveConditionalPromotion({
    mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT",
    paidPart: rational(4),
    markedPart: rational(5),
  });
  assert.deepEqual(ratio.discountPercent, rational(20));
}

console.log("PNL-CP-002 runtime proof passed.");
