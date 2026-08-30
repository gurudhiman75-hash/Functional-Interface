import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativePedagogicV3Final } from "./localization-native-v5-pedagogic-v3-final";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL" as const;

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

function hindi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/^मान ज्ञात कीजिए प्रत्येक कोण अलग-अलग।$/u, "प्रत्येक कोण का मान अलग-अलग ज्ञात कीजिए।")
    .replace(/^कोण भिन्न हैं, इसलिए (.+) नहीं है स्वतः 1।$/u, "कोण भिन्न हैं, इसलिए $1 स्वतः 1 नहीं होता।")
    .replace(/^tan α और cot β हैं व्युत्क्रम केवल जब α=β।$/u,
      "tan α और cot β केवल α=β होने पर परस्पर व्युत्क्रम होते हैं।")
    .replace(/^करने पर √3 देता है 3 का वर्ग लें।$/u, "√3 का वर्ग लेते समय परिणाम 3 होता है।")
    .replace(/^मान ज्ञात कीजिए दोनों मानक मान पहले जोड़ने पर।$/u,
      "पहले दोनों मानक मान ज्ञात करें, फिर उन्हें जोड़ें।")
    .replace(/^मान ज्ञात कीजिए प्रत्येक फलन पर उसका अपने कोण।$/u,
      "प्रत्येक फलन का मान उसके अपने कोण पर ज्ञात करें।")
    .replace(/^जोड़ने पर देता है (.+)[।.]?$/u, "जोड़ने पर $1 मिलता है।")
    .replace(/^मान ज्ञात कीजिए प्रत्येक मानक पद के साथ उसका दिए गए घात।$/u,
      "प्रत्येक मानक पद का मान उसके दिए गए घात सहित ज्ञात करें।")
    .replace(/^साइन और कोसाइन पद हैं पर भिन्न कोण, इसलिए लागू न करें sin²θ\+cos²θ=1।$/u,
      "sin और cos के पद अलग-अलग कोणों पर हैं, इसलिए sin²θ+cos²θ=1 को सीधे लागू न करें।")
    .replace(/^दोनों साइन और कोसाइन साझा करते हैं पुनर्निर्मित कर्ण हर।$/u,
      "पुनर्निर्मित त्रिभुज में sin और cos का हर एक ही कर्ण होता है।")
    .replace(/^घटाने पर में क्रम देता है (.+)[।.]?$/u, "दिए गए क्रम में घटाने पर $1 मिलता है।")
    .replace(/^जोड़ने पर संयुग्मी युग्म अलग कर देता है कोसेकेंट।$/u,
      "संयुग्मी समीकरणों को जोड़ने पर cosec θ अलग हो जाता है।")
    .replace(/^जोड़ने पर दोनों संबंध देता है (.+)[।.]?$/u,
      "दोनों संबंधों को जोड़ने पर $1 मिलता है।")
    .replace(/^संबंध स्थापित करें वर्ग का योग और अंतर।$/u,
      "योग और अंतर के वर्गों के बीच संबंध का प्रयोग करें।")
    .replace(/^योग का दोनों वर्ग व्यंजक है हमेशा 2।$/u,
      "(sinθ+cosθ)² और (sinθ−cosθ)² का योग हमेशा 2 होता है।")
    .replace(/^2sinθ=5cosθ देता है sinθ\/cosθ=5\/2।$/u,
      "2sinθ=5cosθ से sinθ/cosθ=5/2 मिलता है।")
    .replace(/^2sinθ=3cosθ देता है tanθ=3\/2।$/u,
      "2sinθ=3cosθ से tanθ=3/2 मिलता है।")
    .replace(/^2sin²θ=1 देता है sin²θ=1\/2।$/u,
      "2sin²θ=1 से sin²θ=1/2 मिलता है।")
    .replace(/^न्यूनकोण मानक कोण के साथ sinθ=√2\/2 है 45°।$/u,
      "sinθ=√2/2 वाला न्यूनकोण मानक कोण 45° है।")
    .replace(/^हल करें के लिए धनात्मक न्यूनकोण साइन मान।$/u,
      "धनात्मक न्यूनकोण sin मान से कोण ज्ञात करें।")
    .replace(/^tanθ=1\/tanθ देता है tan²θ=1।$/u,
      "tanθ=1/tanθ से tan²θ=1 मिलता है।")
    .replace(/^2cosθ=1 देता है cosθ=1\/2।$/u,
      "2cosθ=1 से cosθ=1/2 मिलता है।")
    .replace(/^हल करें के लिए कोसाइन और मिलाएँ न्यूनकोण मानक कोण।$/u,
      "cosθ का मान निकालकर उसे न्यूनकोण मानक कोण से मिलाएँ।")
    .replace(/^cos²x देता है से भाग देने पर 1।$/u, "cos²x से भाग देने पर 1 मिलता है।")
    .replace(/^पहले दो सर्वसमिकाएँ पुनर्निर्मित करें हर सटीक रूप से।$/u,
      "पहले दोनों सर्वसमिकाओं को लागू करके अंश को ठीक-ठीक सरल करें।")
    .replace(/^न काटें के आर-पार जोड़ या घटाव पहले लागू करने पर सर्वसमिकाएँ।$/u,
      "सर्वसमिकाएँ लगाने से पहले जोड़ या घटाव के आर-पार पदों को न काटें।")
    .replace(/^मिलाने पर करनियों देता है (.+)[।.]?$/u,
      "करणियों को मिलाने पर $1 मिलता है।")
    .replace(/^सरल करने पर सटीक भिन्न देता है (.+)[।.]?$/u,
      "सरल करने पर सटीक मान $1 मिलता है।")
    .replace(/^tanθ और cotθ हैं व्युत्क्रम पर एक ही कोण।$/u,
      "एक ही कोण के लिए tanθ और cotθ परस्पर व्युत्क्रम हैं।")
    .replace(/^(.+?) देता है (.+)[।.]?$/u, "$1 से $2 मिलता है।");
  return finish(text);
}

function punjabi(value: unknown) {
  let text = finish(value);
  text = text
    .replace(/^ਮਾਨ ਕੱਢੋ ਹਰੇਕ ਕੋਣ ਵੱਖ-ਵੱਖ।$/u, "ਹਰੇਕ ਕੋਣ ਦਾ ਮਾਨ ਵੱਖ-ਵੱਖ ਕੱਢੋ।")
    .replace(/^ਕੋਣ ਵੱਖ ਹਨ, ਇਸ ਲਈ (.+) ਨਹੀਂ ਹੈ ਆਪੇ 1।$/u, "ਕੋਣ ਵੱਖ ਹਨ, ਇਸ ਲਈ $1 ਆਪਣੇ ਆਪ 1 ਨਹੀਂ ਹੁੰਦਾ।")
    .replace(/^tan α ਅਤੇ cot β ਹਨ ਪਰਸਪਰ ਕੇਵਲ ਜਦੋਂ α=β।$/u,
      "tan α ਅਤੇ cot β ਕੇਵਲ α=β ਹੋਣ ਤੇ ਪਰਸਪਰ ਹੁੰਦੇ ਹਨ।")
    .replace(/^ਕਰਨ ਤੇ √3 ਦਿੰਦਾ ਹੈ 3 ਦਾ ਵਰਗ ਲਓ।$/u, "√3 ਦਾ ਵਰਗ ਲੈਂਦੇ ਸਮੇਂ ਨਤੀਜਾ 3 ਹੁੰਦਾ ਹੈ।")
    .replace(/^ਮਾਨ ਕੱਢੋ ਦੋਵੇਂ ਮਿਆਰੀ ਮਾਨ ਪਹਿਲਾਂ ਜੋੜਨ ਤੇ।$/u,
      "ਪਹਿਲਾਂ ਦੋਵੇਂ ਮਿਆਰੀ ਮਾਨ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜੋ।")
    .replace(/^ਮਾਨ ਕੱਢੋ ਹਰੇਕ ਫੰਕਸ਼ਨ ਤੇ ਇਸਦਾ ਆਪਣੇ ਕੋਣ।$/u,
      "ਹਰੇਕ ਫੰਕਸ਼ਨ ਦਾ ਮਾਨ ਉਸਦੇ ਆਪਣੇ ਕੋਣ ਤੇ ਕੱਢੋ।")
    .replace(/^ਜੋੜਨ ਤੇ ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u, "ਜੋੜਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਮਾਨ ਕੱਢੋ ਹਰੇਕ ਮਿਆਰੀ ਪਦ ਨਾਲ ਇਸਦਾ ਦਿੱਤੇ ਹੋਏ ਘਾਤ।$/u,
      "ਹਰੇਕ ਮਿਆਰੀ ਪਦ ਦਾ ਮਾਨ ਉਸਦੀ ਦਿੱਤੀ ਘਾਤ ਸਮੇਤ ਕੱਢੋ।")
    .replace(/^ਸਾਈਨ ਅਤੇ ਕੋਸਾਈਨ ਪਦ ਹਨ ਤੇ ਵੱਖਰਾ ਕੋਣ, ਇਸ ਲਈ ਲਾਗੂ ਨਾ ਕਰੋ sin²θ\+cos²θ=1।$/u,
      "sin ਅਤੇ cos ਦੇ ਪਦ ਵੱਖ-ਵੱਖ ਕੋਣਾਂ ਤੇ ਹਨ, ਇਸ ਲਈ sin²θ+cos²θ=1 ਨੂੰ ਸਿੱਧਾ ਲਾਗੂ ਨਾ ਕਰੋ।")
    .replace(/^ਦੋਵੇਂ ਸਾਈਨ ਅਤੇ ਕੋਸਾਈਨ ਸਾਂਝਾ ਕਰਦੇ ਹਨ ਮੁੜ ਬਣਾਇਆ ਕਰਣ ਹਰ।$/u,
      "ਮੁੜ ਬਣਾਏ ਤਿਕੋਣ ਵਿੱਚ sin ਅਤੇ cos ਦਾ ਹਰ ਇੱਕੋ ਕਰਣ ਹੁੰਦਾ ਹੈ।")
    .replace(/^ਘਟਾਉਣ ਤੇ ਵਿੱਚ ਕ੍ਰਮ ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u, "ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਘਟਾਉਣ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਜੋੜਨ ਤੇ ਸੰਯੁਗਮੀ ਜੋੜੇ ਵੱਖ ਕਰ ਦਿੰਦਾ ਹੈ ਕੋਸੀਕੈਂਟ।$/u,
      "ਸੰਯੁਗਮੀ ਸਮੀਕਰਨ ਜੋੜਨ ਤੇ cosec θ ਵੱਖ ਹੋ ਜਾਂਦਾ ਹੈ।")
    .replace(/^ਜੋੜਨ ਤੇ ਦੋਵੇਂ ਸੰਬੰਧ ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u,
      "ਦੋਵੇਂ ਸੰਬੰਧ ਜੋੜਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਸਬੰਧ ਬਣਾਓ ਵਰਗ ਦਾ ਜੋੜ ਅਤੇ ਅੰਤਰ।$/u,
      "ਜੋੜ ਅਤੇ ਅੰਤਰ ਦੇ ਵਰਗਾਂ ਵਿਚਕਾਰ ਸੰਬੰਧ ਵਰਤੋ।")
    .replace(/^ਜੋੜ ਦਾ ਦੋਵੇਂ ਵਰਗ ਵਿਅੰਜਕ ਹੈ ਹਮੇਸ਼ਾਂ 2।$/u,
      "(sinθ+cosθ)² ਅਤੇ (sinθ−cosθ)² ਦਾ ਜੋੜ ਹਮੇਸ਼ਾਂ 2 ਹੁੰਦਾ ਹੈ।")
    .replace(/^2sinθ=5cosθ ਦਿੰਦਾ ਹੈ sinθ\/cosθ=5\/2।$/u,
      "2sinθ=5cosθ ਤੋਂ sinθ/cosθ=5/2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^2sinθ=3cosθ ਦਿੰਦਾ ਹੈ tanθ=3\/2।$/u,
      "2sinθ=3cosθ ਤੋਂ tanθ=3/2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^2sin²θ=1 ਦਿੰਦਾ ਹੈ sin²θ=1\/2।$/u,
      "2sin²θ=1 ਤੋਂ sin²θ=1/2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਨਿਊਨ ਕੋਣ ਮਿਆਰੀ ਕੋਣ ਨਾਲ sinθ=√2\/2 ਹੈ 45°।$/u,
      "sinθ=√2/2 ਵਾਲਾ ਨਿਊਨ ਮਿਆਰੀ ਕੋਣ 45° ਹੈ।")
    .replace(/^ਹੱਲ ਕਰੋ ਲਈ ਧਨਾਤਮਕ ਨਿਊਨ ਕੋਣ ਸਾਈਨ ਮਾਨ।$/u,
      "ਧਨਾਤਮਕ ਨਿਊਨ ਕੋਣ sin ਮਾਨ ਤੋਂ ਕੋਣ ਕੱਢੋ।")
    .replace(/^tanθ=1\/tanθ ਦਿੰਦਾ ਹੈ tan²θ=1।$/u,
      "tanθ=1/tanθ ਤੋਂ tan²θ=1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^2cosθ=1 ਦਿੰਦਾ ਹੈ cosθ=1\/2।$/u,
      "2cosθ=1 ਤੋਂ cosθ=1/2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਹੱਲ ਕਰੋ ਲਈ ਕੋਸਾਈਨ ਅਤੇ ਮਿਲਾਓ ਨਿਊਨ ਕੋਣ ਮਿਆਰੀ ਕੋਣ।$/u,
      "cosθ ਦਾ ਮਾਨ ਕੱਢ ਕੇ ਉਸਨੂੰ ਨਿਊਨ ਮਿਆਰੀ ਕੋਣ ਨਾਲ ਮਿਲਾਓ।")
    .replace(/^cos²x ਦਿੰਦਾ ਹੈ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ 1।$/u, "cos²x ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ 1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਪਹਿਲਾਂ ਦੋ ਸਰਬਸਮਿਕਾਵਾਂ ਮੁੜ ਬਣਾਓ ਹਰ ਸਹੀ ਤੌਰ ਤੇ।$/u,
      "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਰਬਸਮਿਕਾਵਾਂ ਲਾਗੂ ਕਰਕੇ ਅੰਸ਼ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰੋ।")
    .replace(/^ਨਾ ਕੱਟੋ ਦੇ ਪਾਰ ਜੋੜ ਜਾਂ ਘਟਾਓ ਪਹਿਲਾਂ ਲਾਗੂ ਕਰਨ ਤੇ ਸਰਬਸਮਿਕਾਵਾਂ।$/u,
      "ਸਰਬਸਮਿਕਾਵਾਂ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਜੋੜ ਜਾਂ ਘਟਾਓ ਦੇ ਪਾਰ ਪਦਾਂ ਨੂੰ ਨਾ ਕੱਟੋ।")
    .replace(/^ਮਿਲਾਉਣ ਤੇ ਕਰਨੀਆਂ ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u,
      "ਕਰਨੀਆਂ ਨੂੰ ਮਿਲਾਉਣ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਸਰਲ ਕਰਨ ਤੇ ਸਹੀ ਭਿੰਨ ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u,
      "ਸਰਲ ਕਰਨ ਤੇ ਸਹੀ ਮਾਨ $1 ਮਿਲਦਾ ਹੈ।")
    .replace(/^tanθ ਅਤੇ cotθ ਹਨ ਪਰਸਪਰ ਤੇ ਇੱਕੋ ਕੋਣ।$/u,
      "ਇੱਕੋ ਕੋਣ ਲਈ tanθ ਅਤੇ cotθ ਪਰਸਪਰ ਹੁੰਦੇ ਹਨ।")
    .replace(/^(.+?) ਦਿੰਦਾ ਹੈ (.+)[।.]?$/u, "$1 ਤੋਂ $2 ਮਿਲਦਾ ਹੈ।");
  return finish(text);
}

export function normalizeTrg001NativeReviewFinal(value: unknown, locale: Locale) {
  return locale === "hi-IN" ? hindi(value) : punjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: normalizeTrg001NativeReviewFinal(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: normalizeTrg001NativeReviewFinal(step.title, locale),
      body: normalizeTrg001NativeReviewFinal(step.body, locale),
    })),
    shortcut: normalizeTrg001NativeReviewFinal(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => normalizeTrg001NativeReviewFinal(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal(localized: AnyQuestion, locale: Locale) {
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: normalizeTrg001NativeReviewFinal(option.display, locale),
  }));
  const explanation = mapExplanation(localized.explanation, locale);
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL_VERSION,
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
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL" as const,
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
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL" as const,
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
      learnerSurfaceSource: "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_FINAL_NATIVE_REVIEW_POLISH" as const,
      finalNativeReviewOverlay: true as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  return finalizeLocalizedTrg001QuestionNativeReviewFinal(
    generateLocalizedTrg001QuestionNativePedagogicV3Final(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
