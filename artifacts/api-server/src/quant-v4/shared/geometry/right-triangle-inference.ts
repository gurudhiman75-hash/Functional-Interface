import {
  add,
  compare,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  type Rational,
} from "./exact";

function requirePositive(values: readonly Rational[], label: string): void {
  if (values.some((value) => !isPositive(value))) {
    throw new Error(`${label} requires positive side lengths`);
  }
}

function square(value: Rational): Rational {
  return multiply(value, value);
}

export function isRightTriangleByPythagoreanConverse(
  firstSide: Rational,
  secondSide: Rational,
  thirdSide: Rational,
): boolean {
  requirePositive([firstSide, secondSide, thirdSide], "Pythagorean converse");
  const sides = [firstSide, secondSide, thirdSide].sort((a, b) => compare(a, b));
  const [a, b, c] = sides;
  return equals(add(square(a), square(b)), square(c));
}

export function rightTriangleMedianToHypotenuse(hypotenuse: Rational): Rational {
  requirePositive([hypotenuse], "Right-triangle hypotenuse median theorem");
  return divide(hypotenuse, rational(2));
}
