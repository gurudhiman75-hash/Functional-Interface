import type { NumCp007Explanation, NumCp007Option } from "../wave01/types.ts";
import type { NumCp007PermanentQuestion } from "../permanent/runtime.ts";

export type NumCp007TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp007TranslatedLanguage = "hi" | "pa";

export interface NumCp007LocalizedOption extends NumCp007Option {
  readonly value: string;
}

export interface NumCp007LocalizedExplanation extends NumCp007Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp007LocalizedQuestion extends Omit<
  NumCp007PermanentQuestion,
  "locale" | "language" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "traceability"
> {
  readonly locale: NumCp007TranslatedLocale;
  readonly language: NumCp007TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp007LocalizedOption[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: NumCp007LocalizedExplanation;
  readonly traceability: Omit<NumCp007PermanentQuestion["traceability"], "language"> & {
    readonly language: NumCp007TranslatedLanguage;
  };
  readonly localization: Readonly<{
    localizationVersion: "num-cp007-hi-pa-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    canonicalVerifierAnswer: string;
    locale: NumCp007TranslatedLocale;
    language: NumCp007TranslatedLanguage;
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionMappingPreserved: true;
    lifecycleLocked: true;
  }>;
}
