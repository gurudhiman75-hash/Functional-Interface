import assert from "node:assert/strict";
import test from "node:test";

import { assertSeriesTestAccess, evaluateStudentSeriesEligibility } from "./student-test-series";

const now = "2026-07-20T12:00:00.000Z";
const members = [
  { id: "m1", testId: "t1", sortOrder: 1, unlockAt: null, minimumScore: null, isRequired: true, testStatus: "live" },
  { id: "m2", testId: "t2", sortOrder: 2, unlockAt: null, minimumScore: 60, isRequired: true, testStatus: "live" },
  { id: "m3", testId: "t3", sortOrder: 3, unlockAt: null, minimumScore: null, isRequired: false, testStatus: "live" },
  { id: "m4", testId: "t4", sortOrder: 4, unlockAt: null, minimumScore: null, isRequired: true, testStatus: "live" },
];

test("open mode unlocks every released live member", () => {
  const result = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "open",
    completionThreshold: null,
    members,
    attempts: [],
  });
  assert.equal(result.available, true);
  assert.deepEqual(result.members.map((member) => member.unlocked), [true, true, true, true]);
  assert.equal(result.nextTestId, "t1");
});

test("sequential mode unlocks only after the previous required test is completed", () => {
  const locked = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "sequential",
    completionThreshold: null,
    members,
    attempts: [],
  });
  assert.deepEqual(locked.members.map((member) => member.unlocked), [true, false, false, false]);

  const progressed = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "sequential",
    completionThreshold: null,
    members,
    attempts: [{ testId: "t1", attemptCount: 1, bestScore: 20, lastAttemptAt: now }],
  });
  assert.deepEqual(progressed.members.map((member) => member.unlocked), [true, true, false, false]);
});

test("score-gated mode uses the previous required member threshold", () => {
  const lowScore = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "score_gated",
    completionThreshold: 40,
    members,
    attempts: [
      { testId: "t1", attemptCount: 1, bestScore: 39, lastAttemptAt: now },
      { testId: "t2", attemptCount: 1, bestScore: 55, lastAttemptAt: now },
    ],
  });
  assert.equal(lowScore.members[1]?.lockCode, "PREVIOUS_SCORE_TOO_LOW");

  const passed = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "score_gated",
    completionThreshold: 40,
    members,
    attempts: [
      { testId: "t1", attemptCount: 2, bestScore: 72, lastAttemptAt: now },
      { testId: "t2", attemptCount: 1, bestScore: 60, lastAttemptAt: now },
    ],
  });
  assert.equal(passed.members[1]?.unlocked, true);
  assert.equal(passed.members[2]?.unlocked, true);
  assert.equal(passed.members[3]?.unlocked, true);
});

test("future member release and ended series remain locked", () => {
  const future = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "open",
    completionThreshold: null,
    members: [{ ...members[0]!, unlockAt: "2026-07-21T12:00:00.000Z" }],
    attempts: [],
  });
  assert.equal(future.members[0]?.lockCode, "TEST_NOT_RELEASED");

  const ended = evaluateStudentSeriesEligibility({
    now,
    availabilityEndAt: "2026-07-20T11:59:59.000Z",
    progressionMode: "open",
    completionThreshold: null,
    members,
    attempts: [],
  });
  assert.equal(ended.available, false);
  assert.equal(ended.members[0]?.lockCode, "SERIES_ENDED");
});

test("a closed or unpublished test cannot be opened from the series", () => {
  const result = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "open",
    completionThreshold: null,
    members: [{ ...members[0]!, testStatus: "unavailable" }],
    attempts: [],
  });
  assert.equal(result.members[0]?.unlocked, false);
  assert.equal(result.members[0]?.lockCode, "TEST_NOT_LIVE");
});

test("progress and access use evaluated attempts while optional tests remain non-blocking", () => {
  const result = evaluateStudentSeriesEligibility({
    now,
    progressionMode: "sequential",
    completionThreshold: null,
    members,
    attempts: [
      { testId: "t1", attemptCount: 2, bestScore: 80, lastAttemptAt: now },
      { testId: "t2", attemptCount: 1, bestScore: 50, lastAttemptAt: now },
    ],
  });
  assert.equal(result.completedRequiredCount, 2);
  assert.equal(result.requiredCount, 3);
  assert.equal(result.progressPercent, 67);
  assert.equal(assertSeriesTestAccess(result, "t3").testId, "t3");
  assert.equal(assertSeriesTestAccess(result, "t4").testId, "t4");
});
