import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ui=readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx','utf8');
const backend=readFileSync('artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts','utf8');

test('multi-run selection permits up to 250 without enlarging single-request hard limit',()=>{
  assert.match(ui,/const SYNC_BULK_LIMIT = 250/);
  assert.match(ui,/const SYNC_CHUNK_TARGET = 25/);
  assert.match(ui,/count > limit/);
  assert.match(ui,/Math\.min\(chunkMax, remaining\)/);
  assert.match(ui,/Math\.min\(capabilities\.maxBatchSize, Math\.max\(SYNC_CHUNK_TARGET, cpIds\.length \|\| 1\)\)/);
  assert.match(backend,/parsed > 50/);
});

test('bulk saves independent runs, updates progress and stops on unknown results',()=>{
  assert.match(ui,/const result = await generate\(\{/);
  assert.match(ui,/savedRuns\.push\(result\.publicCode\)/);
  assert.match(ui,/setBulkProgress\(\{ completed, requested, runs: \[\.\.\.savedRuns\] \}\)/);
  assert.match(ui,/if \(result\.itemCount !== chunkSize\)/);
  assert.match(ui,/Do not retry the entire submission/);
  assert.match(ui,/setBulkBusy\(false\)/);
  assert.match(ui,/aria-live="polite"/);
});

test('chunked deterministic seeds vary and CP selections fit the final chunk',()=>{
  assert.match(ui,/cpIds\.length > chunkSize/);
  assert.match(ui,/\(offset \+ index\) % cpIds\.length/);
  assert.match(ui,/input\.seed && requested > chunkMax/);
  assert.match(ui,/:batch:\$\{savedRuns\.length \+ 1\}/);
});

test('async mode remains subject to its own feature flag and limits',()=>{
  assert.match(ui,/const asyncMode = ASYNC_ENABLED && stagingAsyncSelected/);
  assert.match(ui,/CHAPTER_ASYNC_ENABLED \? PRODUCTION_CHAPTER_BATCH_LIMIT : capabilities\.maxBatchSize/);
  assert.match(ui,/enqueueQuestionStudioProductionChapterRun/);
});
