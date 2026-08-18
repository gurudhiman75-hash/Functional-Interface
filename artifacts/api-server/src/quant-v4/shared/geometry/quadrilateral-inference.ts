import {
  ANGLE_360,
  subtract,
  divide,
  angle,
  rational,
  type ExactAngle,
  type Rational,
} from "./exact";

export function quadrilateralFourthAngle(
  first: ExactAngle,
  second: ExactAngle,
  third: ExactAngle,
): ExactAngle {
  const remaining = subtract(subtract(subtract(ANGLE_360, first), second), third);
  if (remaining.numerator <= 0n || remaining.numerator >= 180n * remaining.denominator) {
    throw new Error("Derived quadrilateral interior angle is outside the intended convex range");
  }
  return angle(remaining.numerator, remaining.denominator);
}

export function parallelogramDiagonalHalf(diagonalLength: Rational): Rational {
  if (diagonalLength.numerator <= 0n) throw new Error("Parallelogram diagonal must be positive");
  return divide(diagonalLength, rational(2));
}

export function rhombusDiagonalIntersectionAngle(): ExactAngle {
  return angle(90);
}
