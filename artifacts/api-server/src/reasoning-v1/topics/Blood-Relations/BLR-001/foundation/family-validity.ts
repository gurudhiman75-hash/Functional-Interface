import type { FamilyGraph, FamilyPerson } from "./types";

export interface FamilyValidityResult {
  valid: boolean;
  errors: readonly string[];
}

function unorderedKey(personAId: string, personBId: string): string {
  return [personAId, personBId].sort().join("::");
}

export function validateFamilyGraph(graph: FamilyGraph): FamilyValidityResult {
  const errors: string[] = [];
  const personById = new Map<string, FamilyPerson>();

  for (const person of graph.persons) {
    if (personById.has(person.personId)) errors.push(`Duplicate person ID: ${person.personId}.`);
    personById.set(person.personId, person);
  }

  if (new Set(graph.persons.map((person) => person.name.toLocaleLowerCase("en-IN"))).size !== graph.persons.length) {
    errors.push("Person names must be unique inside one family graph.");
  }

  const parentKeys = new Set<string>();
  for (const edge of graph.parentEdges) {
    if (!personById.has(edge.parentId) || !personById.has(edge.childId)) {
      errors.push(`Parent edge references an unknown person: ${edge.parentId}->${edge.childId}.`);
      continue;
    }
    if (edge.parentId === edge.childId) errors.push(`A person cannot be their own parent: ${edge.parentId}.`);
    const key = `${edge.parentId}->${edge.childId}`;
    if (parentKeys.has(key)) errors.push(`Duplicate parent edge: ${key}.`);
    parentKeys.add(key);
  }

  const spouseKeys = new Set<string>();
  const spouseCount = new Map<string, number>();
  for (const edge of graph.spouseEdges) {
    if (!personById.has(edge.personAId) || !personById.has(edge.personBId)) {
      errors.push(`Spouse edge references an unknown person: ${edge.personAId}<->${edge.personBId}.`);
      continue;
    }
    if (edge.personAId === edge.personBId) errors.push(`A person cannot be their own spouse: ${edge.personAId}.`);
    const key = unorderedKey(edge.personAId, edge.personBId);
    if (spouseKeys.has(key)) errors.push(`Duplicate spouse edge: ${key}.`);
    spouseKeys.add(key);
    spouseCount.set(edge.personAId, (spouseCount.get(edge.personAId) ?? 0) + 1);
    spouseCount.set(edge.personBId, (spouseCount.get(edge.personBId) ?? 0) + 1);
  }
  for (const [personId, count] of spouseCount) {
    if (count > 1) errors.push(`V1 permits at most one spouse per person: ${personId}.`);
  }

  const siblingKeys = new Set<string>();
  for (const edge of graph.siblingEdges) {
    if (!personById.has(edge.personAId) || !personById.has(edge.personBId)) {
      errors.push(`Sibling edge references an unknown person: ${edge.personAId}<->${edge.personBId}.`);
      continue;
    }
    if (edge.personAId === edge.personBId) errors.push(`A person cannot be their own sibling: ${edge.personAId}.`);
    const key = unorderedKey(edge.personAId, edge.personBId);
    if (siblingKeys.has(key)) errors.push(`Duplicate sibling edge: ${key}.`);
    siblingKeys.add(key);
  }

  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const children = childrenByParent.get(edge.parentId) ?? [];
    children.push(edge.childId);
    childrenByParent.set(edge.parentId, children);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (personId: string): void => {
    if (visiting.has(personId)) {
      errors.push(`Parent graph contains an ancestry cycle at ${personId}.`);
      return;
    }
    if (visited.has(personId)) return;
    visiting.add(personId);
    for (const childId of childrenByParent.get(personId) ?? []) visit(childId);
    visiting.delete(personId);
    visited.add(personId);
  };
  for (const person of graph.persons) visit(person.personId);

  for (const edge of graph.parentEdges) {
    if (spouseKeys.has(unorderedKey(edge.parentId, edge.childId))) {
      errors.push(`A parent and child cannot also be spouses: ${edge.parentId}/${edge.childId}.`);
    }
    if (siblingKeys.has(unorderedKey(edge.parentId, edge.childId))) {
      errors.push(`A parent and child cannot also be siblings: ${edge.parentId}/${edge.childId}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidFamilyGraph(graph: FamilyGraph): void {
  const result = validateFamilyGraph(graph);
  if (!result.valid) throw new Error(`Invalid family graph: ${result.errors.join(" ")}`);
}
