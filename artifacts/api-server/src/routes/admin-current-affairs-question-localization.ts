import { Router, type IRouter, type Response } from "express";

import {
  createManualCurrentAffairsQuestionLocalization,
} from "../current-affairs/question-localization-runtime";
import type { CurrentAffairsLocalizationLanguage } from "../current-affairs/multilingual-localization";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class QuestionLocalizationAdminError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function uuid(value: unknown): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new QuestionLocalizationAdminError("INVALID_GENERATION_ITEM_ID", "Generation item ID is invalid.");
  return id;
}

function language(value: unknown): CurrentAffairsLocalizationLanguage {
  const code = text(value, 8).toLowerCase();
  if (code !== "hi" && code !== "pa") {
    throw new QuestionLocalizationAdminError("INVALID_LANGUAGE", "Choose Hindi (hi) or Punjabi (pa).");
  }
  return code;
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => text(item, 4000)).filter(Boolean)
    : [];
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof QuestionLocalizationAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found|required before/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_QUESTION_LOCALIZATION_SOURCE_NOT_FOUND" });
    return;
  }
  if (/preserve|canonical fact|target-language script|invalid correct index/i.test(message)) {
    res.status(409).json({ error: message, code: "QUESTION_LOCALIZATION_PARITY_FAILED" });
    return;
  }
  if (/requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "EDITORIAL_REASON_REQUIRED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_QUESTION_LOCALIZATION_FAILED" });
}

router.use(authenticate);

router.get(
  "/question-localization/queue",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const languageCode = req.query.languageCode ? language(req.query.languageCode) : "hi";
      const status = text(req.query.status, 30).toLowerCase();
      const limit = positiveInteger(req.query.limit, 100, 500);
      if (status && !["missing", "ready", "needs_editorial", "manual"].includes(status)) {
        throw new QuestionLocalizationAdminError(
          "INVALID_LOCALIZATION_STATUS",
          "Choose missing, ready, needs_editorial or manual.",
        );
      }
      const rows = await sqlClient`
        SELECT
          item.id::text AS "generationItemId",
          item.item_number AS "itemNumber",
          version.id::text AS "sourceGenerationVersionId",
          version.payload AS "sourcePayload",
          link.event_id::text AS "eventId",
          event.public_code AS "eventPublicCode",
          link.fact_id::text AS "factId",
          link.fact_key AS "factKey",
          link.question_family AS "questionFamily",
          localization.id::text AS "localizationId",
          COALESCE(localization.status, 'missing') AS "localizationStatus",
          localization.localized_payload AS "localizedPayload",
          localization.quality_snapshot AS "qualitySnapshot",
          localization.reasons,
          localization.updated_at AS "localizationUpdatedAt"
        FROM content.current_affairs_question_links link
        JOIN content.generation_run_items item ON item.id=link.generation_item_id
        JOIN content.generation_item_versions version
          ON version.generation_item_id=item.id
          AND version.version_number=item.current_version_number
        JOIN content.generation_runs run ON run.id=item.generation_run_id
        JOIN content.current_affairs_events event ON event.id=link.event_id
        LEFT JOIN content.current_affairs_question_localizations localization
          ON localization.source_generation_version_id=version.id
          AND localization.language_code=${languageCode}
        WHERE run.status='review'
          AND event.status='verified'
          AND version.payload->>'language'='en'
          AND version.payload->'generationContext'->>'questionBankAcceptanceMode'='BANK_ONLY'
          AND (${status}='' OR COALESCE(localization.status, 'missing')=${status})
        ORDER BY
          CASE COALESCE(localization.status, 'missing')
            WHEN 'needs_editorial' THEN 0
            WHEN 'missing' THEN 1
            WHEN 'ready' THEN 2
            ELSE 3
          END,
          run.created_at DESC,
          item.item_number ASC
        LIMIT ${limit}
      `;
      res.json({
        items: rows,
        requestedLanguage: languageCode,
        supportedLanguages: ["hi", "pa"],
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs question-localization queue");
    }
  },
);

router.post(
  "/question-localization/:generationItemId/:languageCode/manual",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const generationItemId = uuid(req.params.generationItemId);
      const languageCode = language(req.params.languageCode);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new QuestionLocalizationAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const stem = text(req.body?.stem, 20_000);
      const explanation = text(req.body?.explanation, 40_000);
      const options = stringArray(req.body?.options);
      const reason = text(req.body?.reason, 1000);
      if (stem.length < 8) throw new QuestionLocalizationAdminError("STEM_REQUIRED", "Localized stem is required.");
      if (explanation.length < 12) throw new QuestionLocalizationAdminError("EXPLANATION_REQUIRED", "Localized explanation is required.");
      if (options.length < 2) throw new QuestionLocalizationAdminError("OPTIONS_REQUIRED", "Localized options are required.");
      if (reason.length < 8) throw new QuestionLocalizationAdminError("EDITORIAL_REASON_REQUIRED", "Provide an editorial reason.");

      const result = await createManualCurrentAffairsQuestionLocalization({
        generationItemId,
        languageCode,
        stem,
        explanation,
        options,
        reason,
        actorUserId,
      });
      res.status(201).json(result);
    } catch (error) {
      sendError(res, error, "Unable to save manual Current Affairs question localization");
    }
  },
);

export default router;
