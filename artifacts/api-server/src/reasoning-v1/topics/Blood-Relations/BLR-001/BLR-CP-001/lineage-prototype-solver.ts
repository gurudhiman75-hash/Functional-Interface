import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type {
  BlrGender,
  BlrRelationId,
  FamilyGraph,
  RelationPath,
} from "../foundation/types";
import type {
  BlrCp001LineageStructuredPrompt,
  BlrExactLineageRelationId,
  BlrLineageSide,
} from "./lineage-prototype-types";

const EXACT_LINEAGE_LABELS: Readonly<Record<BlrExactLineageRelationId, string>> = {
  PATERNAL_GRANDFATHER: "Paternal grandfather",
  PATERNAL_GRANDMOTHER: "Paternal grandmother",
  MATERNAL_GRANDFATHER: "Maternal grandfather",
  MATERNAL_GRANDMOTHER: "Maternal grandmother",
  PATERNAL_UNCLE: "Paternal uncle",
  PATERNAL_AUNT: "Paternal aunt",
  MATERNAL_UNCLE: "Maternal uncle",
  MATERNAL_AUNT: "Maternal aunt",
};

export function exactLineageRelationLabel(
  relationId: BlrExactLineageRelationId,
): string {
  return EXACT_LINEAGE_LABELS[relationId];
}

export function personByGenderAnswerKey(personId: string): string {
  return `PERSON:${personId}`;
}

export function exactLineageAnswerKey(
  relationId: BlrExactLineageRelationId,
): string {
  return `EXACT_LINEAGE:${relationId}`;
}

export function swapExactLineageSide(
  relationId: BlrExactLineageRelationId,
): BlrExactLineageRelationId {
  const swaps: Readonly<Record<BlrExactLineageRelationId, BlrExactLineageRelationId>> = {
    PATERNAL_GRANDFATHER: "MATERNAL_GRANDFATHER",
    PATERNAL_GRANDMOTHER: "MATERNAL_GRANDMOTHER",
    MATERNAL_GRANDFATHER: "PATERNAL_GRANDFATHER",
    MATERNAL_GRANDMOTHER: "PATERNAL_GRANDMOTHER",
    PATERNAL_UNCLE: "MATERNAL_UNCLE",
    PATERNAL_AUNT: "MATERNAL_AUNT",
    MATERNAL_UNCLE: "PATERNAL_UNCLE",
    MATERNAL_AUNT: "PATERNAL_AUNT",
  };
  return swaps[relationId];
}

export function swapExactLineageGender(
  relationId: BlrExactLineageRelationId,
): BlrExactLineageRelationId {
  const swaps: Readonly<Record<BlrExactLineageRelationId, BlrExactLineageRelationId>> = {
    PATERNAL_GRANDFATHER: "PATERNAL_GRANDMOTHER",
    PATERNAL_GRANDMOTHER: "PATERNAL_GRANDFATHER",
    MATERNAL_GRANDFATHER: "MATERNAL_GRANDMOTHER",
    MATERNAL_GRANDMOTHER: "MATERNAL_GRANDFATHER",
    PATERNAL_UNCLE: "PATERNAL_AUNT",
    PATERNAL_AUNT: "PATERNAL_UNCLE",
    MATERNAL_UNCLE: "MATERNAL_AUNT",
    MATERNAL_AUNT: "MATERNAL_UNCLE",
  };
  return swaps[relationId];
}

export function swapExactLineageFamily(
  relationId: BlrExactLineageRelationId,
): BlrExactLineageRelationId {
  const swaps: Readonly<Record<BlrExactLineageRelationId, BlrExactLineageRelationId>> = {
    PATERNAL_GRANDFATHER: "PATERNAL_UNCLE",
    PATERNAL_GRANDMOTHER: "PATERNAL_AUNT",
    MATERNAL_GRANDFATHER: "MATERNAL_UNCLE",
    MATERNAL_GRANDMOTHER: "MATERNAL_AUNT",
    PATERNAL_UNCLE: "PATERNAL_GRANDFATHER",
    PATERNAL_AUNT: "PATERNAL_GRANDMOTHER",
    MATERNAL_UNCLE: "MATERNAL_GRANDFATHER",
    MATERNAL_AUNT: "MATERNAL_GRANDMOTHER",
  };
  return swaps[relationId];
}

export interface ExactLineageSolveResult {
  relationId: BlrExactLineageRelationId;
  lineageSide: BlrLineageSide;
  broadRelationId: BlrRelationId;
  path: RelationPath;
  lineageParentId: string;
}

export function solveExactLineageRelationFromGraph(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): ExactLineageSolveResult {
  const broad = solveRelationFromGraph(graph, subjectId, referenceId);
  if (
    broad.relationId !== "GRANDFATHER" &&
    broad.relationId !== "GRANDMOTHER" &&
    broad.relationId !== "UNCLE" &&
    broad.relationId !== "AUNT"
  ) {
    throw new Error(
      `Exact lineage is unsupported for broad relation ${broad.relationId}.`,
    );
  }
  if (broad.path.personIds.length !== 3) {
    throw new Error("Exact lineage requires a two-edge grandparent or aunt/uncle path.");
  }

  const lineageParentId = broad.path.personIds[1]!;
  const lineageParent = graph.persons.find(
    (person) => person.personId === lineageParentId,
  );
  if (!lineageParent || lineageParent.gender === "UNKNOWN") {
    throw new Error("The maternal/paternal side is not established by the clues.");
  }

  const lineageSide: BlrLineageSide =
    lineageParent.gender === "MALE" ? "PATERNAL" : "MATERNAL";
  const relationId = `${lineageSide}_${broad.relationId}` as BlrExactLineageRelationId;
  if (!(relationId in EXACT_LINEAGE_LABELS)) {
    throw new Error(`Unsupported exact lineage relation ${relationId}.`);
  }

  return {
    relationId,
    lineageSide,
    broadRelationId: broad.relationId,
    path: broad.path,
    lineageParentId,
  };
}

export interface BlrCp001LineageSolveResult {
  answerKey: string;
  graphPersonCount: number;
  graphEdgeCount: number;
  pathLength: number | null;
  targetGender: Exclude<BlrGender, "UNKNOWN"> | null;
  lineageSide: BlrLineageSide | null;
  broadRelationId: BlrRelationId | null;
  exactLineageRelationId: BlrExactLineageRelationId | null;
}

export function solveBlrCp001LineagePrompt(
  prompt: BlrCp001LineageStructuredPrompt,
): BlrCp001LineageSolveResult {
  const graph = graphFromClues(prompt.clues, prompt.personNames);
  const graphEdgeCount =
    graph.parentEdges.length + graph.spouseEdges.length + graph.siblingEdges.length;

  if (prompt.query.kind === "IDENTIFY_PERSON_BY_GENDER") {
    const query = prompt.query;
    const matches = query.candidatePersonIds.filter((personId) => {
      const person = graph.persons.find((entry) => entry.personId === personId);
      return person?.gender === query.targetGender;
    });
    if (matches.length !== 1) {
      throw new Error(
        `Gender query expected one ${query.targetGender} candidate, found ${matches.length}.`,
      );
    }
    return {
      answerKey: personByGenderAnswerKey(matches[0]!),
      graphPersonCount: graph.persons.length,
      graphEdgeCount,
      pathLength: null,
      targetGender: query.targetGender,
      lineageSide: null,
      broadRelationId: null,
      exactLineageRelationId: null,
    };
  }

  const solved = solveExactLineageRelationFromGraph(
    graph,
    prompt.query.subjectId,
    prompt.query.referenceId,
  );
  return {
    answerKey: exactLineageAnswerKey(solved.relationId),
    graphPersonCount: graph.persons.length,
    graphEdgeCount,
    pathLength: solved.path.steps.length,
    targetGender: null,
    lineageSide: solved.lineageSide,
    broadRelationId: solved.broadRelationId,
    exactLineageRelationId: solved.relationId,
  };
}
