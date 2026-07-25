import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { divideRational, rational, subtractRational } from "./rational";
import { sellingPriceAfterDiscount } from "./math";

export type ConditionalPromotionRequest =
  | { mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP"; markedPrice: Money; discountPercents: readonly Rational[] }
  | { mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE"; billedPrice: Money; minimumSpend: Money; couponAmount: Money }
  | { mode: "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE"; markedPrice: Money; discountPercent: Rational; couponPercent: Rational }
  | { mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT"; billedPrice: Money; cashbackPercent: Rational; cashbackCap?: Money }
  | { mode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT"; markedPrice: Money; discountPercent: Rational; cashbackPercent: Rational; cashbackCap?: Money }
  | { mode: "DISCOUNT_FRACTION_TO_PERCENT"; discountFraction: Rational }
  | { mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT"; paidPart: Rational; markedPart: Rational };

export type ConditionalPromotionResult =
  | { mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP"; sellingPrice: Money }
  | { mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE"; couponApplied: boolean; effectivePrice: Money }
  | { mode: "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE"; effectivePrice: Money }
  | { mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT"; cashbackAmount: Money; effectivePrice: Money }
  | { mode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT"; billedPrice: Money; cashbackAmount: Money; effectivePrice: Money }
  | { mode: "DISCOUNT_FRACTION_TO_PERCENT"; discountPercent: Rational }
  | { mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT"; discountPercent: Rational };

function validatePercent(value: Rational, name: string): void {
  if (value.denominator <= 0n || value.numerator < 0n) throw new Error(`${name} must be non-negative.`);
  if (value.numerator > 100n * value.denominator) throw new Error(`${name} cannot exceed 100%.`);
}

function percentAmount(base: Money, percent: Rational): Money {
  validatePercent(percent, "Percentage");
  return multiplyMoney(base, divideRational(percent, rational(100)));
}

function applyCap(amount: Money, cap?: Money): Money {
  if (!cap) return amount;
  if (cap.paise < 0n) throw new Error("Cashback cap cannot be negative.");
  return amount.paise <= cap.paise ? amount : cap;
}

export function solveConditionalPromotion(request: ConditionalPromotionRequest): ConditionalPromotionResult {
  switch (request.mode) {
    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP": {
      if (request.discountPercents.length < 3) throw new Error("At least three discounts are required.");
      let sellingPrice = request.markedPrice;
      for (const discount of request.discountPercents) sellingPrice = sellingPriceAfterDiscount(sellingPrice, discount);
      return { mode: request.mode, sellingPrice };
    }
    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE": {
      if (request.minimumSpend.paise < 0n || request.couponAmount.paise < 0n) throw new Error("Spend and coupon values cannot be negative.");
      const couponApplied = request.billedPrice.paise >= request.minimumSpend.paise;
      if (couponApplied && request.couponAmount.paise > request.billedPrice.paise) throw new Error("Coupon exceeds billed price.");
      return {
        mode: request.mode,
        couponApplied,
        effectivePrice: couponApplied
          ? moneyFromPaise(request.billedPrice.paise - request.couponAmount.paise)
          : request.billedPrice,
      };
    }
    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE": {
      const billedPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      return {
        mode: request.mode,
        effectivePrice: sellingPriceAfterDiscount(billedPrice, request.couponPercent),
      };
    }
    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT": {
      const cashbackAmount = applyCap(percentAmount(request.billedPrice, request.cashbackPercent), request.cashbackCap);
      return {
        mode: request.mode,
        cashbackAmount,
        effectivePrice: moneyFromPaise(request.billedPrice.paise - cashbackAmount.paise),
      };
    }
    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT": {
      const billedPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      const cashbackAmount = applyCap(percentAmount(request.markedPrice, request.cashbackPercent), request.cashbackCap);
      if (cashbackAmount.paise > billedPrice.paise) throw new Error("Cashback exceeds billed price.");
      return {
        mode: request.mode,
        billedPrice,
        cashbackAmount,
        effectivePrice: moneyFromPaise(billedPrice.paise - cashbackAmount.paise),
      };
    }
    case "DISCOUNT_FRACTION_TO_PERCENT": {
      if (
        request.discountFraction.denominator <= 0n ||
        request.discountFraction.numerator < 0n ||
        request.discountFraction.numerator > request.discountFraction.denominator
      ) {
        throw new Error("Discount fraction must lie between zero and one.");
      }
      return {
        mode: request.mode,
        discountPercent: rational(
          100n * request.discountFraction.numerator,
          request.discountFraction.denominator,
        ),
      };
    }
    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT": {
      if (
        request.markedPart.denominator <= 0n ||
        request.paidPart.denominator <= 0n ||
        request.markedPart.numerator <= 0n ||
        request.paidPart.numerator < 0n
      ) {
        throw new Error("Ratio parts must be valid.");
      }
      const retained = divideRational(request.paidPart, request.markedPart);
      if (retained.numerator > retained.denominator) throw new Error("Paid part cannot exceed marked part in a discount question.");
      return {
        mode: request.mode,
        discountPercent: rational(100n * (retained.denominator - retained.numerator), retained.denominator),
      };
    }
  }
}
