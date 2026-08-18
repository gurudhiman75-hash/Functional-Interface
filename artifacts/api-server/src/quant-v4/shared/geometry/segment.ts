import { absRational, divide, isZero, type Rational } from "./exact";
import type { ExactCoordinate } from "./point";
import { areParallelVectors, vectorBetween } from "./vector";

export interface GeoSegment {
  readonly kind: "SEGMENT";
  readonly id: string;
  readonly endpoints: readonly [string, string];
}

export function createSegment(id: string, aPointId: string, bPointId: string): GeoSegment {
  if (aPointId === bPointId) throw new Error("A segment requires two distinct points");
  return Object.freeze({ kind: "SEGMENT" as const, id, endpoints: Object.freeze([aPointId, bPointId]) as readonly [string, string] });
}

export function parallelSegmentRatio(
  firstStart: ExactCoordinate,
  firstEnd: ExactCoordinate,
  secondStart: ExactCoordinate,
  secondEnd: ExactCoordinate,
): Rational {
  const first = vectorBetween(firstStart, firstEnd);
  const second = vectorBetween(secondStart, secondEnd);
  if (!areParallelVectors(first, second)) {
    throw new Error("Segment ratio requires parallel segment vectors");
  }
  if (isZero(second.x) && isZero(second.y)) {
    throw new Error("Cannot divide by a zero-length segment");
  }
  if (!isZero(second.x)) return absRational(divide(first.x, second.x));
  return absRational(divide(first.y, second.y));
}
