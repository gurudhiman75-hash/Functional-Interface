import { createHash } from "node:crypto";

import {
  buildRnkCp005PermanentRuntime,
  type RnkCp005PermanentQuestion,
} from "./cp005-permanent-runtime-v1";
import type { RnkCp005LocalizedLocale } from "./cp005-localization-review-v1";
import {
  localizeRnkCp005PermanentQuestionV2,
  type RnkCp005LocalizedReviewQuestionV2,
} from "./cp005-localization-review-v2";

export const RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION =
  "RNK_CP005_HI_PA_LOCALIZATION_REVIEW_V3" as const;
export const RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY =
  "RNK_CP005_HI_PA_NATIVE_RANK_EXPLANATION_V3" as const;

export const RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL = {
  "RNK-QL-036": [1, 48, 49, 96, 97, 144, 145, 160, 161, 176, 177, 192],
  "RNK-QL-037": [1, 48, 96, 97, 144, 192],
  "RNK-QL-038": [1, 48, 96, 97, 144, 192],
} as const;

type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any>;

export type RnkCp005LocalizedReviewQuestionV3 = Omit<
  RnkCp005LocalizedReviewQuestionV2,
  "localizationMetadata" | "localizationProof"
> & {
  readonly localizationMetadata: Omit<
    RnkCp005LocalizedReviewQuestionV2["localizationMetadata"],
    "version"
  > & Readonly<{
    version: typeof RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION;
    nativeRankExplanationOverlay: true;
    v2GenderNeutralBaselinePreserved: true;
  }>;
  readonly localizationProof: Omit<
    RnkCp005LocalizedReviewQuestionV2["localizationProof"],
    "authority" | "localizationFingerprint"
  > & Readonly<{
    authority: typeof RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY;
    v2LocalizationFingerprint: string;
    nativeRankExplanationCoverage: "EXECUTABLE_PROVED";
    localizationFingerprint: string;
  }>;
};

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function obliqueOrdinal(value: string, locale: RnkCp005LocalizedLocale): string {
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

function ordinalPattern(locale: RnkCp005LocalizedLocale): string {
  return locale === "hi-IN"
    ? "(पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|\\d+वाँ)"
    : "(ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|\\d+ਵਾਂ)";
}

function fixOrdinalGrammar(line: string, locale: RnkCp005LocalizedLocale): string {
  const pattern = ordinalPattern(locale);
  if (locale === "hi-IN") {
    return line
      .replace(
        new RegExp(`की रैंक ${pattern} है`, "gu"),
        (_match, ordinal: string) => `${obliqueOrdinal(ordinal, locale)} स्थान पर है`,
      )
      .replace(
        new RegExp(`${pattern} स्थान पर`, "gu"),
        (_match, ordinal: string) => `${obliqueOrdinal(ordinal, locale)} स्थान पर`,
      );
  }
  return line
    .replace(
      new RegExp(`ਦੀ ਰੈਂਕ ${pattern} ਹੈ`, "gu"),
      (_match, ordinal: string) => `${obliqueOrdinal(ordinal, locale)} ਸਥਾਨ 'ਤੇ ਹੈ`,
    )
    .replace(
      new RegExp(`${pattern} ਸਥਾਨ 'ਤੇ`, "gu"),
      (_match, ordinal: string) => `${obliqueOrdinal(ordinal, locale)} ਸਥਾਨ 'ਤੇ`,
    );
}

function fixExactDefiniteCoordination(
  line: string,
  locale: RnkCp005LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    return line.replace(
      /^(.+?) से ऊपर (.+?) और नीचे (.+?) का रहना तय है।$/u,
      "$1 से ऊपर $2 का रहना तय है; नीचे $3 का रहना तय है।",
    );
  }
  return line.replace(
    /^(.+?) ਤੋਂ ਉੱਪਰ (.+?) ਅਤੇ ਹੇਠਾਂ (.+?) ਦਾ ਰਹਿਣਾ ਤੈਅ ਹੈ।$/u,
    "$1 ਤੋਂ ਉੱਪਰ $2 ਦਾ ਰਹਿਣਾ ਤੈਅ ਹੈ; ਹੇਠਾਂ $3 ਦਾ ਰਹਿਣਾ ਤੈਅ ਹੈ।",
  );
}

function fixQuery(
  stem: string,
  mode: string,
  locale: RnkCp005LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    if (mode === "LOWEST_POSSIBLE") {
      return stem.replace(/का सबसे नीचे का संभव स्थान कौन-सा है\?$/u, "का सबसे निचला संभव स्थान कौन-सा है?");
    }
    if (mode === "EXACT_DEFINITE" || mode === "EXACT_INDETERMINATE") {
      return stem.replace(
        /^दी गई जानकारी से (.+?) की सही रैंक क्या तय होती है\?$/u,
        "दी गई जानकारी के आधार पर $1 की रैंक क्या बनती है?",
      );
    }
    return stem;
  }
  if (mode === "EXACT_DEFINITE" || mode === "EXACT_INDETERMINATE") {
    return stem.replace(
      /^ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਤੋਂ (.+?) ਦੀ ਸਹੀ ਰੈਂਕ ਕੀ ਤੈਅ ਹੁੰਦੀ ਹੈ\?$/u,
      "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ 'ਤੇ $1 ਦੀ ਰੈਂਕ ਕੀ ਬਣਦੀ ਹੈ?",
    );
  }
  return stem;
}

function fixBoundOptionExplanation(
  explanation: string,
  mode: string,
  locale: RnkCp005LocalizedLocale,
): string {
  if (mode !== "HIGHEST_POSSIBLE" && mode !== "LOWEST_POSSIBLE") return explanation;
  if (locale === "hi-IN") {
    if (explanation !== "यह सीमा वाली रैंक है और एक वैध क्रम में मिलती है") return explanation;
    return mode === "HIGHEST_POSSIBLE"
      ? "यही सबसे ऊँची संभव रैंक है और एक वैध क्रम में मिलती है"
      : "यही सबसे नीची संभव रैंक है और एक वैध क्रम में मिलती है";
  }
  if (explanation !== "ਇਹ ਹੱਦ ਵਾਲੀ ਰੈਂਕ ਹੈ ਅਤੇ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਮਿਲਦੀ ਹੈ") return explanation;
  return mode === "HIGHEST_POSSIBLE"
    ? "ਇਹੀ ਸਭ ਤੋਂ ਉੱਚੀ ਸੰਭਵ ਰੈਂਕ ਹੈ ਅਤੇ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਮਿਲਦੀ ਹੈ"
    : "ਇਹੀ ਸਭ ਤੋਂ ਹੇਠਲੀ ਸੰਭਵ ਰੈਂਕ ਹੈ ਅਤੇ ਇੱਕ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਮਿਲਦੀ ਹੈ";
}

function fixExplanationLine(
  line: string,
  mode: string,
  locale: RnkCp005LocalizedLocale,
): string {
  let output = fixOrdinalGrammar(line, locale);
  if (mode === "EXACT_DEFINITE") output = fixExactDefiniteCoordination(output, locale);
  if (mode === "HIGHEST_POSSIBLE" || mode === "LOWEST_POSSIBLE") {
    if (locale === "hi-IN") {
      output = output.replace(
        /इसलिए यही सीमा वास्तव में संभव है।$/u,
        mode === "HIGHEST_POSSIBLE"
          ? "इससे पुष्टि होती है कि यही सबसे ऊँची संभव रैंक है।"
          : "इससे पुष्टि होती है कि यही सबसे नीची संभव रैंक है।",
      );
    } else {
      output = output.replace(
        /ਇਸ ਲਈ ਇਹੀ ਹੱਦ ਅਸਲ ਵਿੱਚ ਸੰਭਵ ਹੈ।$/u,
        mode === "HIGHEST_POSSIBLE"
          ? "ਇਸ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ ਕਿ ਇਹੀ ਸਭ ਤੋਂ ਉੱਚੀ ਸੰਭਵ ਰੈਂਕ ਹੈ।"
          : "ਇਸ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ ਕਿ ਇਹੀ ਸਭ ਤੋਂ ਹੇਠਲੀ ਸੰਭਵ ਰੈਂਕ ਹੈ।",
      );
    }
  }
  return output;
}

function fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
    v2LocalizationFingerprint: question.localizationProof.v2LocalizationFingerprint,
    locale: question.locale,
    instruction: question.instruction,
    clues: question.clues,
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
  });
}

export function localizeRnkCp005PermanentQuestionV3(
  canonicalQuestion: RnkCp005PermanentQuestion | AnyQuestion,
  locale: RnkCp005LocalizedLocale,
): RnkCp005LocalizedReviewQuestionV3 {
  const v2 = localizeRnkCp005PermanentQuestionV2(canonicalQuestion, locale);
  const mode = v2.candidateRuntimeProfile.mode as string;
  const stem = fixQuery(v2.stem, mode, locale);
  const options = v2.options.map((option: AnyOption) => ({
    ...option,
    explanation: fixBoundOptionExplanation(option.explanation, mode, locale),
  }));
  const explanation = v2.explanation.map((line) => fixExplanationLine(line, mode, locale));

  const localized = {
    ...v2,
    stem,
    options,
    explanation,
    localizationMetadata: {
      ...v2.localizationMetadata,
      version: RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
      nativeRankExplanationOverlay: true,
      v2GenderNeutralBaselinePreserved: true,
    },
    localizationProof: {
      ...v2.localizationProof,
      authority: RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY,
      v2LocalizationFingerprint: v2.localizationProof.localizationFingerprint,
      nativeRankExplanationCoverage: "EXECUTABLE_PROVED" as const,
      localizationFingerprint: "",
    },
  } as unknown as RnkCp005LocalizedReviewQuestionV3;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: fingerprint(localized),
    },
  };
}

export function buildRnkCp005LocalizedReviewBankV3(
  locale: RnkCp005LocalizedLocale,
): readonly RnkCp005LocalizedReviewQuestionV3[] {
  return buildRnkCp005PermanentRuntime().map((question) =>
    localizeRnkCp005PermanentQuestionV3(question, locale));
}
