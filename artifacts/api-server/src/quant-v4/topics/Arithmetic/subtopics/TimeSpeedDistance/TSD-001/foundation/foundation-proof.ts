import assert from "node:assert/strict";
import {
  RATIONAL_ZERO,
  add,
  divide,
  equals,
  fromDecimalString,
  modulo,
  multiply,
  rational,
  subtract,
  toCanonicalString,
} from "./rational";
import {
  averageSpeed,
  catchUpTimeAfterDelayedStart,
  distanceForUniformMotion,
  firstMeetingTimeOnClosedTrack,
  firstMeetingTimeOnLine,
  groundSpeedInMedium,
  linearDistanceFromWheel,
  positionAt,
  trainClearTimeAgainstFixedObject,
  twoTrainCompleteCrossingTime,
  validateMotionState,
} from "./motion";
import type { MotionBody, MotionSegment, MotionState } from "./types";
import {
  convertDistance,
  convertSpeed,
  convertTime,
  distanceFromSpeedAndTime,
  paceFromSpeed,
  speedFromDistanceAndTime,
  speedFromPace,
  timeFromDistanceAndSpeed,
} from "./units";

function expectRational(actual: ReturnType<typeof rational>, expected: ReturnType<typeof rational>, label: string): void {
  assert.ok(equals(actual, expected), `${label}: expected ${toCanonicalString(expected)}, got ${toCanonicalString(actual)}`);
}

expectRational(rational(2, 4), rational(1, 2), "reduction");
expectRational(rational(1, -2), rational(-1, 2), "sign normalization");
expectRational(fromDecimalString("12.375"), rational(99, 8), "decimal parsing");
expectRational(add(rational(1, 3), rational(1, 6)), rational(1, 2), "addition");
expectRational(subtract(rational(7, 5), rational(2, 5)), rational(1), "subtraction");
expectRational(multiply(rational(14, 15), rational(25, 21)), rational(10, 9), "multiplication");
expectRational(divide(rational(5, 8), rational(15, 16)), rational(2, 3), "division");
expectRational(modulo(rational(-1), rational(400)), rational(399), "positive modulo");

expectRational(convertDistance(rational(3), "KM", "M"), rational(3000), "km to m");
expectRational(convertTime(rational(3, 2), "HOUR", "MINUTE"), rational(90), "hours to minutes");
expectRational(convertSpeed(rational(72), "KMPH", "MPS"), rational(20), "kmph to mps");
expectRational(convertSpeed(rational(25), "MPS", "KMPH"), rational(90), "mps to kmph");
expectRational(speedFromDistanceAndTime(rational(150), "KM", rational(3), "HOUR", "KMPH"), rational(50), "speed solve");
expectRational(distanceFromSpeedAndTime(rational(54), "KMPH", rational(40), "MINUTE", "KM"), rational(36), "distance solve");
expectRational(timeFromDistanceAndSpeed(rational(42), "KM", rational(56), "KMPH", "MINUTE"), rational(45), "time solve");
expectRational(speedFromPace(rational(5), "MINUTE_PER_KM", "KMPH"), rational(12), "pace to speed");
expectRational(paceFromSpeed(rational(15), "KMPH", "MINUTE_PER_KM"), rational(4), "speed to pace");

expectRational(distanceForUniformMotion(rational(15), rational(40)), rational(600), "d=vt");

const segments: MotionSegment[] = [
  {
    bodyId: "traveller",
    startTimeSeconds: rational(0),
    durationSeconds: rational(600),
    intrinsicSpeedMps: rational(10),
    direction: 1,
    stopDurationAfterSeconds: rational(120),
  },
  {
    bodyId: "traveller",
    startTimeSeconds: rational(720),
    durationSeconds: rational(300),
    intrinsicSpeedMps: rational(20),
    direction: 1,
  },
];
expectRational(averageSpeed(segments), rational(200, 17), "average speed includes stop");

const bodyA: MotionBody = {
  bodyId: "A",
  bodyKind: "POINT_BODY",
  intrinsicSpeedMps: rational(12),
  direction: 1,
  startPositionMetres: rational(0),
  startTimeSeconds: rational(0),
};
const bodyB: MotionBody = {
  bodyId: "B",
  bodyKind: "POINT_BODY",
  intrinsicSpeedMps: rational(8),
  direction: -1,
  startPositionMetres: rational(1000),
  startTimeSeconds: rational(0),
};
expectRational(firstMeetingTimeOnLine(bodyA, bodyB)!, rational(50), "opposite meeting time");
expectRational(positionAt(bodyA, rational(50)), rational(600), "meeting position A");
expectRational(positionAt(bodyB, rational(50)), rational(600), "meeting position B");

const target: MotionBody = {
  ...bodyA,
  bodyId: "target",
  intrinsicSpeedMps: rational(6),
  startTimeSeconds: rational(0),
};
const chaser: MotionBody = {
  ...bodyA,
  bodyId: "chaser",
  intrinsicSpeedMps: rational(10),
  startTimeSeconds: rational(30),
};
expectRational(catchUpTimeAfterDelayedStart(chaser, target)!, rational(75), "delayed catch-up absolute time");

const runnerA: MotionBody = { ...bodyA, bodyId: "runner-a", intrinsicSpeedMps: rational(10) };
const runnerB: MotionBody = { ...bodyA, bodyId: "runner-b", intrinsicSpeedMps: rational(6) };
expectRational(firstMeetingTimeOnClosedTrack(runnerA, runnerB, rational(400))!, rational(100), "same-direction lap meeting");

expectRational(trainClearTimeAgainstFixedObject(rational(180), rational(120), rational(15)), rational(20), "train clears platform");
expectRational(twoTrainCompleteCrossingTime(rational(120), rational(180), rational(15), rational(-10))!, rational(12), "two trains cross");
expectRational(groundSpeedInMedium(rational(8), 1, rational(2)), rational(10), "downstream ground speed");
expectRational(groundSpeedInMedium(rational(8), -1, rational(2)), rational(-6), "upstream signed ground speed");
expectRational(linearDistanceFromWheel(rational(250), rational(11, 5)), rational(550), "wheel distance");

const validState: MotionState = {
  trackKind: "LINE",
  bodies: [bodyA, bodyB],
  segments: [],
  events: [{ eventKind: "MEET", timeSeconds: rational(50), bodyIds: ["A", "B"], positionMetres: rational(600) }],
};
assert.deepEqual(validateMotionState(validState), []);

const invalidState: MotionState = {
  trackKind: "CLOSED_LOOP",
  trackLengthMetres: RATIONAL_ZERO,
  bodies: [bodyA, bodyA],
  segments: [{
    bodyId: "missing",
    startTimeSeconds: rational(0),
    durationSeconds: rational(-1),
    intrinsicSpeedMps: rational(1),
    direction: 1,
  }],
  events: [],
};
assert.ok(validateMotionState(invalidState).length >= 4, "invalid-state guard should report independent failures");

console.log(JSON.stringify({
  status: "PASS",
  suite: "TSD shared exact motion foundation",
  assertions: 31,
}, null, 2));
