import {
  compareExactRootSets,
  exactRootsFromQuadraticState,
  formatSurd,
  rational,
  solveQuadraticEquation,
  type QuadraticEquation,
  type RootSetRelation,
} from "../../../../../../shared/algebra";
import { getAlgCp011Candidate } from "./registry";
import type { AlgCp011DiscoveryItem } from "./types";

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function base(seed: number): number {
  return -6 + (mixSeed(seed ^ 0x7ac51) % 13);
}

function equationFromRoots(r1: number, r2: number): QuadraticEquation {
  return { a: rational(1n), b: rational(-(r1 + r2)), c: rational(r1 * r2) };
}

function equationFromConjugateRoots(center: number, radicand: number): QuadraticEquation {
  return { a: rational(1n), b: rational(-2 * center), c: rational(center * center - radicand) };
}

function term(coefficient: bigint, variable: string, first: boolean): string {
  if (coefficient === 0n) return "";
  const negative = coefficient < 0n;
  const absolute = negative ? -coefficient : coefficient;
  const magnitude = variable && absolute === 1n ? variable : `${absolute}${variable}`;
  if (first) return negative ? `-${magnitude}` : magnitude;
  return ` ${negative ? "-" : "+"} ${magnitude}`;
}

function equationText(equation: QuadraticEquation, variable: "x" | "y"): string {
  if (equation.a.denominator !== 1n || equation.b.denominator !== 1n || equation.c.denominator !== 1n) throw new Error("Banking discovery expects integral coefficients");
  return `${term(equation.a.numerator, `${variable}²`, true)}${term(equation.b.numerator, variable, false)}${term(equation.c.numerator, "", false)} = 0`;
}

function relationText(relation: RootSetRelation): string {
  switch (relation) {
    case "X_GREATER_THAN_Y": return "x > y";
    case "X_LESS_THAN_Y": return "x < y";
    case "X_GREATER_THAN_OR_EQUAL_TO_Y": return "x ≥ y";
    case "X_LESS_THAN_OR_EQUAL_TO_Y": return "x ≤ y";
    case "X_EQUAL_TO_Y": return "x = y";
    case "RELATION_CANNOT_BE_ESTABLISHED": return "the relation cannot be established";
  }
}

function buildFromEquations(candidateId: string, solveMode: AlgCp011DiscoveryItem["solveMode"], seed: number, equationX: QuadraticEquation, equationY: QuadraticEquation): AlgCp011DiscoveryItem {
  const xRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationX));
  const yRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationY));
  const answer = compareExactRootSets(xRoots, yRoots);
  return {
    cpId: "ALG-CP-011", candidateId, solveMode, seed, equationX, equationY,
    stem: `Equation I: ${equationText(equationX, "x")}  Equation II: ${equationText(equationY, "y")}  Compare x and y.`,
    answer,
    explanation: `Equation I gives x ∈ {${xRoots.map(formatSurd).join(", ")}} and Equation II gives y ∈ {${yRoots.map(formatSurd).join(", ")}}. Comparing every possible x–y pair exactly shows that ${relationText(answer)}.`,
    rootEvidence: { xRoots, yRoots },
    sourceStatus: "UNVERIFIED_DRAFT",
  };
}

function buildItem(candidateId: string, solveMode: AlgCp011DiscoveryItem["solveMode"], seed: number, xPair: [number, number], yPair: [number, number]): AlgCp011DiscoveryItem {
  return buildFromEquations(candidateId, solveMode, seed, equationFromRoots(xPair[0], xPair[1]), equationFromRoots(yPair[0], yPair[1]));
}

export function generateAlgCp011DiscoveryItem(candidateId: string, seed: number): AlgCp011DiscoveryItem {
  const candidate = getAlgCp011Candidate(candidateId);
  const b = base(seed);
  let item: AlgCp011DiscoveryItem;

  switch (candidate.solveMode) {
    case "compareAlwaysGreaterRootSets":
      item = buildItem(candidateId, candidate.solveMode, seed, [b + 4, b + 6], [b, b + 2]);
      break;
    case "compareAlwaysLessRootSets":
      item = buildItem(candidateId, candidate.solveMode, seed, [b, b + 2], [b + 4, b + 6]);
      break;
    case "compareGreaterOrEqualRootSets":
      item = buildItem(candidateId, candidate.solveMode, seed, [b + 2, b + 5], [b, b + 2]);
      break;
    case "compareLessOrEqualRootSets":
      item = buildItem(candidateId, candidate.solveMode, seed, [b, b + 2], [b + 2, b + 5]);
      break;
    case "compareEqualRepeatedRoots":
      item = buildItem(candidateId, candidate.solveMode, seed, [b + 2, b + 2], [b + 2, b + 2]);
      break;
    case "compareOverlappingIndeterminateRootSets":
      item = buildItem(candidateId, candidate.solveMode, seed, [b, b + 5], [b + 1, b + 4]);
      break;
    case "compareIrrationalConjugateRootSets": {
      const radicand = mixSeed(seed ^ 0x1107) % 2 === 0 ? 2 : 3;
      item = buildFromEquations(candidateId, candidate.solveMode, seed, equationFromConjugateRoots(b + 5, radicand), equationFromConjugateRoots(b, radicand));
      break;
    }
  }

  const expected: Record<AlgCp011DiscoveryItem["solveMode"], RootSetRelation> = {
    compareAlwaysGreaterRootSets: "X_GREATER_THAN_Y",
    compareAlwaysLessRootSets: "X_LESS_THAN_Y",
    compareGreaterOrEqualRootSets: "X_GREATER_THAN_OR_EQUAL_TO_Y",
    compareLessOrEqualRootSets: "X_LESS_THAN_OR_EQUAL_TO_Y",
    compareEqualRepeatedRoots: "X_EQUAL_TO_Y",
    compareOverlappingIndeterminateRootSets: "RELATION_CANNOT_BE_ESTABLISHED",
    compareIrrationalConjugateRootSets: "X_GREATER_THAN_Y",
  };
  if (item.answer !== expected[candidate.solveMode]) throw new Error(`${candidateId} constructed the wrong Banking relation`);
  return item;
}
