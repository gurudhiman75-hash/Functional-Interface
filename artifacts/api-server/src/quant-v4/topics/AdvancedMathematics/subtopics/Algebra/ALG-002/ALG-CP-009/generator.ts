import {
  equalsRational,
  formatRational,
  formatSurd,
  quadraticDiscriminant,
  rational,
  solveQuadraticEquation,
  type QuadraticEquation,
} from "../../../../../../shared/algebra";
import { getAlgCp009Candidate } from "./registry";
import type { AlgCp009DiscoveryItem } from "./types";

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

function distinctInt(seed: number, min: number, max: number, salt: number, forbidden: number): number {
  let value = nonZeroInt(seed, min, max, salt);
  if (value === forbidden) value = value === max ? value - 1 : value + 1;
  if (value === 0) value = forbidden === 1 ? -1 : 1;
  return value;
}

function termText(coefficient: number, degree: 0 | 1 | 2, first: boolean): string {
  if (coefficient === 0) return "";
  const absolute = Math.abs(coefficient);
  const variable = degree === 0 ? "" : degree === 1 ? "x" : "x²";
  const magnitude = degree > 0 && absolute === 1 ? variable : `${absolute}${variable}`;
  if (first) return coefficient < 0 ? `-${magnitude}` : magnitude;
  return ` ${coefficient < 0 ? "-" : "+"} ${magnitude}`;
}

function equationText(equation: QuadraticEquation): string {
  if (equation.a.denominator !== 1n || equation.b.denominator !== 1n || equation.c.denominator !== 1n) {
    return `${formatRational(equation.a)}x² + (${formatRational(equation.b)})x + (${formatRational(equation.c)}) = 0`;
  }
  const a = Number(equation.a.numerator);
  const b = Number(equation.b.numerator);
  const c = Number(equation.c.numerator);
  return `${termText(a, 2, true)}${termText(b, 1, false)}${termText(c, 0, false)} = 0`;
}

export function generateAlgCp009DiscoveryItem(candidateId: string, seed: number): AlgCp009DiscoveryItem {
  const candidate = getAlgCp009Candidate(candidateId);

  switch (candidate.solveMode) {
    case "solveFactorableQuadratic": {
      const r1 = nonZeroInt(seed, -8, 8, 1);
      const r2 = distinctInt(seed, -8, 8, 2, r1);
      const a = pickInt(seed, 1, 3, 3);
      const equation: QuadraticEquation = {
        a: rational(a),
        b: rational(-a * (r1 + r2)),
        c: rational(a * r1 * r2),
      };
      const solved = solveQuadraticEquation(equation);
      if (solved.kind !== "TWO_RATIONAL_ROOTS") throw new Error("Factorable quadratic construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`, equation,
        answer: { kind: "RATIONAL_ROOT_SET", values: solved.roots },
        explanation: `Factor the quadratic into two linear factors. The zero-product rule gives x = ${r1} or x = ${r2}. Both values satisfy the original equation.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveRepeatedRootQuadratic": {
      const root = nonZeroInt(seed, -8, 8, 1);
      const a = pickInt(seed, 1, 3, 2);
      const equation: QuadraticEquation = { a: rational(a), b: rational(-2 * a * root), c: rational(a * root * root) };
      const solved = solveQuadraticEquation(equation);
      if (solved.kind !== "REPEATED_ROOT" || !equalsRational(solved.root, rational(root))) throw new Error("Repeated-root construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)}.`, equation,
        answer: { kind: "RATIONAL_ROOT_SET", values: [solved.root] },
        explanation: `The quadratic is a perfect square, so both roots coincide. Its repeated root is x = ${root}. Substitution gives zero, confirming the result.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "solveExactIrrationalQuadratic": {
      const nonSquares = [2, 3, 5, 6, 7, 10, 11, 13];
      const n = nonSquares[mixSeed(seed ^ 0x734a2) % nonSquares.length]!;
      const shift = pickInt(seed, -5, 5, 2);
      const equation: QuadraticEquation = { a: rational(1n), b: rational(-2 * shift), c: rational(shift * shift - n) };
      const solved = solveQuadraticEquation(equation);
      if (solved.kind !== "TWO_IRRATIONAL_ROOTS") throw new Error("Irrational-root construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `Solve ${equationText(equation)} and give the roots in exact form.`, equation,
        answer: { kind: "SURD_ROOT_SET", values: solved.roots },
        explanation: `The discriminant is ${4 * n}, so the quadratic formula gives the exact roots ${formatSurd(solved.roots[0])} and ${formatSurd(solved.roots[1])}. No decimal approximation is needed.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "classifyNoRealRoots": {
      const b = pickInt(seed, -6, 6, 1);
      const extra = pickInt(seed, 1, 6, 2);
      const c = Math.floor((b * b) / 4) + extra + 1;
      const equation: QuadraticEquation = { a: rational(1n), b: rational(b), c: rational(c) };
      const discriminant = quadraticDiscriminant(equation);
      if (discriminant.numerator >= 0n || solveQuadraticEquation(equation).kind !== "NO_REAL_ROOTS") throw new Error("No-real-root construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `How many real roots does ${equationText(equation)} have?`, equation,
        answer: { kind: "NO_REAL_ROOTS" },
        explanation: `The discriminant is D = ${formatRational(discriminant)}. Since D < 0, the quadratic has no real roots.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findParameterForEqualRoots": {
      const halfB = nonZeroInt(seed, -7, 7, 1);
      const b = 2 * halfB;
      const k = halfB * halfB;
      const equation: QuadraticEquation = { a: rational(1n), b: rational(b), c: rational(k) };
      const discriminant = quadraticDiscriminant(equation);
      const solved = solveQuadraticEquation(equation);
      if (discriminant.numerator !== 0n || solved.kind !== "REPEATED_ROOT") throw new Error("Equal-root parameter construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `For what value of k does x² ${b < 0 ? "-" : "+"} ${Math.abs(b)}x + k = 0 have equal roots?`,
        equation,
        answer: { kind: "PARAMETER_VALUE", value: rational(k) },
        explanation: `Equal roots require D = 0. Thus ${b}² - 4k = 0, so k = ${k}. With this value, the repeated root is x = ${formatRational(solved.root)}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
      };
    }

    case "findCoefficientFromKnownRoot": {
      const root = nonZeroInt(seed, -6, 6, 1);
      const a = pickInt(seed, 1, 4, 2);
      const m = nonZeroInt(seed, -6, 6, 3);
      const c = m * root;
      const k = -(a * root + m);
      const equation: QuadraticEquation = { a: rational(a), b: rational(k), c: rational(c) };
      const solved = solveQuadraticEquation(equation);
      const rootAppears = solved.kind === "REPEATED_ROOT"
        ? equalsRational(solved.root, rational(root))
        : solved.kind === "TWO_RATIONAL_ROOTS"
          ? solved.roots.some((value) => equalsRational(value, rational(root)))
          : false;
      if (!rootAppears) throw new Error("Known-root coefficient construction failed");
      return {
        cpId: "ALG-CP-009", candidateId, solveMode: candidate.solveMode, seed,
        stem: `If x = ${root} is a root of ${a === 1 ? "x²" : `${a}x²`} + kx ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0, find k.`,
        equation,
        answer: { kind: "PARAMETER_VALUE", value: rational(k) },
        explanation: `A root makes the polynomial zero. Substituting x = ${root} gives a linear equation in k; solving it gives k = ${k}.`,
        sourceStatus: "UNVERIFIED_DRAFT",
        knownRootEvidence: rational(root),
      };
    }
  }
}
