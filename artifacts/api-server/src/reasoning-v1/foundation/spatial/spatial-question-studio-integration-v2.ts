import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  spatialQuestionStudioDifficultyV1,
  type SpatialQuestionStudioDifficultyV1 as BaseSpatialQuestionStudioDifficultyV1,
} from "./spatial-question-studio-integration-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
} from "./spatial-permanent-ql-allocation-v4";
import { PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-question-studio-product-owner-approval-v1";
import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "./paper-folding-localization-freeze-v2";
import { PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1 } from "./paper-folding-question-studio-visual-direction-remediation-v1";
import { PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1 } from "./paper-folding-question-studio-editorial-v1-1";

if (!PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.governance.standardQuestionStudioRegistrationAuthorized) {
  throw new Error("PFC/TPF Question Studio registration has not been product-owner authorized.");
}

export type SpatialQuestionStudioChapterCodeV2 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V4)[number]["chapterCode"];
export type SpatialQuestionStudioPermanentQlIdV2 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V4)[number]["permanentQlId"];
export type SpatialQuestionStudioDifficultyV2 = BaseSpatialQuestionStudioDifficultyV1;

export const SPATIAL_QUESTION_STUDIO_QLS_V2 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V4.map(
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
  chapterCode: SpatialQuestionStudioChapterCodeV2;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV2;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V2 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  name: "Spatial Reasoning — Approved 40-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 40 Permanent QLs" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V3-PFC-TPF" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  sourceAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V2.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V2,
  chapters: [
    "MIR-001",
    "WAT-001",
    "FAN-001",
    "FCL-001",
    "FSR-001",
    "FGC-001",
    "PFC-001",
    "TPF-001",
  ] as const,
  permanentQlCount: 40,
  pfcTpfPermanentQlCount: 6,
  pfcPermanentQlCount: 5,
  tpfPermanentQlCount: 1,
  pfcTpfProductOwnerApprovalAuthority: PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  pfcTpfApprovedReviewHead: PFC_TPF_QUESTION_STUDIO_PRODUCT_OWNER_APPROVAL_V1.approvedHeadSha,
  pfcTpfLocalizationAuthority: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  pfcTpfEditorialAuthority: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.authorityId,
  pfcTpfVisualRemediationAuthority: PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.authorityId,
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
  automaticStudentPublication: false,
}) as const;

// Route-compatible aliases let the existing admin surface opt into V2 by changing
// only its module path. The old V1 module and its frozen 34-QL tests remain intact.
export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V2;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV2;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV2;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV2;
