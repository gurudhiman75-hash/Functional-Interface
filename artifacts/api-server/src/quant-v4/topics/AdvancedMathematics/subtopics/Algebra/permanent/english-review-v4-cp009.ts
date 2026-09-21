import {
  formatRational,
  quadraticDiscriminant,
  rational,
  solveQuadraticEquation,
  type QuadraticEquation,
} from "../../../../../shared/algebra";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP009-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export interface AlgCp009EnglishReviewV4Item {
  readonly authority: typeof ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-009";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-026";
  readonly prototypeId: "ALG-CP009-CAND-005";
  readonly seed: number;
  readonly question: string;
  readonly equation: QuadraticEquation;
  readonly parameterValue: number;
  readonly answerText: string;
  readonly explanation: string;
  readonly state: Readonly<{ m: number; n: number }>;
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

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

const STATES = Object.freeze(
  Array.from({ length: 7 }, (_, i) => i + 1).flatMap((m) =>
    Array.from({ length: 30 }, (_, i) => i - 15)
      .filter((n) => n !== 0 && gcd(m, n) === 1)
      .map((n) => ({ m, n })),
  ),
);

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function ax2(a: number) {
  return a === 1 ? "x²" : `${a}x²`;
}

function bx(b: number) {
  if (b === 0) return "";
  const abs = Math.abs(b);
  const body = abs === 1 ? "x" : `${abs}x`;
  return `${b < 0 ? "-" : "+"} ${body}`;
}

function questionText(a: number, b: number, frame: number) {
  const equation = `${ax2(a)} ${bx(b)} + k = 0`.replace(/\s+/g, " ").trim();
  switch (frame % 4) {
    case 0: return `For what value of k does ${equation} have equal roots?`;
    case 1: return `Find k if ${equation} has a repeated root.`;
    case 2: return `Determine the value of k for which the quadratic ${equation} has equal roots.`;
    default: return `If ${equation} has two equal real roots, calculate k.`;
  }
}

export function generateAlgCp009EnglishReviewV4(seed: number): AlgCp009EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP009 V4 review requires an integer seed");
  const state = STATES[positiveMod(seed - 1, STATES.length)]!;
  const a = state.m * state.m;
  const b = 2 * state.m * state.n;
  const k = state.n * state.n;
  const equation: QuadraticEquation = { a: rational(a), b: rational(b), c: rational(k) };
  const discriminant = quadraticDiscriminant(equation);
  const solved = solveQuadraticEquation(equation);
  if (discriminant.numerator !== 0n || solved.kind !== "REPEATED_ROOT") {
    throw new Error("ALG-CP009 V4 equal-root construction failed");
  }

  return {
    authority: ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-009",
    packageId: "ALG-002",
    qlId: "ALG-QL-026",
    prototypeId: "ALG-CP009-CAND-005",
    seed,
    question: questionText(a, b, seed),
    equation,
    parameterValue: k,
    answerText: String(k),
    explanation: [
      "Equal roots require the discriminant to be zero: D = b² - 4ac = 0.",
      `Here a = ${a}, b = ${b}, and c = k, so (${b})² - 4(${a})(k) = 0.`,
      `Thus ${b * b} - ${4 * a}k = 0, giving ${4 * a}k = ${b * b}.`,
      `Therefore k = ${b * b}/${4 * a} = ${k}.`,
      `With this value the repeated root is x = ${formatRational(solved.root)}, confirming that the roots are equal.`,
    ].join(" "),
    state,
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
