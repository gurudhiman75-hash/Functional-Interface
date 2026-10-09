import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW } from "./exam-paper-review-final-v3-all";
import { TSD_CP010_NEXT_PERMANENT_QL, TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP010_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-010" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp010-executable-discovery-v1" as const,
  approvedSourceHead: "78768014443ca76e606f063b73ead667af86d375" as const,
  approvedSourceLayer: "TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW" as const,
  approvedQlRange: "TSD-QL-115..TSD-QL-124" as const,
  approvedQlCount: 10 as const,
  approvedQuestionFamilies: 60 as const,
  approvedCompatibleCombinationsPerLocale: 471 as const,
  approvedMultilingualCombinations: 1413 as const,
  approvedReviewWorkflowRun: 193 as const,
  approvedReviewWorkflowRunId: 33099009244 as const,
  approvedReviewArtifactId: 9657610728 as const,
  approvedReviewArtifactDigest: "sha256:b930ef54bfd1a10ba6e93cbc6ad825df6734675d3a82ab62f87b706a9b68ce5b" as const,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE" as const,
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE" as const,
  nextPermanentQl: TSD_CP010_NEXT_PERMANENT_QL,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "FROZEN_WITH_SEPARATE_REGISTRY" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP010_FROZEN_ENGLISH_REVIEW = Object.freeze(
  TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

if (new Set(TSD_CP010_FROZEN_ENGLISH_REVIEW.map((question) => question.qlId)).size !== TSD_CP010_PERMANENT_QL_IDS.length) {
  throw new Error("TSD-CP-010 frozen English review no longer spans all permanent QLs");
}
