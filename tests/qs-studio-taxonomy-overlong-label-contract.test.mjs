import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../artifacts/api-server/src/routes/admin-question-taxonomy-studio-sync.ts', import.meta.url), 'utf8');

test('Studio taxonomy labels fit catalog varchar(180) using Unicode-safe shortening', () => {
  assert.match(source, /const MAX_TAXONOMY_NAME = 180;/);
  assert.match(source, /Array\.from\(name\)\.slice\(0, MAX_TAXONOMY_NAME - Array\.from\(suffix\)\.length\)/);
  assert.match(source, /const displayName = catalogName\(name\);/);
  assert.match(source, /name: displayName, nodeType: type/);
});

test('preserves complete long Studio source in taxonomy description', () => {
  assert.match(source, /const fullDescription = displayName === name\.trim\(\) \? null : name\.trim\(\);/);
  assert.match(source, /INSERT INTO catalog\.taxonomy_nodes \(id, code, node_type, name, description, is_active\)/);
});

test('sync remains RBAC protected and confirmed, transactionally', () => {
  assert.match(source, /requireAdminPermission\("content\.taxonomy\.manage"\)/);
  assert.match(source, /req\.body\?\.confirm !== true/);
  assert.match(source, /sqlClient\.begin\(async \(tx\)/);
});
