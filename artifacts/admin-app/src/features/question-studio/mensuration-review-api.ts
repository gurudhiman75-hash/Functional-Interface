import { adminRequest } from '@/lib/admin-request';

export type MensurationReviewLanguage = 'en' | 'hi' | 'pa';
export type MensurationReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface MensurationReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: MensurationReviewLanguage;
  locale: string;
  difficultyBand: MensurationReviewDifficulty;
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
    fourDistinctOptions: boolean;
    exactlyOneCorrect: boolean;
    teachingStepsPresent: boolean;
    completeCalculation: boolean;
    sourceValidationPassed: boolean;
    sourceVerificationPassed: boolean;
    sourceLifecycleLocked: boolean;
    punjabiSurfaceOrthographyLocked: boolean;
  };
}

export interface MensurationReviewPackage {
  packageId: 'MEN-002';
  checkpointId: 'MEN-CP-009';
  label: string;
  qlIds: string[];
  supportedLanguages: MensurationReviewLanguage[];
  supportedDifficulties: MensurationReviewDifficulty[];
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
}

export interface MensurationReviewInput {
  language: MensurationReviewLanguage;
  qlId?: string;
  difficulty?: MensurationReviewDifficulty;
  count: number;
  seed?: string;
}

export interface MensurationReviewStatus {
  packageId: 'MEN-002';
  checkpointId: 'MEN-CP-009';
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

function paramsFor(input: MensurationReviewInput) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getMensurationReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'REVIEW_ONLY';
    package: MensurationReviewPackage;
  }>('/admin/question-studio/quant/mensuration/cp009/package', undefined, {
    fallbackMessage: 'Unable to load MEN-CP-009 review package.',
  });
}

export function previewMensurationReview(input: MensurationReviewInput) {
  return adminRequest<{
    questions: MensurationReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
  }>(`/admin/question-studio/quant/mensuration/cp009/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview MEN-CP-009 questions.',
  });
}

export function createMensurationReviewRun(input: MensurationReviewInput) {
  return adminRequest<{
    id: string | null;
    publicCode: string | null;
    status: string;
    itemCount: number;
    generationSystem: 'quant-v4';
    packageId: 'MEN-002';
    checkpointId: 'MEN-CP-009';
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>('/admin/question-studio/quant/mensuration/cp009/runs', {
    method: 'POST',
    body: JSON.stringify(input),
  }, { fallbackMessage: 'Unable to create MEN-CP-009 review run.' });
}

export function getMensurationReviewStatus() {
  return adminRequest<MensurationReviewStatus>(
    '/admin/question-studio/quant/mensuration/cp009/status',
    undefined,
    { fallbackMessage: 'Unable to load MEN-CP-009 review status.' },
  );
}
