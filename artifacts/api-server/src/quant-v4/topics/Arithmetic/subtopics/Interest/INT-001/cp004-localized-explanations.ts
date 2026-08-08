import type { Cp004Frequency } from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FrequencyIntervalText,
} from "./cp004-localization-language-pack";
import {
  INT_CP004_LOCALIZED_EXPLANATION_EDITORIAL_VERSION,
  localizeCp004ExplanationEditorialV2,
} from "./cp004-localized-explanations-v2";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXPLANATION_VERSION = INT_CP004_LOCALIZED_EXPLANATION_EDITORIAL_VERSION;

function formulaRateReplacement(numeratorText: string, denominatorText: string): string {
  const numerator = BigInt(numeratorText);
  const denominator = BigInt(denominatorText);
  let remainder = denominator;
  while (remainder % 2n === 0n) remainder /= 2n;
  while (remainder % 5n === 0n) remainder /= 5n;
  if (remainder === 1n) {
    return `${Number(numerator) / Number(denominator)}/100`;
  }
  return `(${numeratorText}/${denominatorText})/100`;
}

function polishFormulaFractions(text: string): string {
  return text.replace(
    /\b(\d+)\/(\d+)\/100\b/gu,
    (_match, numerator: string, denominator: string) => formulaRateReplacement(numerator, denominator),
  );
}

function exactPeriodRatePhrase(
  locale: IntCp004LocalizedLocale,
  frequency: Cp004Frequency,
): string {
  const interval = cp004FrequencyIntervalText(locale, frequency);
  return locale === "hi-IN" ? `${interval} की दर` : `${interval} ਦੀ ਦਰ`;
}

function polishStep(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  step: string,
  index: number,
): string {
  let polished = polishFormulaFractions(step);
  const generic = locale === "hi-IN" ? "प्रति अवधि दर" : "ਹਰ ਮਿਆਦ ਦੀ ਦਰ";

  if (source.qlId === "INT-QL-077" && index === 1) {
    polished = polished.replace(generic, exactPeriodRatePhrase(locale, source.mathematicalState.frequency));
  }
  if ((source.qlId === "INT-QL-084" || source.qlId === "INT-QL-085") && index === 0) {
    polished = polished.replace(generic, exactPeriodRatePhrase(locale, source.mathematicalState.firstFrequency));
  }
  if ((source.qlId === "INT-QL-084" || source.qlId === "INT-QL-085") && index === 1) {
    polished = polished.replace(generic, exactPeriodRatePhrase(locale, source.mathematicalState.secondFrequency));
  }

  return polished;
}

export function localizeCp004Explanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const base = localizeCp004ExplanationEditorialV2(source, locale);
  const explanation: IntCp004LocalizedExplanation = Object.freeze({
    whatAsked: base.whatAsked,
    steps: Object.freeze(base.steps.map((step, index) => polishStep(source, locale, step, index))),
    finalAnswer: base.finalAnswer,
    commonMistake: base.commonMistake,
  });

  for (const [index, step] of explanation.steps.entries()) {
    assertCp004LocalizedText(locale, step, `${source.qlId}/${source.seed}/${locale}/polished-step-${index + 1}`);
  }
  return explanation;
}
