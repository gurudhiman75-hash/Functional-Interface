export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

const ZERO: Rational = Object.freeze({ numerator: 0n, denominator: 1n });
const ONE: Rational = Object.freeze({ numerator: 1n, denominator: 1n });

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

export function lcmBigInt(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return abs((a / gcdBigInt(a, b)) * b);
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1n): Rational {
  const n = typeof numerator === "number" ? BigInt(numerator) : numerator;
  const d = typeof denominator === "number" ? BigInt(denominator) : denominator;
  if (d === 0n) throw new Error("Rational denominator cannot be zero");
  if (n === 0n) return ZERO;
  const divisor = gcdBigInt(n, d);
  const sign = d < 0n ? -1n : 1n;
  return Object.freeze({
    numerator: sign * (n / divisor),
    denominator: abs(d / divisor),
  });
}

export function fromInteger(value: bigint | number): Rational {
  return rational(value);
}

export function fromDecimalString(value: string): Rational {
  const normalized = value.trim();
  const match = normalized.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!match) throw new Error(`Invalid decimal string: ${value}`);
  const sign = match[1] === "-" ? -1n : 1n;
  const whole = BigInt(match[2]);
  const fractional = match[3] ?? "";
  if (fractional.length === 0) return rational(sign * whole);
  const scale = 10n ** BigInt(fractional.length);
  return rational(sign * (whole * scale + BigInt(fractional)), scale);
}

export function add(a: Rational, b: Rational): Rational {
  const shared = gcdBigInt(a.denominator, b.denominator);
  const leftMultiplier = b.denominator / shared;
  const rightMultiplier = a.denominator / shared;
  return rational(
    a.numerator * leftMultiplier + b.numerator * rightMultiplier,
    a.denominator * leftMultiplier,
  );
}

export function negate(value: Rational): Rational {
  return rational(-value.numerator, value.denominator);
}

export function subtract(a: Rational, b: Rational): Rational {
  return add(a, negate(b));
}

export function multiply(a: Rational, b: Rational): Rational {
  const leftCancellation = gcdBigInt(a.numerator, b.denominator);
  const rightCancellation = gcdBigInt(b.numerator, a.denominator);
  return rational(
    (a.numerator / leftCancellation) * (b.numerator / rightCancellation),
    (a.denominator / rightCancellation) * (b.denominator / leftCancellation),
  );
}

export function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero");
  return multiply(a, rational(b.denominator, b.numerator));
}

export function reciprocal(value: Rational): Rational {
  if (value.numerator === 0n) throw new Error("Zero has no reciprocal");
  return rational(value.denominator, value.numerator);
}

export function absRational(value: Rational): Rational {
  return rational(abs(value.numerator), value.denominator);
}

export function compare(a: Rational, b: Rational): -1 | 0 | 1 {
  const difference = a.numerator * b.denominator - b.numerator * a.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function equals(a: Rational, b: Rational): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export function isZero(value: Rational): boolean {
  return value.numerator === 0n;
}

export function isPositive(value: Rational): boolean {
  return value.numerator > 0n;
}

export function isNegative(value: Rational): boolean {
  return value.numerator < 0n;
}

export function floorRational(value: Rational): bigint {
  if (value.numerator >= 0n) return value.numerator / value.denominator;
  return -((-value.numerator + value.denominator - 1n) / value.denominator);
}

export function ceilRational(value: Rational): bigint {
  return -floorRational(negate(value));
}

export function modulo(value: Rational, modulus: Rational): Rational {
  if (!isPositive(modulus)) throw new Error("Modulo base must be positive");
  const quotient = floorRational(divide(value, modulus));
  const result = subtract(value, multiply(rational(quotient), modulus));
  return isNegative(result) ? add(result, modulus) : result;
}

export function toNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

export function toCanonicalString(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

export function toMixedString(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  const whole = numerator / value.denominator;
  const remainder = numerator % value.denominator;
  if (whole === 0n) return `${sign}${remainder}/${value.denominator}`;
  if (remainder === 0n) return `${sign}${whole}`;
  return `${sign}${whole} ${remainder}/${value.denominator}`;
}

export function toMathJax(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  const whole = numerator / value.denominator;
  const remainder = numerator % value.denominator;
  if (whole > 0n && remainder > 0n) {
    return `${sign}${whole}\\frac{${remainder}}{${value.denominator}}`;
  }
  return `${sign}\\frac{${numerator}}{${value.denominator}}`;
}

export const RATIONAL_ZERO = ZERO;
export const RATIONAL_ONE = ONE;
