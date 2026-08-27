import type { Sea002Cp008PrototypeId } from "./discovery-v1.ts";

export const SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES = Object.freeze({
  "SEA-CP008-SIG-A": Object.freeze({
    label: "Alternating corner/middle square with role-derived facing",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "CORNER_SIDE_ROLE",
      "ROLE_DERIVED_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "SQUARE_OPPOSITE",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-001", "SEA-CP008-PROT-002"] as const),
    mergeRationale: "Reversing corner/middle inward-outward assignment changes facing parameters but not the deduction graph.",
  }),
  "SEA-CP008-SIG-B": Object.freeze({
    label: "Two persons per side with uniform inward facing",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "SAME_SIDE_PAIRING",
      "OPPOSITE_SIDE_CORRESPONDENCE",
      "UNIFORM_INWARD_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-003"] as const),
    mergeRationale: "Held separate in discovery because same-side pairing is solution-essential and absent from alternating corner/middle geometry.",
  }),
  "SEA-CP008-SIG-C": Object.freeze({
    label: "Two persons per side with mixed facing inference",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "SAME_SIDE_PAIRING",
      "OPPOSITE_SIDE_CORRESPONDENCE",
      "MIXED_FACING_INFERENCE",
      "PERSON_RELATIVE_LEFT_RIGHT",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-004"] as const),
    mergeRationale: "Held separate until saturation proves whether mixed facing is merely an overlay on SIG-B or changes the minimum deduction authority.",
  }),
  "SEA-CP008-SIG-D": Object.freeze({
    label: "Extended square with corner plus multiple side slots",
    operations: Object.freeze([
      "SQUARE_PERIMETER_ORDER",
      "CORNER_SIDE_ROLE",
      "MULTIPLE_SIDE_SLOTS",
      "ROLE_DERIVED_FACING",
      "PERSON_RELATIVE_LEFT_RIGHT",
      "SQUARE_OPPOSITE",
    ] as const),
    prototypeIds: Object.freeze(["SEA-CP008-PROT-005"] as const),
    mergeRationale: "Discovery-only until stronger source evidence decides whether multiple side slots are scale or a distinct solve operation.",
  }),
} as const);

export type Sea002Cp008ProvisionalSolveSignatureId = keyof typeof SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES;

export const SEA002_CP008_PROTOTYPE_TO_SIGNATURE = Object.freeze(Object.fromEntries(
  Object.entries(SEA002_CP008_PROVISIONAL_SOLVE_SIGNATURES).flatMap(([signatureId, signature]) =>
    signature.prototypeIds.map((prototypeId) => [prototypeId, signatureId]),
  ),
) as Readonly<Record<Sea002Cp008PrototypeId, Sea002Cp008ProvisionalSolveSignatureId>>);

export const SEA002_CP008_WAVE01_COLLAPSE = Object.freeze({
  temporaryPrototypeCount: 5,
  provisionalSolveSignatureCount: 4,
  confirmedMerge: Object.freeze({
    prototypes: Object.freeze(["SEA-CP008-PROT-001", "SEA-CP008-PROT-002"] as const),
    into: "SEA-CP008-SIG-A" as const,
    reason: "facing-rule reversal is parameter-only",
  }),
  unresolvedMergeQuestions: Object.freeze([
    "SIG-B versus SIG-C: uniform versus mixed facing in two-per-side square",
    "SIG-A versus SIG-D: 8-seat alternating roles versus 12-seat multiple side slots",
  ] as const),
  permanentAuthorityCount: 0,
  permanentQlAllocated: false,
  nextFreeQlId: "SEA-QL-029" as const,
});
