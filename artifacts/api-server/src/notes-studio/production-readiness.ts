export const NOTES_STUDIO_MIGRATIONS = [
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
  '20260903_notes_studio_coverage_editorial_review_gate.sql',
  '20260905_notes_studio_append_only_gap_sources.sql',
] as const;

export const NOTES_STUDIO_REQUIRED_RELATIONS = [
  'content.source_documents',
  'content.note_authoring_jobs',
  'content.note_authoring_sources',
  'content.note_source_evidence_blocks',
  'content.note_source_claims',
  'content.note_source_claim_evidence',
  'content.note_coverage_plan_items',
  'content.note_coverage_item_claims',
  'content.note_sections',
  'content.note_section_claims',
  'content.note_section_blocks',
  'content.note_generation_events',
  'content.note_quality_runs',
  'content.note_quality_checks',
  'content.note_approved_versions',
  'content.note_materializations',
  'content.note_localizations',
  'content.note_publish_handoffs',
  'content.note_planning_batches',
  'content.note_planning_items',
  'content.note_research_restarts',
] as const;

export const NOTES_STUDIO_REQUIRED_COLUMNS = [
  'content.note_coverage_plan_items.coverage_review_state',
  'content.note_coverage_plan_items.coverage_review_claim_ids',
  'content.note_coverage_plan_items.coverage_reviewed_by',
  'content.note_coverage_plan_items.coverage_reviewed_at',
] as const;

export const NOTES_STUDIO_REQUIRED_TRIGGERS = [
  'note_source_pack_insert_delete_invalidation',
  'note_source_pack_inclusion_invalidation',
  'note_authoring_sources_pre_evidence_freeze',
  'note_research_restarts_immutable',
  'note_sections_invalidate_quality_trg',
  'note_claims_invalidate_quality_trg',
  'note_claim_evidence_invalidate_quality_trg',
  'note_coverage_items_invalidate_quality_trg',
  'note_coverage_claims_invalidate_quality_trg',
  'note_approved_versions_immutable_update',
  'note_localizations_materialized_freeze',
  'note_authoring_jobs_lineage_guard',
  'note_approved_versions_revision_number',
  'learning_resources_notes_studio_content_freeze',
  'learning_resource_exams_notes_studio_freeze',
] as const;

export type NotesStudioSchemaInspection = {
  ready: boolean;
  presentRelations: string[];
  missingRelations: string[];
  presentColumns: string[];
  missingColumns: string[];
  presentTriggers: string[];
  missingTriggers: string[];
};

type UnsafeSqlClient = {
  unsafe(query: string): Promise<readonly Record<string, unknown>[]>;
};

function quotedSqlStrings(values: readonly string[]): string {
  return values.map((value) => `'${value.replaceAll("'", "''")}'`).join(', ');
}

export async function inspectNotesStudioSchema(sql: UnsafeSqlClient): Promise<NotesStudioSchemaInspection> {
  const relationRows = await sql.unsafe(`
    SELECT table_schema || '.' || table_name AS name
    FROM information_schema.tables
    WHERE table_schema || '.' || table_name IN (${quotedSqlStrings(NOTES_STUDIO_REQUIRED_RELATIONS)})
  `);
  const columnRows = await sql.unsafe(`
    SELECT table_schema || '.' || table_name || '.' || column_name AS name
    FROM information_schema.columns
    WHERE table_schema || '.' || table_name || '.' || column_name IN (${quotedSqlStrings(NOTES_STUDIO_REQUIRED_COLUMNS)})
  `);
  const triggerRows = await sql.unsafe(`
    SELECT trigger_name AS name
    FROM information_schema.triggers
    WHERE trigger_schema = 'content'
      AND trigger_name IN (${quotedSqlStrings(NOTES_STUDIO_REQUIRED_TRIGGERS)})
  `);
  const relationSet = new Set(relationRows.map((row) => String(row.name)));
  const columnSet = new Set(columnRows.map((row) => String(row.name)));
  const triggerSet = new Set(triggerRows.map((row) => String(row.name)));
  const missingRelations = NOTES_STUDIO_REQUIRED_RELATIONS.filter((name) => !relationSet.has(name));
  const missingColumns = NOTES_STUDIO_REQUIRED_COLUMNS.filter((name) => !columnSet.has(name));
  const missingTriggers = NOTES_STUDIO_REQUIRED_TRIGGERS.filter((name) => !triggerSet.has(name));
  return {
    ready: missingRelations.length === 0 && missingColumns.length === 0 && missingTriggers.length === 0,
    presentRelations: NOTES_STUDIO_REQUIRED_RELATIONS.filter((name) => relationSet.has(name)),
    missingRelations: [...missingRelations],
    presentColumns: NOTES_STUDIO_REQUIRED_COLUMNS.filter((name) => columnSet.has(name)),
    missingColumns: [...missingColumns],
    presentTriggers: NOTES_STUDIO_REQUIRED_TRIGGERS.filter((name) => triggerSet.has(name)),
    missingTriggers: [...missingTriggers],
  };
}

export type NotesStudioProductionSignals = {
  schemaReady: boolean;
  sectionModelConfigured: boolean;
  localizationModelConfigured: boolean;
  modelApiKeyConfigured: boolean;
  failedSourceCount: number;
  failedGenerationCount: number;
  failedQualityRunCount: number;
};

export type NotesStudioProductionAssessment = {
  readyForEditorTraffic: boolean;
  blockers: string[];
  warnings: string[];
};

export function assessNotesStudioProductionReadiness(
  signals: NotesStudioProductionSignals,
): NotesStudioProductionAssessment {
  const blockers: string[] = [];
  const warnings: string[] = [];
  if (!signals.schemaReady) blockers.push('Notes Studio database schema, required columns or required triggers are incomplete.');
  if (!signals.sectionModelConfigured) blockers.push('NOTES_STUDIO_MODEL is not configured.');
  if (!signals.localizationModelConfigured) blockers.push('NOTES_STUDIO_LOCALIZATION_MODEL is not configured.');
  if (!signals.modelApiKeyConfigured) blockers.push('Notes Studio/OpenAI API key is not configured.');
  if (signals.failedSourceCount > 0) warnings.push(`${signals.failedSourceCount} source extraction failure(s) need review.`);
  if (signals.failedGenerationCount > 0) warnings.push(`${signals.failedGenerationCount} section generation failure(s) are recorded.`);
  if (signals.failedQualityRunCount > 0) warnings.push(`${signals.failedQualityRunCount} failed QA run(s) are recorded.`);
  return { readyForEditorTraffic: blockers.length === 0, blockers, warnings };
}
