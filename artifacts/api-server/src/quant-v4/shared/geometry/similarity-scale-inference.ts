import { divide, multiply, rational, type Rational } from "./exact";

function assertPositive(value: Rational, owner: string): void {
  if (value.numerator <= 0n) throw new Error(`${owner} must be positive`);
}

/**
 * In similar triangles, perimeter scale equals corresponding-side scale.
 * Returns the first-triangle corresponding length when the second-triangle
 * length and both perimeters are known.
 */
export function correspondingLengthFromPerimeterScale(
  firstPerimeter: Rational,
  secondPerimeter: Rational,
  secondLength: Rational,
): Rational {
  assertPositive(firstPerimeter, "firstPerimeter");
  assertPositive(secondPerimeter, "secondPerimeter");
  assertPositive(secondLength, "secondLength");
  return multiply(secondLength, divide(firstPerimeter, secondPerimeter));
}

/**
 * Returns the first-triangle perimeter from one corresponding side pair and
 * the second-triangle perimeter.
 */
export function perimeterFromCorrespondingSideScale(
  firstSide: Rational,
  secondSide: Rational,
  secondPerimeter: Rational,
): Rational {
  assertPositive(firstSide, "firstSide");
  assertPositive(secondSide, "secondSide");
  assertPositive(secondPerimeter, "secondPerimeter");
  return multiply(secondPerimeter, divide(firstSide, secondSide));
}

/** Convenience overload for integer-backed discovery fixtures. */
export function perimeterScaleFixture(value: number): Rational {
  if (!Number.isInteger(value) || value <= 0) throw new Error("fixture value must be a positive integer");
  return rational(value);
}
