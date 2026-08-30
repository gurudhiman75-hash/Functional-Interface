import { strict as assert } from "node:assert";

import {
  COM002_HELD_DISCOVERY_CANDIDATES,
  COM002_PERMANENT_CPS,
  COM002_PERMANENT_QLS,
  auditCom002PermanentAllocation,
} from "./com002-permanent-ql-allocation";

const audit = auditCom002PermanentAllocation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.status, "PERMANENT_TAXONOMY_ALLOCATED");
assert.equal(audit.chapterId, "COM-002");
assert.equal(audit.cpCount, 2);
assert.equal(audit.qlCount, 13);
assert.equal(audit.heldCandidateCount, 2);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);

assert.deepEqual(COM002_PERMANENT_CPS.map((cp) => [cp.cpId, cp.qlIds.length]), [
  ["COM-002-CP-001", 7],
  ["COM-002-CP-002", 6],
]);
assert.deepEqual(
  COM002_PERMANENT_QLS.map((ql) => ql.qlId),
  Array.from({ length: 13 }, (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.deepEqual(
  COM002_HELD_DISCOVERY_CANDIDATES.map((entry) => entry.candidateId).sort(),
  ["OS-DISC-024", "OS-DISC-025"],
);

for (const ql of COM002_PERMANENT_QLS) {
  assert.equal(ql.status, "ALLOCATED_NOT_CONTENT_FROZEN");
  assert.equal(ql.supportedSolveModes.length >= 2, true);
  assert.equal(ql.ownershipBoundaries.length > 0, true);
}

console.log("[COM002-PERMANENT-ALLOCATION]", audit);
