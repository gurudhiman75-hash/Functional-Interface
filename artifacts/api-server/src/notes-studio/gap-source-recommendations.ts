export const MAX_GAP_SOURCE_RECOMMENDATIONS_PER_ITEM = 5;
export const MAX_GAP_SOURCE_RECOMMENDATIONS_TOTAL = 50;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is', 'of', 'on', 'or',
  'the', 'to', 'with', 'within', 'into', 'using', 'use', 'about', 'under', 'over', 'their', 'its',
]);

export type GapSourceRecommendationSignals = {
  exactSyllabusRefHits: number;
  maxCoverageSimilarity: number;
  acceptedClaimCount: number;
  priorJobCount: number;
  approvedUseCount: number;
  sameTaxonomyNodeUses: number;
  sameTaxonomyCodeUses: number;
  generationReady: boolean;
  identityNovel: boolean;
  duplicateContent: boolean;
};

function normalizedTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

export function coverageTextSimilarity(left: string, right: string): number {
  const leftTokens = new Set(normalizedTokens(left));
  const rightTokens = new Set(normalizedTokens(right));
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  let intersection = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) intersection += 1;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union === 0 ? 0 : Math.round((intersection / union) * 1000) / 1000;
}

export function gapSourceRecommendationScore(signals: GapSourceRecommendationSignals): number {
  if (signals.duplicateContent || !signals.generationReady) return 0;
  const relevance =
    signals.exactSyllabusRefHits * 220
    + Math.round(Math.max(0, Math.min(1, signals.maxCoverageSimilarity)) * 140)
    + signals.sameTaxonomyNodeUses * 45
    + signals.sameTaxonomyCodeUses * 25;
  if (relevance < 45) return 0;
  return relevance
    + Math.min(signals.acceptedClaimCount, 20) * 8
    + Math.min(signals.priorJobCount, 10) * 5
    + Math.min(signals.approvedUseCount, 10) * 10
    + (signals.identityNovel ? 18 : 0);
}

export function gapSourceRecommendationReason(signals: GapSourceRecommendationSignals): string {
  if (signals.exactSyllabusRefHits > 0) return 'Previously supported accepted claims for the same syllabus reference';
  if (signals.maxCoverageSimilarity >= 0.6) return 'Previously supported highly similar syllabus coverage';
  if (signals.sameTaxonomyNodeUses > 0) return 'Previously productive on the same canonical taxonomy node';
  if (signals.sameTaxonomyCodeUses > 0) return 'Previously productive on the same canonical taxonomy code';
  return 'Prior accepted-evidence yield on a related Notes Studio coverage target';
}

export function sourcePackEditableState(state: string): boolean {
  return state === 'brief' || state === 'sources_ready';
}
