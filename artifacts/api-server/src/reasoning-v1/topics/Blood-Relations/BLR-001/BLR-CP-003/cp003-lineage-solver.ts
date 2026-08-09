import {
  exactLineageRelationLabel,
  solveExactLineageRelationFromGraph,
} from "../BLR-CP-001/lineage-prototype-solver";
import type { BlrExactLineageRelationId } from "../BLR-CP-001/lineage-prototype-types";
import {
  generationDelta,
  personsWithRelation,
} from "../foundation/family-analysis";
import { assertValidFamilyGraph } from "../foundation/family-validity";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp003GenerationDistanceId,
  BlrCp003LineageAnswer,
  BlrCp003LineageQuestionSpec,
  BlrCp003LineageScenario,
} from "./cp003-lineage-types";

function sortedIds(personIds: readonly string[]): string[] {
  return [...personIds].sort();
}

export function blrCp003GenerationDistanceForDelta(
  delta: number,
): BlrCp003GenerationDistanceId {
  const byDelta: Readonly<Record<number, BlrCp003GenerationDistanceId>> = {
    0: "SAME_GENERATION",
    1: "ONE_GENERATION_ABOVE",
    2: "TWO_GENERATIONS_ABOVE",
    3: "THREE_GENERATIONS_ABOVE",
    [-1]: "ONE_GENERATION_BELOW",
    [-2]: "TWO_GENERATIONS_BELOW",
    [-3]: "THREE_GENERATIONS_BELOW",
  };
  const relationId = byDelta[delta];
  if (!relationId) {
    throw new Error(`CP-003 lineage generation distance ${delta} is unsupported.`);
  }
  return relationId;
}

export function blrCp003GenerationDistanceLabel(
  relationId: BlrCp003GenerationDistanceId,
): string {
  const labels: Readonly<Record<BlrCp003GenerationDistanceId, string>> = {
    SAME_GENERATION: "Same generation",
    ONE_GENERATION_ABOVE: "One generation above",
    TWO_GENERATIONS_ABOVE: "Two generations above",
    THREE_GENERATIONS_ABOVE: "Three generations above",
    ONE_GENERATION_BELOW: "One generation below",
    TWO_GENERATIONS_BELOW: "Two generations below",
    THREE_GENERATIONS_BELOW: "Three generations below",
  };
  return labels[relationId];
}

function identifyByExactLineage(
  graph: FamilyGraph,
  exactRelationId: BlrExactLineageRelationId,
  referenceId: string,
): string {
  const matches = graph.persons
    .map((person) => person.personId)
    .filter((personId) => personId !== referenceId)
    .filter((personId) => {
      try {
        return (
          solveExactLineageRelationFromGraph(graph, personId, referenceId)
            .relationId === exactRelationId
        );
      } catch {
        return false;
      }
    });
  if (matches.length !== 1) {
    throw new Error(
      `Expected one ${exactRelationId} of ${referenceId}, found ${matches.length}.`,
    );
  }
  return matches[0]!;
}

export function solveBlrCp003LineageQuestion(
  graph: FamilyGraph,
  spec: BlrCp003LineageQuestionSpec,
): BlrCp003LineageAnswer {
  switch (spec.kind) {
    case "EXACT_LINEAGE": {
      const solved = solveExactLineageRelationFromGraph(
        graph,
        spec.subjectId,
        spec.referenceId,
      );
      return { kind: "EXACT_LINEAGE", relationId: solved.relationId };
    }
    case "IDENTIFY_BY_EXACT_LINEAGE":
      return {
        kind: "PERSON",
        personId: identifyByExactLineage(
          graph,
          spec.exactRelationId,
          spec.referenceId,
        ),
      };
    case "RELATION": {
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return { kind: "RELATION", relationId: solved.relationId };
    }
    case "IDENTIFY_BY_RELATION": {
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
    case "GENERATION_DISTANCE": {
      const delta = generationDelta(graph, spec.subjectId, spec.referenceId);
      return {
        kind: "GENERATION_DISTANCE",
        relationId: blrCp003GenerationDistanceForDelta(delta),
      };
    }
    case "TRUE_CLAIM": {
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return {
        kind: "CLAIM",
        subjectId: spec.subjectId,
        relationId: solved.relationId,
        referenceId: spec.referenceId,
      };
    }
  }
}

export function blrCp003LineageSemanticKey(
  answer: BlrCp003LineageAnswer,
): string {
  switch (answer.kind) {
    case "EXACT_LINEAGE":
      return `EXACT_LINEAGE:${answer.relationId}`;
    case "RELATION":
      return `RELATION:${answer.relationId}`;
    case "PERSON":
      return `PERSON:${answer.personId}`;
    case "GENERATION_DISTANCE":
      return `GENERATION_DISTANCE:${answer.relationId}`;
    case "CLAIM":
      return `CLAIM:${answer.subjectId}:${answer.relationId}:${answer.referenceId}`;
  }
}

export function materializeBlrCp003LineageHiddenGraph(
  scenario: BlrCp003LineageScenario,
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

export function solveBlrCp003LineageFromGraph(
  graph: FamilyGraph,
  scenario: BlrCp003LineageScenario,
): readonly BlrCp003LineageAnswer[] {
  return scenario.questions.map((spec) =>
    solveBlrCp003LineageQuestion(graph, spec),
  );
}

export function solveBlrCp003LineageFromClues(
  scenario: BlrCp003LineageScenario,
  personNames: Readonly<Record<string, string>>,
  clues = scenario.clues,
): { graph: FamilyGraph; answers: readonly BlrCp003LineageAnswer[] } {
  const graph = graphFromClues(clues, personNames, Object.keys(personNames));
  return { graph, answers: solveBlrCp003LineageFromGraph(graph, scenario) };
}

export function proveBlrCp003LineageHiddenAgreement(
  scenario: BlrCp003LineageScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  const hidden = solveBlrCp003LineageFromGraph(
    materializeBlrCp003LineageHiddenGraph(scenario, personNames),
    scenario,
  ).map(blrCp003LineageSemanticKey);
  const reconstructed = solveBlrCp003LineageFromClues(
    scenario,
    personNames,
  ).answers.map(blrCp003LineageSemanticKey);
  return (
    hidden.length === reconstructed.length &&
    hidden.every((answer, index) => answer === reconstructed[index])
  );
}

export function proveEveryBlrCp003LineageClueContributes(
  scenario: BlrCp003LineageScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  if (!proveBlrCp003LineageHiddenAgreement(scenario, personNames)) return false;
  const full = solveBlrCp003LineageFromClues(scenario, personNames).answers.map(
    blrCp003LineageSemanticKey,
  );

  return scenario.clues.every((_, removedIndex) => {
    try {
      const reduced = solveBlrCp003LineageFromClues(
        scenario,
        personNames,
        scenario.clues.filter((__, index) => index !== removedIndex),
      ).answers.map(blrCp003LineageSemanticKey);
      return reduced.some((answer, index) => answer !== full[index]);
    } catch {
      return true;
    }
  });
}

export function renderBlrCp003GenerationRows(
  graph: FamilyGraph,
  rootId: string,
  personNames: Readonly<Record<string, string>>,
): string[] {
  const rows = new Map<number, string[]>();
  for (const person of graph.persons) {
    const delta = generationDelta(graph, person.personId, rootId);
    const members = rows.get(delta) ?? [];
    members.push(personNames[person.personId] ?? person.personId);
    rows.set(delta, members);
  }
  return [...rows.entries()]
    .sort(([left], [right]) => right - left)
    .map(([delta, members]) => {
      const label = delta === 0 ? "Generation 0" : `Generation ${delta > 0 ? "+" : ""}${delta}`;
      return `${label}: ${members.sort().join(", ")}`;
    });
}

export function describeBlrCp003ExactLineage(
  relationId: BlrExactLineageRelationId,
): string {
  return exactLineageRelationLabel(relationId);
}
