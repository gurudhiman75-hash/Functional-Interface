import type { Money, PriceLedger, RateResult, Rational } from "./types";
import {
  asPercent,
  compareRational,
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
  if (comparison === 0) return { direction: "NO_CHANGE", rate: rational(0), base: "EFFECTIVE_COST" };
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
  const base = resolveEffectiveCost(ledger);
  const comparison = compareMoney(ledger.sellingPrice, base);
  if (comparison === 0) return { direction: "NO_CHANGE", rate: rational(0), base: "SELLING_PRICE" };
  const absoluteDifference = comparison > 0
    ? subtractMoney(ledger.sellingPrice, base)
    : subtractMoney(base, ledger.sellingPrice);
  return {
    direction: comparison > 0 ? "PROFIT" : "LOSS",
    rate: asPercent(divideRational(rational(absoluteDifference.paise), rational(ledger.sellingPrice.paise))),
    base: "SELLING_PRICE",
  };
}

function rateMultiplier(direction: "PROFIT" | "LOSS", ratePercent: Rational): Rational {
  const rateFraction = divideRational(ratePercent, rational(100));
  const multiplier = direction === "PROFIT"
    ? rational(rateFraction.denominator + rateFraction.numerator, rateFraction.denominator)
    : rational(rateFraction.denominator - rateFraction.numerator, rateFraction.denominator);
  if (multiplier.numerator <= 0n) throw new Error("Commercial multiplier must be positive.");
  return multiplier;
}

export function sellingPriceFromCostAndRate(input: {
  costPrice: Money;
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Money {
  return multiplyMoney(input.costPrice, rateMultiplier(input.direction, input.ratePercent));
}

export function costPriceFromSellingPriceAndRate(input: {
  sellingPrice: Money;
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Money {
  return multiplyMoney(
    input.sellingPrice,
    divideRational(rational(1), rateMultiplier(input.direction, input.ratePercent)),
  );
}

export function costPriceFromAmountAndRate(input: { amount: Money; ratePercent: Rational }): Money {
  if (input.ratePercent.numerator <= 0n) throw new Error("Rate must be positive.");
  return multiplyMoney(input.amount, divideRational(rational(100), input.ratePercent));
}

export function rateFromAmountAndCost(input: { amount: Money; costPrice: Money }): Rational {
  if (input.costPrice.paise <= 0n) throw new Error("Cost price must be positive.");
  return asPercent(divideRational(rational(input.amount.paise), rational(input.costPrice.paise)));
}

export function rateFromCostSellingRatio(input: { costPart: Rational; sellingPart: Rational }): RateResult {
  const comparison = compareRational(input.sellingPart, input.costPart);
  if (comparison === 0) return { direction: "NO_CHANGE", rate: rational(0), base: "COST_PRICE" };
  const absoluteDifference = comparison > 0
    ? subtractRational(input.sellingPart, input.costPart)
    : subtractRational(input.costPart, input.sellingPart);
  return {
    direction: comparison > 0 ? "PROFIT" : "LOSS",
    rate: asPercent(divideRational(absoluteDifference, input.costPart)),
    base: "COST_PRICE",
  };
}

export function costSellingRatioFromRate(input: {
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}): Readonly<{ costPart: Rational; sellingPart: Rational }> {
  return { costPart: rational(1), sellingPart: rateMultiplier(input.direction, input.ratePercent) };
}

export function profitPercentOnCostFromMarginOnSelling(marginPercent: Rational): Rational {
  const marginFraction = divideRational(marginPercent, rational(100));
  if (marginFraction.numerator >= marginFraction.denominator) {
    throw new Error("Profit margin on selling price must be below 100%.");
  }
  return asPercent(divideRational(marginFraction, subtractRational(rational(1), marginFraction)));
}

export function marginOnSellingFromProfitPercentOnCost(profitPercent: Rational): Rational {
  const profitFraction = divideRational(profitPercent, rational(100));
  return asPercent(divideRational(
    profitFraction,
    rational(profitFraction.denominator + profitFraction.numerator, profitFraction.denominator),
  ));
}

export function rateFromAmountFraction(input: {
  direction: "PROFIT" | "LOSS";
  amountFraction: Rational;
  fractionBase: "COST_PRICE" | "SELLING_PRICE";
}): Rational {
  if (input.amountFraction.numerator < 0n) throw new Error("Fraction cannot be negative.");
  if (input.fractionBase === "COST_PRICE") return asPercent(input.amountFraction);
  const denominator = input.direction === "PROFIT"
    ? subtractRational(rational(1), input.amountFraction)
    : rational(input.amountFraction.denominator + input.amountFraction.numerator, input.amountFraction.denominator);
  if (denominator.numerator <= 0n) throw new Error("Invalid selling-price fraction.");
  return asPercent(divideRational(input.amountFraction, denominator));
}

export function amountFractionFromRate(input: {
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
  fractionBase: "COST_PRICE" | "SELLING_PRICE";
}): Rational {
  const rateFraction = divideRational(input.ratePercent, rational(100));
  if (input.fractionBase === "COST_PRICE") return rateFraction;
  return input.direction === "PROFIT"
    ? divideRational(rateFraction, rational(rateFraction.denominator + rateFraction.numerator, rateFraction.denominator))
    : divideRational(rateFraction, rational(rateFraction.denominator - rateFraction.numerator, rateFraction.denominator));
}

export function sellingPriceDifferenceFromCostAndRates(input: {
  costPrice: Money;
  firstDirection: "PROFIT" | "LOSS";
  firstRatePercent: Rational;
  secondDirection: "PROFIT" | "LOSS";
  secondRatePercent: Rational;
}): Money {
  const first = sellingPriceFromCostAndRate({
    costPrice: input.costPrice,
    direction: input.firstDirection,
    ratePercent: input.firstRatePercent,
  });
  const second = sellingPriceFromCostAndRate({
    costPrice: input.costPrice,
    direction: input.secondDirection,
    ratePercent: input.secondRatePercent,
  });
  return { paise: first.paise >= second.paise ? first.paise - second.paise : second.paise - first.paise };
}

export function costPriceFromSellingPriceDifference(input: {
  difference: Money;
  firstDirection: "PROFIT" | "LOSS";
  firstRatePercent: Rational;
  secondDirection: "PROFIT" | "LOSS";
  secondRatePercent: Rational;
}): Money {
  const first = rateMultiplier(input.firstDirection, input.firstRatePercent);
  const second = rateMultiplier(input.secondDirection, input.secondRatePercent);
  const delta = compareRational(first, second) >= 0
    ? subtractRational(first, second)
    : subtractRational(second, first);
  if (delta.numerator === 0n) throw new Error("Selling conditions must produce different prices.");
  return multiplyMoney(input.difference, divideRational(rational(1), delta));
}

export function secondConditionRate(input: {
  firstSellingPrice: Money;
  firstDirection: "PROFIT" | "LOSS";
  firstRatePercent: Rational;
  secondSellingPrice: Money;
}): RateResult {
  const costPrice = costPriceFromSellingPriceAndRate({
    sellingPrice: input.firstSellingPrice,
    direction: input.firstDirection,
    ratePercent: input.firstRatePercent,
  });
  return profitOrLossRateOnCost({ costPrice, sellingPrice: input.secondSellingPrice });
}

export function sellingPriceAfterDiscount(markedPrice: Money, discountPercent: Rational): Money {
  const discountFraction = divideRational(discountPercent, rational(100));
  const multiplier = rational(discountFraction.denominator - discountFraction.numerator, discountFraction.denominator);
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
