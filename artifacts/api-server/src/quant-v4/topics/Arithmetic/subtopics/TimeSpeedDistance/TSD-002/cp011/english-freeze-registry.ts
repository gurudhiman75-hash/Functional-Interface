import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_NEXT_PERMANENT_QL, TSD_CP011_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP011_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-011" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp011-executable-discovery-v1" as const,
  approvedSourceHead: "f50cc416007985ab139dd0d1b28a80003c1619b0" as const,
  approvedSourceLayer: "TSD_CP011_ENGLISH_REVIEW" as const,
  approvedQlRange: "TSD-QL-125..TSD-QL-131" as const,
  approvedQlCount: 7 as const,
  approvedQuestionFamilies: 168 as const,
  approvedCombinationsPerLocale: 168 as const,
  approvedMultilingualCombinations: 504 as const,
  approvedReviewWorkflowRun: 66 as const,
  approvedReviewWorkflowRunId: 33314810827 as const,
  approvedReviewArtifactId: 9733100290 as const,
  approvedReviewArtifactDigest: "sha256:c628071d10c9227bb749ed05786c0dd4d6b90bbf6f214b39c32bdf83d7962c3a" as const,
  nextPermanentQl: TSD_CP011_NEXT_PERMANENT_QL,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "FROZEN_WITH_SEPARATE_REGISTRY" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP011_FROZEN_ENGLISH_REVIEW = Object.freeze(
  TSD_CP011_ENGLISH_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

if (new Set(TSD_CP011_FROZEN_ENGLISH_REVIEW.map((question) => question.qlId)).size !== TSD_CP011_PERMANENT_QL_IDS.length) {
  throw new Error("TSD-CP-011 frozen English review no longer spans all permanent QLs");
}
