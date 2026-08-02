import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import {
  generateClsCp006EnglishQuestion,
  type GeneratedClsCp006EnglishQuestion,
} from "./cp006-english-runtime";
import {
  localizeClsCp006Question,
  type GeneratedClsCp006LocalizedQuestion,
} from "./localization/cp006-localizer";
import type { ClsCp006Locale } from "./localization/cp006-language-pack";

export type GeneratedClsCp006PermanentQuestion =
  | GeneratedClsCp006EnglishQuestion
  | GeneratedClsCp006LocalizedQuestion;

export function generateClsCp006Question(
  qlId: ClsCp006EnglishQlId,
  locale: ClsCp006Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp006PermanentQuestion {
  if (locale !== "en-IN" && locale !== "hi-IN" && locale !== "pa-IN") {
    throw new Error(`Unsupported CLS-CP-006 locale: ${String(locale)}`);
  }
  const english = generateClsCp006EnglishQuestion(qlId, seed, requestedOptionCount);
  return locale === "en-IN" ? english : localizeClsCp006Question(english, locale);
}

export function generateClsCp006OddLetterMultilingualQuestion(
  locale: ClsCp006Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp006Question(
    CLS_CP006_ODD_LETTER_QL_ID,
    locale,
    seed,
    requestedOptionCount,
  );
}

export function generateClsCp006OddLetterPairMultilingualQuestion(
  locale: ClsCp006Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp006Question(
    CLS_CP006_ODD_LETTER_PAIR_QL_ID,
    locale,
    seed,
    requestedOptionCount,
  );
}
