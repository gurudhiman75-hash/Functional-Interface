import {
  divideRationals,
  exactRational,
  moduloRational,
  multiplyRationals,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";

export type ClockHand = "HOUR" | "MINUTE" | "SECOND";

export const CLOCK_HAND_RATE_DEG_PER_SECOND: Readonly<Record<ClockHand, ExactRational>> = {
  HOUR: exactRational(1, 120),
  MINUTE: exactRational(1, 10),
  SECOND: exactRational(6),
};

export function handMovementDegreesExact(
  hand: ClockHand,
  durationSeconds: ExactRationalInput,
  reduceFullRevolutions = false,
): ExactRational {
  const movement = multiplyRationals(
    CLOCK_HAND_RATE_DEG_PER_SECOND[hand],
    durationSeconds,
  );
  return reduceFullRevolutions ? moduloRational(movement, 360) : movement;
}

export function durationForHandMovementExact(
  hand: ClockHand,
  movementDegrees: ExactRationalInput,
): ExactRational {
  return divideRationals(
    movementDegrees,
    CLOCK_HAND_RATE_DEG_PER_SECOND[hand],
  );
}

export function handRevolutionsExact(
  hand: ClockHand,
  durationSeconds: ExactRationalInput,
): ExactRational {
  return divideRationals(
    handMovementDegreesExact(hand, durationSeconds),
    360,
  );
}

export function minuteSpacesToDegreesExact(
  minuteSpaces: ExactRationalInput,
): ExactRational {
  return multiplyRationals(minuteSpaces, 6);
}

export function degreesToMinuteSpacesExact(
  degrees: ExactRationalInput,
): ExactRational {
  return divideRationals(degrees, 6);
}

/**
 * Returns the exact coefficient c for a travelled distance of cπ.
 * This avoids treating an approximation of π as answer authority.
 */
export function handTipDistancePiCoefficientExact(
  radius: ExactRationalInput,
  movementDegrees: ExactRationalInput,
): ExactRational {
  return divideRationals(multiplyRationals(radius, movementDegrees), 180);
}

export function compareHandMovementsExact(
  leftHand: ClockHand,
  rightHand: ClockHand,
  durationSeconds: ExactRationalInput,
): {
  left: ExactRational;
  right: ExactRational;
  difference: ExactRational;
  ratioLeftToRight: ExactRational;
} {
  const left = handMovementDegreesExact(leftHand, durationSeconds);
  const right = handMovementDegreesExact(rightHand, durationSeconds);
  return {
    left,
    right,
    difference: subtractRationals(left, right),
    ratioLeftToRight: divideRationals(left, right),
  };
}
