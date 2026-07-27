import assert from "node:assert/strict";
import {
  compareRetailOffers,
  moneyFromRupees,
  rational,
  solveConditionalPromotion,
  solveDiscount,
  solvePromotion,
} from "../foundation";

const money = (rupees: number) => moneyFromRupees(rupees);

const basic = solveDiscount({
  mode: "MP_DISCOUNT_TO_SP",
  markedPrice: money(2000),
  discountPercent: rational(15),
});
assert.equal(basic.sellingPrice.paise, money(1700).paise);

const successive = solveDiscount({
  mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
  discountPercents: [rational(20), rational(10)],
});
assert.equal(successive.equivalentDiscountPercent.numerator, 28n);
assert.equal(successive.equivalentDiscountPercent.denominator, 1n);

const buyGet = solvePromotion({
  mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT",
  paidUnits: 3n,
  freeUnits: 1n,
});
assert.equal(buyGet.equivalentDiscountPercent.numerator, 25n);

const capped = solveConditionalPromotion({
  mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
  billedPrice: money(5000),
  cashbackPercent: rational(10),
  cashbackCap: money(300),
});
assert.equal(capped.cashbackAmount.paise, money(300).paise);
assert.equal(capped.effectivePrice.paise, money(4700).paise);

const fraction = solveConditionalPromotion({
  mode: "DISCOUNT_FRACTION_TO_PERCENT",
  discountFraction: rational(1, 5),
});
assert.equal(fraction.discountPercent.numerator, 20n);

const ratio = solveConditionalPromotion({
  mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT",
  paidPart: rational(4),
  markedPart: rational(5),
});
assert.equal(ratio.discountPercent.numerator, 20n);

const mixed = compareRetailOffers({
  billedPrice: money(1800),
  firstOffer: { kind: "DISCOUNT", discountPercent: rational(10) },
  secondOffer: {
    kind: "MINIMUM_SPEND_COUPON",
    minimumSpend: money(2000),
    couponAmount: money(250),
  },
});
assert.equal(mixed.second.eligible, false);
assert.equal(mixed.betterOffer, "FIRST");
assert.equal(mixed.differenceAmount.paise, money(180).paise);

console.log("PNL-CP-002 completion proof passed.");
