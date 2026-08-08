import type {
  Cp004AnswerSemantic,
  Cp004MathematicalState,
  Rational,
} from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  cp004EditorialAnswerText,
  cp004EditorialFeedback,
  localizeCp004OptionsEditorialV2,
} from "./cp004-localized-editorial-v2";
import type {
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_OPTION_VERSION = "INT-CP-004-HI-PA-OPTIONS-v2" as const;

export function localizedCp004AnswerText(
  locale: IntCp004LocalizedLocale,
  semantic: Cp004AnswerSemantic,
  state: Cp004MathematicalState,
  value: Rational,
): string {
  return cp004EditorialAnswerText(locale, semantic, state, value);
}

export function localizedCp004Feedback(
  locale: IntCp004LocalizedLocale,
  misconceptionId: string,
): string {
  return cp004EditorialFeedback(locale, misconceptionId);
}

export function localizeCp004Options(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  return localizeCp004OptionsEditorialV2(source, locale);
}
