import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page=readFileSync('artifacts/admin-app/src/pages/tests/TestBuilderRecoveryPage.tsx','utf8');
const backend=readFileSync('artifacts/api-server/src/lib/admin-test-management.ts','utf8');

test('frontend refuses incomplete server drafts before network request',()=>{
  assert.match(page,/export function testBuilderServerSaveBlocker\(/);
  assert.match(page,/Add at least one published question to every section before saving to the server/);
  assert.match(page,/Total marks must equal the selected questions/);
  assert.match(page,/const blocker = testBuilderServerSaveBlocker\(draft\)/);
  assert.match(page,/if \(blocker\) \{[\s\S]*?return;[\s\S]*?\}\s*setSaveGuidance\(null\);\s*setSaving\(true\)/);
  assert.match(page,/role="status"/);
});

test('autosave respects same guard and local checkpoints continue',()=>{
  assert.match(page,/const canServerAutosave = Boolean\(detail && dirty && !saving && !serverSaveBlocker && !conflict\)/);
  assert.match(page,/localStorage\.setItem\(storageKey, JSON\.stringify\(checkpoint\)\)/);
  assert.match(page,/Your incomplete draft is still saved locally/);
});

test('backend positive total mark requirement remains unchanged',()=>{
  assert.match(backend,/numberInRange\(input\.totalMarks, "Total marks", 0\.01, 100000\)/);
  assert.match(page,/if \(!Number\.isFinite\(total\) \|\| total < 0\.01/);
});
