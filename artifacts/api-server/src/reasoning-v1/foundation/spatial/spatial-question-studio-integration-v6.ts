import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V5,
  type SpatialQuestionStudioChapterCodeV5,
  type SpatialQuestionStudioPermanentQlIdV5,
} from "./spatial-question-studio-integration-v5";
import { FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 } from "./figure-formation-internal-activation-v1";
import { FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10 } from "./spatial-permanent-ql-allocation-v10";

export type SpatialQuestionStudioChapterCodeV6 = SpatialQuestionStudioChapterCodeV5 | "FFM-001";
export type SpatialQuestionStudioPermanentQlIdV6 = SpatialQuestionStudioPermanentQlIdV5 | "SPA-QL-051" | "SPA-QL-052" | "SPA-QL-053";
export type SpatialQuestionStudioDifficultyV6 = "Easy" | "Medium" | "Hard";

const FFM_QLS_V6 = Object.freeze(FIGURE_FORMATION_PERMANENT_QL_ALLOCATIONS_V10.map((allocation) => Object.freeze({
  permanentQlId: allocation.permanentQlId,
  proposalId: allocation.proposalId,
  chapterCode: "FFM-001" as const,
  name: allocation.name,
  difficulty: allocation.permanentQlId === "SPA-QL-051" ? "Easy" as const : "Medium" as const,
})));

if (!FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("FFM-001 Question Studio integration requires internal activation.");
}

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
  name: "Spatial Reasoning — Approved 48-QL Multilingual Internal Runtime" as const,
  label: "Spatial Reasoning — 48 QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V7-FFM-001" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V6.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V6,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V5.chapters,
    "FFM-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV6[],
  permanentQlCount: 48,
  figureFormationPermanentQlCount: 3,
  figureFormationQlIds: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.permanentQlIds,
  figureFormationActivationAuthority: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.authorityId,
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

if (SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount !== 48) {
  throw new Error("SPA-001 package must expose 48 non-CND QLs after FFM-001 integration.");
}

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V6;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV6;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV6;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV6;
