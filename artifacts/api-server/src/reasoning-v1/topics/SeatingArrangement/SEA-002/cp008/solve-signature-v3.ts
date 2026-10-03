import { SEA002_CP008_WAVE02_SOLVE_SIGNATURES } from "./solve-signature-v2.ts";

export const SEA002_CP008_WAVE03_SOLVE_SIGNATURES = Object.freeze({
  ...SEA002_CP008_WAVE02_SOLVE_SIGNATURES,
  "SEA-CP008-SIG-G": Object.freeze({
    label: "Variable square-side occupancy with uniform inward facing",
    operations: Object.freeze([
      "SQUARE_SIDE_OCCUPANCY_PATTERN",
      "SAME_SIDE_GROUP",
      "OPPOSITE_SIDE_CORRESPONDENCE",
      "UNIFORM_INWARD_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "HALF_TURN_SYMMETRY",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-009"] as const),
    mergeRationale: "Kept separate because the 1-2-1-2 side occupancy pattern and 180-degree symmetry are solution-essential and absent from fixed two-per-side square topology.",
  }),
} as const);

export const SEA002_CP008_WAVE03_DECISION = Object.freeze({
  comparison: Object.freeze(["SEA-CP008-SIG-B", "SEA-CP008-SIG-G"] as const),
  decision: "KEEP_SEPARATE" as const,
  reasons: Object.freeze([
    "SIG-B has exactly two occupants on every side; SIG-G has 1-2-1-2 occupancy.",
    "SIG-B retains fourfold 90-degree square symmetry; SIG-G repeats only after a 180-degree half-turn.",
    "SIG-G requires side-occupancy-class reasoning before same-side/opposite-side relations can be applied.",
  ] as const),
});

export const SEA002_CP008_WAVE03_AUTHORITY_DISCOVERY_STATUS = Object.freeze({
  implementedTemporaryPrototypeCount: 9,
  provisionalSolveSignatureCount: Object.keys(SEA002_CP008_WAVE03_SOLVE_SIGNATURES).length,
  variableSide6Signature: "SEA-CP008-SIG-G" as const,
  variableSide6OfficialSourceProven: true as const,
  variableSide6IndependentUniquenessTarget: 40,
  resolvedKeepSeparateFromSidePair8: true as const,
  remainingUnresolvedFamilies: Object.freeze([
    "ALT12 role-based SIG-D versus 8-seat role-derived SIG-A",
    "ALT12 mixed-facing stress family PROT-010 (discovery-only source strength)",
  ] as const),
  sourceSaturationClaimed: false,
  permanentAuthorityCount: 0,
  permanentQlAllocated: false,
  nextFreeQlId: "SEA-QL-029" as const,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  productionStaging: false,
  publiclyPublishable: false,
});
