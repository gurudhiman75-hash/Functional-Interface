import {
  compareExactRootSets,
  compareQuadraticSurdExact,
  exactRootsFromQuadraticState,
  formatSurd,
  rational,
  solveQuadraticEquation,
  type QuadraticEquation,
  type QuadraticSurd,
  type RootSetRelation,
} from "../../../../../shared/algebra";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP011-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp011ReviewV4SolveMode =
  | "compareAlwaysGreaterRootSets"
  | "compareAlwaysLessRootSets"
  | "compareGreaterOrEqualRootSets"
  | "compareLessOrEqualRootSets"
  | "compareEqualRepeatedRoots"
  | "compareOverlappingIndeterminateRootSets"
  | "compareIrrationalConjugateRootSets";

export interface AlgCp011EnglishReviewV4Item {
  readonly authority: typeof ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly qlId: "ALG-QL-032";
  readonly cpId: "ALG-CP-011";
  readonly packageId: "ALG-002";
  readonly prototypeId: string;
  readonly solveMode: AlgCp011ReviewV4SolveMode;
  readonly variantIndex: number;
  readonly seed: number;
  readonly question: string;
  readonly canonicalAnswer: RootSetRelation;
  readonly explanation: string;
  readonly equationX: QuadraticEquation;
  readonly equationY: QuadraticEquation;
  readonly xRoots: QuadraticSurd[];
  readonly yRoots: QuadraticSurd[];
  readonly permanentIdentityFrozen: true;
  readonly semanticContractFrozen: true;
  readonly solverAuthorityFrozen: true;
  readonly learnerContentFrozen: false;
  readonly reviewStatus: "REVIEW_CANDIDATE_ONLY";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const VARIANTS: readonly {
  prototypeId: string;
  solveMode: AlgCp011ReviewV4SolveMode;
  expected: RootSetRelation;
}[] = [
  { prototypeId: "ALG-CP011-CAND-001", solveMode: "compareAlwaysGreaterRootSets", expected: "X_GREATER_THAN_Y" },
  { prototypeId: "ALG-CP011-CAND-002", solveMode: "compareAlwaysLessRootSets", expected: "X_LESS_THAN_Y" },
  { prototypeId: "ALG-CP011-CAND-003", solveMode: "compareGreaterOrEqualRootSets", expected: "X_GREATER_THAN_OR_EQUAL_TO_Y" },
  { prototypeId: "ALG-CP011-CAND-004", solveMode: "compareLessOrEqualRootSets", expected: "X_LESS_THAN_OR_EQUAL_TO_Y" },
  { prototypeId: "ALG-CP011-CAND-005", solveMode: "compareEqualRepeatedRoots", expected: "X_EQUAL_TO_Y" },
  { prototypeId: "ALG-CP011-CAND-006", solveMode: "compareOverlappingIndeterminateRootSets", expected: "RELATION_CANNOT_BE_ESTABLISHED" },
  { prototypeId: "ALG-CP011-CAND-007", solveMode: "compareIrrationalConjugateRootSets", expected: "X_GREATER_THAN_Y" },
] as const;

function mixSeed(seed: number, salt: number): number {
  let x = (seed ^ salt) | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function pick(seed: number, salt: number, min: number, max: number): number {
  return min + (mixSeed(seed, salt) % (max - min + 1));
}

function equationFromRoots(r1: number, r2: number, scale: number): QuadraticEquation {
  const a = BigInt(scale);
  return {
    a: rational(a),
    b: rational(-a * BigInt(r1 + r2)),
    c: rational(a * BigInt(r1 * r2)),
  };
}

function equationFromConjugates(center: number, radicand: number, scale: number): QuadraticEquation {
  const a = BigInt(scale);
  return {
    a: rational(a),
    b: rational(-2n * a * BigInt(center)),
    c: rational(a * BigInt(center * center - radicand)),
  };
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
    throw new Error("ALG-CP011 V4 review requires integral coefficients");
  }
  return `${term(equation.a.numerator, `${variable}²`, true)}${term(equation.b.numerator, variable, false)}${term(equation.c.numerator, "", false)} = 0`;
}

function sortedRoots(roots: QuadraticSurd[]): QuadraticSurd[] {
  return [...roots].sort((a, b) => compareQuadraticSurdExact(a, b));
}

function relationText(relation: RootSetRelation): string {
  switch (relation) {
    case "X_GREATER_THAN_Y": return "x > y";
    case "X_LESS_THAN_Y": return "x < y";
    case "X_GREATER_THAN_OR_EQUAL_TO_Y": return "x ≥ y";
    case "X_LESS_THAN_OR_EQUAL_TO_Y": return "x ≤ y";
    case "X_EQUAL_TO_Y": return "x = y";
    case "RELATION_CANNOT_BE_ESTABLISHED": return "the relation between x and y cannot be established";
  }
}

function buildQuestion(equationX: QuadraticEquation, equationY: QuadraticEquation, frame: number): string {
  const first = equationText(equationX, "x");
  const second = equationText(equationY, "y");
  switch (frame % 4) {
    case 0:
      return `Solve the following equations and compare x and y.\nEquation I: ${first}\nEquation II: ${second}`;
    case 1:
      return `Find the relation between x and y for the equations below.\nI. ${first}\nII. ${second}`;
    case 2:
      return `Which relation between x and y is correct after solving these equations?\nI. ${first}\nII. ${second}`;
    default:
      return `Solve both equations and determine the relation between x and y.\nEquation I: ${first}\nEquation II: ${second}`;
  }
}

function rootList(label: string, roots: QuadraticSurd[]): string {
  return `${label} = {${sortedRoots(roots).map(formatSurd).join(", ")}}`;
}

function explanationFor(
  relation: RootSetRelation,
  xRoots: QuadraticSurd[],
  yRoots: QuadraticSurd[],
): string {
  const xs = sortedRoots(xRoots);
  const ys = sortedRoots(yRoots);
  const start = `Equation I gives ${rootList("x", xs)}. Equation II gives ${rootList("y", ys)}.`;

  if (relation === "X_GREATER_THAN_Y") {
    return `${start} The smallest possible x is ${formatSurd(xs[0]!)} and the largest possible y is ${formatSurd(ys.at(-1)!)}. Since the smallest x is still greater, x > y.`;
  }
  if (relation === "X_LESS_THAN_Y") {
    return `${start} The largest possible x is ${formatSurd(xs.at(-1)!)} and the smallest possible y is ${formatSurd(ys[0]!)}. Since the largest x is still smaller, x < y.`;
  }
  if (relation === "X_GREATER_THAN_OR_EQUAL_TO_Y") {
    return `${start} The smallest possible x is ${formatSurd(xs[0]!)} and the largest possible y is ${formatSurd(ys.at(-1)!)}. They are equal at the boundary and x is otherwise larger, so x ≥ y.`;
  }
  if (relation === "X_LESS_THAN_OR_EQUAL_TO_Y") {
    return `${start} The largest possible x is ${formatSurd(xs.at(-1)!)} and the smallest possible y is ${formatSurd(ys[0]!)}. They are equal at the boundary and x is otherwise smaller, so x ≤ y.`;
  }
  if (relation === "X_EQUAL_TO_Y") {
    return `${start} Each quadratic has only one admissible value because its two roots coincide. The only possible value of x is therefore the same as the only possible value of y. Hence x = y.`;
  }

  let lessWitness: string | undefined;
  let greaterWitness: string | undefined;
  for (const x of xs) {
    for (const y of ys) {
      const comparison = compareQuadraticSurdExact(x, y);
      if (comparison < 0 && !lessWitness) lessWitness = `${formatSurd(x)} < ${formatSurd(y)}`;
      if (comparison > 0 && !greaterWitness) greaterWitness = `${formatSurd(x)} > ${formatSurd(y)}`;
    }
  }
  if (!lessWitness || !greaterWitness) {
    throw new Error("ALG-CP011 indeterminate review state is missing opposite comparison witnesses");
  }
  return `${start} One admissible pair gives ${lessWitness}, while another gives ${greaterWitness}. Hence no single relation holds for all cases, so the relation cannot be established.`;
}

export function generateAlgCp011EnglishReviewV4(
  seed: number,
  requestedVariantIndex?: number,
): AlgCp011EnglishReviewV4Item {
  const variantIndex = requestedVariantIndex ?? (mixSeed(seed, 0x32011) % VARIANTS.length);
  if (!Number.isInteger(variantIndex) || variantIndex < 0 || variantIndex >= VARIANTS.length) {
    throw new Error(`Invalid ALG-QL-032 V4 variant index: ${variantIndex}`);
  }

  const variant = VARIANTS[variantIndex]!;
  const base = pick(seed, 0x1101 + variantIndex, -17, 17);
  const gapA = pick(seed, 0x2201 + variantIndex, 2, 6);
  const gapB = pick(seed, 0x3301 + variantIndex, 2, 6);
  const separation = pick(seed, 0x4401 + variantIndex, 1, 4);
  const scaleX = pick(seed, 0x5501 + variantIndex, 1, 3);
  const scaleY = pick(seed, 0x6601 + variantIndex, 1, 3);

  let equationX: QuadraticEquation;
  let equationY: QuadraticEquation;

  switch (variant.solveMode) {
    case "compareAlwaysGreaterRootSets": {
      const y1 = base;
      const y2 = base + gapA;
      const x1 = y2 + separation;
      const x2 = x1 + gapB;
      equationX = equationFromRoots(x1, x2, scaleX);
      equationY = equationFromRoots(y1, y2, scaleY);
      break;
    }
    case "compareAlwaysLessRootSets": {
      const x1 = base;
      const x2 = base + gapA;
      const y1 = x2 + separation;
      const y2 = y1 + gapB;
      equationX = equationFromRoots(x1, x2, scaleX);
      equationY = equationFromRoots(y1, y2, scaleY);
      break;
    }
    case "compareGreaterOrEqualRootSets": {
      const boundary = base;
      equationX = equationFromRoots(boundary, boundary + gapB, scaleX);
      equationY = equationFromRoots(boundary - gapA, boundary, scaleY);
      break;
    }
    case "compareLessOrEqualRootSets": {
      const boundary = base;
      equationX = equationFromRoots(boundary - gapA, boundary, scaleX);
      equationY = equationFromRoots(boundary, boundary + gapB, scaleY);
      break;
    }
    case "compareEqualRepeatedRoots":
      equationX = equationFromRoots(base, base, scaleX);
      equationY = equationFromRoots(base, base, scaleY);
      break;
    case "compareOverlappingIndeterminateRootSets": {
      const high = base + gapA + gapB + 2;
      equationX = equationFromRoots(base, high, scaleX);
      equationY = equationFromRoots(base + 1, high - 1, scaleY);
      break;
    }
    case "compareIrrationalConjugateRootSets": {
      const radicands = [2, 3, 5, 6, 7, 10] as const;
      const radicand = radicands[mixSeed(seed, 0x7701) % radicands.length]!;
      const centerY = base;
      const centerGap = 2 * Math.ceil(Math.sqrt(radicand)) + separation;
      const centerX = centerY + centerGap;
      equationX = equationFromConjugates(centerX, radicand, scaleX);
      equationY = equationFromConjugates(centerY, radicand, scaleY);
      break;
    }
  }

  const xRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationX));
  const yRoots = exactRootsFromQuadraticState(solveQuadraticEquation(equationY));
  const canonicalAnswer = compareExactRootSets(xRoots, yRoots);
  if (canonicalAnswer !== variant.expected) {
    throw new Error(
      `${variant.prototypeId}: constructed ${canonicalAnswer}, expected ${variant.expected}`,
    );
  }

  const frame = mixSeed(seed, 0x8801 + variantIndex) % 4;
  return {
    authority: ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    qlId: "ALG-QL-032",
    cpId: "ALG-CP-011",
    packageId: "ALG-002",
    prototypeId: variant.prototypeId,
    solveMode: variant.solveMode,
    variantIndex,
    seed,
    question: buildQuestion(equationX, equationY, frame),
    canonicalAnswer,
    explanation: explanationFor(canonicalAnswer, xRoots, yRoots),
    equationX,
    equationY,
    xRoots,
    yRoots,
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    solverAuthorityFrozen: true,
    learnerContentFrozen: false,
    reviewStatus: "REVIEW_CANDIDATE_ONLY",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

export const ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT = VARIANTS.length;
