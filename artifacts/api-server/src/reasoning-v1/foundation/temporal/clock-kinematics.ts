import {
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  moduloRational,
  multiplyRationals,
  rationalToNumber,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";
import {
  CLOCK_CYCLE_SECONDS,
  clockTimeToTotalSecondsExact,
  normalizeClockTimeInput,
  type ClockTime12Input,
} from "./clock-time";

export const CLOCK_DIAL_DEGREES = exactRational(360);
export const MINUTE_HAND_CYCLE_SECONDS = exactRational(3_600);
export const SECOND_HAND_CYCLE_SECONDS = exactRational(60);

export interface ExactClockHandAngles {
  hourAngleDeg: ExactRational;
  minuteAngleDeg: ExactRational;
  secondAngleDeg: ExactRational;
}

export interface NumericClockHandAngles {
  hourAngleDeg: number;
  minuteAngleDeg: number;
  secondAngleDeg: number;
}

export interface ExactHourMinuteAngleSnapshot {
  handAngles: ExactClockHandAngles;
  clockwiseMinuteFromHourDeg: ExactRational;
  clockwiseHourFromMinuteDeg: ExactRational;
  smallerAngleDeg: ExactRational;
  reflexAngleDeg: ExactRational;
}

export interface ClockKinematicsCrossCheck {
  ok: boolean;
  direct: ExactClockHandAngles;
  cycleDerived: ExactClockHandAngles;
}

/** Angles are measured clockwise from 12. */
export function clockTimeToHandAnglesExact(
  time: ClockTime12Input,
): ExactClockHandAngles {
  const normalized = normalizeClockTimeInput(time);
  const zeroBasedHour = normalized.hour % 12;

  const hourAngle = addRationals(
    addRationals(zeroBasedHour * 30, exactRational(normalized.minute, 2)),
    divideRationals(normalized.second, 120),
  );
  const minuteAngle = addRationals(
    normalized.minute * 6,
    divideRationals(normalized.second, 10),
  );
  const secondAngle = multiplyRationals(normalized.second, 6);

  return {
    hourAngleDeg: moduloRational(hourAngle, CLOCK_DIAL_DEGREES),
    minuteAngleDeg: moduloRational(minuteAngle, CLOCK_DIAL_DEGREES),
    secondAngleDeg: moduloRational(secondAngle, CLOCK_DIAL_DEGREES),
  };
}

/** Independent proof path based on each hand's full-cycle period. */
export function clockTimeToHandAnglesByCycleExact(
  time: ClockTime12Input,
): ExactClockHandAngles {
  const elapsedSeconds = clockTimeToTotalSecondsExact(time);
  const derive = (periodSeconds: ExactRational) =>
    moduloRational(
      multiplyRationals(
        divideRationals(elapsedSeconds, periodSeconds),
        CLOCK_DIAL_DEGREES,
      ),
      CLOCK_DIAL_DEGREES,
    );

  return {
    hourAngleDeg: derive(CLOCK_CYCLE_SECONDS),
    minuteAngleDeg: derive(MINUTE_HAND_CYCLE_SECONDS),
    secondAngleDeg: derive(SECOND_HAND_CYCLE_SECONDS),
  };
}

export function exactClockHandAnglesEqual(
  left: ExactClockHandAngles,
  right: ExactClockHandAngles,
): boolean {
  return (
    rationalsEqual(left.hourAngleDeg, right.hourAngleDeg) &&
    rationalsEqual(left.minuteAngleDeg, right.minuteAngleDeg) &&
    rationalsEqual(left.secondAngleDeg, right.secondAngleDeg)
  );
}

export function validateClockKinematicsCrossCheck(
  time: ClockTime12Input,
): ClockKinematicsCrossCheck {
  const direct = clockTimeToHandAnglesExact(time);
  const cycleDerived = clockTimeToHandAnglesByCycleExact(time);
  return {
    ok: exactClockHandAnglesEqual(direct, cycleDerived),
    direct,
    cycleDerived,
  };
}

export function clockwiseSeparationExact(
  fromAngleDeg: ExactRationalInput,
  toAngleDeg: ExactRationalInput,
): ExactRational {
  return moduloRational(
    subtractRationals(toAngleDeg, fromAngleDeg),
    CLOCK_DIAL_DEGREES,
  );
}

export function smallerSeparationExact(
  leftAngleDeg: ExactRationalInput,
  rightAngleDeg: ExactRationalInput,
): ExactRational {
  const clockwise = clockwiseSeparationExact(leftAngleDeg, rightAngleDeg);
  const complement = subtractRationals(CLOCK_DIAL_DEGREES, clockwise);
  return compareRationals(clockwise, complement) <= 0 ? clockwise : complement;
}

export function reflexSeparationExact(
  leftAngleDeg: ExactRationalInput,
  rightAngleDeg: ExactRationalInput,
): ExactRational {
  const clockwise = clockwiseSeparationExact(leftAngleDeg, rightAngleDeg);
  if (rationalsEqual(clockwise, 0)) {
    return exactRational(0);
  }
  const complement = subtractRationals(CLOCK_DIAL_DEGREES, clockwise);
  return compareRationals(clockwise, complement) >= 0 ? clockwise : complement;
}

export function hourMinuteAngleSnapshotExact(
  time: ClockTime12Input,
): ExactHourMinuteAngleSnapshot {
  const handAngles = clockTimeToHandAnglesExact(time);
  return {
    handAngles,
    clockwiseMinuteFromHourDeg: clockwiseSeparationExact(
      handAngles.hourAngleDeg,
      handAngles.minuteAngleDeg,
    ),
    clockwiseHourFromMinuteDeg: clockwiseSeparationExact(
      handAngles.minuteAngleDeg,
      handAngles.hourAngleDeg,
    ),
    smallerAngleDeg: smallerSeparationExact(
      handAngles.hourAngleDeg,
      handAngles.minuteAngleDeg,
    ),
    reflexAngleDeg: reflexSeparationExact(
      handAngles.hourAngleDeg,
      handAngles.minuteAngleDeg,
    ),
  };
}

export function clockTimeToHandAnglesNumbers(
  time: ClockTime12Input,
): NumericClockHandAngles {
  const exact = clockTimeToHandAnglesExact(time);
  return {
    hourAngleDeg: rationalToNumber(exact.hourAngleDeg),
    minuteAngleDeg: rationalToNumber(exact.minuteAngleDeg),
    secondAngleDeg: rationalToNumber(exact.secondAngleDeg),
  };
}
