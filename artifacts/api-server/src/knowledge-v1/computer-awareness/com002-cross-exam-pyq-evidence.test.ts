import { strict as assert } from "node:assert";

import {
  COM002_CROSS_EXAM_PYQ_EVIDENCE,
  auditCom002CrossExamPyqEvidence,
} from "./com002-cross-exam-pyq-evidence";

const audit = auditCom002CrossExamPyqEvidence();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.evidenceCount, 5);
assert.equal(audit.bankingCount, 5);

for (const requiredCandidate of [
  "OS-DISC-001",
  "OS-DISC-002",
  "OS-DISC-003",
  "OS-DISC-006",
  "OS-DISC-011",
  "OS-DISC-016",
  "OS-DISC-017",
]) {
  assert.equal(
    audit.supportedCandidateIds.includes(requiredCandidate),
    true,
    `Banking evidence does not cover ${requiredCandidate}`,
  );
}

assert.equal(
  COM002_CROSS_EXAM_PYQ_EVIDENCE.every(
    (entry) => entry.evidenceUse === "TASK_RELEVANCE_ONLY",
  ),
  true,
);

console.log("[COM002-CROSS-EXAM-PYQ]", audit);
