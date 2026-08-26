import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "./paper-folding-localization-freeze-v2";
import { PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1 } from "./paper-folding-question-studio-seeded-runtime-v1";
import { SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4 } from "./spatial-permanent-ql-allocation-v4";

export const PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-INTEGRATION-V1" as const,
  packageId: "SPA-001" as const,
  chapterCodes: ["PFC-001", "TPF-001"] as const,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  permanentQlCount: 6,
  qlIds: SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.map((entry) => entry.permanentQlId),
  qls: SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.map((entry) => ({
    permanentQlId: entry.permanentQlId,
    proposalId: entry.proposalId,
    chapterCode: entry.chapterCode,
    name: entry.name,
    difficulty: entry.baseDifficulty === "ADVANCED" ? "Hard" as const : "Medium" as const,
  })),
  supportedLanguages: ["en", "hi", "pa"] as const,
  localizationFreezeAuthorityId: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  seededRuntimeAuthorityId: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  generationModel: "EXACT_SOLVER_SEEDED_PARAMETER_EXPANSION" as const,
  canonicalArchetypesAreGenerationCeiling: false,
  provenancePolicy: {
    sourceBackedCoreAllowed: true,
    controlledNovelAllowed: true,
    experimentalStretchAllowed: false,
    falsePyqAttributionAllowed: false,
  },
  status: "INTEGRATION_CANDIDATE_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioVisible: false,
  questionStudioDiscoverable: false,
  registrationStatus: "NOT_REGISTERED_PENDING_OPERATOR_REVIEW" as const,
  persistenceAllowed: false,
  databaseWriteEnabled: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_DECISION" as const,
} as const);
