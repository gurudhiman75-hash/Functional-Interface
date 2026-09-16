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
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s1-full-quant-section-wave6-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S1";

assert.equal(
  QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
  "QUANT-V4-CGL-2023-07-25-S1-FULL-QUANT-SECTION-WAVE6-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

const paperRows = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.paperId === paperId)
  .sort((left, right) => Number(left.questionRef?.match(/Q(\d+)$/u)?.[1]) - Number(right.questionRef?.match(/Q(\d+)$/u)?.[1]));
assert.equal(paperRows.length, 25);
assert.deepEqual(
  paperRows.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1])),
  Array.from({ length: 25 }, (_, index) => index + 51),
);
assert.equal(new Set(paperRows.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

assert.equal(13_500 / 0.25, 54_000);
assert.equal(54_000 * 0.125 * 6, 40_500);
assert.equal(20 * 67 - 19 * 65, 105);
assert.equal(12 ** 3 - 6 ** 3 - 8 ** 3, 10 ** 3);
assert.equal((8 ** 8 + 6) % 7, 0);
assert.equal(39 * 6, 234);
assert.equal(234 * 18 + 39, 4_251);
assert.equal(29 ** 2 - (25 - 4) ** 2, 20 ** 2);
assert.equal(400 * 60, 12 * (18 - 16) * 1000);
assert.equal(150 ** 2 + 80 ** 2, 170 ** 2);
assert.equal(2 * (150 + 80), 460);

// Exact Wave 6 paper proof plus append-safe cumulative evidence floors.
assert.ok(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length >= 307);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length >= 40);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "ALG-002" }).length >= 12);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length >= 11);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length >= 27);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length >= 18);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length >= 29);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length >= 18);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "PCT-001" }).length >= 1);
assert.ok(listRegisteredCountablePyqObservations({ packageId: "DI-004" }).length >= 1);

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
assert.ok(cgl.countableQuestionCount >= 274);
assert.ok(cgl.distinctPaperCount >= 25);
assert.ok(cgl.topicCoverageCount >= 13);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

const whole = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.ok(whole.completeSectionCount >= 10);
assert.ok(whole.completeQuestionCount >= 250);
assert.ok(whole.totalCountableQuestionCount >= 274);
assert.equal(whole.totalCountableQuestionCount, whole.completeQuestionCount + whole.nonWholeSectionCountableQuestionCount);
assert.equal(whole.distinctSectionYearCount, 3);
assert.ok(whole.packageCoverageCount >= 28);
assert.equal(whole.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...whole.blockers], []);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_P2",
  authority: QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY,
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
