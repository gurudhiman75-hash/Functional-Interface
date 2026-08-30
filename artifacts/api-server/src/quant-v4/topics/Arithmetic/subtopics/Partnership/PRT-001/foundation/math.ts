import type { Rational } from "./types";

export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a / gcd(a, b)) * b < 0n
    ? -((a / gcd(a, b)) * b)
    : (a / gcd(a, b)) * b;
}

export function rational(
  numerator: bigint | number,
  denominator: bigint | number = 1n,
): Rational {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw new Error("denominator must not be zero");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return {
    numerator: (sign * n) / divisor,
    denominator: (d < 0n ? -d : d) / divisor,
  };
}

export const ZERO = rational(0n);
export const ONE = rational(1n);
export const HUNDRED = rational(100n);

export function addRational(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtractRational(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiplyRational(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divideRational(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("division by zero");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function compareRational(a: Rational, b: Rational): -1 | 0 | 1 {
  const difference = a.numerator * b.denominator - b.numerator * a.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function equalRational(a: Rational, b: Rational): boolean {
  return compareRational(a, b) === 0;
}

export function sumRationals(values: readonly Rational[]): Rational {
  return values.reduce(addRational, ZERO);
}

export function normalizeRatio(values: readonly Rational[]): bigint[] {
  if (values.length === 0) throw new Error("ratio requires at least one value");
  if (values.some((value) => compareRational(value, ZERO) <= 0)) {
    throw new Error("ratio values must be positive");
  }
  const commonDenominator = values.reduce(
    (current, value) => lcm(current, value.denominator),
    1n,
  );
  const integerValues = values.map(
    (value) => value.numerator * (commonDenominator / value.denominator),
  );
  const divisor = integerValues.reduce((current, value) => gcd(current, value));
  return integerValues.map((value) => value / divisor);
}

export function solveLinearContributionUnknown(input: {
  fixedWeight: Rational;
  unknownCoefficient: Rational;
  comparisonWeight: Rational;
  targetUnknownToComparisonRatio: Rational;
}): Rational {
  if (compareRational(input.unknownCoefficient, ZERO) === 0) {
    throw new Error("unknown coefficient must not be zero");
  }
  const targetWeight = multiplyRational(
    input.comparisonWeight,
    input.targetUnknownToComparisonRatio,
  );
  return divideRational(
    subtractRational(targetWeight, input.fixedWeight),
    input.unknownCoefficient,
  );
}

export function formatRational(value: Rational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

export function formatMoney(value: Rational): string {
  if (value.denominator === 1n) return `₹${value.numerator}`;
  const paise = (value.numerator * 100n) / value.denominator;
  if (paise * value.denominator === value.numerator * 100n) {
    const sign = paise < 0n ? "-" : "";
    const absolutePaise = paise < 0n ? -paise : paise;
    return `${sign}₹${absolutePaise / 100n}.${(absolutePaise % 100n).toString().padStart(2, "0")}`;
  }
  return `₹${formatRational(value)}`;
}

export function formatDuration(
  value: Rational,
  unit: "MONTH" | "YEAR" = "MONTH",
): string {
  const suffix = unit === "MONTH" ? "month" : "year";
  const plural = equalRational(value, ONE) ? "" : "s";
  return `${formatRational(value)} ${suffix}${plural}`;
}

export function formatRatio(values: readonly Rational[]): string {
  return normalizeRatio(values).join(":");
}
