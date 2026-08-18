import {
  ANGLE_180,
  angle,
  compare,
  divide,
  isPositive,
  multiply,
  rational,
  subtract,
  type ExactAngle,
  type Rational,
} from "./exact";

function requirePositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

export function chordHalfFromCentrePerpendicular(chordLength: Rational): Rational {
  requirePositive(chordLength, "Chord length");
  return divide(chordLength, rational(2));
}

export function equalChordLengthFromEqualCentreDistance(knownChordLength: Rational): Rational {
  requirePositive(knownChordLength, "Known chord length");
  return knownChordLength;
}

export function centralAngleFromInscribed(inscribed: ExactAngle): ExactAngle {
  if (compare(inscribed, angle(0)) <= 0 || compare(inscribed, ANGLE_180) >= 0) {
    throw new Error("Inscribed angle must lie strictly between 0° and 180°");
  }
  const doubled = multiply(inscribed, rational(2));
  if (compare(doubled, ANGLE_180) > 0) throw new Error("Minor central angle exceeds 180°");
  return angle(doubled.numerator, doubled.denominator);
}

export function cyclicOppositeAngle(knownInteriorAngle: ExactAngle): ExactAngle {
  if (compare(knownInteriorAngle, angle(0)) <= 0 || compare(knownInteriorAngle, ANGLE_180) >= 0) {
    throw new Error("Cyclic interior angle must lie strictly between 0° and 180°");
  }
  const result = subtract(ANGLE_180, knownInteriorAngle);
  return angle(result.numerator, result.denominator);
}

export function radiusTangentAngle(): ExactAngle {
  return angle(90);
}

export function equalTangentLength(knownLength: Rational): Rational {
  requirePositive(knownLength, "Known tangent length");
  return knownLength;
}

export function intersectingChordMissingSegment(
  firstLeft: Rational,
  firstRight: Rational,
  secondKnown: Rational,
): Rational {
  [firstLeft, firstRight, secondKnown].forEach((value, index) => requirePositive(value, `Intersecting-chord segment ${index + 1}`));
  return divide(multiply(firstLeft, firstRight), secondKnown);
}

export function secantSecantMissingWhole(
  firstExternal: Rational,
  firstWhole: Rational,
  secondExternal: Rational,
): Rational {
  [firstExternal, firstWhole, secondExternal].forEach((value, index) => requirePositive(value, `Secant segment ${index + 1}`));
  if (compare(firstWhole, firstExternal) <= 0) throw new Error("First whole secant must exceed its external part");
  const result = divide(multiply(firstExternal, firstWhole), secondExternal);
  if (compare(result, secondExternal) <= 0) throw new Error("Second whole secant must exceed its external part");
  return result;
}

function integerSqrtExact(value: bigint): bigint {
  if (value < 0n) throw new Error("Cannot take square root of a negative integer");
  if (value < 2n) return value;
  let x = 1n << (BigInt(value.toString(2).length) + 1n) / 2n;
  while (true) {
    const y = (x + value / x) / 2n;
    if (y >= x) break;
    x = y;
  }
  if (x * x !== value) throw new Error("Expected an exact rational square");
  return x;
}

export function exactRationalSquareRoot(value: Rational): Rational {
  if (value.numerator < 0n) throw new Error("Cannot take square root of a negative rational");
  return rational(integerSqrtExact(value.numerator), integerSqrtExact(value.denominator));
}

export function tangentSecantTangentLength(external: Rational, whole: Rational): Rational {
  requirePositive(external, "External secant part");
  requirePositive(whole, "Whole secant");
  if (compare(whole, external) <= 0) throw new Error("Whole secant must exceed the external part");
  return exactRationalSquareRoot(multiply(external, whole));
}
