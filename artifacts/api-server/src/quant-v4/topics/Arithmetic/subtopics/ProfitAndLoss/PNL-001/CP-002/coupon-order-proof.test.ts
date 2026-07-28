import assert from "node:assert/strict";
import { compareCouponOrder, moneyFromRupees, rational } from "../foundation";

const result = compareCouponOrder({
  markedPrice: moneyFromRupees(1000),
  discountPercent: rational(20),
  couponAmount: moneyFromRupees(100),
});

assert.equal(result.discountThenCouponPrice.paise, moneyFromRupees(700).paise);
assert.equal(result.couponThenDiscountPrice.paise, moneyFromRupees(720).paise);
assert.equal(result.betterOrder, "DISCOUNT_THEN_COUPON");
assert.equal(result.differenceAmount.paise, moneyFromRupees(20).paise);

console.log("PNL-CP-002 coupon-order proof passed.");
