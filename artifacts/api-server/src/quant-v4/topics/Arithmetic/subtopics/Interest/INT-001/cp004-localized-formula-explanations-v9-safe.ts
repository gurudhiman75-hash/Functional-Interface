import { buildCp004LocalizedFormulaExplanationV9 } from "./cp004-localized-formula-explanations-v9";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_FORMULA_EXPLANATION_V9_SAFE_VERSION =
  "INT-CP-004-HI-PA-FORMULA-COMPLETE-LOCALE-SAFE-v9" as const;

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;

function localeSafeCalculationStep(
  locale: IntCp004LocalizedLocale,
  source: string,
): string {
  let text = source;
  if (locale === "pa-IN") {
    text = text
      .replace(/इसलिए/gu, "ਇਸ ਲਈ")
      .replace(/अतः/gu, "ਇਸ ਲਈ")
      .replace(/कुल वृद्धि-कारक/gu, "ਕੁੱਲ ਵਾਧਾ-ਕਾਰਕ")
      .replace(/प्राप्त राशि/gu, "ਮਿਲੀ ਰਕਮ")
      .replace(/प्रश्न की राशि से मिलती है/gu, "ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ");
  }

  const expectedScript = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
  if (expectedScript.test(text)) return text;

  return locale === "hi-IN"
    ? `गणना: ${text}`
    : `ਗਣਨਾ: ${text}`;
}

function completeSteps(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  steps: readonly string[],
): readonly string[] {
  const localized = steps.map((step) => localeSafeCalculationStep(locale, step));
  if (source.qlId !== "INT-QL-076") return Object.freeze(localized);
  if (source.solution.denominator !== 1n) {
    throw new Error(`${source.qlId}/${source.seed}: v9 effective rate must be integer.`);
  }
  const effective = source.solution.numerator;
  const amountOnHundred = 100n + effective;
  return Object.freeze([
    ...localized.slice(0, -1),
    locale === "hi-IN"
      ? `वृद्धि = ₹${amountOnHundred} − ₹100 = ₹${effective}।`
      : `ਵਾਧਾ = ₹${amountOnHundred} − ₹100 = ₹${effective}।`,
    locale === "hi-IN"
      ? `प्रभावी वार्षिक दर = ${effective}/100 × 100 = ${effective}%।`
      : `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = ${effective}/100 × 100 = ${effective}%।`,
  ]);
}

function cleanRuntimeFinalAnswer(
  locale: IntCp004LocalizedLocale,
  text: string,
): string {
  const answer = locale === "hi-IN"
    ? text.replace(/^अंतिम उत्तर:\s*/u, "")
    : text.replace(/^ਅੰਤਿਮ ਉੱਤਰ:\s*/u, "");
  return locale === "hi-IN"
    ? `उत्तर: ${answer}`
    : `ਉੱਤਰ: ${answer}`;
}

function cleanCommonMistake(
  locale: IntCp004LocalizedLocale,
  text: string,
): string {
  return locale === "hi-IN"
    ? text.replace(/^ध्यान रखें:\s*/u, "")
    : text.replace(/^ਧਿਆਨ ਰੱਖੋ:\s*/u, "");
}

export function buildCp004LocalizedFormulaExplanationV9Safe(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  correctAnswer: string,
): IntCp004LocalizedExplanation {
  const explanation = buildCp004LocalizedFormulaExplanationV9(
    source,
    locale,
    correctAnswer,
  );

  return Object.freeze({
    ...explanation,
    steps: completeSteps(source, locale, explanation.steps),
    finalAnswer: cleanRuntimeFinalAnswer(locale, explanation.finalAnswer),
    commonMistake: cleanCommonMistake(locale, explanation.commonMistake),
  });
}
