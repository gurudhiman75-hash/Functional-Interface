import { strict as assert } from "node:assert";

import {
  COM003_PROVISIONAL_LEARNER_TASKS,
  auditCom003MergeSplitOwnership,
} from "./com003-office-productivity-merge-split-audit";

const audit = auditCom003MergeSplitOwnership();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, 40);
assert.equal(audit.provisionalTaskCount, 19);
assert.equal(audit.heldTaskCount, 2);
assert.deepEqual(audit.heldCandidateIds.sort(), ["OFF-DISC-039", "OFF-DISC-040"]);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);

const allOwned = COM003_PROVISIONAL_LEARNER_TASKS.flatMap((task) => task.candidateIds);
assert.equal(new Set(allOwned).size, 40);
assert.equal(allOwned.length, 40);

for (const requiredTask of [
  "COM003-PT-001",
  "COM003-PT-002",
  "COM003-PT-007",
  "COM003-PT-008",
  "COM003-PT-010",
  "COM003-PT-011",
  "COM003-PT-015",
  "COM003-PT-017",
  "COM003-PT-018",
  "COM003-PT-019",
]) {
  assert.equal(
    COM003_PROVISIONAL_LEARNER_TASKS.some((task) => task.provisionalTaskId === requiredTask),
    true,
    `COM-003 merge/split audit missing ${requiredTask}`,
  );
}

const excelShortcuts = COM003_PROVISIONAL_LEARNER_TASKS.find((task) => task.provisionalTaskId === "COM003-PT-015");
assert.ok(excelShortcuts);
assert.equal(excelShortcuts.rationale.some((line) => /version/i.test(line)), true);

const insertObjects = COM003_PROVISIONAL_LEARNER_TASKS.find((task) => task.provisionalTaskId === "COM003-PT-017");
assert.ok(insertObjects);
assert.equal(insertObjects.splitConditions?.some((line) => /hold|narrow/i.test(line)), true);

console.log("[COM003-OFFICE-MERGE-SPLIT-AUDIT]", audit);