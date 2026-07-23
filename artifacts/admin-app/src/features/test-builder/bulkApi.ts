import { adminRequest } from '@/lib/admin-request';
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

export function bulkTransitionTests(
  action: TestLifecycleAction,
  input: {
    items: Array<{ testId: string; expectedCurrentDraftVersionId: string }>;
    reason?: string;
    scheduledAt?: string;
    closesAt?: string;
  },
) {
  return adminRequest<BulkTestLifecycleResponse>(
    `/admin/tests/bulk/actions/${action}`,
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: `Unable to ${action.replace('-', ' ')} the selected tests.` },
  );
}
