import type { AngleMeasure, ExactTrigNumber } from "../../foundation/types";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactKey,
  multiplyExact,
  subtractExact,
} from "../../foundation/exact";
import { degree } from "../../foundation/angle";
import { requireTrigExact } from "../../foundation/standard-values";

export function tanExact(angle: AngleMeasure): ExactTrigNumber {
  return requireTrigExact("TAN", angle);
}

export function sinExact(angle: AngleMeasure): ExactTrigNumber {
  return requireTrigExact("SIN", angle);
}

export function cosExact(angle: AngleMeasure): ExactTrigNumber {
  return requireTrigExact("COS", angle);
}

export function verticalDeltaFromHorizontal(horizontal: ExactTrigNumber, angle: AngleMeasure): ExactTrigNumber {
  return multiplyExact(horizontal, tanExact(angle));
}

export function horizontalFromVerticalDelta(verticalDelta: ExactTrigNumber, angle: AngleMeasure): ExactTrigNumber {
  return assertDefined(divideExact(verticalDelta, tanExact(angle)));
}

export function singleElevationObjectHeight(
  horizontal: ExactTrigNumber,
  angle: AngleMeasure,
  eyeHeight: ExactTrigNumber = exactInteger(0),
): ExactTrigNumber {
  return addExact(eyeHeight, verticalDeltaFromHorizontal(horizontal, angle));
}

export function singleDepressionTargetHeight(
  eyeHeight: ExactTrigNumber,
  horizontal: ExactTrigNumber,
  angle: AngleMeasure,
): ExactTrigNumber {
  return subtractExact(eyeHeight, verticalDeltaFromHorizontal(horizontal, angle));
}

export function shadowObjectHeight(shadowLength: ExactTrigNumber, solarElevation: AngleMeasure): ExactTrigNumber {
  return verticalDeltaFromHorizontal(shadowLength, solarElevation);
}

export function shadowLengthFromHeight(objectHeight: ExactTrigNumber, solarElevation: AngleMeasure): ExactTrigNumber {
  return horizontalFromVerticalDelta(objectHeight, solarElevation);
}

export function ladderAgainstWall(length: ExactTrigNumber, angleAtGround: AngleMeasure) {
  return {
    verticalHeight: multiplyExact(length, sinExact(angleAtGround)),
    baseDistance: multiplyExact(length, cosExact(angleAtGround)),
  };
}

export function sameSideTwoObservationSystem(
  farAngle: AngleMeasure,
  nearAngle: AngleMeasure,
  movementTowardObject: ExactTrigNumber,
) {
  const farTan = tanExact(farAngle);
  const nearTan = tanExact(nearAngle);
  const denominator = subtractExact(nearTan, farTan);
  const farDistance = assertDefined(
    divideExact(multiplyExact(nearTan, movementTowardObject), denominator),
  );
  const nearDistance = subtractExact(farDistance, movementTowardObject);
  const verticalDelta = multiplyExact(farDistance, farTan);
  return { farDistance, nearDistance, verticalDelta };
}

export function oppositeSideObservationSystem(
  leftAngle: AngleMeasure,
  rightAngle: AngleMeasure,
  observerSeparation: ExactTrigNumber,
) {
  const leftTan = tanExact(leftAngle);
  const rightTan = tanExact(rightAngle);
  const denominator = addExact(leftTan, rightTan);
  const leftDistance = assertDefined(
    divideExact(multiplyExact(observerSeparation, rightTan), denominator),
  );
  const rightDistance = subtractExact(observerSeparation, leftDistance);
  const verticalDelta = multiplyExact(leftDistance, leftTan);
  return { leftDistance, rightDistance, verticalDelta };
}

export function findCleanStandardAngleFromRiseRun(
  verticalDelta: ExactTrigNumber,
  horizontal: ExactTrigNumber,
): AngleMeasure | null {
  const ratio = assertDefined(divideExact(verticalDelta, horizontal));
  for (const candidate of [30, 45, 60] as const) {
    if (exactKey(ratio) === exactKey(requireTrigExact("TAN", degree(candidate)))) return degree(candidate);
  }
  return null;
}
