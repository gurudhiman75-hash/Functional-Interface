import {
  addRational,
  formatRational,
  rational,
  solveLinearSystem2V,
  subtractRational,
  verifyLinearSystemSolution,
  type LinearSystem2V,
  type Rational,
} from "../../../../../../shared/algebra";
import { getAlgCp007Candidate } from "./registry";
import type { AlgCp007DiscoveryItem } from "./types";

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

function termText(coefficient: number, variable: string, first: boolean): string {
  if (coefficient === 0) return "";
  const absolute = Math.abs(coefficient);
  const magnitude = absolute === 1 ? variable : `${absolute}${variable}`;
  if (first) return coefficient < 0 ? `-${magnitude}` : magnitude;
  return ` ${coefficient < 0 ? "-" : "+"} ${magnitude}`;
}

function rowText(a: number, b: number, c: number): string {
  const first = termText(a, "x", true);
  const second = termText(b, "y", first.length === 0);
  return `${first}${second || (first ? "" : "0")} = ${c}`;
}

function hiddenParameterRowText(b: number, c: number): string {
  const yPart = b === 0 ? "" : termText(b, "y", false);
  return `kx${yPart} = ${c}`;
}

function integerValue(value: Rational): number {
  if (value.denominator !== 1n) throw new Error("CP-007 discovery trace expects integer system coefficients");
  return Number(value.numerator);
}

function uniqueSystem(seed: number, salt: number): { system: LinearSystem2V; x: Rational; y: Rational; display: [string, string] } {
  const x = nonZeroInt(seed, -7, 7, salt + 1);
  const y = nonZeroInt(seed, -7, 7, salt + 2);
  const a1 = nonZeroInt(seed, -6, 6, salt + 3);
  const b1 = nonZeroInt(seed, -6, 6, salt + 4);
  let a2 = nonZeroInt(seed, -6, 6, salt + 5);
  const b2 = nonZeroInt(seed, -6, 6, salt + 6);
  if (a1 * b2 - a2 * b1 === 0) a2 += a2 === 6 ? -1 : 1;
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  const system: LinearSystem2V = {
    a1: rational(a1), b1: rational(b1), c1: rational(c1),
    a2: rational(a2), b2: rational(b2), c2: rational(c2),
  };
  const solved = solveLinearSystem2V(system);
  if (solved.kind !== "UNIQUE" || !verifyLinearSystemSolution(system, solved.x, solved.y)) throw new Error("Unique system construction failed");
  return { system, x: rational(x), y: rational(y), display: [rowText(a1, b1, c1), rowText(a2, b2, c2)] };
}

function systemStem(lines: [string, string], target: string): string {
  return `Given the system ${lines[0]} and ${lines[1]}, ${target}`;
}

function uniqueSystemTrace(system: LinearSystem2V, x: Rational, y: Rational): string {
  const a1 = integerValue(system.a1);
  const b1 = integerValue(system.b1);
  const c1 = integerValue(system.c1);
  const a2 = integerValue(system.a2);
  const b2 = integerValue(system.b2);
  const c2 = integerValue(system.c2);
  const yCoefficient = a1 * b2 - a2 * b1;
  const yRhs = a1 * c2 - a2 * c1;
  const yEquation = `${termText(yCoefficient, "y", true)} = ${yRhs}`;
  const yText = formatRational(y);
  const xText = formatRational(x);
  const substitutedY = b1 === 0 ? "" : ` ${b1 < 0 ? "-" : "+"} ${Math.abs(b1) === 1 ? `(${yText})` : `${Math.abs(b1)}(${yText})`}`;
  return `Eliminate x by combining the two equations; this gives ${yEquation}, so y = ${yText}. Substitute into the first equation: ${termText(a1, "x", true)}${substitutedY} = ${c1}. Solving gives x = ${xText}.`;
}

function sumText(left: Rational, right: Rational, result: Rational): string {
  const leftText = formatRational(left);
  const rightText = formatRational(right);
  if (right.numerator < 0n) return `${leftText} - ${formatRational(rational(-right.numerator, right.denominator))} = ${formatRational(result)}`;
  return `${leftText} + ${rightText} = ${formatRational(result)}`;
}

export function generateAlgCp007DiscoveryItem(candidateId: string, seed: number): AlgCp007DiscoveryItem {
  const candidate = getAlgCp007Candidate(candidateId);

  switch (candidate.solveMode) {
    case "solveTwoByTwoSystem": {
      const built = uniqueSystem(seed, 10);
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: systemStem(built.display, "find x and y."),
        system: built.system,
        answer: { kind: "ORDERED_PAIR", x: built.x, y: built.y },
        explanation: `${uniqueSystemTrace(built.system, built.x, built.y)} Therefore x = ${formatRational(built.x)} and y = ${formatRational(built.y)}. Substitution in both original equations confirms the pair.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findXPlusYFromSystem": {
      const built = uniqueSystem(seed, 20);
      const answer = addRational(built.x, built.y);
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: systemStem(built.display, "find x + y."),
        system: built.system,
        answer: { kind: "RATIONAL", value: answer },
        explanation: `${uniqueSystemTrace(built.system, built.x, built.y)} Now x + y = ${sumText(built.x, built.y, answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findXMinusYFromSystem": {
      const built = uniqueSystem(seed, 30);
      const answer = subtractRational(built.x, built.y);
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: systemStem(built.display, "find x - y."),
        system: built.system,
        answer: { kind: "RATIONAL", value: answer },
        explanation: `${uniqueSystemTrace(built.system, built.x, built.y)} Hence x - y = ${formatRational(built.x)} - (${formatRational(built.y)}) = ${formatRational(answer)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findOneVariableFromSystem": {
      const built = uniqueSystem(seed, 40);
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: systemStem(built.display, "find x."),
        system: built.system,
        answer: { kind: "RATIONAL", value: built.x },
        explanation: `${uniqueSystemTrace(built.system, built.x, built.y)} Therefore the required value is x = ${formatRational(built.x)}; substitution in both original equations verifies it.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyNoSolutionSystem": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = nonZeroInt(seed, -5, 5, 2);
      const c = pickInt(seed, -9, 9, 3);
      const scale = pickInt(seed, 2, 4, 4);
      const delta = nonZeroInt(seed, 1, 5, 5);
      const system: LinearSystem2V = {
        a1: rational(a), b1: rational(b), c1: rational(c),
        a2: rational(scale * a), b2: rational(scale * b), c2: rational(scale * c + delta),
      };
      if (solveLinearSystem2V(system).kind !== "NO_SOLUTION") throw new Error("No-solution system construction failed");
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Classify the system: ${rowText(a, b, c)} and ${rowText(scale * a, scale * b, scale * c + delta)}.`,
        system,
        answer: { kind: "NO_SOLUTION" },
        explanation: `The x- and y-coefficients of the second equation are exactly ${scale} times those of the first, but its constant is not ${scale} times the first constant. The lines are parallel and distinct, so the system has no solution.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyInfiniteSolutionSystem": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = nonZeroInt(seed, -5, 5, 2);
      const c = pickInt(seed, -9, 9, 3);
      const scale = pickInt(seed, 2, 4, 4);
      const system: LinearSystem2V = {
        a1: rational(a), b1: rational(b), c1: rational(c),
        a2: rational(scale * a), b2: rational(scale * b), c2: rational(scale * c),
      };
      if (solveLinearSystem2V(system).kind !== "INFINITE_SOLUTIONS") throw new Error("Infinite-solution system construction failed");
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Classify the system: ${rowText(a, b, c)} and ${rowText(scale * a, scale * b, scale * c)}.`,
        system,
        answer: { kind: "INFINITE_SOLUTIONS" },
        explanation: `Every coefficient and the constant in the second equation are exactly ${scale} times the first equation. Both equations describe the same line, so the system has infinitely many solutions.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findParameterForNoSolutionSystem": {
      const a = nonZeroInt(seed, -5, 5, 1);
      const b = nonZeroInt(seed, -5, 5, 2);
      const c = pickInt(seed, -9, 9, 3);
      const scale = pickInt(seed, 2, 4, 4);
      const delta = pickInt(seed, 1, 5, 5);
      const hiddenK = scale * a;
      const secondB = scale * b;
      const secondC = scale * c + delta;
      const system: LinearSystem2V = {
        a1: rational(a), b1: rational(b), c1: rational(c),
        a2: rational(hiddenK), b2: rational(secondB), c2: rational(secondC),
      };
      if (solveLinearSystem2V(system).kind !== "NO_SOLUTION") throw new Error("Parameter no-solution construction failed");
      return {
        cpId: "ALG-CP-007", candidateId, solveMode: candidate.solveMode, seed,
        stem: `For what value of k does the system ${rowText(a, b, c)} and ${hiddenParameterRowText(secondB, secondC)} have no solution?`,
        system,
        answer: { kind: "PARAMETER_VALUE", value: rational(hiddenK) },
        explanation: `For no solution, the x- and y-coefficients must be proportional while the constants are not. The y-coefficient in the second equation is ${scale} times the first, so its x-coefficient must also be ${scale} times ${a}: k = ${scale}(${a}) = ${hiddenK}. The constants are not in that same ratio, so this value makes the lines parallel and distinct.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        parameterEvidence: { hiddenSecondXCoefficient: true },
      };
    }
  }
}
