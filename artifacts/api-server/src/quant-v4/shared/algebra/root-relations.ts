import {
  ONE,
  addRational,
  divideRational,
  multiplyRational,
  negateRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";
import type { QuadraticEquation } from "./quadratic";
import { powerSumOfQuadraticRoots } from "./power-sum";

export interface QuadraticRootInvariants {
  sum: Rational;
  product: Rational;
}

export function quadraticRootInvariants(equation: QuadraticEquation): QuadraticRootInvariants {
  if (equation.a.numerator === 0n) throw new Error("Vieta invariants require a genuine quadratic");
  return {
    sum: divideRational(negateRational(equation.b), equation.a),
    product: divideRational(equation.c, equation.a),
  };
}

export function monicQuadraticFromRootInvariants(sum: Rational, product: Rational): QuadraticEquation {
  return { a: ONE, b: negateRational(sum), c: product };
}

export function rootSquareSum(equation: QuadraticEquation): Rational {
  const { sum, product } = quadraticRootInvariants(equation);
  return subtractRational(multiplyRational(sum, sum), multiplyRational(rational(2n), product));
}

export function rootReciprocalSum(equation: QuadraticEquation): Rational {
  const { sum, product } = quadraticRootInvariants(equation);
  if (product.numerator === 0n) throw new Error("Reciprocal-root sum is undefined when a root is zero");
  return divideRational(sum, product);
}

export function rootPowerSum(equation: QuadraticEquation, exponent: number): Rational {
  const { sum, product } = quadraticRootInvariants(equation);
  return powerSumOfQuadraticRoots(sum, product, exponent);
}

export function shiftQuadraticRoots(equation: QuadraticEquation, shift: Rational): QuadraticEquation {
  const { sum, product } = quadraticRootInvariants(equation);
  const newSum = addRational(sum, multiplyRational(rational(2n), shift));
  const newProduct = addRational(
    addRational(product, multiplyRational(shift, sum)),
    multiplyRational(shift, shift),
  );
  return monicQuadraticFromRootInvariants(newSum, newProduct);
}

export function scaleQuadraticRoots(equation: QuadraticEquation, scale: Rational): QuadraticEquation {
  const { sum, product } = quadraticRootInvariants(equation);
  return monicQuadraticFromRootInvariants(
    multiplyRational(scale, sum),
    multiplyRational(multiplyRational(scale, scale), product),
  );
}

export function negateQuadraticRoots(equation: QuadraticEquation): QuadraticEquation {
  return scaleQuadraticRoots(equation, rational(-1n));
}

export function reciprocalQuadraticRoots(equation: QuadraticEquation): QuadraticEquation {
  const { sum, product } = quadraticRootInvariants(equation);
  if (product.numerator === 0n) throw new Error("Cannot form reciprocal-root equation when a root is zero");
  return monicQuadraticFromRootInvariants(divideRational(sum, product), divideRational(ONE, product));
}
