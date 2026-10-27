// Read-only progress for canonical Question Studio generation runs.
// No job creation, DB mutation, provider invocation or public question access.
// Only authenticated admins with existing content.generation.read permission.
import { Router } from "express";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { requireAdminPermission } from "../lib/admin-rbac";

const router = Router();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ACTIVE = new Set(["queued", "running", "validation"]);
const CHAPTER_EVENT = "question_studio.generation_run.chapter_review_queued.v1";
const STANDARD_EVENT = "question_studio.generation_run.queued.v1";

function iso(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const parsed = value instanceof Date ? value : new Date(String(value));
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function count(value: unknown): number {
  const result = Number(value);
  return Number.isSafeInteger(result) && result >= 0 ? result : 0;
}

function queueState(row: Record<string, unknown>, status: string) {
  if (status === "failed") return { code: "failed", message: "Generation failed." };
  if (status === "cancelled") return { code: "cancelled", message: "Generation was cancelled." };
  if (["review", "approved", "partially_approved"].includes(status)) {
    return { code: "ready_for_review", message: "Questions are ready in the review queue." };
  }
  if (status === "validation") return { code: "validating", message: "Validating generated questions." };
  if (status === "running") {
    if (row.lease_expired === true) {
      return { code: "processing_delayed", message: "Processing lease expired; this run needs attention." };
    }
    return { code: "processing", message: "A worker is generating the review batch." };
  }
  if (status === "queued") {
    if (!row.outbox_published_at) {
      return { code: "awaiting_dispatch", message: "Queued and waiting for the dispatcher." };
    }
    if (row.task_delayed === true) {
      return { code: "processing_delayed", message: "Dispatch completed but a worker has not claimed the batch yet." };
    }
    return { code: "queued_for_processing", message: "Dispatched and waiting for a worker." };
  }
  return { code: "unknown", message: "Queue status is being refreshed." };
}

router.get(
  "/runs/:runId/status",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const runId = String(req.params.runId ?? "");
    if (!UUID.test(runId)) {
      res.status(400).json({ code: "INVALID_GENERATION_RUN_ID", error: "Invalid generation run ID" });
      return;
    }
    try {
      const rows = await sqlClient`
        SELECT g.id, g.public_code, g.status::text AS status, g.attempt_number,
               g.request_snapshot, g.started_at, g.completed_at,
               g.created_at, g.updated_at,
               e.published_at AS outbox_published_at,
               l.lease_expires_at < now() AND l.completed_at IS NULL AS lease_expired,
               g.status = 'queued'::generation_run_status
                 AND e.published_at IS NOT NULL
                 AND e.published_at < now() - interval '5 minutes' AS task_delayed,
               (SELECT count(*) FROM content.generation_run_items i
                WHERE i.generation_run_id = g.id) AS generated_count
        FROM content.generation_runs g
        LEFT JOIN LATERAL (
          SELECT published_at
          FROM platform.outbox_events
          WHERE aggregate_id = g.id
            AND aggregate_type = 'generation_run'
            AND event_type IN (${STANDARD_EVENT}, ${CHAPTER_EVENT})
          ORDER BY occurred_at DESC, id DESC
          LIMIT 1
        ) e ON true
        LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id = g.id
        WHERE g.id = ${runId}::uuid
        LIMIT 1
      `;
      const row = rows[0];
      if (!row) {
        res.status(404).json({ code: "GENERATION_RUN_NOT_FOUND", error: "Run not found" });
        return;
      }
      const snapshot = row.request_snapshot;
      const requestedCount = snapshot && typeof snapshot === "object" && !Array.isArray(snapshot)
        ? count((snapshot as Record<string, unknown>).count)
        : 0;
      const status = String(row.status);
      const state = queueState(row as Record<string, unknown>, status);
      res.json({
        id: String(row.id),
        publicCode: String(row.public_code),
        status,
        attemptNumber: count(row.attempt_number),
        requestedCount,
        generatedCount: count(row.generated_count),
        startedAt: iso(row.started_at),
        completedAt: iso(row.completed_at),
        createdAt: iso(row.created_at),
        updatedAt: iso(row.updated_at),
        // Do not leak prompt snapshots, tokens, service errors, or customer data.
        error: status === "failed" ? "Generation failed; inspect administrator diagnostics." : null,
        queueState: state.code,
        queueMessage: state.message,
        retryAfterSeconds: ACTIVE.has(status) ? 3 : null,
      });
    } catch (error) {
      console.error("Question Studio generation status lookup failed", error);
      res.status(500).json({ code: "GENERATION_STATUS_LOOKUP_FAILED", error: "Unable to load generation progress" });
    }
  },
);
export default router;
