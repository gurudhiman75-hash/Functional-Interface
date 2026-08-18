import {
  add,
  isZero,
  multiply,
  subtract,
  type Rational,
} from "./exact";
import type { ExactCoordinate } from "./point";

export interface ExactVector {
  readonly x: Rational;
  readonly y: Rational;
}

export function vectorBetween(from: ExactCoordinate, to: ExactCoordinate): ExactVector {
  return Object.freeze({
    x: subtract(to.x, from.x),
    y: subtract(to.y, from.y),
  });
}

export function dot(a: ExactVector, b: ExactVector): Rational {
  return add(multiply(a.x, b.x), multiply(a.y, b.y));
}

export function cross(a: ExactVector, b: ExactVector): Rational {
  return subtract(multiply(a.x, b.y), multiply(a.y, b.x));
}

export function squaredMagnitude(vector: ExactVector): Rational {
  return dot(vector, vector);
}

export function isZeroVector(vector: ExactVector): boolean {
  return isZero(vector.x) && isZero(vector.y);
}

export function areParallelVectors(a: ExactVector, b: ExactVector): boolean {
  if (isZeroVector(a) || isZeroVector(b)) return false;
  return isZero(cross(a, b));
}

export function arePerpendicularVectors(a: ExactVector, b: ExactVector): boolean {
  if (isZeroVector(a) || isZeroVector(b)) return false;
  return isZero(dot(a, b));
}
