import { strict as assert } from "node:assert";

import {
  COM001_CP_001,
  COM001_HELD_DISCOVERY_TASKS,
  COM001_MEMORY_STORAGE_QLS,
  auditCom001PermanentQlAllocation,
} from "./com001-memory-storage-ql-allocation";

const audit = auditCom001PermanentQlAllocation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM001_CP_001.cpId, "COM-001-CP-001");
assert.equal(COM001_CP_001.name, "Memory & Storage");
assert.equal(audit.qlCount, 9);
assert.deepEqual(audit.qlIds, [
  "COM-001-QL-001",
  "COM-001-QL-002",
  "COM-001-QL-003",
  "COM-001-QL-004",
  "COM-001-QL-005",
  "COM-001-QL-006",
  "COM-001-QL-007",
  "COM-001-QL-008",
  "COM-001-QL-009",
]);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.factsApproved, false);
assert.equal(
  COM001_MEMORY_STORAGE_QLS.every(
    (entry) => entry.runtimeStatus === "ALLOCATED_NOT_REGISTERED",
  ),
  true,
);

for (const heldDecisionId of ["MS-008", "MS-010", "MS-013", "MS-014"] as const) {
  assert.equal(COM001_HELD_DISCOVERY_TASKS.includes(heldDecisionId), true);
  assert.equal(
    COM001_MEMORY_STORAGE_QLS.some(
      (entry) => entry.sourceDecisionId === heldDecisionId,
    ),
    false,
  );
}
