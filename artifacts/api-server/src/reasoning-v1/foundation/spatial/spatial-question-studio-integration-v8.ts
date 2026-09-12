import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V7 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V7,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V7,
  type SpatialQuestionStudioChapterCodeV7,
  type SpatialQuestionStudioPermanentQlIdV7,
} from "./spatial-question-studio-integration-v7";
import {
  FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
  FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1,
} from "./figure-matrix-freeze-v1";

export type SpatialQuestionStudioChapterCodeV8 = SpatialQuestionStudioChapterCodeV7 | "FMT-001";
export type SpatialQuestionStudioPermanentQlIdV8 = SpatialQuestionStudioPermanentQlIdV7
  | "SPA-QL-055" | "SPA-QL-056" | "SPA-QL-057" | "SPA-QL-058" | "SPA-QL-059" | "SPA-QL-060";
export type SpatialQuestionStudioDifficultyV8 = "Easy" | "Medium" | "Hard";

const FMT_QLS_V8 = Object.freeze([
  Object.freeze({ permanentQlId: "SPA-QL-055" as const, proposalId: "FMT-PROP-01" as const, chapterCode: "FMT-001" as const, name: "Repeated figure transformation" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-056" as const, proposalId: "FMT-PROP-02" as const, chapterCode: "FMT-001" as const, name: "Binary figure composition" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-057" as const, proposalId: "FMT-PROP-03" as const, chapterCode: "FMT-001" as const, name: "Quantitative count relation" as const, difficulty: "Easy" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-058" as const, proposalId: "FMT-PROP-04" as const, chapterCode: "FMT-001" as const, name: "Cyclic distribution and permutation" as const, difficulty: "Medium" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-059" as const, proposalId: "FMT-PROP-05" as const, chapterCode: "FMT-001" as const, name: "Orthogonal row-column attributes" as const, difficulty: "Hard" as const }),
  Object.freeze({ permanentQlId: "SPA-QL-060" as const, proposalId: "FMT-PROP-06" as const, chapterCode: "FMT-001" as const, name: "Compound matrix rule" as const, difficulty: "Hard" as const }),
] as const);

if (!FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.approved) {
  throw new Error("FMT-001 integration requires explicit product-owner approval.");
}
if (!FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("FMT-001 internal activation has not opened Question Studio discovery.");
}

export const SPATIAL_QUESTION_STUDIO_QLS_V8 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V7,
  ...FMT_QLS_V8,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV8;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV8;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV8;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V8 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V7,
  name: "Spatial Reasoning — Approved 55-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 55 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V9-FMT" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V7.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V8.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V8,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V7.chapters,
    "FMT-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV8[],
  permanentQlCount: 55,
  figureMatrixPermanentQlCount: 6,
  figureMatrixQlIds: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.permanentQlIds,
  figureMatrixProductOwnerApprovalAuthority: FIGURE_MATRIX_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  figureMatrixFreezeAuthority: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
  figureMatrixActivationAuthority: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.authorityId,
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

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V8;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV8;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV8;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV8;
