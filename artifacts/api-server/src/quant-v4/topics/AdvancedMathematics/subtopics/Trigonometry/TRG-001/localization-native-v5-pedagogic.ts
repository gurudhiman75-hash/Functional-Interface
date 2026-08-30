import { createHash } from "node:crypto";

import { trg001CanonicalSemanticFingerprint, type Trg001LocalizedLocale } from "./localization-v1";
import { localizeFrozenTrg001QuestionNativeV4 } from "./localization-native-v4";
import { localizeFrozenTrg001QuestionNativeV5, trg001V5RuleText } from "./localization-native-v5-final";
import { trg001V5BindingFor } from "./localization-native-v5-registry";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_V5_PEDAGOGIC" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(value: string, locale: Locale) {
  const text = String(value ?? "")
    .replace(/\s+([,;:!?])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .replace(/\.\s*$/u, locale === "hi-IN" ? "।" : "।")
    .trim();
  return text;
}

function normalizeHindi(value: unknown) {
  let text = String(value ?? "").trim();

  text = text
    .replace(/\$\{[^}]+\}/gu, "समान हर")
    .replace(/अनुपातs/gu, "अनुपात")
    .replace(/चतुर्थांशI/gu, "चतुर्थांश")
    .replace(/चतुर्थांश-IV/gu, "चतुर्थ चतुर्थांश")
    .replace(/के के बराबर/gu, "के बराबर")
    .replace(/है केवल/gu, "केवल यही")
    .replace(/सरल करें को/gu, "सरल करके")
    .replace(/गुणा करें को/gu, "गुणा करके")
    .replace(/न करें मान रखें/gu, "मान न रखें")
    .replace(/न करें प्रयोग करें/gu, "प्रयोग न करें")
    .replace(/न करें जोड़ें/gu, "न जोड़ें")
    .replace(/न करें घटाएँ/gu, "न घटाएँ")
    .replace(/न करें काटें/gu, "न काटें")
    .replace(/न करें ([^।.]+?) करें/gu, "$1 न करें")
    .replace(/मान रखें दोनों दिया गया अनुपात/gu, "दिए गए दोनों अनुपातों के मान रखें")
    .replace(/हल करने पर देता है\s+([^।.]+)/gu, "हल करने पर $1 मिलता है")
    .replace(/जोड़ें समीकरण को प्राप्त करें\s+([^।.]+)/gu, "दोनों समीकरण जोड़ने पर $1 प्राप्त होता है")
    .replace(/घटाएँ समीकरण:\s*([^।.]+)/gu, "दोनों समीकरण घटाने पर $1 मिलता है")
    .replace(/काटें समान गैर-शून्य गुणक को प्राप्त करें\s+([^।.]+)/gu, "समान गैर-शून्य गुणक काटने पर $1 प्राप्त होता है")
    .replace(/यह है केवल परिभाषित ससीम मान/gu, "केवल यही परिभाषित ससीम मान है")
    .replace(/अंश और हर हैं बराबर/gu, "अंश और हर बराबर हैं")
    .replace(/अंश बराबर है हर/gu, "अंश हर के बराबर है")
    .replace(/अनुपात है\s+([^।.]+)/gu, "अनुपात $1 है")
    .replace(/गुणनफल है\s+([^।.]+)/gu, "गुणनफल $1 है")
    .replace(/कुल है\s+([^।.]+)/gu, "कुल $1 है")
    .replace(/पूरक कोटैन्जेंट बन जाता है टैन्जेंट/gu, "पूरक कोण का कोटैन्जेंट टैन्जेंट बन जाता है")
    .replace(/प्रयोग करें संदर्भ कोण\s+([^।.]+?)\s+को प्राप्त करें\s+([^।.]+)/gu, "संदर्भ कोण $1 का प्रयोग करने पर $2 प्राप्त होता है")
    .replace(/घटाकर सरल करें कोण पहले लागू करने पर संदर्भ मान/gu, "पहले कोण को घटाकर सरल करें, फिर संदर्भ मान लगाएँ")
    .replace(/घटाकर सरल करें कोण/gu, "कोण को घटाकर सरल करें")
    .replace(/घटाकर सरल करें को संदर्भ कोण/gu, "घटाकर संदर्भ कोण")
    .replace(/वर्ग दिया गया योग/gu, "दिए गए योग का वर्ग लें")
    .replace(/वर्ग दिया गया अंतर/gu, "दिए गए अंतर का वर्ग लें")
    .replace(/विस्तार करें वर्ग/gu, "वर्ग का विस्तार करें")
    .replace(/पहले प्राप्त करें\s+([^,।.]+),\s*तब वर्ग यह/gu, "पहले $1 प्राप्त करें, फिर उसका वर्ग लें")
    .replace(/प्रयोग करें अंतराल को चुनें न्यूनकोण मानक-कोण हल/gu, "अंतराल के अनुसार न्यूनकोण वाला मानक-कोण हल चुनें")
    .replace(/π रेडियन के बराबर है 180°/gu, "π रेडियन = 180°")
    .replace(/sin²θ\+cos²θ=1 नहीं करता लागू करें को तीन केवल-साइन या केवल-कोसाइन पद पर भिन्न कोण/gu,
      "sin²θ+cos²θ=1 की सर्वसमिका अलग-अलग कोणों वाले केवल-sin या केवल-cos पदों पर सीधे लागू नहीं होती")
    .replace(/हर के लिए एक टैन्जेंट योग में होता है एक ऋण चिह्न/gu, "tan(A+B) के हर में ऋण चिह्न आता है")
    .replace(/A गैर-शून्य मान गुणा उसका व्युत्क्रम है 1/gu, "किसी गैर-शून्य मान और उसके व्युत्क्रम का गुणनफल 1 होता है")
    .replace(/प्रयोग करें\s+([^।.]+?)(?=[।.]?$)/u, "$1 का प्रयोग करें")
    .replace(/लागू करें\s+([^।.]+?)(?=[।.]?$)/u, "$1 लागू करें")
    .replace(/मान रखें\s+([^।.]+?)(?=[।.]?$)/u, "$1 के मान रखें")
    .replace(/विस्तार करें\s+([^।.]+?)(?=[।.]?$)/u, "$1 का विस्तार करें")
    .replace(/,\s*तब प्रयोग करें\s+([^।.]+?)(?=[।.]?$)/u, ", फिर $1 का प्रयोग करें")
    .replace(/ और लागू करें\s+([^।.]+?)(?=[।.]?$)/u, " और $1 लागू करें")
    .replace(/ तब व्युत्क्रम लें/gu, " फिर व्युत्क्रम लें")
    .replace(/ नहीं 360/gu, ", 360 नहीं")
    .replace(/ नहीं 0/gu, ", 0 नहीं");

  return finish(text, "hi-IN");
}

function normalizePunjabi(value: unknown) {
  let text = String(value ?? "").trim();

  text = text
    .replace(/\$\{[^}]+\}/gu, "ਸਾਂਝਾ ਹਰ")
    .replace(/ਅਨੁਪਾਤs/gu, "ਅਨੁਪਾਤ")
    .replace(/ਚਤੁਰਭਾਗI/gu, "ਚਤੁਰਭਾਗ")
    .replace(/ਚਤੁਰਭਾਗ-IV/gu, "ਚੌਥਾ ਚਤੁਰਭਾਗ")
    .replace(/ਦੇ ਦੇ ਬਰਾਬਰ/gu, "ਦੇ ਬਰਾਬਰ")
    .replace(/ਹੈ ਕੇਵਲ/gu, "ਕੇਵਲ ਇਹੀ")
    .replace(/ਸਰਲ ਕਰੋ ਨੂੰ/gu, "ਸਰਲ ਕਰਕੇ")
    .replace(/ਗੁਣਾ ਕਰੋ ਨੂੰ/gu, "ਗੁਣਾ ਕਰਕੇ")
    .replace(/ਨਾ ਕਰੋ ਮਾਨ ਰੱਖੋ/gu, "ਮਾਨ ਨਾ ਰੱਖੋ")
    .replace(/ਨਾ ਕਰੋ ਵਰਤੋ/gu, "ਨਾ ਵਰਤੋ")
    .replace(/ਨਾ ਕਰੋ ਜੋੜੋ/gu, "ਨਾ ਜੋੜੋ")
    .replace(/ਨਾ ਕਰੋ ਘਟਾਓ/gu, "ਨਾ ਘਟਾਓ")
    .replace(/ਨਾ ਕਰੋ ਕੱਟੋ/gu, "ਨਾ ਕੱਟੋ")
    .replace(/ਮਾਨ ਰੱਖੋ ਦੋਵੇਂ ਦਿੱਤਾ ਅਨੁਪਾਤ/gu, "ਦਿੱਤੇ ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਦੇ ਮਾਨ ਰੱਖੋ")
    .replace(/ਹੱਲ ਕਰਨ ਤੇ ਦਿੰਦਾ ਹੈ\s+([^।.]+)/gu, "ਹੱਲ ਕਰਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ")
    .replace(/ਜੋੜੋ ਸਮੀਕਰਨ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰੋ\s+([^।.]+)/gu, "ਦੋਵੇਂ ਸਮੀਕਰਨ ਜੋੜਨ ਤੇ $1 ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ")
    .replace(/ਘਟਾਓ ਸਮੀਕਰਨ:\s*([^।.]+)/gu, "ਦੋਵੇਂ ਸਮੀਕਰਨ ਘਟਾਉਣ ਤੇ $1 ਮਿਲਦਾ ਹੈ")
    .replace(/ਕੱਟੋ ਸਾਂਝਾ ਗੈਰ-ਸਿਫ਼ਰ ਗੁਣਕ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰੋ\s+([^।.]+)/gu, "ਸਾਂਝਾ ਗੈਰ-ਸਿਫ਼ਰ ਗੁਣਕ ਕੱਟਣ ਤੇ $1 ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ")
    .replace(/ਇਹ ਹੈ ਕੇਵਲ ਪਰਿਭਾਸ਼ਿਤ ਸੀਮਿਤ ਮਾਨ/gu, "ਕੇਵਲ ਇਹੀ ਪਰਿਭਾਸ਼ਿਤ ਸੀਮਿਤ ਮਾਨ ਹੈ")
    .replace(/ਅੰਸ਼ ਅਤੇ ਹਰ ਹਨ ਬਰਾਬਰ/gu, "ਅੰਸ਼ ਅਤੇ ਹਰ ਬਰਾਬਰ ਹਨ")
    .replace(/ਅੰਸ਼ ਬਰਾਬਰ ਹੈ ਹਰ/gu, "ਅੰਸ਼ ਹਰ ਦੇ ਬਰਾਬਰ ਹੈ")
    .replace(/ਅਨੁਪਾਤ ਹੈ\s+([^।.]+)/gu, "ਅਨੁਪਾਤ $1 ਹੈ")
    .replace(/ਗੁਣਨਫਲ ਹੈ\s+([^।.]+)/gu, "ਗੁਣਨਫਲ $1 ਹੈ")
    .replace(/ਕੁੱਲ ਹੈ\s+([^।.]+)/gu, "ਕੁੱਲ $1 ਹੈ")
    .replace(/ਪੂਰਕ ਕੋਟੈਂਜੈਂਟ ਬਣ ਜਾਂਦਾ ਹੈ ਟੈਂਜੈਂਟ/gu, "ਪੂਰਕ ਕੋਣ ਦਾ ਕੋਟੈਂਜੈਂਟ ਟੈਂਜੈਂਟ ਬਣ ਜਾਂਦਾ ਹੈ")
    .replace(/ਵਰਤੋ ਹਵਾਲਾ ਕੋਣ\s+([^।.]+?)\s+ਨੂੰ ਪ੍ਰਾਪਤ ਕਰੋ\s+([^।.]+)/gu, "ਹਵਾਲਾ ਕੋਣ $1 ਵਰਤਣ ਤੇ $2 ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ")
    .replace(/ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ ਕੋਣ ਪਹਿਲਾਂ ਲਾਗੂ ਕਰਨ ਤੇ ਹਵਾਲਾ ਮਾਨ/gu, "ਪਹਿਲਾਂ ਕੋਣ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, ਫਿਰ ਹਵਾਲਾ ਮਾਨ ਲਗਾਓ")
    .replace(/ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ ਕੋਣ/gu, "ਕੋਣ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ")
    .replace(/ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ ਨੂੰ ਹਵਾਲਾ ਕੋਣ/gu, "ਘਟਾ ਕੇ ਹਵਾਲਾ ਕੋਣ")
    .replace(/ਵਰਗ ਦਿੱਤਾ ਗਿਆ ਜੋੜ/gu, "ਦਿੱਤੇ ਜੋੜ ਦਾ ਵਰਗ ਲਓ")
    .replace(/ਵਰਗ ਦਿੱਤਾ ਗਿਆ ਅੰਤਰ/gu, "ਦਿੱਤੇ ਅੰਤਰ ਦਾ ਵਰਗ ਲਓ")
    .replace(/ਵਿਸਤਾਰ ਕਰੋ ਵਰਗ/gu, "ਵਰਗ ਦਾ ਵਿਸਤਾਰ ਕਰੋ")
    .replace(/ਪਹਿਲਾਂ ਪ੍ਰਾਪਤ ਕਰੋ\s+([^,।.]+),\s*ਤਦ ਵਰਗ ਇਹ/gu, "ਪਹਿਲਾਂ $1 ਪ੍ਰਾਪਤ ਕਰੋ, ਫਿਰ ਉਸਦਾ ਵਰਗ ਲਓ")
    .replace(/ਵਰਤੋ ਅੰਤਰਾਲ ਨੂੰ ਚੁਣੋ ਨਿਊਨ ਕੋਣ ਮਿਆਰੀ-ਕੋਣ ਹੱਲ/gu, "ਅੰਤਰਾਲ ਅਨੁਸਾਰ ਨਿਊਨ ਕੋਣ ਵਾਲਾ ਮਿਆਰੀ-ਕੋਣ ਹੱਲ ਚੁਣੋ")
    .replace(/π ਰੇਡੀਅਨ ਦੇ ਬਰਾਬਰ ਹੈ 180°/gu, "π ਰੇਡੀਅਨ = 180°")
    .replace(/sin²θ\+cos²θ=1 ਨਹੀਂ ਕਰਦਾ ਲਾਗੂ ਕਰੋ ਨੂੰ ਤਿੰਨ ਕੇਵਲ-ਸਾਈਨ ਜਾਂ ਕੇਵਲ-ਕੋਸਾਈਨ ਪਦ ਤੇ ਵੱਖਰਾ ਕੋਣ/gu,
      "sin²θ+cos²θ=1 ਦੀ ਸਰਬਸਮਿਕਾ ਵੱਖ-ਵੱਖ ਕੋਣਾਂ ਵਾਲੇ ਕੇਵਲ-sin ਜਾਂ ਕੇਵਲ-cos ਪਦਾਂ ਤੇ ਸਿੱਧੀ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦੀ")
    .replace(/ਹਰ ਲਈ ਇੱਕ ਟੈਂਜੈਂਟ ਜੋੜ ਵਿੱਚ ਹੁੰਦਾ ਹੈ ਇੱਕ ਘਟਾਓ ਚਿੰਨ੍ਹ/gu, "tan(A+B) ਦੇ ਹਰ ਵਿੱਚ ਘਟਾਓ ਚਿੰਨ੍ਹ ਆਉਂਦਾ ਹੈ")
    .replace(/A ਗੈਰ-ਸਿਫ਼ਰ ਮਾਨ ਗੁਣਾ ਇਸਦਾ ਪਰਸਪਰ ਹੈ 1/gu, "ਕਿਸੇ ਗੈਰ-ਸਿਫ਼ਰ ਮਾਨ ਅਤੇ ਉਸਦੇ ਪਰਸਪਰ ਦਾ ਗੁਣਨਫਲ 1 ਹੁੰਦਾ ਹੈ")
    .replace(/ਵਰਤੋ\s+([^।.]+?)(?=[।.]?$)/u, "$1 ਵਰਤੋ")
    .replace(/ਲਾਗੂ ਕਰੋ\s+([^।.]+?)(?=[।.]?$)/u, "$1 ਲਾਗੂ ਕਰੋ")
    .replace(/ਮਾਨ ਰੱਖੋ\s+([^।.]+?)(?=[।.]?$)/u, "$1 ਦੇ ਮਾਨ ਰੱਖੋ")
    .replace(/ਵਿਸਤਾਰ ਕਰੋ\s+([^।.]+?)(?=[।.]?$)/u, "$1 ਦਾ ਵਿਸਤਾਰ ਕਰੋ")
    .replace(/,\s*ਤਦ ਵਰਤੋ\s+([^।.]+?)(?=[।.]?$)/u, ", ਫਿਰ $1 ਵਰਤੋ")
    .replace(/ ਅਤੇ ਲਾਗੂ ਕਰੋ\s+([^।.]+?)(?=[।.]?$)/u, " ਅਤੇ $1 ਲਾਗੂ ਕਰੋ")
    .replace(/ ਤਦ ਪਰਸਪਰ ਲਓ/gu, " ਫਿਰ ਪਰਸਪਰ ਲਓ")
    .replace(/ ਨਹੀਂ 360/gu, ", 360 ਨਹੀਂ")
    .replace(/ ਨਹੀਂ 0/gu, ", 0 ਨਹੀਂ");

  return finish(text, "pa-IN");
}

export function normalizeTrg001PedagogicProse(value: unknown, locale: Locale) {
  return locale === "hi-IN" ? normalizeHindi(value) : normalizePunjabi(value);
}

function pedagogicExplanation(canonicalQuestion: AnyQuestion, locale: Locale) {
  const binding = trg001V5BindingFor(canonicalQuestion.qlId);
  if (!binding) throw new Error(`${canonicalQuestion.qlId}: missing V5 binding for pedagogic overlay.`);
  const v4 = localizeFrozenTrg001QuestionNativeV4(canonicalQuestion, locale) as AnyQuestion;
  const source = v4.explanation as AnyQuestion;

  return {
    keyRule: trg001V5RuleText(binding.ruleKey, locale),
    steps: source.steps.map((step: AnyQuestion) => ({
      ...step,
      title: normalizeTrg001PedagogicProse(step.title, locale),
      body: normalizeTrg001PedagogicProse(step.body, locale),
    })),
    shortcut: normalizeTrg001PedagogicProse(source.shortcut, locale),
    traps: source.traps.map((trap: unknown) => normalizeTrg001PedagogicProse(trap, locale)),
  };
}

export function localizeFrozenTrg001QuestionNativeV5Pedagogic(canonicalQuestion: AnyQuestion, locale: Locale) {
  const localized = localizeFrozenTrg001QuestionNativeV5(canonicalQuestion, locale) as AnyQuestion;
  const binding = trg001V5BindingFor(canonicalQuestion.qlId);
  if (!binding) throw new Error(`${canonicalQuestion.qlId}: missing V5 binding for pedagogic overlay.`);
  const explanation = pedagogicExplanation(canonicalQuestion, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(localized);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint,
    stem: localized.stem,
    optionDisplays: localized.options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay: localized.localizedAnswerDisplay,
    explanation,
    v5StemKind: binding.stemKind,
    v5RuleKey: binding.ruleKey,
  });

  return {
    ...localized,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC" as const,
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_V5_PEDAGOGIC_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC" as const,
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
      canonicalSemanticFingerprint,
      localizationFingerprint,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_NATIVE_V5_STEMS_AND_V4_QUESTION_SPECIFIC_WORKING" as const,
      v5PedagogicOverlay: true as const,
      pedagogicWorkingSource: "V4_QUESTION_SPECIFIC_EXPLANATION" as const,
      pedagogicRuleSource: "V5_NATIVE_RULE_REGISTRY" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeV5Pedagogic(qlId: string, seed: string, locale: Locale) {
  return localizeFrozenTrg001QuestionNativeV5Pedagogic(
    generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion,
    locale,
  );
}
