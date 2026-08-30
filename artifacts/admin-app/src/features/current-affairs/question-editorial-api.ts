import { adminRequest } from '@/lib/admin-request';

export type QuestionPayload = {
  text?: string;
  stem?: string;
  explanation?: string;
  options?: string[];
  correctIndex?: number;
  canonicalAnswer?: string;
  language?: string;
  generationContext?: Record<string, unknown>;
  provenance?: Record<string, unknown>;
  [key: string]: unknown;
};

export type QuestionEditorialReadiness = {
  editable: boolean;
  approvable: boolean;
  blockers: string[];
  checks: Record<string, boolean>;
};

export type CurrentAffairsQuestionEditorialItem = {
  generationItemId: string;
  itemNumber: number;
  generationItemStatus: string;
  currentVersionNumber: number;
  acceptedQuestionId: string | null;
  acceptedQuestionVersionId: string | null;
  generationRunId: string;
  generationRunCode: string;
  generationRunStatus: string;
  currentSourceGenerationVersionId: string;
  sourceVersionNumber: number;
  sourcePayload: QuestionPayload;
  providerItemId: string | null;
  eventId: string;
  eventPublicCode: string;
  eventTitle: string;
  eventDate: string;
  category: string;
  eventStatus: string;
  factId: string | null;
  factKey: string;
  questionFamily: string;
  factValue: string;
  factType: string | null;
  factConfidence: number | null;
  factReconciliationStatus: string | null;
  factSupportCount: number | null;
  factPrimarySupportCount: number | null;
  hindiId: string | null;
  hindiStatus: string | null;
  hindiGenerationItemId: string | null;
  hindiSourceGenerationVersionId: string | null;
  hindiPayload: QuestionPayload | null;
  hindiQualitySnapshot: unknown;
  hindiReasons: unknown;
  hindiUpdatedAt: string | null;
  punjabiId: string | null;
  punjabiStatus: string | null;
  punjabiGenerationItemId: string | null;
  punjabiSourceGenerationVersionId: string | null;
  punjabiPayload: QuestionPayload | null;
  punjabiQualitySnapshot: unknown;
  punjabiReasons: unknown;
  punjabiUpdatedAt: string | null;
  promotionId: string | null;
  promotionStatus: string | null;
  activeReleaseId: string | null;
  activeReleaseCode: string | null;
  activeReleaseStatus: string | null;
  hasOpenConflict: boolean;
  readiness: QuestionEditorialReadiness;
};

export type CurrentAffairsQuestionEditorialQueue = {
  items: CurrentAffairsQuestionEditorialItem[];
  counts: { total: number; unreviewed: number; approvable: number; approved: number; locked: number };
  generatedAt: string;
};

export type CurrentAffairsQuestionEditorialDetail = {
  item: CurrentAffairsQuestionEditorialItem;
  sources: Array<{
    sourceKey: string;
    sourceName: string;
    trustScore: number;
    sourceUrl: string;
    sourceTitle: string;
    sourcePublishedAt: string | null;
    isPrimaryEvidence: boolean;
    evidenceConfidence: number;
  }>;
  eventFacts: Array<{
    id: string;
    factKey: string;
    factValue: string;
    factType: string;
    isVerified: boolean;
    confidence: number;
    reconciliationStatus: string;
    supportCount: number;
    primarySupportCount: number;
    sortOrder: number;
  }>;
  versionHistory: Array<{
    id: string;
    versionNumber: number;
    payload: QuestionPayload;
    providerItemId: string | null;
    createdAt: string;
  }>;
  releaseHistory: Array<{
    id: string;
    publicCode: string;
    status: string;
    releaseVersion: number;
    approvedAt: string;
    revokedAt: string | null;
  }>;
  generatedAt: string;
};

export function getCurrentAffairsQuestionEditorialQueue(limit = 100) {
  return adminRequest<CurrentAffairsQuestionEditorialQueue>(`/admin/current-affairs/question-editorial/queue?limit=${limit}`);
}

export function getCurrentAffairsQuestionEditorialDetail(generationItemId: string) {
  return adminRequest<CurrentAffairsQuestionEditorialDetail>(
    `/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}`,
  );
}

export function saveCurrentAffairsEnglishQuestionRevision(
  generationItemId: string,
  input: { stem: string; explanation: string; reason: string },
) {
  return adminRequest<Record<string, unknown>>(
    `/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}/english`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function saveCurrentAffairsQuestionLocalization(
  generationItemId: string,
  languageCode: 'hi' | 'pa',
  input: { stem: string; explanation: string; options: string[]; reason: string },
) {
  return adminRequest<Record<string, unknown>>(
    `/admin/current-affairs/question-localization/${encodeURIComponent(generationItemId)}/${languageCode}/manual`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function approveCurrentAffairsQuestion(generationItemId: string, reason: string) {
  return adminRequest<Record<string, unknown>>(
    `/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}/approve`,
    { method: 'POST', body: JSON.stringify({ reason }) },
  );
}
