import assert from "node:assert/strict";
import { add, equals, multiply } from "../foundation/rational";
import { TSD_CP005_DEPARTURE_REVIEW_V1 } from "./departure-review-v1";
assert.equal(TSD_CP005_DEPARTURE_REVIEW_V1.length, 18);
for (const row of TSD_CP005_DEPARTURE_REVIEW_V1) {
  const [u, v] = row.speeds, t = row.meetingTime;
  // Independent distances: pre-meeting segments sum to the route; post-meeting segments are exchanged.
  assert.ok(equals(multiply(add(u!, v!), t), row.input.routeDistance!));
  assert.ok(equals(multiply(u!, row.input.postMeetingTimeA!), multiply(v!, t)));
  assert.ok(equals(multiply(v!, row.input.postMeetingTimeB!), multiply(u!, t)));
  assert.equal(row.options[row.correctIndex], row.answer);
  assert.ok(/simultaneously|एक ही समय|ਇੱਕੋ ਸਮੇਂ/.test(row.stem));
  for (const key of ["contentApproved", "frozen", "registered", "persistence", "bank", "test", "mock", "public"] as const) assert.equal(row[key], false);
}
console.log("CP005 departure review: PASS 18 trilingual candidates; independent journey equations; options and locks preserved");
