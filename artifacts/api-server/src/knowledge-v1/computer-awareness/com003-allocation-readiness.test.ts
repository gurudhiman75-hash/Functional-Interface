import { strict as assert } from "node:assert";

import { auditCom003AllocationReadiness } from "./com003-allocation-readiness";

const audit = auditCom003AllocationReadiness();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.chapterId, "COM-003");
assert.equal(audit.candidateFactCount, 119);
assert.equal(audit.editoriallyApprovedFactCount, 119);
assert.equal(audit.targetFactCount, 114);
assert.equal(audit.provisionalTaskCount, 19);
assert.equal(audit.heldTaskCount, 2);
assert.equal(audit.semanticDistractorTaskCount, 7);
assert.equal(audit.controlledDistractorTaskCount, 12);
assert.equal(audit.controlledPoolCount, 23);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.status, "READY_FOR_PERMANENT_ALLOCATION");
assert.equal(audit.contentFrozen, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

console.log("[COM003-ALLOCATION-READINESS]", audit);
