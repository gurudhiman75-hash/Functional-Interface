import {
  divideRational,
  formatRational,
  negateRational,
  type Rational,
} from "../../../../../shared/algebra";
import { generateAlgCp013DiscoveryItem } from "../ALG-002/ALG-CP-013";
import type { AlgCp013DiscoveryItem } from "../ALG-002/ALG-CP-013/types";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP013-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp013ReviewV4PrototypeId =
  | "ALG-CP013-CAND-004"
  | "ALG-CP013-CAND-007";

export interface AlgCp013EnglishReviewV4Item {
  readonly authority: typeof ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-013";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-037" | "ALG-QL-038";
  readonly prototypeId: AlgCp013ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly answer: AlgCp013DiscoveryItem["answer"];
  readonly answerText: string;
  readonly explanation: string;
  readonly math: AlgCp013DiscoveryItem["math"];
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

function integer(value: Rational): number {
  if (value.denominator !== 1n) {
    throw new Error("ALG-CP013 V4 review expects integral source coefficients");
  }
  return Number(value.numerator);
}

function linearText(aValue: Rational, bValue: Rational) {
  const a = integer(aValue);
  const b = integer(bValue);
  const xPart = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b === 0) return xPart;
  return `${xPart} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

function negativeRhsExplanation(base: AlgCp013DiscoveryItem) {
  if (base.math.kind !== "ABS_EQUATION") {
    throw new Error("CAND-004 must retain an absolute-equation state");
  }
  const rhs = formatRational(base.math.rhs);
  const inside = linearText(base.math.a, base.math.b);
  return [
    `The left side is |${inside}|. An absolute value is always at least 0.`,
    `Here the right side is ${rhs}, which is negative.`,
    `Even if ${inside} = 0, the left side would be 0, not ${rhs}; for every other x the absolute value is positive.`,
    `Therefore no real value of x can satisfy the equation, so ${base.answer.text.toLowerCase()}.`,
  ].join(" ");
}

function zeroBoundaryExplanation(base: AlgCp013DiscoveryItem) {
  if (base.math.kind !== "ABS_INEQUALITY") {
    throw new Error("CAND-007 must retain an absolute-inequality state");
  }
  const inside = linearText(base.math.a, base.math.b);
  const root = divideRational(negateRational(base.math.b), base.math.a);

  if (base.math.operator === "GE") {
    return [
      `The expression is |${inside}|, and every absolute value is non-negative.`,
      `The inside becomes 0 at x = ${formatRational(root)}, so the absolute value is exactly 0 there.`,
      "Because the inequality allows equality (≥ 0), that value is included; at every other real x the absolute value is positive.",
      `Hence every real x satisfies the inequality, giving ${base.answer.text}.`,
    ].join(" ");
  }

  if (base.math.operator !== "GT") {
    throw new Error("CAND-007 zero-boundary review expects > or ≥");
  }

  return [
    `For |${inside}| > 0, the absolute value must be non-zero.`,
    `It becomes 0 only when the inside expression is 0: ${inside} = 0.`,
    `Solving this linear equation gives x = ${formatRational(root)}.`,
    `So every real value except x = ${formatRational(root)} satisfies the strict inequality. Therefore the solution is ${base.answer.text}.`,
  ].join(" ");
}

export function generateAlgCp013EnglishReviewV4(
  prototypeId: AlgCp013ReviewV4PrototypeId,
  seed: number,
): AlgCp013EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP013 V4 review requires an integer seed");

  const base = generateAlgCp013DiscoveryItem(prototypeId, seed);
  const explanation = prototypeId === "ALG-CP013-CAND-004"
    ? negativeRhsExplanation(base)
    : zeroBoundaryExplanation(base);

  return {
    authority: ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-013",
    packageId: "ALG-002",
    qlId: prototypeId === "ALG-CP013-CAND-004" ? "ALG-QL-037" : "ALG-QL-038",
    prototypeId,
    seed,
    question: base.stem,
    answer: base.answer,
    answerText: base.answer.text,
    explanation,
    math: base.math,
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

export const ALG_CP013_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP013-CAND-004",
  "ALG-CP013-CAND-007",
] as const);
