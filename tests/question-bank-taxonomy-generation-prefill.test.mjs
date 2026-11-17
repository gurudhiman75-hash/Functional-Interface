import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const detail = readFileSync('artifacts/admin-app/src/pages/content/QuestionDetailPage.tsx', 'utf8');
const workspace = readFileSync('artifacts/admin-app/src/pages/content/QuestionBankWorkspacePage.tsx', 'utf8');
const taxonomy = readFileSync('artifacts/api-server/src/routes/admin-question-taxonomy-hardening.ts', 'utf8');
const legacy = readFileSync('artifacts/api-server/src/routes/admin-questions.ts', 'utf8');
const bulk = readFileSync('artifacts/api-server/src/routes/admin-question-bulk-workflow.ts', 'utf8');
const studioSync = readFileSync('artifacts/api-server/src/routes/admin-question-taxonomy-studio-sync.ts', 'utf8');
const routesIndex = readFileSync('artifacts/api-server/src/routes/index.ts', 'utf8');

test('all active shared subjects, sections and topics are selectable independent of exam', () => {
  assert.match(detail, /taxonomyOptions\?\.nodes \?\? \[\]/);
  assert.match(workspace, /taxonomyOptions\?\.nodes \?\? \[\]/);
  assert.match(detail, /node\.nodeType === 'section'/);
  assert.match(workspace, /node\.nodeType === 'section'/);
  assert.match(detail, /All sections/);
  assert.match(workspace, /All sections/);
  for (const route of [taxonomy, legacy, bulk]) {
    assert.doesNotMatch(route, /etn\.exam_version_id = \$\{(?:input\.examVersionId|examVersionId \|\| null)\}::uuid/);
    assert.match(route, /n\.is_active = true/);
    assert.match(route, /n\.deleted_at IS NULL/);
  }
});

test('generation prefill requires unique, explicit catalog match and remains editable', () => {
  assert.match(detail, /generationValue\(version, 'subtopic'\)/);
  assert.match(detail, /generationValue\(version, 'topic'\)/);
  assert.match(detail, /matching\.length !== 1/);
  assert.match(detail, /possibleSubjects\.length !== 1/);
  assert.match(detail, /setTaxonomy\(prefillGenerationTaxonomy/);
  assert.match(detail, /Review the selection and save/);
  assert.match(detail, /\.\.\.\(taxonomy\.sectionId \? \[taxonomy\.sectionId\] : \[\]\)/);
});

test('Studio taxonomy synchronization is explicit, privileged, audited and idempotent', () => {
  assert.match(studioSync, /requireAdminPermission\("content.taxonomy.manage"\)/);
  assert.match(studioSync, /req\.body\?\.confirm !== true/);
  assert.match(studioSync, /listQuestionStudioPackages\(\)\.filter/);
  assert.match(studioSync, /pg_advisory_xact_lock/);
  assert.match(studioSync, /ON CONFLICT DO NOTHING/);
  assert.match(studioSync, /INSERT INTO platform\.audit_events/);
  assert.match(routesIndex, /adminQuestionTaxonomyStudioSyncRouter/);
  assert.match(detail, /Sync Studio topics/);
  assert.match(workspace, /Sync Studio topics/);
});
