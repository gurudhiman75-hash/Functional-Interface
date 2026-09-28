import { SIF_CP_IDS } from "./types.ts";

export const SIF_001_CHAPTER_FREEZE_V1 = Object.freeze({
  freezeId: "SIF-001-V1-FROZEN-REVIEW-ONLY" as const,
  chapterId: "SIF-001" as const,
  subjectCode: "REAS-SIF" as const,
  title: "Statement and Inference",
  version: "V1" as const,
  approvalRecordedOn: "2026-09-28" as const,
  approvalAuthority: "PRODUCT_OWNER_APPROVAL_SIF_001_CP015_CP017_AND_CHAPTER_CLOSE" as const,
  certifiedContentHead: "4e09d9d8fbce9ab2556e248c807609820a71957d" as const,
  cpCount: 17 as const,
  cpIds: SIF_CP_IDS,
  approvedFinalReviewPacks: Object.freeze(["SIF-CP015", "SIF-CP016", "SIF-CP017"] as const),
  locales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  lifecycle: Object.freeze({
    semanticContent: "FROZEN_V1" as const,
    multilingualChapterFrozen: true as const,
    questionStudioStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioReviewOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    separateReleaseApprovalRequired: true as const,
    noveltyExpansion: "DEFERRED_TO_CROSS_CHAPTER_FINAL_PASS" as const,
  }),
} as const);
