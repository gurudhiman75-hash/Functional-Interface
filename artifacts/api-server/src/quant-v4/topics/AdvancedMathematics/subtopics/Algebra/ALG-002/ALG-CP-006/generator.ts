import {
  addRational,
  formatRational,
  multiplyRational,
  rational,
  solveLinearEquation,
  subtractRational,
  verifyLinearSolution,
  type LinearEquation,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp006Candidate } from "./registry";
import type { AlgCp006DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  return min + (mixSeed(seed ^ (salt * 0x9e3779b9)) % (max - min + 1));
}

function nonZeroInt(seed: number, min: number, max: number, salt: number): number {
  let value = pickInt(seed, min, max, salt);
  if (value === 0) value = min <= -1 ? -1 : 1;
  return value;
}

function absRational(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function coefficientText(value: Rational): string {
  if (value.denominator === 1n) {
    if (value.numerator === 1n) return "x";
    if (value.numerator === -1n) return "-x";
    return `${value.numerator}x`;
  }
  return `(${formatRational(value)})x`;
}

function linearExpressionText(coefficient: Rational, constant: Rational): string {
  const hasVariable = coefficient.numerator !== 0n;
  const hasConstant = constant.numerator !== 0n;
  if (!hasVariable && !hasConstant) return "0";
  if (!hasVariable) return formatRational(constant);
  const variable = coefficientText(coefficient);
  if (!hasConstant) return variable;
  return `${variable} ${constant.numerator < 0n ? "-" : "+"} ${formatRational(absRational(constant))}`;
}

function equationText(equation: LinearEquation): string {
  return `${linearExpressionText(equation.leftCoefficient, equation.leftConstant)} = ${linearExpressionText(equation.rightCoefficient, equation.rightConstant)}`;
}

function solvedItem(
  candidateId: string,
  solveMode: AlgCp006DiscoveryItem["solveMode"],
  seed: number,
  equation: LinearEquation,
  stem: string,
  explanation: string,
): AlgCp006DiscoveryItem {
  const solved = solveLinearEquation(equation);
  if (solved.kind !== "UNIQUE") throw new Error(`${candidateId} expected a unique solution`);
  if (!verifyLinearSolution(equation, solved.value)) throw new Error(`${candidateId} failed substitution verification`);
  return {
    cpId: "ALG-CP-006",
    candidateId,
    solveMode,
    seed,
    stem,
    equation,
    answer: { kind: "UNIQUE_VALUE", value: solved.value },
    explanation,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp006DiscoveryItem(candidateId: string, seed: number): AlgCp006DiscoveryItem {
  const candidate = getAlgCp006Candidate(candidateId);

  switch (candidate.solveMode) {
    case "solveAxPlusBEqualsC": {
      const x = nonZeroInt(seed, -9, 9, 1);
      const a = nonZeroInt(seed, -8, 8, 2);
      const b = pickInt(seed, -12, 12, 3);
      const c = a * x + b;
      const equation: LinearEquation = {
        leftCoefficient: rational(a), leftConstant: rational(b),
        rightCoefficient: rational(0n), rightConstant: rational(c),
      };
      const remaining = c - b;
      return solvedItem(
        candidateId, candidate.solveMode, seed, equation,
        `Solve for x: ${equationText(equation)}.`,
        `Move the constant term to the other side: ${coefficientText(rational(a))} = ${remaining}. Divide both sides by ${a}, giving x = ${x}. Substitution in the original equation confirms the value.`,
      );
    }

    case "solveVariableOnBothSides": {
      const x = nonZeroInt(seed, -8, 8, 1);
      const leftA = nonZeroInt(seed, -8, 8, 2);
      let rightA = nonZeroInt(seed, -8, 8, 3);
      if (rightA === leftA) rightA += rightA === 8 ? -1 : 1;
      const leftB = pickInt(seed, -10, 10, 4);
      const rightB = (leftA - rightA) * x + leftB;
      const equation: LinearEquation = {
        leftCoefficient: rational(leftA), leftConstant: rational(leftB),
        rightCoefficient: rational(rightA), rightConstant: rational(rightB),
      };
      return solvedItem(
        candidateId, candidate.solveMode, seed, equation,
        `Solve for x: ${equationText(equation)}.`,
        `Bring the x-terms to one side and constants to the other. This gives ${coefficientText(rational(leftA - rightA))} = ${rightB - leftB}. Dividing by ${leftA - rightA} gives x = ${x}.`,
      );
    }

    case "solveEquationWithBrackets": {
      const x = nonZeroInt(seed, -8, 8, 1);
      const m = nonZeroInt(seed, 2, 7, 2);
      let q = nonZeroInt(seed, -6, 6, 3);
      if (q === m) q = m - 1;
      const p = nonZeroInt(seed, -6, 6, 4);
      const rightConstant = (m - q) * x + m * p;
      const equation: LinearEquation = {
        leftCoefficient: rational(m), leftConstant: rational(m * p),
        rightCoefficient: rational(q), rightConstant: rational(rightConstant),
      };
      const bracket = p < 0 ? `x - ${Math.abs(p)}` : `x + ${p}`;
      const right = linearExpressionText(rational(q), rational(rightConstant));
      return solvedItem(
        candidateId, candidate.solveMode, seed, equation,
        `Solve for x: ${m}(${bracket}) = ${right}.`,
        `First expand the bracket: ${m}(${bracket}) becomes ${linearExpressionText(rational(m), rational(m * p))}. Then collect x-terms and constants on opposite sides. Solving gives x = ${x}, which satisfies the original bracketed equation.`,
      );
    }

    case "solveEquationWithFractionalCoefficient": {
      const numerator = nonZeroInt(seed, -7, 7, 1);
      const denominator = pickInt(seed, 2, 5, 2);
      const a = rational(numerator, denominator);
      const x = rational(nonZeroInt(seed, -9, 9, 3), pickInt(seed, 1, 3, 4));
      const b = rational(pickInt(seed, -8, 8, 5));
      const c = addRational(multiplyRational(a, x), b);
      const equation: LinearEquation = {
        leftCoefficient: a, leftConstant: b,
        rightCoefficient: rational(0n), rightConstant: c,
      };
      return solvedItem(
        candidateId, candidate.solveMode, seed, equation,
        `Solve for x: ${equationText(equation)}.`,
        `Subtract ${formatRational(b)} from both sides, then divide by the coefficient ${formatRational(a)}. This gives x = ${formatRational(x)}. Substitution verifies the exact fractional solution.`,
      );
    }

    case "classifyNoSolutionLinearEquation": {
      const m = nonZeroInt(seed, 2, 7, 1);
      const p = nonZeroInt(seed, -6, 6, 2);
      const delta = pickInt(seed, 1, 5, 3);
      const leftConstant = m * p;
      const equation: LinearEquation = {
        leftCoefficient: rational(m), leftConstant: rational(leftConstant),
        rightCoefficient: rational(m), rightConstant: rational(leftConstant + delta),
      };
      const bracket = p < 0 ? `x - ${Math.abs(p)}` : `x + ${p}`;
      const solved = solveLinearEquation(equation);
      if (solved.kind !== "NO_SOLUTION") throw new Error("Expected no-solution construction");
      return {
        cpId: "ALG-CP-006", candidateId, solveMode: candidate.solveMode, seed,
        stem: `How many solutions does ${m}(${bracket}) = ${linearExpressionText(rational(m), rational(leftConstant + delta))} have?`,
        equation,
        answer: { kind: "NO_SOLUTION" },
        explanation: `Expanding the left side gives ${linearExpressionText(rational(m), rational(leftConstant))}. The x-coefficients on both sides are the same, but the constants differ by ${delta}. The equation reduces to a contradiction, so it has no solution.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyInfiniteSolutionLinearEquation": {
      const m = nonZeroInt(seed, 2, 7, 1);
      const p = nonZeroInt(seed, -6, 6, 2);
      const leftConstant = m * p;
      const equation: LinearEquation = {
        leftCoefficient: rational(m), leftConstant: rational(leftConstant),
        rightCoefficient: rational(m), rightConstant: rational(leftConstant),
      };
      const bracket = p < 0 ? `x - ${Math.abs(p)}` : `x + ${p}`;
      const solved = solveLinearEquation(equation);
      if (solved.kind !== "INFINITE_SOLUTIONS") throw new Error("Expected infinite-solution construction");
      return {
        cpId: "ALG-CP-006", candidateId, solveMode: candidate.solveMode, seed,
        stem: `How many solutions does ${m}(${bracket}) = ${linearExpressionText(rational(m), rational(leftConstant))} have?`,
        equation,
        answer: { kind: "INFINITE_SOLUTIONS" },
        explanation: `Expanding the left side gives exactly ${linearExpressionText(rational(m), rational(leftConstant))}, which is the same expression as the right side. The equation is true for every real x, so it has infinitely many solutions.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findParameterForKnownLinearSolution": {
      const knownX = nonZeroInt(seed, -6, 6, 1);
      const k = nonZeroInt(seed, -7, 7, 2);
      const offset = nonZeroInt(seed, -5, 5, 3);
      const b = pickInt(seed, -9, 9, 4);
      const totalCoefficient = k + offset;
      const c = totalCoefficient * knownX + b;
      const equation: LinearEquation = {
        leftCoefficient: rational(totalCoefficient), leftConstant: rational(b),
        rightCoefficient: rational(0n), rightConstant: rational(c),
      };
      if (!verifyLinearSolution(equation, rational(knownX))) throw new Error("Known-solution parameter construction failed");
      const parameterTerm = offset < 0 ? `k - ${Math.abs(offset)}` : `k + ${offset}`;
      return {
        cpId: "ALG-CP-006", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x = ${knownX} is a solution of (${parameterTerm})x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}, find k.`,
        equation,
        answer: { kind: "PARAMETER_VALUE", value: rational(k) },
        explanation: `Substitute x = ${knownX} into the equation. This gives (${parameterTerm})(${knownX}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}. Solving this linear equation in k gives k = ${k}. Using that value makes x = ${knownX} satisfy the original equation.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        parameterEvidence: { knownSolution: rational(knownX), coefficientOffset: rational(offset) },
      };
    }
  }
}
