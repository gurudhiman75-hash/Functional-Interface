import assert from "node:assert/strict";
import { auditCom004CorpusSaturation } from "./com004-corpus-saturation-audit";

const audit = auditCom004CorpusSaturation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 100);
assert.equal(audit.provisionalTaskCount, 19);
assert.equal(audit.heldTaskCount, 2);
assert.equal(audit.coverage.length, 19);
assert.equal(audit.corpusSaturated, true);
assert.deepEqual(audit.versionScopedTaskIds.sort(), ["COM004-PT-014", "COM004-PT-015", "COM004-PT-016", "COM004-PT-018"]);
assert.equal(audit.readyForDistractorCapacityAudit, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.equal(audit.productionEligible, false);
assert.equal(audit.status, "READY_FOR_DISTRACTOR_CAPACITY_AUDIT");
