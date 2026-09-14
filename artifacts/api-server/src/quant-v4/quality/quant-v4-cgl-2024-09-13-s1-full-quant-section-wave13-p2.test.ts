import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_AUTHORITY,
  QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-13-s1-full-quant-section-wave13-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";
import {
  QUANT_V4_CGL_TIER_I_STABILITY_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyStabilityProfile,
  canPromoteQuantV4WholeSectionFrequencyFromStability,
} from "./quant-v4-whole-section-frequency-stability-p2";

const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-13-S1";
const observations = QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS;

function approx(actual: number, expected: number, tolerance = 1e-9): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} ≈ ${expected}`);
}

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

assert.equal(
  QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_AUTHORITY,
  "QUANT-V4-CGL-2024-09-13-S1-FULL-QUANT-SECTION-WAVE13-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-13"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.deepEqual(observations.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS.paperIdentityResolved, true);
assert.equal(QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, true);
assert.equal(QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3,
  "DI-001": 2,
  "DI-003": 1,
  "DI-005": 1,
  "GEO-001": 1,
  "GEO-002": 1,
  "INT-001": 1,
  "MAL-001": 1,
  "MEN-001": 2,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-001": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-002": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

const packageByQuestion = Object.fromEntries(observations.map((entry) => [qnum(entry.questionRef), entry.packageId]));
assert.equal(packageByQuestion[62], "PCT-001");
assert.equal(packageByQuestion[65], "SAP");
assert.equal(packageByQuestion[66], "DI-003");
assert.equal(packageByQuestion[72], "TSD-002");

// Representative independent source-math proofs across the complete section.
approx((93 + 90 + 90 + 95 + 78) / 500 * 100, 89.2); // Q51.
assert.deepEqual([100, 350].map((value) => value / 50), [2, 7]); // Q52.
approx((60 / 360) * 2 * Math.PI * 21, 7 * Math.PI); // Q53 minor arc for r=21.
assert.equal(180 - 70 - 50, 60); // Q54.
approx((7 * 50 + 8 * 56) / 15, 53.2); // Q55.
const a = 7;
const b = -3;
const c = -(a + b);
assert.equal(a ** 3 + b ** 3 + c ** 3, 3 * a * b * c); // Q56.
const slowerPipeRate = (1 / 20) / 3.5;
approx(1 / (2.5 * slowerPipeRate), 28); // Q57.
const alpha = 0.5;
approx(alpha / Math.sqrt(1 - alpha ** 2), 1 / Math.sqrt(3)); // Q58 form.
approx(1 / Math.tan(Math.PI / 3) + 1 / Math.sin(Math.PI / 3), Math.sqrt(3)); // Q59.
assert.equal((240 - 30 * 7) / (40 - 30), 3); // Q60 coffee count, so tea count=4.
assert.equal(7 - 3, 4); // Q60 tea count.
approx((Math.sqrt(3) ** 3 - 2 * Math.sin(Math.PI / 3)) / (Math.sqrt(3) + 1 / Math.tan(Math.PI / 6)), 1); // Q61.
assert.equal(770 / 0.10, 7_700); // Q62 S votes.
assert.equal(7_700 + 7_700 * 1.10, 16_170); // Q62 total valid votes.
assert.equal((2 + 2) ** 2 + (2 + 1) ** 2, 25); // Q63 r=2.
approx((1 - 0.90 * 0.85) * 100, 23.5); // Q64.
assert.equal(15 % 3, 0); // Q67 least missing digit y=0 makes digit sum divisible by 3.
assert.deepEqual([6, 8, 16].map((value) => value / 2), [3, 4, 8]); // Q68.
approx(313 / 327 * 100, 95.71865443425076); // Q69, rounds to 96%.
assert.equal(Math.round(313 / 327 * 100), 96);
assert.equal((20 + 30) / 100 * 360, 180); // Q70.
assert.deepEqual(
  [5 * 1 + 4 * 1 - 8 * 1, 7 * 1 - 9 * 1 + 1, 2 * 1 + 3 * 1 - 4 * 1],
  [1, -1, 1],
); // Q71 x=y=z=1.
assert.equal(8 * 12, 96); // Q72 still-water distance.
const principal = 623_305;
const firstYearInterest = principal * 0.10;
const remainingPrincipal = principal - 16_390;
const secondYearInterest = remainingPrincipal * 0.10;
approx(remainingPrincipal + firstYearInterest + secondYearInterest, 729_937); // Q73.
assert.equal((3 / 4) * 2 * (22 / 7) * 21 + 2 * 21, 141); // Q74 boundary length if a quarter sector is removed.
assert.equal(3 * 46_200 / ((22 / 7) * 70 ** 2), 9); // Q75.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 381);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 348);
assert.equal(cgl.filter((entry) => entry.paperId === PAPER_ID).length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 13);
assert.equal(whole.totalCountableQuestionCount, 348);
assert.equal(whole.completeSectionCount, 13);
assert.equal(whole.completeQuestionCount, 325);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 23);
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
assert.equal(stability.completeSectionCount, 13);
assert.equal(stability.completeQuestionCount, 325);
assert.equal(stability.balancedYearCount, 3);
assert.equal(stability.maxSingleDate, "2023-07-25");
approx(stability.maxSingleDateSectionShare, 3 / 13);
assert.equal(stability.status, "STABILITY_CANDIDATE");
assert.deepEqual([...stability.blockers], []);
assert.deepEqual([...stability.concentratedDateSensitivity!.packagesLostFromSupport], ["DI-004", "SRI-002"]);
assert.equal(stability.productionPromotionAuthorized, false);
assert.equal(canPromoteQuantV4WholeSectionFrequencyFromStability(stability), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_P2",
  authority: QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  stabilityStatus: stability.status,
  stabilityBlockers: stability.blockers,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
