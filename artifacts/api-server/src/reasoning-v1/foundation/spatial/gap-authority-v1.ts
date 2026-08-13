import type { SpatialGapAuthorityEntryV1, SpatialGapIdV1 } from "./gap-types-v1";

const entry = (
  gapId: SpatialGapAuthorityEntryV1["gapId"],
  chapterCode: SpatialGapAuthorityEntryV1["chapterCode"],
  name: string,
  capabilityIds: SpatialGapAuthorityEntryV1["capabilityIds"],
): SpatialGapAuthorityEntryV1 => ({
  gapId,
  chapterCode,
  name,
  sourceAuditId: "SPA-FND-001-SOURCE-SATURATION-AUDIT-V1",
  capabilityIds,
  runtimeStatus: "RUNTIME_CAPABILITY_SCALE_VALIDATED",
  learnerQuestionStatus: "QUESTION_SYNTHESIS_PENDING",
  permanentQlId: null,
});

export const SPATIAL_GAP_AUTHORITY_V1: readonly SpatialGapAuthorityEntryV1[] = [
  entry("FAN-GAP-01", "FAN-001", "Independent component rotations or inversions", ["SELECTED_RIGID_TRANSFORM"]),
  entry("FAN-GAP-02", "FAN-001", "Multi-element cyclic movement or permutation", ["POSITION_CYCLE"]),
  entry("FAN-GAP-03", "FAN-001", "Size enlargement or reduction", ["SELECTED_SCALE"]),
  entry("FAN-GAP-04", "FAN-001", "Inside-outside or hierarchy-level transfer", ["HIERARCHY_TRANSFER", "SELECTED_RIGID_TRANSFORM"]),
  entry("FAN-GAP-05", "FAN-001", "Broader compound multi-operation pipelines", ["PIPELINE_COMPOSITION", "SELECTED_RIGID_TRANSFORM", "FILL_STATE_MUTATION", "COUNT_MUTATION"]),

  entry("FCL-GAP-01", "FCL-001", "Rotational or transform equivalence among options", ["ROTATION_ORBIT_EQUIVALENCE"]),
  entry("FCL-GAP-02", "FCL-001", "General count equality or difference", ["GENERAL_RELATION_EVALUATION", "COUNT_MUTATION"]),
  entry("FCL-GAP-03", "FCL-001", "Replica and relative-size nested relations", ["GENERAL_RELATION_EVALUATION", "SELECTED_SCALE", "HIERARCHY_TRANSFER"]),
  entry("FCL-GAP-04", "FCL-001", "General same opposite diagonal toward-away relations", ["GENERAL_RELATION_EVALUATION", "SELECTED_RIGID_TRANSFORM"]),
  entry("FCL-GAP-05", "FCL-001", "Shaded-region position amount or alternation", ["FILL_STATE_MUTATION", "GENERAL_RELATION_EVALUATION"]),
  entry("FCL-GAP-06", "FCL-001", "Mirror water or rotation relation between subfigures", ["SUBFIGURE_TRANSFORM_RELATION", "SELECTED_RIGID_TRANSFORM"]),

  entry("FSR-GAP-01", "FSR-001", "Reflection or inversion progression", ["SELECTED_RIGID_TRANSFORM", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-02", "FSR-001", "Independent component rotation progression", ["SELECTED_RIGID_TRANSFORM", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-03", "FSR-001", "General cyclic position movement", ["SELECTED_RIGID_TRANSFORM", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-04", "FSR-001", "Decrement removal and multi-element addition progression", ["COUNT_MUTATION", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-05", "FSR-001", "Shading or fill-state progression", ["FILL_STATE_MUTATION", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-06", "FSR-001", "Element substitution or replacement progression", ["NODE_SUBSTITUTION", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-07", "FSR-001", "Permutation or reordering progression", ["POSITION_CYCLE", "PIPELINE_COMPOSITION"]),
  entry("FSR-GAP-08", "FSR-001", "Alternating operation or phase progression", ["ALTERNATING_PIPELINE", "SELECTED_RIGID_TRANSFORM", "FILL_STATE_MUTATION"]),
] as const;

const BY_ID = new Map<SpatialGapIdV1, SpatialGapAuthorityEntryV1>(
  SPATIAL_GAP_AUTHORITY_V1.map((authority) => [authority.gapId, authority]),
);

export function getSpatialGapAuthorityV1(gapId: SpatialGapIdV1): SpatialGapAuthorityEntryV1 {
  const authority = BY_ID.get(gapId);
  if (!authority) throw new Error(`Unknown spatial remediation gap '${gapId}'.`);
  return authority;
}
