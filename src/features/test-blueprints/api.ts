import { getFirebaseAuth } from '@/integrations/firebase';

export interface BlueprintCatalogLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export interface BlueprintCatalogExamVersion {
  id: string;
  versionNumber: number;
  versionName: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
  languages: BlueprintCatalogLanguage[];
}

export interface BlueprintCatalogTaxonomyNode {
  id: string;
  code: string;
  name: string;
  nodeType: string;
  examVersionIds: string[];
}

export interface BlueprintCatalog {
  examVersions: BlueprintCatalogExamVersion[];
  taxonomyNodes: BlueprintCatalogTaxonomyNode[];
  generatedAt: string;
}

export interface BlueprintSummary {
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
  durationSeconds: number | null;
  totalMarks: number | null;
  versionCreatedAt: string | null;
  sectionCount: number;
  questionCount: number;
}

export interface BlueprintRecord {
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

export interface BlueprintVersion {
  id: string;
  versionNumber: number;
  durationSeconds: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: Record<string, unknown>;
  changeReason: string;
  createdBy: string | null;
  createdAt: string;
  sectionCount: number;
  questionCount: number;
}

export interface BlueprintSection {
  id: string;
  name: string;
  sectionKey: string;
  sortOrder: number;
  questionCount: number;
  marks: number;
  durationSeconds: number | null;
  selectionRules: {
    taxonomyNodeIds?: string[];
    difficultyTargets?: { easy?: number; medium?: number; hard?: number };
    languageCode?: string;
    negativeMarks?: number;
  };
}

export interface BlueprintDetail {
  blueprint: BlueprintRecord;
  versions: BlueprintVersion[];
  currentVersion: BlueprintVersion | null;
  sections: BlueprintSection[];
  generatedAt: string;
}

export interface BlueprintSectionInput {
  sectionKey: string;
  name: string;
  questionCount: number;
  marks: number;
  durationMinutes: number | null;
  taxonomyNodeIds: string[];
  difficultyTargets: { easy: number; medium: number; hard: number };
  languageCode: string;
  negativeMarks: number;
}

export interface BlueprintInput {
  expectedCurrentVersionNumber: number | null;
  examVersionId: string;
  code: string;
  name: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  configuration: Record<string, unknown>;
  changeReason: string;
  sections: BlueprintSectionInput[];
}

export interface BlueprintAssemblyQuestion {
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  difficulty: string;
  stem: string;
}

export interface BlueprintAssemblySection {
  sectionKey: string;
  name: string;
  durationMinutes: number | null;
  marks: number;
  negativeMarks: number;
  questions: BlueprintAssemblyQuestion[];
}

export interface BlueprintAssemblyShortage {
  sectionKey: string;
  sectionName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requested: number;
  available: number;
  missing: number;
}

export interface BlueprintAssemblyPlan {
  seed: string;
  sections: BlueprintAssemblySection[];
  shortages: BlueprintAssemblyShortage[];
  selectedCount: number;
  requiredCount: number;
  ready: boolean;
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
    const error = new Error(body?.error || `Blueprint request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Blueprint API returned an empty response.');
  return body;
}

export function getBlueprintCatalog() {
  return request<BlueprintCatalog>('/admin/test-blueprints/catalog');
}

export function getBlueprints() {
  return request<{ blueprints: BlueprintSummary[]; generatedAt: string }>('/admin/test-blueprints');
}

export function getBlueprint(blueprintId: string) {
  return request<BlueprintDetail>(`/admin/test-blueprints/${encodeURIComponent(blueprintId)}`);
}

export function createBlueprint(input: BlueprintInput) {
  return request<BlueprintDetail>('/admin/test-blueprints', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateBlueprint(blueprintId: string, input: BlueprintInput) {
  return request<BlueprintDetail>(`/admin/test-blueprints/${encodeURIComponent(blueprintId)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function transitionBlueprint(blueprintId: string, action: 'archive' | 'restore', reason: string) {
  return request<BlueprintDetail>(`/admin/test-blueprints/${encodeURIComponent(blueprintId)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function previewBlueprint(blueprintId: string, seed?: string) {
  return request<{
    blueprint: BlueprintRecord;
    version: BlueprintVersion;
    plan: BlueprintAssemblyPlan;
    generatedAt: string;
  }>(`/admin/test-blueprints/${encodeURIComponent(blueprintId)}/preview`, {
    method: 'POST',
    body: JSON.stringify({ seed }),
  });
}

export function assembleBlueprint(blueprintId: string, input: {
  title: string;
  seed?: string;
  changeReason: string;
}) {
  return request<{
    testId: string;
    testVersionId: string;
    publicCode: string;
    title: string;
    status: 'draft';
    assembly: BlueprintAssemblyPlan;
  }>(`/admin/test-blueprints/${encodeURIComponent(blueprintId)}/assemble`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
