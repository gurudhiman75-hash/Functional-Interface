import type { IntCp009PrototypeId } from "./cp009-dated-cash-flow-discovery-v1";

export const INT_CP009_AUTHORITY_PROPOSAL_VERSION = "INT-CP-009-AUTHORITY-PROPOSAL-v1" as const;

export const INT_CP009_AUTHORITY_IDS = Object.freeze([
  "INT-CP009-AUTH-01",
  "INT-CP009-AUTH-02",
  "INT-CP009-AUTH-03",
  "INT-CP009-AUTH-04",
  "INT-CP009-AUTH-05",
] as const);

export type IntCp009AuthorityId = (typeof INT_CP009_AUTHORITY_IDS)[number];

export type IntCp009AuthorityProposalEntry = Readonly<{
  authorityId: IntCp009AuthorityId;
  label: string;
  retainedPrototypes: readonly IntCp009PrototypeId[];
  primaryPrototype: IntCp009PrototypeId;
  answerSemanticClass: string;
  rationale: string;
}>;

export const INT_CP009_AUTHORITY_PROPOSAL = Object.freeze([
  {
    authorityId: "INT-CP009-AUTH-01",
    label: "future fund from heterogeneous dated deposits",
    retainedPrototypes: Object.freeze(["INT-CP009-PROT-001"] as const),
    primaryPrototype: "INT-CP009-PROT-001",
    answerSemanticClass: "FUTURE_FUND",
    rationale: "Forward savings valuation is source-backed and has a distinct future-fund learner semantic from debt reconstruction.",
  },
  {
    authorityId: "INT-CP009-AUTH-02",
    label: "opening or equivalent value of heterogeneous repayments at a stated comparison date",
    retainedPrototypes: Object.freeze(["INT-CP009-PROT-002", "INT-CP009-PROT-008"] as const),
    primaryPrototype: "INT-CP009-PROT-002",
    answerSemanticClass: "COMMON_DATE_REPAYMENT_VALUE",
    rationale: "Equivalent single payment is the same repayment ledger valuation with the comparison date parameterized; no separate QL is justified.",
  },
  {
    authorityId: "INT-CP009-AUTH-03",
    label: "missing heterogeneous dated cash flow required for exact settlement or target",
    retainedPrototypes: Object.freeze(["INT-CP009-PROT-003", "INT-CP009-PROT-005", "INT-CP009-PROT-006"] as const),
    primaryPrototype: "INT-CP009-PROT-003",
    answerSemanticClass: "MISSING_DATED_FLOW",
    rationale: "Middle repayment, final balancing repayment and missing target deposit all reduce to one common-date residual moved back to the missing flow date.",
  },
  {
    authorityId: "INT-CP009-AUTH-04",
    label: "outstanding balance after unequal dated repayments",
    retainedPrototypes: Object.freeze(["INT-CP009-PROT-004"] as const),
    primaryPrototype: "INT-CP009-PROT-004",
    answerSemanticClass: "OUTSTANDING_BALANCE",
    rationale: "The source-backed asked quantity is the intermediate ledger state after a specified payment; retain separately from opening-value reconstruction.",
  },
  {
    authorityId: "INT-CP009-AUTH-05",
    label: "periodic rate from a heterogeneous dated repayment schedule",
    retainedPrototypes: Object.freeze(["INT-CP009-PROT-007"] as const),
    primaryPrototype: "INT-CP009-PROT-007",
    answerSemanticClass: "PERIODIC_RATE_PERCENT",
    rationale: "Bounded exact rate inversion has a distinct unknown and candidate-search verifier from all money-valued authorities.",
  },
] as const satisfies readonly IntCp009AuthorityProposalEntry[]);

export const INT_CP009_AUTHORITY_PROPOSAL_RESULT = Object.freeze({
  temporaryPrototypeCount: 8 as const,
  proposedAuthorityCount: 5 as const,
  mergedPrototypeCount: 3 as const,
  sourceMaterialGaps: 0 as const,
  permanentQlCount: 0 as const,
  candidatePermanentRangeIfApproved: "INT-QL-125..INT-QL-129" as const,
  permanentRangeReserved: false as const,
  nextPotentialQlIdentity: "INT-QL-125" as const,
  nextGate: "PRODUCT_OWNER_AUTHORITY_COUNT_APPROVAL" as const,
});
