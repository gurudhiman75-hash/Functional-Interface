import { createHash } from "node:crypto";

import { localizeFrozenTrg002Cp007Question } from "./localization-cp007-v1";
import { localizeFrozenTrg002Cp008QuestionCompat } from "./localization-cp008-v1-compat";
import { localizeFrozenTrg002Cp009QuestionCompat } from "./localization-cp009-v1-compat";
import { localizeFrozenTrg002Cp010Question } from "./localization-cp010-v1";
import {
  generateTrg002ExamRealnessV2CanonicalQuestion,
  isTrg002ExamRealnessV2CanonicalOverride,
} from "./production-exam-realness-v2";

export const TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION = "TRG002_HI_PA_EXAM_REALNESS_REMEDIATION_V2" as const;
export const TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS = Array.from(
  { length: 96 },
  (_, index) => `TRG-002-QL-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];
export type Trg002ExamRealnessLocale = "hi-IN" | "pa-IN";
type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

function decimalizeCommonHalves(text: string) {
  return text
    .replaceAll("27/2", "13.5")
    .replaceAll("23/2", "11.5")
    .replaceAll("3/2", "1.5");
}

function replaceOrdered(text: string, pairs: readonly (readonly [string, string])[]) {
  let result = text;
  for (const [from, to] of pairs) result = result.replaceAll(from, to);
  return result;
}

const HI_REPLACEMENTS = [
  ["horizontal adjacent side", "क्षैतिज आसन्न भुजा"],
  ["depression-to-base triangle", "आधार तक अवनमन वाला त्रिभुज"],
  ["depression-to-base", "आधार तक अवनमन"],
  ["line of sight", "दृष्टि-रेखा"],
  ["sight-line", "दृष्टि-रेखा"],
  ["sight line", "दृष्टि-रेखा"],
  ["roof-level", "छत के स्तर का"],
  ["eye-height", "आँख की ऊँचाई"],
  ["tower-distance", "मीनार से दूरी"],
  ["height difference", "ऊँचाई का अंतर"],
  ["total levels", "कुल स्तर"],
  ["total height", "कुल ऊँचाई"],
  ["mast height", "मस्तूल की ऊँचाई"],
  ["vertical drop", "लंबवत अंतर"],
  ["horizontal distance", "क्षैतिज दूरी"],
  ["d_final", "अंतिम दूरी"],
  ["tangent", "tan"],
  ["sine", "sin"],
  ["movement", "चली दूरी"],
  ["separation", "अंतर"],
  ["opposite", "लंबवत"],
  ["adjacent", "आसन्न"],
  ["horizontal", "क्षैतिज"],
  ["vertical", "लंबवत"],
  ["triangle", "त्रिभुज"],
  ["difference", "अंतर"],
  ["distance", "दूरी"],
  ["height", "ऊँचाई"],
  ["width", "चौड़ाई"],
  ["rise", "ऊँचाई का अंतर"],
  ["drop", "ऊँचाई में अंतर"],
  ["side", "भुजा"],
  ["levels", "स्तर"],
  ["upper", "ऊपरी"],
  ["roof", "छत"],
  ["mast", "मस्तूल"],
  ["sight", "दृष्टि"],
  ["line", "रेखा"],
  ["base", "आधार"],
  ["top", "शीर्ष"],
  ["total", "कुल"],
  ["exact", "सटीक"],
  ["values", "मान"],
  ["angle", "कोण"],
  ["minus", "घटाकर"],
] as const;

const PA_REPLACEMENTS = [
  ["horizontal adjacent side", "ਖਿਤਿਜੀ ਲੱਗਦੀ ਭੁਜਾ"],
  ["depression-to-base triangle", "ਅਧਾਰ ਤੱਕ ਅਵਨਮਨ ਵਾਲਾ ਤਿਕੋਣ"],
  ["depression-to-base", "ਅਧਾਰ ਤੱਕ ਅਵਨਮਨ"],
  ["line of sight", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ"],
  ["sight-line", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ"],
  ["sight line", "ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ"],
  ["roof-level", "ਛੱਤ ਦੇ ਪੱਧਰ ਦਾ"],
  ["eye-height", "ਅੱਖ ਦੀ ਉਚਾਈ"],
  ["tower-distance", "ਮੀਨਾਰ ਤੋਂ ਦੂਰੀ"],
  ["height difference", "ਉਚਾਈ ਦਾ ਅੰਤਰ"],
  ["total levels", "ਕੁੱਲ ਪੱਧਰ"],
  ["total height", "ਕੁੱਲ ਉਚਾਈ"],
  ["mast height", "ਮਸਤੂਲ ਦੀ ਉਚਾਈ"],
  ["vertical drop", "ਲੰਬਵਾਂ ਅੰਤਰ"],
  ["horizontal distance", "ਖਿਤਿਜੀ ਦੂਰੀ"],
  ["d_final", "ਅੰਤਿਮ ਦੂਰੀ"],
  ["tangent", "tan"],
  ["sine", "sin"],
  ["movement", "ਤੁਰਿਆ ਫਾਸਲਾ"],
  ["separation", "ਅੰਤਰ"],
  ["opposite", "ਲੰਬਵੀਂ"],
  ["adjacent", "ਲੱਗਦੀ"],
  ["horizontal", "ਖਿਤਿਜੀ"],
  ["vertical", "ਲੰਬਵਾਂ"],
  ["triangle", "ਤਿਕੋਣ"],
  ["difference", "ਅੰਤਰ"],
  ["distance", "ਦੂਰੀ"],
  ["height", "ਉਚਾਈ"],
  ["width", "ਚੌੜਾਈ"],
  ["rise", "ਉਚਾਈ ਦਾ ਅੰਤਰ"],
  ["drop", "ਉਚਾਈ ਵਿੱਚ ਅੰਤਰ"],
  ["side", "ਭੁਜਾ"],
  ["levels", "ਪੱਧਰ"],
  ["upper", "ਉੱਪਰਲਾ"],
  ["roof", "ਛੱਤ"],
  ["mast", "ਮਸਤੂਲ"],
  ["sight", "ਦ੍ਰਿਸ਼ਟੀ"],
  ["line", "ਰੇਖਾ"],
  ["base", "ਅਧਾਰ"],
  ["top", "ਚੋਟੀ"],
  ["total", "ਕੁੱਲ"],
  ["exact", "ਸਟੀਕ"],
  ["values", "ਮੁੱਲ"],
  ["angle", "ਕੋਣ"],
  ["minus", "ਘਟਾ ਕੇ"],
] as const;

function grammarCleanup(text: string, locale: Trg002ExamRealnessLocale) {
  if (locale === "hi-IN") {
    return text
      .replaceAll("खंभा की", "खंभे की")
      .replaceAll("खंभा का", "खंभे का")
      .replaceAll("खंभा के", "खंभे के")
      .replaceAll("खंभा तक", "खंभे तक")
      .replaceAll("खंभा से", "खंभे से")
      .replaceAll("पेड़/खंभा", "पेड़")
      .replaceAll("छोटी/पहली", "छोटी")
      .replaceAll("x+-", "x−")
      .replaceAll("d−-", "d+");
  }
  return text
    .replaceAll("ਖੰਭਾ ਦੀ", "ਖੰਭੇ ਦੀ")
    .replaceAll("ਖੰਭਾ ਦਾ", "ਖੰਭੇ ਦਾ")
    .replaceAll("ਖੰਭਾ ਦੇ", "ਖੰਭੇ ਦੇ")
    .replaceAll("ਖੰਭਾ ਤੱਕ", "ਖੰਭੇ ਤੱਕ")
    .replaceAll("ਖੰਭਾ ਤੋਂ", "ਖੰਭੇ ਤੋਂ")
    .replaceAll("ਦਰੱਖਤ/ਖੰਭਾ", "ਦਰੱਖਤ")
    .replaceAll("ਛੋਟੀ/ਪਹਿਲੀ", "ਛੋਟੀ")
    .replaceAll("ਡਿਪ੍ਰੈਸ਼ਨ ਕੋਣ", "ਅਵਨਮਨ ਕੋਣ")
    .replaceAll("x+-", "x−")
    .replaceAll("d−-", "d+");
}

function cleanLearnerText(text: string, locale: Trg002ExamRealnessLocale) {
  const decimalized = decimalizeCommonHalves(text);
  const translated = replaceOrdered(decimalized, locale === "hi-IN" ? HI_REPLACEMENTS : PA_REPLACEMENTS);
  return grammarCleanup(translated, locale)
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([।,.])/g, "$1")
    .trim();
}

function repairBuildingSeparationStem(qlId: string, locale: Trg002ExamRealnessLocale, stem: string) {
  if (!["TRG-002-QL-083", "TRG-002-QL-084", "TRG-002-QL-085"].includes(qlId)) return stem;
  if (locale === "hi-IN") {
    const match = /^पहली इमारत (.+?) m ऊँची है। उसके शीर्ष से (.+?) m दूर दूसरी इमारत का शीर्ष (.+)$/u.exec(stem);
    if (!match) return stem;
    return `पहली इमारत ${match[1]} m ऊँची है और दोनों इमारतों के पादों के बीच क्षैतिज दूरी ${match[2]} m है। पहली इमारत के शीर्ष से दूसरी इमारत का शीर्ष ${match[3]}`;
  }
  const match = /^ਪਹਿਲੀ ਇਮਾਰਤ (.+?) m ਉੱਚੀ ਹੈ। ਇਸ ਦੀ ਛੱਤ ਤੋਂ (.+?) m ਦੂਰ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ (.+)$/u.exec(stem);
  if (!match) return stem;
  return `ਪਹਿਲੀ ਇਮਾਰਤ ${match[1]} m ਉੱਚੀ ਹੈ ਅਤੇ ਦੋਵੇਂ ਇਮਾਰਤਾਂ ਦੇ ਪੈਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ${match[2]} m ਹੈ। ਪਹਿਲੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਦੂਜੀ ਇਮਾਰਤ ਦੀ ਚੋਟੀ ${match[3]}`;
}

function remediateStem(qlId: string, locale: Trg002ExamRealnessLocale, stem: string) {
  return repairBuildingSeparationStem(qlId, locale, cleanLearnerText(stem, locale));
}

function remediateExplanation(locale: Trg002ExamRealnessLocale, explanation: AnyQuestion) {
  const lastIndex = explanation.steps.length - 1;
  return {
    ...explanation,
    keyRule: cleanLearnerText(explanation.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion, index: number) => ({
      ...step,
      title: index === lastIndex
        ? (locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ")
        : index === 0
          ? (locale === "hi-IN" ? "समाधान" : "ਹੱਲ")
          : (locale === "hi-IN" ? "गणना" : "ਗਣਨਾ"),
      body: cleanLearnerText(step.body, locale),
    })),
    shortcut: cleanLearnerText(explanation.shortcut, locale),
    traps: explanation.traps.map((trap: string) => cleanLearnerText(trap, locale)),
  };
}

function localizeCanonical(canonical: AnyQuestion, locale: Trg002ExamRealnessLocale) {
  const n = Number(String(canonical.qlId).slice(-3));
  if (n <= 24) return localizeFrozenTrg002Cp007Question(canonical, locale);
  if (n <= 48) return localizeFrozenTrg002Cp008QuestionCompat(canonical, locale);
  if (n <= 72) return localizeFrozenTrg002Cp009QuestionCompat(canonical, locale);
  return localizeFrozenTrg002Cp010Question(canonical, locale);
}

export function generateExamRealLocalizedTrg002Question(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  if (!TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-002 exam-realness V2 scope.`);
  const canonical: AnyQuestion = generateTrg002ExamRealnessV2CanonicalQuestion(qlId, seed) as AnyQuestion;
  const localized: AnyQuestion = localizeCanonical(canonical, locale);
  const stem = remediateStem(qlId, locale, localized.stem);
  const explanation = remediateExplanation(locale, localized.explanation);
  const canonicalOverride = isTrg002ExamRealnessV2CanonicalOverride(qlId);
  const localizationFingerprint = sha256({
    version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
    locale, qlId, seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem, explanation,
  });

  return {
    ...localized,
    stem,
    explanation,
    reviewStatus: "EXAM_REALNESS_REMEDIATION_REVIEW_PENDING" as const,
    aiEditorialStatus: "REMEDIATED_V2" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
    localizationMetadata: {
      ...localized.localizationMetadata,
      version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
      authority: "EXAM_REALNESS_REMEDIATION_V2" as const,
      humanLanguageReviewRequired: true,
    },
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      englishSource: canonicalOverride ? "EXAM_REALNESS_V2_CANONICAL_CANDIDATE" as const : "HUMAN_APPROVED_FROZEN_96" as const,
      hindiPunjabi: "EXAM_REALNESS_REMEDIATION_V2_REVIEW_CANDIDATE" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint,
      semanticParity: "V2_CANONICAL_SEMANTICS_PRESERVED" as const,
      canonicalOutcomeSource: canonicalOverride ? "EXAM_REALNESS_V2_CANONICAL_OVERRIDE" as const : "FROZEN_PRODUCTION_96_RUNTIME" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      productDeliveryUnlocked: false,
    },
    realnessRemediation: {
      version: TRG_002_EXAM_REALNESS_LOCALIZATION_VERSION,
      canonicalOverride,
      artificialCompoundGivenRemoved: ["TRG-002-QL-050","TRG-002-QL-051","TRG-002-QL-053","TRG-002-QL-054","TRG-002-QL-060","TRG-002-QL-062","TRG-002-QL-066"].includes(qlId),
      fractionalMeasurementSurfaceNormalized: ["TRG-002-QL-073","TRG-002-QL-074","TRG-002-QL-075","TRG-002-QL-076"].includes(qlId),
      ambiguousBuildingDistanceStemRepaired: ["TRG-002-QL-083","TRG-002-QL-084","TRG-002-QL-085"].includes(qlId),
      slashPlaceholderRemoved: ["TRG-002-QL-041","TRG-002-QL-042","TRG-002-QL-043","TRG-002-QL-044","TRG-002-QL-086","TRG-002-QL-087"].includes(qlId),
      grammarAndEnglishLeakageCleanup: true,
      lifecycleLocked: true,
    },
  };
}

export function buildTrg002ExamRealnessV2ReviewBank(locale: Trg002ExamRealnessLocale, seedsPerQl = 12) {
  return TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateExamRealLocalizedTrg002Question(
      qlId,
      `trg002-exam-realness-v2-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
