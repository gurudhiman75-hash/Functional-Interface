import type { Money, Rational } from "./types";
import { moneyFromPaise, multiplyMoney } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  composePercentageMultipliers,
  profitOrLossAmount,
  profitOrLossRateOnCost,
  sellingPriceAfterDiscount,
  sellingPriceFromCostAndRate,
} from "./math";
import { createPriceLedger } from "./ledgers";

export type DiscountSolveRequest =
  | { mode: "MP_DISCOUNT_TO_SP"; markedPrice: Money; discountPercent: Rational }
  | { mode: "MP_SP_TO_DISCOUNT"; markedPrice: Money; sellingPrice: Money }
  | { mode: "SP_DISCOUNT_TO_MP"; sellingPrice: Money; discountPercent: Rational }
  | { mode: "MP_DISCOUNT_TO_AMOUNT"; markedPrice: Money; discountPercent: Rational }
  | { mode: "MP_AMOUNT_TO_DISCOUNT"; markedPrice: Money; discountAmount: Money }
  | { mode: "MP_AMOUNT_TO_SP"; markedPrice: Money; discountAmount: Money }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_SP"; markedPrice: Money; discountPercents: readonly Rational[] }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT"; discountPercents: readonly Rational[] }
  | { mode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT"; knownDiscountPercent: Rational; equivalentDiscountPercent: Rational }
  | { mode: "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE"; markedPrice: Money; singleDiscountPercent: Rational; successiveDiscountPercents: readonly Rational[] }
  | { mode: "CP_MARKUP_DISCOUNT_TO_RESULT"; costPrice: Money; markupPercent: Rational; discountPercent: Rational }
  | { mode: "MP_CP_TARGET_RATE_TO_DISCOUNT"; markedPrice: Money; costPrice: Money; direction: "PROFIT" | "LOSS"; targetRatePercent: Rational }
  | { mode: "CP_DISCOUNT_TARGET_RATE_TO_MARKUP"; costPrice: Money; discountPercent: Rational; direction: "PROFIT" | "LOSS"; targetRatePercent: Rational };

export type DiscountSolveResult =
  | { mode: "MP_DISCOUNT_TO_SP"; sellingPrice: Money }
  | { mode: "MP_SP_TO_DISCOUNT"; discountPercent: Rational }
  | { mode: "SP_DISCOUNT_TO_MP"; markedPrice: Money }
  | { mode: "MP_DISCOUNT_TO_AMOUNT"; discountAmount: Money }
  | { mode: "MP_AMOUNT_TO_DISCOUNT"; discountPercent: Rational }
  | { mode: "MP_AMOUNT_TO_SP"; sellingPrice: Money }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_SP"; sellingPrice: Money }
  | { mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT"; equivalentDiscountPercent: Rational }
  | { mode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT"; missingDiscountPercent: Rational }
  | { mode: "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE"; differenceAmount: Money; betterOffer: "SINGLE" | "SUCCESSIVE" | "SAME" }
  | { mode: "CP_MARKUP_DISCOUNT_TO_RESULT"; sellingPrice: Money; direction: "PROFIT" | "LOSS" | "NO_CHANGE"; amount: Money; ratePercent: Rational }
  | { mode: "MP_CP_TARGET_RATE_TO_DISCOUNT"; discountPercent: Rational }
  | { mode: "CP_DISCOUNT_TARGET_RATE_TO_MARKUP"; markupPercent: Rational };

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

function markedPriceFromCostAndMarkup(costPrice: Money, markupPercent: Rational): Money {
  return sellingPriceFromCostAndRate({ costPrice, direction: "PROFIT", ratePercent: markupPercent });
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

    case "MP_DISCOUNT_TO_AMOUNT": {
      const sellingPrice = sellingPriceAfterDiscount(request.markedPrice, request.discountPercent);
      return {
        mode: request.mode,
        discountAmount: moneyFromPaise(request.markedPrice.paise - sellingPrice.paise),
      };
    }

    case "MP_AMOUNT_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      if (request.discountAmount.paise < 0n || request.discountAmount.paise > request.markedPrice.paise) {
        throw new Error("Discount amount must lie between zero and marked price.");
      }
      return {
        mode: request.mode,
        discountPercent: asPercent(divideRational(rational(request.discountAmount.paise), rational(request.markedPrice.paise))),
      };
    }

    case "MP_AMOUNT_TO_SP":
      if (request.discountAmount.paise < 0n || request.discountAmount.paise > request.markedPrice.paise) {
        throw new Error("Discount amount must lie between zero and marked price.");
      }
      return {
        mode: request.mode,
        sellingPrice: moneyFromPaise(request.markedPrice.paise - request.discountAmount.paise),
      };

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

    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT": {
      const knownRetained = retainedMultiplier(request.knownDiscountPercent);
      const equivalentRetained = retainedMultiplier(request.equivalentDiscountPercent);
      if (knownRetained.numerator <= 0n) throw new Error("Known discount cannot be 100%.");
      const missingRetained = divideRational(equivalentRetained, knownRetained);
      if (missingRetained.numerator < 0n || missingRetained.numerator > missingRetained.denominator) {
        throw new Error("Equivalent discount is incompatible with the known discount.");
      }
      return {
        mode: request.mode,
        missingDiscountPercent: asPercent(subtractRational(rational(1), missingRetained)),
      };
    }

    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE": {
      const singleSp = sellingPriceAfterDiscount(request.markedPrice, request.singleDiscountPercent);
      const successive = solveDiscount({
        mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
        markedPrice: request.markedPrice,
        discountPercents: request.successiveDiscountPercents,
      });
      const difference = singleSp.paise - successive.sellingPrice.paise;
      return {
        mode: request.mode,
        differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference),
        betterOffer: difference > 0n ? "SUCCESSIVE" : difference < 0n ? "SINGLE" : "SAME",
      };
    }

    case "CP_MARKUP_DISCOUNT_TO_RESULT": {
      const markedPrice = markedPriceFromCostAndMarkup(request.costPrice, request.markupPercent);
      const sellingPrice = sellingPriceAfterDiscount(markedPrice, request.discountPercent);
      const ledger = createPriceLedger({ costPrice: request.costPrice, sellingPrice, markedPrice });
      const amountDelta = profitOrLossAmount(ledger);
      const rate = profitOrLossRateOnCost(ledger);
      return {
        mode: request.mode,
        sellingPrice,
        direction: rate.direction,
        amount: moneyFromPaise(amountDelta.paise < 0n ? -amountDelta.paise : amountDelta.paise),
        ratePercent: rate.rate,
      };
    }

    case "MP_CP_TARGET_RATE_TO_DISCOUNT": {
      if (request.markedPrice.paise <= 0n) throw new Error("Marked price must be positive.");
      const targetSellingPrice = sellingPriceFromCostAndRate({
        costPrice: request.costPrice,
        direction: request.direction,
        ratePercent: request.targetRatePercent,
      });
      if (targetSellingPrice.paise > request.markedPrice.paise) {
        throw new Error("Target selling price exceeds marked price; a discount cannot achieve it.");
      }
      return solveDiscount({
        mode: "MP_SP_TO_DISCOUNT",
        markedPrice: request.markedPrice,
        sellingPrice: targetSellingPrice,
      });
    }

    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP": {
      const targetSellingPrice = sellingPriceFromCostAndRate({
        costPrice: request.costPrice,
        direction: request.direction,
        ratePercent: request.targetRatePercent,
      });
      const marked = solveDiscount({
        mode: "SP_DISCOUNT_TO_MP",
        sellingPrice: targetSellingPrice,
        discountPercent: request.discountPercent,
      });
      return {
        mode: request.mode,
        markupPercent: asPercent(divideRational(
          rational(marked.markedPrice.paise - request.costPrice.paise),
          rational(request.costPrice.paise),
        )),
      };
    }
  }
}
