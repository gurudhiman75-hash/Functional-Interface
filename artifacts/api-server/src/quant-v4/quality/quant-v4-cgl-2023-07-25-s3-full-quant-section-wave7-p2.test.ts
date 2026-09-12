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
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY,
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-25-s3-full-quant-section-wave7-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const observations = QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS;
const paperId = "SSC-CGL-2023-TIER-I-2023-07-25-S3";

assert.equal(
  QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY,
  "QUANT-V4-CGL-2023-07-25-S3-FULL-QUANT-SECTION-WAVE7-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === paperId));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-25"));
assert.ok(observations.every((entry) => entry.shift === "Shift 3"));
assert.ok(observations.every((entry) => entry.packageId && entry.packageId !== "UNMAPPED_PACKAGE"));
assert.equal(QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS.productionPromotionAuthorized, false);

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
assert.equal((12 ** 2 - 4 * 32) ** 0.5, 4); // Q51 |a-b|.
assert.equal(4 * (12 ** 2 - 32), 448); // Q51 a^3-b^3.
assert.equal(0.6 - 0.49, 0.11); // Q55 single-vs-successive discount gap.
assert.equal(220 / 0.11, 2_000); // Q55 bill.
assert.equal(0.9 * 1.2 * 500, 540); // Q59 successive percentage reverse check.
assert.equal(32 * 13 / 8, 52); // Q62 fourth proportional.
assert.equal((20.8 - 15.2) / 2, 2.8); // Q69 stream speed.
assert.equal(1.3 * 0.7, 0.91); // Q71 equal rise/fall leaves 91%.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 233);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 29);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-002" }).length, 13);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length, 10);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 25);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 12);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 24);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 15);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PCT-001" }).length, 3);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "DI-004" }).length, 1);

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
assert.equal(cgl.countableQuestionCount, 200);
assert.equal(cgl.distinctPaperCount, 23);
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
assert.equal(whole.completeSectionCount, 7);
assert.equal(whole.completeQuestionCount, 175);
assert.equal(whole.totalCountableQuestionCount, 200);
assert.equal(whole.nonWholeSectionCountableQuestionCount, 25);
assert.equal(whole.distinctSectionYearCount, 3);
assert.equal(whole.packageCoverageCount, 25);
assert.equal(whole.evidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...whole.blockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);
assert.equal(whole.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(whole), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_P2",
  authority: QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY,
  newObservations: observations.length,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  completeSections: whole.completeSectionCount,
  completeSectionQuestions: whole.completeQuestionCount,
  packageCoverage: whole.packageCoverageCount,
  blockers: whole.blockers,
  productionPromotionAuthorized: whole.productionPromotionAuthorized,
}));
