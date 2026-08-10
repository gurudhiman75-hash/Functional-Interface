import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_BOUNDARY_AUDIT,
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY,
  CLOCK_EFFECTIVE_GAP_AUDIT,
  CLOCK_EFFECTIVE_INVERSE_AUDIT,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  CLOCK_TASK_CATALOG,
  clockEffectiveDiscoveryAuditSummary,
  effectiveClockAuthorityClusters,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
const authorityClusters = effectiveClockAuthorityClusters();
const inverseClusters = Object.keys(CLOCK_EFFECTIVE_INVERSE_AUDIT).sort();
const boundaryClusters = Object.keys(CLOCK_EFFECTIVE_BOUNDARY_AUDIT).sort();

assert.deepEqual(inverseClusters, [...authorityClusters].sort(), "Every effective authority cluster needs an inverse decision.");
assert.deepEqual(boundaryClusters, [...authorityClusters].sort(), "Every effective authority cluster needs a boundary decision.");
assert.deepEqual(new Set(Object.keys(CLOCK_EFFECTIVE_GAP_AUDIT)), new Set(taskIds), "Every source-candidate row needs an effective gap disposition.");

for (const cluster of authorityClusters) {
  const inverse = CLOCK_EFFECTIVE_INVERSE_AUDIT[cluster];
  const boundary = CLOCK_EFFECTIVE_BOUNDARY_AUDIT[cluster];
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
}

for (const taskId of taskIds) {
  const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
  const source = CLOCK_EFFECTIVE_SOURCE_AUDIT[taskId];
  const gap = CLOCK_EFFECTIVE_GAP_AUDIT[taskId];
  assert.equal(gap.cluster, disposition.cluster);
  assert.equal(gap.sourceEvidenceLevel, source.evidenceLevel);

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

assert.equal(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.disposition, "PROVISIONAL_AUTHORITY_ANCHOR");
assert.equal(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.cluster, "HAND_INTERCHANGE");
assert.equal(CLOCK_EFFECTIVE_SOURCE_AUDIT.TIME_AFTER_HANDS_INTERCHANGED.evidenceLevel, "DIRECT_MULTI_SOURCE");
assert.equal(CLOCK_EFFECTIVE_INVERSE_AUDIT.VERTICAL_MIRROR_TIME.status, "SELF_INVERSE");
assert.equal(CLOCK_EFFECTIVE_INVERSE_AUDIT.UNIFORM_FAULTY_CLOCK_MAPPING.status, "EXPLICIT_INVERSE_COVERED");
assert.equal(CLOCK_EFFECTIVE_INVERSE_AUDIT.HAND_INTERCHANGE.status, "ADVANCED_INVERSE_HELD");
assert(CLOCK_EFFECTIVE_BOUNDARY_AUDIT.EVENT_COUNT_IN_INTERVAL.obligations.includes("ADJACENT_WINDOW_DOUBLE_COUNT"));
assert(CLOCK_EFFECTIVE_BOUNDARY_AUDIT.TIME_FOR_ARBITRARY_ANGLE.obligations.includes("PLUS_MINUS_BRANCHES"));
assert(CLOCK_EFFECTIVE_BOUNDARY_AUDIT.STRIKE_GAP_MECHANICS.obligations.includes("N_MINUS_ONE_GAPS"));
assert(CLOCK_EFFECTIVE_BOUNDARY_AUDIT.VERTICAL_MIRROR_TIME.obligations.includes("NO_NUMERIC_WATER_TIME"));
assert(CLOCK_EFFECTIVE_BOUNDARY_AUDIT.HAND_INTERCHANGE.obligations.includes("DO_NOT_USE_COINCIDENCE_RELATIVE_SPEED"));

const summary = clockEffectiveDiscoveryAuditSummary();
assert.deepEqual(summary.authorityClusters, authorityClusters);
assert.deepEqual(summary.inverseClusters, [...authorityClusters].sort());
assert.deepEqual(summary.boundaryClusters, [...authorityClusters].sort());
assert.equal(summary.unresolvedSourceBackedHolds.length, 0);
assert.equal(summary.sourceSaturationComplete, true);
assert.equal(CLOCK_EFFECTIVE_GAP_AUDIT.MIRROR_GEOMETRIC_VERIFICATION.status, "INTERNAL_ONLY");

assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.status, "POST_SATURATION_INVERSE_BOUNDARY_GAP_AUDIT");
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.inverseAuditComplete, true);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.boundaryAuditComplete, true);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.gapAuditComplete, true);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.unresolvedSourceBackedHoldsResolved, true);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.sourceSaturationComplete, true);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.difficultyAuditComplete, false);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.multilingualRiskAuditComplete, false);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.humanEditorialFreezeComplete, false);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.discoveryFreezeEligible, false);
assert.equal(summary.discoveryFreezeEligible, false);

console.log(JSON.stringify({
  status: "PASS_CLK_001_POST_SATURATION_INVERSE_BOUNDARY_GAP_AUDIT",
  sourceCandidateRows: taskIds.length,
  effectiveAuthorityClusters: authorityClusters.length,
  inverseAuditClusters: inverseClusters.length,
  boundaryAuditClusters: boundaryClusters.length,
  sourceSaturationComplete: summary.sourceSaturationComplete,
  unresolvedSourceBackedHolds: summary.unresolvedSourceBackedHolds,
  intentionalAdvancedHolds: summary.intentionalAdvancedHolds.length,
  policy: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY,
}, null, 2));
