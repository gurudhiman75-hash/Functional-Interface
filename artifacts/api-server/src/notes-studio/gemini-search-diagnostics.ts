export type GeminiSearchDiagnosticCode =
  | 'available'
  | 'credential_missing'
  | 'billing_required'
  | 'tier_unsupported'
  | 'model_unavailable'
  | 'auth_failed'
  | 'rate_limited'
  | 'temporary_failure'
  | 'request_invalid'
  | 'inconclusive'
  | 'unknown_failure';

export type GeminiSearchDiagnostic = {
  available: boolean;
  code: GeminiSearchDiagnosticCode;
  label: string;
  model: string;
  httpStatus: number | null;
  searchCallObserved: boolean;
  checkedAt: string;
  message: string;
};

const DEFAULT_GEMINI_SEARCH_MODEL = 'gemini-3.6-flash';

function result(input: Omit<GeminiSearchDiagnostic, 'checkedAt'>): GeminiSearchDiagnostic {
  return { ...input, checkedAt: new Date().toISOString() };
}

function normalizedBody(body: string): string {
  return body.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function classifyGeminiSearchFailure(status: number, body: string, model: string): GeminiSearchDiagnostic {
  const normalized = normalizedBody(body);
  const base = {
    available: false,
    model,
    httpStatus: status,
    searchCallObserved: false,
  } as const;

  if (status === 401 || normalized.includes('api key not valid') || normalized.includes('invalid api key')) {
    return result({
      ...base,
      code: 'auth_failed',
      label: 'Authentication failed',
      message: 'The Gemini API credential was rejected. Check the API key configured on the API service.',
    });
  }

  if (
    normalized.includes('billing')
    || normalized.includes('paid tier')
    || normalized.includes('payment required')
    || normalized.includes('enable billing')
  ) {
    return result({
      ...base,
      code: 'billing_required',
      label: 'Billing required',
      message: 'Gemini Google Search is reachable, but this API project must enable the required paid/billing tier before Search grounding can run.',
    });
  }

  if (
    status === 404
    || normalized.includes('no longer available')
    || normalized.includes('model not found')
    || normalized.includes('not_found')
  ) {
    return result({
      ...base,
      code: 'model_unavailable',
      label: 'Model unavailable',
      message: `The configured Gemini Search model (${model}) is unavailable for this API project.`,
    });
  }

  if (
    normalized.includes('free tier')
    || normalized.includes('not supported for this model')
    || normalized.includes('not supported on this model')
    || normalized.includes('grounding is unavailable')
    || normalized.includes('google search is unavailable')
  ) {
    return result({
      ...base,
      code: 'tier_unsupported',
      label: 'Model/tier unsupported',
      message: `Google Search grounding is not available for ${model} on the current Gemini API project/tier.`,
    });
  }

  if (status === 429) {
    return result({
      ...base,
      code: 'rate_limited',
      label: 'Quota/rate limited',
      message: 'Gemini Search is temporarily blocked by the API project quota or rate limit. Retry after the quota window resets.',
    });
  }

  if ([408, 500, 502, 503, 504].includes(status)) {
    return result({
      ...base,
      code: 'temporary_failure',
      label: 'Temporary API failure',
      message: `Gemini Search returned a temporary ${status} service/capacity failure.`,
    });
  }

  if (status === 400 || status === 422) {
    return result({
      ...base,
      code: 'request_invalid',
      label: 'Search request rejected',
      message: `Gemini rejected the Search diagnostic request on ${model}. The API contract or model/tool configuration needs review.`,
    });
  }

  return result({
    ...base,
    code: 'unknown_failure',
    label: 'Unknown Gemini Search failure',
    message: `Gemini Search failed with HTTP ${status}.`,
  });
}

function searchCallObserved(response: unknown): boolean {
  if (!response || typeof response !== 'object') return false;
  const steps = (response as Record<string, unknown>).steps;
  if (!Array.isArray(steps)) return false;
  return steps.some((step) => Boolean(
    step
      && typeof step === 'object'
      && (step as Record<string, unknown>).type === 'google_search_call',
  ));
}

export async function diagnoseGeminiSearchCapability(): Promise<GeminiSearchDiagnostic> {
  const model = String(process.env.NOTES_STUDIO_SEARCH_MODEL ?? '').trim() || DEFAULT_GEMINI_SEARCH_MODEL;
  const apiKey = String(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? '').trim();
  if (!apiKey) {
    return result({
      available: false,
      code: 'credential_missing',
      label: 'Gemini credential missing',
      model,
      httpStatus: null,
      searchCallObserved: false,
      message: 'No GEMINI_API_KEY or GOOGLE_AI_API_KEY is configured on the API service.',
    });
  }

  const baseUrl = String(process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
  try {
    const response = await fetch(`${baseUrl}/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model,
        store: false,
        input: [
          'This is a capability diagnostic only.',
          'Use Google Search exactly once to find the official Government of India homepage.',
          'Do not provide research, analysis, or a learner-facing answer.',
        ].join(' '),
        tools: [{ type: 'google_search' }],
      }),
    });

    if (!response.ok) {
      return classifyGeminiSearchFailure(response.status, await response.text(), model);
    }

    const raw = await response.json() as Record<string, unknown>;
    const observed = searchCallObserved(raw);
    if (!observed) {
      return result({
        available: false,
        code: 'inconclusive',
        label: 'Search probe inconclusive',
        model,
        httpStatus: response.status,
        searchCallObserved: false,
        message: 'Gemini accepted the Interactions request, but no Google Search tool call was observed. No production setting was changed.',
      });
    }

    return result({
      available: true,
      code: 'available',
      label: 'Google Search available',
      model: typeof raw.model === 'string' ? raw.model.replace(/^models\//, '') : model,
      httpStatus: response.status,
      searchCallObserved: true,
      message: 'Gemini Google Search grounding completed successfully for this API project. The diagnostic discarded all returned prose and source URLs.',
    });
  } catch (error) {
    return result({
      available: false,
      code: 'temporary_failure',
      label: 'Temporary API failure',
      model,
      httpStatus: null,
      searchCallObserved: false,
      message: error instanceof Error
        ? `Gemini Search could not be reached: ${error.message}`
        : 'Gemini Search could not be reached because of an unknown network failure.',
    });
  }
}

export const geminiSearchDiagnosticInternals = {
  searchCallObserved,
};
