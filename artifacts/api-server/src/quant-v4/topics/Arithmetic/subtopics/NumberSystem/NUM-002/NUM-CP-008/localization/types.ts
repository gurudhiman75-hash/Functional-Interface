import type { NumCp008PermanentPackage, NumCp008PermanentQlId } from "../permanent-runtime.ts";

export type NumCp008LocalizedLanguage = "hi" | "pa";
export type NumCp008LocalizedLocale = "hi-IN" | "pa-IN";

export type NumCp008LocalizedOption = Readonly<{
  value: string;
  isCorrect: boolean;
  misconceptionId: string;
}>;

export type NumCp008LocalizedPackage = Omit<
  NumCp008PermanentPackage,
  "locale" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "lifecycle"
> & Readonly<{
  locale: NumCp008LocalizedLocale;
  language: NumCp008LocalizedLanguage;
  stem: string;
  options: readonly NumCp008LocalizedOption[];
  canonicalAnswer: string;
  verifierAnswer: string;
  explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  localization: Readonly<{
    version: "num-cp008-hi-pa-rule-first-v1";
    canonicalLocale: "en-IN";
    canonicalQuestionId: NumCp008PermanentQlId;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    englishAuthorityFrozen: true;
    lifecycleLocked: true;
  }>;
  lifecycle: Readonly<{
    permanentQlId: NumCp008PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE";
    englishAuthorityStatus: "ENGLISH_FROZEN";
    localizationStatus: "HI_PA_REVIEW_CANDIDATE";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}>;
