import { adminRequest } from '@/lib/admin-request';
import { createGenerationRun } from './api';
import type {
  ReasoningReviewDifficulty,
  ReasoningReviewLanguage,
  ReasoningReviewQuestion,
} from './reasoning-review-api';

export interface SeriesReviewPackage {
  packageId: 'SER-001';
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: ReasoningReviewLanguage[];
  supportedDifficulties: ReasoningReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  frozenTemplateCount: number;
  multilingualProofPayloadCount: number;
  reviewOnly: false;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankWritable: true;
  questionBankAcceptanceMode: 'FULL_RELEASE';
  testEligibility: 'ELIGIBLE';
  testEligible: true;
  testBuilderEligible: true;
  mockTestEligible: false;
  publiclyPublishable: true;
  publicReleaseAuthorized: false;
  studentDeliveryAuthorized: false;
  automaticStudentPublication: false;
}

export interface SeriesReviewInput {
  language: ReasoningReviewLanguage;
  qlId?: string;
  difficulty?: ReasoningReviewDifficulty;
  count: number;
  seed?: string;
}

export interface SeriesReviewStatus {
  packageId: 'SER-001';
  permanentQlCount: number;
  frozenTemplateCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  sourceReviewAuthority: string;
  reviewOnly: false;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankWritable: true;
  questionBankAcceptanceMode: 'FULL_RELEASE';
  manualApprovalRequired: true;
  manualQuestionPublicationRequired: true;
  testEligibility: 'ELIGIBLE';
  testEligible: true;
  testBuilderEligible: true;
  mockTestEligible: false;
  publiclyPublishable: true;
  publicReleaseAuthorized: false;
  studentDeliveryAuthorized: false;
  automaticStudentPublication: false;
  nextGate: string;
}

function paramsFor(input: SeriesReviewInput) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getSeriesReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'ACTIVE_INTERNAL_TEST_BUILDER';
    package: SeriesReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    frozenTemplateCount: number;
    multilingualProofPayloadCount: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankWriteEnabled: true;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    testEligible: true;
    testBuilderEligible: true;
    mockTestEligible: false;
    publicReleaseAuthorized: false;
    studentDeliveryAuthorized: false;
  }>(
    '/admin/question-studio/reasoning/series/package',
    undefined,
    { fallbackMessage: 'Unable to load the Series package.' },
  );
}

export function previewSeriesReview(input: SeriesReviewInput) {
  return adminRequest<{
    questions: ReasoningReviewQuestion[];
    productionEligible: true;
    reviewOnly: false;
    activationAuthority: string;
    questionBankWritable: true;
    testEligible: true;
    testBuilderEligible: true;
    mockTestEligible: false;
    publicReleaseAuthorized: false;
    studentDeliveryAuthorized: false;
  }>(
    `/admin/question-studio/reasoning/series/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Series questions.' },
  );
}

export function createSeriesReviewRun(input: SeriesReviewInput) {
  return createGenerationRun({
    exam: 'General Competitive Exams',
    subject: 'Reasoning Ability',
    difficulty: input.difficulty ?? 'Mixed',
    count: input.count,
    packageId: 'SER-001',
    canonicalProblemId: input.qlId,
    topic: 'Reasoning',
    subtopic: 'Series',
    language: input.language,
    seed: input.seed,
  });
}

export function getSeriesReviewStatus() {
  return adminRequest<SeriesReviewStatus>(
    '/admin/question-studio/reasoning/series/status',
    undefined,
    { fallbackMessage: 'Unable to load Series status.' },
  );
}
