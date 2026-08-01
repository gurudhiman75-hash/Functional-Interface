import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import {
  generateClsCp005EnglishQuestion,
  type GeneratedClsCp005EnglishQuestion,
} from "./cp005-english-runtime";
import {
  localizeClsCp005Question,
  type GeneratedClsCp005LocalizedQuestion,
} from "./localization/cp005-localizer";
import type { ClsCp005Locale } from "./localization/cp005-language-pack";

export type GeneratedClsCp005PermanentQuestion =
  | GeneratedClsCp005EnglishQuestion
  | GeneratedClsCp005LocalizedQuestion;

export function generateClsCp005Question(
  qlId: ClsCp005EnglishQlId,
  locale: ClsCp005Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp005PermanentQuestion {
  const english = generateClsCp005EnglishQuestion(qlId, seed, requestedOptionCount);
  return locale === "en-IN" ? english : localizeClsCp005Question(english, locale);
}

export function generateClsCp005OddTupleMultilingualQuestion(
  locale: ClsCp005Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp005Question(
    CLS_CP005_ODD_TUPLE_QL_ID,
    locale,
    seed,
    requestedOptionCount,
  );
}

export function generateClsCp005EquivalentTupleMultilingualQuestion(
  locale: ClsCp005Locale = "en-IN",
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp005Question(
    CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
    locale,
    seed,
    requestedOptionCount,
  );
}
