import assert from "node:assert/strict";

import {
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

const readiness = buildQuantV4SpecializedCalibrationReadiness({
  packageId: "MAL-001",
  examProfile: "SSC_CGL_TIER_I",
});

assert.equal(readiness.countableObservationCount, 5);
assert.equal(readiness.canonicalCpMappedObservationCount, 5);
assert.equal(readiness.cpMappingCompleteness, 1);
assert.deepEqual([...readiness.canonicalCpCoverage].sort(), [
  "MAL-CP-001",
  "MAL-CP-003",
  "MAL-CP-004",
]);
assert.equal(
  readiness.blockers.includes("CANONICAL_CP_MAPPING_INCOMPLETE"),
  false,
  "MAL CGL CP mapping should be complete after the P3 backfill.",
);
assert.equal(readiness.selectionCalibrationAuthorized, false);
assert.ok(readiness.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
assert.ok(readiness.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_MAL_CGL_CP_MAPPING_BACKFILL_P3",
  readiness,
}));
