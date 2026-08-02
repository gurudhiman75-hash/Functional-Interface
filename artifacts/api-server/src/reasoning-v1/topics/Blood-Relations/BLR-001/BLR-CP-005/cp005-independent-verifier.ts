import type { FamilyGraph } from "../foundation/types";
import type {
  BlrCp005QuerySpec,
  BlrCp005RelationAnswerId,
  GeneratedBlrCp005Question,
} from "./cp005-model";
import {
  canonicalRelationValues,
  graphFromDiagram,
  independentBroad,
  independentCount,
  independentPredicate,
  independentSolveRelation,
  truth,
} from "./cp005-independent-core";

export interface BlrCp005IndependentResult {
  answer: GeneratedBlrCp005Question["answer"];
  expectedSemanticKey: string;
  modelRelations: readonly string[];
  modelCounts: readonly number[];
}

function solveIndependent(
  query: BlrCp005QuerySpec,
  graphs: readonly FamilyGraph[],
): { answer: GeneratedBlrCp005Question["answer"]; expectedSemanticKey: string; modelRelations: string[]; modelCounts: number[] } {
  const emptyRelations: string[] = [];
  const emptyCounts: number[] = [];
  if (query.kind === "INVARIANT_RELATION") {
    const exact = canonicalRelationValues(graphs, query.subjectId, query.referenceId);
    const relationId: BlrCp005RelationAnswerId = exact.length === 1
      ? exact[0]!
      : (() => {
          const broad = [...new Set(exact.map(independentBroad))];
          if (broad.length !== 1) throw new Error("Independent verifier found no invariant broad relation.");
          return broad[0]!;
        })();
    return { answer: { kind: "RELATION", relationId }, expectedSemanticKey: `RELATION:${relationId}`, modelRelations: exact, modelCounts: emptyCounts };
  }
  if (query.kind === "RELATION_UNCERTAINTY") {
    const values = canonicalRelationValues(graphs, query.subjectId, query.referenceId);
    if (query.mode === "ONE_OF_TWO") {
      if (values.length !== 2) throw new Error("Independent verifier expected two relation values.");
      return { answer: { kind: "RELATION_SET", relationIds: values }, expectedSemanticKey: `RELATION_SET:${values.join(":")}`, modelRelations: values, modelCounts: emptyCounts };
    }
    return { answer: { kind: "INDETERMINATE", survivingValues: values }, expectedSemanticKey: "INDETERMINATE", modelRelations: values, modelCounts: emptyCounts };
  }
  if (query.kind === "CLAIM_STATUS") {
    const matches = query.claims.filter((claim) => truth(graphs.map((graph) => independentPredicate(graph, claim.predicate))) === query.requestedStatus);
    if (matches.length !== 1) throw new Error(`Independent verifier found ${matches.length} matching claims.`);
    return { answer: { kind: "CLAIM", claimId: matches[0]!.claimId, status: query.requestedStatus }, expectedSemanticKey: `CLAIM:${matches[0]!.claimId}`, modelRelations: emptyRelations, modelCounts: emptyCounts };
  }
  if (query.kind === "PERSON_STATUS") {
    const candidates = [...new Set(query.candidatePersonIds)];
    const matches = candidates.filter((personId) => truth(graphs.map((graph) => {
      try {
        const exact = independentSolveRelation(graph, personId, query.referenceId).relationId;
        return exact === query.relationId || independentBroad(exact) === query.relationId;
      } catch { return false; }
    })) === query.requestedStatus);
    if (matches.length !== 1) throw new Error(`Independent verifier found ${matches.length} matching people.`);
    return { answer: { kind: "PERSON", personId: matches[0]!, status: query.requestedStatus }, expectedSemanticKey: `PERSON:${matches[0]}`, modelRelations: emptyRelations, modelCounts: emptyCounts };
  }
  if (query.kind === "PERSON_UNCERTAINTY") {
    const possible = [...new Set(query.candidatePersonIds)].filter((personId) => graphs.some((graph) => {
      try {
        const exact = independentSolveRelation(graph, personId, query.referenceId).relationId;
        return exact === query.relationId || independentBroad(exact) === query.relationId;
      } catch { return false; }
    })).sort();
    if (query.mode === "ONE_OF_TWO") {
      if (possible.length !== 2) throw new Error("Independent verifier expected two possible people.");
      return { answer: { kind: "PERSON_SET", personIds: possible }, expectedSemanticKey: `PERSON_SET:${possible.join(":")}`, modelRelations: emptyRelations, modelCounts: emptyCounts };
    }
    return { answer: { kind: "INDETERMINATE", survivingValues: possible }, expectedSemanticKey: "INDETERMINATE", modelRelations: emptyRelations, modelCounts: emptyCounts };
  }
  const counts = graphs.map((graph) => independentCount(graph, query.countSpec));
  const unique = [...new Set(counts)].sort((left, right) => left - right);
  if (query.kind === "COUNT_BOUND") {
    const value = query.bound === "MINIMUM" ? unique[0]! : unique.at(-1)!;
    return { answer: { kind: "NUMBER", value, bound: query.bound }, expectedSemanticKey: `NUMBER:${value}`, modelRelations: emptyRelations, modelCounts: counts };
  }
  if (query.kind === "COUNT_STATUS") {
    const matches = query.candidateValues.filter((value) => (unique.includes(value) ? "POSSIBLE" : "IMPOSSIBLE") === query.requestedStatus);
    if (matches.length !== 1) throw new Error("Independent verifier expected one count-status match.");
    return { answer: { kind: "NUMBER", value: matches[0]!, status: query.requestedStatus }, expectedSemanticKey: `NUMBER:${matches[0]}`, modelRelations: emptyRelations, modelCounts: counts };
  }
  if (unique.length === 1) {
    return { answer: { kind: "NUMBER", value: unique[0]! }, expectedSemanticKey: `NUMBER:${unique[0]}`, modelRelations: emptyRelations, modelCounts: counts };
  }
  return { answer: { kind: "INDETERMINATE", survivingValues: unique }, expectedSemanticKey: "INDETERMINATE", modelRelations: emptyRelations, modelCounts: counts };
}

function normalizedAnswer(answer: GeneratedBlrCp005Question["answer"]): string {
  if (answer.kind === "RELATION_SET") return JSON.stringify({ ...answer, relationIds: [...answer.relationIds].sort() });
  if (answer.kind === "PERSON_SET") return JSON.stringify({ ...answer, personIds: [...answer.personIds].sort() });
  if (answer.kind === "INDETERMINATE") {
    return JSON.stringify({ ...answer, survivingValues: [...answer.survivingValues].map(String).sort() });
  }
  return JSON.stringify(answer);
}

export function independentlyVerifyBlrCp005Question(
  question: GeneratedBlrCp005Question,
): BlrCp005IndependentResult {
  const graphs = question.explanation.familyTrees.map(graphFromDiagram);
  if (graphs.length !== question.modelSpace.modelCount || graphs.length < 2) {
    throw new Error(`${question.itemId}: family-tree/model count mismatch.`);
  }
  const independent = solveIndependent(question.querySpec, graphs);
  if (normalizedAnswer(independent.answer) !== normalizedAnswer(question.answer)) {
    throw new Error(`${question.itemId}: production and independent answers disagree.\nProduction: ${normalizedAnswer(question.answer)}\nIndependent: ${normalizedAnswer(independent.answer)}`);
  }
  if (question.options.length !== 4 || new Set(question.options.map((option) => option.semanticKey)).size !== 4) {
    throw new Error(`${question.itemId}: invalid option cardinality or semantics.`);
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1 || !question.options[question.correctIndex]?.isCorrect) {
    throw new Error(`${question.itemId}: invalid correct-option flags.`);
  }
  if (question.options[question.correctIndex]?.semanticKey !== independent.expectedSemanticKey) {
    throw new Error(`${question.itemId}: correct option semantic key does not match independent answer.`);
  }
  return independent;
}
