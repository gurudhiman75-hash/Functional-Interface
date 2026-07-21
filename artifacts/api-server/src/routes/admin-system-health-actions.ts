import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  SystemHealthError,
  assessOperationalJob,
  assertOperationalJobActionAllowed,
  normalizeOperationalJobAction,
  redactOperationalTelemetry,
} from "../lib/admin-system-health";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

type SqlExecutor = typeof sqlClient;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof SystemHealthError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error("System Health job action failed", error);
  res.status(500).json({ error: "Unable to update the canonical background job" });
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
  const job = jobs[0];
  if (!job) throw new SystemHealthError("JOB_NOT_FOUND", "The selected background job no longer exists.", 404);

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

router.use(authenticate);

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
          SELECT id::text AS id, job_type AS "jobType", status::text AS status, attempts, max_attempts AS "maxAttempts"
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
