import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V5,
  type SpatialQuestionStudioChapterCodeV5,
  type SpatialQuestionStudioPermanentQlIdV5,
} from "./spatial-question-studio-integration-v5";
import {
  FIGURE_FORMATION_INTERNAL_ACTIVATION_V2,
  FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1,
} from "./figure-formation-freeze-v1";

export type SpatialQuestionStudioChapterCodeV6 = SpatialQuestionStudioChapterCodeV5 | "FFM-001";
export type SpatialQuestionStudioPermanentQlIdV6 = SpatialQuestionStudioPermanentQlIdV5 | "SPA-QL-051" | "SPA-QL-052" | "SPA-QL-053";
export type SpatialQuestionStudioDifficultyV6 = "Easy" | "Medium" | "Hard";

const FFM_QLS_V6 = Object.freeze([
  Object.freeze({ permanentQlId: "SPA-QL-051" as const, proposalId: "FFM-PROP-01" as const, chapterCode: "FFM-001" as const, name: "Figure formation using all given pieces" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-052" as const, proposalId: "FFM-PROP-02" as const, chapterCode: "FFM-001" as const, name: "Select numbered pieces forming the target" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-053" as const, proposalId: "FFM-PROP-03" as const, chapterCode: "FFM-001" as const, name: "Identify the piece pair forming the target" as const, difficulty: "Medium" as const }),
] as const);

if (!FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1.approved) throw new Error("FFM-001 integration requires explicit product-owner approval.");
if (!FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.questionStudioDiscoverable) throw new Error("FFM-001 internal activation has not opened Question Studio discovery.");

export const SPATIAL_QUESTION_STUDIO_QLS_V6 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V5,
  ...FFM_QLS_V6,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV6;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV6;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV6;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V6 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  name: "Spatial Reasoning — Approved 48-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 48 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V7-FFM" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V6.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V6,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5.chapters,
    "FFM-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV6[],
  permanentQlCount: 48,
  figureFormationPermanentQlCount: 3,
  figureFormationQlIds: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.permanentQlIds,
  figureFormationProductOwnerApprovalAuthority: FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  figureFormationFreezeAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.sourceFreezeAuthorityId,
  figureFormationActivationAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.authorityId,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  registrationStatus: "REGISTERED" as const,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankEligible: true,
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  manualApprovalRequired: true,
  manualQuestionPublicationRequired: true,
  futureGeneratedItemsAutomaticallyApproved: false,
  automaticStudentPublication: false,
}) as const;

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V6;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV6;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV6;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV6;
