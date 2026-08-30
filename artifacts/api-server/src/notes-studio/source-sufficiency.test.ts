import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateSourceSufficiency, isOfficialOrInstitutionalSource } from './source-sufficiency';

function source(overrides: Partial<Parameters<typeof evaluateSourceSufficiency>[1][number]> = {}) {
  return {
    id: crypto.randomUUID(),
    sourceType: 'web',
    sourceUri: 'https://example.com/topic',
    title: 'Source',
    publisher: 'Example Publisher',
    contentHash: crypto.randomUUID().replaceAll('-', '').padEnd(64, 'a').slice(0, 64),
    rightsBasis: 'publisher_authorized',
    retentionMode: 'extracted_text',
    extractionStatus: 'processed',
    retainedCharCount: 500,
    capturedAt: new Date().toISOString(),
    ...overrides,
  };
}

test('quick revision can proceed with one unique generation-ready source', () => {
  const result = evaluateSourceSufficiency('quick_revision', [source()]);
  assert.notEqual(result.status, 'insufficient');
  assert.equal(result.summary.uniqueGenerationReadyCount, 1);
});

test('standard requires two unique generation-ready identities', () => {
  const first = source({ publisher: 'Publisher A', contentHash: 'a'.repeat(64) });
  const samePublisher = source({ publisher: 'Publisher A', sourceUri: 'https://a.example/other', contentHash: 'b'.repeat(64) });
  const result = evaluateSourceSufficiency('standard', [first, samePublisher]);
  assert.equal(result.status, 'insufficient');
  assert.ok(result.issues.some((issue) => issue.code === 'INSUFFICIENT_SOURCE_DIVERSITY'));

  const diversified = evaluateSourceSufficiency('standard', [first, source({ publisher: 'Publisher B', contentHash: 'c'.repeat(64) })]);
  assert.equal(diversified.issues.some((issue) => issue.severity === 'blocking'), false);
});

test('duplicate content hashes do not satisfy comprehensive source quota', () => {
  const result = evaluateSourceSufficiency('comprehensive', [
    source({ publisher: 'A', contentHash: 'a'.repeat(64) }),
    source({ publisher: 'B', contentHash: 'a'.repeat(64) }),
    source({ publisher: 'C', contentHash: 'c'.repeat(64) }),
  ]);
  assert.equal(result.status, 'insufficient');
  assert.equal(result.summary.uniqueGenerationReadyCount, 2);
  assert.ok(result.issues.some((issue) => issue.code === 'DUPLICATE_CONTENT_HASHES'));
});

test('provenance-only sources remain visible but never satisfy generation quota', () => {
  const result = evaluateSourceSufficiency('standard', [
    source({ publisher: 'A', contentHash: 'a'.repeat(64) }),
    source({ publisher: 'B', contentHash: 'b'.repeat(64), rightsBasis: 'reference_only', retentionMode: 'metadata_only', extractionStatus: 'metadata_only', retainedCharCount: 0 }),
  ]);
  assert.equal(result.status, 'insufficient');
  assert.equal(result.summary.referenceOnlyCount, 1);
  assert.equal(result.summary.uniqueGenerationReadyCount, 1);
});

test('comprehensive source pack warns when no official or institutional reference is present', () => {
  const result = evaluateSourceSufficiency('comprehensive', [
    source({ publisher: 'Publisher A', contentHash: 'a'.repeat(64) }),
    source({ publisher: 'Publisher B', contentHash: 'b'.repeat(64) }),
    source({ publisher: 'Publisher C', contentHash: 'c'.repeat(64) }),
  ]);
  assert.equal(result.status, 'review');
  assert.ok(result.issues.some((issue) => issue.code === 'NO_OFFICIAL_OR_INSTITUTIONAL_REFERENCE'));
});

test('official host classification recognizes canonical Indian authority domains', () => {
  assert.equal(isOfficialOrInstitutionalSource({ publisher: '', sourceUri: 'https://www.rbi.org.in/report' }), true);
  assert.equal(isOfficialOrInstitutionalSource({ publisher: '', sourceUri: 'https://example.com/report' }), false);
});
