import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { composePercentageMultipliers, sellingPriceAfterDiscount } from "./math";

export type DiscountSolveRequest =
  | { mode: "MP_DISCOUNT_TO_SP"; markedPrice: Money; discountPercent: Rational }
  | { mode: "MP_SP_TO_DISCOUNT"; markedPrice: Money; sellingPrice: Money }
  | { mode: "SP_DISCOUNT_TO_MP"; sellingPrice: Money; discountPercent: Rational }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_SP"; markedPrice: Money; discountPercents: readonly Rational[] }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT"; discountPercents: readonly Rational[] };

export type DiscountSolveResult =
  | { mode: "MP_DISCOUNT_TO_SP"; sellingPrice: Money }
  | { mode: "MP_SP_TO_DISCOUNT"; discountPercent: Rational }
  | { mode: "SP_DISCOUNT_TO_MP"; markedPrice: Money }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_SP"; sellingPrice: Money }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT"; equivalentDiscountPercent: Rational };

function validateDiscountRate(rate: Rational): void {
  if (rate.denominator <= 0n || rate.numerator < 0n) {
    throw new Error("Discount rate must be non-negative with a positive denominator.");
  }
  if (rate.numerator > 100n * rate.denominator) {
    throw new Error("Discount rate cannot exceed 100%.");
  }
}

function retainedMultiplier(discountPercent: Rational): Rational {
  validateDiscountRate(discountPercent);
  return subtractRational(rational(1), divideRational(discountPercent, rational(100)));
}

export function solveDiscount(request: DiscountSolveRequest): DiscountSolveResult {
  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
      validateDiscountRate(request.discountPercent);
      return {
        mode: request.mode,
        sellingPrice: sellingPriceAfterDiscount(request.markedPrice, request.discountPercent),
      };

    case "MP_SP_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      if (request.sellingPrice.paise < 0n || request.sellingPrice.paise > request.markedPrice.paise) {
        throw new Error("Selling price must lie between zero and marked price for a discount question.");
      }
      const discount = request.markedPrice.paise - request.sellingPrice.paise;
      return {
        mode: request.mode,
        discountPercent: asPercent(divideRational(rational(discount), rational(request.markedPrice.paise))),
      };
    }

    case "SP_DISCOUNT_TO_MP": {
      const retained = retainedMultiplier(request.discountPercent);
      if (retained.numerator <= 0n) throw new Error("Marked price is undefined at a 100% discount.");
      return {
        mode: request.mode,
        markedPrice: multiplyMoney(request.sellingPrice, divideRational(rational(1), retained)),
      };
    }

    case "SUCCESSIVE_DISCOUNTS_TO_SP": {
      if (request.discountPercents.length === 0) throw new Error("At least one discount is required.");
      request.discountPercents.forEach(validateDiscountRate);
      const multiplier = composePercentageMultipliers(
        request.discountPercents,
        request.discountPercents.map(() => "DECREASE" as const),
      );
      return {
        mode: request.mode,
        sellingPrice: multiplyMoney(request.markedPrice, multiplier),
      };
    }

    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT": {
      if (request.discountPercents.length === 0) throw new Error("At least one discount is required.");
      request.discountPercents.forEach(validateDiscountRate);
      const retained = request.discountPercents.reduce(
        (accumulator, discount) => multiplyRational(accumulator, retainedMultiplier(discount)),
        rational(1),
      );
      return {
        mode: request.mode,
        equivalentDiscountPercent: asPercent(subtractRational(rational(1), retained)),
      };
    }
  }
}
