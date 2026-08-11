import {
  add,
  brokenAmountForState,
  completeAmountForState,
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
import { moneyText } from "./cp004-frequency-options";
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

function fraction(value: Rational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

function integerMoney(value: Rational, label: string): string {
  if (value.denominator !== 1n) {
    throw new Error(`${label}: v9 learner money must be integer, received ${fraction(value)}.`);
  }
  return moneyText(value);
}

function integerPercent(value: Rational, label: string): string {
  if (value.denominator !== 1n) {
    throw new Error(`${label}: v9 learner rate must be integer, received ${fraction(value)}.`);
  }
  return `${value.numerator}%`;
}

function rateLine(
  locale: IntCp004LocalizedLocale,
  annualRate: Rational,
  frequency: Cp004Frequency,
): string {
  const perPeriod = periodicRate(annualRate, frequency);
  const annual = integerPercent(annualRate, "annual rate");
  const period = integerPercent(perPeriod, "period rate");
  if (frequency === 1) {
    return locale === "hi-IN"
      ? `प्रति अवधि दर = वार्षिक दर = ${period}।`
      : `ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ਸਾਲਾਨਾ ਦਰ = ${period}।`;
  }
  return locale === "hi-IN"
    ? `${cp004FrequencyLabel(locale, frequency)} दर = ${annual} ÷ ${frequency} = ${period}।`
    : `${cp004FrequencyLabel(locale, frequency)} ਦਰ = ${annual} ÷ ${frequency} = ${period}।`;
}

function directRateLine(
  locale: IntCp004LocalizedLocale,
  rate: Rational,
  frequency: Cp004Frequency,
): string {
  const displayed = integerPercent(rate, "direct period rate");
  return locale === "hi-IN"
    ? `${cp004FrequencyLabel(locale, frequency)} दर सीधे ${displayed} दी गई है।`
    : `${cp004FrequencyLabel(locale, frequency)} ਦਰ ਸਿੱਧੀ ${displayed} ਦਿੱਤੀ ਹੈ।`;
}

function amountCalculation(
  locale: IntCp004LocalizedLocale,
  principal: Rational,
  ratePercent: Rational,
  periods: number,
  amount: Rational,
  prefix = "",
): readonly string[] {
  const m = factor(ratePercent);
  const powered = pow(m, periods);
  const p = integerMoney(principal, "principal");
  const a = integerMoney(amount, "amount");
  return Object.freeze(locale === "hi-IN" ? [
    `${prefix}A = ${p} × (${m.numerator}/${m.denominator})^${periods}।`,
    `${prefix}A = ${p} × ${powered.numerator}/${powered.denominator}।`,
    `${prefix}A = ${a}।`,
  ] : [
    `${prefix}A = ${p} × (${m.numerator}/${m.denominator})^${periods}।`,
    `${prefix}A = ${p} × ${powered.numerator}/${powered.denominator}।`,
    `${prefix}A = ${a}।`,
  ]);
}

function principalCalculation(
  finalAmount: Rational,
  ratePercent: Rational,
  periods: number,
  principal: Rational,
): readonly string[] {
  const m = factor(ratePercent);
  const powered = pow(m, periods);
  const a = integerMoney(finalAmount, "reverse final amount");
  const p = integerMoney(principal, "reverse principal");
  return Object.freeze([
    `P = ${a} × (${m.denominator}/${m.numerator})^${periods}।`,
    `P = ${a} × ${powered.denominator}/${powered.numerator}।`,
    `P = ${p}।`,
  ]);
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
    ? "सूत्र: प्रभावी वार्षिक दर = [(1 + R/(100m))^m − 1] × 100।"
    : "ਸੂਤਰ: ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = [(1 + R/(100m))^m − 1] × 100।";
}

function formulaBrokenPeriod(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: A = P × (1 + R/100)^y × [1 + R × x/(100 × 12)], जहाँ x अतिरिक्त महीने हैं।"
    : "ਸੂਤਰ: A = P × (1 + R/100)^y × [1 + R × x/(100 × 12)], ਜਿੱਥੇ x ਵਾਧੂ ਮਹੀਨੇ ਹਨ।";
}

function formulaMixed(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सूत्र: A = P × (1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂)।"
    : "ਸੂਤਰ: A = P × (1 + R/(100m₁))^(m₁t₁) × (1 + R/(100m₂))^(m₂t₂)।";
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
    ? "ध्यान रखें: पहले सही सूत्र लिखें, फिर प्रति अवधि दर और अवधियों की संख्या रखकर पूरा हिसाब करें।"
    : "ਧਿਆਨ ਰੱਖੋ: ਪਹਿਲਾਂ ਸਹੀ ਸੂਤਰ ਲਿਖੋ, ਫਿਰ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਅਤੇ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਰੱਖ ਕੇ ਪੂਰਾ ਹਿਸਾਬ ਕਰੋ।";
}

function brokenFactors(source: IntCp004EnglishFrozenQuestion): Readonly<{
  annual: Rational;
  annualPower: Rational;
  tail: Rational;
  total: Rational;
}> {
  const s = source.mathematicalState;
  const annual = factor(s.nominalAnnualRatePercent);
  const annualPower = pow(annual, s.fullYears);
  const tail = add(rat(1), mul(div(s.nominalAnnualRatePercent, rat(100)), rat(s.tailMonths, 12)));
  return Object.freeze({ annual, annualPower, tail, total: mul(annualPower, tail) });
}

function brokenCalculation(
  source: IntCp004EnglishFrozenQuestion,
  amount: Rational,
): readonly string[] {
  const s = source.mathematicalState;
  const f = brokenFactors(source);
  const p = integerMoney(s.principal, "broken principal");
  const a = integerMoney(amount, "broken amount");
  return Object.freeze([
    `1 + R/100 = ${f.annual.numerator}/${f.annual.denominator}; अतिरिक्त ${s.tailMonths} महीनों का गुणन-कारक = ${f.tail.numerator}/${f.tail.denominator}।`,
    `A = ${p} × (${f.annual.numerator}/${f.annual.denominator})^${s.fullYears} × ${f.tail.numerator}/${f.tail.denominator}।`,
    `A = ${p} × ${f.total.numerator}/${f.total.denominator} = ${a}।`,
  ]);
}

function brokenCalculationPunjabi(
  source: IntCp004EnglishFrozenQuestion,
  amount: Rational,
): readonly string[] {
  const s = source.mathematicalState;
  const f = brokenFactors(source);
  const p = integerMoney(s.principal, "broken principal");
  const a = integerMoney(amount, "broken amount");
  return Object.freeze([
    `1 + R/100 = ${f.annual.numerator}/${f.annual.denominator}; ਵਾਧੂ ${s.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਗੁਣਾ-ਕਾਰਕ = ${f.tail.numerator}/${f.tail.denominator}।`,
    `A = ${p} × (${f.annual.numerator}/${f.annual.denominator})^${s.fullYears} × ${f.tail.numerator}/${f.tail.denominator}।`,
    `A = ${p} × ${f.total.numerator}/${f.total.denominator} = ${a}।`,
  ]);
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
      steps.push(...amountCalculation(locale, s.principal, perRate, s.periods, amount));
      break;

    case "INT-QL-068":
      steps.push(formulaCompoundInterest(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, s.principal, perRate, s.periods, amount));
      steps.push(locale === "hi-IN"
        ? `चक्रवृद्धि ब्याज = ${integerMoney(amount, "amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(amount, s.principal), "interest")}।`
        : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${integerMoney(amount, "amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(amount, s.principal), "interest")}।`);
      break;

    case "INT-QL-069":
      steps.push(formulaPrincipalFromAmount(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...principalCalculation(amount, perRate, s.periods, s.principal));
      break;

    case "INT-QL-070": {
      const totalFactor = pow(factor(perRate), s.periods);
      const growth = sub(totalFactor, rat(1));
      const interest = sub(amount, s.principal);
      steps.push(formulaPrincipalFromInterest(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(`(1 + r/100)^n − 1 = ${fraction(totalFactor)} − 1 = ${fraction(growth)}।`);
      steps.push(`P = ${integerMoney(interest, "compound interest")} × ${growth.denominator}/${growth.numerator} = ${integerMoney(s.principal, "principal")}।`);
      break;
    }

    case "INT-QL-071": {
      const ratio = div(amount, s.principal);
      const m = factor(perRate);
      steps.push(locale === "hi-IN" ? "सूत्र: A/P = (1 + r/100)^n।" : "ਸੂਤਰ: A/P = (1 + r/100)^n।");
      steps.push(`${integerMoney(amount, "amount")} ÷ ${integerMoney(s.principal, "principal")} = ${fraction(ratio)} = (${m.numerator}/${m.denominator})^${s.periods}।`);
      steps.push(`1 + r/100 = ${m.numerator}/${m.denominator}; r = ${integerPercent(perRate, "period rate")}।`);
      steps.push(locale === "hi-IN"
        ? `वार्षिक दर = ${integerPercent(perRate, "period rate")} × ${s.frequency} = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")}।`
        : `ਸਾਲਾਨਾ ਦਰ = ${integerPercent(perRate, "period rate")} × ${s.frequency} = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")}।`);
      break;
    }

    case "INT-QL-072": {
      const ratio = div(amount, s.principal);
      const m = factor(perRate);
      const monthsPerPeriod = 12 / s.frequency;
      const totalMonths = s.periods * monthsPerPeriod;
      steps.push(locale === "hi-IN" ? "सूत्र: A/P = (1 + r/100)^n।" : "ਸੂਤਰ: A/P = (1 + r/100)^n।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(`${integerMoney(amount, "amount")} ÷ ${integerMoney(s.principal, "principal")} = ${fraction(ratio)} = (${m.numerator}/${m.denominator})^${s.periods}; इसलिए n = ${s.periods}।`);
      steps.push(locale === "hi-IN"
        ? `समय = ${s.periods} × ${monthsPerPeriod} महीने = ${totalMonths} महीने।`
        : `ਸਮਾਂ = ${s.periods} × ${monthsPerPeriod} ਮਹੀਨੇ = ${totalMonths} ਮਹੀਨੇ।`);
      break;
    }

    case "INT-QL-073": {
      const periodicAmount = periodicAmountForState(s);
      steps.push(formulaAmount(locale), directRateLine(locale, s.periodicRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, s.principal, s.periodicRatePercent, s.periods, periodicAmount));
      break;
    }

    case "INT-QL-074": {
      const periodicAmount = periodicAmountForState(s);
      steps.push(formulaCompoundInterest(locale), directRateLine(locale, s.periodicRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, s.principal, s.periodicRatePercent, s.periods, periodicAmount));
      steps.push(locale === "hi-IN"
        ? `चक्रवृद्धि ब्याज = ${integerMoney(periodicAmount, "amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(periodicAmount, s.principal), "interest")}।`
        : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${integerMoney(periodicAmount, "amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(periodicAmount, s.principal), "interest")}।`);
      break;
    }

    case "INT-QL-075": {
      const rate1 = periodicRate(s.nominalAnnualRatePercent, s.frequency);
      const rate2 = periodicRate(s.nominalAnnualRatePercent, s.comparisonFrequency);
      const amount1 = mul(s.principal, pow(factor(rate1), s.frequency * s.years));
      const amount2 = mul(s.principal, pow(factor(rate2), s.comparisonFrequency * s.years));
      const larger = amount1.numerator >= amount2.numerator ? amount1 : amount2;
      const smaller = larger === amount1 ? amount2 : amount1;
      steps.push(locale === "hi-IN"
        ? "सूत्र: प्रत्येक योजना के लिए A = P × (1 + R/(100m))^(mt); फिर दोनों राशियों का अंतर लें।"
        : "ਸੂਤਰ: ਹਰ ਯੋਜਨਾ ਲਈ A = P × (1 + R/(100m))^(mt); ਫਿਰ ਦੋਵੇਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, s.principal, rate1, s.frequency * s.years, amount1, locale === "hi-IN" ? "योजना 1: " : "ਯੋਜਨਾ 1: "));
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.comparisonFrequency));
      steps.push(...amountCalculation(locale, s.principal, rate2, s.comparisonFrequency * s.years, amount2, locale === "hi-IN" ? "योजना 2: " : "ਯੋਜਨਾ 2: "));
      steps.push(locale === "hi-IN"
        ? `अंतर = ${integerMoney(larger, "larger amount")} − ${integerMoney(smaller, "smaller amount")} = ${integerMoney(sub(larger, smaller), "difference")}।`
        : `ਅੰਤਰ = ${integerMoney(larger, "larger amount")} − ${integerMoney(smaller, "smaller amount")} = ${integerMoney(sub(larger, smaller), "difference")}।`);
      break;
    }

    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const amount100 = add(rat(100), effective);
      steps.push(formulaEffectiveRate(locale), rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, rat(100), perRate, s.frequency, amount100));
      steps.push(locale === "hi-IN"
        ? `प्रभावी वार्षिक दर = ${integerMoney(amount100, "amount on 100")} − ₹100 = ${integerPercent(effective, "effective rate")}।`
        : `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = ${integerMoney(amount100, "amount on 100")} − ₹100 = ${integerPercent(effective, "effective rate")}।`);
      break;
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const m = factor(perRate);
      steps.push(locale === "hi-IN"
        ? "सूत्र: 1 + प्रभावी दर/100 = (1 + r/100)^m।"
        : "ਸੂਤਰ: 1 + ਪ੍ਰਭਾਵੀ ਦਰ/100 = (1 + r/100)^m।");
      steps.push(`1 + ${integerPercent(effective, "effective rate").replace("%", "")}/100 = (${m.numerator}/${m.denominator})^${s.frequency}।`);
      steps.push(`1 + r/100 = ${m.numerator}/${m.denominator}; r = ${integerPercent(perRate, "period rate")}।`);
      steps.push(locale === "hi-IN"
        ? `वार्षिक दर = ${integerPercent(perRate, "period rate")} × ${s.frequency} = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")}।`
        : `ਸਾਲਾਨਾ ਦਰ = ${integerPercent(perRate, "period rate")} × ${s.frequency} = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")}।`);
      break;
    }

    case "INT-QL-078":
      steps.push(locale === "hi-IN"
        ? "सूत्र: A = P × (1 + R/(100m))^(mt); सही m वही है जिससे दी गई राशि प्राप्त हो।"
        : "ਸੂਤਰ: A = P × (1 + R/(100m))^(mt); ਸਹੀ m ਉਹੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਰਕਮ ਮਿਲੇ।");
      steps.push(rateLine(locale, s.nominalAnnualRatePercent, s.frequency));
      steps.push(...amountCalculation(locale, s.principal, perRate, s.frequency * s.years, amount));
      steps.push(locale === "hi-IN"
        ? `यह दी गई राशि से मिलती है; इसलिए ब्याज ${cp004FrequencyIntervalText(locale, s.frequency)} जोड़ा जाता है।`
        : `ਇਹ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ; ਇਸ ਲਈ ਵਿਆਜ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।`);
      break;

    case "INT-QL-079":
    case "INT-QL-080": {
      const finalAmount = brokenAmountForState(s);
      steps.push(formulaBrokenPeriod(locale));
      steps.push(...(locale === "hi-IN" ? brokenCalculation(source, finalAmount) : brokenCalculationPunjabi(source, finalAmount)));
      if (source.qlId === "INT-QL-080") {
        steps.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${integerMoney(finalAmount, "final amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(finalAmount, s.principal), "interest")}।`
          : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${integerMoney(finalAmount, "final amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(finalAmount, s.principal), "interest")}।`);
      }
      break;
    }

    case "INT-QL-081": {
      const finalAmount = brokenAmountForState(s);
      const f = brokenFactors(source).total;
      steps.push(formulaBrokenPeriod(locale));
      steps.push(`कुल वृद्धि-कारक = ${f.numerator}/${f.denominator}।`);
      steps.push(`P = ${integerMoney(finalAmount, "final amount")} × ${f.denominator}/${f.numerator} = ${integerMoney(s.principal, "principal")}।`);
      if (locale === "pa-IN") {
        steps[1] = `ਕੁੱਲ ਵਾਧਾ-ਕਾਰਕ = ${f.numerator}/${f.denominator}।`;
      }
      break;
    }

    case "INT-QL-082":
    case "INT-QL-083": {
      const finalAmount = brokenAmountForState(s);
      const annual = integerPercent(s.nominalAnnualRatePercent, "annual rate");
      steps.push(formulaBrokenPeriod(locale));
      if (source.qlId === "INT-QL-082") {
        steps.push(locale === "hi-IN" ? `${annual} वार्षिक दर रखकर जाँचते हैं।` : `${annual} ਸਾਲਾਨਾ ਦਰ ਰੱਖ ਕੇ ਜਾਂਚਦੇ ਹਾਂ।`);
      } else {
        steps.push(locale === "hi-IN" ? `${s.fullYears} पूरे वर्ष रखकर जाँचते हैं।` : `${s.fullYears} ਪੂਰੇ ਸਾਲ ਰੱਖ ਕੇ ਜਾਂਚਦੇ ਹਾਂ।`);
      }
      steps.push(...(locale === "hi-IN" ? brokenCalculation(source, finalAmount) : brokenCalculationPunjabi(source, finalAmount)));
      steps.push(locale === "hi-IN" ? "प्राप्त राशि प्रश्न की राशि से मिलती है।" : "ਮਿਲੀ ਰਕਮ ਪ੍ਰਸ਼ਨ ਦੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ।");
      break;
    }

    case "INT-QL-084":
    case "INT-QL-085": {
      const rate1 = periodicRate(s.nominalAnnualRatePercent, s.firstFrequency);
      const rate2 = periodicRate(s.nominalAnnualRatePercent, s.secondFrequency);
      const f1 = pow(factor(rate1), s.firstFrequency * s.firstYears);
      const f2 = pow(factor(rate2), s.secondFrequency * s.secondYears);
      const total = mul(f1, f2);
      const finalAmount = mixedAmountForState(s);
      steps.push(formulaMixed(locale));
      steps.push(locale === "hi-IN"
        ? `पहले चरण की दर = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")} ÷ ${s.firstFrequency} = ${integerPercent(rate1, "first rate")}।`
        : `ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਦਰ = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")} ÷ ${s.firstFrequency} = ${integerPercent(rate1, "first rate")}।`);
      steps.push(locale === "hi-IN"
        ? `दूसरे चरण की दर = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")} ÷ ${s.secondFrequency} = ${integerPercent(rate2, "second rate")}।`
        : `ਦੂਜੇ ਪੜਾਅ ਦੀ ਦਰ = ${integerPercent(s.nominalAnnualRatePercent, "annual rate")} ÷ ${s.secondFrequency} = ${integerPercent(rate2, "second rate")}।`);
      steps.push(`A = ${integerMoney(s.principal, "principal")} × ${f1.numerator}/${f1.denominator} × ${f2.numerator}/${f2.denominator}।`);
      steps.push(`A = ${integerMoney(s.principal, "principal")} × ${total.numerator}/${total.denominator} = ${integerMoney(finalAmount, "mixed amount")}।`);
      if (source.qlId === "INT-QL-085") {
        steps.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${integerMoney(finalAmount, "final amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(finalAmount, s.principal), "interest")}।`
          : `ਮਿਸ਼ਰਤ ਵਿਆਜ = ${integerMoney(finalAmount, "final amount")} − ${integerMoney(s.principal, "principal")} = ${integerMoney(sub(finalAmount, s.principal), "interest")}।`);
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
