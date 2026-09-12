import { INT_CP009_POST_WAVE01_SOURCE_LEDGER } from "./cp009-post-wave01-source-ledger";

export const INT_CP009_SOURCE_BOUNDARY_VERSION = "INT-CP-009-SOURCE-BOUNDARY-v2" as const;

export const INT_CP009_CP002_SIMPLE_INTEREST_BOUNDARY = Object.freeze({
  id: "S21" as const,
  label: "simple-interest multiple deposits and explicit partial-repayment ledgers" as const,
  disposition: "REASSIGN_CP002" as const,
  cp002Authorities: Object.freeze([
    "INT-QL-028",
    "INT-QL-029",
    "INT-QL-030",
    "INT-QL-031",
    "INT-QL-032",
    "INT-QL-042",
    "INT-QL-043",
    "INT-QL-044",
    "INT-QL-045",
  ] as const),
  note: "CP002 already owns simple-interest multiple independent deposits, common-rate/missing-variable inverses, partial repayment, repayment timing and early-vs-late repayment comparison. CP009 therefore owns heterogeneous dated cash flows only when compound/common-date time-value mechanics are decisive." as const,
});

export const INT_CP009_SOURCE_LEDGER_V2 = Object.freeze([
  ...INT_CP009_POST_WAVE01_SOURCE_LEDGER,
  INT_CP009_CP002_SIMPLE_INTEREST_BOUNDARY,
] as const);

export const INT_CP009_SOURCE_BOUNDARY_RESULT_V2 = Object.freeze({
  sourceDirections: 21 as const,
  materialGaps: 0 as const,
  cp002Reassignments: 1 as const,
  cp007Reassignments: 1 as const,
  cp008Reassignments: 2 as const,
  cp010Reassignments: 1 as const,
  cp009MethodBoundary: "COMPOUND_OR_EXACT_PERIODIC_GROWTH_HETEROGENEOUS_DATED_CASH_FLOWS" as const,
  permanentQlCount: 0 as const,
  nextPotentialQlIdentity: "INT-QL-125" as const,
  nextPotentialQlIdentityReserved: false as const,
});
