import assert from 'node:assert/strict';
import test from 'node:test';

import {
  coverageTextSimilarity,
  gapSourceRecommendationReason,
  gapSourceRecommendationScore,
  sourcePackEditableState,
} from './gap-source-recommendations';

test('coverage similarity rewards meaningful shared syllabus terms', () => {
  assert.equal(coverageTextSimilarity('Punjab river system tributaries', 'Punjab river tributaries and drainage'), 0.6);
  assert.equal(coverageTextSimilarity('Indian Constitution emergency provisions', 'thermal expansion of solids'), 0);
});

test('exact syllabus evidence outranks loose taxonomy history', () => {
  const exact = gapSourceRecommendationScore({
    exactSyllabusRefHits: 1,
    maxCoverageSimilarity: 0.5,
    acceptedClaimCount: 2,
    priorJobCount: 1,
    approvedUseCount: 1,
    sameTaxonomyNodeUses: 0,
    sameTaxonomyCodeUses: 0,
    generationReady: true,
    identityNovel: true,
    duplicateContent: false,
  });
  const taxonomyOnly = gapSourceRecommendationScore({
    exactSyllabusRefHits: 0,
    maxCoverageSimilarity: 0.1,
    acceptedClaimCount: 6,
    priorJobCount: 3,
    approvedUseCount: 2,
    sameTaxonomyNodeUses: 1,
    sameTaxonomyCodeUses: 0,
    generationReady: true,
    identityNovel: true,
    duplicateContent: false,
  });
  assert.ok(exact > taxonomyOnly);
  assert.equal(gapSourceRecommendationReason({
    exactSyllabusRefHits: 1,
    maxCoverageSimilarity: 0.5,
    acceptedClaimCount: 1,
    priorJobCount: 1,
    approvedUseCount: 0,
    sameTaxonomyNodeUses: 0,
    sameTaxonomyCodeUses: 0,
    generationReady: true,
    identityNovel: true,
    duplicateContent: false,
  }), 'Previously supported accepted claims for the same syllabus reference');
});

test('non-generatable and duplicate-content sources cannot be research-gap recommendations', () => {
  const base = {
    exactSyllabusRefHits: 2,
    maxCoverageSimilarity: 1,
    acceptedClaimCount: 5,
    priorJobCount: 2,
    approvedUseCount: 2,
    sameTaxonomyNodeUses: 2,
    sameTaxonomyCodeUses: 0,
    identityNovel: true,
  };
  assert.equal(gapSourceRecommendationScore({ ...base, generationReady: false, duplicateContent: false }), 0);
  assert.equal(gapSourceRecommendationScore({ ...base, generationReady: true, duplicateContent: true }), 0);
});

test('source-pack mutation is intentionally pre-evidence only', () => {
  assert.equal(sourcePackEditableState('brief'), true);
  assert.equal(sourcePackEditableState('sources_ready'), true);
  assert.equal(sourcePackEditableState('evidence_ready'), false);
  assert.equal(sourcePackEditableState('outline_ready'), false);
  assert.equal(sourcePackEditableState('drafting'), false);
  assert.equal(sourcePackEditableState('approved'), false);
});
