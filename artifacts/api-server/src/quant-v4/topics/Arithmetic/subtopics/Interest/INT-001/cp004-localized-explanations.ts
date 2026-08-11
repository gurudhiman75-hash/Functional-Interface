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

function replaceGenericPeriodRate(
  text: string,
  locale: IntCp004LocalizedLocale,
  frequency: Cp004Frequency,
): string {
  const exact = exactPeriodRatePhrase(locale, frequency);
  if (locale === "hi-IN") {
    return text
      .replaceAll("हर अवधि की दर", exact)
      .replaceAll("प्रति अवधि दर", exact);
  }
  return text.replaceAll("ਹਰ ਮਿਆਦ ਦੀ ਦਰ", exact);
}

function polishNaturalTeachingLanguage(
  text: string,
  locale: IntCp004LocalizedLocale,
): string {
  if (locale === "hi-IN") {
    return text
      .replaceAll(
        "अज्ञात मूलधन को अनुपात में पहले से रखकर हल को गोल-गोल सिद्ध न करें।",
        "उत्तर को पहले से मानकर उसी से मूलधन सिद्ध न करें।",
      )
      .replaceAll(
        "अंतिम राशि से कोई गोल राशि सीधे न घटाएँ; दोनों गुणकों से भाग दें।",
        "अंतिम राशि से कोई मनमानी राशि न घटाएँ; दोनों चरणों के संयुक्त गुणक से भाग दें।",
      )
      .replaceAll(
        "उसे दोबारा वार्षिक संख्या से न बाँटें।",
        "उसे वर्ष में ब्याज जोड़ने की संख्या से फिर न बाँटें।",
      )
      .replaceAll("हमें सीधे दी गई", "हमें प्रश्न में दी गई");
  }
  return text
    .replaceAll(
      "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਰੱਖ ਕੇ ਹੱਲ ਨੂੰ ਗੋਲ-ਗੋਲ ਸਾਬਤ ਨਾ ਕਰੋ।",
      "ਉੱਤਰ ਨੂੰ ਪਹਿਲਾਂ ਹੀ ਮੰਨ ਕੇ ਉਸੇ ਨਾਲ ਮੂਲਧਨ ਸਾਬਤ ਨਾ ਕਰੋ।",
    )
    .replaceAll(
      "ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਕੋਈ ਗੋਲ ਰਕਮ ਸਿੱਧੀ ਨਾ ਘਟਾਓ; ਦੋਵਾਂ ਗੁਣਕਾਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
      "ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਕੋਈ ਮਨਮਾਨੀ ਰਕਮ ਨਾ ਘਟਾਓ; ਦੋਵਾਂ ਪੜਾਵਾਂ ਦੇ ਸਾਂਝੇ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ।",
    )
    .replaceAll(
      "ਇਸ ਨੂੰ ਮੁੜ ਸਾਲਾਨਾ ਗਿਣਤੀ ਨਾਲ ਨਾ ਵੰਡੋ।",
      "ਇਸ ਨੂੰ ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮੁੜ ਨਾ ਵੰਡੋ।",
    )
    .replaceAll("ਸਾਨੂੰ ਸਿੱਧੀ ਦਿੱਤੀ", "ਸਾਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ");
}

function polishStep(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  step: string,
  index: number,
): string {
  let polished = polishNaturalTeachingLanguage(polishFormulaFractions(step), locale);

  if (source.qlId === "INT-QL-073" || source.qlId === "INT-QL-074") {
    polished = replaceGenericPeriodRate(polished, locale, source.mathematicalState.frequency);
  }
  if (source.qlId === "INT-QL-077" && index === 1) {
    polished = replaceGenericPeriodRate(polished, locale, source.mathematicalState.frequency);
  }
  if ((source.qlId === "INT-QL-084" || source.qlId === "INT-QL-085") && index === 0) {
    polished = replaceGenericPeriodRate(polished, locale, source.mathematicalState.firstFrequency);
  }
  if ((source.qlId === "INT-QL-084" || source.qlId === "INT-QL-085") && index === 1) {
    polished = replaceGenericPeriodRate(polished, locale, source.mathematicalState.secondFrequency);
  }

  return polished;
}

function polishNarrativeField(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  text: string,
): string {
  let polished = polishNaturalTeachingLanguage(polishFormulaFractions(text), locale);
  if (source.qlId === "INT-QL-073" || source.qlId === "INT-QL-074") {
    polished = replaceGenericPeriodRate(polished, locale, source.mathematicalState.frequency);
  }
  return polished;
}

export function localizeCp004Explanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const base = localizeCp004ExplanationEditorialV2(source, locale);
  const explanation: IntCp004LocalizedExplanation = Object.freeze({
    whatAsked: polishNarrativeField(source, locale, base.whatAsked),
    steps: Object.freeze(base.steps.map((step, index) => polishStep(source, locale, step, index))),
    finalAnswer: polishNarrativeField(source, locale, base.finalAnswer),
    commonMistake: polishNarrativeField(source, locale, base.commonMistake),
  });

  assertCp004LocalizedText(locale, explanation.whatAsked, `${source.qlId}/${source.seed}/${locale}/polished-what-asked`);
  assertCp004LocalizedText(locale, explanation.finalAnswer, `${source.qlId}/${source.seed}/${locale}/polished-final-answer`);
  assertCp004LocalizedText(locale, explanation.commonMistake, `${source.qlId}/${source.seed}/${locale}/polished-common-mistake`);
  for (const [index, step] of explanation.steps.entries()) {
    assertCp004LocalizedText(locale, step, `${source.qlId}/${source.seed}/${locale}/polished-step-${index + 1}`);
  }
  return explanation;
}
