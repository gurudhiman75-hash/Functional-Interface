import type { IntCp009PrototypeId } from "./cp009-dated-cash-flow-discovery-v1";

export const INT_CP009_PERMANENT_ALLOCATION_VERSION = "INT-CP-009-PERMANENT-ALLOCATION-v1" as const;

export const INT_CP009_PERMANENT_QL_IDS = Object.freeze([
  "INT-QL-125",
  "INT-QL-126",
  "INT-QL-127",
  "INT-QL-128",
  "INT-QL-129",
] as const);

export type IntCp009PermanentQlId = (typeof INT_CP009_PERMANENT_QL_IDS)[number];

export type IntCp009PermanentAuthority = Readonly<{
  qlId: IntCp009PermanentQlId;
  authorityId: "INT-CP009-AUTH-01" | "INT-CP009-AUTH-02" | "INT-CP009-AUTH-03" | "INT-CP009-AUTH-04" | "INT-CP009-AUTH-05";
  solveContract: string;
  answerSemantic: "MONEY" | "RATE_PERCENT";
  sourcePrototypeIds: readonly IntCp009PrototypeId[];
  baselineDifficulty: "Medium" | "Hard";
  ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW";
}>;

export const INT_CP009_PERMANENT_ALLOCATION: readonly IntCp009PermanentAuthority[] = Object.freeze([
  Object.freeze({
    qlId: "INT-QL-125",
    authorityId: "INT-CP009-AUTH-01",
    solveContract: "FIND_FUTURE_FUND_FROM_HETEROGENEOUS_DATED_DEPOSITS",
    answerSemantic: "MONEY",
    sourcePrototypeIds: Object.freeze(["INT-CP009-PROT-001"] as const),
    baselineDifficulty: "Medium",
    ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
  }),
  Object.freeze({
    qlId: "INT-QL-126",
    authorityId: "INT-CP009-AUTH-02",
    solveContract: "FIND_COMMON_DATE_VALUE_OF_HETEROGENEOUS_REPAYMENTS",
    answerSemantic: "MONEY",
    sourcePrototypeIds: Object.freeze(["INT-CP009-PROT-002", "INT-CP009-PROT-008"] as const),
    baselineDifficulty: "Hard",
    ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
  }),
  Object.freeze({
    qlId: "INT-QL-127",
    authorityId: "INT-CP009-AUTH-03",
    solveContract: "FIND_MISSING_HETEROGENEOUS_DATED_CASH_FLOW",
    answerSemantic: "MONEY",
    sourcePrototypeIds: Object.freeze(["INT-CP009-PROT-003", "INT-CP009-PROT-005", "INT-CP009-PROT-006"] as const),
    baselineDifficulty: "Hard",
    ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
  }),
  Object.freeze({
    qlId: "INT-QL-128",
    authorityId: "INT-CP009-AUTH-04",
    solveContract: "FIND_OUTSTANDING_BALANCE_AFTER_UNEQUAL_DATED_REPAYMENTS",
    answerSemantic: "MONEY",
    sourcePrototypeIds: Object.freeze(["INT-CP009-PROT-004"] as const),
    baselineDifficulty: "Medium",
    ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
  }),
  Object.freeze({
    qlId: "INT-QL-129",
    authorityId: "INT-CP009-AUTH-05",
    solveContract: "FIND_PERIODIC_RATE_FROM_UNEQUAL_DATED_REPAYMENTS",
    answerSemantic: "RATE_PERCENT",
    sourcePrototypeIds: Object.freeze(["INT-CP009-PROT-007"] as const),
    baselineDifficulty: "Hard",
    ownershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
  }),
]);

const byQl = new Map(INT_CP009_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]));

export function getIntCp009PermanentAuthority(qlId: IntCp009PermanentQlId) {
  const entry = byQl.get(qlId);
  if (!entry) throw new Error(`Unknown INT-CP-009 permanent QL ${qlId}.`);
  return entry;
}
