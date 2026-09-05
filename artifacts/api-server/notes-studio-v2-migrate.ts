import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { sqlClient } from './src/lib/db';

const NOTES_STUDIO_V2_MIGRATIONS = [
  '20260905_notes_studio_v2.sql',
  '20260905_notes_studio_v2_figure_queue.sql',
  '20260905_notes_studio_v2_publish_guard.sql',
  '20260905_notes_studio_v2_quality_runs.sql',
] as const;

const EXPECTED_RELATIONS = [
  'periods',
  'period_sub_categories',
  'corpus_docs',
  'facts',
  'fact_source_refs',
  'contradiction_groups',
  'contradiction_group_facts',
  'style_specs',
  'style_bootstrap_rounds',
  'notes',
  'note_versions',
  'note_figures',
  'quality_runs',
] as const;

const EXPECTED_TRIGGERS = [
  'notes_studio_v2_materialize_note_figures',
  'notes_studio_v2_guard_note_publish',
  'notes_studio_v2_require_quality_before_review',
  'notes_studio_v2_invalidate_quality_after_content_edit',
] as const;

type MigrationFile = {
  fileName: string;
  sqlText: string;
  executableSqlText: string;
  digest: string;
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function stripOuterTransaction(sqlText: string): string {
  const trimmed = sqlText.trim();
  if (!/^BEGIN;\s*/i.test(trimmed) || !/\s*COMMIT;\s*$/i.test(trimmed)) return trimmed;
  return trimmed.replace(/^BEGIN;\s*/i, '').replace(/\s*COMMIT;\s*$/i, '').trim();
}

async function loadMigrations(migrationsDir: string): Promise<MigrationFile[]> {
  const manifestNames = new Set<string>(NOTES_STUDIO_V2_MIGRATIONS);
  const diskNames = (await readdir(migrationsDir))
    .filter((fileName) => /^\d{8}_notes_studio_v2.*\.sql$/.test(fileName))
    .sort();
  const unmanifested = diskNames.filter((fileName) => !manifestNames.has(fileName));
  if (unmanifested.length > 0) {
    throw new Error(`Unmanifested Notes Studio v2 migration file(s): ${unmanifested.join(', ')}`);
  }

  const migrations: MigrationFile[] = [];
  for (const fileName of NOTES_STUDIO_V2_MIGRATIONS) {
    const sqlText = await readFile(path.join(migrationsDir, fileName), 'utf8');
    if (!sqlText.trim()) throw new Error(`Notes Studio v2 migration is empty: ${fileName}`);
    migrations.push({
      fileName,
      sqlText,
      executableSqlText: stripOuterTransaction(sqlText),
      digest: sha256(sqlText),
    });
  }
  return migrations;
}

async function inspectSchema() {
  const relationRows = await sqlClient`
    SELECT tablename AS name
    FROM pg_tables
    WHERE schemaname = 'notes_studio_v2'
  `;
  const triggerRows = await sqlClient`
    SELECT trigger_name AS name
    FROM information_schema.triggers
    WHERE trigger_schema = 'notes_studio_v2'
  `;

  const relations = new Set(relationRows.map((row) => String(row.name)));
  const triggers = new Set(triggerRows.map((row) => String(row.name)));
  const missingRelations = EXPECTED_RELATIONS.filter((name) => !relations.has(name));
  const missingTriggers = EXPECTED_TRIGGERS.filter((name) => !triggers.has(name));

  return {
    ready: missingRelations.length === 0 && missingTriggers.length === 0,
    relations: [...relations].sort(),
    triggers: [...triggers].sort(),
    missingRelations,
    missingTriggers,
  };
}

async function run() {
  const migrationsDir = path.resolve(process.cwd(), 'migrations');
  const migrations = await loadMigrations(migrationsDir);
  console.log(`[notes-studio-v2:migrate] verifying ${migrations.length} ordered migrations`);

  await sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext('examtree:notes-studio:v2'))`;
    await tx`CREATE SCHEMA IF NOT EXISTS platform`;
    await tx`
      CREATE TABLE IF NOT EXISTS platform.notes_studio_v2_schema_migrations (
        filename TEXT PRIMARY KEY,
        content_sha256 TEXT NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    const ledgerRows = await tx`
      SELECT filename, content_sha256 AS "contentSha256"
      FROM platform.notes_studio_v2_schema_migrations
      ORDER BY applied_at, filename
    `;
    const recorded = new Map<string, string>(
      ledgerRows.map((row) => [String(row.filename), String(row.contentSha256)] as const),
    );
    const manifestNames = new Set(migrations.map((migration) => migration.fileName));

    for (const [fileName, digest] of recorded) {
      if (!manifestNames.has(fileName)) {
        throw new Error(`Unknown Notes Studio v2 migration recorded in production ledger: ${fileName}`);
      }
      const current = migrations.find((migration) => migration.fileName === fileName);
      if (!current || current.digest !== digest) {
        throw new Error(`Notes Studio v2 migration drift detected for ${fileName}`);
      }
    }

    const recordedNames = migrations
      .filter((migration) => recorded.has(migration.fileName))
      .map((migration) => migration.fileName);
    const expectedPrefix = migrations
      .slice(0, recordedNames.length)
      .map((migration) => migration.fileName);
    if (recordedNames.some((fileName, index) => fileName !== expectedPrefix[index])) {
      throw new Error('Notes Studio v2 migration ledger is not a contiguous prefix of the ordered migration manifest.');
    }

    for (const migration of migrations.slice(recorded.size)) {
      console.log(`[notes-studio-v2:migrate] applying ${migration.fileName}`);
      await tx.unsafe(migration.executableSqlText);
      await tx`
        INSERT INTO platform.notes_studio_v2_schema_migrations (filename, content_sha256)
        VALUES (${migration.fileName}, ${migration.digest})
      `;
    }
  });

  const inspection = await inspectSchema();
  if (!inspection.ready) {
    throw new Error(
      `Notes Studio v2 schema is incomplete after migration. Missing relations: ${inspection.missingRelations.join(', ') || 'none'}; missing triggers: ${inspection.missingTriggers.join(', ') || 'none'}`,
    );
  }

  const ledgerRows = await sqlClient`
    SELECT filename, content_sha256 AS "contentSha256"
    FROM platform.notes_studio_v2_schema_migrations
    ORDER BY applied_at, filename
  `;
  if (ledgerRows.length !== migrations.length) {
    throw new Error(`Notes Studio v2 migration ledger is incomplete after bootstrap: ${ledgerRows.length}/${migrations.length}`);
  }
  for (const migration of migrations) {
    const row = ledgerRows.find((candidate) => String(candidate.filename) === migration.fileName);
    if (!row || String(row.contentSha256) !== migration.digest) {
      throw new Error(`Notes Studio v2 migration ledger verification failed for ${migration.fileName}`);
    }
  }

  console.log(
    `[notes-studio-v2:migrate] ready: ${inspection.relations.length} relations, ${inspection.triggers.length} triggers, ${ledgerRows.length} ledger entries`,
  );
}

run()
  .catch((error) => {
    console.error('[notes-studio-v2:migrate] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
