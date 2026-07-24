import { ANA_CP001_HI_CORE_FACTS } from "../ANA-CP-001/locales/hi-IN/core-facts";
import { ANA_CP001_PA_CORE_FACTS } from "../ANA-CP-001/locales/pa-IN/core-facts";
import { ANA_CP002_HI_SYNONYM_ANTONYM_FACTS } from "../ANA-CP-002/locales/hi-IN/synonym-antonym";
import { ANA_CP002_PA_SYNONYM_ANTONYM_FACTS } from "../ANA-CP-002/locales/pa-IN/synonym-antonym";
import type { LocalizedAnalogyFact } from "./types";

export const ANA_LOCALIZED_FACTS: readonly LocalizedAnalogyFact[] = [
  ...ANA_CP001_HI_CORE_FACTS,
  ...ANA_CP001_PA_CORE_FACTS,
  ...ANA_CP002_HI_SYNONYM_ANTONYM_FACTS,
  ...ANA_CP002_PA_SYNONYM_ANTONYM_FACTS,
];

export function localizedFactsFor(locale: "hi-IN" | "pa-IN", relation: string): readonly LocalizedAnalogyFact[] {
  return ANA_LOCALIZED_FACTS.filter(
    (fact) => fact.locale === locale && fact.relation === relation && fact.status === "CURATED",
  );
}

export function localizedFactByCanonicalId(
  locale: "hi-IN" | "pa-IN",
  canonicalFactId: string,
): LocalizedAnalogyFact | undefined {
  return ANA_LOCALIZED_FACTS.find(
    (fact) => fact.locale === locale && fact.canonicalFactId === canonicalFactId && fact.status === "CURATED",
  );
}

export * from "./types";
export * from "./question-text";
