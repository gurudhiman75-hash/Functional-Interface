import {
  brokenAmountForState,
  completeAmountForState,
  effectiveAnnualRate,
  mul,
  periodicRate,
  rat,
  type Cp004Frequency,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import {
  cp004FrequencyIntervalText,
  cp004FrequencyLabel,
} from "./cp004-localization-language-pack";
import { simplifyCp004LocalizedExplanationV8 } from "./cp004-localized-simple-explanations-v8";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_SIMPLE_EXPLANATION_V8_FINAL_VERSION =
  "INT-CP-004-HI-PA-SIMPLE-EXPLANATIONS-v8-final" as const;

function needsApproximation(rate: Rational): boolean {
  return mul(rate, rat(100)).denominator !== 1n;
}

function rateCalculation(
  locale: IntCp004LocalizedLocale,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const s = source.mathematicalState;
  const periodRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  if (s.frequency === 1) {
    return locale === "hi-IN"
      ? `सालाना दर = ${percentText(s.nominalAnnualRatePercent)}।`
      : `ਸਾਲਾਨਾ ਦਰ = ${percentText(s.nominalAnnualRatePercent)}।`;
  }
  const sign = needsApproximation(periodRate) ? "≈" : "=";
  const label = cp004FrequencyLabel(locale, s.frequency);
  return locale === "hi-IN"
    ? `${label} दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ${sign} ${percentText(periodRate)}।`
    : `${label} ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ${sign} ${percentText(periodRate)}।`;
}

function markRoundedRate(
  text: string,
  locale: IntCp004LocalizedLocale,
  annualRate: Rational,
  frequency: Cp004Frequency,
): string {
  const rate = periodicRate(annualRate, frequency);
  if (!needsApproximation(rate)) return text;
  const displayed = percentText(rate);
  return locale === "hi-IN"
    ? text.replace(`दर ${displayed}`, `दर ≈ ${displayed}`)
    : text.replace(`ਦਰ ${displayed}`, `ਦਰ ≈ ${displayed}`);
}

function polishRateFormula(
  text: string,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const s = source.mathematicalState;
  if (s.frequency === 1) return text;
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  if (!needsApproximation(rate)) return text;
  const exactLead = `${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}`;
  return text.replace(exactLead, `${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ≈ ${percentText(rate)}`);
}

function annualHypothesis(
  locale: IntCp004LocalizedLocale,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const rate = percentText(source.mathematicalState.nominalAnnualRatePercent);
  return locale === "hi-IN"
    ? `${rate} वार्षिक दर मानें।`
    : `${rate} ਸਾਲਾਨਾ ਦਰ ਮੰਨੋ।`;
}

function confirmationAmount(
  locale: IntCp004LocalizedLocale,
  amount: Rational,
): string {
  return locale === "hi-IN"
    ? `${moneyText(amount)} प्रश्न में दी गई राशि से मिलती है।`
    : `${moneyText(amount)} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਮਿਲਦੀ ਹੈ।`;
}

function naturalTaskLine(
  locale: IntCp004LocalizedLocale,
  task: string,
): string {
  if (locale === "hi-IN") {
    return task.startsWith("हमें ") ? task : `हमें ${task}`;
  }

  if (task === "ਵਿਆਜ ਕਿੰਨੀ ਵਾਰ ਜੁੜਦਾ ਹੈ, ਇਹ ਪਤਾ ਕਰਨਾ ਹੈ।") {
    return "ਆਓ ਪਤਾ ਕਰੀਏ ਕਿ ਵਿਆਜ ਕਿੰਨੀ ਵਾਰ ਜੁੜਦਾ ਹੈ।";
  }

  const natural = task
    .replace(/ ਕੱਢਣੀ ਹੈ।$/u, " ਕੱਢੀਏ।")
    .replace(/ ਕੱਢਣਾ ਹੈ।$/u, " ਕੱਢੀਏ।")
    .replace(/ ਪਤਾ ਕਰਨਾ ਹੈ।$/u, " ਪਤਾ ਕਰੀਏ।");
  return natural.startsWith("ਆਓ ") ? natural : `ਆਓ ${natural}`;
}

function finalizeSteps(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  explanation: IntCp004LocalizedExplanation,
): readonly string[] {
  const s = source.mathematicalState;
  const base = explanation.steps.map((step) => polishRateFormula(step, source));

  switch (source.qlId) {
    case "INT-QL-071": {
      const amount = completeAmountForState(s);
      return Object.freeze([
        annualHypothesis(locale, source),
        rateCalculation(locale, source),
        base[1] ?? "",
        confirmationAmount(locale, amount),
      ]);
    }

    case "INT-QL-075": {
      const first = base[0]
        ? markRoundedRate(base[0], locale, s.nominalAnnualRatePercent, s.frequency)
        : "";
      const second = base[1]
        ? markRoundedRate(base[1], locale, s.nominalAnnualRatePercent, s.comparisonFrequency)
        : "";
      const difference = locale === "hi-IN"
        ? `अंतर लगभग ${moneyText(source.solution)} है।`
        : `ਅੰਤਰ ਲਗਭਗ ${moneyText(source.solution)} ਹੈ।`;
      return Object.freeze([first, second, difference]);
    }

    case "INT-QL-076": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      return Object.freeze([
        base[0] ?? "",
        base[1] ?? "",
        locale === "hi-IN"
          ? `₹100 पर बढ़ोतरी ${moneyText(effective)} है।`
          : `₹100 ਉੱਤੇ ਵਾਧਾ ${moneyText(effective)} ਹੈ।`,
        locale === "hi-IN"
          ? `इसलिए प्रभावी वार्षिक दर ${percentText(effective)} है।`
          : `ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effective)} ਹੈ।`,
      ]);
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      return Object.freeze([
        annualHypothesis(locale, source),
        rateCalculation(locale, source),
        base[1] ?? "",
        locale === "hi-IN"
          ? `बढ़ोतरी ${percentText(effective)} है, जो प्रश्न की प्रभावी दर से मिलती है।`
          : `ਵਾਧਾ ${percentText(effective)} ਹੈ, ਜੋ ਪ੍ਰਸ਼ਨ ਦੀ ਪ੍ਰਭਾਵੀ ਦਰ ਨਾਲ ਮਿਲਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-078": {
      const amount = completeAmountForState(s);
      return Object.freeze([
        base[0] ?? "",
        base[1] ?? "",
        confirmationAmount(locale, amount),
        locale === "hi-IN"
          ? `इसलिए 1 वर्ष में ब्याज ${s.frequency} बार, यानी ${cp004FrequencyIntervalText(locale, s.frequency)} जुड़ता है।`
          : `ਇਸ ਲਈ 1 ਸਾਲ ਵਿੱਚ ਵਿਆਜ ${s.frequency} ਵਾਰ, ਅਰਥਾਤ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੁੜਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-082":
    case "INT-QL-083": {
      const amount = brokenAmountForState(s);
      const calculation = (base[2] ?? "").split(";")[0]?.trim() ?? "";
      const cleanCalculation = calculation.endsWith("।") ? calculation : `${calculation}।`;
      return Object.freeze([
        base[0] ?? "",
        base[1] ?? "",
        cleanCalculation,
        confirmationAmount(locale, amount),
      ]);
    }

    default:
      return Object.freeze(base);
  }
}

export function simplifyCp004LocalizedExplanationV8Final(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  correctAnswer: string,
): IntCp004LocalizedExplanation {
  const base = simplifyCp004LocalizedExplanationV8(source, locale, correctAnswer);
  return Object.freeze({
    ...base,
    whatAsked: naturalTaskLine(locale, base.whatAsked),
    steps: finalizeSteps(source, locale, base),
  });
}
