import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  equals,
  isNegative,
  isPositive,
  isZero,
  modulo,
  multiply,
  rational,
  subtract,
  type Rational,
} from "./rational";
import type { Direction1D, MotionBody, MotionSegment, MotionState } from "./types";

function assertNonNegative(value: Rational, label: string): void {
  if (isNegative(value)) throw new Error(`${label} cannot be negative`);
}

function assertPositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

export function signedVelocity(speedMps: Rational, direction: Direction1D, mediumSpeedMps = RATIONAL_ZERO): Rational {
  assertNonNegative(speedMps, "Intrinsic speed");
  return add(multiply(speedMps, rational(direction)), mediumSpeedMps);
}

export function distanceForUniformMotion(speedMps: Rational, durationSeconds: Rational): Rational {
  assertNonNegative(speedMps, "Speed");
  assertNonNegative(durationSeconds, "Duration");
  return multiply(speedMps, durationSeconds);
}

export function durationForUniformMotion(distanceMetres: Rational, speedMps: Rational): Rational {
  assertNonNegative(distanceMetres, "Distance");
  assertPositive(speedMps, "Speed");
  return divide(distanceMetres, speedMps);
}

export function speedForUniformMotion(distanceMetres: Rational, durationSeconds: Rational): Rational {
  assertNonNegative(distanceMetres, "Distance");
  assertPositive(durationSeconds, "Duration");
  return divide(distanceMetres, durationSeconds);
}

export function segmentGroundVelocity(segment: MotionSegment): Rational {
  return signedVelocity(segment.intrinsicSpeedMps, segment.direction, segment.mediumSpeedMps);
}

export function segmentDisplacement(segment: MotionSegment): Rational {
  assertNonNegative(segment.durationSeconds, "Segment duration");
  return multiply(segmentGroundVelocity(segment), segment.durationSeconds);
}

export function segmentPathDistance(segment: MotionSegment): Rational {
  return absRational(segmentDisplacement(segment));
}

export function totalPathDistance(segments: readonly MotionSegment[]): Rational {
  return segments.reduce((sum, segment) => add(sum, segmentPathDistance(segment)), RATIONAL_ZERO);
}

export function totalElapsedTime(segments: readonly MotionSegment[]): Rational {
  if (segments.length === 0) return RATIONAL_ZERO;
  let earliest = segments[0].startTimeSeconds;
  let latest = add(
    add(segments[0].startTimeSeconds, segments[0].durationSeconds),
    segments[0].stopDurationAfterSeconds ?? RATIONAL_ZERO,
  );
  for (const segment of segments.slice(1)) {
    if (compare(segment.startTimeSeconds, earliest) < 0) earliest = segment.startTimeSeconds;
    const end = add(
      add(segment.startTimeSeconds, segment.durationSeconds),
      segment.stopDurationAfterSeconds ?? RATIONAL_ZERO,
    );
    if (compare(end, latest) > 0) latest = end;
  }
  return subtract(latest, earliest);
}

export function averageSpeed(segments: readonly MotionSegment[]): Rational {
  const elapsed = totalElapsedTime(segments);
  assertPositive(elapsed, "Total elapsed time");
  return divide(totalPathDistance(segments), elapsed);
}

export function positionAt(body: MotionBody, timeSeconds: Rational, trackLengthMetres?: Rational): Rational {
  if (compare(timeSeconds, body.startTimeSeconds) < 0) {
    throw new Error(`Time precedes start of body ${body.bodyId}`);
  }
  const elapsed = subtract(timeSeconds, body.startTimeSeconds);
  const position = add(
    body.startPositionMetres,
    multiply(signedVelocity(body.intrinsicSpeedMps, body.direction), elapsed),
  );
  return trackLengthMetres ? modulo(position, trackLengthMetres) : position;
}

export function firstMeetingTimeOnLine(a: MotionBody, b: MotionBody): Rational | null {
  if (!equals(a.startTimeSeconds, b.startTimeSeconds)) {
    throw new Error("Use a staged-start solver when bodies do not start together");
  }
  const relativeVelocity = subtract(
    signedVelocity(a.intrinsicSpeedMps, a.direction),
    signedVelocity(b.intrinsicSpeedMps, b.direction),
  );
  if (isZero(relativeVelocity)) return null;
  const gap = subtract(b.startPositionMetres, a.startPositionMetres);
  const elapsed = divide(gap, relativeVelocity);
  if (isNegative(elapsed)) return null;
  return add(a.startTimeSeconds, elapsed);
}

export function catchUpTimeAfterDelayedStart(chaser: MotionBody, target: MotionBody): Rational | null {
  if (compare(chaser.startTimeSeconds, target.startTimeSeconds) < 0) {
    throw new Error("Chaser cannot start before target in delayed-start catch-up");
  }
  const targetAtChaserStart = positionAt(target, chaser.startTimeSeconds);
  const initialGap = subtract(targetAtChaserStart, chaser.startPositionMetres);
  const closingSpeed = subtract(
    signedVelocity(chaser.intrinsicSpeedMps, chaser.direction),
    signedVelocity(target.intrinsicSpeedMps, target.direction),
  );
  if (!isPositive(closingSpeed)) return null;
  const elapsed = divide(initialGap, closingSpeed);
  if (isNegative(elapsed)) return null;
  return add(chaser.startTimeSeconds, elapsed);
}

export function firstMeetingTimeOnClosedTrack(a: MotionBody, b: MotionBody, trackLengthMetres: Rational): Rational | null {
  assertPositive(trackLengthMetres, "Track length");
  if (!equals(a.startTimeSeconds, b.startTimeSeconds)) {
    throw new Error("Closed-track foundation currently requires simultaneous starts");
  }
  const relativeVelocity = subtract(
    signedVelocity(a.intrinsicSpeedMps, a.direction),
    signedVelocity(b.intrinsicSpeedMps, b.direction),
  );
  if (isZero(relativeVelocity)) {
    return equals(modulo(a.startPositionMetres, trackLengthMetres), modulo(b.startPositionMetres, trackLengthMetres))
      ? a.startTimeSeconds
      : null;
  }

  const initialDifference = modulo(subtract(b.startPositionMetres, a.startPositionMetres), trackLengthMetres);
  if (isZero(initialDifference)) {
    return add(a.startTimeSeconds, divide(trackLengthMetres, absRational(relativeVelocity)));
  }

  const candidate = relativeVelocity.numerator > 0n
    ? divide(initialDifference, relativeVelocity)
    : divide(subtract(initialDifference, trackLengthMetres), relativeVelocity);
  if (isNegative(candidate)) return null;
  return add(a.startTimeSeconds, candidate);
}

export function trainClearTimeAgainstFixedObject(
  trainLengthMetres: Rational,
  objectLengthMetres: Rational,
  trainSpeedMps: Rational,
): Rational {
  assertPositive(trainLengthMetres, "Train length");
  assertNonNegative(objectLengthMetres, "Object length");
  assertPositive(trainSpeedMps, "Train speed");
  return divide(add(trainLengthMetres, objectLengthMetres), trainSpeedMps);
}

export function twoTrainCompleteCrossingTime(
  firstLengthMetres: Rational,
  secondLengthMetres: Rational,
  firstSignedVelocityMps: Rational,
  secondSignedVelocityMps: Rational,
): Rational | null {
  assertPositive(firstLengthMetres, "First train length");
  assertPositive(secondLengthMetres, "Second train length");
  const closingSpeed = absRational(subtract(firstSignedVelocityMps, secondSignedVelocityMps));
  if (isZero(closingSpeed)) return null;
  return divide(add(firstLengthMetres, secondLengthMetres), closingSpeed);
}

export function groundSpeedInMedium(intrinsicSpeedMps: Rational, direction: Direction1D, mediumSignedSpeedMps: Rational): Rational {
  const ground = signedVelocity(intrinsicSpeedMps, direction, mediumSignedSpeedMps);
  if (!isPositive(absRational(ground))) throw new Error("Ground speed cannot be zero for travel");
  return ground;
}

export function linearDistanceFromWheel(revolutions: Rational, circumferenceMetres: Rational): Rational {
  assertNonNegative(revolutions, "Revolutions");
  assertPositive(circumferenceMetres, "Circumference");
  return multiply(revolutions, circumferenceMetres);
}

export function validateMotionState(state: MotionState): string[] {
  const errors: string[] = [];
  if (state.trackKind === "CLOSED_LOOP") {
    if (!state.trackLengthMetres || !isPositive(state.trackLengthMetres)) {
      errors.push("Closed-loop motion requires a positive track length");
    }
  } else if (state.trackLengthMetres) {
    errors.push("Line motion must not declare a closed-track length");
  }

  const bodyIds = new Set<string>();
  for (const body of state.bodies) {
    if (bodyIds.has(body.bodyId)) errors.push(`Duplicate body id: ${body.bodyId}`);
    bodyIds.add(body.bodyId);
    if (isNegative(body.intrinsicSpeedMps)) errors.push(`Negative intrinsic speed for ${body.bodyId}`);
    if (body.lengthMetres && !isPositive(body.lengthMetres)) errors.push(`Non-positive body length for ${body.bodyId}`);
  }

  for (const segment of state.segments) {
    if (!bodyIds.has(segment.bodyId)) errors.push(`Segment references unknown body: ${segment.bodyId}`);
    if (isNegative(segment.durationSeconds)) errors.push(`Negative segment duration for ${segment.bodyId}`);
    if (isNegative(segment.intrinsicSpeedMps)) errors.push(`Negative segment speed for ${segment.bodyId}`);
    if (segment.stopDurationAfterSeconds && isNegative(segment.stopDurationAfterSeconds)) {
      errors.push(`Negative stop duration for ${segment.bodyId}`);
    }
  }

  for (const event of state.events) {
    for (const bodyId of event.bodyIds) {
      if (!bodyIds.has(bodyId)) errors.push(`Event references unknown body: ${bodyId}`);
    }
    if (isNegative(event.timeSeconds)) errors.push(`Negative event time for ${event.eventKind}`);
  }
  return errors;
}
