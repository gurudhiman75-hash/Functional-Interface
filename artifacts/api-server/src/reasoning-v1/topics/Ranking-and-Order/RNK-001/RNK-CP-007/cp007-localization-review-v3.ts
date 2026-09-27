import { createHash } from "node:crypto";

import type { RnkCp007LocalizedLocale } from "./cp007-localization-review-v1";
import {
  buildRnkCp007LocalizedReviewBankV2,
  type RnkCp007LocalizedReviewQuestionV2,
} from "./cp007-localization-review-v2";

export const RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION =
  "RNK_CP007_HI_PA_LOCALIZATION_REVIEW_V3" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V3_AUTHORITY =
  "RNK_CP007_HI_PA_NATIVE_EDITORIAL_REVIEW_V3" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL =
  "NATIVE_OBLIQUE_RANK_AND_COUNT_AGREEMENT_V3" as const;

export type RnkCp007LocalizedReviewQuestionV3 = Omit<
  RnkCp007LocalizedReviewQuestionV2,
  "stem" | "reviewMetadata" | "localizationProof"
> & {
  readonly stem: string;
  readonly reviewMetadata: Omit<RnkCp007LocalizedReviewQuestionV2["reviewMetadata"], "localization"> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION;
      locale: RnkCp007LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp007LocalizedReviewQuestionV2["localizationProof"],
    "authority" | "localizationFingerprint" | "editorialVersion"
  > & {
    readonly authority: typeof RNK_CP007_LOCALIZATION_REVIEW_V3_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

/**
 * V2 fixed native oblique/plural inflection and compact-rank grammar.
 * Human review of the retained V2 artifact then exposed one remaining
 * agreement defect for the feminine girls-category count question.
 *
 * Keep this repair intentionally narrow and regression-proved: it changes
 * only interrogative agreement, never mathematical state or category labels.
 */
export function repairRnkCp007NativeCountAgreement(
  stem: string,
  locale: RnkCp007LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    return stem
      .replaceAll("कितने लड़कियाँ", "कितनी लड़कियाँ")
      .replaceAll("लड़कियाँ कितने हैं?", "कितनी लड़कियाँ हैं?");
  }
  return stem
    .replaceAll("ਕਿੰਨੇ ਕੁੜੀਆਂ", "ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ")
    .replaceAll("ਕੁੜੀਆਂ ਕਿੰਨੇ ਹਨ?", "ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ ਹਨ?");
}

export function localizeRnkCp007V2QuestionToV3(
  question: RnkCp007LocalizedReviewQuestionV2,
): RnkCp007LocalizedReviewQuestionV3 {
  const stem = repairRnkCp007NativeCountAgreement(question.stem, question.locale);
  const localizationFingerprint = sha256({
    version: RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION,
    canonicalItemId: question.localizationProof.canonicalItemId,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem,
    explanation: question.explanation,
  });

  return {
    ...question,
    stem,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP007_LOCALIZATION_REVIEW_V3_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP007_LOCALIZATION_REVIEW_V3_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V3_EDITORIAL,
    },
  };
}

export function buildRnkCp007LocalizedReviewBankV3(
  locale: RnkCp007LocalizedLocale,
): readonly RnkCp007LocalizedReviewQuestionV3[] {
  return buildRnkCp007LocalizedReviewBankV2(locale).map(localizeRnkCp007V2QuestionToV3);
}

export function buildRnkCp007MultilingualReviewCandidateV3(): Readonly<{
  hindi: readonly RnkCp007LocalizedReviewQuestionV3[];
  punjabi: readonly RnkCp007LocalizedReviewQuestionV3[];
}> {
  return {
    hindi: buildRnkCp007LocalizedReviewBankV3("hi-IN"),
    punjabi: buildRnkCp007LocalizedReviewBankV3("pa-IN"),
  };
}
