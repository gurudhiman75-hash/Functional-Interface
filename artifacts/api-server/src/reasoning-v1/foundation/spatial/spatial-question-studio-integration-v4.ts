import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v3";
import { spatialQuestionStudioDifficultyV1 } from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
} from "./spatial-permanent-ql-allocation-v6";
import { FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./counting-figures-localization-freeze-v1";
import { FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-question-studio-product-owner-approval-v1";

if (!FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized) {
  throw new Error("FCT-001 standard Question Studio registration has not been product-owner authorized.");
}

export type SpatialQuestionStudioChapterCodeV4 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V6)[number]["chapterCode"];
export type SpatialQuestionStudioPermanentQlIdV4 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V6)[number]["permanentQlId"];
export type SpatialQuestionStudioDifficultyV4 = "Easy" | "Medium" | "Hard";

export const SPATIAL_QUESTION_STUDIO_QLS_V4 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V6.map(
  (allocation) => Object.freeze({
    permanentQlId: allocation.permanentQlId,
    proposalId: allocation.proposalId,
    chapterCode: allocation.chapterCode,
    name: allocation.name,
    difficulty: spatialQuestionStudioDifficultyV1(allocation.baseDifficulty),
  }),
) as readonly Readonly<{
  permanentQlId: `SPA-QL-${string}`;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV4;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV4;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V4 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  name: "Spatial Reasoning — Approved 42-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 42 Permanent QLs" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V5-FCT" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  sourceAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V4.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V4,
  chapters: [
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3.chapters,
    "FCT-001",
  ] as const,
  permanentQlCount: 42,
  countingFiguresPermanentQlCount: 1,
  countingFiguresProductOwnerApprovalAuthority:
    FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  countingFiguresApprovedOperatorReviewHead:
    FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewHeadSha,
  countingFiguresLocalizationAuthority:
    FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  registrationStatus: "REGISTERED" as const,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
  questionBankEligible: true,
  testEligibility: BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
  testEligible: true,
  publiclyPublishable: BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
  mockTestEligible: BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
  manualApprovalRequired: true,
  futureGeneratedItemsAutomaticallyApproved: false,
  automaticStudentPublication: false,
}) as const;

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V4;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 =
  BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV4;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV4;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV4;
