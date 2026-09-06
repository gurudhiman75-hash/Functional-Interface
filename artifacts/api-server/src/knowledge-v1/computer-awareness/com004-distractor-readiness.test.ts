import assert from "node:assert/strict";
import { COM004_DISTRACTOR_READINESS, auditCom004DistractorReadiness } from "./com004-distractor-readiness";

const audit = auditCom004DistractorReadiness();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM004_DISTRACTOR_READINESS.length, 19);
assert.equal(audit.taskCount, 19);
assert.equal(audit.semanticTaskIds.length, 4);
assert.equal(audit.controlledTaskIds.length, 15);
assert.deepEqual(audit.versionScopedTaskIds.sort(), ["COM004-PT-014", "COM004-PT-015", "COM004-PT-016", "COM004-PT-018"]);
assert.equal(audit.sharedEngineChangeRequired, false);
assert.equal(audit.controlledPoolImplementationRequired, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, true);
assert.equal(audit.productionEligible, false);
assert.equal(audit.nextGate, "COM004_EDITORIAL_FACT_REVIEW_AND_PERMANENT_QL_ALLOCATION");
