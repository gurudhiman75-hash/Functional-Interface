import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
} from "./spatial-permanent-ql-allocation-v4";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1 } from "./embedded-figure-product-owner-approval-v1";

export type EmbeddedFigurePermanentQlIdV5 = "SPA-QL-041";
export type EmbeddedFigureProposalIdV5 = "EMB-PROP-01";

export interface SpatialEmbeddedFigurePermanentQlAllocationV5 {
  permanentQlId: EmbeddedFigurePermanentQlIdV5;
  proposalId: EmbeddedFigureProposalIdV5;
  chapterCode: "EMB-001";
  skillMode: "FIXED_ORIENTATION_EMBEDDED_SUBGRAPH";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  equivalencePolicy: "FIXED_ORIENTATION";
  representationPolicy: "DENSITY_SCALE_CROSSINGS_AND_MOTIF_ARE_PARAMETERS_NOT_QLS";
  provenancePolicy: "SSC_DIRECT_SOURCE_BACKED_CORE";
  allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING";
  englishRuntimeImplemented: false;
  englishImplementationFrozen: false;
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function embeddedFigureQl(): SpatialEmbeddedFigurePermanentQlAllocationV5 {
  if (!EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("EMB-001 learner surface is not product-owner approved.");
  }
  if (!EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed) {
    throw new Error("EMB-001 approval does not authorize permanent QL allocation.");
  }
  if (EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlId !== "SPA-QL-041") {
    throw new Error("EMB-001 approval is not pinned to SPA-QL-041.");
  }
  return {
    permanentQlId: "SPA-QL-041",
    proposalId: "EMB-PROP-01",
    chapterCode: "EMB-001",
    skillMode: "FIXED_ORIENTATION_EMBEDDED_SUBGRAPH",
    name: "Embedded figure identification without rotation",
    baseDifficulty: "MODERATE",
    equivalencePolicy: "FIXED_ORIENTATION",
    representationPolicy: "DENSITY_SCALE_CROSSINGS_AND_MOTIF_ARE_PARAMETERS_NOT_QLS",
    provenancePolicy: "SSC_DIRECT_SOURCE_BACKED_CORE",
    allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING",
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

export const SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5 = [
  embeddedFigureQl(),
] as const satisfies readonly SpatialEmbeddedFigurePermanentQlAllocationV5[];

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V5 = [
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
  ...SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5,
] as const;

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V5-EMB" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_EMB_ENGLISH_RUNTIME_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId,
  verifiedNewMainHeadAtAllocation: "b84e4cbd46f97a2524fc69959ed69898fcd0a42e" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-040" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-041" as const,
  productOwnerApprovalAuthorityId: EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  approvedReviewAuthorityId: EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approvedLearnerReviewAuthorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
  embeddedFigureAllocations: SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5,
  permanentQlCount: 41,
  permanentQlRange: "SPA-QL-001..SPA-QL-041" as const,
  allocatedRange: "SPA-QL-041" as const,
  nextAvailablePermanentQlId: "SPA-QL-042" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.chapterCounts,
    "EMB-001": 1,
  },
  invariants: {
    motifFamilyCreatesStandaloneQl: false,
    concealmentDensityCreatesStandaloneQl: false,
    targetScaleCreatesStandaloneQl: false,
    crossingCountCreatesStandaloneQl: false,
    distractorMechanismCreatesStandaloneQl: false,
    representationVariantCreatesStandaloneQl: false,
    fixedOrientationIsCurrentSscCoreBoundary: true,
    rotationAllowedWouldRequireSeparateEvidenceAndGovernedBoundary: true,
    reflectionAllowedWouldRequireSeparateEvidenceAndGovernedBoundary: true,
  },
  lifecycle: {
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "EMB_001_PERMANENT_ENGLISH_RUNTIME_V1" as const,
} as const);
