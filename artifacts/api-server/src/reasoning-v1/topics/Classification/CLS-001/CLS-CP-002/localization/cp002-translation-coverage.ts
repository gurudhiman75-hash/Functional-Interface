import { ANA_LOCALIZED_FACTS } from "../../../../Analogy/ANA-001/localization";
import { CLS_CP002_FACTS } from "../relation-registry";

export type ClsCp002TranslationCoverage = {
  readonly totalImportedFacts: number;
  readonly multilingualSafeImportedFacts: number;
  readonly englishOnlyImportedFacts: number;
  readonly supplementalFacts: number;
  readonly totalMultilingualSafeFactPairs: number;
  readonly factRelationCount: number;
  readonly factRelationsWithAtLeastFourSafePairs: number;
};

function canonicalAnaFactId(factId: string): string | null {
  return factId.startsWith("CLS-CP002-ANA-")
    ? factId.slice("CLS-CP002-".length)
    : null;
}

export function getClsCp002TranslationCoverage(): ClsCp002TranslationCoverage {
  const localizedKeys = new Set(
    ANA_LOCALIZED_FACTS
      .filter((fact) => fact.status === "CURATED")
      .map((fact) => `${fact.locale}:${fact.canonicalFactId}`),
  );

  let totalImportedFacts = 0;
  let multilingualSafeImportedFacts = 0;
  let supplementalFacts = 0;
  const safeCountByRelation = new Map<string, number>();

  for (const fact of CLS_CP002_FACTS) {
    let safe = false;
    if (fact.sourceLibrary === "CLS-CP-002") {
      supplementalFacts += 1;
      safe = true;
    } else {
      totalImportedFacts += 1;
      const canonicalId = canonicalAnaFactId(fact.factId);
      safe = Boolean(
        canonicalId
        && localizedKeys.has(`hi-IN:${canonicalId}`)
        && localizedKeys.has(`pa-IN:${canonicalId}`),
      );
      if (safe) multilingualSafeImportedFacts += 1;
    }
    if (safe) {
      safeCountByRelation.set(
        fact.relationId,
        (safeCountByRelation.get(fact.relationId) ?? 0) + 1,
      );
    }
  }

  const factRelationCount = new Set(CLS_CP002_FACTS.map((fact) => fact.relationId)).size;
  const factRelationsWithAtLeastFourSafePairs = [...safeCountByRelation.values()]
    .filter((count) => count >= 4).length;

  return {
    totalImportedFacts,
    multilingualSafeImportedFacts,
    englishOnlyImportedFacts: totalImportedFacts - multilingualSafeImportedFacts,
    supplementalFacts,
    totalMultilingualSafeFactPairs: multilingualSafeImportedFacts + supplementalFacts,
    factRelationCount,
    factRelationsWithAtLeastFourSafePairs,
  };
}
