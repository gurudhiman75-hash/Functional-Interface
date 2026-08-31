import OpenAI from 'openai';

import {
  NOTES_SOURCE_DISCOVERY_PROMPT_VERSION,
  rankDiscoveredSourceUrls,
  type NotesSourceDiscoveryCandidate,
} from './source-discovery';

export type NotesSourceDiscoveryProviderResult = {
  provider: 'openai';
  model: string;
  responseId: string | null;
  promptVersion: string;
  searchCallCount: number;
  candidates: NotesSourceDiscoveryCandidate[];
  usage: Record<string, unknown>;
};

export class NotesSourceDiscoveryConfigurationError extends Error {}

function configuredModel(): string {
  const model = String(process.env.NOTES_STUDIO_RESEARCH_MODEL ?? process.env.NOTES_STUDIO_MODEL ?? '').trim();
  if (!model) throw new NotesSourceDiscoveryConfigurationError('NOTES_STUDIO_RESEARCH_MODEL or NOTES_STUDIO_MODEL is not configured.');
  return model;
}

function configuredApiKey(): string {
  const apiKey = String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim();
  if (!apiKey) throw new NotesSourceDiscoveryConfigurationError('Notes Studio model API key is not configured.');
  return apiKey;
}

function sourceUrlsFromResponse(response: unknown): { urls: string[]; searchCallCount: number } {
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

export async function discoverNotesSources(queries: string[]): Promise<NotesSourceDiscoveryProviderResult> {
  const model = configuredModel();
  const client = new OpenAI({ apiKey: configuredApiKey() });
  const queryList = queries.map((query, index) => `${index + 1}. ${query}`).join('\n');
  const response = await client.responses.create({
    model,
    tools: [{ type: 'web_search' }],
    include: ['web_search_call.action.sources'],
    input: [
      'Use web search to discover authoritative source pages for an exam-note research pack.',
      'Search only; do not provide factual answers, learner prose, claims, conclusions, or uncited facts.',
      'Prefer primary government/agency sources, then universities or established institutions.',
      'Avoid search-result pages, social posts, forums, shopping pages and low-authority aggregators when stronger sources exist.',
      'The application will use only the URLs returned by the web-search tool; your prose is discarded.',
      '',
      'Research queries:',
      queryList,
    ].join('\n'),
    max_output_tokens: 500,
  });
  const extracted = sourceUrlsFromResponse(response);
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

export const sourceDiscoveryProviderInternals = { sourceUrlsFromResponse };
