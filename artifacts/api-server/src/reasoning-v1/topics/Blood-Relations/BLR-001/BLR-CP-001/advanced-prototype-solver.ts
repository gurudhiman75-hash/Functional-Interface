import {
  generationDelta,
  generationRelationForDelta,
  personsWithRelation,
} from "../foundation/family-analysis";
import { graphFromClues, solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp001AdvancedStructuredPrompt,
  BlrOrderedPair,
  BlrRelationClaim,
} from "./advanced-prototype-types";

export function personAnswerKey(personId: string): string {
  return `PERSON:${personId}`;
}

export function pairAnswerKey(pair: BlrOrderedPair): string {
  return `PAIR:${pair.subjectId}>${pair.referenceId}`;
}

export function claimAnswerKey(claim: BlrRelationClaim): string {
  return `CLAIM:${claim.subjectId}:${claim.relationId}:${claim.referenceId}`;
}

export function generationAnswerKey(relationId: string): string {
  return `GENERATION:${relationId}`;
}

export function relationAnswerKey(relationId: string): string {
  return `RELATION:${relationId}`;
}

export function relationClaimIsTrue(
  graph: FamilyGraph,
  claim: BlrRelationClaim,
): boolean {
  try {
    return (
      solveRelationFromGraph(graph, claim.subjectId, claim.referenceId).relationId ===
      claim.relationId
    );
  } catch {
    return false;
  }
}

export interface BlrCp001AdvancedSolveResult {
  answerKey: string;
  pathLength: number | null;
  generationDelta: number | null;
  graphPersonCount: number;
  graphEdgeCount: number;
}

export function solveBlrCp001AdvancedPrompt(
  prompt: BlrCp001AdvancedStructuredPrompt,
): BlrCp001AdvancedSolveResult {
  const graph = graphFromClues(prompt.clues, prompt.personNames);
  const graphEdgeCount =
    graph.parentEdges.length +
    graph.spouseEdges.length +
    graph.siblingEdges.length;

  if (prompt.query.kind === "IDENTIFY_PERSON_BY_RELATION") {
    const candidates = personsWithRelation(
      graph,
      prompt.query.referenceId,
      prompt.query.relationId,
    );
    if (candidates.length !== 1) {
      throw new Error(
        `Identity query expected one candidate, found ${candidates.length}: ${candidates.join(", ")}.`,
      );
    }
    const solved = solveRelationFromGraph(
      graph,
      candidates[0]!,
      prompt.query.referenceId,
    );
    return {
      answerKey: personAnswerKey(candidates[0]!),
      pathLength: solved.path.steps.length,
      generationDelta: null,
      graphPersonCount: graph.persons.length,
      graphEdgeCount,
    };
  }

  if (prompt.query.kind === "IDENTIFY_ORDERED_PAIR") {
    const query = prompt.query;
    const matches = query.candidatePairs.filter((pair) => {
      try {
        return (
          solveRelationFromGraph(graph, pair.subjectId, pair.referenceId).relationId ===
          query.relationId
        );
      } catch {
        return false;
      }
    });
    if (matches.length !== 1) {
      throw new Error(
        `Ordered-pair query expected one match, found ${matches.length}.`,
      );
    }
    const solved = solveRelationFromGraph(
      graph,
      matches[0]!.subjectId,
      matches[0]!.referenceId,
    );
    return {
      answerKey: pairAnswerKey(matches[0]!),
      pathLength: solved.path.steps.length,
      generationDelta: null,
      graphPersonCount: graph.persons.length,
      graphEdgeCount,
    };
  }

  if (prompt.query.kind === "SELECT_RELATION_CLAIM") {
    const query = prompt.query;
    const matches = query.claims.filter((claim) => {
      const truth = relationClaimIsTrue(graph, claim);
      return query.targetTruth === "TRUE" ? truth : !truth;
    });
    if (matches.length !== 1) {
      throw new Error(
        `Claim query expected one ${query.targetTruth} claim, found ${matches.length}.`,
      );
    }

    let pathLength: number | null = null;
    if (relationClaimIsTrue(graph, matches[0]!)) {
      pathLength = solveRelationFromGraph(
        graph,
        matches[0]!.subjectId,
        matches[0]!.referenceId,
      ).path.steps.length;
    }
    return {
      answerKey: claimAnswerKey(matches[0]!),
      pathLength,
      generationDelta: null,
      graphPersonCount: graph.persons.length,
      graphEdgeCount,
    };
  }

  if (prompt.query.kind === "COMPARE_GENERATIONS") {
    const delta = generationDelta(
      graph,
      prompt.query.subjectId,
      prompt.query.referenceId,
    );
    return {
      answerKey: generationAnswerKey(generationRelationForDelta(delta)),
      pathLength: null,
      generationDelta: delta,
      graphPersonCount: graph.persons.length,
      graphEdgeCount,
    };
  }

  const solved = solveRelationFromGraph(
    graph,
    prompt.query.subjectId,
    prompt.query.referenceId,
  );
  return {
    answerKey: relationAnswerKey(solved.relationId),
    pathLength: solved.path.steps.length,
    generationDelta: null,
    graphPersonCount: graph.persons.length,
    graphEdgeCount,
  };
}
