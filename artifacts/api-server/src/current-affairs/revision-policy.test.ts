import assert from "node:assert/strict";

import {
  revisionStageLabel,
  transitionCurrentAffairsRevision,
} from "./revision-policy";

const now = new Date("2026-08-29T10:00:00.000Z");

const firstCorrect = transitionCurrentAffairsRevision({ mode: "quiz", result: "correct", now });
assert.equal(firstCorrect.stage, 1);
assert.equal(firstCorrect.nextReviewAt, "2026-09-01T10:00:00.000Z");

const d3Correct = transitionCurrentAffairsRevision({
  mode: "revision",
  result: "correct",
  currentStage: 1,
  now: new Date("2026-09-01T10:00:00.000Z"),
});
assert.equal(d3Correct.stage, 2);
assert.equal(d3Correct.nextReviewAt, "2026-09-05T10:00:00.000Z");

const d7Correct = transitionCurrentAffairsRevision({
  mode: "revision",
  result: "correct",
  currentStage: 2,
  now: new Date("2026-09-05T10:00:00.000Z"),
});
assert.equal(d7Correct.stage, 3);
assert.equal(d7Correct.nextReviewAt, "2026-09-13T10:00:00.000Z");

const d15Correct = transitionCurrentAffairsRevision({
  mode: "revision",
  result: "correct",
  currentStage: 3,
  now: new Date("2026-09-13T10:00:00.000Z"),
});
assert.equal(d15Correct.stage, 4);
assert.equal(d15Correct.nextReviewAt, "2026-09-28T10:00:00.000Z");

const wrong = transitionCurrentAffairsRevision({
  mode: "revision",
  result: "wrong",
  currentStage: 4,
  now,
});
assert.equal(wrong.stage, 0);
assert.equal(wrong.nextReviewAt, "2026-08-30T10:00:00.000Z");

const retakeDoesNotAdvance = transitionCurrentAffairsRevision({
  mode: "quiz",
  result: "correct",
  currentStage: 3,
  currentNextReviewAt: "2026-09-10T10:00:00.000Z",
  now,
});
assert.equal(retakeDoesNotAdvance.stage, 3);
assert.equal(retakeDoesNotAdvance.nextReviewAt, "2026-09-10T10:00:00.000Z");

assert.equal(revisionStageLabel(0), "Recovery");
assert.equal(revisionStageLabel(1), "D3");
assert.equal(revisionStageLabel(5), "D60");

process.stdout.write("Current Affairs Studio CP017 spaced-repetition policy contracts passed\n");
