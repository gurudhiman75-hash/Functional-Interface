import assert from "node:assert/strict";

import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  validatePyqObservationSet,
} from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2022-12-06-s2-full-quant-section-wave9-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2022-TIER-I-2022-12-06-S2";

assert.equal(
  QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  "QUANT-V4-CGL-2022-12-06-S2-FULL-QUANT-SECTION-WAVE9-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2022-12-06"));
assert.ok(observations.every((entry) => entry.shift === "Shift 2"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, true);
assert.equal(QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(
  paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => index + 51),
);
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

// Representative source-math checks across the section.
assert.equal(Math.sqrt(12.8 * 64.8), 28.8); // Q52 mean proportional.
assert.equal((2 * (8 / 15)) / (1 - (8 / 15) ** 2), 240 / 161); // Q53 tan 2A.
assert.equal(2_220 / 4, 555); // Q58 weighted profit split.
assert.equal((2 * 6) ** 2, 4 * 6 ** 2); // Q65 identity check basis.
assert.equal(3_828 / (1.16 * 1.32), 2_500); // Q66 original cost.
assert.equal(280 / (24 - 10) * 60 / 1000, 1.2); // Q71 chase time in minutes.
assert.equal(12 ** 2 / 8 - 8, 10); // Q72 chord AB.
assert.equal((14 ** 2 * Math.sqrt(3)) / 4, 49 * Math.sqrt(3)); // Q74 area.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 283);

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(cgl.countableQuestionCount, 250);
assert.equal(cgl.distinctPaperCount, 25);
assert.equal(cgl.topicCoverageCount, 13);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(whole.completeSectionCount, 9);
assert.equal(whole.completeQuestionCount, 225);
assert.equal(whole.totalCountableQuestionCount, 250);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 25);
assert.equal(whole.distinctSectionYearCount, 3);
assert.equal(whole.packageCoverageCount, 26);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_P2",
  authority: QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  evidenceStatus: whole.evidenceStatus,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
