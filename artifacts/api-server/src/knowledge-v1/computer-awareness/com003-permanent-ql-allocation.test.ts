import { strict as assert } from "node:assert";

import {
  COM003_HELD_DISCOVERY_CANDIDATES,
  COM003_PERMANENT_CPS,
  COM003_PERMANENT_QLS,
  auditCom003PermanentAllocation,
} from "./com003-permanent-ql-allocation";

const audit = auditCom003PermanentAllocation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.chapterId, "COM-003");
assert.equal(audit.cpCount, 4);
assert.equal(audit.qlCount, 19);
assert.equal(audit.heldCandidateCount, 2);
assert.equal(audit.semanticDistractorQlCount, 7);
assert.equal(audit.controlledDistractorQlCount, 12);
assert.equal(audit.versionScopedQlCount, 5);
assert.equal(audit.status, "PERMANENT_TAXONOMY_ALLOCATED");
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

assert.deepEqual(COM003_PERMANENT_CPS.map((cp) => cp.qlIds.length), [3, 4, 8, 4]);
assert.deepEqual(
  COM003_HELD_DISCOVERY_CANDIDATES.map((entry) => entry.candidateId).sort(),
  ["OFF-DISC-039", "OFF-DISC-040"],
);

for (let index = 0; index < COM003_PERMANENT_QLS.length; index += 1) {
  assert.equal(COM003_PERMANENT_QLS[index]?.qlId, `COM-003-QL-${String(index + 1).padStart(3, "0")}`);
}

console.log("[COM003-PERMANENT-QL-ALLOCATION]", audit);
