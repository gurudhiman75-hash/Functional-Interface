import assert from "node:assert/strict";

import {
  completedMonthlyPeriodForDate,
  completedRollupPeriods,
  completedWeeklyPeriodForDate,
} from "./periodic-rollup-policy";

assert.deepEqual(completedWeeklyPeriodForDate("2026-08-30"), {
  type: "weekly",
  start: "2026-08-24",
  end: "2026-08-30",
});
assert.equal(completedWeeklyPeriodForDate("2026-08-29"), null);

assert.deepEqual(completedMonthlyPeriodForDate("2026-08-31"), {
  type: "monthly",
  start: "2026-08-01",
  end: "2026-08-31",
});
assert.equal(completedMonthlyPeriodForDate("2026-08-30"), null);
assert.deepEqual(completedMonthlyPeriodForDate("2028-02-29"), {
  type: "monthly",
  start: "2028-02-01",
  end: "2028-02-29",
});

const mondayIndia = new Date("2026-08-31T02:00:00Z");
assert.deepEqual(completedRollupPeriods(mondayIndia), [{
  type: "weekly",
  start: "2026-08-24",
  end: "2026-08-30",
}]);

const firstSeptemberIndia = new Date("2026-08-31T20:00:00Z");
const due = completedRollupPeriods(firstSeptemberIndia);
assert.ok(due.some((period) => period.type === "monthly" && period.start === "2026-08-01" && period.end === "2026-08-31"));

console.log("Current Affairs Studio CP012 periodic rollup policy contracts passed");
