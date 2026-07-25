import { solveEntityPositions } from "./entity-position-graph";
import type { Coordinate, PathOperation, PositionRelation } from "./types";

function canonicalNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Cannot fingerprint non-finite number ${value}`);
  }
  const rounded = Math.round(value * 1e12) / 1e12;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const serialized = JSON.stringify(typeof value === "number" ? canonicalNumber(value) : value);
    return serialized ?? "undefined";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
    .join(",")}}`;
}

function normalizedCoordinate(coordinate: Coordinate, minimumX: number, minimumY: number): Coordinate {
  return {
    x: canonicalNumber(coordinate.x - minimumX),
    y: canonicalNumber(coordinate.y - minimumY),
  };
}

function coordinateKey(coordinate: Coordinate): string {
  return `${canonicalNumber(coordinate.x)},${canonicalNumber(coordinate.y)}`;
}

export function pathTopologyFingerprint(operations: readonly PathOperation[]): string {
  const topology = operations.map((operation) => {
    if (operation.kind === "TURN") {
      return { kind: operation.kind, sense: operation.sense, degrees: operation.degrees };
    }
    return {
      kind: operation.kind,
      heading: operation.heading,
      facingAfterMove: operation.facingAfterMove,
      distance: operation.distance,
    };
  });
  return `PATH:${stableSerialize(topology)}`;
}

/**
 * Produces a relation fingerprint that is independent of entity names,
 * relation order, and which equivalent side of a relation was stated.
 */
export function relationTopologyFingerprint(relations: readonly PositionRelation[]): string {
  if (relations.length === 0) {
    return "RELATION:EMPTY";
  }

  const solution = solveEntityPositions(relations);
  if (!solution.connected || solution.contradictions.length > 0) {
    throw new Error("Cannot fingerprint a disconnected or contradictory relation graph");
  }

  const coordinateEntries = Object.entries(solution.coordinates);
  const minimumX = Math.min(...coordinateEntries.map(([, coordinate]) => coordinate.x));
  const minimumY = Math.min(...coordinateEntries.map(([, coordinate]) => coordinate.y));
  const normalizedByEntity = Object.fromEntries(
    coordinateEntries.map(([entity, coordinate]) => [entity, normalizedCoordinate(coordinate, minimumX, minimumY)]),
  ) as Readonly<Record<string, Coordinate>>;

  const nodes = Object.values(normalizedByEntity).map(coordinateKey).sort();
  const edges = relations
    .map((relation) => {
      const from = normalizedByEntity[relation.fromEntity.trim()];
      const to = normalizedByEntity[relation.toEntity.trim()];
      if (!from || !to) {
        throw new Error(`Relation references an unresolved entity: ${relation.fromEntity} -> ${relation.toEntity}`);
      }
      const forward = `${coordinateKey(from)}>${coordinateKey(to)}`;
      const reverse = `${coordinateKey(to)}>${coordinateKey(from)}`;
      return forward < reverse ? forward : reverse;
    })
    .sort();

  return `RELATION:${stableSerialize({ nodes, edges })}`;
}

export function canonicalFingerprint(value: unknown): string {
  return stableSerialize(value);
}
