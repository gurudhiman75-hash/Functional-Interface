import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function sendError(res: Response, error: unknown, fallback: string) {
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_AUTOMATION_ADMIN_FAILED" });
}

router.use(authenticate);

router.get("/automation/runs", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const status = text(req.query.status, 40).toLowerCase();
    const limit = positiveInteger(req.query.limit, 100, 500);
    const rows = await sqlClient`
      SELECT
        id::text AS id,
        run_key AS "runKey",
        job_type AS "jobType",
        status,
        slot_started_at AS "slotStartedAt",
        started_at AS "startedAt",
        completed_at AS "completedAt",
        source_count AS "sourceCount",
        success_count AS "successCount",
        failure_count AS "failureCount",
        candidate_created_count AS "candidateCreatedCount",
        candidate_updated_count AS "candidateUpdatedCount",
        stats,
        failure_reason AS "failureReason"
      FROM content.current_affairs_automation_runs
      WHERE (${status} = '' OR status = ${status})
      ORDER BY started_at DESC
      LIMIT ${limit}
    `;
    res.json({ runs: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs automation runs");
  }
});

router.get("/automation/source-health", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        source.id::text AS id,
        source.source_key AS "sourceKey",
        source.name,
        source.source_type AS "sourceType",
        source.content_policy AS "contentPolicy",
        source.ingestion_mode AS "ingestionMode",
        source.feed_url AS "feedUrl",
        source.trust_score::float8 AS "trustScore",
        source.is_primary_source AS "isPrimarySource",
        source.is_active AS "isActive",
        source.last_ingested_at AS "lastIngestedAt",
        source.last_ingestion_status AS "lastIngestionStatus",
        source.last_ingestion_error AS "lastIngestionError",
        COALESCE(candidate.total_candidates, 0)::int AS "candidateCount",
        COALESCE(candidate.queued_candidates, 0)::int AS "queuedCandidateCount",
        COALESCE(candidate.latest_candidate_at, source.created_at) AS "latestCandidateAt"
      FROM content.current_affairs_sources source
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::int AS total_candidates,
          COUNT(*) FILTER (WHERE item.status = 'queued')::int AS queued_candidates,
          MAX(item.created_at) AS latest_candidate_at
        FROM content.current_affairs_ingestion_candidates item
        WHERE item.source_id = source.id
      ) candidate ON true
      ORDER BY
        CASE WHEN source.is_active AND source.feed_url IS NOT NULL THEN 0 ELSE 1 END,
        CASE WHEN source.last_ingestion_status = 'failure' THEN 0 ELSE 1 END,
        source.is_primary_source DESC,
        source.trust_score DESC,
        source.name
    `;

    const failing = rows.filter((row) => String(row.lastIngestionStatus ?? "") === "failure").length;
    const scheduled = rows.filter((row) =>
      Boolean(row.isActive)
      && Boolean(row.feedUrl)
      && ["feed", "feed_and_pdf"].includes(String(row.ingestionMode)),
    ).length;

    res.json({
      sources: rows,
      summary: {
        total: rows.length,
        scheduled,
        failing,
        healthy: Math.max(0, scheduled - failing),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs source health");
  }
});

export default router;
