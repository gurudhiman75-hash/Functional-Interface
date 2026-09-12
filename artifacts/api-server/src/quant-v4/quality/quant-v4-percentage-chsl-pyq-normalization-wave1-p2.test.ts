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
  QUANT_V4_PERCENTAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_PERCENTAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-percentage-chsl-wave1-p2";

const observations = QUANT_V4_PERCENTAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_PERCENTAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-PERCENTAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2");
assert.equal(observations.length, 5);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CHSL"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.packageId === "PCT-002"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.ok(observations.every((entry) => entry.paperId?.includes("IDENTITY-UNRESOLVED")));
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 5);
assert.deepEqual(QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.packageCounts, { "PCT-002": 5 });
assert.deepEqual(QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.profileObservationCounts, { SSC_CHSL: 5 });
assert.deepEqual([...QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.excludedAmbiguousCglTierQuestions], [
  "DISHA-PDF-PAGE-91-Q48",
  "DISHA-PDF-PAGE-91-Q49",
  "DISHA-PDF-PAGE-91-Q50",
]);
assert.equal(QUANT_V4_PERCENTAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

assert.equal(24 / 40 * 100, 60);
assert.equal(100 * 100 / 125, 80);
assert.equal(81 * 100 / 90, 90);
const percentLess = (120 - 100) / 120 * 100;
assert.ok(Math.abs(percentLess - 50 / 3) < 1e-12);
assert.equal(0.01 * 0.01 * 0.25 * 1000, 0.025);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 183);
const percentage = listRegisteredCountablePyqObservations({ packageId: "PCT-002" });
assert.equal(percentage.length, 9);
assert.equal(percentage.filter((entry) => entry.examId === "SSC_CHSL").length, 5);
assert.equal(percentage.filter((entry) => entry.examId === "SSC_CGL_TIER_I").length, 4);

const chsl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CHSL",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: { minDistinctPapers: 8, minCountableQuestions: 20, minTopicCoverage: 4, requireDatedPaperIdentity: true },
});
assert.equal(chsl.countableQuestionCount, 26);
assert.equal(chsl.distinctPaperCount, 7);
assert.equal(chsl.topicCoverageCount, 6);
assert.equal(chsl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(!chsl.blockers.includes("COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DISTINCT_PAPER_SAMPLE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
assert.ok(!chsl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.equal(canReplaceProvisionalSimulationWeights(chsl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PERCENTAGE_CHSL_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_PERCENTAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  wave1ObservationCount: observations.length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  chslCountableQuestions: chsl.countableQuestionCount,
  chslDistinctPapers: chsl.distinctPaperCount,
  chslTopicCoverage: chsl.topicCoverageCount,
  empiricalWeightingPromoted: false,
}));
