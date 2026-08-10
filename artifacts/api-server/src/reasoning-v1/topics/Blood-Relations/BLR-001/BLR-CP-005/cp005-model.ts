import { solveRelationFromGraph } from "../foundation/graph-closure";
import { assertValidFamilyGraph } from "../foundation/family-validity";
import { SeededRandom, stableHash } from "../foundation/prng";
import type { BlrGender, BlrRelationId, FamilyGraph } from "../foundation/types";
import {
  BLR_CP005_PERMANENT_CONTRACTS,
  BLR_CP005_RUNTIME_VERSION,
  type BlrCp005Authority,
  type BlrCp005BroadRelationId,
  type BlrCp005CountSpec,
  type BlrCp005Difficulty,
  type BlrCp005FamilyTreeDiagram,
  type BlrCp005FamilyTreeEdge,
  type BlrCp005LineageSide,
  type BlrCp005Model,
  type BlrCp005ModelSpace,
  type BlrCp005PermanentContract,
  type BlrCp005Predicate,
  type BlrCp005RelationAnswerId,
  type BlrCp005TruthStatus,
  type BlrCp005VariableDomain,
} from "./cp005-contracts";

export * from "./cp005-contracts";

export function contractForAuthority(authority: BlrCp005Authority): BlrCp005PermanentContract {
  const contract = BLR_CP005_PERMANENT_CONTRACTS.find((entry) => entry.solveAuthority === authority);
  if (!contract) throw new Error(`Missing CP-005 contract for ${authority}.`);
  return contract;
}

export function relationDisplay(relationId: BlrCp005RelationAnswerId): string {
  const overrides: Partial<Record<BlrCp005RelationAnswerId, string>> = {
    PARENT: "Parent", CHILD: "Child", SIBLING: "Sibling", SPOUSE: "Spouse",
    GRANDPARENT: "Grandparent", GRANDCHILD: "Grandchild",
    GREAT_GRANDPARENT: "Great-grandparent", GREAT_GRANDCHILD: "Great-grandchild",
    UNCLE_OR_AUNT: "Uncle or aunt", NEPHEW_OR_NIECE: "Nephew or niece",
    PARENT_IN_LAW: "Parent-in-law", CHILD_IN_LAW: "Child-in-law",
    SIBLING_IN_LAW: "Sibling-in-law", COUSIN: "Cousin",
    GREAT_GRANDFATHER: "Great-grandfather", GREAT_GRANDMOTHER: "Great-grandmother",
    GREAT_GRANDSON: "Great-grandson", GREAT_GRANDDAUGHTER: "Great-granddaughter",
    FATHER_IN_LAW: "Father-in-law", MOTHER_IN_LAW: "Mother-in-law",
    SON_IN_LAW: "Son-in-law", DAUGHTER_IN_LAW: "Daughter-in-law",
    BROTHER_IN_LAW: "Brother-in-law", SISTER_IN_LAW: "Sister-in-law",
  };
  return overrides[relationId] ?? relationId.toLocaleLowerCase("en-IN").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function broadRelation(relationId: BlrRelationId): BlrCp005BroadRelationId {
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

export function classifyTruth(values: readonly boolean[]): BlrCp005TruthStatus {
  if (!values.length) throw new Error("Cannot classify an empty model set.");
  if (values.every(Boolean)) return "DEFINITE";
  if (values.some(Boolean)) return "POSSIBLE";
  return "IMPOSSIBLE";
}

export function relationInModel(model: BlrCp005Model, subjectId: string, referenceId: string): BlrRelationId {
  return solveRelationFromGraph(model.graph, subjectId, referenceId).relationId;
}

export function lineageSideInModel(model: BlrCp005Model, subjectId: string, referenceId: string): BlrCp005LineageSide {
  const solved = solveRelationFromGraph(model.graph, subjectId, referenceId);
  const relationId = solved.relationId;
  if (!["UNCLE", "AUNT", "GRANDFATHER", "GRANDMOTHER", "NEPHEW", "NIECE", "GRANDSON", "GRANDDAUGHTER"].includes(relationId)) {
    return "UNSPECIFIED";
  }
  const ids = solved.path.personIds;
  const pivotId = relationId === "UNCLE" || relationId === "AUNT" || relationId === "GRANDFATHER" || relationId === "GRANDMOTHER"
    ? ids.at(-2)
    : ids[1];
  const pivot = model.graph.persons.find((person) => person.personId === pivotId);
  if (!pivot) return "UNSPECIFIED";
  return pivot.gender === "MALE" ? "PATERNAL" : pivot.gender === "FEMALE" ? "MATERNAL" : "UNSPECIFIED";
}

export function evaluateCount(model: BlrCp005Model, spec: BlrCp005CountSpec): number {
  if (spec.kind === "TOTAL_MEMBERS") return model.graph.persons.length;
  if (spec.kind === "GENDER") return model.graph.persons.filter((person) => person.gender === spec.gender).length;
  if (spec.kind === "CHILDREN_OF") return new Set(model.graph.parentEdges.filter((edge) => edge.parentId === spec.parentId).map((edge) => edge.childId)).size;
  if (spec.kind === "MARRIED_COUPLES") return new Set(model.graph.spouseEdges.map((edge) => [edge.personAId, edge.personBId].sort().join("::"))).size;
  return model.graph.persons.filter((person) => {
    if (person.personId === spec.referenceId) return false;
    try {
      const exact = relationInModel(model, person.personId, spec.referenceId);
      return exact === spec.relationId || broadRelation(exact) === spec.relationId;
    } catch {
      return false;
    }
  }).length;
}

export function evaluatePredicate(model: BlrCp005Model, predicate: BlrCp005Predicate): boolean {
  if (predicate.kind === "GENDER") {
    return model.graph.persons.find((person) => person.personId === predicate.personId)?.gender === predicate.gender;
  }
  if (predicate.kind === "COUNT_EQUALS") return evaluateCount(model, predicate.countSpec) === predicate.value;
  try {
    const exact = relationInModel(model, predicate.subjectId, predicate.referenceId);
    if (predicate.kind === "SIDE_RELATION") {
      return exact === predicate.relationId && lineageSideInModel(model, predicate.subjectId, predicate.referenceId) === predicate.lineageSide;
    }
    return exact === predicate.relationId || broadRelation(exact) === predicate.relationId;
  } catch {
    return false;
  }
}

export function graphFingerprint(graph: FamilyGraph): string {
  return stableHash([
    ...graph.persons.map((person) => `${person.personId}:${person.gender}`).sort(),
    ...graph.parentEdges.map((edge) => `${edge.parentId}>${edge.childId}`).sort(),
    ...graph.spouseEdges.map((edge) => [edge.personAId, edge.personBId].sort().join("=")).sort(),
    ...graph.siblingEdges.map((edge) => [edge.personAId, edge.personBId].sort().join("~")).sort(),
  ]);
}

export function enumerateModelSpace(input: {
  scenarioId: string;
  topologyId: string;
  groupKey: string;
  sharedPrompt: string;
  variables: readonly BlrCp005VariableDomain[];
  buildGraph: (assignment: Readonly<Record<string, string>>) => FamilyGraph | null;
}): BlrCp005ModelSpace {
  const assignments: Record<string, string>[] = [];
  const visit = (index: number, current: Record<string, string>): void => {
    if (index === input.variables.length) {
      assignments.push({ ...current });
      return;
    }
    const variable = input.variables[index]!;
    for (const value of variable.values) {
      current[variable.variableId] = value;
      visit(index + 1, current);
    }
    delete current[variable.variableId];
  };
  visit(0, {});

  const seen = new Set<string>();
  const models: BlrCp005Model[] = [];
  for (const assignment of assignments) {
    const graph = input.buildGraph(assignment);
    if (!graph) continue;
    assertValidFamilyGraph(graph);
    const fingerprint = graphFingerprint(graph);
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    models.push({
      modelId: `${input.scenarioId}-M${String(models.length + 1).padStart(2, "0")}`,
      assignment: { ...assignment },
      graph,
    });
  }
  if (models.length < 2) throw new Error(`${input.scenarioId} must retain at least two valid models.`);
  return { ...input, models };
}

function generationMap(graph: FamilyGraph): Map<string, number> {
  const generation = new Map<string, number>();
  if (graph.persons[0]) generation.set(graph.persons[0].personId, 0);
  let changed = true;
  for (let pass = 0; changed && pass < graph.persons.length * 4; pass += 1) {
    changed = false;
    const set = (id: string, value: number) => {
      if (!generation.has(id)) { generation.set(id, value); changed = true; }
    };
    for (const edge of graph.parentEdges) {
      const parent = generation.get(edge.parentId);
      const child = generation.get(edge.childId);
      if (parent !== undefined) set(edge.childId, parent - 1);
      if (child !== undefined) set(edge.parentId, child + 1);
    }
    for (const edge of [...graph.spouseEdges, ...graph.siblingEdges]) {
      const left = generation.get(edge.personAId);
      const right = generation.get(edge.personBId);
      if (left !== undefined) set(edge.personBId, left);
      if (right !== undefined) set(edge.personAId, right);
    }
    if (!changed) {
      const missing = graph.persons.find((person) => !generation.has(person.personId));
      if (missing) { generation.set(missing.personId, 0); changed = true; }
    }
  }
  return generation;
}

export function familyTreeForModel(
  model: BlrCp005Model,
  index: number,
  total: number,
  answerLabel: string,
  query?: { subjectId?: string; referenceId?: string },
): BlrCp005FamilyTreeDiagram {
  const generations = generationMap(model.graph);
  const nodes = model.graph.persons.map((person) => ({
    id: person.personId,
    label: person.name,
    gender: person.gender === "MALE" ? "male" as const : person.gender === "FEMALE" ? "female" as const : "unknown" as const,
    generation: generations.get(person.personId) ?? 0,
  }));
  const edges: BlrCp005FamilyTreeEdge[] = [
    ...model.graph.spouseEdges.map((edge, edgeIndex) => ({ id: `marriage-${edgeIndex}`, type: "marriage" as const, sourceId: edge.personAId, targetId: edge.personBId })),
    ...model.graph.parentEdges.map((edge, edgeIndex) => ({ id: `parent-${edgeIndex}`, type: "parent-child" as const, sourceId: edge.parentId, targetId: edge.childId })),
    ...model.graph.siblingEdges.map((edge, edgeIndex) => ({ id: `sibling-${edgeIndex}`, type: "sibling" as const, sourceId: edge.personAId, targetId: edge.personBId })),
  ];
  let pathPersonIds: readonly string[] = [];
  if (query?.subjectId && query.referenceId) {
    try { pathPersonIds = solveRelationFromGraph(model.graph, query.subjectId, query.referenceId).path.personIds; } catch { pathPersonIds = []; }
  }
  const rows = [...new Set(nodes.map((node) => node.generation))].sort((a, b) => b - a);
  const ascii = rows.map((row) => {
    const members = nodes.filter((node) => node.generation === row).map((node) => `[${node.label}]${node.gender === "male" ? "(+)" : node.gender === "female" ? "(-)" : "(?)"}`).join("   ");
    return `Generation ${row >= 0 ? "+" : ""}${row}: ${members}`;
  }).join("\n");
  return {
    kind: "blood-relation-family-tree", version: 1,
    title: "Valid family model",
    modelLabel: `Model ${index + 1} of ${total}`,
    nodes, edges,
    query: { ...query, answerLabel, pathPersonIds },
    accessibleSummary: `Valid model ${index + 1} of ${total} with ${nodes.length} people across ${rows.length} generations.`,
    asciiFallback: `${ascii}\n\nAssignment: ${Object.entries(model.assignment).map(([key, value]) => `${key}=${value}`).join(", ")}`,
  };
}

export function personName(modelSpace: BlrCp005ModelSpace, personId: string): string {
  for (const model of modelSpace.models) {
    const person = model.graph.persons.find((entry) => entry.personId === personId);
    if (person) return person.name;
  }
  return personId;
}

export function stableOptions<T extends { text: string; semanticKey: string; isCorrect: boolean }>(
  options: readonly T[],
  key: readonly (string | number)[],
): { options: T[]; correctIndex: number } {
  if (options.length !== 4) throw new Error("CP-005 requires four options.");
  if (new Set(options.map((option) => option.semanticKey)).size !== 4) throw new Error("CP-005 option semantics must be unique.");
  if (options.filter((option) => option.isCorrect).length !== 1) throw new Error("CP-005 needs exactly one correct option.");
  const rng = new SeededRandom(parseInt(stableHash(key), 16));
  const shuffled = rng.shuffle(options);
  return { options: shuffled, correctIndex: shuffled.findIndex((option) => option.isCorrect) };
}

export function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

export function difficultyFor(modelCount: number, optionStatusMix: number, advanced: boolean): BlrCp005Difficulty {
  const score = modelCount * 2 + optionStatusMix * 2 + (advanced ? 3 : 0);
  if (score >= 9) return "HARD";
  if (score >= 5) return "MEDIUM";
  return "EASY";
}

export function semanticFingerprint(input: readonly (string | number)[]): string {
  return stableHash([BLR_CP005_RUNTIME_VERSION, ...input]);
}
