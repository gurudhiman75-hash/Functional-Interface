import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "./spatial-permanent-ql-allocation-v2";
import type { SpatialPermanentDifficultyV1 } from "./spatial-permanent-ql-allocation-v1";
import { PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1 } from "./paper-folding-final-combined-product-owner-approval-v1";

export type PfcTpfPermanentQlIdV4 =
  | "SPA-QL-035"
  | "SPA-QL-036"
  | "SPA-QL-037"
  | "SPA-QL-038"
  | "SPA-QL-039"
  | "SPA-QL-040";

export type PfcTpfProposalIdV4 =
  | "PFC-PROP-01"
  | "PFC-PROP-02"
  | "PFC-PROP-03"
  | "PFC-PROP-04"
  | "PFC-PROP-05"
  | "TPF-PROP-01";

export interface SpatialPfcTpfPermanentQlAllocationV4 {
  permanentQlId: PfcTpfPermanentQlIdV4;
  proposalId: PfcTpfProposalIdV4;
  chapterCode: "PFC-001" | "TPF-001";
  skillMode: "FORWARD_UNFOLD" | "REVERSE_INFERENCE" | "TRANSPARENT_SUPERPOSITION";
  name: string;
  baseDifficulty: SpatialPermanentDifficultyV1;
  representationPolicy: "REPRESENTATION_AXIS_NOT_QL";
  provenancePolicy: "SOURCE_BACKED_AND_CONTROLLED_NOVEL_ALLOWED_WITH_TAGS";
  allocationStatus: "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING";
  englishRuntimeImplemented: false;
  englishImplementationFrozen: false;
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function ql(
  permanentQlId: PfcTpfPermanentQlIdV4,
  proposalId: PfcTpfProposalIdV4,
  chapterCode: "PFC-001" | "TPF-001",
  skillMode: SpatialPfcTpfPermanentQlAllocationV4["skillMode"],
  name: string,
  baseDifficulty: SpatialPermanentDifficultyV1,
): SpatialPfcTpfPermanentQlAllocationV4 {
  if (!PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("Final PFC/TPF English learner surface has not been product-owner approved.");
  }
  if (!PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed) {
    throw new Error("Final PFC/TPF approval does not authorize permanent QL allocation.");
  }
  return {
    permanentQlId,
    proposalId,
    chapterCode,
    skillMode,
    name,
    baseDifficulty,
    representationPolicy: "REPRESENTATION_AXIS_NOT_QL",
    provenancePolicy: "SOURCE_BACKED_AND_CONTROLLED_NOVEL_ALLOWED_WITH_TAGS",
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

export const SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4 = [
  ql("SPA-QL-035", "PFC-PROP-01", "PFC-001", "FORWARD_UNFOLD", "Axial and repeated-fold unfolding", "MODERATE"),
  ql("SPA-QL-036", "PFC-PROP-02", "PFC-001", "FORWARD_UNFOLD", "Compound multi-axis and multi-fold unfolding", "ADVANCED"),
  ql("SPA-QL-037", "PFC-PROP-03", "PFC-001", "FORWARD_UNFOLD", "Diagonal and corner-fold unfolding", "MODERATE"),
  ql("SPA-QL-038", "PFC-PROP-04", "PFC-001", "FORWARD_UNFOLD", "Multiple-cut and cut-topology unfolding", "ADVANCED"),
  ql("SPA-QL-039", "PFC-PROP-05", "PFC-001", "REVERSE_INFERENCE", "Reverse fold-and-punch inference", "ADVANCED"),
  ql("SPA-QL-040", "TPF-PROP-01", "TPF-001", "TRANSPARENT_SUPERPOSITION", "Single-fold transparent pattern superposition", "MODERATE"),
] as const satisfies readonly SpatialPfcTpfPermanentQlAllocationV4[];

export const SPATIAL_PERMANENT_QL_ALLOCATIONS_V4 = [
  ...SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
  ...SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4,
] as const;

export const SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4 = Object.freeze({
  authorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V4-PFC-TPF" as const,
  status: "PERMANENT_QL_ALLOCATION_EXTENDED_PFC_TPF_ENGLISH_RUNTIME_PENDING" as const,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.authorityId,
  verifiedNewMainHeadAtAllocation: "dba3ca565b9caaa4ebace05227ceb644ae0e186f" as const,
  verifiedBaseRange: "SPA-QL-001..SPA-QL-034" as const,
  verifiedBaseNextAvailablePermanentQlId: "SPA-QL-035" as const,
  supersedesBranchDraftAuthorityId: "SPA-FND-001-PERMANENT-QL-ALLOCATION-V3-PFC" as const,
  productOwnerApprovalAuthorityId: PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  approvedReviewAuthorityId: PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.approvedReviewAuthorityId,
  allocations: SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
  pfcTpfAllocations: SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4,
  permanentQlCount: 40,
  permanentQlRange: "SPA-QL-001..SPA-QL-040" as const,
  allocatedRange: "SPA-QL-035..SPA-QL-040" as const,
  nextAvailablePermanentQlId: "SPA-QL-041" as const,
  chapterCounts: {
    ...SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.chapterCounts,
    "PFC-001": 5,
    "TPF-001": 1,
  },
  invariants: {
    paperShapeCreatesStandaloneQl: false,
    cutShapeCreatesStandaloneQl: false,
    foldDirectionCreatesStandaloneQl: false,
    sourceBackedVsControlledNovelCreatesStandaloneQl: false,
    forwardVsReverseCreatesSkillBoundary: true,
    opaqueVsTransparentCreatesChapterBoundary: true,
  },
  lifecycle: {
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  nextGate: "PFC_TPF_PERMANENT_ENGLISH_RUNTIME_V3" as const,
} as const);
