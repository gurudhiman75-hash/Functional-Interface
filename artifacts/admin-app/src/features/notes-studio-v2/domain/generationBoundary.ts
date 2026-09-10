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

const POINTER_CLAIM_PATTERN = /\b(?:is|are|was|were)\s+(?:also\s+)?(?:mentioned|listed|indexed|referenced|included)\b[^.!?]{0,100}\b(?:page(?:s)?|(?:the\s+)?(?:index|bibliograph(?:y|ies)|references?|contents|glossary))\b|\breferenced\s+in\s+the\s+source\s+text\s+with\s+page\s+number(?:s)?\b|\bappears?\s+(?:on|in)\s+(?:page(?:s)?|the\s+index|an?\s+index|the\s+bibliograph(?:y|ies)|the\s+references?)\b/i;

function isPointerStyleClaim(value: string) {
  return POINTER_CLAIM_PATTERN.test(value.trim());
}

/**
 * Build the source-agnostic graph consumed by generation.
 * sourceRefs/extractedText are intentionally not part of GenerationFact.
 * Unresolved disputed facts and navigation/pointer claims are blocked from the graph.
 */
export function buildFactGraph(periodId: string, facts: Fact[]): FactGraph {
  return {
    periodId,
    facts: facts
      .filter((fact) => (
        fact.periodId === periodId
        && fact.confidence !== 'disputed'
        && !isPointerStyleClaim(fact.claim)
      ))
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
