import { getFirebaseAuth } from '@/integrations/firebase';

export type TaxonomyNodeType =
  | 'subject'
  | 'section'
  | 'topic'
  | 'subtopic'
  | 'chapter'
  | 'canonical_problem'
  | 'skill';

export interface TaxonomyFamily {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface TaxonomyExam {
  id: string;
  familyId: string;
  code: string;
  name: string;
  isActive: boolean;
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  currentVersionName: string | null;
}

export interface TaxonomyNodeReference {
  id: string;
  code: string;
  nodeType: TaxonomyNodeType;
  name: string;
  sortOrder: number;
}

export interface TaxonomyExamMapping {
  examVersionId: string;
  examId: string;
  examCode: string;
  examName: string;
  examVersionName: string;
  displayNameOverride: string | null;
  targetCoverage: number | null;
  sortOrder: number;
  isActive: boolean;
}

export interface TaxonomyNode {
  id: string;
  code: string;
  nodeType: TaxonomyNodeType;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parents: TaxonomyNodeReference[];
  children: TaxonomyNodeReference[];
  examMappings: TaxonomyExamMapping[];
}

export interface TaxonomyCoverageRow {
  examVersionId: string;
  taxonomyNodeId: string;
  targetCoverage: number | null;
  isActive: boolean;
  totalQuestions: number;
  publishedQuestions: number;
  approvedQuestions: number;
  reviewQuestions: number;
  draftQuestions: number;
}

export interface TaxonomyWorkspace {
  families: TaxonomyFamily[];
  exams: TaxonomyExam[];
  nodes: TaxonomyNode[];
  coverage: TaxonomyCoverageRow[];
  supportedNodeTypes: TaxonomyNodeType[];
  generatedAt: string;
}

export interface TaxonomyNodeMutation {
  code: string;
  nodeType: TaxonomyNodeType;
  name: string;
  description?: string | null;
  isActive: boolean;
  parentIds: string[];
  examMappings: Array<{
    examVersionId: string;
    displayNameOverride?: string | null;
    targetCoverage?: number | null;
    sortOrder?: number;
    isActive?: boolean;
  }>;
  reason: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function getToken() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return user.getIdToken();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Taxonomy request failed (${response.status}).`);
  if (!body) throw new Error('Taxonomy API returned an empty response.');
  return body;
}

export function getTaxonomyWorkspace() {
  return request<TaxonomyWorkspace>('/admin/taxonomy/workspace');
}

export function createTaxonomyNode(input: TaxonomyNodeMutation) {
  return request<{ node: Pick<TaxonomyNode, 'id' | 'code' | 'nodeType' | 'name' | 'description' | 'isActive'> }>(
    '/admin/taxonomy/nodes',
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function updateTaxonomyNode(nodeId: string, input: TaxonomyNodeMutation) {
  return request<{ node: Pick<TaxonomyNode, 'id' | 'code' | 'nodeType' | 'name' | 'description' | 'isActive'> }>(
    `/admin/taxonomy/nodes/${encodeURIComponent(nodeId)}`,
    { method: 'PATCH', body: JSON.stringify(input) },
  );
}
