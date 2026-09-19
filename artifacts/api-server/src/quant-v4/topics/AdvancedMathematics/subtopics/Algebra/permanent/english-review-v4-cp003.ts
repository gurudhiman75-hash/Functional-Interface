import {
  addRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP003-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp003ReviewV4PrototypeId =
  | "ALG-CP003-CAND-004"
  | "ALG-CP003-CAND-006";

export interface AlgCp003EnglishReviewV4Item {
  readonly authority: typeof ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-003";
  readonly packageId: "ALG-001";
  readonly qlId: "ALG-QL-011" | "ALG-QL-013";
  readonly prototypeId: AlgCp003ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly canonicalAnswer: Rational;
  readonly answerText: string;
  readonly explanation: string;
  readonly state:
    | Readonly<{
        kind: "ZERO_SUM_PAIRWISE";
        squareSum: number;
      }>
    | Readonly<{
        kind: "CYCLIC_RECIPROCAL";
        q: number;
        squareCoefficient: number;
        witnessA: Rational;
        witnessB: Rational;
        witnessC: Rational;
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

function mixSeed(seed: number, salt: number): number {
  let x = (seed ^ salt) | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

const ZERO_SUM_SQUARE_SUM_POOL = Object.freeze((() => {
  const states = new Set<number>();
  for (let a = -10; a <= 10; a += 1) {
    if (a === 0) continue;
    for (let b = -10; b <= 10; b += 1) {
      if (b === 0) continue;
      const c = -(a + b);
      const squareSum = a * a + b * b + c * c;
      if (squareSum >= 14 && squareSum <= 300) states.add(squareSum);
    }
  }
  return [...states].sort((left, right) => left - right);
})());

const CYCLIC_Q_POOL = Object.freeze([
  -20, -19, -18, -17, -16, -15, -14, -13, -12, -11,
  -10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const);

function zeroSumQuestion(squareSum: number, frame: number) {
  switch (frame % 4) {
    case 0:
      return `Given that a + b + c = 0 and a² + b² + c² = ${squareSum}, find ab + bc + ca.`;
    case 1:
      return `If a + b + c = 0 while a² + b² + c² = ${squareSum}, what is the value of ab + bc + ca?`;
    case 2:
      return `For a + b + c = 0 and a² + b² + c² = ${squareSum}, determine ab + bc + ca.`;
    default:
      return `The variables a, b and c satisfy a + b + c = 0 and a² + b² + c² = ${squareSum}. Calculate ab + bc + ca.`;
  }
}

function zeroSumExplanation(squareSum: number, answer: Rational) {
  return [
    "Use the identity (a + b + c)² = a² + b² + c² + 2(ab + bc + ca).",
    "Here a + b + c = 0, so the left side is 0² = 0.",
    `Substituting a² + b² + c² = ${squareSum} gives 0 = ${squareSum} + 2(ab + bc + ca).`,
    `Move ${squareSum} to the other side: 2(ab + bc + ca) = -${squareSum}.`,
    `Dividing by 2 gives ab + bc + ca = -${squareSum}/2 = ${formatRational(answer)}.`,
  ].join(" ");
}

function cyclicQuestion(q: number, frame: number) {
  const coefficient = q * q;
  switch (frame % 4) {
    case 0:
      return `If a + ${coefficient}/b = ${q} and b + ${coefficient}/c = ${q}, find c + ${coefficient}/a.`;
    case 1:
      return `Given a + ${coefficient}/b = ${q} and b + ${coefficient}/c = ${q}, determine the value of c + ${coefficient}/a.`;
    case 2:
      return `The relations a + ${coefficient}/b = ${q} and b + ${coefficient}/c = ${q} hold. What is c + ${coefficient}/a?`;
    default:
      return `For non-zero a, b and c, a + ${coefficient}/b = ${q} and b + ${coefficient}/c = ${q}. Calculate c + ${coefficient}/a.`;
  }
}

function cyclicExplanation(q: number, answer: Rational) {
  const coefficient = q * q;
  return [
    `From a + ${coefficient}/b = ${q}, we get b = ${coefficient}/(${q} - a).`,
    `Substitute this in b + ${coefficient}/c = ${q}. Then ${coefficient}/c = ${q} - ${coefficient}/(${q} - a) = -${q}a/(${q} - a).`,
    `So c = ${q} - ${coefficient}/a, and therefore c + ${coefficient}/a = ${formatRational(answer)}.`,
  ].join(" ");
}

function cyclicWitness(seed: number, q: number) {
  const magnitude = 1 + (mixSeed(seed, 0x3c03) % 6);
  const offset = q > 0 ? magnitude : -magnitude;
  const a = rational(BigInt(q + offset));
  const qR = rational(BigInt(q));
  const qSquared = multiplyRational(qR, qR);
  const b = divideRational(qSquared, subtractRational(qR, a));
  const c = divideRational(qSquared, subtractRational(qR, b));
  const target = addRational(c, divideRational(qSquared, a));
  if (!equalsRational(target, qR)) {
    throw new Error("ALG-CP003 V4 cyclic witness failed exact verification");
  }
  return { a, b, c, qSquared, target };
}

export function generateAlgCp003EnglishReviewV4(
  prototypeId: AlgCp003ReviewV4PrototypeId,
  seed: number,
): AlgCp003EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP003 V4 review requires an integer seed");
  const frame = mixSeed(seed, prototypeId === "ALG-CP003-CAND-004" ? 0x4004 : 0x6006) % 4;

  if (prototypeId === "ALG-CP003-CAND-004") {
    const squareSum = ZERO_SUM_SQUARE_SUM_POOL[
      mixSeed(seed, 0x4411) % ZERO_SUM_SQUARE_SUM_POOL.length
    ]!;
    const answer = divideRational(rational(BigInt(-squareSum)), rational(2n));
    return {
      authority: ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY,
      sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
      cpId: "ALG-CP-003",
      packageId: "ALG-001",
      qlId: "ALG-QL-011",
      prototypeId,
      seed,
      question: zeroSumQuestion(squareSum, frame),
      canonicalAnswer: answer,
      answerText: formatRational(answer),
      explanation: zeroSumExplanation(squareSum, answer),
      state: { kind: "ZERO_SUM_PAIRWISE", squareSum },
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

  const q = CYCLIC_Q_POOL[mixSeed(seed, 0x6613) % CYCLIC_Q_POOL.length]!;
  const witness = cyclicWitness(seed, q);
  return {
    authority: ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-003",
    packageId: "ALG-001",
    qlId: "ALG-QL-013",
    prototypeId,
    seed,
    question: cyclicQuestion(q, frame),
    canonicalAnswer: witness.target,
    answerText: formatRational(witness.target),
    explanation: cyclicExplanation(q, witness.target),
    state: {
      kind: "CYCLIC_RECIPROCAL",
      q,
      squareCoefficient: q * q,
      witnessA: witness.a,
      witnessB: witness.b,
      witnessC: witness.c,
    },
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

export const ALG_CP003_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP003-CAND-004",
  "ALG-CP003-CAND-006",
] as const);
