import type { Money, Rational } from "./types";
import { moneyFromPaise } from "./money";
import { sellingPriceAfterDiscount } from "./math";

export type CouponOrderComparisonResult = Readonly<{
  discountThenCouponPrice: Money;
  couponThenDiscountPrice: Money;
  betterOrder: "DISCOUNT_THEN_COUPON" | "COUPON_THEN_DISCOUNT" | "SAME";
  differenceAmount: Money;
}>;

export function compareCouponOrder(input: {
  markedPrice: Money;
  discountPercent: Rational;
  couponAmount: Money;
}): CouponOrderComparisonResult {
  if (input.markedPrice.paise < 0n) throw new Error("Marked price cannot be negative.");
  if (input.couponAmount.paise < 0n || input.couponAmount.paise > input.markedPrice.paise) {
    throw new Error("Coupon amount must lie between zero and marked price.");
  }

  const afterDiscount = sellingPriceAfterDiscount(input.markedPrice, input.discountPercent);
  if (input.couponAmount.paise > afterDiscount.paise) {
    throw new Error("Coupon amount cannot exceed the discounted price.");
  }
  const discountThenCouponPrice = moneyFromPaise(afterDiscount.paise - input.couponAmount.paise);

  const afterCoupon = moneyFromPaise(input.markedPrice.paise - input.couponAmount.paise);
  const couponThenDiscountPrice = sellingPriceAfterDiscount(afterCoupon, input.discountPercent);
  const difference = discountThenCouponPrice.paise - couponThenDiscountPrice.paise;

  return {
    discountThenCouponPrice,
    couponThenDiscountPrice,
    betterOrder: difference < 0n
      ? "DISCOUNT_THEN_COUPON"
      : difference > 0n
        ? "COUPON_THEN_DISCOUNT"
        : "SAME",
    differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference),
  };
}
