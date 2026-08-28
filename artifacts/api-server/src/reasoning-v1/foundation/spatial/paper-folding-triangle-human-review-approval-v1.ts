export const PFC_001_TRIANGLE_HUMAN_REVIEW_APPROVAL_V1 = Object.freeze({
  approvalId: "PFC-001-TRIANGLE-HUMAN-REVIEW-APPROVAL-V1" as const,
  status: "APPROVED" as const,
  approvedAt: "2026-08-20" as const,
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  approvedScope: "TRIANGULAR_SOURCE_SHEET_ONLY" as const,
  approvedReview: {
    sourceHead: "4dba80b4283919f20d79872426755a3d9ea7f74c" as const,
    workflowRunId: 32325523834,
    artifactId: 9391244029,
    artifactDigest: "sha256:5eb7b836817747c32bb5dc871f3d81fede05716789f3e165ad72abc0d44430ef" as const,
    reviewedQuestions: 12,
    forwardQuestions: 8,
    reverseQuestions: 4,
    sourceShape: "TRIANGLE" as const,
  },
  explicitlyNotApproved: [
    "REGULAR_HEXAGON",
    "PENTAGON",
    "GENERAL_CONVEX_POLYGON",
    "IRREGULAR_OR_CONCAVE_POLYGON",
  ] as const,
  authorization: {
    triangleRepresentationMergeIntoMainReviewAllowed: true,
    permanentQlAllocationAllowed: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    publicPublicationAllowed: false,
  },
} as const);

export type PfcTriangleHumanReviewApprovalV1 = typeof PFC_001_TRIANGLE_HUMAN_REVIEW_APPROVAL_V1;
