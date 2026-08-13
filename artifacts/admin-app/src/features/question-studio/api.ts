import { adminRequest } from '@/lib/admin-request';

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

export interface ConvertedQuestion {
  itemId: string;
  questionId: string;
  questionVersionId: string;
  publicCode: string;
}

export interface QuestionStudioQualityIssue {
  code: string;
  severity: 'blocker' | 'warning';
  field: string;
  message: string;
}

export interface QuestionStudioQualityReport {
  score: number;
  readyForApproval: boolean;
  blockerCount: number;
  warningCount: number;
  issues: QuestionStudioQualityIssue[];
}

export interface ReviseGenerationItemInput {
  itemId: string;
  stem: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  changeReason: string;
}

export interface RegenerateGenerationItemsInput {
  itemIds: string[];
  reason: string;
}

export interface RegeneratedGenerationItem {
  itemId: string;
  generationRunId: string;
  runCode: string;
  itemNumber: number;
  previousVersionNumber: number;
  currentVersionNumber: number;
  versionId: string;
  quality: QuestionStudioQualityReport;
}

export interface RegenerateGenerationItemsResult {
  regenerated: RegeneratedGenerationItem[];
  regeneratedCount: number;
  skipped: Array<{ itemId: string; code: string; message: string }>;
  failed: Array<{ itemId: string; message: string }>;
}

export function getQuestionStudioCapabilities() {
  return adminRequest<QuestionStudioCapabilities>(
    '/admin/question-studio/capabilities',
    undefined,
    { fallbackMessage: 'Unable to load Question Studio capabilities.' },
  );
}

export function getQuestionStudioDashboard() {
  return adminRequest<QuestionStudioDashboard>(
    '/admin/question-studio/dashboard',
    undefined,
    { fallbackMessage: 'Unable to load the Question Studio dashboard.' },
  );
}

export function createGenerationRun(input: CreateGenerationRunInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: GenerationRunStatus;
    itemCount: number;
    generationSystem: string;
  }>(
    '/admin/question-studio/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the generation run.' },
  );
}

export function updateGenerationItems(input: {
  itemIds: string[];
  status: GenerationItemStatus;
  reason?: string;
}) {
  return adminRequest<{
    items: Array<{
      id: string;
      generationRunId: string;
      previousStatus: GenerationItemStatus;
      status: GenerationItemStatus;
      approvalMode: 'question_bank' | 'review_only' | null;
      conversionSkippedReason: string | null;
      convertedQuestion: ConvertedQuestion | null;
    }>;
    updatedCount: number;
    converted: ConvertedQuestion[];
    convertedCount: number;
    reviewOnlyApprovedCount: number;
  }>(
    '/admin/question-studio/items/bulk',
    { method: 'PATCH', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to update generated questions.' },
  );
}

export function reviseGenerationItem(input: ReviseGenerationItemInput) {
  const { itemId, ...body } = input;
  return adminRequest<{
    kind: 'updated';
    item: {
      id: string;
      generationRunId: string;
      itemNumber: number;
      currentVersionNumber: number;
      status: 'unreviewed';
      versionId: string;
      payload: Record<string, unknown>;
    };
    quality: QuestionStudioQualityReport;
  }>(
    `/admin/question-studio/items/${encodeURIComponent(itemId)}/revision`,
    { method: 'PATCH', body: JSON.stringify(body) },
    { fallbackMessage: 'Unable to save the generated-item revision.', affectedRecord: itemId },
  );
}

export function regenerateGenerationItems(input: RegenerateGenerationItemsInput) {
  return adminRequest<RegenerateGenerationItemsResult>(
    '/admin/question-studio/items/regenerate',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to regenerate selected questions.' },
  );
}
