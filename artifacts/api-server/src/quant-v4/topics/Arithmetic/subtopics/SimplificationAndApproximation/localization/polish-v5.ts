import { applySapLocalizationPolishV6 } from "./polish-v6";
import type { SapTranslationLanguage } from "./types";

const PROTECTED_MATH = /\\\([\s\S]*?\\\)/gu;
const SHORT_LATIN = /\b[A-Za-z]{1,2}\b/gu;
const LEXICAL_SLASH_HI = /[\u0900-\u097F]+\s*\/\s*[\u0900-\u097F]+/u;
const LEXICAL_SLASH_PA = /[\u0A00-\u0A7F]+\s*\/\s*[\u0A00-\u0A7F]+/u;
const TARGET_POSSESSIVE = /[\u0900-\u097F\u0A00-\u0A7F]+'s\b/u;
const TRANSLITERATION_ARTIFACT = /(?:सटउड|स्टउड|ਟਉਡ|ਸਟਉਡ|टएरम|ਟਏਰਮ|ओपएरअशन|ਓਪਏਰਅਸ਼ਨ|फरअकशन|ਫਰਅਕਸ਼ਨ)/u;

const ALLOWED_SHORT_LATIN = new Set([
  "A", "B", "C", "D", "E", "I", "II", "III", "IV",
  "x", "y", "m", "n", "k",
]);

function maskMath(value: string) {
  return value.replace(PROTECTED_MATH, " ");
}

function normalizeMathFragment(value: string) {
  return value
    .replace(/\\text\{[^}]*\}/gu, "\\text{…}")
    .replace(/\s+/gu, " ")
    .replace(/\\\(\s*/gu, "\\(")
    .replace(/\s*\\\)/gu, "\\)")
    .trim();
}

function mathFragments(value: string) {
  return [...value.matchAll(PROTECTED_MATH)].map((match) => normalizeMathFragment(match[0]));
}

function optionMathIsPreserved(pkg: any) {
  const canonical = Array.isArray(pkg.traceability?.canonicalEnglishOptions)
    ? pkg.traceability.canonicalEnglishOptions.map(String)
    : [];
  if (canonical.length !== pkg.options.length) return false;
  return canonical.every((option: string, index: number) =>
    JSON.stringify(mathFragments(option)) === JSON.stringify(mathFragments(String(pkg.options[index] ?? ""))),
  );
}

function naturalnessErrors(pkg: any, language: SapTranslationLanguage) {
  const errors: string[] = [];
  const learnerText = [
    String(pkg.stem ?? ""),
    ...(pkg.options ?? []).map(String),
    ...(pkg.explanation?.lines ?? []).map(String),
  ].join("\n");
  const prose = maskMath(learnerText);

  const shortLatin = [...new Set(prose.match(SHORT_LATIN) ?? [])]
    .filter((token) => !ALLOWED_SHORT_LATIN.has(token));
  if (shortLatin.length) {
    errors.push(`Residual short English learner tokens: ${shortLatin.join(", ")}`);
  }

  const lexicalSlash = language === "hi" ? LEXICAL_SLASH_HI : LEXICAL_SLASH_PA;
  if (lexicalSlash.test(prose)) errors.push("Slash-gloss vocabulary remains in learner text.");
  if (TARGET_POSSESSIVE.test(prose)) errors.push("English possessive suffix remains attached to localized learner text.");
  if (TRANSLITERATION_ARTIFACT.test(prose)) errors.push("Known letter-by-letter transliteration artifact remains in learner text.");

  if (language === "hi") {
    if (/\b(?:it|at|on|No|no|do|Do|up)\b/u.test(prose)) errors.push("Known English connector remains in Hindi learner text.");
    if (/(?:है नहीं|हैं नहीं)/u.test(prose)) errors.push("Unnatural Hindi negative word order remains.");
  } else {
    if (/\b(?:it|at|on|No|no|do|Do|up)\b/u.test(prose)) errors.push("Known English connector remains in Punjabi learner text.");
    if (/(?:ਹੈ ਨਹੀਂ|ਹਨ ਨਹੀਂ)/u.test(prose)) errors.push("Unnatural Punjabi negative word order remains.");
  }

  const optionMathPreserved = optionMathIsPreserved(pkg);
  if (!optionMathPreserved) errors.push("Localized option math fragments drifted from canonical English options.");
  return { errors, optionMathPreserved };
}

export function applySapLocalizationPolishV5(pkg: any, language: SapTranslationLanguage) {
  const base = applySapLocalizationPolishV6(pkg, language);
  const naturalness = naturalnessErrors(base, language);
  if (naturalness.errors.length > 0) {
    throw new Error(
      `${String(base.questionLanguageId ?? "SAP-QL-UNKNOWN")}/${language}: ${naturalness.errors.join(" | ")}`,
    );
  }
  const inheritedLocalizationErrors = Array.isArray(base.localizationValidation?.errors)
    ? base.localizationValidation.errors.map(String)
    : [];
  const inheritedValidationErrors = Array.isArray(base.validation?.errors)
    ? base.validation.errors.map(String)
    : [];
  const localizationErrors = [...inheritedLocalizationErrors];
  const validationErrors = [...inheritedValidationErrors];

  return Object.freeze({
    ...base,
    localizationValidation: Object.freeze({
      ...(base.localizationValidation ?? {}),
      ok: Boolean(base.localizationValidation?.ok),
      errors: Object.freeze(localizationErrors),
      naturalnessOk: true,
      optionMathPreserved: naturalness.optionMathPreserved,
    }),
    validation: Object.freeze({
      ...(base.validation ?? {}),
      ok: Boolean(base.validation?.ok),
      errors: Object.freeze(validationErrors),
    }),
    traceability: Object.freeze({
      ...(base.traceability ?? {}),
      localizationEditorialPolish: "SAP-HI-PA-EDITORIAL-POLISH-V6+V5-GATE",
    }),
  });
}
