import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { sqlClient } from './src/lib/db';
import {
  NOTES_STUDIO_MIGRATIONS,
  inspectNotesStudioSchema,
} from './src/notes-studio/production-readiness';

async function run() {
  const migrationsDir = path.resolve(process.cwd(), 'migrations');
  console.log(`[notes-studio:migrate] applying ${NOTES_STUDIO_MIGRATIONS.length} ordered migrations`);

  await sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext('examtree:notes-studio:v1'))`;
    for (const fileName of NOTES_STUDIO_MIGRATIONS) {
      const filePath = path.join(migrationsDir, fileName);
      const sqlText = await readFile(filePath, 'utf8');
      if (!sqlText.trim()) throw new Error(`Notes Studio migration is empty: ${fileName}`);
      console.log(`[notes-studio:migrate] ${fileName}`);
      await tx.unsafe(sqlText);
    }
  });

  const inspection = await inspectNotesStudioSchema(sqlClient);
  if (!inspection.ready) {
    throw new Error(`Notes Studio schema is incomplete after migration. Missing relations: ${inspection.missingRelations.join(', ') || 'none'}; missing triggers: ${inspection.missingTriggers.join(', ') || 'none'}`);
  }
  console.log(`[notes-studio:migrate] ready: ${inspection.presentRelations.length} relations, ${inspection.presentTriggers.length} required triggers`);
}

run()
  .catch((error) => {
    console.error('[notes-studio:migrate] failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
