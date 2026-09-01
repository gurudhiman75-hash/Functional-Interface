import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NEXT_PERMANENT_QL, TSD_CP012_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP012_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-012" as const,
  status: "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp012-executable-discovery-v1" as const,
  approvedSourceHead: "59391cc03959b6df82256ff91a160ab50c6c6fc9" as const,
  approvedSourceLayer: "TSD_CP012_ENGLISH_REVIEW_FINAL" as const,
  approvedQlRange: "TSD-QL-132..TSD-QL-142" as const,
  approvedQlCount: 11 as const,
  approvedQuestionFamilies: 270 as const,
  approvedCombinationsPerLocale: 270 as const,
  approvedMultilingualCombinations: 810 as const,
  approvedDifficultyDistributionPerLocale: Object.freeze({ EASY: 22, MEDIUM: 248, HARD: 0 } as const),
  approvedReviewWorkflowRun: 94 as const,
  approvedReviewWorkflowRunId: 33315106517 as const,
  nextPermanentQl: TSD_CP012_NEXT_PERMANENT_QL,
  englishFreezeStatus: "FROZEN" as const,
  localizationStatus: "FROZEN_WITH_SEPARATE_REGISTRY" as const,
  studioOptionContract: "REVIEWED_NOT_YET_REGISTERED" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP012_FROZEN_ENGLISH_REVIEW = Object.freeze(
  TSD_CP012_ENGLISH_REVIEW_FINAL.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

if (new Set(TSD_CP012_FROZEN_ENGLISH_REVIEW.map((question) => question.qlId)).size !== TSD_CP012_PERMANENT_QL_IDS.length) {
  throw new Error("TSD-CP-012 frozen English review no longer spans all permanent QLs");
}
