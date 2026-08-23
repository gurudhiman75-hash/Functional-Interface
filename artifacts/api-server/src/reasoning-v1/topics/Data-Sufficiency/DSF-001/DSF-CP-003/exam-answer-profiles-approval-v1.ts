import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_QUESTION_STUDIO_PACKAGE } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_ANSWER_PROFILES,
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
  DSF_CP003_PROFILE_CHECKPOINT_ID,
} from "./exam-answer-profiles-v1.ts";

export const DSF_CP003_APPROVED_EXAM_PROFILE_IDS = [
  "BANKING_STANDARD_5_EN",
  "BANKING_BOB_2015_5_EN",
  "SSC_CGL_TIER2_2023_4_EN",
  "SSC_CGL_TIER2_2024_4_EN",
] as const;

export const DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL = Object.freeze({
  authorityId: "DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL_V1" as const,
  status: "PRODUCT_OWNER_APPROVED" as const,
  approvedOn: "2026-08-23" as const,
  packageId: "DSF-001" as const,
  sourceCheckpointId: "DSF-CP-001" as const,
  integrationCheckpointId: "DSF-CP-002" as const,
  profileCheckpointId: DSF_CP003_PROFILE_CHECKPOINT_ID,
  permanentQlId: "DSF-QL-001" as const,
  nextAvailableQlId: "DSF-QL-002" as const,
  sourceFreezeAuthority: DSF_CP001_FREEZE_AUTHORITY.authorityId,
  questionStudioAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority,
  profileDeliveryAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
  reviewedDelivery: {
    language: "en" as const,
    locale: "en-IN" as const,
    reviewPackId: "DSF-CP003-EXAM-PROFILE-REVIEW-50-2026-08-22" as const,
    questionCount: 50 as const,
    profileCounts: {
      BANKING_STANDARD_5_EN: 13,
      BANKING_BOB_2015_5_EN: 13,
      SSC_CGL_TIER2_2023_4_EN: 12,
      SSC_CGL_TIER2_2024_4_EN: 12,
    } as const,
    domainCounts: {
      NUMBER_SYSTEM: 13,
      RATIO_PROPORTION: 12,
      PERCENTAGE: 12,
      ALGEBRA: 13,
    } as const,
    canonicalClassCounts: {
      STATEMENT_I_ONLY: 11,
      STATEMENT_II_ONLY: 12,
      EACH_STATEMENT_ALONE: 4,
      BOTH_TOGETHER_ONLY: 10,
      INSUFFICIENT_EVEN_TOGETHER: 13,
    } as const,
    solveModeCounts: {
      "DSF-SM-NUM-MISSING-DIGIT": 9,
      "DSF-SM-NUM-DIGIT-PARITY": 4,
      "DSF-SM-RAP-RATIO-AB": 5,
      "DSF-SM-RAP-GREATER-QUANTITY": 7,
      "DSF-SM-PCT-NET-SUCCESSIVE-CHANGE": 6,
      "DSF-SM-PCT-FINAL-DIRECTION": 6,
      "DSF-SM-ALG-SINGLE-VARIABLE-X": 7,
      "DSF-SM-ALG-LINEAR-SYSTEM-X": 6,
    } as const,
    approvedProfileIds: DSF_CP003_APPROVED_EXAM_PROFILE_IDS,
    artifactId: 9475663354 as const,
    artifactZipSha256: "2d3b6d14d4e743d28e0fe9bb6f45abd6cd8aef99c2809043f6c92db670582a47" as const,
    htmlSha256: "7d6b37b22b3472abfa63e3ff746e841a293cc0aa8ec8b5f75a9e8b5c32deed24" as const,
    jsonSha256: "b743fe5dfc63c174218b43d627c560f3020a29e1b55e64e82ae525dbcef5812b" as const,
  },
  approvalScope: {
    bankingProfilesApproved: true as const,
    sscProfilesApproved: true as const,
    genericProfileApprovalPreservedFromCp002: true as const,
    semanticTruthReopened: false as const,
    optionPositionSeparatedFromSemanticClass: true as const,
    sscUnrepresentableClassRemappingForbidden: true as const,
    newPermanentQlAllocated: false as const,
    punjabSpecificProfileApproved: false as const,
    hindiApproved: false as const,
    punjabiApproved: false as const,
  },
  evidenceBoundary: {
    profileDefinitionsRemainSourceEvidenceScoped: true as const,
    productApprovalDoesNotUpgradeSourceEvidenceLevel: true as const,
    approvedProfileDefinitionCount: DSF_CP003_ANSWER_PROFILES.filter((profile) =>
      DSF_CP003_APPROVED_EXAM_PROFILE_IDS.includes(profile.id as (typeof DSF_CP003_APPROVED_EXAM_PROFILE_IDS)[number]),
    ).length,
  },
  lifecycleAfterApproval: {
    questionStudioDiscoverable: true as const,
    reviewRunPersistenceAllowed: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  },
  nextGate: "DOWNSTREAM_LIFECYCLE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT" as const,
});
