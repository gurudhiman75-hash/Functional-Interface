import { LP_009_HI_PA_LOCALIZATION_FREEZE_V3 } from "./lp-009-localization-freeze-v3.ts";

export const LP_009_MULTILINGUAL_QUESTION_STUDIO_V1 = Object.freeze({
  authorityId: "LP_009_MULTILINGUAL_QUESTION_STUDIO_V1" as const,
  sourceLocalizationFreezeAuthorityId: LP_009_HI_PA_LOCALIZATION_FREEZE_V3.authorityId,
  packageId: "LP-009" as const,
  checkpointId: "LP-CP-009" as const,
  permanentQlIds: [...LP_009_HI_PA_LOCALIZATION_FREEZE_V3.permanentQlIds] as const,
  permanentQlCount: LP_009_HI_PA_LOCALIZATION_FREEZE_V3.permanentQlIds.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  supportedLanguages: [...LP_009_HI_PA_LOCALIZATION_FREEZE_V3.supportedLanguages] as const,
  locales: [...LP_009_HI_PA_LOCALIZATION_FREEZE_V3.locales] as const,
  status: "REVIEW_ONLY_MULTILINGUAL_ACTIVE" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationFreezeStatus: LP_009_HI_PA_LOCALIZATION_FREEZE_V3.localizationFreezeStatus,
  questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  invariants: Object.freeze({
    onlyLp009Multilingual: true,
    englishSourceRemainsFrozen: true,
    hindiPunjabiSourceRemainsFrozen: true,
    sameSolvedAssignmentsAcrossLanguages: true,
    sameQlAcrossLanguages: true,
    sameCorrectOptionIndicesAcrossLanguages: true,
    progressiveExplanationTables: true,
    questionBankLocked: true,
    testAndMockLocked: true,
    publicationLocked: true,
  }),
});

export type Lp009QuestionStudioLanguage = (typeof LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages)[number];

export function normalizeLp009QuestionStudioLanguage(value: unknown): Lp009QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "english" || language === "en-in") return "en";
  if (language === "hi" || language === "hindi" || language === "hi-in") return "hi";
  if (language === "pa" || language === "punjabi" || language === "pa-in") return "pa";
  throw new Error(`LP-009 does not support Question Studio language '${language}'. Supported languages are en, hi and pa.`);
}
