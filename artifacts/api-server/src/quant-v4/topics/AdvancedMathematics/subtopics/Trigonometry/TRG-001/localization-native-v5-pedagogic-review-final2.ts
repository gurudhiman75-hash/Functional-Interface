import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal } from "./localization-native-v5-pedagogic-review-final";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL2_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL2" as const;

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

function close(value: unknown, locale: Locale) {
  let text = finish(value);
  if (locale === "hi-IN") {
    text = text
      .replace(/^यह सरल होकर को\s+(.+?)[।.]?$/u, "सरल करने पर $1 मिलता है।")
      .replace(
        /^गुणा करने से से\s+(.+?)\s+से\s+(.+?)[।.]?\s*मिलता है।$/u,
        "गुणा करने पर $1 से $2 मिलता है।",
      );
  } else {
    text = text
      .replace(/^ਇਹ ਸਰਲ ਹੋ ਕੇ ਨੂੰ\s+(.+?)[।.]?$/u, "ਸਰਲ ਕਰਨ ਤੇ $1 ਮਿਲਦਾ ਹੈ।")
      .replace(
        /^ਗੁਣਾ ਕਰਨ ਨਾਲ ਨਾਲ\s+(.+?)\s+ਤੋਂ\s+(.+?)[।.]?\s*ਮਿਲਦਾ ਹੈ।$/u,
        "ਗੁਣਾ ਕਰਨ ਤੇ $1 ਤੋਂ $2 ਮਿਲਦਾ ਹੈ।",
      );
  }
  return finish(text);
}

function mapExplanation(explanation: AnyQuestion, locale: Locale) {
  return {
    ...explanation,
    keyRule: close(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: close(step.title, locale),
      body: close(step.body, locale),
    })),
    shortcut: close(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => close(trap, locale)),
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal2(localized: AnyQuestion, locale: Locale) {
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: close(option.display, locale),
  }));
  const explanation = mapExplanation(localized.explanation, locale);
  const localizedAnswerDisplay = options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay;
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL2_VERSION,
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
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL2" as const,
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
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL2_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL2" as const,
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
      learnerSurfaceSource: "V5_NATIVE_STEMS_PLUS_QUESTION_SPECIFIC_WORKING_PLUS_FINAL_NATIVE_REVIEW_POLISH_V2" as const,
      finalNativeReviewOverlay2: true as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal2(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  return finalizeLocalizedTrg001QuestionNativeReviewFinal2(
    generateLocalizedTrg001QuestionNativeReviewFinal(qlId, seed, locale) as AnyQuestion,
    locale,
  );
}
