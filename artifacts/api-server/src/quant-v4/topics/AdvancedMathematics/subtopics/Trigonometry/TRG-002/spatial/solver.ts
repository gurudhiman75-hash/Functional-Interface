import type { AngleMeasure, ExactTrigNumber } from "../../foundation/types";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactKey,
  exactToNumber,
  multiplyExact,
  subtractExact,
} from "../../foundation/exact";
import { degree } from "../../foundation/angle";
import { requireTrigExact } from "../../foundation/standard-values";

function requirePositive(value: ExactTrigNumber, label: string) {
  if (!(exactToNumber(value) > 0)) throw new Error(`${label} must be positive.`);
}

function requireNonNegative(value: ExactTrigNumber, label: string) {
  if (exactToNumber(value) < 0) throw new Error(`${label} cannot be negative.`);
}

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
  requirePositive(horizontal, "Horizontal distance");
  const tangent = tanExact(angle);
  requirePositive(tangent, "Tangent of sight-line angle");
  return multiplyExact(horizontal, tangent);
}

export function horizontalFromVerticalDelta(verticalDelta: ExactTrigNumber, angle: AngleMeasure): ExactTrigNumber {
  requirePositive(verticalDelta, "Vertical delta");
  const tangent = tanExact(angle);
  requirePositive(tangent, "Tangent of sight-line angle");
  return assertDefined(divideExact(verticalDelta, tangent));
}

export function singleElevationObjectHeight(
  horizontal: ExactTrigNumber,
  angle: AngleMeasure,
  eyeHeight: ExactTrigNumber = exactInteger(0),
): ExactTrigNumber {
  requireNonNegative(eyeHeight, "Observer eye height");
  return addExact(eyeHeight, verticalDeltaFromHorizontal(horizontal, angle));
}

export function singleDepressionTargetHeight(
  eyeHeight: ExactTrigNumber,
  horizontal: ExactTrigNumber,
  angle: AngleMeasure,
): ExactTrigNumber {
  requireNonNegative(eyeHeight, "Observer eye height");
  return subtractExact(eyeHeight, verticalDeltaFromHorizontal(horizontal, angle));
}

export function shadowObjectHeight(shadowLength: ExactTrigNumber, solarElevation: AngleMeasure): ExactTrigNumber {
  return verticalDeltaFromHorizontal(shadowLength, solarElevation);
}

export function shadowLengthFromHeight(objectHeight: ExactTrigNumber, solarElevation: AngleMeasure): ExactTrigNumber {
  return horizontalFromVerticalDelta(objectHeight, solarElevation);
}

export function ladderAgainstWall(length: ExactTrigNumber, angleAtGround: AngleMeasure) {
  requirePositive(length, "Ladder/wire length");
  const sine = sinExact(angleAtGround);
  const cosine = cosExact(angleAtGround);
  requirePositive(sine, "Sine of ladder angle");
  requirePositive(cosine, "Cosine of ladder angle");
  return {
    verticalHeight: multiplyExact(length, sine),
    baseDistance: multiplyExact(length, cosine),
  };
}

export function sameSideTwoObservationSystem(
  farAngle: AngleMeasure,
  nearAngle: AngleMeasure,
  movementTowardObject: ExactTrigNumber,
) {
  requirePositive(movementTowardObject, "Observer movement");
  const farTan = tanExact(farAngle);
  const nearTan = tanExact(nearAngle);
  requirePositive(farTan, "Far-angle tangent");
  requirePositive(nearTan, "Near-angle tangent");
  if (!(exactToNumber(nearTan) > exactToNumber(farTan))) {
    throw new Error("For a closer same-side observation, the near elevation angle must exceed the far elevation angle.");
  }
  const denominator = subtractExact(nearTan, farTan);
  const farDistance = assertDefined(
    divideExact(multiplyExact(nearTan, movementTowardObject), denominator),
  );
  const nearDistance = subtractExact(farDistance, movementTowardObject);
  requirePositive(farDistance, "Far observation distance");
  requirePositive(nearDistance, "Near observation distance");
  const verticalDelta = multiplyExact(farDistance, farTan);
  requirePositive(verticalDelta, "Object vertical delta");
  return { farDistance, nearDistance, verticalDelta };
}

export function oppositeSideObservationSystem(
  leftAngle: AngleMeasure,
  rightAngle: AngleMeasure,
  observerSeparation: ExactTrigNumber,
) {
  requirePositive(observerSeparation, "Opposite-side observer separation");
  const leftTan = tanExact(leftAngle);
  const rightTan = tanExact(rightAngle);
  requirePositive(leftTan, "Left-angle tangent");
  requirePositive(rightTan, "Right-angle tangent");
  const denominator = addExact(leftTan, rightTan);
  const leftDistance = assertDefined(
    divideExact(multiplyExact(observerSeparation, rightTan), denominator),
  );
  const rightDistance = subtractExact(observerSeparation, leftDistance);
  requirePositive(leftDistance, "Left observer distance");
  requirePositive(rightDistance, "Right observer distance");
  const verticalDelta = multiplyExact(leftDistance, leftTan);
  requirePositive(verticalDelta, "Object vertical delta");
  return { leftDistance, rightDistance, verticalDelta };
}

export function findCleanStandardAngleFromRiseRun(
  verticalDelta: ExactTrigNumber,
  horizontal: ExactTrigNumber,
): AngleMeasure | null {
  requirePositive(verticalDelta, "Vertical delta");
  requirePositive(horizontal, "Horizontal distance");
  const ratio = assertDefined(divideExact(verticalDelta, horizontal));
  for (const candidate of [30, 45, 60] as const) {
    if (exactKey(ratio) === exactKey(requireTrigExact("TAN", degree(candidate)))) return degree(candidate);
  }
  return null;
}
