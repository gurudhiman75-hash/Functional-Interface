import assert from "node:assert/strict";

import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
} from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_AUTHORITY,
  buildCglCompleteSectionCompositionAudit,
} from "./quant-v4-cgl-complete-section-composition-p2";
import { QUANT_V4_REAL_EXAM_PROFILES } from "./quant-v4-real-exam-simulation-p2";

const audit = buildCglCompleteSectionCompositionAudit();

assert.equal(audit.authority, QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_AUTHORITY);
assert.equal(audit.examId, "SSC_CGL_TIER_I");
assert.equal(audit.completeSectionCount, 3);
assert.equal(audit.completeSectionQuestionCount, 75);
assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 133);
assert.ok(audit.papers.every((paper) => paper.questionCount === 25));
assert.ok(audit.papers.every((paper) => paper.unclassifiedPackageIds.length === 0));

assert.deepEqual(audit.papers.map((paper) => [paper.paperId, paper.packageCount]), [
  ["SSC-CGL-2024-TIER-I-2024-09-09-S1", 14],
  ["SSC-CGL-2023-TIER-I-2023-07-27-S2", 15],
  ["SSC-CGL-2022-TIER-I-2022-12-01-S1", 17],
]);

assert.deepEqual(audit.papers[0]?.slotCounts, {
  ARITHMETIC_CORE: 9,
  GEOMETRY_MENSURATION: 5,
  TRIGONOMETRY: 3,
  ALGEBRA: 4,
  DATA_INTERPRETATION: 4,
  PROBABILITY: 0,
});
assert.deepEqual(audit.papers[1]?.slotCounts, {
  ARITHMETIC_CORE: 14,
  GEOMETRY_MENSURATION: 5,
  TRIGONOMETRY: 2,
  ALGEBRA: 2,
  DATA_INTERPRETATION: 2,
  PROBABILITY: 0,
});
assert.deepEqual(audit.papers[2]?.slotCounts, {
  ARITHMETIC_CORE: 10,
  GEOMETRY_MENSURATION: 5,
  TRIGONOMETRY: 3,
  ALGEBRA: 3,
  DATA_INTERPRETATION: 4,
  PROBABILITY: 0,
});

assert.deepEqual(audit.aggregateSlotCounts, {
  ARITHMETIC_CORE: 33,
  GEOMETRY_MENSURATION: 15,
  TRIGONOMETRY: 8,
  ALGEBRA: 9,
  DATA_INTERPRETATION: 10,
  PROBABILITY: 0,
});
assert.equal(Object.values(audit.aggregateSlotCounts).reduce((sum, value) => sum + value, 0), 75);

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);
close(audit.empiricalMeanPerSection.ARITHMETIC_CORE, 11);
close(audit.empiricalMeanPerSection.GEOMETRY_MENSURATION, 5);
close(audit.empiricalMeanPerSection.TRIGONOMETRY, 8 / 3);
close(audit.empiricalMeanPerSection.ALGEBRA, 3);
close(audit.empiricalMeanPerSection.DATA_INTERPRETATION, 10 / 3);
close(audit.empiricalMeanPerSection.PROBABILITY, 0);

close(audit.empiricalShare.ARITHMETIC_CORE, 33 / 75);
close(audit.empiricalShare.GEOMETRY_MENSURATION, 15 / 75);
close(audit.empiricalShare.TRIGONOMETRY, 8 / 75);
close(audit.empiricalShare.ALGEBRA, 9 / 75);
close(audit.empiricalShare.DATA_INTERPRETATION, 10 / 75);
close(audit.empiricalShare.PROBABILITY, 0);

assert.deepEqual(audit.provisionalPlan, {
  ARITHMETIC_CORE: 13,
  GEOMETRY_MENSURATION: 4,
  TRIGONOMETRY: 3,
  ALGEBRA: 2,
  DATA_INTERPRETATION: 0,
  PROBABILITY: 3,
});
close(audit.meanDeltaVsProvisional.ARITHMETIC_CORE, -2);
close(audit.meanDeltaVsProvisional.GEOMETRY_MENSURATION, 1);
close(audit.meanDeltaVsProvisional.TRIGONOMETRY, -1 / 3);
close(audit.meanDeltaVsProvisional.ALGEBRA, 1);
close(audit.meanDeltaVsProvisional.DATA_INTERPRETATION, 10 / 3);
close(audit.meanDeltaVsProvisional.PROBABILITY, -3);

assert.deepEqual(audit.structuralFindings, [
  "DATA_INTERPRETATION_PRESENT_IN_EVERY_COMPLETE_SECTION_BUT_ABSENT_FROM_PROVISIONAL_PLAN",
  "PROBABILITY_FORCED_BY_PROVISIONAL_PLAN_WITH_ZERO_OBSERVATIONS_IN_COMPLETE_SECTION_SAMPLE",
]);
assert.equal(audit.status, "PROVISIONAL_PLAN_REVIEW_REQUIRED");
assert.equal(audit.productionWeightPromotionAllowed, false);
assert.deepEqual(audit.blockers, [
  "COMPLETE_SECTION_SAMPLE_POLICY_NOT_RATIFIED",
  "EMPIRICAL_COMPOSITION_REVIEW_REQUIRED",
]);

const cglSimulator = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === "SSC_CGL_TIER_I");
assert.ok(cglSimulator);
assert.equal(cglSimulator.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");

const cglEvidence = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(cglEvidence.countableQuestionCount, 100);
assert.equal(cglEvidence.distinctPaperCount, 19);
assert.equal(cglEvidence.topicCoverageCount, 11);
assert.equal(cglEvidence.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual(cglEvidence.blockers, ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cglEvidence), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_COMPLETE_SECTION_COMPOSITION_P2",
  authority: audit.authority,
  completeSections: audit.completeSectionCount,
  completeSectionQuestions: audit.completeSectionQuestionCount,
  aggregateSlotCounts: audit.aggregateSlotCounts,
  empiricalMeanPerSection: audit.empiricalMeanPerSection,
  provisionalPlan: audit.provisionalPlan,
  structuralFindings: audit.structuralFindings,
  productionWeightPromotionAllowed: audit.productionWeightPromotionAllowed,
  wholeRegistryBlockers: cglEvidence.blockers,
}));
