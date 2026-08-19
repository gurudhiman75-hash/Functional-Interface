import {
  RATIONAL_ZERO,
  add,
  compare,
  divide,
  multiply,
  square,
  subtract,
  type Rational,
} from "./exact";
import { exactRationalSquareRoot } from "./circle-inference";

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
  return exactRationalSquareRoot(directCommonTangentLengthSquared(centreDistance, firstRadius, secondRadius));
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
  const externalCentreDistance = exactRationalSquareRoot(add(square(largerRadius), square(tangentLengthFromExternalCentre)));
  const numerator = multiply(largerRadius, subtract(externalCentreDistance, largerRadius));
  const denominator = add(externalCentreDistance, largerRadius);
  if (compare(denominator, RATIONAL_ZERO) <= 0) throw new Error("Invalid common-tangent similarity denominator");
  return divide(numerator, denominator);
}
