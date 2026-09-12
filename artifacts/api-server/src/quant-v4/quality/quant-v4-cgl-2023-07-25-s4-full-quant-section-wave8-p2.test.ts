import assert from "node:assert/strict";

import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  validatePyqObservationSet,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s4-full-quant-section-wave8-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S4";

assert.equal(
  QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY,
  "QUANT-V4-CGL-2023-07-25-S4-FULL-QUANT-SECTION-WAVE8-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 4"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

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
assert.equal(7 ** 3, 343); // Q51 cube volume.
assert.equal(4 * 18 / 12 - 4, 2); // Q54 additional men.
assert.equal((2 * (4 * 6 + 6 * 8 + 8 * 4)) ** 0.5 > 14.4, true); // Q57 square side.
assert.equal((5_200 - 0.08 * 50_000) / 0.04, 30_000); // Q58 amount at 12%.
assert.equal(2_695 / (1.1 * 1.4), 1_750); // Q60 reverse percentage chain.
assert.equal((900 * 15 + 700 * 14 - 1_600 * 10) / (1_600 * 10) * 100, 45.625); // Q63 gain%.
assert.equal(10 / 50 * 100, 20); // Q68 dilution.
assert.equal((15_990 - 12_792) / 15_990 * 100, 20); // Q70 discount.
assert.equal(54_736 % 44, 0); // Q74 divisibility.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 258);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 32);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-002" }).length, 14);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length, 10);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 26);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 14);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 27);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 17);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PCT-001" }).length, 4);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "SRI-002" }).length, 1);

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
assert.equal(cgl.countableQuestionCount, 225);
assert.equal(cgl.distinctPaperCount, 24);
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
assert.equal(whole.completeSectionCount, 8);
assert.equal(whole.completeQuestionCount, 200);
assert.equal(whole.totalCountableQuestionCount, 225);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 25);
assert.equal(whole.distinctSectionYearCount, 3);
assert.equal(whole.packageCoverageCount, 26);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_P2",
  authority: QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  evidenceStatus: whole.evidenceStatus,
  blockers: whole.blockers,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
