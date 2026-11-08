import test from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import {serializeUniversalWorkerResponse} from '../artifacts/api-server/universal-worker-json.mjs';

// Replay the exact PUBLIC, non-secret compute fields of the expired MAL-001
// chapter run. This is an OFFLINE test: no GCP, Neon, Cloud Tasks or publication.
// It runs the same isolated bundled worker as production.
const replay = {
  request: {
    engineId: 'quant-v4',
    packageId: 'MAL-001',
    exam: 'SSC CGL Tier 1',
    difficulty: 'Medium',
    language: 'en',
    runtimeMode: 'QUESTION_STUDIO_ACTIVE',
    count: 20,
    seed: 'qs-async:59c9b7b2-3350-4712-a943-4d0b24210eb9',
  },
  count: 20,
  selectedCpIds: [],
};

test('MAL-001 20Q production worker replay completes for the saved seed', {timeout: 180_000}, async () => {
  const worker = new Worker(new URL('../artifacts/api-server/dist/question-studio-universal-worker.mjs', import.meta.url), {
    workerData: replay, resourceLimits: {maxOldGenerationSizeMb:1536},
  });
  const timer = setTimeout(() => {void worker.terminate();}, 145_000);
  try {
    const result = await new Promise((resolve, reject) => {
      worker.once('message', msg => {
        if (!msg?.ok) {
          reject(new Error(`REPLAY_FAILURE code=${String(msg?.error?.code ?? 'unknown')} reason=${String(msg?.error?.message ?? 'none').slice(0,220)}`));
        } else resolve(msg.batch);
      });
      worker.once('error', reject);
      worker.once('exit', code => {if(code !== 0) reject(new Error(`REPLAY_WORKER_EXIT_${code}`));});
    });
    assert.equal(result.packageId, 'MAL-001');
    assert.equal(result.engineId, 'quant-v4');
    assert.equal(result.questions.length, 20);
    // HTTP response path uses JSON.stringify, unlike the structured-clone
    // worker message. Catch numbers unsupported by plain JSON here.
    // Plain JSON.stringify reproduces the original production HTTP 500.
    assert.throws(() => JSON.stringify({ok:true,batch:result}),/BigInt/);
    const body = serializeUniversalWorkerResponse({ok:true,batch:result});
    const decoded = JSON.parse(body);
    assert.equal(decoded.ok,true);
    assert.equal(decoded.batch.questions.length,20);
    assert.equal(decoded.batch.packageId,'MAL-001');
    assert.equal(result.quantPlan?.assignments?.reduce((n, a) => n + a.count, 0),20);
  } finally {
    clearTimeout(timer);
    await worker.terminate();
  }
});
