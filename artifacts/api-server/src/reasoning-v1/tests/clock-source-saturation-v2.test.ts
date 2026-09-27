import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  CLOCK_SOURCE_ANOMALIES,
  CLOCK_SOURCE_SATURATION,
  CLOCK_SOURCE_SATURATION_POLICY,
  CLOCK_TASK_CATALOG,
  clockSourceSaturationSummary,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
assert.equal(taskIds.length, 100);
assert.deepEqual(new Set(Object.keys(CLOCK_SOURCE_SATURATION)), new Set(taskIds));

let directSourceHolds = 0;
let designSparseAnchors = 0;
for (const taskId of taskIds) {
  const source = CLOCK_EFFECTIVE_SOURCE_AUDIT[taskId];
  const candidate = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
  const saturated = CLOCK_SOURCE_SATURATION[taskId];

  assert(source.evidenceRefs.length > 0, `${taskId} has no source-saturation evidence reference.`);
  assert.equal(saturated.cluster, candidate.cluster);
  assert.equal(saturated.evidenceLevel, source.evidenceLevel);

  if (candidate.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION" &&
      (source.evidenceLevel === "DIRECT_SOURCE" || source.evidenceLevel === "DIRECT_MULTI_SOURCE")) {
    directSourceHolds += 1;
  }
  if (candidate.disposition === "PROVISIONAL_AUTHORITY_ANCHOR" &&
      (source.evidenceLevel === "DESIGN_INCLUDED_SOURCE_SPARSE" || source.evidenceLevel === "INTERNAL_REVIEW_METADATA_ONLY")) {
    designSparseAnchors += 1;
  }

  if (candidate.disposition === "INTERNAL_VERIFICATION_ONLY") {
    assert.equal(saturated.disposition, "INTERNAL_ONLY");
  } else if (candidate.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
    assert.equal(saturated.disposition, "INTENTIONAL_ADVANCED_HOLD");
  } else {
    assert.equal(saturated.disposition, "CORE_OR_MERGED_COVERED");
  }
}

assert.equal(directSourceHolds, 0, "No directly sourced candidate may remain unresolved at source saturation.");
assert.equal(designSparseAnchors, 0, "Design-sparse candidates must not become core authority anchors.");
assert.equal(CLOCK_EFFECTIVE_SOURCE_AUDIT.TIME_AFTER_HANDS_INTERCHANGED.evidenceLevel, "DIRECT_MULTI_SOURCE");
assert.equal(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.disposition, "PROVISIONAL_AUTHORITY_ANCHOR");

assert.equal(CLOCK_SOURCE_ANOMALIES.STRIKE_COUNT_INTERVAL_CONFLICT.decision, "DO_NOT_IMPORT_PRINTED_SOLUTION");
assert.equal(CLOCK_SOURCE_ANOMALIES.PROGRESSIVE_GAIN_NOT_PIECEWISE_AFFINE.decision, "DO_NOT_OVERCLAIM_SOURCE_MATCH");
assert.equal(CLOCK_SOURCE_ANOMALIES.INTERCHANGE_EXACT_PAIR_VS_ELAPSED_DURATION.decision, "PROMOTE_ELAPSED_DURATION_ONLY");

assert.equal(CLOCK_SOURCE_SATURATION_POLICY.status, "SOURCE_SATURATION_DECISION_COMPLETE_FOR_AUDITED_CORPUS");
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete, true);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.authorityCountFrozen, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.difficultyAuditComplete, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.multilingualRiskAuditComplete, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.humanEditorialFreezeComplete, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.questionStudioDiscoveryAllowed, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.questionBankWritesAllowed, false);
assert.equal(CLOCK_SOURCE_SATURATION_POLICY.publicationAllowed, false);

const summary = clockSourceSaturationSummary();
assert.equal(summary.sourceCandidateRows, 100);
assert.equal(summary.sourceSaturationComplete, true);
assert(summary.effectiveAuthorityClusters.length > 0);
assert(summary.intentionalAdvancedHolds > 0);
assert.equal(summary.internalOnly, 1);
assert.equal(summary.sourceAnomalies, 3);

console.log(JSON.stringify({
  status: "PASS_CLK_001_SOURCE_SATURATION_FOR_AUDITED_CORPUS",
  ...summary,
  directSourceHolds,
  designSparseAnchors,
  policy: CLOCK_SOURCE_SATURATION_POLICY,
}, null, 2));
