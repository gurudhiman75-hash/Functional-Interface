import type { Money, PriceLedger, RateResult, Rational } from "./types";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { addMoney, compareMoney, multiplyMoney, subtractMoney } from "./money";

export function resolveEffectiveCost(ledger: PriceLedger): Money {
  return ledger.effectiveCost ?? ledger.costPrice;
}

export function profitOrLossAmount(ledger: PriceLedger): Money {
  return subtractMoney(ledger.sellingPrice, resolveEffectiveCost(ledger));
}

export function profitOrLossRateOnCost(ledger: PriceLedger): RateResult {
  const base = resolveEffectiveCost(ledger);
  const comparison = compareMoney(ledger.sellingPrice, base);
  if (comparison === 0) {
    return { direction: "NO_CHANGE", rate: rational(0), base: "EFFECTIVE_COST" };
  }
  const absoluteDifference = comparison > 0
    ? subtractMoney(ledger.sellingPrice, base)
    : subtractMoney(base, ledger.sellingPrice);
  return {
    direction: comparison > 0 ? "PROFIT" : "LOSS",
    rate: asPercent(divideRational(rational(absoluteDifference.paise), rational(base.paise))),
    base: "EFFECTIVE_COST",
  };
}

export function marginOnSellingPrice(ledger: PriceLedger): RateResult {
  const comparison = compareMoney(ledger.sellingPrice, resolveEffectiveCost(ledger));
  if (comparison === 0) {
    return { direction: "NO_CHANGE", rate: rational(0), base: "SELLING_PRICE" };
  }
  const absoluteDifference = comparison > 0
    ? subtractMoney(ledger.sellingPrice, resolveEffectiveCost(ledger))
    : subtractMoney(resolveEffectiveCost(ledger), ledger.sellingPrice);
  return {
    direction: comparison > 0 ? "PROFIT" : "LOSS",
    rate: asPercent(divideRational(rational(absoluteDifference.paise), rational(ledger.sellingPrice.paise))),
    base: "SELLING_PRICE",
  };
}

export function sellingPriceFromCostAndRate(input: {
  costPrice: Money;
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Money {
  const rateFraction = divideRational(input.ratePercent, rational(100));
  const multiplier = input.direction === "PROFIT"
    ? rational(rateFraction.denominator + rateFraction.numerator, rateFraction.denominator)
    : rational(rateFraction.denominator - rateFraction.numerator, rateFraction.denominator);
  if (multiplier.numerator < 0n) throw new Error("Loss rate cannot exceed 100%.");
  return multiplyMoney(input.costPrice, multiplier);
}

export function costPriceFromSellingPriceAndRate(input: {
  sellingPrice: Money;
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Money {
  const rateFraction = divideRational(input.ratePercent, rational(100));
  const multiplier = input.direction === "PROFIT"
    ? rational(rateFraction.denominator + rateFraction.numerator, rateFraction.denominator)
    : rational(rateFraction.denominator - rateFraction.numerator, rateFraction.denominator);
  if (multiplier.numerator <= 0n) throw new Error("Reverse multiplier must be positive.");
  return multiplyMoney(input.sellingPrice, divideRational(rational(1), multiplier));
}

export function costPriceFromAmountAndRate(input: {
  amount: Money;
  ratePercent: Rational;
}): Money {
  if (input.ratePercent.numerator <= 0n) throw new Error("Rate must be positive.");
  return multiplyMoney(input.amount, divideRational(rational(100), input.ratePercent));
}

export function rateFromAmountAndCost(input: {
  amount: Money;
  costPrice: Money;
}): Rational {
  if (input.costPrice.paise <= 0n) throw new Error("Cost price must be positive.");
  return asPercent(divideRational(rational(input.amount.paise), rational(input.costPrice.paise)));
}

export function rateFromCostSellingRatio(input: {
  costPart: Rational;
  sellingPart: Rational;
}): RateResult {
  const comparison = input.sellingPart.numerator * input.costPart.denominator
    - input.costPart.numerator * input.sellingPart.denominator;
  if (comparison === 0n) {
    return { direction: "NO_CHANGE", rate: rational(0), base: "COST_PRICE" };
  }
  const absoluteDifference = comparison > 0n
    ? subtractRational(input.sellingPart, input.costPart)
    : subtractRational(input.costPart, input.sellingPart);
  return {
    direction: comparison > 0n ? "PROFIT" : "LOSS",
    rate: asPercent(divideRational(absoluteDifference, input.costPart)),
    base: "COST_PRICE",
  };
}

export function costSellingRatioFromRate(input: {
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Readonly<{ costPart: Rational; sellingPart: Rational }> {
  const rateFraction = divideRational(input.ratePercent, rational(100));
  const sellingPart = input.direction === "PROFIT"
    ? rational(rateFraction.denominator + rateFraction.numerator, rateFraction.denominator)
    : rational(rateFraction.denominator - rateFraction.numerator, rateFraction.denominator);
  if (sellingPart.numerator <= 0n) throw new Error("Selling-price ratio part must be positive.");
  return { costPart: rational(1), sellingPart };
}

export function profitPercentOnCostFromMarginOnSelling(marginPercent: Rational): Rational {
  const marginFraction = divideRational(marginPercent, rational(100));
  if (marginFraction.numerator >= marginFraction.denominator) {
    throw new Error("Profit margin on selling price must be below 100%.");
  }
  return asPercent(divideRational(
    marginFraction,
    subtractRational(rational(1), marginFraction),
  ));
}

export function marginOnSellingFromProfitPercentOnCost(profitPercent: Rational): Rational {
  const profitFraction = divideRational(profitPercent, rational(100));
  return asPercent(divideRational(
    profitFraction,
    rational(profitFraction.denominator + profitFraction.numerator, profitFraction.denominator),
  ));
}

export function sellingPriceAfterDiscount(markedPrice: Money, discountPercent: Rational): Money {
  const discountFraction = divideRational(discountPercent, rational(100));
  const multiplier = rational(
    discountFraction.denominator - discountFraction.numerator,
    discountFraction.denominator,
  );
  if (multiplier.numerator < 0n) throw new Error("Discount cannot exceed 100%.");
  return multiplyMoney(markedPrice, multiplier);
}

export function aggregateLedgers(ledgers: readonly PriceLedger[]): PriceLedger {
  if (ledgers.length === 0) throw new Error("At least one ledger is required.");
  const costPrice = addMoney(...ledgers.map(resolveEffectiveCost));
  const sellingPrice = addMoney(...ledgers.map((ledger) => ledger.sellingPrice));
  return { costPrice, effectiveCost: costPrice, sellingPrice };
}

export function composePercentageMultipliers(
  rates: readonly Rational[],
  directions: readonly ("INCREASE" | "DECREASE")[],
): Rational {
  if (rates.length !== directions.length) throw new Error("Rates and directions must align.");
  return rates.reduce((accumulator, rate, index) => {
    const fraction = divideRational(rate, rational(100));
    const multiplier = directions[index] === "INCREASE"
      ? rational(fraction.denominator + fraction.numerator, fraction.denominator)
      : rational(fraction.denominator - fraction.numerator, fraction.denominator);
    return multiplyRational(accumulator, multiplier);
  }, rational(1));
}
