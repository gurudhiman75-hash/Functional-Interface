import { adminRequest } from '@/lib/admin-request';
import type {
  ReasoningReviewDifficulty,
  ReasoningReviewLanguage,
  ReasoningReviewQuestion,
  ReasoningRunResult,
} from './reasoning-review-api';

export interface CalendarReviewPackage {
  packageId: 'CAL-001';
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: ReasoningReviewLanguage[];
  supportedDifficulties: ReasoningReviewDifficulty[];
  runtimeMode: string;
  releaseAuthority: string;
  bulkSyncSupported: false;
  totalFrozenRecords: null;
}

export interface CalendarReviewInput {
  language: ReasoningReviewLanguage;
  qlId?: string;
  difficulty?: ReasoningReviewDifficulty;
  count: number;
  seed?: string;
}

export interface CalendarProductionStatus {
  packageId: 'CAL-001';
  permanentQlCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  releaseAuthority: string;
  bulkSyncSupported: false;
  automaticStudentPublication: false;
}

function paramsFor(input: CalendarReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getCalendarReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'PRODUCTION_REVIEW';
    package: CalendarReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/reasoning/calendar/package',
    undefined,
    { fallbackMessage: 'Unable to load Calendar production package.' },
  );
}

export function previewCalendarReview(input: CalendarReviewInput) {
  return adminRequest<{
    questions: ReasoningReviewQuestion[];
    productionEligible: true;
    releaseAuthority: string;
  }>(
    `/admin/question-studio/reasoning/calendar/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Calendar questions.' },
  );
}

export function createCalendarReviewRun(input: CalendarReviewInput) {
  return adminRequest<ReasoningRunResult & { packageId: 'CAL-001' }>(
    '/admin/question-studio/reasoning/calendar/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Calendar review run.' },
  );
}

export function getCalendarProductionStatus() {
  return adminRequest<CalendarProductionStatus>(
    '/admin/question-studio/reasoning/calendar/status',
    undefined,
    { fallbackMessage: 'Unable to load Calendar production status.' },
  );
}
