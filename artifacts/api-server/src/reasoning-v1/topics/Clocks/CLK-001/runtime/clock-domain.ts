import {
  absoluteRational,
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  floorRational,
  moduloRational,
  multiplyRationals,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "../../../../../foundation/temporal";

export type HandName = "HOUR" | "MINUTE" | "SECOND";
export type AngleContract =
  | "SMALLER"
  | "REFLEX"
  | "CLOCKWISE_HOUR_TO_MINUTE"
  | "CLOCKWISE_MINUTE_TO_HOUR";
export type SpecialEvent = "COINCIDENCE" | "OPPOSITION" | "RIGHT_ANGLE" | "STRAIGHT_LINE";

export interface ExactInterval {
  readonly startSeconds: ExactRational;
  readonly endSeconds: ExactRational;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
}

export interface HandAngles {
  readonly hour: ExactRational;
  readonly minute: ExactRational;
  readonly second: ExactRational;
}

export interface EventRoot {
  readonly seconds: ExactRational;
  readonly relativeAngle: ExactRational;
  readonly event: SpecialEvent | "ARBITRARY_ANGLE";
}

export interface FaultyClockModel {
  readonly actualAnchorSeconds: ExactRational;
  readonly displayedAnchorSeconds: ExactRational;
  readonly rate: ExactRational;
}

export interface StrikeEvent {
  readonly index: number;
  readonly secondsFromFirstStrike: ExactRational;
}

const FULL_DIAL = exactRational(360);
const HALF_DIAL = exactRational(180);
const QUARTER_DIAL = exactRational(90);
const TWELVE_HOURS_SECONDS = exactRational(43_200);

export function mod360(value: ExactRationalInput): ExactRational {
  return moduloRational(value, FULL_DIAL);
}

export function mod12HoursSeconds(value: ExactRationalInput): ExactRational {
  return moduloRational(value, TWELVE_HOURS_SECONDS);
}

export function handRateDegreesPerSecond(hand: HandName): ExactRational {
  switch (hand) {
    case "HOUR":
      return exactRational(1, 120);
    case "MINUTE":
      return exactRational(1, 10);
    case "SECOND":
      return exactRational(6);
  }
}

export function handMovementDegrees(
  hand: HandName,
  elapsedSeconds: ExactRationalInput,
): ExactRational {
  return multiplyRationals(handRateDegreesPerSecond(hand), elapsedSeconds);
}

export function durationForHandMovement(
  hand: HandName,
  angleDegrees: ExactRationalInput,
): ExactRational {
  return divideRationals(angleDegrees, handRateDegreesPerSecond(hand));
}

export function revolutionsForHand(
  hand: HandName,
  elapsedSeconds: ExactRationalInput,
): ExactRational {
  return divideRationals(handMovementDegrees(hand, elapsedSeconds), FULL_DIAL);
}

export function handTipDistance(
  radius: ExactRationalInput,
  angleDegrees: ExactRationalInput,
): { coefficientOfPi: ExactRational } {
  return {
    coefficientOfPi: divideRationals(
      multiplyRationals(multiplyRationals(2, radius), angleDegrees),
      FULL_DIAL,
    ),
  };
}

export function anglesAtAbsoluteSeconds(
  elapsedSecondsFromTwelve: ExactRationalInput,
): HandAngles {
  const t = mod12HoursSeconds(elapsedSecondsFromTwelve);
  return {
    hour: mod360(divideRationals(t, 120)),
    minute: mod360(divideRationals(t, 10)),
    second: mod360(multiplyRationals(t, 6)),
  };
}

export function clockwiseDifference(
  fromAngle: ExactRationalInput,
  toAngle: ExactRationalInput,
): ExactRational {
  return mod360(subtractRationals(toAngle, fromAngle));
}

export function smallerAngle(
  leftAngle: ExactRationalInput,
  rightAngle: ExactRationalInput,
): ExactRational {
  const clockwise = clockwiseDifference(leftAngle, rightAngle);
  const complement = subtractRationals(FULL_DIAL, clockwise);
  return compareRationals(clockwise, complement) <= 0 ? clockwise : complement;
}

export function reflexAngle(
  leftAngle: ExactRationalInput,
  rightAngle: ExactRationalInput,
): ExactRational {
  const smaller = smallerAngle(leftAngle, rightAngle);
  return rationalsEqual(smaller, 0)
    ? exactRational(0)
    : subtractRationals(FULL_DIAL, smaller);
}

export function hourMinuteAngle(
  elapsedSecondsFromTwelve: ExactRationalInput,
  contract: AngleContract,
): ExactRational {
  const angles = anglesAtAbsoluteSeconds(elapsedSecondsFromTwelve);
  switch (contract) {
    case "SMALLER":
      return smallerAngle(angles.hour, angles.minute);
    case "REFLEX":
      return reflexAngle(angles.hour, angles.minute);
    case "CLOCKWISE_HOUR_TO_MINUTE":
      return clockwiseDifference(angles.hour, angles.minute);
    case "CLOCKWISE_MINUTE_TO_HOUR":
      return clockwiseDifference(angles.minute, angles.hour);
  }
}

export function classifyHourMinuteRelation(
  elapsedSecondsFromTwelve: ExactRationalInput,
): "COINCIDE" | "RIGHT" | "OPPOSITE" | "OTHER" {
  const angle = hourMinuteAngle(elapsedSecondsFromTwelve, "SMALLER");
  if (rationalsEqual(angle, 0)) return "COINCIDE";
  if (rationalsEqual(angle, QUARTER_DIAL)) return "RIGHT";
  if (rationalsEqual(angle, HALF_DIAL)) return "OPPOSITE";
  return "OTHER";
}

function intervalContains(interval: ExactInterval, value: ExactRational): boolean {
  const left = compareRationals(value, interval.startSeconds);
  const right = compareRationals(value, interval.endSeconds);
  return (
    (left > 0 || (left === 0 && interval.includeStart)) &&
    (right < 0 || (right === 0 && interval.includeEnd))
  );
}

function uniqueSortedRoots(roots: readonly EventRoot[]): EventRoot[] {
  const sorted = [...roots].sort((a, b) => compareRationals(a.seconds, b.seconds));
  const result: EventRoot[] = [];
  for (const root of sorted) {
    if (!result.some((existing) => rationalsEqual(existing.seconds, root.seconds))) {
      result.push(root);
    }
  }
  return result;
}

export function solveHourMinuteAngleEvents(
  targetSmallerAngle: ExactRationalInput,
  interval: ExactInterval,
): EventRoot[] {
  const theta = absoluteRational(targetSmallerAngle);
  if (compareRationals(theta, HALF_DIAL) > 0) {
    throw new Error("Target smaller angle must be between 0 and 180 degrees.");
  }
  if (compareRationals(interval.endSeconds, interval.startSeconds) < 0) {
    throw new Error("Clock event interval must be ordered.");
  }

  const phaseTargets = rationalsEqual(theta, 0) || rationalsEqual(theta, HALF_DIAL)
    ? [theta]
    : [theta, subtractRationals(FULL_DIAL, theta)];
  const roots: EventRoot[] = [];

  for (const phaseTarget of phaseTargets) {
    const startK = floorRational(
      divideRationals(
        subtractRationals(multiplyRationals(interval.startSeconds, 11), multiplyRationals(phaseTarget, 120)),
        multiplyRationals(FULL_DIAL, 120),
      ),
    ) - 1n;
    const endK = floorRational(
      divideRationals(
        subtractRationals(multiplyRationals(interval.endSeconds, 11), multiplyRationals(phaseTarget, 120)),
        multiplyRationals(FULL_DIAL, 120),
      ),
    ) + 1n;

    for (let k = startK; k <= endK; k += 1n) {
      const seconds = divideRationals(
        multiplyRationals(addRationals(phaseTarget, multiplyRationals(FULL_DIAL, k)), 120),
        11,
      );
      if (intervalContains(interval, seconds)) {
        roots.push({
          seconds,
          relativeAngle: phaseTarget,
          event: rationalsEqual(theta, 0)
            ? "COINCIDENCE"
            : rationalsEqual(theta, HALF_DIAL)
              ? "OPPOSITION"
              : rationalsEqual(theta, QUARTER_DIAL)
                ? "RIGHT_ANGLE"
                : "ARBITRARY_ANGLE",
        });
      }
    }
  }

  return uniqueSortedRoots(roots);
}

export function enumerateHourMinuteAngleEventsIndependently(
  targetSmallerAngle: ExactRationalInput,
  interval: ExactInterval,
): EventRoot[] {
  const theta = absoluteRational(targetSmallerAngle);
  const targets = rationalsEqual(theta, 0) || rationalsEqual(theta, HALF_DIAL)
    ? [theta]
    : [theta, subtractRationals(FULL_DIAL, theta)];
  const roots: EventRoot[] = [];

  for (const target of targets) {
    const cycle = divideRationals(multiplyRationals(FULL_DIAL, 120), 11);
    const first = divideRationals(multiplyRationals(target, 120), 11);
    const minN = floorRational(divideRationals(subtractRationals(interval.startSeconds, first), cycle)) - 1n;
    const maxN = floorRational(divideRationals(subtractRationals(interval.endSeconds, first), cycle)) + 1n;
    for (let n = minN; n <= maxN; n += 1n) {
      const seconds = addRationals(first, multiplyRationals(cycle, n));
      if (intervalContains(interval, seconds)) {
        const phase = mod360(divideRationals(multiplyRationals(seconds, 11), 120));
        if (rationalsEqual(phase, target)) {
          roots.push({
            seconds,
            relativeAngle: target,
            event: rationalsEqual(theta, 0)
              ? "COINCIDENCE"
              : rationalsEqual(theta, HALF_DIAL)
                ? "OPPOSITION"
                : rationalsEqual(theta, QUARTER_DIAL)
                  ? "RIGHT_ANGLE"
                  : "ARBITRARY_ANGLE",
          });
        }
      }
    }
  }
  return uniqueSortedRoots(roots);
}

export function verifyEventSolvers(
  targetSmallerAngle: ExactRationalInput,
  interval: ExactInterval,
): { analytic: EventRoot[]; enumerated: EventRoot[]; agreement: boolean } {
  const analytic = solveHourMinuteAngleEvents(targetSmallerAngle, interval);
  const enumerated = enumerateHourMinuteAngleEventsIndependently(targetSmallerAngle, interval);
  const agreement =
    analytic.length === enumerated.length &&
    analytic.every((root, index) => rationalsEqual(root.seconds, enumerated[index]!.seconds));
  return { analytic, enumerated, agreement };
}

export function specialEventRoots(
  event: SpecialEvent,
  interval: ExactInterval,
): EventRoot[] {
  switch (event) {
    case "COINCIDENCE":
      return solveHourMinuteAngleEvents(0, interval);
    case "OPPOSITION":
      return solveHourMinuteAngleEvents(180, interval);
    case "RIGHT_ANGLE":
      return solveHourMinuteAngleEvents(90, interval);
    case "STRAIGHT_LINE":
      return uniqueSortedRoots([
        ...solveHourMinuteAngleEvents(0, interval),
        ...solveHourMinuteAngleEvents(180, interval),
      ]);
  }
}

export function nthSpecialEventAfter(
  event: SpecialEvent,
  anchorSeconds: ExactRationalInput,
  occurrence: number,
): EventRoot {
  if (!Number.isInteger(occurrence) || occurrence < 1) {
    throw new Error("Occurrence must be a positive integer.");
  }
  let horizon = exactRational(43_200);
  while (true) {
    const interval: ExactInterval = {
      startSeconds: exactRational(
        typeof anchorSeconds === "object" ? anchorSeconds.numerator : BigInt(anchorSeconds),
        typeof anchorSeconds === "object" ? anchorSeconds.denominator : 1n,
      ),
      endSeconds: addRationals(anchorSeconds, horizon),
      includeStart: false,
      includeEnd: true,
    };
    const roots = specialEventRoots(event, interval);
    if (roots.length >= occurrence) return roots[occurrence - 1]!;
    horizon = multiplyRationals(horizon, 2);
  }
}

export function createFaultyClockModel(input: {
  actualAnchorSeconds?: ExactRationalInput;
  displayedAnchorSeconds?: ExactRationalInput;
  gainOrLossPerActualPeriod: ExactRationalInput;
  actualPeriodSeconds: ExactRationalInput;
}): FaultyClockModel {
  const period = exactRational(
    typeof input.actualPeriodSeconds === "object" ? input.actualPeriodSeconds.numerator : BigInt(input.actualPeriodSeconds),
    typeof input.actualPeriodSeconds === "object" ? input.actualPeriodSeconds.denominator : 1n,
  );
  if (compareRationals(period, 0) <= 0) throw new Error("Faulty-clock period must be positive.");
  const rate = divideRationals(addRationals(period, input.gainOrLossPerActualPeriod), period);
  if (compareRationals(rate, 0) <= 0) throw new Error("Faulty-clock rate must be positive.");
  return {
    actualAnchorSeconds: input.actualAnchorSeconds === undefined ? exactRational(0) : exactRational(
      typeof input.actualAnchorSeconds === "object" ? input.actualAnchorSeconds.numerator : BigInt(input.actualAnchorSeconds),
      typeof input.actualAnchorSeconds === "object" ? input.actualAnchorSeconds.denominator : 1n,
    ),
    displayedAnchorSeconds: input.displayedAnchorSeconds === undefined ? exactRational(0) : exactRational(
      typeof input.displayedAnchorSeconds === "object" ? input.displayedAnchorSeconds.numerator : BigInt(input.displayedAnchorSeconds),
      typeof input.displayedAnchorSeconds === "object" ? input.displayedAnchorSeconds.denominator : 1n,
    ),
    rate,
  };
}

export function displayedTimeFromActual(
  model: FaultyClockModel,
  actualSeconds: ExactRationalInput,
): ExactRational {
  return addRationals(
    model.displayedAnchorSeconds,
    multiplyRationals(model.rate, subtractRationals(actualSeconds, model.actualAnchorSeconds)),
  );
}

export function actualTimeFromDisplayed(
  model: FaultyClockModel,
  displayedSeconds: ExactRationalInput,
): ExactRational {
  return addRationals(
    model.actualAnchorSeconds,
    divideRationals(subtractRationals(displayedSeconds, model.displayedAnchorSeconds), model.rate),
  );
}

export function faultyClockErrorAtActual(
  model: FaultyClockModel,
  actualSeconds: ExactRationalInput,
): ExactRational {
  return subtractRationals(displayedTimeFromActual(model, actualSeconds), actualSeconds);
}

export function nextCorrectActualTimeOnTwelveHourDial(
  model: FaultyClockModel,
): ExactRational | null {
  const rateDifference = subtractRationals(model.rate, 1);
  const initialError = subtractRationals(model.displayedAnchorSeconds, model.actualAnchorSeconds);
  if (rationalsEqual(rateDifference, 0)) {
    return rationalsEqual(mod12HoursSeconds(initialError), 0) ? model.actualAnchorSeconds : null;
  }

  for (let k = -10_000; k <= 10_000; k += 1) {
    const elapsed = divideRationals(
      subtractRationals(multiplyRationals(TWELVE_HOURS_SECONDS, k), initialError),
      rateDifference,
    );
    if (compareRationals(elapsed, 0) > 0) {
      return addRationals(model.actualAnchorSeconds, elapsed);
    }
  }
  return null;
}

export function actualIntervalBetweenDisplayedCoincidences(
  model: FaultyClockModel,
): ExactRational {
  const displayedCoincidenceInterval = divideRationals(exactRational(43_200), 11);
  return divideRationals(displayedCoincidenceInterval, model.rate);
}

export function inferClockRateFromActualDisplayedEventInterval(
  displayedEventIntervalSeconds: ExactRationalInput,
  actualEventIntervalSeconds: ExactRationalInput,
): ExactRational {
  return divideRationals(displayedEventIntervalSeconds, actualEventIntervalSeconds);
}

export function strikeTimeline(
  strikeCount: number,
  gapSeconds: ExactRationalInput,
): StrikeEvent[] {
  if (!Number.isInteger(strikeCount) || strikeCount < 1) {
    throw new Error("Strike count must be a positive integer.");
  }
  if (compareRationals(gapSeconds, 0) < 0) {
    throw new Error("Strike gap cannot be negative.");
  }
  return Array.from({ length: strikeCount }, (_, index) => ({
    index: index + 1,
    secondsFromFirstStrike: multiplyRationals(gapSeconds, index),
  }));
}

export function durationForStrikes(
  strikeCount: number,
  gapSeconds: ExactRationalInput,
): ExactRational {
  if (strikeCount < 1) throw new Error("Strike count must be positive.");
  return multiplyRationals(gapSeconds, strikeCount - 1);
}

export function gapFromStrikeDuration(
  strikeCount: number,
  totalDurationSeconds: ExactRationalInput,
): ExactRational {
  if (strikeCount < 2) throw new Error("At least two strikes are required to infer a gap.");
  return divideRationals(totalDurationSeconds, strikeCount - 1);
}

export function transferStrikeDuration(
  knownStrikeCount: number,
  knownDurationSeconds: ExactRationalInput,
  targetStrikeCount: number,
): ExactRational {
  return durationForStrikes(targetStrikeCount, gapFromStrikeDuration(knownStrikeCount, knownDurationSeconds));
}

export function totalHourlyStrikesInclusive(startHour: number, endHour: number): number {
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour) || startHour < 1 || startHour > 12 || endHour < 1 || endHour > 12) {
    throw new Error("Hourly strike range must use hours 1 through 12.");
  }
  let total = 0;
  let hour = startHour;
  while (true) {
    total += hour;
    if (hour === endHour) break;
    hour = hour === 12 ? 1 : hour + 1;
  }
  return total;
}

export function totalHourlyStrikesInTwelveHours(): number {
  return totalHourlyStrikesInclusive(1, 12);
}

export function mirrorTimeSeconds(actualDialSeconds: ExactRationalInput): ExactRational {
  return mod12HoursSeconds(subtractRationals(TWELVE_HOURS_SECONDS, actualDialSeconds));
}

export function reflectedVerticalAngle(angle: ExactRationalInput): ExactRational {
  return mod360(subtractRationals(FULL_DIAL, angle));
}

export function verifyMirrorTimeGeometry(actualDialSeconds: ExactRationalInput): boolean {
  const actual = anglesAtAbsoluteSeconds(actualDialSeconds);
  const mirrored = anglesAtAbsoluteSeconds(mirrorTimeSeconds(actualDialSeconds));
  return (
    rationalsEqual(mirrored.hour, reflectedVerticalAngle(actual.hour)) &&
    rationalsEqual(mirrored.minute, reflectedVerticalAngle(actual.minute))
  );
}

export function readClockDiagramFromAngles(input: {
  hourAngle: ExactRationalInput;
  minuteAngle: ExactRationalInput;
}): ExactRational | null {
  const candidateSeconds = multiplyRationals(mod360(input.minuteAngle), 10);
  const angles = anglesAtAbsoluteSeconds(candidateSeconds);
  return rationalsEqual(angles.hour, mod360(input.hourAngle)) && rationalsEqual(angles.minute, mod360(input.minuteAngle))
    ? candidateSeconds
    : null;
}

export function solveHandInterchange(originalDialSeconds: ExactRationalInput): ExactRational[] {
  const original = anglesAtAbsoluteSeconds(originalDialSeconds);
  const candidates: ExactRational[] = [];
  for (let k = 0; k < 12; k += 1) {
    const candidate = addRationals(multiplyRationals(original.hour, 10), multiplyRationals(3_600, k));
    const normalized = mod12HoursSeconds(candidate);
    const angles = anglesAtAbsoluteSeconds(normalized);
    if (
      rationalsEqual(angles.hour, original.minute) &&
      rationalsEqual(angles.minute, original.hour) &&
      !candidates.some((value) => rationalsEqual(value, normalized))
    ) {
      candidates.push(normalized);
    }
  }
  return candidates.sort((a, b) => compareRationals(a, b));
}

export function angleOnFaultyClockAtActualTime(
  model: FaultyClockModel,
  actualSeconds: ExactRationalInput,
  contract: AngleContract,
): ExactRational {
  return hourMinuteAngle(displayedTimeFromActual(model, actualSeconds), contract);
}

export function actualTimeOfDisplayedEvent(
  model: FaultyClockModel,
  displayedEventSeconds: ExactRationalInput,
): ExactRational {
  return actualTimeFromDisplayed(model, displayedEventSeconds);
}
