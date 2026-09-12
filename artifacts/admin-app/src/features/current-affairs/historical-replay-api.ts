import { adminRequest } from '@/lib/admin-request';

import type { GenerateYesterdayCurrentAffairsResult } from './production-ops-api';

export function generateHistoricalCurrentAffairs(date: string) {
  return adminRequest<GenerateYesterdayCurrentAffairsResult>('/admin/current-affairs/production/generate-yesterday', {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}
