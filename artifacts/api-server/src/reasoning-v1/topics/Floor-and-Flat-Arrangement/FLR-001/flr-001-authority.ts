export const FLR_001_PACKAGE_ID = "FLR-001" as const;
export const FLR_001_RUNTIME_MODE = "review-only" as const;
export const FLR_001_FREEZE_VERSION = "FLR_001_CONTENT_FREEZE_2026_10_03_V1" as const;

export type FlrQlId =
  | "FLR-QL-001"
  | "FLR-QL-002"
  | "FLR-QL-003"
  | "FLR-QL-004";

export type FlrCheckpointId =
  | "FLR-CP-001"
  | "FLR-CP-002"
  | "FLR-CP-003"
  | "FLR-CP-004";

export const FLR_001_QL_AUTHORITIES = Object.freeze([
  Object.freeze({
    qlId: "FLR-QL-001" as const,
    checkpointId: "FLR-CP-001" as const,
    title: "Single-column floor arrangement",
    solveContract:
      "Construct a unique one-person-per-floor vertical arrangement from fixed, relative, gap, parity and exclusion clues, then answer a floor or occupant query.",
    answerSemantic: "VERTICAL_SLOT_ASSIGNMENT" as const,
    supportedDifficulties: ["Easy", "Medium"] as const,
    sourceEvidenceRefs: [
      "repo:lib/motifs/seating-arrangement.ts::con-floor-fixed",
      "repo:lib/motifs/seating-arrangement.ts::con-floor-gap",
      "repo:lib/motifs/seating-arrangement.ts::con-floor-parity",
      "repo:LP-001-SOURCE-SATURATION-AUDIT.md::reasoning_aggarwal_floor_family",
      "external:Oliveboard-floor-based-puzzles-2026",
    ] as const,
  }),
  Object.freeze({
    qlId: "FLR-QL-002" as const,
    checkpointId: "FLR-CP-002" as const,
    title: "Floor arrangement with a secondary variable",
    solveContract:
      "Solve a one-person-per-floor arrangement together with one bijective secondary attribute such as study area, using clues that link persons, floors and attributes.",
    answerSemantic: "VERTICAL_MULTI_ATTRIBUTE_ASSIGNMENT" as const,
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "repo:LP-001-SOURCE-SATURATION-AUDIT.md::multi_attribute_puzzle_convention",
      "external:Oliveboard-floor-plus-city-variable-puzzle-2026",
    ] as const,
  }),
  Object.freeze({
    qlId: "FLR-QL-003" as const,
    checkpointId: "FLR-CP-003" as const,
    title: "Two-flat-per-floor grid arrangement",
    solveContract:
      "Solve a two-dimensional building grid in which every flat has exactly one occupant, preserving both vertical floor relations and horizontal flat relations.",
    answerSemantic: "FLOOR_FLAT_GRID_ASSIGNMENT" as const,
    supportedDifficulties: ["Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "external:LIC-AAO-2023-shift3-floor-flat-PYQ",
      "external:IBPSGuide-floor-with-flat-prelims",
    ] as const,
  }),
  Object.freeze({
    qlId: "FLR-QL-004" as const,
    checkpointId: "FLR-CP-004" as const,
    title: "Floor-flat capacity exception",
    solveContract:
      "Solve a floor-flat grid where exactly one flat contains two people while every other flat contains one, without assuming one-to-one occupancy.",
    answerSemantic: "NON_BIJECTIVE_FLOOR_FLAT_CAPACITY_ASSIGNMENT" as const,
    supportedDifficulties: ["Hard"] as const,
    sourceEvidenceRefs: [
      "external:LIC-AAO-2023-shift2-shared-flat-PYQ",
    ] as const,
  }),
] as const);

export const FLR_001_PERMANENT_QL_IDS = Object.freeze(
  FLR_001_QL_AUTHORITIES.map((entry) => entry.qlId),
);

export const FLR_001_CHECKPOINT_IDS = Object.freeze(
  FLR_001_QL_AUTHORITIES.map((entry) => entry.checkpointId),
);

export const FLR_001_CONTENT_CLOSURE = Object.freeze({
  authorityId: "FLR_001_FINAL_CONTENT_DEEP_AUDIT_CLOSURE_20261003_V1" as const,
  status:
    "CONTENT_DEEP_AUDIT_CLOSED__4_QLS__EXACT_ENUMERATION__EN_HI_PA__REVIEW_ONLY" as const,
  packageId: FLR_001_PACKAGE_ID,
  permanentQlRange: "FLR-QL-001..004" as const,
  permanentQlCount: 4 as const,
  nextAvailablePermanentQl: "FLR-QL-005" as const,
  sourcePosture:
    "BANKING_CORE__GOVERNMENT_EXAM_SECONDARY__DIRECT_LIC_AAO_FLAT_PYQ__NO_FALSE_FREQUENCY_CLAIM" as const,
  sourceSaturationClaim:
    "CORE_FLOOR_AND_FLAT_TOPOLOGIES_CLOSED__VACANT_FLAT_AND_THREE_FLAT_VARIANTS_HELD_FOR_FUTURE_SOURCE_REOPEN" as const,
  reviewGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export function flr001AuthorityForQl(qlId: FlrQlId) {
  const found = FLR_001_QL_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error("Unknown FLR-001 QL: " + qlId);
  return found;
}

export function isFlr001QlId(value: string): value is FlrQlId {
  return (FLR_001_PERMANENT_QL_IDS as readonly string[]).includes(value);
}
