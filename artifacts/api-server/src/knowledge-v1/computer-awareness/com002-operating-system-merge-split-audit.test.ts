import { strict as assert } from "node:assert";

import {
  COM002_PROVISIONAL_LEARNER_TASKS,
  auditCom002MergeSplitOwnership,
} from "./com002-operating-system-merge-split-audit";

const audit = auditCom002MergeSplitOwnership();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, 25);
assert.equal(audit.provisionalTaskCount, 13);
assert.equal(audit.heldTaskCount, 2);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.deepEqual(audit.heldCandidateIds.sort(), ["OS-DISC-024", "OS-DISC-025"]);

const bootTask = COM002_PROVISIONAL_LEARNER_TASKS.find(
  (task) => task.provisionalTaskId === "COM002-PT-006",
);
assert.ok(bootTask);
assert.deepEqual(bootTask.candidateIds, ["OS-DISC-011"]);

const extensionTask = COM002_PROVISIONAL_LEARNER_TASKS.find(
  (task) => task.provisionalTaskId === "COM002-PT-009",
);
assert.ok(extensionTask);
assert.deepEqual(extensionTask.candidateIds, ["OS-DISC-016", "OS-DISC-017"]);

const matchingHold = COM002_PROVISIONAL_LEARNER_TASKS.find(
  (task) => task.provisionalTaskId === "COM002-HOLD-001",
);
assert.equal(matchingHold?.disposition, "HOLD");

console.log("[COM002-MERGE-SPLIT]", audit);
