import {
  constantParameterRangeForGlobalQuadraticSign,
  countIntegersInIntervalSet,
  formatIntervalSet,
  formatParameterRange,
  formatRational,
  intersectIntervalSets,
  quadraticExtremum,
  rational,
  solveLinearInequality,
  solveQuadraticInequality,
  type GlobalQuadraticSign,
  type InequalityOperator,
  type QuadraticEquation,
} from "../../../../../../shared/algebra";
import { getAlgCp012Candidate } from "./registry";
import type { AlgCp012DiscoveryItem } from "./types";

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

function quadraticText(a: number, b: number, c: number): string {
  const pieces: string[] = [];
  const push = (coefficient: number, variable: string) => {
    if (coefficient === 0) return;
    const abs = Math.abs(coefficient);
    const magnitude = variable && abs === 1 ? variable : `${abs}${variable}`;
    if (pieces.length === 0) pieces.push(coefficient < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${coefficient < 0 ? "-" : "+"} ${magnitude}`);
  };
  push(a, "x²");
  push(b, "x");
  push(c, "");
  return pieces.join(" ") || "0";
}

function equationFromRoots(leading: number, r1: number, r2: number): QuadraticEquation {
  return {
    a: rational(leading),
    b: rational(-leading * (r1 + r2)),
    c: rational(leading * r1 * r2),
  };
}

function sortedDistinctRoots(seed: number, salt: number): [number, number] {
  let r1 = nonZeroInt(seed, -7, 6, salt);
  let r2 = nonZeroInt(seed, -6, 7, salt + 1);
  if (r1 === r2) r2 = r1 === 7 ? 6 : r1 + 1;
  if (r1 > r2) [r1, r2] = [r2, r1];
  return [r1, r2];
}

function intervalItem(
  candidateId: string,
  solveMode: AlgCp012DiscoveryItem["solveMode"],
  seed: number,
  stem: string,
  math: Extract<AlgCp012DiscoveryItem["math"], { kind: "LINEAR" | "COMPOUND_LINEAR" | "QUADRATIC_INEQUALITY" }>,
  value: Extract<AlgCp012DiscoveryItem["answer"], { kind: "INTERVAL_SET" }>["value"],
  explanation: string,
): AlgCp012DiscoveryItem {
  return {
    cpId: "ALG-CP-012",
    candidateId,
    solveMode,
    seed,
    stem,
    math,
    answer: { kind: "INTERVAL_SET", value, text: formatIntervalSet(value) },
    explanation,
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

export function generateAlgCp012DiscoveryItem(candidateId: string, seed: number): AlgCp012DiscoveryItem {
  const candidate = getAlgCp012Candidate(candidateId);

  switch (candidate.solveMode) {
    case "solveLinearInequality": {
      const a = pickInt(seed, 2, 7, 1);
      const boundary = nonZeroInt(seed, -7, 7, 2);
      const b = -a * boundary;
      const operators: InequalityOperator[] = ["GT", "GE", "LT", "LE"];
      const operator = operators[mixSeed(seed ^ 0x1201) % operators.length]!;
      const value = solveLinearInequality(rational(a), rational(b), operator);
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${linearText(a, b)} ${relationSymbol(operator)} 0.`,
        { kind: "LINEAR", a: rational(a), b: rational(b), operator },
        value,
        `Move the constant term so the variable term is isolated. The coefficient of x is positive, so dividing by ${a} keeps the inequality sign unchanged. The boundary is x = ${boundary}, giving ${formatIntervalSet(value)}.`,
      );
    }

    case "solveLinearInequalityWithNegativeCoefficient": {
      const magnitude = pickInt(seed, 2, 7, 1);
      const a = -magnitude;
      const boundary = nonZeroInt(seed, -7, 7, 2);
      const b = -a * boundary;
      const operator: InequalityOperator = mixSeed(seed ^ 0x1202) % 2 === 0 ? "GT" : "LE";
      const value = solveLinearInequality(rational(a), rational(b), operator);
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${linearText(a, b)} ${relationSymbol(operator)} 0.`,
        { kind: "LINEAR", a: rational(a), b: rational(b), operator },
        value,
        `After moving the constant term, x is multiplied by ${a}. Dividing by a negative number reverses the inequality sign. The boundary is x = ${boundary}, so the solution is ${formatIntervalSet(value)}.`,
      );
    }

    case "solveCompoundLinearInequality": {
      const lower = pickInt(seed, -7, -1, 1);
      const upper = pickInt(seed, 1, 8, 2);
      const a = pickInt(seed, 2, 4, 3);
      const shift = pickInt(seed, -5, 5, 4);
      const leftValue = a * lower + shift;
      const rightValue = a * upper + shift;
      const first = { a: rational(a), b: rational(shift - leftValue), operator: "GT" as const };
      const second = { a: rational(a), b: rational(shift - rightValue), operator: "LE" as const };
      const value = intersectIntervalSets(
        solveLinearInequality(first.a, first.b, first.operator),
        solveLinearInequality(second.a, second.b, second.operator),
      );
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${leftValue} < ${linearText(a, shift)} ≤ ${rightValue}.`,
        { kind: "COMPOUND_LINEAR", inequalities: [first, second] },
        value,
        `Treat the compound statement as two inequalities and keep only values satisfying both. Solving gives x > ${lower} and x ≤ ${upper}; their intersection is ${formatIntervalSet(value)}.`,
      );
    }

    case "solveQuadraticPositiveRegion": {
      const [r1, r2] = sortedDistinctRoots(seed, 1);
      const leading = pickInt(seed, 1, 3, 4);
      const equation = equationFromRoots(leading, r1, r2);
      const operator: InequalityOperator = "GT";
      const value = solveQuadraticInequality(equation, operator);
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${quadraticText(Number(equation.a.numerator), Number(equation.b.numerator), Number(equation.c.numerator))} > 0.`,
        { kind: "QUADRATIC_INEQUALITY", equation, operator },
        value,
        `The quadratic is zero at x = ${r1} and x = ${r2}. Its leading coefficient is positive, so the expression is positive outside the two roots and negative between them. Because the inequality is strict, the roots are excluded. Hence ${formatIntervalSet(value)}.`,
      );
    }

    case "solveQuadraticNonPositiveRegion": {
      const [r1, r2] = sortedDistinctRoots(seed, 11);
      const leading = pickInt(seed, 1, 3, 14);
      const equation = equationFromRoots(leading, r1, r2);
      const operator: InequalityOperator = "LE";
      const value = solveQuadraticInequality(equation, operator);
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${quadraticText(Number(equation.a.numerator), Number(equation.b.numerator), Number(equation.c.numerator))} ≤ 0.`,
        { kind: "QUADRATIC_INEQUALITY", equation, operator },
        value,
        `The roots are x = ${r1} and x = ${r2}. With a positive leading coefficient, the quadratic is non-positive between the roots. Equality is allowed, so both roots are included: ${formatIntervalSet(value)}.`,
      );
    }

    case "solveRepeatedRootQuadraticInequality": {
      const root = nonZeroInt(seed, -6, 6, 1);
      const leading = pickInt(seed, 1, 4, 2);
      const equation = equationFromRoots(leading, root, root);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1206) % 2 === 0 ? "LE" : "GE";
      const value = solveQuadraticInequality(equation, operator);
      const interpretation = operator === "LE"
        ? `A positive multiple of (x - ${root})² can be at most zero only when the square itself is zero.`
        : `A positive multiple of (x - ${root})² is never negative, so it is non-negative for every real x.`;
      return intervalItem(
        candidateId,
        candidate.solveMode,
        seed,
        `Solve ${quadraticText(Number(equation.a.numerator), Number(equation.b.numerator), Number(equation.c.numerator))} ${relationSymbol(operator)} 0.`,
        { kind: "QUADRATIC_INEQUALITY", equation, operator },
        value,
        `${interpretation} Therefore the solution is ${formatIntervalSet(value)}.`,
      );
    }

    case "findQuadraticMinimum": {
      const a = pickInt(seed, 2, 5, 1);
      let b = nonZeroInt(seed, -9, 9, 2);
      if (b % 2 === 0) b += b === 8 ? -1 : 1;
      const c = pickInt(seed, -8, 10, 3);
      const equation: QuadraticEquation = { a: rational(a), b: rational(b), c: rational(c) };
      const value = quadraticExtremum(equation);
      return {
        cpId: "ALG-CP-012",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `Find the minimum value of ${quadraticText(a, b, c)} and the value of x at which it occurs.`,
        math: { kind: "EXTREMUM", equation },
        answer: { kind: "EXTREMUM", value, text: `minimum ${formatRational(value.value)} at x = ${formatRational(value.x)}` },
        explanation: `The coefficient of x² is positive, so the parabola opens upward and has a minimum at its vertex. Using x = -b/(2a) gives x = ${formatRational(value.x)}. Substituting this x into the quadratic gives the minimum value ${formatRational(value.value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findQuadraticMaximum": {
      const magnitude = pickInt(seed, 2, 5, 1);
      const a = -magnitude;
      let b = nonZeroInt(seed, -9, 9, 2);
      if (b % 2 === 0) b += b === 8 ? -1 : 1;
      const c = pickInt(seed, -8, 10, 3);
      const equation: QuadraticEquation = { a: rational(a), b: rational(b), c: rational(c) };
      const value = quadraticExtremum(equation);
      return {
        cpId: "ALG-CP-012",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `Find the maximum value of ${quadraticText(a, b, c)} and the value of x at which it occurs.`,
        math: { kind: "EXTREMUM", equation },
        answer: { kind: "EXTREMUM", value, text: `maximum ${formatRational(value.value)} at x = ${formatRational(value.x)}` },
        explanation: `The coefficient of x² is negative, so the parabola opens downward and has a maximum at its vertex. The vertex occurs at x = -b/(2a) = ${formatRational(value.x)}. Substitution gives the maximum value ${formatRational(value.value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findParameterRangeForGlobalQuadraticSign": {
      const positiveLeading = mixSeed(seed ^ 0x1209) % 2 === 0;
      const a = positiveLeading ? pickInt(seed, 1, 4, 1) : -pickInt(seed, 1, 4, 1);
      const b = nonZeroInt(seed, -8, 8, 2);
      const strict = mixSeed(seed ^ 0x9120) % 2 === 0;
      const target: GlobalQuadraticSign = positiveLeading
        ? (strict ? "POSITIVE" : "NONNEGATIVE")
        : (strict ? "NEGATIVE" : "NONPOSITIVE");
      const value = constantParameterRangeForGlobalQuadraticSign(rational(a), rational(b), target);
      const signSymbol = target === "POSITIVE" ? "> 0" : target === "NONNEGATIVE" ? "≥ 0" : target === "NEGATIVE" ? "< 0" : "≤ 0";
      const targetText = target === "POSITIVE" ? "positive" : target === "NONNEGATIVE" ? "non-negative" : target === "NEGATIVE" ? "negative" : "non-positive";
      return {
        cpId: "ALG-CP-012",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `For what values of k is ${quadraticText(a, b, 0)} + k ${signSymbol} for every real x?`,
        math: { kind: "GLOBAL_SIGN_PARAMETER", a: rational(a), b: rational(b), target, parameter: "k" },
        answer: { kind: "PARAMETER_RANGE", value, text: formatParameterRange("k", value) },
        explanation: `The leading coefficient has the correct direction for the quadratic to remain ${targetText} for every real x. The discriminant b² - 4ak must therefore be ${strict ? "less than 0" : "at most 0"}. Solving that inequality for k gives ${formatParameterRange("k", value)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "countIntegerSolutionsInQuadraticInterval": {
      const [r1, r2] = sortedDistinctRoots(seed, 21);
      const leading = pickInt(seed, 1, 2, 24);
      const equation = equationFromRoots(leading, r1, r2);
      const operator: InequalityOperator = mixSeed(seed ^ 0x1210) % 2 === 0 ? "LT" : "LE";
      const set = solveQuadraticInequality(equation, operator);
      const value = countIntegersInIntervalSet(set);
      return {
        cpId: "ALG-CP-012",
        candidateId,
        solveMode: candidate.solveMode,
        seed,
        stem: `How many integer values of x satisfy ${quadraticText(Number(equation.a.numerator), Number(equation.b.numerator), Number(equation.c.numerator))} ${relationSymbol(operator)} 0?`,
        math: { kind: "INTEGER_COUNT", equation, operator },
        answer: { kind: "INTEGER_COUNT", value, text: value.toString() },
        explanation: `The quadratic has roots ${r1} and ${r2} and opens upward, so the required values lie ${operator === "LE" ? "between the roots including both endpoints" : "strictly between the roots"}. The exact interval is ${formatIntervalSet(set)}. Counting the integers in that interval gives ${value}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }
  }
}
