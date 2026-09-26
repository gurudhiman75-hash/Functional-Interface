import {
  moduloRational,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";
import {
  CLOCK_CYCLE_SECONDS,
  totalSecondsToClockTimeExact,
  type ExactClockTime12,
} from "./clock-time";
import {
  clockTimeToHandAnglesExact,
  type ExactClockHandAngles,
} from "./clock-kinematics";

export interface ExactMirrorClockProof {
  sourceSeconds: ExactRational;
  mirrorSeconds: ExactRational;
  sourceTime: ExactClockTime12;
  mirrorTime: ExactClockTime12;
  reflectedAngles: ExactClockHandAngles;
  mirrorTimeAngles: ExactClockHandAngles;
  agreement: boolean;
}

export function mirrorClockSecondsExact(
  sourceSeconds: ExactRationalInput,
): ExactRational {
  return moduloRational(
    subtractRationals(CLOCK_CYCLE_SECONDS, sourceSeconds),
    CLOCK_CYCLE_SECONDS,
  );
}

export function actualClockSecondsFromMirrorExact(
  mirrorSeconds: ExactRationalInput,
): ExactRational {
  return mirrorClockSecondsExact(mirrorSeconds);
}

export function reflectClockAnglesVerticallyExact(
  angles: ExactClockHandAngles,
): ExactClockHandAngles {
  return {
    hourAngleDeg: moduloRational(subtractRationals(360, angles.hourAngleDeg), 360),
    minuteAngleDeg: moduloRational(subtractRationals(360, angles.minuteAngleDeg), 360),
    secondAngleDeg: moduloRational(subtractRationals(360, angles.secondAngleDeg), 360),
  };
}

export function validateMirrorTimeGeometryExact(
  sourceSeconds: ExactRationalInput,
): ExactMirrorClockProof {
  const sourceTime = totalSecondsToClockTimeExact(sourceSeconds);
  const mirrorSeconds = mirrorClockSecondsExact(sourceSeconds);
  const mirrorTime = totalSecondsToClockTimeExact(mirrorSeconds);
  const reflectedAngles = reflectClockAnglesVerticallyExact(
    clockTimeToHandAnglesExact(sourceTime),
  );
  const mirrorTimeAngles = clockTimeToHandAnglesExact(mirrorTime);
  return {
    sourceSeconds: moduloRational(sourceSeconds, CLOCK_CYCLE_SECONDS),
    mirrorSeconds,
    sourceTime,
    mirrorTime,
    reflectedAngles,
    mirrorTimeAngles,
    agreement:
      rationalsEqual(reflectedAngles.hourAngleDeg, mirrorTimeAngles.hourAngleDeg) &&
      rationalsEqual(reflectedAngles.minuteAngleDeg, mirrorTimeAngles.minuteAngleDeg) &&
      rationalsEqual(reflectedAngles.secondAngleDeg, mirrorTimeAngles.secondAngleDeg),
  };
}
