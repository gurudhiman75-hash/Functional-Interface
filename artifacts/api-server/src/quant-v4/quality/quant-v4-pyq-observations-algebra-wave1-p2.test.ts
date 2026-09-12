import assert from "node:assert/strict";

import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  validatePyqObservationSet,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_ALGEBRA_WAVE1_NON_MIGRATED_SOURCE_IDS,
  QUANT_V4_ALGEBRA_WAVE1_PYQ_MIGRATION_AUTHORITY,
} from "./quant-v4-pyq-observations-algebra-wave1-p2";

assert.equal(QUANT_V4_ALGEBRA_WAVE1_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-ALGEBRA-WAVE1-PYQ-MIGRATION-P2");
assert.equal(QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length, 10);
validatePyqObservationSet(QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS);

const byExam = new Map<string, number>();
for (const observation of QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS) {
  byExam.set(observation.examId, (byExam.get(observation.examId) ?? 0) + 1);
  assert.equal(observation.evidenceKind, "DIRECT_PYQ");
  assert.equal(observation.topic, "Advanced Mathematics");
  assert.ok(observation.subtopic.startsWith("Algebra"));
  assert.equal(observation.packageId, "ALG-001");
  assert.ok(observation.sourceRef.includes("ALG-SOURCE-PYQ-AUDIT-WAVE01-CP001-CP005.md"));
  assert.ok(observation.heldDate);
  assert.ok(observation.paperId);
  assert.ok(observation.questionRef);
}

assert.equal(byExam.get("SSC_CGL_TIER_I"), 7);
assert.equal(byExam.get("SSC_CHSL"), 2);
assert.equal(byExam.get("SSC_CGL_TIER_II"), 1);
assert.equal(byExam.size, 3);
assert.deepEqual([...QUANT_V4_ALGEBRA_WAVE1_NON_MIGRATED_SOURCE_IDS], [
  "ALG-W1-S01",
  "ALG-W1-S05",
  "ALG-W1-S08",
  "ALG-W1-S11",
  "ALG-W1-S14",
]);

// This first migration proves usable evidence, not whole-section frequency coverage.
// Requiring more than one topic keeps the profile fail-closed until other chapter ledgers are normalized.
const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 1,
    minCountableQuestions: 1,
    minTopicCoverage: 2,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(cgl.countableQuestionCount, 7);
assert.equal(cgl.topicCoverageCount, 1);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(cgl.blockers.includes("TOPIC_COVERAGE_BELOW_POLICY"));
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log("PASS_QUANT_V4_ALGEBRA_WAVE1_PYQ_MIGRATION_P2", {
  totalMigrated: QUANT_V4_ALGEBRA_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  byExam: Object.fromEntries([...byExam.entries()].sort()),
  deliberatelyNotMigrated: QUANT_V4_ALGEBRA_WAVE1_NON_MIGRATED_SOURCE_IDS.length,
  cglSectionWeightReady: false,
});
