import {
  generationDelta,
  generationRelationForDelta,
} from "../foundation/family-analysis";
import { assertValidFamilyGraph } from "../foundation/family-validity";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp003QuestionSpec,
  BlrCp003ScenarioTemplate,
  BlrCp003SemanticAnswer,
} from "./cp003-types";

function orderedPair(personAId: string, personBId: string): readonly [string, string] {
  return [personAId, personBId].sort() as [string, string];
}

function isSpousePair(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  const expected = orderedPair(personAId, personBId).join("::");
  return graph.spouseEdges.some(
    (edge) => orderedPair(edge.personAId, edge.personBId).join("::") === expected,
  );
}

export function solveBlrCp003Question(
  graph: FamilyGraph,
  spec: BlrCp003QuestionSpec,
): BlrCp003SemanticAnswer {
  switch (spec.kind) {
    case "RELATION": {
      const solution = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return { kind: "RELATION", relationId: solution.relationId };
    }
    case "MARRIED_PAIR": {
      if (!isSpousePair(graph, spec.personAId, spec.personBId)) {
        throw new Error(
          `Expected ${spec.personAId}/${spec.personBId} to be a married pair in CP-003.`,
        );
      }
      return {
        kind: "PAIR",
        personIds: orderedPair(spec.personAId, spec.personBId),
      };
    }
    case "GENDER": {
      const person = graph.persons.find((entry) => entry.personId === spec.personId);
      if (!person || person.gender === "UNKNOWN") {
        throw new Error(`Gender is not entailed for ${spec.personId}.`);
      }
      return { kind: "GENDER", gender: person.gender };
    }
    case "GENERATION": {
      const delta = generationDelta(graph, spec.subjectId, spec.referenceId);
      return {
        kind: "GENERATION",
        generationRelationId: generationRelationForDelta(delta),
      };
    }
    case "TRUE_CLAIM": {
      const solution = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return {
        kind: "CLAIM",
        subjectId: spec.subjectId,
        relationId: solution.relationId,
        referenceId: spec.referenceId,
      };
    }
  }
}

export function blrCp003SemanticKey(answer: BlrCp003SemanticAnswer): string {
  switch (answer.kind) {
    case "RELATION":
      return `RELATION:${answer.relationId}`;
    case "PAIR":
      return `PAIR:${orderedPair(answer.personIds[0], answer.personIds[1]).join("::")}`;
    case "GENDER":
      return `GENDER:${answer.gender}`;
    case "GENERATION":
      return `GENERATION:${answer.generationRelationId}`;
    case "CLAIM":
      return `CLAIM:${answer.subjectId}:${answer.relationId}:${answer.referenceId}`;
  }
}

export function materializeBlrCp003HiddenGraph(
  scenario: BlrCp003ScenarioTemplate,
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

export function solveBlrCp003ScenarioFromHiddenGraph(
  scenario: BlrCp003ScenarioTemplate,
  personNames: Readonly<Record<string, string>>,
): {
  graph: FamilyGraph;
  answers: readonly BlrCp003SemanticAnswer[];
} {
  const graph = materializeBlrCp003HiddenGraph(scenario, personNames);
  const answers = scenario.questions.map((spec) => solveBlrCp003Question(graph, spec));
  return { graph, answers };
}

export function solveBlrCp003ScenarioFromClues(
  scenario: BlrCp003ScenarioTemplate,
  personNames: Readonly<Record<string, string>>,
): {
  graph: FamilyGraph;
  answers: readonly BlrCp003SemanticAnswer[];
} {
  const graph = graphFromClues(scenario.clues, personNames, Object.keys(personNames));
  const answers = scenario.questions.map((spec) => solveBlrCp003Question(graph, spec));
  return { graph, answers };
}

export function proveBlrCp003HiddenGraphAgreesWithClues(
  scenario: BlrCp003ScenarioTemplate,
  personNames: Readonly<Record<string, string>>,
): boolean {
  const hiddenAnswers = solveBlrCp003ScenarioFromHiddenGraph(
    scenario,
    personNames,
  ).answers.map(blrCp003SemanticKey);
  const clueAnswers = solveBlrCp003ScenarioFromClues(scenario, personNames).answers.map(
    blrCp003SemanticKey,
  );
  return (
    hiddenAnswers.length === clueAnswers.length &&
    hiddenAnswers.every((answer, index) => answer === clueAnswers[index])
  );
}

export function proveEveryBlrCp003ClueContributes(
  scenario: BlrCp003ScenarioTemplate,
  personNames: Readonly<Record<string, string>>,
): boolean {
  if (!proveBlrCp003HiddenGraphAgreesWithClues(scenario, personNames)) return false;

  const full = solveBlrCp003ScenarioFromClues(scenario, personNames).answers.map(
    blrCp003SemanticKey,
  );

  return scenario.clues.every((_, removedIndex) => {
    const reducedClues = scenario.clues.filter((__, index) => index !== removedIndex);
    try {
      const graph = graphFromClues(reducedClues, personNames, Object.keys(personNames));
      const reduced = scenario.questions.map((spec) =>
        blrCp003SemanticKey(solveBlrCp003Question(graph, spec)),
      );
      return reduced.some((key, index) => key !== full[index]);
    } catch {
      return true;
    }
  });
}
