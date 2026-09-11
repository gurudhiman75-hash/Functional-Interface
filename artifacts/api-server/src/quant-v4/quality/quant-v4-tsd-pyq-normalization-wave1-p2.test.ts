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
  QUANT_V4_TSD_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_TSD_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-tsd-wave1-p2";

const observations = QUANT_V4_TSD_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_TSD_WAVE1_PYQ_MIGRATION_AUTHORITY,
  "QUANT-V4-TSD-PYQ-NORMALIZATION-WAVE1-P2",
);
assert.equal(observations.length, 6);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.ok(observations.every((entry) => entry.paperId?.includes("IDENTITY-UNRESOLVED")));
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 6);

assert.deepEqual(QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.packageCounts, {
  "TSD-001": 3,
  "TSD-002": 3,
});
assert.deepEqual(QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.profileObservationCounts, {
  SSC_CHSL: 2,
  IBPS_CLERK: 3,
  SBI_PO: 1,
});
assert.equal(QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.excludedAmbiguousCglTierQuestions.length, 7);
assert.deepEqual([...QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.excludedAmbiguousCglTierQuestions], [
  "DISHA-PDF-PAGE-195-Q56",
  "DISHA-PDF-PAGE-195-Q57",
  "DISHA-PDF-PAGE-195-Q58",
  "DISHA-PDF-PAGE-195-Q59",
  "DISHA-PDF-PAGE-195-Q60",
  "DISHA-PDF-PAGE-195-Q61",
  "DISHA-PDF-PAGE-195-Q62",
]);
assert.deepEqual([...QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.excludedStageAmbiguousBankingQuestions], [
  "DISHA-PDF-PAGE-195-Q55",
]);
assert.equal(QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

// Independent exact checks for all six retained source questions.
// SSC 10+2-2012 Q68: 100 m in 7.2 s => 50 km/h relative speed; subtract man's 5 km/h.
const q68RelativeKmph = (100 * 10 * 18) / (72 * 5);
assert.equal(q68RelativeKmph, 50);
assert.equal(q68RelativeKmph - 5, 45);

// SSC 10+2-2013 Q69.
const q69DistanceKm = 80 * 4.5;
assert.equal(q69DistanceKm, 360);
assert.equal(q69DistanceKm / 4, 90);

// IBPS Clerk-2012 Q72.
const bicycleSpeedMps = 192 / 8;
const manSpeedMps = bicycleSpeedMps * 3 / 4;
assert.equal(bicycleSpeedMps, 24);
assert.equal(manSpeedMps, 18);
assert.equal(54 / manSpeedMps, 3);

// IBPS Clerk-2012 Q73.
assert.equal(572 / 13, 44);

// IBPS Clerk-2013 Q74.
const q74RelativeKmph = (210 / 6) * 18 / 5;
assert.equal(q74RelativeKmph, 126);
assert.equal(q74RelativeKmph - 9, 117);

// SBI PO-2011 Q54: circumference = 220 cm = 2.2 m; 33 km/h = 550 m/min.
const circumferenceCm = 2 * 22 * 35 / 7;
const linearMetresPerMinute = 33000 / 60;
assert.equal(circumferenceCm, 220);
assert.equal(linearMetresPerMinute, 550);
assert.equal(linearMetresPerMinute * 100 / circumferenceCm, 250);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 58);
const tsd001 = listRegisteredCountablePyqObservations({ packageId: "TSD-001" });
const tsd002 = listRegisteredCountablePyqObservations({ packageId: "TSD-002" });
assert.equal(tsd001.length, 3);
assert.equal(tsd002.length, 3);
const tsdAll = [...tsd001, ...tsd002];
assert.equal(tsdAll.filter((entry) => entry.examId === "SSC_CHSL").length, 2);
assert.equal(tsdAll.filter((entry) => entry.examId === "IBPS_CLERK").length, 3);
assert.equal(tsdAll.filter((entry) => entry.examId === "SBI_PO").length, 1);

const chsl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CHSL",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(chsl.countableQuestionCount, 26);
assert.equal(chsl.distinctPaperCount, 7);
assert.equal(chsl.topicCoverageCount, 6);
assert.equal(chsl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(!chsl.blockers.includes("COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DISTINCT_PAPER_SAMPLE_BELOW_POLICY"));
assert.ok(!chsl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.ok(chsl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
assert.equal(canReplaceProvisionalSimulationWeights(chsl), false);

const ibpsClerk = buildQuantV4PyqFrequencyProfile({
  examId: "IBPS_CLERK",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 6,
    minCountableQuestions: 15,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(ibpsClerk.countableQuestionCount, 3);
assert.equal(ibpsClerk.topicCoverageCount, 1);
assert.equal(ibpsClerk.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(ibpsClerk.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
assert.equal(canReplaceProvisionalSimulationWeights(ibpsClerk), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_TSD_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_TSD_WAVE1_PYQ_MIGRATION_AUTHORITY,
  wave1ObservationCount: observations.length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  profileCounts: QUANT_V4_TSD_WAVE1_SOURCE_LIMITATIONS.profileObservationCounts,
  chslCountableQuestions: chsl.countableQuestionCount,
  chslDistinctPapers: chsl.distinctPaperCount,
  chslTopicCoverage: chsl.topicCoverageCount,
  empiricalWeightingPromoted: false,
}));
