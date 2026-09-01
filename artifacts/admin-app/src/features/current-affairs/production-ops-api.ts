import { getFirebaseAuth } from '@/integrations/firebase';
import { adminRequest } from '@/lib/admin-request';

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

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

export type DailyMasterPackLanguage = 'en' | 'hi' | 'pa';

export type DailyMasterPack = {
  id: string;
  publicCode: string;
  contentDate: string;
  language: DailyMasterPackLanguage;
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

export type DailyMasterPackSet = Record<DailyMasterPackLanguage, DailyMasterPack | null>;

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
  dailyMasterPacks?: {
    en: Record<string, unknown>;
    hi: Record<string, unknown>;
    pa: Record<string, unknown>;
    allLocalizedParityReady: boolean;
  };
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
    localizedMasterPackCount?: number;
    localizedMasterPacksParityReady?: boolean;
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

export type CurrentAffairsMasterPackArtifact = 'text' | 'pdf';

export type CurrentAffairsMasterPackDownload = {
  filename: string;
  bytes: number;
  contentType: string;
};

export function getCurrentAffairsProductionReadiness() {
  return adminRequest<CurrentAffairsProductionReadiness>('/admin/current-affairs/production/readiness');
}

export function getCurrentAffairsDiscoveryCensus(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return adminRequest<{ targetDate: string; census: DailyDiscoveryCensus | null }>(`/admin/current-affairs/production/discovery-census${suffix}`);
}

export function getCurrentAffairsDailyMasterPack(date?: string, language: DailyMasterPackLanguage = 'en') {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  params.set('lang', language);
  return adminRequest<{ targetDate: string; language: DailyMasterPackLanguage; masterPack: DailyMasterPack | null }>(
    `/admin/current-affairs/production/master-pack?${params.toString()}`,
  );
}

export function getCurrentAffairsDailyMasterPacks(date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return adminRequest<{ targetDate: string; masterPacks: DailyMasterPackSet }>(
    `/admin/current-affairs/production/master-packs${suffix}`,
  );
}

export function currentAffairsDailyMasterTextPath(date: string, language: DailyMasterPackLanguage = 'en') {
  return `/api/admin/current-affairs/production/master-pack/text?date=${encodeURIComponent(date)}&lang=${language}`;
}

export function currentAffairsDailyMasterPdfPath(date: string, language: DailyMasterPackLanguage = 'en') {
  return `/api/admin/current-affairs/production/master-pack/pdf?date=${encodeURIComponent(date)}&lang=${language}`;
}

function artifactEndpoint(date: string, artifact: CurrentAffairsMasterPackArtifact, language: DailyMasterPackLanguage) {
  return `${apiBase}/admin/current-affairs/production/master-pack/${artifact}?date=${encodeURIComponent(date)}&lang=${language}`;
}

function fallbackArtifactFilename(
  date: string,
  artifact: CurrentAffairsMasterPackArtifact,
  language: DailyMasterPackLanguage,
) {
  const languageSuffix = language === 'en' ? '' : `-${language}`;
  return `examtree-current-affairs-${date}${languageSuffix}.${artifact === 'pdf' ? 'pdf' : 'md'}`;
}

function dispositionFilename(disposition: string | null, fallback: string) {
  if (!disposition) return fallback;
  const utf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utf8) {
    try { return decodeURIComponent(utf8.replace(/^"|"$/g, '')); } catch { return utf8; }
  }
  return disposition.match(/filename="([^"]+)"/i)?.[1]
    ?? disposition.match(/filename=([^;]+)/i)?.[1]?.trim()
    ?? fallback;
}

export async function downloadCurrentAffairsMasterPackArtifact(
  date: string,
  artifact: CurrentAffairsMasterPackArtifact,
  language: DailyMasterPackLanguage = 'en',
): Promise<CurrentAffairsMasterPackDownload> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');

  const response = await fetch(artifactEndpoint(date, artifact, language), {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Current Affairs ${artifact.toUpperCase()} download failed (${response.status}).`);
  }

  const blob = await response.blob();
  const filename = dispositionFilename(
    response.headers.get('Content-Disposition'),
    fallbackArtifactFilename(date, artifact, language),
  );
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

  return {
    filename,
    bytes: blob.size,
    contentType: blob.type || response.headers.get('Content-Type') || 'application/octet-stream',
  };
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
