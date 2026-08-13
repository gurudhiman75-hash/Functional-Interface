import type { NumCp001Explanation, NumCp001Option } from "../wave01/types";
import type { NumCp001PermanentQuestion } from "../permanent/runtime";

export type NumCp001TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp001TranslatedLanguage = "hi" | "pa";

export interface NumCp001LocalizedOption extends NumCp001Option {
  readonly value: string;
}

export interface NumCp001LocalizedExplanation extends NumCp001Explanation {
  readonly coreConcept: readonly string[];
  readonly givenDataAndStrategy: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: readonly string[];
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp001LocalizedQuestion extends Omit<
  NumCp001PermanentQuestion,
  "locale" | "language" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "traceability"
> {
  readonly locale: NumCp001TranslatedLocale;
  readonly language: NumCp001TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp001LocalizedOption[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: NumCp001LocalizedExplanation;
  readonly traceability: Omit<NumCp001PermanentQuestion["traceability"], "language"> & {
    readonly language: NumCp001TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp001-hi-pa-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    canonicalVerifierAnswer: string;
    locale: NumCp001TranslatedLocale;
    language: NumCp001TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    lifecycleLocked: true;
  }>;
}
