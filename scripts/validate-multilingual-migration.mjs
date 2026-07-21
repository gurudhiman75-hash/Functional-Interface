import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationPath = path.join(
  root,
  'docs/database-migrations/2026-07-21-multilingual-translation-operations.sql',
);
const sql = readFileSync(migrationPath, 'utf8');

assert.ok(sql.trim().length > 0, 'Migration must not be empty.');
assert.ok(!/\bDO\s+\$\$/i.test(sql), 'Neon parser-safe migration must not contain DO $$ blocks.');
assert.ok(!/unterminated dollar/i.test(sql), 'Migration must not contain parser-error remnants.');

for (const table of [
  'content.question_translation_options',
  'content.translation_terms',
  'assessment.test_version_translations',
  'assessment.test_section_translations',
]) {
  assert.match(
    sql,
    new RegExp(`CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${table.replace('.', '\\.')}`, 'i'),
    `${table} must be created idempotently.`,
  );
}

for (const constraint of [
  'languages_direction_check',
  'languages_fallback_language_id_fkey',
  'question_translations_translator_user_id_fkey',
  'question_translations_status_check',
]) {
  assert.match(
    sql,
    new RegExp(`DROP\\s+CONSTRAINT\\s+IF\\s+EXISTS\\s+${constraint}`, 'i'),
    `${constraint} must be safely replaceable.`,
  );
  assert.match(
    sql,
    new RegExp(`VALIDATE\\s+CONSTRAINT\\s+${constraint}`, 'i'),
    `${constraint} must be validated after creation.`,
  );
}

for (const column of ['direction', 'updated_at', 'quality_snapshot', 'created_at']) {
  assert.match(sql, new RegExp(`ALTER\\s+COLUMN\\s+${column}`, 'i'), `${column} lifecycle is missing.`);
}

for (const permission of [
  'content.translations.read',
  'content.translations.update',
  'content.translations.review',
  'settings.languages.manage',
]) {
  assert.ok(sql.includes(`'${permission}'`), `${permission} must be seeded.`);
}

const createIndexCount = (sql.match(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS/gi) ?? []).length;
assert.equal(createIndexCount, 7, 'Expected seven idempotent multilingual indexes.');

assert.match(sql, /ON\s+CONFLICT\s*\(key\)\s+DO\s+UPDATE/i, 'Permission seed must be repeatable.');
assert.match(sql, /ON\s+CONFLICT\s+DO\s+NOTHING/i, 'Role grants must be repeatable.');

console.log('Multilingual migration contract: PASS');
