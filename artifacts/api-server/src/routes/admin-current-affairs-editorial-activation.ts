import { Router, type IRouter, type Response } from "express";

import { createManualAuthoringVersion } from "../current-affairs/authoring-runtime";
import {
  createManualCurrentAffairsLocalization,
  CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES,
} from "../current-affairs/localization-runtime";
import type { CurrentAffairsLocalizationLanguage } from "../current-affairs/multilingual-localization";
import { titleSimilarity } from "../current-affairs/original-authoring";
import {
  approveCurrentAffairsQuestionEditorialItem,
  createManualCurrentAffairsEnglishQuestionRevision,
  loadCurrentAffairsQuestionEditorialDetail,
  loadCurrentAffairsQuestionEditorialQueue,
} from "../current-affairs/question-editorial-runtime";
import { createManualCurrentAffairsQuestionLocalization } from "../current-affairs/question-localization-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MANUAL_TITLE_SIMILARITY_LIMIT = 0.72;

class EditorialActivationError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function uuid(value: unknown, code = "INVALID_ID"): string {
  const id = text(value, 80);
  if (!UUID_PATTERN.test(id)) throw new EditorialActivationError(code, "Current Affairs editorial ID is invalid.");
  return id;
}

function language(value: unknown): CurrentAffairsLocalizationLanguage {
  const code = text(value, 8).toLowerCase();
  if (!(CURRENT_AFFAIRS_LOCALIZATION_LANGUAGES as readonly string[]).includes(code)) {
    throw new EditorialActivationError("INVALID_LANGUAGE", "Choose Hindi (hi) or Punjabi (pa).");
  }
  return code as CurrentAffairsLocalizationLanguage;
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof EditorialActivationError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_EDITORIAL_NOT_FOUND" });
    return;
  }
  if (/blocked|locked|conflict|only verified|not editable|must remain|preserve|parity failed|quality failed|target-language script|too similar/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_EDITORIAL_GATE_FAILED" });
    return;
  }
  if (/must contain|requires an editorial reason|editorial reason|invalid correct index|option count|options must/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_EDITORIAL_INPUT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_EDITORIAL_FAILED" });
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
  for (const row of rows) {
    maxSimilarity = Math.max(maxSimilarity, titleSimilarity(learnerTitle, String(row.title ?? "")));
  }
  if (maxSimilarity >= MANUAL_TITLE_SIMILARITY_LIMIT) {
    throw new EditorialActivationError(
      "SOURCE_TITLE_TOO_SIMILAR",
      `Learner title is too similar to an evidence-source title (${maxSimilarity.toFixed(2)}). Rewrite it from verified facts instead of the source headline.`,
      409,
    );
  }
  return Number(maxSimilarity.toFixed(4));
}

async function loadEventEditorialQueue(limit: number) {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.event_date::text AS "eventDate",
      event.category,
      event.status AS "eventStatus",
      event.learner_authoring_status AS "authoringStatus",
      version.id::text AS "authoringVersionId",
      version.version_number::int AS "authoringVersionNumber",
      COALESCE(hi.status, 'missing') AS "hindiStatus",
      COALESCE(pa.status, 'missing') AS "punjabiStatus",
      EXISTS (
        SELECT 1
        FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      ) AS "hasOpenConflict",
      (
        SELECT COUNT(*)::int
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ) AS "verifiedFactCount",
      primary_source.source_key AS "primarySourceKey",
      primary_source.name AS "primarySourceName",
      primary_evidence.source_title AS "primarySourceTitle",
      primary_evidence.source_url AS "primarySourceUrl"
    FROM content.current_affairs_events event
    LEFT JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_localizations hi
      ON hi.event_id=event.id
      AND hi.authoring_version_id=event.learner_authoring_version_id
      AND hi.language_code='hi'
    LEFT JOIN content.current_affairs_localizations pa
      ON pa.event_id=event.id
      AND pa.authoring_version_id=event.learner_authoring_version_id
      AND pa.language_code='pa'
    LEFT JOIN LATERAL (
      SELECT *
      FROM content.current_affairs_event_sources evidence
      WHERE evidence.event_id=event.id
      ORDER BY evidence.is_primary_evidence DESC, evidence.created_at ASC
      LIMIT 1
    ) primary_evidence ON true
    LEFT JOIN content.current_affairs_sources primary_source
      ON primary_source.id=primary_evidence.source_id
    WHERE event.status='verified'
      AND COALESCE((event.metadata->>'autoPromoted')::boolean, false)=true
    ORDER BY
      CASE event.learner_authoring_status
        WHEN 'needs_editorial' THEN 0
        WHEN 'pending' THEN 1
        WHEN 'ready' THEN 2
        WHEN 'manual' THEN 3
        ELSE 4
      END,
      event.event_date DESC,
      event.updated_at DESC
    LIMIT ${limit}
  `;
  const items = rows.map((row) => ({ ...row }));
  return {
    items,
    counts: {
      total: items.length,
      needsEditorial: items.filter((item) => String(item.authoringStatus) === "needs_editorial").length,
      pending: items.filter((item) => String(item.authoringStatus) === "pending").length,
      ready: items.filter((item) => ["ready", "manual"].includes(String(item.authoringStatus))).length,
      conflicts: items.filter((item) => Boolean(item.hasOpenConflict)).length,
    },
    generatedAt: new Date().toISOString(),
  };
}

async function loadEventEditorialDetail(eventId: string) {
  const events = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS "canonicalTitle",
      event.summary AS "canonicalSummary",
      event.importance_reason AS "importanceReason",
      event.event_date::text AS "eventDate",
      event.category,
      event.subcategory,
      event.status AS "eventStatus",
      event.verification_confidence::float8 AS "verificationConfidence",
      event.learner_authoring_status AS "authoringStatus",
      version.id::text AS "authoringVersionId",
      version.version_number::int AS "authoringVersionNumber",
      version.status AS "authoringVersionStatus",
      version.learner_title AS "learnerTitle",
      version.learner_summary AS "learnerSummary",
      version.learner_one_liner AS "learnerOneLiner",
      version.authoring_method AS "authoringMethod",
      version.source_title_similarity::float8 AS "sourceTitleSimilarity",
      version.reasons AS "authoringReasons",
      version.created_at::text AS "authoringCreatedAt",
      event.updated_at::text AS "eventUpdatedAt"
    FROM content.current_affairs_events event
    LEFT JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    WHERE event.id=${eventId}::uuid
      AND COALESCE((event.metadata->>'autoPromoted')::boolean, false)=true
    LIMIT 1
  `;
  const event = events[0];
  if (!event) throw new Error("Current Affairs editorial event not found");

  const authoringVersionId = event.authoringVersionId ? String(event.authoringVersionId) : null;
  const [sources, facts, conflicts, localizations, history] = await Promise.all([
    sqlClient`
      SELECT
        source.source_key AS "sourceKey",
        source.name AS "sourceName",
        source.trust_score::float8 AS "trustScore",
        evidence.source_url AS "sourceUrl",
        evidence.source_title AS "sourceTitle",
        evidence.source_published_at::text AS "sourcePublishedAt",
        evidence.is_primary_evidence AS "isPrimaryEvidence",
        evidence.evidence_confidence::float8 AS "evidenceConfidence"
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=${eventId}::uuid
      ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC
    `,
    sqlClient`
      SELECT
        id::text AS id,
        fact_key AS "factKey",
        fact_value AS "factValue",
        fact_type AS "factType",
        is_verified AS "isVerified",
        confidence::float8 AS confidence,
        reconciliation_status AS "reconciliationStatus",
        support_count::int AS "supportCount",
        primary_support_count::int AS "primarySupportCount",
        sort_order::int AS "sortOrder"
      FROM content.current_affairs_facts
      WHERE event_id=${eventId}::uuid
      ORDER BY sort_order, fact_key, fact_value
    `,
    sqlClient`
      SELECT
        id::text AS id,
        fact_key AS "factKey",
        competing_values AS "competingValues",
        status,
        preferred_value AS "preferredValue",
        resolution_reason AS "resolutionReason",
        updated_at::text AS "updatedAt"
      FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid
      ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, updated_at DESC
    `,
    authoringVersionId
      ? sqlClient`
          SELECT
            id::text AS id,
            language_code AS "languageCode",
            status,
            localized_title AS "localizedTitle",
            localized_summary AS "localizedSummary",
            localized_one_liner AS "localizedOneLiner",
            localization_method AS "localizationMethod",
            quality_snapshot AS "qualitySnapshot",
            reasons,
            reviewed_by::text AS "reviewedBy",
            updated_at::text AS "updatedAt"
          FROM content.current_affairs_localizations
          WHERE event_id=${eventId}::uuid
            AND authoring_version_id=${authoringVersionId}::uuid
            AND language_code IN ('hi','pa')
          ORDER BY language_code
        `
      : Promise.resolve([]),
    sqlClient`
      SELECT
        id::text AS id,
        version_number::int AS "versionNumber",
        status,
        learner_title AS "learnerTitle",
        learner_summary AS "learnerSummary",
        learner_one_liner AS "learnerOneLiner",
        authoring_method AS "authoringMethod",
        source_title_similarity::float8 AS "sourceTitleSimilarity",
        reasons,
        created_at::text AS "createdAt"
      FROM content.current_affairs_authoring_versions
      WHERE event_id=${eventId}::uuid
      ORDER BY version_number DESC
      LIMIT 12
    `,
  ]);

  const verifiedFacts = facts.filter((fact) => Boolean(fact.isVerified));
  const hasOpenConflict = conflicts.some((conflict) => String(conflict.status) === "open");
  return {
    event,
    sources,
    facts,
    conflicts,
    localizations,
    authoringHistory: history,
    gates: {
      eventVerified: String(event.eventStatus) === "verified",
      hasVerifiedFacts: verifiedFacts.length > 0,
      hasOpenConflict,
      authoringCurrent: Boolean(authoringVersionId),
    },
    generatedAt: new Date().toISOString(),
  };
}

router.use(authenticate);

router.get("/editorial/queue", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    res.json(await loadEventEditorialQueue(positiveInteger(req.query.limit, 200, 500)));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs editorial queue");
  }
});

router.get("/editorial/events/:eventId", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    res.json(await loadEventEditorialDetail(uuid(req.params.eventId, "INVALID_EVENT_ID")));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs editorial event");
  }
});

router.post("/editorial/events/:eventId/english", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EditorialActivationError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const eventId = uuid(req.params.eventId, "INVALID_EVENT_ID");
    const title = text(req.body?.title, 240);
    const summary = text(req.body?.summary, 5000);
    const oneLiner = text(req.body?.oneLiner, 600);
    const reason = text(req.body?.reason, 1000);
    if (title.length < 12) throw new EditorialActivationError("TITLE_REQUIRED", "Learner title must contain at least 12 characters.");
    if (summary.length < 20) throw new EditorialActivationError("SUMMARY_REQUIRED", "Learner summary must contain at least 20 characters.");
    if (reason.length < 8) throw new EditorialActivationError("EDITORIAL_REASON_REQUIRED", "Provide an editorial reason of at least 8 characters.");
    const sourceTitleSimilarity = await sourceTitleSimilarityGate(eventId, title);
    const result = await createManualAuthoringVersion({ eventId, title, summary, oneLiner: oneLiner || undefined, reason, actorUserId });
    res.status(201).json({ ...result, sourceTitleSimilarity });
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs English editorial revision");
  }
});

router.post("/editorial/events/:eventId/localization/:languageCode", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EditorialActivationError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const eventId = uuid(req.params.eventId, "INVALID_EVENT_ID");
    const languageCode = language(req.params.languageCode);
    const title = text(req.body?.title, 300);
    const summary = text(req.body?.summary, 6000);
    const oneLiner = text(req.body?.oneLiner, 1000);
    const reason = text(req.body?.reason, 1000);
    const result = await createManualCurrentAffairsLocalization({ eventId, languageCode, title, summary, oneLiner: oneLiner || undefined, reason, actorUserId });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs localization revision");
  }
});

router.get("/question-editorial/queue", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    res.json(await loadCurrentAffairsQuestionEditorialQueue(positiveInteger(req.query.limit, 300, 500)));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs question editorial queue");
  }
});

router.get("/question-editorial/:generationItemId", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    res.json(await loadCurrentAffairsQuestionEditorialDetail(uuid(req.params.generationItemId, "INVALID_GENERATION_ITEM_ID")));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs question editorial detail");
  }
});

router.post("/question-editorial/:generationItemId/english", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EditorialActivationError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const result = await createManualCurrentAffairsEnglishQuestionRevision({
      generationItemId: uuid(req.params.generationItemId, "INVALID_GENERATION_ITEM_ID"),
      stem: text(req.body?.stem, 20_000),
      explanation: text(req.body?.explanation, 40_000),
      reason: text(req.body?.reason, 1000),
      actorUserId,
    });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs English question revision");
  }
});

router.post("/question-editorial/:generationItemId/localization/:languageCode", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EditorialActivationError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const options = Array.isArray(req.body?.options) ? req.body.options.map((item: unknown) => text(item, 4000)) : [];
    const result = await createManualCurrentAffairsQuestionLocalization({
      generationItemId: uuid(req.params.generationItemId, "INVALID_GENERATION_ITEM_ID"),
      languageCode: language(req.params.languageCode),
      stem: text(req.body?.stem, 20_000),
      explanation: text(req.body?.explanation, 40_000),
      options,
      reason: text(req.body?.reason, 1000),
      actorUserId,
    });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs question localization");
  }
});

router.post("/question-editorial/:generationItemId/approve", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EditorialActivationError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    res.json(await approveCurrentAffairsQuestionEditorialItem({
      generationItemId: uuid(req.params.generationItemId, "INVALID_GENERATION_ITEM_ID"),
      reason: text(req.body?.reason, 1000),
      actorUserId,
    }));
  } catch (error) {
    sendError(res, error, "Unable to approve Current Affairs question editorial item");
  }
});

export default router;
