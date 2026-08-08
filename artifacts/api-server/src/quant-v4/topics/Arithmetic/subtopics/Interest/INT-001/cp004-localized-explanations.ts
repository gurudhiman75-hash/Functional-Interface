import {
  FREQUENCIES,
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
  periodMultiplierFromPeriodicRate,
  pow,
  rat,
  sub,
  type Cp004Frequency,
  type Cp004MathematicalState,
  type Rational,
} from "./cp004-frequency-math";
import {
  moneyText,
  percentText,
  rationalText,
} from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import { localizedCp004AnswerText } from "./cp004-localized-options";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXPLANATION_VERSION = "INT-CP-004-HI-PA-EXPLANATIONS-v1" as const;

const one = rat(1);
const hundred = rat(100);

function periodNoun(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष";
      case 2: return "अर्धवर्ष";
      case 4: return "तिमाही";
      case 12: return "माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਹੀਨਾ";
  }
}

function completeYears(locale: IntCp004LocalizedLocale, years: number): string {
  return locale === "hi-IN" ? `${years} पूर्ण वर्ष` : `${years} ਪੂਰੇ ਸਾਲ`;
}

function periodCount(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  return `${periods} ${periodNoun(locale, frequency)}`;
}

function duration(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  const months = periods * (12 / frequency);
  return months % 12 === 0 ? cp004YearsText(locale, months / 12) : cp004MonthsText(locale, months);
}

function rateStep(locale: IntCp004LocalizedLocale, state: Cp004MathematicalState): string {
  const rate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  return locale === "hi-IN"
    ? `प्रति ${periodNoun(locale, state.frequency)} दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(rate)}।`
    : `ਹਰ ${periodNoun(locale, state.frequency)} ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(rate)}।`;
}

function repeatedSteps(
  locale: IntCp004LocalizedLocale,
  principal: Rational,
  ratePercent: Rational,
  periods: number,
  frequency: Cp004Frequency,
): readonly string[] {
  const multiplier = add(one, div(ratePercent, hundred));
  const steps: string[] = [];
  let balance = principal;
  for (let index = 1; index <= periods; index += 1) {
    const next = mul(balance, multiplier);
    steps.push(locale === "hi-IN"
      ? `${index}${index === 1 ? "वीं" : "वीं"} ${periodNoun(locale, frequency)} के बाद राशि = ${moneyText(balance)} × (1 + ${percentText(ratePercent)}) = ${moneyText(next)}।`
      : `${index}ਵੀਂ ${periodNoun(locale, frequency)} ਤੋਂ ਬਾਅਦ ਰਕਮ = ${moneyText(balance)} × (1 + ${percentText(ratePercent)}) = ${moneyText(next)}।`);
    balance = next;
  }
  return Object.freeze(steps);
}

function exactRatioSteps(
  locale: IntCp004LocalizedLocale,
  labelHi: string,
  labelPa: string,
  numerator: Rational,
  denominator: Rational,
): readonly [string, Rational] {
  const ratio = div(numerator, denominator);
  const line = locale === "hi-IN"
    ? `${labelHi} = ${moneyText(numerator)} ÷ ${moneyText(denominator)} = ${rationalText(ratio)}।`
    : `${labelPa} = ${moneyText(numerator)} ÷ ${moneyText(denominator)} = ${rationalText(ratio)}।`;
  return [line, ratio];
}

function frequencyTimes(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष में एक बार";
      case 2: return "वर्ष में दो बार";
      case 4: return "वर्ष में चार बार";
      case 12: return "हर माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ";
    case 2: return "ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ";
    case 4: return "ਸਾਲ ਵਿੱਚ ਚਾਰ ਵਾਰ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

function whatAsked(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const hi: Record<string, string> = {
    "INT-QL-067": "हमें सभी चक्रवृद्धि अवधियों के बाद अंतिम राशि ज्ञात करनी है।",
    "INT-QL-068": "हमें अंतिम राशि नहीं, केवल चक्रवृद्धि ब्याज ज्ञात करना है।",
    "INT-QL-069": "हमें अंतिम राशि से सभी चक्रवृद्धि चरण उलटकर मूलधन ज्ञात करना है।",
    "INT-QL-070": "हमें दिए गए चक्रवृद्धि ब्याज से मूलधन ज्ञात करना है।",
    "INT-QL-071": "हमें दिए गए चक्रवृद्धि क्रम के लिए नाममात्र वार्षिक दर ज्ञात करनी है।",
    "INT-QL-072": "हमें आवश्यक चक्रवृद्धि अवधियाँ गिनकर उन्हें वास्तविक समय में बदलना है।",
    "INT-QL-073": "हमें सीधे दी गई प्रति-अवधि दर से अंतिम राशि ज्ञात करनी है।",
    "INT-QL-074": "हमें सीधे दी गई प्रति-अवधि दर से अर्जित ब्याज ज्ञात करना है।",
    "INT-QL-075": "हमें दो चक्रवृद्धि क्रमों की परिपक्वता राशियों का अंतर ज्ञात करना है।",
    "INT-QL-076": "हमें एक पूर्ण वर्ष में वास्तविक प्रतिशत वृद्धि ज्ञात करनी है।",
    "INT-QL-077": "हमें दी गई प्रभावी वार्षिक वृद्धि से नाममात्र वार्षिक दर ज्ञात करनी है।",
    "INT-QL-078": "हमें वह चक्रवृद्धि आवृत्ति पहचाननी है जो दी गई अंतिम राशि बनाती है।",
    "INT-QL-079": "हमें पूर्ण वर्षों और अतिरिक्त महीनों के बाद अंतिम राशि ज्ञात करनी है।",
    "INT-QL-080": "हमें पूरी मिश्रित अवधि में अर्जित कुल ब्याज ज्ञात करना है।",
    "INT-QL-081": "हमें दो-चरणीय अंतिम राशि से मूलधन ज्ञात करना है।",
    "INT-QL-082": "हमें वह वार्षिक दर ज्ञात करनी है जो दोनों चरणों को सही बनाती है।",
    "INT-QL-083": "हमें अंतिम साधारण-ब्याज अवधि से पहले के पूर्ण वर्षों की संख्या ज्ञात करनी है।",
    "INT-QL-084": "हमें बदलती चक्रवृद्धि आवृत्ति के बाद अंतिम राशि ज्ञात करनी है।",
    "INT-QL-085": "हमें बदलती चक्रवृद्धि आवृत्ति के बाद कुल चक्रवृद्धि ब्याज ज्ञात करना है।",
  };
  const pa: Record<string, string> = {
    "INT-QL-067": "ਸਾਨੂੰ ਸਾਰੀਆਂ ਚੱਕਰਵੱਧੀ ਅਵਧੀਆਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-068": "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ, ਕੇਵਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-069": "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਸਾਰੇ ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਉਲਟ ਕੇ ਮੂਲਧਨ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-070": "ਸਾਨੂੰ ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-071": "ਸਾਨੂੰ ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਕ੍ਰਮ ਲਈ ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-072": "ਸਾਨੂੰ ਲੋੜੀਂਦੀਆਂ ਚੱਕਰਵੱਧੀ ਅਵਧੀਆਂ ਗਿਣ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਬਦਲਣਾ ਹੈ।",
    "INT-QL-073": "ਸਾਨੂੰ ਸਿੱਧੀ ਦਿੱਤੀ ਹਰ-ਅਵਧੀ ਦਰ ਨਾਲ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-074": "ਸਾਨੂੰ ਸਿੱਧੀ ਦਿੱਤੀ ਹਰ-ਅਵਧੀ ਦਰ ਨਾਲ ਕਮਾਇਆ ਵਿਆਜ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-075": "ਸਾਨੂੰ ਦੋ ਚੱਕਰਵੱਧੀ ਕ੍ਰਮਾਂ ਦੀ ਮਿਆਦ-ਪੂਰੀ ਰਕਮ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-076": "ਸਾਨੂੰ ਇੱਕ ਪੂਰੇ ਸਾਲ ਵਿੱਚ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-077": "ਸਾਨੂੰ ਦਿੱਤੇ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਾਧੇ ਤੋਂ ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-078": "ਸਾਨੂੰ ਉਹ ਚੱਕਰਵੱਧੀ ਆਵ੍ਰਿਤੀ ਪਛਾਣਨੀ ਹੈ ਜੋ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਬਣਾਉਂਦੀ ਹੈ।",
    "INT-QL-079": "ਸਾਨੂੰ ਪੂਰੇ ਸਾਲਾਂ ਅਤੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-080": "ਸਾਨੂੰ ਪੂਰੀ ਮਿਲੀ-ਜੁਲੀ ਮਿਆਦ ਵਿੱਚ ਕਮਾਇਆ ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-081": "ਸਾਨੂੰ ਦੋ-ਪੜਾਅ ਵਾਲੀ ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਕਰਨਾ ਹੈ।",
    "INT-QL-082": "ਸਾਨੂੰ ਉਹ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰਨੀ ਹੈ ਜੋ ਦੋਵੇਂ ਪੜਾਅ ਸਹੀ ਬਣਾਉਂਦੀ ਹੈ।",
    "INT-QL-083": "ਸਾਨੂੰ ਅੰਤਿਮ ਸਧਾਰਣ-ਵਿਆਜ ਅਵਧੀ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-084": "ਸਾਨੂੰ ਬਦਲਦੀ ਚੱਕਰਵੱਧੀ ਆਵ੍ਰਿਤੀ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰਨੀ ਹੈ।",
    "INT-QL-085": "ਸਾਨੂੰ ਬਦਲਦੀ ਚੱਕਰਵੱਧੀ ਆਵ੍ਰਿਤੀ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਕਰਨਾ ਹੈ।",
  };
  return (locale === "hi-IN" ? hi : pa)[source.qlId]!;
}

function commonMistake(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  const group = (() => {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-068":
      case "INT-QL-069":
      case "INT-QL-070": return "COMPOUNDING";
      case "INT-QL-071":
      case "INT-QL-072":
      case "INT-QL-073":
      case "INT-QL-074": return "PERIOD";
      case "INT-QL-075":
      case "INT-QL-076":
      case "INT-QL-077":
      case "INT-QL-078": return "FREQUENCY";
      case "INT-QL-079":
      case "INT-QL-080":
      case "INT-QL-081":
      case "INT-QL-082":
      case "INT-QL-083": return "TAIL";
      case "INT-QL-084":
      case "INT-QL-085": return "MIXED";
    }
  })();
  if (locale === "hi-IN") {
    switch (group) {
      case "COMPOUNDING": return "साधारण ब्याज या केवल एक अवधि का गुणक न लगाएँ; सभी चक्रवृद्धि चरण क्रम से लागू या उलटें।";
      case "PERIOD": return "वार्षिक दर, प्रति-अवधि दर और अवधि-संख्या को अलग रखें; अवधि-संख्या को सीधे वर्ष न मानें।";
      case "FREQUENCY": return "समान वार्षिक दर का अर्थ समान अंतिम राशि नहीं है; प्रत्येक आवृत्ति की प्रति-अवधि दर और अवधि-संख्या जाँचें।";
      case "TAIL": return "अतिरिक्त महीनों को मासिक चक्रवृद्धि या पूर्ण वर्ष न मानें; प्रश्न के अनुसार उस भाग पर साधारण ब्याज लगाएँ।";
      case "MIXED": return "पूरी अवधि में एक ही आवृत्ति न लगाएँ; सीमा-बिंदु पर प्रति-अवधि दर और अवधि-संख्या बदलें।";
    }
  }
  switch (group) {
    case "COMPOUNDING": return "ਸਧਾਰਣ ਵਿਆਜ ਜਾਂ ਕੇਵਲ ਇੱਕ ਅਵਧੀ ਦਾ ਗੁਣਕ ਨਾ ਲਗਾਓ; ਸਾਰੇ ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ ਜਾਂ ਉਲਟੋ।";
    case "PERIOD": return "ਸਾਲਾਨਾ ਦਰ, ਹਰ-ਅਵਧੀ ਦਰ ਅਤੇ ਅਵਧੀ-ਗਿਣਤੀ ਨੂੰ ਵੱਖ ਰੱਖੋ; ਅਵਧੀ-ਗਿਣਤੀ ਨੂੰ ਸਿੱਧਾ ਸਾਲ ਨਾ ਮੰਨੋ।";
    case "FREQUENCY": return "ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ਦਾ ਅਰਥ ਇੱਕੋ ਅੰਤਿਮ ਰਕਮ ਨਹੀਂ; ਹਰ ਆਵ੍ਰਿਤੀ ਦੀ ਹਰ-ਅਵਧੀ ਦਰ ਅਤੇ ਅਵਧੀ-ਗਿਣਤੀ ਜਾਂਚੋ।";
    case "TAIL": return "ਵਾਧੂ ਮਹੀਨਿਆਂ ਨੂੰ ਮਾਸਿਕ ਚੱਕਰਵੱਧੀ ਜਾਂ ਪੂਰਾ ਸਾਲ ਨਾ ਮੰਨੋ; ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਉਸ ਹਿੱਸੇ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਓ।";
    case "MIXED": return "ਪੂਰੀ ਮਿਆਦ ਵਿੱਚ ਇੱਕੋ ਆਵ੍ਰਿਤੀ ਨਾ ਲਗਾਓ; ਹੱਦ-ਬਿੰਦੂ ਉੱਤੇ ਹਰ-ਅਵਧੀ ਦਰ ਅਤੇ ਅਵਧੀ-ਗਿਣਤੀ ਬਦਲੋ।";
  }
}

function stepsFor(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly string[] {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const periodRate = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const compoundInterest = sub(amount, state.principal);
  const brokenAmount = brokenAmountForState(state);
  const afterWholeYears = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, 1, state.fullYears);
  const tailInterest = sub(brokenAmount, afterWholeYears);
  const mixedAmount = mixedAmountForState(state);

  switch (state.qlId) {
    case "INT-QL-067":
      return Object.freeze([rateStep(locale, state), ...repeatedSteps(locale, state.principal, periodRate, state.periods, state.frequency)]);
    case "INT-QL-068":
      return Object.freeze([
        rateStep(locale, state),
        ...repeatedSteps(locale, state.principal, periodRate, state.periods, state.frequency),
        locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = अंतिम राशि − मूलधन = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}।`
          : `ਚੱਕਰਵੱਧੀ ਵਿਆਜ = ਅੰਤਿਮ ਰਕਮ − ਮੂਲਧਨ = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}।`,
      ]);
    case "INT-QL-069": {
      const [ratioLine, ratio] = exactRatioSteps(locale, "राशि अनुपात A/P", "ਰਕਮ ਅਨੁਪਾਤ A/P", amount, state.principal);
      return Object.freeze([
        rateStep(locale, state),
        ratioLine,
        locale === "hi-IN"
          ? `अतः P = A × ${ratio.denominator}/${ratio.numerator} = ${moneyText(amount)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`
          : `ਇਸ ਲਈ P = A × ${ratio.denominator}/${ratio.numerator} = ${moneyText(amount)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`,
        locale === "hi-IN"
          ? `जाँच: ${periodCount(locale, state.periods, state.frequency)} तक चक्रवृद्धि करने पर ${moneyText(state.principal)} से ${moneyText(amount)} प्राप्त होता है।`
          : `ਜਾਂਚ: ${periodCount(locale, state.periods, state.frequency)} ਤੱਕ ਚੱਕਰਵੱਧੀ ਕਰਨ ਨਾਲ ${moneyText(state.principal)} ਤੋਂ ${moneyText(amount)} ਮਿਲਦਾ ਹੈ।`,
      ]);
    }
    case "INT-QL-070": {
      const [ratioLine, ratio] = exactRatioSteps(locale, "ब्याज अनुपात CI/P", "ਵਿਆਜ ਅਨੁਪਾਤ CI/P", compoundInterest, state.principal);
      return Object.freeze([
        rateStep(locale, state),
        ratioLine,
        locale === "hi-IN"
          ? `अतः P = CI × ${ratio.denominator}/${ratio.numerator} = ${moneyText(compoundInterest)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`
          : `ਇਸ ਲਈ P = CI × ${ratio.denominator}/${ratio.numerator} = ${moneyText(compoundInterest)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`,
        locale === "hi-IN"
          ? `जाँच: ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}।`
          : `ਜਾਂਚ: ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(compoundInterest)}।`,
      ]);
    }
    case "INT-QL-071":
      return Object.freeze([
        locale === "hi-IN"
          ? `${moneyText(state.principal)} को ${periodCount(locale, state.periods, state.frequency)} में ${moneyText(amount)} बनना है।`
          : `${moneyText(state.principal)} ਨੇ ${periodCount(locale, state.periods, state.frequency)} ਵਿੱਚ ${moneyText(amount)} ਬਣਨਾ ਹੈ।`,
        rateStep(locale, state),
        ...repeatedSteps(locale, state.principal, periodRate, state.periods, state.frequency),
        locale === "hi-IN"
          ? `यह गणना दी गई राशि तक पहुँचती है; इसलिए नाममात्र वार्षिक दर ${percentText(state.nominalAnnualRatePercent)} है।`
          : `ਇਹ ਗਿਣਤੀ ਦਿੱਤੀ ਰਕਮ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ; ਇਸ ਲਈ ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ${percentText(state.nominalAnnualRatePercent)} ਹੈ।`,
      ]);
    case "INT-QL-072":
      return Object.freeze([
        rateStep(locale, state),
        ...repeatedSteps(locale, state.principal, periodRate, state.periods, state.frequency),
        locale === "hi-IN"
          ? `राशि पहली बार ${state.periods} अवधियों के बाद ${moneyText(amount)} होती है।`
          : `ਰਕਮ ਪਹਿਲੀ ਵਾਰ ${state.periods} ਅਵਧੀਆਂ ਤੋਂ ਬਾਅਦ ${moneyText(amount)} ਹੁੰਦੀ ਹੈ।`,
        locale === "hi-IN"
          ? `${periodCount(locale, state.periods, state.frequency)} = ${duration(locale, state.periods, state.frequency)}।`
          : `${periodCount(locale, state.periods, state.frequency)} = ${duration(locale, state.periods, state.frequency)}।`,
      ]);
    case "INT-QL-073":
    case "INT-QL-074": {
      const directAmount = periodicAmountForState(state);
      const directInterest = sub(directAmount, state.principal);
      const base = [
        locale === "hi-IN"
          ? `${percentText(state.periodicRatePercent)} पहले से एक अवधि की दर है; इसे दोबारा विभाजित नहीं करना है।`
          : `${percentText(state.periodicRatePercent)} ਪਹਿਲਾਂ ਹੀ ਇੱਕ ਅਵਧੀ ਦੀ ਦਰ ਹੈ; ਇਸ ਨੂੰ ਦੁਬਾਰਾ ਵੰਡਣਾ ਨਹੀਂ ਹੈ।`,
        ...repeatedSteps(locale, state.principal, state.periodicRatePercent, state.periods, state.frequency),
      ];
      if (state.qlId === "INT-QL-074") {
        base.push(locale === "hi-IN"
          ? `ब्याज = ${moneyText(directAmount)} − ${moneyText(state.principal)} = ${moneyText(directInterest)}।`
          : `ਵਿਆਜ = ${moneyText(directAmount)} − ${moneyText(state.principal)} = ${moneyText(directInterest)}।`);
      }
      return Object.freeze(base);
    }
    case "INT-QL-075": {
      const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      return Object.freeze([
        locale === "hi-IN"
          ? `${cp004FrequencyLabel(locale, state.frequency)} क्रम: प्रति अवधि दर ${percentText(periodicRate(state.nominalAnnualRatePercent, state.frequency))}, कुल ${state.frequency * state.years} अवधियाँ; राशि = ${moneyText(first)}।`
          : `${cp004FrequencyLabel(locale, state.frequency)} ਕ੍ਰਮ: ਹਰ ਅਵਧੀ ਦਰ ${percentText(periodicRate(state.nominalAnnualRatePercent, state.frequency))}, ਕੁੱਲ ${state.frequency * state.years} ਅਵਧੀਆਂ; ਰਕਮ = ${moneyText(first)}।`,
        locale === "hi-IN"
          ? `${cp004FrequencyLabel(locale, state.comparisonFrequency)} क्रम: प्रति अवधि दर ${percentText(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency))}, कुल ${state.comparisonFrequency * state.years} अवधियाँ; राशि = ${moneyText(second)}।`
          : `${cp004FrequencyLabel(locale, state.comparisonFrequency)} ਕ੍ਰਮ: ਹਰ ਅਵਧੀ ਦਰ ${percentText(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency))}, ਕੁੱਲ ${state.comparisonFrequency * state.years} ਅਵਧੀਆਂ; ਰਕਮ = ${moneyText(second)}।`,
        locale === "hi-IN"
          ? `दोनों राशियों का अंतर = बड़ी राशि − छोटी राशि = ${moneyText(source.solution)}।`
          : `ਦੋਵਾਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ = ਵੱਡੀ ਰਕਮ − ਛੋਟੀ ਰਕਮ = ${moneyText(source.solution)}।`,
      ]);
    }
    case "INT-QL-076": {
      const oneYearAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      return Object.freeze([
        rateStep(locale, state),
        ...repeatedSteps(locale, rat(100), periodRate, state.frequency, state.frequency),
        locale === "hi-IN"
          ? `₹100 पर वास्तविक वृद्धि = ${moneyText(oneYearAmount)} − ₹100 = ${moneyText(sub(oneYearAmount, rat(100)))}। अतः प्रभावी वार्षिक दर ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))} है।`
          : `₹100 ਉੱਤੇ ਅਸਲ ਵਾਧਾ = ${moneyText(oneYearAmount)} − ₹100 = ${moneyText(sub(oneYearAmount, rat(100)))}। ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ${percentText(effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency))} ਹੈ।`,
      ]);
    }
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      const afterYear = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      return Object.freeze([
        locale === "hi-IN"
          ? `${percentText(effective)} प्रभावी दर का अर्थ है कि ₹100 एक वर्ष में ${moneyText(add(rat(100), effective))} बने।`
          : `${percentText(effective)} ਪ੍ਰਭਾਵੀ ਦਰ ਦਾ ਅਰਥ ਹੈ ਕਿ ₹100 ਇੱਕ ਸਾਲ ਵਿੱਚ ${moneyText(add(rat(100), effective))} ਬਣੇ।`,
        rateStep(locale, state),
        ...repeatedSteps(locale, rat(100), periodRate, state.frequency, state.frequency),
        locale === "hi-IN"
          ? `${moneyText(afterYear)} वही प्रभावी वृद्धि देता है; इसलिए नाममात्र वार्षिक दर ${percentText(state.nominalAnnualRatePercent)} है।`
          : `${moneyText(afterYear)} ਉਹੀ ਪ੍ਰਭਾਵੀ ਵਾਧਾ ਦਿੰਦਾ ਹੈ; ਇਸ ਲਈ ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ${percentText(state.nominalAnnualRatePercent)} ਹੈ।`,
      ]);
    }
    case "INT-QL-078":
      return Object.freeze([
        locale === "hi-IN"
          ? `मूलधन ${moneyText(state.principal)}, वार्षिक दर ${percentText(state.nominalAnnualRatePercent)} और लक्ष्य राशि ${moneyText(amount)} है।`
          : `ਮੂਲਧਨ ${moneyText(state.principal)}, ਸਾਲਾਨਾ ਦਰ ${percentText(state.nominalAnnualRatePercent)} ਅਤੇ ਲਕਸ਼ ਰਕਮ ${moneyText(amount)} ਹੈ।`,
        ...FREQUENCIES.map((frequency) => {
          const candidate = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, frequency, frequency * state.years);
          return locale === "hi-IN"
            ? `${cp004FrequencyLabel(locale, frequency)} चक्रवृद्धि से ${cp004YearsText(locale, state.years)} बाद राशि ${moneyText(candidate)} होती है।`
            : `${cp004FrequencyLabel(locale, frequency)} ਚੱਕਰਵੱਧੀ ਨਾਲ ${cp004YearsText(locale, state.years)} ਬਾਅਦ ਰਕਮ ${moneyText(candidate)} ਹੁੰਦੀ ਹੈ।`;
        }),
        locale === "hi-IN"
          ? `केवल ${cp004FrequencyLabel(locale, state.frequency)} क्रम से ${moneyText(amount)} मिलता है; ब्याज ${frequencyTimes(locale, state.frequency)} जुड़ता है।`
          : `ਕੇਵਲ ${cp004FrequencyLabel(locale, state.frequency)} ਕ੍ਰਮ ਨਾਲ ${moneyText(amount)} ਮਿਲਦਾ ਹੈ; ਵਿਆਜ ${frequencyTimes(locale, state.frequency)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।`,
      ]);
    case "INT-QL-079":
    case "INT-QL-080": {
      const base = [
        ...repeatedSteps(locale, state.principal, state.nominalAnnualRatePercent, state.fullYears, 1),
        locale === "hi-IN"
          ? `${completeYears(locale, state.fullYears)} के बाद शेष राशि ${moneyText(afterWholeYears)} है।`
          : `${completeYears(locale, state.fullYears)} ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ${moneyText(afterWholeYears)} ਹੈ।`,
        locale === "hi-IN"
          ? `शेष ${cp004MonthsText(locale, state.tailMonths)} पर साधारण ब्याज = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}।`
          : `ਬਾਕੀ ${cp004MonthsText(locale, state.tailMonths)} ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}।`,
        locale === "hi-IN"
          ? `अंतिम राशि = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।`
          : `ਅੰਤਿਮ ਰਕਮ = ${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}।`,
      ];
      if (state.qlId === "INT-QL-080") {
        base.push(locale === "hi-IN"
          ? `कुल ब्याज = ${moneyText(brokenAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(brokenAmount, state.principal))}।`
          : `ਕੁੱਲ ਵਿਆਜ = ${moneyText(brokenAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(brokenAmount, state.principal))}।`);
      }
      return Object.freeze(base);
    }
    case "INT-QL-081": {
      const [ratioLine, ratio] = exactRatioSteps(locale, "अंतिम राशि अनुपात A/P", "ਅੰਤਿਮ ਰਕਮ ਅਨੁਪਾਤ A/P", brokenAmount, state.principal);
      return Object.freeze([
        locale === "hi-IN"
          ? `पूर्ण वर्षों में वार्षिक चक्रवृद्धि और अंतिम ${cp004MonthsText(locale, state.tailMonths)} में नवीनतम शेष पर साधारण ब्याज लगता है।`
          : `ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਅਤੇ ਅੰਤਿਮ ${cp004MonthsText(locale, state.tailMonths)} ਵਿੱਚ ਨਵੇਂ ਬਕਾਏ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ।`,
        ratioLine,
        locale === "hi-IN"
          ? `P = A × ${ratio.denominator}/${ratio.numerator} = ${moneyText(brokenAmount)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`
          : `P = A × ${ratio.denominator}/${ratio.numerator} = ${moneyText(brokenAmount)} × ${ratio.denominator}/${ratio.numerator} = ${moneyText(state.principal)}।`,
        locale === "hi-IN"
          ? `जाँच: मूलधन पहले ${moneyText(afterWholeYears)} और फिर ${moneyText(brokenAmount)} बनता है।`
          : `ਜਾਂਚ: ਮੂਲਧਨ ਪਹਿਲਾਂ ${moneyText(afterWholeYears)} ਅਤੇ ਫਿਰ ${moneyText(brokenAmount)} ਬਣਦਾ ਹੈ।`,
      ]);
    }
    case "INT-QL-082":
      return Object.freeze([
        locale === "hi-IN"
          ? `${percentText(state.nominalAnnualRatePercent)} विकल्प को दो-चरणीय नियम में जाँचें: पहले ${completeYears(locale, state.fullYears)} वार्षिक चक्रवृद्धि।`
          : `${percentText(state.nominalAnnualRatePercent)} ਵਿਕਲਪ ਨੂੰ ਦੋ-ਪੜਾਅ ਨਿਯਮ ਵਿੱਚ ਜਾਂਚੋ: ਪਹਿਲਾਂ ${completeYears(locale, state.fullYears)} ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ।`,
        ...repeatedSteps(locale, state.principal, state.nominalAnnualRatePercent, state.fullYears, 1),
        locale === "hi-IN"
          ? `अंतिम ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}।`
          : `ਅੰਤਿਮ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ = ${moneyText(afterWholeYears)} × ${percentText(state.nominalAnnualRatePercent)} × ${state.tailMonths}/12 = ${moneyText(tailInterest)}।`,
        locale === "hi-IN"
          ? `${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}, जो दी गई राशि से ठीक मेल खाता है।`
          : `${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}, ਜੋ ਦਿੱਤੀ ਰਕਮ ਨਾਲ ਬਿਲਕੁਲ ਮਿਲਦਾ ਹੈ।`,
      ]);
    case "INT-QL-083":
      return Object.freeze([
        locale === "hi-IN"
          ? `${moneyText(state.principal)} पर प्रत्येक पूर्ण वर्ष ${percentText(state.nominalAnnualRatePercent)} चक्रवृद्धि लागू करें।`
          : `${moneyText(state.principal)} ਉੱਤੇ ਹਰ ਪੂਰੇ ਸਾਲ ${percentText(state.nominalAnnualRatePercent)} ਚੱਕਰਵੱਧੀ ਲਗਾਓ।`,
        ...repeatedSteps(locale, state.principal, state.nominalAnnualRatePercent, state.fullYears, 1),
        locale === "hi-IN"
          ? `${completeYears(locale, state.fullYears)} के बाद राशि ${moneyText(afterWholeYears)} है। अंतिम ${cp004MonthsText(locale, state.tailMonths)} का साधारण ब्याज ${moneyText(tailInterest)} है।`
          : `${completeYears(locale, state.fullYears)} ਤੋਂ ਬਾਅਦ ਰਕਮ ${moneyText(afterWholeYears)} ਹੈ। ਅੰਤਿਮ ${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ${moneyText(tailInterest)} ਹੈ।`,
        locale === "hi-IN"
          ? `${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; अतः पूर्ण वर्षों की संख्या ${state.fullYears} है।`
          : `${moneyText(afterWholeYears)} + ${moneyText(tailInterest)} = ${moneyText(brokenAmount)}; ਇਸ ਲਈ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ${state.fullYears} ਹੈ।`,
      ]);
    case "INT-QL-084":
    case "INT-QL-085": {
      const afterFirst = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.firstFrequency, state.firstFrequency * state.firstYears);
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      const base = [
        locale === "hi-IN"
          ? `पहला अंतराल: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}, कुल ${state.firstFrequency * state.firstYears} अवधियाँ।`
          : `ਪਹਿਲਾ ਅੰਤਰਾਲ: ਹਰ ਅਵਧੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}, ਕੁੱਲ ${state.firstFrequency * state.firstYears} ਅਵਧੀਆਂ।`,
        locale === "hi-IN"
          ? `पहले अंतराल के बाद शेष राशि ${moneyText(afterFirst)} है।`
          : `ਪਹਿਲੇ ਅੰਤਰਾਲ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ${moneyText(afterFirst)} ਹੈ।`,
        locale === "hi-IN"
          ? `दूसरा अंतराल: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}, कुल ${state.secondFrequency * state.secondYears} अवधियाँ।`
          : `ਦੂਜਾ ਅੰਤਰਾਲ: ਹਰ ਅਵਧੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}, ਕੁੱਲ ${state.secondFrequency * state.secondYears} ਅਵਧੀਆਂ।`,
        locale === "hi-IN"
          ? `दूसरा क्रम ${moneyText(afterFirst)} पर लगाने से अंतिम राशि ${moneyText(mixedAmount)} मिलती है।`
          : `ਦੂਜਾ ਕ੍ਰਮ ${moneyText(afterFirst)} ਉੱਤੇ ਲਗਾਉਣ ਨਾਲ ਅੰਤਿਮ ਰਕਮ ${moneyText(mixedAmount)} ਮਿਲਦੀ ਹੈ।`,
      ];
      if (state.qlId === "INT-QL-085") {
        base.push(locale === "hi-IN"
          ? `चक्रवृद्धि ब्याज = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(mixedAmount, state.principal))}।`
          : `ਚੱਕਰਵੱਧੀ ਵਿਆਜ = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(sub(mixedAmount, state.principal))}।`);
      }
      return Object.freeze(base);
    }
  }
}

export function localizeCp004Explanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const correctAnswer = localizedCp004AnswerText(
    locale,
    source.answerSemantic,
    source.mathematicalState,
    source.solution,
  );
  const explanation: IntCp004LocalizedExplanation = Object.freeze({
    whatAsked: whatAsked(source, locale),
    steps: stepsFor(source, locale),
    finalAnswer: locale === "hi-IN"
      ? `अतः सही उत्तर ${correctAnswer} है।`
      : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${correctAnswer} ਹੈ।`,
    commonMistake: commonMistake(source, locale),
  });

  assertCp004LocalizedText(locale, explanation.whatAsked, `${source.qlId}/${source.seed}/what-asked`);
  for (const [index, step] of explanation.steps.entries()) {
    assertCp004LocalizedText(locale, step, `${source.qlId}/${source.seed}/step-${index + 1}`);
  }
  assertCp004LocalizedText(locale, explanation.finalAnswer, `${source.qlId}/${source.seed}/final-answer`);
  assertCp004LocalizedText(locale, explanation.commonMistake, `${source.qlId}/${source.seed}/common-mistake`);
  return explanation;
}
