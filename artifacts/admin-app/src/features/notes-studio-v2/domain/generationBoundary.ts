import type { Fact } from './types';

export interface GenerationFact {
  id: string;
  periodId: string;
  subCategoryId: string;
  subCategory: string;
  claim: string;
  entities: string[];
  dateOrEra?: string;
  examFrequency?: Fact['examFrequency'];
}

export interface FactGraph {
  periodId: string;
  facts: GenerationFact[];
}

/**
 * Build the source-agnostic graph consumed by generation.
 * sourceRefs/extractedText are intentionally not part of GenerationFact.
 * Unresolved disputed facts are blocked from the graph.
 */
export function buildFactGraph(periodId: string, facts: Fact[]): FactGraph {
  return {
    periodId,
    facts: facts
      .filter((fact) => fact.periodId === periodId && fact.confidence !== 'disputed')
      .map(({ id, subCategoryId, subCategory, claim, entities, dateOrEra, examFrequency }) => ({
        id,
        periodId,
        subCategoryId,
        subCategory,
        claim,
        entities: [...entities],
        dateOrEra,
        examFrequency,
      })),
  };
}
