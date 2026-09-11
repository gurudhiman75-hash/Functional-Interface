import {
  LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4,
  LP_001_008_PACKAGE_QL_IDS,
  type Lp001008FrozenPackageId,
} from "./lp-001-008-localization-freeze-v4.ts";

export const LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1 = Object.freeze({
  authorityId: "LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1" as const,
  sourceLocalizationFreezeAuthorityId: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.authorityId,
  packages: Object.freeze(Object.entries(LP_001_008_PACKAGE_QL_IDS).map(([packageId, permanentQlIds]) => Object.freeze({
    packageId: packageId as Lp001008FrozenPackageId,
    permanentQlIds,
    permanentQlCount: permanentQlIds.length,
    permanentQlAllocationStatus: "ALLOCATED" as const,
  }))),
  packageQlIds: LP_001_008_PACKAGE_QL_IDS,
  permanentQlIds: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.permanentQlIds,
  permanentQlCount: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.permanentQlCount,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  supportedLanguages: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.supportedLanguages,
  locales: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.locales,
  status: "REVIEW_ONLY_MULTILINGUAL_ACTIVE" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationFreezeStatus: LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4.localizationFreezeStatus,
  questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  invariants: Object.freeze({
    approvedEnglishV42Only: true,
    approvedLocalizationV4Only: true,
    englishSourceRemainsFrozen: true,
    hindiPunjabiSourceRemainsFrozen: true,
    sameSolvedAssignmentsAcrossLanguages: true,
    sameQlAcrossLanguages: true,
    sameDifficultyAcrossLanguages: true,
    sameCorrectOptionIndicesAcrossLanguages: true,
    completeStandaloneQuestionText: true,
    progressiveExplanationTables: true,
    sharedQuestionStudioOnly: true,
    questionBankLocked: true,
    testAndMockLocked: true,
    publicationLocked: true,
  }),
});

export type Lp001008QuestionStudioLanguage = (typeof LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages)[number];

export function normalizeLp001008QuestionStudioLanguage(value: unknown): Lp001008QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "english" || language === "en-in") return "en";
  if (language === "hi" || language === "hindi" || language === "hi-in") return "hi";
  if (language === "pa" || language === "punjabi" || language === "pa-in") return "pa";
  throw new Error(`LP-001 through LP-008 do not support Question Studio language '${language}'. Supported languages are en, hi and pa.`);
}
