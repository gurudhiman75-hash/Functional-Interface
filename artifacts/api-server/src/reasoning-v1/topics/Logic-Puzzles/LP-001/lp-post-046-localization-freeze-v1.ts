import { LP_011_HI_PA_LOCALIZATION_REVIEW_V1 } from "./lp-011-localization-v1.ts";
import { LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1 } from "./lp-006-projection-localization-v1.ts";

export const LP_011_HI_PA_LOCALIZATION_FREEZE_V1 = Object.freeze({
  authorityId: "LP_011_HI_PA_LOCALIZATION_FREEZE_V1" as const,
  sourceReviewAuthorityId: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  sourceEnglishAuthorityId: LP_011_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId,
  packageId: "LP-011" as const,
  permanentQlIds: ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  localizationFreezeStatus: "FROZEN" as const,
  approvalBasis: "PRODUCT_OWNER_APPROVED_AND_SEMANTIC_PARITY_GREEN" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  freezeGuardScope: Object.freeze([
    "HIDDEN_STATE_PARITY",
    "CLUE_SEMANTICS",
    "PERMANENT_QL_IDS",
    "DIFFICULTY",
    "CORRECT_OPTION_INDEX",
    "NATIVE_HI_PA_SURFACE",
    "LOCALIZED_FINAL_TABLE",
  ] as const),
});

export const LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1 = Object.freeze({
  authorityId: "LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1" as const,
  sourceReviewAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  sourceEnglishAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId,
  baseLocalizationAuthorityId: LP_006_PROJECTION_HI_PA_LOCALIZATION_REVIEW_V1.baseLocalizationAuthorityId,
  packageId: "LP-006" as const,
  extensionId: "LP-006-PROJECTION" as const,
  permanentQlIds: ["LP-QL-045", "LP-QL-046"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  localizationFreezeStatus: "FROZEN" as const,
  approvalBasis: "PRODUCT_OWNER_APPROVED_AND_SEMANTIC_PARITY_GREEN" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  freezeGuardScope: Object.freeze([
    "HIDDEN_STATE_PARITY",
    "CLUE_SEMANTICS",
    "PERMANENT_QL_IDS",
    "PROJECTION_PROOF",
    "STATEMENT_TRUTH_VECTOR",
    "CORRECT_OPTION_INDEX",
    "NATIVE_HI_PA_SURFACE",
  ] as const),
});

export const LP_POST_046_LOCALIZATION_FREEZE_V1 = Object.freeze({
  authorityId: "LP_POST_046_LOCALIZATION_FREEZE_V1" as const,
  frozenAuthorities: Object.freeze([
    LP_011_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
    LP_006_PROJECTION_HI_PA_LOCALIZATION_FREEZE_V1.authorityId,
  ]),
  permanentQlRange: Object.freeze(["LP-QL-041", "LP-QL-046"] as const),
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  runtimeMode: "REVIEW_ONLY" as const,
  productionEligible: false as const,
});
