import assert from "node:assert/strict";
import { add, divide, equals, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { TSD_CP009_MEETING_CONTENT_REVIEW_V2 } from "./meeting-content-review-v2";

assert.equal(TSD_CP009_MEETING_CONTENT_REVIEW_V2.length, 18);
for (const row of TSD_CP009_MEETING_CONTENT_REVIEW_V2) {
  const input = row.input;
  // Independent river-coordinate equation: xA=(u+c)t; xB=D−(v−c)t.
  const seconds = divide(input.routeDistance, add(input.fromUpstreamBodySpeed, input.fromDownstreamBodySpeed));
  const a = multiply(add(input.fromUpstreamBodySpeed, input.mediumSpeed), seconds);
  const b = subtract(input.routeDistance, multiply(subtract(input.fromDownstreamBodySpeed, input.mediumSpeed), seconds));
  assert.ok(equals(a, b));
  assert.ok(equals(a, row.sourceSolution.value));
  assert.ok(equals(divide(a, rational(1000)), row.calculation.meeting));
  assert.equal(row.explanation.length, 5);
  assert.ok(row.explanation.every((step) => step.includes("=")));
  assert.ok(row.stem.includes("A") && row.stem.includes("B"));
  assert.ok(!/[{}]/.test(row.stem));
  for (const key of ["contentApproved", "frozen", "registered", "persistence", "bank", "test", "mock", "public"] as const) assert.equal(row[key], false);
}
const first = TSD_CP009_MEETING_CONTENT_REVIEW_V2.find((row) => row.locale === "en-IN" && row.familyId === "111-A")!;
assert.equal(first.answer, "42 km");
assert.equal(first.calculation.time.numerator, 3n);
console.log("CP009 meeting editorial V2: PASS 18 trilingual candidates; independent coordinate proof; release gates closed");
