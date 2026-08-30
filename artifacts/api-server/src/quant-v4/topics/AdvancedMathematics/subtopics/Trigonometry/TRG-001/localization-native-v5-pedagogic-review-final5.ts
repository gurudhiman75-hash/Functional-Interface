import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal4 } from "./localization-native-v5-pedagogic-review-final4";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL5_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL5" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function polishHindi(value: unknown) {
  return String(value ?? "")
    .replace(/^पर\s+(\d+)°,\s*(.+)$/u, "$1° पर, $2")
    .replace(/^क्योंकि\s+(.+),\s*समतुल्य व्यंजक है\s+(.+)।$/u, "क्योंकि $1, इसलिए समतुल्य व्यंजक $2 है।")
    .replace(/^अतः व्यंजक है\s+(.+)।$/u, "अतः व्यंजक $1 के बराबर है।")
    .replace(/^भाग से शून्य अपरिभाषित है,\s*इसलिए\s+(.+)$/u, "शून्य से भाग देना अपरिभाषित है, इसलिए $1")
    .replace(/^पूरा चक्कर tan का मान अपरिवर्तित रखता है।$/u, "एक पूरा चक्कर जोड़ने या घटाने पर tan का मान नहीं बदलता।")
    .replace(/^tanθ=sinθ\/cosθ अपरिवर्तित रखता है से भाग देने पर sinθ।$/u, "tanθ=sinθ/cosθ से भाग देने पर केवल sinθ बचता है।")
    .replace(/(^|[,\s])योग है ([^।;]+)([।;]?)/gu, "$1योग $2 है$3")
    .replace(/(^|[,\s])कुल है ([^।;]+)([।;]?)/gu, "$1कुल $2 है$3")
    .replace(/(^|[,\s])गुणनफल है ([^।;]+)([।;]?)/gu, "$1गुणनफल $2 है$3")
    .replace(/(^|[,\s])अनुपात है ([^।;]+)([।;]?)/gu, "$1अनुपात $2 है$3")
    .replace(/^उसका व्युत्क्रम है ([^।]+)।$/u, "उसका व्युत्क्रम $1 है।")
    .replace(/, उसका व्युत्क्रम है ([^।]+)।$/u, ", इसलिए उसका व्युत्क्रम $1 है।")
    .replace(/^वह बराबर है ([^।]+)।$/u, "वह $1 के बराबर है।")
    .replace(/^यह बराबर है ([^।]+)।$/u, "यह $1 के बराबर है।")
    .replace(/व्यंजक बराबर है ([^।]+)।$/u, "व्यंजक $1 के बराबर है।")
    .replace(/^सहफलन परिमाण है ([^।]+)।$/u, "सहफलन का परिमाण $1 है।")
    .replace(/^त्रिभुज है ([^;]+);/u, "त्रिभुज $1 है;")
    .replace(/उनका योग ([0-9√π/+\-]+)=\1 है।/u, "उनका योग $1 है।")
    .trim();
}

function polishPunjabi(value: unknown) {
  return String(value ?? "")
    .replace(/^ਤੇ\s+(\d+)°,\s*(.+)$/u, "$1° ਤੇ, $2")
    .replace(/^ਕਿਉਂਕਿ\s+(.+),\s*ਬਰਾਬਰ ਵਿਅੰਜਕ ਹੈ\s+(.+)।$/u, "ਕਿਉਂਕਿ $1, ਇਸ ਲਈ ਬਰਾਬਰ ਵਿਅੰਜਕ $2 ਹੈ।")
    .replace(/^ਇਸ ਲਈ ਵਿਅੰਜਕ ਹੈ\s+(.+)।$/u, "ਇਸ ਲਈ ਵਿਅੰਜਕ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/^ਘਟਾਓ ਦਾ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ।$/u, "ਘਟਾਉ ਦਾ ਚਿੰਨ੍ਹ ਕਾਇਮ ਰੱਖੋ।")
    .replace(/^ਭਾਗ ਨਾਲ ਸਿਫ਼ਰ ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ,\s*ਇਸ ਲਈ\s+(.+)$/u, "ਸਿਫ਼ਰ ਨਾਲ ਭਾਗ ਦੇਣਾ ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਇਸ ਲਈ $1")
    .replace(/^ਪੂਰਾ ਚੱਕਰ tan ਦਾ ਮਾਨ ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ।$/u, "ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਜੋੜਣ ਜਾਂ ਘਟਾਉਣ ਤੇ tan ਦਾ ਮਾਨ ਨਹੀਂ ਬਦਲਦਾ।")
    .replace(/^tanθ=sinθ\/cosθ ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ sinθ।$/u, "tanθ=sinθ/cosθ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕੇਵਲ sinθ ਬਚਦਾ ਹੈ।")
    .replace(/^(\d+) ਅਨੁਪਾਤ-ਭਾਗ ਦੇ ਬਰਾਬਰ ਹਨ ([^,]+), ਇਸ ਲਈ ਸਕੇਲ ਹੈ ([^।]+)।$/u, "ਅਨੁਪਾਤ ਦੇ $1 ਭਾਗ $2 ਦੇ ਬਰਾਬਰ ਹਨ; ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ $3 ਹੈ।")
    .replace(/(^|[,\s])ਜੋੜ ਹੈ ([^।;]+)([।;]?)/gu, "$1ਜੋੜ $2 ਹੈ$3")
    .replace(/(^|[,\s])ਕੁੱਲ ਹੈ ([^।;]+)([।;]?)/gu, "$1ਕੁੱਲ $2 ਹੈ$3")
    .replace(/(^|[,\s])ਗੁਣਨਫਲ ਹੈ ([^।;]+)([।;]?)/gu, "$1ਗੁਣਨਫਲ $2 ਹੈ$3")
    .replace(/(^|[,\s])ਅਨੁਪਾਤ ਹੈ ([^।;]+)([।;]?)/gu, "$1ਅਨੁਪਾਤ $2 ਹੈ$3")
    .replace(/^ਇਸਦਾ ਪਰਸਪਰ ਹੈ ([^।]+)।$/u, "ਇਸਦਾ ਪਰਸਪਰ $1 ਹੈ।")
    .replace(/, ਇਸਦਾ ਪਰਸਪਰ ਹੈ ([^।]+)।$/u, ", ਇਸ ਲਈ ਇਸਦਾ ਪਰਸਪਰ $1 ਹੈ।")
    .replace(/^ਉਹ ਬਰਾਬਰ ਹੈ ([^।]+)।$/u, "ਉਹ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/^ਇਹ ਬਰਾਬਰ ਹੈ ([^।]+)।$/u, "ਇਹ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/ਵਿਅੰਜਕ ਬਰਾਬਰ ਹੈ ([^।]+)।$/u, "ਵਿਅੰਜਕ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/^ਸਹਿ-ਫੰਕਸ਼ਨ ਪਰਿਮਾਣ ਹੈ ([^।]+)।$/u, "ਸਹਿ-ਫੰਕਸ਼ਨ ਦਾ ਪਰਿਮਾਣ $1 ਹੈ।")
    .replace(/^ਤਿਕੋਣ ਹੈ ([^;]+);/u, "ਤਿਕੋਣ $1 ਹੈ;")
    .replace(/ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ([0-9√π/+\-]+)=\1 ਹੈ।/u, "ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ $1 ਹੈ।")
    .trim();
}

export function polishTrg001Final5Text(value: unknown, locale: Locale) {
  return locale === "hi-IN" ? polishHindi(value) : polishPunjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: polishTrg001Final5Text(explanation?.keyRule, locale),
    steps: (explanation?.steps ?? []).map((step: AnyQuestion) => ({
      ...step,
      title: polishTrg001Final5Text(step?.title, locale),
      body: polishTrg001Final5Text(step?.body, locale),
    })),
    shortcut: polishTrg001Final5Text(explanation?.shortcut, locale),
    traps: (explanation?.traps ?? []).map((trap: unknown) => polishTrg001Final5Text(trap, locale)),
  };
}

export function localizeFrozenTrg001QuestionNativeReviewFinal5(
  canonicalQuestion: AnyQuestion,
  locale: Locale,
) {
  const final4 = generateLocalizedTrg001QuestionNativeReviewFinal4(
    canonicalQuestion.qlId,
    canonicalQuestion.seed,
    locale,
  ) as AnyQuestion;
  const explanation = mapExplanation(final4.explanation, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(final4);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL5_VERSION,
    locale,
    qlId: final4.qlId,
    seed: final4.seed,
    canonicalSemanticFingerprint,
    stem: final4.stem,
    optionDisplays: final4.options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay: final4.localizedAnswerDisplay,
    explanation,
  });

  return {
    ...final4,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL5" as const,
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
      ...final4.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL5_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_FINAL5" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...final4.localizationProof,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      learnerSurfaceSource: "FINAL4_PLUS_TARGETED_NATIVE_WORD_ORDER_POLISH_FINAL5" as const,
      final5NativeWordOrderPolish: true as const,
      final5SourceVersion: final4.reviewStatus,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal5(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  const canonical = generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion;
  return localizeFrozenTrg001QuestionNativeReviewFinal5(canonical, locale);
}
