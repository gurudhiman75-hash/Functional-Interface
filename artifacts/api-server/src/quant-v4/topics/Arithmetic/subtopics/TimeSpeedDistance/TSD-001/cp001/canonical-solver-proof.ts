import assert from "node:assert/strict";
import { equals, rational, toCanonicalString, type Rational } from "../foundation/rational";
import { solveCp001, type TsdCp001Solution } from "./canonical-solver";

function scalarValue(solution: TsdCp001Solution): Rational {
  if (!("value" in solution) || typeof solution.value === "boolean") throw new Error("Expected scalar solution");
  return solution.value;
}

function expectScalar(solution: TsdCp001Solution, expected: Rational, label: string): void {
  const actual = scalarValue(solution);
  assert.ok(equals(actual, expected), `${label}: expected ${toCanonicalString(expected)}, got ${toCanonicalString(actual)}`);
}

expectScalar(solveCp001({ solveMode: "distanceFromSpeedAndTime", speedMps: rational(15), durationSeconds: rational(40) }), rational(600), "direct distance");
expectScalar(solveCp001({ solveMode: "speedFromDistanceAndTime", distanceMetres: rational(900), durationSeconds: rational(60) }), rational(15), "direct speed");
expectScalar(solveCp001({ solveMode: "timeFromDistanceAndSpeed", distanceMetres: rational(750), speedMps: rational(15) }), rational(50), "direct time");
expectScalar(solveCp001({ solveMode: "convertSpeedUnit", value: rational(72), from: "KMPH", to: "MPS" }), rational(20), "speed conversion");
expectScalar(solveCp001({ solveMode: "convertDistanceUnit", value: rational(7, 2), from: "KM", to: "M" }), rational(3500), "distance conversion");
expectScalar(solveCp001({ solveMode: "convertTimeUnit", value: rational(5, 2), from: "HOUR", to: "MINUTE" }), rational(150), "time conversion");
expectScalar(solveCp001({ solveMode: "speedFromMixedUnits", distance: rational(15), distanceUnit: "KM", duration: rational(20), timeUnit: "MINUTE", outputUnit: "KMPH" }), rational(45), "mixed-unit speed");

const arrival = solveCp001({ solveMode: "arrivalClockTime", departureMinuteOfDay: rational(23 * 60 + 35), durationMinutes: rational(110) });
assert.equal(arrival.answerKind, "CLOCK_TIME");
if (arrival.answerKind === "CLOCK_TIME") {
  assert.ok(equals(arrival.minuteOfDay, rational(85)));
  assert.equal(arrival.dayOffset, 1n);
}

const departure = solveCp001({ solveMode: "departureClockTime", arrivalMinuteOfDay: rational(80), arrivalDayOffset: 1n, durationMinutes: rational(125) });
assert.equal(departure.answerKind, "CLOCK_TIME");
if (departure.answerKind === "CLOCK_TIME") {
  assert.ok(equals(departure.minuteOfDay, rational(1395)));
  assert.equal(departure.dayOffset, 0n);
}

expectScalar(solveCp001({ solveMode: "elapsedClockTime", departureMinuteOfDay: rational(22 * 60 + 45), arrivalMinuteOfDay: rational(75), arrivalDayOffset: 1n }), rational(150), "elapsed across midnight");
expectScalar(solveCp001({ solveMode: "compareDistancesAtEqualTime", firstSpeed: rational(12), secondSpeed: rational(8) }), rational(3, 2), "equal-time distance ratio");
expectScalar(solveCp001({ solveMode: "compareTimesAtEqualDistance", firstSpeed: rational(12), secondSpeed: rational(8) }), rational(2, 3), "equal-distance time ratio");
expectScalar(solveCp001({ solveMode: "compareSpeedsAtEqualTime", firstDistance: rational(150), secondDistance: rational(100) }), rational(3, 2), "equal-time speed ratio");
expectScalar(solveCp001({ solveMode: "distanceRatioFromSpeedAndTimeRatios", speedRatio: rational(3, 2), timeRatio: rational(4, 5) }), rational(6, 5), "distance ratio");
expectScalar(solveCp001({ solveMode: "speedRatioFromDistanceAndTimeRatios", distanceRatio: rational(6, 5), timeRatio: rational(4, 5) }), rational(3, 2), "speed ratio");
expectScalar(solveCp001({ solveMode: "timeRatioFromDistanceAndSpeedRatios", distanceRatio: rational(6, 5), speedRatio: rational(3, 2) }), rational(4, 5), "time ratio");
expectScalar(solveCp001({ solveMode: "distanceByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetSpeed: rational(50), targetTime: rational(4) }), rational(200), "distance proportion");
expectScalar(solveCp001({ solveMode: "timeByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetDistance: rational(200), targetSpeed: rational(50) }), rational(4), "time proportion");
expectScalar(solveCp001({ solveMode: "speedByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetDistance: rational(200), targetTime: rational(4) }), rational(50), "speed proportion");
expectScalar(solveCp001({ solveMode: "speedFromPace", pace: rational(5), paceUnit: "MINUTE_PER_KM", outputUnit: "KMPH" }), rational(12), "speed from pace");
expectScalar(solveCp001({ solveMode: "paceFromSpeed", speed: rational(15), speedUnit: "KMPH", outputUnit: "MINUTE_PER_KM" }), rational(4), "pace from speed");
expectScalar(solveCp001({ solveMode: "distanceFromPaceAndTime", pace: rational(5), paceUnit: "MINUTE_PER_KM", duration: rational(50), timeUnit: "MINUTE", outputUnit: "KM" }), rational(10), "distance from pace");
expectScalar(solveCp001({ solveMode: "requiredUniformSpeedForDeadline", distance: rational(150), distanceUnit: "KM", departureMinuteOfDay: rational(8 * 60), deadlineMinuteOfDay: rational(11 * 60), deadlineDayOffset: 0n, outputUnit: "KMPH" }), rational(50), "deadline speed");

const unique = solveCp001({ solveMode: "classifyUniformMotionState", distanceMetres: rational(600), durationSeconds: rational(40) });
assert.deepEqual(unique, { solveMode: "classifyUniformMotionState", answerKind: "CLASSIFICATION", classification: "UNIQUE" });
const consistent = solveCp001({ solveMode: "classifyUniformMotionState", distanceMetres: rational(600), speedMps: rational(15), durationSeconds: rational(40) });
assert.deepEqual(consistent, { solveMode: "classifyUniformMotionState", answerKind: "CLASSIFICATION", classification: "CONSISTENT" });
const impossible = solveCp001({ solveMode: "classifyUniformMotionState", distanceMetres: rational(601), speedMps: rational(15), durationSeconds: rational(40) });
assert.deepEqual(impossible, { solveMode: "classifyUniformMotionState", answerKind: "CLASSIFICATION", classification: "IMPOSSIBLE" });
const indeterminate = solveCp001({ solveMode: "classifyUniformMotionState", speedMps: rational(15) });
assert.deepEqual(indeterminate, { solveMode: "classifyUniformMotionState", answerKind: "CLASSIFICATION", classification: "INDETERMINATE" });

const trueClaim = solveCp001({ solveMode: "verifyUniformMotionClaim", distanceMetres: rational(600), speedMps: rational(15), durationSeconds: rational(40) });
assert.deepEqual(trueClaim, { solveMode: "verifyUniformMotionClaim", answerKind: "BOOLEAN", value: true });
const falseClaim = solveCp001({ solveMode: "verifyUniformMotionClaim", distanceMetres: rational(610), speedMps: rational(15), durationSeconds: rational(40) });
assert.deepEqual(falseClaim, { solveMode: "verifyUniformMotionClaim", answerKind: "BOOLEAN", value: false });

console.log(JSON.stringify({
  status: "PASS",
  suite: "TSD-CP-001 provisional canonical solver",
  provisionalAuthoritiesExercised: 25,
  permanentQlCount: 0,
}, null, 2));
