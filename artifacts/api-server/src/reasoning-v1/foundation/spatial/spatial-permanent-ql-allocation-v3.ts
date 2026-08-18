import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "./spatial-permanent-ql-allocation-v2";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import type { PfcDiscoveryRepresentationIdV1 } from "./paper-folding-discovery-v1";
import { PFC_001_DISCOVERY_OPERATOR_REVIEW_V1 } from "./paper-folding-discovery-operator-review-v1";
import { PFC_001_SOURCE_AUDIT_V1 } from "./paper-folding-source-audit-v1";

export type PfcPermanentQlIdV3 =
  | "SPA-QL-035"
  | "SPA-QL-036"
  | "SPA-QL-037"
  | "SPA-QL-038";

export interface SpatialPfcPermanentQlAllocationV3 {
  permanentQlId: PfcPermanentQlIdV3;
  proposalId: `PFC-PQL-0${1 | 2 | 3 | 4}`;
  chapterCode: "PFC-001";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  representationIds: readonly PfcDiscoveryRepresentationIdV1[];
  skillAuthority: string;
  allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING";
  discoveryReviewAuthorityId: typeof PFC_001_DISCOVERY_OPERATOR_REVIEW_V1.reviewId;
  sourceAuditAuthorityId: typeof PFC_001_SOURCE_AUDIT_V1.authorityId;
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

function pfcQl(
  permanentQlId: PfcPermanentQlIdV3,
  proposalId: SpatialPfcPermanentQlAllocationV3["proposalId"],
  name: string,
  baseDifficulty: SpatialPermanentDifficultyV1,
  representationIds: readonly PfcDiscoveryRepresentationIdV1[],
  skillAuthority: string,
): SpatialPfcPermanentQlAllocationV3 {
  if (!PFC_001_SOURCE_AUDIT_V1.permanentQlAllocationAllowed) {
    throw new Error("PFC source audit does not allow permanent QL allocation.");
  }
  if (PFC_001_DISCOVERY_OPERATOR_REVIEW_V1.verdict !== "DISCOVERY_LEARNER_REVIEW_COMPLETED_NO_BLOCKER") {
    throw new Error("PFC discovery learner review is not complete.");
  }
  return {
    permanentQlId,
    proposalId,
    chapterCode: "PFC-001",
    name,
    baseDifficulty,
    representationIds,
    skillAuthority,
    allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING",
    discoveryReviewAuthorityId: PFC_001_DISCOVERY_OPERATOR_REVIEW_V1.reviewId,
    sourceAuditAuthorityId: PFC_001_SOURCE_AUDIT_V1.authorityId,
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

export const SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3 = [
  pfcQl(
    "SPA-QL-035",
    "PFC-PQL-01",
    "Axial and repeated-fold unfolding",
    "MODERATE",
    [
      "PFC-PROT-01-SINGLE-AXIAL-HOLE",
      "PFC-PROT-04-REPEATED-SAME-DIRECTION",
    ],
    "Track one-axis reflection and repeated same-axis unfolding without losing layer provenance.",
  ),
  pfcQl(
    "SPA-QL-036",
    "PFC-PQL-02",
    "Compound multi-axis unfolding",
    "ADVANCED",
    [
      "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD",
      "PFC-PROT-07-DIAGONAL-PLUS-AXIAL",
      "PFC-PROT-10-THREE-FOLD-ADVANCED",
    ],
    "Reverse multiple folds in the correct order across different axes and preserve the resulting layer pattern.",
  ),
  pfcQl(
    "SPA-QL-037",
    "PFC-PQL-03",
    "Diagonal and corner-fold unfolding",
    "MODERATE",
    [
      "PFC-PROT-05-CORNER-FOLD",
      "PFC-PROT-06-DIAGONAL-FOLD",
    ],
    "Reflect cuts across diagonal or partial corner folds using the actual overlap rather than whole-sheet assumptions.",
  ),
  pfcQl(
    "SPA-QL-038",
    "PFC-PQL-04",
    "Multiple-cut and edge-notch unfolding",
    "ADVANCED",
    [
      "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH",
      "PFC-PROT-08-MULTIPLE-CUTS",
      "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH",
    ],
    "Propagate more than one cut and preserve the distinction between boundary notches and interior holes while unfolding.",
  ),
] as const satisfies readonly SpatialPfcPermanentQlAllocationV3[];

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V3 = [
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
  ...SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
] as const;

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V3-PFC" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_PFC_ENGLISH_RUNTIME_PENDING" as const,
  frozenBaseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.authorityId,
  frozenBasePermanentQlCount: 34,
  frozenBaseRange: "SPA-QL-001..SPA-QL-034" as const,
  discoveryReviewAuthorityId: PFC_001_DISCOVERY_OPERATOR_REVIEW_V1.reviewId,
  sourceAuditAuthorityId: PFC_001_SOURCE_AUDIT_V1.authorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V3,
  pfcAllocations: SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
  permanentQlCount: 38,
  permanentQlRange: "SPA-QL-001..SPA-QL-038" as const,
  nextAvailablePermanentQlId: "SPA-QL-039" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.chapterCounts,
    "PFC-001": 4,
  },
  sourceScope: {
    ssc: PFC_001_SOURCE_AUDIT_V1.ssc.status,
    banking: PFC_001_SOURCE_AUDIT_V1.banking.status,
    punjabState: PFC_001_SOURCE_AUDIT_V1.punjabState.status,
  },
  lifecycle: {
    pfcEnglishRuntimeImplemented: false,
    pfcEnglishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
  },
  nextGate: "PFC_001_PERMANENT_ENGLISH_RUNTIME_IMPLEMENTATION_AND_REVIEW" as const,
} as const);
