import {
  TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,
  TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW,
} from "./exam-paper-review-final-v3-all";
import { TSD_CP010_NEXT_PERMANENT_QL, TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

export const TSD_CP010_LOCALIZATION_FREEZE_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-010" as const,
  status: "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE" as const,
  approvedOn: "2026-08-30" as const,
  approvalInstruction: "Go — continue TSD chapter in lifecycle order" as const,
  approvedSourceBranch: "feat/tsd-cp010-executable-discovery-v1" as const,
  approvedSourceHead: "78768014443ca76e606f063b73ead667af86d375" as const,
  approvedHindiSourceLayer: "TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW" as const,
  approvedPunjabiSourceLayer: "TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW" as const,
  qlRange: "TSD-QL-115..TSD-QL-124" as const,
  qlCount: 10 as const,
  familiesPerLocale: 60 as const,
  compatibleCombinationsPerLocale: 471 as const,
  multilingualCombinations: 1413 as const,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  approvedReviewWorkflowRun: 193 as const,
  approvedReviewWorkflowRunId: 33099009244 as const,
  approvedReviewArtifactId: 9657610728 as const,
  approvedReviewArtifactDigest: "sha256:b930ef54bfd1a10ba6e93cbc6ad825df6734675d3a82ab62f87b706a9b68ce5b" as const,
  stemAuthoringPolicy: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE" as const,
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE" as const,
  nextPermanentQl: TSD_CP010_NEXT_PERMANENT_QL,
  nativeLanguageQualityGate: "PASS" as const,
  realismGate: "PASS" as const,
  hindi: "FROZEN" as const,
  punjabi: "FROZEN" as const,
  questionStudio: "FROZEN_CONTENT_NOT_YET_REGISTERED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export const TSD_CP010_FROZEN_HINDI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

export const TSD_CP010_FROZEN_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW.map((question) => Object.freeze({
    ...question,
    editorialStatus: "FROZEN" as const,
  })),
);

for (const registry of [TSD_CP010_FROZEN_HINDI_REVIEW, TSD_CP010_FROZEN_PUNJABI_REVIEW]) {
  if (new Set(registry.map((question) => question.qlId)).size !== TSD_CP010_PERMANENT_QL_IDS.length) {
    throw new Error("TSD-CP-010 frozen localization no longer spans all permanent QLs");
  }
}
