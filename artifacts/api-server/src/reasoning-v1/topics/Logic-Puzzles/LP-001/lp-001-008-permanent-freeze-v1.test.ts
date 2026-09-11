import assert from "node:assert/strict";
import { LP_001_008_ENGLISH_APPROVAL_V4_2 } from "./lp-001-008-english-approval-v4-2.ts";
import { LP_001_008_ENGLISH_FREEZE_V1, LP_001_008_PERMANENT_QL_ALLOCATIONS } from "./lp-001-008-permanent-freeze-v1.ts";
import { LP_001_010_PERMANENT_QL_REGISTRY_V1 } from "./lp-001-010-permanent-ql-registry-v1.ts";

function ql(index: number) {
  return `LP-QL-${String(index).padStart(3, "0")}`;
}

assert.equal(LP_001_008_ENGLISH_APPROVAL_V4_2.approvalStatus, "PRODUCT_OWNER_APPROVED");
assert.equal(LP_001_008_ENGLISH_APPROVAL_V4_2.approvedSourceAuthority, "LP_001_008_STABILIZED_ENGLISH_V4_2");
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.approvedEditorialAuthority, LP_001_008_ENGLISH_APPROVAL_V4_2.authorityId);
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.englishFreezeStatus, "FROZEN");
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.localizationStatus, "READY_TO_START");
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.permanentQlCount, 32);
assert.deepEqual(LP_001_008_ENGLISH_FREEZE_V1.permanentQlIds, Array.from({ length: 32 }, (_, index) => ql(index + 1)));
assert.equal(LP_001_008_ENGLISH_FREEZE_V1.packages.length, 8);

for (let packageIndex = 0; packageIndex < 8; packageIndex += 1) {
  const pkg = LP_001_008_ENGLISH_FREEZE_V1.packages[packageIndex]!;
  const first = packageIndex * 4 + 1;
  assert.equal(pkg.packageId, `LP-${String(packageIndex + 1).padStart(3, "0")}`);
  assert.equal(pkg.checkpointId, `LP-CP-${String(packageIndex + 1).padStart(3, "0")}`);
  assert.equal(pkg.permanentQlCount, 4);
  assert.equal(pkg.permanentQlAllocationStatus, "ALLOCATED");
  assert.equal(pkg.englishFreezeStatus, "FROZEN");
  assert.deepEqual(pkg.permanentQlIds, [ql(first), ql(first + 1), ql(first + 2), ql(first + 3)]);
}

assert.equal(LP_001_008_PERMANENT_QL_ALLOCATIONS.length, 32);
assert.equal(new Set(LP_001_008_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId)).size, 32);
assert.ok(LP_001_008_PERMANENT_QL_ALLOCATIONS.every((entry) => entry.task.length > 20));
assert.ok(LP_001_008_PERMANENT_QL_ALLOCATIONS.every((entry) => entry.authorityId.length > 5));

assert.equal(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlCount, 40);
assert.deepEqual(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlIds, Array.from({ length: 40 }, (_, index) => ql(index + 1)));
assert.equal(new Set(LP_001_010_PERMANENT_QL_REGISTRY_V1.permanentQlIds).size, 40);
assert.equal(LP_001_010_PERMANENT_QL_REGISTRY_V1.nextAvailableQlId, "LP-QL-041");
assert.deepEqual(LP_001_010_PERMANENT_QL_REGISTRY_V1.allocatedRange, ["LP-QL-001", "LP-QL-040"]);

console.log("LP-001–LP-008 English V4.2 freeze passed: QLs 001–032 permanent; chapter registry is contiguous through LP-QL-040; next available LP-QL-041.");
