export type Sea002AdvancedQlId =
  | "SEA-QL-036"
  | "SEA-QL-037"
  | "SEA-QL-038"
  | "SEA-QL-039"
  | "SEA-QL-040"
  | "SEA-QL-041"
  | "SEA-QL-042";

export type Sea002AdvancedCheckpointId = "SEA-CP-009" | "SEA-CP-010";

export const SEA002_ADVANCED_QL_AUTHORITIES = Object.freeze([
  Object.freeze({
    qlId: "SEA-QL-036" as const,
    checkpointId: "SEA-CP-009" as const,
    label: "Rectangular corner/side seating with uniform facing",
    solveContract:
      "Solve an eight-seat rectangular perimeter with alternating corner and side-centre roles under one global facing direction.",
    answerSemantic: "POLYGON_PERIMETER_POSITION",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-seating-arrangement-polygonal",
      "external:testbook-bidirectional-polygon",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-037" as const,
    checkpointId: "SEA-CP-009" as const,
    label: "Rectangular role-derived mixed facing",
    solveContract:
      "Solve an eight-seat rectangular perimeter where corner and side-centre roles determine different inward/outward facings before person-relative movement is applied.",
    answerSemantic: "POLYGON_ROLE_DERIVED_FACING_POSITION",
    supportedDifficulties: ["Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-bidirectional-polygon",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-038" as const,
    checkpointId: "SEA-CP-009" as const,
    label: "Regular-polygon uniform facing",
    solveContract:
      "Solve a six-seat regular-polygon perimeter under a uniform inward or outward facing rule using adjacency, opposite and relative-position clues.",
    answerSemantic: "REGULAR_POLYGON_POSITION",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-seating-arrangement-polygonal",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-039" as const,
    checkpointId: "SEA-CP-009" as const,
    label: "Regular-polygon independent mixed facing",
    solveContract:
      "Jointly infer six people's perimeter positions and inward/outward facings before applying person-relative left/right clues.",
    answerSemantic: "REGULAR_POLYGON_POSITION_AND_FACING",
    supportedDifficulties: ["Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-bidirectional-polygon",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-040" as const,
    checkpointId: "SEA-CP-010" as const,
    label: "Concentric circles with fixed ring membership",
    solveContract:
      "Solve equal inner and outer circular groups with supplied ring membership, opposite-ring facing correspondence and ring-relative positions.",
    answerSemantic: "CONCENTRIC_FIXED_RING_POSITION",
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-concentric-arrangement",
      "external:testbook-lic-assistant-concentric",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-041" as const,
    checkpointId: "SEA-CP-010" as const,
    label: "Concentric circles with inferred ring membership",
    solveContract:
      "Infer inner/outer group membership together with cyclic position from same-ring and cross-ring facing constraints.",
    answerSemantic: "CONCENTRIC_INFERRED_RING_POSITION",
    supportedDifficulties: ["Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-concentric-arrangement",
    ] as const,
  }),
  Object.freeze({
    qlId: "SEA-QL-042" as const,
    checkpointId: "SEA-CP-010" as const,
    label: "Concentric circles with independent mixed facing",
    solveContract:
      "Jointly infer cyclic positions and individual inward/outward facings across two linked rings while preserving cross-ring correspondence.",
    answerSemantic: "CONCENTRIC_POSITION_AND_FACING",
    supportedDifficulties: ["Hard"] as const,
    sourceEvidenceRefs: [
      "external:testbook-concentric-arrangement",
      "external:testbook-concentric-mcq",
    ] as const,
  }),
] as const);

export const SEA002_CP009_PERMANENT_QL_IDS = Object.freeze(
  SEA002_ADVANCED_QL_AUTHORITIES.filter((entry) => entry.checkpointId === "SEA-CP-009").map((entry) => entry.qlId),
);

export const SEA002_CP010_PERMANENT_QL_IDS = Object.freeze(
  SEA002_ADVANCED_QL_AUTHORITIES.filter((entry) => entry.checkpointId === "SEA-CP-010").map((entry) => entry.qlId),
);

export const SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID = "SEA-QL-043" as const;

export function sea002AdvancedAuthority(qlId: Sea002AdvancedQlId) {
  const found = SEA002_ADVANCED_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error("Unknown SEA-002 advanced QL: " + qlId);
  return found;
}
