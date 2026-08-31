import assert from 'node:assert/strict';
import test from 'node:test';

import {
  NOTES_STUDIO_MIGRATIONS,
  NOTES_STUDIO_REQUIRED_RELATIONS,
  NOTES_STUDIO_REQUIRED_TRIGGERS,
  assessNotesStudioProductionReadiness,
} from './production-readiness';

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
