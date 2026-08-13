import { adminRequest } from '@/lib/admin-request';

export const PROBABILITY_NATIVE_REVIEW_AUTHORITY = 'PRB-ML05-PARITY-REVIEW-SURFACE-v1';

export type ProbabilityReviewLanguage = 'hi' | 'pa';
export type ProbabilityReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProbabilityReviewPackageId = 'PRB-001' | 'PRB-002';

export interface ProbabilityReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  packageId: ProbabilityReviewPackageId;
  canonicalProblemId: string;
  language: ProbabilityReviewLanguage;
  locale: string;
  difficultyBand: ProbabilityReviewDifficulty;
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: string;
    text: string;
    studentExplanation: string;
    isCorrect: boolean;
    semanticKey: string;
  }>;
  correctIndex: number;
  answer: string;
  explanation: {
    explanationId: string;
    whatAsked: string;
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
  };
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  validation: {
    valid: boolean;
    sourceEnglishValid: boolean;
    nativePresentationValid: boolean;
    optionByteParity: boolean;
    correctIndexParity: boolean;
    answerParity: boolean;
    parameterFingerprint: string;
    mathematicalFingerprint: string;
    sourceLifecycleLocked: boolean;
  };
}

export interface ProbabilityReviewPackage {
  label: string;
  qlIds: string[];
  packageIds: ProbabilityReviewPackageId[];
  supportedLanguages: ProbabilityReviewLanguage[];
  supportedDifficulties: ProbabilityReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  integrationAuthority: string;
  permanentQlCount: number;
  nativeReviewSurfaceCount: number;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  bulkSyncSupported: false;
  releaseFreezeStatus: 'PENDING_HUMAN_REVIEW';
}

export interface ProbabilityReviewInput {
  language: ProbabilityReviewLanguage;
  packageId?: ProbabilityReviewPackageId;
  qlId?: string;
  difficulty?: ProbabilityReviewDifficulty;
  count: number;
  seed?: string;
}

export interface ProbabilityReviewFreezeStatus {
  requiredDecisionCount: number;
  recordedDecisionCount: number;
  approvedDecisionCount: number;
  hindiApprovedCount: number;
  punjabiApprovedCount: number;
  freezeReady: boolean;
  status: 'PENDING_HUMAN_REVIEW' | 'HUMAN_REVIEW_COMPLETE_AWAITING_EXPLICIT_FREEZE';
}

export interface ProbabilityReviewStatus {
  chapterId: 'Probability';
  permanentQlCount: number;
  nativeReviewSurfaceCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  releaseFreeze: ProbabilityReviewFreezeStatus;
}

export interface ProbabilityReviewRunResult {
  id: string | null;
  publicCode: string | null;
  status: string;
  itemCount: number;
  generationSystem: 'quant-v4';
  chapterId: 'Probability';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  releaseFreezeStatus: 'PENDING_HUMAN_REVIEW';
}

export interface ProbabilityReviewDecisionResult {
  id: string;
  generationRunId: string;
  previousStatus: string;
  status: string;
  updatedAt: string | null;
  convertedQuestion: null;
  questionBankWritePerformed: false;
  releaseFreezeStillRequired: true;
}

function paramsFor(input: ProbabilityReviewInput) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.packageId) params.set('packageId', input.packageId);
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function isProbabilityNativeReviewPayload(value: Record<string, unknown> | null | undefined) {
  if (!value) return false;
  const generationContext = value.generationContext && typeof value.generationContext === 'object' && !Array.isArray(value.generationContext)
    ? value.generationContext as Record<string, unknown>
    : {};
  return (value.integrationAuthority ?? generationContext.integrationAuthority) === PROBABILITY_NATIVE_REVIEW_AUTHORITY
    && (value.reviewOnly ?? generationContext.reviewOnly) === true
    && (value.questionBankWritable ?? generationContext.questionBankWritable) === false;
}

export function getProbabilityReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'REVIEW_ONLY';
    package: ProbabilityReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    nativeReviewSurfaceCount: number;
    supportedLanguages: ProbabilityReviewLanguage[];
    supportedPackages: ProbabilityReviewPackageId[];
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
    questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
    releaseFreeze: ProbabilityReviewFreezeStatus;
  }>('/admin/question-studio/quant/probability/native-review/package', undefined, {
    fallbackMessage: 'Unable to load the Probability native review package.',
  });
}

export function previewProbabilityReview(input: ProbabilityReviewInput) {
  return adminRequest<{ questions: ProbabilityReviewQuestion[]; productionEligible: false; reviewOnly: true; integrationAuthority: string }>(
    `/admin/question-studio/quant/probability/native-review/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Probability native questions.' },
  );
}

export function createProbabilityReviewRun(input: ProbabilityReviewInput) {
  return adminRequest<ProbabilityReviewRunResult>(
    '/admin/question-studio/quant/probability/native-review/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Probability native review run.' },
  );
}

export function updateProbabilityReviewItem(input: {
  itemId: string;
  status: 'unreviewed' | 'needs_fix' | 'approved' | 'rejected';
  reason?: string;
}) {
  const { itemId, ...body } = input;
  return adminRequest<ProbabilityReviewDecisionResult>(
    `/admin/question-studio/quant/probability/native-review/items/${encodeURIComponent(itemId)}/decision`,
    { method: 'PATCH', body: JSON.stringify(body) },
    {
      fallbackMessage: 'Unable to save the Probability native review decision.',
      affectedRecord: itemId,
    },
  );
}

export function getProbabilityReviewStatus() {
  return adminRequest<ProbabilityReviewStatus>(
    '/admin/question-studio/quant/probability/native-review/status',
    undefined,
    { fallbackMessage: 'Unable to load Probability native review status.' },
  );
}