import type { Coordinate, PositionRelation } from "../foundation/types";

interface Edge { readonly entity: string; readonly vector: Coordinate }

export interface IndependentGraphSolution {
  readonly coordinates: Readonly<Record<string, Coordinate>>;
  readonly connected: boolean;
  readonly contradictions: readonly string[];
}

function add(left: Coordinate, right: Coordinate): Coordinate {
  return { x: left.x + right.x, y: left.y + right.y };
}

function negate(value: Coordinate): Coordinate {
  return { x: -value.x, y: -value.y };
}

function equal(left: Coordinate, right: Coordinate, epsilon = 1e-9): boolean {
  return Math.abs(left.x - right.x) <= epsilon && Math.abs(left.y - right.y) <= epsilon;
}

export function solveRelativeGraphIndependent(
  relations: readonly PositionRelation[],
  originEntity?: string,
): IndependentGraphSolution {
  if (relations.length === 0) return { coordinates: {}, connected: true, contradictions: [] };
  const adjacency = new Map<string, Edge[]>();
  const entities = new Set<string>();
  const addEdge = (from: string, edge: Edge) => adjacency.set(from, [...(adjacency.get(from) ?? []), edge]);

  for (const relation of relations) {
    entities.add(relation.fromEntity);
    entities.add(relation.toEntity);
    addEdge(relation.fromEntity, { entity: relation.toEntity, vector: relation.vector });
    addEdge(relation.toEntity, { entity: relation.fromEntity, vector: negate(relation.vector) });
  }

  const origin = originEntity ?? relations[0].fromEntity;
  const coordinates = new Map<string, Coordinate>([[origin, { x: 0, y: 0 }]]);
  const queue = [origin];
  const contradictions: string[] = [];

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    const base = coordinates.get(current)!;
    for (const edge of adjacency.get(current) ?? []) {
      const proposed = add(base, edge.vector);
      const existing = coordinates.get(edge.entity);
      if (!existing) {
        coordinates.set(edge.entity, proposed);
        queue.push(edge.entity);
      } else if (!equal(existing, proposed)) {
        contradictions.push(`${edge.entity} resolves inconsistently`);
      }
    }
  }

  return {
    coordinates: Object.fromEntries([...coordinates.entries()].sort(([a], [b]) => a.localeCompare(b))),
    connected: coordinates.size === entities.size,
    contradictions: [...new Set(contradictions)],
  };
}

export function independentDirection(from: Coordinate, to: Coordinate):
  | "NORTH" | "NORTH_EAST" | "EAST" | "SOUTH_EAST" | "SOUTH" | "SOUTH_WEST" | "WEST" | "NORTH_WEST" | "SAME_POSITION" {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return "SAME_POSITION";
  if (dx === 0) return dy > 0 ? "NORTH" : "SOUTH";
  if (dy === 0) return dx > 0 ? "EAST" : "WEST";
  if (dx > 0 && dy > 0) return "NORTH_EAST";
  if (dx > 0 && dy < 0) return "SOUTH_EAST";
  if (dx < 0 && dy < 0) return "SOUTH_WEST";
  return "NORTH_WEST";
}

export function independentDistance(from: Coordinate, to: Coordinate): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function independentCollinear(a: Coordinate, b: Coordinate, c: Coordinate): boolean {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) <= 1e-9;
}
