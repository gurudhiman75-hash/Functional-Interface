import type { AlgPermanentQlId } from "./allocation";
import { generateAlgPermanentEnglishV3Frozen } from "./english-freeze-v3";
import {
  ALG_CP002_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp002EnglishReviewV4,
} from "./english-review-v4-cp002";
import {
  ALG_CP003_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp003EnglishReviewV4,
} from "./english-review-v4-cp003";
import {
  ALG_CP004_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp004EnglishReviewV4,
} from "./english-review-v4-cp004";
import {
  ALG_CP007_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp007EnglishReviewV4,
} from "./english-review-v4-cp007";
import {
  ALG_CP008_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp008EnglishReviewV4,
} from "./english-review-v4-cp008";
import { generateAlgCp009EnglishReviewV4 } from "./english-review-v4-cp009";
import {
  ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT,
  generateAlgCp011EnglishReviewV4,
} from "./english-review-v4-cp011";
import {
  ALG_CP012_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp012EnglishReviewV4,
} from "./english-review-v4-cp012";
import {
  ALG_CP013_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp013EnglishReviewV4,
} from "./english-review-v4-cp013";
import {
  ALG_CP014_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp014EnglishReviewV4,
} from "./english-review-v4-cp014";

export const ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY =
  "ALG-EN-v4-chapter-review-candidate" as const;

const TARGETS = new Set<string>([
  ...ALG_CP002_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP003_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP004_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP007_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP008_ENGLISH_REVIEW_V4_TARGETS,
  "ALG-CP009-CAND-005",
  ...Array.from({ length: ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT }, (_unused, index) => `ALG-CP011-CAND-${String(index + 1).padStart(3, "0")}`),
  ...ALG_CP012_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP013_ENGLISH_REVIEW_V4_TARGETS,
  ...ALG_CP014_ENGLISH_REVIEW_V4_TARGETS,
]);

export const ALG_ENGLISH_V4_CHAPTER_TARGET_COUNT = TARGETS.size;

function v4Candidate(prototypeId: string, seed: number, variantIndex?: number): any {
  if ((ALG_CP002_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp002EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP003_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp003EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP004_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp004EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP007_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp007EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP008_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp008EnglishReviewV4(prototypeId as any, seed);
  }
  if (prototypeId === "ALG-CP009-CAND-005") {
    return generateAlgCp009EnglishReviewV4(seed);
  }
  if (/^ALG-CP011-CAND-00[1-7]$/.test(prototypeId)) {
    const index = variantIndex ?? Number(prototypeId.slice(-3)) - 1;
    return generateAlgCp011EnglishReviewV4(seed, index);
  }
  if ((ALG_CP012_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp012EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP013_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp013EnglishReviewV4(prototypeId as any, seed);
  }
  if ((ALG_CP014_ENGLISH_REVIEW_V4_TARGETS as readonly string[]).includes(prototypeId)) {
    return generateAlgCp014EnglishReviewV4(prototypeId as any, seed);
  }
  return null;
}

export function generateAlgPermanentEnglishV4ChapterReview(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
) {
  const baseline = generateAlgPermanentEnglishV3Frozen(qlId, seed, requestedVariantIndex);
  const candidate = v4Candidate(baseline.prototypeId, seed, requestedVariantIndex);

  if (!candidate) {
    return Object.freeze({
      ...baseline,
      chapterReviewAuthority: ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY,
      chapterReviewSource: "V3_FROZEN_UNCHANGED" as const,
      chapterReviewCandidate: false as const,
    });
  }

  if (candidate.prototypeId !== baseline.prototypeId) {
    throw new Error(`${qlId}: V4 chapter candidate prototype drifted from V3 baseline`);
  }
  if (candidate.qlId !== qlId) {
    throw new Error(`${baseline.prototypeId}: V4 chapter candidate QL drifted (${candidate.qlId} != ${qlId})`);
  }
  if (
    candidate.active
    || candidate.questionStudioDiscoverable
    || candidate.questionBankWritable
    || candidate.testEligible
    || candidate.publiclyPublishable
  ) {
    throw new Error(`${baseline.prototypeId}: V4 chapter candidate crossed review-only lifecycle boundary`);
  }

  return Object.freeze({
    ...baseline,
    question: candidate.question,
    explanation: candidate.explanation,
    chapterReviewAuthority: ALG_ENGLISH_V4_CHAPTER_REVIEW_AUTHORITY,
    chapterReviewSource: "V4_CONTROLLED_REOPEN" as const,
    chapterReviewCandidate: true as const,
    v4ReviewAuthority: candidate.authority,
    v4AnswerText: candidate.answerText ?? null,
    v4RawCandidate: candidate,
    learnerContentFrozen: false as const,
    englishImplementationFrozen: false as const,
    maturity: "ENGLISH_V4_CHAPTER_REVIEW_CANDIDATE" as const,
    reviewStatus: "CHAPTER_V4_REVIEW_REQUIRED" as const,
  });
}

export function isAlgEnglishV4TargetPrototype(prototypeId: string) {
  return TARGETS.has(prototypeId);
}
