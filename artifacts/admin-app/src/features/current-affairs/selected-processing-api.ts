import { adminRequest } from '@/lib/admin-request';

export type CurrentAffairsSelectedProcessingItem = {
  eventId: string | null;
  publicCode: string | null;
  title: string;
  selectedCandidateIds: string[];
  selectedHeadlineCount: number;
  eventStatus: string | null;
  authoringStatus: string | null;
  hindiStatus: string | null;
  punjabiStatus: string | null;
  verifiedFactCount: number;
  officialEvidenceCount: number;
  supportedOfficialEvidenceCount: number;
  blockers: string[];
  stage: 'ready' | 'event_linking' | 'verification' | 'english' | 'localization';
  ready: boolean;
};

export type CurrentAffairsSelectedProcessingResult = {
  processingVersion?: string;
  targetDate: string;
  startedAt: string;
  completedAt: string;
  selectedHeadlineCount: number;
  selectedEventCount: number;
  summary: {
    selected: number;
    verified: number;
    ready: number;
    blocked: number;
    verificationBlocked?: number;
    englishBlocked?: number;
    localizationBlocked?: number;
  };
  items: CurrentAffairsSelectedProcessingItem[];
  packPreviewScope?: string;
  packPreviewNote?: string;
  canonicalApprovalAuthority: false;
  publicationAuthority: false;
  questionBankPromotionAuthority: false;
};

type CurrentAffairsSelectedProcessingRun = {
  runId: string;
  targetDate: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  stage: string;
  failure: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
  reused?: boolean;
  result: CurrentAffairsSelectedProcessingResult | null;
};

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_MS = 45 * 60 * 1000;
const MAX_TRANSIENT_POLL_FAILURES = 5;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function readProcessingRun(runId: string) {
  return adminRequest<CurrentAffairsSelectedProcessingRun>(
    `/admin/current-affairs/editorial/headlines/process-selected/${encodeURIComponent(runId)}`,
  );
}

export async function processCurrentAffairsSelected(date: string) {
  const initial = await adminRequest<CurrentAffairsSelectedProcessingRun>('/admin/current-affairs/editorial/headlines/process-selected', {
    method: 'POST',
    body: JSON.stringify({ date }),
  });

  if (initial.status === 'completed' && initial.result) return initial.result;
  if (initial.status === 'failed') {
    throw new Error(initial.failure || 'Selected Current Affairs processing failed before it started.');
  }

  const startedPollingAt = Date.now();
  let transientFailures = 0;
  while (Date.now() - startedPollingAt < MAX_POLL_MS) {
    await sleep(POLL_INTERVAL_MS);
    try {
      const run = await readProcessingRun(initial.runId);
      transientFailures = 0;
      if (run.status === 'completed') {
        if (!run.result) throw new Error('Selected Current Affairs processing completed without a result payload.');
        return run.result;
      }
      if (run.status === 'failed') {
        throw new Error(run.failure || 'Selected Current Affairs processing failed.');
      }
    } catch (error) {
      if (error instanceof Error && !/Failed to fetch|NetworkError|network request/i.test(error.message)) throw error;
      transientFailures += 1;
      if (transientFailures >= MAX_TRANSIENT_POLL_FAILURES) throw error;
    }
  }

  throw new Error('Selected Current Affairs processing is still running after 45 minutes. Retry the action to reconnect to the active run.');
}
