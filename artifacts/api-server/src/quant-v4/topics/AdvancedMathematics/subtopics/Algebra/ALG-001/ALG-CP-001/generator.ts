import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  polynomial,
  rational,
  subtractRational,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp001Candidate } from "./registry";
import type { AlgCp001DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  const span = max - min + 1;
  return min + (mixSeed(seed ^ (salt * 0x9e3779b9)) % span);
}

function nonZeroInt(seed: number, min: number, max: number, salt: number): number {
  let value = pickInt(seed, min, max, salt);
  if (value === 0) value = max >= 1 ? 1 : -1;
  return value;
}

function r(value: number): Rational {
  return rational(BigInt(value));
}

function variableTerm(coefficient: number, variable: string): string {
  if (coefficient === 1) return variable;
  if (coefficient === -1) return `-${variable}`;
  return `${coefficient}${variable}`;
}

function signedVariableTerm(coefficient: number, variable: string): string {
  const absolute = Math.abs(coefficient);
  const body = absolute === 1 ? variable : `${absolute}${variable}`;
  return `${coefficient < 0 ? "-" : "+"} ${body}`;
}

function signedConstant(value: number): string {
  return `${value < 0 ? "-" : "+"} ${Math.abs(value)}`;
}

function scaledUnknown(multiplier: number, variable: string): string {
  return variableTerm(multiplier, variable);
}

function denominatorText(forbidden: number): string {
  if (forbidden === 0) return "x";
  return forbidden < 0 ? `x + ${Math.abs(forbidden)}` : `x - ${forbidden}`;
}

function bracketText(shift: number): string {
  if (shift === 0) return "x";
  return `(x ${shift < 0 ? "-" : "+"} ${Math.abs(shift)})`;
}

function simplifiedLinearText(coefficient: number, constant: number): string {
  const xPart = variableTerm(coefficient, "x");
  if (constant === 0) return xPart;
  return `${xPart} ${signedConstant(constant)}`;
}

export function generateAlgCp001DiscoveryItem(candidateId: string, seed: number): AlgCp001DiscoveryItem {
  const candidate = getAlgCp001Candidate(candidateId);

  switch (candidate.solveMode) {
    case "identifyCoefficientOfTerm": {
      const coefficient = nonZeroInt(seed, -12, 12, 1);
      const constant = pickInt(seed, -15, 15, 2);
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `What is the coefficient of x in ${variableTerm(coefficient, "x")} ${signedConstant(constant)}?`,
        answer: { kind: "RATIONAL", value: r(coefficient) },
        explanation: `The coefficient is the number multiplying x. Here x is multiplied by ${coefficient}, so the coefficient is ${coefficient}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "combineLikeTerms": {
      const a = nonZeroInt(seed, -9, 9, 1);
      const b = nonZeroInt(seed, -9, 9, 2);
      const sum = addRational(r(a), r(b));
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Combine the like terms: ${variableTerm(a, "x")} ${signedVariableTerm(b, "x")}. What is the coefficient of x after simplification?`,
        answer: { kind: "RATIONAL", value: sum },
        explanation: `Both terms contain x, so add their coefficients: ${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${formatRational(sum)}. The simplified expression is ${formatRational(sum)}x.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "evaluateOneVariableExpression": {
      const a = nonZeroInt(seed, -8, 8, 1);
      const b = pickInt(seed, -12, 12, 2);
      const x = pickInt(seed, -6, 6, 3);
      const value = addRational(multiplyRational(r(a), r(x)), r(b));
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x = ${x}, find the value of ${variableTerm(a, "x")} ${signedConstant(b)}.`,
        answer: { kind: "RATIONAL", value },
        explanation: `Substitute x = ${x}: ${a}(${x}) ${signedConstant(b)} = ${formatRational(value)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "evaluateTwoVariableExpression": {
      const a = nonZeroInt(seed, -6, 6, 1);
      const b = nonZeroInt(seed, -6, 6, 2);
      const x = pickInt(seed, -5, 5, 3);
      const y = pickInt(seed, -5, 5, 4);
      const value = addRational(multiplyRational(r(a), r(x)), multiplyRational(r(b), r(y)));
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x = ${x} and y = ${y}, find ${variableTerm(a, "x")} ${signedVariableTerm(b, "y")}.`,
        answer: { kind: "RATIONAL", value },
        explanation: `Substitute x = ${x} and y = ${y}: ${a}(${x}) ${b < 0 ? "-" : "+"} ${Math.abs(b)}(${y}) = ${formatRational(value)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "findMissingCoefficientFromKnownValue": {
      const coefficient = nonZeroInt(seed, -8, 8, 1);
      const x = nonZeroInt(seed, -6, 6, 2);
      const b = pickInt(seed, -10, 10, 3);
      const target = addRational(multiplyRational(r(coefficient), r(x)), r(b));
      const recovered = divideRational(subtractRational(target, r(b)), r(x));
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `For x = ${x}, the expression kx ${signedConstant(b)} has value ${formatRational(target)}. Find k.`,
        answer: { kind: "RATIONAL", value: recovered },
        explanation: `Substitute x = ${x}: ${scaledUnknown(x, "k")} ${signedConstant(b)} = ${formatRational(target)}. Isolating k gives k = ${formatRational(recovered)}.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "detectUndefinedSubstitution": {
      const forbidden = pickInt(seed, -7, 7, 1);
      const testValue = pickInt(seed, -7, 7, 2);
      const undefined = testValue === forbidden;
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Is the expression 1/(${denominatorText(forbidden)}) defined at x = ${testValue}?`,
        answer: { kind: "BOOLEAN", value: !undefined },
        explanation: undefined
          ? `At x = ${testValue}, the denominator becomes 0, so the expression is not defined.`
          : `At x = ${testValue}, the denominator is non-zero, so the expression is defined.`,
        sourceStatus: candidate.sourceStatus,
      };
    }

    case "expandAndSimplifyExpression": {
      const m = nonZeroInt(seed, -6, 6, 1);
      const p = pickInt(seed, -7, 7, 2);
      let n = nonZeroInt(seed, -6, 6, 3);
      if (m + n === 0) n += n > 0 ? 1 : -1;
      const q = pickInt(seed, -7, 7, 4);
      const coefficient = m + n;
      const constant = m * p + n * q;
      const value = polynomial("x", [r(constant), r(coefficient)]);
      return {
        cpId: "ALG-CP-001", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Expand and simplify ${variableTerm(m, bracketText(p))} ${n < 0 ? "-" : "+"} ${Math.abs(n) === 1 ? bracketText(q) : `${Math.abs(n)}${bracketText(q)}`}.`,
        answer: { kind: "POLYNOMIAL", value, text: simplifiedLinearText(coefficient, constant) },
        explanation: `Expand both brackets first. The x-terms are ${variableTerm(m, "x")} and ${variableTerm(n, "x")}, while the constant parts are ${m * p} and ${n * q}. Combining like terms gives ${simplifiedLinearText(coefficient, constant)}.`,
        sourceStatus: candidate.sourceStatus,
        expansionEvidence: { firstMultiplier: r(m), firstShift: r(p), secondMultiplier: r(n), secondShift: r(q) },
      };
    }
  }
}
