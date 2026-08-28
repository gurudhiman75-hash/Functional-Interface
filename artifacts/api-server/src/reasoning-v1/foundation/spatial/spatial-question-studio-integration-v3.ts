import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V2 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V2,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v2";
import { spatialQuestionStudioDifficultyV1 } from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
} from "./spatial-permanent-ql-allocation-v5";
import { EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./embedded-figure-localization-freeze-v1";
import { EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./embedded-figure-question-studio-product-owner-approval-v1";

if (!EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized) {
  throw new Error("EMB-001 standard Question Studio registration has not been product-owner authorized.");
}

export type SpatialQuestionStudioChapterCodeV3 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V5)[number]["chapterCode"];
export type SpatialQuestionStudioPermanentQlIdV3 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V5)[number]["permanentQlId"];
export type SpatialQuestionStudioDifficultyV3 = "Easy" | "Medium" | "Hard";

export const SPATIAL_QUESTION_STUDIO_QLS_V3 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V5.map(
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
  chapterCode: SpatialQuestionStudioChapterCodeV3;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV3;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V3 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V2,
  name: "Spatial Reasoning — Approved 41-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 41 Permanent QLs" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V4-EMB" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
  sourceAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V3.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V3,
  chapters: [
    "MIR-001",
    "WAT-001",
    "FAN-001",
    "FCL-001",
    "FSR-001",
    "FGC-001",
    "PFC-001",
    "TPF-001",
    "EMB-001",
  ] as const,
  permanentQlCount: 41,
  embeddedFigurePermanentQlCount: 1,
  embeddedFigureProductOwnerApprovalAuthority:
    EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  embeddedFigureApprovedReviewHead:
    EMBEDDED_FIGURE_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedHeadSha,
  embeddedFigureLocalizationAuthority:
    EMBEDDED_FIGURE_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
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

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V3;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 =
  BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV3;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV3;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV3;
