import { ANA_LOCALIZED_FACTS } from "../../../../Analogy/ANA-001/localization";
import { CLS_CP002_FACTS } from "../relation-registry";
import type { ClsCp002RelationFact } from "../types";

const LOCALIZED_KEYS = new Set(
  ANA_LOCALIZED_FACTS
    .filter((fact) => fact.status === "CURATED")
    .map((fact) => `${fact.locale}:${fact.canonicalFactId}`),
);

function canonicalAnaFactId(factId: string): string | null {
  return factId.startsWith("CLS-CP002-ANA-")
    ? factId.slice("CLS-CP002-".length)
    : null;
}

export function isClsCp002FactMultilingualSafe(fact: ClsCp002RelationFact): boolean {
  if (fact.sourceLibrary === "CLS-CP-002") return true;
  const canonicalId = canonicalAnaFactId(fact.factId);
  return Boolean(
    canonicalId
    && LOCALIZED_KEYS.has(`hi-IN:${canonicalId}`)
    && LOCALIZED_KEYS.has(`pa-IN:${canonicalId}`),
  );
}

export const CLS_CP002_MULTILINGUAL_SAFE_FACTS: readonly ClsCp002RelationFact[] =
  CLS_CP002_FACTS.filter(isClsCp002FactMultilingualSafe);

const SAFE_FACTS_BY_RELATION = new Map<string, ClsCp002RelationFact[]>();
for (const fact of CLS_CP002_MULTILINGUAL_SAFE_FACTS) {
  const facts = SAFE_FACTS_BY_RELATION.get(fact.relationId) ?? [];
  facts.push(fact);
  SAFE_FACTS_BY_RELATION.set(fact.relationId, facts);
}

export function multilingualSafeFactsForRelation(relationId: string): readonly ClsCp002RelationFact[] {
  return SAFE_FACTS_BY_RELATION.get(relationId) ?? [];
}

export const CLS_CP002_MULTILINGUAL_SAFE_RELATION_IDS = [...SAFE_FACTS_BY_RELATION.keys()];
