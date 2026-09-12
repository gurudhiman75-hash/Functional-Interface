import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeResearchRestartReason,
  researchRestartAllowed,
  researchRestartDiscardTotal,
  researchRestartSourceIntentPath,
  researchRestartTargetState,
} from './research-restart';

test('research restart is limited to progressed but unapproved authoring states', () => {
  for (const state of ['evidence_ready', 'outline_ready', 'drafting', 'qa_required', 'review_ready']) {
    assert.equal(researchRestartAllowed(state), true, state);
  }
  for (const state of ['brief', 'sources_ready', 'approved', 'materialized']) {
    assert.equal(researchRestartAllowed(state), false, state);
  }
});

test('restart returns to source collection according to retained governed sources', () => {
  assert.equal(researchRestartTargetState(0), 'brief');
  assert.equal(researchRestartTargetState(1), 'sources_ready');
  assert.equal(researchRestartTargetState(7), 'sources_ready');
});

test('restart source intent accepts retained-ready or historically reviewed reference sources only', () => {
  assert.equal(researchRestartSourceIntentPath({
    generationReady: true,
    rightsBasis: 'publisher_authorized',
    retentionMode: 'extracted_text',
    reviewedReferenceUseCount: 0,
  }), 'retained_ready');
  assert.equal(researchRestartSourceIntentPath({
    generationReady: false,
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 2,
  }), 'reference_review_required');
  assert.equal(researchRestartSourceIntentPath({
    generationReady: false,
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 0,
  }), null);
  assert.equal(researchRestartSourceIntentPath({
    generationReady: false,
    rightsBasis: 'publisher_authorized',
    retentionMode: 'metadata_only',
    reviewedReferenceUseCount: 3,
  }), null);
});

test('restart reason is bounded and discard counts are deterministic', () => {
  assert.equal(normalizeResearchRestartReason('  Need another official source.  '), 'Need another official source.');
  assert.equal(normalizeResearchRestartReason('x'.repeat(1200)).length, 1000);
  assert.equal(researchRestartDiscardTotal({
    evidenceBlocks: 10,
    claims: 4,
    coverageMappings: 3,
    sections: 2,
    qualityRuns: 2,
    generationEvents: 1,
  }), 22);
});
