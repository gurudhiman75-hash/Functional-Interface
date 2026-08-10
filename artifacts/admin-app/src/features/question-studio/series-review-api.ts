import { adminRequest } from '@/lib/admin-request';
import type {
  ReasoningReviewDifficulty,
  ReasoningReviewLanguage,
  ReasoningReviewQuestion,
  ReasoningRunResult,
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
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  bulkSyncSupported: false;
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
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

function paramsFor(input: SeriesReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getSeriesReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'REVIEW_ONLY';
    package: SeriesReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    frozenTemplateCount: number;
    multilingualProofPayloadCount: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/reasoning/series/package',
    undefined,
    { fallbackMessage: 'Unable to load the Series review package.' },
  );
}

export function previewSeriesReview(input: SeriesReviewInput) {
  return adminRequest<{
    questions: ReasoningReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    integrationAuthority: string;
  }>(
    `/admin/question-studio/reasoning/series/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Series questions.' },
  );
}

export function createSeriesReviewRun(input: SeriesReviewInput) {
  return adminRequest<ReasoningRunResult & {
    packageId: 'SER-001';
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/reasoning/series/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Series review run.' },
  );
}

export function getSeriesReviewStatus() {
  return adminRequest<SeriesReviewStatus>(
    '/admin/question-studio/reasoning/series/status',
    undefined,
    { fallbackMessage: 'Unable to load Series review status.' },
  );
}
