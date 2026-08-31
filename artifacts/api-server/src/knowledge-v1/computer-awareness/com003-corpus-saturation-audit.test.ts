import { strict as assert } from "node:assert";

import {
  COM003_TASK_COVERAGE_RULES,
  auditCom003CorpusSaturation,
} from "./com003-corpus-saturation-audit";

const audit = auditCom003CorpusSaturation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 119);
assert.equal(audit.provisionalTaskCount, 19);
assert.equal(audit.heldTaskCount, 2);
assert.equal(COM003_TASK_COVERAGE_RULES.length, 19);
assert.equal(audit.coverage.length, 19);
assert.equal(audit.coverage.every((entry) => entry.saturated), true);
assert.equal(audit.corpusSaturated, true);
assert.equal(audit.readyForEditorialFactReview, true);
assert.equal(audit.status, "READY_FOR_EDITORIAL_FACT_REVIEW");
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.allocationReady, false);
assert.equal(audit.productionEligible, false);
assert.equal(audit.versionScopedTaskIds.includes("COM003-PT-015"), true);
assert.equal(audit.versionScopedTaskIds.includes("COM003-PT-017"), true);
assert.equal(audit.versionScopedTaskIds.includes("COM003-PT-019"), true);

// Atomic-fact saturation is deliberately distinct from final generation
// readiness. Small context groups still require dedicated distractor design or
// a reviewed cross-group eligibility policy before permanent QL allocation.
assert.equal(audit.thinDistractorContextGroups.length > 0, true);
assert.equal(audit.distractorDesignComplete, false);

console.log("[COM003-CORPUS-SATURATION]", audit);
