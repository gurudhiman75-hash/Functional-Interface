import { equals, isZero, type Rational } from "./exact";
import { areCollinear, pointOnCircle, squaredDistance } from "./incidence";
import type { ExactCoordinate } from "./point";
import { parallelSegmentRatio } from "./segment";
import {
  areParallelVectors,
  arePerpendicularVectors,
  vectorBetween,
} from "./vector";

export type CoordinateRealization = Readonly<Record<string, ExactCoordinate>>;

function requirePoint(realization: CoordinateRealization, pointId: string): ExactCoordinate {
  const point = realization[pointId];
  if (!point) throw new Error(`Coordinate oracle is missing point ${pointId}`);
  return point;
}

export class CoordinateOracle {
  constructor(readonly realization: CoordinateRealization) {}

  coordinate(pointId: string): ExactCoordinate {
    return requirePoint(this.realization, pointId);
  }

  collinear(a: string, b: string, c: string): boolean {
    return areCollinear(this.coordinate(a), this.coordinate(b), this.coordinate(c));
  }

  parallel(a: string, b: string, c: string, d: string): boolean {
    return areParallelVectors(
      vectorBetween(this.coordinate(a), this.coordinate(b)),
      vectorBetween(this.coordinate(c), this.coordinate(d)),
    );
  }

  perpendicular(a: string, b: string, c: string, d: string): boolean {
    return arePerpendicularVectors(
      vectorBetween(this.coordinate(a), this.coordinate(b)),
      vectorBetween(this.coordinate(c), this.coordinate(d)),
    );
  }

  squaredLength(a: string, b: string): Rational {
    return squaredDistance(this.coordinate(a), this.coordinate(b));
  }

  equalLengths(a: string, b: string, c: string, d: string): boolean {
    return equals(this.squaredLength(a, b), this.squaredLength(c, d));
  }

  pointOnCircle(pointId: string, centerPointId: string, radiusSquared: Rational): boolean {
    return pointOnCircle(
      this.coordinate(pointId),
      this.coordinate(centerPointId),
      radiusSquared,
    );
  }

  parallelSegmentRatio(a: string, b: string, c: string, d: string): Rational {
    return parallelSegmentRatio(
      this.coordinate(a),
      this.coordinate(b),
      this.coordinate(c),
      this.coordinate(d),
    );
  }

  distinct(a: string, b: string): boolean {
    return !isZero(this.squaredLength(a, b));
  }
}
