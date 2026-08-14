import type { NumCp002PermanentOption, NumCp002PermanentQuestion } from "../permanent/runtime";

export type NumCp002TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp002TranslatedLanguage = "hi" | "pa";

export interface NumCp002LocalizedOption extends NumCp002PermanentOption {
  readonly value: string;
}

export interface NumCp002LocalizedQuestion extends Omit<
  NumCp002PermanentQuestion,
  "locale" | "language" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "allocationStatus" | "reviewStatus" | "maturity" | "lifecycle" | "traceability"
> {
  readonly locale: NumCp002TranslatedLocale;
  readonly language: NumCp002TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp002LocalizedOption[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: Readonly<{
    concept?: string;
    solution: readonly string[];
    finalAnswer: string;
  }>;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly reviewStatus: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly lifecycle: Readonly<{
    permanentQlId: NumCp002PermanentQuestion["permanentQlId"];
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
    reviewStatus: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
  readonly traceability: Omit<NumCp002PermanentQuestion["traceability"], "language"> & {
    readonly language: NumCp002TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp002-hi-pa-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    canonicalVerifierAnswer: string;
    locale: NumCp002TranslatedLocale;
    language: NumCp002TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    lifecycleLocked: true;
  }>;
}
