import assert from "node:assert/strict";

import {
  calibrateEmpiricalDifficulty,
  validateEmpiricalDifficultyPolicy,
  type EmpiricalDifficultyObservation,
  type EmpiricalDifficultyPolicy,
} from "./quant-v4-empirical-difficulty-calibration-p2";

const POLICY: EmpiricalDifficultyPolicy = {
  policyId: "SYNTHETIC-CI-PROOF-ONLY",
  examProfile: "SSC_CGL_TIER_I",
  minimumAttempts: 120,
  minimumUniqueLearners: 120,
  minimumTimedResponseRate: 0.9,
  minimumQuestionSeconds: 3,
  maximumQuestionSeconds: 300,
  easyAccuracyFloor: 0.75,
  hardAccuracyCeiling: 0.35,
  easyTimeRatioCeiling: 0.85,
  hardTimeRatioFloor: 1.2,
  minimumAbilityObservationsForDiscrimination: 100,
  minimumAcceptableDiscrimination: -0.05,
};

function makeObservations(
  questionVersionId: string,
  correctFromIndex: number,
  timeSeconds: number,
  count = 200,
): EmpiricalDifficultyObservation[] {
  return Array.from({ length: count }, (_, index) => ({
    questionVersionId,
    learnerId: `learner-${String(index + 1).padStart(3, "0")}`,
    attemptId: `attempt-${questionVersionId}-${String(index + 1).padStart(3, "0")}`,
    examProfile: "SSC_CGL_TIER_I",
    attemptType: "REAL" as const,
    isCorrect: index >= correctFromIndex,
    timeSpentSeconds: timeSeconds + (index % 3) - 1,
    attemptedAt: new Date(Date.UTC(2026, 0, 1, 0, index % 60, 0)).toISOString(),
    attemptScorePercent: Math.min(100, Math.max(0, 20 + index * 0.4)),
  }));
}

validateEmpiricalDifficultyPolicy(POLICY);

const easy = calibrateEmpiricalDifficulty({
  questionVersionId: "easy-q",
  currentDifficulty: "Medium",
  observations: makeObservations("easy-q", 20, 42),
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(easy.state, "EMPIRICAL_DIFFICULTY_CANDIDATE");
assert.equal(easy.suggestedDifficulty, "Easy");
assert.equal(easy.labelChanged, true);
assert.equal(easy.eligibleAttempts, 200);
assert.ok((easy.accuracyConfidence95?.lower ?? 0) >= POLICY.easyAccuracyFloor);
assert.ok((easy.timeRatio ?? 9) <= POLICY.easyTimeRatioCeiling);

const medium = calibrateEmpiricalDifficulty({
  questionVersionId: "medium-q",
  currentDifficulty: "Medium",
  observations: makeObservations("medium-q", 90, 60),
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(medium.state, "EMPIRICAL_DIFFICULTY_CANDIDATE");
assert.equal(medium.suggestedDifficulty, "Medium");
assert.equal(medium.labelChanged, false);
assert.ok((medium.accuracyConfidence95?.lower ?? 0) > POLICY.hardAccuracyCeiling);
assert.ok((medium.accuracyConfidence95?.upper ?? 1) < POLICY.easyAccuracyFloor);

const hard = calibrateEmpiricalDifficulty({
  questionVersionId: "hard-q",
  currentDifficulty: "Easy",
  observations: makeObservations("hard-q", 160, 84),
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(hard.state, "EMPIRICAL_DIFFICULTY_CANDIDATE");
assert.equal(hard.suggestedDifficulty, "Hard");
assert.equal(hard.labelChanged, true);
assert.ok((hard.accuracyConfidence95?.upper ?? 1) <= POLICY.hardAccuracyCeiling);
assert.ok((hard.timeRatio ?? 0) >= POLICY.hardTimeRatioFloor);

const sparse = calibrateEmpiricalDifficulty({
  questionVersionId: "sparse-q",
  currentDifficulty: "Medium",
  observations: makeObservations("sparse-q", 5, 60, 20),
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(sparse.state, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.equal(sparse.suggestedDifficulty, null);
assert.ok(sparse.blockers.includes("INSUFFICIENT_REAL_ATTEMPTS"));
assert.ok(sparse.blockers.includes("INSUFFICIENT_UNIQUE_LEARNERS"));

const ambiguous = calibrateEmpiricalDifficulty({
  questionVersionId: "ambiguous-q",
  currentDifficulty: "Medium",
  observations: makeObservations("ambiguous-q", 20, 78),
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(ambiguous.state, "AMBIGUOUS_EMPIRICAL_SIGNAL");
assert.equal(ambiguous.suggestedDifficulty, null);
assert.ok(ambiguous.blockers.includes("AMBIGUOUS_ACCURACY_TIME_SIGNAL"));

const mixed = makeObservations("dedupe-q", 90, 60);
mixed.push({
  ...mixed[150],
  attemptId: "later-repeat",
  attemptedAt: "2026-03-01T00:00:00.000Z",
  isCorrect: false,
});
mixed.push({
  ...mixed[151],
  attemptId: "practice-repeat",
  attemptType: "PRACTICE",
  attemptedAt: "2026-03-02T00:00:00.000Z",
});
const deduped = calibrateEmpiricalDifficulty({
  questionVersionId: "dedupe-q",
  currentDifficulty: "Medium",
  observations: mixed,
  profileMedianTimeSeconds: 60,
  policy: POLICY,
});
assert.equal(deduped.eligibleAttempts, 200);
assert.equal(deduped.duplicateLearnerObservationsRemoved, 1);
assert.equal(deduped.excludedPracticeAttempts, 1);
assert.ok(deduped.diagnostics.includes("REPEAT_LEARNER_OBSERVATIONS_DEDUPED"));
assert.ok(deduped.diagnostics.includes("PRACTICE_ATTEMPTS_EXCLUDED"));

const noTimeBaseline = calibrateEmpiricalDifficulty({
  questionVersionId: "baseline-q",
  currentDifficulty: "Medium",
  observations: makeObservations("baseline-q", 90, 60),
  profileMedianTimeSeconds: null,
  policy: POLICY,
});
assert.equal(noTimeBaseline.state, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.ok(noTimeBaseline.blockers.includes("PROFILE_TIME_BASELINE_MISSING"));

assert.throws(() => validateEmpiricalDifficultyPolicy({
  ...POLICY,
  hardAccuracyCeiling: 0.8,
  easyAccuracyFloor: 0.7,
}), /hardAccuracyCeiling/);

console.log("PASS_QUANT_V4_EMPIRICAL_DIFFICULTY_CALIBRATION_P2", {
  syntheticProofOnly: true,
  candidateLabels: [easy.suggestedDifficulty, medium.suggestedDifficulty, hard.suggestedDifficulty],
  sparseState: sparse.state,
  ambiguousState: ambiguous.state,
  realProductionThresholdsPublished: false,
  automaticDifficultyMutationEnabled: false,
});
