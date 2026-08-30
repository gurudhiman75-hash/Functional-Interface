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
  sourceCoverage: {
    scheduledPrimarySources: number;
    freshSuccessfulPrimarySources: number;
    failingPrimarySources: number;
    stalePrimarySources: number;
    criticalSourceFailures: number;
    sources: Array<{ sourceKey: string; name: string; fresh: boolean; status: string | null; lastIngestedAt: string | null; error: string | null }>;
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

export function getCurrentAffairsProductionReadiness() {
  return adminRequest<CurrentAffairsProductionReadiness>('/admin/current-affairs/production/readiness');
}

export function getCurrentAffairsRecoveryRuns() {
  return adminRequest<CurrentAffairsRecoveryRuns>('/admin/current-affairs/production/recovery-runs?limit=30');
}

export function runCurrentAffairsProductionRecovery() {
  return adminRequest<Record<string, unknown>>('/admin/current-affairs/production/recover', { method: 'POST' });
}
