import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  type SpatialPermanentDifficultyV1,
} from "./spatial-permanent-ql-allocation-v1";
import {
  FGC_001_CANDIDATE_AUTHORITIES_V1,
  type FigureCompletionCandidateAuthorityIdV1,
} from "./figure-completion-merge-split-proposal-v1";
import { FGC_001_SOURCE_SATURATION_AUTHORITY_V1 } from "./figure-completion-source-saturation-v1";

export type SpatialPermanentChapterCodeV2 = "FGC-001";

export interface SpatialFgcPermanentQlAllocationV2 {
  permanentQlId: `SPA-QL-${string}`;
  proposalId: `FGC-PQL-${string}`;
  candidateAuthorityId: FigureCompletionCandidateAuthorityIdV1;
  chapterCode: SpatialPermanentChapterCodeV2;
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  allocationStatus: "PERMANENT_QL_ALLOCATED_RUNTIME_PENDING";
  sourceSaturationAuthorityVersion: typeof FGC_001_SOURCE_SATURATION_AUTHORITY_V1.version;
  humanReviewedDiscoveryHead: typeof FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.headSha;
  humanReviewedWorkflowRunId: typeof FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.workflowRunId;
  humanReviewedArtifactId: typeof FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.artifactId;
  englishRuntimeImplemented: false;
  englishImplementationFrozen: false;
  active: false;
  questionStudioDiscoverable: false;
  questionStudioRegistrationStatus: "NOT_REGISTERED";
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  hindiPunjabiGeneration: false;
}

function fgcQl(
  permanentQlId: `SPA-QL-${string}`,
  proposalId: `FGC-PQL-${string}`,
  candidateAuthorityId: FigureCompletionCandidateAuthorityIdV1,
  name: string,
  baseDifficulty: SpatialPermanentDifficultyV1,
): SpatialFgcPermanentQlAllocationV2 {
  const candidate = FGC_001_CANDIDATE_AUTHORITIES_V1.find(
    (entry) => entry.candidateId === candidateAuthorityId,
  );
  if (!candidate) {
    throw new Error(`Unknown FGC candidate authority ${candidateAuthorityId}.`);
  }
  if (!FGC_001_SOURCE_SATURATION_AUTHORITY_V1.permanentQlProposal.allowed) {
    throw new Error("FGC source-saturation authority does not allow permanent QL allocation.");
  }

  return {
    permanentQlId,
    proposalId,
    candidateAuthorityId,
    chapterCode: "FGC-001",
    name,
    baseDifficulty,
    allocationStatus: "PERMANENT_QL_ALLOCATED_RUNTIME_PENDING",
    sourceSaturationAuthorityVersion: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.version,
    humanReviewedDiscoveryHead: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.headSha,
    humanReviewedWorkflowRunId: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.workflowRunId,
    humanReviewedArtifactId: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.humanReviewedAuthority.artifactId,
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED",
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  };
}

export const SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2 = [
  fgcQl(
    "SPA-QL-031",
    "FGC-PQL-01",
    "FGC-CAND-A-STRUCTURAL-CONTINUITY",
    "Structural continuity and local connection completion",
    "MODERATE",
  ),
  fgcQl(
    "SPA-QL-032",
    "FGC-PQL-02",
    "FGC-CAND-B-FEATURE-PROPERTY-COMPLETION",
    "Feature and local property completion",
    "MODERATE",
  ),
  fgcQl(
    "SPA-QL-033",
    "FGC-PQL-03",
    "FGC-CAND-C-QUADRANT-SYMMETRY",
    "Quadrant symmetry completion",
    "MODERATE",
  ),
  fgcQl(
    "SPA-QL-034",
    "FGC-PQL-04",
    "FGC-CAND-D-COMPOUND-SYMMETRY-STATE",
    "Compound geometry with visual-state completion",
    "ADVANCED",
  ),
] as const satisfies readonly SpatialFgcPermanentQlAllocationV2[];

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V2 = [
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
  ...SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
] as const;

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2 = {
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V2" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_FGC_RUNTIME_PENDING" as const,
  frozenBaseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId,
  frozenBasePermanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlCount,
  frozenBaseRange: "SPA-QL-001..SPA-QL-030" as const,
  sourceSaturationAuthorityVersion: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.version,
  sourceSaturationStatus: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.status,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
  fgcAllocations: SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
  permanentQlCount: 34,
  permanentQlRange: "SPA-QL-001..SPA-QL-034" as const,
  nextAvailablePermanentQlId: "SPA-QL-035" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.chapterCounts,
    "FGC-001": 4,
  },
  sourceScope: FGC_001_SOURCE_SATURATION_AUTHORITY_V1.sourceScope,
  lifecycle: {
    fgcEnglishRuntimeImplemented: false,
    fgcEnglishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  },
  nextGate: "FGC_001_ENGLISH_RUNTIME_IMPLEMENTATION_AND_REVIEW" as const,
} as const;
