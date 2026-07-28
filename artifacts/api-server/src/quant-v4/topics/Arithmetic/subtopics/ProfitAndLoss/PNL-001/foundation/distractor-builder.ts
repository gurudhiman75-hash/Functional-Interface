import type { Money, Rational } from "./types";
import { moneyFromPaise } from "./money";
import {
  asPercent,
  divideRational,
  multiplyRational,
  rational,
} from "./rational";

export type Distractor<T> = Readonly<{
  value: T;
  misconception: string;
}>;

function uniqueMoney(candidates: readonly Distractor<Money>[], answer: Money): readonly Distractor<Money>[] {
  const seen = new Set<string>([answer.paise.toString()]);
  return candidates.filter((candidate) => {
    if (candidate.value.paise <= 0n) return false;
    const key = candidate.value.paise.toString();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function uniqueRates(candidates: readonly Distractor<Rational>[], answer: Rational): readonly Distractor<Rational>[] {
  const seen = new Set<string>([rationalKey(answer)]);
  return candidates.filter((candidate) => {
    if (candidate.value.numerator < 0n || candidate.value.denominator <= 0n) return false;
    const key = rationalKey(candidate.value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

/**
 * Builds amount/price distractors from actual Profit & Loss misconceptions.
 * Callers should pass all values available in the question; unavailable
 * misconceptions are omitted rather than replaced with arbitrary +/- offsets.
 */
export function buildMoneyDistractors(input: {
  answer: Money;
  costPrice?: Money;
  sellingPrice?: Money;
  amount?: Money;
  ratePercent?: Rational;
  direction?: "PROFIT" | "LOSS";
}): readonly Distractor<Money>[] {
  const candidates: Distractor<Money>[] = [];

  if (input.costPrice && input.sellingPrice) {
    candidates.push(
      {
        value: moneyFromPaise(input.costPrice.paise + input.sellingPrice.paise),
        misconception: "Adds cost price and selling price instead of taking their difference.",
      },
      {
        value: moneyFromPaise(input.costPrice.paise > input.sellingPrice.paise
          ? input.costPrice.paise - input.sellingPrice.paise
          : input.sellingPrice.paise - input.costPrice.paise),
        misconception: "Finds the amount but may assign the wrong profit/loss direction.",
      },
    );
  }

  if (input.costPrice && input.amount) {
    candidates.push(
      {
        value: moneyFromPaise(input.costPrice.paise + input.amount.paise),
        misconception: "Adds the amount to cost price regardless of whether it is profit or loss.",
      },
      {
        value: moneyFromPaise(input.costPrice.paise > input.amount.paise
          ? input.costPrice.paise - input.amount.paise
          : input.amount.paise - input.costPrice.paise),
        misconception: "Subtracts the amount from cost price regardless of direction.",
      },
    );
  }

  if (input.sellingPrice && input.amount) {
    candidates.push(
      {
        value: moneyFromPaise(input.sellingPrice.paise + input.amount.paise),
        misconception: "Adds the amount to selling price when reversing the transaction.",
      },
      {
        value: moneyFromPaise(input.sellingPrice.paise > input.amount.paise
          ? input.sellingPrice.paise - input.amount.paise
          : input.amount.paise - input.sellingPrice.paise),
        misconception: "Subtracts the amount from selling price without checking direction.",
      },
    );
  }

  if (input.costPrice && input.ratePercent) {
    const rateFraction = divideRational(input.ratePercent, rational(100));
    const rateAmount = multiplyRational(rational(input.costPrice.paise), rateFraction);
    if (rateAmount.denominator === 1n) {
      candidates.push({
        value: moneyFromPaise(rateAmount.numerator),
        misconception: "Returns only the profit/loss amount instead of the required price.",
      });
    }
  }

  return uniqueMoney(candidates, input.answer);
}

/** Builds percentage distractors from wrong-base and wrong-direction errors. */
export function buildRateDistractors(input: {
  answer: Rational;
  amount?: Money;
  costPrice?: Money;
  sellingPrice?: Money;
}): readonly Distractor<Rational>[] {
  const candidates: Distractor<Rational>[] = [];

  if (input.amount && input.sellingPrice && input.sellingPrice.paise > 0n) {
    candidates.push({
      value: asPercent(divideRational(rational(input.amount.paise), rational(input.sellingPrice.paise))),
      misconception: "Uses selling price as the percentage base instead of cost price.",
    });
  }

  if (input.amount && input.costPrice && input.costPrice.paise > input.amount.paise) {
    const reducedBase = moneyFromPaise(input.costPrice.paise - input.amount.paise);
    candidates.push({
      value: asPercent(divideRational(rational(input.amount.paise), rational(reducedBase.paise))),
      misconception: "Uses the post-loss selling price as the denominator.",
    });
  }

  candidates.push({
    value: divideRational(input.answer, rational(100)),
    misconception: "Reports the decimal rate as though it were already a percentage.",
  });

  return uniqueRates(candidates, input.answer);
}
