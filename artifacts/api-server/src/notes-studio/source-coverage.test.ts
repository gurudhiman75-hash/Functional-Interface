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
  referenceEvidenceCount: 0,
  ...overrides,
});

test('depth normalization is conservative', () => {
  assert.equal(normalizeSourceCoverageDepth('quick_revision'), 'quick_revision');
  assert.equal(normalizeSourceCoverageDepth('comprehensive'), 'comprehensive');
  assert.equal(normalizeSourceCoverageDepth('weird'), 'standard');
});

test('standard notes need two evidence-ready sources', () => {
  const assessment = assessSourceCoverage('standard', [base()]);
  assert.equal(assessment.status, 'needs_sources');
  assert.ok(assessment.findings.some((finding) => finding.code === 'INSUFFICIENT_INCLUDED_SOURCES'));
  assert.ok(assessment.findings.some((finding) => finding.code === 'INSUFFICIENT_EVIDENCE_READY_SOURCES'));
  assert.equal(assessment.counts.evidenceReady, 1);
  assert.equal(assessment.counts.generationReady, 1);
  assert.equal(assessment.evidenceExtractionHardBlocked, false);
});

test('independent retained-evidence publishers remove monoculture warning', () => {
  const assessment = assessSourceCoverage('standard', [
    base({ id: '1', publisher: 'Authority A', sourceType: 'web' }),
    base({ id: '2', publisher: 'Authority B', sourceType: 'uploaded_pdf', sourceUri: 'upload://b.pdf' }),
  ]);
  assert.equal(assessment.status, 'ready');
  assert.equal(assessment.counts.evidenceReady, 2);
  assert.equal(assessment.counts.generationReady, 2);
  assert.equal(assessment.counts.independentPublishersOrDomains, 2);
  assert.equal(assessment.findings.some((finding) => finding.code === 'SOURCE_MONOCULTURE'), false);
});

test('reference-only source without reviewed reference evidence remains insufficient', () => {
  const assessment = assessSourceCoverage('quick_revision', [base({
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
    retainedCharCount: 0,
    referenceEvidenceCount: 0,
  })]);
  assert.equal(assessment.status, 'needs_sources');
  assert.equal(assessment.counts.evidenceReady, 0);
  assert.equal(assessment.counts.generationReady, 0);
  assert.equal(assessment.counts.referenceEvidenceReady, 0);
  assert.equal(assessment.counts.referenceOnlyWithoutEvidence, 1);
  assert.ok(assessment.recommendedNeeds.includes('review_reference_only_source'));
});

test('reviewed reference evidence satisfies evidence sufficiency without becoming retained text', () => {
  const assessment = assessSourceCoverage('quick_revision', [base({
    rightsBasis: 'reference_only',
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
    retainedCharCount: 0,
    referenceEvidenceCount: 2,
  })]);
  assert.equal(assessment.status, 'ready');
  assert.equal(assessment.counts.evidenceReady, 1);
  assert.equal(assessment.counts.generationReady, 0);
  assert.equal(assessment.counts.referenceEvidenceReady, 1);
  assert.equal(assessment.counts.referenceOnlyWithoutEvidence, 0);
  assert.ok(assessment.findings.some((finding) => finding.code === 'REFERENCE_EVIDENCE_PRESENT'));
  assert.equal(assessment.recommendedNeeds.includes('review_reference_only_source'), false);
});

test('mixed retained and reference evidence can satisfy standard depth', () => {
  const assessment = assessSourceCoverage('standard', [
    base({ id: 'retained', publisher: 'Authority A', sourceType: 'uploaded_pdf', sourceUri: 'upload://a.pdf' }),
    base({
      id: 'reference',
      publisher: 'Authority B',
      sourceUri: 'https://authority-b.gov/reference',
      rightsBasis: 'reference_only',
      retentionMode: 'metadata_only',
      extractionStatus: 'metadata_only',
      retainedCharCount: 0,
      referenceEvidenceCount: 1,
    }),
  ]);
  assert.equal(assessment.status, 'ready');
  assert.equal(assessment.counts.evidenceReady, 2);
  assert.equal(assessment.counts.generationReady, 1);
  assert.equal(assessment.counts.referenceEvidenceReady, 1);
});

test('coverage intelligence never auto-discovers or auto-attaches sources', () => {
  const assessment = assessSourceCoverage('comprehensive', []);
  assert.equal(assessment.automaticSourceDiscovery, false);
  assert.equal(assessment.automaticSourceAttachment, false);
});
