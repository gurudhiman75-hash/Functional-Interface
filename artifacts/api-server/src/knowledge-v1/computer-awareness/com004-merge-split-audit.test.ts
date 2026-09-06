import { strict as assert } from "node:assert";

import {
  COM004_PROVISIONAL_LEARNER_TASKS,
  auditCom004MergeSplitOwnership,
} from "./com004-merge-split-audit";

const audit = auditCom004MergeSplitOwnership();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, 42);
assert.equal(audit.provisionalTaskCount, 19);
assert.equal(audit.heldTaskCount, 2);
assert.deepEqual(audit.heldCandidateIds.sort(), ["WEB-DISC-041", "WEB-DISC-042"]);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.mergeSplitReady, true);
assert.equal(audit.allocationReady, false);
assert.equal(audit.nextGate, "COM004_SOURCE_BACKED_ATOMIC_FACT_CORPUS_AND_DISTRACTOR_CAPACITY");

const allOwned = COM004_PROVISIONAL_LEARNER_TASKS.flatMap((task) => task.candidateIds);
assert.equal(new Set(allOwned).size, 42);
assert.equal(allOwned.length, 42);

for (const requiredTask of [
  "COM004-PT-001",
  "COM004-PT-002",
  "COM004-PT-003",
  "COM004-PT-005",
  "COM004-PT-007",
  "COM004-PT-010",
  "COM004-PT-014",
  "COM004-PT-018",
  "COM004-PT-019",
]) {
  assert.equal(
    COM004_PROVISIONAL_LEARNER_TASKS.some((task) => task.provisionalTaskId === requiredTask),
    true,
    `COM-004 merge/split audit missing ${requiredTask}`,
  );
}

const fundTransfers = COM004_PROVISIONAL_LEARNER_TASKS.find((task) => task.provisionalTaskId === "COM004-PT-018");
assert.ok(fundTransfers);
assert.equal(fundTransfers.rationale.some((line) => /mutable limits|charges|batch counts|availability/i.test(line)), true);

const https = COM004_PROVISIONAL_LEARNER_TASKS.find((task) => task.provisionalTaskId === "COM004-PT-006");
assert.ok(https);
assert.equal(https.rationale.some((line) => /trustworthy site/i.test(line)), true);

console.log("[COM004-MERGE-SPLIT-AUDIT]", audit);
