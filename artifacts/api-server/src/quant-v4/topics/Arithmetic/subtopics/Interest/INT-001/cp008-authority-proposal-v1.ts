import type { IntCp008PrototypeId } from "./cp008-instalment-discovery-v1";

export const INT_CP008_AUTHORITY_PROPOSAL_VERSION = "INT-CP-008-AUTHORITY-PROPOSAL-v1" as const;

export const INT_CP008_AUTHORITY_GROUPS = Object.freeze([
  Object.freeze({ slot: "CP008-A01", title: "Equal end-of-period instalment", prototypes: Object.freeze(["INT-CP008-PROT-001", "INT-CP008-PROT-006"] as const), answerSemantic: "INSTALLMENT_AMOUNT", decision: "RETAIN_WITH_CONTEXT_MERGE", rationale: "Down payment is immediate preprocessing of the financed opening balance; recurrence and unknown are unchanged." }),
  Object.freeze({ slot: "CP008-A02", title: "Opening balance from equal periodic cash flow", prototypes: Object.freeze(["INT-CP008-PROT-002", "INT-CP008-PROT-009"] as const), answerSemantic: "OPENING_BALANCE", decision: "RETAIN_WITH_CONTEXT_MERGE", rationale: "Equal withdrawals use the same opening-balance inverse as equal repayments; fund language is contextual." }),
  Object.freeze({ slot: "CP008-A03", title: "Outstanding balance after regular payments", prototypes: Object.freeze(["INT-CP008-PROT-003"] as const), answerSemantic: "OUTSTANDING_BALANCE", decision: "RETAIN", rationale: "Intermediate-balance output is not the opening balance or recurring payment." }),
  Object.freeze({ slot: "CP008-A04", title: "Final balancing payment", prototypes: Object.freeze(["INT-CP008-PROT-004"] as const), answerSemantic: "FINAL_BALANCING_PAYMENT", decision: "RETAIN", rationale: "Known earlier recurring payments followed by one unknown clearing payment create a distinct inverse event position." }),
  Object.freeze({ slot: "CP008-A05", title: "Beginning-of-period equal instalment", prototypes: Object.freeze(["INT-CP008-PROT-005"] as const), answerSemantic: "INSTALLMENT_AMOUNT", decision: "RETAIN", rationale: "Payment-before-interest event order changes the recurrence and cannot be reduced to wording alone." }),
  Object.freeze({ slot: "CP008-A06", title: "Periodic rate from equal-instalment schedule", prototypes: Object.freeze(["INT-CP008-PROT-007"] as const), answerSemantic: "PERIODIC_RATE_PERCENT", decision: "RETAIN", rationale: "Bounded exact inverse-rate recovery has a different unknown and verifier contract." }),
  Object.freeze({ slot: "CP008-A07", title: "Future fund from equal recurring deposits", prototypes: Object.freeze(["INT-CP008-PROT-008"] as const), answerSemantic: "FUTURE_FUND", decision: "RETAIN", rationale: "Repeated deposits accumulate forward from zero and ask for the resulting fund." }),
  Object.freeze({ slot: "CP008-A08", title: "Missed instalment catch-up", prototypes: Object.freeze(["INT-CP008-PROT-010"] as const), answerSemantic: "EXTRA_PAYMENT", decision: "RETAIN", rationale: "A missed recurring event changes the state path and asks for an additional clearing amount." }),
  Object.freeze({ slot: "CP008-A09", title: "Difference between instalments under two rates", prototypes: Object.freeze(["INT-CP008-PROT-011"] as const), answerSemantic: "INSTALLMENT_DIFFERENCE", decision: "RETAIN", rationale: "Although it evaluates the equal-instalment engine twice, the learner contract compares two schedules and returns a difference, analogous to retained comparison-difference QLs elsewhere in Interest." }),
] as const);

export type IntCp008AuthoritySlot = (typeof INT_CP008_AUTHORITY_GROUPS)[number]["slot"];

export const INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT = Object.freeze(Object.fromEntries(
  INT_CP008_AUTHORITY_GROUPS.flatMap((group) => group.prototypes.map((prototypeId) => [prototypeId, group.slot])),
) as Readonly<Record<IntCp008PrototypeId, IntCp008AuthoritySlot>>);

export const INT_CP008_AUTHORITY_PROPOSAL = Object.freeze({
  version: INT_CP008_AUTHORITY_PROPOSAL_VERSION,
  temporaryPrototypeCount: 11 as const,
  proposedAuthorityCount: 9 as const,
  mergedPrototypeCount: 2 as const,
  sourceMaterialGaps: 0 as const,
  firstPotentialPermanentQl: "INT-QL-116" as const,
  lastPotentialPermanentQlIfApproved: "INT-QL-124" as const,
  permanentQlAllocationAuthorized: false as const,
  permanentQlIdsAllocated: Object.freeze([] as string[]),
  proposalStatus: "REVIEW_READY_NOT_ALLOCATED" as const,
  nextGate: "PRODUCT_OWNER_AUTHORITY_COUNT_APPROVAL" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
