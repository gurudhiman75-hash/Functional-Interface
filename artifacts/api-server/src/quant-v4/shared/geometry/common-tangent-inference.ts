import {
  RATIONAL_ZERO,
  add,
  compare,
  multiply,
  rational,
  square,
  subtract,
  type Rational,
} from "./exact";

function exactBigIntSquareRoot(value: bigint): bigint | null {
  if (value < 0n) return null;
  if (value < 2n) return value;
  let low = 1n;
  let high = value;
  while (low <= high) {
    const mid = (low + high) >> 1n;
    const squared = mid * mid;
    if (squared === value) return mid;
    if (squared < value) low = mid + 1n;
    else high = mid - 1n;
  }
  return null;
}

export function exactRationalSquareRoot(value: Rational): Rational | null {
  if (compare(value, RATIONAL_ZERO) < 0) return null;
  const numerator = exactBigIntSquareRoot(value.numerator);
  const denominator = exactBigIntSquareRoot(value.denominator);
  if (numerator === null || denominator === null) return null;
  return rational(numerator, denominator);
}

export function externallyTangentCentreDistance(firstRadius: Rational, secondRadius: Rational): Rational {
  if (compare(firstRadius, RATIONAL_ZERO) <= 0 || compare(secondRadius, RATIONAL_ZERO) <= 0) {
    throw new Error("Circle radii must be positive");
  }
  return add(firstRadius, secondRadius);
}

export function directCommonTangentLengthSquared(
  centreDistance: Rational,
  firstRadius: Rational,
  secondRadius: Rational,
): Rational {
  const radiusDifference = subtract(firstRadius, secondRadius);
  const result = subtract(square(centreDistance), square(radiusDifference));
  if (compare(result, RATIONAL_ZERO) < 0) throw new Error("No real direct common tangent length for this configuration");
  return result;
}

export function directCommonTangentLength(
  centreDistance: Rational,
  firstRadius: Rational,
  secondRadius: Rational,
): Rational {
  const exact = exactRationalSquareRoot(directCommonTangentLengthSquared(centreDistance, firstRadius, secondRadius));
  if (!exact) throw new Error("Direct common tangent length is not rational in this exact helper");
  return exact;
}

export function transverseCommonTangentLengthSquared(
  centreDistance: Rational,
  firstRadius: Rational,
  secondRadius: Rational,
): Rational {
  const radiusSum = add(firstRadius, secondRadius);
  const result = subtract(square(centreDistance), square(radiusSum));
  if (compare(result, RATIONAL_ZERO) < 0) throw new Error("No real transverse common tangent length for this configuration");
  return result;
}

export function commonTangentSimilarityRadiusFromOuterTangent(
  largerRadius: Rational,
  tangentLengthFromExternalCentre: Rational,
): Rational {
  const externalCentreDistanceSquared = add(square(largerRadius), square(tangentLengthFromExternalCentre));
  const externalCentreDistance = exactRationalSquareRoot(externalCentreDistanceSquared);
  if (!externalCentreDistance) throw new Error("External-centre distance is not rational in this exact helper");
  const numerator = multiply(largerRadius, subtract(externalCentreDistance, largerRadius));
  const denominator = add(externalCentreDistance, largerRadius);
  if (compare(denominator, RATIONAL_ZERO) <= 0) throw new Error("Invalid common-tangent similarity denominator");
  return rational(
    numerator.numerator * denominator.denominator,
    numerator.denominator * denominator.numerator,
  );
}
