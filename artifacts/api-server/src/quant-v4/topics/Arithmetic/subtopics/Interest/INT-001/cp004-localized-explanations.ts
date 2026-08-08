import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_EXPLANATION_EDITORIAL_VERSION,
  localizeCp004ExplanationEditorialV2,
} from "./cp004-localized-explanations-v2";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXPLANATION_VERSION = INT_CP004_LOCALIZED_EXPLANATION_EDITORIAL_VERSION;

export function localizeCp004Explanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  return localizeCp004ExplanationEditorialV2(source, locale);
}
