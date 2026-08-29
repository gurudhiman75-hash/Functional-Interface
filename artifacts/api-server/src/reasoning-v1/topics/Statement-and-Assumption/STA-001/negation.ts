import type { StaProposition } from "./types.ts";

export interface StaSemanticNegation {
  readonly propositionId: string;
  readonly semanticKey: string;
  readonly denialSemanticKey: string;
}

export function semanticNegationOf(proposition: StaProposition): StaSemanticNegation {
  const denialSemanticKey = proposition.oppositeSemanticKey.trim();
  if (!denialSemanticKey) throw new Error(`Missing semantic opposite for ${proposition.propositionId}`);
  if (denialSemanticKey === proposition.semanticKey) throw new Error(`Semantic opposite equals proposition for ${proposition.propositionId}`);
  return {
    propositionId: proposition.propositionId,
    semanticKey: proposition.semanticKey,
    denialSemanticKey,
  };
}

export function assertNegationPairs(propositions: readonly StaProposition[]): void {
  const semanticKeys = new Set<string>();
  for (const proposition of propositions) {
    if (!proposition.semanticKey.trim()) throw new Error(`Empty semantic key for ${proposition.propositionId}`);
    if (semanticKeys.has(proposition.semanticKey)) throw new Error(`Duplicate semantic key ${proposition.semanticKey}`);
    semanticKeys.add(proposition.semanticKey);
    semanticNegationOf(proposition);
  }
}
