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
assert.equal(QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS.length, 10);
assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 308);
assert.equal(profile.totalCountableQuestionCount, 275);
assert.equal(profile.completeSectionCount, 10);
assert.equal(profile.completeQuestionCount, 250);
assert.equal(profile.nonWholeSectionCountableQuestionCount, 25);
assert.equal(profile.undatedCountableQuestionCount, 10);
assert.equal(profile.distinctSectionYearCount, 3);
assert.equal(profile.packageCoverageCount, 26);
assert.equal(profile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.deepEqual([...profile.blockers], []);
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(profile), false);
assert.ok(profile.sectionSnapshots.every((section) => section.complete));

assert.deepEqual(
  profile.sectionSnapshots.map((section) => [section.paperId, section.questionCount]),
  [
    ["SSC-CGL-2024-TIER-I-2024-09-09-S1", 25],
    ["SSC-CGL-2024-TIER-I-2024-09-11-S1", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-27-S2", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-26-S1", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-26-S2", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-25-S1", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-25-S3", 25],
    ["SSC-CGL-2023-TIER-I-2023-07-25-S4", 25],
    ["SSC-CGL-2022-TIER-I-2022-12-01-S1", 25],
    ["SSC-CGL-2022-TIER-I-2022-12-06-S2", 25],
  ],
);

const packageCounts = Object.fromEntries(
  [...profile.packageWeights]
    .map((bucket) => [bucket.packageId, bucket.questionCount] as const)
    .sort(([left], [right]) => left.localeCompare(right)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 25,
  "ALG-002": 5,
  "AVG-001": 5,
  "DI-001": 16,
  "DI-003": 6,
  "DI-004": 1,
  "DI-005": 5,
  "GEO-001": 11,
  "GEO-002": 17,
  "INT-001": 10,
  "MAL-001": 3,
  "MEN-001": 6,
  "MEN-002": 12,
  "NUM-001": 15,
  "PCT-001": 6,
  "PCT-002": 4,
  "PCT-007": 1,
  "PNL-001": 19,
  "RAP-001": 6,
  "RAP-003": 1,
  SAP: 5,
  "SRI-002": 2,
  "TMW-001": 24,
  "TRG-001": 28,
  "TSD-001": 16,
  "TSD-002": 1,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 250);
assert.equal(profile.packageWeights[0]?.packageId, "TRG-001");
assert.equal(profile.packageWeights[0]?.questionCount, 28);
assert.equal(profile.packageWeights[0]?.questionShare, 28 / 250);
assert.equal(profile.packageWeights[0]?.meanQuestionsPerSection, 28 / 10);
assert.ok(Math.abs(profile.packageWeights.reduce((sum, bucket) => sum + bucket.questionShare, 0) - 1) < 1e-12);
assert.ok(Math.abs(profile.topicWeights.reduce((sum, bucket) => sum + bucket.questionShare, 0) - 1) < 1e-12);

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
assert.equal(contaminated.totalCountableQuestionCount, 276);
assert.equal(contaminated.completeQuestionCount, 250);
assert.equal(contaminated.nonWholeSectionCountableQuestionCount, 26);
assert.equal(contaminated.packageCoverageCount, 26);
assert.equal(contaminated.packageWeights.some((bucket) => bucket.packageId === "ISOLATED-ONLY"), false);
assert.deepEqual(
  contaminated.packageWeights.map((bucket) => [bucket.packageId, bucket.questionCount]),
  profile.packageWeights.map((bucket) => [bucket.packageId, bucket.questionCount]),
);

// Crossing and extending the evidence floor must never silently open production promotion.
assert.equal(profile.evidenceStatus, "SECTION_FREQUENCY_CANDIDATE");
assert.equal(profile.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(profile), false);

const explicitlyAuthorized = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: Object.freeze({
    ...QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
    productionPromotionAuthorized: true,
  }),
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
