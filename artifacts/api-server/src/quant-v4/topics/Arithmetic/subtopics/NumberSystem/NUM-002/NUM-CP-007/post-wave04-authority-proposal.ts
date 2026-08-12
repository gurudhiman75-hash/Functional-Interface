import { NUM_CP007_WAVE01_PROTOTYPE_IDS } from "./wave01/types.ts";
import { NUM_CP007_WAVE02_PROTOTYPE_IDS } from "./wave02/types.ts";
import { NUM_CP007_WAVE03_PROTOTYPE_IDS } from "./wave03/types.ts";
import { NUM_CP007_WAVE04_PROTOTYPE_IDS } from "./wave04/types.ts";

export const NUM_CP007_DISCOVERED_PROTOTYPE_IDS = [
  ...NUM_CP007_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP007_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP007_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP007_WAVE04_PROTOTYPE_IDS,
] as const;

export type NumCp007DiscoveredPrototypeId = (typeof NUM_CP007_DISCOVERED_PROTOTYPE_IDS)[number];

export interface NumCp007ProposedAuthority {
  readonly authorityId: `CP007-AUTH-${string}`;
  readonly title: string;
  readonly prototypes: readonly NumCp007DiscoveredPrototypeId[];
  readonly status: "PROPOSED_AWAITING_EXPLICIT_COUNT_APPROVAL";
  readonly rationale: string;
}

const authority = (
  authorityId: `CP007-AUTH-${string}`,
  title: string,
  prototypes: readonly NumCp007DiscoveredPrototypeId[],
  rationale: string,
): NumCp007ProposedAuthority => ({
  authorityId,
  title,
  prototypes,
  status: "PROPOSED_AWAITING_EXPLICIT_COUNT_APPROVAL",
  rationale,
});

export const NUM_CP007_PROPOSED_AUTHORITIES = [
  authority("CP007-AUTH-001", "Recover remainder", ["NUM-CP007-PROT-001"], "Distinct direct unknown direction."),
  authority("CP007-AUTH-002", "Recover dividend", ["NUM-CP007-PROT-002"], "Distinct direct reconstruction direction."),
  authority("CP007-AUTH-003", "Recover divisor", ["NUM-CP007-PROT-003"], "Distinct inverse direction; quotient-zero states are excluded because they do not identify a unique divisor."),
  authority("CP007-AUTH-004", "Recover quotient", ["NUM-CP007-PROT-004"], "Distinct inverse direction."),
  authority("CP007-AUTH-005", "Select valid division statement", ["NUM-CP007-PROT-005"], "Option-level division-state validation."),
  authority("CP007-AUTH-006", "Signed additive remainder composition", ["NUM-CP007-PROT-006", "NUM-CP007-PROT-009"], "Sum and difference are sign parameters of one additive residue-composition rule."),
  authority("CP007-AUTH-007", "Multiplicative remainder composition", ["NUM-CP007-PROT-007"], "Two-residue multiplicative composition has a distinct inference topology."),
  authority("CP007-AUTH-008", "Exact-divisibility adjustment", ["NUM-CP007-PROT-008"], "Least addition/subtraction are directional parameters of one adjustment authority."),
  authority("CP007-AUTH-009", "Single-residue expression remainder", ["NUM-CP007-PROT-010", "NUM-CP007-PROT-012"], "Scaling is the linear special case of the bounded expression/polynomial authority."),
  authority("CP007-AUTH-010", "Compatible nested remainder", ["NUM-CP007-PROT-011"], "Requires a target divisor compatible with the known divisor."),
  authority("CP007-AUTH-011", "Linked divisor-quotient-remainder relation", ["NUM-CP007-PROT-013", "NUM-CP007-PROT-024", "NUM-CP007-PROT-025"], "Additive link, mini-caselet target projection and richer multiplier/gap forms share one bounded linked-state authority."),
  authority("CP007-AUTH-012", "Bounded non-zero residue count", ["NUM-CP007-PROT-014"], "Count projection remains distinct; zero-remainder direct divisibility count is CP-003-owned."),
  authority("CP007-AUTH-013", "Bounded solution topology", ["NUM-CP007-PROT-015"], "Invalid/none/one/many classification is a distinct diagnostic target."),
  authority("CP007-AUTH-014", "Nearest multiple classification", ["NUM-CP007-PROT-016"], "Lower/upper/tie/already-exact outcome has distinct answer semantics."),
  authority("CP007-AUTH-015", "Unique bounded residue reconstruction", ["NUM-CP007-PROT-017"], "Unique integer reconstruction is distinct from count/set/topology projections."),
  authority("CP007-AUTH-016", "Complete bounded residue set", ["NUM-CP007-PROT-018"], "Complete-set output is materially distinct."),
  authority("CP007-AUTH-017", "Division-state classification", ["NUM-CP007-PROT-019"], "Classifies the defect of one rendered division record."),
  authority("CP007-AUTH-018", "Same-remainder divisor reconstruction", ["NUM-CP007-PROT-020", "NUM-CP007-PROT-032"], "Candidate verification and unique bounded reconstruction share d | (A-B); greatest-divisor optimisation remains CP-006."),
  authority("CP007-AUTH-019", "Quotient-remainder pair completion", ["NUM-CP007-PROT-021"], "Pair output is retained while table layout is only a representation."),
  authority("CP007-AUTH-020", "Statement-combination evaluation", ["NUM-CP007-PROT-022"], "Multiple division claims must be evaluated independently."),
  authority("CP007-AUTH-021", "Division-state data sufficiency", ["NUM-CP007-PROT-023"], "Requires separate candidate-set proof under I, II and both."),
  authority("CP007-AUTH-022", "Inverse remainder propagation", ["NUM-CP007-PROT-026"], "Unknown divisor is inferred from validated one-wrap residue propagation."),
  authority("CP007-AUTH-023", "Successive quotient-division chain", ["NUM-CP007-PROT-027", "NUM-CP007-PROT-028"], "Forward reconstruction, product-mod projection and reverse-order remainder sequence share one repeated division-lemma state."),
  authority("CP007-AUTH-024", "Wrong-divisor correction", ["NUM-CP007-PROT-029"], "Recover hidden dividend from erroneous division then re-divide correctly."),
  authority("CP007-AUTH-025", "Long-division intermediate-remainder trace", ["NUM-CP007-PROT-030"], "Internal prefix-remainder trace of one long division is distinct from successive quotient division."),
  authority("CP007-AUTH-026", "Bounded non-zero-remainder extremum", ["NUM-CP007-PROT-031"], "Least-above/greatest-below are directional parameters; r=0 extremum remains CP-003-owned."),
] as const satisfies readonly NumCp007ProposedAuthority[];

export const NUM_CP007_POST_WAVE04_GAP_CLOSURES = [
  { gap: "RICHER_LINKED_RELATIONS", status: "CLOSED", authorities: ["CP007-AUTH-011"] },
  { gap: "INVERSE_REMAINDER_PROPAGATION", status: "CLOSED", authorities: ["CP007-AUTH-022"] },
  { gap: "SUCCESSIVE_QUOTIENT_DIVISION", status: "CLOSED", authorities: ["CP007-AUTH-023"] },
  { gap: "WRONG_DIVISOR_CORRECTION", status: "CLOSED", authorities: ["CP007-AUTH-024"] },
  { gap: "LONG_DIVISION_TRACE", status: "CLOSED", authorities: ["CP007-AUTH-025"] },
  { gap: "NONZERO_REMAINDER_EXTREMUM", status: "CLOSED", authorities: ["CP007-AUTH-026"] },
  { gap: "SAME_REMAINDER_BOUNDED_RECONSTRUCTION", status: "CLOSED", authorities: ["CP007-AUTH-018"] },
  { gap: "QUOTIENT_ZERO_EDGE_HARDENING", status: "CLOSED_NO_NEW_AUTHORITY", authorities: ["CP007-AUTH-001", "CP007-AUTH-002", "CP007-AUTH-004", "CP007-AUTH-019"] },
  { gap: "OUTCOME_STRATIFIED_REVIEW", status: "CLOSED_NO_NEW_AUTHORITY", authorities: [] },
] as const;

export const NUM_CP007_CROSS_CP_HOLDS = [
  { form: "N_DIGIT_EXACT_MULTIPLE_EXTREMUM", owner: "NUM-CP-003" },
  { form: "ZERO_REMAINDER_ONE_DIVISOR_RANGE_COUNT", owner: "NUM-CP-003" },
  { form: "GREATEST_SAME_OR_SPECIFIED_REMAINDER_DIVISOR", owner: "NUM-CP-006" },
  { form: "COMMON_REMAINDER_ALIGNMENT_ACROSS_DIVISORS", owner: "NUM-CP-006" },
  { form: "SAME_REMAINDER_DIVISOR_COUNT", owner: "NUM-CP-005_OR_MIXED_HOLD" },
  { form: "INDEPENDENT_OR_INCOMPATIBLE_CONGRUENCE_SYSTEM", owner: "NUM-CP-008" },
  { form: "POWER_OR_CYCLIC_MODULAR_REMAINDER", owner: "NUM-CP-008_OR_009" },
  { form: "TARGET_REMAINDER_MISSING_DIGIT", owner: "CROSS_CP_003_007_010_014_HOLD" },
  { form: "BOUNDED_RESIDUE_CLASS_SUM", owner: "PROGRESSION_OR_MIXED_HOLD" },
  { form: "FORMED_NUMBER_ARRANGEMENT_COUNT", owner: "PNC" },
] as const;

export const NUM_CP007_COUNT_PROPOSAL = {
  discoveredPrototypeCount: 32,
  proposedAuthorityCount: 26,
  mergedAuthorityGroupCount: 5,
  singletonAuthorityCount: 21,
  prototypeReduction: 6,
  routineSourceGapCount: 0,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
  candidateRangeIfApproved: "NUM-QL-098..NUM-QL-123",
  nextQlIfApproved: "NUM-QL-124",
  proposalStatus: "AWAITING_EXPLICIT_COUNT_APPROVAL",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const;
