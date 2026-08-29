import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
} from "./spatial-permanent-ql-allocation-v5";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { FCT_001_PRODUCT_OWNER_APPROVAL_V1 } from "./counting-figures-product-owner-approval-v1";

export type CountingFiguresPermanentQlIdV6 = "SPA-QL-042";
export type CountingFiguresProposalIdV6 = "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION";

export interface SpatialCountingFiguresPermanentQlAllocationV6 {
  permanentQlId: CountingFiguresPermanentQlIdV6;
  proposalId: CountingFiguresProposalIdV6;
  chapterCode: "FCT-001";
  skillMode: "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  equivalencePolicy: "TARGET_SHAPE_PARAMETERIZED";
  representationPolicy: "TARGET_SHAPE_LAYOUT_MOTIF_DENSITY_AND_ROTATION_ARE_PARAMETERS_NOT_QLS";
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

function countingFiguresQl(): SpatialCountingFiguresPermanentQlAllocationV6 {
  if (!FCT_001_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("FCT-001 learner surface is not product-owner approved.");
  }
  if (!FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed) {
    throw new Error("FCT-001 approval does not authorize permanent QL allocation.");
  }
  if (FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlId !== "SPA-QL-042") {
    throw new Error("FCT-001 approval is not pinned to SPA-QL-042.");
  }
  if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId !== "SPA-QL-042") {
    throw new Error("SPA-QL-042 is no longer the next available permanent Spatial QL.");
  }
  return {
    permanentQlId: "SPA-QL-042",
    proposalId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION",
    chapterCode: "FCT-001",
    skillMode: "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION",
    name: "Systematic counting of closed figures",
    baseDifficulty: "MODERATE",
    equivalencePolicy: "TARGET_SHAPE_PARAMETERIZED",
    representationPolicy: "TARGET_SHAPE_LAYOUT_MOTIF_DENSITY_AND_ROTATION_ARE_PARAMETERS_NOT_QLS",
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

export const SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6 = [
  countingFiguresQl(),
] as const satisfies readonly SpatialCountingFiguresPermanentQlAllocationV6[];

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V6 = [
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
  ...SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6,
] as const;

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V6-FCT" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_FCT_ENGLISH_RUNTIME_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
  verifiedNewMainHeadAtAllocation: "808a5b36efeb30c301700dd206b3b8dbafc71963" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-041" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-042" as const,
  productOwnerApprovalAuthorityId: FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  approvedProductionAuthorityId: FCT_001_PRODUCT_OWNER_APPROVAL_V1.approvedProductionAuthorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
  countingFiguresAllocations: SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6,
  permanentQlCount: 42,
  permanentQlRange: "SPA-QL-001..SPA-QL-042" as const,
  allocatedRange: "SPA-QL-042" as const,
  nextAvailablePermanentQlId: "SPA-QL-043" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.chapterCounts,
    "FCT-001": 1,
  },
  invariants: {
    targetShapeCreatesStandaloneQl: false,
    triangleSquareRectangleQuadrilateralRemainOneCoreSkill: true,
    motifFamilyCreatesStandaloneQl: false,
    gridSizeCreatesStandaloneQl: false,
    layoutDensityCreatesStandaloneQl: false,
    rotationCreatesStandaloneQl: false,
    distractorMechanismCreatesStandaloneQl: false,
    formulaFirstGridMethodCreatesStandaloneQl: false,
    lineSegmentCountingHeldOutsideCurrentQl: true,
    curvedOrMixedShapeCountingHeldOutsideCurrentQl: true,
  },
  lifecycle: {
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "FCT_001_PERMANENT_ENGLISH_RUNTIME_V1" as const,
} as const);
