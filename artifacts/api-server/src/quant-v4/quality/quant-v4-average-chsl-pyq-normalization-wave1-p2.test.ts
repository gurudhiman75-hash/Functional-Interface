import assert from "node:assert/strict";

import {
  getQuantV4SpecializedProfileSelectionContract,
} from "../common/specialized-profile-selection";
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
  QUANT_V4_AVERAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_AVERAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-average-chsl-wave1-p2";

const observations = QUANT_V4_AVERAGE_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_AVERAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-AVERAGE-CHSL-PYQ-NORMALIZATION-WAVE1-P2");
assert.equal(observations.length, 6);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CHSL"));
assert.ok(observations.every((entry) => entry.packageId === "AVG-001"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.ok(observations.every((entry) => entry.paperId?.includes("IDENTITY-UNRESOLVED")));
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 6);
assert.deepEqual(QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.packageCounts, { "AVG-001": 6 });
assert.deepEqual(QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.profileObservationCounts, { SSC_CHSL: 6 });
assert.deepEqual([...QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.cpCoverage], ["AVG-CP-002", "AVG-CP-003", "AVG-CP-004"]);
assert.equal(QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.selectionCalibrationAllowed, false);
assert.equal(QUANT_V4_AVERAGE_CHSL_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

const oldBattingAverage = 63 - 24;
assert.equal(oldBattingAverage, 39);
assert.equal(oldBattingAverage + 2, 41);
const evenNumbers = [6, 8, 10, 12];
assert.equal(evenNumbers.reduce((sum, value) => sum + value, 0) / evenNumbers.length, 9);
assert.equal(Math.max(...evenNumbers), 12);
assert.equal(55 + 12 * (1 / 3), 59);
assert.equal((30 * 40 + 40 * 30) / 70, 240 / 7);
assert.equal((7 * (12000 - 6000)) / (8000 - 6000), 21);
const oldFamilyTotal = 5 * 17;
const currentOldMembersTotal = oldFamilyTotal + 5 * 3;
const currentFamilyTotal = 6 * 17;
assert.equal(currentFamilyTotal - currentOldMembersTotal, 2);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 133);
const average = listRegisteredCountablePyqObservations({ packageId: "AVG-001" });
assert.equal(average.length, 8);
assert.equal(average.filter((entry) => entry.examId === "SSC_CHSL").length, 6);
assert.equal(average.filter((entry) => entry.examId === "SSC_CGL_TIER_I").length, 2);

const avgChslContract = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_CHSL");
assert.equal(avgChslContract.normalizedCountableObservationCount, 6);
assert.equal(avgChslContract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(avgChslContract.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
assert.equal(avgChslContract.profileSelectionCalibrated, false);
assert.ok(avgChslContract.blockers.includes("PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION"));
assert.ok(avgChslContract.blockers.includes("CP_QL_DISTRIBUTION_UNPROVEN"));
assert.ok(avgChslContract.blockers.includes("DIFFICULTY_REPRESENTATION_UNCALIBRATED"));
assert.ok(avgChslContract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));

const chsl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CHSL",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: { minDistinctPapers: 8, minCountableQuestions: 20, minTopicCoverage: 4, requireDatedPaperIdentity: true },
});
assert.equal(chsl.countableQuestionCount, 26);
assert.equal(chsl.topicCoverageCount, 6);
assert.equal(chsl.distinctPaperCount, 7);
assert.equal(chsl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(!chsl.blockers.includes("COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY"));
assert.ok(!chsl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DISTINCT_PAPER_SAMPLE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
assert.equal(canReplaceProvisionalSimulationWeights(chsl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_AVERAGE_CHSL_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_AVERAGE_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  wave1ObservationCount: observations.length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  avgChslObservationCount: avgChslContract.normalizedCountableObservationCount,
  chslCountableQuestions: chsl.countableQuestionCount,
  chslDistinctPapers: chsl.distinctPaperCount,
  chslTopicCoverage: chsl.topicCoverageCount,
  empiricalWeightingPromoted: false,
}));
