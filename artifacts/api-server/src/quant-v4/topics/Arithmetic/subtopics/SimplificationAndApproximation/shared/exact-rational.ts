export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function gcdBigInt(left: bigint, right: bigint): bigint {
  let a = absBigInt(left);
  let b = absBigInt(right);
  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

export function rational(numerator: bigint, denominator: bigint = 1n): Rational {
  if (denominator === 0n) {
    throw new Error("A rational denominator cannot be zero.");
  }
  if (numerator === 0n) {
    return Object.freeze({ numerator: 0n, denominator: 1n });
  }
  const sign = denominator < 0n ? -1n : 1n;
  const normalisedNumerator = numerator * sign;
  const normalisedDenominator = denominator * sign;
  const divisor = gcdBigInt(normalisedNumerator, normalisedDenominator);
  return Object.freeze({
    numerator: normalisedNumerator / divisor,
    denominator: normalisedDenominator / divisor,
  });
}

export function addRational(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function subtractRational(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator - right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function multiplyRational(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.numerator,
    left.denominator * right.denominator,
  );
}

export function divideRational(left: Rational, right: Rational): Rational {
  if (right.numerator === 0n) {
    throw new Error("Division by zero is not allowed.");
  }
  return rational(
    left.numerator * right.denominator,
    left.denominator * right.numerator,
  );
}

export function negateRational(value: Rational): Rational {
  return rational(-value.numerator, value.denominator);
}

export function reciprocalRational(value: Rational): Rational {
  if (value.numerator === 0n) {
    throw new Error("Zero has no reciprocal.");
  }
  return rational(value.denominator, value.numerator);
}

export function compareRational(left: Rational, right: Rational): -1 | 0 | 1 {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function equalRational(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}

export function isIntegerRational(value: Rational): boolean {
  return value.denominator === 1n;
}

export function formatRational(value: Rational): string {
  if (value.denominator === 1n) {
    return value.numerator.toString();
  }
  return `${value.numerator}/${value.denominator}`;
}

export function powRational(base: Rational, exponent: bigint): Rational {
  if (exponent === 0n) {
    if (base.numerator === 0n) {
      throw new Error("0^0 is undefined in the SAP exact evaluator.");
    }
    return rational(1n);
  }
  if (exponent < 0n) {
    return powRational(reciprocalRational(base), -exponent);
  }
  let remaining = exponent;
  let factor = base;
  let result = rational(1n);
  while (remaining > 0n) {
    if (remaining % 2n === 1n) {
      result = multiplyRational(result, factor);
    }
    remaining /= 2n;
    if (remaining > 0n) {
      factor = multiplyRational(factor, factor);
    }
  }
  return result;
}
