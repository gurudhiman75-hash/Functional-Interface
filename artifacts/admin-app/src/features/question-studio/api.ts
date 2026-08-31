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
  supportedDifficulties?: string[];
  runtimeMode?: string;
  questionBankStatus?: string;
  testEligibility?: string;
  publiclyPublishable?: boolean;
  selectorKind?: 'standard' | 'tsd-cp009-review' | 'tsd-cp010-review';
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
  qlId?: string;
  familyId?: string;
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

export const TSD_CP009_SELECTOR_PACKAGE_ID = 'TSD-002::CP009-REVIEW' as const;
export const TSD_CP010_SELECTOR_PACKAGE_ID = 'TSD-002::CP010-REVIEW' as const;

export interface TsdCp009QuestionStudioPackageResponse {
  generationSystem: 'quant-v4';
  activationMode: 'REVIEW_ONLY';
  package: {
    packageId: 'TSD-002';
    checkpointId: 'TSD-CP-009';
    runtimeMode: string;
    permanentQlIds: string[];
    supportedLanguages: readonly string[];
    supportedDifficulties: readonly string[];
    deterministicReviewCombinations: number;
    questionBankStatus: 'NOT_STORED';
    testEligibility: 'INELIGIBLE';
    publiclyPublishable: false;
  };
  maxBatchSize: number;
  permanentQlCount: number;
  deterministicReviewCombinations: number;
  supportedLanguages: readonly string[];
  supportedDifficulties: readonly string[];
  questionBankWriteEnabled: false;
  testEligible: false;
  publiclyPublishable: false;
}

export interface TsdCp010QuestionStudioPackageResponse {
  generationSystem: 'quant-v4';
  activationMode: 'REVIEW_ONLY';
  package: {
    packageId: 'TSD-002';
    checkpointId: 'TSD-CP-010';
    runtimeMode: string;
    permanentQlIds: readonly string[];
    supportedLanguages: readonly string[];
    supportedDifficulties: readonly string[];
    compatibleCombinationsPerLocale: number;
    deterministicReviewCombinations: number;
    questionBankStatus: 'NOT_STORED';
    testEligibility: 'INELIGIBLE';
    publiclyPublishable: false;
  };
  maxBatchSize: number;
  permanentQlCount: number;
  compatibleCombinationsPerLocale: number;
  deterministicReviewCombinations: number;
  supportedLanguages: readonly string[];
  supportedDifficulties: readonly string[];
  questionBankWriteEnabled: false;
  testEligible: false;
  publiclyPublishable: false;
}

export function getQuestionStudioCapabilities() {
  return adminRequest<QuestionStudioCapabilities>(
    '/admin/question-studio/capabilities',
    undefined,
    { fallbackMessage: 'Unable to load Question Studio capabilities.' },
  );
}

export function getTsdCp009QuestionStudioPackage() {
  return adminRequest<TsdCp009QuestionStudioPackageResponse>(
    '/admin/question-studio/quant/time-speed-distance/cp009/package',
    undefined,
    { fallbackMessage: 'Unable to load TSD CP009 Question Studio package.' },
  );
}

export function getTsdCp010QuestionStudioPackage() {
  return adminRequest<TsdCp010QuestionStudioPackageResponse>(
    '/admin/question-studio/quant/time-speed-distance/cp010/package',
    undefined,
    { fallbackMessage: 'Unable to load TSD CP010 Question Studio package.' },
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

export function createTsdCp009GenerationRun(input: CreateGenerationRunInput) {
  const difficulty = input.difficulty.trim().toUpperCase();
  if (difficulty !== 'EASY' && difficulty !== 'MEDIUM') {
    throw new Error('TSD CP009 currently supports Easy and Medium review questions only.');
  }
  return adminRequest<{
    id: string;
    publicCode: string;
    status: GenerationRunStatus;
    itemCount: number;
    generationSystem: string;
    packageId: 'TSD-002';
    checkpointId: 'TSD-CP-009';
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/quant/time-speed-distance/cp009/runs',
    {
      method: 'POST',
      body: JSON.stringify({
        language: input.language,
        difficulty,
        count: input.count,
        seed: input.seed,
        qlId: input.qlId,
        familyId: input.familyId,
      }),
    },
    { fallbackMessage: 'Unable to create the TSD CP009 review run.' },
  );
}

export function createTsdCp010GenerationRun(input: CreateGenerationRunInput) {
  const difficulty = input.difficulty.trim().toUpperCase();
  if (difficulty !== 'EASY' && difficulty !== 'MEDIUM') {
    throw new Error('TSD CP010 currently supports Easy and Medium review questions only.');
  }
  return adminRequest<{
    id: string;
    publicCode: string;
    status: GenerationRunStatus;
    itemCount: number;
    generationSystem: string;
    packageId: 'TSD-002';
    checkpointId: 'TSD-CP-010';
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/quant/time-speed-distance/cp010/runs',
    {
      method: 'POST',
      body: JSON.stringify({
        language: input.language,
        difficulty,
        count: input.count,
        seed: input.seed,
        qlId: input.qlId,
        familyId: input.familyId,
      }),
    },
    { fallbackMessage: 'Unable to create the TSD CP010 review run.' },
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
      convertedQuestion: ConvertedQuestion | null;
      questionBankEligibilityIssue?: string | null;
    }>;
    updatedCount: number;
    converted: ConvertedQuestion[];
    convertedCount: number;
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
