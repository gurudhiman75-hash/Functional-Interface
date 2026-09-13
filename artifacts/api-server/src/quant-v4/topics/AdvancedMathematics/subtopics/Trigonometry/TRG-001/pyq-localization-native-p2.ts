import { localizeFrozenTrg001QuestionNativeV5Pedagogic } from "./localization-native-v5-pedagogic";
import type { Trg001LocalizedLocale } from "./localization-v1";

export const TRG_001_PYQ_LOCALIZATION_NATIVE_P2 = Object.freeze({
  version: "TRG001_PYQ_LOCALIZATION_NATIVE_P2" as const,
  locales: ["hi-IN", "pa-IN"] as const,
  remediatedQlIds: ["TRG-001-QL-024", "TRG-001-QL-126", "TRG-001-QL-143"] as const,
  humanLanguageReviewRequired: true as const,
  productionActivationChanged: false as const,
});

type AnyQuestion = Record<string, any>;
type NativeLanguage = "hi" | "pa";
const languageFor = (locale: Trg001LocalizedLocale): NativeLanguage => locale === "hi-IN" ? "hi" : "pa";
const native = (locale: Trg001LocalizedLocale, hi: string, pa: string) => locale === "hi-IN" ? hi : pa;

function finish(question: AnyQuestion, locale: Trg001LocalizedLocale, stem: string, explanation: AnyQuestion) {
  return Object.freeze({
    ...question,
    language: languageFor(locale),
    locale,
    stem,
    explanation,
    localizationP2: Object.freeze({ version: TRG_001_PYQ_LOCALIZATION_NATIVE_P2.version, locale, nativeRemediation: true as const, humanLanguageReviewRequired: true as const, productionActivationChanged: false as const }),
    questionStudioDiscoverable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
}

function localizeIntervalComparison(question: AnyQuestion, locale: Trg001LocalizedLocale) {
  const interval = String(question?.canonicalState?.interval ?? "");
  const below45 = interval.includes("0° < θ < 45°");
  return finish(question, locale,
    native(locale, `यदि ${interval}, तो sin θ और cos θ के बीच सही संबंध चुनिए।`, `ਜੇ ${interval}, ਤਾਂ sin θ ਅਤੇ cos θ ਵਿਚਲਾ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।`),
    {
      keyRule: native(locale, "न्यूनकोणों के लिए 45° पर sin θ = cos θ होता है। 45° से कम पर cos θ बड़ा और 45° से अधिक पर sin θ बड़ा होता है।", "ਨਿਊਨ ਕੋਣਾਂ ਲਈ 45° ਤੇ sin θ = cos θ ਹੁੰਦਾ ਹੈ। 45° ਤੋਂ ਘੱਟ ਤੇ cos θ ਵੱਡਾ ਅਤੇ 45° ਤੋਂ ਵੱਧ ਤੇ sin θ ਵੱਡਾ ਹੁੰਦਾ ਹੈ।"),
      steps: [
        { title: native(locale, "चरण 1", "ਕਦਮ 1"), body: native(locale, "45° को तुलना-बिंदु मानें, जहाँ sin θ = cos θ है।", "45° ਨੂੰ ਤੁਲਨਾ-ਬਿੰਦੂ ਮੰਨੋ, ਜਿੱਥੇ sin θ = cos θ ਹੈ।") },
        { title: native(locale, "उत्तर", "ਉੱਤਰ"), body: below45 ? native(locale, "θ, 45° से कम है, इसलिए sin θ < cos θ।", "θ, 45° ਤੋਂ ਘੱਟ ਹੈ, ਇਸ ਲਈ sin θ < cos θ।") : native(locale, "θ, 45° से अधिक है, इसलिए sin θ > cos θ।", "θ, 45° ਤੋਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ sin θ > cos θ।") },
      ],
      shortcut: question?.explanation?.shortcut,
      traps: question?.explanation?.traps,
    });
}

function localizeHigherPowerRelation(question: AnyQuestion, locale: Trg001LocalizedLocale) {
  const given = String(question?.canonicalState?.givenFunction ?? "COS").toLowerCase();
  const target = String(question?.canonicalState?.targetFunction ?? "SIN").toLowerCase();
  return finish(question, locale,
    native(locale, `यदि ${given} θ + ${given}² θ = 1, तो ${target}⁴ θ + ${target}⁶ θ का मान ज्ञात कीजिए।`, `ਜੇ ${given} θ + ${given}² θ = 1, ਤਾਂ ${target}⁴ θ + ${target}⁶ θ ਦਾ ਮਾਨ ਕੱਢੋ।`),
    {
      keyRule: native(locale, `दिए गए संबंध और sin²θ+cos²θ=1 से पहले ${target}²θ=${given}θ प्राप्त करें।`, `ਦਿੱਤੇ ਸੰਬੰਧ ਅਤੇ sin²θ+cos²θ=1 ਤੋਂ ਪਹਿਲਾਂ ${target}²θ=${given}θ ਪ੍ਰਾਪਤ ਕਰੋ।`),
      steps: [
        { title: native(locale, "चरण 1", "ਕਦਮ 1"), body: native(locale, `${given}θ+${given}²θ=1 से 1−${given}²θ=${given}θ। इसलिए ${target}²θ=${given}θ।`, `${given}θ+${given}²θ=1 ਤੋਂ 1−${given}²θ=${given}θ। ਇਸ ਲਈ ${target}²θ=${given}θ।`) },
        { title: native(locale, "चरण 2", "ਕਦਮ 2"), body: `${target}⁴θ+${target}⁶θ=${given}²θ+${given}³θ=${given}²θ(1+${given}θ).` },
        { title: native(locale, "उत्तर", "ਉੱਤਰ"), body: native(locale, `क्योंकि ${given}θ(1+${given}θ)=1, इसलिए परिणाम ${given} θ है।`, `ਕਿਉਂਕਿ ${given}θ(1+${given}θ)=1, ਇਸ ਲਈ ਨਤੀਜਾ ${given} θ ਹੈ।`) },
      ],
      shortcut: question?.explanation?.shortcut,
      traps: question?.explanation?.traps,
    });
}

function localizeCubicFactorization(question: AnyQuestion, locale: Trg001LocalizedLocale) {
  const sum = String(question?.canonicalState?.operation ?? "DIFFERENCE_OF_CUBES") === "SUM_OF_CUBES";
  const sinFirst = String(question?.canonicalState?.operandOrder ?? "SIN_THEN_COS") === "SIN_THEN_COS";
  const first = sinFirst ? "sin A" : "cos A";
  const second = sinFirst ? "cos A" : "sin A";
  const sign = sum ? "+" : "−";
  const numerator = `${first.replace(" A", "³A")} ${sign} ${second.replace(" A", "³A")}`;
  const denominator = `${first} ${sign} ${second}`;
  const domain = `${denominator} ≠ 0`;
  const identity = sum ? "a³+b³=(a+b)(a²−ab+b²)" : "a³−b³=(a−b)(a²+ab+b²)";
  const middle = sum ? "−" : "+";
  const answer = String(question.answer);
  return finish(question, locale,
    native(locale, `यदि ${domain}, तो (${numerator})/(${denominator}) को सरल कीजिए।`, `ਜੇ ${domain}, ਤਾਂ (${numerator})/(${denominator}) ਨੂੰ ਸਰਲ ਕਰੋ।`),
    {
      keyRule: native(locale, `${identity} का प्रयोग करें, फिर sin²A+cos²A=1 लगाएँ।`, `${identity} ਦੀ ਵਰਤੋਂ ਕਰੋ, ਫਿਰ sin²A+cos²A=1 ਲਗਾਓ।`),
      steps: [
        { title: native(locale, "चरण 1", "ਕਦਮ 1"), body: native(locale, `अंश का गुणनखंड ${identity} से करें।`, `ਅੰਸ਼ ਦਾ ਗੁਣਨਖੰਡ ${identity} ਨਾਲ ਕਰੋ।`) },
        { title: native(locale, "चरण 2", "ਕਦਮ 2"), body: native(locale, `क्योंकि ${domain}, इसलिए ${denominator} को काट सकते हैं। शेष व्यंजक sin²A ${middle} sin A cos A + cos²A है।`, `ਕਿਉਂਕਿ ${domain}, ਇਸ ਲਈ ${denominator} ਨੂੰ ਕੱਟ ਸਕਦੇ ਹਾਂ। ਬਾਕੀ ਵਿਅੰਜਕ sin²A ${middle} sin A cos A + cos²A ਹੈ।`) },
        { title: native(locale, "उत्तर", "ਉੱਤਰ"), body: native(locale, `sin²A+cos²A=1 लगाने पर व्यंजक ${answer} बनता है।`, `sin²A+cos²A=1 ਲਗਾਉਣ ਤੇ ਵਿਅੰਜਕ ${answer} ਬਣਦਾ ਹੈ।`) },
      ],
      shortcut: question?.explanation?.shortcut,
      traps: question?.explanation?.traps,
    });
}

export function localizePyqRemediatedTrg001QuestionP2(question: AnyQuestion, locale: Trg001LocalizedLocale) {
  if (question.qlId === "TRG-001-QL-024" && question.solveMode === "compareSinCosFromAcuteInterval") return localizeIntervalComparison(question, locale);
  if (question.qlId === "TRG-001-QL-126" && question.solveMode === "deriveHigherPowerFromTrigQuadraticRelation") return localizeHigherPowerRelation(question, locale);
  if (question.qlId === "TRG-001-QL-143" && question.solveMode === "simplifyTrigCubicFactorization") return localizeCubicFactorization(question, locale);

  const localized: AnyQuestion = localizeFrozenTrg001QuestionNativeV5Pedagogic(question, locale) as AnyQuestion;
  return Object.freeze({
    ...localized,
    language: languageFor(locale),
    locale,
    localizationP2: Object.freeze({ version: TRG_001_PYQ_LOCALIZATION_NATIVE_P2.version, locale, nativeRemediation: false as const, delegatedToExistingV5Pedagogic: true as const, humanLanguageReviewRequired: true as const, productionActivationChanged: false as const }),
    questionStudioDiscoverable: false as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  });
}
