import {
  TSD_CP011_RELEASE_HINDI_REVIEW,
  TSD_CP011_RELEASE_PUNJABI_REVIEW,
} from "./native-review-release";
import { TSD_CP011_NEXT_PERMANENT_QL, TSD_CP011_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP011_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-011" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp011-executable-discovery-v1" as const,
  approvedSourceHead: "f50cc416007985ab139dd0d1b28a80003c1619b0" as const,
  approvedHindiSourceLayer: "TSD_CP011_RELEASE_HINDI_REVIEW" as const,
  approvedPunjabiSourceLayer: "TSD_CP011_RELEASE_PUNJABI_REVIEW" as const,
  qlRange: "TSD-QL-125..TSD-QL-131" as const,
  qlCount: 7 as const,
  familiesPerLocale: 168 as const,
  multilingualCombinations: 504 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  approvedReviewWorkflowRun: 66 as const,
  approvedReviewWorkflowRunId: 33314810827 as const,
  approvedReviewArtifactId: 9733100290 as const,
  approvedReviewArtifactDigest: "sha256:c628071d10c9227bb749ed05786c0dd4d6b90bbf6f214b39c32bdf83d7962c3a" as const,
  nextPermanentQl: TSD_CP011_NEXT_PERMANENT_QL,
  nativeLanguageQualityGate: "PASS" as const,
  realismGate: "PASS" as const,
  ratioPresentation: "STANDARD_A_COLON_B" as const,
  hindi: "FROZEN" as const,
  punjabi: "FROZEN" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP011_FROZEN_HINDI_REVIEW = Object.freeze(
  TSD_CP011_RELEASE_HINDI_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

export const TSD_CP011_FROZEN_PUNJABI_REVIEW = Object.freeze(
  TSD_CP011_RELEASE_PUNJABI_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

for (const registry of [TSD_CP011_FROZEN_HINDI_REVIEW, TSD_CP011_FROZEN_PUNJABI_REVIEW]) {
  if (new Set(registry.map((question) => question.qlId)).size !== TSD_CP011_PERMANENT_QL_IDS.length) {
    throw new Error("TSD-CP-011 frozen localization no longer spans all permanent QLs");
  }
}
