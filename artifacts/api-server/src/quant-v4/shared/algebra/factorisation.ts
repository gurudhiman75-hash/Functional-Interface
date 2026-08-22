import { equalsPolynomial, multiplyPolynomials, polynomial, type Polynomial1 } from "./polynomial";
import { rational, type Rational } from "./rational";
import { solveQuadraticEquation } from "./quadratic";

export interface Factorization1 {
  scalar: Rational;
  factors: Polynomial1[];
}

export function expandFactorization(value: Factorization1, variable: string): Polynomial1 {
  let result = polynomial(variable, [value.scalar]);
  for (const factor of value.factors) result = multiplyPolynomials(result, factor);
  return result;
}

export function verifyFactorization(original: Polynomial1, factorization: Factorization1): boolean {
  return equalsPolynomial(original, expandFactorization(factorization, original.variable));
}

export function factorQuadraticOverRationals(value: Polynomial1): Factorization1 | null {
  if (value.coefficients.length !== 3) throw new Error("Expected a degree-2 polynomial");
  const [c, b, a] = value.coefficients;
  if (!a || a.numerator === 0n || !b || !c) throw new Error("Invalid quadratic polynomial");
  const roots = solveQuadraticEquation({ a, b, c });
  if (roots.kind === "NO_REAL_ROOTS" || roots.kind === "TWO_IRRATIONAL_ROOTS") return null;
  if (roots.kind === "REPEATED_ROOT") {
    const factor = polynomial(value.variable, [rational(-roots.root.numerator, roots.root.denominator), rational(1n)]);
    return { scalar: a, factors: [factor, factor] };
  }
  return {
    scalar: a,
    factors: roots.roots.map((root) => polynomial(value.variable, [rational(-root.numerator, root.denominator), rational(1n)])),
  };
}
