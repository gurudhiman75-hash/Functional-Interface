import {
  add,
  completeAmountForState,
  div,
  effectiveAnnualRate,
  mul,
  periodicAmountForState,
  periodicRate,
  rat,
  sub,
  type Cp004Frequency,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import {
  cp004FrequencyIntervalText,
  cp004FrequencyLabel,
} from "./cp004-localization-language-pack";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_FORMULA_EXPLANATION_V9_VERSION =
  "INT-CP-004-HI-PA-FORMULA-COMPLETE-v9" as const;

function factor(ratePercent: Rational): Rational {
  return add(rat(1), div(ratePercent, rat(100)));
}

function fractionText(value: Rational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

function rateLine(
  locale: IntCp004LocalizedLocale,
  annualRate: Rational,
  frequency: Cp004Frequency,
): string {
  const perPeriod = periodicRate(annualRate, frequency);
  if (frequency === 1) {
    return locale === "hi-IN"
      ? `प्रति अवधि दर = वार्षिक दर = ${percentText(perPeriod)}।`
      : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ਸਾਲਾਨਾ ਦਰ = ${percentText(perPeriod)}।`;
  }
  return locale === "hi-IN"
    ? `${cp004FrequencyLabel(locale, frequency)} दर = ${percentText(annualRate)} ÷ ${frequency} = ${percentText(perPeriod)}।`
    : `${cp004FrequencyLabel(locale, frequency)} ਦਰ = ${percentText(annualRate)} ÷ ${frequency} = ${percentText(perPeriod)}।`;
}

function directRateLine(
  locale: IntCp004LocalizedLocale,
  rate: Rational,
  frequency: Cp004Frequency,
): string {
  return locale === "hi-IN"
    ? `${cp004FrequencyLabel(locale, frequency)} दर सीधे ${percentText(rate)} दी गई है।`
    : `${cp004FrequencyLabel(locale, frequency)} ਦਰ ਸਿੱਧੀ ${percentText(rate)} ਦਿੱਤੀ ਹੈ।`;
}

function forwardLines(
  locale: IntCp004LocalizedLocale,
  principal: Rational,
  ratePercent: Rational,
  periods: number,
  prefix = "",
): string[] {
  const multiplier = factor(ratePercent);
  const lines: string[] = [];
  let balance = principal;
  for (let index = 1; index <= periods; index += 1) {
    const next = mul(balance, multiplier);
    if (locale === "hi-IN") {
      lines.push(`${prefix}अवधि ${index}: ${moneyText(balance)} × ${multiplier.numerator}/${multiplier.denominator} = ${moneyText(next)}।`);
    } else {
      lines.push(`${prefix}ਮਿਆਦ ${index}: ${moneyText(balance)} × ${multiplier.numerator}/${multiplier.denominator} = ${moneyText(next)}।`);
    }
    balance = next;
  }
  return lines;
}

function reverseLines(
  locale: IntCp004LocalizedLocale,
  finalAmount: Rational,
  ratePercent: Rational,
  periods: number,
): string[] {
  const multiplier = factor(ratePercent);
  const lines: string[] = [];
  let balance = finalAmount;
  for (let index = 1; index <= periods; index += 1) {
    const previous = div(balance, multiplier);
    if (locale === "hi-IN") {
      lines.push(`पीछे ${index} अवधि: ${moneyText(balance)} × ${multiplier.denominator}/${multiplier.numerator} = ${moneyText(previous)}।`);
    } else {
      lines.push(`ਪਿੱਛੇ ${index} ਮਿਆਦ: ${moneyText(balance)} × ${multiplier.denominator}/${multiplier.numerator} = ${moneyText(previous)}।`);
    }
    balance = previous;
  }
  return lines;
}

function formulaAmount(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: A = P × (1 + r/100)^n, जहाँ P मूलधन, r प्रति अवधि दर और n अवधियों की संख्या है।"
    : "ਸੂਤਰ: A = P × (1 + r/100)^n, ਜਿੱਥੇ P ਮੂਲਧਨ, r ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਅਤੇ n ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਹੈ।";
}

function formulaCompoundInterest(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: A = P × (1 + r/100)^n और चक्रवृद्धि ब्याज = A − P।"
    : "ਸੂਤਰ: A = P × (1 + r/100)^n ਅਤੇ ਮਿਸ਼ਰਤ ਵਿਆਜ = A − P।";
}

function formulaPrincipalFromAmount(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: P = A ÷ (1 + r/100)^n।"
    : "ਸੂਤਰ: P = A ÷ (1 + r/100)^n।";
}

function formulaPrincipalFromInterest(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: चक्रवृद्धि ब्याज = P × [(1 + r/100)^n − 1]।"
    : "ਸੂਤਰ: ਮਿਸ਼ਰਤ ਵਿਆਜ = P × [(1 + r/100)^n − 1]।";
}

function formulaEffectiveRate(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: प्रभावी वार्षिक दर = [(1 + R/(100m))^m − 1] × 100, जहाँ m वर्ष में ब्याज जोड़ने की संख्या है।"
    : "ਸੂਤਰ: ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = [(1 + R/(100m))^m − 1] × 100, ਜਿੱਥੇ m ਸਾਲ ਵਿੱਚ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਹੈ।";
}

function formulaBrokenPeriod(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: पहले पूरे वर्षों की राशि A₁ = P(1 + R/100)^y; फिर अतिरिक्त महीनों का साधारण ब्याज = A₁ × R × महीने/(100 × 12)।"
    : "ਸੂਤਰ: ਪਹਿਲਾਂ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਰਕਮ A₁ = P(1 + R/100)^y; ਫਿਰ ਵਾਧੂ ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ = A₁ × R × ਮਹੀਨੇ/(100 × 12)।";
}

function formulaMixed(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: पहले चरण की राशि A₁ = P(1 + R/(100m₁))^(m₁t₁); फिर A = A₁(1 + R/(100m₂))^(m₂t₂)।"
    : "ਸੂਤਰ: ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਰਕਮ A₁ = P(1 + R/(100m₁))^(m₁t₁); ਫਿਰ A = A₁(1 + R/(100m₂))^(m₂t₂)।";
}

function task(locale: IntCp004LocalizedLocale, qlId: string): string {
  if (locale === "hi-IN") {
    switch (qlId) {
      case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return "हमें कुल राशि ज्ञात करनी है।";
      case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return "हमें चक्रवृद्धि ब्याज ज्ञात करना है।";
      case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return "हमें मूलधन ज्ञात करना है।";
      case "INT-QL-071": case "INT-QL-077": case "INT-QL-082": return "हमें वार्षिक ब्याज दर ज्ञात करनी है।";
      case "INT-QL-072": case "INT-QL-083": return "हमें समय ज्ञात करना है।";
      case "INT-QL-075": return "हमें दोनों योजनाओं की राशियों का अंतर ज्ञात करना है।";
      case "INT-QL-076": return "हमें प्रभावी वार्षिक दर ज्ञात करनी है।";
      case "INT-QL-078": return "हमें ब्याज जोड़ने का सही अंतराल ज्ञात करना है।";
    }
  }
  switch (qlId) {
    case "INT-QL-067": case "INT-QL-073": case "INT-QL-079": case "INT-QL-084": return "ਆਓ ਕੁੱਲ ਰਕਮ ਕੱਢੀਏ।";
    case "INT-QL-068": case "INT-QL-074": case "INT-QL-080": case "INT-QL-085": return "ਆਓ ਮਿਸ਼ਰਤ ਵਿਆਜ ਕੱਢੀਏ।";
    case "INT-QL-069": case "INT-QL-070": case "INT-QL-081": return "ਆਓ ਮੂਲਧਨ ਕੱਢੀਏ।";
    case "INT-QL-071": case "INT-QL-077": case "INT-QL-082": return "ਆਓ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕੱਢੀਏ।";
    case "INT-QL-072": case "INT-QL-083": return "ਆਓ ਸਮਾਂ ਕੱਢੀਏ।";
    case "INT-QL-075": return "ਆਓ ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੀਏ।";
    case "INT-QL-076": return "ਆਓ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਕੱਢੀਏ।";
    case "INT-QL-078": return "ਆਓ ਵਿਆਜ ਜੋੜਨ ਦਾ ਸਹੀ ਅੰਤਰਾਲ ਪਤਾ ਕਰੀਏ।";
  }
  throw new Error(`${qlId}/${locale}: unsupported task.`);
}

function final(locale: IntCp004LocalizedLocale, correctAnswer: string): string {
  return locale === "hi-IN" ? `अंतिम उत्तर: ${correctAnswer}।` : `ਅੰਤਿਮ ਉੱਤਰ: ${correctAnswer}।`;
}

function commonMistake(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "ध्यान रखें: पहले ब्याज जोड़ने की अवधि और उसकी दर सही निकालें; फिर उसी क्रम में गणना करें।"
    : "ਧਿਆਨ ਰੱਖੋ: ਪਹਿਲਾਂ ਵਿਆਜ ਜੋੜਨ ਦੀ ਮਿਆਦ ਅਤੇ ਉਸ ਦੀ ਦਰ ਠੀਕ ਕੱਢੋ; ਫਿਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਗਣਨਾ ਕਰੋ।";
}

export function buildCp004LocalizedFormulaExplanationV9(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  correctAnswer: string,
): IntCp004LocalizedExplanation {
  const s = source.mathematicalState;
  const amount = completeAmountForState(s);
  const perRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const steps: string[] = [];

  switch (source.qlId) {
    case "INT-QL-067":
      steps.push(formulaAmount(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...forwardLines(locale, s.principal, perRate, s.periods));
      break;

    case "INT-QL-068":
      steps.push(formulaCompoundInterest(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...forwardLines(locale, s.principal, perRate, s.periods));
      steps.push(locale === "hi-IN"
        ? `चक्रवृद्धि ब्याज = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(sub(amount, s.principal))}।`
        : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(amount)} − ${moneyText(s.principal)} = ${moneyText(sub(amount, s.principal))}।`);
      break;

    case "INT-QL-069":
      steps.push(formulaPrincipalFromAmount(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...reverseLines(locale, amount, perRate, s.periods));
      break;

    case "INT-QL-070": {
      const growth = sub(factor(perRate), rat(1));
      let totalFactor = factor(perRate);
      for (let index = 1; index < s.periods; index += 1) totalFactor = mul(totalFactor, factor(perRate));
      const totalGrowth = sub(totalFactor, rat(1));
      const interest = sub(amount, s.principal);
      steps.push(formulaPrincipalFromInterest(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(locale === "hi-IN"
        ? `(1 + r/100)^n − 1 = ${fractionText(totalFactor)} − 1 = ${fractionText(totalGrowth)}।`
        : `(1 + r/100)^n − 1 = ${fractionText(totalFactor)} − 1 = ${fractionText(totalGrowth)}।`);
      steps.push(locale === "hi-IN"
        ? `P = ${moneyText(interest)} ÷ ${fractionText(totalGrowth)} = ${moneyText(interest)} × ${totalGrowth.denominator}/${totalGrowth.numerator} = ${moneyText(s.principal)}।`
        : `P = ${moneyText(interest)} ÷ ${fractionText(totalGrowth)} = ${moneyText(interest)} × ${totalGrowth.denominator}/${totalGrowth.numerator} = ${moneyText(s.principal)}।`);
      void growth;
      break;
    }

    case "INT-QL-071": {
      const ratio = div(amount, s.principal);
      const periodFactor = factor(perRate);
      steps.push(locale === "hi-IN"
        ? "सूत्र: A/P = (1 + R/(100m))^n।"
        : "ਸੂਤਰ: A/P = (1 + R/(100m))^n।");
      steps.push(`${moneyText(amount)} ÷ ${moneyText(s.principal)} = ${fractionText(ratio)} = (${fractionText(periodFactor)})^${s.periods}।`);
      steps.push(locale === "hi-IN"
        ? `इसलिए प्रति अवधि दर = (${fractionText(periodFactor)} − 1) × 100 = ${percentText(perRate)}।`
        : `ਇਸ ਲਈ ਹਰ ਮਿਆਦ ਦੀ ਦਰ = (${fractionText(periodFactor)} − 1) × 100 = ${percentText(perRate)}।`);
      steps.push(locale === "hi-IN"
        ? `वार्षिक दर = ${percentText(perRate)} × ${s.frequency} = ${percentText(s.nominalAnnualRatePercent)}।`
        : `ਸਾਲਾਨਾ ਦਰ = ${percentText(perRate)} × ${s.frequency} = ${percentText(s.nominalAnnualRatePercent)}।`);
      break;
    }

    case "INT-QL-072": {
      const ratio = div(amount, s.principal);
      const periodFactor = factor(perRate);
      const totalMonths = s.periods * (12 / s.frequency);
      steps.push(locale === "hi-IN"
        ? "सूत्र: A/P = (1 + r/100)^n; यहाँ n ब्याज जोड़ने की कुल अवधियाँ हैं।"
        : "ਸੂਤਰ: A/P = (1 + r/100)^n; ਇੱਥੇ n ਵਿਆਜ ਜੋੜਨ ਦੀਆਂ ਕੁੱਲ ਮਿਆਦਾਂ ਹਨ।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(`${moneyText(amount)} ÷ ${moneyText(s.principal)} = ${fractionText(ratio)} = (${fractionText(periodFactor)})^${s.periods}।`);
      steps.push(locale === "hi-IN"
        ? `अतः n = ${s.periods}; समय = ${s.periods} × ${12 / s.frequency} महीने = ${totalMonths} महीने।`
        : `ਇਸ ਲਈ n = ${s.periods}; ਸਮਾਂ = ${s.periods} × ${12 / s.frequency} ਮਹੀਨੇ = ${totalMonths} ਮਹੀਨੇ।`);
      break;
    }

    case "INT-QL-073": {
      const periodicAmount = periodicAmountForState(s);
      steps.push(formulaAmount(locale), directRateLine(locale, s.periodicRatePercent, s.frequency));
      steps.push(...forwardLines(locale, s.principal, s.periodicRatePercent, s.periods));
      if (periodicAmount.numerator === 0n) throw new Error("Unexpected zero amount.");
      break;
    }

    case "INT-QL-074": {
      const periodicAmount = periodicAmountForState(s);
      steps.push(formulaCompoundInterest(locale), directRateLine(locale, s.periodicRatePercent, s.frequency));
      steps.push(...forwardLines(locale, s.principal, s.periodicRatePercent, s.periods));
      steps.push(locale === "hi-IN"
        ? `चक्रवृद्धि ब्याज = ${moneyText(periodicAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(periodicAmount, s.principal))}।`
        : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(periodicAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(periodicAmount, s.principal))}।`);
      break;
    }

    case "INT-QL-075": {
      const rate1 = periodicRate(s.nominalAnnualRatePercent, s.frequency);
      const rate2 = periodicRate(s.nominalAnnualRatePercent, s.comparisonFrequency);
      const first = forwardLines(locale, s.principal, rate1, s.frequency * s.years, locale === "hi-IN" ? "योजना 1 — " : "ਯੋਜਨਾ 1 — ");
      const second = forwardLines(locale, s.principal, rate2, s.comparisonFrequency * s.years, locale === "hi-IN" ? "योजना 2 — " : "ਯੋਜਨਾ 2 — ");
      const amount1 = first.length ? (() => {
        let x = s.principal; for (let i = 0; i < s.frequency * s.years; i += 1) x = mul(x, factor(rate1)); return x;
      })() : s.principal;
      const amount2 = second.length ? (() => {
        let x = s.principal; for (let i = 0; i < s.comparisonFrequency * s.years; i += 1) x = mul(x, factor(rate2)); return x;
      })() : s.principal;
      const larger = amount1.numerator >= amount2.numerator ? amount1 : amount2;
      const smaller = larger === amount1 ? amount2 : amount1;
      steps.push(locale === "hi-IN"
        ? "सूत्र: प्रत्येक योजना के लिए A = P(1 + R/(100m))^(mt); फिर दोनों राशियों का अंतर लें।"
        : "ਸੂਤਰ: ਹਰ ਯੋਜਨਾ ਲਈ A = P(1 + R/(100m))^(mt); ਫਿਰ ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...first);
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.comparisonFrequency));
      steps.push(...second);
      steps.push(locale === "hi-IN"
        ? `अंतर = ${moneyText(larger)} − ${moneyText(smaller)} = ${moneyText(sub(larger, smaller))}।`
        : `ਅੰਤਰ = ${moneyText(larger)} − ${moneyText(smaller)} = ${moneyText(sub(larger, smaller))}।`);
      break;
    }

    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      steps.push(formulaEffectiveRate(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...forwardLines(locale, rat(100), perRate, s.frequency));
      steps.push(locale === "hi-IN"
        ? `₹100 में बढ़ोतरी = ${moneyText(add(rat(100), div(effective, rat(1))))} − ₹100 = ${moneyText(effective)}; इसलिए प्रभावी दर = ${percentText(effective)}।`
        : `₹100 ਵਿੱਚ ਵਾਧਾ = ${moneyText(add(rat(100), div(effective, rat(1))))} − ₹100 = ${moneyText(effective)}; ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਦਰ = ${percentText(effective)}।`);
      break;
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const final100 = add(rat(100), effective);
      const periodFactor = factor(perRate);
      steps.push(locale === "hi-IN"
        ? "सूत्र: 1 + प्रभावी दर/100 = (1 + R/(100m))^m।"
        : "ਸੂਤਰ: 1 + ਪ੍ਰਭਾਵੀ ਦਰ/100 = (1 + R/(100m))^m।");
      steps.push(`${fractionText(div(final100, rat(100)))} = (${fractionText(periodFactor)})^${s.frequency}।`);
      steps.push(locale === "hi-IN"
        ? `प्रति अवधि दर = (${fractionText(periodFactor)} − 1) × 100 = ${percentText(perRate)}।`
        : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ = (${fractionText(periodFactor)} − 1) × 100 = ${percentText(perRate)}।`);
      steps.push(locale === "hi-IN"
        ? `वार्षिक दर = ${percentText(perRate)} × ${s.frequency} = ${percentText(s.nominalAnnualRatePercent)}।`
        : `ਸਾਲਾਨਾ ਦਰ = ${percentText(perRate)} × ${s.frequency} = ${percentText(s.nominalAnnualRatePercent)}।`);
      break;
    }

    case "INT-QL-078":
      steps.push(locale === "hi-IN"
        ? "सूत्र: A = P(1 + R/(100m))^(mt); सही m वही है जिससे दी गई राशि प्राप्त हो।"
        : "ਸੂਤਰ: A = P(1 + R/(100m))^(mt); ਸਹੀ m ਉਹੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲੇ।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...forwardLines(locale, s.principal, perRate, s.frequency * s.years));
      steps.push(locale === "hi-IN"
        ? `प्राप्त राशि ${moneyText(amount)} प्रश्न की राशि से मिलती है; इसलिए ब्याज ${cp004FrequencyIntervalText(locale, s.frequency)} जोड़ा जाता है।`
        : `ਮਿਲੀ ਰਕਮ ${moneyText(amount)} ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ; ਇਸ ਲਈ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।`);
      break;

    case "INT-QL-079":
    case "INT-QL-080": {
      steps.push(formulaBrokenPeriod(locale));
      steps.push(...forwardLines(locale, s.principal, s.nominalAnnualRatePercent, s.fullYears));
      let afterWhole = s.principal;
      for (let index = 0; index < s.fullYears; index += 1) afterWhole = mul(afterWhole, factor(s.nominalAnnualRatePercent));
      const tailInterest = mul(afterWhole, mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)));
      const finalAmount = add(afterWhole, tailInterest);
      steps.push(locale === "hi-IN"
        ? `अतिरिक्त ${s.tailMonths} महीनों का साधारण ब्याज = ${moneyText(afterWhole)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`
        : `ਵਾਧੂ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(afterWhole)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`);
      steps.push(locale === "hi-IN"
        ? `कुल राशि = ${moneyText(afterWhole)} + ${moneyText(tailInterest)} = ${moneyText(finalAmount)}।`
        : `ਕੁੱਲ ਰਕਮ = ${moneyText(afterWhole)} + ${moneyText(tailInterest)} = ${moneyText(finalAmount)}।`);
      if (source.qlId === "INT-QL-080") {
        steps.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`
          : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`);
      }
      break;
    }

    case "INT-QL-081": {
      steps.push(formulaBrokenPeriod(locale));
      let afterWhole = s.principal;
      for (let index = 0; index < s.fullYears; index += 1) afterWhole = mul(afterWhole, factor(s.nominalAnnualRatePercent));
      const tailRate = mul(s.nominalAnnualRatePercent, rat(s.tailMonths, 12));
      const finalAmount = add(afterWhole, mul(afterWhole, div(tailRate, rat(100))));
      const tailFactor = add(rat(1), div(tailRate, rat(100)));
      steps.push(locale === "hi-IN"
        ? `अतिरिक्त ${s.tailMonths} महीनों की साधारण दर = ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${percentText(tailRate)}।`
        : `ਵਾਧੂ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦੀ ਸਧਾਰਣ ਦਰ = ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${percentText(tailRate)}।`);
      steps.push(locale === "hi-IN"
        ? `पूरे वर्षों के बाद की राशि = ${moneyText(finalAmount)} × ${tailFactor.denominator}/${tailFactor.numerator} = ${moneyText(afterWhole)}।`
        : `ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਦੀ ਰਕਮ = ${moneyText(finalAmount)} × ${tailFactor.denominator}/${tailFactor.numerator} = ${moneyText(afterWhole)}।`);
      steps.push(...reverseLines(locale, afterWhole, s.nominalAnnualRatePercent, s.fullYears));
      break;
    }

    case "INT-QL-082":
    case "INT-QL-083": {
      steps.push(formulaBrokenPeriod(locale));
      if (source.qlId === "INT-QL-082") {
        steps.push(locale === "hi-IN"
          ? `दिए गए विकल्प से ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर जाँचते हैं।`
          : `ਦਿੱਤੀਆਂ ਚੋਣਾਂ ਵਿੱਚੋਂ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਜਾਂਚਦੇ ਹਾਂ।`);
      } else {
        steps.push(locale === "hi-IN"
          ? `${s.fullYears} पूरे वर्ष जाँचते हैं।`
          : `${s.fullYears} ਪੂਰੇ ਸਾਲ ਜਾਂਚਦੇ ਹਾਂ।`);
      }
      steps.push(...forwardLines(locale, s.principal, s.nominalAnnualRatePercent, s.fullYears));
      let afterWhole = s.principal;
      for (let index = 0; index < s.fullYears; index += 1) afterWhole = mul(afterWhole, factor(s.nominalAnnualRatePercent));
      const tailInterest = mul(afterWhole, mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)));
      const finalAmount = add(afterWhole, tailInterest);
      steps.push(locale === "hi-IN"
        ? `अतिरिक्त ${s.tailMonths} महीनों का ब्याज = ${moneyText(afterWhole)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`
        : `ਵਾਧੂ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਵਿਆਜ = ${moneyText(afterWhole)} × ${percentText(s.nominalAnnualRatePercent)} × ${s.tailMonths}/12 = ${moneyText(tailInterest)}।`);
      steps.push(locale === "hi-IN"
        ? `कुल राशि = ${moneyText(afterWhole)} + ${moneyText(tailInterest)} = ${moneyText(finalAmount)}, जो दी गई राशि से मिलती है।`
        : `ਕੁੱਲ ਰਕਮ = ${moneyText(afterWhole)} + ${moneyText(tailInterest)} = ${moneyText(finalAmount)}, ਜੋ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ।`);
      break;
    }

    case "INT-QL-084":
    case "INT-QL-085": {
      const rate1 = periodicRate(s.nominalAnnualRatePercent, s.firstFrequency);
      const rate2 = periodicRate(s.nominalAnnualRatePercent, s.secondFrequency);
      steps.push(formulaMixed(locale));
      steps.push(locale === "hi-IN"
        ? `पहले चरण की ${cp004FrequencyLabel(locale, s.firstFrequency)} दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.firstFrequency} = ${percentText(rate1)}।`
        : `ਪਹਿਲੇ ਪੜਾਅ ਦੀ ${cp004FrequencyLabel(locale, s.firstFrequency)} ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.firstFrequency} = ${percentText(rate1)}।`);
      const firstLines = forwardLines(locale, s.principal, rate1, s.firstFrequency * s.firstYears, locale === "hi-IN" ? "पहला चरण — " : "ਪਹਿਲਾ ਪੜਾਅ — ");
      steps.push(...firstLines);
      let firstAmount = s.principal;
      for (let index = 0; index < s.firstFrequency * s.firstYears; index += 1) firstAmount = mul(firstAmount, factor(rate1));
      steps.push(locale === "hi-IN"
        ? `दूसरे चरण की ${cp004FrequencyLabel(locale, s.secondFrequency)} दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.secondFrequency} = ${percentText(rate2)}।`
        : `ਦੂਜੇ ਪੜਾਅ ਦੀ ${cp004FrequencyLabel(locale, s.secondFrequency)} ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.secondFrequency} = ${percentText(rate2)}।`);
      steps.push(...forwardLines(locale, firstAmount, rate2, s.secondFrequency * s.secondYears, locale === "hi-IN" ? "दूसरा चरण — " : "ਦੂਜਾ ਪੜਾਅ — "));
      let finalAmount = firstAmount;
      for (let index = 0; index < s.secondFrequency * s.secondYears; index += 1) finalAmount = mul(finalAmount, factor(rate2));
      if (source.qlId === "INT-QL-085") {
        steps.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`
          : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${moneyText(finalAmount)} − ${moneyText(s.principal)} = ${moneyText(sub(finalAmount, s.principal))}।`);
      }
      break;
    }
  }

  return Object.freeze({
    whatAsked: task(locale, source.qlId),
    steps: Object.freeze(steps),
    finalAnswer: final(locale, correctAnswer),
    commonMistake: commonMistake(locale),
  });
}
