import {
  brokenAmountForState,
  completeAmountForState,
  completeAmountFromNominal,
  div,
  effectiveAnnualRate,
  mul,
  periodicRate,
  rat,
  sub,
} from "./cp004-frequency-math";
import { moneyText, percentText, rationalText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FrequencyIntervalText,
  cp004MonthsText,
} from "./cp004-localization-language-pack";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

const LETTERS = Object.freeze(["A", "B", "C", "D"] as const);

function naturalize(text: string, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replaceAll("नाममात्र वार्षिक दर", "वार्षिक ब्याज दर")
      .replaceAll("घोषित वार्षिक दर", "दी गई वार्षिक ब्याज दर")
      .replaceAll("अवधि-संख्या", "अवधियों की संख्या")
      .replaceAll("प्रति अवधि", "हर चक्रवृद्धि अवधि")
      .replace(/(\d+)वीं माह/gu, "$1वें महीने")
      .replace(/(\d+)वीं वर्ष/gu, "$1वें वर्ष")
      .replace(/(\d+)वीं तिमाही/gu, "$1वीं तिमाही")
      .replace(/(\d+)वीं अर्धवर्ष/gu, "$1वीं छमाही");
  }
  return text
    .replaceAll("ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ", "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ")
    .replaceAll("ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ", "ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ")
    .replaceAll("ਅਵਧੀ-ਗਿਣਤੀ", "ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ")
    .replaceAll("ਪ੍ਰਤੀ ਮਿਆਦ", "ਹਰ ਚੱਕਰਵੱਧੀ ਮਿਆਦ")
    .replace(/(\d+)ਵੀਂ ਮਹੀਨਾ/gu, "$1ਵੇਂ ਮਹੀਨੇ")
    .replace(/(\d+)ਵੀਂ ਸਾਲ/gu, "$1ਵੇਂ ਸਾਲ")
    .replace(/(\d+)ਵੀਂ ਤਿਮਾਹੀ/gu, "$1ਵੀਂ ਤਿਮਾਹੀ")
    .replace(/(\d+)ਵੀਂ ਛਿਮਾਹੀ/gu, "$1ਵੀਂ ਛਿਮਾਹੀ");
}

function overrideExplanation(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation | undefined {
  const s = source.mathematicalState;
  const hi = locale === "hi-IN";
  const amount = completeAmountForState(s);
  const rate = periodicRate(s.nominalAnnualRatePercent, s.frequency);
  const correctLetter = LETTERS[source.correctIndex] ?? "?";
  let whatAsked = "";
  let steps: string[] = [];
  let commonMistake = "";

  switch (source.qlId) {
    case "INT-QL-069": {
      const factor = div(amount, s.principal);
      whatAsked = hi
        ? "हमें अंतिम राशि को चक्रवृद्धि गुणक से भाग देकर मूलधन ज्ञात करना है।"
        : "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [
        hi
          ? `${cp004FrequencyIntervalText(locale, s.frequency)} की दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`
          : `${cp004FrequencyIntervalText(locale, s.frequency)} ਦੀ ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`,
        hi
          ? `चक्रवृद्धि गुणक = (1 + ${rationalText(rate)}/100)^${s.periods} = ${rationalText(factor)}।`
          : `ਚੱਕਰਵੱਧੀ ਗੁਣਕ = (1 + ${rationalText(rate)}/100)^${s.periods} = ${rationalText(factor)}।`,
        hi ? "मूलधन = अंतिम राशि ÷ चक्रवृद्धि गुणक।" : "ਮੂਲਧਨ = ਅੰਤਿਮ ਰਕਮ ÷ ਚੱਕਰਵੱਧੀ ਗੁਣਕ।",
        `P = ${moneyText(amount)} ÷ ${rationalText(factor)} = ${moneyText(s.principal)}।`,
      ];
      commonMistake = hi
        ? "अज्ञात मूलधन को अनुपात में पहले से न रखें; गुणक केवल दर और समय से निकालें।"
        : "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਨਾ ਰੱਖੋ; ਗੁਣਕ ਸਿਰਫ਼ ਦਰ ਅਤੇ ਸਮੇਂ ਤੋਂ ਕੱਢੋ।";
      break;
    }
    case "INT-QL-070": {
      const interest = sub(amount, s.principal);
      const interestFactor = sub(div(amount, s.principal), rat(1));
      whatAsked = hi
        ? "हमें दिए गए चक्रवृद्धि ब्याज से मूलधन ज्ञात करना है।"
        : "ਸਾਨੂੰ ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [
        hi
          ? `${cp004FrequencyIntervalText(locale, s.frequency)} की दर = ${percentText(rate)}।`
          : `${cp004FrequencyIntervalText(locale, s.frequency)} ਦੀ ਦਰ = ${percentText(rate)}।`,
        hi
          ? `ब्याज गुणक = (1 + ${rationalText(rate)}/100)^${s.periods} − 1 = ${rationalText(interestFactor)}।`
          : `ਵਿਆਜ ਗੁਣਕ = (1 + ${rationalText(rate)}/100)^${s.periods} − 1 = ${rationalText(interestFactor)}।`,
        hi ? "CI = P × ब्याज गुणक, इसलिए P = CI ÷ ब्याज गुणक।" : "CI = P × ਵਿਆਜ ਗੁਣਕ, ਇਸ ਲਈ P = CI ÷ ਵਿਆਜ ਗੁਣਕ।",
        `P = ${moneyText(interest)} ÷ ${rationalText(interestFactor)} = ${moneyText(s.principal)}।`,
      ];
      commonMistake = hi
        ? "दिए गए ब्याज को अंतिम राशि न मानें; CI = P[(1+i)^n−1] का उपयोग करें।"
        : "ਦਿੱਤੇ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨਾ ਮੰਨੋ; CI = P[(1+i)^n−1] ਵਰਤੋ।";
      break;
    }
    case "INT-QL-071":
      whatAsked = hi
        ? "हमें विकल्पों में दी गई वार्षिक ब्याज दरों में से सही दर पहचाननी है।"
        : "ਸਾਨੂੰ ਚੋਣਾਂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਵਿੱਚੋਂ ਸਹੀ ਦਰ ਪਛਾਣਨੀ ਹੈ।";
      steps = [
        hi ? `विकल्प ${correctLetter} की ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर जाँचें।` : `ਚੋਣ ${correctLetter} ਦੀ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਜਾਂਚੋ।`,
        hi ? `${cp004FrequencyIntervalText(locale, s.frequency)} की दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।` : `${cp004FrequencyIntervalText(locale, s.frequency)} ਦੀ ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`,
        hi ? `कुल चक्रवृद्धि अवधियाँ = ${s.periods}।` : `ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ = ${s.periods}।`,
        `A = ${moneyText(s.principal)} × (1 + ${rationalText(rate)}/100)^${s.periods} = ${moneyText(amount)}।`,
        hi ? `यह प्रश्न में दी गई अंतिम राशि ${moneyText(amount)} के बराबर है।` : `ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ${moneyText(amount)} ਦੇ ਬਰਾਬਰ ਹੈ।`,
        hi ? `अतः वार्षिक ब्याज दर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਸ ਲਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`,
      ];
      commonMistake = hi
        ? "सही विकल्प को जाँचते समय वार्षिक दर को ब्याज जोड़ने की संख्या से अवश्य बाँटें।"
        : "ਸਹੀ ਚੋਣ ਜਾਂਚਦੇ ਸਮੇਂ ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਵਿਆਜ ਜੋੜਨ ਦੀ ਗਿਣਤੀ ਨਾਲ ਜ਼ਰੂਰ ਵੰਡੋ।";
      break;
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(s.nominalAnnualRatePercent, s.frequency);
      whatAsked = hi
        ? "हमें प्रभावी वार्षिक दर से दी गई वार्षिक ब्याज दर पहचाननी है।"
        : "ਸਾਨੂੰ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਤੋਂ ਦਿੱਤੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਪਛਾਣਨੀ ਹੈ।";
      steps = [
        hi ? `विकल्प ${correctLetter} की ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर जाँचें।` : `ਚੋਣ ${correctLetter} ਦੀ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਜਾਂਚੋ।`,
        hi ? `${cp004FrequencyIntervalText(locale, s.frequency)} की दर = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।` : `${cp004FrequencyIntervalText(locale, s.frequency)} ਦੀ ਦਰ = ${percentText(s.nominalAnnualRatePercent)} ÷ ${s.frequency} = ${percentText(rate)}।`,
        hi ? `एक वर्ष में ${s.frequency} चक्रवृद्धि अवधियाँ हैं।` : `ਇੱਕ ਸਾਲ ਵਿੱਚ ${s.frequency} ਚੱਕਰਵੱਧੀ ਮਿਆਦਾਂ ਹਨ।`,
        hi ? `प्रभावी दर = [(1 + ${rationalText(rate)}/100)^${s.frequency} − 1] × 100 = ${percentText(effective)}।` : `ਪ੍ਰਭਾਵੀ ਦਰ = [(1 + ${rationalText(rate)}/100)^${s.frequency} − 1] × 100 = ${percentText(effective)}।`,
        hi ? `यह दी गई प्रभावी दर के बराबर है; अतः उत्तर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਹ ਦਿੱਤੀ ਪ੍ਰਭਾਵੀ ਦਰ ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਉੱਤਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`,
      ];
      commonMistake = hi
        ? "प्रभावी दर को सीधे वार्षिक दर न मानें; वर्ष के भीतर होने वाली चक्रवृद्धि शामिल करें।"
        : "ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਸਿੱਧਾ ਸਾਲਾਨਾ ਦਰ ਨਾ ਮੰਨੋ; ਸਾਲ ਦੇ ਅੰਦਰ ਹੋਣ ਵਾਲੀ ਚੱਕਰਵੱਧੀ ਸ਼ਾਮਲ ਕਰੋ।";
      break;
    }
    case "INT-QL-081": {
      const brokenAmount = brokenAmountForState(s);
      const afterYears = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears);
      const yearFactor = div(afterYears, s.principal);
      const tailFactor = div(brokenAmount, afterYears);
      const combined = mul(yearFactor, tailFactor);
      whatAsked = hi
        ? "हमें अंतिम राशि को दोनों चरणों के संयुक्त गुणक से भाग देकर मूलधन ज्ञात करना है।"
        : "ਸਾਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਦੋਵਾਂ ਪੜਾਵਾਂ ਦੇ ਸਾਂਝੇ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
      steps = [
        hi ? `पूरे वर्षों का गुणक = ${rationalText(yearFactor)}।` : `ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = ${rationalText(yearFactor)}।`,
        hi ? `अतिरिक्त ${cp004MonthsText(locale, s.tailMonths)} का साधारण-ब्याज गुणक = ${rationalText(tailFactor)}।` : `ਵਾਧੂ ${cp004MonthsText(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ-ਵਿਆਜ ਗੁਣਕ = ${rationalText(tailFactor)}।`,
        hi ? `संयुक्त गुणक = ${rationalText(yearFactor)} × ${rationalText(tailFactor)} = ${rationalText(combined)}।` : `ਸਾਂਝਾ ਗੁਣਕ = ${rationalText(yearFactor)} × ${rationalText(tailFactor)} = ${rationalText(combined)}।`,
        `P = ${moneyText(brokenAmount)} ÷ ${rationalText(combined)} = ${moneyText(s.principal)}।`,
      ];
      commonMistake = hi
        ? "अज्ञात मूलधन को किसी अनुपात में पहले से न लिखें; दोनों गुणक केवल दर और समय से निकालें।"
        : "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਕਿਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਨਾ ਲਿਖੋ; ਦੋਵੇਂ ਗੁਣਕ ਸਿਰਫ਼ ਦਰ ਅਤੇ ਸਮੇਂ ਤੋਂ ਕੱਢੋ।";
      break;
    }
    case "INT-QL-082": {
      const brokenAmount = brokenAmountForState(s);
      const afterYears = completeAmountFromNominal(s.principal, s.nominalAnnualRatePercent, 1, s.fullYears);
      whatAsked = hi
        ? "हमें विकल्पों में दी वार्षिक ब्याज दरों में से सही दर पहचाननी है।"
        : "ਸਾਨੂੰ ਚੋਣਾਂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰਾਂ ਵਿੱਚੋਂ ਸਹੀ ਦਰ ਪਛਾਣਨੀ ਹੈ।";
      steps = [
        hi ? `विकल्प ${correctLetter} की ${percentText(s.nominalAnnualRatePercent)} वार्षिक दर जाँचें।` : `ਚੋਣ ${correctLetter} ਦੀ ${percentText(s.nominalAnnualRatePercent)} ਸਾਲਾਨਾ ਦਰ ਜਾਂਚੋ।`,
        hi ? `पूरे वर्षों के बाद राशि = ${moneyText(afterYears)}।` : `ਪੂਰੇ ਸਾਲਾਂ ਬਾਅਦ ਰਕਮ = ${moneyText(afterYears)}।`,
        hi ? `अतिरिक्त ${cp004MonthsText(locale, s.tailMonths)} का साधारण ब्याज जोड़ने पर राशि ${moneyText(brokenAmount)} बनती है।` : `ਵਾਧੂ ${cp004MonthsText(locale, s.tailMonths)} ਦਾ ਸਧਾਰਣ ਵਿਆਜ ਜੋੜਨ ਉੱਤੇ ਰਕਮ ${moneyText(brokenAmount)} ਬਣਦੀ ਹੈ।`,
        hi ? `यह दी गई अंतिम राशि के बराबर है; अतः वार्षिक दर ${percentText(s.nominalAnnualRatePercent)} है।` : `ਇਹ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਸਾਲਾਨਾ ਦਰ ${percentText(s.nominalAnnualRatePercent)} ਹੈ।`,
      ];
      commonMistake = hi
        ? "पूरे वर्षों और अतिरिक्त महीनों की गणना अलग-अलग करें; अतिरिक्त महीनों पर साधारण ब्याज ही लगेगा।"
        : "ਪੂਰੇ ਸਾਲਾਂ ਅਤੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਦੀ ਗਿਣਤੀ ਵੱਖ-ਵੱਖ ਕਰੋ; ਵਾਧੂ ਮਹੀਨਿਆਂ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਹੀ ਲੱਗੇਗਾ।";
      break;
    }
    default:
      return undefined;
  }

  const finalAnswer = hi ? `अंतिम उत्तर: ${source.correctAnswer}।` : `ਅੰਤਿਮ ਉੱਤਰ: ${source.correctAnswer}।`;
  return Object.freeze({
    whatAsked,
    steps: Object.freeze(steps),
    finalAnswer,
    commonMistake,
  });
}

export function remediateCp004LocalizedExplanationV3(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  base: IntCp004LocalizedExplanation,
): IntCp004LocalizedExplanation {
  const override = overrideExplanation(source, locale);
  const result = override ?? Object.freeze({
    whatAsked: naturalize(base.whatAsked, locale),
    steps: Object.freeze(base.steps.map((step) => naturalize(step, locale))),
    finalAnswer: naturalize(base.finalAnswer, locale),
    commonMistake: naturalize(base.commonMistake, locale),
  });

  for (const [index, text] of [result.whatAsked, ...result.steps, result.finalAnswer, result.commonMistake].entries()) {
    assertCp004LocalizedText(locale, text, `${source.qlId}/${source.seed}/${locale}/editorial-remediation-v3-${index}`);
  }
  return result;
}
