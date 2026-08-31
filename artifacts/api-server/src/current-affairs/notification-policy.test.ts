import assert from "node:assert/strict";

import {
  canDeliverCurrentAffairsNotification,
  currentAffairsIndiaClock,
  isCurrentAffairsQuietTime,
  normalizeCurrentAffairsMuteUntil,
  normalizeCurrentAffairsNotificationCap,
  normalizeCurrentAffairsNotificationGapMinutes,
  normalizeCurrentAffairsQuietTime,
} from "./notification-policy";

assert.equal(normalizeCurrentAffairsQuietTime("22:00"), "22:00");
assert.equal(normalizeCurrentAffairsQuietTime("7:00"), null);
assert.equal(normalizeCurrentAffairsNotificationCap(3), 3);
assert.equal(normalizeCurrentAffairsNotificationCap(9), null);
assert.equal(normalizeCurrentAffairsNotificationGapMinutes(180), 180);
assert.equal(normalizeCurrentAffairsNotificationGapMinutes(30), null);

assert.equal(isCurrentAffairsQuietTime({ localTime: "23:30", quietStart: "22:00", quietEnd: "07:00" }), true);
assert.equal(isCurrentAffairsQuietTime({ localTime: "06:59", quietStart: "22:00", quietEnd: "07:00" }), true);
assert.equal(isCurrentAffairsQuietTime({ localTime: "07:00", quietStart: "22:00", quietEnd: "07:00" }), false);
assert.equal(isCurrentAffairsQuietTime({ localTime: "14:00", quietStart: "13:00", quietEnd: "15:00" }), true);
assert.equal(isCurrentAffairsQuietTime({ localTime: "13:00", quietStart: "13:00", quietEnd: "13:00" }), false);

const now = new Date("2026-08-30T06:00:00.000Z");
const base = {
  now,
  localTime: "11:30",
  enabled: true,
  muteUntil: null,
  quietStart: "22:00",
  quietEnd: "07:00",
  deliveredToday: 0,
  dailyCap: 3,
  lastDeliveredAt: null,
  minimumGapMinutes: 180,
};
assert.deepEqual(canDeliverCurrentAffairsNotification(base), { allowed: true, reason: "allowed" });
assert.equal(canDeliverCurrentAffairsNotification({ ...base, enabled: false }).reason, "disabled");
assert.equal(canDeliverCurrentAffairsNotification({ ...base, muteUntil: new Date("2026-08-30T12:00:00.000Z") }).reason, "muted");
assert.equal(canDeliverCurrentAffairsNotification({ ...base, localTime: "23:00" }).reason, "quiet_hours");
assert.equal(canDeliverCurrentAffairsNotification({ ...base, deliveredToday: 3 }).reason, "daily_cap");
assert.equal(canDeliverCurrentAffairsNotification({ ...base, lastDeliveredAt: new Date("2026-08-30T05:00:00.000Z") }).reason, "minimum_gap");
assert.equal(canDeliverCurrentAffairsNotification({ ...base, lastDeliveredAt: new Date("2026-08-30T02:00:00.000Z") }).allowed, true);

const clock = currentAffairsIndiaClock(new Date("2026-08-30T18:45:00.000Z"));
assert.equal(clock.dayKey, "2026-08-31");
assert.equal(clock.localTime, "00:15");

assert.equal(normalizeCurrentAffairsMuteUntil(null, now), null);
assert.equal(normalizeCurrentAffairsMuteUntil("2026-08-31T06:00:00.000Z", now)?.toISOString(), "2026-08-31T06:00:00.000Z");
assert.equal(normalizeCurrentAffairsMuteUntil("2027-12-01T00:00:00.000Z", now), undefined);

console.log("Current Affairs CP021 notification policy contracts passed");
