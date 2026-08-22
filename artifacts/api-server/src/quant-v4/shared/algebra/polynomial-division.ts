import {
  ZERO,
  addRational,
  equalsRational,
  multiplyRational,
  negateRational,
  rational,
  type Rational,
} from "./rational";
import {
  addPolynomials,
  multiplyPolynomials,
  polynomial,
  type Polynomial1,
} from "./polynomial";

export interface LinearPolynomialDivision {
  quotient: Polynomial1;
  remainder: Rational;
  root: Rational;
}

/** Divide P(x) by the monic factor x - root using exact synthetic division. */
export function dividePolynomialByLinearFactor(value: Polynomial1, root: Rational): LinearPolynomialDivision {
  if (value.coefficients.length <= 1) {
    return { quotient: polynomial(value.variable, [ZERO]), remainder: value.coefficients[0] ?? ZERO, root };
  }

  const work = [...value.coefficients];
  const quotient = Array.from({ length: value.coefficients.length - 1 }, () => ZERO);
  for (let degree = value.coefficients.length - 1; degree >= 1; degree -= 1) {
    const leading = work[degree]!;
    quotient[degree - 1] = leading;
    work[degree - 1] = addRational(work[degree - 1]!, multiplyRational(root, leading));
  }

  return { quotient: polynomial(value.variable, quotient), remainder: work[0]!, root };
}

export function verifyLinearPolynomialDivision(value: Polynomial1, division: LinearPolynomialDivision): boolean {
  const divisor = polynomial(value.variable, [negateRational(division.root), rational(1n)]);
  const recomposed = addPolynomials(
    multiplyPolynomials(division.quotient, divisor),
    polynomial(value.variable, [division.remainder]),
  );
  if (recomposed.variable !== value.variable || recomposed.coefficients.length !== value.coefficients.length) return false;
  return recomposed.coefficients.every((coefficient, index) => equalsRational(coefficient, value.coefficients[index]!));
}
