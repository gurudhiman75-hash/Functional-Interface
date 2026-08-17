export const SAP_LOCALIZED_LANGUAGES = ["en", "hi", "pa"] as const;
export type SapLocalizedLanguage = typeof SAP_LOCALIZED_LANGUAGES[number];
export type SapTranslationLanguage = Exclude<SapLocalizedLanguage, "en">;

export const SAP_LOCALIZATION_VERSION = "SAP-HI-PA-EDITORIAL-V1" as const;

export const SAP_LOCALIZATION_LIFECYCLE = Object.freeze({
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  status: "LOCALIZATION_REVIEW_CANDIDATE" as const,
});

export interface SapLocalizationValidation {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly language: SapTranslationLanguage;
  readonly scriptPresent: boolean;
  readonly optionOrderPreserved: boolean;
  readonly correctIndexPreserved: boolean;
  readonly answerBindingPreserved: boolean;
  readonly mathematicalStatePreserved: boolean;
}
