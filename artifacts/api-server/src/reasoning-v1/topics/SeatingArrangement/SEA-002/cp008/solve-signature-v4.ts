import { SEA002_CP008_WAVE03_SOLVE_SIGNATURES } from "./solve-signature-v3.ts";

export const SEA002_CP008_WAVE04_SOLVE_SIGNATURES = Object.freeze({
  ...SEA002_CP008_WAVE03_SOLVE_SIGNATURES,
  "SEA-CP008-SIG-H": Object.freeze({
    label: "Extended 12-seat square with multiple side slots and metric perimeter distance",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "CORNER_SIDE_ROLE",
      "MULTIPLE_SIDE_SLOTS",
      "SAME_SIDE_PAIRING",
      "METRIC_PERIMETER_DISTANCE",
      "UNIFORM_INWARD_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "SQUARE_OPPOSITE",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-011"] as const),
    mergeRationale: "Kept separate because source-backed 12-seat questions require multiple side slots and metric perimeter-distance reasoning that cannot be expressed by the ALT8 uniform-facing authority without losing solution-essential structure.",
  }),
} as const);

export const SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS = Object.freeze([
  "SEA-CP008-SIG-A",
  "SEA-CP008-SIG-B",
  "SEA-CP008-SIG-C",
  "SEA-CP008-SIG-E",
  "SEA-CP008-SIG-F",
  "SEA-CP008-SIG-G",
  "SEA-CP008-SIG-H",
] as const);

export type Sea002Cp008PermanentEligibleSignatureId = (typeof SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS)[number];

export const SEA002_CP008_WAVE04_FINAL_DECISIONS = Object.freeze([
  Object.freeze({
    comparison: Object.freeze(["SEA-CP008-SIG-E", "SEA-CP008-SIG-H"] as const),
    decision: "KEEP_SEPARATE" as const,
    reason: "SIG-H adds two side slots per side, same-side pairing and metric perimeter-distance constraints; SIG-E has only one side-centre seat per side.",
  }),
  Object.freeze({
    comparison: Object.freeze(["SEA-CP008-SIG-B", "SEA-CP008-SIG-H"] as const),
    decision: "KEEP_SEPARATE" as const,
    reason: "Both may be uniformly inward, but SIG-B has no occupied corners and exactly two seats on each side, whereas SIG-H has corners plus two side slots and a 12-seat metric perimeter.",
  }),
  Object.freeze({
    comparison: Object.freeze(["SEA-CP008-SIG-D"] as const),
    decision: "EXCLUDE_FROM_PERMANENT_SET_RETAIN_STRESS_ONLY" as const,
    reason: "The 12-seat role-derived facing variant remains supported only by discovery-grade evidence.",
  }),
  Object.freeze({
    comparison: Object.freeze(["SEA-CP008-PROT-010"] as const),
    decision: "EXCLUDE_FROM_PERMANENT_SET_RETAIN_STRESS_ONLY" as const,
    reason: "The 12-seat independent mixed-facing variant remains supported only by discovery-grade evidence.",
  }),
] as const);

export const SEA002_CP008_WAVE04_AUTHORITY_STATUS = Object.freeze({
  implementedTemporaryPrototypeCount: 10,
  provisionalSolveSignatureCount: Object.keys(SEA002_CP008_WAVE04_SOLVE_SIGNATURES).length,
  permanentEligibleSignatureCount: SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS.length,
  permanentEligibleSignatureIds: SEA002_CP008_PERMANENT_ELIGIBLE_SIGNATURE_IDS,
  sourceBackedAlt12Signature: "SEA-CP008-SIG-H" as const,
  productionSourceSaturationClaimed: true as const,
  unresolvedProductionFamilies: Object.freeze([] as const),
  stressOnlyFamilies: Object.freeze([
    "SEA-CP008-SIG-D",
    "SEA-CP008-PROT-010",
  ] as const),
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
