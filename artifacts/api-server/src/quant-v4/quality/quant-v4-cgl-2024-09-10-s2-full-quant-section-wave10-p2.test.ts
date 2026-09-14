import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-10-s2-full-quant-section-wave10-p2";
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

const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-10-S2";
const observations = QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  "QUANT-V4-CGL-2024-09-10-S2-FULL-QUANT-SECTION-WAVE10-P2",
);
assert.equal(observations.length, 24);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-10"));
assert.ok(observations.every((entry) => entry.shift === "Shift 2"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(observations.some((entry) => entry.questionRef?.endsWith("Q53")), false);
assert.equal(QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.priorObservationReused, "ALG-V2-S01");
assert.equal(QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((left, right) => qnum(left.questionRef) - qnum(right.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
const reused = section.find((entry) => entry.observationId === "ALG-V2-S01");
assert.ok(reused);
assert.equal(reused.questionRef, "SSCPORTAL-SSC-CGL-2024-09-10-S2-Q53");
assert.equal(reused.packageId, "ALG-002");

const sectionPackageCounts = Object.fromEntries(
  [...new Set(section.map((entry) => entry.packageId ?? "UNMAPPED"))]
    .sort()
    .map((packageId) => [packageId, section.filter((entry) => entry.packageId === packageId).length]),
);
assert.deepEqual(sectionPackageCounts, {
  "ALG-001": 2,
  "ALG-002": 1,
  "DI-001": 2,
  "DI-003": 2,
  "GEO-001": 2,
  "GEO-002": 1,
  "INT-001": 1,
  "MAL-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-005": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 2,
});
assert.equal(Object.values(sectionPackageCounts).reduce((sum, count) => sum + count, 0), 25);

// Representative source-math checks across the complete section.
assert.equal((180 - 6 * 20) / 10, 6); // Q51.
assert.equal((30 * 8 - 20 * 3 - 30 * 5) / (40 - 30), 3); // Q52.
assert.equal((500 / 1000) / (15 / 60), 2); // Q54 relative speed.
assert.equal(9 * 3, 27); // Q55.
assert.ok(Math.abs((0.58 ** 3 - 0.1 ** 3) / (0.58 ** 2 + 0.58 * 0.1 + 0.1 ** 2) - 0.48) < 1e-12); // Q56.
assert.equal(1 / (1 / 30 + 1 / 45), 18); // Q57.
assert.deepEqual([6 * 5, 8 * 5, 12 * 4], [30, 40, 48]); // linked-ratio scale before simplification.
const tan = 3 / 2;
assert.equal((3 * tan - 2) / (3 * tan + 2), 5 / 13); // Q60.
assert.equal((5 / 4) * (25 / 9) / ((5 / 3) ** 3), 3 / 4); // Q61.
assert.ok(Math.abs((Math.PI * 4 ** 2 * 3) / 3 - 16 * Math.PI) < 1e-12); // Q62.
assert.equal(7 ** 2 - 2, 47); // Q63.
assert.equal(100 * (1 - 0.6 * 0.7), 58); // Q64.
assert.equal((1.5 ** 2 - 1) * 100, 125); // Q65.
assert.equal(45 + 65, 110); // Q66 exterior angle.
assert.ok(Math.abs((200 - 100) / 0.3 - 1000 / 3) < 1e-12); // Q67.
assert.equal(((-1) ** 77 - 1 + 78) % 78, 76); // Q68.
assert.equal(26_160 / (1.18 + 1.12 + 1.06 + 1), 6_000); // Q69.
assert.equal(4, 4); // Q70: p=2sinA, q=cosA => p²+4q²=4.
assert.equal([35, 50, 70, 90, 40, 60, 30].filter((value) => value > 375 / 7).length, 3); // Q72.
assert.equal(2 * Math.sqrt((5 * Math.sqrt(13)) ** 2 - 10 ** 2), 30); // Q73.
assert.deepEqual([(100 + 20) / 2, (100 - 20) / 2], [60, 40]); // Q74.
assert.equal(21 - (6 + 7 - (3.22 - 1.1 * 0.2)), 11); // Q75.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 307);
const cgl = listRegisteredCountablePyqObservations({ examIds: ["SSC_CGL_TIER_I"] });
assert.equal(cgl.length, 274);
assert.equal(cgl.filter((entry) => entry.paperId === PAPER_ID).length, 25);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 10);
assert.equal(whole.totalCountableQuestionCount, 274);
assert.equal(whole.completeSectionCount, 10);
assert.equal(whole.completeQuestionCount, 250);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 24);
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
assert.equal(stability.completeSectionCount, 10);
assert.equal(stability.completeQuestionCount, 250);
assert.equal(stability.balancedYearCount, 3);
assert.equal(stability.maxSingleYearSectionShare, 0.6);
assert.equal(stability.maxSingleDateSectionShare, 0.3);
assert.equal(stability.productionPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_P2",
  authority: QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  newObservations: observations.length,
  reusedObservation: reused.observationId,
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
