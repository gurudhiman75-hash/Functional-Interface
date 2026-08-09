import { solveRelationFromGraph } from "../foundation/graph-closure";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import {
  BLR_CP004_RELATION_PLURALS,
  unorderedPairKey,
  type GeneratedBlrCp004Question,
} from "./cp004-model";

function graphFromQuestion(question: GeneratedBlrCp004Question): FamilyGraph {
  return {
    persons: question.explanation.familyTree.nodes.map((node) => ({
      personId: node.id,
      name: node.label,
      gender:
        node.gender === "male"
          ? "MALE"
          : node.gender === "female"
            ? "FEMALE"
            : "UNKNOWN",
    })),
    parentEdges: question.explanation.familyTree.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => ({ parentId: edge.sourceId, childId: edge.targetId })),
    spouseEdges: question.explanation.familyTree.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
    siblingEdges: question.explanation.familyTree.edges
      .filter((edge) => edge.type === "sibling")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
  };
}

function nodeIdByLabel(
  question: GeneratedBlrCp004Question,
  label: string,
): string {
  const matches = question.explanation.familyTree.nodes.filter(
    (node) => node.label === label.trim(),
  );
  if (matches.length !== 1) {
    throw new Error(`Expected one CP-004 node named '${label}', found ${matches.length}.`);
  }
  return matches[0]!.id;
}

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

function siblingPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set(
    graph.siblingEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
  );
  const childrenByParent = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const ids = childrenByParent.get(edge.parentId) ?? [];
    ids.push(edge.childId);
    childrenByParent.set(edge.parentId, ids);
  }
  for (const children of childrenByParent.values()) {
    const unique = [...new Set(children)];
    for (let left = 0; left < unique.length; left += 1) {
      for (let right = left + 1; right < unique.length; right += 1) {
        keys.add(unorderedPairKey(unique[left]!, unique[right]!));
      }
    }
  }
  return sorted([...keys]);
}

function cousinPairKeys(graph: FamilyGraph): string[] {
  const keys = new Set<string>();
  for (let left = 0; left < graph.persons.length; left += 1) {
    for (let right = left + 1; right < graph.persons.length; right += 1) {
      const first = graph.persons[left]!;
      const second = graph.persons[right]!;
      try {
        if (
          solveRelationFromGraph(graph, first.personId, second.personId).relationId ===
          "COUSIN"
        ) {
          keys.add(unorderedPairKey(first.personId, second.personId));
        }
      } catch {
        // Not a supported cousin pair.
      }
    }
  }
  return sorted([...keys]);
}

function generationGroups(question: GeneratedBlrCp004Question): Map<number, string[]> {
  const groups = new Map<number, string[]>();
  for (const node of question.explanation.familyTree.nodes) {
    const ids = groups.get(node.generation) ?? [];
    ids.push(node.id);
    groups.set(node.generation, ids);
  }
  return groups;
}

function relativeCount(
  question: GeneratedBlrCp004Question,
  graph: FamilyGraph,
): { value: number; memberIds: string[] } {
  const relationEntry = (
    Object.entries(BLR_CP004_RELATION_PLURALS) as [BlrRelationId, string][]
  ).find(([, plural]) => question.stem.includes(`How many ${plural} of `));
  if (!relationEntry) throw new Error(`Cannot parse CP-004 relation stem '${question.stem}'.`);
  const [relationId, plural] = relationEntry;
  const prefix = `How many ${plural} of `;
  const suffix = " are named in the family?";
  const referenceName = question.stem.slice(prefix.length, -suffix.length);
  const referenceId = nodeIdByLabel(question, referenceName);
  const memberIds = graph.persons.flatMap((person) => {
    if (person.personId === referenceId) return [];
    try {
      return solveRelationFromGraph(graph, person.personId, referenceId).relationId ===
        relationId
        ? [person.personId]
        : [];
    } catch {
      return [];
    }
  });
  return { value: memberIds.length, memberIds: sorted(memberIds) };
}

function sharedChildrenCount(
  question: GeneratedBlrCp004Question,
  graph: FamilyGraph,
): { value: number; memberIds: string[] } {
  const match = /^How many children of (.+) and (.+) are named in the family\?$/.exec(
    question.stem,
  );
  if (!match) throw new Error(`Cannot parse shared-child stem '${question.stem}'.`);
  const parentA = nodeIdByLabel(question, match[1]!);
  const parentB = nodeIdByLabel(question, match[2]!);
  const memberIds = graph.persons
    .filter(
      (person) =>
        graph.parentEdges.some(
          (edge) => edge.parentId === parentA && edge.childId === person.personId,
        ) &&
        graph.parentEdges.some(
          (edge) => edge.parentId === parentB && edge.childId === person.personId,
        ),
    )
    .map((person) => person.personId);
  return { value: memberIds.length, memberIds: sorted(memberIds) };
}

function memberFilterCount(
  question: GeneratedBlrCp004Question,
  graph: FamilyGraph,
): { value: number; memberIds: string[] } {
  const nodes = question.explanation.familyTree.nodes;
  if (question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS") {
    const memberIds = nodes.map((node) => node.id);
    return { value: memberIds.length, memberIds: sorted(memberIds) };
  }
  if (question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-GENDER-MEMBERS") {
    const gender = question.stem.includes("male members") ? "male" : "female";
    const memberIds = nodes.filter((node) => node.gender === gender).map((node) => node.id);
    return { value: memberIds.length, memberIds: sorted(memberIds) };
  }
  if (
    question.sourcePrototypeId ===
    "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS"
  ) {
    let memberIds: string[];
    if (question.stem.includes("explicitly unmarried")) {
      memberIds = nodes
        .filter((node) => /explicitly unmarried/i.test(node.roleLabel ?? ""))
        .map((node) => node.id);
    } else if (question.stem.includes("marital status is unstated")) {
      memberIds = nodes
        .filter((node) => /marital status unstated/i.test(node.roleLabel ?? ""))
        .map((node) => node.id);
    } else {
      memberIds = [
        ...new Set(graph.spouseEdges.flatMap((edge) => [edge.personAId, edge.personBId])),
      ];
    }
    return { value: memberIds.length, memberIds: sorted(memberIds) };
  }
  const groups = generationGroups(question);
  const generations = [...groups.keys()];
  let generation: number;
  if (question.stem.includes("oldest generation")) {
    generation = Math.max(...generations);
  } else if (question.stem.includes("youngest generation")) {
    generation = Math.min(...generations);
  } else {
    const match = /generation (-?\d+)/.exec(question.stem);
    if (!match) throw new Error(`Cannot parse generation-member stem '${question.stem}'.`);
    generation = Number(match[1]);
  }
  const memberIds = groups.get(generation) ?? [];
  return { value: memberIds.length, memberIds: sorted(memberIds) };
}

function pairCount(
  question: GeneratedBlrCp004Question,
  graph: FamilyGraph,
): { value: number; pairKeys: string[] } {
  let pairKeys: string[];
  if (question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-MARRIED-COUPLES") {
    pairKeys = sorted([
      ...new Set(
        graph.spouseEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
      ),
    ]);
  } else if (
    question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-SIBLING-PAIRS"
  ) {
    pairKeys = siblingPairKeys(graph);
  } else if (
    question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS"
  ) {
    pairKeys = sorted([
      ...new Set(graph.parentEdges.map((edge) => `${edge.parentId}->${edge.childId}`)),
    ]);
  } else {
    pairKeys = cousinPairKeys(graph);
  }
  return { value: pairKeys.length, pairKeys };
}

export function independentlyVerifyBlrCp004Question(
  question: GeneratedBlrCp004Question,
): {
  value: number | readonly [number, number, number, number];
  memberIds: readonly string[];
  pairKeys: readonly string[];
} {
  const graph = graphFromQuestion(question);
  if (question.answer.kind === "COUNT_VECTOR") {
    const males = graph.persons.filter((person) => person.gender === "MALE").length;
    const females = graph.persons.filter((person) => person.gender === "FEMALE").length;
    const couples = new Set(
      graph.spouseEdges.map((edge) => unorderedPairKey(edge.personAId, edge.personBId)),
    ).size;
    const generations = generationGroups(question).size;
    return { value: [males, females, couples, generations], memberIds: [], pairKeys: [] };
  }
  if (question.solveAuthority === "COUNT_MEMBERS_BY_FILTER") {
    const result = memberFilterCount(question, graph);
    return { value: result.value, memberIds: result.memberIds, pairKeys: [] };
  }
  if (question.solveAuthority === "COUNT_RELATIVES_OF_REFERENCE") {
    const result = question.sourcePrototypeId === "BLR-CP004-PROT-COUNT-SHARED-CHILDREN"
      ? sharedChildrenCount(question, graph)
      : relativeCount(question, graph);
    return { value: result.value, memberIds: result.memberIds, pairKeys: [] };
  }
  if (question.solveAuthority === "COUNT_RELATION_PAIRS") {
    const result = pairCount(question, graph);
    return { value: result.value, memberIds: [], pairKeys: result.pairKeys };
  }
  return {
    value: generationGroups(question).size,
    memberIds: [],
    pairKeys: [],
  };
}
