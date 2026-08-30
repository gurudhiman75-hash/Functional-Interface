import { exactRationalSquareRoot } from "./circle-inference";
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

/** Returns the first-triangle perimeter from one corresponding side pair. */
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

/**
 * In similar triangles, area ratio is the square of the corresponding-side
 * ratio. The canonical Geometry exact-root primitive rejects non-square
 * rational fixtures rather than falling back to floating point.
 */
export function correspondingSideRatioFromAreaRatio(
  firstArea: Rational,
  secondArea: Rational,
): Rational {
  assertPositive(firstArea, "firstArea");
  assertPositive(secondArea, "secondArea");
  return exactRationalSquareRoot(divide(firstArea, secondArea));
}

/** Corresponding-side ratio squared gives the area ratio. */
export function areaRatioFromCorrespondingSideRatio(
  firstSide: Rational,
  secondSide: Rational,
): Rational {
  assertPositive(firstSide, "firstSide");
  assertPositive(secondSide, "secondSide");
  const ratio = divide(firstSide, secondSide);
  return multiply(ratio, ratio);
}

/** Convenience overload for integer-backed discovery fixtures. */
export function perimeterScaleFixture(value: number): Rational {
  if (!Number.isInteger(value) || value <= 0) throw new Error("fixture value must be a positive integer");
  return rational(value);
}
