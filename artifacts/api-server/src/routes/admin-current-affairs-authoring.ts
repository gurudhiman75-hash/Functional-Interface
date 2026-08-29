import { Router, type IRouter, type Response } from "express";

import { createManualAuthoringVersion } from "../current-affairs/authoring-runtime";
import { titleSimilarity } from "../current-affairs/original-authoring";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MANUAL_TITLE_SIMILARITY_LIMIT = 0.72;

class AuthoringAdminError extends Error {
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

function uuid(value: unknown): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new AuthoringAdminError("INVALID_EVENT_ID", "Current Affairs event ID is invalid.");
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof AuthoringAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_EVENT_NOT_FOUND" });
    return;
  }
  if (/only verified/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_EVENT_NOT_VERIFIED" });
    return;
  }
  if (/must contain|requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_AUTHORING_INPUT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_AUTHORING_FAILED" });
}

async function sourceTitleSimilarityGate(eventId: string, learnerTitle: string) {
  const rows = await sqlClient`
    SELECT source_title AS title
    FROM content.current_affairs_event_sources
    WHERE event_id=${eventId}::uuid
      AND BTRIM(COALESCE(source_title, '')) <> ''
    ORDER BY is_primary_evidence DESC, created_at ASC
    LIMIT 20
  `;
  let maxSimilarity = 0;
  let closestTitle = "";
  for (const row of rows) {
    const sourceTitle = String(row.title ?? "");
    const similarity = titleSimilarity(learnerTitle, sourceTitle);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      closestTitle = sourceTitle;
    }
  }
  return { maxSimilarity, closestTitle };
}

router.use(authenticate);

router.get("/authoring/queue", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const status = text(req.query.status, 30).toLowerCase();
    const limit = positiveInteger(req.query.limit, 100, 500);
    if (status && !["pending", "ready", "needs_editorial", "manual"].includes(status)) {
      throw new AuthoringAdminError("INVALID_AUTHORING_STATUS", "Choose pending, ready, needs_editorial or manual.");
    }
    const rows = await sqlClient`
      SELECT
        event.id::text AS id,
        event.public_code AS "publicCode",
        event.canonical_title AS "currentTitle",
        event.summary AS "currentSummary",
        event.event_date AS "eventDate",
        event.category,
        event.status AS "eventStatus",
        event.learner_authoring_status AS "authoringStatus",
        version.id::text AS "authoringVersionId",
        version.version_number AS "authoringVersionNumber",
        version.template_id AS "templateId",
        version.source_title_similarity::float8 AS "sourceTitleSimilarity",
        version.reasons,
        source.source_key AS "primarySourceKey",
        evidence.source_title AS "primarySourceTitle",
        evidence.source_url AS "primarySourceUrl",
        COALESCE((
          SELECT json_agg(json_build_object(
            'key', fact.fact_key,
            'value', fact.fact_value,
            'type', fact.fact_type,
            'confidence', fact.confidence::float8
          ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
          FROM content.current_affairs_facts fact
          WHERE fact.event_id=event.id AND fact.is_verified=true
        ), '[]'::json) AS facts
      FROM content.current_affairs_events event
      LEFT JOIN content.current_affairs_authoring_versions version
        ON version.id=event.learner_authoring_version_id
      LEFT JOIN LATERAL (
        SELECT * FROM content.current_affairs_event_sources item
        WHERE item.event_id=event.id
        ORDER BY item.is_primary_evidence DESC, item.created_at ASC
        LIMIT 1
      ) evidence ON true
      LEFT JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE event.status='verified'
        AND COALESCE((event.metadata->>'autoPromoted')::boolean, false)=true
        AND (${status}='' OR event.learner_authoring_status=${status})
      ORDER BY
        CASE event.learner_authoring_status
          WHEN 'needs_editorial' THEN 0
          WHEN 'pending' THEN 1
          WHEN 'ready' THEN 2
          ELSE 3
        END,
        event.event_date DESC,
        event.updated_at DESC
      LIMIT ${limit}
    `;
    res.json({
      events: rows,
      similarityLimit: MANUAL_TITLE_SIMILARITY_LIMIT,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs authoring queue");
  }
});

router.post(
  "/events/:id/authoring/manual",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const eventId = uuid(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new AuthoringAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const title = text(req.body?.title, 240);
      const summary = text(req.body?.summary, 5000);
      const oneLiner = text(req.body?.oneLiner, 600);
      const reason = text(req.body?.reason, 1000);
      if (title.length < 12) throw new AuthoringAdminError("TITLE_REQUIRED", "Learner title must contain at least 12 characters.");
      if (summary.length < 20) throw new AuthoringAdminError("SUMMARY_REQUIRED", "Learner summary must contain at least 20 characters.");
      if (reason.length < 8) throw new AuthoringAdminError("EDITORIAL_REASON_REQUIRED", "Provide an editorial reason for manual authoring.");

      const similarity = await sourceTitleSimilarityGate(eventId, title);
      if (similarity.maxSimilarity >= MANUAL_TITLE_SIMILARITY_LIMIT) {
        throw new AuthoringAdminError(
          "SOURCE_TITLE_TOO_SIMILAR",
          `Learner title is too similar to an evidence-source title (${similarity.maxSimilarity.toFixed(2)}). Rewrite it from the verified facts instead of the source headline.`,
          409,
        );
      }

      const result = await createManualAuthoringVersion({
        eventId,
        title,
        summary,
        oneLiner: oneLiner || undefined,
        reason,
        actorUserId,
      });
      res.status(201).json({ ...result, sourceTitleSimilarity: similarity.maxSimilarity });
    } catch (error) {
      sendError(res, error, "Unable to save manual Current Affairs learner wording");
    }
  },
);

export default router;
