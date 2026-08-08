import type { NumCp006PermanentQuestion, NumCp006Option, NumCp006Explanation } from "../permanent/types";

export type NumCp006TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp006TranslatedLanguage = "hi" | "pa";

export interface NumCp006LocalizedOption extends NumCp006Option {
  readonly value: string;
  readonly analysis: string;
}

export interface NumCp006LocalizedExplanation extends NumCp006Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp006LocalizedQuestion extends Omit<
  NumCp006PermanentQuestion,
  "locale" | "language" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "traceability"
> {
  readonly locale: NumCp006TranslatedLocale;
  readonly language: NumCp006TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp006LocalizedOption[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: NumCp006LocalizedExplanation;
  readonly traceability: Omit<NumCp006PermanentQuestion["traceability"], "language"> & {
    readonly language: NumCp006TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp006-hi-pa-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    canonicalVerifierAnswer: string;
    locale: NumCp006TranslatedLocale;
    language: NumCp006TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    lifecycleLocked: true;
  }>;
}
