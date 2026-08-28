import type { AngleMeasure, ExactRational, ExactTrigNumber, ExactTrigResult, TrigFunction } from "./types";
import {
  assertDefined,
  divideExact,
  exactInteger,
  exactRational,
  exactSurd,
  exactUndefined,
  negateExact,
  rational,
  rationalEquals,
} from "./exact";
import { normalizedDegreeValue, quadrant, referenceAngleDegrees } from "./angle";

const STANDARD_REFERENCES = [rational(0), rational(30), rational(45), rational(60), rational(90)] as const;

function rationalKey(value: ExactRational) {
  return `${value.numerator}/${value.denominator}`;
}

function matches(value: ExactRational, degrees: number) {
  return rationalEquals(value, rational(degrees));
}

export function isSupportedStandardReference(value: ExactRational) {
  return STANDARD_REFERENCES.some((candidate) => rationalEquals(value, candidate));
}

export function isSupportedExactTrigAngle(angle: AngleMeasure) {
  return isSupportedStandardReference(referenceAngleDegrees(angle));
}

function baseSinCos(reference: ExactRational): { sin: ExactTrigNumber; cos: ExactTrigNumber } | null {
  if (matches(reference, 0)) return { sin: exactInteger(0), cos: exactInteger(1) };
  if (matches(reference, 30)) return { sin: exactRational(1, 2), cos: exactSurd(1, 3, 2) };
  if (matches(reference, 45)) return { sin: exactSurd(1, 2, 2), cos: exactSurd(1, 2, 2) };
  if (matches(reference, 60)) return { sin: exactSurd(1, 3, 2), cos: exactRational(1, 2) };
  if (matches(reference, 90)) return { sin: exactInteger(1), cos: exactInteger(0) };
  return null;
}

function axisSinCos(normalized: ExactRational) {
  if (matches(normalized, 0)) return { sin: exactInteger(0), cos: exactInteger(1) };
  if (matches(normalized, 90)) return { sin: exactInteger(1), cos: exactInteger(0) };
  if (matches(normalized, 180)) return { sin: exactInteger(0), cos: exactInteger(-1) };
  if (matches(normalized, 270)) return { sin: exactInteger(-1), cos: exactInteger(0) };
  return null;
}

export function evaluateSinCosExact(
  angle: AngleMeasure,
): { sin: ExactTrigResult; cos: ExactTrigResult } {
  const normalized = normalizedDegreeValue(angle);
  const axis = axisSinCos(normalized);
  if (axis) return axis;

  const reference = referenceAngleDegrees(angle);
  const base = baseSinCos(reference);
  if (!base) {
    const detail = `Exact standard-value authority does not cover reference angle ${rationalKey(reference)} degrees.`;
    return {
      sin: exactUndefined("UNSUPPORTED_EXACT_ANGLE", detail),
      cos: exactUndefined("UNSUPPORTED_EXACT_ANGLE", detail),
    };
  }

  const q = quadrant(angle);
  const sinPositive = q === "I" || q === "II";
  const cosPositive = q === "I" || q === "IV";
  return {
    sin: sinPositive ? base.sin : negateExact(base.sin),
    cos: cosPositive ? base.cos : negateExact(base.cos),
  };
}

function safeDivide(
  numerator: ExactTrigNumber,
  denominator: ExactTrigNumber,
  fn: TrigFunction,
  angle: AngleMeasure,
): ExactTrigResult {
  const result = divideExact(numerator, denominator);
  if (result.kind !== "UNDEFINED") return result;
  if (result.reason === "DIVISION_BY_ZERO") {
    return exactUndefined(
      "TRIG_UNDEFINED",
      `${fn.toLowerCase()} is undefined at ${rationalKey(normalizedDegreeValue(angle))} degrees.`,
    );
  }
  return result;
}

export function evaluateTrigExact(fn: TrigFunction, angle: AngleMeasure): ExactTrigResult {
  const pair = evaluateSinCosExact(angle);
  if (pair.sin.kind === "UNDEFINED") return pair.sin;
  if (pair.cos.kind === "UNDEFINED") return pair.cos;

  switch (fn) {
    case "SIN": return pair.sin;
    case "COS": return pair.cos;
    case "TAN": return safeDivide(pair.sin, pair.cos, fn, angle);
    case "COT": return safeDivide(pair.cos, pair.sin, fn, angle);
    case "SEC": return safeDivide(exactInteger(1), pair.cos, fn, angle);
    case "COSEC": return safeDivide(exactInteger(1), pair.sin, fn, angle);
  }
}

export const STANDARD_VALUE_AUTHORITY = Object.freeze({
  referenceAnglesDegrees: [0, 30, 45, 60, 90] as const,
  functions: ["SIN", "COS", "TAN", "COT", "SEC", "COSEC"] as const,
  answerPolicy: "EXACT_ONLY" as const,
});

/** Convenience for tests and explanation builders that require a defined standard value. */
export function requireTrigExact(fn: TrigFunction, angle: AngleMeasure) {
  return assertDefined(evaluateTrigExact(fn, angle));
}
