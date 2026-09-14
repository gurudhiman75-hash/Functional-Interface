import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY,
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-11-s1-full-quant-section-wave11-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";
import {
  QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyStabilityProfile,
} from "./quant-v4-whole-section-frequency-stability-p2";

const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-11-S1";
const observations = QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY,
  "QUANT-V4-CGL-2024-09-11-S1-FULL-QUANT-SECTION-WAVE11-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-11"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((left, right) => qnum(left.questionRef) - qnum(right.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(section.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, section.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 1,
  "ALG-002": 1,
  "AVG-001": 1,
  "DI-001": 2,
  "DI-003": 1,
  "DI-005": 1,
  "GEO-001": 1,
  "GEO-002": 1,
  "INT-001": 2,
  "MEN-001": 2,
  "NUM-001": 3,
  "PCT-002": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

// Representative source-math checks across the section.
assert.equal(180 * 5 / 9, 100); // Q51 rhombus diagonal line.
assert.equal((12 * 62 + 18 * 62) / 30, 62); // Q52 average.
assert.equal((1.10 / 0.88 - 1) * 100, 25); // Q53 false weight + profit.
assert.equal((36 / 3) ** 2 / 4, 36); // Q54 area coefficient before √3.
assert.equal(1 - 1, 0); // Q55 complementary-angle ratios.
assert.equal(6 ** 3 + 3 * 6, 234); // Q56 reciprocal cubic identity.
assert.equal(999 % 99, 9); // Q58.
assert.equal((3 / 5 * 100) / 10, 6); // Q59 time from SI fraction.
assert.equal(16_000 * 14 * 6 / 100, 13_440); // Q59 interest.
assert.equal(9 * 5 / 6, 7.5); // Q61 intersecting chords.
assert.equal(495 / 45 * (1665 / 45), 407); // Q62 HCF tiling.
assert.equal(7_560_000 * 0.9 * 0.85 * 0.22, 1_272_348); // Q63 election chain.
assert.equal(0.60 * 25 + 0.60 * 20, 27); // Q64 pie chart subgroup share.
assert.equal(1 / (1 / 15) * 1.5 / 2.5, 9); // rate-share sanity only.
assert.equal(1 / ((1 / 15) * 1.5 / 2.5), 25); // Q67 faster pipe.
assert.equal(1_200 * 0.85 * 0.90, 918); // Q68 successive discounts.
assert.equal(168 * 12 / 7 / 0.60, 480); // Q69 linked table.
assert.equal((52_997 - 28_400) / 9, 2_733); // Q70 fixed annual increment.
assert.equal((70 + 85 + 90 + 95 + 75) / 5, 83); // Q71 table average.
assert.equal((22 / 7) * (28 ** 2 - 25 ** 2) * 28, 13_992); // Q72 circular track.
assert.equal(64 * 16 + 32, 1_056); // Q73 division algorithm.
const vishuSpeed = 54 / 12;
assert.equal(900 / vishuSpeed, 200); // Q74 = 3 min 20 s.
assert.equal(560 / (9 - 2) * 3, 240); // Q75 ratio distribution.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 332);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 299);
assert.equal(cgl.filter((entry) => entry.paperId === PAPER_ID).length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 11);
assert.equal(whole.totalCountableQuestionCount, 299);
assert.equal(whole.completeSectionCount, 11);
assert.equal(whole.completeQuestionCount, 275);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 24);
assert.equal(whole.distinctSectionYearCount, 3);
assert.equal(whole.packageCoverageCount, 28);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

const stability = buildQuantV4WholeSectionFrequencyStabilityProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  wholeSectionPolicy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  stabilityPolicy: QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
});
assert.equal(stability.completeSectionCount, 11);
assert.equal(stability.completeQuestionCount, 275);
assert.equal(stability.balancedYearCount, 3);
assert.equal(stability.maxSingleYear, "2023");
assert.ok(Math.abs(stability.maxSingleYearSectionShare - 6 / 11) < 1e-12);
assert.equal(stability.maxSingleDate, "2023-07-25");
assert.ok(Math.abs(stability.maxSingleDateSectionShare - 3 / 11) < 1e-12);
assert.equal(stability.status, "STABILITY_HOLD");
assert.deepEqual([...stability.blockers], [
  "SINGLE_DATE_SECTION_CONCENTRATION_HIGH",
  "CONCENTRATED_DATE_SUPPORT_LOSS_HIGH",
]);
assert.equal(stability.productionPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_P2",
  authority: QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  balancedYears: stability.balancedYearCount,
  stabilityStatus: stability.status,
  stabilityBlockers: stability.blockers,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
