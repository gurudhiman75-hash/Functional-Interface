import type { NumCp010PermanentPackage } from "../permanent-runtime.ts";
import type { NumCp010PermanentQlId } from "../permanent-allocation.ts";

export type NumCp010LocalizedLanguage = "hi" | "pa";
export type NumCp010LocalizedLocale = "hi-IN" | "pa-IN";

export type NumCp010LocalizedOption = Readonly<{
  value: string;
  isCorrect: boolean;
  misconceptionId: string;
}>;

export type NumCp010LocalizedPackage = Omit<
  NumCp010PermanentPackage,
  "locale" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "lifecycle"
> & Readonly<{
  locale: NumCp010LocalizedLocale;
  language: NumCp010LocalizedLanguage;
  stem: string;
  options: readonly NumCp010LocalizedOption[];
  canonicalAnswer: string;
  verifierAnswer: string;
  explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  localization: Readonly<{
    version: "num-cp010-hi-pa-review-v1";
    canonicalLocale: "en-IN";
    canonicalQuestionId: NumCp010PermanentQlId;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    answerMeaningPreserved: true;
    englishAuthorityFrozen: true;
    lifecycleLocked: true;
  }>;
  lifecycle: Readonly<{
    permanentQlId: NumCp010PermanentQlId;
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
