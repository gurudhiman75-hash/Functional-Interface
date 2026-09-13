import {
  generateLpCp04LocalizedBatchV2,
  LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2,
} from "./lp-cp04-localization-v2.ts";
import type { LpCp04LocalizedCaselet, LpCp04LocalizedLanguage } from "./lp-cp04-localization-v1.ts";

export const LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3 = Object.freeze({
  authorityId: "LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3" as const,
  parentAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2.authorityId,
  sourceEnglishAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2.sourceEnglishAuthorityId,
  packageId: "LP-CP04-COUNTERFACTUAL" as const,
  checkpointId: "LP-CP-012" as const,
  permanentQlIds: ["LP-QL-047"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  localizationMethod: "SEMANTIC_REBUILD_PLUS_NATIVE_EDITORIAL_POLISH_V3" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V3" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function polishSetupHindi(text: string): string {
  return text.replace(
    /इन छह व्यक्तियों के नाम हैं: ([^।]+)। तीन समूह हैं: ([^।]+)। प्रत्येक व्यक्ति को केवल एक समूह में रखा गया है और प्रत्येक समूह में दो व्यक्ति हैं।/gu,
    "समूह हैं: $2। इनमें शामिल छह व्यक्ति हैं: $1।",
  );
}

function polishSetupPunjabi(text: string): string {
  return text.replace(
    /ਇਨ੍ਹਾਂ ਛੇ ਵਿਅਕਤੀਆਂ ਦੇ ਨਾਮ ਹਨ: ([^।]+)। ਤਿੰਨ ਸਮੂਹ ਹਨ: ([^।]+)। ਹਰ ਵਿਅਕਤੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ ਅਤੇ ਹਰ ਸਮੂਹ ਵਿੱਚ ਦੋ ਵਿਅਕਤੀ ਹਨ।/gu,
    "ਸਮੂਹ ਹਨ: $2। ਇਨ੍ਹਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਛੇ ਵਿਅਕਤੀ ਹਨ: $1।",
  );
}

function polishSetup(language: LpCp04LocalizedLanguage, text: string): string {
  return language === "hi" ? polishSetupHindi(text) : polishSetupPunjabi(text);
}

function polishCaselet(caselet: LpCp04LocalizedCaselet): LpCp04LocalizedCaselet {
  return { ...caselet, scenario: polishSetup(caselet.language, caselet.scenario) };
}

export function generateLpCp04LocalizedBatchV3(
  language: LpCp04LocalizedLanguage,
  seed = "lp-cp04-localization-v3",
  count = 9,
): LpCp04LocalizedCaselet[] {
  return generateLpCp04LocalizedBatchV2(language, seed, count).map(polishCaselet);
}
