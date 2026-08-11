import type {
  Cp004Explanation,
  Cp004Option,
  IntCp004QlId,
  Rational,
} from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";

export type IntCp004LocalizedLocale = "hi-IN" | "pa-IN";
export type IntCp004LocalizedLanguage = "hi" | "pa";

export interface IntCp004LocalizedRuntimeInput {
  readonly qlId: IntCp004QlId;
  readonly seed: string;
  readonly locale: IntCp004LocalizedLocale;
}

export interface IntCp004LocalizedOption extends Omit<Cp004Option, "text" | "feedback"> {
  readonly value: Rational;
  readonly text: string;
  readonly feedback: string;
}

export interface IntCp004LocalizedExplanation extends Omit<Cp004Explanation, "whatAsked" | "steps" | "finalAnswer" | "commonMistake"> {
  readonly whatAsked: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly commonMistake: string;
}

export interface IntCp004LocalizedLifecycle {
  readonly permanentQlId: IntCp004QlId;
  readonly maturity: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export interface IntCp004LocalizedQuestion
  extends Omit<
    IntCp004EnglishFrozenQuestion,
    | "stem"
    | "options"
    | "correctAnswer"
    | "explanation"
    | "editorialStatus"
    | "approvalStatus"
    | "allocationStatus"
    | "lifecycle"
  > {
  readonly locale: IntCp004LocalizedLocale;
  readonly language: IntCp004LocalizedLanguage;
  readonly stem: string;
  readonly options: readonly IntCp004LocalizedOption[];
  readonly correctAnswer: string;
  readonly explanation: IntCp004LocalizedExplanation;
  readonly editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly approvalStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly allocationStatus: "INACTIVE_LOCALISATION_REVIEW";
  readonly lifecycle: IntCp004LocalizedLifecycle;
  readonly localization: Readonly<{
    localizationVersion: "INT-CP-004-HI-PA-LOCALISATION-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalFreezeId: IntCp004EnglishFrozenQuestion["freezeId"];
    canonicalSeed: string;
    canonicalQlId: IntCp004QlId;
    locale: IntCp004LocalizedLocale;
    language: IntCp004LocalizedLanguage;
    status: "EXECUTABLE_REVIEW_REQUIRED";
    mathematicalStatePreserved: true;
    solutionPreserved: true;
    optionValuesPreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionIdsPreserved: true;
    representationPreserved: true;
    stemFamilyPreserved: true;
    explanationStructurePreserved: true;
    lifecycleLocked: true;
  }>;
}
