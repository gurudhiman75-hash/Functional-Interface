import type { IntCp003QlId, Rational } from "./cp003-exam-model";
import type {
  Cp003ExplanationLayer,
  Cp003Option,
  Cp003PresentationTable,
  Cp003StudentExplanation,
  IntCp003ExamQuestion,
} from "./cp003-exam-types";
import type { IntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";

export type IntCp003LocalizedLocale = "hi-IN" | "pa-IN";
export type IntCp003LocalizedLanguage = "hi" | "pa";

export interface IntCp003LocalizedRuntimeInput {
  readonly qlId: IntCp003QlId;
  readonly seed: string;
  readonly locale: IntCp003LocalizedLocale;
}

export interface IntCp003LocalizedPresentationTable extends Cp003PresentationTable {
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface IntCp003LocalizedPresentation
  extends Omit<IntCp003ExamQuestion["presentation"], "leadText" | "table" | "prompt" | "markdown"> {
  readonly leadText?: string;
  readonly table?: IntCp003LocalizedPresentationTable;
  readonly prompt: string;
  readonly markdown: string;
}

export interface IntCp003LocalizedOption extends Omit<Cp003Option, "text" | "calculation" | "studentFeedback"> {
  readonly text: string;
  readonly value: Rational;
  readonly calculation: string;
  readonly studentFeedback: string;
}

export interface IntCp003LocalizedExplanationLayer extends Cp003ExplanationLayer {
  readonly steps: readonly string[];
}

export interface IntCp003LocalizedExplanation
  extends Omit<
    Cp003StudentExplanation,
    "keyIdea" | "steps" | "finalAnswer" | "shortcut" | "commonMistake" | "verification" | "depths"
  > {
  readonly keyIdea: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly shortcut?: Readonly<{
    title: string;
    steps: readonly string[];
    sourceStepIds: readonly string[];
  }>;
  readonly commonMistake?: string;
  readonly verification?: Readonly<{
    method: string;
    steps: readonly string[];
    sourceStepIds: readonly string[];
  }>;
  readonly depths: Readonly<{
    exam: IntCp003LocalizedExplanationLayer;
    student: IntCp003LocalizedExplanationLayer;
    foundation: IntCp003LocalizedExplanationLayer;
  }>;
}

export interface IntCp003LocalizedLifecycle {
  readonly permanentQlId: IntCp003QlId;
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

export interface IntCp003LocalizedQuestion
  extends Omit<
    IntCp003EnglishFrozenQuestion,
    | "presentation"
    | "options"
    | "correctAnswer"
    | "explanation"
    | "editorialStatus"
    | "approvalStatus"
    | "allocationStatus"
    | "lifecycle"
  > {
  readonly locale: IntCp003LocalizedLocale;
  readonly language: IntCp003LocalizedLanguage;
  readonly presentation: IntCp003LocalizedPresentation;
  readonly options: readonly IntCp003LocalizedOption[];
  readonly correctAnswer: string;
  readonly explanation: IntCp003LocalizedExplanation;
  readonly editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly approvalStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly allocationStatus: "INACTIVE_LOCALISATION_REVIEW";
  readonly lifecycle: IntCp003LocalizedLifecycle;
  readonly localization: Readonly<{
    localizationVersion: "INT-CP-003-HI-PA-LOCALISATION-v1";
    canonicalLocale: "en-IN";
    canonicalLanguage: "en";
    canonicalFreezeId: IntCp003EnglishFrozenQuestion["freezeId"];
    canonicalSeed: string;
    canonicalQlId: IntCp003QlId;
    locale: IntCp003LocalizedLocale;
    language: IntCp003LocalizedLanguage;
    status: "EXECUTABLE_REVIEW_REQUIRED";
    mathematicalStatePreserved: true;
    solutionPreserved: true;
    optionValuesPreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    sourceStepIdsPreserved: true;
    lifecycleLocked: true;
  }>;
}
