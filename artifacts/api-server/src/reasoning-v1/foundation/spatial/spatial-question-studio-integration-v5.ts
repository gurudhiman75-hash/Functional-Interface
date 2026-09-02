import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V4 as BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 as BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
  SPATIAL_QUESTION_STUDIO_QLS_V4,
  type SpatialQuestionStudioChapterCodeV4,
  type SpatialQuestionStudioPermanentQlIdV4,
} from "./spatial-question-studio-integration-v4";
import {
  SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1,
  SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1,
} from "./spatial-final-held-gap-freeze-v1";
import type { SpatialFinalHeldGapQlIdV1 } from "./spatial-final-held-gap-review-runtime-v1";

export type SpatialQuestionStudioChapterCodeV5 = SpatialQuestionStudioChapterCodeV4 | "FCT-001" | "EMB-001";
export type SpatialQuestionStudioPermanentQlIdV5 = SpatialQuestionStudioPermanentQlIdV4 | SpatialFinalHeldGapQlIdV1;
export type SpatialQuestionStudioDifficultyV5 = "Easy" | "Medium" | "Hard";

const FINAL_HELD_GAP_QLS_V5 = Object.freeze([
  Object.freeze({
    permanentQlId: "SPA-QL-048" as const,
    proposalId: "FCT-CAND-B-STRAIGHT-LINE-ENUMERATION" as const,
    chapterCode: "FCT-001" as const,
    name: "Systematic counting of straight lines" as const,
    difficulty: "Medium" as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-049" as const,
    proposalId: "FCT-CAND-C-CURVED-PRIMITIVE-ENUMERATION" as const,
    chapterCode: "FCT-001" as const,
    name: "Systematic counting of circles and semicircles" as const,
    difficulty: "Medium" as const,
  }),
  Object.freeze({
    permanentQlId: "SPA-QL-050" as const,
    proposalId: "EMB-PROP-02" as const,
    chapterCode: "EMB-001" as const,
    name: "Embedded figure identification with rotation allowed" as const,
    difficulty: "Medium" as const,
  }),
] as const);

if (!SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approved) {
  throw new Error("SPA-QL-048..050 Question Studio integration requires explicit product-owner approval.");
}
if (!SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
  throw new Error("SPA-QL-048..050 internal activation has not opened Question Studio discovery.");
}

export const SPATIAL_QUESTION_STUDIO_QLS_V5 = Object.freeze([
  ...SPATIAL_QUESTION_STUDIO_QLS_V4,
  ...FINAL_HELD_GAP_QLS_V5,
]) as readonly Readonly<{
  permanentQlId: SpatialQuestionStudioPermanentQlIdV5;
  proposalId: string;
  chapterCode: SpatialQuestionStudioChapterCodeV5;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV5;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V5 = Object.freeze({
  ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
  name: "Spatial Reasoning — Approved 45-QL Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 45 Production QLs · CND separate" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V6-FINAL-HELD-GAPS" as const,
  supersedesIntegrationAuthority: BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V4.integrationAuthority,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V5.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V5,
  chapters: Object.freeze(Array.from(new Set<string>([
    ...BASE_SPATIAL_QUESTION_STUDIO_PACKAGE_V4.chapters,
    "FCT-001",
    "EMB-001",
  ]))) as readonly SpatialQuestionStudioChapterCodeV5[],
  permanentQlCount: 45,
  finalHeldGapPermanentQlCount: 3,
  finalHeldGapQlIds: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.permanentQlIds,
  finalHeldGapProductOwnerApprovalAuthority: SPATIAL_FINAL_HELD_GAP_PRODUCT_OWNER_APPROVAL_V1.approvalId,
  finalHeldGapFreezeAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.sourceFreezeAuthorityId,
  finalHeldGapActivationAuthority: SPATIAL_FINAL_HELD_GAP_INTERNAL_ACTIVATION_V1.authorityId,
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
  // Conservative package-level capability: 048..050 are not mock/public-release enabled.
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  manualApprovalRequired: true,
  manualQuestionPublicationRequired: true,
  futureGeneratedItemsAutomaticallyApproved: false,
  automaticStudentPublication: false,
}) as const;

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = SPATIAL_QUESTION_STUDIO_PACKAGE_V5;
export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = BASE_SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1;
export type SpatialQuestionStudioChapterCodeV1 = SpatialQuestionStudioChapterCodeV5;
export type SpatialQuestionStudioPermanentQlIdV1 = SpatialQuestionStudioPermanentQlIdV5;
export type SpatialQuestionStudioDifficultyV1 = SpatialQuestionStudioDifficultyV5;
