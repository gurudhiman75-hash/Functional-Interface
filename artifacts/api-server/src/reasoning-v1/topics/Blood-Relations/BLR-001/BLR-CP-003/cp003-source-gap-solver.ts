import { assertValidFamilyGraph } from "../foundation/family-validity";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp003SourceGapAnswer,
  BlrCp003SourceGapQuestionSpec,
  BlrCp003SourceGapScenario,
} from "./cp003-source-gap-types";

function sortedPair(personAId: string, personBId: string): readonly [string, string] {
  return [personAId, personBId].sort() as [string, string];
}

function spousePairExists(
  graph: FamilyGraph,
  personAId: string,
  personBId: string,
): boolean {
  const expected = sortedPair(personAId, personBId).join("::");
  return graph.spouseEdges.some(
    (edge) => sortedPair(edge.personAId, edge.personBId).join("::") === expected,
  );
}

export function solveBlrCp003SourceGapQuestion(
  graph: FamilyGraph,
  spec: BlrCp003SourceGapQuestionSpec,
): BlrCp003SourceGapAnswer {
  switch (spec.kind) {
    case "IDENTIFY_PERSON_BY_GENDER": {
      const matches = spec.candidatePersonIds.filter((personId) => {
        const person = graph.persons.find((entry) => entry.personId === personId);
        if (!person) throw new Error(`Unknown gender candidate ${personId}.`);
        return person.gender === spec.gender;
      });
      if (matches.length !== 1) {
        throw new Error(
          `Expected one ${spec.gender} candidate, found ${matches.length}.`,
        );
      }
      return { kind: "PERSON", personId: matches[0]! };
    }
    case "RELATION": {
      const solved = solveRelationFromGraph(graph, spec.subjectId, spec.referenceId);
      return { kind: "RELATION", relationId: solved.relationId };
    }
    case "MARRIED_PAIR": {
      if (!spousePairExists(graph, spec.personAId, spec.personBId)) {
        throw new Error(`${spec.personAId}/${spec.personBId} is not a married pair.`);
      }
      return {
        kind: "PAIR",
        personIds: sortedPair(spec.personAId, spec.personBId),
      };
    }
  }
}

export function blrCp003SourceGapSemanticKey(
  answer: BlrCp003SourceGapAnswer,
): string {
  switch (answer.kind) {
    case "PERSON":
      return `PERSON:${answer.personId}`;
    case "RELATION":
      return `RELATION:${answer.relationId}`;
    case "PAIR":
      return `PAIR:${sortedPair(answer.personIds[0], answer.personIds[1]).join("::")}`;
  }
}

export function materializeBlrCp003SourceGapHiddenGraph(
  scenario: BlrCp003SourceGapScenario,
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

export function solveBlrCp003SourceGapFromGraph(
  graph: FamilyGraph,
  scenario: BlrCp003SourceGapScenario,
): readonly BlrCp003SourceGapAnswer[] {
  return scenario.questions.map((spec) =>
    solveBlrCp003SourceGapQuestion(graph, spec),
  );
}

export function solveBlrCp003SourceGapFromClues(
  scenario: BlrCp003SourceGapScenario,
  personNames: Readonly<Record<string, string>>,
  clues = scenario.clues,
): { graph: FamilyGraph; answers: readonly BlrCp003SourceGapAnswer[] } {
  const graph = graphFromClues(clues, personNames, Object.keys(personNames));
  return { graph, answers: solveBlrCp003SourceGapFromGraph(graph, scenario) };
}

export function proveBlrCp003SourceGapHiddenAgreement(
  scenario: BlrCp003SourceGapScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  const hidden = solveBlrCp003SourceGapFromGraph(
    materializeBlrCp003SourceGapHiddenGraph(scenario, personNames),
    scenario,
  ).map(blrCp003SourceGapSemanticKey);
  const reconstructed = solveBlrCp003SourceGapFromClues(
    scenario,
    personNames,
  ).answers.map(blrCp003SourceGapSemanticKey);
  return (
    hidden.length === reconstructed.length &&
    hidden.every((answer, index) => answer === reconstructed[index])
  );
}

export function proveEveryBlrCp003SourceGapClueContributes(
  scenario: BlrCp003SourceGapScenario,
  personNames: Readonly<Record<string, string>>,
): boolean {
  if (!proveBlrCp003SourceGapHiddenAgreement(scenario, personNames)) return false;
  const full = solveBlrCp003SourceGapFromClues(scenario, personNames).answers.map(
    blrCp003SourceGapSemanticKey,
  );
  return scenario.clues.every((_, removedIndex) => {
    try {
      const reduced = solveBlrCp003SourceGapFromClues(
        scenario,
        personNames,
        scenario.clues.filter((__, index) => index !== removedIndex),
      ).answers.map(blrCp003SourceGapSemanticKey);
      return reduced.some((answer, index) => answer !== full[index]);
    } catch {
      return true;
    }
  });
}
