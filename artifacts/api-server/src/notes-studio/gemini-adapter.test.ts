import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGeminiGenerationConfig,
  geminiFallbackModel,
  geminiProvider,
  geminiRetryDelayMs,
  isTransientGeminiStatus,
  sanitizeGeminiJsonSchema,
} from '../lib/ai-providers/gemini-adapter';

test('Gemini transient policy retries capacity failures but not bad requests', () => {
  for (const status of [408, 429, 500, 502, 503, 504]) {
    assert.equal(isTransientGeminiStatus(status), true, String(status));
  }
  for (const status of [400, 401, 403, 404, 422]) {
    assert.equal(isTransientGeminiStatus(status), false, String(status));
  }
  assert.deepEqual([0, 1, 2, 3].map(geminiRetryDelayMs), [500, 1000, 2000, 4000]);
});

test('Gemini 3 uses current responseFormat and strips unsupported JSON Schema constraints', () => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['claims'],
    properties: {
      claims: {
        type: 'array',
        minItems: 0,
        maxItems: 60,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['text'],
          properties: {
            text: {
              type: ['string', 'null'],
              minLength: 5,
              maxLength: 1200,
            },
          },
        },
      },
    },
  } as Record<string, unknown>;

  const sanitized = sanitizeGeminiJsonSchema(schema) as any;
  assert.equal(sanitized.properties.claims.items.properties.text.minLength, undefined);
  assert.equal(sanitized.properties.claims.items.properties.text.maxLength, undefined);
  assert.deepEqual(sanitized.properties.claims.items.properties.text.type, ['string', 'null']);
  assert.equal(sanitized.properties.claims.maxItems, 60);
  assert.equal(sanitized.additionalProperties, false);

  for (const model of ['gemini-3.7-flash', 'gemini-3.6-flash']) {
    const config = buildGeminiGenerationConfig({
      model,
      responseSchema: schema,
    }) as any;
    assert.equal(config.responseFormat?.text?.mimeType, 'application/json', model);
    assert.deepEqual(config.responseFormat?.text?.schema, sanitized, model);
    assert.equal(config.responseJsonSchema, undefined, model);
    assert.equal(config.responseMimeType, undefined, model);
  }
});

test('Gemini 3.7 Flash falls back to stable 3.6 Flash after transient exhaustion', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFallback = process.env.GEMINI_FALLBACK_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  delete process.env.GEMINI_FALLBACK_MODEL;

  const urls: string[] = [];
  const bodies: unknown[] = [];
  (globalThis as { fetch: typeof fetch }).fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    urls.push(url);
    bodies.push(init?.body ? JSON.parse(String(init.body)) : null);
    if (url.includes('/gemini-3.7-flash:generateContent')) {
      return new Response(JSON.stringify({
        error: {
          code: 503,
          message: 'This model is currently experiencing high demand.',
          status: 'UNAVAILABLE',
        },
      }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (url.includes('/gemini-3.6-flash:generateContent')) {
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '{"claims":[]}' }] } }],
        usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 3, totalTokenCount: 13 },
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    throw new Error(`Unexpected Gemini URL: ${url}`);
  }) as typeof fetch;

  try {
    assert.equal(geminiFallbackModel('gemini-3.7-flash'), 'gemini-3.6-flash');
    const response = await geminiProvider.extract({
      model: 'gemini-3.7-flash',
      prompt: { system: 'system', user: 'user' },
      responseSchema: {
        type: 'object',
        properties: {
          claims: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string', minLength: 5, maxLength: 1200 },
              },
            },
          },
        },
      },
      maxRetries: 0,
      timeoutMs: 5_000,
    });
    assert.equal(response.model, 'gemini-3.6-flash');
    assert.deepEqual(response.json, { claims: [] });
    assert.equal(response.warnings.length, 1);
    assert.match(response.warnings[0] ?? '', /temporarily unavailable/i);
    assert.equal(urls.length, 2);

    for (const body of bodies as any[]) {
      const schema = body?.generationConfig?.responseFormat?.text?.schema;
      assert.ok(schema);
      assert.equal(body?.generationConfig?.responseJsonSchema, undefined);
      assert.equal(schema?.properties?.claims?.items?.properties?.text?.minLength, undefined);
      assert.equal(schema?.properties?.claims?.items?.properties?.text?.maxLength, undefined);
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousFallback === undefined) delete process.env.GEMINI_FALLBACK_MODEL;
    else process.env.GEMINI_FALLBACK_MODEL = previousFallback;
  }
});
