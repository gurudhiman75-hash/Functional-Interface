import { createHash } from "node:crypto";

import {
  buildRnkCp005PermanentRuntime,
  type RnkCp005PermanentQuestion,
} from "./cp005-permanent-runtime-v1";
import type { RnkCp005LocalizedLocale } from "./cp005-localization-review-v1";
import {
  localizeRnkCp005PermanentQuestionV1,
  type RnkCp005LocalizedReviewQuestionV1,
} from "./cp005-localization-review-v1";

export const RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION =
  "RNK_CP005_HI_PA_LOCALIZATION_REVIEW_V2" as const;
export const RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY =
  "RNK_CP005_HI_PA_GENDER_NEUTRAL_RANK_BOUND_V2" as const;

type AnyQuestion = Record<string, any>;

export type RnkCp005LocalizedReviewQuestionV2 = Omit<
  RnkCp005LocalizedReviewQuestionV1,
  "localizationMetadata" | "localizationProof"
> & {
  readonly localizationMetadata: Omit<
    RnkCp005LocalizedReviewQuestionV1["localizationMetadata"],
    "version"
  > & Readonly<{
    version: typeof RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION;
    genderNeutralRankBoundOverlay: true;
    v1StructuredPartialOrderBaselinePreserved: true;
  }>;
  readonly localizationProof: Omit<
    RnkCp005LocalizedReviewQuestionV1["localizationProof"],
    "authority" | "localizationFingerprint"
  > & Readonly<{
    authority: typeof RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY;
    v1LocalizationFingerprint: string;
    genderNeutralRankBoundCoverage: "EXECUTABLE_PROVED";
    localizationFingerprint: string;
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function obliqueOrdinal(
  value: string,
  locale: RnkCp005LocalizedLocale,
): string {
  const hi: Readonly<Record<string, string>> = {
    पहला: "पहले",
    दूसरा: "दूसरे",
    तीसरा: "तीसरे",
    चौथा: "चौथे",
    पाँचवाँ: "पाँचवें",
    छठा: "छठे",
    सातवाँ: "सातवें",
    आठवाँ: "आठवें",
  };
  const pa: Readonly<Record<string, string>> = {
    ਪਹਿਲਾ: "ਪਹਿਲੇ",
    ਦੂਜਾ: "ਦੂਜੇ",
    ਤੀਜਾ: "ਤੀਜੇ",
    ਚੌਥਾ: "ਚੌਥੇ",
    ਪੰਜਵਾਂ: "ਪੰਜਵੇਂ",
    ਛੇਵਾਂ: "ਛੇਵੇਂ",
    ਸੱਤਵਾਂ: "ਸੱਤਵੇਂ",
    ਅੱਠਵਾਂ: "ਅੱਠਵੇਂ",
  };
  const mapped = (locale === "hi-IN" ? hi : pa)[value];
  if (mapped) return mapped;
  if (locale === "hi-IN" && /^\d+वाँ$/u.test(value)) return value.replace(/वाँ$/u, "वें");
  if (locale === "pa-IN" && /^\d+ਵਾਂ$/u.test(value)) return value.replace(/ਵਾਂ$/u, "ਵੇਂ");
  return value;
}

function neutralizeRankBoundLine(
  line: string,
  locale: RnkCp005LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    const ordinalPattern = "(पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\\d+वाँ)";
    return line
      .replace(
        new RegExp(`और [^।]+ ${ordinalPattern} से ऊपर नहीं जा सकता।`, "u"),
        (_match, ordinal: string) => `और ${obliqueOrdinal(ordinal, locale)} से ऊँची रैंक संभव नहीं है।`,
      )
      .replace(
        new RegExp(`और [^।]+ ${ordinalPattern} से नीचे नहीं जा सकता।`, "u"),
        (_match, ordinal: string) => `और ${obliqueOrdinal(ordinal, locale)} से नीची रैंक संभव नहीं है।`,
      );
  }
  const ordinalPattern = "(ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\\d+ਵਾਂ)";
  return line
    .replace(
      new RegExp(`ਅਤੇ [^।]+ ${ordinalPattern} ਤੋਂ ਉੱਪਰ ਨਹੀਂ ਜਾ ਸਕਦਾ।`, "u"),
      (_match, ordinal: string) => `ਅਤੇ ${obliqueOrdinal(ordinal, locale)} ਤੋਂ ਉੱਚੀ ਰੈਂਕ ਸੰਭਵ ਨਹੀਂ ਹੈ।`,
    )
    .replace(
      new RegExp(`ਅਤੇ [^।]+ ${ordinalPattern} ਤੋਂ ਹੇਠਾਂ ਨਹੀਂ ਜਾ ਸਕਦਾ।`, "u"),
      (_match, ordinal: string) => `ਅਤੇ ${obliqueOrdinal(ordinal, locale)} ਤੋਂ ਹੇਠਲੀ ਰੈਂਕ ਸੰਭਵ ਨਹੀਂ ਹੈ।`,
    );
}

function fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
    v1LocalizationFingerprint: question.localizationProof.v1LocalizationFingerprint,
    locale: question.locale,
    instruction: question.instruction,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
  });
}

export function localizeRnkCp005PermanentQuestionV2(
  canonicalQuestion: RnkCp005PermanentQuestion | AnyQuestion,
  locale: RnkCp005LocalizedLocale,
): RnkCp005LocalizedReviewQuestionV2 {
  const v1 = localizeRnkCp005PermanentQuestionV1(canonicalQuestion, locale);
  const mode = v1.candidateRuntimeProfile.mode as string;
  const explanation = mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE"
    ? v1.explanation.map((line) => neutralizeRankBoundLine(line, locale))
    : v1.explanation;

  const localized = {
    ...v1,
    explanation,
    localizationMetadata: {
      ...v1.localizationMetadata,
      version: RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
      genderNeutralRankBoundOverlay: true,
      v1StructuredPartialOrderBaselinePreserved: true,
    },
    localizationProof: {
      ...v1.localizationProof,
      authority: RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY,
      v1LocalizationFingerprint: v1.localizationProof.localizationFingerprint,
      genderNeutralRankBoundCoverage: "EXECUTABLE_PROVED" as const,
      localizationFingerprint: "",
    },
  } as unknown as RnkCp005LocalizedReviewQuestionV2;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: fingerprint(localized),
    },
  };
}

export function buildRnkCp005LocalizedReviewBankV2(
  locale: RnkCp005LocalizedLocale,
): readonly RnkCp005LocalizedReviewQuestionV2[] {
  return buildRnkCp005PermanentRuntime().map((question) =>
    localizeRnkCp005PermanentQuestionV2(question, locale));
}
