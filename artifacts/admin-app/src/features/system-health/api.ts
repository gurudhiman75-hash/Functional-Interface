import { getFirebaseAuth } from '@/integrations/firebase';

export type SystemHealthLevel = 'healthy' | 'degraded' | 'critical' | 'unknown';

export interface SystemHealthComponent {
  key: string;
  name: string;
  level: SystemHealthLevel;
  summary: string;
  lastSignalAt: string | null;
}

export interface OperationalJobAssessment {
  level: SystemHealthLevel;
  stale: boolean;
  issue: string | null;
}

export interface OperationalJobAttempt {
  id: string;
  jobId: string;
  attemptNumber: number;
  workerId: string;
  startedAt: string;
  completedAt: string | null;
  errorClass: string | null;
  errorMessage: string | null;
  retryable: string | null;
  providerMetadata: unknown;
}

export interface OperationalJobLog {
  id: string;
  jobId: string;
  jobAttemptId: string | null;
  level: string;
  message: string;
  context: unknown;
  createdAt: string;
}

export interface OperationalJob {
  id: string;
  jobType: string;
  status: string;
  priority: string;
  ownerUserId: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  progressPercent: number;
  attempts: number;
  maxAttempts: number;
  scheduledAt: string;
  lockedAt: string | null;
  lockedBy: string | null;
  heartbeatAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  assessment: OperationalJobAssessment;
  attemptRecordCount: number;
  logRecordCount: number;
  latestAttempt: OperationalJobAttempt | null;
  latestLog: OperationalJobLog | null;
  payload?: unknown;
  result?: unknown;
}

export type OperationalJobDetail = Omit<OperationalJob, 'attempts' | 'attemptRecordCount' | 'logRecordCount' | 'latestAttempt' | 'latestLog'> & {
  attempts: OperationalJobAttempt[];
  logs: OperationalJobLog[];
};

export interface OperationalErrorEvent {
  id: string;
  source: string;
  severity: 'warning' | 'error' | 'critical';
  occurredAt: string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
}

export interface GenerationHealthRun {
  id: string;
  publicCode: string;
  status: string;
  attemptNumber: number;
  provider: string | null;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  estimatedCostPaise: number | null;
  actualCostPaise: number | null;
  failureReason: string | null;
  pausedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requestSnapshot: unknown;
  itemCount: number;
  approvedItemCount: number;
  needsFixItemCount: number;
  rejectedItemCount: number;
}

export interface ValidationHealthRun {
  id: string;
  entityType: string;
  entityVersionId: string;
  profileKey: string;
  engineVersion: string;
  result: string;
  score: number | null;
  startedAt: string;
  completedAt: string | null;
  checks: unknown;
}

export interface OutboxHealthEvent {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: unknown;
  occurredAt: string;
  availableAt: string;
  publishedAt: string | null;
  attempts: number;
  lastError: string | null;
}

export interface SystemHealthOverview {
  summary: {
    level: SystemHealthLevel;
    headline: string;
    reasons: string[];
  };
  generatedAt: string;
  process: {
    environment: string;
    nodeVersion: string;
    uptimeSeconds: number;
    memory: unknown;
  };
  database: {
    status: string;
    latencyMs: number;
    databaseTime: string | null;
  };
  worker: {
    state: 'active' | 'idle' | 'not_observed';
    lastSignalAt: string | null;
    signalAgeMinutes: number | null;
    note: string | null;
  };
  metrics: {
    totalJobs: number;
    queuedJobs: number;
    runningJobs: number;
    staleJobs: number;
    failedJobs24h: number;
    failedGeneration24h: number;
    failedValidation24h: number;
    pendingOutbox: number;
    oldestPendingOutboxAt: string | null;
    oldestPendingOutboxAgeMinutes: number | null;
    errorCount24h: number;
  };
  components: SystemHealthComponent[];
  jobs: OperationalJob[];
  pipelines: {
    generationRuns: GenerationHealthRun[];
    validationRuns: ValidationHealthRun[];
    outboxEvents: OutboxHealthEvent[];
  };
  errors: OperationalErrorEvent[];
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `System Health request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('System Health returned an empty response.');
  return body;
}

export function getSystemHealthOverview() {
  return request<SystemHealthOverview>('/admin/system-health/overview');
}

export function getOperationalJob(jobId: string) {
  return request<{ job: OperationalJobDetail; generatedAt: string }>(
    `/admin/system-health/jobs/${encodeURIComponent(jobId)}`,
  );
}

export function performOperationalJobAction(input: {
  jobId: string;
  action: 'retry' | 'cancel';
  reason: string;
}) {
  return request<{ job: OperationalJobDetail; action: string; updatedAt: string }>(
    `/admin/system-health/jobs/${encodeURIComponent(input.jobId)}/actions`,
    { method: 'POST', body: JSON.stringify({ action: input.action, reason: input.reason }) },
  );
}
