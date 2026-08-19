import {
  NUM_CP008_ADVANCED_DISPOSITIONS,
  NUM_CP008_DESIGN_DIRECTION_DISPOSITIONS,
  NUM_CP008_OWNERSHIP_HOLDS,
} from "./post-wave03-gap-audit.ts";

export const NUM_CP008_DISCOVERED_PROTOTYPE_IDS = Array.from(
  { length: 26 },
  (_, index) => `NUM-CP008-PROT-${String(index + 1).padStart(3, "0")}`,
) as readonly string[];

export const NUM_CP008_PROPOSED_AUTHORITIES = [
  {
    authorityId: "CP008-AUTH-001",
    label: "Basic modular arithmetic and residue normalisation",
    prototypes: ["NUM-CP008-PROT-001", "NUM-CP008-PROT-002"],
    mergeReason: "Signed residue normalisation is an edge/parameter state of the same modular sum-difference-product engine rather than a separate exam authority.",
  },
  { authorityId: "CP008-AUTH-002", label: "Exact power remainder", prototypes: ["NUM-CP008-PROT-003"] },
  {
    authorityId: "CP008-AUTH-003",
    label: "Solvable linear congruence solution classes",
    prototypes: ["NUM-CP008-PROT-004", "NUM-CP008-PROT-005"],
    mergeReason: "One-class and several-class outcomes share gcd reduction and residue-class reconstruction; the number of classes is solution topology, not a different solver.",
  },
  { authorityId: "CP008-AUTH-004", label: "Unsolvable linear congruence classification", prototypes: ["NUM-CP008-PROT-006"] },
  {
    authorityId: "CP008-AUTH-005",
    label: "Compatible simultaneous congruence construction",
    prototypes: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-015", "NUM-CP008-PROT-020"],
    mergeReason: "Two constraints, three constraints, and same/different-remainder wording use the same sequential generalized-CRT construction when the target is the compatible class or least representative.",
  },
  {
    authorityId: "CP008-AUTH-006",
    label: "Incompatible simultaneous congruence classification",
    prototypes: ["NUM-CP008-PROT-008", "NUM-CP008-PROT-016"],
    mergeReason: "Two- versus three-constraint incompatibility changes system width only; gcd compatibility remains the learner target.",
  },
  { authorityId: "CP008-AUTH-007", label: "Bounded residue-class extremum", prototypes: ["NUM-CP008-PROT-009"] },
  {
    authorityId: "CP008-AUTH-008",
    label: "Bounded residue or system solution count",
    prototypes: ["NUM-CP008-PROT-010", "NUM-CP008-PROT-024"],
    mergeReason: "Once a compatible system is reduced to one residue class, counting bounded representatives is the same arithmetic-progression target as a directly stated residue class.",
  },
  {
    authorityId: "CP008-AUTH-009",
    label: "Complete bounded simultaneous-system solution set",
    prototypes: ["NUM-CP008-PROT-011", "NUM-CP008-PROT-026"],
    mergeReason: "Two- and three-congruence forms share CRT-to-progression complete-set output; system width is a parameter rather than a new answer burden.",
  },
  { authorityId: "CP008-AUTH-010", label: "Missing modular coefficient reconstruction", prototypes: ["NUM-CP008-PROT-012"] },
  { authorityId: "CP008-AUTH-011", label: "Missing modulus reconstruction", prototypes: ["NUM-CP008-PROT-013"] },
  { authorityId: "CP008-AUTH-012", label: "Structured geometric-sum remainder", prototypes: ["NUM-CP008-PROT-014"] },
  { authorityId: "CP008-AUTH-013", label: "Missing residue from modular-system evidence", prototypes: ["NUM-CP008-PROT-017"] },
  { authorityId: "CP008-AUTH-014", label: "Nested modular expression", prototypes: ["NUM-CP008-PROT-018"] },
  { authorityId: "CP008-AUTH-015", label: "Congruence-system candidate verification", prototypes: ["NUM-CP008-PROT-019"] },
  { authorityId: "CP008-AUTH-016", label: "Modular statement combination", prototypes: ["NUM-CP008-PROT-021"] },
  { authorityId: "CP008-AUTH-017", label: "Bounded modular Data Sufficiency", prototypes: ["NUM-CP008-PROT-022"] },
  { authorityId: "CP008-AUTH-018", label: "Repeated-numeral modular recurrence", prototypes: ["NUM-CP008-PROT-023"] },
  { authorityId: "CP008-AUTH-019", label: "Bounded simultaneous-system multiplicity classification", prototypes: ["NUM-CP008-PROT-025"] },
] as const;

export const NUM_CP008_PROTECTED_NON_MERGES = [
  {
    prototypes: ["NUM-CP008-PROT-003", "NUM-CP008-PROT-014", "NUM-CP008-PROT-018", "NUM-CP008-PROT-023"],
    reason: "Direct power, geometric-sum recurrence, nested-modulus expression and append-digit recurrence require materially different evidence and independent verification routes despite all returning remainders.",
  },
  {
    prototypes: ["NUM-CP008-PROT-009", "NUM-CP008-PROT-010", "NUM-CP008-PROT-011", "NUM-CP008-PROT-025", "NUM-CP008-PROT-026"],
    reason: "Extremum, exact count, complete set and no/one/many classification are protected answer burdens; only same-semantic system-width variants merge.",
  },
  {
    prototypes: ["NUM-CP008-PROT-012", "NUM-CP008-PROT-013", "NUM-CP008-PROT-017"],
    reason: "Unknown coefficient, modulus and residue use different inverse invariants and verifier logic.",
  },
  {
    prototypes: ["NUM-CP008-PROT-019", "NUM-CP008-PROT-021", "NUM-CP008-PROT-022"],
    reason: "Candidate verification, statement combination and Data Sufficiency have distinct answer semantics and evidence topology.",
  },
  {
    prototypes: ["NUM-CP008-PROT-004", "NUM-CP008-PROT-005", "NUM-CP008-PROT-006"],
    reason: "Solvable residue-class output may merge across one/multiple classes, but no-solution classification remains separate from returning actual solution classes.",
  },
  {
    prototypes: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-008", "NUM-CP008-PROT-015", "NUM-CP008-PROT-016", "NUM-CP008-PROT-020"],
    reason: "Compatible-system construction and incompatible-system classification remain separate learner targets even though both invoke compatibility logic.",
  },
] as const;

export const NUM_CP008_FINAL_SOURCE_RECHECK = {
  designDirectionDispositions: NUM_CP008_DESIGN_DIRECTION_DISPOSITIONS,
  advancedDispositions: NUM_CP008_ADVANCED_DISPOSITIONS,
  ownershipHolds: NUM_CP008_OWNERSHIP_HOLDS,
  cp007Boundary: "ONE_STAGE_DIVISION_AND_COMPATIBLE_NESTED_DIVISOR_TRANSFER_EXCLUDED",
  cp009Boundary: "TERMINAL_DIGIT_OUTPUTS_EXCLUDED_EVEN_WHEN_SOLVED_MODULARLY",
  cp010Boundary: "ARBITRARY_DIGIT_CONSTRUCTION_OR_CONCATENATION_STRUCTURE_HANDED_OFF_WHEN_DIGIT_STRUCTURE_IS_ESSENTIAL",
  routineSourceGapCount: 0,
} as const;

export const NUM_CP008_COUNT_PROPOSAL = {
  checkpointId: "NUM-CP-008",
  discoveredPrototypeCount: NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length,
  proposedAuthorityCount: NUM_CP008_PROPOSED_AUTHORITIES.length,
  mergedAuthorityGroupCount: NUM_CP008_PROPOSED_AUTHORITIES.filter((item) => item.prototypes.length > 1).length,
  singletonAuthorityCount: NUM_CP008_PROPOSED_AUTHORITIES.filter((item) => item.prototypes.length === 1).length,
  prototypeReduction: NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length - NUM_CP008_PROPOSED_AUTHORITIES.length,
  routineSourceGapCount: NUM_CP008_FINAL_SOURCE_RECHECK.routineSourceGapCount,
  sourceSaturationForCurrentOrdinaryOwnership: true,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
  candidateRangeIfApproved: "NUM-QL-166..NUM-QL-184",
  nextQlIfApproved: "NUM-QL-185",
  proposalStatus: "AWAITING_EXPLICIT_COUNT_APPROVAL",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;
