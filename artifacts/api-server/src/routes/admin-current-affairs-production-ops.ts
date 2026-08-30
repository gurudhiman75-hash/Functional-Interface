import { Router, type IRouter, type Response } from "express";

import { loadCurrentAffairsProductionReadiness } from "../current-affairs/production-readiness-runtime";
import { runCurrentAffairsProductionRecovery } from "../current-affairs/production-recovery-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  console.error(fallback, error);
  res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_PRODUCTION_OPS_FAILED" });
}

router.use(authenticate);

router.get("/production/readiness", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    res.json(await loadCurrentAffairsProductionReadiness());
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs production readiness");
  }
});

router.get("/production/recovery-runs", requireAdminPermission("jobs.read"), async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Math.floor(Number(req.query.limit ?? 30)) || 30));
    const rows = await sqlClient`
      SELECT id::text AS id, run_key AS "runKey", target_date::text AS "targetDate",
             trigger_mode AS "triggerMode", status,
             english_backfill_count::int AS "englishBackfillCount",
             localized_backfill_count::int AS "localizedBackfillCount",
             question_localization_count::int AS "questionLocalizationCount",
             actions, failure, started_at::text AS "startedAt", completed_at::text AS "completedAt"
      FROM content.current_affairs_ops_runs
      ORDER BY started_at DESC
      LIMIT ${limit}
    `;
    res.json({ runs: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs recovery history");
  }
});

router.post("/production/recover", requireAdminPermission("jobs.manage"), async (_req, res) => {
  try {
    const result = await runCurrentAffairsProductionRecovery({ triggerMode: "manual" });
    res.status(result.skipped ? 200 : 201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to run Current Affairs production recovery");
  }
});

export default router;
