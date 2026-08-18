import { add, equals, multiply, subtract, type Rational } from "./exact";
import type { ExactCoordinate } from "./point";
import { cross, vectorBetween } from "./vector";

export function squaredDistance(a: ExactCoordinate, b: ExactCoordinate): Rational {
  const dx = subtract(b.x, a.x);
  const dy = subtract(b.y, a.y);
  return add(multiply(dx, dx), multiply(dy, dy));
}

export function areCollinear(a: ExactCoordinate, b: ExactCoordinate, c: ExactCoordinate): boolean {
  return cross(vectorBetween(a, b), vectorBetween(a, c)).numerator === 0n;
}

export function pointOnCircle(
  point: ExactCoordinate,
  center: ExactCoordinate,
  radiusSquared: Rational,
): boolean {
  return equals(squaredDistance(point, center), radiusSquared);
}
