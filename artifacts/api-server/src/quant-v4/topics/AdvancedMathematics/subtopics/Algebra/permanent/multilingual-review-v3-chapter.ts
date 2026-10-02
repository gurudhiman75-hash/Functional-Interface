import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentMultilingualV2Frozen,
} from "./multilingual-freeze-v2";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import { localizeAlgLearnerTextV2Draft } from "./multilingual-review-v2";
import {
  generateAlgPermanentEnglishV4ChapterReview,
  isAlgEnglishV4TargetPrototype,
} from "./english-review-v4-chapter";

export const ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY =
  "ALG-ML-v3-chapter-review-candidate" as const;

function localeToLanguage(locale: AlgReviewLocale) {
  return locale === "hi-IN" ? "hi" as const : "pa" as const;
}

export function generateAlgPermanentMultilingualV3ChapterReview(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
) {
  const baseline = generateAlgPermanentMultilingualV2Frozen(
    qlId,
    seed,
    locale,
    requestedVariantIndex,
  );
  const english = generateAlgPermanentEnglishV4ChapterReview(
    qlId,
    seed,
    requestedVariantIndex,
  );

  if (!isAlgEnglishV4TargetPrototype(english.prototypeId)) {
    return Object.freeze({
      ...baseline,
      chapterReviewAuthority: ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
      chapterReviewSource: "V2_FROZEN_UNCHANGED" as const,
      chapterReviewCandidate: false as const,
    });
  }

  const question = localizeAlgLearnerTextV2Draft(english.question, locale);
  const explanation = english.explanation
    .split(/\n+/)
    .map((line) => localizeAlgLearnerTextV2Draft(line, locale))
    .join("\n");

  if (!question.trim() || !explanation.trim()) {
    throw new Error(`${english.prototypeId}/${locale}: V3 multilingual draft localization is empty`);
  }

  return Object.freeze({
    ...baseline,
    question,
    explanation,
    englishQuestion: english.question,
    englishExplanation: english.explanation,
    canonicalAnswer: english.canonicalAnswer,
    language: localeToLanguage(locale),
    locale,
    chapterReviewAuthority: ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
    chapterReviewSource: "V4_ENGLISH_TO_V3_MULTILINGUAL_DRAFT" as const,
    chapterReviewCandidate: true as const,
    localizedLearnerContentFrozen: false as const,
    multilingualImplementationFrozen: false as const,
    maturity: "MULTILINGUAL_V3_CHAPTER_REVIEW_CANDIDATE" as const,
    reviewStatus: "HUMAN_LOCALIZATION_REVIEW_REQUIRED" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}
