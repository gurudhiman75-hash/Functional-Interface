import type { NumCp009PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp009PermanentQlId } from "../permanent-allocation.ts";

export type NumCp009LocalizedLanguage = "hi" | "pa";
export type NumCp009LocalizedLocale = "hi-IN" | "pa-IN";

export type NumCp009LocalizedPackage = Omit<
  NumCp009PermanentPackage,
  "locale" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "lifecycle"
> & Readonly<{
  locale: NumCp009LocalizedLocale;
  language: NumCp009LocalizedLanguage;
  stem: string;
  options: NumCp009PermanentPackage["options"];
  canonicalAnswer: string;
  verifierAnswer: string;
  explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  localization: Readonly<{
    version: "num-cp009-hi-pa-human-v1";
    canonicalLocale: "en-IN";
    canonicalQuestionId: NumCp009PermanentQlId;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    answerKeyPreserved: true;
    englishAuthorityFrozen: true;
    lifecycleLocked: true;
  }>;
  lifecycle: Readonly<{
    permanentQlId: NumCp009PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE" | "MULTILINGUAL_FROZEN";
    englishAuthorityStatus: "ENGLISH_FROZEN";
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" | "HI_PA_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}>;
