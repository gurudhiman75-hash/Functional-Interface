import {
  broadRelation,
  classifyTruth,
  evaluateCount,
  evaluatePredicate,
  relationInModel,
  type BlrCp005ModelSpace,
  type BlrCp005QuerySpec,
  type BlrCp005RelationAnswerId,
  type BlrCp005TruthStatus,
  type GeneratedBlrCp005Question,
} from "./cp005-model";

export interface BlrCp005SolvedQuery {
  answer: GeneratedBlrCp005Question["answer"];
  relationOutcomes: readonly string[];
  claimStatuses: Readonly<Record<string, BlrCp005TruthStatus>>;
  personStatuses: Readonly<Record<string, BlrCp005TruthStatus>>;
  countOutcomes: readonly number[];
  auditLines: readonly string[];
}

export function solveBlrCp005Query(
  modelSpace: BlrCp005ModelSpace,
  query: BlrCp005QuerySpec,
): BlrCp005SolvedQuery {
  const empty = {
    relationOutcomes: [] as string[],
    claimStatuses: {} as Record<string, BlrCp005TruthStatus>,
    personStatuses: {} as Record<string, BlrCp005TruthStatus>,
    countOutcomes: [] as number[],
  };

  if (query.kind === "INVARIANT_RELATION") {
    const exact = modelSpace.models.map((model) => relationInModel(model, query.subjectId, query.referenceId));
    const exactUnique = [...new Set(exact)];
    const broadUnique = [...new Set(exact.map(broadRelation))];
    if (exactUnique.length === 1) {
      return {
        ...empty,
        relationOutcomes: exactUnique,
        answer: { kind: "RELATION", relationId: exactUnique[0]! },
        auditLines: modelSpace.models.map((model, index) => `Model ${index + 1}: ${exact[index]}.`),
      };
    }
    if (broadUnique.length === 1) {
      return {
        ...empty,
        relationOutcomes: exactUnique,
        answer: { kind: "RELATION", relationId: broadUnique[0]! },
        auditLines: modelSpace.models.map((model, index) => `Model ${index + 1}: exact ${exact[index]}, broad ${broadUnique[0]}.`),
      };
    }
    throw new Error(`${modelSpace.scenarioId} has no invariant relation.`);
  }

  if (query.kind === "RELATION_UNCERTAINTY") {
    const exactUnique = [...new Set(modelSpace.models.map((model) => relationInModel(model, query.subjectId, query.referenceId)))].sort();
    if (query.mode === "ONE_OF_TWO") {
      if (exactUnique.length !== 2) throw new Error(`${modelSpace.scenarioId} does not have exactly two relation outcomes.`);
      return {
        ...empty,
        relationOutcomes: exactUnique,
        answer: { kind: "RELATION_SET", relationIds: exactUnique },
        auditLines: exactUnique.map((relationId) => `${relationId} occurs in at least one valid model.`),
      };
    }
    if (exactUnique.length < 3) throw new Error(`${modelSpace.scenarioId} needs at least three material outcomes for indeterminacy.`);
    return {
      ...empty,
      relationOutcomes: exactUnique,
      answer: { kind: "INDETERMINATE", survivingValues: exactUnique },
      auditLines: exactUnique.map((relationId) => `${relationId} survives in the complete model space.`),
    };
  }

  if (query.kind === "CLAIM_STATUS") {
    const statuses: Record<string, BlrCp005TruthStatus> = {};
    for (const claim of query.claims) {
      statuses[claim.claimId] = classifyTruth(modelSpace.models.map((model) => evaluatePredicate(model, claim.predicate)));
    }
    const matches = query.claims.filter((claim) => statuses[claim.claimId] === query.requestedStatus);
    if (matches.length !== 1) {
      throw new Error(`${modelSpace.scenarioId} expected one ${query.requestedStatus} claim, found ${matches.length}.`);
    }
    return {
      ...empty,
      claimStatuses: statuses,
      answer: { kind: "CLAIM", claimId: matches[0]!.claimId, status: query.requestedStatus },
      auditLines: query.claims.map((claim) => `${claim.text} → ${statuses[claim.claimId]}.`),
    };
  }

  if (query.kind === "PERSON_STATUS") {
    const statuses: Record<string, BlrCp005TruthStatus> = {};
    const candidates = [...new Set(query.candidatePersonIds)];
    for (const personId of candidates) {
      statuses[personId] = classifyTruth(modelSpace.models.map((model) => {
        try {
          const relation = relationInModel(model, personId, query.referenceId);
          return relation === query.relationId || broadRelation(relation) === query.relationId;
        } catch {
          return false;
        }
      }));
    }
    const matches = candidates.filter((personId) => statuses[personId] === query.requestedStatus);
    if (candidates.length !== 4 || matches.length !== 1) {
      throw new Error(`${modelSpace.scenarioId} expected four unique candidates and one ${query.requestedStatus} person; got ${candidates.length}/${matches.length}.`);
    }
    return {
      ...empty,
      personStatuses: statuses,
      answer: { kind: "PERSON", personId: matches[0]!, status: query.requestedStatus },
      auditLines: candidates.map((personId) => `${personId} → ${statuses[personId]}.`),
    };
  }

  if (query.kind === "PERSON_UNCERTAINTY") {
    const candidates = [...new Set(query.candidatePersonIds)];
    const possible = candidates.filter((personId) => modelSpace.models.some((model) => {
      try {
        const relation = relationInModel(model, personId, query.referenceId);
        return relation === query.relationId || broadRelation(relation) === query.relationId;
      } catch {
        return false;
      }
    }));
    if (query.mode === "ONE_OF_TWO") {
      if (possible.length !== 2) throw new Error(`${modelSpace.scenarioId} does not have exactly two possible people.`);
      return {
        ...empty,
        answer: { kind: "PERSON_SET", personIds: possible.sort() },
        auditLines: possible.map((personId) => `${personId} is selected in at least one valid model.`),
      };
    }
    if (possible.length < 3) throw new Error(`${modelSpace.scenarioId} requires at least three possible people for indeterminacy.`);
    return {
      ...empty,
      answer: { kind: "INDETERMINATE", survivingValues: possible.sort() },
      auditLines: possible.map((personId) => `${personId} remains possible.`),
    };
  }

  const countOutcomes = modelSpace.models.map((model) => evaluateCount(model, query.countSpec));
  const uniqueCounts = [...new Set(countOutcomes)].sort((left, right) => left - right);
  if (query.kind === "COUNT_BOUND") {
    const value = query.bound === "MINIMUM" ? uniqueCounts[0]! : uniqueCounts.at(-1)!;
    return {
      ...empty,
      countOutcomes: uniqueCounts,
      answer: { kind: "NUMBER", value, bound: query.bound },
      auditLines: countOutcomes.map((value, index) => `Model ${index + 1}: count ${value}.`),
    };
  }
  if (query.kind === "COUNT_STATUS") {
    const statuses: Record<number, "POSSIBLE" | "IMPOSSIBLE"> = {};
    for (const value of query.candidateValues) statuses[value] = uniqueCounts.includes(value) ? "POSSIBLE" : "IMPOSSIBLE";
    const matches = query.candidateValues.filter((value) => statuses[value] === query.requestedStatus);
    if (new Set(query.candidateValues).size !== 4 || matches.length !== 1) {
      throw new Error(`${modelSpace.scenarioId} expected four unique count candidates and one ${query.requestedStatus} value.`);
    }
    return {
      ...empty,
      countOutcomes: uniqueCounts,
      answer: { kind: "NUMBER", value: matches[0]!, status: query.requestedStatus },
      auditLines: query.candidateValues.map((value) => `${value} → ${statuses[value]}.`),
    };
  }
  if (uniqueCounts.length === 1) {
    return {
      ...empty,
      countOutcomes: uniqueCounts,
      answer: { kind: "NUMBER", value: uniqueCounts[0]! },
      auditLines: countOutcomes.map((value, index) => `Model ${index + 1}: count ${value}.`),
    };
  }
  return {
    ...empty,
    countOutcomes: uniqueCounts,
    answer: { kind: "INDETERMINATE", survivingValues: uniqueCounts },
    auditLines: uniqueCounts.map((value) => `Count ${value} occurs in at least one valid model.`),
  };
}
