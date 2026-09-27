import assert from "node:assert/strict";

import {
  QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY,
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

assert.equal(
  QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY,
  "QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-READINESS-P3",
);

const expectedCounts = {
  "AVG-001": 7,
  "MAL-001": 5,
  "NUM-001": 26,
  "TMW-001": 27,
} as const;

const reports = Object.fromEntries(
  Object.entries(expectedCounts).map(([packageId, expected]) => {
    const report = buildQuantV4SpecializedCalibrationReadiness({
      packageId: packageId as keyof typeof expectedCounts,
      examProfile: "SSC_CGL_TIER_I",
    });

    assert.equal(report.status, "EVIDENCE_PRESENT_POLICY_REQUIRED");
    assert.equal(report.countableObservationCount, expected);
    assert.ok(report.datedObservationCount > 0, `${packageId} should exercise dated whole-section evidence.`);
    assert.ok(report.distinctPaperCount > 0, `${packageId} should span at least one resolved paper.`);
    assert.ok(report.representationCoverageCount > 0, `${packageId} should expose representation evidence.`);
    assert.equal(report.calibrationPolicyAdopted, false);
    assert.equal(report.difficultyEvidenceAvailable, false);
    assert.equal(report.selectionCalibrationAuthorized, false);
    assert.ok(report.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
    assert.ok(report.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));
    assert.ok(report.cpMappingCompleteness >= 0 && report.cpMappingCompleteness <= 1);

    return [packageId, report] as const;
  }),
);

assert.ok(
  reports["NUM-001"].countableObservationCount >= 20,
  "NUM-001 must preserve its substantial CGL Tier-I evidence base.",
);
assert.ok(
  reports["TMW-001"].countableObservationCount >= 20,
  "TMW-001 must preserve its substantial CGL Tier-I evidence base.",
);

// A large sample alone is not authorization. These two packages are the
// strongest current specialized CGL evidence surfaces, yet both must stay
// uncalibrated until the methodology defines a policy and the observation
// schema can support the intended CP/QL/difficulty selector.
for (const packageId of ["NUM-001", "TMW-001"] as const) {
  const report = reports[packageId];
  assert.equal(report.selectionCalibrationAuthorized, false);
  assert.ok(report.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_P3",
  authority: QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_READINESS_AUTHORITY,
  examProfile: "SSC_CGL_TIER_I",
  reports,
}));
