import { createHash } from "node:crypto";

import type { RnkCp007LocalizedLocale } from "./cp007-localization-review-v1";
import {
  buildRnkCp007LocalizedReviewBankV3,
  type RnkCp007LocalizedReviewQuestionV3,
} from "./cp007-localization-review-v3";

export const RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION =
  "RNK_CP007_HI_PA_LOCALIZATION_REVIEW_V4" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V4_AUTHORITY =
  "RNK_CP007_HI_PA_NATIVE_EDITORIAL_REVIEW_V4" as const;
export const RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL =
  "NATIVE_BATCH_GENITIVE_REPAIR_V4" as const;

export type RnkCp007LocalizedReviewQuestionV4 = Omit<
  RnkCp007LocalizedReviewQuestionV3,
  "stem" | "explanation" | "reviewMetadata" | "localizationProof"
> & {
  readonly stem: string;
  readonly explanation: string;
  readonly reviewMetadata: Omit<RnkCp007LocalizedReviewQuestionV3["reviewMetadata"], "localization"> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION;
      locale: RnkCp007LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp007LocalizedReviewQuestionV3["localizationProof"],
    "authority" | "localizationFingerprint" | "editorialVersion"
  > & {
    readonly authority: typeof RNK_CP007_LOCALIZATION_REVIEW_V4_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

/**
 * Direct inspection of the retained V3 artifact found a mechanical compound
 * label in the morning/evening batch partition. V4 is intentionally narrow:
 * it inserts the native genitive inside those batch labels in both the stem
 * and explanation, and changes no mathematical/category semantics.
 */
export function repairRnkCp007NativeBatchGenitives(
  value: string,
  locale: RnkCp007LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    return value
      .replaceAll("सुबह बैच", "सुबह के बैच")
      .replaceAll("शाम बैच", "शाम के बैच");
  }
  return value
    .replaceAll("ਸਵੇਰ ਬੈਚ", "ਸਵੇਰ ਦੇ ਬੈਚ")
    .replaceAll("ਸ਼ਾਮ ਬੈਚ", "ਸ਼ਾਮ ਦੇ ਬੈਚ");
}

export function localizeRnkCp007V3QuestionToV4(
  question: RnkCp007LocalizedReviewQuestionV3,
): RnkCp007LocalizedReviewQuestionV4 {
  const stem = repairRnkCp007NativeBatchGenitives(question.stem, question.locale);
  const explanation = repairRnkCp007NativeBatchGenitives(
    question.explanation,
    question.locale,
  );
  const localizationFingerprint = sha256({
    version: RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION,
    canonicalItemId: question.localizationProof.canonicalItemId,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem,
    explanation,
  });

  return {
    ...question,
    stem,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP007_LOCALIZATION_REVIEW_V4_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP007_LOCALIZATION_REVIEW_V4_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP007_LOCALIZATION_REVIEW_V4_EDITORIAL,
    },
  };
}

export function buildRnkCp007LocalizedReviewBankV4(
  locale: RnkCp007LocalizedLocale,
): readonly RnkCp007LocalizedReviewQuestionV4[] {
  return buildRnkCp007LocalizedReviewBankV3(locale).map(localizeRnkCp007V3QuestionToV4);
}

export function buildRnkCp007MultilingualReviewCandidateV4(): Readonly<{
  hindi: readonly RnkCp007LocalizedReviewQuestionV4[];
  punjabi: readonly RnkCp007LocalizedReviewQuestionV4[];
}> {
  return {
    hindi: buildRnkCp007LocalizedReviewBankV4("hi-IN"),
    punjabi: buildRnkCp007LocalizedReviewBankV4("pa-IN"),
  };
}
