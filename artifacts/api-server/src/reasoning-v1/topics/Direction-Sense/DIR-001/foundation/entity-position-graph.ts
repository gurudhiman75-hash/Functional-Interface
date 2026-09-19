import { addCoordinates, coordinatesEqual, negateCoordinate } from "./coordinates";
import type { Coordinate, PositionRelation, SolvedEntityPositions } from "./types";

interface GraphEdge {
  readonly entity: string;
  readonly vector: Coordinate;
}

function normalizeEntity(entity: string): string {
  const normalized = entity.trim();
  if (!normalized) {
    throw new Error("Entity names must not be empty");
  }
  return normalized;
}

export function solveEntityPositions(relations: readonly PositionRelation[], originEntity?: string): SolvedEntityPositions {
  if (relations.length === 0) {
    return { coordinates: {}, connected: true, contradictions: [] };
  }

  const adjacency = new Map<string, GraphEdge[]>();
  const entities = new Set<string>();

  const addEdge = (from: string, edge: GraphEdge): void => {
    const existing = adjacency.get(from) ?? [];
    existing.push(edge);
    adjacency.set(from, existing);
  };

  for (const relation of relations) {
    const fromEntity = normalizeEntity(relation.fromEntity);
    const toEntity = normalizeEntity(relation.toEntity);
    if (fromEntity === toEntity) {
      throw new Error(`A position relation cannot connect ${fromEntity} to itself`);
    }
    if (!Number.isFinite(relation.vector.x) || !Number.isFinite(relation.vector.y)) {
      throw new Error(`Relation ${fromEntity} -> ${toEntity} has a non-finite vector`);
    }

    entities.add(fromEntity);
    entities.add(toEntity);
    addEdge(fromEntity, { entity: toEntity, vector: relation.vector });
    addEdge(toEntity, { entity: fromEntity, vector: negateCoordinate(relation.vector) });
  }

  const root = normalizeEntity(originEntity ?? relations[0].fromEntity);
  if (!entities.has(root)) {
    throw new Error(`Origin entity ${root} does not occur in the relation graph`);
  }

  const coordinates = new Map<string, Coordinate>([[root, { x: 0, y: 0 }]]);
  const queue = [root];
  const contradictions: string[] = [];

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const currentEntity = queue[cursor];
    const currentCoordinate = coordinates.get(currentEntity)!;

    for (const edge of adjacency.get(currentEntity) ?? []) {
      const proposed = addCoordinates(currentCoordinate, edge.vector);
      const existing = coordinates.get(edge.entity);
      if (!existing) {
        coordinates.set(edge.entity, proposed);
        queue.push(edge.entity);
      } else if (!coordinatesEqual(existing, proposed)) {
        contradictions.push(
          `${edge.entity} resolves to both (${existing.x}, ${existing.y}) and (${proposed.x}, ${proposed.y})`,
        );
      }
    }
  }

  return {
    coordinates: Object.fromEntries([...coordinates.entries()].sort(([left], [right]) => left.localeCompare(right))),
    connected: coordinates.size === entities.size,
    contradictions: [...new Set(contradictions)],
  };
}
