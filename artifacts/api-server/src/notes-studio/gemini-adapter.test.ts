import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGeminiGenerationConfig,
  buildGeminiJsonInstruction,
  geminiFallbackModel,
  geminiProvider,
  geminiRetryDelayMs,
  isTransientGeminiStatus,
} from '../lib/ai-providers/gemini-adapter';

const claimSchema = {
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

test('Gemini transient policy retries capacity failures but not bad requests', () => {
  for (const status of [408, 429, 500, 502, 503, 504]) {
    assert.equal(isTransientGeminiStatus(status), true, String(status));
  }
  for (const status of [400, 401, 403, 404, 422]) {
    assert.equal(isTransientGeminiStatus(status), false, String(status));
  }
  assert.deepEqual([0, 1, 2, 3].map(geminiRetryDelayMs), [500, 1000, 2000, 4000]);
});

test('Gemini structured requests keep schema out of the HTTP generation config', () => {
  const gemini3Config = buildGeminiGenerationConfig({
    model: 'gemini-3.6-flash',
    responseSchema: claimSchema,
  });
  assert.deepEqual(gemini3Config, {});

  const gemini25Config = buildGeminiGenerationConfig({
    model: 'gemini-2.5-flash',
    responseSchema: claimSchema,
  });
  assert.deepEqual(gemini25Config, { temperature: 0 });

  const instruction = buildGeminiJsonInstruction(claimSchema);
  assert.ok(instruction);
  assert.match(instruction!, /Return ONLY one valid JSON value/);
  assert.match(instruction!, /"minLength":5/);
  assert.match(instruction!, /"maxLength":1200/);
});

test('Gemini 3.6 primary request succeeds without any structured-output transport fields', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const originalFetch = globalThis.fetch;
  process.env.GEMINI_API_KEY = 'test-key';

  let capturedBody: any = null;
  (globalThis as { fetch: typeof fetch }).fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body ? JSON.parse(String(init.body)) : null;
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: '{"claims":[]}' }] } }],
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 3, totalTokenCount: 13 },
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const response = await geminiProvider.extract({
      model: 'gemini-3.6-flash',
      prompt: { system: 'system', user: 'user' },
      responseSchema: claimSchema,
      maxRetries: 0,
      timeoutMs: 5_000,
    });

    assert.equal(response.model, 'gemini-3.6-flash');
    assert.deepEqual(response.json, { claims: [] });
    assert.equal(capturedBody?.generationConfig, undefined);
    const promptText = capturedBody?.contents?.[0]?.parts?.[0]?.text ?? '';
    assert.match(promptText, /Return ONLY one valid JSON value/);
    assert.match(promptText, /"minLength":5/);
    assert.doesNotMatch(JSON.stringify(capturedBody), /responseJsonSchema|responseSchema|responseFormat|responseMimeType/);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test('Gemini 3.6 does not implicitly fall back to a retired 2.5 model', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFallback = process.env.GEMINI_FALLBACK_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  delete process.env.GEMINI_FALLBACK_MODEL;

  const urls: string[] = [];
  (globalThis as { fetch: typeof fetch }).fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    urls.push(url);
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
  }) as typeof fetch;

  try {
    assert.equal(geminiFallbackModel('gemini-3.6-flash'), null);
    assert.equal(geminiFallbackModel('gemini-3.7-flash'), 'gemini-3.6-flash');

    await assert.rejects(
      () => geminiProvider.extract({
        model: 'gemini-3.6-flash',
        prompt: { system: 'system', user: 'user' },
        responseSchema: claimSchema,
        maxRetries: 0,
        timeoutMs: 5_000,
      }),
      /status 503 on gemini-3\.6-flash/i,
    );
    assert.equal(urls.length, 1);
    assert.equal(urls.some((url) => url.includes('gemini-2.5-flash')), false);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
    if (previousFallback === undefined) delete process.env.GEMINI_FALLBACK_MODEL;
    else process.env.GEMINI_FALLBACK_MODEL = previousFallback;
  }
});

test('Gemini uses an explicitly configured fallback without inventing one', () => {
  const previousFallback = process.env.GEMINI_FALLBACK_MODEL;
  try {
    process.env.GEMINI_FALLBACK_MODEL = 'gemini-operator-selected-model';
    assert.equal(geminiFallbackModel('gemini-3.6-flash'), 'gemini-operator-selected-model');
  } finally {
    if (previousFallback === undefined) delete process.env.GEMINI_FALLBACK_MODEL;
    else process.env.GEMINI_FALLBACK_MODEL = previousFallback;
  }
});
