import { solveRelationFromGraph } from "./graph-closure";
import type { BlrRelationId, FamilyGraph, RelationPath } from "./types";

export type GenerationRelationId =
  | "SAME_GENERATION"
  | "ONE_GENERATION_ABOVE"
  | "TWO_GENERATIONS_ABOVE"
  | "ONE_GENERATION_BELOW"
  | "TWO_GENERATIONS_BELOW";

export interface SupportedRelationFact {
  subjectId: string;
  referenceId: string;
  relationId: BlrRelationId;
  path: RelationPath;
}

export function allSupportedRelationFacts(graph: FamilyGraph): SupportedRelationFact[] {
  const result: SupportedRelationFact[] = [];

  for (const subject of graph.persons) {
    for (const reference of graph.persons) {
      if (subject.personId === reference.personId) continue;
      try {
        const solved = solveRelationFromGraph(
          graph,
          subject.personId,
          reference.personId,
        );
        result.push({
          subjectId: subject.personId,
          referenceId: reference.personId,
          relationId: solved.relationId,
          path: solved.path,
        });
      } catch {
        // Unsupported or ambiguous paths are not relation facts.
      }
    }
  }

  return result;
}

export function personsWithRelation(
  graph: FamilyGraph,
  referenceId: string,
  relationId: BlrRelationId,
): string[] {
  return allSupportedRelationFacts(graph)
    .filter(
      (fact) =>
        fact.referenceId === referenceId && fact.relationId === relationId,
    )
    .map((fact) => fact.subjectId);
}

interface GenerationEdge {
  toId: string;
  delta: number;
}

export function generationDelta(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): number {
  if (subjectId === referenceId) return 0;

  const adjacency = new Map<string, GenerationEdge[]>();
  const add = (fromId: string, toId: string, delta: number): void => {
    const entries = adjacency.get(fromId) ?? [];
    entries.push({ toId, delta });
    adjacency.set(fromId, entries);
  };

  for (const edge of graph.parentEdges) {
    add(edge.parentId, edge.childId, -1);
    add(edge.childId, edge.parentId, 1);
  }
  for (const edge of graph.spouseEdges) {
    add(edge.personAId, edge.personBId, 0);
    add(edge.personBId, edge.personAId, 0);
  }
  for (const edge of graph.siblingEdges) {
    add(edge.personAId, edge.personBId, 0);
    add(edge.personBId, edge.personAId, 0);
  }

  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const children = childrenByParent.get(edge.parentId) ?? [];
    children.push(edge.childId);
    childrenByParent.set(edge.parentId, children);
  }
  for (const children of childrenByParent.values()) {
    const uniqueChildren = [...new Set(children)];
    for (let first = 0; first < uniqueChildren.length; first += 1) {
      for (let second = first + 1; second < uniqueChildren.length; second += 1) {
        add(uniqueChildren[first]!, uniqueChildren[second]!, 0);
        add(uniqueChildren[second]!, uniqueChildren[first]!, 0);
      }
    }
  }

  const values = new Map<string, number>([[referenceId, 0]]);
  const queue = [referenceId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentValue = values.get(currentId)!;
    for (const edge of adjacency.get(currentId) ?? []) {
      const candidate = currentValue + edge.delta;
      const existing = values.get(edge.toId);
      if (existing === undefined) {
        values.set(edge.toId, candidate);
        queue.push(edge.toId);
      } else if (existing !== candidate) {
        throw new Error(`Inconsistent generation constraints for ${edge.toId}.`);
      }
    }
  }

  const result = values.get(subjectId);
  if (result === undefined) {
    throw new Error(`No generation path from ${subjectId} to ${referenceId}.`);
  }
  return result;
}

export function generationRelationForDelta(
  delta: number,
): GenerationRelationId {
  if (delta === 0) return "SAME_GENERATION";
  if (delta === 1) return "ONE_GENERATION_ABOVE";
  if (delta === 2) return "TWO_GENERATIONS_ABOVE";
  if (delta === -1) return "ONE_GENERATION_BELOW";
  if (delta === -2) return "TWO_GENERATIONS_BELOW";
  throw new Error(
    `BLR-CP-001 generation prototype does not support delta ${delta}.`,
  );
}

export function generationLabel(relationId: GenerationRelationId): string {
  const labels: Readonly<Record<GenerationRelationId, string>> = {
    SAME_GENERATION: "Same generation",
    ONE_GENERATION_ABOVE: "One generation above",
    TWO_GENERATIONS_ABOVE: "Two generations above",
    ONE_GENERATION_BELOW: "One generation below",
    TWO_GENERATIONS_BELOW: "Two generations below",
  };
  return labels[relationId];
}
