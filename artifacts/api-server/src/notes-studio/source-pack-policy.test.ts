import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluateSourcePackPolicy,
  noteSourceIdentity,
  noteSourcePackTemplateKey,
  noteSourceRole,
  sourcePackTemplateOptions,
} from './source-pack-policy';

const ready = (
  sourceRole: 'primary_authority' | 'core_reference' | 'exam_context' | 'supplemental',
  contentHash?: string,
  sourceIdentity?: string,
) => ({
  sourceRole,
  inclusionState: 'included',
  generationReady: true,
  contentHash,
  sourceIdentity,
});

const referenceReady = (
  sourceRole: 'primary_authority' | 'core_reference' | 'exam_context' | 'supplemental',
  contentHash?: string,
  sourceIdentity?: string,
) => ({
  sourceRole,
  inclusionState: 'included',
  generationReady: false,
  referenceEvidenceReady: true,
  contentHash,
  sourceIdentity,
});

test('unknown policy and role values fall back to safe defaults', () => {
  assert.equal(noteSourcePackTemplateKey('unknown'), 'balanced');
  assert.equal(noteSourceRole('unknown'), 'core_reference');
  assert.equal(sourcePackTemplateOptions().length, 5);
});

test('source identity prefers publisher and falls back to host', () => {
  assert.equal(noteSourceIdentity('  NCERT  ', 'https://ncert.nic.in/book'), 'publisher:ncert');
  assert.equal(noteSourceIdentity('', 'https://www.rbi.org.in/report'), 'host:rbi.org.in');
  assert.equal(noteSourceIdentity('', 'urn:sha256:abc'), null);
});

test('balanced policy requires two independent evidence-ready core sources', () => {
  assert.equal(evaluateSourcePackPolicy('balanced', [ready('core_reference')]).ready, false);
  assert.equal(evaluateSourcePackPolicy('balanced', [
    ready('primary_authority', 'a'.repeat(64), 'publisher:a'),
    ready('core_reference', 'b'.repeat(64), 'publisher:b'),
  ]).ready, true);
});

test('balanced policy rejects duplicate content even when two rows are present', () => {
  const evaluation = evaluateSourcePackPolicy('balanced', [
    ready('core_reference', 'a'.repeat(64), 'publisher:a'),
    ready('core_reference', 'a'.repeat(64), 'publisher:b'),
  ]);
  assert.equal(evaluation.ready, false);
  assert.deepEqual(evaluation.integrity.findings.map((item) => item.code), ['INSUFFICIENT_UNIQUE_CONTENT']);
});

test('balanced policy rejects same-publisher monoculture even with unique content', () => {
  const evaluation = evaluateSourcePackPolicy('balanced', [
    ready('core_reference', 'a'.repeat(64), 'publisher:a'),
    ready('core_reference', 'b'.repeat(64), 'publisher:a'),
  ]);
  assert.equal(evaluation.ready, false);
  assert.deepEqual(evaluation.integrity.findings.map((item) => item.code), ['INSUFFICIENT_SOURCE_IDENTITIES']);
});

test('official-first requires both authority and independent reference roles', () => {
  const missingReference = evaluateSourcePackPolicy('official_first', [ready('primary_authority'), ready('primary_authority')]);
  assert.equal(missingReference.ready, false);
  assert.deepEqual(missingReference.missing.map((item) => item.code), ['core_reference']);
  assert.equal(evaluateSourcePackPolicy('official_first', [
    ready('primary_authority', 'a'.repeat(64), 'publisher:authority'),
    ready('core_reference', 'b'.repeat(64), 'publisher:reference'),
  ]).ready, true);
});

test('official-first accepts reviewed reference evidence without treating the source as retained text', () => {
  const evaluation = evaluateSourcePackPolicy('official_first', [
    referenceReady('primary_authority', 'a'.repeat(64), 'publisher:punjab-government'),
    referenceReady('core_reference', 'b'.repeat(64), 'publisher:bbmb'),
  ]);
  assert.equal(evaluation.ready, true);
  assert.equal(evaluation.requirements.every((item) => item.satisfied), true);
});

test('reference-only sources remain blocked until reviewed reference evidence exists', () => {
  const evaluation = evaluateSourcePackPolicy('official_first', [
    {
      sourceRole: 'primary_authority' as const,
      inclusionState: 'included',
      generationReady: false,
      referenceEvidenceReady: false,
      contentHash: 'a'.repeat(64),
      sourceIdentity: 'publisher:authority',
    },
    referenceReady('core_reference', 'b'.repeat(64), 'publisher:reference'),
  ]);
  assert.equal(evaluation.ready, false);
  assert.deepEqual(evaluation.missing.map((item) => item.code), ['primary_authority']);
});

test('exam-focused accepts metadata-only exam context but still requires distinct content plus evidence-ready factual support', () => {
  const evaluation = evaluateSourcePackPolicy('exam_focused', [
    { sourceRole: 'exam_context' as const, inclusionState: 'included', generationReady: false, contentHash: 'a'.repeat(64), sourceIdentity: 'publisher:exam' },
    ready('core_reference', 'b'.repeat(64), 'publisher:exam'),
  ]);
  assert.equal(evaluation.ready, true);
  assert.equal(evaluation.integrity.minDistinctIdentities, 1);
});

test('excluded and non-evidence-ready sources do not satisfy evidence requirements', () => {
  const evaluation = evaluateSourcePackPolicy('reference_led', [
    { sourceRole: 'core_reference' as const, inclusionState: 'included', generationReady: false, referenceEvidenceReady: false },
    { sourceRole: 'core_reference' as const, inclusionState: 'excluded', generationReady: true },
    ready('core_reference'),
  ]);
  assert.equal(evaluation.ready, false);
  assert.equal(evaluation.requirements[0]?.currentCount, 1);
});
