import { getFirebaseAuth } from '@/integrations/firebase';
import { AdminApiError, adminApiErrorFromResponse } from '@/lib/admin-api-error';

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

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

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
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
