import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';

import {
  classifyGeminiSearchFailure,
  diagnoseGeminiSearchCapability,
  geminiSearchDiagnosticInternals,
} from './gemini-search-diagnostics';

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

const ENV_KEYS = [
  'NOTES_STUDIO_SEARCH_MODEL',
  'GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_BASE_URL',
] as const;

function envHarness(t: TestContext) {
  const originalEnv = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  t.after(() => {
    for (const key of ENV_KEYS) restoreEnv(key, originalEnv.get(key));
    globalThis.fetch = originalFetch;
  });
}

test('diagnostic classifies billing, tier, retired-model, auth and transient failures without exposing provider bodies', () => {
  assert.equal(classifyGeminiSearchFailure(403, 'Please enable billing for Google Search grounding.', 'gemini-3.6-flash').code, 'billing_required');
  assert.equal(classifyGeminiSearchFailure(403, 'Google Search grounding is unavailable on the free tier.', 'gemini-3.6-flash').code, 'tier_unsupported');
  assert.equal(classifyGeminiSearchFailure(404, 'models/gemini-2.5-flash is no longer available to new users.', 'gemini-2.5-flash').code, 'model_unavailable');
  assert.equal(classifyGeminiSearchFailure(401, 'API key not valid.', 'gemini-3.6-flash').code, 'auth_failed');
  assert.equal(classifyGeminiSearchFailure(429, 'Quota exceeded.', 'gemini-3.6-flash').code, 'rate_limited');
  assert.equal(classifyGeminiSearchFailure(503, 'High demand.', 'gemini-3.6-flash').code, 'temporary_failure');
});

test('Gemini Search diagnostic uses one non-stored Interactions probe and reports a real search call', async (t) => {
  envHarness(t);
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.GEMINI_BASE_URL = 'https://generativelanguage.test/v1beta';
  delete process.env.GOOGLE_AI_API_KEY;
  delete process.env.NOTES_STUDIO_SEARCH_MODEL;

  let requestUrl = '';
  let requestBody: Record<string, unknown> | null = null;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    requestBody = typeof init?.body === 'string' ? JSON.parse(init.body) as Record<string, unknown> : null;
    return new Response(JSON.stringify({
      id: 'diagnostic-interaction',
      model: 'models/gemini-3.6-flash',
      steps: [
        { type: 'google_search_call', arguments: { queries: ['official Government of India homepage'] } },
        {
          type: 'model_output',
          content: [{
            type: 'text',
            text: 'Discard me.',
            annotations: [{ type: 'url_citation', url: 'https://www.india.gov.in/' }],
          }],
        },
      ],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;

  const diagnostic = await diagnoseGeminiSearchCapability();
  assert.equal(diagnostic.available, true);
  assert.equal(diagnostic.code, 'available');
  assert.equal(diagnostic.label, 'Google Search available');
  assert.equal(diagnostic.model, 'gemini-3.6-flash');
  assert.equal(diagnostic.searchCallObserved, true);
  assert.equal(requestUrl, 'https://generativelanguage.test/v1beta/interactions');
  assert.equal(requestBody?.model, 'gemini-3.6-flash');
  assert.equal(requestBody?.store, false);
  assert.deepEqual(requestBody?.tools, [{ type: 'google_search' }]);
  assert.match(String(requestBody?.input ?? ''), /capability diagnostic/i);
  assert.doesNotMatch(JSON.stringify(diagnostic), /india\.gov\.in|Discard me/);
});

test('successful Interactions response without a Google Search call is reported as inconclusive', async (t) => {
  envHarness(t);
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.GEMINI_BASE_URL = 'https://generativelanguage.test/v1beta';

  globalThis.fetch = (async () => new Response(JSON.stringify({
    id: 'diagnostic-no-search',
    model: 'gemini-3.6-flash',
    steps: [{ type: 'model_output', content: [{ type: 'text', text: 'No tool use.' }] }],
  }), { status: 200 })) as typeof fetch;

  const diagnostic = await diagnoseGeminiSearchCapability();
  assert.equal(diagnostic.available, false);
  assert.equal(diagnostic.code, 'inconclusive');
  assert.equal(diagnostic.searchCallObserved, false);
  assert.equal(geminiSearchDiagnosticInternals.searchCallObserved({ steps: [{ type: 'google_search_call' }] }), true);
});

test('missing Gemini credential is diagnosed without making a network call', async (t) => {
  envHarness(t);
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_AI_API_KEY;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    throw new Error('should not be called');
  }) as typeof fetch;

  const diagnostic = await diagnoseGeminiSearchCapability();
  assert.equal(diagnostic.code, 'credential_missing');
  assert.equal(diagnostic.available, false);
  assert.equal(called, false);
});
