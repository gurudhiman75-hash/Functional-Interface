import type { Money, Rational } from "./types";
import { divideRational, multiplyRational, rational } from "./rational";

export function moneyFromPaise(paise: bigint | number): Money {
  return { paise: BigInt(paise) };
}

export function moneyFromRupees(rupees: bigint | number): Money {
  return { paise: BigInt(rupees) * 100n };
}

export function addMoney(...values: readonly Money[]): Money {
  return { paise: values.reduce((sum, value) => sum + value.paise, 0n) };
}

export function subtractMoney(a: Money, b: Money): Money {
  return { paise: a.paise - b.paise };
}

export function compareMoney(a: Money, b: Money): -1 | 0 | 1 {
  return a.paise < b.paise ? -1 : a.paise > b.paise ? 1 : 0;
}

export function multiplyMoney(value: Money, factor: Rational): Money {
  const result = multiplyRational(rational(value.paise), factor);
  if (result.numerator % result.denominator !== 0n) {
    throw new Error("Money result is not an exact paise amount.");
  }
  return { paise: result.numerator / result.denominator };
}

export function divideMoney(a: Money, b: Money): Rational {
  if (b.paise === 0n) throw new Error("Cannot divide by zero money.");
  return divideRational(rational(a.paise), rational(b.paise));
}

export function formatMoney(value: Money, currency = "USD", locale = "en-US"): string {
  const amount = Number(value.paise) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
