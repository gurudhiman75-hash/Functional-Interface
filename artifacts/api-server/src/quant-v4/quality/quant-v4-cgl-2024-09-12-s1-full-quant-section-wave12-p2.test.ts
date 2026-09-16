import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY,
  QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-12-s1-full-quant-section-wave12-p2";
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

const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-12-S1";
const observations = QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY,
  "QUANT-V4-CGL-2024-09-12-S1-FULL-QUANT-SECTION-WAVE12-P2",
);
assert.equal(observations.length, 24);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-12"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(observations.some((entry) => entry.questionRef?.endsWith("Q68")), false);
assert.equal(QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.priorObservationReused, "ALG-W1-S02");
assert.equal(QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, true);
assert.equal(QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((left, right) => qnum(left.questionRef) - qnum(right.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
const reused = section.find((entry) => entry.observationId === "ALG-W1-S02");
assert.ok(reused);
assert.equal(reused.questionRef, "PREPP-SSC-CGL-2024-09-12-S1-Q68");
assert.equal(reused.packageId, "ALG-001");
assert.equal(reused.evidenceKind, "DIRECT_PYQ");

const sectionPackageCounts = Object.fromEntries(
  [...new Set(section.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, section.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 3,
  "AVG-001": 1,
  "DI-001": 3,
  "DI-005": 1,
  "GEO-001": 3,
  "GEO-002": 1,
  "INT-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PNL-001": 1,
  "RAP-001": 3,
  SAP: 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 1,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

assert.equal(728_640 % 8, 0);
assert.equal(15.5 - (3 - (7 - (5 - (14.5 - 13.5)))), 15.5);
const incomeUnit = 5;
const expenseUnit = 3;
assert.deepEqual(
  [10 * incomeUnit - 12 * expenseUnit, 12 * incomeUnit - 15 * expenseUnit, 9 * incomeUnit - 8 * expenseUnit],
  [14, 15, 21],
);
assert.ok(Math.abs(1 / (1 / 10 + 1 / 20 - 1 / 30) - 60 / 7) < 1e-12);
assert.equal(8 + 2 + 15, 25);
assert.equal(8 * 10 + 2 * 5 + 15 * 2, 120);
assert.ok(Math.abs(Math.sqrt(28.9 * 36.1) - 32.3) < 1e-12);
assert.equal((2 * 22 / 7 * 14 * 20), 1760);
assert.equal((22 / 7) * 14 ** 2 * 20, 12_320);
assert.equal(5_000 * 0.8 * 0.85 * 0.9, 3_060);
const t = 2 / 5;
assert.ok(Math.abs(t ** 3 + (3 / 5) ** 3 + (9 / 5) * t - 1) < 1e-12);
assert.equal(Math.floor((5 + 2) * 1.5), 10);
assert.ok(Math.abs(Math.sqrt(24 ** 2 - (16 - 8) ** 2) - 16 * Math.sqrt(2)) < 1e-12);
assert.equal((7 * 15 - 9) / (15 - 1), 48 / 7);
assert.equal((1800 + 1890 + 1910 + 1940 + 1960) / 5, 1900);
assert.equal((17 - 13) * (180 / (17 + 13 + 15)), 16);
assert.equal(14 * 17 / 6, 119 / 3);

// The Wave 12 paper proof stays exact; cumulative evidence may grow in later waves.
assert.ok(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length >= 356);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.ok(cgl.length >= 323);
assert.equal(cgl.filter((entry) => entry.paperId === PAPER_ID).length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.ok(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length >= 12);
assert.ok(whole.totalCountableQuestionCount >= 323);
assert.ok(whole.completeSectionCount >= 12);
assert.ok(whole.completeQuestionCount >= 300);
assert.ok(whole.nonWholeSectionCountableQuestionCount <= 23);
assert.equal(whole.distinctSectionYearCount, 3);
assert.ok(whole.packageCoverageCount >= 28);
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
assert.ok(stability.completeSectionCount >= 12);
assert.ok(stability.completeQuestionCount >= 300);
assert.equal(stability.balancedYearCount, 3);
assert.equal(stability.maxSingleYear, "2023");
assert.equal(stability.maxSingleDate, "2023-07-25");
assert.ok(stability.maxSingleDateSectionShare <= 0.25 + 1e-12);
assert.ok(["STABILITY_HOLD", "STABILITY_CANDIDATE"].includes(stability.status));
assert.equal(stability.productionPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_P2",
  authority: QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY,
  newObservations: observations.length,
  reusedObservation: reused.observationId,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  stabilityStatus: stability.status,
  stabilityBlockers: stability.blockers,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
