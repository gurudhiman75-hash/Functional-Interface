import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP004-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp004ReviewV4PrototypeId =
  | "ALG-CP004-CAND-002"
  | "ALG-CP004-CAND-003";

export interface AlgCp004EnglishReviewV4Item {
  readonly authority: typeof ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-004";
  readonly packageId: "ALG-001";
  readonly qlId: "ALG-QL-014";
  readonly prototypeId: AlgCp004ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly answerText: string;
  readonly explanation: string;
  readonly state:
    | Readonly<{ kind: "DIFFERENCE_OF_SQUARES"; m: number; n: number }>
    | Readonly<{ kind: "PERFECT_SQUARE_TRINOMIAL"; m: number; n: number; sign: 1 | -1 }>;
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

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
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

const DIFFERENCE_STATES = Object.freeze(
  Array.from({ length: 7 }, (_, index) => index + 1)
    .flatMap((m) => Array.from({ length: 14 }, (_, index) => index + 2).map((n) => ({ m, n })))
    .filter(({ m, n }) => gcd(m, n) === 1),
);

const PERFECT_SQUARE_STATES = Object.freeze(
  Array.from({ length: 7 }, (_, index) => index + 1)
    .flatMap((m) =>
      Array.from({ length: 15 }, (_, index) => index + 1)
        .filter((n) => gcd(m, n) === 1)
        .flatMap((n) => [
          { m, n, sign: 1 as const },
          { m, n, sign: -1 as const },
        ]),
    ),
);

function balancedIndex(seed: number, size: number, salt: number) {
  return positiveMod(Math.imul(seed | 0, 37) + salt, size);
}

function xTerm(coefficient: number) {
  return coefficient === 1 ? "x" : `${coefficient}x`;
}

function squareTerm(coefficient: number) {
  return coefficient === 1 ? "x²" : `${coefficient}x²`;
}

function signedMiddle(coefficient: number) {
  if (coefficient < 0) return `- ${Math.abs(coefficient)}x`;
  return `+ ${coefficient}x`;
}

function factorText(m: number, n: number, sign: 1 | -1) {
  return `(${xTerm(m)} ${sign < 0 ? "-" : "+"} ${n})`;
}

function expressionFor(item: AlgCp004EnglishReviewV4Item["state"]) {
  if (item.kind === "DIFFERENCE_OF_SQUARES") {
    return `${squareTerm(item.m * item.m)} - ${item.n * item.n}`;
  }
  const middle = 2 * item.sign * item.m * item.n;
  return `${squareTerm(item.m * item.m)} ${signedMiddle(middle)} + ${item.n * item.n}`;
}

function questionFor(expression: string, frame: number) {
  switch (frame % 4) {
    case 0: return `Factorise ${expression}.`;
    case 1: return `Which factorisation is correct for ${expression}?`;
    case 2: return `Write ${expression} in factorised form.`;
    default: return `Factorise the algebraic expression ${expression} completely.`;
  }
}

function differenceExplanation(m: number, n: number, answer: string) {
  const left = xTerm(m);
  return [
    `Recognise ${m * m}x² - ${n * n} as a difference of two squares: (${left})² - ${n}².`,
    "Use A² - B² = (A - B)(A + B).",
    `Taking A = ${left} and B = ${n} gives ${answer}.`,
    "Multiplying the two conjugate factors cancels the middle terms and returns the original expression.",
  ].join(" ");
}

function perfectSquareExplanation(m: number, n: number, sign: 1 | -1, answer: string) {
  const left = xTerm(m);
  const middle = 2 * sign * m * n;
  const signWord = sign > 0 ? "plus" : "minus";
  return [
    `The first term is (${left})² and the last term is ${n}².`,
    `The middle term is ${middle}x, which is ${signWord} 2 × ${left} × ${n}.`,
    `So the trinomial matches A² ${sign > 0 ? "+" : "-"} 2AB + B² = (A ${sign > 0 ? "+" : "-"} B)².`,
    `Therefore the factorised form is ${answer}.`,
  ].join(" ");
}

export function generateAlgCp004EnglishReviewV4(
  prototypeId: AlgCp004ReviewV4PrototypeId,
  seed: number,
): AlgCp004EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP004 V4 review requires an integer seed");
  const frame = positiveMod(seed, 4);

  if (prototypeId === "ALG-CP004-CAND-002") {
    const index = balancedIndex(seed, DIFFERENCE_STATES.length, 2);
    const { m, n } = DIFFERENCE_STATES[index]!;
    const state = { kind: "DIFFERENCE_OF_SQUARES" as const, m, n };
    const answerText = `${factorText(m, n, -1)}${factorText(m, n, 1)}`;
    const expression = expressionFor(state);
    return {
      authority: ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY,
      sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
      cpId: "ALG-CP-004",
      packageId: "ALG-001",
      qlId: "ALG-QL-014",
      prototypeId,
      seed,
      question: questionFor(expression, frame),
      answerText,
      explanation: differenceExplanation(m, n, answerText),
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

  const index = balancedIndex(seed, PERFECT_SQUARE_STATES.length, 3);
  const { m, n, sign } = PERFECT_SQUARE_STATES[index]!;
  const state = { kind: "PERFECT_SQUARE_TRINOMIAL" as const, m, n, sign };
  const factor = factorText(m, n, sign);
  const answerText = `${factor}²`;
  const expression = expressionFor(state);

  return {
    authority: ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-004",
    packageId: "ALG-001",
    qlId: "ALG-QL-014",
    prototypeId,
    seed,
    question: questionFor(expression, frame),
    answerText,
    explanation: perfectSquareExplanation(m, n, sign, answerText),
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

export const ALG_CP004_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP004-CAND-002",
  "ALG-CP004-CAND-003",
] as const);
