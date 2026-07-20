import { getFirebaseAuth } from '@/integrations/firebase';

export type SeriesProgressionMode = 'open' | 'sequential' | 'score_gated';

export interface SeriesCatalogExamVersion {
  id: string;
  versionNumber: number;
  versionName: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
}

export interface SeriesCatalogTest {
  id: string;
  publicCode: string;
  examVersionId: string;
  status: string;
  title: string;
  durationSeconds: number | null;
  totalMarks: number | null;
  updatedAt: string;
}

export interface SeriesCatalog {
  examVersions: SeriesCatalogExamVersion[];
  tests: SeriesCatalogTest[];
  generatedAt: string;
}

export interface SeriesReadiness {
  ready: boolean;
  blockers: string[];
  warnings: string[];
}

export interface TestSeriesSummary {
  id: string;
  examVersionId: string;
  code: string;
  name: string;
  currentVersionNumber: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  examCode: string;
  examName: string;
  examFamilyName: string;
  description: string;
  availabilityStartAt: string | null;
  availabilityEndAt: string | null;
  progressionMode: SeriesProgressionMode;
  completionThreshold: number | null;
  itemCount: number;
  memberStatuses: string[];
  readiness: SeriesReadiness;
}

export interface TestSeriesRecord {
  id: string;
  examVersionId: string;
  code: string;
  name: string;
  currentVersionNumber: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  examVersionNumber: number;
  examVersionName: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
}

export interface TestSeriesVersion {
  id: string;
  versionNumber: number;
  description: string;
  availabilityStartAt: string | null;
  availabilityEndAt: string | null;
  progressionMode: SeriesProgressionMode;
  completionThreshold: number | null;
  configuration: Record<string, unknown>;
  changeReason: string;
  createdBy: string | null;
  createdAt: string;
  itemCount: number;
}

export interface TestSeriesItem {
  id: string;
  testId: string;
  sortOrder: number;
  titleOverride: string | null;
  unlockAt: string | null;
  minimumScore: number | null;
  isRequired: boolean;
  configuration: Record<string, unknown>;
  publicCode: string;
  status: string;
  title: string;
  durationSeconds: number | null;
  totalMarks: number | null;
}

export interface TestSeriesDetail {
  series: TestSeriesRecord;
  versions: TestSeriesVersion[];
  currentVersion: TestSeriesVersion | null;
  items: TestSeriesItem[];
  readiness: SeriesReadiness;
  generatedAt: string;
}

export interface TestSeriesItemInput {
  testId: string;
  titleOverride: string | null;
  unlockAt: string | null;
  minimumScore: number | null;
  isRequired: boolean;
  configuration: Record<string, unknown>;
}

export interface TestSeriesInput {
  expectedCurrentVersionNumber: number | null;
  examVersionId: string;
  code: string;
  name: string;
  description: string;
  availabilityStartAt: string | null;
  availabilityEndAt: string | null;
  progressionMode: SeriesProgressionMode;
  completionThreshold: number | null;
  configuration: Record<string, unknown>;
  changeReason: string;
  items: TestSeriesItemInput[];
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Test series request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Test Series API returned an empty response.');
  return body;
}

export function getSeriesCatalog() {
  return request<SeriesCatalog>('/admin/test-series/catalog');
}

export function getTestSeries() {
  return request<{ series: TestSeriesSummary[]; generatedAt: string }>('/admin/test-series');
}

export function getTestSeriesDetail(seriesId: string) {
  return request<TestSeriesDetail>(`/admin/test-series/${encodeURIComponent(seriesId)}`);
}

export function createTestSeries(input: TestSeriesInput) {
  return request<TestSeriesDetail>('/admin/test-series', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTestSeries(seriesId: string, input: TestSeriesInput) {
  return request<TestSeriesDetail>(`/admin/test-series/${encodeURIComponent(seriesId)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function transitionTestSeries(seriesId: string, action: 'archive' | 'restore', reason: string) {
  return request<TestSeriesDetail>(`/admin/test-series/${encodeURIComponent(seriesId)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
