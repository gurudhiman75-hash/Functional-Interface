export type NumCp002ProposalAuthorityId =
  | "NUM-CP002-AUTH-001"
  | "NUM-CP002-AUTH-002"
  | "NUM-CP002-AUTH-003"
  | "NUM-CP002-AUTH-004"
  | "NUM-CP002-AUTH-005"
  | "NUM-CP002-AUTH-006"
  | "NUM-CP002-AUTH-007"
  | "NUM-CP002-AUTH-008"
  | "NUM-CP002-AUTH-009"
  | "NUM-CP002-AUTH-010"
  | "NUM-CP002-AUTH-011"
  | "NUM-CP002-AUTH-012"
  | "NUM-CP002-AUTH-013"
  | "NUM-CP002-AUTH-014"
  | "NUM-CP002-AUTH-015"
  | "NUM-CP002-AUTH-016"
  | "NUM-CP002-AUTH-017"
  | "NUM-CP002-AUTH-018"
  | "NUM-CP002-AUTH-019"
  | "NUM-CP002-AUTH-020"
  | "NUM-CP002-AUTH-021";

export type NumCp002PrototypeId = `NUM-CP002-PROT-${string}`;

export interface NumCp002ProposalAuthority {
  readonly authorityId: NumCp002ProposalAuthorityId;
  readonly title: string;
  readonly corePrototypeIds: readonly NumCp002PrototypeId[];
  readonly adapterPrototypeIds: readonly NumCp002PrototypeId[];
  readonly governingInference: string;
  readonly mergeReason?: string;
  readonly permanentQlId: null;
}

export const NUM_CP002_PROPOSED_AUTHORITIES: readonly NumCp002ProposalAuthority[] = Object.freeze([
  {
    authorityId: "NUM-CP002-AUTH-001",
    title: "Reduce a fraction to its canonical lowest-term representation",
    corePrototypeIds: ["NUM-CP002-PROT-001"],
    adapterPrototypeIds: [],
    governingInference: "Cancel the complete common factor of numerator and denominator and preserve exact rational value.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-002",
    title: "Convert between improper and mixed fraction representations",
    corePrototypeIds: ["NUM-CP002-PROT-002", "NUM-CP002-PROT-003"],
    adapterPrototypeIds: [],
    governingInference: "Use the same quotient-remainder identity n = qd + r in either representation direction.",
    mergeReason: "Bidirectional parameterization of one quotient-remainder representation identity; no new mathematical invariant is introduced by reversing the direction.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-003",
    title: "Convert a terminating decimal to a reduced fraction",
    corePrototypeIds: ["NUM-CP002-PROT-004"],
    adapterPrototypeIds: [],
    governingInference: "Read exact decimal place value as an integer over a power of ten, then reduce.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-004",
    title: "Reconstruct the exact rational value of a recurring decimal",
    corePrototypeIds: ["NUM-CP002-PROT-005", "NUM-CP002-PROT-006"],
    adapterPrototypeIds: ["NUM-CP002-PROT-022", "NUM-CP002-PROT-029"],
    governingInference: "Use exact recurring-block shift/subtract reconstruction; non-repeating prefix length is a parameter, while recurring-nine and repeated-minimal-block forms are equivalence edges.",
    mergeReason: "Pure and mixed recurring decimals differ by prefix length only. Repeating nines and repeated block notation are representation adapters/edge states, not separate inference authorities.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-005",
    title: "Convert a fraction to its exact terminating decimal",
    corePrototypeIds: ["NUM-CP002-PROT-007"],
    adapterPrototypeIds: [],
    governingInference: "Scale the reduced denominator to a power of ten and preserve exact value.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-006",
    title: "Convert a fraction to its exact recurring decimal",
    corePrototypeIds: ["NUM-CP002-PROT-008"],
    adapterPrototypeIds: [],
    governingInference: "Follow exact long-division remainders until the first repeated remainder identifies the recurring block.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-007",
    title: "Compare two exact rational values",
    corePrototypeIds: ["NUM-CP002-PROT-009"],
    adapterPrototypeIds: [],
    governingInference: "Compare exact cross-products without rounded decimal approximation.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-008",
    title: "Order multiple exact rational representations",
    corePrototypeIds: ["NUM-CP002-PROT-010"],
    adapterPrototypeIds: ["NUM-CP002-PROT-024"],
    governingInference: "Place several fractions/terminating decimals/recurring decimals on one exact rational order.",
    mergeReason: "Largest/smallest wording selects an endpoint of the same total ordering and is therefore a presentation adapter, not a new mathematical authority.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-009",
    title: "Identify a rational value strictly between two exact bounds",
    corePrototypeIds: ["NUM-CP002-PROT-023"],
    adapterPrototypeIds: [],
    governingInference: "A candidate must satisfy two strict exact comparisons simultaneously; the target is the interior rational value rather than an order relation.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-010",
    title: "Classify a rational decimal as terminating or recurring after reduction",
    corePrototypeIds: ["NUM-CP002-PROT-011"],
    adapterPrototypeIds: [],
    governingInference: "Reduce first, then test whether the denominator contains only prime factors 2 and 5.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-011",
    title: "Measure terminating decimal places / least clearing power of ten",
    corePrototypeIds: ["NUM-CP002-PROT-012", "NUM-CP002-PROT-016"],
    adapterPrototypeIds: [],
    governingInference: "For reduced denominator 2^a5^b, both the exact decimal-place count and the least k with 10^k times the fraction integral equal max(a,b).",
    mergeReason: "Both prompts ask for the same integer invariant max(a,b); only the learner wording changes.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-012",
    title: "Recover a missing denominator exponent from terminating-place evidence",
    corePrototypeIds: ["NUM-CP002-PROT-015"],
    adapterPrototypeIds: [],
    governingInference: "Invert the max(a,b) place-count invariant to reconstruct the unknown exponent under a uniqueness condition.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-013",
    title: "Find the least factor intervention required for decimal termination",
    corePrototypeIds: ["NUM-CP002-PROT-013", "NUM-CP002-PROT-014"],
    adapterPrototypeIds: [],
    governingInference: "Identify the complete reduced-denominator factor made of primes other than 2 and 5 and remove it through the permitted multiply/divide intervention.",
    mergeReason: "Multiplying the rational by the forbidden denominator factor and dividing the denominator by that same factor are operation parameters on one minimal-removal invariant.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-014",
    title: "Count bounded denominators that yield terminating decimals after reduction",
    corePrototypeIds: ["NUM-CP002-PROT-017"],
    adapterPrototypeIds: [],
    governingInference: "Characterize valid denominators after numerator cancellation, then count the bounded set.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-015",
    title: "Return the complete bounded denominator set yielding termination",
    corePrototypeIds: ["NUM-CP002-PROT-018"],
    adapterPrototypeIds: [],
    governingInference: "Characterize every valid bounded denominator after cancellation and preserve the full set rather than only its cardinality.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-016",
    title: "Reconstruct the numerator-side cancellation needed for termination",
    corePrototypeIds: ["NUM-CP002-PROT-019", "NUM-CP002-PROT-030"],
    adapterPrototypeIds: [],
    governingInference: "The numerator must supply every forbidden denominator prime-power factor; a candidate numerator and a least bad-prime exponent are parameterizations of this same cancellation requirement.",
    mergeReason: "Both solve exactly which forbidden denominator prime-power must be supplied from the numerator side, with integer-valued answer burden.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-017",
    title: "Recover a missing digit in an exact recurring block",
    corePrototypeIds: ["NUM-CP002-PROT-020"],
    adapterPrototypeIds: [],
    governingInference: "Reconstruct the exact remainder cycle and read the marked digit from the repeating block.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-018",
    title: "Determine the recurring-block length from the remainder cycle",
    corePrototypeIds: ["NUM-CP002-PROT-021"],
    adapterPrototypeIds: [],
    governingInference: "The period is the number of long-division remainder transitions before the first remainder repeats.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-019",
    title: "Recover a missing fraction component from an exact decimal representation",
    corePrototypeIds: ["NUM-CP002-PROT-025", "NUM-CP002-PROT-026"],
    adapterPrototypeIds: [],
    governingInference: "Convert the exact terminating/recurring decimal to a reduced rational and use equivalent-fraction structure to reconstruct the missing numerator or denominator.",
    mergeReason: "Terminating versus recurring source representation and numerator versus denominator target are parameters after exact rational reconstruction; the governing inverse is equivalent-fraction reconstruction.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-020",
    title: "Evaluate representation statements and return the correct statement combination",
    corePrototypeIds: ["NUM-CP002-PROT-031"],
    adapterPrototypeIds: [],
    governingInference: "Evaluate multiple independent representation/termination claims and preserve the combination answer burden.",
    permanentQlId: null,
  },
  {
    authorityId: "NUM-CP002-AUTH-021",
    title: "Determine Data Sufficiency for rational-representation conditions",
    corePrototypeIds: ["NUM-CP002-PROT-032"],
    adapterPrototypeIds: [],
    governingInference: "Determine whether each statement fixes the target for every allowed rational state; preserve single/both/neither sufficiency classes.",
    permanentQlId: null,
  },
]);

export const NUM_CP002_DELEGATED_PROTOTYPES = Object.freeze([
  {
    prototypeId: "NUM-CP002-PROT-027" as const,
    owner: "ALGEBRA",
    reason: "Once the exact rational value is supplied, reciprocal/complement isolation is generic one-variable algebra and does not require a Number System-specific invariant.",
  },
  {
    prototypeId: "NUM-CP002-PROT-028" as const,
    owner: "ALGEBRA",
    reason: "Once exact fractions are supplied, sum/difference isolation is generic linear algebra; rational notation is incidental.",
  },
] as const);

export const NUM_CP002_PROTECTED_NON_MERGES = Object.freeze([
  ["NUM-CP002-AUTH-003", "NUM-CP002-AUTH-005", "Decimal→fraction uses place-value reduction; fraction→decimal uses denominator scaling. Opposite direction changes the governing operation, not merely presentation."],
  ["NUM-CP002-AUTH-004", "NUM-CP002-AUTH-006", "Recurring→fraction uses shift/subtract reconstruction; fraction→recurring uses remainder-cycle detection."],
  ["NUM-CP002-AUTH-007", "NUM-CP002-AUTH-009", "Pairwise relation output is not the same answer/proof burden as selecting an interior rational satisfying two inequalities."],
  ["NUM-CP002-AUTH-010", "NUM-CP002-AUTH-011", "Decimal-nature classification is categorical; place/power measurement returns a quantitative exponent."],
  ["NUM-CP002-AUTH-011", "NUM-CP002-AUTH-012", "Direct measurement of max(a,b) is protected from its inverse exponent-reconstruction burden."],
  ["NUM-CP002-AUTH-013", "NUM-CP002-AUTH-016", "Denominator/product intervention and numerator-parameter reconstruction act on different unknowns and question contracts even though both use forbidden prime factors."],
  ["NUM-CP002-AUTH-014", "NUM-CP002-AUTH-015", "COUNT and complete SET answers carry different output and completeness burdens."],
  ["NUM-CP002-AUTH-017", "NUM-CP002-AUTH-018", "Recovering a marked digit is not the same target as proving the period length."],
  ["NUM-CP002-AUTH-020", "NUM-CP002-AUTH-021", "Statement-combination truth evaluation and Data Sufficiency quantify over different state spaces and must retain distinct answer-shape semantics."],
] as const);

export const NUM_CP002_SOURCE_SATURATION_PROPOSAL = Object.freeze({
  checkpointId: "NUM-CP-002",
  temporaryPrototypeCount: 32,
  inScopePrototypeCount: 30,
  delegatedPrototypeCount: 2,
  proposedPermanentAuthorityCount: 21,
  permanentQlIdsAllocated: false,
  firstAvailablePermanentQlId: "NUM-QL-145",
  sourceSaturated: true,
  sourceSaturationBasis: [
    "All current CP002 end-to-end design solve-mode hypotheses are mapped to executable discovery or explicit delegation.",
    "All 32 temporary prototypes have an authority/adapter/delegation disposition.",
    "Direct, reverse, inverse, bounded-count, bounded-set, recurring-cycle, statement-combination and Data Sufficiency burdens are represented.",
    "Generic algebra/proportion work has been explicitly excluded rather than used to inflate CP002.",
  ] as const,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});
