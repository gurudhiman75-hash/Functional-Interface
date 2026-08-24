import { exactNthRoot } from "./perfect-power";
import { gcdBigInt, powRationalInteger, rational, type Rational } from "./rational";

export interface RationalExponent {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export function rationalExponent(numerator: bigint | number, denominator: bigint | number = 1n): RationalExponent {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("Exponent denominator cannot be zero");
  if (n === 0n) return { numerator: 0n, denominator: 1n };
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcdBigInt(n, d);
  return { numerator: n / divisor, denominator: d / divisor };
}

export function addRationalExponent(a: RationalExponent, b: RationalExponent): RationalExponent {
  return rationalExponent(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

export function subtractRationalExponent(a: RationalExponent, b: RationalExponent): RationalExponent {
  return rationalExponent(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}

export function multiplyRationalExponent(a: RationalExponent, b: RationalExponent): RationalExponent {
  return rationalExponent(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function negateRationalExponent(value: RationalExponent): RationalExponent {
  return rationalExponent(-value.numerator, value.denominator);
}

export function equalsRationalExponent(a: RationalExponent, b: RationalExponent): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

function safeIndex(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Root index exceeds safe executable range");
  const index = Number(value);
  if (!Number.isInteger(index) || index < 2) throw new Error("Fractional root index must be an integer >= 2");
  return index;
}

function safeIntegerExponent(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error("Exponent exceeds safe executable range");
  }
  return Number(value);
}

export function evaluateExactRationalPower(base: Rational, exponent: RationalExponent): Rational {
  const normalized = rationalExponent(exponent.numerator, exponent.denominator);
  if (normalized.numerator === 0n) {
    if (base.numerator === 0n) throw new Error("0^0 is undefined");
    return rational(1n);
  }
  if (base.numerator === 0n && normalized.numerator < 0n) throw new Error("Zero cannot be raised to a negative exponent");
  if (base.numerator < 0n && normalized.denominator % 2n === 0n) {
    throw new Error("Negative base with an even root denominator is not real");
  }

  if (normalized.denominator === 1n) {
    return powRationalInteger(base, safeIntegerExponent(normalized.numerator));
  }

  const index = safeIndex(normalized.denominator);
  const numeratorRoot = exactNthRoot(base.numerator, index);
  const denominatorRoot = exactNthRoot(base.denominator, index);
  if (numeratorRoot === null || denominatorRoot === null) {
    throw new Error("Exact rational evaluation requires a perfect-power rational base");
  }
  const rooted = rational(numeratorRoot, denominatorRoot);
  return powRationalInteger(rooted, safeIntegerExponent(normalized.numerator));
}

export function rationalExponentKey(value: RationalExponent): string {
  return `${value.numerator}/${value.denominator}`;
}

export function formatRationalExponent(value: RationalExponent): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `${value.numerator}/${value.denominator}`;
}
