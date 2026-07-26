import { OpsFoundationError, type ExactRational } from "./types";

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

export function makeRational(numerator: bigint, denominator: bigint): ExactRational {
  if (denominator === 0n) {
    throw new OpsFoundationError("DIVISION_BY_ZERO", "A rational value cannot have denominator zero.");
  }
  if (numerator === 0n) return { numerator: 0n, denominator: 1n };

  const sign = denominator < 0n ? -1n : 1n;
  const normalizedNumerator = numerator * sign;
  const normalizedDenominator = denominator * sign;
  const divisor = gcd(normalizedNumerator, normalizedDenominator);
  return {
    numerator: normalizedNumerator / divisor,
    denominator: normalizedDenominator / divisor,
  };
}

export function fromInteger(value: bigint): ExactRational {
  return { numerator: value, denominator: 1n };
}

export function fromFiniteDecimal(source: string): ExactRational {
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(source)) {
    throw new OpsFoundationError("MALFORMED_NUMBER", `Invalid unsigned finite-decimal literal: ${source}`);
  }
  const [whole, fraction = ""] = source.split(".");
  if (!fraction) return fromInteger(BigInt(whole));
  const denominator = 10n ** BigInt(fraction.length);
  const numerator = BigInt(whole) * denominator + BigInt(fraction);
  return makeRational(numerator, denominator);
}

export function negateExact(value: ExactRational): ExactRational {
  return { numerator: -value.numerator, denominator: value.denominator };
}

export function addExact(a: ExactRational, b: ExactRational): ExactRational {
  return makeRational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtractExact(a: ExactRational, b: ExactRational): ExactRational {
  return addExact(a, negateExact(b));
}

export function multiplyExact(a: ExactRational, b: ExactRational): ExactRational {
  return makeRational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divideExact(a: ExactRational, b: ExactRational): ExactRational {
  if (b.numerator === 0n) {
    throw new OpsFoundationError("DIVISION_BY_ZERO", "Division by zero is not permitted.");
  }
  return makeRational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function compareExact(a: ExactRational, b: ExactRational): -1 | 0 | 1 {
  const delta = a.numerator * b.denominator - b.numerator * a.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

export function equalExact(a: ExactRational, b: ExactRational): boolean {
  return compareExact(a, b) === 0;
}

export function isIntegerExact(value: ExactRational): boolean {
  return value.denominator === 1n;
}

export function canonicalExactKey(value: ExactRational): string {
  return `${value.numerator}/${value.denominator}`;
}

export function formatExact(value: ExactRational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}
