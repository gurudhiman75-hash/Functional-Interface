import { adminRequest } from '@/lib/admin-request';

export type CurrentAffairsEditorialQueueItem = {
  id: string;
  publicCode: string;
  title: string;
  eventDate: string;
  category: string;
  eventStatus: string;
  authoringStatus: string;
  authoringVersionId: string | null;
  authoringVersionNumber: number | null;
  hindiStatus: string;
  punjabiStatus: string;
  hasOpenConflict: boolean;
  verifiedFactCount: number;
  primarySourceKey: string | null;
  primarySourceName: string | null;
  primarySourceTitle: string | null;
  primarySourceUrl: string | null;
};

export type CurrentAffairsEditorialQueue = {
  items: CurrentAffairsEditorialQueueItem[];
  counts: { total: number; needsEditorial: number; pending: number; ready: number; conflicts: number };
  generatedAt: string;
};

export type CurrentAffairsEditorialDetail = {
  event: {
    id: string;
    publicCode: string;
    canonicalTitle: string;
    canonicalSummary: string;
    importanceReason: string;
    eventDate: string;
    category: string;
    subcategory: string | null;
    eventStatus: string;
    verificationConfidence: number;
    authoringStatus: string;
    authoringVersionId: string | null;
    authoringVersionNumber: number | null;
    authoringVersionStatus: string | null;
    learnerTitle: string | null;
    learnerSummary: string | null;
    learnerOneLiner: string | null;
    authoringMethod: string | null;
    sourceTitleSimilarity: number | null;
    authoringReasons: unknown;
    authoringCreatedAt: string | null;
    eventUpdatedAt: string;
  };
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
  facts: Array<{
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
  conflicts: Array<{
    id: string;
    factKey: string;
    competingValues: unknown;
    status: string;
    preferredValue: string | null;
    resolutionReason: string | null;
    updatedAt: string;
  }>;
  localizations: Array<{
    id: string;
    languageCode: 'hi' | 'pa';
    status: string;
    localizedTitle: string | null;
    localizedSummary: string | null;
    localizedOneLiner: string | null;
    localizationMethod: string;
    qualitySnapshot: unknown;
    reasons: unknown;
    reviewedBy: string | null;
    updatedAt: string;
  }>;
  authoringHistory: Array<{
    id: string;
    versionNumber: number;
    status: string;
    learnerTitle: string | null;
    learnerSummary: string | null;
    learnerOneLiner: string | null;
    authoringMethod: string;
    sourceTitleSimilarity: number;
    reasons: unknown;
    createdAt: string;
  }>;
  gates: { eventVerified: boolean; hasVerifiedFacts: boolean; hasOpenConflict: boolean; authoringCurrent: boolean };
  generatedAt: string;
};

export type CurrentAffairsQuestionPayload = {
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
  sourcePayload: CurrentAffairsQuestionPayload;
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
  hindiPayload: CurrentAffairsQuestionPayload | null;
  punjabiId: string | null;
  punjabiStatus: string | null;
  punjabiPayload: CurrentAffairsQuestionPayload | null;
  promotionId: string | null;
  promotionStatus: string | null;
  activeReleaseId: string | null;
  activeReleaseCode: string | null;
  activeReleaseStatus: string | null;
  hasOpenConflict: boolean;
  readiness: { editable: boolean; approvable: boolean; blockers: string[]; checks: Record<string, boolean> };
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
    payload: CurrentAffairsQuestionPayload;
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

export function getCurrentAffairsEditorialQueue(limit = 200) {
  return adminRequest<CurrentAffairsEditorialQueue>(`/admin/current-affairs/editorial/queue?limit=${limit}`);
}

export function getCurrentAffairsEditorialEvent(eventId: string) {
  return adminRequest<CurrentAffairsEditorialDetail>(`/admin/current-affairs/editorial/events/${encodeURIComponent(eventId)}`);
}

export function saveCurrentAffairsEditorialEnglish(eventId: string, input: { title: string; summary: string; oneLiner: string; reason: string }) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/editorial/events/${encodeURIComponent(eventId)}/english`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function saveCurrentAffairsEditorialLocalization(eventId: string, languageCode: 'hi' | 'pa', input: { title: string; summary: string; oneLiner: string; reason: string }) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/editorial/events/${encodeURIComponent(eventId)}/localization/${languageCode}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getCurrentAffairsQuestionEditorialQueue(limit = 300) {
  return adminRequest<CurrentAffairsQuestionEditorialQueue>(`/admin/current-affairs/question-editorial/queue?limit=${limit}`);
}

export function getCurrentAffairsQuestionEditorialDetail(generationItemId: string) {
  return adminRequest<CurrentAffairsQuestionEditorialDetail>(`/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}`);
}

export function saveCurrentAffairsQuestionEnglish(generationItemId: string, input: { stem: string; explanation: string; reason: string }) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}/english`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function saveCurrentAffairsQuestionLocalization(generationItemId: string, languageCode: 'hi' | 'pa', input: { stem: string; explanation: string; options: string[]; reason: string }) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}/localization/${languageCode}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function approveCurrentAffairsQuestionEditorial(generationItemId: string, reason: string) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/question-editorial/${encodeURIComponent(generationItemId)}/approve`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
