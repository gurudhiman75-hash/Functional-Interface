import {
  formatRational,
  rational,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP012-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp012ReviewV4PrototypeId =
  | "ALG-CP012-CAND-011"
  | "ALG-CP012-CAND-012";

export interface AlgCp012EnglishReviewV4Item {
  readonly authority: typeof ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-012";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-043";
  readonly prototypeId: AlgCp012ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly answerText: string;
  readonly canonicalAnswer: Rational;
  readonly balancedVariable: Rational;
  readonly explanation: string;
  readonly state: Readonly<{
    sum: number;
    target: "RECIPROCAL_SUM" | "SQUARE_SUM";
  }>;
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

const FIXED_SUM_POOL = Object.freeze(
  Array.from({ length: 36 }, (_, index) => index + 6),
);

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function reciprocalQuestion(sum: number, frame: number) {
  switch (frame % 4) {
    case 0:
      return `If x, y and z are positive real numbers with x + y + z = ${sum}, find the least value of 1/x + 1/y + 1/z.`;
    case 1:
      return `For positive real numbers x, y and z satisfying x + y + z = ${sum}, what is the minimum value of 1/x + 1/y + 1/z?`;
    case 2:
      return `Given x, y, z > 0 and x + y + z = ${sum}, determine the least possible value of 1/x + 1/y + 1/z.`;
    default:
      return `The positive real numbers x, y and z have sum ${sum}. Find the minimum possible value of 1/x + 1/y + 1/z.`;
  }
}

function squareQuestion(sum: number, frame: number) {
  switch (frame % 4) {
    case 0:
      return `If x, y and z are positive real numbers with x + y + z = ${sum}, find the minimum value of x² + y² + z².`;
    case 1:
      return `For positive real numbers x, y and z satisfying x + y + z = ${sum}, what is the least possible value of x² + y² + z²?`;
    case 2:
      return `Given x, y, z > 0 and x + y + z = ${sum}, determine the minimum of x² + y² + z².`;
    default:
      return `The positive real numbers x, y and z have sum ${sum}. Find the least possible value of x² + y² + z².`;
  }
}

export function generateAlgCp012EnglishReviewV4(
  prototypeId: AlgCp012ReviewV4PrototypeId,
  seed: number,
): AlgCp012EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP012 V4 review requires an integer seed");
  const sum = FIXED_SUM_POOL[positiveMod(seed - 1, FIXED_SUM_POOL.length)]!;
  const balancedVariable = rational(BigInt(sum), 3n);
  const frame = positiveMod(seed - 1, 4);

  if (prototypeId === "ALG-CP012-CAND-011") {
    const canonicalAnswer = rational(9n, BigInt(sum));
    return {
      authority: ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY,
      sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
      cpId: "ALG-CP-012",
      packageId: "ALG-002",
      qlId: "ALG-QL-043",
      prototypeId,
      seed,
      question: reciprocalQuestion(sum, frame),
      answerText: formatRational(canonicalAnswer),
      canonicalAnswer,
      balancedVariable,
      explanation: [
        "For positive x, y and z, use the Cauchy inequality:",
        "(x + y + z)(1/x + 1/y + 1/z) ≥ (1 + 1 + 1)² = 9.",
        `Since x + y + z = ${sum}, we get 1/x + 1/y + 1/z ≥ 9/${sum} = ${formatRational(canonicalAnswer)}.`,
        `Equality occurs when x = y = z = ${formatRational(balancedVariable)}, so this lower bound is attainable.`,
        `Therefore the least value is ${formatRational(canonicalAnswer)}.`,
      ].join(" "),
      state: { sum, target: "RECIPROCAL_SUM" },
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

  const canonicalAnswer = rational(BigInt(sum * sum), 3n);
  return {
    authority: ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-012",
    packageId: "ALG-002",
    qlId: "ALG-QL-043",
    prototypeId,
    seed,
    question: squareQuestion(sum, frame),
    answerText: formatRational(canonicalAnswer),
    canonicalAnswer,
    balancedVariable,
    explanation: [
      "Use the Cauchy inequality (x + y + z)² ≤ 3(x² + y² + z²).",
      `With x + y + z = ${sum}, this gives x² + y² + z² ≥ ${sum * sum}/3 = ${formatRational(canonicalAnswer)}.`,
      `Equality occurs when x = y = z = ${formatRational(balancedVariable)}.`,
      `Therefore the minimum value is ${formatRational(canonicalAnswer)}.`,
    ].join(" "),
    state: { sum, target: "SQUARE_SUM" },
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

export const ALG_CP012_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP012-CAND-011",
  "ALG-CP012-CAND-012",
] as const);
