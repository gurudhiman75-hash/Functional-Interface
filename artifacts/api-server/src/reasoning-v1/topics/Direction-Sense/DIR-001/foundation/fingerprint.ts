import type { PathOperation, PositionRelation } from "./types";

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

export function relationTopologyFingerprint(relations: readonly PositionRelation[]): string {
  const normalized = relations
    .map((relation) => ({
      fromEntity: relation.fromEntity.trim(),
      toEntity: relation.toEntity.trim(),
      vector: { x: relation.vector.x, y: relation.vector.y },
    }))
    .sort((left, right) => {
      const leftKey = `${left.fromEntity}\u0000${left.toEntity}`;
      const rightKey = `${right.fromEntity}\u0000${right.toEntity}`;
      return leftKey.localeCompare(rightKey);
    });
  return `RELATION:${stableSerialize(normalized)}`;
}

export function canonicalFingerprint(value: unknown): string {
  return stableSerialize(value);
}
