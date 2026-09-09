import assert from "node:assert/strict";

import {
  QUANT_V4_PYQ_FREQUENCY_EVIDENCE_AUTHORITY,
  assertFrequencyShares,
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  isCountablePyqEvidenceKind,
  validatePyqObservation,
  type QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

assert.equal(QUANT_V4_PYQ_FREQUENCY_EVIDENCE_AUTHORITY, "QUANT-V4-PYQ-FREQUENCY-EVIDENCE-P2");

for (const kind of ["OFFICIAL_PAPER", "DIRECT_PYQ", "VERIFIED_PYQ_COLLECTION"] as const) {
  assert.equal(isCountablePyqEvidenceKind(kind), true, `${kind} should be countable.`);
}
for (const kind of ["BOOK_EXERCISE", "PRACTICE_TAXONOMY", "INTERNAL_DESIGN_FIXTURE"] as const) {
  assert.equal(isCountablePyqEvidenceKind(kind), false, `${kind} must never affect empirical exam weights.`);
}

const observations: QuantV4PyqObservation[] = [
  {
    observationId: "T-PYQ-001",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "OFFICIAL_PAPER",
    sourceRef: "fixture://paper-a/q1",
    sourceLabel: "Synthetic policy proof paper A",
    heldDate: "2025-01-10",
    shift: "Shift 1",
    paperId: "PAPER-A",
    questionRef: "Q1",
    packageId: "PCT-001",
    topic: "Arithmetic",
    subtopic: "Percentage",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-PYQ-002",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: "fixture://paper-a/q2",
    sourceLabel: "Synthetic policy proof paper A",
    heldDate: "2025-01-10",
    shift: "Shift 1",
    paperId: "PAPER-A",
    questionRef: "Q2",
    packageId: "RAP-001",
    topic: "Arithmetic",
    subtopic: "Ratio and Proportion",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-PYQ-003",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "OFFICIAL_PAPER",
    sourceRef: "fixture://paper-a/q3",
    sourceLabel: "Synthetic policy proof paper A",
    heldDate: "2025-01-10",
    shift: "Shift 1",
    paperId: "PAPER-A",
    questionRef: "Q3",
    packageId: "ALG-001",
    topic: "Advanced Mathematics",
    subtopic: "Algebra",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-PYQ-004",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "OFFICIAL_PAPER",
    sourceRef: "fixture://paper-b/q1",
    sourceLabel: "Synthetic policy proof paper B",
    heldDate: "2025-02-11",
    shift: "Shift 2",
    paperId: "PAPER-B",
    questionRef: "Q1",
    packageId: "GEO-001",
    topic: "Advanced Mathematics",
    subtopic: "Geometry",
    representation: "DIAGRAM_MCQ",
  },
  {
    observationId: "T-PYQ-005",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: "fixture://paper-b/q2",
    sourceLabel: "Synthetic verified collection mapped to paper B",
    heldDate: "2025-02-11",
    shift: "Shift 2",
    paperId: "PAPER-B",
    questionRef: "Q2",
    packageId: "TRG-001",
    topic: "Advanced Mathematics",
    subtopic: "Trigonometry",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-PYQ-006",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "DIRECT_PYQ",
    sourceRef: "fixture://paper-b/q3",
    sourceLabel: "Synthetic policy proof paper B",
    heldDate: "2025-02-11",
    shift: "Shift 2",
    paperId: "PAPER-B",
    questionRef: "Q3",
    packageId: "PRB-001",
    topic: "Advanced Mathematics",
    subtopic: "Probability",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-SUPPORT-001",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "BOOK_EXERCISE",
    sourceRef: "fixture://book/chapter-1/q1",
    sourceLabel: "Synthetic book support fixture",
    topic: "Arithmetic",
    subtopic: "Percentage",
    representation: "DIRECT_MCQ",
  },
  {
    observationId: "T-SUPPORT-002",
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "PRACTICE_TAXONOMY",
    sourceRef: "fixture://practice/algebra",
    sourceLabel: "Synthetic practice taxonomy support fixture",
    topic: "Advanced Mathematics",
    subtopic: "Algebra",
    representation: "DATA_SUFFICIENCY",
  },
];

const profile = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations,
  policy: {
    minDistinctPapers: 2,
    minCountableQuestions: 6,
    minTopicCoverage: 2,
    requireDatedPaperIdentity: true,
  },
});

assert.equal(profile.status, "EMPIRICAL_WEIGHT_CANDIDATE");
assert.equal(profile.countableQuestionCount, 6);
assert.equal(profile.supportingNonCountableEvidenceCount, 2);
assert.equal(profile.distinctPaperCount, 2);
assert.equal(profile.topicCoverageCount, 2);
assert.deepEqual(profile.blockers, []);
assert.equal(profile.topicWeights.find((entry) => entry.key === "ARITHMETIC")?.count, 2);
assert.equal(profile.topicWeights.find((entry) => entry.key === "ADVANCED_MATHEMATICS")?.count, 4);
assert.equal(profile.representationWeights.find((entry) => entry.key === "DATA_SUFFICIENCY"), undefined,
  "Practice taxonomy must not leak into empirical representation weights.");
assertFrequencyShares(profile);
assert.equal(canReplaceProvisionalSimulationWeights(profile), true);

const insufficient = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: observations.slice(0, 3),
  policy: {
    minDistinctPapers: 2,
    minCountableQuestions: 6,
    minTopicCoverage: 2,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(insufficient.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(insufficient.blockers.includes("COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY"));
assert.ok(insufficient.blockers.includes("DISTINCT_PAPER_SAMPLE_BELOW_POLICY"));
assert.equal(canReplaceProvisionalSimulationWeights(insufficient), false);

const noCountable = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: observations.filter((entry) => !isCountablePyqEvidenceKind(entry.evidenceKind)),
  policy: {
    minDistinctPapers: 1,
    minCountableQuestions: 1,
    minTopicCoverage: 1,
    requireDatedPaperIdentity: false,
  },
});
assert.equal(noCountable.status, "NO_COUNTABLE_EVIDENCE");
assert.equal(noCountable.countableQuestionCount, 0);
assert.equal(noCountable.topicWeights.length, 0);
assert.equal(canReplaceProvisionalSimulationWeights(noCountable), false);

assert.throws(() => validatePyqObservation({
  observationId: "BAD-COUNTABLE",
  examId: "SSC_CGL_TIER_I",
  evidenceKind: "DIRECT_PYQ",
  sourceRef: "fixture://bad",
  sourceLabel: "Bad countable fixture",
  topic: "Arithmetic",
  subtopic: "Percentage",
  representation: "DIRECT_MCQ",
} as QuantV4PyqObservation), /requires paperId/u);

console.log("PASS_QUANT_V4_PYQ_FREQUENCY_EVIDENCE_P2", {
  countableQuestionCount: profile.countableQuestionCount,
  supportingNonCountableEvidenceCount: profile.supportingNonCountableEvidenceCount,
  distinctPaperCount: profile.distinctPaperCount,
  topicWeights: profile.topicWeights,
  provisionalReplacementAllowed: canReplaceProvisionalSimulationWeights(profile),
});
