import {
  countIntegersInIntervalSet,
  formatAbsoluteEquationSolution,
  formatIntervalSet,
  formatRational,
  rational,
  solveAbsoluteLinearEquation,
  solveAbsoluteLinearInequality,
  solveEqualAbsoluteDistances,
  type InequalityOperator,
} from "../../../../../../shared/algebra";
import { getAlgCp013Candidate } from "./registry";
import type { AlgCp013DiscoveryItem } from "./types";

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
  if (value === 0) value = min < 0 ? -1 : 1;
  return value;
}

function relationSymbol(operator: InequalityOperator): string {
  return operator === "GT" ? ">" : operator === "GE" ? "≥" : operator === "LT" ? "<" : "≤";
}

function linearText(a: number, b: number): string {
  const xPart = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b === 0) return xPart;
  return `${xPart} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

function absoluteText(a: number, b: number): string {
  return `|${linearText(a, b)}|`;
}

export function generateAlgCp013DiscoveryItem(candidateId: string, seed: number): AlgCp013DiscoveryItem {
  const candidate = getAlgCp013Candidate(candidateId);

  switch (candidate.solveMode) {
    case "solveSimpleAbsoluteEquation": {
      const center = nonZeroInt(seed, -8, 8, 1);
      const distance = pickInt(seed, 1, 7, 2);
      const inside = center < 0 ? `x + ${Math.abs(center)}` : `x - ${center}`;
      const solution = solveAbsoluteLinearEquation(rational(1n), rational(-center), rational(distance));
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve |${inside}| = ${distance}.`,
        math: { kind: "ABS_EQUATION", a: rational(1n), b: rational(-center), rhs: rational(distance) },
        answer: { kind: "ABSOLUTE_SOLUTION", value: solution, text: formatAbsoluteEquationSolution(solution) },
        explanation: `The absolute value equals ${distance}, so the expression inside can be ${distance} or -${distance}. Solve ${inside} = ${distance} and ${inside} = -${distance}. The two branches give ${formatAbsoluteEquationSolution(solution)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveAffineAbsoluteEquation": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = pickInt(seed, -9, 9, 2);
      const rhs = pickInt(seed, 1, 9, 3);
      const solution = solveAbsoluteLinearEquation(rational(a), rational(b), rational(rhs));
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} = ${rhs}.`,
        math: { kind: "ABS_EQUATION", a: rational(a), b: rational(b), rhs: rational(rhs) },
        answer: { kind: "ABSOLUTE_SOLUTION", value: solution, text: formatAbsoluteEquationSolution(solution) },
        explanation: `For an absolute value to equal ${rhs}, the expression inside can be ${rhs} or -${rhs}. Solve ${linearText(a, b)} = ${rhs} and ${linearText(a, b)} = -${rhs}. This gives ${formatAbsoluteEquationSolution(solution)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveZeroRhsAbsoluteEquation": {
      const a = nonZeroInt(seed, -6, 6, 1);
      const b = nonZeroInt(seed, -10, 10, 2);
      const solution = solveAbsoluteLinearEquation(rational(a), rational(b), rational(0n));
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} = 0.`,
        math: { kind: "ABS_EQUATION", a: rational(a), b: rational(b), rhs: rational(0n) },
        answer: { kind: "ABSOLUTE_SOLUTION", value: solution, text: formatAbsoluteEquationSolution(solution) },
        explanation: `An absolute value is zero only when the expression inside it is exactly zero. Therefore solve ${linearText(a, b)} = 0, which gives ${formatAbsoluteEquationSolution(solution)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "rejectNegativeRhsAbsoluteEquation": {
      const a = nonZeroInt(seed, -6, 6, 1);
      const b = pickInt(seed, -10, 10, 2);
      const rhs = -pickInt(seed, 1, 8, 3);
      const solution = solveAbsoluteLinearEquation(rational(a), rational(b), rational(rhs));
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} = ${rhs}.`,
        math: { kind: "ABS_EQUATION", a: rational(a), b: rational(b), rhs: rational(rhs) },
        answer: { kind: "ABSOLUTE_SOLUTION", value: solution, text: formatAbsoluteEquationSolution(solution) },
        explanation: `An absolute value can never be negative. The right-hand side is ${rhs}, so no real value of x can satisfy the equation.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveBoundedAbsoluteInequality": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = pickInt(seed, -8, 8, 2);
      const rhs = pickInt(seed, 2, 9, 3);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1305) % 2 === 0 ? "LT" : "LE";
      const set = solveAbsoluteLinearInequality(rational(a), rational(b), rational(rhs), operator);
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} ${relationSymbol(operator)} ${rhs}.`,
        math: { kind: "ABS_INEQUALITY", a: rational(a), b: rational(b), rhs: rational(rhs), operator },
        answer: { kind: "INTERVAL_SET", value: set, text: formatIntervalSet(set) },
        explanation: `Being ${operator === "LT" ? "less than" : "at most"} ${rhs} means the inside expression must stay between -${rhs} and ${rhs}. Solve -${rhs} ${operator === "LT" ? "<" : "≤"} ${linearText(a, b)} ${operator === "LT" ? "<" : "≤"} ${rhs}. The resulting interval is ${formatIntervalSet(set)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveExteriorAbsoluteInequality": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = pickInt(seed, -8, 8, 2);
      const rhs = pickInt(seed, 2, 9, 3);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1306) % 2 === 0 ? "GT" : "GE";
      const set = solveAbsoluteLinearInequality(rational(a), rational(b), rational(rhs), operator);
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} ${relationSymbol(operator)} ${rhs}.`,
        math: { kind: "ABS_INEQUALITY", a: rational(a), b: rational(b), rhs: rational(rhs), operator },
        answer: { kind: "INTERVAL_SET", value: set, text: formatIntervalSet(set) },
        explanation: `The absolute value is ${operator === "GT" ? "greater than" : "at least"} ${rhs} when the inside expression lies beyond either boundary: ${linearText(a, b)} ${operator === "GT" ? ">" : "≥"} ${rhs} or ${linearText(a, b)} ${operator === "GT" ? "<" : "≤"} -${rhs}. Solving both branches gives ${formatIntervalSet(set)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveZeroBoundaryAbsoluteInequality": {
      const a = nonZeroInt(seed, -6, 6, 1);
      const b = nonZeroInt(seed, -10, 10, 2);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1307) % 2 === 0 ? "GT" : "GE";
      const set = solveAbsoluteLinearInequality(rational(a), rational(b), rational(0n), operator);
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${absoluteText(a, b)} ${relationSymbol(operator)} 0.`,
        math: { kind: "ABS_INEQUALITY", a: rational(a), b: rational(b), rhs: rational(0n), operator },
        answer: { kind: "INTERVAL_SET", value: set, text: formatIntervalSet(set) },
        explanation: operator === "GE"
          ? `Every absolute value is non-negative, so the inequality is true for every real x. The solution is ${formatIntervalSet(set)}.`
          : `An absolute value is greater than zero everywhere except where the inside expression equals zero. Excluding that single root gives ${formatIntervalSet(set)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveEqualAbsoluteDistances": {
      const left = nonZeroInt(seed, -9, 8, 1);
      let right = nonZeroInt(seed, -8, 9, 2);
      if (left === right) right = left === 9 ? 8 : left + 1;
      const solution = solveEqualAbsoluteDistances(rational(left), rational(right));
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve |x ${left < 0 ? "+" : "-"} ${Math.abs(left)}| = |x ${right < 0 ? "+" : "-"} ${Math.abs(right)}|.`,
        math: { kind: "EQUAL_DISTANCE", leftCenter: rational(left), rightCenter: rational(right) },
        answer: { kind: "ABSOLUTE_SOLUTION", value: solution, text: formatAbsoluteEquationSolution(solution) },
        explanation: `The two absolute values are the distances from x to ${left} and ${right}. A point is equally distant from two distinct numbers only at their midpoint. Their midpoint is (${left} + ${right})/2 = ${solution.kind === "FINITE" ? formatRational(solution.values[0]!) : "undefined"}, so ${formatAbsoluteEquationSolution(solution)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "countIntegerSolutionsToAbsoluteInequality": {
      const a = pickInt(seed, 2, 4, 1);
      const b = pickInt(seed, -8, 8, 2);
      const rhs = pickInt(seed, 3, 10, 3);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1309) % 2 === 0 ? "LT" : "LE";
      const set = solveAbsoluteLinearInequality(rational(a), rational(b), rational(rhs), operator);
      const count = countIntegersInIntervalSet(set);
      return {
        cpId: "ALG-CP-013", candidateId, solveMode: candidate.solveMode, seed,
        stem: `How many integer values of x satisfy ${absoluteText(a, b)} ${relationSymbol(operator)} ${rhs}?`,
        math: { kind: "INTEGER_COUNT", a: rational(a), b: rational(b), rhs: rational(rhs), operator },
        answer: { kind: "INTEGER_COUNT", value: count, text: count.toString() },
        explanation: `First convert the absolute-value inequality into its bounded interval. This gives ${formatIntervalSet(set)}. Counting only the integers contained in that exact interval gives ${count}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }
  }
}
