import {
  directRelationSentence,
  relationDisplay,
  type BlrCp006DirectRelation,
  type BlrCp006Gender,
  type BlrCp006Graph,
  type BlrCp006Query,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "./cp006-model";

interface MutablePerson {
  personId: string;
  label: string;
  gender: BlrCp006Gender;
}

interface MutableGraph {
  persons: Map<string, MutablePerson>;
  parents: Set<string>;
  spouses: Set<string>;
  siblings: Set<string>;
}

export function pairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

function parentKey(parentId: string, childId: string): string {
  return `${parentId}->${childId}`;
}

function mutableGraph(): MutableGraph {
  return {
    persons: new Map(),
    parents: new Set(),
    spouses: new Set(),
    siblings: new Set(),
  };
}

function ensurePerson(graph: MutableGraph, personId: string): MutablePerson {
  const existing = graph.persons.get(personId);
  if (existing) return existing;
  const created = { personId, label: personId, gender: "UNKNOWN" as const };
  graph.persons.set(personId, created);
  return created;
}

function setGender(graph: MutableGraph, personId: string, gender: Exclude<BlrCp006Gender, "UNKNOWN">): void {
  const person = ensurePerson(graph, personId);
  if (person.gender !== "UNKNOWN" && person.gender !== gender) {
    throw new Error(`Contradictory gender for ${personId}.`);
  }
  person.gender = gender;
}

function addParent(graph: MutableGraph, parentId: string, childId: string): void {
  if (parentId === childId) throw new Error("Self-parent relation.");
  ensurePerson(graph, parentId);
  ensurePerson(graph, childId);
  graph.parents.add(parentKey(parentId, childId));
}

function addSpouse(graph: MutableGraph, a: string, b: string): void {
  if (a === b) throw new Error("Self-spouse relation.");
  ensurePerson(graph, a);
  ensurePerson(graph, b);
  graph.spouses.add(pairKey(a, b));
}

function addSibling(graph: MutableGraph, a: string, b: string): void {
  if (a === b) throw new Error("Self-sibling relation.");
  ensurePerson(graph, a);
  ensurePerson(graph, b);
  graph.siblings.add(pairKey(a, b));
}

function applyDirectRelation(
  graph: MutableGraph,
  leftId: string,
  relationId: BlrCp006DirectRelation,
  rightId: string,
): void {
  switch (relationId) {
    case "FATHER":
      setGender(graph, leftId, "MALE");
      addParent(graph, leftId, rightId);
      return;
    case "MOTHER":
      setGender(graph, leftId, "FEMALE");
      addParent(graph, leftId, rightId);
      return;
    case "SON":
      setGender(graph, leftId, "MALE");
      addParent(graph, rightId, leftId);
      return;
    case "DAUGHTER":
      setGender(graph, leftId, "FEMALE");
      addParent(graph, rightId, leftId);
      return;
    case "BROTHER":
      setGender(graph, leftId, "MALE");
      addSibling(graph, leftId, rightId);
      return;
    case "SISTER":
      setGender(graph, leftId, "FEMALE");
      addSibling(graph, leftId, rightId);
      return;
    case "HUSBAND":
      setGender(graph, leftId, "MALE");
      setGender(graph, rightId, "FEMALE");
      addSpouse(graph, leftId, rightId);
      return;
    case "WIFE":
      setGender(graph, leftId, "FEMALE");
      setGender(graph, rightId, "MALE");
      addSpouse(graph, leftId, rightId);
      return;
  }
}

export function decodeScenario(input: BlrCp006Scenario): {
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
} {
  const keyMap = new Map(input.codeKey.map((entry) => [entry.token, entry.relationId]));
  if (keyMap.size !== input.codeKey.length) {
    throw new Error(`${input.scenarioId}: duplicate code token.`);
  }
  const graph = mutableGraph();
  const decodedStatements: string[] = [];
  for (const coded of input.statements) {
    const relationId = keyMap.get(coded.token);
    if (!relationId) throw new Error(`${input.scenarioId}: unknown token ${coded.token}.`);
    applyDirectRelation(graph, coded.leftId, relationId, coded.rightId);
    decodedStatements.push(directRelationSentence(coded.leftId, relationId, coded.rightId));
  }

  // V1 sibling statements describe full siblings. Propagate every explicitly
  // decoded parent across the sibling group before solving derived relations.
  let changed = true;
  for (let pass = 0; pass < 12 && changed; pass += 1) {
    changed = false;
    for (const siblingValue of graph.siblings) {
      const [leftId, rightId] = siblingValue.split("::") as [string, string];
      const parentPairs = [...graph.parents].map((value) => value.split("->") as [string, string]);
      for (const [parentId, childId] of parentPairs) {
        if (childId === leftId && !graph.parents.has(parentKey(parentId, rightId))) {
          graph.parents.add(parentKey(parentId, rightId));
          changed = true;
        }
        if (childId === rightId && !graph.parents.has(parentKey(parentId, leftId))) {
          graph.parents.add(parentKey(parentId, leftId));
          changed = true;
        }
      }
    }
  }

  return {
    graph: {
      persons: [...graph.persons.values()].sort((a, b) => a.personId.localeCompare(b.personId)),
      parents: [...graph.parents].map((value) => {
        const [parentId, childId] = value.split("->");
        return { parentId: parentId!, childId: childId! };
      }),
      spouses: [...graph.spouses].map((value) => {
        const [personAId, personBId] = value.split("::");
        return { personAId: personAId!, personBId: personBId! };
      }),
      siblings: [...graph.siblings].map((value) => {
        const [personAId, personBId] = value.split("::");
        return { personAId: personAId!, personBId: personBId! };
      }),
    },
    decodedStatements,
  };
}

export function genderOf(graph: BlrCp006Graph, personId: string): BlrCp006Gender {
  return graph.persons.find((person) => person.personId === personId)?.gender ?? "UNKNOWN";
}

function isParent(graph: BlrCp006Graph, parentId: string, childId: string): boolean {
  return graph.parents.some((edge) => edge.parentId === parentId && edge.childId === childId);
}

function isSpouse(graph: BlrCp006Graph, a: string, b: string): boolean {
  return graph.spouses.some((edge) =>
    (edge.personAId === a && edge.personBId === b) ||
    (edge.personAId === b && edge.personBId === a)
  );
}

function parentsOf(graph: BlrCp006Graph, personId: string): string[] {
  return graph.parents.filter((edge) => edge.childId === personId).map((edge) => edge.parentId);
}

function childrenOf(graph: BlrCp006Graph, personId: string): string[] {
  return graph.parents.filter((edge) => edge.parentId === personId).map((edge) => edge.childId);
}

function spousesOf(graph: BlrCp006Graph, personId: string): string[] {
  return graph.spouses.flatMap((edge) => {
    if (edge.personAId === personId) return [edge.personBId];
    if (edge.personBId === personId) return [edge.personAId];
    return [];
  });
}

function isSibling(graph: BlrCp006Graph, a: string, b: string): boolean {
  if (a === b) return false;
  if (graph.siblings.some((edge) =>
    (edge.personAId === a && edge.personBId === b) ||
    (edge.personAId === b && edge.personBId === a)
  )) return true;
  const aParents = new Set(parentsOf(graph, a));
  return parentsOf(graph, b).some((parentId) => aParents.has(parentId));
}

function exactByGender(
  gender: BlrCp006Gender,
  male: BlrCp006Relation,
  female: BlrCp006Relation,
  broad: BlrCp006Relation,
): BlrCp006Relation {
  return gender === "MALE" ? male : gender === "FEMALE" ? female : broad;
}

export function relationOf(
  graph: BlrCp006Graph,
  subjectId: string,
  referenceId: string,
): BlrCp006Relation {
  if (subjectId === referenceId) throw new Error("A person has no kinship relation to self.");

  const subjectGender = genderOf(graph, subjectId);

  if (isParent(graph, subjectId, referenceId)) {
    return exactByGender(subjectGender, "FATHER", "MOTHER", "PARENT");
  }
  if (isParent(graph, referenceId, subjectId)) {
    return exactByGender(subjectGender, "SON", "DAUGHTER", "CHILD");
  }
  if (isSibling(graph, subjectId, referenceId)) {
    return exactByGender(subjectGender, "BROTHER", "SISTER", "SIBLING");
  }
  if (isSpouse(graph, subjectId, referenceId)) {
    return exactByGender(subjectGender, "HUSBAND", "WIFE", "SPOUSE");
  }

  for (const middle of childrenOf(graph, subjectId)) {
    if (isParent(graph, middle, referenceId)) {
      return exactByGender(subjectGender, "GRANDFATHER", "GRANDMOTHER", "GRANDPARENT");
    }
  }
  for (const middle of parentsOf(graph, subjectId)) {
    if (isParent(graph, referenceId, middle)) {
      return exactByGender(subjectGender, "GRANDSON", "GRANDDAUGHTER", "GRANDCHILD");
    }
  }

  for (const parentId of parentsOf(graph, referenceId)) {
    if (isSibling(graph, subjectId, parentId)) {
      return exactByGender(subjectGender, "UNCLE", "AUNT", "UNCLE_OR_AUNT");
    }
  }
  for (const parentId of parentsOf(graph, subjectId)) {
    if (isSibling(graph, parentId, referenceId)) {
      return exactByGender(subjectGender, "NEPHEW", "NIECE", "NEPHEW_OR_NIECE");
    }
  }

  for (const subjectParent of parentsOf(graph, subjectId)) {
    for (const referenceParent of parentsOf(graph, referenceId)) {
      if (isSibling(graph, subjectParent, referenceParent)) return "COUSIN";
    }
  }

  for (const spouseId of spousesOf(graph, referenceId)) {
    if (isParent(graph, subjectId, spouseId)) {
      return exactByGender(subjectGender, "FATHER_IN_LAW", "MOTHER_IN_LAW", "PARENT_IN_LAW");
    }
    if (isSibling(graph, subjectId, spouseId)) {
      return exactByGender(subjectGender, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
    }
  }

  for (const childId of childrenOf(graph, referenceId)) {
    if (isSpouse(graph, subjectId, childId)) {
      return exactByGender(subjectGender, "SON_IN_LAW", "DAUGHTER_IN_LAW", "CHILD_IN_LAW");
    }
  }

  for (const siblingId of graph.persons.map((person) => person.personId).filter((id) => isSibling(graph, id, referenceId))) {
    if (isSpouse(graph, subjectId, siblingId)) {
      return exactByGender(subjectGender, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
    }
  }

  throw new Error(`No supported relation from ${subjectId} to ${referenceId}.`);
}

export function answerForQuery(graph: BlrCp006Graph, query: BlrCp006Query): string {
  if (query.kind === "RELATION") {
    return relationDisplay(relationOf(graph, query.subjectId, query.referenceId));
  }
  if (query.kind === "IDENTIFY_PERSON") {
    const matches = [...new Set(query.candidateIds)].filter((personId) => {
      try {
        return relationOf(graph, personId, query.referenceId) === query.relationId;
      } catch {
        return false;
      }
    });
    if (matches.length !== 1) throw new Error(`Expected one matching person, got ${matches.join(", ")}.`);
    return matches[0]!;
  }
  if (query.kind === "GENDER") {
    const gender = genderOf(graph, query.personId);
    if (gender === "UNKNOWN") return "Cannot be determined";
    return gender === "MALE" ? "Male" : "Female";
  }
  const matches = query.candidatePairs.filter(([leftId, rightId]) => {
    try {
      const forward = relationOf(graph, leftId, rightId);
      const reverse = relationOf(graph, rightId, leftId);
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
  if (matches.length !== 1) throw new Error(`Expected one matching pair, got ${matches.length}.`);
  return `${matches[0]![0]} and ${matches[0]![1]}`;
}
