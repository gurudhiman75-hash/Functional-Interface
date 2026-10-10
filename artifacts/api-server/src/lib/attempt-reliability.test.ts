import assert from "node:assert/strict";
import test from "node:test";

import {
  AttemptReliabilityError,
  attemptSessionLifecycleError,
  advanceAttemptSessionSnapshot,
  createAttemptSessionSnapshot,
  normalizeAttemptDraftState,
  readAttemptSessionSnapshot,
  resolveAttemptLimit,
} from "./attempt-reliability";

const testId = "11111111-1111-4111-8111-111111111111";
const versionId = "22222222-2222-4222-8222-222222222222";

function state(updatedAt = 1000) {
  return {
    testId,
    testName: "SSC Mock 1",
    category: "SSC",
    currentSectionIndex: 1,
    currentQuestionIndex: 4,
    answers: { 101: 2, 102: null },
    flags: { 101: true },
    timeLeft: 1234,
    sectionTimeLeftByName: { Quant: 600 },
    updatedAt,
    attemptType: "REAL",
    lockedSections: [0, 0],
    sectionCompletionTimes: { English: 420 },
    visitedQuestionIds: [101, 102, 101],
    questionTimeSecondsById: { 101: 37, 102: 12 },
  };
}

test("attempt limit resolves from canonical settings with a safe fallback", () => {
  assert.equal(resolveAttemptLimit({ maxAttempts: 3 }), 3);
  assert.equal(resolveAttemptLimit({ max_attempts: 5 }), 5);
  assert.equal(resolveAttemptLimit({ maxAttempts: 0 }), 99);
  assert.equal(resolveAttemptLimit({ maxAttempts: 4000 }), 999);
  assert.equal(resolveAttemptLimit(null), 99);
});

test("new sessions begin at revision zero without draft state", () => {
  const snapshot = createAttemptSessionSnapshot({
    testId,
    testVersionId: versionId,
    seriesId: "SERIES-1",
    now: "2026-07-20T15:00:00.000Z",
  });
  assert.equal(snapshot.revision, 0);
  assert.equal(snapshot.state, null);
  assert.equal(snapshot.seriesId, "SERIES-1");
});

test("draft normalization preserves runner state and removes duplicate indexes", () => {
  const normalized = normalizeAttemptDraftState(state(), testId);
  assert.deepEqual(normalized.answers, { 101: 2, 102: null });
  assert.deepEqual(normalized.lockedSections, [0]);
  assert.deepEqual(normalized.visitedQuestionIds, [101, 102]);
  assert.deepEqual(normalized.questionTimeSecondsById, { 101: 37, 102: 12 });
  assert.equal(normalized.attemptType, "REAL");
});

test("question timing is bounded and malformed values are normalized", () => {
  const normalized = normalizeAttemptDraftState({
    ...state(),
    questionTimeSecondsById: { 101: -10, 102: 12.7, 103: 9999999 },
  }, testId);
  assert.deepEqual(normalized.questionTimeSecondsById, {
    101: 0,
    102: 13,
    103: 604800,
  });
});

test("a draft cannot be attached to another test", () => {
  assert.throws(
    () => normalizeAttemptDraftState({ ...state(), testId: versionId }, testId),
    (error) => error instanceof AttemptReliabilityError && error.code === "ATTEMPT_DRAFT_TEST_MISMATCH",
  );
});

test("revision advances exactly once for a matching writer", () => {
  const initial = createAttemptSessionSnapshot({ testId, testVersionId: versionId });
  const next = advanceAttemptSessionSnapshot({
    current: initial,
    expectedRevision: 0,
    state: state(2000),
    now: "2026-07-20T15:01:00.000Z",
  });
  assert.equal(next.revision, 1);
  assert.equal(next.state?.updatedAt, 2000);
  assert.equal(next.state?.questionTimeSecondsById["101"], 37);
});

test("stale tabs receive a deterministic conflict", () => {
  const initial = createAttemptSessionSnapshot({ testId, testVersionId: versionId });
  const current = advanceAttemptSessionSnapshot({ current: initial, expectedRevision: 0, state: state() });
  assert.throws(
    () => advanceAttemptSessionSnapshot({ current, expectedRevision: 0, state: state(3000) }),
    (error) => error instanceof AttemptReliabilityError
      && error.code === "ATTEMPT_SESSION_CONFLICT"
      && error.statusCode === 409,
  );
});

test("legacy in-progress rows receive a valid session snapshot", () => {
  const snapshot = readAttemptSessionSnapshot(null, { testId, testVersionId: versionId });
  assert.equal(snapshot.kind, "attempt_session");
  assert.equal(snapshot.testId, testId);
  assert.equal(snapshot.revision, 0);
});

test("active sessions alone may be resumed or saved", () => {
  assert.equal(attemptSessionLifecycleError("in_progress"), null);

  const submitted = attemptSessionLifecycleError("evaluated", { id: "submitted-result" });
  assert.equal(submitted?.code, "ATTEMPT_ALREADY_SUBMITTED");
  assert.equal(submitted?.statusCode, 409);
  assert.deepEqual(submitted?.details, { result: { id: "submitted-result" } });

  const practice = attemptSessionLifecycleError("practice_evaluated", { id: "practice-result" });
  assert.equal(practice?.code, "ATTEMPT_ALREADY_SUBMITTED");

  const abandoned = attemptSessionLifecycleError("abandoned", { answers: { 101: 2 } });
  assert.equal(abandoned?.code, "ATTEMPT_SESSION_NOT_ACTIVE");
  assert.equal(abandoned?.statusCode, 409);
  // Keep the archived draft in Neon, but never return it in the inactive response.
  assert.deepEqual(abandoned?.details, { status: "abandoned" });

  const cancelled = attemptSessionLifecycleError("cancelled");
  assert.equal(cancelled?.code, "ATTEMPT_SESSION_NOT_ACTIVE");
});
