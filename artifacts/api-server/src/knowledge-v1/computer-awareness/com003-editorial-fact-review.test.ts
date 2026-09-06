import { strict as assert } from "node:assert";

import {
  COM003_EDITORIAL_SUPPORT_FACTS,
  COM003_EDITORIAL_TARGET_FACTS,
  COM003_EDITORIAL_VALIDATOR_FACTS,
  auditCom003EditorialFactReview,
  getCom003EditorialDecision,
} from "./com003-editorial-fact-review";

// One-off CI trigger for distractor + editorial review readiness.
const audit = auditCom003EditorialFactReview();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 119);
assert.equal(audit.approvedCount, 119);
assert.equal(audit.targetFactCount, 114);
assert.equal(audit.supportFactCount, 4);
assert.equal(audit.validatorFactCount, 1);
assert.equal(audit.heldCount, 0);
assert.equal(audit.rejectedCount, 0);
assert.equal(audit.targetTaskCount, 19);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.equal(audit.runtimeRegistered, false);
assert.equal(audit.productionReleased, false);

for (const supportFactId of [
  "com003-command-redo",
  "com003-shortcut-ctrl-y",
  "com003-excel-autosum-detect-range",
  "com003-excel-filter-not-sort",
]) {
  assert.equal(COM003_EDITORIAL_SUPPORT_FACTS.some((fact) => fact.factId === supportFactId), true);
  assert.equal(COM003_EDITORIAL_TARGET_FACTS.some((fact) => fact.factId === supportFactId), false);
}

assert.equal(COM003_EDITORIAL_VALIDATOR_FACTS.length, 1);
assert.equal(COM003_EDITORIAL_VALIDATOR_FACTS[0]?.factId, "com003-powerpoint-web-insert-picture-tab");
assert.equal(
  getCom003EditorialDecision("com003-excel-function-count")?.generationNotes?.some((note) => /COUNTA|COUNTIF/i.test(note)),
  true,
);
assert.equal(
  getCom003EditorialDecision("com003-excel-shortcut-alt-h-o-w")?.generationNotes?.some((note) => /Windows desktop/i.test(note)),
  true,
);

console.log("[COM003-EDITORIAL-FACT-REVIEW]", audit);
