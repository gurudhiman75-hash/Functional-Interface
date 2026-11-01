import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page=readFileSync('artifacts/admin-app/src/pages/tests/TestBuilderRecoveryPage.tsx','utf8');
const backend=readFileSync('artifacts/api-server/src/lib/admin-test-management.ts','utf8');
const routes=readFileSync('artifacts/api-server/src/routes/admin-tests.ts','utf8');

test('server drafts require identity and valid config, but may have zero selected questions',()=>{
  assert.match(page,/export function testBuilderServerSaveBlocker\(/);
  assert.match(page,/Select an exam version before saving to the server/);
  assert.match(page,/Total marks must equal the selected questions/);
  assert.doesNotMatch(page,/Add at least one published question to every section before saving to the server/);
  assert.match(page,/const blocker = testBuilderServerSaveBlocker\(draft\)/);
  assert.match(page,/role="status"/);
  assert.match(backend,/numberInRange\(input\.totalMarks, "Total marks", 0, 100000\)/);
});

test('review and publication remain blocked while test structure is incomplete',()=>{
  assert.match(backend,/STRUCTURE_NO_QUESTIONS/);
  assert.match(backend,/STRUCTURE_EMPTY_SECTION/);
  assert.match(backend,/STRUCTURE_TOTAL_MARKS_REQUIRED/);
  assert.match(routes,/\["submit-qa", "approve", "schedule", "publish"\]/);
  assert.match(routes,/loadStoredValidation\(testId, input\.expectedCurrentDraftVersionId/);
  assert.match(routes,/blockingIssues = issues\.filter\(\(issue\) => !issue\.code\.startsWith\("STRUCTURE_"\)\)/);
  assert.match(routes,/QUESTION_NOT_PUBLISHED/);
  assert.match(routes,/QUESTION_EXAM_MISMATCH/);
});

test('local recovery and autosave survive invalid checkpoints',()=>{
  assert.match(page,/const canServerAutosave = Boolean\(detail && dirty && !saving && !serverSaveBlocker && !conflict\)/);
  assert.match(page,/localStorage\.setItem\(storageKey, JSON\.stringify\(checkpoint\)\)/);
  assert.match(page,/localStorage\.removeItem\(storageKey\)/);
});

test('picker offers exam inventory, topic and difficulty, and existing sections',()=>{
  assert.match(page,/getLiveTests\(\)/);
  assert.match(page,/setSectionTemplates\(/);
  assert.match(page,/Use existing section/);
  assert.match(page,/Create new section/);
  assert.match(page,/inventoryByExam/);
  assert.match(page,/availableDifficulties/);
  assert.match(page,/setTopicFilter/);
  assert.match(page,/eligibleQuestions/);
  assert.match(page,/No published questions for this exam version yet/);
});
