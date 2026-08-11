import {
  absRational,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  div,
  effectiveAnnualRate,
  mixedAmountForState,
  mul,
  periodicAmountForState,
  periodicRate,
  pow,
  rat,
  sub,
  type Cp004Frequency,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText, rationalText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FrequencyIntervalText,
  cp004MonthsText,
  cp004PeriodsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EDITORIAL_VERSION = "INT-CP-004-HI-PA-EDITORIAL-v3" as const;

const factorText = (value: Rational): string => rationalText(value);
const optionLetters = Object.freeze(["A", "B", "C", "D"] as const);

function frequencyNoun(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष";
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "महीने";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਹੀਨੇ";
  }
}

function durationText(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  const months = periods * (12 / frequency);
  return months % 12 === 0 ? cp004YearsText(locale, months / 12) : cp004MonthsText(locale, months);
}

function rateCreditSentence(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  const interval = cp004FrequencyIntervalText(locale, frequency);
  return locale === "hi-IN"
    ? `ब्याज ${interval} मूलधन में जोड़ा जाता है`
    : `ਵਿਆਜ ${interval} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`;
}

function naturalQuestion(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const ci = sub(amount, s.principal);
  const brokenAmount = brokenAmountForState(s);
  const mixedAmount = mixedAmountForState(s);
  const directAmount = periodicAmountForState(s);
  const duration = durationText(locale, s.periods, s.frequency);
  const crediting = rateCreditSentence(locale, s.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${crediting}। ${duration} बाद कुल राशि कितनी होगी?`;
      case "INT-QL-068": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${crediting}। ${duration} बाद चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      case "INT-QL-069": return `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${crediting}। ${duration} बाद राशि ${moneyText(amount)} हो जाती है। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-070": return `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${crediting}। ${duration} में चक्रवृद्धि ब्याज ${moneyText(ci)} है। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-071": return `${moneyText(s.principal)} की राशि ${duration} में बढ़कर ${moneyText(amount)} हो जाती है। ${crediting}। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-072": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${crediting}। राशि ${moneyText(amount)} होने में कितना समय लगेगा?`;
      case "INT-QL-073": return `${moneyText(s.principal)} पर हर ${frequencyNoun(locale, s.frequency)} ${percentText(s.periodicRatePercent)} ब्याज जोड़ा जाता है। कुल ${cp004PeriodsText(locale, s.periods, s.frequency)} बाद राशि ज्ञात कीजिए।`;
      case "INT-QL-074": return `${moneyText(s.principal)} पर हर ${frequencyNoun(locale, s.frequency)} ${percentText(s.periodicRatePercent)} ब्याज जोड़ा जाता है। कुल ${cp004PeriodsText(locale, s.periods, s.frequency)} बाद चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      case "INT-QL-075": return `${moneyText(s.principal)} को ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर पर ${cp004YearsText(locale, s.years)} के लिए लगाया गया। एक योजना में ब्याज ${cp004FrequencyIntervalText(locale, s.frequency)} और दूसरी में ${cp004FrequencyIntervalText(locale, s.comparisonFrequency)} जोड़ा जाता है। दोनों अंतिम राशियों का अंतर ज्ञात कीजिए।`;
      case "INT-QL-076": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${rateCreditSentence(locale, s.frequency)}। एक वर्ष की प्रभावी ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-077": return `ब्याज ${cp004FrequencyIntervalText(locale, s.frequency)} जोड़ा जाता है और प्रभावी वार्षिक दर ${percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency))} है। घोषित वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-078": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर से ${cp004YearsText(locale, s.years)} बाद राशि ${moneyText(amount)} हो जाती है। बताइए, ब्याज वर्ष में कितनी बार जोड़ा गया था?`;
      case "INT-QL-079": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक चक्रवृद्धि ब्याज लगता है। ${cp004YearsText(locale, s.fullYears)} के बाद शेष ${cp004MonthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगाया जाता है। अंतिम राशि ज्ञात कीजिए।`;
      case "INT-QL-080": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक चक्रवृद्धि ब्याज लगता है। ${cp004YearsText(locale, s.fullYears)} के बाद शेष ${cp004MonthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगाया जाता है। कुल ब्याज ज्ञात कीजिए।`;
      case "INT-QL-081": return `${percentText(s.nominalAnnualRatePercent)} वार्षिक चक्रवृद्धि ब्याज पर ${cp004YearsText(locale, s.fullYears)} के बाद शेष ${cp004MonthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगाया जाता है। अंतिम राशि ${moneyText(brokenAmount)} है। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-082": return `${moneyText(s.principal)} पर वार्षिक चक्रवृद्धि ब्याज लगाया जाता है। ${cp004YearsText(locale, s.fullYears)} के बाद शेष ${cp004MonthsText(locale, s.tailMonths)} के लिए उसी दर से साधारण ब्याज लगाया जाता है। अंतिम राशि ${moneyText(brokenAmount)} है। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-083": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक चक्रवृद्धि ब्याज लगता है। पूरे वर्षों के बाद अंतिम ${cp004MonthsText(locale, s.tailMonths)} के लिए साधारण ब्याज लगाया जाता है और राशि ${moneyText(brokenAmount)} हो जाती है। पूरे वर्षों की संख्या ज्ञात कीजिए।`;
      case "INT-QL-084": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर है। पहले ${cp004YearsText(locale, s.firstYears)} तक ब्याज ${cp004FrequencyIntervalText(locale, s.firstFrequency)} और अगले ${cp004YearsText(locale, s.secondYears)} तक ${cp004FrequencyIntervalText(locale, s.secondFrequency)} जोड़ा जाता है। अंतिम राशि ज्ञात कीजिए।`;
      case "INT-QL-085": return `${moneyText(s.principal)} पर ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर है। पहले ${cp004YearsText(locale, s.firstYears)} तक ब्याज ${cp004FrequencyIntervalText(locale, s.firstFrequency)} और अगले ${cp004YearsText(locale, s.secondYears)} तक ${cp004FrequencyIntervalText(locale, s.secondFrequency)} जोड़ा जाता है। कुल चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
    }
  }

  switch (source.qlId) {
    case "INT-QL-067": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${crediting}। ${duration} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
    case "INT-QL-068": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${crediting}। ${duration} ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-069": return `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${crediting}। ${duration} ਬਾਅਦ ਰਕਮ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-070": return `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${crediting}। ${duration} ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${moneyText(ci)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-071": return `${moneyText(s.principal)} ਦੀ ਰਕਮ ${duration} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${crediting}। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-072": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${crediting}। ਰਕਮ ${moneyText(amount)} ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "INT-QL-073": return `${moneyText(s.principal)} ਉੱਤੇ ਹਰ ${frequencyNoun(locale, s.frequency)} ${percentText(s.periodicRatePercent)} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ${cp004PeriodsText(locale, s.periods, s.frequency)} ਬਾਅਦ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-074": return `${moneyText(s.principal)} ਉੱਤੇ ਹਰ ${frequencyNoun(locale, s.frequency)} ${percentText(s.periodicRatePercent)} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ${cp004PeriodsText(locale, s.periods, s.frequency)} ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-075": return `${moneyText(s.principal)} ਨੂੰ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, s.years)} ਲਈ ਲਾਇਆ ਗਿਆ। ਇੱਕ ਯੋਜਨਾ ਵਿੱਚ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${cp004FrequencyIntervalText(locale, s.comparisonFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-076": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${rateCreditSentence(locale, s.frequency)}। ਇੱਕ ਸਾਲ ਦੀ ਪ੍ਰਭਾਵੀ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-077": return `ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency))} ਹੈ। ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-078": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, s.years)} ਬਾਅਦ ਰਕਮ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਦੱਸੋ, ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਸੀ?`;
    case "INT-QL-079": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${cp004YearsText(locale, s.fullYears)} ਬਾਅਦ ਬਾਕੀ ${cp004MonthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-080": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ${cp004YearsText(locale, s.fullYears)} ਬਾਅਦ ਬਾਕੀ ${cp004MonthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-081": return `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨਾਲ ${cp004YearsText(locale, s.fullYears)} ਬਾਅਦ ਬਾਕੀ ${cp004MonthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-082": return `${moneyText(s.principal)} ਉੱਤੇ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ${cp004YearsText(locale, s.fullYears)} ਬਾਅਦ ਬਾਕੀ ${cp004MonthsText(locale, s.tailMonths)} ਲਈ ਉਸੇ ਦਰ ਨਾਲ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-083": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਅਖੀਰਲੇ ${cp004MonthsText(locale, s.tailMonths)} ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਰਕਮ ${moneyText(brokenAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-084": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲੇ ${cp004YearsText(locale, s.firstYears)} ਤੱਕ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, s.secondYears)} ਤੱਕ ${cp004FrequencyIntervalText(locale, s.secondFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-085": return `${moneyText(s.principal)} ਉੱਤੇ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲੇ ${cp004YearsText(locale, s.firstYears)} ਤੱਕ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, s.secondYears)} ਤੱਕ ${cp004FrequencyIntervalText(locale, s.secondFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
  }
}

function structuredStem(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion, prose: string): string {
  if (source.representation === "STANDARD_PROSE") return prose;
  const heading = locale === "hi-IN" ? "दिए गए विवरण के आधार पर उत्तर दीजिए।" : "ਦਿੱਤੇ ਵੇਰਵੇ ਦੇ ਆਧਾਰ ਉੱਤੇ ਉੱਤਰ ਦਿਓ।";
  const label = locale === "hi-IN" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ";
  return `${heading}\n\n| ${label} | विवरण |\n|---|---|\n| ${source.qlId} | ${prose} |`;
}

export function renderCp004LocalizedEditorialV3Stem(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  const stem = structuredStem(locale, source, naturalQuestion(locale, source));
  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/${locale}/editorial-v3-stem`);
  return stem;
}

function periodRateStep(locale: IntCp004LocalizedLocale, source: IntCp004EnglishFrozenQuestion): string {
  const s = source.mathematicalState;
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  return locale === "hi-IN"
    ? `${cp004FrequencyIntervalText(locale, s.frequency)} की दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`
    : `${cp004FrequencyIntervalText(locale, s.frequency)} ਦੀ ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`;
}

function formulaAmount(principal: Rational, rate: Rational, periods: number, amount: Rational): string {
  return `A = ${moneyText(principal)} × (1 + ${factorText(rate)}/100)^${periods} = ${moneyText(amount)}।`;
}

function explanationFields(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const ci = sub(amount, s.principal);
  const directAmount = periodicAmountForState(s);
  const directCi = sub(directAmount, s.principal);
  const brokenAmount = brokenAmountForState(s);
  const brokenCi = sub(brokenAmount, s.principal);
  const mixedAmount = mixedAmountForState(s);
  const mixedCi = sub(mixedAmount, s.principal);
  const periodRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const growthFactor = pow(rat(1 + Number(periodRate.numerator) / Number(periodRate.denominator) / 100), s.periods);
  const tailFactor = rat(1).numerator === 1n ? undefined : undefined;
  const hi = locale === "hi-IN";
  const answer = source.correctAnswer;
  let whatAsked = hi ? "हमें सही मान ज्ञात करना है।" : "ਸਾਨੂੰ ਸਹੀ ਮੁੱਲ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
  let steps: string[] = [];
  let commonMistake = hi ? "दर और अवधियों की संख्या को सही इकाई में रखें।" : "ਦਰ ਅਤੇ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਸਹੀ ਇਕਾਈ ਵਿੱਚ ਰੱਖੋ।";

  switch (source.qlId) {
    case "INT-QL-067":
      whatAsked = hi ? "हमें चक्रवृद्धि ब्याज जुड़ने के बाद की कुल राशि ज्ञात करनी है।" : "ਸਾਨੂੰ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦੀ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `कुल चक्रवृद्धि अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ = ${s.periods}।`, formulaAmount(s.principal, periodRate, s.periods, amount)];
      break;
    case "INT-QL-068":
      whatAsked = hi ? "हमें कुल राशि में से मूलधन घटाकर चक्रवृद्धि ब्याज ज्ञात करना है।" : "ਸਾਨੂੰ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾ ਕੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `कुल चक्रवृद्धि अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ = ${s.periods}।`, formulaAmount(s.principal, periodRate, s.periods, amount), `CI = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(ci)}।`];
      break;
    case "INT-QL-069": {
      const factor = div(amount, s.principal);
      whatAsked = hi ? "हमें अंतिम राशि से चक्रवृद्धि गुणक हटाकर मूलधन ज्ञात करना है।" : "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਹਟਾ ਕੇ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `चक्रवृद्धि गुणक = (1 + ${factorText(periodRate)}/100)^${s.periods} = ${factorText(factor)}।` : `ਚੱਕਰਵੱਧੀ ਗੁਣਕ = (1 + ${factorText(periodRate)}/100)^${s.periods} = ${factorText(factor)}।`, hi ? `मूलधन = अंतिम राशि ÷ चक्रवृद्धि गुणक।` : `ਮੂਲਧਨ = ਅੰਤਿਮ ਰਕਮ ÷ ਚੱਕਰਵੱਧੀ ਗੁਣਕ।`, `P = ${moneyText(amount)} ÷ ${factorText(factor)} = ${moneyText(s.principal)}।`];
      commonMistake = hi ? "अज्ञात मूलधन को अनुपात में पहले से न रखें; पहले केवल दर और समय से गुणक निकालें।" : "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਨਾ ਰੱਖੋ; ਪਹਿਲਾਂ ਸਿਰਫ਼ ਦਰ ਅਤੇ ਸਮੇਂ ਤੋਂ ਗੁਣਕ ਕੱਢੋ।";
      break;
    }
    case "INT-QL-070": {
      const factor = sub(div(amount, s.principal), rat(1));
      whatAsked = hi ? "हमें दिए गए चक्रवृद्धि ब्याज से मूलधन ज्ञात करना है।" : "ਸਾਨੂੰ ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `ब्याज गुणक = (1 + ${factorText(periodRate)}/100)^${s.periods} − 1 = ${factorText(factor)}।` : `ਵਿਆਜ ਗੁਣਕ = (1 + ${factorText(periodRate)}/100)^${s.periods} − 1 = ${factorText(factor)}।`, hi ? `CI = P × ब्याज गुणक, इसलिए P = CI ÷ ब्याज गुणक।` : `CI = P × ਵਿਆਜ ਗੁਣਕ, ਇਸ ਲਈ P = CI ÷ ਵਿਆਜ ਗੁਣਕ।`, `P = ${moneyText(ci)} ÷ ${factorText(factor)} = ${moneyText(s.principal)}।`];
      commonMistake = hi ? "चक्रवृद्धि ब्याज को अंतिम राशि न मानें; यहाँ CI = P[(1+i)^n−1] का उपयोग करें।" : "ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨਾ ਮੰਨੋ; ਇੱਥੇ CI = P[(1+i)^n−1] ਵਰਤੋ।";
      break;
    }
    case "INT-QL-071":
      whatAsked = hi ? "हमें विकल्पों में दी गई वार्षिक दरों में से सही दर पहचाननी है।" : "ਸਾਨੂੰ ਚੋਣਾਂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਵਿੱਚੋਂ ਸਹੀ ਦਰ ਪਛਾਣਨੀ ਹੈ।";
      steps = [hi ? `सही विकल्प ${optionLetters[source.correctIndex]} की दर ${percentText(s.nominalAnnualRatePercent)} जाँचें।` : `ਸਹੀ ਚੋਣ ${optionLetters[source.correctIndex]} ਦੀ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਜਾਂਚੋ।`, periodRateStep(locale, source), hi ? `कुल चक्रवृद्धि अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ = ${s.periods}।`, formulaAmount(s.principal, periodRate, s.periods, amount), hi ? `प्राप्त राशि प्रश्न में दी गई ${moneyText(amount)} के बराबर है।` : `ਮਿਲੀ ਰਕਮ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ${moneyText(amount)} ਦੇ ਬਰਾਬਰ ਹੈ।`, hi ? `अतः वार्षिक ब्याज दर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਸ ਲਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`];
      break;
    case "INT-QL-072":
      whatAsked = hi ? "हमें राशि बनने में लगी चक्रवृद्धि अवधियों से वास्तविक समय ज्ञात करना है।" : "ਸਾਨੂੰ ਰਕਮ ਬਣਨ ਵਿੱਚ ਲੱਗੀਆਂ ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ ਤੋਂ ਅਸਲ ਸਮਾਂ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `लक्ष्य अनुपात = ${moneyText(amount)} ÷ ${moneyText(s.principal)} = ${factorText(div(amount, s.principal))}।` : `ਲਕਸ਼ ਅਨੁਪਾਤ = ${moneyText(amount)} ÷ ${moneyText(s.principal)} = ${factorText(div(amount, s.principal))}।`, hi ? `(1 + ${factorText(periodRate)}/100)^n = ${factorText(div(amount, s.principal))}; इससे n = ${s.periods} अवधियाँ।` : `(1 + ${factorText(periodRate)}/100)^n = ${factorText(div(amount, s.principal))}; ਇਸ ਤੋਂ n = ${s.periods} ਮਿਆਦਾਂ।`, hi ? `एक अवधि ${12 / s.frequency} महीने की है।` : `ਇੱਕ ਮਿਆਦ ${12 / s.frequency} ਮਹੀਨਿਆਂ ਦੀ ਹੈ।`, hi ? `कुल समय = ${s.periods} × ${12 / s.frequency} महीने = ${durationText(locale, s.periods, s.frequency)}।` : `ਕੁੱਲ ਸਮਾਂ = ${s.periods} × ${12 / s.frequency} ਮਹੀਨੇ = ${durationText(locale, s.periods, s.frequency)}।`];
      break;
    case "INT-QL-073":
      whatAsked = hi ? "हमें सीधे दी गई प्रत्येक चक्रवृद्धि अवधि की दर से कुल राशि ज्ञात करनी है।" : "ਸਾਨੂੰ ਹਰ ਚੱਕਰਵੱਧੀ ਮਿਆਦ ਲਈ ਸਿੱਧੀ ਦਿੱਤੀ ਦਰ ਨਾਲ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
      steps = [hi ? `हर ${frequencyNoun(locale, s.frequency)} की दर ${percentText(s.periodicRatePercent)} है।` : `ਹਰ ${frequencyNoun(locale, s.frequency)} ਦੀ ਦਰ ${percentText(s.periodicRatePercent)} ਹੈ।`, hi ? `कुल अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਮਿਆਦਾਂ = ${s.periods}।`, formulaAmount(s.principal, s.periodicRatePercent, s.periods, directAmount)];
      break;
    case "INT-QL-074":
      whatAsked = hi ? "हमें सीधे दी गई प्रत्येक अवधि की दर से चक्रवृद्धि ब्याज ज्ञात करना है।" : "ਸਾਨੂੰ ਹਰ ਮਿਆਦ ਲਈ ਸਿੱਧੀ ਦਿੱਤੀ ਦਰ ਨਾਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [hi ? `हर ${frequencyNoun(locale, s.frequency)} की दर ${percentText(s.periodicRatePercent)} है।` : `ਹਰ ${frequencyNoun(locale, s.frequency)} ਦੀ ਦਰ ${percentText(s.periodicRatePercent)} ਹੈ।`, hi ? `कुल अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਮਿਆਦਾਂ = ${s.periods}।`, formulaAmount(s.principal, s.periodicRatePercent, s.periods, directAmount), `CI = ${moneyText(directAmount)} − ${moneyText(s.principal)} = ${moneyText(directCi)}।`];
      break;
    case "INT-QL-075": {
      const first = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, s.frequency, s.frequency * s.years);
      const second = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, s.comparisonFrequency, s.comparisonFrequency * s.years);
      whatAsked = hi ? "हमें दोनों ब्याज योजनाओं की अंतिम राशियों का अंतर ज्ञात करना है।" : "ਸਾਨੂੰ ਦੋਵਾਂ ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [hi ? `पहली योजना की राशि = ${moneyText(first)}।` : `ਪਹਿਲੀ ਯੋਜਨਾ ਦੀ ਰਕਮ = ${moneyText(first)}।`, hi ? `दूसरी योजना की राशि = ${moneyText(second)}।` : `ਦੂਜੀ ਯੋਜਨਾ ਦੀ ਰਕਮ = ${moneyText(second)}।`, hi ? `अंतर = |${moneyText(first)} − ${moneyText(second)}| = ${moneyText(absRational(sub(first, second)))}।` : `ਅੰਤਰ = |${moneyText(first)} − ${moneyText(second)}| = ${moneyText(absRational(sub(first, second)))}।`];
      break;
    }
    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const oneYear = completeAmountFromNominal(rat(100), s.nominalAnnualRatePercent, s.frequency, s.frequency);
      whatAsked = hi ? "हमें एक वर्ष में हुई वास्तविक प्रतिशत बढ़ोतरी ज्ञात करनी है।" : "ਸਾਨੂੰ ਇੱਕ ਸਾਲ ਵਿੱਚ ਹੋਇਆ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [periodRateStep(locale, source), hi ? `एक वर्ष में कुल अवधियाँ = ${s.frequency}।` : `ਇੱਕ ਸਾਲ ਵਿੱਚ ਕੁੱਲ ਮਿਆਦਾਂ = ${s.frequency}।`, `₹100 × (1 + ${factorText(periodRate)}/100)^${s.frequency} = ${moneyText(oneYear)}।`, hi ? `प्रभावी वार्षिक दर = ${moneyText(oneYear)} − ₹100 = ${percentText(effective)}।` : `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = ${moneyText(oneYear)} − ₹100 = ${percentText(effective)}।`];
      break;
    }
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      whatAsked = hi ? "हमें प्रभावी वार्षिक दर से घोषित वार्षिक ब्याज दर पहचाननी है।" : "ਸਾਨੂੰ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਤੋਂ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਛਾਣਨੀ ਹੈ।";
      steps = [hi ? `सही विकल्प ${optionLetters[source.correctIndex]} की वार्षिक दर ${percentText(s.nominalAnnualRatePercent)} जाँचें।` : `ਸਹੀ ਚੋਣ ${optionLetters[source.correctIndex]} ਦੀ ਸਾਲਾਨਾ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਜਾਂਚੋ।`, periodRateStep(locale, source), hi ? `एक वर्ष में ${s.frequency} चक्रवृद्धि अवधियाँ हैं।` : `ਇੱਕ ਸਾਲ ਵਿੱਚ ${s.frequency} ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ ਹਨ।`, hi ? `प्रभावी दर = [(1 + ${factorText(periodRate)}/100)^${s.frequency} − 1] × 100 = ${percentText(effective)}।` : `ਪ੍ਰਭਾਵੀ ਦਰ = [(1 + ${factorText(periodRate)}/100)^${s.frequency} − 1] × 100 = ${percentText(effective)}।`, hi ? `यह प्रश्न में दी गई प्रभावी दर के बराबर है; अतः उत्तर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਪ੍ਰਭਾਵੀ ਦਰ ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਉੱਤਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`];
      break;
    }
    case "INT-QL-078": {
      const candidates = ([1, 2, 4, 12] as const).map((frequency) => ({ frequency, amount: completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, frequency, frequency * s.years) }));
      whatAsked = hi ? "हमें दी गई अंतिम राशि से ब्याज जोड़ने की सही आवृत्ति पहचाननी है।" : "ਸਾਨੂੰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਵਿਆਜ ਜੋੜਨ ਦੀ ਸਹੀ ਗਿਣਤੀ ਪਛਾਣਨੀ ਹੈ।";
      steps = candidates.map((candidate) => hi ? `${cp004FrequencyIntervalText(locale, candidate.frequency)}: राशि ${moneyText(candidate.amount)}।` : `${cp004FrequencyIntervalText(locale, candidate.frequency)}: ਰਕਮ ${moneyText(candidate.amount)}।`);
      steps.push(hi ? `दी गई राशि ${moneyText(amount)} केवल ${cp004FrequencyIntervalText(locale, s.frequency)} वाले विकल्प से मिलती है।` : `ਦਿੱਤੀ ਰਕਮ ${moneyText(amount)} ਸਿਰਫ਼ ${cp004FrequencyIntervalText(locale, s.frequency)} ਵਾਲੀ ਚੋਣ ਨਾਲ ਮਿਲਦੀ ਹੈ।`, hi ? `अतः ब्याज वर्ष में ${s.frequency} बार जोड़ा गया था।` : `ਇਸ ਲਈ ਵਿਆਜ ਸਾਲ ਵਿੱਚ ${s.frequency} ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਸੀ।`);
      break;
    }
    case "INT-QL-079":
    case "INT-QL-080": {
      const afterYears = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears);
      const tailInterest = sub(brokenAmount, afterYears);
      whatAsked = source.qlId === "INT-QL-079" ? (hi ? "हमें पूरे वर्षों और साधारण-ब्याज वाले अतिरिक्त महीनों के बाद अंतिम राशि ज्ञात करनी है।" : "ਸਾਨੂੰ ਪੂਰੇ ਸਾਲਾਂ ਅਤੇ ਸਧਾਰਣ-ਵਿਆਜ ਵਾਲੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।") : (hi ? "हमें पूरे समय का कुल ब्याज ज्ञात करना है।" : "ਸਾਨੂੰ ਪੂਰੇ ਸਮੇਂ ਦਾ ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।");
      steps = [hi ? `पूरे ${cp004YearsText(locale, s.fullYears)} बाद राशि = ${moneyText(afterYears)}।` : `ਪੂਰੇ ${cp004YearsText(locale, s.fullYears)} ਬਾਅਦ ਰਕਮ = ${moneyText(afterYears)}।`, hi ? `अतिरिक्त ${cp004MonthsText(locale, s.tailMonths)} का साधारण ब्याज = ${moneyText(afterYears)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।` : `ਵਾਧੂ ${cp004MonthsText(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(afterYears)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`, hi ? `अंतिम राशि = ${moneyText(afterYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।` : `ਅੰਤਿਮ ਰਕਮ = ${moneyText(afterYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।`, source.qlId === "INT-QL-079" ? (hi ? `अतः अंतिम राशि ${moneyText(brokenAmount)} है।` : `ਇਸ ਲਈ ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ।`) : `CI = ${moneyText(brokenAmount)} − ${moneyText(s.principal)} = ${moneyText(brokenCi)}।`];
      if (source.qlId === "INT-QL-080") steps.push(hi ? `अतः कुल ब्याज ${moneyText(brokenCi)} है।` : `ਇਸ ਲਈ ਕੁੱਲ ਵਿਆਜ ${moneyText(brokenCi)} ਹੈ।`);
      break;
    }
    case "INT-QL-081": {
      const yearFactor = div(completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears), s.principal);
      const tailFactorValue = div(brokenAmount, completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears));
      const combined = mul(yearFactor, tailFactorValue);
      whatAsked = hi ? "हमें अंतिम राशि को दोनों चरणों के संयुक्त गुणक से भाग देकर मूलधन ज्ञात करना है।" : "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਦੋਵਾਂ ਪੜਾਵਾਂ ਦੇ ਸਾਂਝੇ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [hi ? `पूरे वर्षों का गुणक = ${factorText(yearFactor)}।` : `ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = ${factorText(yearFactor)}।`, hi ? `अतिरिक्त ${cp004MonthsText(locale, s.tailMonths)} का साधारण-ब्याज गुणक = ${factorText(tailFactorValue)}।` : `ਵਾਧੂ ${cp004MonthsText(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ-ਵਿਆਜ ਗੁਣਕ = ${factorText(tailFactorValue)}।`, hi ? `संयुक्त गुणक = ${factorText(yearFactor)} × ${factorText(tailFactorValue)} = ${factorText(combined)}।` : `ਸਾਂਝਾ ਗੁਣਕ = ${factorText(yearFactor)} × ${factorText(tailFactorValue)} = ${factorText(combined)}।`, `P = ${moneyText(brokenAmount)} ÷ ${factorText(combined)} = ${moneyText(s.principal)}।`];
      commonMistake = hi ? "अज्ञात मूलधन को किसी अनुपात में पहले से न लिखें; दोनों गुणक केवल दर और समय से निकालें।" : "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਕਿਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਨਾ ਲਿਖੋ; ਦੋਵੇਂ ਗੁਣਕ ਸਿਰਫ਼ ਦਰ ਅਤੇ ਸਮੇਂ ਤੋਂ ਕੱਢੋ।";
      break;
    }
    case "INT-QL-082":
      whatAsked = hi ? "हमें विकल्पों में दी गई वार्षिक दरों में से वह दर पहचाननी है जो अंतिम राशि बनाती है।" : "ਸਾਨੂੰ ਚੋਣਾਂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਵਿੱਚੋਂ ਉਹ ਦਰ ਪਛਾਣਨੀ ਹੈ ਜੋ ਅੰਤਿਮ ਰਕਮ ਬਣਾਉਂਦੀ ਹੈ।";
      steps = [hi ? `सही विकल्प ${optionLetters[source.correctIndex]} की दर ${percentText(s.nominalAnnualRatePercent)} जाँचें।` : `ਸਹੀ ਚੋਣ ${optionLetters[source.correctIndex]} ਦੀ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਜਾਂਚੋ।`, hi ? `पूरे वर्षों के बाद राशि = ${moneyText(completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears))}।` : `ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਰਕਮ = ${moneyText(completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears))}।`, hi ? `अतिरिक्त महीनों का साधारण ब्याज जोड़ने पर राशि ${moneyText(brokenAmount)} बनती है।` : `ਵਾਧੂ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਜੋੜਨ ਉੱਤੇ ਰਕਮ ${moneyText(brokenAmount)} ਬਣਦੀ ਹੈ।`, hi ? `यह दी गई राशि के बराबर है; अतः वार्षिक दर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਹ ਦਿੱਤੀ ਰਕਮ ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`];
      break;
    case "INT-QL-083":
      whatAsked = hi ? "हमें विकल्पों में दिए पूरे वर्षों में से सही संख्या पहचाननी है।" : "ਸਾਨੂੰ ਚੋਣਾਂ ਵਿੱਚ ਦਿੱਤੇ ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚੋਂ ਸਹੀ ਗਿਣਤੀ ਪਛਾਣਨੀ ਹੈ।";
      steps = [hi ? `सही विकल्प ${optionLetters[source.correctIndex]} के ${cp004YearsText(locale, s.fullYears)} जाँचें।` : `ਸਹੀ ਚੋਣ ${optionLetters[source.correctIndex]} ਦੇ ${cp004YearsText(locale, s.fullYears)} ਜਾਂਚੋ।`, hi ? `पूरे वर्षों के बाद राशि = ${moneyText(completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears))}।` : `ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਰਕਮ = ${moneyText(completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears))}।`, hi ? `अंतिम ${cp004MonthsText(locale, s.tailMonths)} का साधारण ब्याज जोड़ने पर राशि ${moneyText(brokenAmount)} बनती है।` : `ਅਖੀਰਲੇ ${cp004MonthsText(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਜੋੜਨ ਉੱਤੇ ਰਕਮ ${moneyText(brokenAmount)} ਬਣਦੀ ਹੈ।`, hi ? `अतः पूरे वर्षों की संख्या ${s.fullYears} है।` : `ਇਸ ਲਈ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ${s.fullYears} ਹੈ।`];
      break;
    case "INT-QL-084":
    case "INT-QL-085": {
      const afterFirst = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, s.firstFrequency, s.firstFrequency * s.firstYears);
      whatAsked = source.qlId === "INT-QL-084" ? (hi ? "हमें दो अलग ब्याज-अंतरालों के बाद अंतिम राशि ज्ञात करनी है।" : "ਸਾਨੂੰ ਦੋ ਵੱਖਰੇ ਵਿਆਜ-ਅੰਤਰਾਲਾਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।") : (hi ? "हमें दो अलग ब्याज-अंतरालों के बाद कुल चक्रवृद्धि ब्याज ज्ञात करना है।" : "ਸਾਨੂੰ ਦੋ ਵੱਖਰੇ ਵਿਆਜ-ਅੰਤਰਾਲਾਂ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।");
      const firstRate = periodicRate(s.nominalAnnualRatePercent, s.firstFrequency);
      const secondRate = periodicRate(s.nominalAnnualRatePercent, s.secondFrequency);
      steps = [hi ? `पहले चरण की दर ${percentText(firstRate)} प्रति अवधि और अवधियाँ ${s.firstFrequency * s.firstYears} हैं।` : `ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਦਰ ${percentText(firstRate)} ਪ੍ਰਤੀ ਮਿਆਦ ਅਤੇ ਮਿਆਦਾਂ ${s.firstFrequency * s.firstYears} ਹਨ।`, hi ? `पहले चरण के बाद राशि = ${moneyText(afterFirst)}।` : `ਪਹਿਲੇ ਪੜਾਅ ਬਾਅਦ ਰਕਮ = ${moneyText(afterFirst)}।`, hi ? `दूसरे चरण की दर ${percentText(secondRate)} प्रति अवधि और अवधियाँ ${s.secondFrequency * s.secondYears} हैं।` : `ਦੂਜੇ ਪੜਾਅ ਦੀ ਦਰ ${percentText(secondRate)} ਪ੍ਰਤੀ ਮਿਆਦ ਅਤੇ ਮਿਆਦਾਂ ${s.secondFrequency * s.secondYears} ਹਨ।`, hi ? `दूसरे चरण के बाद राशि = ${moneyText(mixedAmount)}।` : `ਦੂਜੇ ਪੜਾਅ ਬਾਅਦ ਰਕਮ = ${moneyText(mixedAmount)}।`];
      if (source.qlId === "INT-QL-085") steps.push(`CI = ${moneyText(mixedAmount)} − ${moneyText(s.principal)} = ${moneyText(mixedCi)}।`);
      break;
    }
  }

  const finalAnswer = hi ? `अंतिम उत्तर: ${answer}।` : `ਅੰਤਿਮ ਉੱਤਰ: ${answer}।`;
  const explanation = Object.freeze({ whatAsked, steps: Object.freeze(steps), finalAnswer, commonMistake });
  for (const [index, text] of [whatAsked, ...steps, finalAnswer, commonMistake].entries()) {
    assertCp004LocalizedText(locale, text, `${source.qlId}/${source.seed}/${locale}/editorial-v3-explanation-${index}`);
  }
  return explanation;
}

export function buildCp004LocalizedEditorialV3Explanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  return explanationFields(source, locale);
}

function naturalizeFeedback(text: string, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replaceAll("नाममात्र", "दिया गया")
      .replaceAll("अवधि-संख्या", "अवधियों की संख्या")
      .replaceAll("हद-बिंदु", "अंतिम समय")
      .replaceAll("प्रति अवधि", "हर चक्रवृद्धि अवधि")
      .replaceAll("गोल-गोल", "पहले से मानकर");
  }
  return text
    .replaceAll("ਨਾਮਮਾਤਰ", "ਦੱਸੀ ਗਈ")
    .replaceAll("ਅਵਧੀ-ਗਿਣਤੀ", "ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ")
    .replaceAll("ਹੱਦ-ਬਿੰਦੂ", "ਅੰਤਿਮ ਸਮਾਂ")
    .replaceAll("ਹਰ-ਅਵਧੀ", "ਹਰ ਚੱਕਰਵੱਧੀ ਮਿਆਦ")
    .replaceAll("ਗੋਲ-ਗੋਲ", "ਪਹਿਲਾਂ ਤੋਂ ਮੰਨ ਕੇ");
}

export function remediateCp004LocalizedOptions(
  options: readonly IntCp004LocalizedOption[],
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  return Object.freeze(options.map((option) => Object.freeze({
    ...option,
    text: naturalizeFeedback(option.text, locale),
    feedback: naturalizeFeedback(option.feedback, locale),
  })));
}
