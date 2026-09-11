import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const profile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});

assert.equal(
  QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-CALIBRATION-P2",
);
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 3);
assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 133);
assert.equal(profile.totalCountableQuestionCount, 100);
assert.equal(profile.completeSectionCount, 3);
assert.equal(profile.completeQuestionCount, 75);
assert.equal(profile.nonWholeSectionCountableQuestionCount, 25);
assert.equal(profile.undatedCountableQuestionCount, 10);
assert.equal(profile.distinctSectionYearCount, 3);
assert.equal(profile.packageCoverageCount, 20);
assert.equal(profile.evidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...profile.blockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(profile), false);
assert.ok(profile.sectionSnapshots.every((section) => section.complete));
assert.deepEqual(
  profile.sectionSnapshots.map((section) => [section.paperId, section.questionCount]),
  [
    ["SSC-CGL-2024-TIER-I-2024-09-09-S1", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-27-S2", 25],
    ["SSC-CGL-2022-TIER-I-2022-12-01-S1", 25],
  ],
);

const packageCounts = Object.fromEntries(
  [...profile.packageWeights]
    .map((bucket) => [bucket.packageId, bucket.questionCount] as const)
    .sort(([left], [right]) => left.localeCompare(right)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 7,
  "ALG-002": 2,
  "AVG-001": 2,
  "DI-001": 7,
  "DI-003": 2,
  "DI-005": 1,
  "GEO-001": 4,
  "GEO-002": 6,
  "INT-001": 3,
  "MEN-001": 1,
  "MEN-002": 4,
  "NUM-001": 4,
  "PCT-002": 2,
  "PNL-001": 6,
  "RAP-001": 2,
  "RAP-003": 1,
  SAP: 2,
  "TMW-001": 7,
  "TRG-001": 8,
  "TSD-001": 4,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 75);
assert.equal(profile.packageWeights[0]?.packageId, "TRG-001");
assert.equal(profile.packageWeights[0]?.questionCount, 8);
assert.equal(profile.packageWeights[0]?.questionShare, 8 / 75);
assert.equal(profile.packageWeights[0]?.meanQuestionsPerSection, 8 / 3);
assert.equal(profile.packageWeights[0]?.sectionPresenceCount, 3);
assert.equal(profile.packageWeights[0]?.sectionPresenceShare, 1);
assert.ok(Math.abs(profile.packageWeights.reduce((sum, bucket) => sum + bucket.questionShare, 0) - 1) < 1e-12);
assert.ok(Math.abs(profile.topicWeights.reduce((sum, bucket) => sum + bucket.questionShare, 0) - 1) < 1e-12);

// Isolated PYQs may remain useful for CP/QL evidence, but must not affect whole-section weights.
const isolatedOnlyObservation: QuantV4PyqObservation = Object.freeze({
  observationId: "WHOLE-SECTION-GATE-SYNTHETIC-ISOLATED-001",
  examId: "SSC_CGL_TIER_I",
  evidenceKind: "DIRECT_PYQ",
  sourceRef: "repo://whole-section-gate-test#isolated",
  sourceLabel: "Synthetic isolated observation used only to prove frequency contamination resistance",
  heldDate: "2021-01-01",
  shift: "Shift 1",
  paperId: "SYNTHETIC-ISOLATED-PAPER",
  questionRef: "SYNTHETIC-Q1",
  packageId: "ISOLATED-ONLY",
  topic: "Synthetic isolated topic",
  subtopic: "Synthetic isolated subtopic",
  representation: "SYNTHETIC_MCQ",
  language: "en",
});
const contaminated = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: [...QUANT_V4_REGISTERED_PYQ_OBSERVATIONS, isolatedOnlyObservation],
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(contaminated.totalCountableQuestionCount, 101);
assert.equal(contaminated.completeQuestionCount, 75);
assert.equal(contaminated.nonWholeSectionCountableQuestionCount, 26);
assert.equal(contaminated.packageCoverageCount, 20);
assert.equal(contaminated.packageWeights.some((bucket) => bucket.packageId === "ISOLATED-ONLY"), false);
assert.deepEqual(
  contaminated.packageWeights.map((bucket) => [bucket.packageId, bucket.questionCount]),
  profile.packageWeights.map((bucket) => [bucket.packageId, bucket.questionCount]),
);

// A declared complete section must be exact. One missing question removes the whole section from calibration.
const without2024Q75 = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter(
  (observation) => !(
    observation.paperId === "SSC-CGL-2024-TIER-I-2024-09-09-S1" &&
    observation.questionRef?.endsWith("Q75")
  ),
);
const incomplete = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: without2024Q75,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(incomplete.completeSectionCount, 2);
assert.equal(incomplete.completeQuestionCount, 50);
assert.ok(incomplete.blockers.includes("DECLARED_COMPLETE_SECTION_INCOMPLETE"));
assert.ok(incomplete.blockers.includes("COMPLETE_SECTION_SAMPLE_BELOW_POLICY"));
assert.ok(incomplete.blockers.includes("DISTINCT_SECTION_YEAR_SAMPLE_BELOW_POLICY"));

// Evidence candidacy and production authorization are separate gates.
const candidatePolicy = Object.freeze({
  ...QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  minCompleteSections: 3,
});
const candidate = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: candidatePolicy,
});
assert.equal(candidate.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...candidate.blockers], []);
assert.equal(candidate.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(candidate), false);

const explicitlyAuthorized = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: Object.freeze({ ...candidatePolicy, productionPromotionAuthorized: true }),
});
assert.equal(explicitlyAuthorized.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.equal(canPromoteWholeSectionFrequencyWeights(explicitlyAuthorized), true);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_P2",
  authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
  registryObservations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: profile.totalCountableQuestionCount,
  completeSections: profile.completeSectionCount,
  completeSectionQuestions: profile.completeQuestionCount,
  isolatedCountableQuestions: profile.nonWholeSectionCountableQuestionCount,
  undatedCountableQuestions: profile.undatedCountableQuestionCount,
  sectionYears: profile.distinctSectionYearCount,
  packageCoverage: profile.packageCoverageCount,
  blockers: profile.blockers,
  productionPromotionAuthorized: profile.productionPromotionAuthorized,
}));
