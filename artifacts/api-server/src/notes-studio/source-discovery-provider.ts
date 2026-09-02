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

export type NotesSourceDiscoveryProviderName = 'openai' | 'gemini' | 'tavily';

export type NotesSourceDiscoveryProviderResult = {
  provider: NotesSourceDiscoveryProviderName;
  model: string;
  responseId: string | null;
  promptVersion: string;
  searchCallCount: number;
  candidates: NotesSourceDiscoveryCandidate[];
  usage: Record<string, unknown>;
};

export class NotesSourceDiscoveryConfigurationError extends Error {}

const DEFAULT_GEMINI_SEARCH_MODEL = 'gemini-3.6-flash';
const DEFAULT_TAVILY_SEARCH_MODEL = 'tavily-search-basic';

function discoveryInstruction(queries: string[]): string {
  const queryList = queries.map((query, index) => `${index + 1}. ${query}`).join('\n');
  return [
    'Use web search to discover authoritative source pages for an exam-note research pack.',
    'Search only; do not provide factual answers, learner prose, claims, conclusions, or uncited facts.',
    'Prefer primary government/agency sources, then universities or established institutions.',
    'Avoid search-result pages, social posts, forums, shopping pages and low-authority aggregators when stronger sources exist.',
    'The application will use only URLs returned by the search tool metadata; any generated prose is discarded.',
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

function sourceUrlsFromGeminiInteraction(response: unknown): { urls: string[]; searchCallCount: number } {
  if (!response || typeof response !== 'object') return { urls: [], searchCallCount: 0 };
  const steps = (response as Record<string, unknown>).steps;
  if (!Array.isArray(steps)) return { urls: [], searchCallCount: 0 };
  const urls: string[] = [];
  let searchCallCount = 0;

  for (const step of steps) {
    if (!step || typeof step !== 'object') continue;
    const record = step as Record<string, unknown>;
    if (record.type === 'google_search_call') {
      const args = record.arguments;
      const queries = args && typeof args === 'object' ? (args as Record<string, unknown>).queries : null;
      const count = Array.isArray(queries)
        ? queries.filter((query) => typeof query === 'string' && query.trim()).length
        : 0;
      searchCallCount += Math.max(1, count);
      continue;
    }
    if (record.type !== 'model_output') continue;
    const content = record.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (!block || typeof block !== 'object') continue;
      const annotations = (block as Record<string, unknown>).annotations;
      if (!Array.isArray(annotations)) continue;
      for (const annotation of annotations) {
        if (!annotation || typeof annotation !== 'object') continue;
        const item = annotation as Record<string, unknown>;
        if (item.type !== 'url_citation') continue;
        if (typeof item.url === 'string') urls.push(item.url);
      }
    }
  }

  if (searchCallCount === 0 && urls.length > 0) searchCallCount = 1;
  return { urls, searchCallCount };
}

function sourceUrlsFromTavilyResponse(response: unknown): string[] {
  if (!response || typeof response !== 'object') return [];
  const results = (response as Record<string, unknown>).results;
  if (!Array.isArray(results)) return [];
  const urls: string[] = [];
  for (const result of results) {
    if (!result || typeof result !== 'object') continue;
    const url = (result as Record<string, unknown>).url;
    if (typeof url === 'string') urls.push(url);
  }
  return urls;
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

async function discoverWithTavily(queries: string[]): Promise<NotesSourceDiscoveryProviderResult> {
  const apiKey = String(process.env.TAVILY_API_KEY ?? '').trim();
  if (!apiKey) {
    throw new NotesSourceDiscoveryConfigurationError(
      'TAVILY_API_KEY is not configured for Notes Studio web discovery. Add a Tavily API key in Render or choose another NOTES_STUDIO_SEARCH_PROVIDER.',
    );
  }
  const baseUrl = String(process.env.TAVILY_BASE_URL ?? 'https://api.tavily.com').replace(/\/$/, '');
  const urls: string[] = [];
  const requestIds: string[] = [];
  let credits = 0;

  for (const query of queries) {
    const response = await fetch(`${baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        topic: 'general',
        search_depth: 'basic',
        max_results: 5,
        auto_parameters: false,
        include_answer: false,
        include_raw_content: false,
        include_images: false,
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Tavily source discovery failed with status ${response.status}: ${body}`);
    }
    const raw = await response.json() as Record<string, unknown>;
    urls.push(...sourceUrlsFromTavilyResponse(raw));
    if (typeof raw.request_id === 'string') requestIds.push(raw.request_id);
    const usage = raw.usage;
    if (usage && typeof usage === 'object') {
      const value = Number((usage as Record<string, unknown>).credits ?? 0);
      if (Number.isFinite(value) && value > 0) credits += value;
    }
  }

  return {
    provider: 'tavily',
    model: DEFAULT_TAVILY_SEARCH_MODEL,
    responseId: requestIds[0] ?? null,
    promptVersion: NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
    searchCallCount: queries.length,
    candidates: rankDiscoveredSourceUrls(urls),
    usage: {
      credits,
      requestIds,
      queryCount: queries.length,
      answerReturned: false,
      rawContentReturned: false,
    },
  };
}

function geminiSearchModels(): string[] {
  const configuredPrimary = String(process.env.NOTES_STUDIO_SEARCH_MODEL ?? '').trim();
  const primary = configuredPrimary || DEFAULT_GEMINI_SEARCH_MODEL;
  const configuredFallback = String(process.env.GEMINI_SEARCH_FALLBACK_MODEL ?? '').trim();
  return [...new Set([primary, configuredFallback].filter(Boolean))];
}

function shouldFallbackGeminiSearch(status: number): boolean {
  return [408, 429, 500, 502, 503, 504].includes(status);
}

function geminiSearchConfigurationError(status: number, body: string, model: string): NotesSourceDiscoveryConfigurationError | null {
  const normalized = body.toLowerCase();
  if (status === 404 && (normalized.includes('no longer available') || normalized.includes('not_found'))) {
    return new NotesSourceDiscoveryConfigurationError(
      `Gemini search model ${model} is unavailable for this API project. Use the current Interactions-capable Gemini 3.x model or configure Tavily for Notes Studio web discovery.`,
    );
  }
  if ((status === 400 || status === 403) && (normalized.includes('ground') || normalized.includes('search') || normalized.includes('billing') || normalized.includes('free tier'))) {
    return new NotesSourceDiscoveryConfigurationError(
      `Gemini Google Search grounding is unavailable for this API project/tier on ${model}. Production Gemini 3.x search grounding may require billing; configure Tavily for free Notes Studio URL discovery or enable the required Gemini billing tier.`,
    );
  }
  return null;
}

async function discoverWithGemini(queries: string[], requestedModel?: string): Promise<NotesSourceDiscoveryProviderResult> {
  const apiKey = String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesSourceDiscoveryConfigurationError('GEMINI_API_KEY is not configured for Notes Studio web discovery.');
  const baseUrl = String(process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
  const models = requestedModel ? [...new Set([requestedModel, ...geminiSearchModels()])] : geminiSearchModels();
  let lastFailure = '';

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index];
    const response = await fetch(`${baseUrl}/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model,
        input: discoveryInstruction(queries),
        tools: [{ type: 'google_search' }],
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      const configurationError = geminiSearchConfigurationError(response.status, body, model);
      if (configurationError) throw configurationError;
      lastFailure = `Gemini Interactions search grounding failed on ${model} with status ${response.status}: ${body}`;
      const hasFallback = index < models.length - 1;
      if (hasFallback && shouldFallbackGeminiSearch(response.status)) continue;
      throw new Error(lastFailure);
    }

    const raw = await response.json() as Record<string, unknown>;
    const extracted = sourceUrlsFromGeminiInteraction(raw);
    const usage = raw.usage && typeof raw.usage === 'object'
      ? raw.usage as Record<string, unknown>
      : {};
    const responseModel = typeof raw.model === 'string' ? raw.model.replace(/^models\//, '') : model;
    return {
      provider: 'gemini',
      model: responseModel,
      responseId: typeof raw.id === 'string' ? raw.id : null,
      promptVersion: NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
      searchCallCount: extracted.searchCallCount,
      candidates: rankDiscoveredSourceUrls(extracted.urls),
      usage,
    };
  }

  throw new Error(lastFailure || 'Gemini Interactions search grounding failed before a model could be attempted.');
}

function resolveNotesSourceDiscoveryProvider(): NotesSourceDiscoveryProviderName {
  const explicit = String(process.env.NOTES_STUDIO_SEARCH_PROVIDER ?? '').trim().toLowerCase();
  if (explicit && explicit !== 'auto') {
    if (explicit === 'tavily' || explicit === 'openai' || explicit === 'gemini') return explicit;
    throw new NotesSourceDiscoveryConfigurationError(
      `Unsupported NOTES_STUDIO_SEARCH_PROVIDER=${explicit}. Expected tavily, openai, gemini or auto.`,
    );
  }

  if (String(process.env.TAVILY_API_KEY ?? '').trim()) return 'tavily';
  const notesProvider = resolveNotesStudioAIProvider();
  if ((notesProvider === 'openai' || notesProvider === 'gemini') && notesStudioAIConfigured(notesProvider)) return notesProvider;
  if (String(process.env.OPENAI_API_KEY ?? '').trim()) return 'openai';
  if (String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim()) return 'gemini';
  throw new NotesSourceDiscoveryConfigurationError(
    'No search-capable provider is configured for Notes Studio web discovery. Configure Tavily, OpenAI web search, or Gemini Google Search grounding.',
  );
}

export async function discoverNotesSources(queries: string[]): Promise<NotesSourceDiscoveryProviderResult> {
  const provider = resolveNotesSourceDiscoveryProvider();
  if (provider === 'tavily') return discoverWithTavily(queries);
  if (provider === 'gemini') return discoverWithGemini(queries);
  if (!notesStudioAIConfigured('openai')) {
    throw new NotesSourceDiscoveryConfigurationError('OPENAI_API_KEY is not configured for Notes Studio web discovery.');
  }
  const model = resolveNotesStudioModel('openai', ['NOTES_STUDIO_RESEARCH_MODEL', 'NOTES_STUDIO_MODEL']);
  return discoverWithOpenAI(queries, model);
}

export const sourceDiscoveryProviderInternals = {
  sourceUrlsFromResponse: sourceUrlsFromOpenAIResponse,
  sourceUrlsFromOpenAIResponse,
  sourceUrlsFromGeminiInteraction,
  sourceUrlsFromTavilyResponse,
  geminiSearchModels,
  shouldFallbackGeminiSearch,
  resolveNotesSourceDiscoveryProvider,
};
