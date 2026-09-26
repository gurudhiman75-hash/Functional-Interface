import assert from "node:assert/strict";
import {
  CLOCK_CANDIDATE_DISPOSITION,
  CLOCK_MERGE_SPLIT_POLICY,
  CLOCK_SOURCE_AUDIT,
  CLOCK_TASK_CATALOG,
  clockCandidateDispositionSummary,
  provisionalClockAuthorityClusters,
} from "../topics/Clocks/CLK-001/runtime";

const taskIds = CLOCK_TASK_CATALOG.map(([taskId]) => taskId);
assert.deepEqual(new Set(Object.keys(CLOCK_CANDIDATE_DISPOSITION)), new Set(taskIds));
assert.equal(CLOCK_MERGE_SPLIT_POLICY.status, "PROVISIONAL_MERGE_SPLIT_AUDIT");
assert.equal(CLOCK_MERGE_SPLIT_POLICY.permanentQlAllocationAllowed, false);
assert.equal(CLOCK_MERGE_SPLIT_POLICY.authorityCountFrozen, false);
assert.equal(CLOCK_MERGE_SPLIT_POLICY.sourceSaturationComplete, false);
assert.equal(CLOCK_MERGE_SPLIT_POLICY.humanEditorialFreezeComplete, false);

for (const taskId of taskIds) {
  const disposition = CLOCK_CANDIDATE_DISPOSITION[taskId];
  assert(disposition.cluster.length > 0, `${taskId} has no semantic cluster.`);
  assert(disposition.rationale.length > 0, `${taskId} has no disposition rationale.`);

  if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") {
    assert.equal(CLOCK_SOURCE_AUDIT[taskId].evidenceLevel, "INTERNAL_REVIEW_METADATA_ONLY");
  }
  if (CLOCK_SOURCE_AUDIT[taskId].evidenceLevel === "DESIGN_INCLUDED_SOURCE_SPARSE") {
    assert.notEqual(
      disposition.disposition,
      "PROVISIONAL_AUTHORITY_ANCHOR",
      `${taskId} cannot be a provisional authority anchor while direct source evidence is sparse.`,
    );
  }
}

assert.equal(
  CLOCK_CANDIDATE_DISPOSITION.MIRROR_GEOMETRIC_VERIFICATION.disposition,
  "INTERNAL_VERIFICATION_ONLY",
);
assert.equal(
  CLOCK_CANDIDATE_DISPOSITION.OFFSET_PLUS_RATE_CORRECTION.disposition,
  "MERGE_AS_QUERY_OR_RENDERER_VARIANT",
);
assert.equal(
  CLOCK_CANDIDATE_DISPOSITION.TIME_AFTER_HANDS_INTERCHANGED.disposition,
  "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION",
);
assert.equal(
  CLOCK_CANDIDATE_DISPOSITION.GAIN_FROM_COINCIDENCE_INTERVAL.disposition,
  "PROVISIONAL_AUTHORITY_ANCHOR",
);

const summary = clockCandidateDispositionSummary();
assert.equal(Object.values(summary).reduce((total, count) => total + count, 0), taskIds.length);
assert(summary.PROVISIONAL_AUTHORITY_ANCHOR > 0);
assert(summary.MERGE_AS_QUERY_OR_RENDERER_VARIANT > summary.PROVISIONAL_AUTHORITY_ANCHOR);
assert(summary.HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION > 0);
assert.equal(summary.INTERNAL_VERIFICATION_ONLY, 1);

const clusters = provisionalClockAuthorityClusters();
assert.equal(new Set(clusters).size, clusters.length);
assert.equal(clusters.length, summary.PROVISIONAL_AUTHORITY_ANCHOR);

console.log(JSON.stringify({
  status: "PASS_CLK_001_PROVISIONAL_MERGE_SPLIT_AUDIT",
  sourceCandidateRows: taskIds.length,
  dispositionSummary: summary,
  provisionalAuthorityAnchorCount: clusters.length,
  provisionalAuthorityClusters: clusters,
  policy: CLOCK_MERGE_SPLIT_POLICY,
}, null, 2));
