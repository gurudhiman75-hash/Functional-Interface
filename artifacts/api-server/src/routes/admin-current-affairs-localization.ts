import { Router, type IRouter, type Response } from "express";

import {
  createManualCurrentAffairsLocalization,
  CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES,
} from "../current-affairs/localization-runtime";
import type { CurrentAffairsLocalizationLanguage } from "../current-affairs/multilingual-localization";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import adminCurrentAffairsQuestionLocalizationRouter from "./admin-current-affairs-question-localization";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class LocalizationAdminError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function eventId(value: unknown): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new LocalizationAdminError("INVALID_EVENT_ID", "Current Affairs event ID is invalid.");
  return id;
}

function language(value: unknown): CurrentAffairsLocalizationLanguage {
  const code = text(value, 8).toLowerCase();
  if (!(CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES as readonly string[]).includes(code)) {
    throw new LocalizationAdminError("INVALID_LANGUAGE", "Choose Hindi (hi) or Punjabi (pa).");
  }
  return code as CurrentAffairsLocalizationLanguage;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof LocalizationAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_LOCALIZATION_SOURCE_NOT_FOUND" });
    return;
  }
  if (/only verified/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_EVENT_NOT_VERIFIED" });
    return;
  }
  if (/quality failed|parity failed|target-language script/i.test(message)) {
    res.status(409).json({ error: message, code: "LOCALIZATION_PARITY_FAILED" });
    return;
  }
  if (/must contain|requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_LOCALIZATION_INPUT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_LOCALIZATION_FAILED" });
}

router.use(adminCurrentAffairsQuestionLocalizationRouter);
router.use(authenticate);

router.get("/localization/queue", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const languageCode = req.query.languageCode ? language(req.query.languageCode) : null;
    const status = text(req.query.status, 30).toLowerCase();
    const limit = positiveInteger(req.query.limit, 100, 500);
    if (status && !["missing", "ready", "needs_editorial", "manual"].includes(status)) {
      throw new LocalizationAdminError("INVALID_LOCALIZATION_STATUS", "Choose missing, ready, needs_editorial or manual.");
    }
    const rows = await sqlClient`
      SELECT
        event.id::text AS id,
        event.public_code AS "publicCode",
        event.event_date AS "eventDate",
        event.category,
        event.status AS "eventStatus",
        event.learner_authoring_status AS "authoringStatus",
        version.id::text AS "authoringVersionId",
        version.version_number AS "authoringVersionNumber",
        version.learner_title AS "englishTitle",
        version.learner_summary AS "englishSummary",
        version.template_id AS "templateId",
        localization.id::text AS "localizationId",
        COALESCE(localization.language_code, ${languageCode ?? "hi"}) AS "languageCode",
        COALESCE(localization.status, 'missing') AS "localizationStatus",
        localization.localized_title AS "localizedTitle",
        localization.localized_summary AS "localizedSummary",
        localization.localized_one_liner AS "localizedOneLiner",
        localization.quality_snapshot AS "qualitySnapshot",
        localization.reasons,
        localization.updated_at AS "localizationUpdatedAt",
        COALESCE((
          SELECT json_agg(json_build_object('key', fact.fact_key, 'value', fact.fact_value, 'type', fact.fact_type)
            ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
          FROM content.current_affairs_facts fact
          WHERE fact.event_id=event.id AND fact.is_verified=true
        ), '[]'::json) AS facts
      FROM content.current_affairs_events event
      JOIN content.current_affairs_authoring_versions version
        ON version.id=event.learner_authoring_version_id
      LEFT JOIN content.current_affairs_localizations localization
        ON localization.event_id=event.id
        AND localization.authoring_version_id=version.id
        AND localization.language_code=${languageCode ?? "hi"}
      WHERE event.status='verified'
        AND event.learner_authoring_status IN ('ready', 'manual')
        AND (${status}='' OR COALESCE(localization.status, 'missing')=${status})
      ORDER BY
        CASE COALESCE(localization.status, 'missing')
          WHEN 'needs_editorial' THEN 0
          WHEN 'missing' THEN 1
          WHEN 'ready' THEN 2
          ELSE 3
        END,
        event.event_date DESC,
        event.updated_at DESC
      LIMIT ${limit}
    `;
    res.json({
      events: rows,
      requestedLanguage: languageCode ?? "hi",
      supportedLanguages: CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs localization queue");
  }
});

router.post(
  "/events/:id/localization/:languageCode/manual",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const id = eventId(req.params.id);
      const languageCode = language(req.params.languageCode);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new LocalizationAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const title = text(req.body?.title, 300);
      const summary = text(req.body?.summary, 6000);
      const oneLiner = text(req.body?.oneLiner, 1000);
      const reason = text(req.body?.reason, 1000);
      if (title.length < 8) throw new LocalizationAdminError("TITLE_REQUIRED", "Localized title must contain at least 8 characters.");
      if (summary.length < 20) throw new LocalizationAdminError("SUMMARY_REQUIRED", "Localized summary must contain at least 20 characters.");
      if (reason.length < 8) throw new LocalizationAdminError("EDITORIAL_REASON_REQUIRED", "Provide an editorial reason for manual localization.");

      const result = await createManualCurrentAffairsLocalization({
        eventId: id,
        languageCode,
        title,
        summary,
        oneLiner: oneLiner || undefined,
        reason,
        actorUserId,
      });
      res.status(201).json(result);
    } catch (error) {
      sendError(res, error, "Unable to save manual Current Affairs localization");
    }
  },
);

export default router;
