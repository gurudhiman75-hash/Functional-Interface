import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale, trg001CanonicalSemanticFingerprint } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";
import {
  TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
  generatePostFreezeRemediatedTrg001Question,
} from "./production-post-freeze-remediation-v1";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL6" as const;

export const TRG_001_LOCALIZATION_FINAL6_REMEDIATED_IDS = [
  "TRG-001-QL-069",
  "TRG-001-QL-093",
  "TRG-001-QL-098",
  "TRG-001-QL-100",
  "TRG-001-QL-113",
  "TRG-001-QL-114",
  "TRG-001-QL-115",
  "TRG-001-QL-142",
] as const;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function ql142Shortcut(explanation: AnyQuestion, locale: Locale) {
  const workedText = (explanation.steps ?? []).map((step: AnyQuestion) => String(step?.body ?? "")).join(" ");
  const usesSinConjugate = workedText.includes("1−sin²");
  const usesCosConjugate = workedText.includes("1−cos²");

  if (usesSinConjugate === usesCosConjugate) {
    throw new Error("TRG-001-QL-142: unable to identify exactly one generated conjugate variant from worked steps.");
  }

  if (locale === "hi-IN") {
    return usesSinConjugate
      ? "संयुग्मी गुणनफल (1+sinα)(1−sinα)=1−sin²α=cos²α का प्रयोग करें।"
      : "संयुग्मी गुणनफल (1+cosα)(1−cosα)=1−cos²α=sin²α का प्रयोग करें।";
  }

  return usesSinConjugate
    ? "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+sinα)(1−sinα)=1−sin²α=cos²α ਵਰਤੋ।"
    : "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+cosα)(1−cosα)=1−cos²α=sin²α ਵਰਤੋ।";
}

function correctedExplanation(question: AnyQuestion, locale: Locale) {
  const explanation = {
    ...question.explanation,
    steps: (question.explanation?.steps ?? []).map((step: AnyQuestion) => ({ ...step })),
    traps: [...(question.explanation?.traps ?? [])],
  };

  const hi = locale === "hi-IN";

  switch (question.qlId) {
    case "TRG-001-QL-069":
      if (!hi) {
        const corrected = "ਕੋਣ ਨੂੰ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, cos ਦਾ ਸਹੀ ਚਿੰਨ੍ਹ ਲਗਾਓ ਅਤੇ ਫਿਰ ਪਰਸਪਰ ਲਓ।";
        explanation.shortcut = corrected;
        if (explanation.steps[0]) {
          explanation.steps[0] = { ...explanation.steps[0], body: corrected };
        }
      }
      break;
    case "TRG-001-QL-093":
      explanation.shortcut = hi
        ? "sin θ के अनुपात से cos θ ज्ञात करें, फिर माँगे गए व्यंजक में मान रखें।"
        : "sin θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ cos θ ਕੱਢੋ, ਫਿਰ ਮੰਗੇ ਗਏ ਵਿਅੰਜਕ ਵਿੱਚ ਮਾਨ ਰੱਖੋ।";
      break;
    case "TRG-001-QL-098":
      explanation.shortcut = hi
        ? "tan θ के अनुपात से sec θ और cos θ ज्ञात करें।"
        : "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sec θ ਅਤੇ cos θ ਕੱਢੋ।";
      break;
    case "TRG-001-QL-100":
      explanation.shortcut = hi
        ? "tan θ के अनुपात से sin θ और cos θ ज्ञात करें, फिर उनके वर्गों को दिए गए क्रम में घटाएँ।"
        : "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sin θ ਅਤੇ cos θ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਵਰਗ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਘਟਾਓ।";
      break;
    case "TRG-001-QL-113":
      explanation.keyRule = hi
        ? "cos θ से भाग देकर tan θ को अलग करें।"
        : "cos θ ਨਾਲ ਭਾਗ ਦੇ ਕੇ tan θ ਨੂੰ ਵੱਖ ਕਰੋ।";
      break;
    case "TRG-001-QL-114":
      explanation.keyRule = hi
        ? "रैखिक संबंध से sin θ:cos θ का अनुपात निकालें, फिर माँगा गया योग-अंतर अनुपात बनाएँ।"
        : "ਰੇਖੀ ਸੰਬੰਧ ਤੋਂ sin θ:cos θ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਮੰਗਿਆ ਗਿਆ ਜੋੜ-ਅੰਤਰ ਅਨੁਪਾਤ ਬਣਾਓ।";
      break;
    case "TRG-001-QL-115":
      explanation.keyRule = hi
        ? "रैखिक संबंध को tan अनुपात में बदलें, फिर cot के लिए व्युत्क्रम लें।"
        : "ਰੇਖੀ ਸੰਬੰਧ ਨੂੰ tan ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ cot ਲਈ ਪਰਸਪਰ ਲਓ।";
      break;
    case "TRG-001-QL-142":
      explanation.shortcut = ql142Shortcut(explanation, locale);
      break;
    default:
      break;
  }

  return explanation;
}

export function generateLocalizedTrg001QuestionNativeReviewFinal6(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  const final5 = generateLocalizedTrg001QuestionNativeReviewFinal5(qlId, seed, locale) as AnyQuestion;
  const englishCandidate = generatePostFreezeRemediatedTrg001Question(qlId, seed) as AnyQuestion;
  const explanation = correctedExplanation(final5, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(final5);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
    englishRemediationVersion: TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
    locale,
    qlId: final5.qlId,
    seed: final5.seed,
    canonicalSemanticFingerprint,
    stem: final5.stem,
    optionDisplays: final5.options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay: final5.localizedAnswerDisplay,
    explanation,
  });

  if (trg001CanonicalSemanticFingerprint(englishCandidate) !== canonicalSemanticFingerprint) {
    throw new Error(`${qlId}:${locale}: Final6 canonical semantics drift from remediated English candidate.`);
  }

  return {
    ...final5,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_FINAL6" as const,
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
      ...final5.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL6_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_FINAL6" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...final5.localizationProof,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      learnerSurfaceSource: "FINAL5_PLUS_POST_REVIEW_DEFECT_REMEDIATION_FINAL6" as const,
      final6PostReviewDefectRemediation: true as const,
      final6SourceVersion: final5.reviewStatus,
      englishRemediationVersion: TRG_001_POST_FREEZE_REMEDIATION_V1_VERSION,
      humanLanguageReviewRequired: true,
    },
  };
}
