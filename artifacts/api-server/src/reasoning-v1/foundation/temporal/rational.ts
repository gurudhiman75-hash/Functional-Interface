export interface ExactRational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export type ExactRationalInput = ExactRational | bigint | number;

function toBigInt(value: bigint | number, label: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }

  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe integer when supplied as a number.`);
  }

  return BigInt(value);
}

function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;

  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a;
}

export function exactRational(
  numerator: bigint | number,
  denominator: bigint | number = 1n,
): ExactRational {
  let normalizedNumerator = toBigInt(numerator, "Rational numerator");
  let normalizedDenominator = toBigInt(denominator, "Rational denominator");

  if (normalizedDenominator === 0n) {
    throw new Error("Rational denominator cannot be zero.");
  }

  if (normalizedDenominator < 0n) {
    normalizedNumerator = -normalizedNumerator;
    normalizedDenominator = -normalizedDenominator;
  }

  if (normalizedNumerator === 0n) {
    return { numerator: 0n, denominator: 1n };
  }

  const divisor = greatestCommonDivisor(
    normalizedNumerator,
    normalizedDenominator,
  );

  return {
    numerator: normalizedNumerator / divisor,
    denominator: normalizedDenominator / divisor,
  };
}

export function asExactRational(value: ExactRationalInput): ExactRational {
  if (typeof value === "object") {
    return exactRational(value.numerator, value.denominator);
  }

  return exactRational(value);
}

export function addRationals(
  left: ExactRationalInput,
  right: ExactRationalInput,
): ExactRational {
  const a = asExactRational(left);
  const b = asExactRational(right);
  return exactRational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtractRationals(
  left: ExactRationalInput,
  right: ExactRationalInput,
): ExactRational {
  const a = asExactRational(left);
  const b = asExactRational(right);
  return exactRational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiplyRationals(
  left: ExactRationalInput,
  right: ExactRationalInput,
): ExactRational {
  const a = asExactRational(left);
  const b = asExactRational(right);
  return exactRational(
    a.numerator * b.numerator,
    a.denominator * b.denominator,
  );
}

export function divideRationals(
  dividend: ExactRationalInput,
  divisor: ExactRationalInput,
): ExactRational {
  const a = asExactRational(dividend);
  const b = asExactRational(divisor);

  if (b.numerator === 0n) {
    throw new Error("Cannot divide by zero.");
  }

  return exactRational(
    a.numerator * b.denominator,
    a.denominator * b.numerator,
  );
}

export function negateRational(value: ExactRationalInput): ExactRational {
  const normalized = asExactRational(value);
  return exactRational(-normalized.numerator, normalized.denominator);
}

export function absoluteRational(value: ExactRationalInput): ExactRational {
  const normalized = asExactRational(value);
  return normalized.numerator < 0n
    ? exactRational(-normalized.numerator, normalized.denominator)
    : normalized;
}

export function compareRationals(
  left: ExactRationalInput,
  right: ExactRationalInput,
): -1 | 0 | 1 {
  const a = asExactRational(left);
  const b = asExactRational(right);
  const difference =
    a.numerator * b.denominator - b.numerator * a.denominator;

  if (difference < 0n) {
    return -1;
  }
  if (difference > 0n) {
    return 1;
  }
  return 0;
}

export function rationalsEqual(
  left: ExactRationalInput,
  right: ExactRationalInput,
): boolean {
  return compareRationals(left, right) === 0;
}

export function floorRational(value: ExactRationalInput): bigint {
  const normalized = asExactRational(value);
  const quotient = normalized.numerator / normalized.denominator;
  const remainder = normalized.numerator % normalized.denominator;

  if (remainder !== 0n && normalized.numerator < 0n) {
    return quotient - 1n;
  }

  return quotient;
}

export function moduloRational(
  value: ExactRationalInput,
  positiveModulus: ExactRationalInput,
): ExactRational {
  const modulus = asExactRational(positiveModulus);

  if (compareRationals(modulus, 0n) <= 0) {
    throw new Error("Rational modulus must be positive.");
  }

  const quotient = floorRational(divideRationals(value, modulus));
  return subtractRationals(value, multiplyRationals(modulus, quotient));
}

export function rationalToNumber(value: ExactRationalInput): number {
  const normalized = asExactRational(value);
  return Number(normalized.numerator) / Number(normalized.denominator);
}

export function rationalToFractionString(value: ExactRationalInput): string {
  const normalized = asExactRational(value);
  return normalized.denominator === 1n
    ? normalized.numerator.toString()
    : `${normalized.numerator}/${normalized.denominator}`;
}

export function rationalToMixedParts(value: ExactRationalInput): {
  sign: -1 | 0 | 1;
  whole: bigint;
  remainder: bigint;
  denominator: bigint;
} {
  const normalized = asExactRational(value);
  const sign = normalized.numerator < 0n ? -1 : normalized.numerator > 0n ? 1 : 0;
  const absoluteNumerator =
    normalized.numerator < 0n ? -normalized.numerator : normalized.numerator;

  return {
    sign,
    whole: absoluteNumerator / normalized.denominator,
    remainder: absoluteNumerator % normalized.denominator,
    denominator: normalized.denominator,
  };
}
