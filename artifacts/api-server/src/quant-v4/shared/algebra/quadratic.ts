import {
  TWO,
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  negateRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";
import { addSurd, divideSurdByRational, negateSurd, rationalAsSurd, sqrtRational, type QuadraticSurd } from "./quadratic-surd";

export interface QuadraticEquation {
  a: Rational;
  b: Rational;
  c: Rational;
}

export type QuadraticRootState =
  | { kind: "NO_REAL_ROOTS" }
  | { kind: "REPEATED_ROOT"; root: Rational }
  | { kind: "TWO_RATIONAL_ROOTS"; roots: [Rational, Rational] }
  | { kind: "TWO_IRRATIONAL_ROOTS"; roots: [QuadraticSurd, QuadraticSurd] };

function integerSqrt(value: bigint): bigint {
  if (value < 0n) throw new Error("Square root requires a non-negative integer");
  if (value < 2n) return value;
  let x0 = value;
  let x1 = (x0 + value / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + value / x0) / 2n;
  }
  return x0;
}

function isPerfectSquareRational(value: Rational): boolean {
  if (value.numerator < 0n) return false;
  const n = integerSqrt(value.numerator);
  const d = integerSqrt(value.denominator);
  return n * n === value.numerator && d * d === value.denominator;
}

function sqrtPerfectSquareRational(value: Rational): Rational {
  return rational(integerSqrt(value.numerator), integerSqrt(value.denominator));
}

export function quadraticDiscriminant(equation: QuadraticEquation): Rational {
  const fourAC = multiplyRational(rational(4n), multiplyRational(equation.a, equation.c));
  return subtractRational(multiplyRational(equation.b, equation.b), fourAC);
}

export function solveQuadraticEquation(equation: QuadraticEquation): QuadraticRootState {
  if (equation.a.numerator === 0n) throw new Error("Quadratic coefficient a cannot be zero");
  const discriminant = quadraticDiscriminant(equation);
  const sign = compareRational(discriminant, rational(0n));
  if (sign < 0) return { kind: "NO_REAL_ROOTS" };

  const denominator = multiplyRational(TWO, equation.a);
  const minusB = negateRational(equation.b);

  if (sign === 0) {
    return { kind: "REPEATED_ROOT", root: divideRational(minusB, denominator) };
  }

  if (isPerfectSquareRational(discriminant)) {
    const rootD = sqrtPerfectSquareRational(discriminant);
    return {
      kind: "TWO_RATIONAL_ROOTS",
      roots: [
        divideRational(addRational(minusB, rootD), denominator),
        divideRational(subtractRational(minusB, rootD), denominator),
      ],
    };
  }

  const radical = sqrtRational(discriminant);
  const base = rationalAsSurd(minusB);
  const plus = divideSurdByRational(addSurd(base, radical), denominator);
  const minus = divideSurdByRational(addSurd(base, negateSurd(radical)), denominator);
  return { kind: "TWO_IRRATIONAL_ROOTS", roots: [plus, minus] };
}
