import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

const cglAvg = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter(
  (entry) => entry.examId === "SSC_CGL_TIER_I" && entry.packageId === "AVG-001",
);

assert.equal(cglAvg.length, 7);

const newInnings = cglAvg.find((entry) => entry.representation === "AVERAGE_NEW_INNINGS_TARGET_MCQ");
assert.ok(newInnings);
assert.match(newInnings.subtopic, /^AVG-CP-003\b/u);
assert.doesNotMatch(newInnings.subtopic, /^AVG-CP-002\b/u);

const runningAverage = cglAvg.find((entry) => entry.representation === "RUNNING_AVERAGE_STEPWISE_MEMBER_DIFFERENCE_MCQ");
assert.ok(runningAverage);
assert.match(runningAverage.subtopic, /^AVG-CP-003\b/u);

const equalGroups = cglAvg.find((entry) => entry.representation === "TWO_GROUP_EQUAL_AVERAGES_COMBINED_AVERAGE_MCQ");
assert.ok(equalGroups);
assert.match(equalGroups.subtopic, /^AVG-CP-004\b/u);

const partialGroups = cglAvg.find((entry) => entry.representation === "PARTIAL_GROUP_AVERAGES_WITH_REMAINING_RELATIONS_MCQ");
assert.ok(partialGroups);
assert.match(partialGroups.subtopic, /^AVG-CP-004\b/u);

const readiness = buildQuantV4SpecializedCalibrationReadiness({
  packageId: "AVG-001",
  examProfile: "SSC_CGL_TIER_I",
});

assert.equal(readiness.countableObservationCount, 7);
assert.equal(readiness.canonicalCpMappedObservationCount, 7);
assert.equal(readiness.cpMappingCompleteness, 1);
assert.deepEqual([...readiness.canonicalCpCoverage].sort(), [
  "AVG-CP-003",
  "AVG-CP-004",
]);
assert.equal(readiness.blockers.includes("CANONICAL_CP_MAPPING_INCOMPLETE"), false);
assert.equal(readiness.selectionCalibrationAuthorized, false);
assert.ok(readiness.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
assert.ok(readiness.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_AVG_CGL_CP_RECONCILE_P3",
  readiness,
}));
