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
  readonly state: Readonly<{
    a: number;
    repeatedRoot: number;
    kCoefficient: number;
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
  Array.from({ length: 6 }, (_, index) => index + 1).flatMap((a) =>
    Array.from({ length: 11 }, (_, index) => index - 5)
      .filter((repeatedRoot) => repeatedRoot !== 0)
      .flatMap((repeatedRoot) =>
        Array.from({ length: 6 }, (_, index) => index + 1)
          .filter((kCoefficient) => {
            const numerator = a * repeatedRoot * repeatedRoot;
            const b = -2 * a * repeatedRoot;
            return numerator % kCoefficient === 0
              && numerator / kCoefficient <= 30
              && gcd(gcd(a, Math.abs(b)), kCoefficient) === 1;
          })
          .map((kCoefficient) => ({ a, repeatedRoot, kCoefficient })),
      ),
  ),
);

if (STATES.length < 64) {
  throw new Error(`ALG-CP009 V4 requires at least 64 primitive review states; found ${STATES.length}`);
}

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function ax2(a: number) {
  return a === 1 ? "x²" : `${a}x²`;
}

function signedXTerm(b: number) {
  const magnitude = Math.abs(b);
  const body = magnitude === 1 ? "x" : `${magnitude}x`;
  return `${b < 0 ? "-" : "+"} ${body}`;
}

function kTerm(kCoefficient: number) {
  return kCoefficient === 1 ? "k" : `${kCoefficient}k`;
}

function equationText(a: number, b: number, kCoefficient: number) {
  return `${ax2(a)} ${signedXTerm(b)} + ${kTerm(kCoefficient)} = 0`;
}

function questionText(equation: string, frame: number) {
  switch (frame % 4) {
    case 0:
      return `For what value of k does ${equation} have equal roots?`;
    case 1:
      return `Find k if the quadratic ${equation} has a repeated root.`;
    case 2:
      return `Determine k so that ${equation} has two equal real roots.`;
    default:
      return `If ${equation} has equal roots, calculate the value of k.`;
  }
}

export function generateAlgCp009EnglishReviewV4(seed: number): AlgCp009EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP009 V4 review requires an integer seed");

  const state = STATES[positiveMod(seed - 1, STATES.length)]!;
  const { a, repeatedRoot, kCoefficient } = state;
  const b = -2 * a * repeatedRoot;
  const parameterValue = (a * repeatedRoot * repeatedRoot) / kCoefficient;
  const constant = kCoefficient * parameterValue;

  if (!Number.isInteger(parameterValue)) {
    throw new Error("ALG-CP009 V4 parameter construction must stay integral");
  }

  const equation: QuadraticEquation = {
    a: rational(a),
    b: rational(b),
    c: rational(constant),
  };
  const discriminant = quadraticDiscriminant(equation);
  const solved = solveQuadraticEquation(equation);

  if (discriminant.numerator !== 0n || solved.kind !== "REPEATED_ROOT") {
    throw new Error("ALG-CP009 V4 equal-root construction failed");
  }

  const discriminantCoefficient = 4 * a * kCoefficient;
  const bSquared = b * b;
  const visibleEquation = equationText(a, b, kCoefficient);

  return {
    authority: ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-009",
    packageId: "ALG-002",
    qlId: "ALG-QL-026",
    prototypeId: "ALG-CP009-CAND-005",
    seed,
    question: questionText(visibleEquation, seed - 1),
    equation,
    parameterValue,
    answerText: String(parameterValue),
    explanation: [
      "For equal roots, the discriminant must be zero: D = b² - 4ac = 0.",
      `Here a = ${a}, b = ${b}, and c = ${kTerm(kCoefficient)}, so (${b})² - 4(${a})(${kTerm(kCoefficient)}) = 0.`,
      `This gives ${bSquared} - ${discriminantCoefficient}k = 0, hence ${discriminantCoefficient}k = ${bSquared}.`,
      `Therefore k = ${bSquared}/${discriminantCoefficient} = ${parameterValue}.`,
      `Substituting this value gives the repeated root x = ${formatRational(solved.root)}, which confirms the equal-root condition.`,
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
