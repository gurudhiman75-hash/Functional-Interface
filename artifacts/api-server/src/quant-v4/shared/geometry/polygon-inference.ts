import {
  divide,
  multiply,
  rational,
  subtract,
  type Rational,
} from "./exact";

function requireSideCount(sideCount: number): void {
  if (!Number.isSafeInteger(sideCount) || sideCount < 3) {
    throw new Error("Polygon side count must be an integer of at least 3");
  }
}

export function polygonInteriorAngleSum(sideCount: number): Rational {
  requireSideCount(sideCount);
  return rational((sideCount - 2) * 180);
}

export function regularPolygonExteriorAngle(sideCount: number): Rational {
  requireSideCount(sideCount);
  return rational(360, sideCount);
}

export function regularPolygonSideCountFromExteriorAngle(exteriorAngle: Rational): number {
  if (exteriorAngle.numerator <= 0n) throw new Error("Regular-polygon exterior angle must be positive");
  const value = divide(rational(360), exteriorAngle);
  if (value.denominator !== 1n) throw new Error("Exterior angle does not produce an integer regular-polygon side count");
  const sideCount = Number(value.numerator);
  requireSideCount(sideCount);
  return sideCount;
}

export function polygonDiagonalCount(sideCount: number): number {
  requireSideCount(sideCount);
  return (sideCount * (sideCount - 3)) / 2;
}

export function regularPolygonInteriorAngle(sideCount: number): Rational {
  requireSideCount(sideCount);
  return divide(polygonInteriorAngleSum(sideCount), rational(sideCount));
}

export function regularPolygonSideCountFromInteriorAngle(interiorAngle: Rational): number {
  const exterior = subtract(rational(180), interiorAngle);
  return regularPolygonSideCountFromExteriorAngle(exterior);
}

export function polygonExteriorAngleSum(): Rational {
  return multiply(rational(360), rational(1));
}
