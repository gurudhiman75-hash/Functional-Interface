import {
  add,
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  div,
  effectiveAnnualRate,
  mixedAmountForState,
  mul,
  periodicAmountForState,
  periodicRate,
  rat,
  sub,
  type Cp004Frequency,
  type Rational,
} from "./cp004-frequency-math";
import { decimal, moneyText, percentText } from "./cp004-frequency-options";
import {
  cp004FrequencyIntervalText,
  cp004FrequencyLabel,
} from "./cp004-localization-language-pack";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_SIMPLE_EXPLANATION_V8_VERSION =
  "INT-CP-004-HI-PA-SIMPLE-EXPLANATIONS-v8" as const;

function compactDecimal(value: Rational, places = 6): string {
  return decimal(value, places).replace(/\.?0+$/u, "");
}

function multiplier(ratePercent: Rational): Rational {
  return add(rat(1), div(ratePercent, rat(100)));
}

function amountLine(
  locale: IntCp004LocalizedLocale,
  principal: Rational,
  ratePercent: Rational,
  periods: number,
  amount: Rational,
): string {
  const factor = compactDecimal(multiplier(ratePercent));
  const power = periods === 1 ? factor : `${factor}^${periods}`;
  return locale === "hi-IN"
    ? `राशि = ${moneyText(principal)} × ${power} = ${moneyText(amount)}।`
    : `ਰਕਮ = ${moneyText(principal)} × ${power} = ${moneyText(amount)}।`;
}

function rateLine(
  locale: IntCp004LocalizedLocale,
  annualRate: Rational,
  frequency: Cp004Frequency,
): string {
  const periodRate = periodicRate(annualRate, frequency);
  const label = cp004FrequencyLabel(locale, frequency);
  if (frequency === 1) {
    return locale === "hi-IN"
      ? `सालाना दर = ${percentText(annualRate)}।`
      : `ਸਾਲਾਨਾ ਦਰ = ${percentText(annualRate)}।`;
  }
  return locale === "hi-IN"
    ? `${label} दर = ${percentText(annualRate)} ÷ ${frequency} = ${percentText(periodRate)}।`
    : `${label} ਦਰ = ${percentText(annualRate)} ÷ ${frequency} = ${percentText(periodRate)}।`;
}

function directRateLine(
  locale: IntCp004LocalizedLocale,
  rate: Rational,
  frequency: Cp004Frequency,
): string {
  const label = cp004FrequencyLabel(locale, frequency);
  return locale === "hi-IN"
    ? `${label} दर सीधे ${percentText(rate)} दी गई है।`
    : `${label} ਦਰ ਸਿੱਧੀ ${percentText(rate)} ਦਿੱਤੀ ਹੈ।`;
}

function countLine(locale: IntCp004LocalizedLocale, periods: number): string {
  return locale === "hi-IN"
    ? `${periods} बार ब्याज जुड़ेगा।`
    : `${periods} ਵਾਰ ਵਿਆਜ ਜੁੜੇਗਾ।`;
}

function durationText(
  locale: IntCp004LocalizedLocale,
  periods: number,
  frequency: Cp004Frequency,
): string {
  const months = periods * (12 / frequency);
  if (months % 12 === 0) {
    const years = months / 12;
    return locale === "hi-IN"
      ? `${years} वर्ष`
      : `${years} ਸਾਲ`;
  }
  return locale === "hi-IN"
    ? `${months} महीने`
    : `${months} ਮਹੀਨੇ`;
}

function shortTask(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-073":
      case "INT-QL-079":
      case "INT-QL-084":
        return "कुल राशि निकालनी है।";
      case "INT-QL-068":
      case "INT-QL-074":
      case "INT-QL-085":
        return "चक्रवृद्धि ब्याज निकालना है।";
      case "INT-QL-069":
      case "INT-QL-070":
      case "INT-QL-081":
        return "मूलधन निकालना है।";
      case "INT-QL-071":
      case "INT-QL-077":
      case "INT-QL-082":
        return "वार्षिक ब्याज दर निकालनी है।";
      case "INT-QL-072":
        return "समय निकालना है।";
      case "INT-QL-075":
        return "दोनों राशियों का अंतर निकालना है।";
      case "INT-QL-076":
        return "प्रभावी वार्षिक दर निकालनी है।";
      case "INT-QL-078":
        return "ब्याज कितनी बार जुड़ता है, यह पता करना है।";
      case "INT-QL-080":
        return "कुल ब्याज निकालना है।";
      case "INT-QL-083":
        return "पूरे वर्षों की संख्या निकालनी है।";
    }
  }

  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-073":
    case "INT-QL-079":
    case "INT-QL-084":
      return "ਕੁੱਲ ਰਕਮ ਕੱਢਣੀ ਹੈ।";
    case "INT-QL-068":
    case "INT-QL-074":
    case "INT-QL-085":
      return "ਮਿਸ਼ਰਤ ਵਿਆਜ ਕੱਢਣਾ ਹੈ।";
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-081":
      return "ਮੂਲਧਨ ਕੱਢਣਾ ਹੈ।";
    case "INT-QL-071":
    case "INT-QL-077":
    case "INT-QL-082":
      return "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕੱਢਣੀ ਹੈ।";
    case "INT-QL-072":
      return "ਸਮਾਂ ਕੱਢਣਾ ਹੈ।";
    case "INT-QL-075":
      return "ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢਣਾ ਹੈ।";
    case "INT-QL-076":
      return "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢਣੀ ਹੈ।";
    case "INT-QL-078":
      return "ਵਿਆਜ ਕਿੰਨੀ ਵਾਰ ਜੁੜਦਾ ਹੈ, ਇਹ ਪਤਾ ਕਰਨਾ ਹੈ।";
    case "INT-QL-080":
      return "ਕੁੱਲ ਵਿਆਜ ਕੱਢਣਾ ਹੈ।";
    case "INT-QL-083":
      return "ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢਣੀ ਹੈ।";
  }
  throw new Error(`${source.qlId}/${locale}: unsupported simple task.`);
}

function finalAnswer(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  correctAnswer: string,
): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-073":
      case "INT-QL-079":
      case "INT-QL-084":
        return `उत्तर: कुल राशि ${correctAnswer}।`;
      case "INT-QL-068":
      case "INT-QL-074":
      case "INT-QL-085":
        return `उत्तर: चक्रवृद्धि ब्याज ${correctAnswer}।`;
      case "INT-QL-069":
      case "INT-QL-070":
      case "INT-QL-081":
        return `उत्तर: मूलधन ${correctAnswer}।`;
      case "INT-QL-071":
      case "INT-QL-077":
      case "INT-QL-082":
        return `उत्तर: वार्षिक दर ${correctAnswer}।`;
      case "INT-QL-072":
      case "INT-QL-083":
        return `उत्तर: समय ${correctAnswer}।`;
      case "INT-QL-075":
        return `उत्तर: अंतर ${correctAnswer}।`;
      case "INT-QL-076":
        return `उत्तर: प्रभावी वार्षिक दर ${correctAnswer}।`;
      case "INT-QL-078":
        return `उत्तर: ${correctAnswer}।`;
      case "INT-QL-080":
        return `उत्तर: कुल ब्याज ${correctAnswer}।`;
    }
  }

  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-073":
    case "INT-QL-079":
    case "INT-QL-084":
      return `ਉੱਤਰ: ਕੁੱਲ ਰਕਮ ${correctAnswer}।`;
    case "INT-QL-068":
    case "INT-QL-074":
    case "INT-QL-085":
      return `ਉੱਤਰ: ਮਿਸ਼ਰਤ ਵਿਆਜ ${correctAnswer}।`;
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-081":
      return `ਉੱਤਰ: ਮੂਲਧਨ ${correctAnswer}।`;
    case "INT-QL-071":
    case "INT-QL-077":
    case "INT-QL-082":
      return `ਉੱਤਰ: ਸਾਲਾਨਾ ਦਰ ${correctAnswer}।`;
    case "INT-QL-072":
    case "INT-QL-083":
      return `ਉੱਤਰ: ਸਮਾਂ ${correctAnswer}।`;
    case "INT-QL-075":
      return `ਉੱਤਰ: ਅੰਤਰ ${correctAnswer}।`;
    case "INT-QL-076":
      return `ਉੱਤਰ: ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${correctAnswer}।`;
    case "INT-QL-078":
      return `ਉੱਤਰ: ${correctAnswer}।`;
    case "INT-QL-080":
      return `ਉੱਤਰ: ਕੁੱਲ ਵਿਆਜ ${correctAnswer}।`;
  }
  throw new Error(`${source.qlId}/${locale}: unsupported simple final answer.`);
}

function commonMistake(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  const s = source.mathematicalState;
  const interval = cp004FrequencyIntervalText(locale, s.frequency);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-068":
      case "INT-QL-069":
      case "INT-QL-070":
      case "INT-QL-071":
      case "INT-QL-072":
        return `ध्यान रखें: वार्षिक दर को सीधे न लगाएँ; पहले ${interval} की दर निकालें।`;
      case "INT-QL-073":
      case "INT-QL-074":
        return `ध्यान रखें: ${percentText(s.periodicRatePercent)} पहले से ${cp004FrequencyLabel(locale, s.frequency)} दर है; इसे फिर से न बाँटें।`;
      case "INT-QL-075":
        return "ध्यान रखें: दोनों योजनाओं में मूलधन, दर और समय समान हैं; केवल ब्याज जोड़ने का अंतराल बदलता है।";
      case "INT-QL-076":
        return "ध्यान रखें: घोषित वार्षिक दर और एक साल की वास्तविक बढ़ोतरी अलग हो सकती हैं।";
      case "INT-QL-077":
        return "ध्यान रखें: प्रभावी दर को सीधे भाग देकर वार्षिक दर नहीं मिलती; सही दर से एक साल की राशि मिलाएँ।";
      case "INT-QL-078":
        return "ध्यान रखें: अनुमान न लगाएँ; जिस अंतराल से दी हुई राशि मिलती है, वही सही है।";
      case "INT-QL-079":
      case "INT-QL-080":
      case "INT-QL-081":
      case "INT-QL-082":
      case "INT-QL-083":
        return "ध्यान रखें: अतिरिक्त महीनों का साधारण ब्याज, पूरे वर्षों के बाद बनी राशि पर लगता है।";
      case "INT-QL-084":
      case "INT-QL-085":
        return "ध्यान रखें: दूसरा चरण पहले चरण के बाद बनी राशि से शुरू होता है।";
    }
  }

  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-069":
    case "INT-QL-070":
    case "INT-QL-071":
    case "INT-QL-072":
      return `ਧਿਆਨ ਰੱਖੋ: ਸਾਲਾਨਾ ਦਰ ਸਿੱਧੀ ਨਾ ਲਗਾਓ; ਪਹਿਲਾਂ ${interval} ਦੀ ਦਰ ਕੱਢੋ।`;
    case "INT-QL-073":
    case "INT-QL-074":
      return `ਧਿਆਨ ਰੱਖੋ: ${percentText(s.periodicRatePercent)} ਪਹਿਲਾਂ ਹੀ ${cp004FrequencyLabel(locale, s.frequency)} ਦਰ ਹੈ; ਇਸ ਨੂੰ ਮੁੜ ਨਾ ਵੰਡੋ।`;
    case "INT-QL-075":
      return "ਧਿਆਨ ਰੱਖੋ: ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਮੂਲਧਨ, ਦਰ ਅਤੇ ਸਮਾਂ ਇੱਕੋ ਹਨ; ਸਿਰਫ਼ ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ ਬਦਲਦਾ ਹੈ।";
    case "INT-QL-076":
      return "ਧਿਆਨ ਰੱਖੋ: ਲਿਖੀ ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਇੱਕ ਸਾਲ ਦਾ ਅਸਲ ਵਾਧਾ ਵੱਖ ਹੋ ਸਕਦੇ ਹਨ।";
    case "INT-QL-077":
      return "ਧਿਆਨ ਰੱਖੋ: ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਸਿੱਧਾ ਵੰਡ ਕੇ ਸਾਲਾਨਾ ਦਰ ਨਹੀਂ ਮਿਲਦੀ; ਸਹੀ ਦਰ ਨਾਲ ਇੱਕ ਸਾਲ ਦੀ ਰਕਮ ਮਿਲਾਓ।";
    case "INT-QL-078":
      return "ਧਿਆਨ ਰੱਖੋ: ਅੰਦਾਜ਼ਾ ਨਾ ਲਗਾਓ; ਜਿਸ ਅੰਤਰਾਲ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲੇ, ਉਹੀ ਸਹੀ ਹੈ।";
    case "INT-QL-079":
    case "INT-QL-080":
    case "INT-QL-081":
    case "INT-QL-082":
    case "INT-QL-083":
      return "ਧਿਆਨ ਰੱਖੋ: ਵਾਧੂ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ, ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਉੱਤੇ ਲੱਗਦਾ ਹੈ।";
    case "INT-QL-084":
    case "INT-QL-085":
      return "ਧਿਆਨ ਰੱਖੋ: ਦੂਜਾ ਪੜਾਅ ਪਹਿਲੇ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਬਣੀ ਰਕਮ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।";
  }
  throw new Error(`${source.qlId}/${locale}: unsupported simple common mistake.`);
}

function simpleSteps(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): readonly string[] {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const periodRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const interest = sub(amount, s.principal);

  switch (source.qlId) {
    case "INT-QL-067":
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        countLine(locale, s.periods),
        amountLine(locale, s.principal, periodRate, s.periods, amount),
      ]);

    case "INT-QL-068":
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        amountLine(locale, s.principal, periodRate, s.periods, amount),
        locale === "hi-IN"
          ? `ब्याज = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(interest)}।`
          : `ਵਿਆਜ = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(interest)}।`,
      ]);

    case "INT-QL-069": {
      const totalPercent = mul(div(amount, s.principal), rat(100));
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        locale === "hi-IN"
          ? `${s.periods} बार ब्याज जुड़ने पर अंतिम राशि मूलधन की ${percentText(totalPercent)} हो जाती है।`
          : `${s.periods} ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਮੂਲਧਨ ਦੀ ${percentText(totalPercent)} ਹੋ ਜਾਂਦੀ ਹੈ।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(amount)} × 100 ÷ ${compactDecimal(totalPercent, 4)} = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(amount)} × 100 ÷ ${compactDecimal(totalPercent, 4)} = ${moneyText(s.principal)}।`,
      ]);
    }

    case "INT-QL-070": {
      const growthPercent = mul(div(interest, s.principal), rat(100));
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        locale === "hi-IN"
          ? `${s.periods} बार ब्याज जुड़ने पर कुल बढ़ोतरी ${percentText(growthPercent)} होती है।`
          : `${s.periods} ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਵਾਧਾ ${percentText(growthPercent)} ਹੁੰਦਾ ਹੈ।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(interest)} × 100 ÷ ${compactDecimal(growthPercent, 4)} = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(interest)} × 100 ÷ ${compactDecimal(growthPercent, 4)} = ${moneyText(s.principal)}।`,
      ]);
    }

    case "INT-QL-071":
      return Object.freeze([
        locale === "hi-IN"
          ? `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर रखने पर ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`
          : `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਰੱਖਣ ਉੱਤੇ ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`,
        amountLine(locale, s.principal, periodRate, s.periods, amount),
        locale === "hi-IN"
          ? `यह प्रश्न की राशि ${moneyText(amount)} से मिलती है, इसलिए वार्षिक दर ${percentText(s.nominalAnnualRatePercent)} है।`
          : `ਇਹ ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ${moneyText(amount)} ਨਾਲ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`,
      ]);

    case "INT-QL-072":
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        amountLine(locale, s.principal, periodRate, s.periods, amount),
        locale === "hi-IN"
          ? `${s.periods} बार ब्याज जुड़ना = ${durationText(locale, s.periods, s.frequency)}।`
          : `${s.periods} ਵਾਰ ਵਿਆਜ ਜੁੜਨਾ = ${durationText(locale, s.periods, s.frequency)}।`,
      ]);

    case "INT-QL-073": {
      const periodicAmount = periodicAmountForState(s);
      return Object.freeze([
        directRateLine(locale, s.periodicRatePercent, s.frequency),
        countLine(locale, s.periods),
        amountLine(locale, s.principal, s.periodicRatePercent, s.periods, periodicAmount),
      ]);
    }

    case "INT-QL-074": {
      const periodicAmount = periodicAmountForState(s);
      const periodicInterest = sub(periodicAmount, s.principal);
      return Object.freeze([
        directRateLine(locale, s.periodicRatePercent, s.frequency),
        amountLine(locale, s.principal, s.periodicRatePercent, s.periods, periodicAmount),
        locale === "hi-IN"
          ? `ब्याज = ${moneyText(periodicAmount)} − ${moneyText(s.principal)} = ${moneyText(periodicInterest)}।`
          : `ਵਿਆਜ = ${moneyText(periodicAmount)} − ${moneyText(s.principal)} = ${moneyText(periodicInterest)}।`,
      ]);
    }

    case "INT-QL-075": {
      const firstPeriods = s.frequency * s.years;
      const secondPeriods = s.comparisonFrequency * s.years;
      const firstRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
      const secondRate = periodicRate(s.nominalAnnualRatePercent, s.comparisonFrequency);
      const firstAmount = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        s.frequency,
        firstPeriods,
      );
      const secondAmount = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        s.comparisonFrequency,
        secondPeriods,
      );
      const difference = source.solution;
      const larger = firstAmount.numerator * secondAmount.denominator >= secondAmount.numerator * firstAmount.denominator
        ? firstAmount
        : secondAmount;
      const smaller = larger === firstAmount ? secondAmount : firstAmount;
      return Object.freeze([
        locale === "hi-IN"
          ? `${cp004FrequencyLabel(locale, s.frequency)} योजना: दर ${percentText(firstRate)}, ${firstPeriods} बार ब्याज जोड़ने पर राशि ${moneyText(firstAmount)}।`
          : `${cp004FrequencyLabel(locale, s.frequency)} ਯੋਜਨਾ: ਦਰ ${percentText(firstRate)}, ${firstPeriods} ਵਾਰ ਵਿਆਜ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਰਕਮ ${moneyText(firstAmount)}।`,
        locale === "hi-IN"
          ? `${cp004FrequencyLabel(locale, s.comparisonFrequency)} योजना: दर ${percentText(secondRate)}, ${secondPeriods} बार ब्याज जोड़ने पर राशि ${moneyText(secondAmount)}।`
          : `${cp004FrequencyLabel(locale, s.comparisonFrequency)} ਯੋਜਨਾ: ਦਰ ${percentText(secondRate)}, ${secondPeriods} ਵਾਰ ਵਿਆਜ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਰਕਮ ${moneyText(secondAmount)}।`,
        locale === "hi-IN"
          ? `अंतर = ${moneyText(larger)} − ${moneyText(smaller)} = ${moneyText(difference)}।`
          : `ਅੰਤਰ = ${moneyText(larger)} − ${moneyText(smaller)} = ${moneyText(difference)}।`,
      ]);
    }

    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const amountOnHundred = completeAmountFromNominal(
        rat(100),
        s.nominalAnnualRatePercent,
        s.frequency,
        s.frequency,
      );
      return Object.freeze([
        rateLine(locale, s.nominalAnnualRatePercent, s.frequency),
        amountLine(locale, rat(100), periodRate, s.frequency, amountOnHundred),
        locale === "hi-IN"
          ? `₹100 में बढ़ोतरी ${moneyText(effective)} है, यानी प्रभावी वार्षिक दर ${percentText(effective)}।`
          : `₹100 ਵਿੱਚ ਵਾਧਾ ${moneyText(effective)} ਹੈ, ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effective)}।`,
      ]);
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const amountOnHundred = completeAmountFromNominal(
        rat(100),
        s.nominalAnnualRatePercent,
        s.frequency,
        s.frequency,
      );
      return Object.freeze([
        locale === "hi-IN"
          ? `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर रखने पर ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`
          : `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਰੱਖਣ ਉੱਤੇ ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`,
        amountLine(locale, rat(100), periodRate, s.frequency, amountOnHundred),
        locale === "hi-IN"
          ? `₹100 की बढ़ोतरी ${moneyText(effective)} = ${percentText(effective)} है; यह प्रश्न से मिलती है।`
          : `₹100 ਦਾ ਵਾਧਾ ${moneyText(effective)} = ${percentText(effective)} ਹੈ; ਇਹ ਪ੍ਰਸ਼ਨ ਨਾਲ ਮਿਲਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-078": {
      const correctPeriods = s.frequency * s.years;
      return Object.freeze([
        locale === "hi-IN"
          ? `${cp004FrequencyLabel(locale, s.frequency)} मानें: ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`
          : `${cp004FrequencyLabel(locale, s.frequency)} ਮੰਨੋ: ${rateLine(locale, s.nominalAnnualRatePercent, s.frequency).replace(/।$/u, "")}।`,
        amountLine(locale, s.principal, periodRate, correctPeriods, amount),
        locale === "hi-IN"
          ? `यही प्रश्न की राशि ${moneyText(amount)} है, इसलिए ब्याज ${cp004FrequencyIntervalText(locale, s.frequency)} जुड़ता है।`
          : `ਇਹੀ ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ${moneyText(amount)} ਹੈ, ਇਸ ਲਈ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੁੜਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-079":
    case "INT-QL-080": {
      const afterWholeYears = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        1,
        s.fullYears,
      );
      const tailInterest = mul(
        afterWholeYears,
        mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)),
      );
      const brokenAmount = brokenAmountForState(s);
      const steps = [
        locale === "hi-IN"
          ? `${s.fullYears} वर्ष बाद राशि = ${moneyText(s.principal)} × ${compactDecimal(multiplier(s.nominalAnnualRatePercent))}${s.fullYears === 1 ? "" : `^${s.fullYears}`} = ${moneyText(afterWholeYears)}।`
          : `${s.fullYears} ਸਾਲ ਬਾਅਦ ਰਕਮ = ${moneyText(s.principal)} × ${compactDecimal(multiplier(s.nominalAnnualRatePercent))}${s.fullYears === 1 ? "" : `^${s.fullYears}`} = ${moneyText(afterWholeYears)}।`,
        locale === "hi-IN"
          ? `अगले ${s.tailMonths} महीने का साधारण ब्याज = ${moneyText(afterWholeYears)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`
          : `ਅਗਲੇ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(afterWholeYears)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`,
        locale === "hi-IN"
          ? `कुल राशि = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।`
          : `ਕੁੱਲ ਰਕਮ = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।`,
      ];
      if (source.qlId === "INT-QL-080") {
        steps.push(locale === "hi-IN"
          ? `कुल ब्याज = ${moneyText(brokenAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(brokenAmount, s.principal))}।`
          : `ਕੁੱਲ ਵਿਆਜ = ${moneyText(brokenAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(brokenAmount, s.principal))}।`);
      }
      return Object.freeze(steps);
    }

    case "INT-QL-081": {
      const brokenAmount = brokenAmountForState(s);
      const tailRatePercent = mul(s.nominalAnnualRatePercent, rat(s.tailMonths, 12));
      const tailMultiplier = multiplier(tailRatePercent);
      const beforeTail = div(brokenAmount, tailMultiplier);
      const annualMultiplier = multiplier(s.nominalAnnualRatePercent);
      return Object.freeze([
        locale === "hi-IN"
          ? `अंतिम ${s.tailMonths} महीनों में साधारण ब्याज ${percentText(tailRatePercent)} लगा।`
          : `ਅੰਤਿਮ ${s.tailMonths} ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ${percentText(tailRatePercent)} ਲੱਗਿਆ।`,
        locale === "hi-IN"
          ? `उससे पहले की राशि = ${moneyText(brokenAmount)} ÷ ${compactDecimal(tailMultiplier)} = ${moneyText(beforeTail)}।`
          : `ਉਸ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਰਕਮ = ${moneyText(brokenAmount)} ÷ ${compactDecimal(tailMultiplier)} = ${moneyText(beforeTail)}।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(beforeTail)} ÷ ${compactDecimal(annualMultiplier)}${s.fullYears === 1 ? "" : `^${s.fullYears}`} = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(beforeTail)} ÷ ${compactDecimal(annualMultiplier)}${s.fullYears === 1 ? "" : `^${s.fullYears}`} = ${moneyText(s.principal)}।`,
      ]);
    }

    case "INT-QL-082": {
      const afterWholeYears = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        1,
        s.fullYears,
      );
      const tailInterest = mul(
        afterWholeYears,
        mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)),
      );
      const brokenAmount = brokenAmountForState(s);
      return Object.freeze([
        locale === "hi-IN"
          ? `${percentText(s.nominalAnnualRatePercent)} वार्षिक दर रखें: ${s.fullYears} वर्ष बाद राशि ${moneyText(afterWholeYears)}।`
          : `${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਰੱਖੋ: ${s.fullYears} ਸਾਲ ਬਾਅਦ ਰਕਮ ${moneyText(afterWholeYears)}।`,
        locale === "hi-IN"
          ? `अगले ${s.tailMonths} महीने का साधारण ब्याज = ${moneyText(tailInterest)}।`
          : `ਅਗਲੇ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(tailInterest)}।`,
        locale === "hi-IN"
          ? `कुल = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; यह प्रश्न की राशि है।`
          : `ਕੁੱਲ = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; ਇਹ ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ਹੈ।`,
      ]);
    }

    case "INT-QL-083": {
      const afterWholeYears = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        1,
        s.fullYears,
      );
      const tailInterest = mul(
        afterWholeYears,
        mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)),
      );
      const brokenAmount = brokenAmountForState(s);
      return Object.freeze([
        locale === "hi-IN"
          ? `${s.fullYears} वर्ष मानें: उस समय राशि ${moneyText(afterWholeYears)}।`
          : `${s.fullYears} ਸਾਲ ਮੰਨੋ: ਉਸ ਵੇਲੇ ਰਕਮ ${moneyText(afterWholeYears)}।`,
        locale === "hi-IN"
          ? `अगले ${s.tailMonths} महीने का साधारण ब्याज = ${moneyText(tailInterest)}।`
          : `ਅਗਲੇ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(tailInterest)}।`,
        locale === "hi-IN"
          ? `कुल = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; राशि मिल गई।`
          : `ਕੁੱਲ = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; ਰਕਮ ਮਿਲ ਗਈ।`,
      ]);
    }

    case "INT-QL-084":
    case "INT-QL-085": {
      const firstPeriods = s.firstFrequency * s.firstYears;
      const secondPeriods = s.secondFrequency * s.secondYears;
      const firstRate = periodicRate(s.nominalAnnualRatePercent, s.firstFrequency);
      const secondRate = periodicRate(s.nominalAnnualRatePercent, s.secondFrequency);
      const firstAmount = completeAmountFromNominal(
        s.principal,
        s.nominalAnnualRatePercent,
        s.firstFrequency,
        firstPeriods,
      );
      const finalAmount = mixedAmountForState(s);
      const firstFactor = compactDecimal(multiplier(firstRate));
      const secondFactor = compactDecimal(multiplier(secondRate));
      const steps = [
        locale === "hi-IN"
          ? `पहला चरण: ${moneyText(s.principal)} × ${firstFactor}${firstPeriods === 1 ? "" : `^${firstPeriods}`} = ${moneyText(firstAmount)}।`
          : `ਪਹਿਲਾ ਪੜਾਅ: ${moneyText(s.principal)} × ${firstFactor}${firstPeriods === 1 ? "" : `^${firstPeriods}`} = ${moneyText(firstAmount)}।`,
        locale === "hi-IN"
          ? `दूसरा चरण: ${moneyText(firstAmount)} × ${secondFactor}${secondPeriods === 1 ? "" : `^${secondPeriods}`} = ${moneyText(finalAmount)}।`
          : `ਦੂਜਾ ਪੜਾਅ: ${moneyText(firstAmount)} × ${secondFactor}${secondPeriods === 1 ? "" : `^${secondPeriods}`} = ${moneyText(finalAmount)}।`,
      ];
      if (source.qlId === "INT-QL-085") {
        steps.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`
          : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`);
      }
      return Object.freeze(steps);
    }
  }
  throw new Error(`${source.qlId}/${locale}: unsupported simple explanation steps.`);
}

export function simplifyCp004LocalizedExplanationV8(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  correctAnswer: string,
): IntCp004LocalizedExplanation {
  return Object.freeze({
    whatAsked: shortTask(source, locale),
    steps: simpleSteps(source, locale),
    finalAnswer: finalAnswer(source, locale, correctAnswer),
    commonMistake: commonMistake(source, locale),
  });
}
