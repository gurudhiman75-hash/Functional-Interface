import assert from 'node:assert/strict';
import test from 'node:test';

import { assessSourceCoverage, normalizeSourceCoverageDepth, type SourceCoverageSource } from './source-coverage';

const base = (overrides: Partial<SourceCoverageSource> = {}): SourceCoverageSource => ({
  id: crypto.randomUUID(),
  sourceType: 'web',
  sourceUri: 'https://example.gov/source',
  publisher: 'Example Authority',
  rightsBasis: 'publisher_authorized',
  retentionMode: 'extracted_text',
  extractionStatus: 'processed',
  retainedCharCount: 1200,
  inclusionState: 'included',
  ...overrides,
});

test('depth normalization is conservative', () => {
  assert.equal(normalizeSourceCoverageDepth('quick_revision'), 'quick_revision');
  assert.equal(normalizeSourceCoverageDepth('comprehensive'), 'comprehensive');
  assert.equal(normalizeSourceCoverageDepth('weird'), 'standard');
});

test('standard notes need two generation-ready sources', () => {
  const assessment = assessSourceCoverage('standard', [base()]);
  assert.equal(assessment.status, 'needs_sources');
  assert.ok(assessment.findings.some((finding) => finding.code === 'INSUFFICIENT_INCLUDED_SOURCES'));
  assert.ok(assessment.findings.some((finding) => finding.code === 'INSUFFICIENT_GENERATION_READY_SOURCES'));
  assert.equal(assessment.evidenceExtractionHardBlocked, false);
});

test('independent publishers remove monoculture warning', () => {
  const assessment = assessSourceCoverage('standard', [
    base({ id: '1', publisher: 'Authority A', sourceType: 'web' }),
    base({ id: '2', publisher: 'Authority B', sourceType: 'uploaded_pdf', sourceUri: 'upload://b.pdf' }),
  ]);
  assert.equal(assessment.status, 'ready');
  assert.equal(assessment.counts.independentPublishersOrDomains, 2);
  assert.equal(assessment.findings.some((finding) => finding.code === 'SOURCE_MONOCULTURE'), false);
});

test('reference-only sources remain provenance-only', () => {
  const assessment = assessSourceCoverage('quick_revision', [base({
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
    retainedCharCount: 0,
  })]);
  assert.equal(assessment.status, 'needs_sources');
  assert.equal(assessment.counts.generationReady, 0);
  assert.ok(assessment.recommendedNeeds.includes('rights_permitting_extraction'));
});

test('coverage intelligence never auto-discovers or auto-attaches sources', () => {
  const assessment = assessSourceCoverage('comprehensive', []);
  assert.equal(assessment.automaticSourceDiscovery, false);
  assert.equal(assessment.automaticSourceAttachment, false);
});
