import { divide, multiply, rational, type Rational } from "./exact";

function assertPositive(value: Rational, owner: string): void {
  if (value.numerator <= 0n) throw new Error(`${owner} must be positive`);
}

function perfectSquareRoot(value: bigint, owner: string): bigint {
  if (value < 0n) throw new Error(`${owner} must be non-negative`);
  if (value < 2n) return value;
  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + value / x) / 2n;
  }
  if (x * x !== value) throw new Error(`${owner} must be a perfect square for exact Geometry inference`);
  return x;
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

/**
 * In similar triangles, area ratio is the square of the corresponding-side
 * ratio. Returns the exact first-side : second-side ratio for area fixtures
 * whose reduced numerator and denominator are perfect squares.
 */
export function correspondingSideRatioFromAreaRatio(
  firstArea: Rational,
  secondArea: Rational,
): Rational {
  assertPositive(firstArea, "firstArea");
  assertPositive(secondArea, "secondArea");
  const reducedAreaRatio = divide(firstArea, secondArea);
  return rational(
    perfectSquareRoot(reducedAreaRatio.numerator, "area-ratio numerator"),
    perfectSquareRoot(reducedAreaRatio.denominator, "area-ratio denominator"),
  );
}

/**
 * Independent exact forward relation: corresponding-side ratio squared gives
 * the area ratio of similar triangles.
 */
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
