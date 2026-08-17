import type { NumCp003EditorialV2Question } from "../permanent/editorial-v2-final";

export type NumCp003TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp003TranslatedLanguage = "hi" | "pa";

export type NumCp003LocalizedQuestion = Omit<
  NumCp003EditorialV2Question,
  | "language"
  | "stem"
  | "options"
  | "answer"
  | "canonicalAnswer"
  | "explanation"
  | "reviewStatus"
  | "maturity"
  | "allocationStatus"
  | "traceability"
> & {
  readonly locale: NumCp003TranslatedLocale;
  readonly language: NumCp003TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly string[];
  readonly answer: string;
  readonly canonicalAnswer: string;
  readonly explanation: Readonly<{
    concept: string;
    solution: readonly string[];
    finalAnswer: string;
  }>;
  readonly reviewStatus: "MULTILINGUAL_CONTROLLED_REVIEW";
  readonly maturity: "MULTILINGUAL_EDITORIAL_REVIEW";
  readonly allocationStatus: "MULTILINGUAL_CONTROLLED_REVIEW";
  readonly traceability: Omit<NumCp003EditorialV2Question["traceability"], "language"> & {
    readonly language: NumCp003TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp003-hi-pa-rule-first-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    locale: NumCp003TranslatedLocale;
    language: NumCp003TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    ruleFirstTeachingPreserved: true;
    lifecycleLocked: true;
  }>;
};
