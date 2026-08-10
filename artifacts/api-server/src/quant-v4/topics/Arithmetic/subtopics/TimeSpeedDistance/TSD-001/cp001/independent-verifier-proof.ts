import assert from "node:assert/strict";
import { rational } from "../foundation/rational";
import { solveCp001, type TsdCp001SolveInput } from "./canonical-solver";
import { TSD_CP001_DISCOVERY_AUTHORITIES } from "./discovery-registry";
import { verifyCp001Solution } from "./independent-verifier";

const fixtures: readonly TsdCp001SolveInput[] = [
  { solveMode: "distanceFromSpeedAndTime", speedMps: rational(15), durationSeconds: rational(40) },
  { solveMode: "speedFromDistanceAndTime", distanceMetres: rational(900), durationSeconds: rational(60) },
  { solveMode: "timeFromDistanceAndSpeed", distanceMetres: rational(750), speedMps: rational(15) },
  { solveMode: "convertSpeedUnit", value: rational(72), from: "KMPH", to: "MPS" },
  { solveMode: "convertDistanceUnit", value: rational(7, 2), from: "KM", to: "M" },
  { solveMode: "convertTimeUnit", value: rational(5, 2), from: "HOUR", to: "MINUTE" },
  { solveMode: "speedFromMixedUnits", distance: rational(15), distanceUnit: "KM", duration: rational(20), timeUnit: "MINUTE", outputUnit: "KMPH" },
  { solveMode: "arrivalClockTime", departureMinuteOfDay: rational(1415), durationMinutes: rational(110) },
  { solveMode: "departureClockTime", arrivalMinuteOfDay: rational(80), arrivalDayOffset: 1n, durationMinutes: rational(125) },
  { solveMode: "elapsedClockTime", departureMinuteOfDay: rational(1365), arrivalMinuteOfDay: rational(75), arrivalDayOffset: 1n },
  { solveMode: "compareDistancesAtEqualTime", firstSpeed: rational(12), secondSpeed: rational(8) },
  { solveMode: "compareTimesAtEqualDistance", firstSpeed: rational(12), secondSpeed: rational(8) },
  { solveMode: "compareSpeedsAtEqualTime", firstDistance: rational(150), secondDistance: rational(100) },
  { solveMode: "distanceRatioFromSpeedAndTimeRatios", speedRatio: rational(3, 2), timeRatio: rational(4, 5) },
  { solveMode: "speedRatioFromDistanceAndTimeRatios", distanceRatio: rational(6, 5), timeRatio: rational(4, 5) },
  { solveMode: "timeRatioFromDistanceAndSpeedRatios", distanceRatio: rational(6, 5), speedRatio: rational(3, 2) },
  { solveMode: "distanceByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetSpeed: rational(50), targetTime: rational(4) },
  { solveMode: "timeByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetDistance: rational(200), targetSpeed: rational(50) },
  { solveMode: "speedByProportion", knownDistance: rational(120), knownSpeed: rational(40), knownTime: rational(3), targetDistance: rational(200), targetTime: rational(4) },
  { solveMode: "speedFromPace", pace: rational(5), paceUnit: "MINUTE_PER_KM", outputUnit: "KMPH" },
  { solveMode: "paceFromSpeed", speed: rational(15), speedUnit: "KMPH", outputUnit: "MINUTE_PER_KM" },
  { solveMode: "distanceFromPaceAndTime", pace: rational(5), paceUnit: "MINUTE_PER_KM", duration: rational(50), timeUnit: "MINUTE", outputUnit: "KM" },
  { solveMode: "requiredUniformSpeedForDeadline", distance: rational(150), distanceUnit: "KM", departureMinuteOfDay: rational(480), deadlineMinuteOfDay: rational(660), deadlineDayOffset: 0n, outputUnit: "KMPH" },
  { solveMode: "classifyUniformMotionState", distanceMetres: rational(600), durationSeconds: rational(40) },
  { solveMode: "verifyUniformMotionClaim", distanceMetres: rational(600), speedMps: rational(15), durationSeconds: rational(40) },
];

assert.equal(fixtures.length, TSD_CP001_DISCOVERY_AUTHORITIES.length);
for (const fixture of fixtures) {
  const solution = solveCp001(fixture);
  const verification = verifyCp001Solution(fixture, solution);
  assert.deepEqual(verification, { valid: true, errors: [] }, fixture.solveMode);
}

const tampered = solveCp001(fixtures[0]);
if (!("value" in tampered) || typeof tampered.value === "boolean") throw new Error("Expected scalar fixture");
const badVerification = verifyCp001Solution(fixtures[0], { ...tampered, value: rational(601) });
assert.equal(badVerification.valid, false, "independent verifier must reject a tampered canonical answer");

console.log(JSON.stringify({
  status: "PASS",
  suite: "TSD-CP-001 independent verifier",
  provisionalAuthoritiesVerified: fixtures.length,
  tamperRejection: true,
}, null, 2));
