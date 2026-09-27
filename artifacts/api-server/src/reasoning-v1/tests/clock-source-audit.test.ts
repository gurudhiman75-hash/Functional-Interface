import assert from "node:assert/strict";
import {
  CLOCK_SOURCE_AUDIT,
  CLOCK_SOURCE_AUDIT_POLICY,
  CLOCK_SOURCE_EVIDENCE,
  CLOCK_TASK_CATALOG,
  clockSourceAuditSummary,
} from "../topics/Clocks/CLK-001/runtime";

assert.equal(CLOCK_SOURCE_AUDIT_POLICY.status, "PROVISIONAL_SOURCE_FREQUENCY_AUDIT");
assert.equal(CLOCK_SOURCE_AUDIT_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_SOURCE_AUDIT_POLICY.rowCountHasProductMeaning, false);
assert.equal(CLOCK_SOURCE_AUDIT_POLICY.sourceSaturationComplete, false);
assert.equal(CLOCK_SOURCE_AUDIT_POLICY.humanEditorialFreezeComplete, false);

const catalogIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
const auditIds = Object.keys(CLOCK_SOURCE_AUDIT);
assert.equal(new Set(catalogIds).size, catalogIds.length);
assert.equal(new Set(auditIds).size, auditIds.length);
assert.deepEqual(new Set(auditIds), new Set(catalogIds));

for (const taskId of catalogIds) {
  const record = CLOCK_SOURCE_AUDIT[taskId];
  assert(record.note.length > 0, `${taskId} source-audit note is empty.`);
  assert(record.evidenceRefs.length > 0, `${taskId} source-audit evidence is empty.`);
  assert(record.flags.length > 0, `${taskId} has no audit disposition flag.`);
  for (const evidenceRef of record.evidenceRefs) {
    assert(evidenceRef in CLOCK_SOURCE_EVIDENCE, `${taskId} references unknown evidence ${evidenceRef}.`);
  }
}

assert.equal(CLOCK_SOURCE_AUDIT.MIRROR_GEOMETRIC_VERIFICATION.evidenceLevel, "INTERNAL_REVIEW_METADATA_ONLY");
assert(CLOCK_SOURCE_AUDIT.MIRROR_GEOMETRIC_VERIFICATION.flags.includes("DO_NOT_PROMOTE_TO_LEARNER_QL"));
assert.equal(CLOCK_SOURCE_AUDIT.HAND_SECOND_ROTATION.evidenceLevel, "DIRECT_SOURCE");
assert.equal(CLOCK_SOURCE_AUDIT.GAIN_FROM_COINCIDENCE_INTERVAL.evidenceLevel, "DIRECT_MULTI_SOURCE");
assert.equal(CLOCK_SOURCE_AUDIT.PIECEWISE_RATE.evidenceLevel, "DESIGN_INCLUDED_SOURCE_SPARSE");
assert.equal(CLOCK_SOURCE_AUDIT.RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE.evidenceLevel, "DESIGN_INCLUDED_SOURCE_SPARSE");
assert.equal(CLOCK_SOURCE_AUDIT.TEXT_DIAGRAM_SYNTHESIS.evidenceLevel, "DESIGN_INCLUDED_SOURCE_SPARSE");

const summary = clockSourceAuditSummary();
assert.equal(Object.values(summary).reduce((total, count) => total + count, 0), CLOCK_TASK_CATALOG.length);
assert(summary.DIRECT_MULTI_SOURCE > 0);
assert(summary.DIRECT_SOURCE > 0);
assert(summary.ADJACENT_SOURCE > 0);
assert(summary.DESIGN_INCLUDED_SOURCE_SPARSE > 0);
assert.equal(summary.INTERNAL_REVIEW_METADATA_ONLY, 1);

const calibrationRequired = catalogIds.filter((taskId) =>
  CLOCK_SOURCE_AUDIT[taskId].flags.includes("VALUE_POOL_CALIBRATION_REQUIRED"),
).length;
const limitedAdvanced = catalogIds.filter((taskId) =>
  CLOCK_SOURCE_AUDIT[taskId].flags.includes("ADVANCED_LIMITED_USE"),
).length;
const noLearnerQl = catalogIds.filter((taskId) =>
  CLOCK_SOURCE_AUDIT[taskId].flags.includes("DO_NOT_PROMOTE_TO_LEARNER_QL"),
).length;

assert(calibrationRequired > 0);
assert(limitedAdvanced > 0);
assert.equal(noLearnerQl, 1);

console.log(JSON.stringify({
  status: "PASS_CLK_001_PROVISIONAL_SOURCE_FREQUENCY_AUDIT",
  sourceCandidateRows: CLOCK_TASK_CATALOG.length,
  evidenceSummary: summary,
  calibrationRequired,
  limitedAdvanced,
  doNotPromoteToLearnerQl: noLearnerQl,
  policy: CLOCK_SOURCE_AUDIT_POLICY,
}, null, 2));
