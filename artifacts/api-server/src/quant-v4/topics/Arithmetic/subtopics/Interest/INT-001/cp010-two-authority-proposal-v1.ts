import type { IntCp010PrototypeId } from "./cp010-mixed-systems-discovery-v1";

export const INT_CP010_AUTHORITY_PROPOSAL_VERSION = "INT-CP-010-TWO-AUTHORITY-PROPOSAL-v1" as const;

export type IntCp010ProposedAuthority = Readonly<{
  authorityId: "INT-CP010-AUTH-01" | "INT-CP010-AUTH-02";
  title: string;
  sourcePrototypeIds: readonly IntCp010PrototypeId[];
  solveContract: "VARIABLE_RATE_EQUAL_INSTALMENT" | "VARIABLE_RATE_HETEROGENEOUS_OPENING_DEBT";
  answerSemantic: "INSTALMENT_AMOUNT" | "OPENING_DEBT";
  componentAuthorities: readonly string[];
  separationRationale: string;
  sourceAuthority: string;
}>;

export const INT_CP010_PROPOSED_AUTHORITIES = Object.freeze([
  Object.freeze({
    authorityId: "INT-CP010-AUTH-01",
    title: "Variable-rate reducing-balance loan — equal instalment amount",
    sourcePrototypeIds: Object.freeze(["INT-CP010-PROT-003"] as const),
    solveContract: "VARIABLE_RATE_EQUAL_INSTALMENT",
    answerSemantic: "INSTALMENT_AMOUNT",
    componentAuthorities: Object.freeze(["INT-CP-005:VARIABLE_RATE", "INT-CP-008:EQUAL_INSTALMENT"] as const),
    separationRationale: "The unknown is the repeated equal payment. Its coefficient is a suffix-factor sum across the changing rate sequence; this is materially different from reconstructing an opening debt from known unequal payments.",
    sourceAuthority: "Certified INT-CP-009 source ledger S17 reassignment to CP010",
  }),
  Object.freeze({
    authorityId: "INT-CP010-AUTH-02",
    title: "Variable-rate reducing-balance loan — opening debt from unequal repayments",
    sourcePrototypeIds: Object.freeze(["INT-CP010-PROT-004"] as const),
    solveContract: "VARIABLE_RATE_HETEROGENEOUS_OPENING_DEBT",
    answerSemantic: "OPENING_DEBT",
    componentAuthorities: Object.freeze(["INT-CP-005:VARIABLE_RATE", "INT-CP-009:HETEROGENEOUS_DATED_CASH_FLOW"] as const),
    separationRationale: "The payments are known and heterogeneous; the solver works backward period by period to reconstruct the opening debt. Equal-payment annuity algebra is neither required nor sufficient.",
    sourceAuthority: "Certified INT-CP-009 source ledger S17 reassignment to CP010",
  }),
] as const satisfies readonly IntCp010ProposedAuthority[]);

export const INT_CP010_SOURCE_HOLD_PROTOTYPES = Object.freeze([
  Object.freeze({
    prototypeId: "INT-CP010-PROT-001" as const,
    reason: "Legacy family int_hybrid_si_ci_crossover is misrouted through the ordinary V2 ciSiDiff factory; direct source authority for the method-switch topology is not yet recovered.",
  }),
  Object.freeze({
    prototypeId: "INT-CP010-PROT-002" as const,
    reason: "Legacy family int_si_ci_mixed_condition_inverse is misrouted through the ordinary V2 ciSiDiff factory; direct source authority for the mixed inverse topology is not yet recovered.",
  }),
] as const);

export const INT_CP010_AUTHORITY_PROPOSAL_RESULT = Object.freeze({
  discoveryPrototypeCount: 4 as const,
  reliablePermanentCandidatePrototypeCount: 2 as const,
  sourceHoldPrototypeCount: 2 as const,
  proposedAuthorityCount: INT_CP010_PROPOSED_AUTHORITIES.length,
  merges: 0 as const,
  protectedNonMerges: 1 as const,
  candidatePermanentQlRangeIfApproved: "INT-QL-130..INT-QL-131" as const,
  nextPotentialQlAfterApprovedAllocation: "INT-QL-132" as const,
  permanentQlCount: 0 as const,
  candidateRangeReserved: false as const,
  nextGate: "PRODUCT_OWNER_TWO_AUTHORITY_APPROVAL" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
