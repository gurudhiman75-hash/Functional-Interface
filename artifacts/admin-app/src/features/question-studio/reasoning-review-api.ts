import { adminRequest } from '@/lib/admin-request';

export type ReasoningReviewLanguage = 'en' | 'hi' | 'pa';
export type ReasoningReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ReasoningReviewPackage {
  packageId: string;
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: ReasoningReviewLanguage[];
  supportedDifficulties: ReasoningReviewDifficulty[];
  runtimeMode: string;
  enabled: true;
  adminReviewVisible: true;
  persistenceAllowed: true;
  databaseWriteEnabled: true;
  questionBankEligible: true;
  mockTestEligible: true;
  publiclyPublishable: true;
  releaseAuthority: string;
}

export interface ReasoningReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: ReasoningReviewLanguage;
  locale: string;
  difficultyBand: ReasoningReviewDifficulty;
  useMode: string;
  sharedPrompt: string;
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
  decodedStatements: string[];
  explanation: {
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
    familyTree: unknown;
    diagramProof: unknown;
  };
  reasoningGraph: unknown;
  validation: { valid: boolean };
}

export interface ReasoningRunResult {
  id: string | null;
  publicCode: string | null;
  status: string;
  itemCount: number;
  existingCount?: number;
  preflightMissingCount?: number;
}

export interface ReasoningProductionStatus {
  packageId: string;
  totalFrozenRecords: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  releaseAuthority: string;
}

export interface ReasoningImportPlan {
  packageId: string;
  releaseAuthority: string;
  totalFrozenRecords: number;
  existingCount: number;
  missingCount: number;
  duplicateQuestionLanguageIds: string[];
  unexpectedQuestionLanguageIds: string[];
  driftDetected: boolean;
  alreadyImported: boolean;
  readyToImport: boolean;
  confirmationRequired: boolean;
  requiredConfirmation: string;
}

export interface ReasoningReviewInput {
  packageId: string;
  language: ReasoningReviewLanguage;
  qlId?: string;
  difficulty?: ReasoningReviewDifficulty;
  count: number;
  seed?: string;
}

function paramsFor(input: ReasoningReviewInput) {
  const params = new URLSearchParams({
    packageId: input.packageId,
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getReasoningReviewPackages() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'PRODUCTION_REVIEW';
    packages: ReasoningReviewPackage[];
    maxBatchSize: number;
    totalFrozenRecords: number;
  }>(
    '/admin/question-studio/reasoning/packages',
    undefined,
    { fallbackMessage: 'Unable to load Reasoning production packages.' },
  );
}

export function previewReasoningReview(input: ReasoningReviewInput) {
  return adminRequest<{ questions: ReasoningReviewQuestion[]; productionEligible: true }>(
    `/admin/question-studio/reasoning/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview frozen Reasoning questions.' },
  );
}

export function createReasoningReviewRun(input: ReasoningReviewInput) {
  return adminRequest<ReasoningRunResult>(
    '/admin/question-studio/reasoning/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Reasoning review run.' },
  );
}

export function getReasoningImportPlan() {
  return adminRequest<ReasoningImportPlan>(
    '/admin/question-studio/reasoning/import-plan',
    undefined,
    { fallbackMessage: 'Unable to calculate the BLR synchronization plan.' },
  );
}

export function importAllReasoningQuestions(confirmation: string) {
  return adminRequest<ReasoningRunResult>(
    '/admin/question-studio/reasoning/import-all',
    {
      method: 'POST',
      body: JSON.stringify({
        packageId: 'REASONING_V1_BLR_001_CP_007',
        confirmation,
      }),
    },
    { fallbackMessage: 'Unable to import the complete BLR corpus.' },
  );
}

export function getReasoningProductionStatus() {
  return adminRequest<ReasoningProductionStatus>(
    '/admin/question-studio/reasoning/status',
    undefined,
    { fallbackMessage: 'Unable to load BLR production status.' },
  );
}
