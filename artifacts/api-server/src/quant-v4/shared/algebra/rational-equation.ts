import {
  ZERO,
  addRational,
  divideRational,
  equalsRational,
  isZeroRational,
  negateRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";
import {
  evaluatePolynomial,
  multiplyPolynomials,
  polynomial,
  polynomialDegree,
  type Polynomial1,
} from "./polynomial";
import { solveQuadraticEquation } from "./quadratic";

export interface RationalFunction1 {
  numerator: Polynomial1;
  denominator: Polynomial1;
}

export interface RationalEquation1 {
  left: RationalFunction1;
  right: RationalFunction1;
}

export type RationalEquationSolution =
  | { kind: "FINITE"; roots: Rational[]; rejectedExcludedRoots: Rational[]; excludedValues: Rational[] }
  | { kind: "NO_SOLUTION"; rejectedExcludedRoots: Rational[]; excludedValues: Rational[] }
  | { kind: "INFINITE_ON_DOMAIN"; excludedValues: Rational[] };

function assertSameVariable(equation: RationalEquation1): string {
  const variables = [
    equation.left.numerator.variable,
    equation.left.denominator.variable,
    equation.right.numerator.variable,
    equation.right.denominator.variable,
  ];
  if (!variables.every((value) => value === variables[0])) throw new Error("Rational equation polynomials must use the same variable");
  return variables[0]!;
}

function subtractPolynomials(a: Polynomial1, b: Polynomial1): Polynomial1 {
  if (a.variable !== b.variable) throw new Error("Polynomial variables must match");
  const length = Math.max(a.coefficients.length, b.coefficients.length);
  const coefficients: Rational[] = [];
  for (let index = 0; index < length; index += 1) {
    coefficients.push(subtractRational(a.coefficients[index] ?? ZERO, b.coefficients[index] ?? ZERO));
  }
  return polynomial(a.variable, coefficients);
}

function linearDenominatorExclusion(value: Polynomial1): Rational[] {
  const degree = polynomialDegree(value);
  if (degree === 0) {
    if (isZeroRational(value.coefficients[0] ?? ZERO)) throw new Error("Rational-function denominator cannot be the zero polynomial");
    return [];
  }
  if (degree !== 1) throw new Error("Phase 1 rational-equation domain engine supports constant or linear denominators only");
  const constant = value.coefficients[0] ?? ZERO;
  const coefficient = value.coefficients[1]!;
  return [divideRational(negateRational(constant), coefficient)];
}

function uniqueRationals(values: Rational[]): Rational[] {
  const result: Rational[] = [];
  for (const value of values) {
    if (!result.some((existing) => equalsRational(existing, value))) result.push(value);
  }
  return result;
}

export function rationalEquationExcludedValues(equation: RationalEquation1): Rational[] {
  assertSameVariable(equation);
  return uniqueRationals([
    ...linearDenominatorExclusion(equation.left.denominator),
    ...linearDenominatorExclusion(equation.right.denominator),
  ]);
}

export function rationalEquationCrossPolynomial(equation: RationalEquation1): Polynomial1 {
  assertSameVariable(equation);
  return subtractPolynomials(
    multiplyPolynomials(equation.left.numerator, equation.right.denominator),
    multiplyPolynomials(equation.right.numerator, equation.left.denominator),
  );
}

export function verifyRationalEquationCandidate(equation: RationalEquation1, candidate: Rational): boolean {
  const leftDenominator = evaluatePolynomial(equation.left.denominator, candidate);
  const rightDenominator = evaluatePolynomial(equation.right.denominator, candidate);
  if (isZeroRational(leftDenominator) || isZeroRational(rightDenominator)) return false;

  const leftValue = divideRational(evaluatePolynomial(equation.left.numerator, candidate), leftDenominator);
  const rightValue = divideRational(evaluatePolynomial(equation.right.numerator, candidate), rightDenominator);
  return equalsRational(leftValue, rightValue);
}

function candidateRootsFromCrossPolynomial(value: Polynomial1): Rational[] | "INFINITE" | "NO_REAL_OR_RATIONAL" {
  const degree = polynomialDegree(value);
  if (degree === 0) return isZeroRational(value.coefficients[0] ?? ZERO) ? "INFINITE" : [];
  if (degree === 1) {
    const b = value.coefficients[0] ?? ZERO;
    const a = value.coefficients[1]!;
    return [divideRational(negateRational(b), a)];
  }
  if (degree === 2) {
    const solved = solveQuadraticEquation({
      a: value.coefficients[2]!,
      b: value.coefficients[1] ?? ZERO,
      c: value.coefficients[0] ?? ZERO,
    });
    if (solved.kind === "NO_REAL_ROOTS") return [];
    if (solved.kind === "REPEATED_ROOT") return [solved.root];
    if (solved.kind === "TWO_RATIONAL_ROOTS") return uniqueRationals(solved.roots);
    return "NO_REAL_OR_RATIONAL";
  }
  throw new Error("Phase 1 rational-equation solver supports cross-multiplied degree at most 2");
}

export function solveRationalEquationOverRationals(equation: RationalEquation1): RationalEquationSolution {
  const excludedValues = rationalEquationExcludedValues(equation);
  const cross = rationalEquationCrossPolynomial(equation);
  const candidates = candidateRootsFromCrossPolynomial(cross);

  if (candidates === "INFINITE") return { kind: "INFINITE_ON_DOMAIN", excludedValues };
  if (candidates === "NO_REAL_OR_RATIONAL") throw new Error("Current rational-equation discovery path does not admit irrational roots");

  const valid: Rational[] = [];
  const rejectedExcludedRoots: Rational[] = [];
  for (const candidate of candidates) {
    const excluded = excludedValues.some((value) => equalsRational(value, candidate));
    if (excluded) {
      rejectedExcludedRoots.push(candidate);
      continue;
    }
    if (verifyRationalEquationCandidate(equation, candidate)) valid.push(candidate);
  }

  return valid.length > 0
    ? { kind: "FINITE", roots: uniqueRationals(valid), rejectedExcludedRoots: uniqueRationals(rejectedExcludedRoots), excludedValues }
    : { kind: "NO_SOLUTION", rejectedExcludedRoots: uniqueRationals(rejectedExcludedRoots), excludedValues };
}

export function constantRationalFunction(variable: string, value: Rational): RationalFunction1 {
  return {
    numerator: polynomial(variable, [value]),
    denominator: polynomial(variable, [rational(1n)]),
  };
}
