import { personsWithRelation } from "../foundation/family-analysis";
import { assertValidFamilyGraph } from "../foundation/family-validity";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp003ExtendedAnswer,
  BlrCp003ExtendedQuestionSpec,
  BlrCp003ExtendedScenario,
} from "./cp003-extended-types";

function sortedIds(personIds: readonly string[]): string[] {
  return [...personIds].sort();
}

function unorderedPair(personAId: string, personBId: string): readonly [string, string] {
  return sortedIds([personAId, personBId]) as [string, string];
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

function isParentChildPair(graph: FamilyGraph, parentId: string, childId: string): boolean {
  return graph.parentEdges.some(
    (edge) => edge.parentId === parentId && edge.childId === childId,
  );
}

export function solveBlrCp003ExtendedQuestion(
  graph: FamilyGraph,
  spec: BlrCp003ExtendedQuestionSpec,
): BlrCp003ExtendedAnswer {
  switch (spec.kind) {
    case "IDENTIFY_PERSON": {
      const matches = sortedIds(
        personsWithRelation(graph, spec.referenceId, spec.relationId),
      );
      if (matches.length !== 1) {
        throw new Error(
          `Expected one ${spec.relationId} of ${spec.referenceId}, found ${matches.length}.`,
        );
      }
      return { kind: "PERSON", personId: matches[0]! };
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
      if (!isParentChildPair(graph, spec.parentId, spec.childId)) {
        throw new Error(`${spec.parentId}/${spec.childId} is not a parent-child pair.`);
      }
      return {
        kind: "PAIR",
        personIds: unorderedPair(spec.parentId, spec.childId),
      };
    }
    case "FALSE_CLAIM": {
      const actual = solveRelationFromGraph(
        graph,
        spec.subjectId,
        spec.referenceId,
      ).relationId;
      if (actual === spec.falseRelationId) {
        throw new Error("The designated false CP-003 claim is true in the graph.");
      }
      return {
        kind: "CLAIM",
        subjectId: spec.subjectId,
        relationId: spec.falseRelationId,
        referenceId: spec.referenceId,
      };
    }
    case "MEMBER_SET": {
      const personIds = sortedIds(
        personsWithRelation(graph, spec.referenceId, spec.relationId),
      );
      if (personIds.length < 2) {
        throw new Error(
          `CP-003 member-set prototype requires at least two matches, found ${personIds.length}.`,
        );
      }
      return { kind: "PERSON_SET", personIds };
    }
  }
}

export function blrCp003ExtendedSemanticKey(answer: BlrCp003ExtendedAnswer): string {
  switch (answer.kind) {
    case "PERSON":
      return `PERSON:${answer.personId}`;
    case "PAIR":
      return `PAIR:${sortedIds(answer.personIds).join("::")}`;
    case "CLAIM":
      return `CLAIM:${answer.subjectId}:${answer.relationId}:${answer.referenceId}`;
    case "PERSON_SET":
      return `PERSON_SET:${sortedIds(answer.personIds).join("::")}`;
  }
}

export function materializeBlrCp003ExtendedHiddenGraph(
  scenario: BlrCp003ExtendedScenario,
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
  return graph;
}

export function solveBlrCp003ExtendedFromGraph(
  graph: FamilyGraph,
  scenario: BlrCp003ExtendedScenario,
): readonly BlrCp003ExtendedAnswer[] {
  return scenario.questions.map((spec) => solveBlrCp003ExtendedQuestion(graph, spec));
}

export function solveBlrCp003ExtendedFromClues(
  scenario: BlrCp003ExtendedScenario,
  personNames: Readonly<Record<string, string>>,
): { graph: FamilyGraph; answers: readonly BlrCp003ExtendedAnswer[] } {
  const graph = graphFromClues(
    scenario.clues,
    personNames,
    Object.keys(personNames),
  );
  return { graph, answers: solveBlrCp003ExtendedFromGraph(graph, scenario) };
}

export function proveBlrCp003ExtendedHiddenAgreement(
  scenario: BlrCp003ExtendedScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  const hidden = solveBlrCp003ExtendedFromGraph(
    materializeBlrCp003ExtendedHiddenGraph(scenario, personNames),
    scenario,
  ).map(blrCp003ExtendedSemanticKey);
  const reconstructed = solveBlrCp003ExtendedFromClues(
    scenario,
    personNames,
  ).answers.map(blrCp003ExtendedSemanticKey);
  return (
    hidden.length === reconstructed.length &&
    hidden.every((answer, index) => answer === reconstructed[index])
  );
}

export function proveEveryBlrCp003ExtendedClueContributes(
  scenario: BlrCp003ExtendedScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  if (!proveBlrCp003ExtendedHiddenAgreement(scenario, personNames)) return false;
  const full = solveBlrCp003ExtendedFromClues(scenario, personNames).answers.map(
    blrCp003ExtendedSemanticKey,
  );

  return scenario.clues.every((_, removedIndex) => {
    try {
      const graph = graphFromClues(
        scenario.clues.filter((__, index) => index !== removedIndex),
        personNames,
        Object.keys(personNames),
      );
      const reduced = solveBlrCp003ExtendedFromGraph(graph, scenario).map(
        blrCp003ExtendedSemanticKey,
      );
      return reduced.some((answer, index) => answer !== full[index]);
    } catch {
      return true;
    }
  });
}
