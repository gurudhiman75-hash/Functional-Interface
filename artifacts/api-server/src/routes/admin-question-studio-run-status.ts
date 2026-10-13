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

function iso(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const parsed = value instanceof Date ? value : new Date(String(value));
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function count(value: unknown): number {
  const result = Number(value);
  return Number.isSafeInteger(result) && result >= 0 ? result : 0;
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
               (SELECT count(*) FROM content.generation_run_items i
                WHERE i.generation_run_id = g.id) AS generated_count
        FROM content.generation_runs g
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
        retryAfterSeconds: ACTIVE.has(status) ? 3 : null,
      });
    } catch (error) {
      console.error("Question Studio generation status lookup failed", error);
      res.status(500).json({ code: "GENERATION_STATUS_LOOKUP_FAILED", error: "Unable to load generation progress" });
    }
  },
);
export default router;
