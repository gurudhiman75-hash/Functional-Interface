import assert from "node:assert/strict";
import {
  auditMenCp008DirectionalMergeEvidence,
  MEN_CP_008_MERGE_REVIEW_DECISIONS,
} from "./merge-review";

const audit = auditMenCp008DirectionalMergeEvidence(80);

assert.equal(audit.generated, 320);
assert.equal(audit.valid, true);
assert.equal(audit.lifecycleLocked, true);
assert.equal(audit.allThreeStep, true);
assert.equal(audit.allThreeTraps, true);
assert.equal(MEN_CP_008_MERGE_REVIEW_DECISIONS.length, 2);

assert.deepEqual(audit.groupMetrics.equalVolume.targetKinds, ["LENGTH"]);
assert.deepEqual(audit.groupMetrics.equalVolume.units, ["cm"]);
assert.deepEqual(audit.groupMetrics.equalVolume.exactKinds, ["RATIONAL"]);
assert.equal(audit.groupMetrics.equalVolume.solveModes.length, 2);
assert.ok(audit.groupMetrics.equalVolume.answerFingerprints >= 6);
assert.equal(audit.groupMetrics.equalVolume.invariantFailures, 0);

assert.deepEqual(audit.groupMetrics.rollerInverse.targetKinds, ["LENGTH"]);
assert.deepEqual(audit.groupMetrics.rollerInverse.units, ["cm"]);
assert.deepEqual(audit.groupMetrics.rollerInverse.exactKinds, ["RATIONAL"]);
assert.equal(audit.groupMetrics.rollerInverse.solveModes.length, 2);
assert.ok(audit.groupMetrics.rollerInverse.answerFingerprints >= 6);
assert.equal(audit.groupMetrics.rollerInverse.invariantFailures, 0);

assert.equal(
  MEN_CP_008_MERGE_REVIEW_DECISIONS[0].decision,
  "MERGE_AS_TARGET_SOLID_PARAMETER",
);
assert.equal(
  MEN_CP_008_MERGE_REVIEW_DECISIONS[1].decision,
  "MERGE_AS_MISSING_DIMENSION_PARAMETER",
);

console.log(
  `MEN-CP-008 directional merge review passed for ${audit.generated} existing runtime packages. ` +
  `Equal-volume target direction and roller missing-dimension direction are retained as parameters inside two canonical QL-family candidates.`,
);
