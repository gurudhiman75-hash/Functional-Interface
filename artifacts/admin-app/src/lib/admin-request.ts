import { getFirebaseAuth } from '@/integrations/firebase';
import { AdminApiError, adminApiErrorFromResponse } from '@/lib/admin-api-error';

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');
const MIX_STORAGE_KEY = 'examtree:question-studio:difficulty-mix';

function withQuestionStudioMix(path: string, init?: RequestInit): RequestInit | undefined {
  if (path !== '/admin/question-studio/runs' || !init?.body || typeof init.body !== 'string') return init;
  try {
    const body = JSON.parse(init.body) as Record<string, unknown>;
    if (String(body.difficulty ?? '').toLowerCase() !== 'mixed') return init;
    const stored = JSON.parse(localStorage.getItem(MIX_STORAGE_KEY) || 'null') as {
      preset?: string;
      distribution?: { Easy?: number; Medium?: number; Hard?: number };
    } | null;
    if (!stored?.distribution) return init;
    return {
      ...init,
      body: JSON.stringify({
        ...body,
        difficultyPreset: stored.preset ?? 'balanced',
        difficultyDistribution: {
          Easy: Number(stored.distribution.Easy ?? 30),
          Medium: Number(stored.distribution.Medium ?? 50),
          Hard: Number(stored.distribution.Hard ?? 20),
        },
      }),
    };
  } catch {
    return init;
  }
}

export async function adminRequest<T>(
  path: string,
  init?: RequestInit,
  options?: { fallbackMessage?: string; affectedRecord?: string | null },
): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) {
    throw new AdminApiError({
      message: 'Your ExamTree admin session has expired. Sign in again.',
      code: 'ADMIN_SESSION_EXPIRED',
      status: 401,
      details: null,
      correlationId: null,
      affectedRecord: options?.affectedRecord ?? null,
    });
  }

  const requestInit = withQuestionStudioMix(path, init);
  const isStudioRead = path.startsWith('/admin/question-studio/')
    && (!requestInit?.method || requestInit.method.toUpperCase() === 'GET');
  const requestOptions: RequestInit = {
    ...requestInit,
    // Studio GET endpoints return authenticated JSON. Never let an ETag
    // revalidation surface a bare 304 to the JSON-only admin API client.
    cache: isStudioRead ? 'no-store' : requestInit?.cache,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(requestInit?.body ? { 'Content-Type': 'application/json' } : {}),
      ...requestInit?.headers,
    },
  };
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, requestOptions);
    if (isStudioRead && response.status === 304) {
      // Defensive fallback for proxies that ignore the first no-store hint.
      const noCacheHeaders = new Headers(requestOptions.headers);
      noCacheHeaders.set('Cache-Control', 'no-cache');
      response = await fetch(`${apiBase}${path}`, {
        ...requestOptions,
        cache: 'reload',
        headers: noCacheHeaders,
      });
    }
  } catch (cause) {
    throw new AdminApiError({
      message: isStudioRead
        ? 'Question Studio could not reach the API. Check the connection and retry.'
        : 'The admin API could not be reached. Check the connection and retry.',
      code: 'ADMIN_API_NETWORK_ERROR',
      status: null,
      details: cause instanceof Error ? cause.message : null,
      correlationId: null,
      affectedRecord: options?.affectedRecord ?? null,
    });
  }
  const body = await response.json().catch(() => null) as ({
    error?: string;
    message?: string;
    code?: string;
    details?: unknown;
  } & T) | null;

  if (!response.ok && !body && path === '/admin/question-studio/runs') {
    // Cloudflare / Render can return an HTML gateway error when the API process
    // is restarting. The normal fallback hid the status, making that look like
    // a content-generation defect. A lost response is ambiguous: NEVER
    // automatically retry a run without checking Review queue for duplicates.
    const gatewayFailure = response.status >= 500;
    throw new AdminApiError({
      message: gatewayFailure
        ? `Question Studio API returned HTTP ${response.status} without JSON. Render may be restarting or the gateway may have timed out. Check the Review queue before retrying.`
        : `Question Studio API returned HTTP ${response.status} without diagnostic details. Check your admin session and try again.`,
      code: gatewayFailure ? 'QUESTION_STUDIO_UPSTREAM_HTTP_ERROR' : 'QUESTION_STUDIO_HTTP_ERROR',
      status: response.status,
      details: null,
      correlationId: response.headers.get('X-Correlation-Id'),
      affectedRecord: options?.affectedRecord ?? null,
    });
  }
  if (!response.ok) {
    throw adminApiErrorFromResponse(
      response,
      body,
      options?.fallbackMessage || `Admin request failed (${response.status}).`,
      options?.affectedRecord ?? null,
    );
  }
  if (!body) {
    throw new AdminApiError({
      message: 'The admin API returned an empty response.',
      code: 'EMPTY_ADMIN_RESPONSE',
      status: response.status,
      details: null,
      correlationId: response.headers.get('X-Correlation-Id'),
      affectedRecord: options?.affectedRecord ?? null,
    });
  }
  return body;
}
