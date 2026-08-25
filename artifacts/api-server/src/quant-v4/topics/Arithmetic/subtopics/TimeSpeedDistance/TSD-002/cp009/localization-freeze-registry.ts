import {
  TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION,
  TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION,
} from "./localization-native-final";

export const TSD_CP009_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-009" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-25" as const,
  approvalInstruction: "approved" as const,
  approvedSourceBranch: "feat/tsd-cp009-executable-discovery-v1" as const,
  approvedSourceHead: "57aef99dbf3e29c97fa2f22d287a82487e054adb" as const,
  approvedHindiSourceLayer: "TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION" as const,
  approvedPunjabiSourceLayer: "TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION" as const,
  qlRange: "TSD-QL-104..TSD-QL-114" as const,
  qlCount: 11 as const,
  familiesPerLocale: 66 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  ambiguityGuardedQls: Object.freeze(["TSD-QL-109", "TSD-QL-110", "TSD-QL-111", "TSD-QL-113", "TSD-QL-114"] as const),
  nativeLanguageQualityGate: "PASS" as const,
  realismGate: "PASS" as const,
  approvedReviewWorkflowRun: 90 as const,
  approvedReviewWorkflowRunId: 32750574632 as const,
  approvedReviewArtifactId: 9528838561 as const,
  approvedReviewArtifactDigest: "sha256:5907238efddcc0ac7bb73b27e00728ca4ee8fcb3c6187678a1ec0ade06ef6e02" as const,
  hindi: "FROZEN" as const,
  punjabi: "FROZEN" as const,
  questionStudio: "READY_FOR_REVIEW_ONLY_INTEGRATION" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP009_FROZEN_HINDI_LOCALIZATION = TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION;
export const TSD_CP009_FROZEN_PUNJABI_LOCALIZATION = TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION;
