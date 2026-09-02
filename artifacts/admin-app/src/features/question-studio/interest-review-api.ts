import { adminRequest } from '@/lib/admin-request';

export type InterestReviewLanguage = 'en' | 'hi' | 'pa';
export type InterestReviewCheckpointId =
  | 'INT-CP-001' | 'INT-CP-002' | 'INT-CP-003' | 'INT-CP-004' | 'INT-CP-005'
  | 'INT-CP-006' | 'INT-CP-007' | 'INT-CP-008' | 'INT-CP-009' | 'INT-CP-010';

export interface InterestReviewCheckpoint {
  checkpointId: InterestReviewCheckpointId;
  label: string;
  qlIds: string[];
  permanentQlCount: number;
}

export interface InterestReviewQuestion {
  packageId: 'INT-001';
  chapterId: 'INT-001';
  checkpointId: InterestReviewCheckpointId;
  canonicalProblemId: InterestReviewCheckpointId;
  sourceCanonicalProblemId: string;
  qlId: string;
  permanentQlId: string;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: InterestReviewLanguage;
  locale: string;
  difficultyBand: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanationLines: string[];
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  chapterIntegrationAuthority: string;
  seed: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  manualApprovalRequired: true;
}

export interface InterestReviewPackage {
  packageId: 'INT-001';
  chapterId: 'INT-001';
  name: string;
  label: string;
  subject: string;
  topic: string;
  subtopic: string;
  generationDomain: 'quant-v4';
  supportedLanguages: InterestReviewLanguage[];
  permanentQlIds: string[];
  permanentQlCount: number;
  checkpointCount: number;
  checkpoints: InterestReviewCheckpoint[];
  runtimeMode: 'QUESTION_STUDIO_ACTIVE';
  reviewOnly: true;
  questionStudioDiscoverable: true;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  persistenceAllowed: true;
  databaseWriteEnabled: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  integrationAuthority: string;
}

export interface InterestReviewInput {
  language: InterestReviewLanguage;
  checkpointId?: InterestReviewCheckpointId;
  qlId?: string;
  count: number;
  seed?: string;
}

export interface InterestReviewStatus {
  packageId: 'INT-001';
  permanentQlCount: number;
  checkpointCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  chapterIntegrationAuthority: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
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
  checkpointId: InterestReviewCheckpointId | null;
  chapterIntegrationAuthority: string;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: InterestReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.checkpointId) params.set('checkpointId', input.checkpointId);
  if (input.qlId) params.set('qlId', input.qlId);
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
    checkpointCount: number;
    supportedLanguages: InterestReviewLanguage[];
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
    questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
    questionBankWriteEnabled: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>(
    '/admin/question-studio/quant/interest/package',
    undefined,
    { fallbackMessage: 'Unable to load the Interest chapter review package.' },
  );
}

export function previewInterestReview(input: InterestReviewInput) {
  return adminRequest<{
    questions: InterestReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    integrationAuthority: string;
  }>(
    `/admin/question-studio/quant/interest/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Interest questions.' },
  );
}

export function createInterestReviewRun(input: InterestReviewInput) {
  return adminRequest<InterestReviewRunResult>(
    '/admin/question-studio/quant/interest/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Interest chapter review run.' },
  );
}

export function getInterestReviewStatus() {
  return adminRequest<InterestReviewStatus>(
    '/admin/question-studio/quant/interest/status',
    undefined,
    { fallbackMessage: 'Unable to load Interest chapter review status.' },
  );
}
