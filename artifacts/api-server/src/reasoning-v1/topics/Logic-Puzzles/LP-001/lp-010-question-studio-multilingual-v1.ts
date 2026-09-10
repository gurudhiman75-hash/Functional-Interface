import { LP_010_HI_PA_LOCALIZATION_FREEZE_V6 } from "./lp-010-localization-freeze-v6.ts";

export const LP_010_MULTILINGUAL_QUESTION_STUDIO_V1 = Object.freeze({
  authorityId: "LP_010_MULTILINGUAL_QUESTION_STUDIO_V1" as const,
  sourceLocalizationFreezeAuthorityId: LP_010_HI_PA_LOCALIZATION_FREEZE_V6.authorityId,
  packageId: "LP-010" as const,
  checkpointId: "LP-CP-010" as const,
  permanentQlIds: [...LP_010_HI_PA_LOCALIZATION_FREEZE_V6.permanentQlIds] as const,
  permanentQlCount: LP_010_HI_PA_LOCALIZATION_FREEZE_V6.permanentQlIds.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  supportedLanguages: [...LP_010_HI_PA_LOCALIZATION_FREEZE_V6.supportedLanguages] as const,
  locales: [...LP_010_HI_PA_LOCALIZATION_FREEZE_V6.locales] as const,
  status: "REVIEW_ONLY_MULTILINGUAL_ACTIVE" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationFreezeStatus: LP_010_HI_PA_LOCALIZATION_FREEZE_V6.localizationFreezeStatus,
  questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY" as const,
  invariants: Object.freeze({
    englishSourceRemainsFrozen: true,
    hindiPunjabiSourceRemainsFrozen: true,
    sameSolvedAssignmentsAcrossLanguages: true,
    sameQlAcrossLanguages: true,
    sameDifficultyAcrossLanguages: true,
    sameCorrectOptionIndicesAcrossLanguages: true,
    sameTimePatternAcrossLanguages: true,
    approvedTimeLayoutDiversityPreserved: true,
    progressiveExplanationTables: true,
    sharedQuestionStudioOnly: true,
  }),
});

export type Lp010QuestionStudioLanguage = (typeof LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.supportedLanguages)[number];

export function normalizeLp010QuestionStudioLanguage(value: unknown): Lp010QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "english" || language === "en-in") return "en";
  if (language === "hi" || language === "hindi" || language === "hi-in") return "hi";
  if (language === "pa" || language === "punjabi" || language === "pa-in") return "pa";
  throw new Error(`LP-010 does not support Question Studio language '${language}'. Supported languages are en, hi and pa.`);
}
