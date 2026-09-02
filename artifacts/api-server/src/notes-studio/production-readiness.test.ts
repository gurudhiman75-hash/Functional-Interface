import assert from 'node:assert/strict';
import test from 'node:test';

import { buildGeminiGenerationConfig } from '../lib/ai-providers/gemini-adapter';
import {
  coveragePlanBulkAllowed,
  coveragePlanItemKey,
  normalizeCoveragePlanBulk,
} from './coverage-plan-bulk';
import {
  NOTES_STUDIO_MIGRATIONS,
  NOTES_STUDIO_REQUIRED_RELATIONS,
  NOTES_STUDIO_REQUIRED_TRIGGERS,
  assessNotesStudioProductionReadiness,
} from './production-readiness';
import {
  referenceEvidenceAllowed,
  referenceEvidenceFingerprint,
  validateReferenceEvidenceInput,
} from './reference-evidence';
import {
  normalizeResearchRestartReason,
  researchRestartAllowed,
  researchRestartDiscardTotal,
  researchRestartTargetState,
} from './research-restart';
import {
  buildSourceDiscoveryQueries,
  normalizeDiscoveredSourceUrl,
  rankDiscoveredSourceUrls,
  sourceDiscoveryAllowed,
} from './source-discovery';
import { sourceDiscoveryProviderInternals } from './source-discovery-provider';

test('Notes Studio migration manifest preserves the cumulative chain in order', () => {
  assert.deepEqual([...NOTES_STUDIO_MIGRATIONS], [
    '20260829_notes_studio_source_pack.sql',
    '20260829_notes_studio_source_pack_ns003_evidence_coverage.sql',
    '20260829_notes_studio_source_pack_ns004_section_synthesis.sql',
    '20260829_notes_studio_source_pack_ns004_section_synthesis_hardening.sql',
    '20260830_notes_studio_source_pack_ns005_quality_gates.sql',
    '20260830_notes_studio_source_pack_ns006_approval_localization.sql',
    '20260830_notes_studio_source_pack_ns007_release_lineage.sql',
    '20260830_notes_studio_source_pack_ns009_planning.sql',
    '20260830_notes_studio_source_pack_ns011_source_policy.sql',
    '20260831_notes_studio_ns017_source_pack_freeze.sql',
    '20260831_notes_studio_ns018_research_restart.sql',
    '20260831_notes_studio_ns021_reference_evidence.sql',
  ]);
  assert.equal(new Set(NOTES_STUDIO_MIGRATIONS).size, NOTES_STUDIO_MIGRATIONS.length);
  assert.equal(new Set(NOTES_STUDIO_REQUIRED_RELATIONS).size, NOTES_STUDIO_REQUIRED_RELATIONS.length);
  assert.equal(new Set(NOTES_STUDIO_REQUIRED_TRIGGERS).size, NOTES_STUDIO_REQUIRED_TRIGGERS.length);
  assert.equal(NOTES_STUDIO_REQUIRED_RELATIONS.includes('content.note_planning_batches'), true);
  assert.equal(NOTES_STUDIO_REQUIRED_RELATIONS.includes('content.note_planning_items'), true);
  assert.equal(NOTES_STUDIO_REQUIRED_RELATIONS.includes('content.note_research_restarts'), true);
  assert.equal(NOTES_STUDIO_REQUIRED_TRIGGERS.includes('note_authoring_sources_pre_evidence_freeze'), true);
  assert.equal(NOTES_STUDIO_REQUIRED_TRIGGERS.includes('note_research_restarts_immutable'), true);
});

test('Gemini generateContent structured output uses responseMimeType and sanitized responseJsonSchema', () => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['claims'],
    properties: {
      claims: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['text'],
          properties: {
            text: { type: ['string', 'null'], minLength: 5, maxLength: 1200 },
          },
        },
      },
    },
  } as Record<string, unknown>;
  const config = buildGeminiGenerationConfig({
    model: 'gemini-3.6-flash',
    temperature: 0,
    responseSchema: schema,
  }) as any;
  assert.equal(config.responseMimeType, 'application/json');
  assert.deepEqual(config.responseJsonSchema?.properties?.claims?.items?.properties?.text?.type, ['string', 'null']);
  assert.equal(config.responseJsonSchema?.properties?.claims?.items?.properties?.text?.minLength, undefined);
  assert.equal(config.responseJsonSchema?.properties?.claims?.items?.properties?.text?.maxLength, undefined);
  assert.equal(config.responseFormat, undefined);
  assert.equal('temperature' in config, false);
});

test('NS-018 research restart remains bounded to progressed pre-approval work', () => {
  for (const state of ['evidence_ready', 'outline_ready', 'drafting', 'qa_required', 'review_ready']) {
    assert.equal(researchRestartAllowed(state), true, state);
  }
  for (const state of ['brief', 'sources_ready', 'approved', 'materialized']) {
    assert.equal(researchRestartAllowed(state), false, state);
  }
  assert.equal(researchRestartTargetState(0), 'brief');
  assert.equal(researchRestartTargetState(1), 'sources_ready');
  assert.equal(researchRestartTargetState(4), 'sources_ready');
  assert.equal(normalizeResearchRestartReason('  add a newly reviewed source  '), 'add a newly reviewed source');
  assert.equal(normalizeResearchRestartReason('x'.repeat(1200)).length, 1000);
  assert.equal(researchRestartDiscardTotal({
    evidenceBlocks: 3,
    claims: 4,
    coverageMappings: 2,
    sections: 5,
    qualityRuns: 1,
    generationEvents: 2,
  }), 17);
});

test('NS-019 source discovery produces bounded public URL candidates without creating facts', () => {
  for (const state of ['brief', 'sources_ready', 'evidence_ready', 'outline_ready', 'drafting', 'qa_required', 'review_ready']) {
    assert.equal(sourceDiscoveryAllowed(state), true, state);
  }
  for (const state of ['approved', 'materialized']) assert.equal(sourceDiscoveryAllowed(state), false, state);

  assert.deepEqual(buildSourceDiscoveryQueries({
    topicLabel: 'Punjab River System',
    syllabusEmphasis: 'Static GK / Punjab Geography',
    focus: 'Ravi Beas Sutlej official basin sources',
  }), [
    'Ravi Beas Sutlej official basin sources',
    'Punjab River System Static GK / Punjab Geography',
    'Punjab River System official government source',
    'Punjab River System authoritative reference India',
  ]);

  assert.equal(normalizeDiscoveredSourceUrl('http://example.com/reference'), null);
  assert.equal(normalizeDiscoveredSourceUrl('https://127.0.0.1/internal'), null);
  assert.equal(normalizeDiscoveredSourceUrl('https://[::1]/internal'), null);
  assert.equal(normalizeDiscoveredSourceUrl('https://[fd00::1]/internal'), null);
  assert.equal(normalizeDiscoveredSourceUrl('https://example.com/page?utm_source=x&a=1#part'), 'https://example.com/page?a=1');
  const ranked = rankDiscoveredSourceUrls([
    'https://example.com/reference',
    'https://punjab.gov.in/know-punjab/',
    'https://example.com/reference',
    'file:///etc/passwd',
  ]);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0]?.domain, 'punjab.gov.in');
  assert.equal(ranked[0]?.authorityClass, 'government_primary');

  const extracted = sourceDiscoveryProviderInternals.sourceUrlsFromResponse({
    output: [
      {
        type: 'web_search_call',
        action: {
          type: 'search',
          sources: [
            { type: 'url', url: 'https://punjab.gov.in/know-punjab/' },
            { type: 'url', url: 'https://cwc.gov.in/en/ibo/about-basins' },
          ],
        },
      },
      { type: 'message', content: [{ type: 'output_text', text: 'Discarded prose.' }] },
    ],
  });
  assert.equal(extracted.searchCallCount, 1);
  assert.deepEqual(extracted.urls, [
    'https://punjab.gov.in/know-punjab/',
    'https://cwc.gov.in/en/ibo/about-basins',
  ]);
});

test('NS-020 bulk coverage import is bounded, deterministic and pre-drafting only', () => {
  for (const state of ['brief', 'sources_ready', 'evidence_ready', 'outline_ready']) {
    assert.equal(coveragePlanBulkAllowed(state), true, state);
  }
  for (const state of ['drafting', 'qa_required', 'review_ready', 'approved', 'materialized']) {
    assert.equal(coveragePlanBulkAllowed(state), false, state);
  }

  const plan = normalizeCoveragePlanBulk([
    {
      title: 'Historic five rivers',
      syllabusRef: 'Punjab Geography → River System → Historic five',
      priority: 'required',
      plannedDepth: 'standard',
      examRationale: 'High-yield enumeration fact.',
      sortOrder: 2,
    },
    {
      title: 'Present-day Punjab rivers',
      syllabusRef: 'Punjab Geography → River System → Present-day Punjab',
    },
  ]);
  assert.equal(plan.length, 2);
  assert.equal(plan[0]?.priority, 'required');
  assert.equal(plan[1]?.plannedDepth, 'standard');
  assert.equal(plan[1]?.sortOrder, 1);
  assert.notEqual(coveragePlanItemKey(plan[0]!), coveragePlanItemKey(plan[1]!));

  assert.throws(() => normalizeCoveragePlanBulk([
    { title: 'Same', syllabusRef: 'Path' },
    { title: ' same ', syllabusRef: ' path ' },
  ]), /duplicate/i);
  assert.throws(() => normalizeCoveragePlanBulk([]), /between 1 and 50/i);
  assert.throws(() => normalizeCoveragePlanBulk([{ title: 'Valid title', priority: 'critical' }]), /invalid priority/i);
});

test('NS-021 reference evidence is explicit, locator-bearing and pre-drafting only', () => {
  for (const state of ['brief', 'sources_ready', 'evidence_ready', 'outline_ready']) {
    assert.equal(referenceEvidenceAllowed(state), true, state);
  }
  for (const state of ['drafting', 'qa_required', 'review_ready', 'approved', 'materialized']) {
    assert.equal(referenceEvidenceAllowed(state), false, state);
  }

  const normalized = validateReferenceEvidenceInput({
    noteText: '  The source identifies Ravi, Beas and Sutlej as rivers flowing through present-day Punjab.  ',
    locatorLabel: ' Know Punjab — Geography section ',
    paraphrasedByEditor: true,
  });
  assert.equal(normalized.noteText, 'The source identifies Ravi, Beas and Sutlej as rivers flowing through present-day Punjab.');
  assert.equal(normalized.locatorLabel, 'Know Punjab — Geography section');
  assert.equal(normalized.excerptHash, referenceEvidenceFingerprint(normalized.noteText));
  assert.match(normalized.excerptHash, /^[0-9a-f]{64}$/);

  assert.throws(() => validateReferenceEvidenceInput({
    noteText: 'This is a sufficiently long factual paraphrase.',
    locatorLabel: '',
    paraphrasedByEditor: true,
  }), /locator/i);
  assert.throws(() => validateReferenceEvidenceInput({
    noteText: 'This is a sufficiently long factual paraphrase.',
    locatorLabel: 'Section 2',
    paraphrasedByEditor: false,
  }), /confirm/i);
});

test('editor traffic is blocked when schema or model configuration is incomplete', () => {
  const assessment = assessNotesStudioProductionReadiness({
    schemaReady: false,
    sectionModelConfigured: false,
    localizationModelConfigured: true,
    modelApiKeyConfigured: false,
    failedSourceCount: 0,
    failedGenerationCount: 0,
    failedQualityRunCount: 0,
  });
  assert.equal(assessment.readyForEditorTraffic, false);
  assert.equal(assessment.blockers.length, 3);
});

test('recorded operational failures warn but do not silently disable a healthy authoring stack', () => {
  const assessment = assessNotesStudioProductionReadiness({
    schemaReady: true,
    sectionModelConfigured: true,
    localizationModelConfigured: true,
    modelApiKeyConfigured: true,
    failedSourceCount: 2,
    failedGenerationCount: 3,
    failedQualityRunCount: 4,
  });
  assert.equal(assessment.readyForEditorTraffic, true);
  assert.equal(assessment.blockers.length, 0);
  assert.equal(assessment.warnings.length, 3);
});