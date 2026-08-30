import type { Rational } from "./exact";

export interface GeoPoint {
  readonly id: string;
  readonly label: string;
}

export interface ExactCoordinate {
  readonly x: Rational;
  readonly y: Rational;
}

export interface RealizedGeoPoint extends GeoPoint {
  readonly coordinate: ExactCoordinate;
}

export function createPoint(id: string, label: string): GeoPoint {
  if (!id.trim()) throw new Error("Geometry point id cannot be empty");
  if (!label.trim()) throw new Error("Geometry point label cannot be empty");
  return Object.freeze({ id, label });
}

export function realizePoint(point: GeoPoint, coordinate: ExactCoordinate): RealizedGeoPoint {
  return Object.freeze({ ...point, coordinate: Object.freeze({ ...coordinate }) });
}
