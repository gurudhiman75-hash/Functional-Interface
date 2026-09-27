import {
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  floorRational,
  moduloRational,
  multiplyRationals,
  negateRational,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";
import { ceilRational } from "./rational-extra";

export type HourMinuteAngleMode =
  | "SMALLER"
  | "REFLEX"
  | "CLOCKWISE_MINUTE_FROM_HOUR"
  | "CLOCKWISE_HOUR_FROM_MINUTE";

export type ClockEventType =
  | "COINCIDENCE"
  | "OPPOSITION"
  | "RIGHT_ANGLE"
  | "STRAIGHT_LINE"
  | "ARBITRARY_ANGLE";

export interface ExactTimeInterval {
  startSeconds: ExactRational;
  endSeconds: ExactRational;
  includeStart: boolean;
  includeEnd: boolean;
}

export interface ClockEventRoot {
  timeSeconds: ExactRational;
  clockwiseMinuteFromHourDeg: ExactRational;
  smallerAngleDeg: ExactRational;
  eventType: ClockEventType;
  branch: string;
}

export interface ClockEventAgreement {
  analytic: ClockEventRoot[];
  enumerated: ClockEventRoot[];
  agreement: boolean;
}

export const HOUR_MINUTE_RELATIVE_RATE_DEG_PER_SECOND = exactRational(11, 120);
export const HOUR_MINUTE_RELATIVE_CYCLE_SECONDS = exactRational(43_200, 11);

function normalizePhase(phaseDegrees: ExactRationalInput): ExactRational {
  return moduloRational(phaseDegrees, 360);
}

function smallerFromPhase(phaseDegrees: ExactRationalInput): ExactRational {
  const phase = normalizePhase(phaseDegrees);
  const complement = subtractRationals(360, phase);
  return compareRationals(phase, complement) <= 0 ? phase : complement;
}

function eventTypeFromPhase(
  phaseDegrees: ExactRationalInput,
  requestedType: ClockEventType,
): ClockEventType {
  const phase = normalizePhase(phaseDegrees);
  if (rationalsEqual(phase, 0)) {
    return "COINCIDENCE";
  }
  if (rationalsEqual(phase, 180)) {
    return "OPPOSITION";
  }
  if (rationalsEqual(smallerFromPhase(phase), 90)) {
    return "RIGHT_ANGLE";
  }
  return requestedType;
}

export function exactTimeInterval(input: {
  startSeconds: ExactRationalInput;
  endSeconds: ExactRationalInput;
  includeStart?: boolean;
  includeEnd?: boolean;
}): ExactTimeInterval {
  const startSeconds = exactRational(
    typeof input.startSeconds === "object"
      ? input.startSeconds.numerator
      : input.startSeconds,
    typeof input.startSeconds === "object"
      ? input.startSeconds.denominator
      : 1,
  );
  const endSeconds = exactRational(
    typeof input.endSeconds === "object"
      ? input.endSeconds.numerator
      : input.endSeconds,
    typeof input.endSeconds === "object"
      ? input.endSeconds.denominator
      : 1,
  );
  if (compareRationals(startSeconds, endSeconds) > 0) {
    throw new Error("Clock event interval start must not exceed its end.");
  }
  return {
    startSeconds,
    endSeconds,
    includeStart: input.includeStart ?? false,
    includeEnd: input.includeEnd ?? true,
  };
}

function intervalContains(
  interval: ExactTimeInterval,
  value: ExactRationalInput,
): boolean {
  const lower = compareRationals(value, interval.startSeconds);
  const upper = compareRationals(value, interval.endSeconds);
  return (
    (lower > 0 || (lower === 0 && interval.includeStart)) &&
    (upper < 0 || (upper === 0 && interval.includeEnd))
  );
}

function branchPhases(
  targetAngleDeg: ExactRationalInput,
  angleMode: HourMinuteAngleMode,
): { phase: ExactRational; branch: string }[] {
  const target = normalizePhase(targetAngleDeg);

  if (angleMode === "CLOCKWISE_MINUTE_FROM_HOUR") {
    return [{ phase: target, branch: "DIRECTED_MINUTE_FROM_HOUR" }];
  }
  if (angleMode === "CLOCKWISE_HOUR_FROM_MINUTE") {
    return [
      {
        phase: normalizePhase(subtractRationals(360, target)),
        branch: "DIRECTED_HOUR_FROM_MINUTE",
      },
    ];
  }

  if (angleMode === "SMALLER") {
    if (compareRationals(target, 180) > 0) {
      throw new Error("Smaller-angle target must lie in 0..180 degrees.");
    }
    if (rationalsEqual(target, 0) || rationalsEqual(target, 180)) {
      return [{ phase: target, branch: "UNIQUE_SMALLER_BRANCH" }];
    }
    return [
      { phase: target, branch: "MINUTE_AHEAD" },
      {
        phase: subtractRationals(360, target),
        branch: "HOUR_AHEAD",
      },
    ];
  }

  if (compareRationals(target, 180) < 0 || compareRationals(target, 360) >= 0) {
    throw new Error("Reflex-angle target must lie in 180..360 degrees.");
  }
  if (rationalsEqual(target, 180)) {
    return [{ phase: exactRational(180), branch: "UNIQUE_REFLEX_BRANCH" }];
  }
  const smaller = subtractRationals(360, target);
  return [
    { phase: target, branch: "MINUTE_AHEAD_REFLEX" },
    { phase: smaller, branch: "HOUR_AHEAD_REFLEX" },
  ];
}

function timeForPhaseAndTurn(
  phaseDegrees: ExactRationalInput,
  turn: bigint,
): ExactRational {
  return divideRationals(
    multiplyRationals(
      addRationals(phaseDegrees, multiplyRationals(360, turn)),
      120,
    ),
    11,
  );
}

function turnExpressionAt(
  timeSeconds: ExactRationalInput,
  phaseDegrees: ExactRationalInput,
): ExactRational {
  return divideRationals(
    subtractRationals(
      divideRationals(multiplyRationals(11, timeSeconds), 120),
      phaseDegrees,
    ),
    360,
  );
}

function rootKey(root: ClockEventRoot): string {
  return `${root.timeSeconds.numerator}/${root.timeSeconds.denominator}`;
}

function sortAndDedupeRoots(roots: ClockEventRoot[]): ClockEventRoot[] {
  const byTime = new Map<string, ClockEventRoot>();
  for (const root of roots) {
    const key = rootKey(root);
    const existing = byTime.get(key);
    if (!existing) {
      byTime.set(key, root);
    } else if (existing.eventType === "ARBITRARY_ANGLE" && root.eventType !== "ARBITRARY_ANGLE") {
      byTime.set(key, root);
    }
  }
  return [...byTime.values()].sort((left, right) =>
    compareRationals(left.timeSeconds, right.timeSeconds),
  );
}

/** Analytic root solver for every matching hour-minute event in the interval. */
export function solveHourMinuteAngleEventsExact(input: {
  targetAngleDeg: ExactRationalInput;
  angleMode: HourMinuteAngleMode;
  interval: ExactTimeInterval;
  requestedEventType?: ClockEventType;
}): ClockEventRoot[] {
  const roots: ClockEventRoot[] = [];
  const requestedEventType = input.requestedEventType ?? "ARBITRARY_ANGLE";

  for (const branch of branchPhases(input.targetAngleDeg, input.angleMode)) {
    let firstTurn = ceilRational(
      turnExpressionAt(input.interval.startSeconds, branch.phase),
    );
    let lastTurn = floorRational(
      turnExpressionAt(input.interval.endSeconds, branch.phase),
    );

    const firstTime = timeForPhaseAndTurn(branch.phase, firstTurn);
    if (!input.interval.includeStart && rationalsEqual(firstTime, input.interval.startSeconds)) {
      firstTurn += 1n;
    }
    const lastTime = timeForPhaseAndTurn(branch.phase, lastTurn);
    if (!input.interval.includeEnd && rationalsEqual(lastTime, input.interval.endSeconds)) {
      lastTurn -= 1n;
    }

    for (let turn = firstTurn; turn <= lastTurn; turn += 1n) {
      const timeSeconds = timeForPhaseAndTurn(branch.phase, turn);
      if (!intervalContains(input.interval, timeSeconds)) {
        continue;
      }
      const phase = normalizePhase(branch.phase);
      roots.push({
        timeSeconds,
        clockwiseMinuteFromHourDeg: phase,
        smallerAngleDeg: smallerFromPhase(phase),
        eventType: eventTypeFromPhase(phase, requestedEventType),
        branch: branch.branch,
      });
    }
  }

  return sortAndDedupeRoots(roots);
}

/**
 * Independent cycle enumerator. It starts from one phase occurrence and advances
 * by the exact relative-cycle period; it does not call the analytic solver.
 */
export function enumerateHourMinuteAngleEventsExact(input: {
  targetAngleDeg: ExactRationalInput;
  angleMode: HourMinuteAngleMode;
  interval: ExactTimeInterval;
  requestedEventType?: ClockEventType;
}): ClockEventRoot[] {
  const roots: ClockEventRoot[] = [];
  const requestedEventType = input.requestedEventType ?? "ARBITRARY_ANGLE";

  for (const branch of branchPhases(input.targetAngleDeg, input.angleMode)) {
    const base = divideRationals(multiplyRationals(branch.phase, 120), 11);
    let cycleIndex = floorRational(
      divideRationals(
        subtractRationals(input.interval.startSeconds, base),
        HOUR_MINUTE_RELATIVE_CYCLE_SECONDS,
      ),
    ) - 1n;

    const maximumIterations = 100_000;
    let iterations = 0;
    while (iterations < maximumIterations) {
      const timeSeconds = addRationals(
        base,
        multiplyRationals(HOUR_MINUTE_RELATIVE_CYCLE_SECONDS, cycleIndex),
      );
      if (compareRationals(timeSeconds, input.interval.endSeconds) > 0) {
        break;
      }
      if (intervalContains(input.interval, timeSeconds)) {
        const actualPhase = normalizePhase(
          multiplyRationals(HOUR_MINUTE_RELATIVE_RATE_DEG_PER_SECOND, timeSeconds),
        );
        if (rationalsEqual(actualPhase, normalizePhase(branch.phase))) {
          roots.push({
            timeSeconds,
            clockwiseMinuteFromHourDeg: actualPhase,
            smallerAngleDeg: smallerFromPhase(actualPhase),
            eventType: eventTypeFromPhase(actualPhase, requestedEventType),
            branch: `ENUM_${branch.branch}`,
          });
        }
      }
      cycleIndex += 1n;
      iterations += 1;
    }

    if (iterations >= maximumIterations) {
      throw new Error("Clock event enumeration exceeded its safety limit.");
    }
  }

  return sortAndDedupeRoots(roots);
}

export function verifyHourMinuteAngleEventsExact(input: {
  targetAngleDeg: ExactRationalInput;
  angleMode: HourMinuteAngleMode;
  interval: ExactTimeInterval;
  requestedEventType?: ClockEventType;
}): ClockEventAgreement {
  const analytic = solveHourMinuteAngleEventsExact(input);
  const enumerated = enumerateHourMinuteAngleEventsExact(input);
  const analyticKeys = analytic.map(rootKey);
  const enumeratedKeys = enumerated.map(rootKey);
  return {
    analytic,
    enumerated,
    agreement:
      analyticKeys.length === enumeratedKeys.length &&
      analyticKeys.every((value, index) => value === enumeratedKeys[index]),
  };
}

export function standardEventRootsExact(
  eventType: Exclude<ClockEventType, "ARBITRARY_ANGLE">,
  interval: ExactTimeInterval,
): ClockEventRoot[] {
  switch (eventType) {
    case "COINCIDENCE":
      return solveHourMinuteAngleEventsExact({
        targetAngleDeg: 0,
        angleMode: "SMALLER",
        interval,
        requestedEventType: "COINCIDENCE",
      });
    case "OPPOSITION":
      return solveHourMinuteAngleEventsExact({
        targetAngleDeg: 180,
        angleMode: "SMALLER",
        interval,
        requestedEventType: "OPPOSITION",
      });
    case "RIGHT_ANGLE":
      return solveHourMinuteAngleEventsExact({
        targetAngleDeg: 90,
        angleMode: "SMALLER",
        interval,
        requestedEventType: "RIGHT_ANGLE",
      });
    case "STRAIGHT_LINE":
      return sortAndDedupeRoots([
        ...standardEventRootsExact("COINCIDENCE", interval),
        ...standardEventRootsExact("OPPOSITION", interval),
      ]).map((root) => ({ ...root, eventType: "STRAIGHT_LINE" }));
  }
}

export function eventCountExact(input: {
  eventType: Exclude<ClockEventType, "ARBITRARY_ANGLE">;
  interval: ExactTimeInterval;
}): number {
  return standardEventRootsExact(input.eventType, input.interval).length;
}

export function nthEventAfterExact(input: {
  eventType: Exclude<ClockEventType, "ARBITRARY_ANGLE">;
  anchorSeconds: ExactRationalInput;
  occurrence: number;
}): ClockEventRoot {
  if (!Number.isInteger(input.occurrence) || input.occurrence < 1) {
    throw new Error("Clock event occurrence must be a positive integer.");
  }
  const interval = exactTimeInterval({
    startSeconds: input.anchorSeconds,
    endSeconds: addRationals(input.anchorSeconds, 43_200 * (input.occurrence + 2)),
    includeStart: false,
    includeEnd: true,
  });
  const roots = standardEventRootsExact(input.eventType, interval);
  const root = roots[input.occurrence - 1];
  if (!root) {
    throw new Error("Requested clock event occurrence was not found.");
  }
  return root;
}

export function nearestSpecialEventExact(input: {
  eventType: Exclude<ClockEventType, "ARBITRARY_ANGLE">;
  anchorSeconds: ExactRationalInput;
  searchRadiusSeconds?: ExactRationalInput;
}): ClockEventRoot {
  const radius = input.searchRadiusSeconds ?? 43_200;
  const interval = exactTimeInterval({
    startSeconds: subtractRationals(input.anchorSeconds, radius),
    endSeconds: addRationals(input.anchorSeconds, radius),
    includeStart: true,
    includeEnd: true,
  });
  const roots = standardEventRootsExact(input.eventType, interval);
  if (roots.length === 0) {
    throw new Error("No special clock event found in search interval.");
  }
  return roots.reduce((best, candidate) => {
    const bestDistance = best.timeSeconds.numerator * 1n;
    void bestDistance;
    const candidateDelta = subtractRationals(candidate.timeSeconds, input.anchorSeconds);
    const bestDelta = subtractRationals(best.timeSeconds, input.anchorSeconds);
    const absCandidate = candidateDelta.numerator < 0n
      ? negateRational(candidateDelta)
      : candidateDelta;
    const absBest = bestDelta.numerator < 0n ? negateRational(bestDelta) : bestDelta;
    return compareRationals(absCandidate, absBest) < 0 ? candidate : best;
  });
}

export function classifyHourMinuteEventAtSecondsExact(
  timeSeconds: ExactRationalInput,
): ClockEventType | "OTHER" {
  const phase = normalizePhase(
    multiplyRationals(HOUR_MINUTE_RELATIVE_RATE_DEG_PER_SECOND, timeSeconds),
  );
  if (rationalsEqual(phase, 0)) {
    return "COINCIDENCE";
  }
  if (rationalsEqual(phase, 180)) {
    return "OPPOSITION";
  }
  if (rationalsEqual(smallerFromPhase(phase), 90)) {
    return "RIGHT_ANGLE";
  }
  return "OTHER";
}
