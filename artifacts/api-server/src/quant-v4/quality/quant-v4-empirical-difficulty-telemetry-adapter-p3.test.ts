import assert from "node:assert/strict";

import {
  calibrateEmpiricalDifficulty,
  type EmpiricalDifficultyPolicy,
} from "./quant-v4-empirical-difficulty-calibration-p2";
import {
  QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_AUTHORITY,
  QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL,
  extractQuantV4EmpiricalDifficultyObservations,
  quantV4EmpiricalDifficultyTelemetrySqlParams,
} from "./quant-v4-empirical-difficulty-telemetry-adapter-p3";

assert.equal(
  QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_AUTHORITY,
  "QUANT-V4-EMPIRICAL-DIFFICULTY-TELEMETRY-ADAPTER-P3",
);

for (const fragment of [
  "FROM learning.attempt_responses response",
  "JOIN learning.attempts attempt",
  "response.question_version_id",
  "attempt.user_id",
  "attempt.result_snapshot ->> 'attemptType'",
  "response.is_correct",
  "response.time_spent_seconds",
  "attempt.final_score",
  "JOIN catalog.exams exam",
  "exam.code = ANY($2::text[])",
]) {
  assert.ok(QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL.includes(fragment), `SQL contract lost ${fragment}`);
}

const query = {
  questionVersionId: "11111111-1111-4111-8111-111111111111",
  examProfile: "SSC_CGL_TIER_I",
  catalogExamCodes: ["SSC_CGL"],
  lookbackDays: 730,
} as const;

assert.deepEqual(quantV4EmpiricalDifficultyTelemetrySqlParams(query), [
  "11111111-1111-4111-8111-111111111111",
  ["SSC_CGL"],
  730,
]);

const rows = [
  {
    questionVersionId: query.questionVersionId,
    learnerId: "learner-a",
    attemptId: "attempt-a",
    attemptStatus: "evaluated",
    attemptType: "REAL",
    isCorrect: true,
    timeSpentSeconds: 42,
    evaluatedAt: "2026-09-01T10:00:00.000Z",
    attemptScorePercent: 82,
    examCode: "SSC_CGL",
  },
  {
    questionVersionId: query.questionVersionId,
    learnerId: "learner-b",
    attemptId: "attempt-b",
    attemptStatus: "practice_evaluated",
    attemptType: "PRACTICE",
    isCorrect: false,
    timeSpentSeconds: "67",
    evaluatedAt: "2026-09-02T10:00:00.000Z",
    attemptScorePercent: "54",
    examCode: "SSC_CGL",
  },
  {
    questionVersionId: query.questionVersionId,
    learnerId: "learner-c",
    attemptId: "attempt-c",
    attemptStatus: "evaluated",
    attemptType: null,
    isCorrect: null,
    timeSpentSeconds: -4,
    evaluatedAt: new Date("2026-09-03T10:00:00.000Z"),
    attemptScorePercent: 60,
    examCode: "SSC_CGL",
  },
  {
    questionVersionId: "22222222-2222-4222-8222-222222222222",
    learnerId: "wrong-question",
    attemptId: "wrong-question-attempt",
    attemptStatus: "evaluated",
    attemptType: "REAL",
    isCorrect: true,
    timeSpentSeconds: 40,
    evaluatedAt: "2026-09-04T10:00:00.000Z",
    attemptScorePercent: 90,
    examCode: "SSC_CGL",
  },
  {
    questionVersionId: query.questionVersionId,
    learnerId: "wrong-exam",
    attemptId: "wrong-exam-attempt",
    attemptStatus: "evaluated",
    attemptType: "REAL",
    isCorrect: true,
    timeSpentSeconds: 40,
    evaluatedAt: "2026-09-05T10:00:00.000Z",
    attemptScorePercent: 90,
    examCode: "IBPS_PO",
  },
] as const;

const extraction = extractQuantV4EmpiricalDifficultyObservations({ query, rows });
assert.equal(extraction.blockers.length, 0);
assert.equal(extraction.observations.length, 3);
assert.equal(extraction.droppedRows, 2);
assert.equal(extraction.observations[0]?.attemptType, "REAL");
assert.equal(extraction.observations[1]?.attemptType, "PRACTICE");
assert.equal(extraction.observations[2]?.attemptType, "REAL");
assert.equal(extraction.observations[2]?.isCorrect, null);
assert.equal(extraction.observations[2]?.timeSpentSeconds, null);
assert.ok(extraction.observations.every((row) => row.examProfile === "SSC_CGL_TIER_I"));

const empty = extractQuantV4EmpiricalDifficultyObservations({
  query,
  rows: [],
});
assert.deepEqual(empty.blockers, ["NO_MATCHING_CANONICAL_TELEMETRY"]);

assert.throws(
  () => quantV4EmpiricalDifficultyTelemetrySqlParams({
    ...query,
    catalogExamCodes: [],
  }),
  /at least one explicit catalog exam code/u,
);
assert.throws(
  () => quantV4EmpiricalDifficultyTelemetrySqlParams({
    ...query,
    examProfile: "",
  }),
  /explicit Quant examProfile/u,
);

const policy: EmpiricalDifficultyPolicy = {
  policyId: "SYNTHETIC-ADAPTER-HANDOFF",
  examProfile: "SSC_CGL_TIER_I",
  minimumAttempts: 1,
  minimumUniqueLearners: 1,
  minimumTimedResponseRate: 0,
  minimumQuestionSeconds: 1,
  maximumQuestionSeconds: 300,
  easyAccuracyFloor: 0.8,
  hardAccuracyCeiling: 0.2,
  easyTimeRatioCeiling: 0.9,
  hardTimeRatioFloor: 1.1,
  minimumAbilityObservationsForDiscrimination: 100,
  minimumAcceptableDiscrimination: -0.1,
};

const calibration = calibrateEmpiricalDifficulty({
  questionVersionId: query.questionVersionId,
  currentDifficulty: "Medium",
  observations: extraction.observations,
  profileMedianTimeSeconds: 60,
  policy,
});

// Only the REAL rows are calibration-eligible; the adapter deliberately keeps
// PRACTICE rows so the P2 calibration authority remains the single exclusion rule.
assert.equal(calibration.excludedPracticeAttempts, 1);
assert.equal(calibration.eligibleAttempts, 2);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_P3",
  extractedRows: extraction.observations.length,
  droppedRows: extraction.droppedRows,
  realEligibleAttempts: calibration.eligibleAttempts,
  practiceExcludedByCalibration: calibration.excludedPracticeAttempts,
  profileInferenceUsed: false,
}));
