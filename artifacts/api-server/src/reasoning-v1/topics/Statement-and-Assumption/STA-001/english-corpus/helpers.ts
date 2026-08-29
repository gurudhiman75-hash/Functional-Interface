import type { StaCandidateAuthority, StaDependency, StaProposition } from "../types.ts";

export const SOURCE_SUPPORTED = "SOURCE_SUPPORTED_EXECUTABLE_DISCOVERY" as const;
export const CORPUS_CANDIDATE = "ENGLISH_CORPUS_CANDIDATE" as const;

export function p(
  propositionId: string,
  semanticKey: string,
  oppositeSemanticKey: string,
  entities: readonly string[],
  quantifier?: StaProposition["quantifier"],
): StaProposition {
  return {
    propositionId,
    semanticKey,
    oppositeSemanticKey,
    polarity: "POSITIVE",
    entities,
    ...(quantifier ? { quantifier } : {}),
  };
}

export function d(
  dependencyId: string,
  propositionId: string,
  relation: StaDependency["relation"],
  requiredFor: readonly string[],
  denialEffect: StaDependency["denialEffect"],
): StaDependency {
  return { dependencyId, propositionId, relation, requiredFor, denialEffect };
}

export function c(
  candidateId: string,
  propositionId: string,
  textVariants: readonly [string, ...string[]],
  expectedClassification: StaCandidateAuthority["expectedClassification"],
  rationale: string,
  misconceptionClass?: StaCandidateAuthority["misconceptionClass"],
): StaCandidateAuthority {
  return {
    candidateId,
    propositionId,
    textVariants,
    expectedClassification,
    rationale,
    ...(misconceptionClass ? { misconceptionClass } : {}),
  };
}
