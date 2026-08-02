import { INT_CP002_WAVE01_PROTOTYPE_IDS } from "./cp002-wave01-types";
import { INT_CP002_WAVE02_PROTOTYPE_IDS } from "./cp002-wave02-types";

export type IntCp002Wave03Disposition =
  | "RETAIN_PENDING_MERGE_SPLIT"
  | "MERGE_WITH_ANCESTRY"
  | "REPRESENTATION_ONLY"
  | "REASSIGN_BOUNDARY_REVIEW"
  | "GAP_REQUIRES_EXECUTABLE_PROTOTYPE";

export interface IntCp002Wave03PrototypeCoverage {
  prototypeId: string;
  ancestry:
    | "PIECEWISE_RATE_LEDGER"
    | "MULTIPLE_DEPOSITS"
    | "SPLIT_PRINCIPAL"
    | "EQUAL_INTEREST"
    | "COUNTERFACTUAL_CHANGE"
    | "PARTIAL_REPAYMENT"
    | "BORROW_LEND_SPREAD"
    | "DAY_COUNT";
  task: "DIRECT" | "INVERSE";
  unknown: "INTEREST" | "PRINCIPAL" | "RATE" | "TIME" | "REPAYMENT_AMOUNT" | "REPAYMENT_TIME" | "DAYS";
  contributionCount: "ONE" | "TWO";
  eventCount: 0 | 1;
  representation: "NARRATIVE";
  disposition: IntCp002Wave03Disposition;
}

const W1 = INT_CP002_WAVE01_PROTOTYPE_IDS;
const W2 = INT_CP002_WAVE02_PROTOTYPE_IDS;

export const INT_CP002_WAVE03_EXISTING_COVERAGE: readonly IntCp002Wave03PrototypeCoverage[] = [
  { prototypeId: W1[0], ancestry: "PIECEWISE_RATE_LEDGER", task: "DIRECT", unknown: "INTEREST", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[1], ancestry: "MULTIPLE_DEPOSITS", task: "DIRECT", unknown: "INTEREST", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[2], ancestry: "SPLIT_PRINCIPAL", task: "INVERSE", unknown: "PRINCIPAL", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[3], ancestry: "EQUAL_INTEREST", task: "INVERSE", unknown: "PRINCIPAL", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[4], ancestry: "COUNTERFACTUAL_CHANGE", task: "DIRECT", unknown: "INTEREST", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[5], ancestry: "PARTIAL_REPAYMENT", task: "DIRECT", unknown: "INTEREST", contributionCount: "TWO", eventCount: 1, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[6], ancestry: "BORROW_LEND_SPREAD", task: "DIRECT", unknown: "INTEREST", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W1[7], ancestry: "DAY_COUNT", task: "DIRECT", unknown: "INTEREST", contributionCount: "ONE", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },

  { prototypeId: W2[0], ancestry: "PIECEWISE_RATE_LEDGER", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[1], ancestry: "PIECEWISE_RATE_LEDGER", task: "INVERSE", unknown: "TIME", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[2], ancestry: "MULTIPLE_DEPOSITS", task: "INVERSE", unknown: "PRINCIPAL", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[3], ancestry: "MULTIPLE_DEPOSITS", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[4], ancestry: "MULTIPLE_DEPOSITS", task: "INVERSE", unknown: "TIME", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[5], ancestry: "MULTIPLE_DEPOSITS", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "RETAIN_PENDING_MERGE_SPLIT" },
  { prototypeId: W2[6], ancestry: "EQUAL_INTEREST", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[7], ancestry: "EQUAL_INTEREST", task: "INVERSE", unknown: "TIME", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[8], ancestry: "COUNTERFACTUAL_CHANGE", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[9], ancestry: "PARTIAL_REPAYMENT", task: "INVERSE", unknown: "REPAYMENT_AMOUNT", contributionCount: "TWO", eventCount: 1, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[10], ancestry: "PARTIAL_REPAYMENT", task: "INVERSE", unknown: "REPAYMENT_TIME", contributionCount: "TWO", eventCount: 1, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[11], ancestry: "BORROW_LEND_SPREAD", task: "INVERSE", unknown: "RATE", contributionCount: "TWO", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
  { prototypeId: W2[12], ancestry: "DAY_COUNT", task: "INVERSE", unknown: "DAYS", contributionCount: "ONE", eventCount: 0, representation: "NARRATIVE", disposition: "MERGE_WITH_ANCESTRY" },
] as const;

export interface IntCp002Wave03Gap {
  gapId: string;
  ancestry: IntCp002Wave03PrototypeCoverage["ancestry"] | "CROSS_ANCESTRY";
  axis: "UNKNOWN_POSITION" | "CONTRIBUTION_TOPOLOGY" | "EVENT_TOPOLOGY" | "UNIT_EDGE" | "REPRESENTATION" | "OWNERSHIP";
  description: string;
  disposition: IntCp002Wave03Disposition;
  plannedWave: "WAVE03A_EDGE_RUNTIME" | "WAVE03B_REPRESENTATION" | "WAVE03C_OWNERSHIP_AUDIT";
}

export const INT_CP002_WAVE03_OPEN_GAPS: readonly IntCp002Wave03Gap[] = [
  { gapId: "CP002-GAP-001", ancestry: "PIECEWISE_RATE_LEDGER", axis: "UNKNOWN_POSITION", description: "Recover principal from a multi-interval rate ledger.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-002", ancestry: "PIECEWISE_RATE_LEDGER", axis: "CONTRIBUTION_TOPOLOGY", description: "Three successive rate intervals with exact total interest.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-003", ancestry: "MULTIPLE_DEPOSITS", axis: "CONTRIBUTION_TOPOLOGY", description: "Three independent contributions and one missing component.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-004", ancestry: "SPLIT_PRINCIPAL", axis: "UNKNOWN_POSITION", description: "Principal ratio and equal-interest split outputs require executable merge/split evidence.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-005", ancestry: "COUNTERFACTUAL_CHANGE", axis: "UNKNOWN_POSITION", description: "Time-change comparison and original-duration inverse are not yet executable.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-006", ancestry: "PARTIAL_REPAYMENT", axis: "EVENT_TOPOLOGY", description: "Two ordered repayments and three outstanding-balance segments.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-007", ancestry: "BORROW_LEND_SPREAD", axis: "UNKNOWN_POSITION", description: "Principal and duration inverse contracts need ownership evidence.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-008", ancestry: "CROSS_ANCESTRY", axis: "UNIT_EDGE", description: "Months, fractional years and mixed declared day/year contributions require exact edge proof.", disposition: "GAP_REQUIRES_EXECUTABLE_PROTOTYPE", plannedWave: "WAVE03A_EDGE_RUNTIME" },
  { gapId: "CP002-GAP-009", ancestry: "CROSS_ANCESTRY", axis: "REPRESENTATION", description: "Compact table representation must preserve visible givens without exposing hidden answers.", disposition: "REPRESENTATION_ONLY", plannedWave: "WAVE03B_REPRESENTATION" },
  { gapId: "CP002-GAP-010", ancestry: "CROSS_ANCESTRY", axis: "REPRESENTATION", description: "Rate and repayment timelines require parity proof against narrative states.", disposition: "REPRESENTATION_ONLY", plannedWave: "WAVE03B_REPRESENTATION" },
  { gapId: "CP002-GAP-011", ancestry: "CROSS_ANCESTRY", axis: "REPRESENTATION", description: "Common-data caselets require a no-new-authority representation decision.", disposition: "REPRESENTATION_ONLY", plannedWave: "WAVE03B_REPRESENTATION" },
  { gapId: "CP002-GAP-012", ancestry: "CROSS_ANCESTRY", axis: "OWNERSHIP", description: "Boundary review against CP-001, instalments, dated cash flows, Average, Partnership, Mixture and Profit & Loss.", disposition: "REASSIGN_BOUNDARY_REVIEW", plannedWave: "WAVE03C_OWNERSHIP_AUDIT" },
] as const;

export const INT_CP002_WAVE03_INVENTORY = Object.freeze({
  id: "INT-CP-002-WAVE03-COVERAGE-INVENTORY-V1",
  existingPrototypeCount: INT_CP002_WAVE03_EXISTING_COVERAGE.length,
  openGapCount: INT_CP002_WAVE03_OPEN_GAPS.length,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  status: "GAPS_OPEN_EXECUTABLE_DISCOVERY_CONTINUES",
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});
