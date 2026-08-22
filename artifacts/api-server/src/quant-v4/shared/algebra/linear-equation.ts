import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
  type Rational,
} from "./rational";

export interface LinearEquation {
  leftCoefficient: Rational;
  leftConstant: Rational;
  rightCoefficient: Rational;
  rightConstant: Rational;
}

export type LinearEquationSolution =
  | { kind: "UNIQUE"; value: Rational }
  | { kind: "NO_SOLUTION" }
  | { kind: "INFINITE_SOLUTIONS" };

export function solveLinearEquation(equation: LinearEquation): LinearEquationSolution {
  const coefficient = subtractRational(equation.leftCoefficient, equation.rightCoefficient);
  const constant = subtractRational(equation.rightConstant, equation.leftConstant);
  if (equalsRational(coefficient, rational(0n))) {
    return equalsRational(constant, rational(0n)) ? { kind: "INFINITE_SOLUTIONS" } : { kind: "NO_SOLUTION" };
  }
  return { kind: "UNIQUE", value: divideRational(constant, coefficient) };
}

export function verifyLinearSolution(equation: LinearEquation, candidate: Rational): boolean {
  const left = addRational(multiplyRational(equation.leftCoefficient, candidate), equation.leftConstant);
  const right = addRational(multiplyRational(equation.rightCoefficient, candidate), equation.rightConstant);
  return equalsRational(left, right);
}
