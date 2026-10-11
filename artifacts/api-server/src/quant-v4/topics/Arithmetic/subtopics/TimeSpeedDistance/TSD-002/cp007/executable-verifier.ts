import {
  absRational,
  add,
  divide,
  equals,
  floorRational,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../../TSD-001/foundation/rational";
import { cp007QlForAuthority } from "./ql-allocation";
import type {
  TsdCp007AuthorityKey,
  TsdCp007ExecutableInput,
  TsdCp007ExecutableSolution,
  TsdCp007TimelineIntervalKind,
  TsdCp007Unit,
  TsdCp007VerificationResult,
} from "./executable-types";

interface ExpectedValue {
  readonly kind: "VALUE";
  readonly unit: TsdCp007Unit;
  readonly value: Rational;
}
interface ExpectedCount {
  readonly kind: "COUNT";
  readonly unit: "COUNT";
  readonly count: bigint;
}
type ExpectedAnswer = ExpectedValue | ExpectedCount;

function required<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error(`missing ${name}`);
  return value;
}

function positive(value: Rational, name: string): Rational {
  if (!isPositive(value)) throw new Error(`${name} must be positive`);
  return value;
}

function intervalFor(input: TsdCp007ExecutableInput, kind: TsdCp007TimelineIntervalKind): Rational {
  const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
  const speed = positive(required(input.speed, "speed"), "speed");
  if (kind === "POINT_CROSSING") return divide(trainLength, speed);
  const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
  if (kind === "FULL_CROSSING") return divide(add(trainLength, objectLength), speed);
  const distance = subtract(objectLength, trainLength);
  if (!isPositive(distance)) throw new Error("full occupancy requires object length > train length");
  return divide(distance, speed);
}

function expectedAnswer(authorityKey: TsdCp007AuthorityKey, input: TsdCp007ExecutableInput): ExpectedAnswer {
  switch (authorityKey) {
    case "fixedPointCrossingTime":
      return { kind: "VALUE", unit: "SECOND", value: divide(positive(required(input.trainLength, "trainLength"), "trainLength"), positive(required(input.speed, "speed"), "speed")) };

    case "finiteFixedObjectCrossingTime": {
      const length = positive(required(input.trainLength, "trainLength"), "trainLength");
      const object = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const speed = positive(required(input.speed, "speed"), "speed");
      return { kind: "VALUE", unit: "SECOND", value: divide(add(length, object), speed) };
    }

    case "trainLengthFromPointCrossing":
      return { kind: "VALUE", unit: "METRE", value: multiply(positive(required(input.speed, "speed"), "speed"), positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime")) };

    case "trainSpeedFromPointCrossing":
      return { kind: "VALUE", unit: "METRE_PER_SECOND", value: divide(positive(required(input.trainLength, "trainLength"), "trainLength"), positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime")) };

    case "fixedObjectLengthFromCrossingEvidence": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      if (required(input.objectLengthEvidenceMode, "objectLengthEvidenceMode") === "DIRECT_SPEED") {
        const result = subtract(multiply(positive(required(input.speed, "speed"), "speed"), crossingTime), trainLength);
        if (!isPositive(result)) throw new Error("recovered object length must be positive");
        return { kind: "VALUE", unit: "METRE", value: result };
      }
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("crossing time must exceed point time");
      return { kind: "VALUE", unit: "METRE", value: divide(multiply(trainLength, extraTime), pointTime) };
    }

    case "trainLengthFromPointAndObjectTimes": {
      const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("crossing time must exceed point time");
      return { kind: "VALUE", unit: "METRE", value: multiply(divide(objectLength, extraTime), pointTime) };
    }

    case "trainSpeedFromPointAndObjectTimes": {
      const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("crossing time must exceed point time");
      return { kind: "VALUE", unit: "METRE_PER_SECOND", value: divide(objectLength, extraTime) };
    }

    case "fixedObjectLengthDifferenceFromCrossingTimes": {
      const speed = positive(required(input.speed, "speed"), "speed");
      const first = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const second = positive(required(input.secondFixedObjectCrossingTime, "secondFixedObjectCrossingTime"), "secondFixedObjectCrossingTime");
      return { kind: "VALUE", unit: "METRE", value: absRational(multiply(speed, subtract(second, first))) };
    }

    case "fullOccupancyDuration": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const speed = positive(required(input.speed, "speed"), "speed");
      if (required(input.occupancyTarget, "occupancyTarget") === "DURATION") {
        const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
        const distance = subtract(objectLength, trainLength);
        if (!isPositive(distance)) throw new Error("full occupancy requires object length > train length");
        return { kind: "VALUE", unit: "SECOND", value: divide(distance, speed) };
      }
      const duration = positive(required(input.occupancyDuration, "occupancyDuration"), "occupancyDuration");
      return { kind: "VALUE", unit: "METRE", value: add(trainLength, multiply(speed, duration)) };
    }

    case "trainCrossingEventTimeline": {
      const knownClock = required(input.knownClockSecond, "knownClockSecond");
      const kind = required(input.timelineIntervalKind, "timelineIntervalKind");
      const target = required(input.timelineTarget, "timelineTarget");
      const interval = intervalFor(input, kind);
      return { kind: "VALUE", unit: "CLOCK_SECOND", value: target === "FORWARD_CLOCK" ? add(knownClock, interval) : subtract(knownClock, interval) };
    }

    case "fixedSpacingPointCount": {
      const target = required(input.spacingTarget, "spacingTarget");
      const includeStart = required(input.includeStartingPoint, "includeStartingPoint");
      if (target === "POINT_COUNT") {
        const distance = positive(required(input.distanceWindow, "distanceWindow"), "distanceWindow");
        const spacing = positive(required(input.spacing, "spacing"), "spacing");
        const gaps = floorRational(divide(distance, spacing));
        return { kind: "COUNT", unit: "COUNT", count: includeStart ? gaps + 1n : gaps };
      }
      const observed = required(input.observedPointCount, "observedPointCount");
      const gaps = includeStart ? observed - 1n : observed;
      if (gaps <= 0n) throw new Error("point count implies no positive gaps");
      if (target === "SPACING") {
        const distance = positive(required(input.distanceWindow, "distanceWindow"), "distanceWindow");
        return { kind: "VALUE", unit: "METRE", value: divide(distance, rational(gaps)) };
      }
      const spacing = positive(required(input.spacing, "spacing"), "spacing");
      const time = positive(required(input.timeWindow, "timeWindow"), "timeWindow");
      return { kind: "VALUE", unit: "METRE_PER_SECOND", value: divide(multiply(spacing, rational(gaps)), time) };
    }
  }
}

export function independentlyVerifyCp007Authority(
  authorityKey: TsdCp007AuthorityKey,
  input: TsdCp007ExecutableInput,
  solution: TsdCp007ExecutableSolution,
): TsdCp007VerificationResult {
  const errors: string[] = [];
  try {
    const allocation = cp007QlForAuthority(authorityKey);
    const expected = expectedAnswer(authorityKey, input);
    if (solution.checkpointId !== "TSD-CP-007") errors.push("wrong checkpointId");
    if (solution.authorityKey !== authorityKey) errors.push("wrong authorityKey");
    if (solution.permanentQlId !== allocation.permanentQlId) errors.push("wrong permanentQlId");
    if (solution.answerKind !== expected.kind) errors.push(`answer kind mismatch: expected ${expected.kind}, received ${solution.answerKind}`);
    if (solution.unit !== expected.unit) errors.push(`unit mismatch: expected ${expected.unit}, received ${solution.unit}`);
    if (expected.kind === "VALUE") {
      if (solution.value === undefined) errors.push("missing value answer");
      else if (!equals(solution.value, expected.value)) errors.push("value answer does not satisfy independent invariant");
    } else {
      if (solution.count === undefined) errors.push("missing count answer");
      else if (solution.count !== expected.count) errors.push("count answer does not satisfy independent invariant");
    }
    if (solution.evidence.length < 2) errors.push("solution evidence is too thin");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
