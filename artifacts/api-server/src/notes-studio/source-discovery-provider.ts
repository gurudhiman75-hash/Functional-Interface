import OpenAI from 'openai';

import {
  NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
  rankDiscoveredSourceUrls,
  type NotesSourceDiscoveryCandidate,
} from './source-discovery';
import {
  notesStudioAIConfigured,
  resolveNotesStudioAIProvider,
  resolveNotesStudioModel,
} from './shared-ai-provider';

export type NotesSourceDiscoveryProviderResult = {
  provider: 'openai' | 'gemini';
  model: string;
  responseId: string | null;
  promptVersion: string;
  searchCallCount: number;
  candidates: NotesSourceDiscoveryCandidate[];
  usage: Record<string, unknown>;
};

export class NotesSourceDiscoveryConfigurationError extends Error {}

const DEFAULT_GEMINI_SEARCH_MODEL = 'gemini-2.5-flash';

function discoveryInstruction(queries: string[]): string {
  const queryList = queries.map((query, index) => `${index + 1}. ${query}`).join('\n');
  return [
    'Use web search to discover authoritative source pages for an exam-note research pack.',
    'Search only; do not provide factual answers, learner prose, claims, conclusions, or uncited facts.',
    'Prefer primary government/agency sources, then universities or established institutions.',
    'Avoid search-result pages, social posts, forums, shopping pages and low-authority aggregators when stronger sources exist.',
    'The application will use only URLs returned by the search grounding/tool metadata; your prose is discarded.',
    '',
    'Research queries:',
    queryList,
  ].join('\n');
}

function sourceUrlsFromOpenAIResponse(response: unknown): { urls: string[]; searchCallCount: number } {
  if (!response || typeof response !== 'object') return { urls: [], searchCallCount: 0 };
  const output = (response as Record<string, unknown>).output;
  if (!Array.isArray(output)) return { urls: [], searchCallCount: 0 };
  const urls: string[] = [];
  let searchCallCount = 0;
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    if (record.type !== 'web_search_call') continue;
    searchCallCount += 1;
    const action = record.action;
    if (!action || typeof action !== 'object') continue;
    const sources = (action as Record<string, unknown>).sources;
    if (!Array.isArray(sources)) continue;
    for (const source of sources) {
      if (!source || typeof source !== 'object') continue;
      const url = (source as Record<string, unknown>).url;
      if (typeof url === 'string') urls.push(url);
    }
  }
  return { urls, searchCallCount };
}

function sourceUrlsFromGeminiResponse(response: unknown): { urls: string[]; searchCallCount: number } {
  if (!response || typeof response !== 'object') return { urls: [], searchCallCount: 0 };
  const candidates = (response as Record<string, unknown>).candidates;
  if (!Array.isArray(candidates)) return { urls: [], searchCallCount: 0 };
  const urls: string[] = [];
  let searchCallCount = 0;
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const metadata = (candidate as Record<string, unknown>).groundingMetadata;
    if (!metadata || typeof metadata !== 'object') continue;
    const meta = metadata as Record<string, unknown>;
    const queries = meta.webSearchQueries;
    if (Array.isArray(queries)) searchCallCount += queries.filter((query) => typeof query === 'string' && query.trim()).length;
    const chunks = meta.groundingChunks;
    if (!Array.isArray(chunks)) continue;
    for (const chunk of chunks) {
      if (!chunk || typeof chunk !== 'object') continue;
      const web = (chunk as Record<string, unknown>).web;
      if (!web || typeof web !== 'object') continue;
      const uri = (web as Record<string, unknown>).uri;
      if (typeof uri === 'string') urls.push(uri);
    }
  }
  if (searchCallCount === 0 && urls.length > 0) searchCallCount = 1;
  return { urls, searchCallCount };
}

async function resolveGroundingRedirect(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'vertexaisearch.cloud.google.com') return url;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Examtree-Notes-Studio-Source-Discovery/1.0' },
      });
      const resolved = response.url || url;
      await response.body?.cancel().catch(() => undefined);
      return resolved;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return url;
  }
}

async function discoverWithOpenAI(queries: string[], model: string): Promise<NotesSourceDiscoveryProviderResult> {
  const apiKey = String(process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesSourceDiscoveryConfigurationError('OPENAI_API_KEY is not configured for Notes Studio web discovery.');
  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model,
    tools: [{ type: 'web_search' }],
    include: ['web_search_call.action.sources'],
    input: discoveryInstruction(queries),
    max_output_tokens: 500,
  });
  const extracted = sourceUrlsFromOpenAIResponse(response);
  const raw = response as unknown as Record<string, unknown>;
  return {
    provider: 'openai',
    model,
    responseId: typeof raw.id === 'string' ? raw.id : null,
    promptVersion: NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
    searchCallCount: extracted.searchCallCount,
    candidates: rankDiscoveredSourceUrls(extracted.urls),
    usage: raw.usage && typeof raw.usage === 'object' ? raw.usage as Record<string, unknown> : {},
  };
}

function geminiSearchModels(): string[] {
  const configuredPrimary = String(process.env.NOTES_STUDIO_SEARCH_MODEL ?? '').trim();
  const primary = configuredPrimary || DEFAULT_GEMINI_SEARCH_MODEL;
  const configuredFallback = String(process.env.GEMINI_SEARCH_FALLBACK_MODEL ?? '').trim();
  const fallback = configuredFallback || (primary !== DEFAULT_GEMINI_SEARCH_MODEL ? DEFAULT_GEMINI_SEARCH_MODEL : '');
  return [...new Set([primary, fallback].filter(Boolean))];
}

function shouldFallbackGeminiSearch(status: number): boolean {
  return [400, 403, 404, 408, 429, 500, 502, 503, 504].includes(status);
}

async function discoverWithGemini(queries: string[], requestedModel?: string): Promise<NotesSourceDiscoveryProviderResult> {
  const apiKey = String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesSourceDiscoveryConfigurationError('GEMINI_API_KEY is not configured for Notes Studio web discovery.');
  const baseUrl = String(process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
  const models = requestedModel ? [...new Set([requestedModel, ...geminiSearchModels()])] : geminiSearchModels();
  let lastFailure = '';

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    const response = await fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: discoveryInstruction(queries) }] }],
        tools: [{ google_search: {} }],
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      lastFailure = `Gemini search grounding failed on ${model} with status ${response.status}: ${body}`;
      const hasFallback = index < models.length - 1;
      if (hasFallback && shouldFallbackGeminiSearch(response.status)) continue;
      throw new Error(lastFailure);
    }

    const raw = await response.json() as Record<string, unknown>;
    const extracted = sourceUrlsFromGeminiResponse(raw);
    const resolvedUrls = await Promise.all(extracted.urls.map(resolveGroundingRedirect));
    const usage = raw.usageMetadata && typeof raw.usageMetadata === 'object'
      ? raw.usageMetadata as Record<string, unknown>
      : {};
    return {
      provider: 'gemini',
      model,
      responseId: typeof raw.responseId === 'string' ? raw.responseId : null,
      promptVersion: NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
      searchCallCount: extracted.searchCallCount,
      candidates: rankDiscoveredSourceUrls(resolvedUrls),
      usage,
    };
  }

  throw new Error(lastFailure || 'Gemini search grounding failed before a model could be attempted.');
}

export async function discoverNotesSources(queries: string[]): Promise<NotesSourceDiscoveryProviderResult> {
  const provider = resolveNotesStudioAIProvider();
  if (provider !== 'openai' && provider !== 'gemini') {
    throw new NotesSourceDiscoveryConfigurationError(
      `Notes Studio web discovery requires a search-capable provider; resolved provider ${provider} is not supported for governed web discovery.`,
    );
  }
  if (!notesStudioAIConfigured(provider)) {
    throw new NotesSourceDiscoveryConfigurationError(`Notes Studio AI provider ${provider} is not configured.`);
  }
  if (provider === 'gemini') return discoverWithGemini(queries);
  const model = resolveNotesStudioModel(provider, ['NOTES_STUDIO_RESEARCH_MODEL', 'NOTES_STUDIO_MODEL']);
  return discoverWithOpenAI(queries, model);
}

export const sourceDiscoveryProviderInternals = {
  sourceUrlsFromResponse: sourceUrlsFromOpenAIResponse,
  sourceUrlsFromOpenAIResponse,
  sourceUrlsFromGeminiResponse,
  geminiSearchModels,
  shouldFallbackGeminiSearch,
};
