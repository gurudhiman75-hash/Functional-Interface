import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { sqlClient } from './src/lib/db';
import {
  NOTES_STUDIO_MIGRATIONS,
  inspectNotesStudioSchema,
} from './src/notes-studio/production-readiness';

type MigrationFile = {
  fileName: string;
  sqlText: string;
  digest: string;
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function loadMigrations(migrationsDir: string): Promise<MigrationFile[]> {
  const migrations: MigrationFile[] = [];
  for (const fileName of NOTES_STUDIO_MIGRATIONS) {
    const sqlText = await readFile(path.join(migrationsDir, fileName), 'utf8');
    if (!sqlText.trim()) throw new Error(`Notes Studio migration is empty: ${fileName}`);
    migrations.push({ fileName, sqlText, digest: sha256(sqlText) });
  }
  return migrations;
}

async function run() {
  const migrationsDir = path.resolve(process.cwd(), 'migrations');
  const migrations = await loadMigrations(migrationsDir);
  console.log(`[notes-studio:migrate] verifying ${migrations.length} ordered migrations`);

  await sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext('examtree:notes-studio:v1'))`;
    await tx`CREATE SCHEMA IF NOT EXISTS platform`;
    await tx`
      CREATE TABLE IF NOT EXISTS platform.notes_studio_schema_migrations (
        filename TEXT PRIMARY KEY,
        content_sha256 TEXT NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    const ledgerRows = await tx`
      SELECT filename, content_sha256 AS "contentSha256"
      FROM platform.notes_studio_schema_migrations
      ORDER BY applied_at, filename
    `;
    const recorded = new Map(ledgerRows.map((row) => [String(row.filename), String(row.contentSha256)]));
    const manifestNames = new Set(migrations.map((migration) => migration.fileName));

    for (const [fileName, digest] of recorded) {
      if (!manifestNames.has(fileName)) {
        throw new Error(`Unknown Notes Studio migration recorded in production ledger: ${fileName}`);
      }
      const current = migrations.find((migration) => migration.fileName === fileName);
      if (!current || current.digest !== digest) {
        throw new Error(`Notes Studio migration drift detected for ${fileName}`);
      }
    }

    const recordedNames = migrations.filter((migration) => recorded.has(migration.fileName)).map((migration) => migration.fileName);
    const expectedPrefix = migrations.slice(0, recordedNames.length).map((migration) => migration.fileName);
    if (recordedNames.some((fileName, index) => fileName !== expectedPrefix[index])) {
      throw new Error('Notes Studio migration ledger is not a contiguous prefix of the ordered migration manifest.');
    }

    const before = await inspectNotesStudioSchema(tx);

    if (recorded.size === 0 && before.ready) {
      console.log('[notes-studio:migrate] adopting already-complete pre-ledger Notes Studio schema');
      for (const migration of migrations) {
        await tx`
          INSERT INTO platform.notes_studio_schema_migrations (filename, content_sha256)
          VALUES (${migration.fileName}, ${migration.digest})
        `;
      }
      return;
    }

    if (
      recorded.size === 0
      && !before.ready
      && (before.presentRelations.length > 0 || before.presentTriggers.length > 0)
    ) {
      throw new Error(
        `Refusing to auto-migrate an unledgered partial Notes Studio schema. Present relations: ${before.presentRelations.join(', ') || 'none'}; present triggers: ${before.presentTriggers.join(', ') || 'none'}`,
      );
    }

    for (const migration of migrations.slice(recorded.size)) {
      console.log(`[notes-studio:migrate] applying ${migration.fileName}`);
      await tx.unsafe(migration.sqlText);
      await tx`
        INSERT INTO platform.notes_studio_schema_migrations (filename, content_sha256)
        VALUES (${migration.fileName}, ${migration.digest})
      `;
    }
  });

  const inspection = await inspectNotesStudioSchema(sqlClient);
  if (!inspection.ready) {
    throw new Error(`Notes Studio schema is incomplete after migration. Missing relations: ${inspection.missingRelations.join(', ') || 'none'}; missing triggers: ${inspection.missingTriggers.join(', ') || 'none'}`);
  }

  const ledgerRows = await sqlClient`
    SELECT filename, content_sha256 AS "contentSha256"
    FROM platform.notes_studio_schema_migrations
    ORDER BY applied_at, filename
  `;
  if (ledgerRows.length !== migrations.length) {
    throw new Error(`Notes Studio migration ledger is incomplete after bootstrap: ${ledgerRows.length}/${migrations.length}`);
  }
  for (const migration of migrations) {
    const row = ledgerRows.find((candidate) => String(candidate.filename) === migration.fileName);
    if (!row || String(row.contentSha256) !== migration.digest) {
      throw new Error(`Notes Studio migration ledger verification failed for ${migration.fileName}`);
    }
  }

  console.log(`[notes-studio:migrate] ready: ${inspection.presentRelations.length} relations, ${inspection.presentTriggers.length} required triggers, ${ledgerRows.length} ledger entries`);
}

run()
  .catch((error) => {
    console.error('[notes-studio:migrate] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
