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

async function discoverWithGemini(queries: string[], model: string): Promise<NotesSourceDiscoveryProviderResult> {
  const apiKey = String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesSourceDiscoveryConfigurationError('GEMINI_API_KEY is not configured for Notes Studio web discovery.');
  const baseUrl = String(process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
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
    throw new Error(`Gemini search grounding failed with status ${response.status}: ${await response.text()}`);
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
  const model = resolveNotesStudioModel(provider, ['NOTES_STUDIO_RESEARCH_MODEL', 'NOTES_STUDIO_MODEL']);
  return provider === 'gemini'
    ? discoverWithGemini(queries, model)
    : discoverWithOpenAI(queries, model);
}

export const sourceDiscoveryProviderInternals = {
  sourceUrlsFromResponse: sourceUrlsFromOpenAIResponse,
  sourceUrlsFromOpenAIResponse,
  sourceUrlsFromGeminiResponse,
};
