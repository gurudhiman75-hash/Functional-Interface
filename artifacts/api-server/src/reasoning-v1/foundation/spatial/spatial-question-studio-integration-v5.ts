import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V3 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v3";
import { spatialQuestionStudioDifficultyV1 } from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V7,
} from "./spatial-permanent-ql-allocation-v7";
import { FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./counting-figures-localization-freeze-v1";
import { FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-question-studio-product-owner-approval-v1";
import { CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./cubes-dice-localization-freeze-v1";
import { CND_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./cubes-dice-question-studio-product-owner-approval-v1";

if (!FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized) {
  throw new Error("FCT-001 standard Question Studio registration has not been product-owner authorized.");
}
if (!CND_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized) {
  throw new Error("CND-001 standard Question Studio registration has not been product-owner authorized.");
}

export type SpatialQuestionStudioChapterCodeV5 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V7)[number]["chapterCode"];
export type SpatialQuestionStudioPermanentQlIdV5 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V7)[number]["permanentQlId"];
export type SpatialQuestionStudioDifficultyV5 = "Easy" | "Medium" | "Hard";

export const SPATIAL_QUESTION_STUDIO_QLS_V5 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V7.map(
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
  chapterCode: SpatialQuestionStudioChapterCodeV5;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV5;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V5 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3,
  name: "Spatial Reasoning — Approved 45-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 45 Permanent QLs" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V6-CND" as const,
  supersedesIntegrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V5-FCT" as const,
  sourceAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V5.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V5,
  chapters: [
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V3.chapters,
    "FCT-001",
    "CND-001",
  ] as const,
  permanentQlCount: 45,
  countingFiguresPermanentQlCount: 1,
  countingFiguresProductOwnerApprovalAuthority:
    FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  countingFiguresApprovedOperatorReviewHead:
    FCT_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewHeadSha,
  countingFiguresLocalizationAuthority:
    FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  cubesDicePermanentQlCount: 3,
  cubesDiceProductOwnerApprovalAuthority:
    CND_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  cubesDiceApprovedOperatorReviewHead:
    CND_001_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedOperatorReviewHeadSha,
  cubesDiceLocalizationAuthority:
    CND_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
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

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V5;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 =
  BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV5;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV5;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV5;
