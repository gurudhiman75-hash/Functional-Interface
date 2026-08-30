import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal3 } from "./localization-native-v5-pedagogic-review-final3";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_HUMAN_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL3_HUMAN" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function clean(value: unknown) {
  return String(value ?? "")
    .replace(/\s+([,;:!?।])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

function polishHindi(value: unknown) {
  return clean(value)
    .replace(/^(?:इसलिए\s+)?भागफल बराबर है ([^।.]+)[।.]?$/u,
      "अतः भागफल $1 के बराबर है।")
    .replace(/^(tanθ=[^।.]+?) के मान रखें[।.]?$/u, "$1 रखें।");
}

function polishPunjabi(value: unknown) {
  return clean(value)
    .replace(/^(?:ਇਸ ਲਈ\s+)?ਭਾਗਫਲ ਬਰਾਬਰ ਹੈ ([^।.]+)[।.]?$/u,
      "ਇਸ ਲਈ ਭਾਗਫਲ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/^ਸਹੀ ਕਰਣੀ ਦੀ ਥਾਂ ਇੱਕ ਦਸ਼ਮਲਵ ਨਾ ਰੱਖੋ[।.]?$/u,
      "ਸਹੀ ਕਰਣੀ ਦੀ ਥਾਂ ਦਸ਼ਮਲਵ ਮਾਨ ਨਾ ਵਰਤੋ।")
    .replace(/^ਟੈਂਜੈਂਟ ਹੈ sin\/cos, ਨਹੀਂ ਕਿਸੇ ਵੀ ਮਾਨ ਅਕੇਲਾ[।.]?$/u,
      "tan θ = sin θ/cos θ; ਕਿਸੇ ਇੱਕ ਮਾਨ ਨੂੰ ਇਕੱਲਾ tan ਨਾ ਮੰਨੋ।")
    .replace(/^ਦੋਵੇਂ ਪਰਸਪਰ ਫੰਕਸ਼ਨ ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ[।.]?$/u,
      "sec ਅਤੇ cosec ਦੇ ਸਹੀ ਮਾਨ ਵੱਖ-ਵੱਖ ਕੱਢੋ।")
    .replace(/^ਸੀਕੈਂਟ ਅਤੇ ਕੋਸੀਕੈਂਟ ਨਹੀਂ ਹਨ ਪਰਸਪਰ ਦਾ ਇੱਕ-ਦੂਜੇ[।.]?$/u,
      "sec ਅਤੇ cosec ਇੱਕ-ਦੂਜੇ ਦੇ ਪਰਸਪਰ ਨਹੀਂ ਹਨ।")
    .replace(/^ਪਹਿਲਾਂ ਮਿਆਰੀ ਮਾਨਾਂ ਦੇ ਪਰਸਪਰ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਨੂੰ ਮਿਲਾਓ[।.]?$/u,
      "ਪਹਿਲਾਂ sec ਅਤੇ cosec ਦੇ ਮਿਆਰੀ ਮਾਨ ਕੱਢੋ, ਫਿਰ ਜੋੜ-ਘਟਾਓ ਕਰੋ।")
    .replace(/^ਕਾਇਮ ਰੱਖੋ ਅੰਤਿਮ ਘਟਾਓ ਚਿੰਨ੍ਹ[।.]?$/u,
      "ਅੰਤਿਮ ਘਟਾਓ ਚਿੰਨ੍ਹ ਦਾ ਧਿਆਨ ਰੱਖੋ।")
    .replace(/^ਗੁਣਾ ਨਾ ਕਰੋ ਨਾਲ 360[।.]?$/u,
      "360 ਨਾਲ ਗੁਣਾ ਨਾ ਕਰੋ।")
    .replace(/^ਰੇਡੀਅਨ ਰੂਪਾਂਤਰਨ ਅਤੇ ਚਤੁਰਭਾਗ ਚਿੰਨ੍ਹ ਹਨ ਵੱਖ ਕਦਮ[।.]?$/u,
      "ਰੇਡੀਅਨ ਰੂਪਾਂਤਰਨ ਅਤੇ ਚਤੁਰਭਾਗ ਦਾ ਚਿੰਨ੍ਹ ਵੱਖ-ਵੱਖ ਕਦਮਾਂ ਵਿੱਚ ਨਿਰਧਾਰਤ ਕਰੋ।")
    .replace(/^ਸਰਬਸਮਿਕਾ ਵਿੱਚ ਹੁੰਦਾ ਹੈ cot²θ[।.]?$/u,
      "ਸਰਬਸਮਿਕਾ ਵਿੱਚ cot²θ ਆਉਂਦਾ ਹੈ।")
    .replace(/^sec ਅਤੇ cos ਨੂੰ ਇੱਕ ਸਾਂਝੇ ਹਰ ਨਾਲ ਜੋੜੋ[।.]?$/u,
      "sec ਅਤੇ cos ਨੂੰ ਸਾਂਝੇ ਹਰ ਵਿੱਚ ਲਿਖ ਕੇ ਜੋੜੋ।")
    .replace(/^ਗੁਣਾਂਕ ਅਨੁਪਾਤ ਉਲਟ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਬਦਲਦੇ ਵੇਲੇ ਤੋਂ tan ਨੂੰ cot[।.]?$/u,
      "tan ਤੋਂ cot ਵਿੱਚ ਬਦਲਦੇ ਸਮੇਂ ਗੁਣਾਂਕਾਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟ ਜਾਂਦਾ ਹੈ।")
    .replace(/^ਰਿਣਾਤਮਕ ਐਂਪਲੀਟਿਊਡ ਲਈ ਘੱਟ ਤੋਂ ਘੱਟ ਵਰਤੋ[।.]?$/u,
      "ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ ਲਈ −R ਲਵੋ।")
    .replace(/^(tanθ=[^।.]+?) ਦੇ ਮਾਨ ਰੱਖੋ[।.]?$/u, "$1 ਰੱਖੋ।");
}

export function polishTrg001NativeReviewFinal3Human(value: unknown, locale: Locale) {
  return locale === "pa-IN" ? polishPunjabi(value) : polishHindi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: polishTrg001NativeReviewFinal3Human(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: polishTrg001NativeReviewFinal3Human(step.title, locale),
      body: polishTrg001NativeReviewFinal3Human(step.body, locale),
    })),
    shortcut: polishTrg001NativeReviewFinal3Human(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => polishTrg001NativeReviewFinal3Human(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal3Human(localized: AnyQuestion, locale: Locale) {
  const stem = polishTrg001NativeReviewFinal3Human(localized.stem, locale);
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: polishTrg001NativeReviewFinal3Human(option.display, locale),
  }));
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const explanation = mapExplanation(localized.explanation, locale);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_HUMAN_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
  });

  return {
    ...localized,
    stem,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3_HUMAN" as const,
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
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL3_HUMAN_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL3_HUMAN" as const,
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
      final3HumanPolish: true as const,
      learnerSurfaceSource:
        "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_FINAL3_HUMAN_POLISH" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal3Human(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  return finalizeLocalizedTrg001QuestionNativeReviewFinal3Human(
    generateLocalizedTrg001QuestionNativeReviewFinal3(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
