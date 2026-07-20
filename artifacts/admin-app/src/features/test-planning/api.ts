import { getFirebaseAuth } from '@/integrations/firebase';

export type PlanningStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export interface PlanningExamVersion {
  id: string;
  versionNumber: number;
  versionName: string;
  examCode: string;
  examName: string;
  familyName: string;
}

export interface PlanningTaxonomyNode {
  id: string;
  code: string;
  name: string;
  nodeType: string;
}

export interface PlanningLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
}

export interface BlueprintSection {
  id?: string;
  clientKey: string;
  name: string;
  sortOrder?: number;
  questionCount: number;
  marks: number;
  durationSeconds: number | null;
  selectionRules: {
    taxonomyNodeIds: string[];
    languageCode: string;
    negativeMarks: number;
    difficulties: Record<string, number>;
  };
}

export interface TestBlueprint {
  id: string;
  examVersionId: string;
  code: string;
  name: string;
  currentVersionNumber: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
  versionId: string;
  durationSeconds: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: {
    status: PlanningStatus;
    stage?: string;
    navigationRules?: Record<string, unknown>;
  };
  changeReason: string;
  versionCreatedAt: string;
  sections: BlueprintSection[];
  versionCount: number;
}

export interface BlueprintVersionInput {
  expectedCurrentVersionNumber?: number;
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: {
    status: PlanningStatus;
    stage: string;
    navigationRules: Record<string, unknown>;
  };
  changeReason: string;
  sections: Array<{
    clientKey: string;
    name: string;
    questionCount: number;
    marks: number;
    durationMinutes: number | null;
    selectionRules: BlueprintSection['selectionRules'];
  }>;
}

export interface BlueprintDetail {
  blueprint: TestBlueprint;
  versions: Array<{
    id: string;
    versionNumber: number;
    durationSeconds: number;
    totalMarks: number;
    instructions: Record<string, unknown>;
    configuration: Record<string, unknown>;
    changeReason: string;
    createdBy: string | null;
    createdAt: string;
    sections: BlueprintSection[];
  }>;
}

export interface SeriesCatalogTest {
  id: string;
  publicCode: string;
  examVersionId: string;
  status: string;
  title: string | null;
  durationSeconds: number | null;
  totalMarks: number | null;
  questionCount: number;
}

export interface TestSeriesItem {
  id?: string;
  testId: string;
  sortOrder: number;
  accessMode: 'free' | 'included' | 'premium';
  availability: Record<string, unknown>;
  publicCode: string;
  status: string;
  title: string | null;
  questionCount: number;
  durationSeconds: number | null;
  totalMarks: number | null;
}

export interface TestSeries {
  id: string;
  examVersionId: string;
  code: string;
  name: string;
  currentVersionNumber: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
  versionId: string;
  status: PlanningStatus;
  description: string | null;
  validityDays: number | null;
  progressionRules: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  versionCreatedAt: string;
  items: TestSeriesItem[];
  versionCount: number;
}

export interface TestSeriesInput {
  expectedCurrentVersionNumber?: number;
  examVersionId: string;
  code: string;
  name: string;
  status: PlanningStatus;
  description: string;
  validityDays: number | null;
  progressionRules: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  items: Array<{
    testId: string;
    accessMode: 'free' | 'included' | 'premium';
    availability: Record<string, unknown>;
  }>;
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
    const error = new Error(body?.error || `Test planning request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Test planning returned an empty response.');
  return body;
}

export function getBlueprintCatalog() {
  return request<{ examVersions: PlanningExamVersion[]; taxonomyNodes: PlanningTaxonomyNode[]; languages: PlanningLanguage[]; generatedAt: string }>('/admin/blueprints/catalog');
}

export function getBlueprints() {
  return request<{ blueprints: TestBlueprint[]; generatedAt: string }>('/admin/blueprints');
}

export function getBlueprint(id: string) {
  return request<BlueprintDetail>(`/admin/blueprints/${encodeURIComponent(id)}`);
}

export function createBlueprint(input: BlueprintVersionInput) {
  return request<BlueprintDetail>('/admin/blueprints', { method: 'POST', body: JSON.stringify(input) });
}

export function updateBlueprint(id: string, input: BlueprintVersionInput) {
  return request<BlueprintDetail>(`/admin/blueprints/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function transitionBlueprint(id: string, action: 'activate' | 'deprecate' | 'archive' | 'restore', reason: string) {
  return request<BlueprintDetail>(`/admin/blueprints/${encodeURIComponent(id)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function assembleBlueprint(id: string, input: { title: string; seed?: string }) {
  return request<{ testId: string; testVersionId: string; publicCode: string; title: string; questionCount: number; shortages: string[]; seed: string }>(
    `/admin/blueprints/${encodeURIComponent(id)}/assemble`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function getSeriesCatalog() {
  return request<{ examVersions: PlanningExamVersion[]; tests: SeriesCatalogTest[]; generatedAt: string }>('/admin/test-series/catalog');
}

export function getTestSeries() {
  return request<{ series: TestSeries[]; generatedAt: string }>('/admin/test-series');
}

export function createTestSeries(input: TestSeriesInput) {
  return request<{ series: TestSeries; versions: unknown[] }>('/admin/test-series', { method: 'POST', body: JSON.stringify(input) });
}

export function updateTestSeries(id: string, input: TestSeriesInput) {
  return request<{ series: TestSeries; versions: unknown[] }>(`/admin/test-series/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function transitionTestSeries(id: string, action: 'activate' | 'deprecate' | 'archive' | 'restore', reason: string) {
  return request<{ series: TestSeries; versions: unknown[] }>(`/admin/test-series/${encodeURIComponent(id)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
