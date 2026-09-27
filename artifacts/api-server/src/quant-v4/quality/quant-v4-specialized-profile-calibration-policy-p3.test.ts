import assert from "node:assert/strict";

import {
  QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES,
  QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_AUTHORITY,
  assessQuantV4SpecializedCalibrationPolicy,
  getAdoptedQuantV4SpecializedCalibrationPolicy,
  validateQuantV4SpecializedCalibrationPolicy,
} from "./quant-v4-specialized-profile-calibration-policy-p3";

assert.equal(
  QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_AUTHORITY,
  "QUANT-V4-SPECIALIZED-PROFILE-CALIBRATION-POLICY-P3",
);
assert.deepEqual(QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES, {});
assert.equal(
  getAdoptedQuantV4SpecializedCalibrationPolicy("MAL-001", "SSC_CGL_TIER_I"),
  null,
);
assert.equal(
  getAdoptedQuantV4SpecializedCalibrationPolicy("NUM-001", "SSC_CGL_TIER_I"),
  null,
);

const evidenceOnlyMal = assessQuantV4SpecializedCalibrationPolicy({
  packageId: "MAL-001",
  examProfile: "SSC_CGL_TIER_I",
  policy: {
    minCountableObservations: 5,
    minDistinctPapers: 1,
    minCanonicalCpCoverage: 3,
    minRepresentationCoverage: 3,
    requireCompleteCanonicalCpMapping: true,
    requireDifficultyEvidence: false,
  },
});
assert.equal(evidenceOnlyMal.status, "POLICY_EVALUATION_CANDIDATE");
assert.deepEqual(evidenceOnlyMal.blockers, []);
assert.equal(evidenceOnlyMal.selectionCalibrationCandidate, true);
assert.equal(
  evidenceOnlyMal.selectionPromotionAuthorized,
  false,
  "Passing a supplied policy must never authorize selection promotion by itself.",
);

const difficultyRequiredMal = assessQuantV4SpecializedCalibrationPolicy({
  packageId: "MAL-001",
  examProfile: "SSC_CGL_TIER_I",
  policy: {
    minCountableObservations: 5,
    minDistinctPapers: 1,
    minCanonicalCpCoverage: 3,
    minRepresentationCoverage: 3,
    requireCompleteCanonicalCpMapping: true,
    requireDifficultyEvidence: true,
  },
});
assert.equal(difficultyRequiredMal.status, "POLICY_EVALUATION_HOLD");
assert.deepEqual(difficultyRequiredMal.blockers, ["DIFFICULTY_EVIDENCE_REQUIRED"]);
assert.equal(difficultyRequiredMal.selectionCalibrationCandidate, false);
assert.equal(difficultyRequiredMal.selectionPromotionAuthorized, false);

const strictNum = assessQuantV4SpecializedCalibrationPolicy({
  packageId: "NUM-001",
  examProfile: "SSC_CGL_TIER_I",
  policy: {
    minCountableObservations: 20,
    minDistinctPapers: 3,
    minCanonicalCpCoverage: 3,
    minRepresentationCoverage: 5,
    requireCompleteCanonicalCpMapping: true,
    requireDifficultyEvidence: true,
  },
});
assert.equal(strictNum.status, "POLICY_EVALUATION_HOLD");
assert.ok(strictNum.blockers.includes("CANONICAL_CP_MAPPING_INCOMPLETE"));
assert.ok(strictNum.blockers.includes("DIFFICULTY_EVIDENCE_REQUIRED"));
assert.equal(strictNum.selectionPromotionAuthorized, false);

assert.throws(
  () => validateQuantV4SpecializedCalibrationPolicy({
    minCountableObservations: -1,
    minDistinctPapers: 0,
    minCanonicalCpCoverage: 0,
    minRepresentationCoverage: 0,
    requireCompleteCanonicalCpMapping: false,
    requireDifficultyEvidence: false,
  }),
  /non-negative integer/u,
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_SPECIALIZED_PROFILE_CALIBRATION_POLICY_P3",
  adoptedPolicyCount: Object.keys(QUANT_V4_ADOPTED_SPECIALIZED_CALIBRATION_POLICIES).length,
  syntheticEvidenceOnlyMal: {
    status: evidenceOnlyMal.status,
    blockers: evidenceOnlyMal.blockers,
    selectionPromotionAuthorized: evidenceOnlyMal.selectionPromotionAuthorized,
  },
  syntheticDifficultyRequiredMal: {
    status: difficultyRequiredMal.status,
    blockers: difficultyRequiredMal.blockers,
  },
  strictNum: {
    status: strictNum.status,
    blockers: strictNum.blockers,
  },
}));
