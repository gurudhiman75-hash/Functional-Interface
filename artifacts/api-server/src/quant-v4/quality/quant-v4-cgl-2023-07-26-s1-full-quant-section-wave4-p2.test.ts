import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-26-s1-full-quant-section-wave4-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(
  QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  "QUANT-V4-CGL-2023-07-26-S1-FULL-QUANT-SECTION-WAVE4-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S1"));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-26" && entry.shift === "Shift 1"));
assert.deepEqual(
  observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => 51 + index),
);
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);
assert.equal(QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3,
  "DI-001": 1,
  "DI-003": 1,
  "GEO-001": 2,
  "GEO-002": 2,
  "INT-001": 1,
  "MAL-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-002": 1,
  "PCT-007": 1,
  "PNL-001": 2,
  SAP: 1,
  "TMW-001": 2,
  "TRG-001": 2,
  "TSD-001": 2,
  "TSD-002": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

assert.equal(11 * (55 - 7) * 5, 3 * 16 * 55);
assert.equal(12 * 9 / 4, 27);
assert.equal(66, 64 + 2);
assert.equal(20 / 2, 10);
assert.equal(15 * 420 - 16 * (14 * 15 / 2), 11 * 420);
assert.equal((22 / 7) * 21 * 60, 3960);
assert.equal(1755 / 39 * (8 - 28 / 4) - 2, 43);
assert.equal(2 - 0.5, 1.5);
assert.ok(Math.abs((88 / (82 / 1.3) - 1) * 100 - 39.512195121951216) < 1e-12);
assert.equal(Math.min(0.12 * 625, 0.15 * 555, 0.10 * 720, 0.09 * 845), 72);
assert.equal(21 / 125 * 100, 16.8);
assert.equal(0.175 * 880 * 1.25, 192.5);
assert.equal(200 / 16, 12.5);

// Keep the paper proof exact while allowing later waves to extend cumulative evidence.
assert.ok(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length >= 307);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.ok(cgl.length >= 274);
assert.equal(cgl.filter((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S1").length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.ok(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length >= 10);
assert.ok(whole.totalCountableQuestionCount >= 274);
assert.ok(whole.completeSectionCount >= 10);
assert.ok(whole.completeQuestionCount >= 250);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 24);
assert.equal(whole.undatedCountableQuestionCount, 10);
assert.equal(whole.distinctSectionYearCount, 3);
assert.ok(whole.packageCoverageCount >= 28);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);
assert.ok(whole.sectionSnapshots.every((section) => section.complete));

const malCgl = getQuantV4SpecializedProfileSelectionContract("MAL-001", "SSC_CGL_TIER_I");
assert.ok(malCgl.normalizedCountableObservationCount >= 4);
assert.equal(malCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(malCgl.profileSelectionCalibrated, false);
assert.ok(!malCgl.blockers.includes("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"));
assert.ok(!malCgl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));

const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.ok(numCgl.normalizedCountableObservationCount >= 21);
assert.ok(tmwCgl.normalizedCountableObservationCount >= 24);
assert.equal(numCgl.profileSelectionCalibrated, false);
assert.equal(tmwCgl.profileSelectionCalibrated, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_P2",
  authority: QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  evidenceStatus: whole.evidenceStatus,
  blockers: whole.blockers,
  empiricalWeightingPromoted: false,
}));
