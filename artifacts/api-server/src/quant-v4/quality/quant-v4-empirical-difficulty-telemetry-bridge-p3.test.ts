import assert from "node:assert/strict";

import {
  QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY,
  QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL,
  bridgeQuantV4EmpiricalDifficultyTelemetry,
  type QuantV4DifficultyTelemetryRow,
} from "./quant-v4-empirical-difficulty-telemetry-bridge-p3";

const base: QuantV4DifficultyTelemetryRow = {
  attemptId: "attempt-1",
  learnerId: "learner-1",
  attemptStatus: "evaluated",
  evaluatedAt: "2026-09-01T10:00:00.000Z",
  resultSnapshot: { attemptType: "REAL" },
  finalScore: 72,
  questionVersionId: "question-version-1",
  isCorrect: true,
  timeSpentSeconds: 48,
  answeredAt: "2026-09-01T09:59:48.000Z",
  publicationId: "publication-1",
  testId: "test-1",
  testVersionId: "test-version-1",
  testPublicCode: "SSC-CGL-MOCK-1",
  testTitle: "SSC CGL Tier I Mock 1",
  examCode: "SSC-CGL-T1",
  examName: "SSC CGL Tier I",
  examFamilyCode: "SSC",
  examFamilyName: "Staff Selection Commission",
};

for (const fragment of [
  "FROM learning.attempt_responses ar",
  "JOIN learning.attempts a ON a.id = ar.attempt_id",
  "JOIN assessment.test_publications p ON p.id = a.test_publication_id",
  "JOIN assessment.tests t ON t.id = p.test_id",
  "JOIN assessment.test_versions tv ON tv.id = p.test_version_id",
  "JOIN catalog.exam_versions exam_version ON exam_version.id = t.exam_version_id",
  "JOIN catalog.exams exam ON exam.id = exam_version.exam_id",
  "JOIN catalog.exam_families family ON family.id = exam.family_id",
  "a.status::text IN ('evaluated', 'practice_evaluated')",
]) {
  assert.ok(QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL.includes(fragment), `Missing SQL bridge fragment: ${fragment}`);
}

const rows: QuantV4DifficultyTelemetryRow[] = [
  base,
  {
    ...base,
    attemptId: "attempt-2",
    learnerId: "learner-2",
    attemptStatus: "practice_evaluated",
    resultSnapshot: { attemptType: "PRACTICE" },
    questionVersionId: "question-version-1",
    isCorrect: false,
    timeSpentSeconds: "75",
    finalScore: "44",
  },
  {
    ...base,
    attemptId: "attempt-3",
    learnerId: "learner-3",
    testPublicCode: "UNKNOWN-PROFILE",
    examCode: "UNKNOWN",
  },
  {
    ...base,
    attemptId: "",
    learnerId: "learner-4",
  },
];

const bridged = bridgeQuantV4EmpiricalDifficultyTelemetry({
  rows,
  resolveExamProfile: (identity) => {
    if (identity.examCode === "SSC-CGL-T1") {
      return { examProfile: "SSC_CGL_TIER_I", authority: "SYNTHETIC-CATALOG-MAP-V1" };
    }
    return { examProfile: null, authority: "SYNTHETIC-CATALOG-MAP-V1" };
  },
});

assert.equal(bridged.authority, QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY);
assert.equal(bridged.observations.length, 2);
assert.equal(bridged.realRows, 1);
assert.equal(bridged.practiceRows, 1);
assert.equal(bridged.unresolvedProfileRows, 1);
assert.equal(bridged.invalidRows, 1);
assert.deepEqual(bridged.profileResolutionAuthorities, ["SYNTHETIC-CATALOG-MAP-V1"]);

const real = bridged.observations[0];
assert.equal(real.questionVersionId, "question-version-1");
assert.equal(real.learnerId, "learner-1");
assert.equal(real.attemptId, "attempt-1");
assert.equal(real.examProfile, "SSC_CGL_TIER_I");
assert.equal(real.attemptType, "REAL");
assert.equal(real.isCorrect, true);
assert.equal(real.timeSpentSeconds, 48);
assert.equal(real.attemptScorePercent, 72);
assert.equal(real.attemptedAt, "2026-09-01T10:00:00.000Z");

const practice = bridged.observations[1];
assert.equal(practice.attemptType, "PRACTICE");
assert.equal(practice.timeSpentSeconds, 75);
assert.equal(practice.attemptScorePercent, 44);

const fallbackType = bridgeQuantV4EmpiricalDifficultyTelemetry({
  rows: [{
    ...base,
    attemptId: "attempt-5",
    resultSnapshot: {},
    attemptStatus: "practice_evaluated",
  }],
  resolveExamProfile: () => ({ examProfile: "SSC_CGL_TIER_I", authority: "SYNTHETIC-CATALOG-MAP-V1" }),
});
assert.equal(fallbackType.observations[0].attemptType, "PRACTICE");

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_P3",
  authority: QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY,
  rowsInput: rows.length,
  rowsBridged: bridged.observations.length,
  unresolvedProfileRows: bridged.unresolvedProfileRows,
  invalidRows: bridged.invalidRows,
  productionProfileResolverAdopted: false,
}));
