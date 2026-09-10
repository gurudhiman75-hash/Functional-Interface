import { LP_010_ENGLISH_FREEZE_V1 } from "./lp-010-permanent-freeze.ts";
import { LP_010_HI_PA_LOCALIZATION_REVIEW_V6 } from "./lp-010-localization-v6.ts";

export const LP_010_HI_PA_LOCALIZATION_FREEZE_V6 = Object.freeze({
  authorityId: "LP_010_HI_PA_LOCALIZATION_FREEZE_V6" as const,
  sourceEnglishAuthorityId: LP_010_ENGLISH_FREEZE_V1.authorityId,
  sourceLocalizationAuthorityId: LP_010_HI_PA_LOCALIZATION_REVIEW_V6.authorityId,
  packageId: "LP-010" as const,
  checkpointId: "LP-CP-010" as const,
  permanentQlIds: ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"] as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  status: "HI_PA_HUMAN_REVIEWED_V6_LOCALIZATION_FROZEN" as const,
  approvedOn: "2026-09-10" as const,
  approvalBasis: "EXPLICIT_HUMAN_REVIEW_APPROVAL" as const,
  approvalRecord: "LP-010-HI-PA-LOCALIZATION-APPROVAL-V6" as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET" as const,
  englishFreezeStatus: "FROZEN_V1" as const,
  localizationFreezeStatus: "FROZEN_V6" as const,
  questionStudioLanguageActivation: "ALLOWED_AFTER_INTEGRATION_PROOF" as const,
  invariants: Object.freeze({
    samePermanentQlOwnership: true,
    sameSolvedAssignments: true,
    sameDifficultyBands: true,
    sameCorrectOptionIndices: true,
    sameTimePatternIdentity: true,
    approvedTimeLayoutDiversityPreserved: true,
    progressiveExplanationTables: true,
    nativeHindiPunjabiLearnerCopy: true,
    uniqueLocalizedDisplayNames: true,
    optionByOptionAnalysisForbidden: true,
    sharedQuestionStudioOnly: true,
  }),
});
