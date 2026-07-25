import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import { asPercent, divideRational, rational, subtractRational } from "./rational";
import { sellingPriceAfterDiscount } from "./math";

export type PromotionSolveRequest =
  | { mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT"; paidUnits: bigint; freeUnits: bigint }
  | { mode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE"; unitMarkedPrice: Money; paidUnits: bigint; freeUnits: bigint }
  | { mode: "CASHBACK_TO_EFFECTIVE_PRICE"; billedPrice: Money; cashbackAmount: Money }
  | { mode: "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE"; billedPrice: Money; cashbackPercent: Rational }
  | { mode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE"; markedPrice: Money; discountPercent: Rational; couponAmount: Money }
  | { mode: "DISCOUNT_VS_CASHBACK_COMPARE"; markedPrice: Money; discountPercent: Rational; cashbackAmount: Money };

export type PromotionSolveResult =
  | { mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT"; equivalentDiscountPercent: Rational }
  | { mode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE"; effectiveUnitPrice: Money }
  | { mode: "CASHBACK_TO_EFFECTIVE_PRICE"; effectivePrice: Money }
  | { mode: "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE"; effectivePrice: Money }
  | { mode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE"; effectivePrice: Money }
  | { mode: "DISCOUNT_VS_CASHBACK_COMPARE"; betterOffer: "DISCOUNT" | "CASHBACK" | "SAME"; differenceAmount: Money };

function validateUnits(paidUnits: bigint, freeUnits: bigint): void {
  if (paidUnits <= 0n) throw new Error("Paid units must be positive.");
  if (freeUnits < 0n) throw new Error("Free units cannot be negative.");
}

export function solvePromotion(request: PromotionSolveRequest): PromotionSolveResult {
  switch (request.mode) {
    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT": {
      validateUnits(request.paidUnits, request.freeUnits);
      const totalUnits = request.paidUnits + request.freeUnits;
      return {
        mode: request.mode,
        equivalentDiscountPercent: asPercent(divideRational(rational(request.freeUnits), rational(totalUnits))),
      };
    }

    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE": {
      validateUnits(request.paidUnits, request.freeUnits);
      const totalUnits = request.paidUnits + request.freeUnits;
      const totalPaid = multiplyMoney(request.unitMarkedPrice, rational(request.paidUnits));
      return {
        mode: request.mode,
        effectiveUnitPrice: multiplyMoney(totalPaid, divideRational(rational(1), rational(totalUnits))),
      };
    }

    case "CASHBACK_TO_EFFECTIVE_PRICE": {
      if (request.cashbackAmount.paise < 0n || request.cashbackAmount.paise > request.billedPrice.paise) {
        throw new Error("Cashback must lie between zero and billed price.");
      }
      return {
        mode: request.mode,
        effectivePrice: moneyFromPaise(request.billedPrice.paise - request.cashbackAmount.paise),
      };
    }

    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE": {
      const retained = subtractRational(rational(1), divideRational(request.cashbackPercent, rational(100)));
      if (retained.numerator < 0n) throw new Error("Cashback percentage cannot exceed 100%.");
      return { mode: request.mode, effectivePrice: multiplyMoney(request.billedPrice, retained) };
    }

    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE": {
      const afterDiscount = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      if (request.couponAmount.paise < 0n || request.couponAmount.paise > afterDiscount.paise) {
        throw new Error("Coupon amount must lie between zero and the discounted price.");
      }
      return {
        mode: request.mode,
        effectivePrice: moneyFromPaise(afterDiscount.paise - request.couponAmount.paise),
      };
    }

    case "DISCOUNT_VS_CASHBACK_COMPARE": {
      const discountPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      if (request.cashbackAmount.paise < 0n || request.cashbackAmount.paise > request.markedPrice.paise) {
        throw new Error("Cashback must lie between zero and marked price.");
      }
      const cashbackPrice = moneyFromPaise(request.markedPrice.paise - request.cashbackAmount.paise);
      const difference = discountPrice.paise - cashbackPrice.paise;
      return {
        mode: request.mode,
        betterOffer: difference > 0n ? "CASHBACK" : difference < 0n ? "DISCOUNT" : "SAME",
        differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference),
      };
    }
  }
}
