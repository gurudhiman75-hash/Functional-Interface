import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  type SpatialPermanentChapterCodeV1,
  type SpatialPermanentDifficultyV1,
} from "./spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "./spatial-permanent-ql-allocation-v2";
import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./figure-completion-english-freeze-v1";
import { FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./figure-completion-hi-pa-localization-freeze-v1";

export type SpatialQuestionStudioDifficultyV1 = "Easy" | "Medium" | "Hard";
export type SpatialQuestionStudioChapterCodeV1 = SpatialPermanentChapterCodeV1 | "FGC-001";
export type SpatialQuestionStudioPermanentQlIdV1 =
  (typeof SPATIAL_PERMANENT_QL_ALLOCATIONS_V2)[number]["permanentQlId"];

export function spatialQuestionStudioDifficultyV1(
  difficulty: SpatialPermanentDifficultyV1,
): SpatialQuestionStudioDifficultyV1 {
  if (difficulty === "FOUNDATIONAL") return "Easy";
  if (difficulty === "ADVANCED") return "Hard";
  return "Medium";
}

export const SPATIAL_QUESTION_STUDIO_QLS_V1 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.map(
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
  chapterCode: SpatialQuestionStudioChapterCodeV1;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV1;
}>[];

export const SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1 = Object.freeze({
  authority: "SPA_001_PRODUCT_RELEASE_APPROVED_2026_08_16" as const,
  runtimeMode: "CANONICAL_REVIEW" as const,
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  testEligibility: "ELIGIBLE" as const,
  publiclyPublishable: true,
  mockTestEligible: true,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
});

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = Object.freeze({
  packageId: "SPA-001" as const,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  topic: "Reasoning" as const,
  subtopic: "Spatial Reasoning" as const,
  name: "Spatial Reasoning — Approved Multilingual Production Runtime" as const,
  label: "Spatial Reasoning — 34 Permanent QLs" as const,
  generationDomain: "reasoning-v1" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V2-FGC" as const,
  supersedesIntegrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V1" as const,
  localizationAuthority: "SPA_001_HI_PA_LOCALIZATION_APPROVED_2026_08_16" as const,
  fgcLocalizationAuthority: FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  fgcEnglishFreezeAuthority: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
  sourceAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.authorityId,
  frozenBaseAllocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId,
  approvedReviewHead: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.approvedReviewHead,
  fgcApprovedEnglishHead: FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.headSha,
  fgcApprovedLocalizationHead:
    FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.headSha,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V1.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V1,
  chapters: ["MIR-001", "WAT-001", "FAN-001", "FCL-001", "FSR-001", "FGC-001"] as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  enabled: true,
  active: true,
  runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
  reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  registrationStatus: "REGISTERED" as const,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
  questionBankEligible: true,
  testEligibility: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
  testEligible: true,
  mockTestEligible: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
  publiclyPublishable: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
  automaticStudentPublication:
    SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.automaticStudentPublication,
  manualApprovalRequired:
    SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.manualApprovalRequired,
  hindiPunjabiGeneration: true,
  bulkSyncSupported: false,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_QLS_V1.length,
  frozenBasePermanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlCount,
  fgcPermanentQlCount: 4,
  holdsUnallocated: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated,
  sourceScope: {
    SSC: "CONTROLLED_TAXONOMY_EVIDENCE_ESTABLISHED" as const,
    RAILWAY_POLICE_DSSSB: "SUPPORTING_EVIDENCE_PRESENT" as const,
    BANKING: "NOT_ESTABLISHED" as const,
    PUNJAB_STATE: "NOT_ESTABLISHED" as const,
  },
  fgcSourceScope: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.sourceScope,
}) as const;
