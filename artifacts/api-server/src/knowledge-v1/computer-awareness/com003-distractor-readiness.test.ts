import { strict as assert } from "node:assert";

import {
  COM003_DISTRACTOR_READINESS,
  auditCom003DistractorReadiness,
} from "./com003-distractor-readiness";

const audit = auditCom003DistractorReadiness();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.taskCount, 19);
assert.equal(audit.semanticTaskIds.length, 7);
assert.equal(audit.controlledTaskIds.length, 12);
assert.equal(audit.versionScopedTaskIds.length, 5);
assert.equal(audit.sharedEngineChangeRequired, false);
assert.equal(audit.controlledPoolImplementationRequired, true);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.equal(audit.productionEligible, false);

for (const requiredControlledTask of [
  "COM003-PT-001",
  "COM003-PT-004",
  "COM003-PT-006",
  "COM003-PT-008",
  "COM003-PT-009",
  "COM003-PT-010",
  "COM003-PT-011",
  "COM003-PT-014",
  "COM003-PT-016",
  "COM003-PT-017",
  "COM003-PT-018",
  "COM003-PT-019",
]) {
  assert.equal(audit.controlledTaskIds.includes(requiredControlledTask), true);
}

for (const versionScopedTask of [
  "COM003-PT-003",
  "COM003-PT-004",
  "COM003-PT-015",
  "COM003-PT-017",
  "COM003-PT-019",
]) {
  assert.equal(audit.versionScopedTaskIds.includes(versionScopedTask), true);
}

assert.equal(
  COM003_DISTRACTOR_READINESS.every((entry) =>
    entry.strategy === "SEMANTIC_FACT_POOL" ? entry.genericRuntimeAllowed : !entry.genericRuntimeAllowed,
  ),
  true,
);

console.log("[COM003-DISTRACTOR-READINESS]", audit);
