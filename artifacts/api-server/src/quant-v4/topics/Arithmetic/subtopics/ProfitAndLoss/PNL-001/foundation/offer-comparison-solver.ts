import type { Money, Rational } from "./types";
import { moneyFromPaise } from "./money";
import { sellingPriceAfterDiscount } from "./math";

export type RetailOffer =
  | { kind: "DISCOUNT"; discountPercent: Rational }
  | { kind: "FLAT_CASHBACK"; cashbackAmount: Money }
  | { kind: "MINIMUM_SPEND_COUPON"; minimumSpend: Money; couponAmount: Money };

export type EvaluatedOffer = Readonly<{
  eligible: boolean;
  effectivePrice: Money;
}>;

export type MixedOfferComparisonResult = Readonly<{
  first: EvaluatedOffer;
  second: EvaluatedOffer;
  betterOffer: "FIRST" | "SECOND" | "SAME";
  differenceAmount: Money;
}>;

function evaluateOffer(billedPrice: Money, offer: RetailOffer): EvaluatedOffer {
  switch (offer.kind) {
    case "DISCOUNT":
      return {
        eligible: true,
        effectivePrice: sellingPriceAfterDiscount(billedPrice, offer.discountPercent),
      };
    case "FLAT_CASHBACK":
      if (offer.cashbackAmount.paise < 0n || offer.cashbackAmount.paise > billedPrice.paise) {
        throw new Error("Cashback must lie between zero and billed price.");
      }
      return {
        eligible: true,
        effectivePrice: moneyFromPaise(billedPrice.paise - offer.cashbackAmount.paise),
      };
    case "MINIMUM_SPEND_COUPON": {
      if (offer.minimumSpend.paise < 0n || offer.couponAmount.paise < 0n) {
        throw new Error("Coupon values cannot be negative.");
      }
      const eligible = billedPrice.paise >= offer.minimumSpend.paise;
      if (eligible && offer.couponAmount.paise > billedPrice.paise) {
        throw new Error("Coupon amount cannot exceed billed price.");
      }
      return {
        eligible,
        effectivePrice: eligible
          ? moneyFromPaise(billedPrice.paise - offer.couponAmount.paise)
          : billedPrice,
      };
    }
  }
}

export function compareRetailOffers(input: {
  billedPrice: Money;
  firstOffer: RetailOffer;
  secondOffer: RetailOffer;
}): MixedOfferComparisonResult {
  if (input.billedPrice.paise < 0n) throw new Error("Billed price cannot be negative.");
  const first = evaluateOffer(input.billedPrice, input.firstOffer);
  const second = evaluateOffer(input.billedPrice, input.secondOffer);
  const difference = first.effectivePrice.paise - second.effectivePrice.paise;
  return {
    first,
    second,
    betterOffer: difference < 0n ? "FIRST" : difference > 0n ? "SECOND" : "SAME",
    differenceAmount: moneyFromPaise(difference < 0n ? -difference : difference),
  };
}
