import type { Money, Rational } from "./types";
import { moneyFromPaise } from "./money";
import { addRational, rational, subtractRational } from "./rational";

export function buildMoneyDistractors(answer: Money): readonly Money[] {
  const delta = answer.paise >= 10000n ? answer.paise / 10n : 1000n;
  const candidates = [
    moneyFromPaise(answer.paise - delta),
    moneyFromPaise(answer.paise + delta),
    moneyFromPaise(answer.paise + 2n * delta),
  ];
  return candidates.filter((value) => value.paise > 0n && value.paise !== answer.paise).slice(0, 3);
}

export function buildRateDistractors(answer: Rational): readonly Rational[] {
  const steps = [rational(5), rational(10), rational(20)];
  const candidates = [
    subtractRational(answer, steps[0]!),
    addRational(answer, steps[1]!),
    addRational(answer, steps[2]!),
  ];
  return candidates.filter((value) => value.numerator >= 0n).slice(0, 3);
}
