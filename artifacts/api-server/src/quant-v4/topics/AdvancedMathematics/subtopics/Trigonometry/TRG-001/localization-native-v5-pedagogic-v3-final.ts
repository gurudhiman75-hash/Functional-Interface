import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativePedagogicV3 } from "./localization-native-v5-pedagogic-v3";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_FINAL_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_FINAL" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(value: unknown) {
  return String(value ?? "")
    .replace(/\s+([,;:!?।])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function closeHindi(text: string) {
  return text
    .replace(/^लेने पर व्युत्क्रम देता है\s+(.+?)[।.]?$/u,
      "दोनों पक्षों का व्युत्क्रम लेने पर $1 मिलता है।")
    .replace(/^गुणा करें; न जोड़ें।$/u, "दोनों मानों को गुणा करें; जोड़ें नहीं।")
    .replace(/^tan θ और cot θ हैं व्युत्क्रम पर एक ही कोण।$/u,
      "एक ही कोण के लिए tan θ और cot θ परस्पर व्युत्क्रम हैं।")
    .replace(/^गुणा करें डिग्री से π\/180।$/u, "डिग्री वाले मान को π/180 से गुणा करें।")
    .replace(/^घटाकर सरल करें भिन्न पूरी तरह।$/u, "भिन्न को पूरी तरह सरल कीजिए।")
    .replace(/^डिग्री-से-रेडियन हर 180 है।$/u, "डिग्री से रेडियन बदलते समय हर 180 आता है।")
    .replace(/^अतः कोण है ([^।]+)।$/u, "अतः कोण $1 है।")
    .replace(/^प्रयोग न करें 360° के लिए एक π रेडियन।$/u, "π रेडियन को 360° न मानें; π रेडियन = 180°।")
    .replace(/^त्रिभुज है 7-24-25; cot θ=24\/7।$/u, "यह 7-24-25 त्रिभुज है; cot θ=24/7।")
    .replace(/^cot है सटी हुई\/सामने।$/u, "cot θ = सटी हुई भुजा/सामने वाली भुजा।")
    .replace(/^यह सरल होकर को 441\/400।$/u, "सरल करने पर 441/400 मिलता है।")
    .replace(/^घटाएँ 1 बाद वर्ग करने पर कोसेकेंट।$/u, "पहले cosec θ का वर्ग लें, फिर 1 घटाएँ।")
    .replace(/^जोड़ें दोनों समीकरण: (.+)$/u, "दोनों समीकरण जोड़ने पर $1")
    .replace(/^संयुग्मी गुणनफल को ज्ञात करें दूसरा समीकरण का प्रयोग करें।$/u,
      "संयुग्मी संबंध से दूसरा समीकरण बनाकर दोनों समीकरणों का प्रयोग करें।")
    .replace(/^जोड़ें संयुग्मी समीकरण को अलग करें सेकेंट।$/u,
      "sec θ को अलग करने के लिए संयुग्मी समीकरण जोड़ें।")
    .replace(/^जोड़ें सटीक मानs पहले लागू करने पर बाहरी वर्ग।$/u,
      "पहले tan60° और cot60° के सटीक मान जोड़ें, फिर पूरे योग का वर्ग लें।")
    .replace(/^न छोड़ें क्रॉस पद में \(tanθ\+cotθ\)²।$/u,
      "(tanθ+cotθ)² के विस्तार में मध्य पद न छोड़ें।")
    .replace(/^न छोड़ें क्रॉस पद।$/u, "वर्ग का विस्तार करते समय मध्य पद न छोड़ें।")
    .replace(/^tan45°=1 और tan30°=√3\/3 के मान रखें।$/u,
      "tan45°=1 और tan30°=√3/3 को सूत्र में रखें।")
    .replace(/^परिमेयकरण करने पर देता है (.+)।$/u, "परिमेयकरण करने पर $1 मिलता है।")
    .replace(/^दिए गए दोनों अनुपातों के मान रखें।$/u, "दिए गए sinθ और cosθ के मान सूत्र में रखें।")
    .replace(/^tanθ=24\/7 के मान रखें।$/u, "tanθ=24/7 को सूत्र में रखें।")
    .replace(/^अंश चिह्न बदलता है जब tanθ जाता है से अधिक 1।$/u,
      "tanθ>1 होने पर अंश का चिह्न ऋणात्मक हो सकता है।")
    .replace(/^tanθ=√3\/3 के मान रखें।$/u, "tanθ=√3/3 को सूत्र में रखें।")
    .replace(/^बाद सरलीकरण, tan2θ=√3।$/u, "सरलीकरण के बाद tan2θ=√3।")
    .replace(/^गुणा करें हर के साथ-साथ अंश।$/u, "भिन्नों के अंश और हर अलग-अलग गुणा करें।")
    .replace(/^दोनों भुजाओं और दिए गए क्षेत्रफल के मान रखें।$/u,
      "दी गई दोनों भुजाओं और क्षेत्रफल को सूत्र में रखें।")
    .replace(/^गुणा करने से से \(1−cosα\)\/sinα देता है \(1−cos²α\)\/sin²α।$/u,
      "अब (1+cosα)(1−cosα)=1−cos²α, इसलिए व्यंजक (1−cos²α)/sin²α बनता है।")
    .replace(/^क्योंकि 1−cos²α=sin²α, व्यंजक बराबर है 1।$/u,
      "क्योंकि 1−cos²α=sin²α, इसलिए व्यंजक 1 हो जाता है।")
    .replace(/^संयुग्मी-जैसा गुणनफल बनाता है 1−sin² या 1−cos², कौन-सा सटीक रूप से मेल खाता है वर्ग हर।$/u,
      "संयुग्मी गुणनफल (1+cosα)(1−cosα)=1−cos²α=sin²α का प्रयोग करें।")
    .replace(/^न काटें पद के आर-पार जोड़ के अंदर sec\+tan या cosec\+cot।$/u,
      "sec+tan या cosec+cot जैसे योग के भीतर पदों को सीधे न काटें।");
}

function closePunjabi(text: string) {
  return text
    .replace(/^ਲੈਣ ਤੇ ਪਰਸਪਰ ਦਿੰਦਾ ਹੈ\s+(.+?)[।.]?$/u,
      "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦਾ ਪਰਸਪਰ ਲੈਣ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਗੁਣਾ ਕਰੋ; ਨਾ ਜੋੜੋ।$/u, "ਦੋਵੇਂ ਮਾਨਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ; ਜੋੜੋ ਨਾ।")
    .replace(/^tan θ ਅਤੇ cot θ ਹਨ ਪਰਸਪਰ ਤੇ ਇੱਕੋ ਕੋਣ।$/u,
      "ਇੱਕੋ ਕੋਣ ਲਈ tan θ ਅਤੇ cot θ ਪਰਸਪਰ ਹਨ।")
    .replace(/^ਗੁਣਾ ਕਰੋ ਡਿਗਰੀ ਨਾਲ π\/180।$/u, "ਡਿਗਰੀ ਵਾਲੇ ਮਾਨ ਨੂੰ π/180 ਨਾਲ ਗੁਣਾ ਕਰੋ।")
    .replace(/^ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ ਭਿੰਨ ਪੂਰੀ ਤਰ੍ਹਾਂ।$/u, "ਭਿੰਨ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰੋ।")
    .replace(/^ਡਿਗਰੀ-ਤੋਂ-ਰੇਡੀਅਨ ਹਰ 180 ਹੈ।$/u, "ਡਿਗਰੀ ਤੋਂ ਰੇਡੀਅਨ ਬਦਲਦੇ ਸਮੇਂ ਹਰ 180 ਆਉਂਦਾ ਹੈ।")
    .replace(/^ਇਸ ਲਈ ਕੋਣ ਹੈ ([^।]+)।$/u, "ਇਸ ਲਈ ਕੋਣ $1 ਹੈ।")
    .replace(/^ਨਾ 360° ਲਈ ਇੱਕ π ਰੇਡੀਅਨ ਵਰਤੋ।$/u, "π ਰੇਡੀਅਨ ਨੂੰ 360° ਨਾ ਮੰਨੋ; π ਰੇਡੀਅਨ = 180°।")
    .replace(/^ਤਿਕੋਣ ਹੈ 7-24-25; cot θ=24\/7।$/u, "ਇਹ 7-24-25 ਤਿਕੋਣ ਹੈ; cot θ=24/7।")
    .replace(/^cot ਹੈ ਲੱਗਦੀ\/ਸਾਹਮਣੇ।$/u, "cot θ = ਲੱਗਦੀ ਭੁਜਾ/ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ।")
    .replace(/^ਇਹ ਸਰਲ ਹੋ ਕੇ ਨੂੰ 441\/400।$/u, "ਸਰਲ ਕਰਨ ਤੇ 441/400 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਜੋੜੋ ਦੋਵੇਂ ਸਮੀਕਰਨ: (.+)$/u, "ਦੋਵੇਂ ਸਮੀਕਰਨ ਜੋੜਨ ਤੇ $1")
    .replace(/^ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ਨੂੰ ਕੱਢੋ ਦੂਜਾ ਸਮੀਕਰਨ ਵਰਤੋ।$/u,
      "ਸੰਯੁਗਮੀ ਸੰਬੰਧ ਨਾਲ ਦੂਜਾ ਸਮੀਕਰਨ ਬਣਾਕੇ ਦੋਵੇਂ ਸਮੀਕਰਨ ਵਰਤੋ।")
    .replace(/^ਜੋੜੋ ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਨੂੰ ਵੱਖ ਕਰੋ ਸੀਕੈਂਟ।$/u,
      "sec θ ਨੂੰ ਵੱਖ ਕਰਨ ਲਈ ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਜੋੜੋ।")
    .replace(/^ਜੋੜੋ ਸਹੀ ਮਾਨs ਪਹਿਲਾਂ ਲਾਗੂ ਕਰਨ ਤੇ ਬਾਹਰੀ ਵਰਗ।$/u,
      "ਪਹਿਲਾਂ tan60° ਅਤੇ cot60° ਦੇ ਸਹੀ ਮਾਨ ਜੋੜੋ, ਫਿਰ ਪੂਰੇ ਜੋੜ ਦਾ ਵਰਗ ਲਓ।")
    .replace(/^ਨਾ ਛੱਡੋ ਕਰਾਸ ਪਦ ਵਿੱਚ \(tanθ\+cotθ\)²।$/u,
      "(tanθ+cotθ)² ਦਾ ਵਿਸਤਾਰ ਕਰਦੇ ਸਮੇਂ ਵਿਚਕਾਰਲਾ ਪਦ ਨਾ ਛੱਡੋ।")
    .replace(/^ਨਾ ਛੱਡੋ ਕਰਾਸ ਪਦ।$/u, "ਵਰਗ ਦਾ ਵਿਸਤਾਰ ਕਰਦੇ ਸਮੇਂ ਵਿਚਕਾਰਲਾ ਪਦ ਨਾ ਛੱਡੋ।")
    .replace(/^tan45°=1 ਅਤੇ tan30°=√3\/3 ਦੇ ਮਾਨ ਰੱਖੋ।$/u,
      "tan45°=1 ਅਤੇ tan30°=√3/3 ਨੂੰ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ।")
    .replace(/^ਪਰਿਮੇਯਕਰਨ ਕਰਨ ਤੇ ਦਿੰਦਾ ਹੈ (.+)।$/u, "ਪਰਿਮੇਯਕਰਨ ਕਰਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਦਿੱਤੇ ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਦੇ ਮਾਨ ਰੱਖੋ।$/u, "ਦਿੱਤੇ sinθ ਅਤੇ cosθ ਦੇ ਮਾਨ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ।")
    .replace(/^tanθ=24\/7 ਦੇ ਮਾਨ ਰੱਖੋ।$/u, "tanθ=24/7 ਨੂੰ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ।")
    .replace(/^ਅੰਸ਼ ਚਿੰਨ੍ਹ ਬਦਲਦਾ ਹੈ ਜਦੋਂ tanθ ਜਾਂਦਾ ਹੈ ਤੋਂ ਵੱਧ 1।$/u,
      "tanθ>1 ਹੋਣ ਤੇ ਅੰਸ਼ ਦਾ ਚਿੰਨ੍ਹ ਰਿਣਾਤਮਕ ਹੋ ਸਕਦਾ ਹੈ।")
    .replace(/^tanθ=√3\/3 ਦੇ ਮਾਨ ਰੱਖੋ।$/u, "tanθ=√3/3 ਨੂੰ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ।")
    .replace(/^ਬਾਅਦ ਸਰਲੀਕਰਨ, tan2θ=√3।$/u, "ਸਰਲੀਕਰਨ ਤੋਂ ਬਾਅਦ tan2θ=√3।")
    .replace(/^ਗੁਣਾ ਕਰੋ ਹਰ ਦੇ ਨਾਲ-ਨਾਲ ਅੰਸ਼।$/u, "ਭਿੰਨਾਂ ਦੇ ਅੰਸ਼ ਅਤੇ ਹਰ ਵੱਖ-ਵੱਖ ਗੁਣਾ ਕਰੋ।")
    .replace(/^ਦੋਵੇਂ ਭੁਜਾਵਾਂ ਅਤੇ ਦਿੱਤੇ ਖੇਤਰਫਲ ਦੇ ਮਾਨ ਰੱਖੋ।$/u,
      "ਦਿੱਤੀਆਂ ਦੋਵੇਂ ਭੁਜਾਵਾਂ ਅਤੇ ਖੇਤਰਫਲ ਨੂੰ ਸੂਤਰ ਵਿੱਚ ਰੱਖੋ।")
    .replace(/^ਗੁਣਾ ਕਰਨ ਨਾਲ ਨਾਲ \(1−cosα\)\/sinα ਦਿੰਦਾ ਹੈ \(1−cos²α\)\/sin²α।$/u,
      "ਹੁਣ (1+cosα)(1−cosα)=1−cos²α, ਇਸ ਲਈ ਵਿਅੰਜਕ (1−cos²α)/sin²α ਬਣਦਾ ਹੈ।")
    .replace(/^ਕਿਉਂਕਿ 1−cos²α=sin²α, ਵਿਅੰਜਕ ਬਰਾਬਰ ਹੈ 1।$/u,
      "ਕਿਉਂਕਿ 1−cos²α=sin²α, ਇਸ ਲਈ ਵਿਅੰਜਕ 1 ਬਣ ਜਾਂਦਾ ਹੈ।")
    .replace(/^ਸੰਯੁਗਮੀ-ਵਰਗਾ ਗੁਣਨਫਲ ਬਣਾਉਂਦਾ ਹੈ 1−sin² ਜਾਂ 1−cos², ਕਿਹੜਾ ਸਹੀ ਤੌਰ ਤੇ ਮਿਲਦਾ ਹੈ ਵਰਗ ਹਰ।$/u,
      "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+cosα)(1−cosα)=1−cos²α=sin²α ਵਰਤੋ।")
    .replace(/^ਨਾ ਕੱਟੋ ਪਦ ਦੇ ਪਾਰ ਜੋੜ ਦੇ ਅੰਦਰ sec\+tan ਜਾਂ cosec\+cot।$/u,
      "sec+tan ਜਾਂ cosec+cot ਵਰਗੇ ਜੋੜਾਂ ਦੇ ਅੰਦਰ ਪਦਾਂ ਨੂੰ ਸਿੱਧਾ ਨਾ ਕੱਟੋ।");
}

function closeFinalProse(value: unknown, locale: Locale) {
  const text = finish(value);
  return finish(locale === "hi-IN" ? closeHindi(text) : closePunjabi(text));
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: closeFinalProse(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: closeFinalProse(step.title, locale),
      body: closeFinalProse(step.body, locale),
    })),
    shortcut: closeFinalProse(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => closeFinalProse(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativePedagogicV3Final(localized: AnyQuestion, locale: Locale) {
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: closeFinalProse(option.display, locale),
  }));
  const explanation = mapExplanation(localized.explanation, locale);
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_FINAL_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem: localized.stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
  });

  return {
    ...localized,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V3_FINAL" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false as const,
    freezeEligible: false as const,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_V3_FINAL_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V3_FINAL" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint,
      learnerSurfaceSource: "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_NATIVE_EDITORIAL_V3_FINAL" as const,
      v5PedagogicV3FinalOverlay: true as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativePedagogicV3Final(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  return finalizeLocalizedTrg001QuestionNativePedagogicV3Final(
    generateLocalizedTrg001QuestionNativePedagogicV3(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
