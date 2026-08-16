import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  type SpatialPermanentChapterCodeV1,
  type SpatialPermanentDifficultyV1,
} from "./spatial-permanent-ql-allocation-v1";

export type SpatialQuestionStudioDifficultyV1 = "Easy" | "Medium" | "Hard";

export function spatialQuestionStudioDifficultyV1(
  difficulty: SpatialPermanentDifficultyV1,
): SpatialQuestionStudioDifficultyV1 {
  if (difficulty === "FOUNDATIONAL") return "Easy";
  if (difficulty === "ADVANCED") return "Hard";
  return "Medium";
}

export const SPATIAL_QUESTION_STUDIO_QLS_V1 = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map(
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
  chapterCode: SpatialPermanentChapterCodeV1;
  name: string;
  difficulty: SpatialQuestionStudioDifficultyV1;
}>[];

export const SPATIAL_QUESTION_STUDIO_PACKAGE_V1 = Object.freeze({
  packageId: "SPA-001" as const,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  topic: "Reasoning" as const,
  subtopic: "Spatial Reasoning" as const,
  name: "Spatial Reasoning — Approved English Review Runtime" as const,
  label: "Spatial Reasoning — 30 Permanent QLs" as const,
  generationDomain: "reasoning-v1" as const,
  integrationAuthority: "SPA-FND-001-QUESTION-STUDIO-INTEGRATION-V1" as const,
  sourceAllocationAuthority:
    SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId,
  approvedReviewHead:
    SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.approvedReviewHead,
  qlIds: SPATIAL_QUESTION_STUDIO_QLS_V1.map((entry) => entry.permanentQlId),
  qls: SPATIAL_QUESTION_STUDIO_QLS_V1,
  chapters: ["MIR-001", "WAT-001", "FAN-001", "FCL-001", "FSR-001"] as const,
  supportedLanguages: ["en"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  enabled: true,
  active: true,
  reviewOnly: true,
  runtimeMode: "APPROVED_PERMANENT_ENGLISH_SPATIAL_V1" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_REGISTERED" as const,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  registrationStatus: "REGISTERED" as const,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false,
  questionBankEligible: false,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  manualApprovalRequired: true,
  hindiPunjabiGeneration: false,
  bulkSyncSupported: false,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_QLS_V1.length,
  holdsUnallocated:
    SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated,
  sourceScope: {
    SSC: "CONTROLLED_TAXONOMY_EVIDENCE_ESTABLISHED" as const,
    RAILWAY_POLICE_DSSSB: "SUPPORTING_EVIDENCE_PRESENT" as const,
    BANKING: "NOT_ESTABLISHED" as const,
    PUNJAB_STATE: "NOT_ESTABLISHED" as const,
  },
}) as const;
