import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY,
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-26-s2-full-quant-section-wave5-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(
  QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY,
  "QUANT-V4-CGL-2023-07-26-S2-FULL-QUANT-SECTION-WAVE5-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S2"));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-26" && entry.shift === "Shift 2"));
assert.deepEqual(
  observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => 51 + index),
);
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);
assert.equal(QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3,
  "AVG-001": 1,
  "DI-001": 2,
  "GEO-001": 1,
  "INT-001": 1,
  "MEN-001": 1,
  "MEN-002": 2,
  "NUM-001": 1,
  "PCT-002": 1,
  "PNL-001": 1,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 4,
  "TRG-001": 3,
  "TSD-001": 2,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

// Representative source-math checks across the section.
assert.equal(1099 / 7 * 10, 1570); // Q51 ratio complement.
assert.equal(1440 / 8 / 2, 90); // Q53 Shyam speed in m/min.
assert.equal(10 * 15 / (10 + 15), 6); // Q54 combined pipe time.
assert.equal(405 * 2 / 54, 15); // Q55 cubic identity.
assert.equal(4 * (22 / 7) * 35 * 35, 15400); // Q56 sphere surface area.
assert.equal(60 * (36 / 5), 432); // Q57 combined pipes in minutes.
assert.equal(35 + 2 + 8, 45); // Q58 digit sum.
assert.equal((35 + 2 + 8) % 9, 0); // Q58 divisibility by 9.
assert.equal(Math.sqrt(2 * 2 + 4 * 8), 6); // Q58 final expression.
assert.equal(9.2 * (0.36 / 1.2), 2.76); // Q60 chase distance in km.
assert.equal(1 - 0.95 * 0.95, 0.09750000000000003); // Q61 5%+5% effective discount.
assert.equal(13 * 13 - 2 * 54, 61); // Q63 identity.
assert.ok(Math.abs(1 / (1 / 72 - 1 / 120) - 180) < 1e-12); // Q65 individual work time.
assert.ok(Math.abs(6400 * 100 / (21000 * 3) - 640 / 63) < 1e-12); // Q66 SI rate.
assert.equal(1 / (9 / 84 - 10 / 105), 84); // Q67 net pipe time.
assert.ok(Math.abs(Math.sqrt(1 - 9 / 49) - 2 * Math.sqrt(10) / 7) < 1e-12); // Q68 trig.
assert.equal((60 * 46.5 - 35 * 42) / 25, 52.8); // Q69 average.
assert.equal((110 * 360) / (56 * (22 / 7)), 225); // Q70 radius squared.
assert.ok(Math.abs(19 / 81 * 100 - 23.45679012345679) < 1e-12); // Q71 base switch.
assert.equal((1 + 7) / (1 + 11), 2 / 3); // Q73 reciprocal expression.
assert.equal(6 - (6 / 2 - 3 + 7 - 2) * ((3 - 2 / 2) * 5 - 6), -14); // Q74 BODMAS.
assert.equal(50 * 25 * 10 * 1000, 12_500_000); // Q75 capacity in litres.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 208);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 175);
assert.equal(cgl.filter((entry) => entry.paperId === "SSC-CGL-2023-TIER-I-2023-07-26-S2").length, 25);

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
  status: "PASS_QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_P2",
  authority: QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  blockers: whole.blockers,
  empiricalWeightingPromoted: false,
}));
