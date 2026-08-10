import {
  add,
  brokenAmountForState,
  completeAmountForState,
  div,
  effectiveAnnualRate,
  mul,
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
import { simplifyCp004LocalizedExplanationV8 } from "./cp004-localized-simple-explanations-v8";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_SIMPLE_EXPLANATION_V8_FINAL_VERSION =
  "INT-CP-004-HI-PA-SIMPLE-EXPLANATIONS-v8-final" as const;

function compactTwo(value: Rational): string {
  return decimal(value, 2).replace(/\.?0+$/u, "");
}

function cleanPercent(value: Rational): string {
  return `${compactTwo(value)}%`;
}

function needsApproximation(value: Rational): boolean {
  return mul(value, rat(100)).denominator !== 1n;
}

function powerExpression(base: string, periods: number): string {
  return periods === 1 ? base : `${base}^${periods}`;
}

function nominalGrowthExpression(annualRate: Rational, frequency: Cp004Frequency): string {
  const annual = compactTwo(annualRate);
  return frequency === 1
    ? `(1 + ${annual}/100)`
    : `(1 + ${annual}/(${frequency} × 100))`;
}

function periodicGrowthExpression(rate: Rational): string {
  if (needsApproximation(rate)) {
    return `(1 + ${rate.numerator.toString()}/(${rate.denominator.toString()} × 100))`;
  }
  return `(1 + ${compactTwo(rate)}/100)`;
}

function replaceGrowthFactor(text: string, expression: string): string {
  return text.replace(
    /×\s*\d+(?:\.\d+)?(\^\d+)?\s*=/u,
    (_match, power: string | undefined) => `× ${expression}${power ?? ""} =`,
  );
}

function rateCalculation(
  locale: IntCp004LocalizedLocale,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const s = source.mathematicalState;
  const periodRate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  if (s.frequency === 1) {
    return locale === "hi-IN"
      ? `सालाना दर = ${cleanPercent(s.nominalAnnualRatePercent)}।`
      : `ਸਾਲਾਨਾ ਦਰ = ${cleanPercent(s.nominalAnnualRatePercent)}।`;
  }
  const sign = needsApproximation(periodRate) ? "≈" : "=";
  const label = cp004FrequencyLabel(locale, s.frequency);
  return locale === "hi-IN"
    ? `${label} दर = ${cleanPercent(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ${sign} ${cleanPercent(periodRate)}।`
    : `${label} ਦਰ = ${cleanPercent(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ${sign} ${cleanPercent(periodRate)}।`;
}

function markRoundedRate(
  text: string,
  locale: IntCp004LocalizedLocale,
  annualRate: Rational,
  frequency: Cp004Frequency,
): string {
  const rate = periodicRate(annualRate, frequency);
  const displayed = percentText(rate);
  const clean = cleanPercent(rate);
  const prefix = needsApproximation(rate) ? "≈ " : "";
  return locale === "hi-IN"
    ? text.replace(`दर ${displayed}`, `दर ${prefix}${clean}`)
    : text.replace(`ਦਰ ${displayed}`, `ਦਰ ${prefix}${clean}`);
}

function polishRateFormula(
  text: string,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const s = source.mathematicalState;
  if (s.frequency === 1) return text;
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const exactLead = `${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}`;
  const sign = needsApproximation(rate) ? "≈" : "=";
  return text.replace(
    exactLead,
    `${cleanPercent(s.nominalAnnualRatePercent)} ÷ ${s.frequency} ${sign} ${cleanPercent(rate)}`,
  );
}

function annualHypothesis(
  locale: IntCp004LocalizedLocale,
  source: IntCp004EnglishFrozenQuestion,
): string {
  const rate = cleanPercent(source.mathematicalState.nominalAnnualRatePercent);
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

function cleanNominalAmountStep(
  source: IntCp004EnglishFrozenQuestion,
  step: string,
): string {
  const s = source.mathematicalState;
  return replaceGrowthFactor(step, nominalGrowthExpression(s.nominalAnnualRatePercent, s.frequency));
}

function cleanDirectAmountStep(
  source: IntCp004EnglishFrozenQuestion,
  step: string,
): string {
  return replaceGrowthFactor(step, periodicGrowthExpression(source.mathematicalState.periodicRatePercent));
}

function finalizeSteps(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  explanation: IntCp004LocalizedExplanation,
): readonly string[] {
  const s = source.mathematicalState;
  const base = explanation.steps.map((step) => polishRateFormula(step, source));

  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-068":
    case "INT-QL-072": {
      const steps = [...base];
      const amountIndex = source.qlId === "INT-QL-068" ? 1 : source.qlId === "INT-QL-072" ? 1 : 2;
      if (steps[amountIndex]) steps[amountIndex] = cleanNominalAmountStep(source, steps[amountIndex]!);
      return Object.freeze(steps);
    }

    case "INT-QL-069": {
      const amount = completeAmountForState(s);
      const growth = powerExpression(nominalGrowthExpression(s.nominalAnnualRatePercent, s.frequency), s.periods);
      return Object.freeze([
        rateCalculation(locale, source),
        locale === "hi-IN" ? `${s.periods} बार ब्याज जुड़ेगा।` : `${s.periods} ਵਾਰ ਵਿਆਜ ਜੁੜੇਗਾ।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(amount)} ÷ ${growth} = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(amount)} ÷ ${growth} = ${moneyText(s.principal)}।`,
      ]);
    }

    case "INT-QL-070": {
      const amount = completeAmountForState(s);
      const interest = sub(amount, s.principal);
      const growth = powerExpression(nominalGrowthExpression(s.nominalAnnualRatePercent, s.frequency), s.periods);
      return Object.freeze([
        rateCalculation(locale, source),
        locale === "hi-IN" ? `${s.periods} बार ब्याज जुड़ेगा।` : `${s.periods} ਵਾਰ ਵਿਆਜ ਜੁੜੇਗਾ।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(interest)} ÷ [${growth} − 1] = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(interest)} ÷ [${growth} − 1] = ${moneyText(s.principal)}।`,
      ]);
    }

    case "INT-QL-071": {
      const amount = completeAmountForState(s);
      const calculation = cleanNominalAmountStep(source, base[1] ?? "");
      return Object.freeze([
        annualHypothesis(locale, source),
        rateCalculation(locale, source),
        calculation,
        confirmationAmount(locale, amount),
      ]);
    }

    case "INT-QL-073":
    case "INT-QL-074": {
      const steps = [...base];
      const amountIndex = source.qlId === "INT-QL-073" ? 2 : 1;
      if (steps[amountIndex]) steps[amountIndex] = cleanDirectAmountStep(source, steps[amountIndex]!);
      return Object.freeze(steps);
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
      const amountStep = cleanNominalAmountStep(source, base[1] ?? "");
      const approx = needsApproximation(effective) ? "लगभग " : "";
      const approxPa = needsApproximation(effective) ? "ਲਗਭਗ " : "";
      return Object.freeze([
        rateCalculation(locale, source),
        amountStep,
        locale === "hi-IN"
          ? `₹100 पर बढ़ोतरी ${moneyText(effective)} है।`
          : `₹100 ਉੱਤੇ ਵਾਧਾ ${moneyText(effective)} ਹੈ।`,
        locale === "hi-IN"
          ? `इसलिए प्रभावी वार्षिक दर ${approx}${cleanPercent(effective)} है।`
          : `ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${approxPa}${cleanPercent(effective)} ਹੈ।`,
      ]);
    }

    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      const amountStep = cleanNominalAmountStep(source, base[1] ?? "");
      const approx = needsApproximation(effective) ? "लगभग " : "";
      const approxPa = needsApproximation(effective) ? "ਲਗਭਗ " : "";
      return Object.freeze([
        annualHypothesis(locale, source),
        rateCalculation(locale, source),
        amountStep,
        locale === "hi-IN"
          ? `बढ़ोतरी ${approx}${cleanPercent(effective)} है, जो प्रश्न की प्रभावी दर से मिलती है।`
          : `ਵਾਧਾ ${approxPa}${cleanPercent(effective)} ਹੈ, ਜੋ ਪ੍ਰਸ਼ਨ ਦੀ ਪ੍ਰਭਾਵੀ ਦਰ ਨਾਲ ਮਿਲਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-078": {
      const amount = completeAmountForState(s);
      return Object.freeze([
        markRoundedRate(base[0] ?? "", locale, s.nominalAnnualRatePercent, s.frequency),
        cleanNominalAmountStep(source, base[1] ?? ""),
        confirmationAmount(locale, amount),
        locale === "hi-IN"
          ? `इसलिए 1 वर्ष में ब्याज ${s.frequency} बार, यानी ${cp004FrequencyIntervalText(locale, s.frequency)} जुड़ता है।`
          : `ਇਸ ਲਈ 1 ਸਾਲ ਵਿੱਚ ਵਿਆਜ ${s.frequency} ਵਾਰ, ਅਰਥਾਤ ${cp004FrequencyIntervalText(locale, s.frequency)} ਜੁੜਦਾ ਹੈ।`,
      ]);
    }

    case "INT-QL-079":
    case "INT-QL-080": {
      const steps = [...base];
      if (steps[0]) {
        steps[0] = replaceGrowthFactor(
          steps[0],
          nominalGrowthExpression(s.nominalAnnualRatePercent, 1),
        );
      }
      return Object.freeze(steps);
    }

    case "INT-QL-081": {
      const brokenAmount = brokenAmountForState(s);
      const tailRate = mul(s.nominalAnnualRatePercent, rat(s.tailMonths, 12));
      const tailMultiplier = add(rat(1), div(tailRate, rat(100)));
      const beforeTail = div(brokenAmount, tailMultiplier);
      const tailBase = add(rat(100), tailRate);
      const annualBase = add(rat(100), s.nominalAnnualRatePercent);
      const annualPower = s.fullYears === 1 ? compactTwo(annualBase) : `${compactTwo(annualBase)}^${s.fullYears}`;
      const hundredPower = s.fullYears === 1 ? "100" : `100^${s.fullYears}`;
      return Object.freeze([
        locale === "hi-IN"
          ? `अंतिम ${s.tailMonths} महीनों में साधारण ब्याज ${cleanPercent(tailRate)} लगा।`
          : `ਅੰਤਿਮ ${s.tailMonths} ਮਹੀਨਿਆਂ ਵਿੱਚ ਸਧਾਰਣ ਵਿਆਜ ${cleanPercent(tailRate)} ਲੱਗਿਆ।`,
        locale === "hi-IN"
          ? `उससे पहले की राशि = ${moneyText(brokenAmount)} × 100 ÷ ${compactTwo(tailBase)} = ${moneyText(beforeTail)}।`
          : `ਉਸ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਰਕਮ = ${moneyText(brokenAmount)} × 100 ÷ ${compactTwo(tailBase)} = ${moneyText(beforeTail)}।`,
        locale === "hi-IN"
          ? `मूलधन = ${moneyText(beforeTail)} × ${hundredPower} ÷ ${annualPower} = ${moneyText(s.principal)}।`
          : `ਮੂਲਧਨ = ${moneyText(beforeTail)} × ${hundredPower} ÷ ${annualPower} = ${moneyText(s.principal)}।`,
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

    case "INT-QL-084":
    case "INT-QL-085": {
      const steps = [...base];
      if (steps[0]) {
        steps[0] = replaceGrowthFactor(
          steps[0],
          nominalGrowthExpression(s.nominalAnnualRatePercent, s.firstFrequency),
        );
      }
      if (steps[1]) {
        steps[1] = replaceGrowthFactor(
          steps[1],
          nominalGrowthExpression(s.nominalAnnualRatePercent, s.secondFrequency),
        );
      }
      return Object.freeze(steps);
    }
  }

  return Object.freeze(base);
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
