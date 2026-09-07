import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V8 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V8,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V8,
  type SpatialQuestionStudioChapterCodeV8,
  type SpatialQuestionStudioPermanentQlIdV8,
} from "./spatial-question-studio-integration-v8";
import {
  IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
  IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1,
} from "./identical-figure-freeze-v1";

export type SpatialQuestionStudioChapterCodeV9 = SpatialQuestionStudioChapterCodeV8 | "IDF-001";
export type SpatialQuestionStudioPermanentQlIdV9 = SpatialQuestionStudioPermanentQlIdV8
  | "SPA-QL-061" | "SPA-QL-062" | "SPA-QL-063";
export type SpatialQuestionStudioDifficultyV9 = "Easy" | "Medium" | "Hard";

const IDF_QLS_V9 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-061" as const,
    proposalId: "IDF-PROP-01" as const,
    chapterCode: "IDF-001" as const,
    name: "Group figures by stable component identity" as const,
    difficulty: "Easy" as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-062" as const,
    proposalId: "IDF-PROP-02" as const,
    chapterCode: "IDF-001" as const,
    name: "Group figures by containment overlap or intersection relation" as const,
    difficulty: "Medium" as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-063" as const,
    proposalId: "IDF-PROP-03" as const,
    chapterCode: "IDF-001" as const,
    name: "Group asymmetric figures under declared rotation or reflection equivalence" as const,
    difficulty: "Hard" as const,
  }),
] as const);

if (!IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved) {
  throw new Error("IDF-001 integration requires explicit product-owner approval.");
}
if (!IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("IDF-001 internal activation has not opened Question Studio discovery.");
}

export const SPATIAL_QUESTION_STUDIO_QLS_V9 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V8,
  ...IDF_QLS_V9,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV9;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV9;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV9;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V9 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V8,
  name: "Spatial Reasoning — Approved 58-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 58 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V10-IDF" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V8.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V9.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V9,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V8.chapters,
    "IDF-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV9[],
  permanentQlCount: 58,
  identicalFigurePermanentQlCount: 3,
  identicalFigureQlIds: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.permanentQlIds,
  identicalFigureProductOwnerApprovalAuthority: IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  identicalFigureFreezeAuthority: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
  identicalFigureActivationAuthority: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.authorityId,
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

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V9;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV9;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV9;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV9;
