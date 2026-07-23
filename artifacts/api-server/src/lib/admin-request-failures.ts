import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";

export type AdminRequestFailure = {
  id: string;
  correlationId: string;
  occurredAt: string;
  method: string;
  path: string;
  statusCode: number;
  code: string | null;
  message: string;
  durationMs: number;
  actorUserId: string | null;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolutionNote: string | null;
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
};

const MAX_FAILURES = 500;
const RETENTION_DAYS = 60;
const failures: AdminRequestFailure[] = [];
let schemaPromise: Promise<void> | null = null;
let lastCleanupAt = 0;

function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sqlClient`
        CREATE TABLE IF NOT EXISTS operations.request_failures (
          id uuid PRIMARY KEY,
          correlation_id text NOT NULL UNIQUE,
          occurred_at timestamptz NOT NULL DEFAULT now(),
          method text NOT NULL,
          path text NOT NULL,
          status_code integer NOT NULL,
          error_code text,
          message text NOT NULL,
          duration_ms double precision NOT NULL DEFAULT 0,
          actor_user_id uuid,
          acknowledged_at timestamptz,
          acknowledged_by uuid,
          resolved_at timestamptz,
          resolved_by uuid,
          resolution_note text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sqlClient`CREATE INDEX IF NOT EXISTS request_failures_occurred_at_idx ON operations.request_failures (occurred_at DESC)`;
      await sqlClient`CREATE INDEX IF NOT EXISTS request_failures_group_idx ON operations.request_failures (path, status_code, error_code, occurred_at DESC)`;
      await sqlClient`CREATE INDEX IF NOT EXISTS request_failures_unresolved_idx ON operations.request_failures (resolved_at, occurred_at DESC)`;
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

function memoryEntry(input: Omit<AdminRequestFailure, "id" | "occurredAt" | "acknowledgedAt" | "acknowledgedBy" | "resolvedAt" | "resolvedBy" | "resolutionNote" | "occurrenceCount" | "firstSeenAt" | "lastSeenAt">): AdminRequestFailure {
  const occurredAt = new Date().toISOString();
  return {
    id: randomUUID(),
    occurredAt,
    acknowledgedAt: null,
    acknowledgedBy: null,
    resolvedAt: null,
    resolvedBy: null,
    resolutionNote: null,
    occurrenceCount: 1,
    firstSeenAt: occurredAt,
    lastSeenAt: occurredAt,
    ...input,
  };
}

async function persist(entry: AdminRequestFailure): Promise<void> {
  await ensureSchema();
  await sqlClient`
    INSERT INTO operations.request_failures (
      id, correlation_id, occurred_at, method, path, status_code,
      error_code, message, duration_ms, actor_user_id
    ) VALUES (
      ${entry.id}::uuid,
      ${entry.correlationId},
      ${entry.occurredAt},
      ${entry.method},
      ${entry.path},
      ${entry.statusCode},
      ${entry.code},
      ${entry.message},
      ${entry.durationMs},
      ${entry.actorUserId}::uuid
    )
    ON CONFLICT (correlation_id) DO NOTHING
  `;

  const now = Date.now();
  if (now - lastCleanupAt > 24 * 60 * 60 * 1000) {
    lastCleanupAt = now;
    await sqlClient`
      DELETE FROM operations.request_failures
      WHERE occurred_at < now() - (${RETENTION_DAYS}::text || ' days')::interval
    `;
  }
}

export function recordAdminRequestFailure(input: Omit<AdminRequestFailure, "id" | "occurredAt" | "acknowledgedAt" | "acknowledgedBy" | "resolvedAt" | "resolvedBy" | "resolutionNote" | "occurrenceCount" | "firstSeenAt" | "lastSeenAt">): AdminRequestFailure {
  const entry = memoryEntry(input);
  failures.unshift(entry);
  if (failures.length > MAX_FAILURES) failures.length = MAX_FAILURES;
  void persist(entry).catch((error) => {
    console.error("Unable to persist admin request failure; memory fallback retained", error);
  });
  return entry;
}

export async function listAdminRequestFailures(limit = 100): Promise<AdminRequestFailure[]> {
  const safeLimit = Math.max(1, Math.min(500, limit));
  try {
    await ensureSchema();
    const rows = await sqlClient`
      SELECT
        rf.id::text AS id,
        rf.correlation_id AS "correlationId",
        rf.occurred_at AS "occurredAt",
        rf.method,
        rf.path,
        rf.status_code AS "statusCode",
        rf.error_code AS code,
        rf.message,
        rf.duration_ms AS "durationMs",
        rf.actor_user_id::text AS "actorUserId",
        rf.acknowledged_at AS "acknowledgedAt",
        rf.acknowledged_by::text AS "acknowledgedBy",
        rf.resolved_at AS "resolvedAt",
        rf.resolved_by::text AS "resolvedBy",
        rf.resolution_note AS "resolutionNote",
        COUNT(*) OVER (PARTITION BY rf.path, rf.status_code, COALESCE(rf.error_code, ''))::int AS "occurrenceCount",
        MIN(rf.occurred_at) OVER (PARTITION BY rf.path, rf.status_code, COALESCE(rf.error_code, '')) AS "firstSeenAt",
        MAX(rf.occurred_at) OVER (PARTITION BY rf.path, rf.status_code, COALESCE(rf.error_code, '')) AS "lastSeenAt"
      FROM operations.request_failures rf
      ORDER BY rf.occurred_at DESC
      LIMIT ${safeLimit}
    `;
    return rows as unknown as AdminRequestFailure[];
  } catch (error) {
    console.error("Unable to read persisted admin request failures; using memory fallback", error);
    return failures.slice(0, safeLimit);
  }
}

export async function updateAdminRequestFailure(input: {
  id: string;
  actorUserId: string;
  action: "acknowledge" | "resolve" | "reopen";
  note?: string;
}): Promise<AdminRequestFailure | null> {
  await ensureSchema();
  const note = input.note?.trim().slice(0, 2000) || null;
  const rows = input.action === "acknowledge"
    ? await sqlClient`
        UPDATE operations.request_failures
        SET acknowledged_at = now(), acknowledged_by = ${input.actorUserId}::uuid
        WHERE id = ${input.id}::uuid
        RETURNING id::text AS id
      `
    : input.action === "resolve"
      ? await sqlClient`
          UPDATE operations.request_failures
          SET resolved_at = now(), resolved_by = ${input.actorUserId}::uuid, resolution_note = ${note}
          WHERE id = ${input.id}::uuid
          RETURNING id::text AS id
        `
      : await sqlClient`
          UPDATE operations.request_failures
          SET resolved_at = NULL, resolved_by = NULL, resolution_note = NULL
          WHERE id = ${input.id}::uuid
          RETURNING id::text AS id
        `;
  if (rows.length === 0) return null;
  const all = await listAdminRequestFailures(500);
  return all.find((entry) => entry.id === input.id) ?? null;
}

export const ADMIN_REQUEST_FAILURE_RETENTION_DAYS = RETENTION_DAYS;
