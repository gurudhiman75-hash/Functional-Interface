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
  QUANT_V4_ALGEBRA_WAVE2_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_ALGEBRA_WAVE2_NON_MIGRATED_SOURCE_IDS,
  QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY,
} from "./quant-v4-pyq-observations-algebra-wave2-p2";

const observations = QUANT_V4_ALGEBRA_WAVE2_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY,
  "QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE2-P2",
);
assert.equal(observations.length, 5);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.packageId === "ALG-002"));
assert.ok(observations.every((entry) => entry.evidenceKind === "DIRECT_PYQ"));
assert.ok(observations.every((entry) => entry.heldDate && entry.shift));
assert.ok(observations.every((entry) => entry.paperId && entry.questionRef));
assert.ok(observations.every((entry) => entry.sourceRef.includes("ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2.md")));
assert.equal(new Set(observations.map((entry) => entry.questionRef)).size, 5);
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 5);

const byExam = new Map<string, number>();
for (const observation of observations) byExam.set(observation.examId, (byExam.get(observation.examId) ?? 0) + 1);
assert.equal(byExam.get("SSC_CGL_TIER_I"), 4);
assert.equal(byExam.get("SSC_CHSL"), 1);
assert.equal(byExam.size, 2);

assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-041")).length, 3);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-042")).length, 1);
assert.equal(observations.filter((entry) => entry.subtopic.includes("ALG-QL-043")).length, 1);
assert.deepEqual([...QUANT_V4_ALGEBRA_WAVE2_NON_MIGRATED_SOURCE_IDS], ["ALG-V2-S04", "ALG-V2-S06", "ALG-V2-S08", "ALG-V2-S09"]);

const [x, y, z] = [5, 4, 3];
assert.equal(x + y + z, 12);
assert.equal(x + y - z, 6);
assert.equal(x - y + z, 4);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 108);
const alg001 = listRegisteredCountablePyqObservations({ packageId: "ALG-001" });
const alg002 = listRegisteredCountablePyqObservations({ packageId: "ALG-002" });
assert.equal(alg001.length, 15);
assert.equal(alg002.length, 11);
const algebraAll = [...alg001, ...alg002];
assert.equal(algebraAll.length, 26);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CGL_TIER_I").length, 21);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CHSL").length, 3);
assert.equal(algebraAll.filter((entry) => entry.examId === "SSC_CGL_TIER_II").length, 2);

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: algebraAll,
  policy: { minDistinctPapers: 1, minCountableQuestions: 1, minTopicCoverage: 2, requireDatedPaperIdentity: true },
});
assert.equal(cgl.countableQuestionCount, 21);
assert.equal(cgl.distinctPaperCount, 17);
assert.equal(cgl.topicCoverageCount, 1);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(cgl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_ALGEBRA_PYQ_NORMALIZATION_WAVE2_P2",
  authority: QUANT_V4_ALGEBRA_WAVE2_PYQ_MIGRATION_AUTHORITY,
  wave2ObservationCount: observations.length,
  currentAlgebraRegisteredObservationCount: algebraAll.length,
  currentProfileCounts: { SSC_CGL_TIER_I: 21, SSC_CHSL: 3, SSC_CGL_TIER_II: 2 },
  wholeSectionWeightReady: false,
}));
