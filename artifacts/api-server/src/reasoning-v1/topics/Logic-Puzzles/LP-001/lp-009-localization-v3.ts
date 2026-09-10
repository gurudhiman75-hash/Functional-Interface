import type { Lp009LocalizedCaselet, Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";
import { generateLp009LocalizedBatchV2, LP_009_HI_PA_LOCALIZATION_REVIEW_V2 } from "./lp-009-localization-v2.ts";

export const LP_009_HI_PA_LOCALIZATION_REVIEW_V3 = Object.freeze({
  ...LP_009_HI_PA_LOCALIZATION_REVIEW_V2,
  authorityId: "LP_009_HI_PA_LOCALIZATION_REVIEW_V3" as const,
  supersedes: LP_009_HI_PA_LOCALIZATION_REVIEW_V2.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V3" as const,
  editorialFocus: "NATIVE_EXAM_WORDING_AND_YEAR_SUMMARY_INFLECTION_CLOSEOUT" as const,
});

function yearSummary(language: Lp009LocalizedLanguage, profileId: string): string {
  if (language === "hi") {
    if (profileId === "BIRTH_YEAR_REGISTER") return "शर्तों से सभी व्यक्तियों के जन्म-वर्ष तय हो जाते हैं।";
    if (profileId === "SERVICE_BIRTH_YEARS") return "शर्तों से सभी अधिकारियों के जन्म-वर्ष तय हो जाते हैं।";
    if (profileId === "ARCHIVE_BIRTH_YEARS") return "शर्तों से सभी शोधकर्ताओं के जन्म-वर्ष तय हो जाते हैं।";
    if (profileId === "CLUB_BIRTH_YEARS") return "शर्तों से सभी सदस्यों के जन्म-वर्ष तय हो जाते हैं।";
  } else {
    if (profileId === "BIRTH_YEAR_REGISTER") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਵਿਅਕਤੀਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
    if (profileId === "SERVICE_BIRTH_YEARS") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਅਧਿਕਾਰੀਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
    if (profileId === "ARCHIVE_BIRTH_YEARS") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਖੋਜਕਰਤਿਆਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
    if (profileId === "CLUB_BIRTH_YEARS") return "ਸ਼ਰਤਾਂ ਤੋਂ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦੇ ਜਨਮ ਸਾਲ ਨਿਸ਼ਚਿਤ ਹੋ ਜਾਂਦੇ ਹਨ।";
  }
  throw new Error(`Unexpected LP-009 year profile: ${profileId}`);
}

function polishYearSummary(language: Lp009LocalizedLanguage, caselet: Lp009LocalizedCaselet): Lp009LocalizedCaselet {
  if (caselet.mode !== "YEAR") return caselet;
  const summary = yearSummary(language, caselet.scenarioProfileId);
  return {
    ...caselet,
    children: caselet.children.map((child) => ({
      ...child,
      explanation: { ...child.explanation, summary },
    })),
  };
}

export function generateLp009LocalizedBatchV3(language: Lp009LocalizedLanguage, seed = "lp-009-localization-review-v3", count = 8): Lp009LocalizedCaselet[] {
  return generateLp009LocalizedBatchV2(language, seed, count).map((caselet) => polishYearSummary(language, caselet));
}
