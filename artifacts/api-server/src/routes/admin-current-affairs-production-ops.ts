import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { loadDailyDiscoveryCensus } from "../current-affairs/daily-discovery-census";
import {
  assertDailyMasterPackLanguage,
  loadDailyMasterPack,
  loadDailyMasterPacks,
  type DailyMasterPackLanguage,
} from "../current-affairs/daily-master-pack";
import { renderDailyMasterPackPdf } from "../current-affairs/daily-master-pack-pdf";
import { generateYesterdayCurrentAffairsOnDemand } from "../current-affairs/on-demand-yesterday-runtime";
import { previousIndiaDate } from "../current-affairs/orchestration-policy";
import { loadCurrentAffairsProductionReadiness } from "../current-affairs/production-readiness-runtime";
import { runCurrentAffairsProductionRecovery } from "../current-affairs/production-recovery-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  console.error(fallback, error);
  res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_PRODUCTION_OPS_FAILED" });
}

function requestedDate(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return DATE_ONLY.test(text) ? text : previousIndiaDate(new Date());
}

function requestedLanguage(value: unknown): DailyMasterPackLanguage {
  return assertDailyMasterPackLanguage(typeof value === "string" ? value : "en");
}

function artifactFilename(targetDate: string, language: DailyMasterPackLanguage, extension: "md" | "pdf") {
  const languageSuffix = language === "en" ? "" : `-${language}`;
  return `examtree-current-affairs-${targetDate}${languageSuffix}.${extension}`;
}

router.use(authenticate);

router.get("/production/readiness", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    res.json(await loadCurrentAffairsProductionReadiness());
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs production readiness");
  }
});

router.get("/production/discovery-census", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const targetDate = requestedDate(req.query.date);
    res.json({ targetDate, census: await loadDailyDiscoveryCensus(targetDate) });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs daily discovery census");
  }
});

router.get("/production/master-packs", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const targetDate = requestedDate(req.query.date);
    res.json({ targetDate, masterPacks: await loadDailyMasterPacks(targetDate) });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs multilingual daily master packs");
  }
});

router.get("/production/master-pack", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const targetDate = requestedDate(req.query.date);
    const language = requestedLanguage(req.query.lang);
    res.json({ targetDate, language, masterPack: await loadDailyMasterPack(targetDate, language) });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs daily master pack");
  }
});

router.get("/production/master-pack/text", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const targetDate = requestedDate(req.query.date);
    const language = requestedLanguage(req.query.lang);
    const masterPack = await loadDailyMasterPack(targetDate, language);
    if (!masterPack) {
      res.status(404).json({
        error: `Daily Current Affairs ${language.toUpperCase()} master pack has not been materialized yet.`,
        code: "CURRENT_AFFAIRS_MASTER_PACK_NOT_FOUND",
      });
      return;
    }
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${artifactFilename(targetDate, language, "md")}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.send(String(masterPack.bodyMarkdown ?? ""));
  } catch (error) {
    sendError(res, error, "Unable to download Current Affairs master text");
  }
});

router.get("/production/master-pack/pdf", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const targetDate = requestedDate(req.query.date);
    const language = requestedLanguage(req.query.lang);
    if (language !== "en") {
      res.status(422).json({
        error: "Hindi and Punjabi PDF rendering remains disabled until the server passes an explicit Devanagari/Gurmukhi font-coverage gate. Download the canonical Markdown for these languages meanwhile.",
        code: "CURRENT_AFFAIRS_MULTILINGUAL_PDF_FONT_GATE",
        language,
        textAvailable: true,
      });
      return;
    }
    const masterPack = await loadDailyMasterPack(targetDate, language);
    if (!masterPack) {
      res.status(404).json({ error: "Daily Current Affairs master pack has not been materialized yet.", code: "CURRENT_AFFAIRS_MASTER_PACK_NOT_FOUND" });
      return;
    }
    const rendered = renderDailyMasterPackPdf(masterPack.payload);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", String(rendered.buffer.length));
    res.setHeader("Content-Disposition", `attachment; filename="${artifactFilename(targetDate, language, "pdf")}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.send(rendered.buffer);
  } catch (error) {
    sendError(res, error, "Unable to render Current Affairs master PDF");
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

router.post("/production/generate-yesterday", requireAdminPermission("jobs.manage"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required.", code: "ADMIN_SESSION_REQUIRED" });
      return;
    }

    const generationRequestId = randomUUID();
    const result = await generateYesterdayCurrentAffairsOnDemand();
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, effective_role_key, action_key,
        entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid,
        'user'::audit_actor_type,
        ${actorUserId}::uuid,
        ${req.adminSession?.effectiveRoleKey ?? null},
        'current_affairs.yesterday.generate_on_demand',
        'current_affairs_generation_request',
        ${generationRequestId}::uuid,
        'Administrator requested complete previous-day Current Affairs generation',
        ${`Generated/ensured Current Affairs for ${result.targetDate}`},
        ${JSON.stringify({
          generationRequestId,
          targetDate: result.targetDate,
          before: result.before,
          after: result.after,
          summary: result.summary,
          discoveryCensus: result.discoveryCensus,
          dailyMasterPack: result.dailyMasterPack,
          dailyMasterPacks: result.dailyMasterPacks,
          publicationAuthority: false,
        })}::jsonb
      )
    `;
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to generate yesterday's Current Affairs");
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
