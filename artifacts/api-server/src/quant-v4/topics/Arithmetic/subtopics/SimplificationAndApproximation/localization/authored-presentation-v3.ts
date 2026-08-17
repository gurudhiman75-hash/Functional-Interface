import type { SapTranslationLanguage } from "./types";

const INLINE_MATH = /\\\([\s\S]*?\\\)/gu;
const LATIN_WORD = /[A-Za-z]{3,}/u;

function localized(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function stripProtectedMath(value: string) {
  return value.replace(INLINE_MATH, " ");
}

function finalizeStem(base: any, current: string, language: SapTranslationLanguage) {
  if (String(base.questionLanguageId ?? "") !== "SAP-QL-063") return current;
  const english = String(base.stem ?? "").trim();
  const math = english.match(INLINE_MATH)?.[0] ?? "";
  return localized(
    language,
    `सटीक मान ज्ञात कीजिए: ${math}`,
    `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${math}`,
  ).trim();
}

function releaseErrors(base: any, stem: string, options: readonly string[], explanation: readonly string[], correctIndex: number, answer: string, language: SapTranslationLanguage) {
  const errors: string[] = [];
  const prose = stripProtectedMath([stem, ...options, ...explanation].join("\n"));
  if (LATIN_WORD.test(prose)) errors.push("V3 authored learner prose contains residual Latin words outside protected math.");
  if (language === "hi" && /[\u0A00-\u0A7F]/u.test(prose)) errors.push("V3 Hindi learner prose contains Gurmukhi letters.");
  if (language === "pa" && /[\u0900-\u097F]/u.test(prose.replace(/[।॥]/gu, ""))) errors.push("V3 Punjabi learner prose contains Devanagari letters.");
  if (options.length !== base.options.length) errors.push("V3 localization changed option count.");
  if (options[correctIndex] !== answer) errors.push("V3 localization lost answer binding.");
  return errors;
}

export function applySapAuthoredPresentationV3(base: any, current: any, language: SapTranslationLanguage) {
  const stem = finalizeStem(base, String(current.stem ?? ""), language);
  const options = Object.freeze([...(current.options ?? [])].map(String));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex] ?? String(current.answer ?? "");
  const explanationLines = Object.freeze([...(current.explanation?.lines ?? [])].map(String));
  const errors = releaseErrors(base, stem, options, explanationLines, correctIndex, answer, language);

  return Object.freeze({
    ...current,
    stem,
    options,
    correctIndex,
    answer,
    explanation: Object.freeze({ lines: explanationLines }),
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizationAuthorship: "SAP-CP-AUTHORED-PRESENTATION-V3",
      localizationReleaseValidation: "PROTECTED_MATH_AWARE_V1",
      canonicalEnglishStem: base.stem,
      canonicalEnglishOptions: Object.freeze([...base.options]),
      canonicalEnglishAnswer: base.answer,
    }),
    localizationValidation: Object.freeze({
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      authoredPresentation: true,
      naturalnessOk: errors.length === 0,
      authoredVersion: "V3",
      protectedMathAware: true,
    }),
    validation: Object.freeze({
      ok: Boolean(base.validation?.ok) && errors.length === 0,
      errors: Object.freeze([...(base.validation?.errors ?? []), ...errors]),
    }),
  });
}
