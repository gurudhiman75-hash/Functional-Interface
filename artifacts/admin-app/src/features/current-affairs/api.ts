import { adminRequest } from '@/lib/admin-request';

export type CurrentAffairsControlCenter = {
  generatedAt: string;
  health: { level: 'healthy' | 'attention'; sourceFailures: number; automationFailures: number; notificationFailures: number; openConflicts: number };
  sources: { total: number; active: number; scheduled: number; failing: number; primarySources: number; lastIngestedAt: string | null };
  pipeline: {
    queuedCandidates: number;
    openClusters: number;
    reviewEvents: number;
    verifiedEvents: number;
    openConflicts: number;
    authoringNeedsWork: number;
    hindiNeedsWork: number;
    punjabiNeedsWork: number;
    draftCompilations: number;
  };
  releases: { ready: number; blocked: number; approved: number; revoked: number };
  learnerDelivery: { publishedQuizzes: number; activeQuestionPromotions: number; unreadNotifications: number; learnersWithAttempts: number };
  automation: {
    latestRuns: Array<{
      jobType: string;
      status: string;
      startedAt: string | null;
      completedAt: string | null;
      failureReason: string | null;
      sourceCount: number;
      successCount: number;
      failureCount: number;
    }>;
    latestNotificationRun: null | {
      status: string;
      startedAt: string | null;
      completedAt: string | null;
      candidateUserCount: number;
      evaluatedUserCount: number;
      deliveredCount: number;
      suppressedCount: number;
      errorCount: number;
      failure: string | null;
    };
  };
};

export type CurrentAffairsSourceHealth = {
  sources: Array<{
    id: string;
    sourceKey: string;
    name: string;
    sourceType: string;
    contentPolicy: string;
    ingestionMode: string;
    feedUrl: string | null;
    listingUrl: string | null;
    listingAdapter: string | null;
    trustScore: number;
    isPrimarySource: boolean;
    isActive: boolean;
    lastIngestedAt: string | null;
    lastIngestionStatus: string | null;
    lastIngestionError: string | null;
    candidateCount: number;
    queuedCandidateCount: number;
    latestCandidateAt: string | null;
    scheduled: boolean;
  }>;
  summary: { total: number; scheduled: number; failing: number; healthy: number };
  generatedAt: string;
};

export type CurrentAffairsAuthoringQueue = {
  events: Array<{
    id: string;
    publicCode: string;
    currentTitle: string;
    currentSummary: string;
    eventDate: string;
    category: string;
    eventStatus: string;
    authoringStatus: string;
    authoringVersionId: string | null;
    authoringVersionNumber: number | null;
    sourceTitleSimilarity: number | null;
    reasons: unknown;
    primarySourceKey: string | null;
    primarySourceTitle: string | null;
    primarySourceUrl: string | null;
    facts: Array<{ key: string; value: string; type: string; confidence: number }>;
  }>;
  similarityLimit: number;
  generatedAt: string;
};

export type CurrentAffairsLocalizationQueue = {
  events: Array<{
    id: string;
    publicCode: string;
    eventDate: string;
    category: string;
    eventStatus: string;
    authoringStatus: string;
    authoringVersionId: string;
    authoringVersionNumber: number;
    englishTitle: string;
    englishSummary: string;
    localizationId: string | null;
    languageCode: 'hi' | 'pa';
    localizationStatus: string;
    localizedTitle: string | null;
    localizedSummary: string | null;
    reasons: unknown;
    facts: Array<{ key: string; value: string; type: string }>;
  }>;
  requestedLanguage: 'hi' | 'pa';
  generatedAt: string;
};

export type CurrentAffairsReleaseCandidate = {
  key: { periodType: 'daily' | 'weekly' | 'monthly'; periodStart: string; periodEnd: string; examFamily: 'ssc' | 'banking' | 'punjab' | 'railways' | 'general' };
  compilations: Array<{ id: string; publicCode: string; languageCode: 'en' | 'hi' | 'pa'; status: string; eventCount: number; learningResourceStatus: string }>;
  questions: Array<{ generationItemId: string; itemStatus: string; acceptedQuestionId: string | null; hindiLocalizationStatus: string | null; punjabiLocalizationStatus: string | null }>;
  readiness: { ready: boolean; blockers: string[]; checks: Record<string, boolean> };
  sourceFingerprint: string;
  latestRelease: null | { id: string; publicCode: string; releaseVersion: number; status: string; approvedAt: string; revokedAt: string | null };
};

export type CurrentAffairsReleaseQueue = {
  candidates: CurrentAffairsReleaseCandidate[];
  readyCount: number;
  blockedCount: number;
  generatedAt: string;
};

export type CurrentAffairsReleaseHistory = {
  releases: Array<{
    id: string;
    publicCode: string;
    periodType: string;
    periodStart: string;
    periodEnd: string;
    examFamily: string;
    releaseVersion: number;
    status: string;
    approvedAt: string;
    revokedAt: string | null;
    approvalReason?: string | null;
    revocationReason?: string | null;
  }>;
  generatedAt: string;
};

export type CurrentAffairsAutomationRuns = {
  runs: Array<{
    id: string;
    runKey: string;
    jobType: string;
    status: string;
    slotStartedAt: string;
    startedAt: string;
    completedAt: string | null;
    sourceCount: number;
    successCount: number;
    failureCount: number;
    candidateCreatedCount: number;
    candidateUpdatedCount: number;
    clusterCreatedCount: number;
    eventPromotedCount: number;
    eventVerifiedCount: number;
    compilationCreatedCount: number;
    questionCreatedCount: number;
    stats: unknown;
    failureReason: string | null;
  }>;
  generatedAt: string;
};

export function getCurrentAffairsControlCenter() {
  return adminRequest<CurrentAffairsControlCenter>('/admin/current-affairs/control-center');
}

export function getCurrentAffairsSourceHealth() {
  return adminRequest<CurrentAffairsSourceHealth>('/admin/current-affairs/automation/source-health');
}

export function pullCurrentAffairsSource(sourceKey: string) {
  return adminRequest<Record<string, unknown>>(`/admin/current-affairs/ingestion/pull/${encodeURIComponent(sourceKey)}`, { method: 'POST' });
}

export function getCurrentAffairsAuthoringQueue(status = 'needs_editorial') {
  return adminRequest<CurrentAffairsAuthoringQueue>(`/admin/current-affairs/authoring/queue?status=${encodeURIComponent(status)}&limit=100`);
}

export function getCurrentAffairsLocalizationQueue(languageCode: 'hi' | 'pa') {
  return adminRequest<CurrentAffairsLocalizationQueue>(`/admin/current-affairs/localization/queue?languageCode=${languageCode}&limit=100`);
}

export function getCurrentAffairsReleaseQueue() {
  return adminRequest<CurrentAffairsReleaseQueue>('/admin/current-affairs/release-control/queue?limit=100');
}

export function getCurrentAffairsReleaseHistory() {
  return adminRequest<CurrentAffairsReleaseHistory>('/admin/current-affairs/release-control/history?limit=100');
}

export function approveCurrentAffairsRelease(candidate: CurrentAffairsReleaseCandidate, reason: string) {
  return adminRequest<{ release: { id: string; publicCode: string; status: string } }>('/admin/current-affairs/release-control/approve', {
    method: 'POST',
    body: JSON.stringify({ ...candidate.key, reason }),
  });
}

export function revokeCurrentAffairsRelease(releaseId: string, reason: string) {
  return adminRequest<{ release: { id: string; publicCode: string; status: string } }>(`/admin/current-affairs/release-control/${encodeURIComponent(releaseId)}/revoke`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function getCurrentAffairsAutomationRuns() {
  return adminRequest<CurrentAffairsAutomationRuns>('/admin/current-affairs/automation/runs?limit=100');
}
