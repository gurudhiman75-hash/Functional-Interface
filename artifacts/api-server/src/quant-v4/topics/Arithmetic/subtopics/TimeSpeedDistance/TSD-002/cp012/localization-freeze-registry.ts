import {
  TSD_CP012_NATIVE_HINDI_REVIEW_FINAL,
  TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL,
} from "./native-review-editorial-final";
import { TSD_CP012_NEXT_PERMANENT_QL, TSD_CP012_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP012_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-012" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp012-executable-discovery-v1" as const,
  approvedSourceHead: "59391cc03959b6df82256ff91a160ab50c6c6fc9" as const,
  approvedHindiSourceLayer: "TSD_CP012_NATIVE_HINDI_REVIEW_FINAL" as const,
  approvedPunjabiSourceLayer: "TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL" as const,
  qlRange: "TSD-QL-132..TSD-QL-142" as const,
  qlCount: 11 as const,
  familiesPerLocale: 270 as const,
  multilingualCombinations: 810 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  approvedReviewWorkflowRun: 94 as const,
  approvedReviewWorkflowRunId: 33315106517 as const,
  nextPermanentQl: TSD_CP012_NEXT_PERMANENT_QL,
  nativeLanguageQualityGate: "PASS" as const,
  realismGate: "PASS" as const,
  hindi: "FROZEN" as const,
  punjabi: "FROZEN" as const,
  studioOptionContract: "REVIEWED_NOT_YET_REGISTERED" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP012_FROZEN_HINDI_REVIEW = Object.freeze(
  TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

export const TSD_CP012_FROZEN_PUNJABI_REVIEW = Object.freeze(
  TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

for (const registry of [TSD_CP012_FROZEN_HINDI_REVIEW, TSD_CP012_FROZEN_PUNJABI_REVIEW]) {
  if (new Set(registry.map((question) => question.qlId)).size !== TSD_CP012_PERMANENT_QL_IDS.length) {
    throw new Error("TSD-CP-012 frozen localization no longer spans all permanent QLs");
  }
}
