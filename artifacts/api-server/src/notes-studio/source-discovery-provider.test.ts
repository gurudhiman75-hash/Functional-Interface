import assert from 'node:assert/strict';
import test from 'node:test';

import {
  NotesSourceDiscoveryConfigurationError,
  discoverNotesSources,
  sourceDiscoveryProviderInternals,
} from './source-discovery-provider';

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

const ENV_KEYS = [
  'NOTES_STUDIO_AI_PROVIDER',
  'NOTES_STUDIO_SEARCH_PROVIDER',
  'NOTES_STUDIO_SEARCH_MODEL',
  'GEMINI_SEARCH_FALLBACK_MODEL',
  'GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_BASE_URL',
  'TAVILY_API_KEY',
  'TAVILY_BASE_URL',
  'OPENAI_API_KEY',
] as const;

function envHarness(t: test.TestContext) {
  const originalEnv = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  t.after(() => {
    for (const key of ENV_KEYS) restoreEnv(key, originalEnv.get(key));
    globalThis.fetch = originalFetch;
  });
}

test('Tavily is an independent governed URL-discovery transport and discards answer/raw-content fields', async (t) => {
  envHarness(t);
  process.env.NOTES_STUDIO_AI_PROVIDER = 'gemini';
  process.env.NOTES_STUDIO_SEARCH_PROVIDER = 'tavily';
  process.env.TAVILY_API_KEY = 'tvly-test-key';
  process.env.TAVILY_BASE_URL = 'https://tavily.test';

  const requests: Array<{ url: string; headers: Headers; body: Record<string, unknown> }> = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
    const headers = new Headers(init?.headers);
    const body = typeof init?.body === 'string'
      ? JSON.parse(init.body) as Record<string, unknown>
      : {};
    requests.push({ url, headers, body });
    return new Response(JSON.stringify({
      request_id: 'tavily-request-1',
      answer: 'This generated answer must never enter Notes Studio.',
      results: [
        {
          title: 'Example prose that is intentionally ignored',
          url: 'https://example.com/reference?utm_source=tavily',
          content: 'Search-result snippet that is intentionally ignored.',
          raw_content: 'Raw content that must never be requested or retained.',
          score: 0.99,
        },
        {
          title: 'Government source',
          url: 'https://cwc.gov.in/en/ibo/about-basins',
          content: 'Ignored.',
          score: 0.80,
        },
      ],
      usage: { credits: 1 },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  const discovered = await discoverNotesSources(['Punjab River System official government source']);
  assert.equal(discovered.provider, 'tavily');
  assert.equal(discovered.model, 'tavily-search-basic');
  assert.equal(discovered.responseId, 'tavily-request-1');
  assert.equal(discovered.searchCallCount, 1);
  assert.equal(discovered.candidates.length, 2);
  assert.equal(discovered.candidates[0]?.sourceUri, 'https://cwc.gov.in/en/ibo/about-basins');
  assert.equal(discovered.candidates[0]?.authorityClass, 'government_primary');
  assert.equal(discovered.candidates[1]?.sourceUri, 'https://example.com/reference');
  assert.deepEqual(discovered.usage, {
    credits: 1,
    requestIds: ['tavily-request-1'],
    queryCount: 1,
    answerReturned: false,
    rawContentReturned: false,
  });

  assert.equal(requests.length, 1);
  assert.equal(requests[0]!.url, 'https://tavily.test/search');
  assert.equal(requests[0]!.headers.get('Authorization'), 'Bearer tvly-test-key');
  assert.equal(requests[0]!.body.search_depth, 'basic');
  assert.equal(requests[0]!.body.max_results, 5);
  assert.equal(requests[0]!.body.include_answer, false);
  assert.equal(requests[0]!.body.include_raw_content, false);
  assert.equal(requests[0]!.body.include_images, false);
});

test('Gemini Web Discovery uses the current Interactions API and Gemini 3.6 by default', async (t) => {
  envHarness(t);
  process.env.NOTES_STUDIO_AI_PROVIDER = 'gemini';
  process.env.NOTES_STUDIO_SEARCH_PROVIDER = 'gemini';
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.GEMINI_BASE_URL = 'https://generativelanguage.test/v1beta';
  delete process.env.NOTES_STUDIO_SEARCH_MODEL;
  delete process.env.GEMINI_SEARCH_FALLBACK_MODEL;

  assert.deepEqual(sourceDiscoveryProviderInternals.geminiSearchModels(), ['gemini-3.6-flash']);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(408), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(429), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(503), true);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(400), false);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(403), false);
  assert.equal(sourceDiscoveryProviderInternals.shouldFallbackGeminiSearch(404), false);

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
    return new Response(JSON.stringify({
      id: 'interaction-1',
      model: 'gemini-3.6-flash',
      status: 'completed',
      steps: [
        {
          type: 'google_search_call',
          arguments: { queries: ['Punjab River System official government source'] },
        },
        {
          type: 'model_output',
          content: [
            {
              type: 'text',
              text: 'Discarded synthesized prose.',
              annotations: [
                {
                  type: 'url_citation',
                  url: 'https://punjab.gov.in/know-punjab/',
                  title: 'Punjab Government',
                  start_index: 0,
                  end_index: 10,
                },
                {
                  type: 'url_citation',
                  url: 'https://cwc.gov.in/en/ibo/about-basins',
                  title: 'Central Water Commission',
                  start_index: 11,
                  end_index: 20,
                },
              ],
            },
          ],
        },
      ],
      usage: { total_input_tokens: 12, total_tool_use_tokens: 4 },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  const discovered = await discoverNotesSources(['Punjab River System official government source']);
  assert.equal(discovered.provider, 'gemini');
  assert.equal(discovered.model, 'gemini-3.6-flash');
  assert.equal(discovered.responseId, 'interaction-1');
  assert.equal(discovered.searchCallCount, 1);
  assert.deepEqual(discovered.candidates.map((candidate) => candidate.sourceUri), [
    'https://cwc.gov.in/en/ibo/about-basins',
    'https://punjab.gov.in/know-punjab/',
  ]);

  assert.equal(requests.length, 1);
  assert.equal(requests[0]!.url, 'https://generativelanguage.test/v1beta/interactions');
  assert.equal(requests[0]!.body?.model, 'gemini-3.6-flash');
  assert.deepEqual(requests[0]!.body?.tools, [{ type: 'google_search' }]);
  assert.equal(typeof requests[0]!.body?.input, 'string');
});

test('Gemini retired-model errors are surfaced as configuration failures instead of retrying 2.5', async (t) => {
  envHarness(t);
  process.env.NOTES_STUDIO_SEARCH_PROVIDER = 'gemini';
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.GEMINI_BASE_URL = 'https://generativelanguage.test/v1beta';
  process.env.NOTES_STUDIO_SEARCH_MODEL = 'gemini-2.5-flash';
  delete process.env.GEMINI_SEARCH_FALLBACK_MODEL;

  globalThis.fetch = (async () => new Response(JSON.stringify({
    error: {
      code: 404,
      message: 'This model models/gemini-2.5-flash is no longer available to new users.',
      status: 'NOT_FOUND',
    },
  }), { status: 404 })) as typeof fetch;

  await assert.rejects(
    () => discoverNotesSources(['Punjab River System official government source']),
    (error: unknown) => error instanceof NotesSourceDiscoveryConfigurationError
      && /unavailable for this API project/i.test(error.message),
  );
});

test('search-provider auto mode prefers Tavily without changing the general Notes Studio AI provider', (t) => {
  envHarness(t);
  process.env.NOTES_STUDIO_AI_PROVIDER = 'gemini';
  process.env.GEMINI_API_KEY = 'gemini-key';
  process.env.TAVILY_API_KEY = 'tavily-key';
  delete process.env.NOTES_STUDIO_SEARCH_PROVIDER;

  assert.equal(sourceDiscoveryProviderInternals.resolveNotesSourceDiscoveryProvider(), 'tavily');
});
