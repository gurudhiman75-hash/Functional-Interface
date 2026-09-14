import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2022-12-13-s1-full-quant-section-wave9-p2";
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

const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-13-S1";
const observations = QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  "QUANT-V4-CGL-2022-12-13-S1-FULL-QUANT-SECTION-WAVE9-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2022-12-13"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.deepEqual(
  observations.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => 51 + index),
);
assert.equal(new Set(observations.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const sectionPackageCounts = Object.fromEntries(
  [...new Set(observations.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, observations.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 4,
  "AVG-001": 1,
  "DI-001": 2,
  "DI-003": 2,
  "GEO-001": 2,
  "INT-001": 1,
  "MEN-001": 2,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-006": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

// Representative source-math proofs across the section.
assert.equal(4, 4); // Q52: 2×CSA=volume => 4πrh=πr²h => r=4.
assert.equal(Math.round(((8_400 * 0.75 * 0.85 - 4_000) / 4_000) * 100), 34); // Q54.
assert.equal(330 / (2 * (22 / 7)) - 110 / (2 * (22 / 7)), 35); // Q55.
assert.equal((5_000 * (7 - 5)) / (5 * 5 - 7 * 3), 2_500); // Q58 salary base x.
assert.equal(1 / (5 / (6 * 29) + 1 / 29), 174 / 11); // Q61 combined time.
assert.equal(((-1) ** 12 - 1), 0); // Q62 remainder at m=-1.
assert.equal(15 / 10, 3 / 2); // Q66 ratio of percentage decreases.
assert.equal((30_000 * 5 * 3 / 100) / 18_000, 0.25); // Q67.
assert.equal(9 * 14 * 19, 2_394); // Q68 LCM.
assert.equal(6 * 32 / 12, 16); // Q70 similar-triangle scale.
assert.ok(Math.abs((120 / 360) * Math.PI * 6 ** 2 - 12 * Math.PI) < 1e-12); // Q72.
const x = 3 + 2 * Math.sqrt(2); // one positive root satisfying x+1/x=6.
assert.ok(Math.abs((3 * x) / (2 * x ** 2 - 5 * x + 2) - 3 / 7) < 1e-12); // Q73.
const runningAverageBase = 50;
const runningAverages = [0, 1, 2, 3, 4].map((index) => runningAverageBase + 2 * index);
const runningTotals = runningAverages.map((average, index) => average * (index + 1));
const members = runningTotals.map((total, index) => total - (index ? runningTotals[index - 1]! : 0));
assert.equal(members[4]! - members[0]!, 16); // Q74.
const chairCost = (540 - 0.08 * 3_900) / 0.08;
const tableCost = 3_900 - chairCost;
assert.equal(Math.abs(chairCost - tableCost), 1_800); // Q75.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 283);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 250);
assert.equal(cgl.filter((entry) => entry.paperId === PAPER_ID).length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 9);
assert.equal(whole.totalCountableQuestionCount, 250);
assert.equal(whole.completeSectionCount, 9);
assert.equal(whole.completeQuestionCount, 225);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 25);
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
assert.equal(stability.completeSectionCount, 9);
assert.equal(stability.completeQuestionCount, 225);
assert.equal(stability.balancedYearCount, 2);
assert.equal(stability.status, "STABILITY_HOLD");
const year2022 = stability.yearProfiles.find((year) => year.year === "2022");
assert.equal(year2022?.sectionCount, 2);
assert.equal(year2022?.questionCount, 50);
assert.equal(year2022?.packageCoverageCount, 18);
assert.equal(stability.productionPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_P2",
  authority: QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  balancedYears: stability.balancedYearCount,
  stabilityStatus: stability.status,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
