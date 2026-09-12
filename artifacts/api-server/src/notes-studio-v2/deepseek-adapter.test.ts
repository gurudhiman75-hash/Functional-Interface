import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildDeepSeekJsonInstruction,
  deepSeekProvider,
  deepSeekRetryDelayMs,
  isTransientDeepSeekStatus,
  normalizeDeepSeekStructuredJson,
} from '../lib/ai-providers/deepseek-adapter';

const claimSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['claims'],
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string' },
        },
      },
    },
  },
} as Record<string, unknown>;

const notesV2SchemaName = 'notes_studio_v2_extracted_facts';

function fact(label: string) {
  return {
    subCategory: 'Sources',
    claim: `Claim ${label}`,
    entities: [`Entity ${label}`],
    dateOrEra: null,
    locator: `page ${label}`,
    extractedText: `Verification ${label}`,
  };
}

test('DeepSeek transient policy retries provider capacity failures', () => {
  for (const status of [408, 409, 429, 500, 502, 503, 504]) {
    assert.equal(isTransientDeepSeekStatus(status), true, String(status));
  }
  for (const status of [400, 401, 403, 404, 422]) {
    assert.equal(isTransientDeepSeekStatus(status), false, String(status));
  }
  assert.deepEqual([0, 1, 2, 3].map(deepSeekRetryDelayMs), [1000, 2000, 4000, 8000]);
});

test('DeepSeek structured extraction requests JSON and embeds the schema', () => {
  const instruction = buildDeepSeekJsonInstruction(claimSchema);
  assert.ok(instruction);
  assert.match(instruction!, /Return ONLY one valid JSON value/);
  assert.match(instruction!, /"claims"/);
});

test('DeepSeek Notes v2 normalization preserves the canonical facts wrapper', () => {
  const canonical = { facts: [fact('canonical')] };
  const normalized = normalizeDeepSeekStructuredJson(canonical, notesV2SchemaName);
  assert.equal(normalized.json, canonical);
  assert.deepEqual(normalized.warnings, []);
});

test('DeepSeek Notes v2 normalization wraps an array root as facts', () => {
  const source = [fact('root')];
  const normalized = normalizeDeepSeekStructuredJson(source, notesV2SchemaName);
  assert.deepEqual(normalized.json, { facts: source });
  assert.equal(normalized.warnings.length, 1);
});

test('DeepSeek Notes v2 normalization unwraps a deeply nested fact array', () => {
  const source = { data: { result: { payload: { atomicFacts: [fact('nested')] } } } };
  const normalized = normalizeDeepSeekStructuredJson(source, notesV2SchemaName);
  assert.deepEqual(normalized.json, { facts: [fact('nested')] });
  assert.equal(normalized.warnings.length, 1);
});

test('DeepSeek Notes v2 normalization merges multiple grouped fact arrays', () => {
  const source = {
    groups: [
      { label: 'A', output: [fact('a1'), fact('a2')] },
      { label: 'B', payload: { items: [fact('b1')] } },
    ],
    references: ['ignored'],
    metadata: { counts: [2, 1] },
  };
  const normalized = normalizeDeepSeekStructuredJson(source, notesV2SchemaName);
  assert.deepEqual(normalized.json, { facts: [fact('a1'), fact('a2'), fact('b1')] });
  assert.equal(normalized.warnings.length, 1);
  assert.match(normalized.warnings[0], /grouped Notes v2 facts across 2 nested arrays/);
});

test('DeepSeek Notes v2 normalization ignores unrelated arrays while selecting fact arrays', () => {
  const source = {
    summary: ['one', 'two'],
    metadata: { pageNumbers: [289, 300] },
    result: { rows: [fact('only')] },
  };
  const normalized = normalizeDeepSeekStructuredJson(source, notesV2SchemaName);
  assert.deepEqual(normalized.json, { facts: [fact('only')] });
  assert.equal(normalized.warnings.length, 1);
});

test('DeepSeek Notes v2 normalization does not invent a facts array from unrelated JSON', () => {
  const unrelated = { summary: 'x', metadata: { count: 1, pages: [289, 300] } };
  const normalized = normalizeDeepSeekStructuredJson(unrelated, notesV2SchemaName);
  assert.equal(normalized.json, unrelated);
  assert.deepEqual(normalized.warnings, []);
});

test('DeepSeek adapter sends Notes v2 extraction through the OpenAI-compatible chat API', async () => {
  const previousKey = process.env.DEEPSEEK_API_KEY;
  const previousBaseUrl = process.env.DEEPSEEK_BASE_URL;
  const originalFetch = globalThis.fetch;
  process.env.DEEPSEEK_API_KEY = 'test-key';
  process.env.DEEPSEEK_BASE_URL = 'https://api.deepseek.com/';

  let capturedUrl = '';
  let capturedBody: any = null;
  let capturedAuthorization = '';
  (globalThis as { fetch: typeof fetch }).fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedBody = init?.body ? JSON.parse(String(init.body)) : null;
    capturedAuthorization = String((init?.headers as Record<string, string> | undefined)?.Authorization ?? '');
    return new Response(JSON.stringify({
      choices: [{ message: { content: '{"facts":[]}' } }],
      usage: { prompt_tokens: 11, completion_tokens: 4, total_tokens: 15 },
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const response = await deepSeekProvider.extract({
      model: 'deepseek-v4-flash',
      prompt: { system: 'system', user: 'user' },
      input: 'source text',
      responseSchema: claimSchema,
      responseSchemaName: notesV2SchemaName,
      maxRetries: 0,
      timeoutMs: 5_000,
    });

    assert.equal(capturedUrl, 'https://api.deepseek.com/chat/completions');
    assert.equal(capturedAuthorization, 'Bearer test-key');
    assert.equal(capturedBody?.model, 'deepseek-v4-flash');
    assert.deepEqual(capturedBody?.thinking, { type: 'disabled' });
    assert.deepEqual(capturedBody?.response_format, { type: 'json_object' });
    assert.equal(capturedBody?.temperature, 0);
    assert.ok(Number(capturedBody?.max_tokens) >= 1024);
    assert.match(String(capturedBody?.messages?.[0]?.content ?? ''), /JSON Schema/);
    assert.match(String(capturedBody?.messages?.[0]?.content ?? ''), /top-level JSON value MUST be an object with a property named facts/);
    assert.match(String(capturedBody?.messages?.[0]?.content ?? ''), /one flat array/);
    assert.equal(response.provider, 'deepseek');
    assert.deepEqual(response.json, { facts: [] });
    assert.deepEqual(response.usage, { inputTokens: 11, outputTokens: 4, totalTokens: 15 });
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = previousKey;
    if (previousBaseUrl === undefined) delete process.env.DEEPSEEK_BASE_URL;
    else process.env.DEEPSEEK_BASE_URL = previousBaseUrl;
  }
});
