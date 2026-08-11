import { adminRequest } from '@/lib/admin-request';

export type InterestReviewLanguage = 'hi' | 'pa';
export type InterestReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterestReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: InterestReviewLanguage;
  locale: string;
  difficultyBand: InterestReviewDifficulty;
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
    frozenAuthority: boolean;
    decimalFree: boolean;
    formulaFirst: boolean;
    completeCalculation: boolean;
    optionFeedbackSuppressed: boolean;
    sourceLifecycleLocked: boolean;
  };
}

export interface InterestReviewPackage {
  packageId: 'INT-001';
  checkpointId: 'INT-CP-004';
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: InterestReviewLanguage[];
  supportedDifficulties: InterestReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  integrationAuthority: string;
  frozenQlCount: number;
  approvedReviewPayloadCount: number;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  bulkSyncSupported: false;
  englishStatus: 'NOT_REGISTERED_FROM_HISTORICAL_FREEZE';
}

export interface InterestReviewInput {
  language: InterestReviewLanguage;
  qlId?: string;
  difficulty?: InterestReviewDifficulty;
  count: number;
  seed?: string;
}

export interface InterestReviewStatus {
  packageId: 'INT-001';
  checkpointId: 'INT-CP-004';
  permanentQlCount: number;
  approvedReviewPayloadCount: number;
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
}

export interface InterestReviewRunResult {
  id: string | null;
  publicCode: string | null;
  status: string;
  itemCount: number;
  generationSystem: 'quant-v4';
  packageId: 'INT-001';
  checkpointId: 'INT-CP-004';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: InterestReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getInterestReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'REVIEW_ONLY';
    package: InterestReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    approvedReviewPayloadCount: number;
    supportedLanguages: InterestReviewLanguage[];
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
    questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/quant/interest/cp004/package',
    undefined,
    { fallbackMessage: 'Unable to load the Interest CP-004 review package.' },
  );
}

export function previewInterestReview(input: InterestReviewInput) {
  return adminRequest<{
    questions: InterestReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    integrationAuthority: string;
  }>(
    `/admin/question-studio/quant/interest/cp004/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Interest CP-004 questions.' },
  );
}

export function createInterestReviewRun(input: InterestReviewInput) {
  return adminRequest<InterestReviewRunResult>(
    '/admin/question-studio/quant/interest/cp004/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Interest CP-004 review run.' },
  );
}

export function getInterestReviewStatus() {
  return adminRequest<InterestReviewStatus>(
    '/admin/question-studio/quant/interest/cp004/status',
    undefined,
    { fallbackMessage: 'Unable to load Interest CP-004 review status.' },
  );
}
