import {
  formatRational,
  rational,
  type Rational,
} from "../../../../../shared/algebra";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP002-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp002ReviewV4PrototypeId =
  | "ALG-CP002-CAND-003"
  | "ALG-CP002-CAND-006"
  | "ALG-CP002-CAND-007";

type AlgCp002ReviewMode =
  | "RECIPROCAL_SQUARE_PLUS"
  | "RECIPROCAL_SQUARE_MINUS"
  | "RECIPROCAL_CUBE_MINUS";

export interface AlgCp002EnglishReviewV4Item {
  readonly authority: typeof ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-002";
  readonly packageId: "ALG-001";
  readonly qlId: "ALG-QL-007" | "ALG-QL-008";
  readonly prototypeId: AlgCp002ReviewV4PrototypeId;
  readonly mode: AlgCp002ReviewMode;
  readonly seed: number;
  readonly k: number;
  readonly question: string;
  readonly canonicalAnswer: Rational;
  readonly answerText: string;
  readonly explanation: string;
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

const PLUS_K_POOL = Object.freeze([
  -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2,
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const);

const MINUS_K_POOL = Object.freeze([
  -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
  0,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const);

function mixSeed(seed: number, salt: number): number {
  let x = (seed ^ salt) | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function balancedPoolPick<T>(pool: readonly T[], seed: number, salt: number): T {
  const raw = Math.imul(seed | 0, 13) + salt;
  const index = ((raw % pool.length) + pool.length) % pool.length;
  return pool[index]!;
}

function stemFor(mode: AlgCp002ReviewMode, k: number, frame: number): string {
  const given = mode === "RECIPROCAL_SQUARE_PLUS"
    ? `x + 1/x = ${k}`
    : `x - 1/x = ${k}`;
  const target = mode === "RECIPROCAL_CUBE_MINUS"
    ? "x³ - 1/x³"
    : "x² + 1/x²";

  switch (frame % 4) {
    case 0:
      return `If ${given}, find ${target}.`;
    case 1:
      return `Given ${given}, what is the value of ${target}?`;
    case 2:
      return `For x ≠ 0, ${given}. Determine ${target}.`;
    default:
      return `If x satisfies ${given}, calculate ${target}.`;
  }
}

function explanationFor(mode: AlgCp002ReviewMode, k: number, answer: Rational): string {
  if (mode === "RECIPROCAL_SQUARE_PLUS") {
    return [
      `We are given x + 1/x = ${k}.`,
      "Square both sides: (x + 1/x)² = x² + 2 + 1/x².",
      `So x² + 1/x² = ${k}² - 2 = ${k * k} - 2.`,
      `Therefore x² + 1/x² = ${formatRational(answer)}.`,
    ].join(" ");
  }
  if (mode === "RECIPROCAL_SQUARE_MINUS") {
    return [
      `We are given x - 1/x = ${k}.`,
      "Square both sides: (x - 1/x)² = x² - 2 + 1/x².",
      `Hence x² + 1/x² = ${k}² + 2 = ${k * k} + 2.`,
      `Therefore x² + 1/x² = ${formatRational(answer)}.`,
    ].join(" ");
  }
  return [
    `We are given x - 1/x = ${k}.`,
    "Use (x - 1/x)³ = x³ - 1/x³ - 3(x - 1/x).",
    `Rearranging gives x³ - 1/x³ = ${k}³ + 3(${k}).`,
    `Thus x³ - 1/x³ = ${k * k * k} + ${3 * k} = ${formatRational(answer)}.`,
  ].join(" ");
}

function modeFor(prototypeId: AlgCp002ReviewV4PrototypeId): AlgCp002ReviewMode {
  if (prototypeId === "ALG-CP002-CAND-003") return "RECIPROCAL_SQUARE_PLUS";
  if (prototypeId === "ALG-CP002-CAND-006") return "RECIPROCAL_SQUARE_MINUS";
  return "RECIPROCAL_CUBE_MINUS";
}

export function generateAlgCp002EnglishReviewV4(
  prototypeId: AlgCp002ReviewV4PrototypeId,
  seed: number,
): AlgCp002EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP002 V4 review requires an integer seed");
  const mode = modeFor(prototypeId);
  const pool = mode === "RECIPROCAL_SQUARE_PLUS" ? PLUS_K_POOL : MINUS_K_POOL;
  const salt = prototypeId === "ALG-CP002-CAND-003" ? 3 : prototypeId === "ALG-CP002-CAND-006" ? 6 : 7;
  const k = balancedPoolPick(pool, seed, salt);
  const frame = mixSeed(seed, 0x2000 + salt) % 4;

  let value: number;
  if (mode === "RECIPROCAL_SQUARE_PLUS") value = k * k - 2;
  else if (mode === "RECIPROCAL_SQUARE_MINUS") value = k * k + 2;
  else value = k * k * k + 3 * k;

  const canonicalAnswer = rational(BigInt(value));

  return {
    authority: ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-002",
    packageId: "ALG-001",
    qlId: prototypeId === "ALG-CP002-CAND-007" ? "ALG-QL-008" : "ALG-QL-007",
    prototypeId,
    mode,
    seed,
    k,
    question: stemFor(mode, k, frame),
    canonicalAnswer,
    answerText: formatRational(canonicalAnswer),
    explanation: explanationFor(mode, k, canonicalAnswer),
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

export const ALG_CP002_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP002-CAND-003",
  "ALG-CP002-CAND-006",
  "ALG-CP002-CAND-007",
] as const);
