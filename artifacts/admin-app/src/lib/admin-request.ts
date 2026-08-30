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

function requireAdminUser() {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) {
    throw new AdminApiError({
      message: 'Your ExamTree admin session has expired. Sign in again.',
      code: 'ADMIN_SESSION_EXPIRED',
      status: 401,
      details: null,
      correlationId: null,
      affectedRecord: null,
    });
  }
  return user;
}

export async function adminRequest<T>(
  path: string,
  init?: RequestInit,
  options?: { fallbackMessage?: string; affectedRecord?: string | null },
): Promise<T> {
  const user = requireAdminUser();
  const requestInit = withQuestionStudioMix(path, init);
  const response = await fetch(`${apiBase}${path}`, {
    ...requestInit,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(requestInit?.body ? { 'Content-Type': 'application/json' } : {}),
      ...requestInit?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({
    error?: string;
    message?: string;
    code?: string;
    details?: unknown;
  } & T) | null;

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

export async function adminBlobRequest(
  path: string,
  options?: { fallbackMessage?: string; affectedRecord?: string | null },
): Promise<Blob> {
  const user = requireAdminUser();
  const response = await fetch(`${apiBase}${path}`, {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      error?: string;
      message?: string;
      code?: string;
      details?: unknown;
    } | null;
    throw adminApiErrorFromResponse(
      response,
      body,
      options?.fallbackMessage || `Admin file request failed (${response.status}).`,
      options?.affectedRecord ?? null,
    );
  }
  return response.blob();
}
