import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { randomUUID } from 'node:crypto';

// Exercise the real event handler without requiring a browser or an API server.
const source = readFileSync('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx', 'utf8');
const handler = source.slice(source.indexOf('  const handleGenerate = async () => {'), source.indexOf('  const applyStatus = async'));
function harness(asyncMode = false) {
  const calls = [], receipts = [], errors = [];
  const state = { queued: [], progress: null };
  const noop = () => {};
  const context = {
    bulkBusy: false, generating: false, stagingAsyncSubmitting: false,
    bulkAsyncSubmitting: false, BULK_ASYNC_ENABLED: false, bulkAsyncSelected: false,
    NATIVE_GROUPED_REVIEW_ENABLED: true,
    ASYNC_ENABLED: asyncMode, CHAPTER_ASYNC_ENABLED: asyncMode, stagingAsyncSelected: asyncMode,
    PRODUCTION_CHAPTER_BATCH_LIMIT: 100, SYNC_BULK_LIMIT: 1000, SYNC_CHUNK_TARGET: 10,
    count: 23, languages: ['en', 'hi', 'pa'], selectedCpIds: new Set(['cp1', 'cp2']),
    activePackage: { packageId: 'avg', engineId: 'quant-v4', topic: 'Average', subtopic: 'Average', runtimeMode: 'review-only', supportedLanguages: ['en'] },
    capabilities: { maxBatchSize: 50 }, exam: 'ssc', EXAMS: [], difficulty: 'Medium', difficultyFilterSupported: true, seed: 'test',
    packageSubject: () => 'Quant', packageChapter: () => 'Average',
    stagingAsyncRetry: { current: new Map() }, crypto: { randomUUID },
    urlSearchParams: {}, withStagingResumeRunId: (_params, id) => id,
    setUrlSearchParams: noop, setStagingAsyncRun: noop, setStagingAsyncPollError: noop,
    setStagingAsyncSubmitting: noop, setReviewSubjectFilter: noop, setReviewChapterFilter: noop,
    setReviewPackageFilter: noop, setReviewPageNumber: noop, setWorkspaceView: noop,
    setStatusFilter: noop, setQualityFilter: noop, setSearch: noop, setServerSearch: noop,
    setBulkBusy: noop, setExpandedRuns: noop, ALL: 'all', resumeRunId: null,
    setBulkProgress: (value) => { state.progress = value; },
    setQueuedLanguageRuns: (value) => { state.queued = typeof value === 'function' ? value(state.queued) : value; },
    showToast: { success: noop, info: noop, error: (...args) => errors.push(args) },
    generate: async (input) => { calls.push(input); return { id: `run${calls.length}`, publicCode: `R${calls.length}`, itemCount: input.count }; },
    enqueueQuestionStudioProductionChapterRun: async (input, key) => {
      receipts.push({ input, key });
      return { id: key, publicCode: key, status: 'queued', retryAfterSeconds: 3, dispatchRequested: true };
    },
  };
  const run = runInNewContext(stripTypeScriptTypes(handler + '\nhandleGenerate;'), context);
  return { run, context, calls, receipts, errors, state };
}

test('generates the requested count for every selected language within request limits', async () => {
  const h = harness();
  await h.run();
  assert.equal(h.calls.length, 9);
  for (const language of ['en', 'hi', 'pa']) {
    assert.equal(h.calls.filter((call) => call.language === language).reduce((sum, call) => sum + call.count, 0), 23);
  }
  assert.ok(h.calls.every((call) => call.count <= 10 && call.cpIds.length <= call.count));
  assert.equal(h.state.progress.completed, 69);
  assert.equal(h.state.progress.requested, 69);
  assert.equal(h.errors.length, 0);
});

test('stops after an uncertain synchronous failure without submitting later languages', async () => {
  const h = harness();
  let attempted = 0;
  const generate = h.context.generate;
  h.context.generate = (input) => { if (++attempted === 2) throw new Error('Timeout'); return generate(input); };
  await h.run();
  assert.equal(attempted, 2);
  assert.equal(h.calls.length, 1);
  assert.equal(h.state.progress.completed, 10);
  assert.equal(h.errors[0][0], 'Bulk generation stopped');
});

test('queues one run per language and retains keys across a partial submission failure', async () => {
  const h = harness(true);
  let attempted = 0;
  const enqueue = h.context.enqueueQuestionStudioProductionChapterRun;
  const attempts = [];
  h.context.enqueueQuestionStudioProductionChapterRun = (input, key) => {
    attempts.push({ language: input.language, key });
    if (++attempted === 2) throw new Error('Connection lost');
    return enqueue(input, key);
  };
  await h.run();
  assert.equal(h.state.queued.length, 1);
  assert.equal(h.context.stagingAsyncRetry.current.size, 2);
  await h.run();
  assert.equal(attempts[0].key, attempts[2].key, 'confirmed English run must be reused');
  assert.equal(attempts[1].key, attempts[3].key, 'uncertain Hindi run must reuse its key');
  assert.deepEqual(Array.from(h.state.queued, (run) => run.language), ['en', 'hi', 'pa']);
  assert.equal(h.context.stagingAsyncRetry.current.size, 0);
  assert.ok(h.receipts.every(({ input }) => input.count === 23));
});

test('native AVG questions share one English review source instead of three unrelated language runs', async () => {
  const h=harness();
  h.context.activePackage={...h.context.activePackage,packageId:'AVG-001',supportedLanguages:['en','hi','pa']};
  await h.run();
  assert.equal(h.calls.length,3);
  assert.equal(h.calls.reduce((total,call)=>total+call.count,0),23);
  assert.ok(h.calls.every(call=>call.language==='en'));
  assert.equal(h.state.progress.requested,23);
  assert.equal(h.errors.length,0);
});

test('native Interest grouping supports Hindi plus Punjabi with implicit English authority', async () => {
  const h=harness(true);
  h.context.activePackage={...h.context.activePackage,packageId:'INT-001',supportedLanguages:['en','hi','pa']};
  h.context.languages=['hi','pa'];
  await h.run();
  assert.equal(h.receipts.length,1);
  assert.equal(h.receipts[0].input.language,'en');
  assert.equal(h.state.queued.length,1);
  assert.equal(h.state.queued[0].language,'en');
});

test('single-language Hindi remains independently generated to preserve language-only workflows', async () => {
  const h=harness();
  h.context.activePackage={...h.context.activePackage,packageId:'AVG-001',supportedLanguages:['en','hi','pa']};
  h.context.languages=['hi'];
  await h.run();
  assert.equal(h.calls.length,3);
  assert.ok(h.calls.every(call=>call.language==='hi'));
});

test('native grouping cannot turn on without explicit production feature flag', async () => {
  const h=harness();
  h.context.NATIVE_GROUPED_REVIEW_ENABLED=false;
  h.context.activePackage={...h.context.activePackage,packageId:'AVG-001',supportedLanguages:['en','hi','pa']};
  await h.run();
  assert.equal(h.calls.length,9);
  assert.deepEqual([...new Set(h.calls.map(call=>call.language))],['en','hi','pa']);
});

test('any other registered trilingual chapter uses one canonical source', async () => {
  const h=harness();
  h.context.activePackage={...h.context.activePackage,packageId:'MAL-001',supportedLanguages:['en','hi','pa']};
  await h.run();
  assert.equal(h.calls.reduce((n,call)=>n+call.count,0),23);
  assert.ok(h.calls.every(call=>call.language==='en'));
});
test('chapters without English localization retain independent language generation', async () => {
  const h=harness();
  h.context.activePackage={...h.context.activePackage,packageId:'PNJ-001',supportedLanguages:['hi','pa']};
  h.context.languages=['hi','pa'];
  await h.run();
  assert.equal(h.calls.reduce((n,call)=>n+call.count,0),46);
  assert.deepEqual([...new Set(h.calls.map(call=>call.language))],['hi','pa']);
});
