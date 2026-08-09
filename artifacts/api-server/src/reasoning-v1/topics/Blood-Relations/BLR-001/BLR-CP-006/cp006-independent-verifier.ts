
import {
  relationDisplay,
  type BlrCp006Gender,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type GeneratedBlrCp006Question,
} from "./cp006-model";

function key(a: string, b: string): string {
  return [a, b].sort().join("::");
}

interface IndependentGraph {
  gender: Map<string, BlrCp006Gender>;
  parents: Set<string>;
  spouses: Set<string>;
  siblings: Set<string>;
}

function reconstructed(question: GeneratedBlrCp006Question): IndependentGraph {
  const gender = new Map(question.graph.persons.map((person) => [person.personId, person.gender]));
  const parents = new Set(question.graph.parents.map((edge) => `${edge.parentId}->${edge.childId}`));
  const spouses = new Set(question.graph.spouses.map((edge) => key(edge.personAId, edge.personBId)));
  const siblings = new Set(question.graph.siblings.map((edge) => key(edge.personAId, edge.personBId)));
  return { gender, parents, spouses, siblings };
}

function parentOf(graph: IndependentGraph, a: string, b: string): boolean {
  return graph.parents.has(`${a}->${b}`);
}

function spouseOf(graph: IndependentGraph, a: string, b: string): boolean {
  return graph.spouses.has(key(a, b));
}

function parentIds(graph: IndependentGraph, personId: string): string[] {
  return [...graph.parents].flatMap((value) => {
    const [parentId, childId] = value.split("->");
    return childId === personId ? [parentId!] : [];
  });
}

function childIds(graph: IndependentGraph, personId: string): string[] {
  return [...graph.parents].flatMap((value) => {
    const [parentId, childId] = value.split("->");
    return parentId === personId ? [childId!] : [];
  });
}

function spouseIds(graph: IndependentGraph, personId: string): string[] {
  return [...graph.spouses].flatMap((value) => {
    const [a, b] = value.split("::");
    if (a === personId) return [b!];
    if (b === personId) return [a!];
    return [];
  });
}

function siblingOf(graph: IndependentGraph, a: string, b: string): boolean {
  if (a === b) return false;
  if (graph.siblings.has(key(a, b))) return true;
  const aParents = new Set(parentIds(graph, a));
  return parentIds(graph, b).some((parentId) => aParents.has(parentId));
}

function byGender(
  graph: IndependentGraph,
  personId: string,
  male: BlrCp006Relation,
  female: BlrCp006Relation,
  broad: BlrCp006Relation,
): BlrCp006Relation {
  const gender = graph.gender.get(personId) ?? "UNKNOWN";
  return gender === "MALE" ? male : gender === "FEMALE" ? female : broad;
}

export function independentlyResolveRelation(
  question: GeneratedBlrCp006Question,
  subjectId: string,
  referenceId: string,
): BlrCp006Relation {
  const graph = reconstructed(question);

  if (parentOf(graph, subjectId, referenceId)) {
    return byGender(graph, subjectId, "FATHER", "MOTHER", "PARENT");
  }
  if (parentOf(graph, referenceId, subjectId)) {
    return byGender(graph, subjectId, "SON", "DAUGHTER", "CHILD");
  }
  if (siblingOf(graph, subjectId, referenceId)) {
    return byGender(graph, subjectId, "BROTHER", "SISTER", "SIBLING");
  }
  if (spouseOf(graph, subjectId, referenceId)) {
    return byGender(graph, subjectId, "HUSBAND", "WIFE", "SPOUSE");
  }

  if (childIds(graph, subjectId).some((middle) => parentOf(graph, middle, referenceId))) {
    return byGender(graph, subjectId, "GRANDFATHER", "GRANDMOTHER", "GRANDPARENT");
  }
  if (parentIds(graph, subjectId).some((middle) => parentOf(graph, referenceId, middle))) {
    return byGender(graph, subjectId, "GRANDSON", "GRANDDAUGHTER", "GRANDCHILD");
  }

  if (parentIds(graph, referenceId).some((parentId) => siblingOf(graph, subjectId, parentId))) {
    return byGender(graph, subjectId, "UNCLE", "AUNT", "UNCLE_OR_AUNT");
  }
  if (parentIds(graph, subjectId).some((parentId) => siblingOf(graph, parentId, referenceId))) {
    return byGender(graph, subjectId, "NEPHEW", "NIECE", "NEPHEW_OR_NIECE");
  }

  for (const subjectParent of parentIds(graph, subjectId)) {
    for (const referenceParent of parentIds(graph, referenceId)) {
      if (siblingOf(graph, subjectParent, referenceParent)) return "COUSIN";
    }
  }

  for (const spouseId of spouseIds(graph, referenceId)) {
    if (parentOf(graph, subjectId, spouseId)) {
      return byGender(graph, subjectId, "FATHER_IN_LAW", "MOTHER_IN_LAW", "PARENT_IN_LAW");
    }
    if (siblingOf(graph, subjectId, spouseId)) {
      return byGender(graph, subjectId, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
    }
  }

  for (const childId of childIds(graph, referenceId)) {
    if (spouseOf(graph, subjectId, childId)) {
      return byGender(graph, subjectId, "SON_IN_LAW", "DAUGHTER_IN_LAW", "CHILD_IN_LAW");
    }
  }

  for (const candidateId of graph.gender.keys()) {
    if (siblingOf(graph, candidateId, referenceId) && spouseOf(graph, subjectId, candidateId)) {
      return byGender(graph, subjectId, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
    }
  }

  throw new Error(`Independent verifier found no relation from ${subjectId} to ${referenceId}.`);
}

export function independentlyAnswer(question: GeneratedBlrCp006Question): string {
  const query = question.query;
  if (query.kind === "RELATION") {
    return relationDisplay(independentlyResolveRelation(question, query.subjectId, query.referenceId));
  }
  if (query.kind === "IDENTIFY_PERSON") {
    const matches = [...new Set(query.candidateIds)].filter((personId) => {
      try {
        return independentlyResolveRelation(question, personId, query.referenceId) === query.relationId;
      } catch {
        return false;
      }
    });
    if (matches.length !== 1) throw new Error(`${question.itemId}: independent person matches ${matches.length}.`);
    return matches[0]!;
  }
  if (query.kind === "GENDER") {
    const gender = reconstructed(question).gender.get(query.personId) ?? "UNKNOWN";
    return gender === "MALE" ? "Male" : gender === "FEMALE" ? "Female" : "Cannot be determined";
  }
  const matches = query.candidatePairs.filter(([leftId, rightId]) => {
    try {
      const forward = independentlyResolveRelation(question, leftId, rightId);
      const reverse = independentlyResolveRelation(question, rightId, leftId);
      if (query.relationId === "SIBLING") return ["BROTHER", "SISTER", "SIBLING"].includes(forward);
      if (query.relationId === "SPOUSE") return ["HUSBAND", "WIFE", "SPOUSE"].includes(forward);
      if (query.relationId === "PARENT") {
        return ["FATHER", "MOTHER", "PARENT"].includes(forward) ||
          ["FATHER", "MOTHER", "PARENT"].includes(reverse);
      }
      return forward === query.relationId || reverse === query.relationId;
    } catch {
      return false;
    }
  });
  if (matches.length !== 1) throw new Error(`${question.itemId}: independent pair matches ${matches.length}.`);
  return `${matches[0]![0]} and ${matches[0]![1]}`;
}
