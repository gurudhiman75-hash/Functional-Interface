export type SystemHealthLevel = "healthy" | "degraded" | "critical" | "unknown";
export type OperationalJobAction = "retry" | "cancel";

export type OperationalJobSnapshot = {
  status: string;
  scheduledAt?: string | Date | null;
  heartbeatAt?: string | Date | null;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  lastError?: string | null;
};

export type JobHealthAssessment = {
  level: SystemHealthLevel;
  stale: boolean;
  issue: string | null;
};

export type SystemHealthSignals = {
  databaseOk: boolean;
  databaseLatencyMs: number | null;
  staleJobCount: number;
  failedJobCount24h: number;
  failedGenerationCount24h: number;
  failedValidationCount24h: number;
  pendingOutboxCount: number;
  oldestPendingOutboxAgeMinutes: number | null;
  errorCount24h: number;
};

export type SystemHealthSummary = {
  level: SystemHealthLevel;
  headline: string;
  reasons: string[];
};

export class SystemHealthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "SystemHealthError";
  }
}

const SENSITIVE_KEY = /(authorization|cookie|credential|password|passwd|secret|token|api[_-]?key|private[_-]?key|client[_-]?secret|firebase[_-]?uid)/i;
const MAX_REDACTION_DEPTH = 6;
const MAX_ARRAY_ITEMS = 100;
const MAX_OBJECT_KEYS = 100;
const MAX_TEXT_LENGTH = 4_000;

function timestamp(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function ageMinutes(value: string | Date | null | undefined, nowMs: number): number | null {
  const parsed = timestamp(value);
  if (parsed === null) return null;
  return Math.max(0, (nowMs - parsed) / 60_000);
}

export function assessOperationalJob(
  job: OperationalJobSnapshot,
  nowMs = Date.now(),
): JobHealthAssessment {
  const status = String(job.status || "unknown").toLowerCase();
  if (status === "failed") {
    return { level: "degraded", stale: false, issue: redactOperationalText(job.lastError || "Job failed.") };
  }
  if (status === "running") {
    const heartbeatAge = ageMinutes(job.heartbeatAt, nowMs);
    const startedAge = ageMinutes(job.startedAt, nowMs);
    const stale = heartbeatAge !== null ? heartbeatAge > 5 : (startedAge ?? 0) > 15;
    return stale
      ? { level: "critical", stale: true, issue: "Running job heartbeat is stale." }
      : { level: "healthy", stale: false, issue: null };
  }
  if (status === "queued" || status === "retrying") {
    const scheduledAge = ageMinutes(job.scheduledAt, nowMs);
    const stale = (scheduledAge ?? 0) > 15;
    return stale
      ? { level: "degraded", stale: true, issue: "Queued job has not been claimed within 15 minutes." }
      : { level: "healthy", stale: false, issue: null };
  }
  if (status === "completed" || status === "cancelled") {
    return { level: "healthy", stale: false, issue: null };
  }
  return { level: "unknown", stale: false, issue: "Unknown job status." };
}

export function deriveSystemHealth(signals: SystemHealthSignals): SystemHealthSummary {
  const reasons: string[] = [];
  if (!signals.databaseOk) {
    return {
      level: "critical",
      headline: "Database dependency is unavailable",
      reasons: ["The canonical database health probe failed."],
    };
  }
  if ((signals.databaseLatencyMs ?? 0) > 1_500) {
    reasons.push("Database latency exceeds 1.5 seconds.");
  }
  if (signals.staleJobCount > 0) {
    reasons.push(`${signals.staleJobCount} background job${signals.staleJobCount === 1 ? " is" : "s are"} stale.`);
  }
  if (signals.oldestPendingOutboxAgeMinutes !== null && signals.oldestPendingOutboxAgeMinutes > 30) {
    reasons.push("The oldest unpublished outbox event is more than 30 minutes old.");
  }
  if (signals.staleJobCount > 0 || (signals.databaseLatencyMs ?? 0) > 1_500 || (signals.oldestPendingOutboxAgeMinutes ?? 0) > 30) {
    return { level: "critical", headline: "Operational intervention required", reasons };
  }

  if ((signals.databaseLatencyMs ?? 0) > 500) reasons.push("Database latency exceeds 500 ms.");
  if (signals.failedJobCount24h > 0) reasons.push(`${signals.failedJobCount24h} job failure${signals.failedJobCount24h === 1 ? "" : "s"} occurred in 24 hours.`);
  if (signals.failedGenerationCount24h > 0) reasons.push(`${signals.failedGenerationCount24h} generation failure${signals.failedGenerationCount24h === 1 ? "" : "s"} occurred in 24 hours.`);
  if (signals.failedValidationCount24h > 0) reasons.push(`${signals.failedValidationCount24h} validation failure${signals.failedValidationCount24h === 1 ? "" : "s"} occurred in 24 hours.`);
  if (signals.oldestPendingOutboxAgeMinutes !== null && signals.oldestPendingOutboxAgeMinutes > 10) reasons.push("Unpublished outbox events are delayed more than 10 minutes.");
  if (signals.errorCount24h > 0 && reasons.length === 0) reasons.push(`${signals.errorCount24h} operational error${signals.errorCount24h === 1 ? "" : "s"} occurred in 24 hours.`);
  if (reasons.length > 0) return { level: "degraded", headline: "Operational degradation detected", reasons };
  return { level: "healthy", headline: "Canonical services are within configured thresholds", reasons: [] };
}

export function redactOperationalText(value: unknown): string {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const truncated = raw.length > MAX_TEXT_LENGTH ? `${raw.slice(0, MAX_TEXT_LENGTH)}…` : raw;
  return truncated
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\b(Basic)\s+[A-Za-z0-9+/=]+/gi, "$1 [REDACTED]")
    .replace(/\b(postgres(?:ql)?|mysql|mongodb(?:\+srv)?)?:?\/\/([^\s:@/]+):([^\s@/]+)@/gi, (_match, scheme: string | undefined) => `${scheme || "database"}://[REDACTED]@`)
    .replace(/\b(authorization|cookie|credential|password|passwd|secret|token|api[_-]?key|private[_-]?key|client[_-]?secret)\b\s*[:=]\s*["']?[^\s,"';]+["']?/gi, "$1=[REDACTED]");
}

function redact(value: unknown, depth: number): unknown {
  if (depth > MAX_REDACTION_DEPTH) return "[TRUNCATED]";
  if (value === null || value === undefined || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return redactOperationalText(value);
  if (Array.isArray(value)) return value.slice(0, MAX_ARRAY_ITEMS).map((entry) => redact(entry, depth + 1));
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS);
    return Object.fromEntries(entries.map(([key, entry]) => [key, SENSITIVE_KEY.test(key) ? "[REDACTED]" : redact(entry, depth + 1)]));
  }
  return redactOperationalText(value);
}

export function redactOperationalTelemetry(value: unknown): unknown {
  return redact(value, 0);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeOperationalJobAction(value: unknown): {
  action: OperationalJobAction;
  reason: string;
} {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const action = asText(record.action) as OperationalJobAction;
  const reason = asText(record.reason);
  if (action !== "retry" && action !== "cancel") {
    throw new SystemHealthError("INVALID_JOB_ACTION", "Job action must be retry or cancel.");
  }
  if (reason.length < 4 || reason.length > 500) {
    throw new SystemHealthError("JOB_ACTION_REASON_REQUIRED", "An operational reason of 4–500 characters is required.");
  }
  return { action, reason };
}

export function assertOperationalJobActionAllowed(action: OperationalJobAction, status: string): void {
  const normalized = status.toLowerCase();
  if (action === "retry" && normalized !== "failed" && normalized !== "cancelled") {
    throw new SystemHealthError("JOB_RETRY_NOT_ALLOWED", "Only failed or cancelled jobs can be retried.", 409);
  }
  if (action === "cancel" && normalized !== "queued" && normalized !== "retrying") {
    throw new SystemHealthError("JOB_CANCEL_NOT_ALLOWED", "Only queued or retrying jobs can be cancelled safely.", 409);
  }
}
