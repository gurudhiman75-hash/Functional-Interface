import assert from "node:assert/strict";

import { resolveQuantV4CatalogExamProfile } from "./quant-v4-catalog-profile-resolver-p3";
import {
  bridgeQuantV4EmpiricalDifficultyTelemetry,
  type QuantV4DifficultyTelemetryRow,
} from "./quant-v4-empirical-difficulty-telemetry-bridge-p3";

const row: QuantV4DifficultyTelemetryRow = {
  attemptId: "attempt-1",
  learnerId: "learner-1",
  attemptStatus: "evaluated",
  evaluatedAt: "2026-09-01T10:00:00.000Z",
  resultSnapshot: { attemptType: "REAL" },
  finalScore: 81,
  questionVersionId: "question-version-1",
  isCorrect: true,
  timeSpentSeconds: 41,
  answeredAt: "2026-09-01T09:59:41.000Z",
  publicationId: "publication-1",
  testId: "test-1",
  testVersionId: "test-version-1",
  testPublicCode: "CGL-MOCK-1",
  testTitle: "Any title is allowed because mapping is code-based",
  examCode: "SSC_CGL_T1",
  examName: "SSC CGL Tier 1",
  examFamilyCode: "SSC",
  examFamilyName: "SSC",
};

const bridged = bridgeQuantV4EmpiricalDifficultyTelemetry({
  rows: [row],
  resolveExamProfile: resolveQuantV4CatalogExamProfile,
});

assert.equal(bridged.invalidRows, 0);
assert.equal(bridged.unresolvedProfileRows, 0);
assert.equal(bridged.observations.length, 1);
assert.equal(bridged.observations[0].examProfile, "SSC_CGL_TIER_I");
assert.equal(bridged.observations[0].attemptType, "REAL");
assert.equal(bridged.observations[0].questionVersionId, "question-version-1");

const unresolved = bridgeQuantV4EmpiricalDifficultyTelemetry({
  rows: [{ ...row, examCode: "SSC_MTS", examName: "SSC MTS" }],
  resolveExamProfile: resolveQuantV4CatalogExamProfile,
});

assert.equal(unresolved.observations.length, 0);
assert.equal(unresolved.unresolvedProfileRows, 1);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CATALOG_PROFILE_TELEMETRY_INTEGRATION_P3",
  resolvedProfile: bridged.observations[0].examProfile,
  unknownProfileFailsClosed: true,
}));
