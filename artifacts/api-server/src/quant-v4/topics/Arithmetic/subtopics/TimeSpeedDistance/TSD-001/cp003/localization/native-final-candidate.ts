import type { TsdCp003EnglishFrozenRecord } from "../english-frozen";
import type { TsdCp003MisconceptionId } from "../runtime-types";
import {
  generateCp003AuthoritativeNativeCandidate,
  type TsdCp003NativeAuthoritativeRow,
} from "./native-authoritative";
import {
  assertTsdCp003NativeText,
  type TsdCp003NativeLanguage,
} from "./native-language-primitives";

export const TSD_CP003_NATIVE_FINAL_REVIEW_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW" as const;

export type TsdCp003FinalNativeOptionAnalysis = Readonly<{
  option: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
  misconceptionId: TsdCp003MisconceptionId;
  wrongWorking: string | null;
  reason: string;
}>;

export type TsdCp003FinalNativePresentation = Omit<
  TsdCp003NativeAuthoritativeRow["presentation"],
  "explanation" | "lifecycle"
> & Readonly<{
  explanation: Readonly<{
    method: string;
    steps: readonly string[];
    examSpeedShortcut: string;
    optionAnalysis: readonly TsdCp003FinalNativeOptionAnalysis[];
    answer: string;
  }>;
  lifecycle: Readonly<{
    nativeEditorialStatus: typeof TSD_CP003_NATIVE_FINAL_REVIEW_STATUS;
    multilingualFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export type TsdCp003FinalNativeReviewRow = Readonly<{
  source: TsdCp003EnglishFrozenRecord;
  presentation: TsdCp003FinalNativePresentation;
  finalNativeReview: Readonly<{
    status: typeof TSD_CP003_NATIVE_FINAL_REVIEW_STATUS;
    solePublicNativeEntryPoint: true;
    explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_WORKING_ANALYSIS_ANSWER";
    exactWrongWorkingLocalized: true;
    productOwnerApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
    sourceMathChanged: false;
  }>;
}>;

export function localizeCp003NativeWrongCalculation(
  calculation: string,
  language: TsdCp003NativeLanguage,
): string {
  let value = calculation.trim();
  if (language === "hi") {
    value = value
      .replace(/next day/gu, "अगले दिन")
      .replace(/^copy\s+/u, "प्रस्थान समय ")
      .replace(/\bhours\b/gu, "घंटे")
      .replace(/\bhour\b/gu, "घंटा")
      .replace(/\bminutes\b/gu, "मिनट")
      .replace(/\bminute\b/gu, "मिनट")
      .replace(/\bseconds\b/gu, "सेकंड")
      .replace(/\bsecond\b/gu, "सेकंड");
    const result = `गलत गणना: ${value}`;
    assertTsdCp003NativeText(result, language, "native-wrong-calculation/hi");
    return result;
  }

  value = value
    .replace(/next day/gu, "ਅਗਲੇ ਦਿਨ")
    .replace(/^copy\s+/u, "ਰਵਾਨਗੀ ਸਮਾਂ ")
    .replace(/\bhours\b/gu, "ਘੰਟੇ")
    .replace(/\bhour\b/gu, "ਘੰਟਾ")
    .replace(/\bminutes\b/gu, "ਮਿੰਟ")
    .replace(/\bminute\b/gu, "ਮਿੰਟ")
    .replace(/\bseconds\b/gu, "ਸਕਿੰਟ")
    .replace(/\bsecond\b/gu, "ਸਕਿੰਟ");
  const result = `ਗਲਤ ਗਣਨਾ: ${value}`;
  assertTsdCp003NativeText(result, language, "native-wrong-calculation/pa");
  return result;
}

function finalizeRow(row: TsdCp003NativeAuthoritativeRow): TsdCp003FinalNativeReviewRow {
  const { source, presentation } = row;
  const optionAnalysis = Object.freeze(presentation.explanation.optionAnalysis.map((entry, index) => {
    const audit = source.optionAudit[index];
    if (!audit) throw new Error(`${presentation.questionLanguageId}: source option audit ${index} missing`);
    const wrongWorking = audit.isCorrect
      ? null
      : localizeCp003NativeWrongCalculation(audit.wrongWorking!.calculation, presentation.language);
    return Object.freeze({
      option: entry.option,
      text: entry.text,
      isCorrect: entry.isCorrect,
      misconceptionId: audit.misconceptionId,
      wrongWorking,
      reason: entry.reason,
    });
  }));

  const finalPresentation: TsdCp003FinalNativePresentation = Object.freeze({
    ...presentation,
    explanation: Object.freeze({
      method: presentation.explanation.method,
      steps: presentation.explanation.steps,
      examSpeedShortcut: presentation.explanation.examSpeedShortcut,
      optionAnalysis,
      answer: presentation.explanation.answer,
    }),
    lifecycle: Object.freeze({
      nativeEditorialStatus: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
      multilingualFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });

  return Object.freeze({
    source,
    presentation: finalPresentation,
    finalNativeReview: Object.freeze({
      status: TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
      solePublicNativeEntryPoint: true as const,
      explanationContract: "METHOD_STEPS_SHORTCUT_OPTION_WORKING_ANALYSIS_ANSWER" as const,
      exactWrongWorkingLocalized: true as const,
      productOwnerApprovalRecorded: false as const,
      multilingualFreezeAuthorized: false as const,
      sourceMathChanged: false as const,
    }),
  });
}

export function generateCp003FinalNativeReviewCandidate(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze(generateCp003AuthoritativeNativeCandidate(language).map(finalizeRow));
}

export function generateCp003AllFinalNativeReviewCandidates(): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze([
    ...generateCp003FinalNativeReviewCandidate("hi"),
    ...generateCp003FinalNativeReviewCandidate("pa"),
  ]);
}
