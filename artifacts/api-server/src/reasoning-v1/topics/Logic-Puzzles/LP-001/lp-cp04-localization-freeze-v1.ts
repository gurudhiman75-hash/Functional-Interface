import { LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3 } from "./lp-cp04-localization-v3.ts";

export const LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1 = Object.freeze({
  authorityId: "LP_CP04_HI_PA_LOCALIZATION_FREEZE_V1" as const,
  parentAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3.authorityId,
  sourceEnglishAuthorityId: LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3.sourceEnglishAuthorityId,
  packageId: "LP-CP04-COUNTERFACTUAL" as const,
  checkpointId: "LP-CP-012" as const,
  permanentQlIds: Object.freeze(["LP-QL-047"] as const),
  supportedLanguages: Object.freeze(["hi", "pa"] as const),
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  localizationFreezeStatus: "FROZEN_V1" as const,
  semanticParityStatus: "PROVED" as const,
  nativeEditorialStatus: "APPROVED_V3" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  sourceSaturatedForTargetExams: false as const,
  productionEligible: false as const,
});
