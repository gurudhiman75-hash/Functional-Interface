import type {
  BlrCp006CodedStatement,
  BlrCp006DirectRelation,
  BlrCp006Gender,
  BlrCp006Graph,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type {
  BlrCp007ExpressionCandidate,
  BlrCp007Query,
  GeneratedBlrCp007Question,
} from "./cp007-model";

interface MutableGraph {
  persons: Map<string, BlrCp006Gender>;
  parents: Set<string>;
  spouses: Set<string>;
  siblings: Set<string>;
}

const pairKey = (a: string, b: string) => [a, b].sort().join("::");
const parentKey = (a: string, b: string) => `${a}->${b}`;

function ensure(graph: MutableGraph, id: string): void {
  if (!graph.persons.has(id)) graph.persons.set(id, "UNKNOWN");
}

function setGender(graph: MutableGraph, id: string, gender: Exclude<BlrCp006Gender, "UNKNOWN">): void {
  ensure(graph, id);
  const current = graph.persons.get(id)!;
  if (current !== "UNKNOWN" && current !== gender) throw new Error(`Contradictory gender for ${id}.`);
  graph.persons.set(id, gender);
}

function apply(graph: MutableGraph, leftId: string, relationId: BlrCp006DirectRelation, rightId: string): void {
  ensure(graph, leftId);
  ensure(graph, rightId);
  switch (relationId) {
    case "FATHER": setGender(graph, leftId, "MALE"); graph.parents.add(parentKey(leftId, rightId)); return;
    case "MOTHER": setGender(graph, leftId, "FEMALE"); graph.parents.add(parentKey(leftId, rightId)); return;
    case "SON": setGender(graph, leftId, "MALE"); graph.parents.add(parentKey(rightId, leftId)); return;
    case "DAUGHTER": setGender(graph, leftId, "FEMALE"); graph.parents.add(parentKey(rightId, leftId)); return;
    case "BROTHER": setGender(graph, leftId, "MALE"); graph.siblings.add(pairKey(leftId, rightId)); return;
    case "SISTER": setGender(graph, leftId, "FEMALE"); graph.siblings.add(pairKey(leftId, rightId)); return;
    case "HUSBAND": setGender(graph, leftId, "MALE"); setGender(graph, rightId, "FEMALE"); graph.spouses.add(pairKey(leftId, rightId)); return;
    case "WIFE": setGender(graph, leftId, "FEMALE"); setGender(graph, rightId, "MALE"); graph.spouses.add(pairKey(leftId, rightId)); return;
  }
}

function independentDecode(
  codeKey: GeneratedBlrCp007Question["codeKey"],
  statements: readonly BlrCp006CodedStatement[],
): BlrCp006Graph {
  const key = new Map(codeKey.map((entry) => [entry.token, entry.relationId]));
  const graph: MutableGraph = { persons: new Map(), parents: new Set(), spouses: new Set(), siblings: new Set() };
  for (const coded of statements) {
    const relationId = key.get(coded.token);
    if (!relationId) throw new Error(`Unknown token ${coded.token}.`);
    apply(graph, coded.leftId, relationId, coded.rightId);
  }

  let changed = true;
  for (let pass = 0; pass < 12 && changed; pass += 1) {
    changed = false;
    for (const siblingValue of graph.siblings) {
      const [leftId, rightId] = siblingValue.split("::") as [string, string];
      for (const parentValue of [...graph.parents]) {
        const [parentId, childId] = parentValue.split("->") as [string, string];
        if (childId === leftId && !graph.parents.has(parentKey(parentId, rightId))) {
          graph.parents.add(parentKey(parentId, rightId)); changed = true;
        }
        if (childId === rightId && !graph.parents.has(parentKey(parentId, leftId))) {
          graph.parents.add(parentKey(parentId, leftId)); changed = true;
        }
      }
    }
  }

  return {
    persons: [...graph.persons].map(([personId, gender]) => ({ personId, label: personId, gender })),
    parents: [...graph.parents].map((value) => { const [parentId, childId] = value.split("->"); return { parentId: parentId!, childId: childId! }; }),
    spouses: [...graph.spouses].map((value) => { const [personAId, personBId] = value.split("::"); return { personAId: personAId!, personBId: personBId! }; }),
    siblings: [...graph.siblings].map((value) => { const [personAId, personBId] = value.split("::"); return { personAId: personAId!, personBId: personBId! }; }),
  };
}

function genderOf(graph: BlrCp006Graph, id: string): BlrCp006Gender {
  return graph.persons.find((person) => person.personId === id)?.gender ?? "UNKNOWN";
}
function parentsOf(graph: BlrCp006Graph, id: string): string[] {
  return graph.parents.filter((edge) => edge.childId === id).map((edge) => edge.parentId);
}
function childrenOf(graph: BlrCp006Graph, id: string): string[] {
  return graph.parents.filter((edge) => edge.parentId === id).map((edge) => edge.childId);
}
function spousesOf(graph: BlrCp006Graph, id: string): string[] {
  return graph.spouses.flatMap((edge) => edge.personAId === id ? [edge.personBId] : edge.personBId === id ? [edge.personAId] : []);
}
function isParent(graph: BlrCp006Graph, parentId: string, childId: string): boolean {
  return graph.parents.some((edge) => edge.parentId === parentId && edge.childId === childId);
}
function isSpouse(graph: BlrCp006Graph, a: string, b: string): boolean {
  return graph.spouses.some((edge) =>
    (edge.personAId === a && edge.personBId === b) || (edge.personAId === b && edge.personBId === a)
  );
}
function isSibling(graph: BlrCp006Graph, a: string, b: string): boolean {
  if (a === b) return false;
  if (graph.siblings.some((edge) =>
    (edge.personAId === a && edge.personBId === b) || (edge.personAId === b && edge.personBId === a)
  )) return true;
  const aParents = new Set(parentsOf(graph, a));
  return parentsOf(graph, b).some((parentId) => aParents.has(parentId));
}
function exact(
  gender: BlrCp006Gender,
  male: BlrCp006Relation,
  female: BlrCp006Relation,
  broad: BlrCp006Relation,
): BlrCp006Relation {
  return gender === "MALE" ? male : gender === "FEMALE" ? female : broad;
}

function independentRelationOf(graph: BlrCp006Graph, subjectId: string, referenceId: string): BlrCp006Relation {
  if (subjectId === referenceId) throw new Error("Self relation.");
  const gender = genderOf(graph, subjectId);
  if (isParent(graph, subjectId, referenceId)) return exact(gender, "FATHER", "MOTHER", "PARENT");
  if (isParent(graph, referenceId, subjectId)) return exact(gender, "SON", "DAUGHTER", "CHILD");
  if (isSibling(graph, subjectId, referenceId)) return exact(gender, "BROTHER", "SISTER", "SIBLING");
  if (isSpouse(graph, subjectId, referenceId)) return exact(gender, "HUSBAND", "WIFE", "SPOUSE");
  for (const middle of childrenOf(graph, subjectId)) {
    if (isParent(graph, middle, referenceId)) return exact(gender, "GRANDFATHER", "GRANDMOTHER", "GRANDPARENT");
  }
  for (const middle of parentsOf(graph, subjectId)) {
    if (isParent(graph, referenceId, middle)) return exact(gender, "GRANDSON", "GRANDDAUGHTER", "GRANDCHILD");
  }
  for (const parentId of parentsOf(graph, referenceId)) {
    if (isSibling(graph, subjectId, parentId)) return exact(gender, "UNCLE", "AUNT", "UNCLE_OR_AUNT");
  }
  for (const parentId of parentsOf(graph, subjectId)) {
    if (isSibling(graph, parentId, referenceId)) return exact(gender, "NEPHEW", "NIECE", "NEPHEW_OR_NIECE");
  }
  for (const spouseId of spousesOf(graph, referenceId)) {
    if (isParent(graph, subjectId, spouseId)) return exact(gender, "FATHER_IN_LAW", "MOTHER_IN_LAW", "PARENT_IN_LAW");
    if (isSibling(graph, subjectId, spouseId)) return exact(gender, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
  }
  for (const childId of childrenOf(graph, referenceId)) {
    if (isSpouse(graph, subjectId, childId)) return exact(gender, "SON_IN_LAW", "DAUGHTER_IN_LAW", "CHILD_IN_LAW");
  }
  for (const siblingId of graph.persons.map((person) => person.personId).filter((id) => isSibling(graph, id, referenceId))) {
    if (isSpouse(graph, subjectId, siblingId)) return exact(gender, "BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING_IN_LAW");
  }
  throw new Error(`No supported relation from ${subjectId} to ${referenceId}.`);
}

function matches(
  codeKey: GeneratedBlrCp007Question["codeKey"],
  statements: readonly BlrCp006CodedStatement[],
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
): boolean {
  try {
    return independentRelationOf(independentDecode(codeKey, statements), target.subjectId, target.referenceId) === target.relationId;
  } catch {
    return false;
  }
}

function substitutePerson(
  query: Extract<BlrCp007Query, { kind: "MISSING_PERSON" }>,
  personId: string,
): readonly BlrCp006CodedStatement[] {
  return query.completeStatements.map((entry, index) => {
    if (index !== query.blankStatementIndex) return entry;
    return query.blankSide === "LEFT" ? { ...entry, leftId: personId } : { ...entry, rightId: personId };
  });
}

function validityOf(question: GeneratedBlrCp007Question, candidate: BlrCp007ExpressionCandidate): boolean {
  if (!candidate.claim) return false;
  return matches(question.codeKey, candidate.statements, candidate.claim);
}

export interface BlrCp007IndependentVerification {
  itemId: string;
  expectedCorrectIndex: number;
  answerMatches: boolean;
  completedGraphMatches: boolean;
  displayedParity: boolean;
}

export function independentlyVerifyBlrCp007Question(
  question: GeneratedBlrCp007Question,
): BlrCp007IndependentVerification {
  const checks = question.options.map((option) => {
    const query = question.query;
    if (query.kind === "SELECT_EXPRESSION") {
      const candidate = query.candidates.find((entry) => entry.text === option.text);
      return candidate ? matches(question.codeKey, candidate.statements, query.target) : false;
    }
    if (query.kind === "MISSING_TOKEN") {
      return option.text === query.completeStatements[query.blankStatementIndex]!.token;
    }
    if (query.kind === "MISSING_TOKEN_PAIR") {
      const expected = [
        query.completeStatements[query.blankStatementIndices[0]]!.token,
        query.completeStatements[query.blankStatementIndices[1]]!.token,
      ].join(", ");
      return option.text === expected;
    }
    if (query.kind === "MISSING_PERSON") {
      return matches(question.codeKey, substitutePerson(query, option.text), query.target);
    }
    const candidate = query.candidates.find((entry) => entry.text === option.text);
    if (!candidate) return false;
    const valid = validityOf(question, candidate);
    return query.desiredStatus === "VALID" ? valid : !valid;
  });

  if (checks.filter(Boolean).length !== 1) {
    throw new Error(`${question.itemId}: independent verifier found ${checks.filter(Boolean).length} answers.`);
  }
  const expectedCorrectIndex = checks.findIndex(Boolean);
  const independentlyDecoded = independentDecode(question.codeKey, question.completedStatements);
  const graphSignature = (graph: BlrCp006Graph) => JSON.stringify({
    persons: [...graph.persons].sort((a, b) => a.personId.localeCompare(b.personId)),
    parents: [...graph.parents].sort((a, b) => `${a.parentId}->${a.childId}`.localeCompare(`${b.parentId}->${b.childId}`)),
    spouses: [...graph.spouses].sort((a, b) => `${a.personAId}::${a.personBId}`.localeCompare(`${b.personAId}::${b.personBId}`)),
    siblings: [...graph.siblings].sort((a, b) => `${a.personAId}::${a.personBId}`.localeCompare(`${b.personAId}::${b.personBId}`)),
  });

  let displayedParity = true;
  if (
    question.query.kind === "MISSING_TOKEN" ||
    question.query.kind === "MISSING_TOKEN_PAIR" ||
    question.query.kind === "MISSING_PERSON"
  ) displayedParity = question.query.expressionLines.every((line) => question.stem.includes(line));

  return {
    itemId: question.itemId,
    expectedCorrectIndex,
    answerMatches: expectedCorrectIndex === question.correctIndex && question.options[expectedCorrectIndex]!.text === question.answer,
    completedGraphMatches: graphSignature(independentlyDecoded) === graphSignature(question.graph),
    displayedParity,
  };
}
