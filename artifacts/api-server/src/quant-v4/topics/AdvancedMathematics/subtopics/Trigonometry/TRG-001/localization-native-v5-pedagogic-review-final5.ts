import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { generateLocalizedTrg001QuestionNativeReviewFinal4 } from "./localization-native-v5-pedagogic-review-final4";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL5_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL5" as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(value: string) {
  return value.replace(/\s+([,;:!?])/gu, "$1").replace(/\s{2,}/gu, " ").trim();
}

function polishHindi(value: unknown) {
  let text = String(value ?? "").trim();
  text = text
    .replace(/^पर\s+(\d+°),\s*/u, "$1 पर ")
    .replace(/उसका व्युत्क्रम है ([^।]+)।/gu, "उसका व्युत्क्रम $1 है।")
    .replace(/उनका योग है ([^।]+)।/gu, "उनका योग $1 है।")
    .replace(/इसलिए योग है ([^।]+)।/gu, "इसलिए योग $1 है।")
    .replace(/अतः योग है ([^।]+)।/gu, "अतः योग $1 है।")
    .replace(/त्रिभुज है ([^;।]+);/gu, "त्रिभुज $1 है;")
    .replace(/समतुल्य व्यंजक है ([^।]+)।/gu, "समतुल्य व्यंजक $1 है।")
    .replace(/व्यंजक बराबर है ([^।]+)।/gu, "व्यंजक $1 के बराबर है।")
    .replace(/^(\d+) अनुपात-भाग के बराबर हैं ([^,]+), इसलिए माप गुणक (\S+) है।$/u,
      "अनुपात के $1 भाग $2 के बराबर हैं; इसलिए माप गुणक $3 है।");
  return finish(text);
}

function polishPunjabi(value: unknown) {
  let text = String(value ?? "").trim();
  text = text
    .replace(/^ਤੇ\s+(\d+°),\s*/u, "$1 ਤੇ ")
    .replace(/ਇਸਦਾ ਪਰਸਪਰ ਹੈ ([^।]+)।/gu, "ਇਸਦਾ ਪਰਸਪਰ $1 ਹੈ।")
    .replace(/ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਹੈ ([^।]+)।/gu, "ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ $1 ਹੈ।")
    .replace(/ਇਸ ਲਈ ਜੋੜ ਹੈ ([^।]+)।/gu, "ਇਸ ਲਈ ਜੋੜ $1 ਹੈ।")
    .replace(/ਤਿਕੋਣ ਹੈ ([^;।]+);/gu, "ਤਿਕੋਣ $1 ਹੈ;")
    .replace(/ਬਰਾਬਰ ਵਿਅੰਜਕ ਹੈ ([^।]+)।/gu, "ਬਰਾਬਰ ਵਿਅੰਜਕ $1 ਹੈ।")
    .replace(/ਵਿਅੰਜਕ ਬਰਾਬਰ ਹੈ ([^।]+)।/gu, "ਵਿਅੰਜਕ $1 ਦੇ ਬਰਾਬਰ ਹੈ।")
    .replace(/^(\d+) ਅਨੁਪਾਤ-ਭਾਗ ਦੇ ਬਰਾਬਰ ਹਨ ([^,]+), ਇਸ ਲਈ ਸਕੇਲ ਹੈ ([^।]+)।$/u,
      "ਅਨੁਪਾਤ ਦੇ $1 ਭਾਗ $2 ਦੇ ਬਰਾਬਰ ਹਨ; ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ $3 ਹੈ।");
  return finish(text);
}

export function polishTrg001Final5NativeOrder(value: unknown, locale: Locale) {
  const before = String(value ?? "").trim();
  const text = locale === "hi-IN" ? polishHindi(before) : polishPunjabi(before);
  return { text, corrected: text !== before };
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  let correctedFields = 0;
  const polish = (value: unknown) => {
    const result = polishTrg001Final5NativeOrder(value, locale);
    if (result.corrected) correctedFields += 1;
    return result.text;
  };
  return {
    explanation: {
      ...explanation,
      keyRule: polish(explanation.keyRule),
      steps: explanation.steps.map((step: AnyQuestion) => ({
        ...step,
        title: polish(step.title),
        body: polish(step.body),
      })),
      shortcut: polish(explanation.shortcut),
      traps: explanation.traps.map((trap: unknown) => polish(trap)),
    },
    correctedFields,
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal5(
  source: AnyQuestion,
  final4: AnyQuestion,
  locale: Locale,
) {
  let correctedFields = 0;
  const polish = (value: unknown) => {
    const result = polishTrg001Final5NativeOrder(value, locale);
    if (result.corrected) correctedFields += 1;
    return result.text;
  };

  const stem = polish(final4.stem);
  const options = final4.options.map((option: AnyQuestion) => ({ ...option, display: polish(option.display) }));
  const localizedAnswerDisplay = polish(options[final4.correctIndex]?.display ?? final4.localizedAnswerDisplay);
  const explanationResult = mapExplanation(final4.explanation, locale);
  correctedFields += explanationResult.correctedFields;
  const explanation = explanationResult.explanation;
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(final4);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL5_VERSION,
    locale,
    qlId: final4.qlId,
    seed: final4.seed,
    canonicalSemanticFingerprint,
    stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
    final4Fingerprint: final4.localizationProof.localizationFingerprint,
    correctedFields,
  });

  return {
    ...final4,
    stem,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL5" as const,
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
      final5NativeOrderPolish: true as const,
      final5CorrectedLearnerFields: correctedFields,
      final5SourceFingerprint: final4.localizationProof.localizationFingerprint,
      learnerSurfaceSource: "FINAL4_PLUS_NATIVE_RESULT_ORDER_POLISH" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal5(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  const source = generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion;
  const final4 = generateLocalizedTrg001QuestionNativeReviewFinal4(qlId, seed, locale) as AnyQuestion;
  return finalizeLocalizedTrg001QuestionNativeReviewFinal5(source, final4, locale);
}
