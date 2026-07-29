import { assertValidFamilyGraph } from "../foundation/family-validity";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp003MaritalAnswer,
  BlrCp003MaritalFact,
  BlrCp003MaritalQuestionSpec,
  BlrCp003MaritalScenario,
  BlrCp003MaritalStatus,
} from "./cp003-marital-types";

function sortedIds(personIds: readonly string[]): string[] {
  return [...personIds].sort();
}

function unorderedPair(personAId: string, personBId: string): readonly [string, string] {
  return sortedIds([personAId, personBId]) as [string, string];
}

function hasSpouseEdge(graph: FamilyGraph, personId: string): boolean {
  return graph.spouseEdges.some(
    (edge) => edge.personAId === personId || edge.personBId === personId,
  );
}

export function validateBlrCp003MaritalFacts(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
): void {
  const people = new Set(graph.persons.map((person) => person.personId));
  const statusByPerson = new Map<string, BlrCp003MaritalStatus>();

  for (const fact of facts) {
    if (!people.has(fact.personId)) {
      throw new Error(`Marital fact references unknown person ${fact.personId}.`);
    }
    const existing = statusByPerson.get(fact.personId);
    if (existing) {
      throw new Error(
        existing === fact.status
          ? `Duplicate marital fact for ${fact.personId}.`
          : `Contradictory marital facts for ${fact.personId}.`,
      );
    }
    if (fact.status === "UNMARRIED" && hasSpouseEdge(graph, fact.personId)) {
      throw new Error(
        `Explicit unmarried fact contradicts a spouse edge for ${fact.personId}.`,
      );
    }
    statusByPerson.set(fact.personId, fact.status);
  }
}

export function resolveBlrCp003MaritalStatus(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
  personId: string,
): BlrCp003MaritalStatus {
  if (!graph.persons.some((person) => person.personId === personId)) {
    throw new Error(`Marital-status query references unknown person ${personId}.`);
  }
  validateBlrCp003MaritalFacts(graph, facts);
  const explicit = facts.find((fact) => fact.personId === personId);
  if (explicit) return explicit.status;
  if (hasSpouseEdge(graph, personId)) return "MARRIED";
  throw new Error(
    `Marital status of ${personId} is not entailed; absence of a spouse edge is not proof of unmarried status.`,
  );
}

function personsWithMaritalStatus(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
  status: BlrCp003MaritalStatus,
): string[] {
  const result: string[] = [];
  for (const person of graph.persons) {
    try {
      if (resolveBlrCp003MaritalStatus(graph, facts, person.personId) === status) {
        result.push(person.personId);
      }
    } catch {
      // Unknown status is deliberately not converted into unmarried.
    }
  }
  return sortedIds(result);
}

function isSiblingPair(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  try {
    const forward = solveRelationFromGraph(graph, personAId, personBId).relationId;
    const reverse = solveRelationFromGraph(graph, personBId, personAId).relationId;
    return (
      ["BROTHER", "SISTER"].includes(forward) &&
      ["BROTHER", "SISTER"].includes(reverse)
    );
  } catch {
    return false;
  }
}

export function solveBlrCp003MaritalQuestion(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
  spec: BlrCp003MaritalQuestionSpec,
): BlrCp003MaritalAnswer {
  switch (spec.kind) {
    case "MARITAL_STATUS":
      return {
        kind: "MARITAL_STATUS",
        status: resolveBlrCp003MaritalStatus(graph, facts, spec.personId),
      };
    case "IDENTIFY_BY_MARITAL_STATUS": {
      const matches = personsWithMaritalStatus(graph, facts, spec.status);
      if (matches.length !== 1) {
        throw new Error(
          `Expected exactly one ${spec.status} person, found ${matches.length}.`,
        );
      }
      return { kind: "PERSON", personId: matches[0]! };
    }
    case "RELATION": {
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return { kind: "RELATION", relationId: solved.relationId };
    }
    case "SIBLING_PAIR": {
      if (!isSiblingPair(graph, spec.personAId, spec.personBId)) {
        throw new Error(`${spec.personAId}/${spec.personBId} is not a sibling pair.`);
      }
      return {
        kind: "PAIR",
        personIds: unorderedPair(spec.personAId, spec.personBId),
      };
    }
    case "PARENT_CHILD_PAIR": {
      const supported = graph.parentEdges.some(
        (edge) => edge.parentId === spec.parentId && edge.childId === spec.childId,
      );
      if (!supported) {
        throw new Error(`${spec.parentId}/${spec.childId} is not a parent-child pair.`);
      }
      return {
        kind: "PAIR",
        personIds: unorderedPair(spec.parentId, spec.childId),
      };
    }
  }
}

export function blrCp003MaritalSemanticKey(answer: BlrCp003MaritalAnswer): string {
  switch (answer.kind) {
    case "MARITAL_STATUS":
      return `MARITAL_STATUS:${answer.status}`;
    case "PERSON":
      return `PERSON:${answer.personId}`;
    case "RELATION":
      return `RELATION:${answer.relationId}`;
    case "PAIR":
      return `PAIR:${sortedIds(answer.personIds).join("::")}`;
  }
}

export function materializeBlrCp003MaritalHiddenGraph(
  scenario: BlrCp003MaritalScenario,
  personNames: Readonly<Record<string, string>>,
): FamilyGraph {
  const graph: FamilyGraph = {
    ...scenario.hiddenGraph,
    persons: scenario.hiddenGraph.persons.map((person) => ({
      ...person,
      name: personNames[person.personId] ?? person.name,
    })),
  };
  assertValidFamilyGraph(graph);
  validateBlrCp003MaritalFacts(graph, scenario.maritalFacts);
  return graph;
}

export function solveBlrCp003MaritalFromGraph(
  graph: FamilyGraph,
  facts: readonly BlrCp003MaritalFact[],
  scenario: BlrCp003MaritalScenario,
): readonly BlrCp003MaritalAnswer[] {
  validateBlrCp003MaritalFacts(graph, facts);
  return scenario.questions.map((spec) =>
    solveBlrCp003MaritalQuestion(graph, facts, spec),
  );
}

export function solveBlrCp003MaritalFromClues(
  scenario: BlrCp003MaritalScenario,
  personNames: Readonly<Record<string, string>>,
  clues = scenario.clues,
  facts = scenario.maritalFacts,
): { graph: FamilyGraph; answers: readonly BlrCp003MaritalAnswer[] } {
  const graph = graphFromClues(clues, personNames, Object.keys(personNames));
  return {
    graph,
    answers: solveBlrCp003MaritalFromGraph(graph, facts, scenario),
  };
}

export function proveBlrCp003MaritalHiddenAgreement(
  scenario: BlrCp003MaritalScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  const hidden = solveBlrCp003MaritalFromGraph(
    materializeBlrCp003MaritalHiddenGraph(scenario, personNames),
    scenario.maritalFacts,
    scenario,
  ).map(blrCp003MaritalSemanticKey);
  const reconstructed = solveBlrCp003MaritalFromClues(
    scenario,
    personNames,
  ).answers.map(blrCp003MaritalSemanticKey);
  return (
    hidden.length === reconstructed.length &&
    hidden.every((answer, index) => answer === reconstructed[index])
  );
}

export function proveEveryBlrCp003MaritalInputContributes(
  scenario: BlrCp003MaritalScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  if (!proveBlrCp003MaritalHiddenAgreement(scenario, personNames)) return false;
  const full = solveBlrCp003MaritalFromClues(scenario, personNames).answers.map(
    blrCp003MaritalSemanticKey,
  );

  const cluesContribute = scenario.clues.every((_, removedIndex) => {
    try {
      const reduced = solveBlrCp003MaritalFromClues(
        scenario,
        personNames,
        scenario.clues.filter((__, index) => index !== removedIndex),
        scenario.maritalFacts,
      ).answers.map(blrCp003MaritalSemanticKey);
      return reduced.some((answer, index) => answer !== full[index]);
    } catch {
      return true;
    }
  });

  const factsContribute = scenario.maritalFacts.every((_, removedIndex) => {
    try {
      const reduced = solveBlrCp003MaritalFromClues(
        scenario,
        personNames,
        scenario.clues,
        scenario.maritalFacts.filter((__, index) => index !== removedIndex),
      ).answers.map(blrCp003MaritalSemanticKey);
      return reduced.some((answer, index) => answer !== full[index]);
    } catch {
      return true;
    }
  });

  return cluesContribute && factsContribute;
}
