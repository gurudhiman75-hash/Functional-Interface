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
import {
  DOT_SITUATION_INTERNAL_ACTIVATION_V1,
  DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1,
} from "./dot-situation-freeze-v1";

export type SpatialQuestionStudioChapterCodeV7 = SpatialQuestionStudioChapterCodeV5 | "FFM-001" | "DOT-001";
export type SpatialQuestionStudioPermanentQlIdV7 = SpatialQuestionStudioPermanentQlIdV5 | "SPA-QL-051" | "SPA-QL-052" | "SPA-QL-053" | "SPA-QL-054";
export type SpatialQuestionStudioDifficultyV7 = "Easy" | "Medium" | "Hard";

const FFM_QLS_V7 = Object.freeze([
  Object.freeze({ permanentQlId: "SPA-QL-051" as const, proposalId: "FFM-PROP-01" as const, chapterCode: "FFM-001" as const, name: "Figure formation using all given pieces" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-052" as const, proposalId: "FFM-PROP-02" as const, chapterCode: "FFM-001" as const, name: "Select numbered pieces forming the target" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-053" as const, proposalId: "FFM-PROP-03" as const, chapterCode: "FFM-001" as const, name: "Identify the piece pair forming the target" as const, difficulty: "Medium" as const }),
] as const);

const DOT_QLS_V7 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-054" as const,
    proposalId: "DOT-PROP-01" as const,
    chapterCode: "DOT-001" as const,
    name: "Preserve complete dot-region membership across rearranged shapes" as const,
    difficulty: "Medium" as const,
  }),
] as const);

if (!FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1.approved || !FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.questionStudioDiscoverable) {
  throw new Error("FFM-001 approved activation is required before DOT-001 integration.");
}
if (!DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approved) {
  throw new Error("DOT-001 integration requires explicit product-owner approval.");
}
if (!DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("DOT-001 internal activation has not opened Question Studio discovery.");
}

export const SPATIAL_QUESTION_STUDIO_QLS_V7 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V5,
  ...FFM_QLS_V7,
  ...DOT_QLS_V7,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV7;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV7;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV7;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V7 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  name: "Spatial Reasoning — Approved 49-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 49 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V8-DOT" as const,
  supersedesIntegrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V7-FFM" as const,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V7.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V7,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5.chapters,
    "FFM-001",
    "DOT-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV7[],
  permanentQlCount: 49,
  figureFormationPermanentQlCount: 3,
  figureFormationQlIds: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.permanentQlIds,
  figureFormationProductOwnerApprovalAuthority: FIGURE_FORMATION_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  figureFormationFreezeAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.sourceFreezeAuthorityId,
  figureFormationActivationAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.authorityId,
  dotSituationPermanentQlCount: 1,
  dotSituationQlIds: DOT_SITUATION_INTERNAL_ACTIVATION_V1.permanentQlIds,
  dotSituationProductOwnerApprovalAuthority: DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  dotSituationFreezeAuthority: DOT_SITUATION_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
  dotSituationActivationAuthority: DOT_SITUATION_INTERNAL_ACTIVATION_V1.authorityId,
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

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V7;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV7;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV7;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV7;
