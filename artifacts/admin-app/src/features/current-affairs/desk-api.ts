import { adminRequest } from '@/lib/admin-request';

export type DailyPackPublication = {
  contentDate: string;
  publication: { id: string; publishedAt: string } | null;
  readiness: { ready: boolean; blockers: string[] };
};

const post = <T,>(path: string, body: Record<string, unknown>) =>
  adminRequest<T>(`/admin/current-affairs${path}`, { method: 'POST', body: JSON.stringify(body) });

export const autoPickCurrentAffairsHeadlines = (date: string) =>
  post<{ pickedCount: number; selectedCount: number }>('/editorial/headlines/auto-select', { date });

export const getDailyPackPublication = (date: string) =>
  adminRequest<DailyPackPublication>(`/admin/current-affairs/production/master-pack-publication?date=${encodeURIComponent(date)}`);

export const publishDailyPack = (date: string) =>
  post('/production/master-pack-publication/publish', { date });

export const withdrawDailyPack = (date: string, reason: string) =>
  post('/production/master-pack-publication/withdraw', { date, reason });
