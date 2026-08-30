import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_SOURCE_LIBRARY_RESULTS,
  isGenerationReadySource,
  sourceLibraryLimit,
  sourceRecommendationReason,
  sourceRecommendationScore,
} from './source-library';

test('source library result limits are operationally bounded', () => {
  assert.equal(sourceLibraryLimit(undefined), 50);
  assert.equal(sourceLibraryLimit(10_000), MAX_SOURCE_LIBRARY_RESULTS);
  assert.equal(sourceLibraryLimit(0), 1);
});

test('exact canonical taxonomy reuse outranks topic-label fallback', () => {
  const exact = sourceRecommendationScore({
    exactTaxonomyUses: 1,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 0,
    approvedUses: 1,
    generatable: true,
    alreadyAttached: false,
  });
  const fallback = sourceRecommendationScore({
    exactTaxonomyUses: 0,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 2,
    approvedUses: 1,
    generatable: true,
    alreadyAttached: false,
  });
  assert.ok(exact > fallback);
  assert.equal(sourceRecommendationReason({ exactTaxonomyUses: 1, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 0, generatable: false, alreadyAttached: false }), 'Previously used for the same canonical taxonomy node');
});

test('unrelated or already-attached sources are never recommendations', () => {
  assert.equal(sourceRecommendationScore({ exactTaxonomyUses: 0, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 10, generatable: true, alreadyAttached: false }), 0);
  assert.equal(sourceRecommendationScore({ exactTaxonomyUses: 5, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 5, generatable: true, alreadyAttached: true }), -1);
});

test('reference-only sources remain reusable provenance but not generation-ready evidence', () => {
  assert.equal(isGenerationReadySource({ retentionMode: 'metadata_only', extractionStatus: 'metadata_only', retainedCharCount: 0 }), false);
  assert.equal(isGenerationReadySource({ retentionMode: 'extracted_text', extractionStatus: 'processed', retainedCharCount: 99 }), false);
  assert.equal(isGenerationReadySource({ retentionMode: 'extracted_text', extractionStatus: 'processed', retainedCharCount: 100 }), true);
});
