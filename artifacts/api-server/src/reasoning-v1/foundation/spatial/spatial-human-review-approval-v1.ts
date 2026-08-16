export const SPATIAL_HUMAN_REVIEW_APPROVAL_V1 = {
  approvalId: "SPA-FND-001-HUMAN-ENGLISH-MOBILE-APPROVAL-V1",
  status: "APPROVED" as const,
  approvedAt: "2026-08-15",
  approvalAuthority: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  approvedReview: {
    sourceHead: "5bd56352a6f2394df9f4f83d09f90638292f05bc",
    workflowName: "Validate SPA-FND-001 Proposed QL Human Review V1",
    workflowRunId: 31879721096,
    artifactId: 9245701817,
    artifactDigest:
      "sha256:b565bd45cb003a362bd927e0115a1c3303563050955577c0dbf1c2669b88a428",
    activeProposedQls: 30,
    reviewedQuestions: 120,
    questionsPerQl: 4,
    minimumMobileOptionPixels: 104,
  },
  chapterCounts: {
    "MIR-001": 3,
    "WAT-001": 2,
    "FAN-001": 8,
    "FCL-001": 9,
    "FSR-001": 8,
  },
  remediationsIncludedInApproval: [
    "MIR premium distractor preserves the complete outer figure and changes only one internal property.",
    "MIR inner-property distractors require true rendered-outline separation, preventing the Question 2 look-alike defect.",
    "Semantic and perceptual option uniqueness are enforced across the final review surface.",
    "Mobile review uses a minimum 104 px option figure size.",
  ] as const,
  holdsExcluded: ["WAT-HOLD-P01", "FCL-HOLD-P01"] as const,
  sourceScope: {
    SSC: "CONTROLLED_TAXONOMY_EVIDENCE_ESTABLISHED",
    RAILWAY_POLICE_DSSSB: "SUPPORTING_EVIDENCE_PRESENT",
    BANKING: "NOT_ESTABLISHED",
    PUNJAB_STATE: "NOT_ESTABLISHED",
  } as const,
  authorization: {
    permanentQlAllocationAllowed: true,
    englishImplementationFreezeAllowed: true,
    questionStudioActivationAllowed: false,
    questionBankWritesAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    hindiPunjabiGenerationAllowed: false,
  } as const,
} as const;

export type SpatialHumanReviewApprovalV1 =
  typeof SPATIAL_HUMAN_REVIEW_APPROVAL_V1;
