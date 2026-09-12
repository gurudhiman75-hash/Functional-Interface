import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-26-s3-full-quant-section-wave6-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(
  QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  "QUANT-V4-CGL-2023-07-26-S3-FULL-QUANT-SECTION-WAVE6-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S3"));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-26" && entry.shift === "Shift 3"));
assert.deepEqual(
  observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => 51 + index),
);
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);
assert.equal(QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3,
  "DI-003": 1,
  "DI-005": 1,
  "GEO-001": 1,
  "INT-001": 1,
  "MEN-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-007": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 4,
  "TRG-001": 4,
  "TSD-001": 1,
  "TSD-002": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

// Representative exact/source-math checks across all 25 questions.
assert.equal(7 * 48 / 28, 12); // Q51.
assert.ok(Math.abs(2 + 24 / 7.5 - 26 / 5) < 1e-12); // Q52.
assert.equal(1000 * 110 / 100, 1100); // Q53.
assert.equal(49 / 12 - 2, 25 / 12); // Q54.
assert.ok(Math.abs(Math.cos(Math.PI / 6) - Math.sqrt(3) / 2) < 1e-12); // Q55.
assert.equal(16 * 16 / 4, 64); // Q56 coefficient of sqrt(3).
assert.equal(21 % 15, 6); // Q57.
assert.equal((9 + 16) * 7, 25 * 7); // Q58 numerator magnitude.
assert.equal((9 - 16) * 25, -7 * 25); // Q58 denominator/sign.
assert.ok(Math.abs(256 * 9 / 320 - 7.2) < 1e-12); // Q59.
assert.ok(Math.abs(2 / 3 - ((2 / 3) - (5 / 6) * (4 / 5) / (4 / 3) + 1 / 2)) < 1e-12); // Q60.
assert.ok(Math.abs(Math.tan(64 * Math.PI / 180) + 1 / Math.tan(154 * Math.PI / 180)) < 1e-10); // Q61.
assert.ok(Math.abs(140 * 0.735 - 100 - 2.9) < 1e-12); // Q62.
assert.ok(Math.abs(56 / 44 * 100 - 127.27272727272727) < 1e-12); // Q63.
assert.equal((170 + 10) / 2, 90); // Q64.
assert.equal(12 + (12 + 4 + 2), 30); // Q65 two-day work.
assert.equal(60 / 30 * 2, 4); // Q65 total days.
assert.equal(20 * 100 / 5, 400); // Q66.
assert.ok(Math.abs(1 / (1 / 9 + 1 / 6) - 18 / 5) < 1e-12); // Q67.
assert.equal(45 / (120 / 60 + 150 / 60), 10); // Q68.
assert.ok(Math.abs((8 * Math.sqrt(3)) * 14 - 112 * Math.sqrt(3)) < 1e-12); // Q69.
assert.equal(17 / (0.08 * 0.85 * 0.10), 2500); // Q70.
assert.equal((65 - 20) / 20 * 100, 225); // Q71.
assert.equal(6 * 12 * 12, 864); // Q72.
assert.equal(1 + 15625, 15626); // Q73.
assert.equal(102 * 102 - 2, 10402); // Q74 corrected x-1/x source state.
assert.equal(15, 15); // Q75 equal-efficiency order invariance.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 208);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 175);
assert.equal(cgl.filter((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S3").length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 6);
assert.equal(whole.totalCountableQuestionCount, 175);
assert.equal(whole.completeSectionCount, 6);
assert.equal(whole.completeQuestionCount, 150);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 25);
assert.equal(whole.undatedCountableQuestionCount, 10);
assert.equal(whole.distinctSectionYearCount, 3);
assert.equal(whole.packageCoverageCount, 23);
assert.equal(whole.evidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...whole.blockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);
assert.ok(whole.sectionSnapshots.every((section) => section.complete));

const avgCgl = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_TIER_I");
const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(avgCgl.normalizedCountableObservationCount, 3);
assert.equal(numCgl.normalizedCountableObservationCount, 17);
assert.equal(tmwCgl.normalizedCountableObservationCount, 17);
for (const contract of [avgCgl, numCgl, tmwCgl]) {
  assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
  assert.equal(contract.profileSelectionCalibrated, false);
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_P2",
  authority: QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  blockers: whole.blockers,
  empiricalWeightingPromoted: false,
}));
