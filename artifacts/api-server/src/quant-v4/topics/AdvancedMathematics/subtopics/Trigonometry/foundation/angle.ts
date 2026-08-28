import type { AngleMeasure, DegreeAngle, ExactRational, Quadrant, RadianPiAngle, TrigFunction } from "./types";
import {
  rational,
  rationalAdd,
  rationalCompare,
  rationalDivide,
  rationalEquals,
  rationalMultiply,
  rationalNegate,
  rationalSubtract,
} from "./exact";

const ZERO = rational(0);
const NINETY = rational(90);
const ONE_EIGHTY = rational(180);
const TWO_SEVENTY = rational(270);
const THREE_SIXTY = rational(360);

export function degree(
  numerator: bigint | number,
  denominator: bigint | number = 1,
): DegreeAngle {
  return { kind: "ANGLE", unit: "DEGREE", value: rational(numerator, denominator) };
}

export function radianPi(
  coefficientNumerator: bigint | number,
  coefficientDenominator: bigint | number = 1,
): RadianPiAngle {
  return {
    kind: "ANGLE",
    unit: "RADIAN_PI",
    coefficient: rational(coefficientNumerator, coefficientDenominator),
  };
}

export function toDegrees(angle: AngleMeasure): ExactRational {
  return angle.unit === "DEGREE"
    ? angle.value
    : rationalMultiply(angle.coefficient, rational(180));
}

export function toRadianPiCoefficient(angle: AngleMeasure): ExactRational {
  return angle.unit === "RADIAN_PI"
    ? angle.coefficient
    : rationalDivide(angle.value, rational(180));
}

export function toDegreeAngle(angle: AngleMeasure): DegreeAngle {
  return { kind: "ANGLE", unit: "DEGREE", value: toDegrees(angle) };
}

export function toRadianPiAngle(angle: AngleMeasure): RadianPiAngle {
  return { kind: "ANGLE", unit: "RADIAN_PI", coefficient: toRadianPiCoefficient(angle) };
}

export function normalizeDegrees(value: ExactRational): ExactRational {
  const modulus = THREE_SIXTY.numerator * value.denominator;
  let numerator = value.numerator % modulus;
  if (numerator < 0n) numerator += modulus;
  return rational(numerator, value.denominator);
}

export function normalizedDegreeValue(angle: AngleMeasure) {
  return normalizeDegrees(toDegrees(angle));
}

export function normalizeAngle(angle: AngleMeasure): DegreeAngle {
  return { kind: "ANGLE", unit: "DEGREE", value: normalizedDegreeValue(angle) };
}

export function quadrant(angle: AngleMeasure): Quadrant {
  const value = normalizedDegreeValue(angle);
  if (
    rationalEquals(value, ZERO) ||
    rationalEquals(value, NINETY) ||
    rationalEquals(value, ONE_EIGHTY) ||
    rationalEquals(value, TWO_SEVENTY)
  ) return "AXIS";
  if (rationalCompare(value, NINETY) < 0) return "I";
  if (rationalCompare(value, ONE_EIGHTY) < 0) return "II";
  if (rationalCompare(value, TWO_SEVENTY) < 0) return "III";
  return "IV";
}

export function referenceAngleDegrees(angle: AngleMeasure): ExactRational {
  const value = normalizedDegreeValue(angle);
  if (rationalCompare(value, NINETY) <= 0) return value;
  if (rationalCompare(value, ONE_EIGHTY) <= 0) return rationalSubtract(ONE_EIGHTY, value);
  if (rationalCompare(value, TWO_SEVENTY) <= 0) return rationalSubtract(value, ONE_EIGHTY);
  return rationalSubtract(THREE_SIXTY, value);
}

export function referenceAngle(angle: AngleMeasure): DegreeAngle {
  return { kind: "ANGLE", unit: "DEGREE", value: referenceAngleDegrees(angle) };
}

export function complementaryAngle(angle: AngleMeasure): DegreeAngle {
  return {
    kind: "ANGLE",
    unit: "DEGREE",
    value: rationalSubtract(NINETY, toDegrees(angle)),
  };
}

export function coterminalAngle(angle: AngleMeasure, turns: number): DegreeAngle {
  if (!Number.isInteger(turns)) throw new Error("Coterminal turns must be an integer.");
  return {
    kind: "ANGLE",
    unit: "DEGREE",
    value: rationalAdd(toDegrees(angle), rationalMultiply(THREE_SIXTY, rational(turns))),
  };
}

export function quadrantSign(fn: TrigFunction, angle: AngleMeasure): -1 | 1 | null {
  const q = quadrant(angle);
  if (q === "AXIS") return null;

  const positive = (() => {
    switch (q) {
      case "I": return true;
      case "II": return fn === "SIN" || fn === "COSEC";
      case "III": return fn === "TAN" || fn === "COT";
      case "IV": return fn === "COS" || fn === "SEC";
    }
  })();
  return positive ? 1 : -1;
}

export function isAcuteReferenceAngle(angle: AngleMeasure) {
  const value = referenceAngleDegrees(angle);
  return rationalCompare(value, ZERO) > 0 && rationalCompare(value, NINETY) < 0;
}

export function negateAngle(angle: AngleMeasure): AngleMeasure {
  return angle.unit === "DEGREE"
    ? { kind: "ANGLE", unit: "DEGREE", value: rationalNegate(angle.value) }
    : { kind: "ANGLE", unit: "RADIAN_PI", coefficient: rationalNegate(angle.coefficient) };
}
