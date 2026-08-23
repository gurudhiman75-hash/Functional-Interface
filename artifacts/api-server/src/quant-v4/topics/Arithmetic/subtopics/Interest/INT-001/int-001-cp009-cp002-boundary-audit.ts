import { INT_CP002_FINAL_REGISTRY } from "./cp002-final-registry";
import {
  INT_CP009_PERMANENT_ALLOCATION,
  INT_CP009_PERMANENT_QL_IDS,
} from "./cp009-permanent-allocation-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const CP002_SIMPLE_LEDGER_QLS = Object.freeze([
  "INT-QL-028",
  "INT-QL-029",
  "INT-QL-030",
  "INT-QL-031",
  "INT-QL-032",
  "INT-QL-042",
  "INT-QL-043",
  "INT-QL-044",
  "INT-QL-045",
] as const);

const cp002LedgerEntries = INT_CP002_FINAL_REGISTRY.filter((entry) =>
  (CP002_SIMPLE_LEDGER_QLS as readonly string[]).includes(entry.qlId),
);

assert(cp002LedgerEntries.length === 9, `Expected nine CP002 SI-ledger authorities, got ${cp002LedgerEntries.length}`);

const depositEntries = cp002LedgerEntries.filter((entry) =>
  ["MULTIPLE_INDEPENDENT_DEPOSITS", "COMMON_RATE_WEIGHTED_LEDGER"].includes(entry.topology),
);
const repaymentEntries = cp002LedgerEntries.filter((entry) =>
  ["OUTSTANDING_BALANCE_SEGMENTS", "OUTSTANDING_BALANCE_EVENT_COMPARISON"].includes(entry.topology),
);
assert(depositEntries.length === 5, `Expected five CP002 multiple-deposit SI authorities, got ${depositEntries.length}`);
assert(repaymentEntries.length === 4, `Expected four CP002 partial-repayment SI authorities, got ${repaymentEntries.length}`);

for (const entry of cp002LedgerEntries) {
  assert(entry.cpId === "INT-CP-002", `${entry.qlId}: SI-ledger ownership left CP002`);
}

assert(INT_CP009_PERMANENT_QL_IDS.length === 5, "CP009 permanent QL count drifted");
assert(INT_CP009_PERMANENT_QL_IDS.join(",") === "INT-QL-125,INT-QL-126,INT-QL-127,INT-QL-128,INT-QL-129", "CP009 permanent range drifted");

const cp002Ids = new Set(INT_CP002_FINAL_REGISTRY.map((entry) => entry.qlId as string));
const overlap = INT_CP009_PERMANENT_QL_IDS.filter((qlId) => cp002Ids.has(qlId));
assert(overlap.length === 0, `CP002/CP009 permanent identity collision: ${overlap.join(",")}`);

const sourcePrototypeIds = INT_CP009_PERMANENT_ALLOCATION.flatMap((entry) => [...entry.sourcePrototypeIds]);
assert(sourcePrototypeIds.length === 8, `Expected eight CP009 source variants, got ${sourcePrototypeIds.length}`);
assert(new Set(sourcePrototypeIds).size === 8, "CP009 source-prototype collision detected");

for (const authority of INT_CP009_PERMANENT_ALLOCATION) {
  assert(
    authority.ownershipBoundary === "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
    `${authority.qlId}: CP009 ownership boundary drifted`,
  );
  assert(!/SIMPLE|DAY_COUNT|PIECEWISE|PARTIAL_REPAYMENT_TOTAL_INTEREST/u.test(authority.solveContract), `${authority.qlId}: CP009 contract claims CP002 SI territory`);
}

const cp009Contracts = new Set(INT_CP009_PERMANENT_ALLOCATION.map((entry) => entry.solveContract));
for (const cp002Entry of cp002LedgerEntries) {
  assert(!cp009Contracts.has(cp002Entry.solveContract), `${cp002Entry.qlId}: CP002 solve contract duplicated in CP009`);
}

console.log(JSON.stringify({
  boundaryAuditVersion: "INT-CP-009-CP002-BOUNDARY-v1",
  boundary: "SIMPLE_INTEREST_LEDGER_CP002__COMPOUND_DATED_CASH_FLOW_CP009",
  cp002SiLedgerQlCount: cp002LedgerEntries.length,
  cp002MultiDepositQlCount: depositEntries.length,
  cp002PartialRepaymentQlCount: repaymentEntries.length,
  cp009QlCount: INT_CP009_PERMANENT_QL_IDS.length,
  cp009SourceVariantCount: sourcePrototypeIds.length,
  identityOverlap: overlap.length,
  cp009OwnershipBoundary: "COMPOUND_EXACT_PERIODIC_HETEROGENEOUS_DATED_CASH_FLOW",
}, null, 2));
console.log("PASS_INT_CP009_CP002_BOUNDARY_AUDIT");
