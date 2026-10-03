import { SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES } from "./solve-signature-v1.ts";

export const SEA002_CP008_WAVE02_SOLVE_SIGNATURES = Object.freeze({
  ...SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES,
  "SEA-CP008-SIG-E": Object.freeze({
    label: "Alternating corner/side-centre square with uniform facing",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "CORNER_SIDE_ROLE",
      "UNIFORM_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "SQUARE_OPPOSITE",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-006", "SEA-CP008-PROT-007"] as const),
    mergeRationale: "All-in versus all-out reverses the direction parameter globally; it does not change the solve graph.",
  }),
  "SEA-CP008-SIG-F": Object.freeze({
    label: "Alternating corner/side-centre square with independent mixed facing",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "CORNER_SIDE_ROLE",
      "MIXED_FACING_INFERENCE",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "SQUARE_OPPOSITE",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-008"] as const),
    mergeRationale: "Facing cannot be derived from corner/side role; a separate facing deduction chain is solution-essential.",
  }),
} as const);

export const SEA002_CP008_WAVE02_MERGE_DECISIONS = Object.freeze([
  Object.freeze({
    decision: "MERGE" as const,
    members: Object.freeze(["SEA-CP008-PROT-001", "SEA-CP008-PROT-002"] as const),
    result: "SEA-CP008-SIG-A" as const,
    reason: "corner/middle facing-rule reversal is parameter-only",
  }),
  Object.freeze({
    decision: "KEEP_SEPARATE" as const,
    members: Object.freeze(["SEA-CP008-SIG-B", "SEA-CP008-SIG-C"] as const),
    result: null,
    reason: "mixed two-per-side questions require a facing-inference graph that uniform inward questions do not",
  }),
  Object.freeze({
    decision: "MERGE" as const,
    members: Object.freeze(["SEA-CP008-PROT-006", "SEA-CP008-PROT-007"] as const),
    result: "SEA-CP008-SIG-E" as const,
    reason: "global all-in/all-out reversal is parameter-only",
  }),
  Object.freeze({
    decision: "KEEP_SEPARATE" as const,
    members: Object.freeze(["SEA-CP008-SIG-A", "SEA-CP008-SIG-E"] as const),
    result: null,
    reason: "SIG-A derives facing from seat role while SIG-E applies one global facing rule",
  }),
  Object.freeze({
    decision: "KEEP_SEPARATE" as const,
    members: Object.freeze(["SEA-CP008-SIG-A", "SEA-CP008-SIG-F"] as const),
    result: null,
    reason: "SIG-F requires independent facing inference; seat role does not determine direction",
  }),
  Object.freeze({
    decision: "KEEP_SEPARATE" as const,
    members: Object.freeze(["SEA-CP008-SIG-C", "SEA-CP008-SIG-F"] as const),
    result: null,
    reason: "both infer facing, but one solves same-side pair topology while the other solves corner/side-centre topology",
  }),
] as const);

export const SEA002_CP008_WAVE02_AUTHORITY_DISCOVERY_STATUS = Object.freeze({
  temporaryImplementedPrototypeCount: 8,
  provisionalSolveSignatureCount: Object.keys(SEA002_CP008_WAVE02_SOLVE_SIGNATURES).length,
  confirmedMergedPrototypePairs: 2,
  resolvedKeepSeparateComparisons: 4,
  unresolvedFamilies: Object.freeze([
    "VARIABLE_SIDE6 official topology gap (PROT-009)",
    "ALT12 role-based SIG-D versus 8-seat SIG-A",
    "ALT12 mixed-facing stress family (PROT-010; discovery-only source strength)",
  ] as const),
  sourceSaturationClaimed: false,
  permanentAuthorityCount: 0,
  permanentQlAllocated: false,
  nextFreeQlId: "SEA-QL-029" as const,
  questionStudioRegistered: false,
  questionBankWritable: false,
  publiclyPublishable: false,
});
