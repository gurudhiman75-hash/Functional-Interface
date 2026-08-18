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

export interface GenerationCanonicalProblem {
  id: string;
  label: string;
}

export interface GenerationPackage {
  packageId: string;
  topic: string;
  subtopic: string;
  subject?: string;
  label: string;
  enabled: boolean;
  cpIds: string[];
  canonicalProblems?: GenerationCanonicalProblem[];
  supportedDifficulties?: string[];
  supportedLanguages: string[];
  supportedExamProfiles?: string[];
  runtimeMode?: string;
  supportedRuntimeModes?: string[];
  reviewOnly?: boolean;
  releaseFreezeStatus?: string;
  permanentQlCount?: number;
  permanentQlRange?: string;
  questionBankStatus?: string;
  questionBankWritable?: boolean;
  testEligibility?: string;
  publiclyPublishable?: boolean;
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
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  examProfileId?: string;
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

function probabilityExamProfile(exam: string) {
  const value = exam.trim().toLowerCase();
  if (/ibps|sbi|bank|rrb/.test(value)) {
    return /mains|main/.test(value) ? 'BANKING_MAINS' : 'BANKING_PRELIMS';
  }
  if (/ssc/.test(value)) {
    return /jso|statistics/.test(value) ? 'SSC_CGL_JSO' : 'SSC_CGL_CHSL';
  }
  return 'GENERIC_PRACTICE';
}

function rankingExamProfile(exam: string) {
  const value = exam.trim().toLowerCase();
  if (/ssc\s+cgl/.test(value)) return 'SSC_CGL_T1';
  if (/ssc\s+chsl/.test(value)) return 'SSC_CHSL_T1';
  if (/ssc\s+mts/.test(value)) return 'SSC_MTS';
  if (/ibps\s+po/.test(value)) return 'IBPS_PO_PRE';
  if (/ibps\s+clerk/.test(value)) return 'IBPS_CLERK_PRE';
  if (/punjab.*psssb.*clerk|psssb.*clerk/.test(value)) return 'PUNJAB_PSSSB_CLERK';
  if (/punjab.*excise.*inspector|excise.*inspector/.test(value)) return 'PUNJAB_EXCISE_INSP';
  if (/punjab.*police/.test(value)) return 'PUNJAB_POLICE';
  return 'CHAPTER_COVERAGE';
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
  let body: CreateGenerationRunInput = input;
  if (input.packageId === 'PRB-001' || input.packageId === 'PRB-002') {
    body = { ...input, runtimeMode: probabilityExamProfile(input.exam) } as CreateGenerationRunInput & { runtimeMode: string };
  } else if (input.packageId === 'RNK-001') {
    body = {
      ...input,
      subject: 'Reasoning Ability',
      examProfileId: input.examProfileId ?? rankingExamProfile(input.exam),
    };
  }

  return adminRequest<{
    id: string;
    publicCode: string;
    status: GenerationRunStatus;
    itemCount: number;
    generationSystem: string;
  }>(
    '/admin/question-studio/runs',
    { method: 'POST', body: JSON.stringify(body) },
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
