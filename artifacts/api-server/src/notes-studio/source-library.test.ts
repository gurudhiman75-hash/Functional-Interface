import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_SOURCE_LIBRARY_RESULTS,
  isGenerationReadySource,
  sourceLibraryLimit,
  sourceRecommendationReason,
  sourceRecommendationScore,
  sourceReuseEvidencePath,
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
    referenceReviewEligible: false,
    alreadyAttached: false,
  });
  const fallback = sourceRecommendationScore({
    exactTaxonomyUses: 0,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 2,
    approvedUses: 1,
    generatable: true,
    referenceReviewEligible: false,
    alreadyAttached: false,
  });
  assert.ok(exact > fallback);
  assert.equal(sourceRecommendationReason({ exactTaxonomyUses: 1, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 0, generatable: false, referenceReviewEligible: false, alreadyAttached: false }), 'Previously used for the same canonical taxonomy node');
});

test('unrelated or already-attached sources are never recommendations', () => {
  assert.equal(sourceRecommendationScore({ exactTaxonomyUses: 0, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 10, generatable: true, referenceReviewEligible: false, alreadyAttached: false }), 0);
  assert.equal(sourceRecommendationScore({ exactTaxonomyUses: 5, sameTaxonomyCodeUses: 0, sameTopicUses: 0, approvedUses: 5, generatable: true, referenceReviewEligible: false, alreadyAttached: true }), -1);
});

test('reference-review history is useful but ranks below equivalent retained evidence', () => {
  const retained = sourceRecommendationScore({
    exactTaxonomyUses: 1,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 0,
    approvedUses: 1,
    generatable: true,
    referenceReviewEligible: false,
    alreadyAttached: false,
  });
  const reviewedReference = sourceRecommendationScore({
    exactTaxonomyUses: 1,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 0,
    approvedUses: 1,
    generatable: false,
    referenceReviewEligible: true,
    alreadyAttached: false,
  });
  const provenanceOnly = sourceRecommendationScore({
    exactTaxonomyUses: 1,
    sameTaxonomyCodeUses: 0,
    sameTopicUses: 0,
    approvedUses: 1,
    generatable: false,
    referenceReviewEligible: false,
    alreadyAttached: false,
  });
  assert.equal(retained - reviewedReference, 5);
  assert.equal(reviewedReference - provenanceOnly, 5);
});

test('reference-only sources remain non-generation-ready until the target job has fresh evidence', () => {
  assert.equal(isGenerationReadySource({ retentionMode: 'metadata_only', extractionStatus: 'metadata_only', retainedCharCount: 0 }), false);
  assert.equal(isGenerationReadySource({ retentionMode: 'extracted_text', extractionStatus: 'processed', retainedCharCount: 99 }), false);
  assert.equal(isGenerationReadySource({ retentionMode: 'extracted_text', extractionStatus: 'processed', retainedCharCount: 100 }), true);
});

test('source reuse evidence path distinguishes retained, prior reference review, and provenance-only history', () => {
  assert.equal(sourceReuseEvidencePath({
    generationReady: true,
    rightsBasis: 'publisher_authorized',
    retentionMode: 'extracted_text',
    reviewedReferenceUseCount: 0,
  }), 'retained_ready');
  assert.equal(sourceReuseEvidencePath({
    generationReady: false,
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 2,
  }), 'reference_review_required');
  assert.equal(sourceReuseEvidencePath({
    generationReady: false,
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 0,
  }), 'provenance_only');
  assert.equal(sourceReuseEvidencePath({
    generationReady: false,
    rightsBasis: 'publisher_authorized',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 5,
  }), 'provenance_only');
});
