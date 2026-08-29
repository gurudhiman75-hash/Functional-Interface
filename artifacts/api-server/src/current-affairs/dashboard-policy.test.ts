import assert from "node:assert/strict";

import {
  buildCurrentAffairsSevenDayActivity,
  currentAffairsCategoryLabel,
  currentAffairsMasteryState,
  currentAffairsStageLabel,
  currentAffairsStudyStreak,
  currentAffairsWeaknessScore,
} from "./dashboard-policy";

assert.equal(currentAffairsStudyStreak(["2026-08-29", "2026-08-28", "2026-08-27"], "2026-08-29"), 3);
assert.equal(currentAffairsStudyStreak(["2026-08-28", "2026-08-27"], "2026-08-29"), 2);
assert.equal(currentAffairsStudyStreak(["2026-08-26", "2026-08-25"], "2026-08-29"), 0);
assert.equal(currentAffairsStudyStreak(["2026-08-29", "2026-08-29", "2026-08-28"], "2026-08-29"), 2);

assert.equal(currentAffairsStageLabel(0), "Recovery");
assert.equal(currentAffairsStageLabel(5), "D60");
assert.equal(currentAffairsMasteryState(0, "wrong"), "recovery");
assert.equal(currentAffairsMasteryState(2, "correct"), "learning");
assert.equal(currentAffairsMasteryState(4, "correct"), "strong");
assert.equal(currentAffairsMasteryState(5, "correct"), "mastered");

const activity = buildCurrentAffairsSevenDayActivity([
  { day: "2026-08-29", attempts: 2, questions: 10, correct: 8 },
  { day: "2026-08-27", attempts: 1, questions: 5, correct: 2 },
], "2026-08-29");
assert.equal(activity.length, 7);
assert.equal(activity[6]?.accuracy, 80);
assert.equal(activity[5]?.attempts, 0);
assert.equal(activity[4]?.accuracy, 40);

assert.equal(currentAffairsCategoryLabel("economy_banking"), "Economy & Banking");
assert.ok(currentAffairsWeaknessScore({ accuracy: 45, total: 12, due: 3, recovery: 2 }) > currentAffairsWeaknessScore({ accuracy: 85, total: 12, due: 0, recovery: 0 }));

console.log("Current Affairs Studio CP018 learner dashboard policy contracts passed");
