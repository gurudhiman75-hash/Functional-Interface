import {
  asInteger,
  type Cp004AnswerSemantic,
  type Cp004MathematicalState,
  type Rational,
} from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { assertCp004LocalizedText } from "./cp004-localization-language-pack";
import {
  cp004EditorialAnswerText,
  cp004EditorialFeedback,
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
  if (semantic === "DURATION" && state.qlId !== "INT-QL-072" && asInteger(value) === 0) {
    return locale === "hi-IN" ? "0 वर्ष" : "0 ਸਾਲ";
  }
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
  return Object.freeze(source.options.map((option) => {
    const text = localizedCp004AnswerText(
      locale,
      source.answerSemantic,
      source.mathematicalState,
      option.value,
    );
    const feedback = localizedCp004Feedback(locale, option.misconceptionId);
    assertCp004LocalizedText(locale, feedback, `${source.qlId}/${source.seed}/${option.id}/editorial-v2-feedback`);
    return Object.freeze({ ...option, text, feedback });
  }));
}
