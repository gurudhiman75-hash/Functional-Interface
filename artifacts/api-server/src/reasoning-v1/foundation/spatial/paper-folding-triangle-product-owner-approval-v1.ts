export const PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1 = Object.freeze({
  authorityId: "PFC-001-TRIANGLE-PRODUCT-OWNER-APPROVAL-V1" as const,
  approvalId: "PFC-001-TRIANGLE-PRODUCT-OWNER-APPROVAL-V1" as const,
  approvedAt: "2026-08-20" as const,
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  approvedScope: "TRIANGLE_SOURCE_SHEET_REPRESENTATION_ONLY" as const,
  approvedReview: {
    authorityId: "PFC-001-POLYGON-TRIANGLE-LEARNER-REVIEW-V1" as const,
    sourceHead: "4dba80b4283919f20d79872426755a3d9ea7f74c" as const,
    workflowRunId: 32325523834,
    artifactId: 9391244029,
    artifactDigest: "sha256:5eb7b836817747c32bb5dc871f3d81fede05716789f3e165ad72abc0d44430ef" as const,
    reviewQuestionCount: 12,
    forwardQuestionCount: 8,
    reverseQuestionCount: 4,
    sourceShape: "TRIANGLE" as const,
  },
  interpretation: [
    "Triangle is approved as a source-sheet representation inside existing PFC learner-skill boundaries.",
    "Triangle approval does not create a dedicated permanent QL.",
    "This approval does not approve hexagon, pentagon, general polygon, localization, Question Studio, or publication.",
  ] as const,
  authorization: {
    mergeTriangleIntoMainSourceSaturatedReviewAllowed: true,
    permanentQlAllocationAllowed: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    publicationAllowed: false,
  },
  nextGate: "PFC_001_HEXAGON_SOURCE_BACKED_REVIEW" as const,
} as const);

export type PfcTriangleProductOwnerApprovalV1 = typeof PFC_001_TRIANGLE_PRODUCT_OWNER_APPROVAL_V1;
