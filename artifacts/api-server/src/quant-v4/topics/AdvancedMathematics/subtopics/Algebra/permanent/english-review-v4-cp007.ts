import {
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  solveLinearSystem2V,
  type LinearSystem2V,
} from "../../../../../shared/algebra";
import { generateAlgCp007DiscoveryItem } from "../ALG-002/ALG-CP-007";
import type { AlgCp007DiscoveryItem } from "../ALG-002/ALG-CP-007/types";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP007-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp007ReviewV4PrototypeId =
  | "ALG-CP007-CAND-005"
  | "ALG-CP007-CAND-006";

export interface AlgCp007EnglishReviewV4Item {
  readonly authority: typeof ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-007";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-022";
  readonly prototypeId: AlgCp007ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly system: LinearSystem2V;
  readonly answer: AlgCp007DiscoveryItem["answer"];
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

function ratioText(numerator: Parameters<typeof divideRational>[0], denominator: Parameters<typeof divideRational>[1]) {
  return formatRational(divideRational(numerator, denominator));
}

function noSolutionExplanation(system: LinearSystem2V) {
  const xRatio = divideRational(system.a2, system.a1);
  const yRatio = divideRational(system.b2, system.b1);
  if (!equalsRational(xRatio, yRatio)) {
    throw new Error("CP-007 CAND-005 expected proportional x/y coefficients");
  }
  const expectedSecondConstant = multiplyRational(xRatio, system.c1);
  if (equalsRational(expectedSecondConstant, system.c2)) {
    throw new Error("CP-007 CAND-005 expected a mismatched constant");
  }

  return [
    "Compare the second equation with the first instead of solving the system directly.",
    `For x, ${formatRational(system.a2)} = ${formatRational(xRatio)} × ${formatRational(system.a1)}; for y, ${formatRational(system.b2)} = ${formatRational(yRatio)} × ${formatRational(system.b1)}.`,
    `So both variable coefficients use the same multiplier ${formatRational(xRatio)}.`,
    `If the equations represented the same line, the second constant would also have to be ${formatRational(xRatio)} × ${formatRational(system.c1)} = ${formatRational(expectedSecondConstant)}.`,
    `The actual second constant is ${formatRational(system.c2)}, not ${formatRational(expectedSecondConstant)}.`,
    "Therefore the two lines are parallel but distinct, and the system has no solution.",
  ].join(" ");
}

function infiniteSolutionExplanation(system: LinearSystem2V) {
  const xRatio = divideRational(system.a2, system.a1);
  const yRatio = divideRational(system.b2, system.b1);
  if (!equalsRational(xRatio, yRatio)) {
    throw new Error("CP-007 CAND-006 expected proportional x/y coefficients");
  }
  const expectedSecondConstant = multiplyRational(xRatio, system.c1);
  if (!equalsRational(expectedSecondConstant, system.c2)) {
    throw new Error("CP-007 CAND-006 expected the same constant ratio");
  }

  return [
    "Compare the coefficients and constant of the second equation with the first.",
    `For x, ${formatRational(system.a2)} = ${formatRational(xRatio)} × ${formatRational(system.a1)}; for y, ${formatRational(system.b2)} = ${formatRational(yRatio)} × ${formatRational(system.b1)}.`,
    `The constant follows the same multiplier: ${formatRational(system.c2)} = ${formatRational(xRatio)} × ${formatRational(system.c1)}.`,
    `So every term of the second equation is exactly ${formatRational(xRatio)} times the corresponding term of the first equation.`,
    "Both equations represent the same line, so every point on that line satisfies both equations. Therefore the system has infinitely many solutions.",
  ].join(" ");
}

export function generateAlgCp007EnglishReviewV4(
  prototypeId: AlgCp007ReviewV4PrototypeId,
  seed: number,
): AlgCp007EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP007 V4 review requires an integer seed");
  const base = generateAlgCp007DiscoveryItem(prototypeId, seed);
  if ("d1" in base.system) {
    throw new Error("ALG-CP007 V4 review expected a 2x2 system");
  }
  const system: LinearSystem2V = base.system;
  const solved = solveLinearSystem2V(system);

  if (prototypeId === "ALG-CP007-CAND-005" && solved.kind !== "NO_SOLUTION") {
    throw new Error("ALG-CP007 CAND-005 baseline did not retain NO_SOLUTION semantics");
  }
  if (prototypeId === "ALG-CP007-CAND-006" && solved.kind !== "INFINITE_SOLUTIONS") {
    throw new Error("ALG-CP007 CAND-006 baseline did not retain INFINITE_SOLUTIONS semantics");
  }

  const answerText = prototypeId === "ALG-CP007-CAND-005"
    ? "No solution"
    : "Infinitely many solutions";

  return {
    authority: ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-007",
    packageId: "ALG-002",
    qlId: "ALG-QL-022",
    prototypeId,
    seed,
    question: base.stem,
    system,
    answer: base.answer,
    answerText,
    explanation: prototypeId === "ALG-CP007-CAND-005"
      ? noSolutionExplanation(system)
      : infiniteSolutionExplanation(system),
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

export const ALG_CP007_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP007-CAND-005",
  "ALG-CP007-CAND-006",
] as const);
