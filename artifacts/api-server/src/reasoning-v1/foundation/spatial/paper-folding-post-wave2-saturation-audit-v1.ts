import { PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY } from "./paper-folding-source-saturated-discovery-v2";
import { PFC_TPF_POST_EXECUTION_GAPS_V1 } from "./paper-folding-post-execution-source-gap-audit-v1";
import { TPF_001_DISCOVERY_WAVE2_AUTHORITY } from "./transparent-pattern-folding-discovery-v2";

const closedGapIds = [
  "PFC-GAP-W2-001",
  "PFC-GAP-W2-002",
  "PFC-GAP-W2-003",
  "TPF-GAP-W2-001",
] as const;

const remaining = PFC_TPF_POST_EXECUTION_GAPS_V1.filter((gap) => !closedGapIds.includes(gap.gapId as typeof closedGapIds[number]));

export const PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1 = Object.freeze({
  authorityId: "PFC-TPF-POST-WAVE2-SATURATION-AUDIT-V1" as const,
  pfcWave2Authority: PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY.authorityId,
  tpfWave2Authority: TPF_001_DISCOVERY_WAVE2_AUTHORITY.authorityId,
  closedSourceBackedCoreGapIds: closedGapIds,
  remainingHeldGapIds: remaining.map((gap) => gap.gapId),
  unimplementedSourceBackedSscCoreGapCount: 0,
  status: "SSC_CORE_SOURCE_SATURATION_CANDIDATE_PENDING_EXECUTABLE_CI_AND_MERGE_SPLIT_REVIEW" as const,
  scopeBoundary: {
    pfc: "OPAQUE_FORWARD_AND_REVERSE_CORE" as const,
    tpf: "SQUARE_SINGLE_VERTICAL_OR_HORIZONTAL_TRANSPARENT_SUPERPOSITION_CORE" as const,
    banking: "DIRECT_PYQ_RECURRENCE_NOT_CLAIMED" as const,
    punjabState: "DIRECT_PYQ_RECURRENCE_NOT_CLAIMED" as const,
  },
  heldFamiliesAreNotSilentlyGenerated: true,
  mergeSplitReviewAllowedAfterExactHeadGreen: true,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
  nextGate: "PFC_TPF_SOURCE_SATURATED_MERGE_SPLIT_AND_QL_PROPOSAL" as const,
} as const);
