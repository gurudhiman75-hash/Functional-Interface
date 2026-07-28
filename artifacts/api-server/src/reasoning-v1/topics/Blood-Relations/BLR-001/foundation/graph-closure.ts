import { directRelationSubjectGender, relationForPath } from "./relation-ontology";
import type {
  BlrStructuredPrompt,
  DirectRelationClue,
  FamilyGraph,
  FamilyPerson,
  PrimitivePathStep,
  RelationPath,
  RelationSolution,
} from "./types";
import { assertValidFamilyGraph } from "./family-validity";

interface AdjacencyStep {
  toId: string;
  step: PrimitivePathStep;
}

function unorderedKey(personAId: string, personBId: string): string {
  return [personAId, personBId].sort().join("::");
}

export function graphFromStructuredPrompt(prompt: BlrStructuredPrompt): FamilyGraph {
  const genders = new Map<string, "MALE" | "FEMALE">();
  const parentEdges = new Map<string, { parentId: string; childId: string }>();
  const spouseEdges = new Map<string, { personAId: string; personBId: string }>();
  const siblingEdges = new Map<string, { personAId: string; personBId: string }>();

  const setGender = (personId: string, gender: "MALE" | "FEMALE", source: string): void => {
    const existing = genders.get(personId);
    if (existing && existing !== gender) {
      throw new Error(`Contradictory gender for ${personId} while applying ${source}.`);
    }
    genders.set(personId, gender);
  };

  const addParent = (parentId: string, childId: string): void => {
    parentEdges.set(`${parentId}->${childId}`, { parentId, childId });
  };

  for (const clue of prompt.clues) {
    setGender(clue.subjectId, directRelationSubjectGender(clue.relationId), clue.relationId);
    switch (clue.relationId) {
      case "FATHER":
      case "MOTHER":
        addParent(clue.subjectId, clue.referenceId);
        break;
      case "SON":
      case "DAUGHTER":
        addParent(clue.referenceId, clue.subjectId);
        break;
      case "BROTHER":
      case "SISTER":
        siblingEdges.set(unorderedKey(clue.subjectId, clue.referenceId), {
          personAId: clue.subjectId,
          personBId: clue.referenceId,
        });
        break;
      case "HUSBAND":
        setGender(clue.referenceId, "FEMALE", clue.relationId);
        spouseEdges.set(unorderedKey(clue.subjectId, clue.referenceId), {
          personAId: clue.subjectId,
          personBId: clue.referenceId,
        });
        break;
      case "WIFE":
        setGender(clue.referenceId, "MALE", clue.relationId);
        spouseEdges.set(unorderedKey(clue.subjectId, clue.referenceId), {
          personAId: clue.subjectId,
          personBId: clue.referenceId,
        });
        break;
    }
  }

  const personIds = new Set<string>([
    ...Object.keys(prompt.personNames),
    ...prompt.clues.flatMap((clue) => [clue.subjectId, clue.referenceId]),
    prompt.query.subjectId,
    prompt.query.referenceId,
  ]);

  const persons: FamilyPerson[] = [...personIds].map((personId) => ({
    personId,
    name: prompt.personNames[personId] ?? personId,
    gender: genders.get(personId) ?? "UNKNOWN",
  }));

  const graph: FamilyGraph = {
    persons,
    parentEdges: [...parentEdges.values()],
    spouseEdges: [...spouseEdges.values()],
    siblingEdges: [...siblingEdges.values()],
  };
  assertValidFamilyGraph(graph);
  return graph;
}

function adjacencyFor(graph: FamilyGraph): Map<string, AdjacencyStep[]> {
  const adjacency = new Map<string, AdjacencyStep[]>();
  const add = (fromId: string, toId: string, step: PrimitivePathStep): void => {
    const entries = adjacency.get(fromId) ?? [];
    entries.push({ toId, step });
    adjacency.set(fromId, entries);
  };

  for (const edge of graph.parentEdges) {
    add(edge.parentId, edge.childId, "CHILD");
    add(edge.childId, edge.parentId, "PARENT");
  }
  for (const edge of graph.spouseEdges) {
    add(edge.personAId, edge.personBId, "SPOUSE");
    add(edge.personBId, edge.personAId, "SPOUSE");
  }
  for (const edge of graph.siblingEdges) {
    add(edge.personAId, edge.personBId, "SIBLING");
    add(edge.personBId, edge.personAId, "SIBLING");
  }
  return adjacency;
}

export function enumerateSimplePaths(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
  maxLength = 4,
): RelationPath[] {
  const adjacency = adjacencyFor(graph);
  const paths: RelationPath[] = [];

  const visit = (
    currentId: string,
    personIds: readonly string[],
    steps: readonly PrimitivePathStep[],
    seen: ReadonlySet<string>,
  ): void => {
    if (steps.length > maxLength) return;
    if (currentId === referenceId && steps.length > 0) {
      paths.push({ personIds, steps });
      return;
    }
    if (steps.length === maxLength) return;

    for (const edge of adjacency.get(currentId) ?? []) {
      if (seen.has(edge.toId)) continue;
      const nextSeen = new Set(seen);
      nextSeen.add(edge.toId);
      visit(edge.toId, [...personIds, edge.toId], [...steps, edge.step], nextSeen);
    }
  };

  visit(subjectId, [subjectId], [], new Set([subjectId]));
  return paths;
}

export function solveRelationFromGraph(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): RelationSolution {
  assertValidFamilyGraph(graph);
  const subject = graph.persons.find((person) => person.personId === subjectId);
  const reference = graph.persons.find((person) => person.personId === referenceId);
  if (!subject || !reference) throw new Error("Query references a person outside the graph.");
  if (subjectId === referenceId) throw new Error("Self-relation queries are outside BLR-CP-001.");

  const candidates = enumerateSimplePaths(graph, subjectId, referenceId)
    .map((path) => ({ path, relationId: relationForPath(path.steps, subject.gender) }))
    .filter((entry): entry is RelationSolution => entry.relationId !== null);

  if (candidates.length === 0) {
    throw new Error(`No supported relation path from ${subjectId} to ${referenceId}.`);
  }

  const shortestLength = Math.min(...candidates.map((candidate) => candidate.path.steps.length));
  const shortest = candidates.filter((candidate) => candidate.path.steps.length === shortestLength);
  const relationIds = new Set(shortest.map((candidate) => candidate.relationId));
  if (relationIds.size !== 1) {
    throw new Error(`Ambiguous relation from ${subjectId} to ${referenceId}: ${[...relationIds].join(", ")}.`);
  }

  return shortest[0]!;
}

export function solveRelationFromPrompt(prompt: BlrStructuredPrompt): RelationSolution {
  const graph = graphFromStructuredPrompt(prompt);
  return solveRelationFromGraph(graph, prompt.query.subjectId, prompt.query.referenceId);
}

export function clueToNormalizedText(clue: DirectRelationClue, names: Readonly<Record<string, string>>): string {
  return `${names[clue.subjectId] ?? clue.subjectId} is ${clue.relationId.toLocaleLowerCase("en-IN").replaceAll("_", " ")} of ${names[clue.referenceId] ?? clue.referenceId}.`;
}
