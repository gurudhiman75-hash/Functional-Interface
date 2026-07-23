import { getFirebaseAuth } from '@/integrations/firebase';
import type { TestLifecycleAction } from './api';

export interface BulkTestLifecycleResult {
  testId: string;
  publicCode?: string;
  ok: boolean;
  code?: string;
  message?: string;
  status?: string;
  currentDraftVersionId?: string;
}

export interface BulkTestLifecycleResponse {
  action: TestLifecycleAction;
  attempted: number;
  succeeded: number;
  failed: number;
  results: BulkTestLifecycleResult[];
  generatedAt: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

export async function bulkTransitionTests(
  action: TestLifecycleAction,
  input: {
    items: Array<{ testId: string; expectedCurrentDraftVersionId: string }>;
    reason?: string;
    scheduledAt?: string;
    closesAt?: string;
  },
) {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');

  const response = await fetch(`${apiBase}/admin/tests/bulk/actions/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(input),
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & BulkTestLifecycleResponse) | null;
  if (!response.ok) throw new Error(body?.error || `Bulk test update failed (${response.status}).`);
  if (!body) throw new Error('Bulk test update returned an empty response.');
  return body;
}
