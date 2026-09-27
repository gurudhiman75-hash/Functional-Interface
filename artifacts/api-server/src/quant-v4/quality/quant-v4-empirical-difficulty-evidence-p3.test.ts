import assert from "node:assert/strict";

import {
  validatePyqObservation,
  type QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

const base: QuantV4PyqObservation = {
  observationId: "SYNTHETIC-DIFFICULTY-001",
  examId: "SSC_CGL_TIER_I",
  evidenceKind: "DIRECT_PYQ",
  sourceRef: "synthetic://paper/q1",
  sourceLabel: "Synthetic validation fixture",
  heldDate: "2024-01-01",
  shift: "Shift 1",
  paperId: "SYNTHETIC-PAPER-1",
  questionRef: "Q1",
  packageId: "MAL-001",
  topic: "Arithmetic — Mixture and Alligation",
  subtopic: "MAL-CP-001 — Synthetic target-mean blend",
  representation: "SYNTHETIC_BLEND_MCQ",
};

assert.doesNotThrow(() => validatePyqObservation({
  ...base,
  empiricalDifficulty: "MEDIUM",
  empiricalDifficultyBasis: "SOURCE_LABEL",
  difficultyEvidenceRef: "synthetic://paper/q1#difficulty-medium",
}));

assert.doesNotThrow(() => validatePyqObservation({
  ...base,
  observationId: "SYNTHETIC-DIFFICULTY-002",
  questionRef: "Q2",
  empiricalDifficulty: "HARD",
  empiricalDifficultyBasis: "RATIFIED_RUBRIC",
  difficultyEvidenceRef: "synthetic://rubric/v1#q2",
}));

assert.throws(
  () => validatePyqObservation({
    ...base,
    observationId: "SYNTHETIC-DIFFICULTY-INCOMPLETE-1",
    questionRef: "Q3",
    empiricalDifficulty: "EASY",
  }),
  /requires empiricalDifficulty, empiricalDifficultyBasis and difficultyEvidenceRef together/u,
);

assert.throws(
  () => validatePyqObservation({
    ...base,
    observationId: "SYNTHETIC-DIFFICULTY-INCOMPLETE-2",
    questionRef: "Q4",
    empiricalDifficultyBasis: "SOURCE_LABEL",
    difficultyEvidenceRef: "synthetic://paper/q4#difficulty",
  }),
  /requires empiricalDifficulty, empiricalDifficultyBasis and difficultyEvidenceRef together/u,
);

for (const packageId of ["AVG-001", "MAL-001", "NUM-001", "TMW-001"] as const) {
  const readiness = buildQuantV4SpecializedCalibrationReadiness({
    packageId,
    examProfile: "SSC_CGL_TIER_I",
  });
  assert.ok(readiness.countableObservationCount > 0);
  assert.equal(readiness.difficultyMappedObservationCount, 0);
  assert.equal(readiness.difficultyMappingCompleteness, 0);
  assert.equal(readiness.difficultyEvidenceAvailable, false);
  assert.ok(readiness.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EMPIRICAL_DIFFICULTY_EVIDENCE_P3",
  provenanceRule: "BAND_BASIS_REFERENCE_REQUIRED_TOGETHER",
  currentSpecializedCglDifficultyCoverage: {
    "AVG-001": 0,
    "MAL-001": 0,
    "NUM-001": 0,
    "TMW-001": 0,
  },
}));
