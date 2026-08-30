import { isPositive, type Rational } from "./exact";

export interface GeoCircle {
  readonly kind: "CIRCLE";
  readonly id: string;
  readonly centerPointId: string;
  readonly radiusSquared: Rational;
}

export function createCircle(id: string, centerPointId: string, radiusSquared: Rational): GeoCircle {
  if (!isPositive(radiusSquared)) throw new Error("Circle radius squared must be positive");
  return Object.freeze({ kind: "CIRCLE" as const, id, centerPointId, radiusSquared });
}
