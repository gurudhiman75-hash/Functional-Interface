import assert from "node:assert/strict";
import {
  CLOCK_BOUNDARY_AUDIT,
  CLOCK_CANDIDATE_DISPOSITION,
  CLOCK_DISCOVERY_GATE_POLICY,
  CLOCK_GAP_AUDIT,
  CLOCK_INVERSE_AUDIT,
  CLOCK_SOURCE_AUDIT,
  CLOCK_TASK_CATALOG,
  clockDiscoveryAuditSummary,
  provisionalClockAuthorityClusters,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
const authorityClusters = provisionalClockAuthorityClusters();
const inverseClusters = Object.keys(CLOCK_INVERSE_AUDIT).sort();
const boundaryClusters = Object.keys(CLOCK_BOUNDARY_AUDIT).sort();

assert.deepEqual(inverseClusters, [...authorityClusters].sort(), "Every provisional authority cluster needs an inverse decision.");
assert.deepEqual(boundaryClusters, [...authorityClusters].sort(), "Every provisional authority cluster needs a boundary decision.");
assert.deepEqual(new Set(Object.keys(CLOCK_GAP_AUDIT)), new Set(taskIds), "Every source-candidate row needs a gap disposition.");

for (const cluster of authorityClusters) {
  const inverse = CLOCK_INVERSE_AUDIT[cluster];
  const boundary = CLOCK_BOUNDARY_AUDIT[cluster];
  assert(inverse.note.length > 0, `${cluster} inverse note is empty.`);
  assert(inverse.evidenceTaskIds.length > 0, `${cluster} inverse evidence is empty.`);
  assert(boundary.note.length > 0, `${cluster} boundary note is empty.`);
  assert(boundary.evidenceTaskIds.length > 0, `${cluster} boundary evidence is empty.`);
  assert(boundary.obligations.length > 0, `${cluster} has no boundary obligations.`);

  for (const taskId of inverse.evidenceTaskIds) {
    assert(taskIds.includes(taskId), `${cluster} inverse audit references unknown task ${taskId}.`);
  }
  for (const taskId of boundary.evidenceTaskIds) {
    assert(taskIds.includes(taskId), `${cluster} boundary audit references unknown task ${taskId}.`);
  }
  if (inverse.counterpartCluster) {
    assert(authorityClusters.includes(inverse.counterpartCluster), `${cluster} points to unknown inverse cluster ${inverse.counterpartCluster}.`);
  }
}

for (const taskId of taskIds) {
  const disposition = CLOCK_CANDIDATE_DISPOSITION[taskId];
  const source = CLOCK_SOURCE_AUDIT[taskId];
  const gap = CLOCK_GAP_AUDIT[taskId];

  assert.equal(gap.cluster, disposition.cluster);
  assert.equal(gap.sourceEvidenceLevel, source.evidenceLevel);
  assert(gap.note.length > 0, `${taskId} gap note is empty.`);

  if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
    assert.equal(gap.status, "INTERNAL_ONLY");
  }
  if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    if (source.evidenceLevel === "DIRECT_SOURCE" || source.evidenceLevel === "DIRECT_MULTI_SOURCE") {
      assert.equal(gap.status, "UNRESOLVED_SOURCE_BACKED_HOLD");
    } else {
      assert.equal(gap.status, "INTENTIONAL_ADVANCED_HOLD");
    }
  }
}

assert.equal(CLOCK_INVERSE_AUDIT.VERTICAL_MIRROR_TIME.status, "SELF_INVERSE");
assert.equal(CLOCK_INVERSE_AUDIT.UNIFORM_FAULTY_CLOCK_MAPPING.status, "EXPLICIT_INVERSE_COVERED");
assert.equal(CLOCK_INVERSE_AUDIT.STANDARD_HOUR_STRIKE_TOTAL.status, "ADVANCED_INVERSE_HELD");
assert(CLOCK_BOUNDARY_AUDIT.EVENT_COUNT_IN_INTERVAL.obligations.includes("ADJACENT_WINDOW_DOUBLE_COUNT"));
assert(CLOCK_BOUNDARY_AUDIT.TIME_FOR_ARBITRARY_ANGLE.obligations.includes("PLUS_MINUS_BRANCHES"));
assert(CLOCK_BOUNDARY_AUDIT.STRIKE_GAP_MECHANICS.obligations.includes("N_MINUS_ONE_GAPS"));
assert(CLOCK_BOUNDARY_AUDIT.VERTICAL_MIRROR_TIME.obligations.includes("NO_NUMERIC_WATER_TIME"));

const summary = clockDiscoveryAuditSummary();
assert.deepEqual(summary.authorityClusters, authorityClusters);
assert.deepEqual(summary.inverseClusters, [...authorityClusters].sort());
assert.deepEqual(summary.boundaryClusters, [...authorityClusters].sort());
assert(summary.unresolvedSourceBackedHolds.includes("TIME_AFTER_HANDS_INTERCHANGED"));
assert.equal(CLOCK_GAP_AUDIT.MIRROR_GEOMETRIC_VERIFICATION.status, "INTERNAL_ONLY");

assert.equal(CLOCK_DISCOVERY_GATE_POLICY.status, "PROVISIONAL_INVERSE_BOUNDARY_GAP_AUDIT");
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.inverseAuditComplete, true);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.boundaryAuditComplete, true);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.gapAuditComplete, true);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.sourceSaturationComplete, false);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.difficultyAuditComplete, false);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.multilingualRiskAuditComplete, false);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.humanEditorialFreezeComplete, false);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_DISCOVERY_GATE_POLICY.discoveryFreezeEligible, false);
assert.equal(summary.discoveryFreezeEligible, false);

console.log(JSON.stringify({
  status: "PASS_CLK_001_PROVISIONAL_INVERSE_BOUNDARY_GAP_AUDIT",
  sourceCandidateRows: taskIds.length,
  provisionalAuthorityClusters: authorityClusters.length,
  inverseAuditClusters: inverseClusters.length,
  boundaryAuditClusters: boundaryClusters.length,
  unresolvedSourceBackedHolds: summary.unresolvedSourceBackedHolds,
  intentionalAdvancedHolds: summary.intentionalAdvancedHolds.length,
  policy: CLOCK_DISCOVERY_GATE_POLICY,
}, null, 2));
