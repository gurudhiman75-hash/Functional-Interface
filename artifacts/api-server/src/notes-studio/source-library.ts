export const MAX_SOURCE_LIBRARY_RESULTS = 100;
export const MAX_SOURCE_RECOMMENDATIONS = 25;

export type SourceRecommendationSignals = {
  exactTaxonomyUses: number;
  sameTaxonomyCodeUses: number;
  sameTopicUses: number;
  approvedUses: number;
  generatable: boolean;
  alreadyAttached: boolean;
};

export function sourceLibraryLimit(value: unknown): number {
  const parsed = Number(value ?? 50);
  if (!Number.isFinite(parsed)) return 50;
  return Math.max(1, Math.min(MAX_SOURCE_LIBRARY_RESULTS, Math.trunc(parsed)));
}

export function sourceRecommendationScore(signals: SourceRecommendationSignals): number {
  if (signals.alreadyAttached) return -1;
  const relevance =
    signals.exactTaxonomyUses * 100
    + signals.sameTaxonomyCodeUses * 60
    + signals.sameTopicUses * 30;
  if (relevance === 0) return 0;
  return relevance + signals.approvedUses * 15 + (signals.generatable ? 10 : 0);
}

export function sourceRecommendationReason(signals: SourceRecommendationSignals): string {
  if (signals.exactTaxonomyUses > 0) return 'Previously used for the same canonical taxonomy node';
  if (signals.sameTaxonomyCodeUses > 0) return 'Previously used for the same canonical taxonomy code';
  if (signals.sameTopicUses > 0) return 'Previously used for the same Notes Studio topic label';
  return 'No governed topic match';
}

export function isGenerationReadySource(input: {
  retentionMode: string;
  extractionStatus: string;
  retainedCharCount: number;
}): boolean {
  return input.retentionMode === 'extracted_text'
    && input.extractionStatus === 'processed'
    && input.retainedCharCount >= 100;
}
