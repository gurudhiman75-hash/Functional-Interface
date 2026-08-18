import { PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY } from "./paper-folding-multishape-discovery-v1";
import { PFC_001_SOURCE_SATURATION_AUDIT_V2 } from "./paper-folding-source-saturation-v2";
import { TPF_001_DISCOVERY_WAVE1_AUTHORITY } from "./transparent-pattern-folding-discovery-v1";

export type PfcTpfGapDispositionV1 =
  | "IMPLEMENT_WAVE2"
  | "HOLD_PENDING_DIRECT_SOURCE_RECURRENCE"
  | "EXAM_SCOPE_EVIDENCE_HOLD";

export interface PfcTpfPostExecutionGapV1 {
  gapId: string;
  owner: "PFC-001" | "TPF-001" | "EXAM-SCOPE";
  family: string;
  evidence: string;
  wave1State: string;
  disposition: PfcTpfGapDispositionV1;
  blocksSscCoreSaturation: boolean;
}

export const PFC_TPF_POST_EXECUTION_GAPS_V1: readonly PfcTpfPostExecutionGapV1[] = Object.freeze([
  {
    gapId: "PFC-GAP-W2-001",
    owner: "PFC-001",
    family: "THREE_FOLD_AND_FOUR_STAGE_OPAQUE_SEQUENCES",
    evidence: "Uploaded Paper Cutting corpus contains X/Y/Z and W/X/Y/Z sequence families and repeated SSC-indexed examples.",
    wave1State: "ONE_AND_TWO_FOLD_EXECUTION_PROVED_BUT_THREE_FOLD_SOURCE_SEQUENCE_NOT_EXPLICITLY_PROVED",
    disposition: "IMPLEMENT_WAVE2",
    blocksSscCoreSaturation: true,
  },
  {
    gapId: "PFC-GAP-W2-002",
    owner: "PFC-001",
    family: "CREASE_EDGE_NOTCH_TO_INTERIOR_CUT_TOPOLOGY",
    evidence: "Fold-line edge cuts must join after opening rather than remain duplicate disconnected marks.",
    wave1State: "EDGE_NOTCH_TYPE_EXISTS_BUT_CONNECTED_COMPONENT_COALESCING_NOT_PROVED",
    disposition: "IMPLEMENT_WAVE2",
    blocksSscCoreSaturation: true,
  },
  {
    gapId: "PFC-GAP-W2-003",
    owner: "PFC-001",
    family: "REVERSE_FOLD_PUNCH_GRAMMAR",
    evidence: "Uploaded Disha material contains a dedicated reverse block where the open pattern is given and the folding/punching process must be selected.",
    wave1State: "ONE_HAND_AUTHORED_REVERSE_UNIQUENESS_FIXTURE_ONLY",
    disposition: "IMPLEMENT_WAVE2",
    blocksSscCoreSaturation: true,
  },
  {
    gapId: "TPF-GAP-W2-001",
    owner: "TPF-001",
    family: "RICH_TRANSPARENT_LINE_ART",
    evidence: "Indexed SSC transparent-sheet questions and uploaded references use composite figures such as triangles, circles and multi-segment designs rather than point marks alone.",
    wave1State: "POINT_AND_SEGMENT_PRIMITIVES_ONLY",
    disposition: "IMPLEMENT_WAVE2",
    blocksSscCoreSaturation: true,
  },
  {
    gapId: "TPF-HOLD-001",
    owner: "TPF-001",
    family: "DIAGONAL_TRANSPARENT_FOLD",
    evidence: "No sufficiently strong direct indexed SSC recurrence established in the current saturation pass.",
    wave1State: "EXPLICITLY_REJECTED",
    disposition: "HOLD_PENDING_DIRECT_SOURCE_RECURRENCE",
    blocksSscCoreSaturation: false,
  },
  {
    gapId: "TPF-HOLD-002",
    owner: "TPF-001",
    family: "MULTI_FOLD_TRANSPARENT_SUPERPOSITION",
    evidence: "Current direct SSC evidence is dominated by one dotted-line fold; broader preparation material alone is insufficient to promote this to core.",
    wave1State: "NOT_IMPLEMENTED",
    disposition: "HOLD_PENDING_DIRECT_SOURCE_RECURRENCE",
    blocksSscCoreSaturation: false,
  },
  {
    gapId: "TPF-HOLD-003",
    owner: "TPF-001",
    family: "RECTANGULAR_TRANSPARENT_SOURCE_SHEET",
    evidence: "Preparation material contains rectangular transparent examples, but the current direct indexed SSC recurrence is square-sheet dominant.",
    wave1State: "SQUARE_ONLY",
    disposition: "HOLD_PENDING_DIRECT_SOURCE_RECURRENCE",
    blocksSscCoreSaturation: false,
  },
  {
    gapId: "EXAM-HOLD-BANKING-PFC",
    owner: "EXAM-SCOPE",
    family: "NAMED_IBPS_SBI_DIRECT_PYQ_RECURRENCE",
    evidence: "Preparation relevance exists but the audit still lacks reliable named direct IBPS/SBI PFC PYQ recurrence.",
    wave1State: "NOT_ESTABLISHED",
    disposition: "EXAM_SCOPE_EVIDENCE_HOLD",
    blocksSscCoreSaturation: false,
  },
  {
    gapId: "EXAM-HOLD-PUNJAB-PFC",
    owner: "EXAM-SCOPE",
    family: "NAMED_PUNJAB_STATE_DIRECT_PYQ_RECURRENCE",
    evidence: "Punjab-oriented preparation material contains Paper Cutting & Folding, but direct named official-paper recurrence remains unverified.",
    wave1State: "PREPARATION_RELEVANCE_ONLY",
    disposition: "EXAM_SCOPE_EVIDENCE_HOLD",
    blocksSscCoreSaturation: false,
  },
]);

export const PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1 = Object.freeze({
  authorityId: "PFC-TPF-POST-EXECUTION-SOURCE-GAP-AUDIT-V1" as const,
  sourceAuthority: PFC_001_SOURCE_SATURATION_AUDIT_V2.authorityId,
  pfcWave1Authority: PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY.authorityId,
  tpfWave1Authority: TPF_001_DISCOVERY_WAVE1_AUTHORITY.authorityId,
  exactGreenWave1Head: "38b1d8047c3c5690d6e74ea7cf0d5e1d127590f0" as const,
  exactGreenWave1Run: 32163013843,
  exactGreenWave1Artifact: 9334855376,
  exactGreenWave1ArtifactDigest: "sha256:95ca33ab156f9e4d60e1a9f29237aa1d6aa9dc952e147f89083cefc664042942" as const,
  status: "WAVE1_GREEN_WAVE2_REQUIRED_BEFORE_SSC_CORE_SATURATION" as const,
  blockingGapIds: PFC_TPF_POST_EXECUTION_GAPS_V1.filter((gap) => gap.blocksSscCoreSaturation).map((gap) => gap.gapId),
  heldGapIds: PFC_TPF_POST_EXECUTION_GAPS_V1.filter((gap) => !gap.blocksSscCoreSaturation).map((gap) => gap.gapId),
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
  nextGate: "PFC_TPF_EXECUTABLE_DISCOVERY_WAVE2_AND_POST_WAVE2_SATURATION_AUDIT" as const,
} as const);
