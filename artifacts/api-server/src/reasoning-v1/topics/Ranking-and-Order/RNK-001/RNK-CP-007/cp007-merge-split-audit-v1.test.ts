import assert from "node:assert/strict";

import {
  RNK_CP007_ARCHITECTURE_HYPOTHESES,
  RNK_CP007_CANDIDATE_AUDIT,
  RNK_CP007_LIFECYCLE,
  RNK_CP007_MERGE_SPLIT_AUDIT_VERSION,
} from "./cp007-merge-split-audit-v1";

assert.equal(RNK_CP007_MERGE_SPLIT_AUDIT_VERSION, "RNK_CP007_MERGE_SPLIT_AUDIT_V1");
assert.equal(RNK_CP007_CANDIDATE_AUDIT.length, 4);
assert.equal(new Set(RNK_CP007_CANDIDATE_AUDIT.map((entry) => entry.id)).size, 4);
assert.equal(RNK_CP007_CANDIDATE_AUDIT.some((entry) => entry.permanentQlAllocated), false);

const byId = Object.fromEntries(RNK_CP007_CANDIDATE_AUDIT.map((entry) => [entry.id, entry]));
assert.equal(byId.CATEGORY_COMPOSITION_AROUND_RANK!.disposition, "PROVISIONAL_AUTHORITY_CANDIDATE");
assert.equal(byId.DERIVED_QUANTITY_ORDER!.disposition, "DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED");
assert.equal(byId.NUMERIC_VALUE_CONSTRAINED_ORDER!.disposition, "HOLD_MERGE_WITH_DERIVED_QUANTITY");
assert.equal(byId.RELATIONAL_SIDE_COUNT_EQUATION!.disposition, "REDIRECT_CP001_EXTENSION");

assert.ok(byId.CATEGORY_COMPOSITION_AROUND_RANK!.nearestExistingOwnership.includes("RNK-QL-009"));
assert.ok(byId.DERIVED_QUANTITY_ORDER!.nearestExistingOwnership.includes("RNK-QL-027"));
assert.ok(byId.DERIVED_QUANTITY_ORDER!.nearestExistingOwnership.includes("RNK-QL-036"));
assert.ok(byId.RELATIONAL_SIDE_COUNT_EQUATION!.nearestExistingOwnership.includes("RNK-QL-003"));

assert.equal(
  RNK_CP007_ARCHITECTURE_HYPOTHESES.derivedQuantity.preferred,
  "DERIVATION_ADAPTER_PLUS_EXISTING_ORDER_QUERY_AUTHORITY",
);
assert.equal(RNK_CP007_ARCHITECTURE_HYPOTHESES.relationalSideCount.preferred, "CP001_EXTENSION");

// Q66 normalizes to ordinary CP001 side counts after one algebraic solve.
// Let b = people behind Anil. Then people ahead = 2b and N = 3b + 1.
// Ganesh has b people ahead, so Ganesh's behind count is N - b - 1 = 2b.
for (const b of [2, 3, 4, 5, 6, 8, 10]) {
  const total = 3 * b + 1;
  const anilAhead = 2 * b;
  const ganeshAhead = b;
  const ganeshBehind = total - ganeshAhead - 1;
  assert.equal(anilAhead + b + 1, total);
  assert.equal(ganeshBehind, 2 * b);
}

assert.deepEqual(RNK_CP007_LIFECYCLE, {
  permanentQlCount: 0,
  nextAvailableQl: "RNK-QL-042",
  englishFreeze: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publicPublication: false,
  hindiPunjabi: "NOT_STARTED",
});

console.log(JSON.stringify({
  status: "PASS",
  auditVersion: RNK_CP007_MERGE_SPLIT_AUDIT_VERSION,
  candidates: RNK_CP007_CANDIDATE_AUDIT.map((entry) => ({
    id: entry.id,
    disposition: entry.disposition,
    sourceFixtures: entry.sourceFixtures,
  })),
  preferredDerivedQuantityArchitecture: RNK_CP007_ARCHITECTURE_HYPOTHESES.derivedQuantity.preferred,
  ql042Allocated: false,
  lifecycle: RNK_CP007_LIFECYCLE,
}, null, 2));
