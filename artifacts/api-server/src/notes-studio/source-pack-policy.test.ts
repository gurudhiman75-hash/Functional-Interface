import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluateSourcePackPolicy,
  noteSourcePackTemplateKey,
  noteSourceRole,
  sourcePackTemplateOptions,
} from './source-pack-policy';

const ready = (sourceRole: 'primary_authority' | 'core_reference' | 'exam_context' | 'supplemental') => ({
  sourceRole,
  inclusionState: 'included',
  generationReady: true,
});

test('unknown policy and role values fall back to safe defaults', () => {
  assert.equal(noteSourcePackTemplateKey('unknown'), 'balanced');
  assert.equal(noteSourceRole('unknown'), 'core_reference');
  assert.equal(sourcePackTemplateOptions().length, 5);
});

test('balanced policy requires two independent generation-ready core sources', () => {
  assert.equal(evaluateSourcePackPolicy('balanced', [ready('core_reference')]).ready, false);
  assert.equal(evaluateSourcePackPolicy('balanced', [ready('primary_authority'), ready('core_reference')]).ready, true);
});

test('official-first requires both authority and reference roles', () => {
  const missingReference = evaluateSourcePackPolicy('official_first', [ready('primary_authority'), ready('primary_authority')]);
  assert.equal(missingReference.ready, false);
  assert.deepEqual(missingReference.missing.map((item) => item.code), ['core_reference']);
  assert.equal(evaluateSourcePackPolicy('official_first', [ready('primary_authority'), ready('core_reference')]).ready, true);
});

test('exam-focused accepts metadata-only exam context but still requires generation-ready factual support', () => {
  const evaluation = evaluateSourcePackPolicy('exam_focused', [
    { sourceRole: 'exam_context', inclusionState: 'included', generationReady: false },
    ready('core_reference'),
  ]);
  assert.equal(evaluation.ready, true);
});

test('excluded and non-generation-ready sources do not satisfy generation requirements', () => {
  const evaluation = evaluateSourcePackPolicy('reference_led', [
    { sourceRole: 'core_reference', inclusionState: 'included', generationReady: false },
    { sourceRole: 'core_reference', inclusionState: 'excluded', generationReady: true },
    ready('core_reference'),
  ]);
  assert.equal(evaluation.ready, false);
  assert.equal(evaluation.requirements[0]?.currentCount, 1);
});
