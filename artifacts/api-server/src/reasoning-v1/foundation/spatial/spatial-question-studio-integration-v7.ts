import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V6 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V6,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V6,
  type SpatialQuestionStudioChapterCodeV6,
  type SpatialQuestionStudioPermanentQlIdV6,
} from "./spatial-question-studio-integration-v6";
import {
  DOT_SITUATION_INTERNAL_ACTIVATION_V1,
  DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1,
} from "./dot-situation-freeze-v1";

export type SpatialQuestionStudioChapterCodeV7 = SpatialQuestionStudioChapterCodeV6 | "DOT-001";
export type SpatialQuestionStudioPermanentQlIdV7 = SpatialQuestionStudioPermanentQlIdV6 | "SPA-QL-054";
export type SpatialQuestionStudioDifficultyV7 = "Easy" | "Medium" | "Hard";

const DOT_QLS_V7 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-054" as const,
    proposalId: "DOT-PROP-01" as const,
    chapterCode: "DOT-001" as const,
    name: "Preserve complete dot-region membership across rearranged shapes" as const,
    difficulty: "Medium" as const,
  }),
] as const);

if (!DOT_SITUATION_PRODUCT_OWNER_APPROVAL_V1.approved) {
  throw new Error("DOT-001 integration requires explicit product-owner approval.");
}
if (!DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("DOT-001 internal activation has not opened Question Studio discovery.");
}

export const SPATIAL_QUESTION_STUDIO_QLS_V7 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V6,
  ...DOT_QLS_V7,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV7;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV7;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV7;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V7 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V6,
  name: "Spatial Reasoning — Approved 49-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 49 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V8-DOT" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V6.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V7.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V7,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V6.chapters,
    "DOT-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV7[],
  permanentQlCount: 49,
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
