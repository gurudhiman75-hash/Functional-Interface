import {
  ZERO,
  addRational,
  equalsRational,
  isZeroRational,
  multiplyRational,
  rational,
  type Rational,
} from "./rational";

export interface Polynomial1 {
  variable: string;
  coefficients: Rational[];
}

function trim(coefficients: Rational[]): Rational[] {
  const next = [...coefficients];
  while (next.length > 1 && isZeroRational(next[next.length - 1]!)) next.pop();
  return next.length === 0 ? [ZERO] : next;
}

export function polynomial(variable: string, coefficients: Rational[]): Polynomial1 {
  return { variable, coefficients: trim(coefficients) };
}

export function polynomialDegree(value: Polynomial1): number {
  return value.coefficients.length - 1;
}

export function addPolynomials(a: Polynomial1, b: Polynomial1): Polynomial1 {
  if (a.variable !== b.variable) throw new Error("Polynomial variables must match");
  const length = Math.max(a.coefficients.length, b.coefficients.length);
  const coefficients: Rational[] = [];
  for (let i = 0; i < length; i += 1) {
    coefficients.push(addRational(a.coefficients[i] ?? ZERO, b.coefficients[i] ?? ZERO));
  }
  return polynomial(a.variable, coefficients);
}

export function multiplyPolynomials(a: Polynomial1, b: Polynomial1): Polynomial1 {
  if (a.variable !== b.variable) throw new Error("Polynomial variables must match");
  const coefficients = Array.from({ length: a.coefficients.length + b.coefficients.length - 1 }, () => rational(0n));
  for (let i = 0; i < a.coefficients.length; i += 1) {
    for (let j = 0; j < b.coefficients.length; j += 1) {
      coefficients[i + j] = addRational(coefficients[i + j]!, multiplyRational(a.coefficients[i]!, b.coefficients[j]!));
    }
  }
  return polynomial(a.variable, coefficients);
}

export function evaluatePolynomial(value: Polynomial1, x: Rational): Rational {
  let result = ZERO;
  for (let i = value.coefficients.length - 1; i >= 0; i -= 1) {
    result = addRational(multiplyRational(result, x), value.coefficients[i]!);
  }
  return result;
}

export function equalsPolynomial(a: Polynomial1, b: Polynomial1): boolean {
  if (a.variable !== b.variable || a.coefficients.length !== b.coefficients.length) return false;
  return a.coefficients.every((coefficient, index) => equalsRational(coefficient, b.coefficients[index]!));
}
