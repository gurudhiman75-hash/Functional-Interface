import assert from "node:assert/strict";

import {
  buildCurrentAffairsEngagementSignals,
  currentAffairsDailyProgress,
  defaultCurrentAffairsReviewAfter,
  normalizeCurrentAffairsDailyTarget,
  normalizeCurrentAffairsPersonalizationExamFamily,
  normalizeCurrentAffairsPersonalizationLanguage,
  normalizeCurrentAffairsReviewAfter,
  normalizeCurrentAffairsSavedMode,
} from "./personalization-policy";

const now = new Date("2026-08-30T04:30:00.000Z");

assert.equal(normalizeCurrentAffairsDailyTarget(20), 20);
assert.equal(normalizeCurrentAffairsDailyTarget(4), null);
assert.equal(normalizeCurrentAffairsDailyTarget(101), null);
assert.equal(normalizeCurrentAffairsPersonalizationLanguage("HI"), "hi");
assert.equal(normalizeCurrentAffairsPersonalizationLanguage("fr"), null);
assert.equal(normalizeCurrentAffairsPersonalizationExamFamily("Punjab"), "punjab");
assert.equal(normalizeCurrentAffairsPersonalizationExamFamily("upsc"), null);
assert.equal(normalizeCurrentAffairsSavedMode("revise_later"), "revise_later");
assert.equal(normalizeCurrentAffairsSavedMode("pin"), null);

const defaultReview = defaultCurrentAffairsReviewAfter(now);
assert.equal(defaultReview.toISOString(), "2026-08-31T04:30:00.000Z");
assert.equal(normalizeCurrentAffairsReviewAfter(null, now)?.toISOString(), defaultReview.toISOString());
assert.equal(normalizeCurrentAffairsReviewAfter("not-a-date", now), null);
assert.equal(normalizeCurrentAffairsReviewAfter("2027-03-01T00:00:00.000Z", now), null);

assert.deepEqual(currentAffairsDailyProgress(7, 20), {
  studied: 7,
  target: 20,
  remaining: 13,
  complete: false,
  percent: 35,
});
assert.equal(currentAffairsDailyProgress(25, 20).complete, true);
assert.equal(currentAffairsDailyProgress(25, 20).percent, 100);

const signals = buildCurrentAffairsEngagementSignals({
  dayKey: "2026-08-30",
  revisionDue: 12,
  recoveryDue: 3,
  savedReviewDue: 2,
  questionsStudiedToday: 8,
  dailyTarget: 20,
  latestUnattemptedQuizCode: "CA-QZ-D-20260830-SSC-V1",
  revisionSignalEnabled: true,
  dailyPackSignalEnabled: true,
  studyTargetSignalEnabled: true,
});
assert.equal(signals.length, 5);
assert.equal(signals[0]?.urgency, "high");
assert.ok(signals.some((signal) => signal.type === "daily_target" && signal.count === 12));
assert.ok(signals.some((signal) => signal.type === "daily_pack" && signal.deepLink.includes("CA-QZ-D-20260830-SSC-V1")));
assert.equal(new Set(signals.map((signal) => signal.key)).size, signals.length);

const disabled = buildCurrentAffairsEngagementSignals({
  dayKey: "2026-08-30",
  revisionDue: 5,
  recoveryDue: 2,
  savedReviewDue: 0,
  questionsStudiedToday: 20,
  dailyTarget: 20,
  latestUnattemptedQuizCode: "CA-QZ-D-20260830-SSC-V1",
  revisionSignalEnabled: false,
  dailyPackSignalEnabled: false,
  studyTargetSignalEnabled: true,
});
assert.deepEqual(disabled, []);

console.log("Current Affairs CP020 personalization policy contracts passed");
