import {
  absRational,
  add,
  compare,
  divide,
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
} from "./executable-types";

function required<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error(`TSD-CP-007 missing required input: ${name}`);
  return value;
}

function positive(value: Rational, name: string): Rational {
  if (!isPositive(value)) throw new Error(`TSD-CP-007 ${name} must be positive`);
  return value;
}

function makeValue(
  authorityKey: TsdCp007AuthorityKey,
  unit: TsdCp007ExecutableSolution["unit"],
  value: Rational,
  evidence: readonly string[],
): TsdCp007ExecutableSolution {
  const allocation = cp007QlForAuthority(authorityKey);
  return Object.freeze({
    checkpointId: "TSD-CP-007",
    authorityKey,
    permanentQlId: allocation.permanentQlId,
    answerKind: "VALUE",
    unit,
    value,
    evidence: Object.freeze([...evidence]),
  });
}

function makeCount(
  authorityKey: TsdCp007AuthorityKey,
  count: bigint,
  evidence: readonly string[],
): TsdCp007ExecutableSolution {
  const allocation = cp007QlForAuthority(authorityKey);
  return Object.freeze({
    checkpointId: "TSD-CP-007",
    authorityKey,
    permanentQlId: allocation.permanentQlId,
    answerKind: "COUNT",
    unit: "COUNT",
    count,
    evidence: Object.freeze([...evidence]),
  });
}

function timelineInterval(input: TsdCp007ExecutableInput, kind: TsdCp007TimelineIntervalKind): Rational {
  const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
  const speed = positive(required(input.speed, "speed"), "speed");
  if (kind === "POINT_CROSSING") return divide(trainLength, speed);
  const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
  if (kind === "FULL_CROSSING") return divide(add(trainLength, objectLength), speed);
  const occupancyDistance = subtract(objectLength, trainLength);
  if (!isPositive(occupancyDistance)) throw new Error("TSD-CP-007 full occupancy requires fixed object length > train length");
  return divide(occupancyDistance, speed);
}

export function solveCp007Authority(
  authorityKey: TsdCp007AuthorityKey,
  input: TsdCp007ExecutableInput,
): TsdCp007ExecutableSolution {
  switch (authorityKey) {
    case "fixedPointCrossingTime": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const speed = positive(required(input.speed, "speed"), "speed");
      return makeValue(authorityKey, "SECOND", divide(trainLength, speed), ["distance = train length", "time = distance / speed"]);
    }

    case "finiteFixedObjectCrossingTime": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const speed = positive(required(input.speed, "speed"), "speed");
      return makeValue(authorityKey, "SECOND", divide(add(trainLength, objectLength), speed), ["complete crossing distance = train length + object length", "time = distance / speed"]);
    }

    case "trainLengthFromPointCrossing": {
      const speed = positive(required(input.speed, "speed"), "speed");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      return makeValue(authorityKey, "METRE", multiply(speed, pointTime), ["point-crossing distance equals train length", "length = speed × time"]);
    }

    case "trainSpeedFromPointCrossing": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      return makeValue(authorityKey, "METRE_PER_SECOND", divide(trainLength, pointTime), ["point-crossing distance equals train length", "speed = length / time"]);
    }

    case "fixedObjectLengthFromCrossingEvidence": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const mode = required(input.objectLengthEvidenceMode, "objectLengthEvidenceMode");
      if (mode === "DIRECT_SPEED") {
        const speed = positive(required(input.speed, "speed"), "speed");
        const objectLength = subtract(multiply(speed, crossingTime), trainLength);
        if (!isPositive(objectLength)) throw new Error("TSD-CP-007 recovered fixed-object length must be positive");
        return makeValue(authorityKey, "METRE", objectLength, ["total crossing distance = speed × crossing time", "object length = total distance − train length"]);
      }
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("TSD-CP-007 object crossing time must exceed point crossing time");
      const objectLength = divide(multiply(trainLength, extraTime), pointTime);
      return makeValue(authorityKey, "METRE", objectLength, ["point time gives train-length proportion", "object length = train length × extra time / point time"]);
    }

    case "trainLengthFromPointAndObjectTimes": {
      const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("TSD-CP-007 object crossing time must exceed point crossing time");
      const speed = divide(objectLength, extraTime);
      return makeValue(authorityKey, "METRE", multiply(speed, pointTime), ["extra distance is the fixed-object length", "speed = object length / extra time", "train length = speed × point time"]);
    }

    case "trainSpeedFromPointAndObjectTimes": {
      const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
      const pointTime = positive(required(input.pointCrossingTime, "pointCrossingTime"), "pointCrossingTime");
      const crossingTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const extraTime = subtract(crossingTime, pointTime);
      if (!isPositive(extraTime)) throw new Error("TSD-CP-007 object crossing time must exceed point crossing time");
      return makeValue(authorityKey, "METRE_PER_SECOND", divide(objectLength, extraTime), ["extra distance is the fixed-object length", "speed = extra distance / extra time"]);
    }

    case "fixedObjectLengthDifferenceFromCrossingTimes": {
      const speed = positive(required(input.speed, "speed"), "speed");
      const firstTime = positive(required(input.fixedObjectCrossingTime, "fixedObjectCrossingTime"), "fixedObjectCrossingTime");
      const secondTime = positive(required(input.secondFixedObjectCrossingTime, "secondFixedObjectCrossingTime"), "secondFixedObjectCrossingTime");
      return makeValue(authorityKey, "METRE", absRational(multiply(speed, subtract(secondTime, firstTime))), ["train length cancels between the two crossings", "absolute object-length difference = speed × absolute time difference"]);
    }

    case "fullOccupancyDuration": {
      const trainLength = positive(required(input.trainLength, "trainLength"), "trainLength");
      const speed = positive(required(input.speed, "speed"), "speed");
      const target = required(input.occupancyTarget, "occupancyTarget");
      if (target === "DURATION") {
        const objectLength = positive(required(input.fixedObjectLength, "fixedObjectLength"), "fixedObjectLength");
        const occupancyDistance = subtract(objectLength, trainLength);
        if (!isPositive(occupancyDistance)) throw new Error("TSD-CP-007 full occupancy requires fixed object length > train length");
        return makeValue(authorityKey, "SECOND", divide(occupancyDistance, speed), ["full-occupancy travel distance = object length − train length", "duration = distance / speed"]);
      }
      const occupancyDuration = positive(required(input.occupancyDuration, "occupancyDuration"), "occupancyDuration");
      return makeValue(authorityKey, "METRE", add(trainLength, multiply(speed, occupancyDuration)), ["object length − train length = speed × occupancy duration", "object length = train length + speed × duration"]);
    }

    case "trainCrossingEventTimeline": {
      const knownClock = required(input.knownClockSecond, "knownClockSecond");
      const intervalKind = required(input.timelineIntervalKind, "timelineIntervalKind");
      const target = required(input.timelineTarget, "timelineTarget");
      const interval = timelineInterval(input, intervalKind);
      const answer = target === "FORWARD_CLOCK" ? add(knownClock, interval) : subtract(knownClock, interval);
      return makeValue(authorityKey, "CLOCK_SECOND", answer, ["identify the stated front/rear boundary events", `event interval = ${intervalKind}`, target === "FORWARD_CLOCK" ? "later clock = known clock + interval" : "earlier clock = known clock − interval"]);
    }

    case "fixedSpacingPointCount": {
      const target = required(input.spacingTarget, "spacingTarget");
      const includeStart = required(input.includeStartingPoint, "includeStartingPoint");
      if (target === "POINT_COUNT") {
        const distance = positive(required(input.distanceWindow, "distanceWindow"), "distanceWindow");
        const spacing = positive(required(input.spacing, "spacing"), "spacing");
        const completedGaps = floorRational(divide(distance, spacing));
        const count = includeStart ? completedGaps + 1n : completedGaps;
        return makeCount(authorityKey, count, ["equal spacing creates equal gaps", includeStart ? "count = completed gaps + starting point" : "starting point excluded, so count = completed gaps"]);
      }
      const observed = required(input.observedPointCount, "observedPointCount");
      const gaps = includeStart ? observed - 1n : observed;
      if (gaps <= 0n) throw new Error("TSD-CP-007 observed point count implies no positive gap count");
      if (target === "SPACING") {
        const distance = positive(required(input.distanceWindow, "distanceWindow"), "distanceWindow");
        return makeValue(authorityKey, "METRE", divide(distance, rational(gaps)), ["convert point count to gap count", "spacing = total distance / number of gaps"]);
      }
      const spacing = positive(required(input.spacing, "spacing"), "spacing");
      const timeWindow = positive(required(input.timeWindow, "timeWindow"), "timeWindow");
      const distance = multiply(spacing, rational(gaps));
      return makeValue(authorityKey, "METRE_PER_SECOND", divide(distance, timeWindow), ["convert point count to gap count", "distance = spacing × gaps", "speed = distance / time"]);
    }

    default:
      throw new Error(`Unsupported TSD-CP-007 authority: ${authorityKey satisfies never}`);
  }
}
