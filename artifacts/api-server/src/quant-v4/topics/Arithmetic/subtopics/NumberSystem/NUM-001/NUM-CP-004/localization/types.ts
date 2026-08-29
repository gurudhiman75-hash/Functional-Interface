import type { NumCp004EditorialV2Question } from "../permanent/editorial-v2";
import type { NumCp004Option } from "../completion/types";

export type NumCp004TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp004TranslatedLanguage = "hi" | "pa";

export type NumCp004LocalizedOption = NumCp004Option;

export type NumCp004LocalizedQuestion = Omit<
  NumCp004EditorialV2Question,
  | "language"
  | "locale"
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
  readonly locale: NumCp004TranslatedLocale;
  readonly language: NumCp004TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp004LocalizedOption[];
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
  readonly traceability: Omit<NumCp004EditorialV2Question["traceability"], "language"> & {
    readonly language: NumCp004TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp004-hi-pa-rule-first-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    locale: NumCp004TranslatedLocale;
    language: NumCp004TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    ruleFirstTeachingPreserved: true;
    lifecycleLocked: true;
  }>;
};
