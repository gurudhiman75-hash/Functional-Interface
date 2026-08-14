import type { Cp004Explanation, Cp004Option, IntCp004QlId } from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";

export type IntCp004V6Locale = "hi-IN" | "pa-IN";
export type IntCp004V6Language = "hi" | "pa";

export interface IntCp004V6LocalizedOption extends Omit<Cp004Option, "text" | "feedback"> {
  readonly text: string;
  readonly feedback: "";
}

export interface IntCp004V6LocalizedExplanation extends Cp004Explanation {
  readonly whatAsked: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly commonMistake: string;
}

export interface IntCp004V6LocalizedLifecycle {
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

export interface IntCp004V6LocalizedQuestion extends Omit<
  IntCp004EnglishFrozenV2Question,
  "stem" | "options" | "correctAnswer" | "explanation" | "editorialStatus" | "approvalStatus" | "allocationStatus" | "lifecycle"
> {
  readonly locale: IntCp004V6Locale;
  readonly language: IntCp004V6Language;
  readonly stem: string;
  readonly options: readonly IntCp004V6LocalizedOption[];
  readonly correctAnswer: string;
  readonly explanation: IntCp004V6LocalizedExplanation;
  readonly editorialStatus: "MULTILINGUAL_LOCALISATION_REVIEW";
  readonly approvalStatus: "LOCALIZED_REVIEW_REQUIRED";
  readonly allocationStatus: "INACTIVE_LOCALISATION_REVIEW";
  readonly lifecycle: IntCp004V6LocalizedLifecycle;
  readonly localization: Readonly<{
    version: "INT-CP-004-HI-PA-V6-MIGRATION-v1";
    canonicalFreezeId: "INT-CP-004-EN-v2-frozen";
    canonicalQlId: IntCp004QlId;
    canonicalSeed: string;
    locale: IntCp004V6Locale;
    mathematicalStatePreserved: true;
    solutionPreserved: true;
    optionValuesPreserved: true;
    optionOrderPreserved: true;
    correctIndexPreserved: true;
    misconceptionIdsPreserved: true;
    representationPreserved: true;
    stemFamilyPreserved: true;
    formulaFirst: true;
    lifecycleLocked: true;
  }>;
}
