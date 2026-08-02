import type {
  NumCp005PermanentQuestion,
  NumCp005PermanentRuntimeInput,
} from "../permanent/runtime";
import type {
  NumCp005Explanation,
  NumCp005Option,
} from "../wave01/types";

export type NumCp005TranslatedLocale = "hi-IN" | "pa-IN";
export type NumCp005TranslatedLanguage = "hi" | "pa";

export interface NumCp005LocalizedRuntimeInput
  extends Omit<NumCp005PermanentRuntimeInput, "language"> {
  readonly locale: NumCp005TranslatedLocale;
}

export interface NumCp005LocalizedOption extends NumCp005Option {
  readonly value: string;
  readonly analysis: string;
}

export interface NumCp005LocalizedExplanation extends NumCp005Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp005LocalizedLifecycle {
  readonly permanentQlId: NumCp005PermanentQuestion["permanentQlId"];
  readonly maturity: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp005LocalizedQuestion
  extends Omit<
    NumCp005PermanentQuestion,
    | "locale"
    | "language"
    | "stem"
    | "options"
    | "canonicalAnswer"
    | "verifierAnswer"
    | "explanation"
    | "reviewStatus"
    | "maturity"
    | "lifecycle"
  > {
  readonly locale: NumCp005TranslatedLocale;
  readonly language: NumCp005TranslatedLanguage;
  readonly stem: string;
  readonly options: readonly NumCp005LocalizedOption[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly explanation: NumCp005LocalizedExplanation;
  readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly maturity: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly lifecycle: NumCp005LocalizedLifecycle;
  readonly localization: Readonly<{
    localizationVersion: "num-cp005-hi-pa-localisation-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalQuestionId: string;
    canonicalAnswer: string;
    canonicalVerifierAnswer: string;
    locale: NumCp005TranslatedLocale;
    language: NumCp005TranslatedLanguage;
    status: "EXECUTABLE_REVIEW_REQUIRED";
    mathematicalStatePreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    lifecycleLocked: true;
  }>;
}
