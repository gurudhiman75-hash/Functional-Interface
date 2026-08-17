import type {
  AngleMeasure,
  ExactRational,
  ExactTrigNumber,
  ExactTrigResult,
  IndependentVerification,
  TrigExpression,
  TrigFunction,
} from "./types";
import {
  assertDefined,
  divideExact,
  exactEquals,
  exactInteger,
  exactKey,
  exactRational,
  exactSurd,
  exactToNumber,
  exactUndefined,
  isUndefined,
  negateExact,
  rational,
  rationalEquals,
} from "./exact";
import { normalizedDegreeValue, quadrant, referenceAngleDegrees, toDegrees } from "./angle";

function matches(value: ExactRational, degrees: number) {
  return rationalEquals(value, rational(degrees));
}

function reconstructedReferenceSinCos(reference: ExactRational) {
  if (matches(reference, 0)) return { sin: exactInteger(0), cos: exactInteger(1) };
  if (matches(reference, 30)) {
    // 30-60-90 triangle: sides opposite 30°, opposite 60°, hypotenuse = 1, √3, 2.
    return { sin: exactRational(1, 2), cos: exactSurd(1, 3, 2) };
  }
  if (matches(reference, 45)) {
    // 45-45-90 triangle: legs 1, 1 and hypotenuse √2.
    const oneOverRootTwo = assertDefined(divideExact(exactInteger(1), exactSurd(1, 2)));
    return { sin: oneOverRootTwo, cos: oneOverRootTwo };
  }
  if (matches(reference, 60)) {
    return { sin: exactSurd(1, 3, 2), cos: exactRational(1, 2) };
  }
  if (matches(reference, 90)) return { sin: exactInteger(1), cos: exactInteger(0) };
  return null;
}

function reconstructedAxisSinCos(normalized: ExactRational) {
  if (matches(normalized, 0)) return { sin: exactInteger(0), cos: exactInteger(1) };
  if (matches(normalized, 90)) return { sin: exactInteger(1), cos: exactInteger(0) };
  if (matches(normalized, 180)) return { sin: exactInteger(0), cos: exactInteger(-1) };
  if (matches(normalized, 270)) return { sin: exactInteger(-1), cos: exactInteger(0) };
  return null;
}

function reconstructedSinCos(angle: AngleMeasure): { sin: ExactTrigResult; cos: ExactTrigResult } {
  const normalized = normalizedDegreeValue(angle);
  const axis = reconstructedAxisSinCos(normalized);
  if (axis) return axis;

  const reference = referenceAngleDegrees(angle);
  const base = reconstructedReferenceSinCos(reference);
  if (!base) {
    const detail = `Independent triangle reconstruction does not support reference angle ${reference.numerator}/${reference.denominator} degrees.`;
    return {
      sin: exactUndefined("UNSUPPORTED_EXACT_ANGLE", detail),
      cos: exactUndefined("UNSUPPORTED_EXACT_ANGLE", detail),
    };
  }

  const q = quadrant(angle);
  return {
    sin: q === "I" || q === "II" ? base.sin : negateExact(base.sin),
    cos: q === "I" || q === "IV" ? base.cos : negateExact(base.cos),
  };
}

function reciprocalOrUndefined(
  numerator: ExactTrigNumber,
  denominator: ExactTrigNumber,
  fn: TrigFunction,
): ExactTrigResult {
  const result = divideExact(numerator, denominator);
  return isUndefined(result) && result.reason === "DIVISION_BY_ZERO"
    ? exactUndefined("TRIG_UNDEFINED", `${fn.toLowerCase()} has a zero denominator.`)
    : result;
}

export function independentlyReconstructTrigValue(
  fn: TrigFunction,
  angle: AngleMeasure,
): ExactTrigResult {
  const pair = reconstructedSinCos(angle);
  if (isUndefined(pair.sin)) return pair.sin;
  if (isUndefined(pair.cos)) return pair.cos;

  switch (fn) {
    case "SIN": return pair.sin;
    case "COS": return pair.cos;
    case "TAN": return reciprocalOrUndefined(pair.sin, pair.cos, fn);
    case "COT": return reciprocalOrUndefined(pair.cos, pair.sin, fn);
    case "SEC": return reciprocalOrUndefined(exactInteger(1), pair.cos, fn);
    case "COSEC": return reciprocalOrUndefined(exactInteger(1), pair.sin, fn);
  }
}

export function verifyStandardTrigValue(
  fn: TrigFunction,
  angle: AngleMeasure,
  expected: ExactTrigResult,
): IndependentVerification {
  const reconstructed = independentlyReconstructTrigValue(fn, angle);
  const expectedNumber = exactToNumber(expected);
  const reconstructedNumber = exactToNumber(reconstructed);
  const numericDelta = Number.isNaN(expectedNumber) || Number.isNaN(reconstructedNumber)
    ? null
    : Math.abs(expectedNumber - reconstructedNumber);

  const bothUndefined = isUndefined(expected) && isUndefined(reconstructed);
  return {
    valid: bothUndefined || exactEquals(expected, reconstructed),
    method: "INDEPENDENT_RIGHT_TRIANGLE_RECONSTRUCTION",
    expectedKey: exactKey(expected),
    reconstructedKey: exactKey(reconstructed),
    numericDelta,
    ...(bothUndefined ? { note: "Both authorities classify the trigonometric value as undefined." } : {}),
  };
}

function degreesAsNumber(angle: AngleMeasure) {
  const degrees = toDegrees(angle);
  return Number(degrees.numerator) / Number(degrees.denominator);
}

function numericTrig(fn: TrigFunction, angle: AngleMeasure) {
  const radians = degreesAsNumber(angle) * Math.PI / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const epsilon = 1e-12;
  switch (fn) {
    case "SIN": return Math.abs(sin) < epsilon ? 0 : sin;
    case "COS": return Math.abs(cos) < epsilon ? 0 : cos;
    case "TAN": return Math.abs(cos) < epsilon ? Number.NaN : sin / cos;
    case "COT": return Math.abs(sin) < epsilon ? Number.NaN : cos / sin;
    case "SEC": return Math.abs(cos) < epsilon ? Number.NaN : 1 / cos;
    case "COSEC": return Math.abs(sin) < epsilon ? Number.NaN : 1 / sin;
  }
}

export function evaluateExpressionNumerically(expression: TrigExpression): number {
  switch (expression.kind) {
    case "CONST": return exactToNumber(expression.value);
    case "TRIG": return numericTrig(expression.fn, expression.angle);
    case "ADD": return expression.terms.reduce((sum, term) => sum + evaluateExpressionNumerically(term), 0);
    case "SUBTRACT": return evaluateExpressionNumerically(expression.left) - evaluateExpressionNumerically(expression.right);
    case "MULTIPLY": return expression.factors.reduce((product, factor) => product * evaluateExpressionNumerically(factor), 1);
    case "DIVIDE": return evaluateExpressionNumerically(expression.numerator) / evaluateExpressionNumerically(expression.denominator);
    case "POWER": return evaluateExpressionNumerically(expression.base) ** expression.exponent;
    case "NEGATE": return -evaluateExpressionNumerically(expression.operand);
  }
}

export function verifyExpressionNumerically(
  expression: TrigExpression,
  expected: ExactTrigResult,
  tolerance = 1e-10,
): IndependentVerification {
  const reconstructed = evaluateExpressionNumerically(expression);
  const expectedNumber = exactToNumber(expected);
  const expectedUndefined = isUndefined(expected);
  const reconstructedUndefined = !Number.isFinite(reconstructed) || Number.isNaN(reconstructed);

  if (expectedUndefined || reconstructedUndefined) {
    return {
      valid: expectedUndefined && reconstructedUndefined,
      method: "INDEPENDENT_NUMERIC_EXPRESSION_CHECK",
      expectedKey: exactKey(expected),
      reconstructedKey: reconstructedUndefined ? "NUMERIC:UNDEFINED" : `NUMERIC:${reconstructed}`,
      numericDelta: null,
    };
  }

  const delta = Math.abs(expectedNumber - reconstructed);
  return {
    valid: delta <= tolerance,
    method: "INDEPENDENT_NUMERIC_EXPRESSION_CHECK",
    expectedKey: exactKey(expected),
    reconstructedKey: `NUMERIC:${reconstructed}`,
    numericDelta: delta,
  };
}
