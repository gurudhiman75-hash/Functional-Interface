import type { Money, PriceLedger, RateResult, Rational } from "./types";
import { asPercent, divideRational, multiplyRational, rational } from "./rational";
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
    ? { numerator: rateFraction.denominator + rateFraction.numerator, denominator: rateFraction.denominator }
    : { numerator: rateFraction.denominator - rateFraction.numerator, denominator: rateFraction.denominator };
  if (multiplier.numerator < 0n) throw new Error("Loss rate cannot exceed 100%.");
  return multiplyMoney(input.costPrice, rational(multiplier.numerator, multiplier.denominator));
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

export function composePercentageMultipliers(rates: readonly Rational[], directions: readonly ("INCREASE" | "DECREASE")[]): Rational {
  if (rates.length !== directions.length) throw new Error("Rates and directions must align.");
  return rates.reduce((accumulator, rate, index) => {
    const fraction = divideRational(rate, rational(100));
    const multiplier = directions[index] === "INCREASE"
      ? rational(fraction.denominator + fraction.numerator, fraction.denominator)
      : rational(fraction.denominator - fraction.numerator, fraction.denominator);
    return multiplyRational(accumulator, multiplier);
  }, rational(1));
}
