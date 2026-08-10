import type { BlrGender, BlrRelationId, FamilyGraph, PrimitivePathStep } from "../foundation/types";
import type {
  BlrCp005BroadRelationId,
  BlrCp005CountSpec,
  BlrCp005FamilyTreeDiagram,
  BlrCp005LineageSide,
  BlrCp005Predicate,
  BlrCp005QuerySpec,
  BlrCp005RelationAnswerId,
  BlrCp005TruthStatus,
  GeneratedBlrCp005Question,
} from "./cp005-model";

interface IndependentRelation {
  relationId: BlrRelationId;
  personIds: readonly string[];
  steps: readonly PrimitivePathStep[];
}

export interface BlrCp005IndependentResult {
  answer: GeneratedBlrCp005Question["answer"];
  expectedSemanticKey: string;
  modelRelations: readonly string[];
  modelCounts: readonly number[];
}

export function graphFromDiagram(diagram: BlrCp005FamilyTreeDiagram): FamilyGraph {
  return {
    persons: diagram.nodes.map((node) => ({
      personId: node.id,
      name: node.label,
      gender: node.gender === "male" ? "MALE" : node.gender === "female" ? "FEMALE" : "UNKNOWN",
    })),
    parentEdges: diagram.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => ({ parentId: edge.sourceId, childId: edge.targetId })),
    spouseEdges: diagram.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
    siblingEdges: diagram.edges
      .filter((edge) => edge.type === "sibling")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
  };
}

function independentRelationForPath(
  steps: readonly PrimitivePathStep[],
  subjectGender: BlrGender,
): BlrRelationId | null {
  const key = steps.join(">");
  if (subjectGender === "UNKNOWN" && key !== "PARENT>SIBLING>CHILD") return null;
  if (key === "CHILD") return subjectGender === "MALE" ? "FATHER" : "MOTHER";
  if (key === "PARENT") return subjectGender === "MALE" ? "SON" : "DAUGHTER";
  if (key === "SIBLING") return subjectGender === "MALE" ? "BROTHER" : "SISTER";
  if (key === "SPOUSE") return subjectGender === "MALE" ? "HUSBAND" : "WIFE";
  if (key === "CHILD>CHILD") return subjectGender === "MALE" ? "GRANDFATHER" : "GRANDMOTHER";
  if (key === "PARENT>PARENT") return subjectGender === "MALE" ? "GRANDSON" : "GRANDDAUGHTER";
  if (key === "CHILD>CHILD>CHILD") return subjectGender === "MALE" ? "GREAT_GRANDFATHER" : "GREAT_GRANDMOTHER";
  if (key === "PARENT>PARENT>PARENT") return subjectGender === "MALE" ? "GREAT_GRANDSON" : "GREAT_GRANDDAUGHTER";
  if (key === "SIBLING>CHILD" || key === "SPOUSE>SIBLING>CHILD") return subjectGender === "MALE" ? "UNCLE" : "AUNT";
  if (key === "PARENT>SIBLING" || key === "PARENT>SIBLING>SPOUSE") return subjectGender === "MALE" ? "NEPHEW" : "NIECE";
  if (key === "PARENT>SIBLING>CHILD") return "COUSIN";
  if (key === "CHILD>SPOUSE") return subjectGender === "MALE" ? "FATHER_IN_LAW" : "MOTHER_IN_LAW";
  if (key === "SPOUSE>PARENT") return subjectGender === "MALE" ? "SON_IN_LAW" : "DAUGHTER_IN_LAW";
  if (key === "SPOUSE>SIBLING" || key === "SIBLING>SPOUSE") return subjectGender === "MALE" ? "BROTHER_IN_LAW" : "SISTER_IN_LAW";
  return null;
}

export function independentSolveRelation(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): IndependentRelation {
  const subject = graph.persons.find((person) => person.personId === subjectId);
  if (!subject || !graph.persons.some((person) => person.personId === referenceId)) {
    throw new Error("Independent verifier query references a missing person.");
  }
  const adjacency = new Map<string, { toId: string; step: PrimitivePathStep }[]>();
  const edgeKeys = new Set<string>();
  const add = (fromId: string, toId: string, step: PrimitivePathStep): void => {
    const key = `${fromId}>${toId}:${step}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    const row = adjacency.get(fromId) ?? [];
    row.push({ toId, step });
    adjacency.set(fromId, row);
  };
  for (const edge of graph.parentEdges) {
    add(edge.parentId, edge.childId, "CHILD");
    add(edge.childId, edge.parentId, "PARENT");
  }
  for (const edge of graph.spouseEdges) {
    add(edge.personAId, edge.personBId, "SPOUSE");
    add(edge.personBId, edge.personAId, "SPOUSE");
  }
  for (const edge of graph.siblingEdges) {
    add(edge.personAId, edge.personBId, "SIBLING");
    add(edge.personBId, edge.personAId, "SIBLING");
  }
  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const children = childrenByParent.get(edge.parentId) ?? [];
    children.push(edge.childId);
    childrenByParent.set(edge.parentId, children);
  }
  for (const children of childrenByParent.values()) {
    const unique = [...new Set(children)];
    for (let left = 0; left < unique.length; left += 1) {
      for (let right = left + 1; right < unique.length; right += 1) {
        add(unique[left]!, unique[right]!, "SIBLING");
        add(unique[right]!, unique[left]!, "SIBLING");
      }
    }
  }

  const supported: IndependentRelation[] = [];
  const visit = (
    currentId: string,
    personIds: readonly string[],
    steps: readonly PrimitivePathStep[],
    seen: ReadonlySet<string>,
  ): void => {
    if (steps.length > 4) return;
    if (currentId === referenceId && steps.length > 0) {
      const relationId = independentRelationForPath(steps, subject.gender);
      if (relationId) supported.push({ relationId, personIds, steps });
      return;
    }
    if (steps.length === 4) return;
    for (const next of adjacency.get(currentId) ?? []) {
      if (seen.has(next.toId)) continue;
      const nextSeen = new Set(seen);
      nextSeen.add(next.toId);
      visit(next.toId, [...personIds, next.toId], [...steps, next.step], nextSeen);
    }
  };
  visit(subjectId, [subjectId], [], new Set([subjectId]));
  if (!supported.length) throw new Error(`Independent verifier found no relation ${subjectId}->${referenceId}.`);
  const shortestLength = Math.min(...supported.map((entry) => entry.steps.length));
  const shortest = supported.filter((entry) => entry.steps.length === shortestLength);
  const relationIds = [...new Set(shortest.map((entry) => entry.relationId))];
  if (relationIds.length !== 1) throw new Error(`Independent verifier found ambiguous shortest relations: ${relationIds.join(", ")}.`);
  return shortest[0]!;
}

export function independentBroad(relationId: BlrRelationId): BlrCp005BroadRelationId {
  if (relationId === "FATHER" || relationId === "MOTHER") return "PARENT";
  if (relationId === "SON" || relationId === "DAUGHTER") return "CHILD";
  if (relationId === "BROTHER" || relationId === "SISTER") return "SIBLING";
  if (relationId === "HUSBAND" || relationId === "WIFE") return "SPOUSE";
  if (relationId === "GRANDFATHER" || relationId === "GRANDMOTHER") return "GRANDPARENT";
  if (relationId === "GRANDSON" || relationId === "GRANDDAUGHTER") return "GRANDCHILD";
  if (relationId === "GREAT_GRANDFATHER" || relationId === "GREAT_GRANDMOTHER") return "GREAT_GRANDPARENT";
  if (relationId === "GREAT_GRANDSON" || relationId === "GREAT_GRANDDAUGHTER") return "GREAT_GRANDCHILD";
  if (relationId === "UNCLE" || relationId === "AUNT") return "UNCLE_OR_AUNT";
  if (relationId === "NEPHEW" || relationId === "NIECE") return "NEPHEW_OR_NIECE";
  if (relationId === "FATHER_IN_LAW" || relationId === "MOTHER_IN_LAW") return "PARENT_IN_LAW";
  if (relationId === "SON_IN_LAW" || relationId === "DAUGHTER_IN_LAW") return "CHILD_IN_LAW";
  if (relationId === "BROTHER_IN_LAW" || relationId === "SISTER_IN_LAW") return "SIBLING_IN_LAW";
  return "COUSIN";
}

export function independentLineageSide(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): BlrCp005LineageSide {
  const solved = independentSolveRelation(graph, subjectId, referenceId);
  if (!["UNCLE", "AUNT", "GRANDFATHER", "GRANDMOTHER", "NEPHEW", "NIECE", "GRANDSON", "GRANDDAUGHTER"].includes(solved.relationId)) {
    return "UNSPECIFIED";
  }
  const pivotId = ["UNCLE", "AUNT", "GRANDFATHER", "GRANDMOTHER"].includes(solved.relationId)
    ? solved.personIds.at(-2)
    : solved.personIds[1];
  const pivot = graph.persons.find((person) => person.personId === pivotId);
  return pivot?.gender === "MALE" ? "PATERNAL" : pivot?.gender === "FEMALE" ? "MATERNAL" : "UNSPECIFIED";
}

export function independentCount(graph: FamilyGraph, spec: BlrCp005CountSpec): number {
  if (spec.kind === "TOTAL_MEMBERS") return graph.persons.length;
  if (spec.kind === "GENDER") return graph.persons.filter((person) => person.gender === spec.gender).length;
  if (spec.kind === "CHILDREN_OF") {
    return new Set(graph.parentEdges.filter((edge) => edge.parentId === spec.parentId).map((edge) => edge.childId)).size;
  }
  if (spec.kind === "MARRIED_COUPLES") {
    return new Set(graph.spouseEdges.map((edge) => [edge.personAId, edge.personBId].sort().join("::"))).size;
  }
  return graph.persons.filter((person) => {
    if (person.personId === spec.referenceId) return false;
    try {
      const exact = independentSolveRelation(graph, person.personId, spec.referenceId).relationId;
      return exact === spec.relationId || independentBroad(exact) === spec.relationId;
    } catch {
      return false;
    }
  }).length;
}

export function independentPredicate(graph: FamilyGraph, predicate: BlrCp005Predicate): boolean {
  if (predicate.kind === "GENDER") {
    return graph.persons.find((person) => person.personId === predicate.personId)?.gender === predicate.gender;
  }
  if (predicate.kind === "COUNT_EQUALS") return independentCount(graph, predicate.countSpec) === predicate.value;
  try {
    const exact = independentSolveRelation(graph, predicate.subjectId, predicate.referenceId).relationId;
    if (predicate.kind === "SIDE_RELATION") {
      return exact === predicate.relationId
        && independentLineageSide(graph, predicate.subjectId, predicate.referenceId) === predicate.lineageSide;
    }
    return exact === predicate.relationId || independentBroad(exact) === predicate.relationId;
  } catch {
    return false;
  }
}

export function truth(values: readonly boolean[]): BlrCp005TruthStatus {
  if (values.every(Boolean)) return "DEFINITE";
  if (values.some(Boolean)) return "POSSIBLE";
  return "IMPOSSIBLE";
}

export function canonicalRelationValues(
  graphs: readonly FamilyGraph[],
  subjectId: string,
  referenceId: string,
): BlrRelationId[] {
  return [...new Set(graphs.map((graph) => independentSolveRelation(graph, subjectId, referenceId).relationId))].sort();
}
