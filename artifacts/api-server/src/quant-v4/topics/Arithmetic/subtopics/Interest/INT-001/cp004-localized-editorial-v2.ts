import {
  FREQUENCIES,
  asInteger,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  effectiveAnnualRate,
  mixedAmountForState,
  periodicAmountForState,
  sub,
  type Cp004AnswerSemantic,
  type Cp004Frequency,
  type Cp004MathematicalState,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004CompoundingText,
  cp004CreditedTimesText,
  cp004FrequencyIntervalText,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004PeriodsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type {
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EDITORIAL_VERSION = "INT-CP-004-HI-PA-EDITORIAL-v2" as const;

type Row = readonly [string, string];

function freezeRows(rows: readonly Row[]): readonly Row[] {
  return Object.freeze(rows.map((row) => Object.freeze(row)));
}

function durationFromPeriods(
  locale: IntCp004LocalizedLocale,
  periods: number,
  frequency: Cp004Frequency,
): string {
  const months = periods * (12 / frequency);
  return months % 12 === 0
    ? cp004YearsText(locale, months / 12)
    : cp004MonthsText(locale, months);
}

function directPeriodLabel(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛੇ ਮਹੀਨੇ";
    case 4: return "ਹਰ ਤਿੰਨ ਮਹੀਨੇ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function questionTarget(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-073":
      case "INT-QL-079":
      case "INT-QL-084": return "कुल राशि";
      case "INT-QL-068":
      case "INT-QL-074":
      case "INT-QL-080":
      case "INT-QL-085": return "चक्रवृद्धि ब्याज";
      case "INT-QL-069":
      case "INT-QL-070":
      case "INT-QL-081": return "मूलधन";
      case "INT-QL-071":
      case "INT-QL-077": return "घोषित वार्षिक दर";
      case "INT-QL-072": return "समय";
      case "INT-QL-075": return "दोनों राशियों का अंतर";
      case "INT-QL-076": return "प्रभावी वार्षिक दर";
      case "INT-QL-078": return "ब्याज जोड़ने का तरीका";
      case "INT-QL-082": return "वार्षिक ब्याज दर";
      case "INT-QL-083": return "पूरे वर्षों की संख्या";
    }
  }
  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-073":
    case "INT-QL-079":
    case "INT-QL-084": return "ਕੁੱਲ ਰਕਮ";
    case "INT-QL-068":
    case "INT-QL-074":
    case "INT-QL-080":
    case "INT-QL-085": return "ਚੱਕਰਵੱਧੀ ਵਿਆਜ";
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-081": return "ਮੂਲਧਨ";
    case "INT-QL-071":
    case "INT-QL-077": return "ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ";
    case "INT-QL-072": return "ਸਮਾਂ";
    case "INT-QL-075": return "ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ";
    case "INT-QL-076": return "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ";
    case "INT-QL-078": return "ਵਿਆਜ ਜੋੜਨ ਦਾ ਤਰੀਕਾ";
    case "INT-QL-082": return "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ";
    case "INT-QL-083": return "ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ";
  }
}

function stemFacts(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly Row[] {
  const state = source.mathematicalState;
  const completeAmount = completeAmountForState(state);
  const completeInterest = sub(completeAmount, state.principal);
  const periodicAmount = periodicAmountForState(state);
  const periodicInterest = sub(periodicAmount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const brokenInterest = sub(brokenAmount, state.principal);
  const mixedAmount = mixedAmountForState(state);
  const mixedInterest = sub(mixedAmount, state.principal);
  const duration = durationFromPeriods(locale, state.periods, state.frequency);
  const annualRate = percentText(state.nominalAnnualRatePercent);
  const rule = cp004CompoundingText(locale, state.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", duration],
        ["कुल राशि", "?"],
      ]);
      case "INT-QL-068": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", duration],
        ["चक्रवृद्धि ब्याज", "?"],
      ]);
      case "INT-QL-069": return freezeRows([
        ["मूलधन", "?"],
        ["वार्षिक ब्याज दर", annualRate],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", duration],
        ["अंतिम राशि", moneyText(completeAmount)],
      ]);
      case "INT-QL-070": return freezeRows([
        ["मूलधन", "?"],
        ["वार्षिक ब्याज दर", annualRate],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", duration],
        ["चक्रवृद्धि ब्याज", moneyText(completeInterest)],
      ]);
      case "INT-QL-071": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["घोषित वार्षिक दर", "?"],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", duration],
        ["अंतिम राशि", moneyText(completeAmount)],
      ]);
      case "INT-QL-072": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["ब्याज जोड़ने का नियम", rule],
        ["समय", "?"],
        ["अंतिम राशि", moneyText(completeAmount)],
      ]);
      case "INT-QL-073": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        [`${directPeriodLabel(locale, state.frequency)} की ब्याज दर`, percentText(state.periodicRatePercent)],
        ["कुल अवधियाँ", cp004PeriodsText(locale, state.periods, state.frequency)],
        ["कुल राशि", "?"],
      ]);
      case "INT-QL-074": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        [`${directPeriodLabel(locale, state.frequency)} की ब्याज दर`, percentText(state.periodicRatePercent)],
        ["कुल अवधियाँ", cp004PeriodsText(locale, state.periods, state.frequency)],
        ["चक्रवृद्धि ब्याज", "?"],
      ]);
      case "INT-QL-075": {
        const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
        const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
        return freezeRows([
          ["मूलधन", moneyText(state.principal)],
          ["वार्षिक ब्याज दर", annualRate],
          ["समय", cp004YearsText(locale, state.years)],
          [`योजना A: ${cp004FrequencyLabel(locale, state.frequency)}`, moneyText(first)],
          [`योजना B: ${cp004FrequencyLabel(locale, state.comparisonFrequency)}`, moneyText(second)],
          ["अंतर", "?"],
        ]);
      }
      case "INT-QL-076": return freezeRows([
        ["घोषित वार्षिक दर", annualRate],
        ["ब्याज जोड़ा जाता है", cp004CreditedTimesText(locale, state.frequency)],
        ["प्रभावी वार्षिक दर", "?"],
      ]);
      case "INT-QL-077": return freezeRows([
        ["प्रभावी वार्षिक दर", percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))],
        ["ब्याज जोड़ा जाता है", cp004CreditedTimesText(locale, state.frequency)],
        ["घोषित वार्षिक दर", "?"],
      ]);
      case "INT-QL-078": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["समय", cp004YearsText(locale, state.years)],
        ["अंतिम राशि", moneyText(completeAmount)],
        ["ब्याज जोड़ने का तरीका", "?"],
      ]);
      case "INT-QL-079": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["पहला चरण", `${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि`],
        ["दूसरा चरण", `${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज`],
        ["कुल राशि", "?"],
      ]);
      case "INT-QL-080": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["पहला चरण", `${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि`],
        ["दूसरा चरण", `${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज`],
        ["कुल ब्याज", "?"],
      ]);
      case "INT-QL-081": return freezeRows([
        ["मूलधन", "?"],
        ["वार्षिक ब्याज दर", annualRate],
        ["पहला चरण", `${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि`],
        ["दूसरा चरण", `${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज`],
        ["अंतिम राशि", moneyText(brokenAmount)],
      ]);
      case "INT-QL-082": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", "?"],
        ["पहला चरण", `${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि`],
        ["दूसरा चरण", `${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज`],
        ["अंतिम राशि", moneyText(brokenAmount)],
      ]);
      case "INT-QL-083": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["पूरे वर्ष", "?"],
        ["अंतिम अतिरिक्त अवधि", `${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज`],
        ["अंतिम राशि", moneyText(brokenAmount)],
      ]);
      case "INT-QL-084": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["पहला चरण", `${cp004YearsText(locale, state.firstYears)}; ${cp004CompoundingText(locale, state.firstFrequency)}`],
        ["दूसरा चरण", `${cp004YearsText(locale, state.secondYears)}; ${cp004CompoundingText(locale, state.secondFrequency)}`],
        ["कुल राशि", "?"],
      ]);
      case "INT-QL-085": return freezeRows([
        ["मूलधन", moneyText(state.principal)],
        ["वार्षिक ब्याज दर", annualRate],
        ["पहला चरण", `${cp004YearsText(locale, state.firstYears)}; ${cp004CompoundingText(locale, state.firstFrequency)}`],
        ["दूसरा चरण", `${cp004YearsText(locale, state.secondYears)}; ${cp004CompoundingText(locale, state.secondFrequency)}`],
        ["कुल ब्याज", "?"],
      ]);
    }
  }

  switch (source.qlId) {
    case "INT-QL-067": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", duration],
      ["ਕੁੱਲ ਰਕਮ", "?"],
    ]);
    case "INT-QL-068": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", duration],
      ["ਚੱਕਰਵੱਧੀ ਵਿਆਜ", "?"],
    ]);
    case "INT-QL-069": return freezeRows([
      ["ਮੂਲਧਨ", "?"],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", duration],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(completeAmount)],
    ]);
    case "INT-QL-070": return freezeRows([
      ["ਮੂਲਧਨ", "?"],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", duration],
      ["ਚੱਕਰਵੱਧੀ ਵਿਆਜ", moneyText(completeInterest)],
    ]);
    case "INT-QL-071": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ", "?"],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", duration],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(completeAmount)],
    ]);
    case "INT-QL-072": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ", rule],
      ["ਸਮਾਂ", "?"],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(completeAmount)],
    ]);
    case "INT-QL-073": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      [`${directPeriodLabel(locale, state.frequency)} ਦੀ ਵਿਆਜ ਦਰ`, percentText(state.periodicRatePercent)],
      ["ਕੁੱਲ ਮਿਆਦਾਂ", cp004PeriodsText(locale, state.periods, state.frequency)],
      ["ਕੁੱਲ ਰਕਮ", "?"],
    ]);
    case "INT-QL-074": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      [`${directPeriodLabel(locale, state.frequency)} ਦੀ ਵਿਆਜ ਦਰ`, percentText(state.periodicRatePercent)],
      ["ਕੁੱਲ ਮਿਆਦਾਂ", cp004PeriodsText(locale, state.periods, state.frequency)],
      ["ਚੱਕਰਵੱਧੀ ਵਿਆਜ", "?"],
    ]);
    case "INT-QL-075": {
      const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      return freezeRows([
        ["ਮੂਲਧਨ", moneyText(state.principal)],
        ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
        ["ਸਮਾਂ", cp004YearsText(locale, state.years)],
        [`ਯੋਜਨਾ A: ${cp004FrequencyLabel(locale, state.frequency)}`, moneyText(first)],
        [`ਯੋਜਨਾ B: ${cp004FrequencyLabel(locale, state.comparisonFrequency)}`, moneyText(second)],
        ["ਅੰਤਰ", "?"],
      ]);
    }
    case "INT-QL-076": return freezeRows([
      ["ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ", annualRate],
      ["ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ", cp004CreditedTimesText(locale, state.frequency)],
      ["ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ", "?"],
    ]);
    case "INT-QL-077": return freezeRows([
      ["ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ", percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))],
      ["ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ", cp004CreditedTimesText(locale, state.frequency)],
      ["ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ", "?"],
    ]);
    case "INT-QL-078": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਸਮਾਂ", cp004YearsText(locale, state.years)],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(completeAmount)],
      ["ਵਿਆਜ ਜੋੜਨ ਦਾ ਤਰੀਕਾ", "?"],
    ]);
    case "INT-QL-079": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ`],
      ["ਕੁੱਲ ਰਕਮ", "?"],
    ]);
    case "INT-QL-080": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ`],
      ["ਕੁੱਲ ਵਿਆਜ", "?"],
    ]);
    case "INT-QL-081": return freezeRows([
      ["ਮੂਲਧਨ", "?"],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ`],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(brokenAmount)],
    ]);
    case "INT-QL-082": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", "?"],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ`],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(brokenAmount)],
    ]);
    case "INT-QL-083": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪੂਰੇ ਸਾਲ", "?"],
      ["ਅਖੀਰਲੀ ਵਾਧੂ ਮਿਆਦ", `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ`],
      ["ਅੰਤਿਮ ਰਕਮ", moneyText(brokenAmount)],
    ]);
    case "INT-QL-084": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.firstYears)}; ${cp004CompoundingText(locale, state.firstFrequency)}`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004YearsText(locale, state.secondYears)}; ${cp004CompoundingText(locale, state.secondFrequency)}`],
      ["ਕੁੱਲ ਰਕਮ", "?"],
    ]);
    case "INT-QL-085": return freezeRows([
      ["ਮੂਲਧਨ", moneyText(state.principal)],
      ["ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ", annualRate],
      ["ਪਹਿਲਾ ਪੜਾਅ", `${cp004YearsText(locale, state.firstYears)}; ${cp004CompoundingText(locale, state.firstFrequency)}`],
      ["ਦੂਜਾ ਪੜਾਅ", `${cp004YearsText(locale, state.secondYears)}; ${cp004CompoundingText(locale, state.secondFrequency)}`],
      ["ਕੁੱਲ ਵਿਆਜ", "?"],
    ]);
  }
}

function standardProse(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const interest = sub(amount, state.principal);
  const directAmount = periodicAmountForState(state);
  const directInterest = sub(directAmount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const mixedAmount = mixedAmountForState(state);
  const duration = durationFromPeriods(locale, state.periods, state.frequency);
  const annualRate = percentText(state.nominalAnnualRatePercent);
  const rule = cp004CompoundingText(locale, state.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से ${rule}। ${duration} बाद कुल राशि ज्ञात कीजिए।`;
      case "INT-QL-068": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से ${rule}। ${duration} बाद चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      case "INT-QL-069": return `एक राशि ${annualRate} वार्षिक दर से ${duration} में बढ़कर ${moneyText(amount)} हो जाती है। ${rule}। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-070": return `किसी मूलधन पर ${annualRate} वार्षिक दर से ${duration} का चक्रवृद्धि ब्याज ${moneyText(interest)} है। ${rule}। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-071": return `${moneyText(state.principal)} की राशि ${duration} में बढ़कर ${moneyText(amount)} हो जाती है। ${rule}। घोषित वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-072": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से ${rule} और राशि बढ़कर ${moneyText(amount)} हो जाती है। समय ज्ञात कीजिए।`;
      case "INT-QL-073": return `${moneyText(state.principal)} पर ${directPeriodLabel(locale, state.frequency)} की ब्याज दर ${percentText(state.periodicRatePercent)} है। कुल ${cp004PeriodsText(locale, state.periods, state.frequency)} बाद राशि ज्ञात कीजिए।`;
      case "INT-QL-074": return `${moneyText(state.principal)} पर ${directPeriodLabel(locale, state.frequency)} की ब्याज दर ${percentText(state.periodicRatePercent)} है। कुल ${cp004PeriodsText(locale, state.periods, state.frequency)} बाद चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
      case "INT-QL-075": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से ${cp004YearsText(locale, state.years)} के लिए ब्याज एक योजना में ${cp004FrequencyLabel(locale, state.frequency)} और दूसरी में ${cp004FrequencyLabel(locale, state.comparisonFrequency)} जोड़ा जाता है। दोनों अंतिम राशियों का अंतर ज्ञात कीजिए।`;
      case "INT-QL-076": return `घोषित वार्षिक दर ${annualRate} है और ब्याज ${cp004CreditedTimesText(locale, state.frequency)} जोड़ा जाता है। प्रभावी वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-077": return `प्रभावी वार्षिक दर ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))} है और ब्याज ${cp004CreditedTimesText(locale, state.frequency)} जोड़ा जाता है। घोषित वार्षिक दर ज्ञात कीजिए।`;
      case "INT-QL-078": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से ${cp004YearsText(locale, state.years)} बाद राशि ${moneyText(amount)} है। ब्याज वार्षिक, छमाही, तिमाही या मासिक—किस प्रकार जोड़ा गया था? सही विकल्प (?) चुनिए।`;
      case "INT-QL-079": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर है। पहले ${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि ब्याज और फिर ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज लगाया जाता है। कुल राशि ज्ञात कीजिए।`;
      case "INT-QL-080": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर है। पहले ${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि ब्याज और फिर ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज लगाया जाता है। कुल ब्याज ज्ञात कीजिए।`;
      case "INT-QL-081": return `एक राशि ${annualRate} वार्षिक दर पर पहले ${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि होती है और फिर ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज लगता है। अंतिम राशि ${moneyText(brokenAmount)} है। मूलधन ज्ञात कीजिए।`;
      case "INT-QL-082": return `${moneyText(state.principal)} पर पहले ${cp004YearsText(locale, state.fullYears)} तक वार्षिक चक्रवृद्धि ब्याज और फिर ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज लगाया जाता है। अंतिम राशि ${moneyText(brokenAmount)} है। वार्षिक ब्याज दर ज्ञात कीजिए।`;
      case "INT-QL-083": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर से कुछ पूरे वर्षों तक चक्रवृद्धि ब्याज और फिर ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज लगाया जाता है। अंतिम राशि ${moneyText(brokenAmount)} है। पूरे वर्षों की संख्या ज्ञात कीजिए।`;
      case "INT-QL-084": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर है। पहले ${cp004YearsText(locale, state.firstYears)} तक ${cp004FrequencyLabel(locale, state.firstFrequency)} और अगले ${cp004YearsText(locale, state.secondYears)} तक ${cp004FrequencyLabel(locale, state.secondFrequency)} ब्याज जोड़ा जाता है। कुल राशि ज्ञात कीजिए।`;
      case "INT-QL-085": return `${moneyText(state.principal)} पर ${annualRate} वार्षिक दर है। पहले ${cp004YearsText(locale, state.firstYears)} तक ${cp004FrequencyLabel(locale, state.firstFrequency)} और अगले ${cp004YearsText(locale, state.secondYears)} तक ${cp004FrequencyLabel(locale, state.secondFrequency)} ब्याज जोड़ा जाता है। कुल चक्रवृद्धि ब्याज ज्ञात कीजिए।`;
    }
  }

  switch (source.qlId) {
    case "INT-QL-067": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${rule}। ${duration} ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-068": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${rule}। ${duration} ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-069": return `ਇੱਕ ਰਕਮ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${rule}। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-070": return `ਕਿਸੇ ਮੂਲਧਨ ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${duration} ਦਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ${moneyText(interest)} ਹੈ। ${rule}। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-071": return `${moneyText(state.principal)} ਦੀ ਰਕਮ ${duration} ਵਿੱਚ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ${rule}। ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-072": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${rule} ਅਤੇ ਰਕਮ ਵੱਧ ਕੇ ${moneyText(amount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸਮਾਂ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-073": return `${moneyText(state.principal)} ਉੱਤੇ ${directPeriodLabel(locale, state.frequency)} ਦੀ ਵਿਆਜ ਦਰ ${percentText(state.periodicRatePercent)} ਹੈ। ਕੁੱਲ ${cp004PeriodsText(locale, state.periods, state.frequency)} ਬਾਅਦ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-074": return `${moneyText(state.principal)} ਉੱਤੇ ${directPeriodLabel(locale, state.frequency)} ਦੀ ਵਿਆਜ ਦਰ ${percentText(state.periodicRatePercent)} ਹੈ। ਕੁੱਲ ${cp004PeriodsText(locale, state.periods, state.frequency)} ਬਾਅਦ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-075": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, state.years)} ਲਈ ਵਿਆਜ ਇੱਕ ਯੋਜਨਾ ਵਿੱਚ ${cp004FrequencyLabel(locale, state.frequency)} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${cp004FrequencyLabel(locale, state.comparisonFrequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-076": return `ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ${annualRate} ਹੈ ਅਤੇ ਵਿਆਜ ${cp004CreditedTimesText(locale, state.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-077": return `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))} ਹੈ ਅਤੇ ਵਿਆਜ ${cp004CreditedTimesText(locale, state.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-078": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${cp004YearsText(locale, state.years)} ਬਾਅਦ ਰਕਮ ${moneyText(amount)} ਹੈ। ਵਿਆਜ ਸਾਲਾਨਾ, ਛਿਮਾਹੀ, ਤਿਮਾਹੀ ਜਾਂ ਮਹੀਨਾਵਾਰ—ਕਿਸ ਤਰੀਕੇ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਸੀ? ਸਹੀ ਚੋਣ (?) ਕਰੋ।`;
    case "INT-QL-079": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲਾਂ ${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਫਿਰ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-080": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲਾਂ ${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਫਿਰ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-081": return `ਇੱਕ ਰਕਮ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਪਹਿਲਾਂ ${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਫਿਰ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-082": return `${moneyText(state.principal)} ਉੱਤੇ ਪਹਿਲਾਂ ${cp004YearsText(locale, state.fullYears)} ਤੱਕ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਫਿਰ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-083": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਕੁਝ ਪੂਰੇ ਸਾਲਾਂ ਤੱਕ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਫਿਰ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਰਕਮ ${moneyText(brokenAmount)} ਹੈ। ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-084": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲਾਂ ${cp004YearsText(locale, state.firstYears)} ਤੱਕ ${cp004FrequencyLabel(locale, state.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, state.secondYears)} ਤੱਕ ${cp004FrequencyLabel(locale, state.secondFrequency)} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਓ।`;
    case "INT-QL-085": return `${moneyText(state.principal)} ਉੱਤੇ ${annualRate} ਸਾਲਾਨਾ ਦਰ ਹੈ। ਪਹਿਲਾਂ ${cp004YearsText(locale, state.firstYears)} ਤੱਕ ${cp004FrequencyLabel(locale, state.firstFrequency)} ਅਤੇ ਅਗਲੇ ${cp004YearsText(locale, state.secondYears)} ਤੱਕ ${cp004FrequencyLabel(locale, state.secondFrequency)} ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਓ।`;
  }
}

function renderTable(rows: readonly Row[], locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"]): string {
  const headers = locale === "hi-IN"
    ? representation === "BALANCE_RECORD" ? ["खाता रिकॉर्ड", "विवरण"] : representation === "SCHEME_COMPARISON" ? ["समयरेखा/योजना", "विवरण"] : ["जानकारी", "मान"]
    : representation === "BALANCE_RECORD" ? ["ਖਾਤਾ ਰਿਕਾਰਡ", "ਵੇਰਵਾ"] : representation === "SCHEME_COMPARISON" ? ["ਸਮਾਂ-ਰੇਖਾ/ਯੋਜਨਾ", "ਵੇਰਵਾ"] : ["ਜਾਣਕਾਰੀ", "ਮੁੱਲ"];
  return [
    `| ${headers[0]} | ${headers[1]} |`,
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${label} | ${value} |`),
  ].join("\n");
}

function structuredLead(locale: IntCp004LocalizedLocale, representation: IntCp004EnglishFrozenQuestion["representation"], qlId: string): string {
  if (locale === "hi-IN") {
    if (representation === "TERMS_TABLE") return "प्रश्न की जानकारी नीचे दी गई है।";
    if (representation === "BALANCE_RECORD") return "खाते का आरंभिक और अंतिम विवरण नीचे दिया गया है।";
    if (qlId === "INT-QL-075") return "दो ब्याज योजनाओं की तुलना नीचे दी गई है।";
    return "राशि बढ़ने की समयरेखा नीचे दी गई है।";
  }
  if (representation === "TERMS_TABLE") return "ਪ੍ਰਸ਼ਨ ਦੀ ਜਾਣਕਾਰੀ ਹੇਠਾਂ ਦਿੱਤੀ ਗਈ ਹੈ।";
  if (representation === "BALANCE_RECORD") return "ਖਾਤੇ ਦਾ ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਵੇਰਵਾ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (qlId === "INT-QL-075") return "ਦੋ ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਹੇਠਾਂ ਦਿੱਤੀ ਗਈ ਹੈ।";
  return "ਰਕਮ ਵਧਣ ਦੀ ਸਮਾਂ-ਰੇਖਾ ਹੇਠਾਂ ਦਿੱਤੀ ਗਈ ਹੈ।";
}

export function renderCp004EditorialStemV2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  const stem = source.representation === "STANDARD_PROSE"
    ? standardProse(source, locale)
    : `${structuredLead(locale, source.representation, source.qlId)}\n\n${renderTable(stemFacts(source, locale), locale, source.representation)}\n\n${locale === "hi-IN" ? `${questionTarget(source, locale)} ज्ञात कीजिए।` : `${questionTarget(source, locale)} ਪਤਾ ਲਗਾਓ।`}`;
  assertCp004LocalizedText(locale, stem, `${source.qlId}/${source.seed}/${locale}/editorial-v2-stem`);
  return stem;
}

export function cp004EditorialAnswerText(
  locale: IntCp004LocalizedLocale,
  semantic: Cp004AnswerSemantic,
  state: Cp004MathematicalState,
  value: Rational,
): string {
  if (semantic === "MONEY") return moneyText(value);
  if (semantic === "RATE_PERCENT") return percentText(value);
  if (semantic === "FREQUENCY") return cp004FrequencyLabel(locale, asInteger(value) as Cp004Frequency);
  if (state.qlId === "INT-QL-072") return durationFromPeriods(locale, asInteger(value), state.frequency);
  return cp004YearsText(locale, asInteger(value));
}

type FeedbackPair = Readonly<{ hi: string; pa: string }>;

const FEEDBACK: Readonly<Record<string, FeedbackPair>> = Object.freeze({
  CORRECT: {
    hi: "सही। यह विकल्प प्रश्न की सभी ब्याज-शर्तों को पूरा करता है।",
    pa: "ਸਹੀ। ਇਹ ਚੋਣ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਸਾਰੀਆਂ ਵਿਆਜ-ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।",
  },
  USED_SIMPLE_INTEREST: {
    hi: "इस विकल्प में साधारण ब्याज लगाया गया है, जबकि हर अवधि के बाद ब्याज राशि में जुड़ना चाहिए।",
    pa: "ਇਸ ਚੋਣ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਪਰ ਹਰ ਮਿਆਦ ਤੋਂ ਬਾਅਦ ਵਿਆਜ ਰਕਮ ਵਿੱਚ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  MISSED_ONE_PERIOD: {
    hi: "इस गणना में ब्याज जोड़ने की एक अवधि छूट गई है।",
    pa: "ਇਸ ਗਿਣਤੀ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦੀ ਇੱਕ ਮਿਆਦ ਛੁੱਟ ਗਈ ਹੈ।",
  },
  RETURNED_PRINCIPAL: {
    hi: "यह केवल मूलधन है; प्रश्न ब्याज जुड़ने के बाद की कुल राशि पूछता है।",
    pa: "ਇਹ ਕੇਵਲ ਮੂਲਧਨ ਹੈ; ਪ੍ਰਸ਼ਨ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦੀ ਕੁੱਲ ਰਕਮ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_AMOUNT: {
    hi: "यह कुल राशि है, जबकि प्रश्न केवल अर्जित ब्याज पूछता है।",
    pa: "ਇਹ ਕੁੱਲ ਰਕਮ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਕੇਵਲ ਕਮਾਇਆ ਵਿਆਜ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_FINAL_AMOUNT: {
    hi: "अंतिम राशि को ही मूलधन मान लिया गया है; बढ़ोतरी का गुणक हटाना होगा।",
    pa: "ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਹੀ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਵਾਧੇ ਦਾ ਗੁਣਕ ਹਟਾਉਣਾ ਪਵੇਗਾ।",
  },
  REMOVED_ONLY_ONE_PERIOD: {
    hi: "केवल एक अवधि की बढ़ोतरी हटाई गई है, जबकि सभी अवधियों का प्रभाव हटाना है।",
    pa: "ਕੇਵਲ ਇੱਕ ਮਿਆਦ ਦਾ ਵਾਧਾ ਹਟਾਇਆ ਗਿਆ ਹੈ, ਪਰ ਸਾਰੀਆਂ ਮਿਆਦਾਂ ਦਾ ਅਸਰ ਹਟਾਉਣਾ ਹੈ।",
  },
  REVERSED_SIMPLE_INTEREST: {
    hi: "पीछे की गणना में साधारण ब्याज लगाया गया है, जबकि दी गई बढ़ोतरी चक्रवृद्धि है।",
    pa: "ਪਿੱਛੇ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਪਰ ਦਿੱਤਾ ਵਾਧਾ ਚੱਕਰਵੱਧੀ ਹੈ।",
  },
  RETURNED_GIVEN_INTEREST: {
    hi: "दिए गए ब्याज को ही मूलधन मान लिया गया है।",
    pa: "ਦਿੱਤੇ ਵਿਆਜ ਨੂੰ ਹੀ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।",
  },
  USED_SIMPLE_INTEREST_INVERSE: {
    hi: "मूलधन निकालते समय साधारण ब्याज का सूत्र लगाया गया है; यहाँ चक्रवृद्धि गुणक चाहिए।",
    pa: "ਮੂਲਧਨ ਕੱਢਦੇ ਸਮੇਂ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਸੂਤਰ ਲਗਾਇਆ ਗਿਆ ਹੈ; ਇੱਥੇ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਚਾਹੀਦਾ ਹੈ।",
  },
  TREATED_INTEREST_AS_AMOUNT: {
    hi: "चक्रवृद्धि ब्याज को कुल राशि मान लिया गया है; दोनों अलग राशियाँ हैं।",
    pa: "ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨੂੰ ਕੁੱਲ ਰਕਮ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਦੋਵੇਂ ਵੱਖ ਰਕਮਾਂ ਹਨ।",
  },
  RETURNED_PERIOD_RATE: {
    hi: "यह एक अवधि की दर है; प्रश्न पूरे वर्ष की घोषित दर पूछता है।",
    pa: "ਇਹ ਇੱਕ ਮਿਆਦ ਦੀ ਦਰ ਹੈ; ਪ੍ਰਸ਼ਨ ਪੂਰੇ ਸਾਲ ਦੀ ਦੱਸੀ ਦਰ ਪੁੱਛਦਾ ਹੈ।",
  },
  DIVIDED_BY_TOTAL_PERIODS: {
    hi: "वार्षिक दर को एक वर्ष में ब्याज जोड़ने की संख्या से बाँटना चाहिए, कुल अवधियों से नहीं।",
    pa: "ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਇੱਕ ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਵੰਡਣਾ ਚਾਹੀਦਾ ਹੈ, ਕੁੱਲ ਮਿਆਦਾਂ ਨਾਲ ਨਹੀਂ।",
  },
  USED_SIMPLE_RATE: {
    hi: "कुल बढ़ोतरी को साधारण ब्याज मान लिया गया है; हर चरण का चक्रवृद्धि प्रभाव अलग लेना होगा।",
    pa: "ਕੁੱਲ ਵਾਧੇ ਨੂੰ ਸਧਾਰਣ ਵਿਆਜ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਹਰ ਪੜਾਅ ਦਾ ਚੱਕਰਵੱਧੀ ਅਸਰ ਵੱਖ ਲੈਣਾ ਪਵੇਗਾ।",
  },
  ONE_PERIOD_SHORT: {
    hi: "एक अवधि कम लेने पर दी गई अंतिम राशि प्राप्त नहीं होती।",
    pa: "ਇੱਕ ਮਿਆਦ ਘੱਟ ਲੈਣ ਨਾਲ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ ਮਿਲਦੀ।",
  },
  ONE_PERIOD_EXTRA: {
    hi: "एक अतिरिक्त अवधि जोड़ दी गई है, इसलिए राशि अधिक हो गई है।",
    pa: "ਇੱਕ ਵਾਧੂ ਮਿਆਦ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ, ਇਸ ਲਈ ਰਕਮ ਵੱਧ ਗਈ ਹੈ।",
  },
  MULTIPLIED_PERIODS_BY_FREQUENCY: {
    hi: "अवधियों की संख्या को दोबारा वार्षिक संख्या से गुणा किया गया है; इससे समय बढ़ जाता है।",
    pa: "ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਮੁੜ ਸਾਲਾਨਾ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਇਸ ਨਾਲ ਸਮਾਂ ਵੱਧ ਜਾਂਦਾ ਹੈ।",
  },
  ASSUMED_NO_FREQUENCY_EFFECT: {
    hi: "ब्याज कितनी बार जोड़ा जाता है, इससे अंतिम राशि बदलती है।",
    pa: "ਵਿਆਜ ਕਿੰਨੀ ਵਾਰ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਨਾਲ ਅੰਤਿਮ ਰਕਮ ਬਦਲਦੀ ਹੈ।",
  },
  RETURNED_ONE_AMOUNT: {
    hi: "यह किसी एक योजना की पूरी राशि है; प्रश्न दोनों राशियों का अंतर पूछता है।",
    pa: "ਇਹ ਕਿਸੇ ਇੱਕ ਯੋਜਨਾ ਦੀ ਪੂਰੀ ਰਕਮ ਹੈ; ਪ੍ਰਸ਼ਨ ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_NOMINAL_RATE: {
    hi: "यह घोषित वार्षिक दर है; प्रश्न एक वर्ष की वास्तविक प्रतिशत बढ़ोतरी पूछता है।",
    pa: "ਇਹ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਹੈ; ਪ੍ਰਸ਼ਨ ਇੱਕ ਸਾਲ ਦੀ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪੁੱਛਦਾ ਹੈ।",
  },
  ADDED_ONE_CREDITING_PERIOD: {
    hi: "एक वर्ष में ब्याज जोड़ने की संख्या से एक अतिरिक्त चरण जोड़ दिया गया है।",
    pa: "ਇੱਕ ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਵਾਧੂ ਪੜਾਅ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  },
  RETURNED_EFFECTIVE_RATE: {
    hi: "यह प्रभावी वार्षिक दर है; प्रश्न घोषित वार्षिक दर पूछता है।",
    pa: "ਇਹ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਹੈ; ਪ੍ਰਸ਼ਨ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਪੁੱਛਦਾ ਹੈ।",
  },
  MULTIPLIED_EFFECTIVE_RATE: {
    hi: "प्रभावी दर को अवधियों की संख्या से गुणा किया गया है; प्रभावी दर पहले ही पूरे वर्ष की बढ़ोतरी है।",
    pa: "ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਪ੍ਰਭਾਵੀ ਦਰ ਪਹਿਲਾਂ ਹੀ ਪੂਰੇ ਸਾਲ ਦਾ ਵਾਧਾ ਹੈ।",
  },
  IGNORED_TAIL: {
    hi: "अंतिम अतिरिक्त महीनों का साधारण ब्याज छोड़ दिया गया है।",
    pa: "ਅਖੀਰਲੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  },
  COMPOUNDED_TAIL_MONTHLY: {
    hi: "अंतिम महीनों में मासिक चक्रवृद्धि कर दी गई है, जबकि प्रश्न वहाँ साधारण ब्याज कहता है।",
    pa: "ਅਖੀਰਲੇ ਮਹੀਨਿਆਂ ਵਿੱਚ ਮਹੀਨਾਵਾਰ ਚੱਕਰਵੱਧੀ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ, ਪਰ ਪ੍ਰਸ਼ਨ ਉੱਥੇ ਸਧਾਰਣ ਵਿਆਜ ਕਹਿੰਦਾ ਹੈ।",
  },
  TAIL_INTEREST_ON_ORIGINAL_PRINCIPAL: {
    hi: "अंतिम महीनों का ब्याज मूलधन पर लगाया गया है; उसे पूरे वर्षों के बाद बनी राशि पर लगाना चाहिए।",
    pa: "ਅਖੀਰਲੇ ਮਹੀਨਿਆਂ ਦਾ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ; ਇਹ ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  SUBTRACTED_TAIL_FROM_FINAL_AMOUNT: {
    hi: "अंतिम महीनों की बढ़ोतरी को उलटने के बजाय सीधे अंतिम राशि से घटाया गया है।",
    pa: "ਅਖੀਰਲੇ ਮਹੀਨਿਆਂ ਦਾ ਵਾਧਾ ਉਲਟਣ ਦੀ ਥਾਂ ਸਿੱਧਾ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਘਟਾਇਆ ਗਿਆ ਹੈ।",
  },
  RETURNED_MONTHLY_RATE: {
    hi: "यह एक महीने की दर है; प्रश्न वार्षिक दर पूछता है।",
    pa: "ਇਹ ਇੱਕ ਮਹੀਨੇ ਦੀ ਦਰ ਹੈ; ਪ੍ਰਸ਼ਨ ਸਾਲਾਨਾ ਦਰ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_TAIL_PERIOD_RATE: {
    hi: "यह केवल अंतिम अतिरिक्त महीनों में लगने वाला प्रतिशत है; वार्षिक दर नहीं।",
    pa: "ਇਹ ਕੇਵਲ ਅਖੀਰਲੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਵਿੱਚ ਲੱਗਣ ਵਾਲਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ; ਸਾਲਾਨਾ ਦਰ ਨਹੀਂ।",
  },
  IGNORED_COMPLETE_YEARS: {
    hi: "पूरे वर्षों का चक्रवृद्धि चरण छोड़ दिया गया है।",
    pa: "ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  },
  ONE_YEAR_EXTRA: {
    hi: "एक पूरा वर्ष अधिक ले लिया गया है, इसलिए अंतिम राशि अधिक हो गई है।",
    pa: "ਇੱਕ ਪੂਰਾ ਸਾਲ ਵੱਧ ਲਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਅੰਤਿਮ ਰਕਮ ਵੱਧ ਗਈ ਹੈ।",
  },
  COUNTED_TAIL_AS_EXTRA_YEARS: {
    hi: "अतिरिक्त महीनों को पूरे वर्ष मान लिया गया है।",
    pa: "ਵਾਧੂ ਮਹੀਨਿਆਂ ਨੂੰ ਪੂਰੇ ਸਾਲ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।",
  },
  USED_FIRST_FREQUENCY_THROUGHOUT: {
    hi: "पहले चरण का ब्याज-अंतराल पूरी अवधि पर लगा दिया गया है; दूसरे चरण का नियम अलग है।",
    pa: "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਵਿਆਜ-ਅੰਤਰਾਲ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਦੂਜੇ ਪੜਾਅ ਦਾ ਨਿਯਮ ਵੱਖ ਹੈ।",
  },
  USED_SECOND_FREQUENCY_THROUGHOUT: {
    hi: "दूसरे चरण का ब्याज-अंतराल पूरी अवधि पर लगा दिया गया है; पहले चरण का नियम अलग है।",
    pa: "ਦੂਜੇ ਪੜਾਅ ਦਾ ਵਿਆਜ-ਅੰਤਰਾਲ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਨਿਯਮ ਵੱਖ ਹੈ।",
  },
  USED_SIMPLE_INTEREST_THROUGHOUT: {
    hi: "दोनों चरणों में साधारण ब्याज लगा दिया गया है, जबकि प्रश्न चक्रवृद्धि ब्याज देता है।",
    pa: "ਦੋਵਾਂ ਪੜਾਵਾਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਪਰ ਪ੍ਰਸ਼ਨ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਿੰਦਾ ਹੈ।",
  },
});

function assumedFrequencyFeedback(locale: IntCp004LocalizedLocale, misconceptionId: string): string | undefined {
  const match = /^ASSUMED_(1|2|4|12)_PER_YEAR$/u.exec(misconceptionId);
  if (!match) return undefined;
  const label = cp004FrequencyLabel(locale, Number(match[1]) as Cp004Frequency);
  return locale === "hi-IN"
    ? `${label} ब्याज जोड़ने पर प्रश्न में दी गई अंतिम राशि प्राप्त नहीं होती।`
    : `${label} ਵਿਆਜ ਜੋੜਨ ਨਾਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ ਮਿਲਦੀ।`;
}

export function cp004EditorialFeedback(locale: IntCp004LocalizedLocale, misconceptionId: string): string {
  const dynamic = assumedFrequencyFeedback(locale, misconceptionId);
  if (dynamic) return dynamic;
  const pair = FEEDBACK[misconceptionId];
  if (!pair) {
    return locale === "hi-IN"
      ? "यह विकल्प प्रश्न में दी गई ब्याज-शर्तों के अनुसार नहीं बनता।"
      : "ਇਹ ਚੋਣ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀਆਂ ਵਿਆਜ-ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਨਹੀਂ ਬਣਦੀ।";
  }
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

export function localizeCp004OptionsEditorialV2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  return Object.freeze(source.options.map((option) => {
    const text = cp004EditorialAnswerText(locale, source.answerSemantic, source.mathematicalState, option.value);
    const feedback = cp004EditorialFeedback(locale, option.misconceptionId);
    assertCp004LocalizedText(locale, feedback, `${source.qlId}/${source.seed}/${option.id}/editorial-v2-feedback`);
    return Object.freeze({ ...option, text, feedback });
  }));
}

export function frequencyCandidateAmounts(source: IntCp004EnglishFrozenQuestion): readonly Readonly<{ frequency: Cp004Frequency; amount: Rational }>[] {
  const state = source.mathematicalState;
  return Object.freeze(FREQUENCIES.map((frequency) => Object.freeze({
    frequency,
    amount: completeAmountFromNominal(
      state.principal,
      state.nominalAnnualRatePercent,
      frequency,
      frequency * state.years,
    ),
  })));
}
