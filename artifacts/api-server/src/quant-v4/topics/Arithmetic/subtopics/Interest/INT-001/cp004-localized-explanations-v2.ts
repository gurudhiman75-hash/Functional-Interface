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
  type Cp004MathematicalState,
  type Rational,
} from "./cp004-frequency-math";
import { moneyText, percentText, rationalText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004FrequencyIntervalText,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004PeriodsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import {
  cp004EditorialAnswerText,
  frequencyCandidateAmounts,
} from "./cp004-localized-editorial-v2";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_EXPLANATION_EDITORIAL_VERSION = "INT-CP-004-HI-PA-EXPLANATIONS-v2" as const;

function rateNumber(rate: Rational): string {
  return rationalText(rate);
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

function ratePerCreditingStep(locale: IntCp004LocalizedLocale, state: Cp004MathematicalState): string {
  const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  return locale === "hi-IN"
    ? `${cp004FrequencyIntervalText(locale, state.frequency)} की दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`
    : `${cp004FrequencyIntervalText(locale, state.frequency)} ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`;
}

function completeFormula(
  principal: Rational,
  ratePerPeriod: Rational,
  periods: number,
  amount: Rational,
): string {
  return `A = ${moneyText(principal)} × (1 + ${rateNumber(ratePerPeriod)}/100)^${periods} = ${moneyText(amount)}।`;
}

function whatAsked(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": return "हमें ब्याज जुड़ने के बाद की कुल राशि ज्ञात करनी है।";
      case "INT-QL-068": return "हमें कुल राशि में से मूलधन हटाकर चक्रवृद्धि ब्याज ज्ञात करना है।";
      case "INT-QL-069": return "हमें दी गई अंतिम राशि से चक्रवृद्धि गुणक हटाकर मूलधन ज्ञात करना है।";
      case "INT-QL-070": return "हमें दिए गए चक्रवृद्धि ब्याज से मूलधन ज्ञात करना है।";
      case "INT-QL-071": return "हमें वह घोषित वार्षिक दर ज्ञात करनी है जिससे दी गई अंतिम राशि बनती है।";
      case "INT-QL-072": return "हमें आवश्यक ब्याज-अवधियों की संख्या से वास्तविक समय ज्ञात करना है।";
      case "INT-QL-073": return "हमें सीधे दी गई हर अवधि की दर से कुल राशि ज्ञात करनी है।";
      case "INT-QL-074": return "हमें सीधे दी गई हर अवधि की दर से चक्रवृद्धि ब्याज ज्ञात करना है।";
      case "INT-QL-075": return "हमें दो ब्याज योजनाओं की अंतिम राशियों का अंतर ज्ञात करना है।";
      case "INT-QL-076": return "हमें एक वर्ष में हुई वास्तविक प्रतिशत बढ़ोतरी ज्ञात करनी है।";
      case "INT-QL-077": return "हमें प्रभावी वार्षिक दर से घोषित वार्षिक दर ज्ञात करनी है।";
      case "INT-QL-078": return "हमें दी गई अंतिम राशि से ब्याज जोड़ने का सही तरीका पहचानना है।";
      case "INT-QL-079": return "हमें पूरे वर्षों और अतिरिक्त महीनों के बाद कुल राशि ज्ञात करनी है।";
      case "INT-QL-080": return "हमें पूरे समय में अर्जित कुल ब्याज ज्ञात करना है।";
      case "INT-QL-081": return "हमें दो चरणों के संयुक्त गुणक से मूलधन ज्ञात करना है।";
      case "INT-QL-082": return "हमें वह वार्षिक दर ज्ञात करनी है जो दोनों चरणों के बाद दी गई राशि बनाती है।";
      case "INT-QL-083": return "हमें अंतिम अतिरिक्त महीनों से पहले के पूरे वर्षों की संख्या ज्ञात करनी है।";
      case "INT-QL-084": return "हमें दो अलग ब्याज-अंतरालों के बाद कुल राशि ज्ञात करनी है।";
      case "INT-QL-085": return "हमें दो अलग ब्याज-अंतरालों के बाद कुल चक्रवृद्धि ब्याज ज्ञात करना है।";
    }
  }
  switch (source.qlId) {
    case "INT-QL-067": return "ਸਾਨੂੰ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦੀ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-068": return "ਸਾਨੂੰ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਮੂਲਧਨ ਘਟਾ ਕੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-069": return "ਸਾਨੂੰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਚੱਕਰਵੱਧੀ ਗੁਣਕ ਹਟਾ ਕੇ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-070": return "ਸਾਨੂੰ ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-071": return "ਸਾਨੂੰ ਉਹ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਉਣੀ ਹੈ ਜਿਸ ਨਾਲ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਬਣਦੀ ਹੈ।";
    case "INT-QL-072": return "ਸਾਨੂੰ ਲੋੜੀਂਦੀਆਂ ਵਿਆਜ-ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਤੋਂ ਅਸਲ ਸਮਾਂ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-073": return "ਸਾਨੂੰ ਸਿੱਧੀ ਦਿੱਤੀ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਨਾਲ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-074": return "ਸਾਨੂੰ ਸਿੱਧੀ ਦਿੱਤੀ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਨਾਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-075": return "ਸਾਨੂੰ ਦੋ ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-076": return "ਸਾਨੂੰ ਇੱਕ ਸਾਲ ਵਿੱਚ ਹੋਇਆ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-077": return "ਸਾਨੂੰ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਤੋਂ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-078": return "ਸਾਨੂੰ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਵਿਆਜ ਜੋੜਨ ਦਾ ਸਹੀ ਤਰੀਕਾ ਪਛਾਣਨਾ ਹੈ।";
    case "INT-QL-079": return "ਸਾਨੂੰ ਪੂਰੇ ਸਾਲਾਂ ਅਤੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-080": return "ਸਾਨੂੰ ਪੂਰੇ ਸਮੇਂ ਵਿੱਚ ਕਮਾਇਆ ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-081": return "ਸਾਨੂੰ ਦੋ ਪੜਾਵਾਂ ਦੇ ਸਾਂਝੇ ਗੁਣਕ ਤੋਂ ਮੂਲਧਨ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
    case "INT-QL-082": return "ਸਾਨੂੰ ਉਹ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਲਗਾਉਣੀ ਹੈ ਜੋ ਦੋਵਾਂ ਪੜਾਵਾਂ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਰਕਮ ਬਣਾਉਂਦੀ ਹੈ।";
    case "INT-QL-083": return "ਸਾਨੂੰ ਅਖੀਰਲੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-084": return "ਸਾਨੂੰ ਦੋ ਵੱਖ ਵਿਆਜ-ਅੰਤਰਾਲਾਂ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਪਤਾ ਲਗਾਉਣੀ ਹੈ।";
    case "INT-QL-085": return "ਸਾਨੂੰ ਦੋ ਵੱਖ ਵਿਆਜ-ਅੰਤਰਾਲਾਂ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਪਤਾ ਲਗਾਉਣਾ ਹੈ।";
  }
}

function commonMistake(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): string {
  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067":
      case "INT-QL-068": return "वार्षिक दर को सीधे हर अवधि पर न लगाएँ; पहले उसे एक अवधि की दर में बदलें।";
      case "INT-QL-069": return "अज्ञात मूलधन को अनुपात में पहले से रखकर हल को गोल-गोल सिद्ध न करें।";
      case "INT-QL-070": return "दिए गए ब्याज को अंतिम राशि न मानें; CI = P[(1 + i)^n − 1] का उपयोग करें।";
      case "INT-QL-071": return "एक अवधि की दर को वार्षिक दर न लिखें; सही विकल्प की गणना खुलकर जाँचें।";
      case "INT-QL-072": return "अवधियों की संख्या और वर्षों की संख्या को एक जैसा न मानें।";
      case "INT-QL-073":
      case "INT-QL-074": return "दी गई दर पहले ही हर अवधि की दर है; उसे दोबारा वार्षिक संख्या से न बाँटें।";
      case "INT-QL-075": return "किसी एक योजना की पूरी राशि को अंतर न मानें।";
      case "INT-QL-076": return "घोषित वार्षिक दर और प्रभावी वार्षिक दर एक जैसी नहीं होतीं।";
      case "INT-QL-077": return "प्रभावी दर को अवधियों की संख्या से गुणा करके घोषित दर न निकालें।";
      case "INT-QL-078": return "केवल वार्षिक दर देखकर तरीका न चुनें; प्रत्येक विकल्प से बनने वाली राशि जाँचें।";
      case "INT-QL-079":
      case "INT-QL-080": return "अंतिम अतिरिक्त महीनों पर चक्रवृद्धि ब्याज न लगाएँ; प्रश्न वहाँ साधारण ब्याज देता है।";
      case "INT-QL-081": return "अंतिम राशि से कोई गोल राशि सीधे न घटाएँ; दोनों गुणकों से भाग दें।";
      case "INT-QL-082": return "उत्तर की दर को बिना बताए सूत्र में न डालें; उसे विकल्प-जाँच के रूप में स्पष्ट करें।";
      case "INT-QL-083": return "अतिरिक्त महीनों को पूरे वर्ष न मानें।";
      case "INT-QL-084":
      case "INT-QL-085": return "पहले चरण का ब्याज-अंतराल दूसरे चरण पर लागू न करें।";
    }
  }
  switch (source.qlId) {
    case "INT-QL-067":
    case "INT-QL-068": return "ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਹਰ ਮਿਆਦ ਉੱਤੇ ਨਾ ਲਗਾਓ; ਪਹਿਲਾਂ ਇੱਕ ਮਿਆਦ ਦੀ ਦਰ ਕੱਢੋ।";
    case "INT-QL-069": return "ਅਣਜਾਣ ਮੂਲਧਨ ਨੂੰ ਅਨੁਪਾਤ ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਰੱਖ ਕੇ ਹੱਲ ਨੂੰ ਗੋਲ-ਗੋਲ ਸਾਬਤ ਨਾ ਕਰੋ।";
    case "INT-QL-070": return "ਦਿੱਤੇ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਨਾ ਮੰਨੋ; CI = P[(1 + i)^n − 1] ਵਰਤੋ।";
    case "INT-QL-071": return "ਇੱਕ ਮਿਆਦ ਦੀ ਦਰ ਨੂੰ ਸਾਲਾਨਾ ਦਰ ਨਾ ਲਿਖੋ; ਸਹੀ ਚੋਣ ਦੀ ਗਿਣਤੀ ਸਾਫ਼ ਤੌਰ ਉੱਤੇ ਜਾਂਚੋ।";
    case "INT-QL-072": return "ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਇੱਕੋ ਨਾ ਮੰਨੋ।";
    case "INT-QL-073":
    case "INT-QL-074": return "ਦਿੱਤੀ ਦਰ ਪਹਿਲਾਂ ਹੀ ਹਰ ਮਿਆਦ ਦੀ ਦਰ ਹੈ; ਇਸ ਨੂੰ ਮੁੜ ਸਾਲਾਨਾ ਗਿਣਤੀ ਨਾਲ ਨਾ ਵੰਡੋ।";
    case "INT-QL-075": return "ਕਿਸੇ ਇੱਕ ਯੋਜਨਾ ਦੀ ਪੂਰੀ ਰਕਮ ਨੂੰ ਅੰਤਰ ਨਾ ਮੰਨੋ।";
    case "INT-QL-076": return "ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ ਅਤੇ ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਇੱਕੋ ਨਹੀਂ ਹੁੰਦੀਆਂ।";
    case "INT-QL-077": return "ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਮਿਆਦਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਦੱਸੀ ਦਰ ਨਾ ਕੱਢੋ।";
    case "INT-QL-078": return "ਕੇਵਲ ਸਾਲਾਨਾ ਦਰ ਵੇਖ ਕੇ ਤਰੀਕਾ ਨਾ ਚੁਣੋ; ਹਰ ਚੋਣ ਨਾਲ ਬਣਦੀ ਰਕਮ ਜਾਂਚੋ।";
    case "INT-QL-079":
    case "INT-QL-080": return "ਅਖੀਰਲੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਉੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨਾ ਲਗਾਓ; ਪ੍ਰਸ਼ਨ ਉੱਥੇ ਸਧਾਰਣ ਵਿਆਜ ਦਿੰਦਾ ਹੈ।";
    case "INT-QL-081": return "ਅੰਤਿਮ ਰਕਮ ਵਿੱਚੋਂ ਕੋਈ ਗੋਲ ਰਕਮ ਸਿੱਧੀ ਨਾ ਘਟਾਓ; ਦੋਵਾਂ ਗੁਣਕਾਂ ਨਾਲ ਭਾਗ ਦਿਓ।";
    case "INT-QL-082": return "ਉੱਤਰ ਵਾਲੀ ਦਰ ਨੂੰ ਬਿਨਾਂ ਦੱਸੇ ਸੂਤਰ ਵਿੱਚ ਨਾ ਪਾਓ; ਇਸ ਨੂੰ ਚੋਣ-ਜਾਂਚ ਵਜੋਂ ਸਾਫ਼ ਲਿਖੋ।";
    case "INT-QL-083": return "ਵਾਧੂ ਮਹੀਨਿਆਂ ਨੂੰ ਪੂਰੇ ਸਾਲ ਨਾ ਮੰਨੋ।";
    case "INT-QL-084":
    case "INT-QL-085": return "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਵਿਆਜ-ਅੰਤਰਾਲ ਦੂਜੇ ਪੜਾਅ ਉੱਤੇ ਨਾ ਲਗਾਓ।";
  }
}

function brokenFactors(state: Cp004MathematicalState): Readonly<{ tailRate: Rational; amount: Rational }> {
  return Object.freeze({
    tailRate: mul(state.nominalAnnualRatePercent, rat(state.tailMonths, 12)),
    amount: brokenAmountForState(state),
  });
}

function stepsFor(source: IntCp004EnglishFrozenQuestion, locale: IntCp004LocalizedLocale): readonly string[] {
  const state = source.mathematicalState;
  const amount = completeAmountForState(state);
  const completeInterest = sub(amount, state.principal);
  const perPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
  const directAmount = periodicAmountForState(state);
  const directInterest = sub(directAmount, state.principal);
  const broken = brokenFactors(state);
  const brokenInterest = sub(broken.amount, state.principal);
  const mixedAmount = mixedAmountForState(state);
  const mixedInterest = sub(mixedAmount, state.principal);

  if (locale === "hi-IN") {
    switch (source.qlId) {
      case "INT-QL-067": return Object.freeze([
        ratePerCreditingStep(locale, state),
        `कुल ब्याज-अवधियाँ = ${state.periods}।`,
        completeFormula(state.principal, perPeriod, state.periods, amount),
      ]);
      case "INT-QL-068": return Object.freeze([
        ratePerCreditingStep(locale, state),
        completeFormula(state.principal, perPeriod, state.periods, amount),
        `CI = A − P = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(completeInterest)}।`,
      ]);
      case "INT-QL-069": return Object.freeze([
        ratePerCreditingStep(locale, state),
        `P = A ÷ (1 + ${rateNumber(perPeriod)}/100)^${state.periods}।`,
        `P = ${moneyText(amount)} ÷ (1 + ${rateNumber(perPeriod)}/100)^${state.periods} = ${moneyText(state.principal)}।`,
      ]);
      case "INT-QL-070": return Object.freeze([
        ratePerCreditingStep(locale, state),
        `CI = P[(1 + ${rateNumber(perPeriod)}/100)^${state.periods} − 1]।`,
        `P = ${moneyText(completeInterest)} ÷ [(1 + ${rateNumber(perPeriod)}/100)^${state.periods} − 1] = ${moneyText(state.principal)}।`,
      ]);
      case "INT-QL-071": return Object.freeze([
        `विकल्प ${percentText(state.nominalAnnualRatePercent)} जाँचें: ${cp004FrequencyIntervalText(locale, state.frequency)} की दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`,
        completeFormula(state.principal, perPeriod, state.periods, amount),
        `${moneyText(amount)} प्रश्न की दी हुई राशि के बराबर है; इसलिए घोषित वार्षिक दर = ${percentText(state.nominalAnnualRatePercent)}।`,
      ]);
      case "INT-QL-072": return Object.freeze([
        ratePerCreditingStep(locale, state),
        `n = ${state.periods} रखने पर A = ${moneyText(state.principal)} × (1 + ${rateNumber(perPeriod)}/100)^${state.periods} = ${moneyText(amount)}।`,
        `${cp004PeriodsText(locale, state.periods, state.frequency)} = ${durationFromPeriods(locale, state.periods, state.frequency)}।`,
      ]);
      case "INT-QL-073": return Object.freeze([
        `${cp004FrequencyIntervalText(locale, state.frequency)} की दर पहले से = ${percentText(state.periodicRatePercent)}।`,
        `कुल ब्याज-अवधियाँ = ${state.periods} (${cp004PeriodsText(locale, state.periods, state.frequency)})।`,
        completeFormula(state.principal, state.periodicRatePercent, state.periods, directAmount),
      ]);
      case "INT-QL-074": return Object.freeze([
        `${cp004FrequencyIntervalText(locale, state.frequency)} की दर पहले से = ${percentText(state.periodicRatePercent)}।`,
        completeFormula(state.principal, state.periodicRatePercent, state.periods, directAmount),
        `CI = ${moneyText(directAmount)} − ${moneyText(state.principal)} = ${moneyText(directInterest)}।`,
      ]);
      case "INT-QL-075": {
        const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
        const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
        return Object.freeze([
          `${cp004FrequencyLabel(locale, state.frequency)} योजना: A₁ = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, state.frequency))}/100)^${state.frequency * state.years} = ${moneyText(first)}।`,
          `${cp004FrequencyLabel(locale, state.comparisonFrequency)} योजना: A₂ = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency))}/100)^${state.comparisonFrequency * state.years} = ${moneyText(second)}।`,
          `अंतर = बड़ी राशि − छोटी राशि = ${moneyText(source.solution)}।`,
        ]);
      }
      case "INT-QL-076": {
        const hundredAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
        const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
        return Object.freeze([
          ratePerCreditingStep(locale, state),
          `₹100 पर एक वर्ष बाद राशि = ₹100 × (1 + ${rateNumber(perPeriod)}/100)^${state.frequency} = ${moneyText(hundredAmount)}।`,
          `प्रभावी वार्षिक दर = ${moneyText(hundredAmount)} − ₹100 = ${percentText(effective)}।`,
        ]);
      }
      case "INT-QL-077": {
        const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
        const hundredAmount = add(rat(100), effective);
        return Object.freeze([
          `${percentText(effective)} प्रभावी दर का अर्थ: ₹100 → ${moneyText(hundredAmount)} एक वर्ष में।`,
          `विकल्प ${percentText(state.nominalAnnualRatePercent)} जाँचें: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`,
          `₹100 × (1 + ${rateNumber(perPeriod)}/100)^${state.frequency} = ${moneyText(hundredAmount)}।`,
          `अतः घोषित वार्षिक दर = ${percentText(state.nominalAnnualRatePercent)}।`,
        ]);
      }
      case "INT-QL-078": return Object.freeze([
        ...frequencyCandidateAmounts(source).map(({ frequency, amount: candidate }) => `${cp004FrequencyLabel(locale, frequency)}: A = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, frequency))}/100)^${frequency * state.years} = ${moneyText(candidate)}।`),
        `केवल ${cp004FrequencyLabel(locale, state.frequency)} विकल्प से लक्ष्य राशि ${moneyText(amount)} मिलती है; सही तरीका = ${cp004FrequencyLabel(locale, state.frequency)}।`,
      ]);
      case "INT-QL-079": return Object.freeze([
        `पूरे वर्षों का गुणक = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
        `${cp004MonthsText(locale, state.tailMonths)} का साधारण गुणक = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
      ]);
      case "INT-QL-080": return Object.freeze([
        `पूरे वर्षों का गुणक = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
        `${cp004MonthsText(locale, state.tailMonths)} का साधारण गुणक = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
        `कुल ब्याज = ${moneyText(broken.amount)} − ${moneyText(state.principal)} = ${moneyText(brokenInterest)}।`,
      ]);
      case "INT-QL-081": return Object.freeze([
        `संयुक्त गुणक = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12)।`,
        `P = A ÷ संयुक्त गुणक।`,
        `P = ${moneyText(broken.amount)} ÷ [(1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12)] = ${moneyText(state.principal)}।`,
      ]);
      case "INT-QL-082": return Object.freeze([
        `विकल्प ${percentText(state.nominalAnnualRatePercent)} जाँचें: पूरे वर्षों का गुणक = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
        `अंतिम ${state.tailMonths} महीनों का गुणक = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
        `दी गई राशि मिलती है; इसलिए वार्षिक ब्याज दर = ${percentText(state.nominalAnnualRatePercent)}।`,
      ]);
      case "INT-QL-083": return Object.freeze([
        `विकल्प ${state.fullYears} वर्ष जाँचें: पूरे वर्षों का गुणक = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
        `अंतिम ${state.tailMonths} महीनों का गुणक = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
        `अतः पूरे वर्षों की संख्या = ${state.fullYears}।`,
      ]);
      case "INT-QL-084": {
        const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
        const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
        return Object.freeze([
          `पहला चरण: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}; अवधियाँ = ${state.firstFrequency * state.firstYears}।`,
          `दूसरा चरण: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}; अवधियाँ = ${state.secondFrequency * state.secondYears}।`,
          `A = ${moneyText(state.principal)} × (1 + ${rateNumber(firstRate)}/100)^${state.firstFrequency * state.firstYears} × (1 + ${rateNumber(secondRate)}/100)^${state.secondFrequency * state.secondYears} = ${moneyText(mixedAmount)}।`,
        ]);
      }
      case "INT-QL-085": {
        const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
        const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
        return Object.freeze([
          `पहला चरण: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}; अवधियाँ = ${state.firstFrequency * state.firstYears}।`,
          `दूसरा चरण: प्रति अवधि दर = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}; अवधियाँ = ${state.secondFrequency * state.secondYears}।`,
          `A = ${moneyText(state.principal)} × (1 + ${rateNumber(firstRate)}/100)^${state.firstFrequency * state.firstYears} × (1 + ${rateNumber(secondRate)}/100)^${state.secondFrequency * state.secondYears} = ${moneyText(mixedAmount)}।`,
          `CI = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(mixedInterest)}।`,
        ]);
      }
    }
  }

  switch (source.qlId) {
    case "INT-QL-067": return Object.freeze([
      ratePerCreditingStep(locale, state),
      `ਕੁੱਲ ਵਿਆਜ-ਮਿਆਦਾਂ = ${state.periods}।`,
      completeFormula(state.principal, perPeriod, state.periods, amount),
    ]);
    case "INT-QL-068": return Object.freeze([
      ratePerCreditingStep(locale, state),
      completeFormula(state.principal, perPeriod, state.periods, amount),
      `CI = A − P = ${moneyText(amount)} − ${moneyText(state.principal)} = ${moneyText(completeInterest)}।`,
    ]);
    case "INT-QL-069": return Object.freeze([
      ratePerCreditingStep(locale, state),
      `P = A ÷ (1 + ${rateNumber(perPeriod)}/100)^${state.periods}।`,
      `P = ${moneyText(amount)} ÷ (1 + ${rateNumber(perPeriod)}/100)^${state.periods} = ${moneyText(state.principal)}।`,
    ]);
    case "INT-QL-070": return Object.freeze([
      ratePerCreditingStep(locale, state),
      `CI = P[(1 + ${rateNumber(perPeriod)}/100)^${state.periods} − 1]।`,
      `P = ${moneyText(completeInterest)} ÷ [(1 + ${rateNumber(perPeriod)}/100)^${state.periods} − 1] = ${moneyText(state.principal)}।`,
    ]);
    case "INT-QL-071": return Object.freeze([
      `ਚੋਣ ${percentText(state.nominalAnnualRatePercent)} ਜਾਂਚੋ: ${cp004FrequencyIntervalText(locale, state.frequency)} ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`,
      completeFormula(state.principal, perPeriod, state.periods, amount),
      `${moneyText(amount)} ਪ੍ਰਸ਼ਨ ਦੀ ਦਿੱਤੀ ਰਕਮ ਦੇ ਬਰਾਬਰ ਹੈ; ਇਸ ਲਈ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ = ${percentText(state.nominalAnnualRatePercent)}।`,
    ]);
    case "INT-QL-072": return Object.freeze([
      ratePerCreditingStep(locale, state),
      `n = ${state.periods} ਰੱਖਣ ਉੱਤੇ A = ${moneyText(state.principal)} × (1 + ${rateNumber(perPeriod)}/100)^${state.periods} = ${moneyText(amount)}।`,
      `${cp004PeriodsText(locale, state.periods, state.frequency)} = ${durationFromPeriods(locale, state.periods, state.frequency)}।`,
    ]);
    case "INT-QL-073": return Object.freeze([
      `${cp004FrequencyIntervalText(locale, state.frequency)} ਦੀ ਦਰ ਪਹਿਲਾਂ ਹੀ = ${percentText(state.periodicRatePercent)}।`,
      `ਕੁੱਲ ਵਿਆਜ-ਮਿਆਦਾਂ = ${state.periods} (${cp004PeriodsText(locale, state.periods, state.frequency)})।`,
      completeFormula(state.principal, state.periodicRatePercent, state.periods, directAmount),
    ]);
    case "INT-QL-074": return Object.freeze([
      `${cp004FrequencyIntervalText(locale, state.frequency)} ਦੀ ਦਰ ਪਹਿਲਾਂ ਹੀ = ${percentText(state.periodicRatePercent)}।`,
      completeFormula(state.principal, state.periodicRatePercent, state.periods, directAmount),
      `CI = ${moneyText(directAmount)} − ${moneyText(state.principal)} = ${moneyText(directInterest)}।`,
    ]);
    case "INT-QL-075": {
      const first = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.frequency, state.frequency * state.years);
      const second = completeAmountFromNominal(state.principal, state.nominalAnnualRatePercent, state.comparisonFrequency, state.comparisonFrequency * state.years);
      return Object.freeze([
        `${cp004FrequencyLabel(locale, state.frequency)} ਯੋਜਨਾ: A₁ = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, state.frequency))}/100)^${state.frequency * state.years} = ${moneyText(first)}।`,
        `${cp004FrequencyLabel(locale, state.comparisonFrequency)} ਯੋਜਨਾ: A₂ = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, state.comparisonFrequency))}/100)^${state.comparisonFrequency * state.years} = ${moneyText(second)}।`,
        `ਅੰਤਰ = ਵੱਡੀ ਰਕਮ − ਛੋਟੀ ਰਕਮ = ${moneyText(source.solution)}।`,
      ]);
    }
    case "INT-QL-076": {
      const hundredAmount = completeAmountFromNominal(rat(100), state.nominalAnnualRatePercent, state.frequency, state.frequency);
      const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      return Object.freeze([
        ratePerCreditingStep(locale, state),
        `₹100 ਉੱਤੇ ਇੱਕ ਸਾਲ ਬਾਅਦ ਰਕਮ = ₹100 × (1 + ${rateNumber(perPeriod)}/100)^${state.frequency} = ${moneyText(hundredAmount)}।`,
        `ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ = ${moneyText(hundredAmount)} − ₹100 = ${percentText(effective)}।`,
      ]);
    }
    case "INT-QL-077": {
      const effective = effectiveAnnualRate(state.nominalAnnualRatePercent, state.frequency);
      const hundredAmount = add(rat(100), effective);
      return Object.freeze([
        `${percentText(effective)} ਪ੍ਰਭਾਵੀ ਦਰ ਦਾ ਅਰਥ: ₹100 → ${moneyText(hundredAmount)} ਇੱਕ ਸਾਲ ਵਿੱਚ।`,
        `ਚੋਣ ${percentText(state.nominalAnnualRatePercent)} ਜਾਂਚੋ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.frequency} = ${percentText(perPeriod)}।`,
        `₹100 × (1 + ${rateNumber(perPeriod)}/100)^${state.frequency} = ${moneyText(hundredAmount)}।`,
        `ਇਸ ਲਈ ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ = ${percentText(state.nominalAnnualRatePercent)}।`,
      ]);
    }
    case "INT-QL-078": return Object.freeze([
      ...frequencyCandidateAmounts(source).map(({ frequency, amount: candidate }) => `${cp004FrequencyLabel(locale, frequency)}: A = ${moneyText(state.principal)} × (1 + ${rateNumber(periodicRate(state.nominalAnnualRatePercent, frequency))}/100)^${frequency * state.years} = ${moneyText(candidate)}।`),
      `ਕੇਵਲ ${cp004FrequencyLabel(locale, state.frequency)} ਚੋਣ ਨਾਲ ਟੀਚੇ ਵਾਲੀ ਰਕਮ ${moneyText(amount)} ਮਿਲਦੀ ਹੈ; ਸਹੀ ਤਰੀਕਾ = ${cp004FrequencyLabel(locale, state.frequency)}।`,
    ]);
    case "INT-QL-079": return Object.freeze([
      `ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
      `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਗੁਣਕ = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
      `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
    ]);
    case "INT-QL-080": return Object.freeze([
      `ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
      `${cp004MonthsText(locale, state.tailMonths)} ਦਾ ਸਧਾਰਣ ਗੁਣਕ = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
      `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
      `ਕੁੱਲ ਵਿਆਜ = ${moneyText(broken.amount)} − ${moneyText(state.principal)} = ${moneyText(brokenInterest)}।`,
    ]);
    case "INT-QL-081": return Object.freeze([
      `ਸਾਂਝਾ ਗੁਣਕ = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12)।`,
      `P = A ÷ ਸਾਂਝਾ ਗੁਣਕ।`,
      `P = ${moneyText(broken.amount)} ÷ [(1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12)] = ${moneyText(state.principal)}।`,
    ]);
    case "INT-QL-082": return Object.freeze([
      `ਚੋਣ ${percentText(state.nominalAnnualRatePercent)} ਜਾਂਚੋ: ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
      `ਅਖੀਰਲੇ ${state.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਗੁਣਕ = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
      `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
      `ਦਿੱਤੀ ਰਕਮ ਮਿਲਦੀ ਹੈ; ਇਸ ਲਈ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ = ${percentText(state.nominalAnnualRatePercent)}।`,
    ]);
    case "INT-QL-083": return Object.freeze([
      `ਚੋਣ ${state.fullYears} ਸਾਲ ਜਾਂਚੋ: ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਗੁਣਕ = (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears}।`,
      `ਅਖੀਰਲੇ ${state.tailMonths} ਮਹੀਨਿਆਂ ਦਾ ਗੁਣਕ = 1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12।`,
      `A = ${moneyText(state.principal)} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100)^${state.fullYears} × (1 + ${rateNumber(state.nominalAnnualRatePercent)}/100 × ${state.tailMonths}/12) = ${moneyText(broken.amount)}।`,
      `ਇਸ ਲਈ ਪੂਰੇ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ = ${state.fullYears}।`,
    ]);
    case "INT-QL-084": {
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      return Object.freeze([
        `ਪਹਿਲਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}; ਮਿਆਦਾਂ = ${state.firstFrequency * state.firstYears}।`,
        `ਦੂਜਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}; ਮਿਆਦਾਂ = ${state.secondFrequency * state.secondYears}।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(firstRate)}/100)^${state.firstFrequency * state.firstYears} × (1 + ${rateNumber(secondRate)}/100)^${state.secondFrequency * state.secondYears} = ${moneyText(mixedAmount)}।`,
      ]);
    }
    case "INT-QL-085": {
      const firstRate = periodicRate(state.nominalAnnualRatePercent, state.firstFrequency);
      const secondRate = periodicRate(state.nominalAnnualRatePercent, state.secondFrequency);
      return Object.freeze([
        `ਪਹਿਲਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.firstFrequency} = ${percentText(firstRate)}; ਮਿਆਦਾਂ = ${state.firstFrequency * state.firstYears}।`,
        `ਦੂਜਾ ਪੜਾਅ: ਹਰ ਮਿਆਦ ਦੀ ਦਰ = ${percentText(state.nominalAnnualRatePercent)} ÷ ${state.secondFrequency} = ${percentText(secondRate)}; ਮਿਆਦਾਂ = ${state.secondFrequency * state.secondYears}।`,
        `A = ${moneyText(state.principal)} × (1 + ${rateNumber(firstRate)}/100)^${state.firstFrequency * state.firstYears} × (1 + ${rateNumber(secondRate)}/100)^${state.secondFrequency * state.secondYears} = ${moneyText(mixedAmount)}।`,
        `CI = ${moneyText(mixedAmount)} − ${moneyText(state.principal)} = ${moneyText(mixedInterest)}।`,
      ]);
    }
  }
}

export function localizeCp004ExplanationEditorialV2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): IntCp004LocalizedExplanation {
  const answer = cp004EditorialAnswerText(
    locale,
    source.answerSemantic,
    source.mathematicalState,
    source.solution,
  );
  const explanation: IntCp004LocalizedExplanation = Object.freeze({
    whatAsked: whatAsked(source, locale),
    steps: stepsFor(source, locale),
    finalAnswer: locale === "hi-IN" ? `अतः सही उत्तर ${answer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
    commonMistake: commonMistake(source, locale),
  });

  assertCp004LocalizedText(locale, explanation.whatAsked, `${source.qlId}/${source.seed}/${locale}/editorial-v2-what-asked`);
  assertCp004LocalizedText(locale, explanation.finalAnswer, `${source.qlId}/${source.seed}/${locale}/editorial-v2-final-answer`);
  assertCp004LocalizedText(locale, explanation.commonMistake, `${source.qlId}/${source.seed}/${locale}/editorial-v2-common-mistake`);
  for (const [index, step] of explanation.steps.entries()) {
    assertCp004LocalizedText(locale, step, `${source.qlId}/${source.seed}/${locale}/editorial-v2-step-${index + 1}`);
  }
  return explanation;
}
