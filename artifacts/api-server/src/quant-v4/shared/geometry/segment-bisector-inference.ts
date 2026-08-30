import { compare, multiply, rational, type Rational } from "./exact";

export type PerpendicularBisectorDirectConclusion = "EQUIDISTANT_FROM_ENDPOINTS";
export type PerpendicularBisectorConverseConclusion = "LIES_ON_PERPENDICULAR_BISECTOR";

function requirePositive(value: Rational, label: string): void {
  if (compare(value, rational(0)) <= 0) throw new Error(`${label} must be positive`);
}

export function perpendicularBisectorDirectConclusion(): PerpendicularBisectorDirectConclusion {
  return "EQUIDISTANT_FROM_ENDPOINTS";
}

export function perpendicularBisectorConverseConclusion(): PerpendicularBisectorConverseConclusion {
  return "LIES_ON_PERPENDICULAR_BISECTOR";
}

export function midpointConverseHalfLength(wholeSide: Rational): Rational {
  requirePositive(wholeSide, "Whole side length");
  return multiply(wholeSide, rational(1, 2));
}
