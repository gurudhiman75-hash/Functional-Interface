import assert from "node:assert/strict";

import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-09-11-s1-full-quant-section-wave10-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2024-TIER-I-2024-09-11-S1";

assert.equal(
  QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  "QUANT-V4-CGL-2024-09-11-S1-FULL-QUANT-SECTION-WAVE10-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-11"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(
  paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => index + 1),
);
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

// Representative source-math checks.
assert.equal(999 + 90, 1089); // Q8.
assert.equal(1089 % 99, 0); // Q8.
assert.equal(9 * 5 / 6, 7.5); // Q11.
assert.equal(1200 * 0.85 * 0.9, 918); // Q18.
assert.equal((52997 - 28400) / 9, 2733); // Q20.
assert.equal((70 + 85 + 90 + 95 + 75) / 5, 83); // Q21.
assert.equal((22 / 7) * (28 ** 2 - 25 ** 2) * 28, 13992); // Q22.
assert.equal(64 * 16 + 32, 1056); // Q23.
assert.equal(560 / (9 - 2) * 3, 240); // Q25.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 308);
const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(whole.completeSectionCount, 10);
assert.equal(whole.completeQuestionCount, 250);
assert.equal(whole.totalCountableQuestionCount, 275);
assert.equal(whole.packageCoverageCount, 26);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_P2",
  authority: QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
