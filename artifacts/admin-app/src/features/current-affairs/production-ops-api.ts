import { adminRequest } from '@/lib/admin-request';

export type CurrentAffairsProductionReadiness = {
  targetDate: string;
  deadlineIso: string;
  generatedAt: string;
  evaluation: {
    color: 'green' | 'amber' | 'red';
    learnerReady: boolean;
    draftReady: boolean;
    releaseReady: boolean;
    sourceCoveragePercent: number;
    blockers: string[];
    warnings: string[];
    checks: Record<string, boolean>;
  };
  targetInventory: {
    candidateCount: number;
    primaryCandidateCount: number;
    openClusterCount: number;
    openOtherClusterCount: number;
    eventCount: number;
    verifiedEventCount: number;
    reviewEventCount: number;
    authoringReadyCount: number;
    familyEligible: { ssc: number; banking: number; punjab: number };
  };
  sourceCoverage: {
    scheduledPrimarySources: number;
    freshSuccessfulPrimarySources: number;
    failingPrimarySources: number;
    stalePrimarySources: number;
    criticalSourceFailures: number;
    requiredDomains: string[];
    criticalDomainFailures: string[];
    degradedSourceFamilies: string[];
    unhealthySourceFamilies: string[];
    sourceFamilies: Array<{
      sourceFamily: string;
      coverageDomain: string | null;
      healthy: boolean;
      degraded: boolean;
      endpointCount: number;
      freshSuccessfulEndpointCount: number;
      endpointKeys: string[];
    }>;
    sources: Array<{
      sourceKey: string;
      name: string;
      sourceFamily: string;
      sourceTier: string;
      coverageDomain: string | null;
      fresh: boolean;
      status: string | null;
      lastIngestedAt: string | null;
      error: string | null;
    }>;
    discoverySources: Array<{
      sourceKey: string;
      name: string;
      sourceFamily: string;
      sourceTier: string;
      coverageDomain: string | null;
      contentPolicy: string | null;
      ingestionMode: string;
      scheduled: boolean;
      fresh: boolean;
      status: string | null;
      lastIngestedAt: string | null;
      baseUrl: string | null;
      feedUrl: string | null;
      automationStatus: string | null;
      usagePolicy: string | null;
    }>;
  };
  pipeline: {
    queuedCandidates: number;
    openConflicts: number;
    feedRun: null | { status: string; startedAt: string | null; completedAt: string | null; failureReason: string | null };
    intelligenceRun: null | { status: string; startedAt: string | null; completedAt: string | null; failureReason: string | null };
  };
  families: Array<{
    family: 'ssc' | 'banking' | 'punjab';
    englishDraftPresent: boolean;
    hindiDraftPresent: boolean;
    punjabiDraftPresent: boolean;
    eventCount: number;
    approvedEnglishQuestions: number;
    totalEnglishQuestions: number;
    releaseReady: boolean;
    approvedRelease: boolean;
    learnerQuizPublished: boolean;
    releaseCode: string | null;
    blockers: string[];
  }>;
  missingDays: Array<{ day: string; family: string }>;
};

export type DailyDiscoveryCensus = {
  id: string;
  targetDate: string;
  status: 'draft' | 'review' | 'complete' | 'blocked';
  coverageConfidenceScore: number;
  rawCandidateCount: number;
  distinctSourceCount: number;
  distinctSourceFamilyCount: number;
  officialCandidateCount: number;
  trustedNewsCandidateCount: number;
  specialistCandidateCount: number;
  clusterCount: number;
  unresolvedClusterCount: number;
  eventCount: number;
  verifiedEventCount: number;
  reviewEventCount: number;
  authoringReadyCount: number;
  highPriorityUnresolvedCount: number;
  domainSnapshot: {
    sourceDomains?: Record<string, { registered: number; active: number; automated: number; fresh: number }>;
    eventCategories?: Record<string, { events: number; verified: number }>;
  };
  sourceSnapshot: { sourceTiers?: Record<string, { registered: number; active: number; automated: number; fresh: number }> };
  evidenceSnapshot: { grades?: Record<string, number> };
  blockers: string[];
  warnings: string[];
  generatedAt: string;
};

export type DailyMasterPack = {
  id: string;
  publicCode: string;
  contentDate: string;
  language: string;
  status: string;
  eventCount: number;
  categoryCount: number;
  bodyMarkdown: string;
  payload: unknown;
  renderTargets: string[];
  learningResourceId: string;
  learningResourceStatus: string;
  generatedAt: string;
};

export type CurrentAffairsRecoveryRuns = {
  runs: Array<{
    id: string;
    runKey: string;
    targetDate: string;
    triggerMode: 'scheduled' | 'manual';
    status: string;
    englishBackfillCount: number;
    localizedBackfillCount: number;
    questionLocalizationCount: number;
    actions: unknown;
    failure: string | null;
    startedAt: string;
    completedAt: string | null;
  }>;
  generatedAt: string;
};

export type GenerateYesterdayCurrentAffairsResult = {
  targetDate: string;
  startedAt: string;
  completedAt: string;
  before: { candidateCount: number; eventCount: number; verifiedEventCount: number; reviewEventCount: number };
  after: { candidateCount: number; eventCount: number; verifiedEventCount: number; reviewEventCount: number };
  historicalSourceBackfill?: {
    status: 'completed' | 'skipped_existing' | 'failed';
    targetDate: string;
    existing: number;
    archiveEntries: number;
    created: number;
    updated: number;
    displayedDate: string | null;
    error: string | null;
  };
  officialCandidatePreparation?: {
    targetDate: string;
    candidateExamined: number;
    candidateUpdated: number;
    candidateCategories: Record<string, number>;
    openOtherClustersExamined: number;
    clusterUpdated: number;
    clusterCategories: Record<string, number>;
  };
  discoveryCensus: DailyDiscoveryCensus;
  dailyMasterPack: (DailyMasterPack & { created?: boolean; updated?: boolean; locked?: boolean }) | Record<string, unknown>;
  artifacts: Array<{
    family: string;
    language: string;
    publicCode: string;
    status: string;
    eventCount: number;
    learningResourceId: string;
    title: string;
    learningResourceStatus: string;
    questionRunId: string | null;
  }>;
  summary: {
    allEnglishDraftsPresent: boolean;
    englishDraftCount: number;
    localizedDraftCount: number;
    verifiedEvents: number;
    reviewEvents: number;
    masterPackEventCount: number;
    coverageConfidenceScore: number;
    readinessColor: 'green' | 'amber' | 'red';
    learnerReady: boolean;
    blockers: string[];
    warnings: string[];
  };
  publicationAuthority: false;
  canonicalQuestionPromotion: false;
  automaticStudentPublication: false;
};

export function getCurrentAffairsProductionReadiness() {
  return adminRequest<CurrentAffairsProductionReadiness>('/admin/current-affairs/production/readiness');
}

export function getCurrentAffairsDiscoveryCensus(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return adminRequest<{ targetDate: string; census: DailyDiscoveryCensus | null }>(`/admin/current-affairs/production/discovery-census${suffix}`);
}

export function getCurrentAffairsDailyMasterPack(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return adminRequest<{ targetDate: string; masterPack: DailyMasterPack | null }>(`/admin/current-affairs/production/master-pack${suffix}`);
}

export function currentAffairsDailyMasterTextPath(date: string) {
  return `/api/admin/current-affairs/production/master-pack/text?date=${encodeURIComponent(date)}`;
}

export function getCurrentAffairsRecoveryRuns() {
  return adminRequest<CurrentAffairsRecoveryRuns>('/admin/current-affairs/production/recovery-runs?limit=30');
}

export function generateYesterdayCurrentAffairs() {
  return adminRequest<GenerateYesterdayCurrentAffairsResult>('/admin/current-affairs/production/generate-yesterday', { method: 'POST' });
}

export function runCurrentAffairsProductionRecovery() {
  return adminRequest<Record<string, unknown>>('/admin/current-affairs/production/recover', { method: 'POST' });
}
