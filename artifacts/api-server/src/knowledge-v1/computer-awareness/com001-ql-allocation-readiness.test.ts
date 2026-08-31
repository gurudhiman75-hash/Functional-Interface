import { strict as assert } from "node:assert";

import { auditCom001QlAllocationReadiness } from "./com001-ql-allocation-readiness";

const audit = auditCom001QlAllocationReadiness();

assert.equal(audit.ready, true, audit.issues.join("\n"));
assert.equal(audit.permanentQlCountCandidate, 9);
assert.deepEqual(audit.provisionalDecisionIds, [
  "MS-001",
  "MS-002",
  "MS-003",
  "MS-004",
  "MS-005",
  "MS-006",
  "MS-009",
  "MS-012",
  "MS-015",
]);
assert.equal(audit.profileCount, 6);
assert.equal(audit.compositionProof.valid, true);
assert.equal(audit.compositionProof.correctOptionId, "B");

for (const heldOut of ["MS-008", "MS-010", "MS-013", "MS-014"] as const) {
  assert.equal(audit.heldOutDecisionIds.includes(heldOut), true);
}
