import assert from "node:assert/strict";
import test from "node:test";
import { istDay, summarizeStreak } from "./streak";

test("empty history has no streak", () => {
  assert.deepEqual(summarizeStreak([], "2026-11-25"), { currentStreak: 0, longestStreak: 0, lastAttemptDate: null, attemptedToday: false });
});
test("consecutive days count, duplicates ignored", () => {
  const s = summarizeStreak(["2026-11-23", "2026-11-24", "2026-11-24", "2026-11-25"], "2026-11-25");
  assert.equal(s.currentStreak, 3); assert.equal(s.longestStreak, 3); assert.equal(s.attemptedToday, true);
});
test("streak stays alive the day after, then breaks", () => {
  assert.equal(summarizeStreak(["2026-11-23", "2026-11-24"], "2026-11-25").currentStreak, 2);
  assert.equal(summarizeStreak(["2026-11-23", "2026-11-24"], "2026-11-26").currentStreak, 0);
});
test("longest streak survives a gap", () => {
  const s = summarizeStreak(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-20"], "2026-11-20");
  assert.equal(s.longestStreak, 3); assert.equal(s.currentStreak, 1);
});
test("istDay rolls over at 18:30 UTC", () => {
  assert.equal(istDay(new Date("2026-11-24T18:29:00Z")), "2026-11-24");
  assert.equal(istDay(new Date("2026-11-24T18:31:00Z")), "2026-11-25");
});
