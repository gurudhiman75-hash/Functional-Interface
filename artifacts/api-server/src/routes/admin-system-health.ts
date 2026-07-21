import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { Router, type Response } from "express";

import {
  SystemHealthError,
  assessOperationalJob,
  assertOperationalJobActionAllowed,
  deriveSystemHealth,
  normalizeOperationalJobAction,
  redactOperationalTelemetry,
  type SystemHealthLevel,
} from "../lib/admin-system-health";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;
const DAY_MS = 24 * 60 * 60 * 1_000;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function iso(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function ageMinutes(value: unknown, nowMs = Date.now()): number | null {
  const timestamp = iso(value);
  if (!timestamp) return null;
  return Math.max(0, (nowMs - Date.parse(timestamp)) / 60_000);
}

function componentLevel(options: {
  critical?: boolean;
  degraded?: boolean;
  unknown?: boolean;
}): SystemHealthLevel {
  if (options.critical) return "critical";
  if (options.degraded) return "degraded";
  if (options.unknown) return "unknown";
  return "healthy";
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof SystemHealthError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  console.error("System Health request failed", error);
  res.status(500).json({ error: "Unable to load canonical operational telemetry" });
}

function maxIso(values: unknown[]): string | null {
  const timestamps = values.map(iso).filter((value): value is string => Boolean(value));
  if (timestamps.length === 0) return null;
  return timestamps.sort().at(-1) ?? null;
}

async function loadJobDetail(jobId: string, client: SqlExecutor = sqlClient) {
  const jobs = await client`
    SELECT
      j.id::text AS id,
      j.job_type AS "jobType",
      j.status::text AS status,
      j.priority,
      j.owner_user_id::text AS "ownerUserId",
      owner.display_name AS "ownerName",
      owner.email AS "ownerEmail",
      j.related_entity_type AS "relatedEntityType",
      j.related_entity_id::text AS "relatedEntityId",
      j.progress_percent AS "progressPercent",
      j.attempts,
      j.max_attempts AS "maxAttempts",
      j.scheduled_at AS "scheduledAt",
      j.locked_at AS "lockedAt",
      j.locked_by AS "lockedBy",
      j.heartbeat_at AS "heartbeatAt",
      j.started_at AS "startedAt",
      j.completed_at AS "completedAt",
      j.last_error AS "lastError",
      j.payload,
      j.result,
      j.created_at AS "createdAt",
      j.updated_at AS "updatedAt"
    FROM operations.jobs j
    LEFT JOIN identity.users owner ON owner.id = j.owner_user_id
    WHERE j.id = ${jobId}::uuid
    LIMIT 1
  `;
  if (jobs.length === 0) {
    throw new SystemHealthError("JOB_NOT_FOUND", "The selected background job no longer exists.", 404);
  }
  const attempts = await client`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      attempt_number AS "attemptNumber",
      worker_id AS "workerId",
      started_at AS "startedAt",
      completed_at AS "completedAt",
      error_class AS "errorClass",
      error_message AS "errorMessage",
      retryable,
      provider_metadata AS "providerMetadata"
    FROM operations.job_attempts
    WHERE job_id = ${jobId}::uuid
    ORDER BY attempt_number DESC, started_at DESC
    LIMIT 100
  `;
  const logs = await client`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      job_attempt_id::text AS "jobAttemptId",
      level,
      message,
      context,
      created_at AS "createdAt"
    FROM operations.job_logs
    WHERE job_id = ${jobId}::uuid
    ORDER BY created_at DESC
    LIMIT 500
  `;
  const job = jobs[0];
  return {
    ...job,
    payload: redactOperationalTelemetry(job.payload),
    result: redactOperationalTelemetry(job.result),
    assessment: assessOperationalJob({
      status: String(job.status),
      scheduledAt: job.scheduledAt,
      heartbeatAt: job.heartbeatAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      updatedAt: job.updatedAt,
      lastError: job.lastError ? String(job.lastError) : null,
    }),
    attempts: attempts.map((attempt) => ({
      ...attempt,
      providerMetadata: redactOperationalTelemetry(attempt.providerMetadata),
    })),
    logs: logs.map((log) => ({
      ...log,
      context: redactOperationalTelemetry(log.context),
    })),
  };
}

async function loadSystemHealth(client: SqlExecutor = sqlClient) {
  const now = Date.now();
  const probeStarted = performance.now();
  const databaseProbe = await client`SELECT now() AS "databaseTime"`;
  const databaseLatencyMs = Math.max(0, Math.round((performance.now() - probeStarted) * 10) / 10);

  const jobs = await client`
    SELECT
      j.id::text AS id,
      j.job_type AS "jobType",
      j.status::text AS status,
      j.priority,
      j.owner_user_id::text AS "ownerUserId",
      owner.display_name AS "ownerName",
      owner.email AS "ownerEmail",
      j.related_entity_type AS "relatedEntityType",
      j.related_entity_id::text AS "relatedEntityId",
      j.progress_percent AS "progressPercent",
      j.attempts,
      j.max_attempts AS "maxAttempts",
      j.scheduled_at AS "scheduledAt",
      j.locked_at AS "lockedAt",
      j.locked_by AS "lockedBy",
      j.heartbeat_at AS "heartbeatAt",
      j.started_at AS "startedAt",
      j.completed_at AS "completedAt",
      j.last_error AS "lastError",
      j.created_at AS "createdAt",
      j.updated_at AS "updatedAt"
    FROM operations.jobs j
    LEFT JOIN identity.users owner ON owner.id = j.owner_user_id
    ORDER BY j.updated_at DESC, j.created_at DESC
    LIMIT 300
  `;

  const attempts = await client`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      attempt_number AS "attemptNumber",
      worker_id AS "workerId",
      started_at AS "startedAt",
      completed_at AS "completedAt",
      error_class AS "errorClass",
      error_message AS "errorMessage",
      retryable,
      provider_metadata AS "providerMetadata"
    FROM operations.job_attempts
    ORDER BY started_at DESC
    LIMIT 1000
  `;

  const logs = await client`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      job_attempt_id::text AS "jobAttemptId",
      level,
      message,
      context,
      created_at AS "createdAt"
    FROM operations.job_logs
    ORDER BY created_at DESC
    LIMIT 1000
  `;

  const generationRuns = await client`
    SELECT
      r.id::text AS id,
      r.public_code AS "publicCode",
      r.status::text AS status,
      r.attempt_number AS "attemptNumber",
      r.provider,
      r.model,
      r.prompt_tokens AS "promptTokens",
      r.completion_tokens AS "completionTokens",
      r.estimated_cost_paise AS "estimatedCostPaise",
      r.actual_cost_paise AS "actualCostPaise",
      r.failure_reason AS "failureReason",
      r.paused_at AS "pausedAt",
      r.started_at AS "startedAt",
      r.completed_at AS "completedAt",
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt",
      r.request_snapshot AS "requestSnapshot",
      COUNT(i.id)::int AS "itemCount",
      COUNT(i.id) FILTER (WHERE i.status::text = 'approved')::int AS "approvedItemCount",
      COUNT(i.id) FILTER (WHERE i.status::text = 'needs_fix')::int AS "needsFixItemCount",
      COUNT(i.id) FILTER (WHERE i.status::text = 'rejected')::int AS "rejectedItemCount"
    FROM content.generation_runs r
    LEFT JOIN content.generation_run_items i ON i.generation_run_id = r.id
    GROUP BY r.id
    ORDER BY r.updated_at DESC, r.created_at DESC
    LIMIT 200
  `;

  const validationRuns = await client`
    SELECT
      vr.id::text AS id,
      vr.entity_type AS "entityType",
      vr.entity_version_id::text AS "entityVersionId",
      vr.profile_key AS "profileKey",
      vr.engine_version AS "engineVersion",
      vr.result::text AS result,
      vr.score::float8 AS score,
      vr.started_at AS "startedAt",
      vr.completed_at AS "completedAt",
      COALESCE(
        json_agg(
          json_build_object(
            'id', vc.id,
            'checkKey', vc.check_key,
            'result', vc.result::text,
            'score', vc.score,
            'message', vc.message,
            'evidence', vc.evidence
          ) ORDER BY vc.check_key
        ) FILTER (WHERE vc.id IS NOT NULL),
        '[]'::json
      ) AS checks
    FROM content.validation_runs vr
    LEFT JOIN content.validation_checks vc ON vc.validation_run_id = vr.id
    GROUP BY vr.id
    ORDER BY vr.started_at DESC
    LIMIT 200
  `;

  const outboxEvents = await client`
    SELECT
      id::text AS id,
      aggregate_type AS "aggregateType",
      aggregate_id::text AS "aggregateId",
      event_type AS "eventType",
      payload,
      occurred_at AS "occurredAt",
      available_at AS "availableAt",
      published_at AS "publishedAt",
      attempts,
      last_error AS "lastError"
    FROM platform.outbox_events
    ORDER BY occurred_at DESC
    LIMIT 500
  `;

  const exactStats = await client`
    SELECT
      (SELECT COUNT(*)::int FROM operations.jobs) AS "totalJobs",
      (SELECT COUNT(*)::int FROM operations.jobs WHERE status::text IN ('queued', 'retrying')) AS "queuedJobs",
      (SELECT COUNT(*)::int FROM operations.jobs WHERE status::text = 'running') AS "runningJobs",
      (SELECT COUNT(*)::int FROM operations.jobs WHERE status::text = 'failed' AND updated_at >= now() - interval '24 hours') AS "failedJobs24h",
      (SELECT COUNT(*)::int FROM content.generation_runs WHERE status::text = 'failed' AND updated_at >= now() - interval '24 hours') AS "failedGeneration24h",
      (SELECT COUNT(*)::int FROM content.validation_runs WHERE result::text = 'failed' AND started_at >= now() - interval '24 hours') AS "failedValidation24h",
      (SELECT COUNT(*)::int FROM platform.outbox_events WHERE published_at IS NULL) AS "pendingOutbox",
      (SELECT MIN(occurred_at) FROM platform.outbox_events WHERE published_at IS NULL) AS "oldestPendingOutboxAt"
  `;
  const stats = exactStats[0] ?? {};

  const attemptsByJob = new Map<string, Array<Record<string, unknown>>>();
  for (const attempt of attempts) {
    const jobId = String(attempt.jobId);
    const bucket = attemptsByJob.get(jobId) ?? [];
    bucket.push({ ...attempt, providerMetadata: redactOperationalTelemetry(attempt.providerMetadata) });
    attemptsByJob.set(jobId, bucket);
  }
  const logsByJob = new Map<string, Array<Record<string, unknown>>>();
  for (const log of logs) {
    const jobId = String(log.jobId);
    const bucket = logsByJob.get(jobId) ?? [];
    bucket.push({ ...log, context: redactOperationalTelemetry(log.context) });
    logsByJob.set(jobId, bucket);
  }

  const mappedJobs = jobs.map((job) => {
    const assessment = assessOperationalJob({
      status: String(job.status),
      scheduledAt: job.scheduledAt,
      heartbeatAt: job.heartbeatAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      updatedAt: job.updatedAt,
      lastError: job.lastError ? String(job.lastError) : null,
    }, now);
    return {
      ...job,
      assessment,
      attemptRecordCount: (attemptsByJob.get(String(job.id)) ?? []).length,
      logRecordCount: (logsByJob.get(String(job.id)) ?? []).length,
      latestAttempt: (attemptsByJob.get(String(job.id)) ?? [])[0] ?? null,
      latestLog: (logsByJob.get(String(job.id)) ?? [])[0] ?? null,
    };
  });

  const staleJobs = mappedJobs.filter((job) => job.assessment.stale);
  const oldestPendingOutboxAt = iso(stats.oldestPendingOutboxAt);
  const oldestPendingOutboxAgeMinutes = ageMinutes(oldestPendingOutboxAt, now);

  const errors: Array<Record<string, unknown>> = [];
  for (const job of mappedJobs) {
    if (job.lastError || job.status === "failed" || job.assessment.stale) {
      errors.push({
        id: `job:${job.id}`,
        source: "background_job",
        severity: job.assessment.level === "critical" ? "critical" : "error",
        occurredAt: job.updatedAt,
        title: `${job.jobType} · ${job.status}`,
        message: job.lastError || job.assessment.issue || "Background job failed.",
        entityType: "job",
        entityId: job.id,
        metadata: { attempts: job.attempts, maxAttempts: job.maxAttempts, worker: job.lockedBy },
      });
    }
  }
  for (const attempt of attempts) {
    if (!attempt.errorMessage && !attempt.errorClass) continue;
    errors.push({
      id: `job-attempt:${attempt.id}`,
      source: "job_attempt",
      severity: "error",
      occurredAt: attempt.completedAt ?? attempt.startedAt,
      title: attempt.errorClass || "Job attempt failed",
      message: attempt.errorMessage || "The worker recorded an unsuccessful attempt.",
      entityType: "job",
      entityId: attempt.jobId,
      metadata: redactOperationalTelemetry({
        attemptNumber: attempt.attemptNumber,
        workerId: attempt.workerId,
        retryable: attempt.retryable,
        providerMetadata: attempt.providerMetadata,
      }),
    });
  }
  for (const log of logs) {
    const level = String(log.level).toLowerCase();
    if (!['warn', 'warning', 'error', 'fatal'].includes(level)) continue;
    errors.push({
      id: `job-log:${log.id}`,
      source: "job_log",
      severity: level === "fatal" ? "critical" : level.startsWith("warn") ? "warning" : "error",
      occurredAt: log.createdAt,
      title: `Worker log · ${log.level}`,
      message: log.message,
      entityType: "job",
      entityId: log.jobId,
      metadata: redactOperationalTelemetry(log.context),
    });
  }
  for (const run of generationRuns) {
    if (!run.failureReason && run.status !== "failed") continue;
    errors.push({
      id: `generation:${run.id}`,
      source: "question_generation",
      severity: "error",
      occurredAt: run.updatedAt,
      title: `${run.publicCode} · generation failed`,
      message: run.failureReason || "Question generation failed.",
      entityType: "generation_run",
      entityId: run.id,
      metadata: redactOperationalTelemetry({ provider: run.provider, model: run.model, attemptNumber: run.attemptNumber }),
    });
  }
  for (const validation of validationRuns) {
    if (validation.result !== "failed" && validation.result !== "issues") continue;
    const checks = Array.isArray(validation.checks) ? validation.checks as Array<Record<string, unknown>> : [];
    const firstIssue = checks.find((check) => check.result === "failed" || check.result === "issues");
    errors.push({
      id: `validation:${validation.id}`,
      source: "validation",
      severity: validation.result === "failed" ? "error" : "warning",
      occurredAt: validation.completedAt ?? validation.startedAt,
      title: `${validation.profileKey} · ${validation.result}`,
      message: firstIssue?.message || "Validation returned blocking issues.",
      entityType: validation.entityType,
      entityId: validation.entityVersionId,
      metadata: redactOperationalTelemetry({ engineVersion: validation.engineVersion, score: validation.score, checks }),
    });
  }
  for (const event of outboxEvents) {
    if (!event.lastError && event.publishedAt) continue;
    const eventAge = ageMinutes(event.occurredAt, now) ?? 0;
    if (!event.lastError && eventAge <= 10) continue;
    errors.push({
      id: `outbox:${event.id}`,
      source: "outbox",
      severity: event.lastError ? "error" : eventAge > 30 ? "critical" : "warning",
      occurredAt: event.occurredAt,
      title: `${event.eventType} · unpublished`,
      message: event.lastError || `Event has remained unpublished for ${Math.round(eventAge)} minutes.`,
      entityType: event.aggregateType,
      entityId: event.aggregateId,
      metadata: redactOperationalTelemetry({ attempts: event.attempts, availableAt: event.availableAt }),
    });
  }
  errors.sort((left, right) => Date.parse(String(right.occurredAt ?? 0)) - Date.parse(String(left.occurredAt ?? 0)));

  const cutoff = now - DAY_MS;
  const errorCount24h = errors.filter((error) => {
    const occurredAt = Date.parse(String(error.occurredAt ?? ""));
    return Number.isFinite(occurredAt) && occurredAt >= cutoff;
  }).length;
  const summary = deriveSystemHealth({
    databaseOk: true,
    databaseLatencyMs,
    staleJobCount: staleJobs.length,
    failedJobCount24h: asNumber(stats.failedJobs24h),
    failedGenerationCount24h: asNumber(stats.failedGeneration24h),
    failedValidationCount24h: asNumber(stats.failedValidation24h),
    pendingOutboxCount: asNumber(stats.pendingOutbox),
    oldestPendingOutboxAgeMinutes,
    errorCount24h,
  });

  const lastWorkerSignalAt = maxIso([
    ...jobs.map((job) => job.heartbeatAt),
    ...attempts.map((attempt) => attempt.startedAt),
    ...logs.map((log) => log.createdAt),
  ]);
  const workerSignalAge = ageMinutes(lastWorkerSignalAt, now);
  const workerState = mappedJobs.some((job) => job.status === "running" && !job.assessment.stale)
    ? "active"
    : lastWorkerSignalAt && (workerSignalAge ?? Infinity) <= 24 * 60
      ? "idle"
      : "not_observed";

  return {
    summary,
    generatedAt: new Date(now).toISOString(),
    process: {
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      memory: redactOperationalTelemetry(process.memoryUsage()),
    },
    database: {
      status: "connected",
      latencyMs: databaseLatencyMs,
      databaseTime: iso(databaseProbe[0]?.databaseTime),
    },
    worker: {
      state: workerState,
      lastSignalAt: lastWorkerSignalAt,
      signalAgeMinutes: workerSignalAge,
      note: workerState === "not_observed"
        ? "No persisted worker heartbeat, attempt or log has been observed. Queue actions remain durable but require a connected worker to execute."
        : null,
    },
    metrics: {
      totalJobs: asNumber(stats.totalJobs),
      queuedJobs: asNumber(stats.queuedJobs),
      runningJobs: asNumber(stats.runningJobs),
      staleJobs: staleJobs.length,
      failedJobs24h: asNumber(stats.failedJobs24h),
      failedGeneration24h: asNumber(stats.failedGeneration24h),
      failedValidation24h: asNumber(stats.failedValidation24h),
      pendingOutbox: asNumber(stats.pendingOutbox),
      oldestPendingOutboxAt,
      oldestPendingOutboxAgeMinutes,
      errorCount24h,
    },
    components: [
      {
        key: "api",
        name: "API process",
        level: "healthy",
        summary: `Process uptime ${Math.round(process.uptime() / 60)} minutes.`,
        lastSignalAt: new Date(now).toISOString(),
      },
      {
        key: "database",
        name: "Canonical database",
        level: componentLevel({ critical: databaseLatencyMs > 1_500, degraded: databaseLatencyMs > 500 }),
        summary: `Connected in ${databaseLatencyMs} ms.`,
        lastSignalAt: iso(databaseProbe[0]?.databaseTime),
      },
      {
        key: "worker",
        name: "Background worker",
        level: componentLevel({ critical: staleJobs.length > 0, degraded: asNumber(stats.failedJobs24h) > 0, unknown: workerState === "not_observed" }),
        summary: workerState === "active" ? "A worker heartbeat is active." : workerState === "idle" ? "Worker activity was observed within 24 hours." : "No worker activity has been persisted.",
        lastSignalAt: lastWorkerSignalAt,
      },
      {
        key: "outbox",
        name: "Outbox publisher",
        level: componentLevel({ critical: (oldestPendingOutboxAgeMinutes ?? 0) > 30, degraded: (oldestPendingOutboxAgeMinutes ?? 0) > 10 }),
        summary: asNumber(stats.pendingOutbox) === 0 ? "No unpublished events." : `${asNumber(stats.pendingOutbox)} unpublished event${asNumber(stats.pendingOutbox) === 1 ? "" : "s"}; oldest ${Math.round(oldestPendingOutboxAgeMinutes ?? 0)} minutes.`,
        lastSignalAt: maxIso(outboxEvents.map((event) => event.publishedAt)),
      },
      {
        key: "generation",
        name: "Question generation",
        level: componentLevel({ degraded: asNumber(stats.failedGeneration24h) > 0 }),
        summary: `${generationRuns.length} recent run${generationRuns.length === 1 ? "" : "s"}; ${asNumber(stats.failedGeneration24h)} failed in 24 hours.`,
        lastSignalAt: maxIso(generationRuns.map((run) => run.updatedAt)),
      },
      {
        key: "validation",
        name: "Validation engine",
        level: componentLevel({ degraded: asNumber(stats.failedValidation24h) > 0, unknown: validationRuns.length === 0 }),
        summary: validationRuns.length === 0 ? "No canonical validation runs have been recorded." : `${validationRuns.length} recent validation run${validationRuns.length === 1 ? "" : "s"}.`,
        lastSignalAt: maxIso(validationRuns.map((run) => run.completedAt ?? run.startedAt)),
      },
      {
        key: "request-errors",
        name: "Request exception capture",
        level: "unknown",
        summary: "Structured request logs exist, but persistent request-level exception storage is not connected yet.",
        lastSignalAt: null,
      },
    ],
    jobs: mappedJobs,
    pipelines: {
      generationRuns: generationRuns.map((run) => ({ ...run, requestSnapshot: redactOperationalTelemetry(run.requestSnapshot) })),
      validationRuns: validationRuns.map((run) => ({ ...run, checks: redactOperationalTelemetry(run.checks) })),
      outboxEvents: outboxEvents.map((event) => ({ ...event, payload: redactOperationalTelemetry(event.payload) })),
    },
    errors: errors.slice(0, 300),
  };
}

router.use(authenticate);

router.get(
  "/overview",
  requireAdminPermission("jobs.read"),
  async (_req, res) => {
    try {
      res.json(await loadSystemHealth());
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.get(
  "/jobs/:jobId",
  requireAdminPermission("jobs.read"),
  async (req, res) => {
    try {
      const jobId = asText(req.params.jobId);
      if (!isUuid(jobId)) throw new SystemHealthError("INVALID_JOB_ID", "Invalid background job identifier.");
      res.json({ job: await loadJobDetail(jobId), generatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  "/jobs/:jobId/actions",
  requireAdminPermission("jobs.manage"),
  async (req, res) => {
    try {
      const jobId = asText(req.params.jobId);
      if (!isUuid(jobId)) throw new SystemHealthError("INVALID_JOB_ID", "Invalid background job identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new SystemHealthError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const input = normalizeOperationalJobAction(req.body);

      await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT id::text AS id, job_type AS "jobType", status::text AS status, attempts, max_attempts AS "maxAttempts", last_error AS "lastError"
          FROM operations.jobs
          WHERE id = ${jobId}::uuid
          FOR UPDATE
        `;
        const before = rows[0];
        if (!before) throw new SystemHealthError("JOB_NOT_FOUND", "The selected background job no longer exists.", 404);
        assertOperationalJobActionAllowed(input.action, String(before.status));

        if (input.action === "retry") {
          await tx`
            UPDATE operations.jobs
            SET
              status = 'retrying'::job_status,
              scheduled_at = now(),
              locked_at = NULL,
              locked_by = NULL,
              heartbeat_at = NULL,
              started_at = NULL,
              completed_at = NULL,
              result = NULL,
              max_attempts = GREATEST(max_attempts, attempts + 1),
              updated_at = now()
            WHERE id = ${jobId}::uuid
          `;
        } else {
          await tx`
            UPDATE operations.jobs
            SET
              status = 'cancelled'::job_status,
              completed_at = now(),
              locked_at = NULL,
              locked_by = NULL,
              heartbeat_at = NULL,
              updated_at = now()
            WHERE id = ${jobId}::uuid
          `;
        }

        await tx`
          INSERT INTO platform.audit_events (
            id,
            actor_type,
            actor_user_id,
            effective_role_key,
            action_key,
            entity_type,
            entity_id,
            reason,
            summary,
            metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${req.adminSession?.effectiveRoleKey ?? null},
            ${input.action === "retry" ? "operations.job.retry_requested" : "operations.job.cancelled"},
            'job',
            ${jobId}::uuid,
            ${input.reason},
            ${input.action === "retry" ? `Manual retry requested for ${before.jobType}` : `Queued job ${before.jobType} cancelled`},
            ${JSON.stringify({
              previousStatus: before.status,
              action: input.action,
              attempts: before.attempts,
              maxAttempts: before.maxAttempts,
              previousError: before.lastError,
            })}
          )
        `;
      });

      res.json({ job: await loadJobDetail(jobId), action: input.action, updatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
