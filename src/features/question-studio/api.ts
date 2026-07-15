import { getFirebaseAuth } from '@/integrations/firebase';

export type GenerationRunStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'paused'
  | 'validation'
  | 'review'
  | 'partially_approved'
  | 'approved'
  | 'failed'
  | 'cancelled';

export type GenerationItemStatus =
  | 'unreviewed'
  | 'needs_fix'
  | 'approved'
  | 'rejected';

export interface QuestionStudioItem {
  id: string;
  generationRunId: string;
  itemNumber: number;
  status: GenerationItemStatus;
  currentVersionNumber: number;
  retryReason: string | null;
  reviewerUserId: string | null;
  acceptedQuestionId: string | null;
  acceptedQuestionVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  versionId: string | null;
  payload: Record<string, unknown> | null;
}

export interface QuestionStudioRun {
  id: string;
  publicCode: string;
  status: GenerationRunStatus;
  attemptNumber: number;
  provider: string | null;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  estimatedCostPaise: number | null;
  actualCostPaise: number | null;
  budgetLimitPaise: number | null;
  dueAt: string | null;
  failureReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requestSnapshot: Record<string, unknown>;
  recipeVersionId: string | null;
  items: QuestionStudioItem[];
}

export interface QuestionStudioRecipe {
  id: string;
  name: string;
  visibility: string;
  currentVersionNumber: number;
  createdAt: string;
  updatedAt: string;
  versionId: string | null;
  configuration: Record<string, unknown> | null;
  versionNotes: string | null;
}

export interface QuestionStudioDashboard {
  runs: QuestionStudioRun[];
  recipes: QuestionStudioRecipe[];
  generatedAt: string;
}

export interface GenerationPackage {
  packageId: string;
  topic: string;
  subtopic: string;
  label: string;
  enabled: boolean;
  cpIds: string[];
  supportedLanguages: string[];
}

export interface QuestionStudioCapabilities {
  generationSystem: string;
  packages: GenerationPackage[];
  difficulties: string[];
  languages: string[];
  maxBatchSize: number;
}

export interface CreateGenerationRunInput {
  exam: string;
  subject: string;
  difficulty: string;
  count: number;
  packageId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  language: string;
  seed?: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function getToken() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) {
    throw new Error('Your ExamTree admin session has expired. Sign in again.');
  }
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
  if (!response.ok) {
    throw new Error(body?.error || `Question Studio request failed (${response.status}).`);
  }
  if (!body) {
    throw new Error('Question Studio returned an empty response.');
  }
  return body;
}

export function getQuestionStudioCapabilities() {
  return request<QuestionStudioCapabilities>('/admin/question-studio/capabilities');
}

export function getQuestionStudioDashboard() {
  return request<QuestionStudioDashboard>('/admin/question-studio/dashboard');
}

export function createGenerationRun(input: CreateGenerationRunInput) {
  return request<{
    id: string;
    publicCode: string;
    status: GenerationRunStatus;
    itemCount: number;
    generationSystem: string;
  }>('/admin/question-studio/runs', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateGenerationItems(input: {
  itemIds: string[];
  status: GenerationItemStatus;
  reason?: string;
}) {
  return request<{
    items: Array<{
      id: string;
      generationRunId: string;
      previousStatus: GenerationItemStatus;
      status: GenerationItemStatus;
    }>;
    updatedCount: number;
  }>('/admin/question-studio/items/bulk', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
