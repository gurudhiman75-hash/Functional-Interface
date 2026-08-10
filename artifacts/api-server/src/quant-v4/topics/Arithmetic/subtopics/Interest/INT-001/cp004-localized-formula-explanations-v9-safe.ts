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
    steps: Object.freeze(
      explanation.steps.map((step) => localeSafeCalculationStep(locale, step)),
    ),
  });
}
