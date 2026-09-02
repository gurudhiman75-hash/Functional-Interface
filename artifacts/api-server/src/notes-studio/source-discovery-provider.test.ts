import assert from 'node:assert/strict';
import test from 'node:test';

import {
  discoverNotesSources,
  sourceDiscoveryProviderInternals,
} from './source-discovery-provider';

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

function successfulGeminiGroundingResponse(): Response {
  return new Response(JSON.stringify({
    responseId: 'mock-search-response',
    candidates: [
      {
        groundingMetadata: {
          webSearchQueries: ['Punjab River System official government source'],
          groundingChunks: [
            { web: { uri: 'https://cwc.gov.in/en/ibo/about-basins' } },
          ],
        },
      },
    ],
    usageMetadata: { promptTokenCount: 12 },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('Gemini web discovery uses the dedicated 2.5 grounding model and falls back to it from an unsupported configured model', async (t) => {
  const envKeys = [
    'NOTES_STUDIO_AI_PROVIDER',
    'NOTES_STUDIO_SEARCH_MODEL',
    'GEMINI_SEARCH_FALLBACK_MODEL',
    'GEMINI_API_KEY',
    'GOOGLE_AI_API_KEY',
    'GEMINI_BASE_URL',
  ] as const;
  const originalEnv = new Map(envKeys.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;

  t.after(() => {
    for (const key of envKeys) restoreEnv(key, originalEnv.get(key));
    globalThis.fetch = originalFetch;
  });

  process.env.NOTES_STUDIO_AI_PROVIDER = 'gemini';
  process.env.GEMINI_API_KEY = 'test-key';
  delete process.env.GOOGLE_AI_API_KEY;
  process.env.GEMINI_BASE_URL = 'https://generativelanguage.test/v1beta';
  delete process.env.NOTES_STUDIO_SEARCH_MODEL;
  delete process.env.GEMINI_SEARCH_FALLBACK_MODEL;

  assert.deepEqual(sourceDiscoveryProviderInternals.geminiSearchModels(), ['gemini-2.5-flash']);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(400), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(429), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(503), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(401), false);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(422), false);

  const requests: Array<{ url: string; body: Record<string, unknown> | null }> = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
    const body = typeof init?.body === 'string'
      ? JSON.parse(init.body) as Record<string, unknown>
      : null;
    requests.push({ url, body });
    return successfulGeminiGroundingResponse();
  }) as typeof fetch;

  const direct = await discoverNotesSources(['Punjab River System official government source']);
  assert.equal(direct.provider, 'gemini');
  assert.equal(direct.model, 'gemini-2.5-flash');
  assert.equal(direct.searchCallCount, 1);
  assert.equal(direct.candidates[0]?.url, 'https://cwc.gov.in/en/ibo/about-basins');
  assert.equal(requests.length, 1);
  assert.match(requests[0]!.url, /\/models\/gemini-2\.5-flash:generateContent$/);
  assert.deepEqual(requests[0]!.body?.tools, [{ google_search: {} }]);

  process.env.NOTES_STUDIO_SEARCH_MODEL = 'gemini-3.6-flash';
  delete process.env.GEMINI_SEARCH_FALLBACK_MODEL;
  assert.deepEqual(sourceDiscoveryProviderInternals.geminiSearchModels(), [
    'gemini-3.6-flash',
    'gemini-2.5-flash',
  ]);

  requests.length = 0;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
    const body = typeof init?.body === 'string'
      ? JSON.parse(init.body) as Record<string, unknown>
      : null;
    requests.push({ url, body });
    if (url.includes('/models/gemini-3.6-flash:generateContent')) {
      return new Response('Google Search grounding is unavailable for this model/tier.', { status: 400 });
    }
    return successfulGeminiGroundingResponse();
  }) as typeof fetch;

  const fallback = await discoverNotesSources(['Punjab River System official government source']);
  assert.equal(fallback.provider, 'gemini');
  assert.equal(fallback.model, 'gemini-2.5-flash');
  assert.equal(fallback.searchCallCount, 1);
  assert.deepEqual(requests.map((request) => request.url), [
    'https://generativelanguage.test/v1beta/models/gemini-3.6-flash:generateContent',
    'https://generativelanguage.test/v1beta/models/gemini-2.5-flash:generateContent',
  ]);
  assert.deepEqual(requests[1]!.body?.tools, [{ google_search: {} }]);
});
