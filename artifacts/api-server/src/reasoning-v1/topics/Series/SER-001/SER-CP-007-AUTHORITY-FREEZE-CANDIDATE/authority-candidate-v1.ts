export const SER_CP007_AUTHORITY_CANDIDATE_V1 =
  "SER_CP007_AUTHORITY_CANDIDATE_V1" as const;

export const SER_CP007_AUTHORITY_CANDIDATE_V1_IDS = [
  "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  "CUMULATIVE_PREFIX_CLUSTER",
  "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  "EDGE_DELETION_WORD_SEQUENCE",
  "INTERLEAVED_CLUSTER_SERIES",
  "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
  "PERIODIC_BLOCK_COMPLETION",
  "POSITION_PERMUTATION_CLUSTER",
  "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  "SYMMETRIC_EDGE_GROWTH",
] as const;

export type SerCp007AuthorityCandidateV1Id =
  (typeof SER_CP007_AUTHORITY_CANDIDATE_V1_IDS)[number];

export type SerCp007DiscoveryAuthorityId =
  | "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE"
  | "ALTERNATING_BLOCK_COMPLETION"
  | "COLUMNWISE_FIXED_CLUSTER_MOVEMENT"
  | "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT"
  | "CUMULATIVE_PREFIX_CLUSTER"
  | "CYCLIC_CLUSTER_PERMUTATION"
  | "EDGE_DELETION_WORD_SEQUENCE"
  | "FIXED_POSITION_PERMUTATION_CLUSTER"
  | "GROWING_CONSECUTIVE_CLUSTER"
  | "K_INTERLEAVED_CLUSTER_SERIES"
  | "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME"
  | "PATTERNED_INTERIOR_INSERTION_GROWTH"
  | "PROGRESSIVE_POSITIONAL_SUBSTITUTION"
  | "REPEATED_BLOCK_COMPLETION"
  | "SYMMETRIC_EDGE_GROWTH"
  | "TWO_INTERLEAVED_CLUSTER_SERIES"
  | "VARIABLE_LENGTH_CONSECUTIVE_CLUSTER";

export type SerCp007DiscoveryWaveId =
  | "SER-CP-007-WAVE-A"
  | "SER-CP-007-WAVE-B"
  | "SER-CP-007-WAVE-C"
  | "SER-CP-007-WAVE-D"
  | "SER-CP-007-WAVE-E";

export type SerCp007CandidateSourceDisposition =
  | "SOURCE_SHAPED_DISCOVERY"
  | "SOURCE_LEDGER_RESOLVED"
  | "SOURCE_LEDGER_COLLISION"
  | "SATURATION_ONLY_SERIES"
  | "SATURATION_ONLY_SERIES_COLLISION";

export type SerCp007CandidateProofModel =
  | "DIRECT_COLUMN_MOVEMENT"
  | "INTERLEAVED_ROWS"
  | "POSITION_TRANSFORMATION"
  | "LENGTH_OR_CONTENT_CHANGE"
  | "CONTINUOUS_GAP_COMPLETION"
  | "MARKER_OR_BOUNDARY_MOVEMENT";

export type SerCp007PermutationKind =
  | "CYCLIC_ROTATION"
  | "PAIRWISE_ADJACENT_SWAP"
  | "FULL_REVERSAL"
  | "ODD_EVEN_REORDER"
  | null;

export interface SerCp007AuthorityCandidateV1Metadata {
  readonly candidateVersion: typeof SER_CP007_AUTHORITY_CANDIDATE_V1;
  readonly candidateAuthorityId: SerCp007AuthorityCandidateV1Id;
  readonly migrationSourceAuthorityId: SerCp007DiscoveryAuthorityId;
  readonly discoveryWaveId: SerCp007DiscoveryWaveId;
  readonly sourceRuleId: string;
  readonly sourceDisposition: SerCp007CandidateSourceDisposition;
  readonly proofModel: SerCp007CandidateProofModel;
  readonly subtypeId: string;
  readonly rowCount: number | null;
  readonly lengthDeltaDirection: "GROWING" | "SHRINKING" | null;
  readonly blockCycleLength: number | null;
  readonly permutationKind: SerCp007PermutationKind;
  readonly learnerRenderer: string;
  readonly permanentQlId: null;
  readonly freezeApproved: false;
}

export const SER_CP007_AUTHORITY_CANDIDATE_V1_MAP: Readonly<
  Record<SerCp007DiscoveryAuthorityId, SerCp007AuthorityCandidateV1Id>
> = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE:
    "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  ALTERNATING_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "COLUMNWISE_FIXED_CLUSTER_MOVEMENT",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT:
    "COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT",
  CUMULATIVE_PREFIX_CLUSTER: "CUMULATIVE_PREFIX_CLUSTER",
  CYCLIC_CLUSTER_PERMUTATION: "POSITION_PERMUTATION_CLUSTER",
  EDGE_DELETION_WORD_SEQUENCE: "EDGE_DELETION_WORD_SEQUENCE",
  FIXED_POSITION_PERMUTATION_CLUSTER: "POSITION_PERMUTATION_CLUSTER",
  GROWING_CONSECUTIVE_CLUSTER: "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  K_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME:
    "MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME",
  PATTERNED_INTERIOR_INSERTION_GROWTH:
    "PATTERNED_INTERIOR_INSERTION_GROWTH",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION:
    "PROGRESSIVE_POSITIONAL_SUBSTITUTION",
  REPEATED_BLOCK_COMPLETION: "PERIODIC_BLOCK_COMPLETION",
  SYMMETRIC_EDGE_GROWTH: "SYMMETRIC_EDGE_GROWTH",
  TWO_INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_CLUSTER_SERIES",
  VARIABLE_LENGTH_CONSECUTIVE_CLUSTER:
    "DIRECTIONAL_CONSECUTIVE_CLUSTER",
};

const PROOF_MODEL_BY_CANDIDATE: Readonly<
  Record<SerCp007AuthorityCandidateV1Id, SerCp007CandidateProofModel>
> = {
  ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE: "POSITION_TRANSFORMATION",
  COLUMNWISE_FIXED_CLUSTER_MOVEMENT: "DIRECT_COLUMN_MOVEMENT",
  COLUMNWISE_PROGRESSIVE_CLUSTER_MOVEMENT: "DIRECT_COLUMN_MOVEMENT",
  CUMULATIVE_PREFIX_CLUSTER: "LENGTH_OR_CONTENT_CHANGE",
  DIRECTIONAL_CONSECUTIVE_CLUSTER: "LENGTH_OR_CONTENT_CHANGE",
  EDGE_DELETION_WORD_SEQUENCE: "LENGTH_OR_CONTENT_CHANGE",
  INTERLEAVED_CLUSTER_SERIES: "INTERLEAVED_ROWS",
  MARKER_BLOCK_POSITION_SHIFT_OVER_PERIODIC_FRAME:
    "MARKER_OR_BOUNDARY_MOVEMENT",
  PATTERNED_INTERIOR_INSERTION_GROWTH: "LENGTH_OR_CONTENT_CHANGE",
  PERIODIC_BLOCK_COMPLETION: "CONTINUOUS_GAP_COMPLETION",
  POSITION_PERMUTATION_CLUSTER: "POSITION_TRANSFORMATION",
  PROGRESSIVE_POSITIONAL_SUBSTITUTION: "MARKER_OR_BOUNDARY_MOVEMENT",
  SYMMETRIC_EDGE_GROWTH: "LENGTH_OR_CONTENT_CHANGE",
};

function sourceDispositionFor(
  discoveryWaveId: SerCp007DiscoveryWaveId,
  sourceRuleId: string,
): SerCp007CandidateSourceDisposition {
  if (discoveryWaveId === "SER-CP-007-WAVE-D") {
    return sourceRuleId === "FOUR_INTERLEAVED_CLUSTER_ROWS"
      ? "SATURATION_ONLY_SERIES_COLLISION"
      : "SATURATION_ONLY_SERIES";
  }
  if (
    discoveryWaveId === "SER-CP-007-WAVE-E" &&
    sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION"
  ) {
    return "SOURCE_LEDGER_COLLISION";
  }
  if (discoveryWaveId === "SER-CP-007-WAVE-E") {
    return "SOURCE_LEDGER_RESOLVED";
  }
  return "SOURCE_SHAPED_DISCOVERY";
}

function rowCountFor(sourceRuleId: string): number | null {
  switch (sourceRuleId) {
    case "TWO_INTERLEAVED_CLUSTER_ROWS":
    case "ALTERNATING_FRAME_CORE_ROWS":
    case "NEXT_TWO_INTERLEAVED_ROWS":
      return 2;
    case "THREE_INTERLEAVED_CLUSTER_ROWS":
      return 3;
    case "FOUR_INTERLEAVED_CLUSTER_ROWS":
      return 4;
    default:
      return null;
  }
}

function lengthDirectionFor(
  sourceRuleId: string,
): "GROWING" | "SHRINKING" | null {
  switch (sourceRuleId) {
    case "SHRINKING_CONSECUTIVE_BLOCKS":
      return "SHRINKING";
    case "GROWING_CONSECUTIVE_BLOCKS":
    case "NEXT_TWO_GROWING_CLUSTER":
      return "GROWING";
    default:
      return null;
  }
}

function blockCycleLengthFor(sourceRuleId: string): number | null {
  switch (sourceRuleId) {
    case "REPEATED_BLOCK_GAPS":
    case "REPEATED_BLOCK_MULTI_GAP_GROUPS":
      return 1;
    case "ALTERNATING_BLOCK_GAPS":
    case "ALTERNATING_BLOCK_MULTI_GAP_GROUPS":
      return 2;
    default:
      return null;
  }
}

function permutationKindFor(sourceRuleId: string): SerCp007PermutationKind {
  switch (sourceRuleId) {
    case "CYCLIC_CLUSTER_ROTATION":
    case "NEXT_TWO_ROTATION":
    case "UNIFORM_FRAME_CASE_MARKER_ROTATION":
      return "CYCLIC_ROTATION";
    case "PAIRWISE_ADJACENT_SWAP_PERMUTATION":
      return "PAIRWISE_ADJACENT_SWAP";
    case "FULL_REVERSAL_PERMUTATION":
      return "FULL_REVERSAL";
    case "ODD_EVEN_POSITION_REORDERING":
      return "ODD_EVEN_REORDER";
    default:
      return null;
  }
}

function rendererFor(
  candidateAuthorityId: SerCp007AuthorityCandidateV1Id,
  sourceRuleId: string,
): string {
  if (candidateAuthorityId === "POSITION_PERMUTATION_CLUSTER") {
    switch (permutationKindFor(sourceRuleId)) {
      case "CYCLIC_ROTATION":
        return "ROTATION_MOVEMENT";
      case "PAIRWISE_ADJACENT_SWAP":
        return "NEIGHBOUR_PAIR_SWAP";
      case "FULL_REVERSAL":
        return "RIGHT_TO_LEFT_REVERSAL";
      case "ODD_EVEN_REORDER":
        return "ODD_THEN_EVEN_POSITIONS";
      case null:
        return "GENERAL_POSITION_PERMUTATION";
    }
  }
  if (candidateAuthorityId === "INTERLEAVED_CLUSTER_SERIES") {
    return "INTERLEAVED_ROW_TABLE";
  }
  if (candidateAuthorityId === "DIRECTIONAL_CONSECUTIVE_CLUSTER") {
    return "CONSECUTIVE_LENGTH_AND_GAP_PROGRESS";
  }
  if (candidateAuthorityId === "PERIODIC_BLOCK_COMPLETION") {
    return "PERIODIC_BLOCK_RECONSTRUCTION";
  }
  return PROOF_MODEL_BY_CANDIDATE[candidateAuthorityId];
}

export function serCp007AuthorityCandidateV1Metadata(input: {
  readonly migrationSourceAuthorityId: SerCp007DiscoveryAuthorityId;
  readonly discoveryWaveId: SerCp007DiscoveryWaveId;
  readonly sourceRuleId: string;
}): SerCp007AuthorityCandidateV1Metadata {
  const candidateAuthorityId =
    SER_CP007_AUTHORITY_CANDIDATE_V1_MAP[input.migrationSourceAuthorityId];
  return {
    candidateVersion: SER_CP007_AUTHORITY_CANDIDATE_V1,
    candidateAuthorityId,
    migrationSourceAuthorityId: input.migrationSourceAuthorityId,
    discoveryWaveId: input.discoveryWaveId,
    sourceRuleId: input.sourceRuleId,
    sourceDisposition: sourceDispositionFor(
      input.discoveryWaveId,
      input.sourceRuleId,
    ),
    proofModel: PROOF_MODEL_BY_CANDIDATE[candidateAuthorityId],
    subtypeId: input.sourceRuleId,
    rowCount: rowCountFor(input.sourceRuleId),
    lengthDeltaDirection: lengthDirectionFor(input.sourceRuleId),
    blockCycleLength: blockCycleLengthFor(input.sourceRuleId),
    permutationKind: permutationKindFor(input.sourceRuleId),
    learnerRenderer: rendererFor(candidateAuthorityId, input.sourceRuleId),
    permanentQlId: null,
    freezeApproved: false,
  };
}
