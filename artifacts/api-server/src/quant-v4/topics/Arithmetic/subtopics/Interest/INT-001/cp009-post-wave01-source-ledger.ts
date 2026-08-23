import type { IntCp009PrototypeId } from "./cp009-dated-cash-flow-discovery-v1";

export type IntCp009SourceDisposition =
  | "COVERED"
  | "REPRESENTATION"
  | "MERGE_CANDIDATE"
  | "REASSIGN_CP007"
  | "REASSIGN_CP008"
  | "REASSIGN_CP010"
  | "EXCLUDED_NO_SOURCE_AUTHORITY";

export type IntCp009SourceDirection = Readonly<{
  id: string;
  label: string;
  disposition: IntCp009SourceDisposition;
  prototypes: readonly IntCp009PrototypeId[];
  note: string;
}>;

export const INT_CP009_POST_WAVE01_SOURCE_LEDGER = Object.freeze([
  { id: "S01", label: "deposits on different dates to a future fund", disposition: "COVERED", prototypes: ["INT-CP009-PROT-001"], note: "Mandatory CP008 reassignment; forward common-date valuation." },
  { id: "S02", label: "unequal repayments to recover opening debt", disposition: "COVERED", prototypes: ["INT-CP009-PROT-002"], note: "Mandatory CP008 reassignment; reverse common-date valuation." },
  { id: "S03", label: "changed or missing middle repayment", disposition: "COVERED", prototypes: ["INT-CP009-PROT-003"], note: "Mandatory CP008 reassignment; missing heterogeneous flow." },
  { id: "S04", label: "outstanding balance after unequal repayments", disposition: "COVERED", prototypes: ["INT-CP009-PROT-004"], note: "Intermediate ledger-state semantic." },
  { id: "S05", label: "final balancing payment after unequal repayments", disposition: "COVERED", prototypes: ["INT-CP009-PROT-005"], note: "Final missing-flow position retained for merge/split testing." },
  { id: "S06", label: "missing dated deposit for target future fund", disposition: "COVERED", prototypes: ["INT-CP009-PROT-006"], note: "Savings-side missing-flow direction." },
  { id: "S07", label: "bounded exact rate inverse from heterogeneous schedule", disposition: "COVERED", prototypes: ["INT-CP009-PROT-007"], note: "Exact finite search; no floating roots." },
  { id: "S08", label: "equivalent single payment at an explicit comparison date", disposition: "MERGE_CANDIDATE", prototypes: ["INT-CP009-PROT-008", "INT-CP009-PROT-002"], note: "Same common-date valuation engine as opening-debt recovery with the comparison date parameterized." },
  { id: "S09", label: "down payment followed by unequal repayments", disposition: "REPRESENTATION", prototypes: ["INT-CP009-PROT-002"], note: "Down payment only preprocesses the financed opening balance; it does not change the heterogeneous repayment law." },
  { id: "S10", label: "nonconsecutive explicit cash-flow dates", disposition: "REPRESENTATION", prototypes: ["INT-CP009-PROT-001", "INT-CP009-PROT-002"], note: "Timing positions are parameters of the dated-flow engine, not separate QLs." },
  { id: "S11", label: "multiple flows on the same date", disposition: "REPRESENTATION", prototypes: ["INT-CP009-PROT-001", "INT-CP009-PROT-002"], note: "Same-date flows normalize by exact addition before valuation." },
  { id: "S12", label: "annual versus half-year dated-flow schedules", disposition: "REPRESENTATION", prototypes: ["INT-CP009-PROT-001", "INT-CP009-PROT-002"], note: "Period unit is explicit metadata and already exercised in Wave01." },
  { id: "S13", label: "table timeline ledger numeric and data-sufficiency surfaces", disposition: "REPRESENTATION", prototypes: [], note: "Presentation layer only; data sufficiency may be added only after ordinary authority is proven." },
  { id: "S14", label: "equal recurring deposits or withdrawals", disposition: "REASSIGN_CP008", prototypes: [], note: "CP008 owns equal recurring periodic cash flows." },
  { id: "S15", label: "equal periodic instalments", disposition: "REASSIGN_CP008", prototypes: [], note: "CP008 owns equal-instalment schedules and their direct inverses." },
  { id: "S16", label: "division of a present sum for equal future values", disposition: "REASSIGN_CP007", prototypes: [], note: "CP007 owns equal-future-value scheme/allocation questions." },
  { id: "S17", label: "variable or mixed rates across a cash-flow ledger", disposition: "REASSIGN_CP010", prototypes: [], note: "CP010 remains provisional owner of mixed/variable-rate instalment systems." },
  { id: "S18", label: "heterogeneous withdrawal-only or mixed deposit-withdrawal ledger", disposition: "EXCLUDED_NO_SOURCE_AUTHORITY", prototypes: [], note: "No recovered source direction requires a new CP009 contract; equal withdrawals are already CP008. Do not invent a QL without source evidence." },
  { id: "S19", label: "recover an unknown cash-flow date", disposition: "EXCLUDED_NO_SOURCE_AUTHORITY", prototypes: [], note: "Not recovered as an exam-backed Interest direction; avoid artificial bounded-date puzzles." },
  { id: "S20", label: "bankers discount or true discount", disposition: "EXCLUDED_NO_SOURCE_AUTHORITY", prototypes: [], note: "Explicitly excluded from INT-001 pending a dedicated ownership study." },
] as const satisfies readonly IntCp009SourceDirection[]);

export const INT_CP009_POST_WAVE01_GAP_RESULT = Object.freeze({
  sourceDirections: INT_CP009_POST_WAVE01_SOURCE_LEDGER.length,
  materialGaps: 0 as const,
  explicitMergeCandidates: Object.freeze([
    Object.freeze({ from: "INT-CP009-PROT-008" as const, into: "INT-CP009-PROT-002" as const }),
  ]),
  additionalMergeSplitReview: Object.freeze([
    Object.freeze(["INT-CP009-PROT-003", "INT-CP009-PROT-005", "INT-CP009-PROT-006"] as const),
    Object.freeze(["INT-CP009-PROT-001", "INT-CP009-PROT-002"] as const),
  ]),
  permanentQlCount: 0 as const,
  nextPotentialQlIdentity: "INT-QL-125" as const,
  nextPotentialQlIdentityReserved: false as const,
  nextGate: "FINAL_MERGE_SPLIT_PROPOSAL" as const,
});
