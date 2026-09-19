import {
  compareExactRootSets,
  compareQuadraticSurdExact,
  exactRootsFromQuadraticState,
  formatSurd,
  rational,
  solveQuadraticEquation,
  type QuadraticEquation,
  type RootSetRelation,
} from "../../../../../../shared/algebra";
import { getAlgCp011Candidate } from "./registry";
import type { AlgCp011DiscoveryItem, AlgCp011SolveMode } from "./types";

export const ALG_CP011_DISTINCTIVENESS_REVIEW_V4_AUTHORITY =
  "ALG-CP011-DISTINCTIVENESS-REVIEW-V4" as const;

export const ALG_CP011_DISTINCTIVENESS_REVIEW_V4_POLICY = Object.freeze({
  basedOnQlId: "ALG-QL-032" as const,
  permanentIdentityReopened: false as const,
  semanticContractReopened: false as const,
  solverAuthorityReopened: false as const,
  learnerEnglishFreezeReopened: true as const,
  mathematicalStatePoolReopened: true as const,
  fixedChoiceSemanticsPreserved: true as const,
  downstreamLocked: true as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export interface AlgCp011DistinctivenessReviewV4Item extends AlgCp011DiscoveryItem {
  readonly reviewAuthority: typeof ALG_CP011_DISTINCTIVENESS_REVIEW_V4_AUTHORITY;
  readonly reviewStatus: "REVIEW_ONLY_DISTINCTIVENESS_CANDIDATE";
  readonly qlId: "ALG-QL-032";
  readonly frameId: string;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

function mixSeed(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

function pickInt(seed: number, min: number, max: number, salt: number): number {
  return min + (mixSeed(seed ^ Math.imul(salt, 0x9e3779b9)) % (max - min + 1));
}

function base(seed: number): number {
  return pickInt(seed, -24, 24, 11);
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
  if (
    equation.a.denominator !== 1n
    || equation.b.denominator !== 1n
    || equation.c.denominator !== 1n
  ) {
    throw new Error("ALG-CP-011 V4 review expects integral coefficients.");
  }
  return `${term(equation.a.numerator, `${variable}²`, true)}${term(equation.b.numerator, variable, false)}${term(equation.c.numerator, "", false)} = 0`;
}

function relationText(relation: RootSetRelation): string {
  switch (relation) {
    case "X_GREATER_THAN_Y": return "x > y";
    case "X_LESS_THAN_Y": return "x < y";
    case "X_GREATER_THAN_OR_EQUAL_TO_Y": return "x ≥ y";
    case "X_LESS_THAN_OR_EQUAL_TO_Y": return "x ≤ y";
    case "X_EQUAL_TO_Y": return "x = y";
    case "RELATION_CANNOT_BE_ESTABLISHED": return "the relation cannot be determined";
  }
}

function comparisonSymbol(value: -1 | 0 | 1): "<" | "=" | ">" {
  return value < 0 ? "<" : value > 0 ? ">" : "=";
}

function pairwiseEvidence(
  xRoots: ReturnType<typeof exactRootsFromQuadraticState>,
  yRoots: ReturnType<typeof exactRootsFromQuadraticState>,
): string {
  const evidence: string[] = [];
  for (const x of xRoots) {
    for (const y of yRoots) {
      evidence.push(`${formatSurd(x)} ${comparisonSymbol(compareQuadraticSurdExact(x, y))} ${formatSurd(y)}`);
    }
  }
  return evidence.join("; ");
}

function renderStem(
  equationX: QuadraticEquation,
  equationY: QuadraticEquation,
  seed: number,
): { stem: string; frameId: string } {
  const x = equationText(equationX, "x");
  const y = equationText(equationY, "y");
  const frames = [
    {
      id: "standard-equations",
      text: `Equation I: ${x}  Equation II: ${y}  Compare x and y.`,
    },
    {
      id: "solve-and-compare",
      text: `Solve the two equations and compare x with y. I. ${x}  II. ${y}`,
    },
    {
      id: "relation-task",
      text: `For Equation I, x satisfies ${x}; for Equation II, y satisfies ${y}. Determine the relation between x and y.`,
    },
    {
      id: "always-correct",
      text: `Consider I. ${x} and II. ${y}. Which relation between x and y is always correct?`,
    },
  ] as const;
  return frames[mixSeed(seed ^ 0x5f3759df) % frames.length]!;
}

function expectedRelation(solveMode: AlgCp011SolveMode): RootSetRelation {
  const expected: Record<AlgCp011SolveMode, RootSetRelation> = {
    compareAlwaysGreaterRootSets: "X_GREATER_THAN_Y",
    compareAlwaysLessRootSets: "X_LESS_THAN_Y",
    compareGreaterOrEqualRootSets: "X_GREATER_THAN_OR_EQUAL_TO_Y",
    compareLessOrEqualRootSets: "X_LESS_THAN_OR_EQUAL_TO_Y",
    compareEqualRepeatedRoots: "X_EQUAL_TO_Y",
    compareOverlappingIndeterminateRootSets: "RELATION_CANNOT_BE_ESTABLISHED",
    compareIrrationalConjugateRootSets: "X_GREATER_THAN_Y",
  };
  return expected[solveMode];
}

function build(
  candidateId: string,
  solveMode: AlgCp011SolveMode,
  seed: number,
  equationX: QuadraticEquation,
  equationY: QuadraticEquation,
): AlgCp011DistinctivenessReviewV4Item {
  const xRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationX));
  const yRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationY));
  const answer = compareExactRootSets(xRoots, yRoots);
  const expected = expectedRelation(solveMode);
  if (answer !== expected) {
    throw new Error(`${candidateId}: V4 state construction changed the frozen relation contract (${answer} !== ${expected}).`);
  }

  const rendered = renderStem(equationX, equationY, seed);
  return {
    cpId: "ALG-CP-011",
    qlId: "ALG-QL-032",
    candidateId,
    solveMode,
    seed,
    equationX,
    equationY,
    stem: rendered.stem,
    answer,
    explanation: [
      `Solve Equation I: x ∈ {${xRoots.map(formatSurd).join(", ")}}.`,
      `Solve Equation II: y ∈ {${yRoots.map(formatSurd).join(", ")}}.`,
      `Compare every admissible root pair: ${pairwiseEvidence(xRoots, yRoots)}.`,
      `Therefore ${relationText(answer)}.`,
    ].join("\n"),
    rootEvidence: { xRoots, yRoots },
    sourceStatus: "UNVERIFIED_DRAFT",
    reviewAuthority: ALG_CP011_DISTINCTIVENESS_REVIEW_V4_AUTHORITY,
    reviewStatus: "REVIEW_ONLY_DISTINCTIVENESS_CANDIDATE",
    frameId: rendered.frameId,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

function integerPairs(
  solveMode: AlgCp011SolveMode,
  seed: number,
): { x: [number, number]; y: [number, number] } {
  const b = base(seed);
  const spreadA = pickInt(seed, 1, 4, 21);
  const spreadB = pickInt(seed, 1, 4, 22);
  const separation = pickInt(seed, 2, 7, 23);

  switch (solveMode) {
    case "compareAlwaysGreaterRootSets": {
      const y: [number, number] = [b, b + spreadA];
      const start = y[1] + separation;
      return { x: [start, start + spreadB], y };
    }
    case "compareAlwaysLessRootSets": {
      const x: [number, number] = [b, b + spreadA];
      const start = x[1] + separation;
      return { x, y: [start, start + spreadB] };
    }
    case "compareGreaterOrEqualRootSets": {
      const y: [number, number] = [b, b + spreadA];
      return { x: [y[1], y[1] + separation + spreadB], y };
    }
    case "compareLessOrEqualRootSets": {
      const x: [number, number] = [b, b + spreadA];
      return { x, y: [x[1], x[1] + separation + spreadB] };
    }
    case "compareEqualRepeatedRoots": {
      const repeated = b + pickInt(seed, -3, 3, 24);
      return { x: [repeated, repeated], y: [repeated, repeated] };
    }
    case "compareOverlappingIndeterminateRootSets": {
      const outer = pickInt(seed, 7, 13, 25);
      const inset = pickInt(seed, 1, 3, 26);
      return { x: [b, b + outer], y: [b + inset, b + outer - inset] };
    }
    case "compareIrrationalConjugateRootSets":
      throw new Error("Irrational state uses the dedicated conjugate builder.");
  }
}

export function generateAlgCp011DistinctivenessReviewV4(
  candidateId: string,
  seed: number,
): AlgCp011DistinctivenessReviewV4Item {
  const candidate = getAlgCp011Candidate(candidateId);

  if (candidate.solveMode === "compareIrrationalConjugateRootSets") {
    const radicands = [2, 3, 5, 6, 7, 10, 11, 13] as const;
    const radicand = radicands[mixSeed(seed ^ 0x1107) % radicands.length]!;
    const centerY = base(seed);
    const separation = pickInt(seed, 8, 12, 31);
    return build(
      candidateId,
      candidate.solveMode,
      seed,
      equationFromConjugateRoots(centerY + separation, radicand),
      equationFromConjugateRoots(centerY, radicand),
    );
  }

  const pairs = integerPairs(candidate.solveMode, seed);
  return build(
    candidateId,
    candidate.solveMode,
    seed,
    equationFromRoots(pairs.x[0], pairs.x[1]),
    equationFromRoots(pairs.y[0], pairs.y[1]),
  );
}
