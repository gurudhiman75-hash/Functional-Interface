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
  QUANT_V4_ALGEBRA_WAVE3_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_ALGEBRA_WAVE3_NON_MIGRATED_SOURCE_IDS,
  QUANT_V4_ALGEBRA_WAVE3_PYQ_MIGRATION_AUTHORITY,
} from "./quant-v4-pyq-observations-algebra-wave3-p2";

const observations = QUANT_V4_ALGEBRA_WAVE3_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_ALGEBRA_WAVE3_PYQ_MIGRATION_AUTHORITY,
  "QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE3-P2",
);
assert.equal(observations.length, 5);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.evidenceKind === "DIRECT_PYQ"));
assert.ok(observations.every((entry) => entry.heldDate && entry.paperId && entry.questionRef));
assert.equal(observations.filter((entry) => entry.shift).length, 4);
assert.equal(observations.find((entry) => entry.observationId === "ALG-HR1-S05")?.shift, undefined);
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 5);

const byExam = new Map<string, number>();
const byPackage = new Map<string, number>();
for (const observation of observations) {
  byExam.set(observation.examId, (byExam.get(observation.examId) ?? 0) + 1);
  byPackage.set(observation.packageId ?? "UNKNOWN", (byPackage.get(observation.packageId ?? "UNKNOWN") ?? 0) + 1);
}
assert.equal(byExam.get("SSC_CGL_TIER_I"), 4);
assert.equal(byExam.get("SSC_CGL_TIER_II"), 1);
assert.equal(byExam.size, 2);
assert.equal(byPackage.get("ALG-001"), 1);
assert.equal(byPackage.get("ALG-002"), 4);

assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-014")).length, 1);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-022")).length, 2);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-023")).length, 1);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-031")).length, 1);

assert.ok(observations.filter((entry) => entry.observationId.startsWith("ALG-HR1-")).every((entry) => entry.sourceRef.includes("ALG-HOLD-RESOLUTION-PASS-01.md")));
assert.ok(observations.filter((entry) => entry.observationId.startsWith("ALG-FRZ-")).every((entry) => entry.sourceRef.includes("ALG-FINAL-SOURCE-FIXTURE-LEDGER.md")));
assert.equal(QUANT_V4_ALGEBRA_WAVE3_NON_MIGRATED_SOURCE_IDS.length, 17);
assert.ok(QUANT_V4_ALGEBRA_WAVE3_NON_MIGRATED_SOURCE_IDS.includes("ALG-HR1-S09"));
assert.ok(QUANT_V4_ALGEBRA_WAVE3_NON_MIGRATED_SOURCE_IDS.includes("ALG-FRZ-S13"));

// Independent exact checks for source-stated algebraic structures.
for (const value of [-7, -2, 0, 3, 11]) {
  assert.equal(16 * value * value + 40 * value + 25, (4 * value + 5) ** 2, "HR1-S02 perfect-square identity check failed.");
}
assert.equal(40 * 12, 30 * 16, "HR1-S04 x/y coefficient ratios should match.");
assert.notEqual(40 * 340, 30 * 170, "HR1-S04 constant ratio must differ for the no-solution state.");

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 53);
const alg001 = listRegisteredCountablePyqObservations({ packageId: "ALG-001" });
const alg002 = listRegisteredCountablePyqObservations({ packageId: "ALG-002" });
assert.equal(alg001.length, 11);
assert.equal(alg002.length, 9);
const algebraAll = [...alg001, ...alg002];
assert.equal(algebraAll.length, 20);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CGL_TIER_I").length, 15);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CHSL").length, 3);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CGL_TIER_II").length, 2);

// The evidence set is deeper, but still Algebra-only; it cannot establish whole-section Quant frequency.
const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: algebraAll,
  policy: {
    minDistinctPapers: 1,
    minCountableQuestions: 1,
    minTopicCoverage: 2,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(cgl.countableQuestionCount, 15);
assert.equal(cgl.distinctPaperCount, 15);
assert.equal(cgl.topicCoverageCount, 1);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(cgl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_ALGEBRA_PYQ_NORMALIZATION_WAVE3_P2",
  authority: QUANT_V4_ALGEBRA_WAVE3_PYQ_MIGRATION_AUTHORITY,
  wave3ObservationCount: observations.length,
  algebraRegisteredObservationCount: algebraAll.length,
  profileCounts: {
    SSC_CGL_TIER_I: 15,
    SSC_CHSL: 3,
    SSC_CGL_TIER_II: 2,
  },
  wholeSectionWeightReady: false,
}));
