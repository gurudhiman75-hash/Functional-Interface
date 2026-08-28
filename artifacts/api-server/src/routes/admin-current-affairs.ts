import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  CURRENT_AFFAIRS_CATEGORIES,
  canAutoVerify,
  currentAffairsFingerprint,
  publicCurrentAffairsCode,
  renderEventMarkdown,
  scoreExamRelevance,
  sourceCandidateDedupeKey,
  validateEventCandidate,
  type CurrentAffairsCategory,
  type EventCandidateInput,
} from "../current-affairs/core";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sourceTypes = new Set([
  "official",
  "regulator",
  "state_government",
  "international_organization",
  "newswire",
  "newspaper",
  "other",
]);

class CurrentAffairsAdminError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode = 400,
  ) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function nullableText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

function booleanValue(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function numeric(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CurrentAffairsAdminError("INVALID_ID", `${label} is invalid.`);
  return id;
}

function isoDateTime(value: unknown): string | null {
  if (value == null || value === "") return null;
  const raw = text(value, 80);
  const parsed = new Date(raw);
  if (!raw || Number.isNaN(parsed.getTime())) {
    throw new CurrentAffairsAdminError("INVALID_DATETIME", "Published time must be a valid ISO date/time.");
  }
  return parsed.toISOString();
}

function httpsUrl(value: unknown, label: string): string {
  const raw = text(value, 2000);
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new CurrentAffairsAdminError("INVALID_URL", `${label} must be a valid HTTPS URL.`);
  }
  if (parsed.protocol !== "https:") {
    throw new CurrentAffairsAdminError("INVALID_URL", `${label} must use HTTPS.`);
  }
  parsed.hash = "";
  return parsed.toString();
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CurrentAffairsAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof Error && error.message) {
    res.status(400).json({ error: error.message, code: "CURRENT_AFFAIRS_VALIDATION_FAILED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_ADMIN_FAILED" });
}

async function sourceByKey(sourceKey: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS id,
      source_key AS "sourceKey",
      name,
      source_type AS "sourceType",
      base_url AS "baseUrl",
      feed_url AS "feedUrl",
      trust_score::float8 AS "trustScore",
      is_primary_source AS "isPrimarySource",
      is_active AS "isActive"
    FROM content.current_affairs_sources
    WHERE source_key = ${sourceKey}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function eventById(id: string) {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.summary,
      event.importance_reason AS "importanceReason",
      event.event_date AS "eventDate",
      event.category,
      event.subcategory,
      event.status,
      event.verification_confidence::float8 AS "verificationConfidence",
      event.published_learning_resource_id::text AS "publishedLearningResourceId",
      event.created_at AS "createdAt",
      event.updated_at AS "updatedAt"
    FROM content.current_affairs_events event
    WHERE event.id = ${id}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}

router.use(authenticate);

router.get("/dashboard", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const [sourceCounts, candidateCounts, eventCounts, reviewQueue] = await Promise.all([
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE is_active)::int AS active,
          COUNT(*) FILTER (WHERE is_active AND is_primary_source)::int AS "activePrimary"
        FROM content.current_affairs_sources
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'queued')::int AS queued,
          COUNT(*) FILTER (WHERE status = 'clustered')::int AS clustered,
          COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
          COUNT(*) FILTER (WHERE status = 'error')::int AS errors
        FROM content.current_affairs_ingestion_candidates
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'candidate')::int AS candidate,
          COUNT(*) FILTER (WHERE status = 'review')::int AS review,
          COUNT(*) FILTER (WHERE status = 'verified')::int AS verified,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published,
          COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
        FROM content.current_affairs_events
      `,
      sqlClient`
        SELECT
          event.id::text AS id,
          event.public_code AS "publicCode",
          event.canonical_title AS title,
          event.event_date AS "eventDate",
          event.category,
          event.status,
          event.verification_confidence::float8 AS "verificationConfidence",
          COALESCE(MAX(score.relevance_score), 0)::int AS "maxRelevanceScore",
          COUNT(DISTINCT evidence.source_url)::int AS "evidenceCount",
          COUNT(DISTINCT fact.id)::int AS "factCount"
        FROM content.current_affairs_events event
        LEFT JOIN content.current_affairs_exam_scores score ON score.event_id = event.id
        LEFT JOIN content.current_affairs_event_sources evidence ON evidence.event_id = event.id
        LEFT JOIN content.current_affairs_facts fact ON fact.event_id = event.id
        WHERE event.status IN ('candidate', 'review', 'verified')
        GROUP BY event.id
        ORDER BY event.event_date DESC, "maxRelevanceScore" DESC, event.updated_at DESC
        LIMIT 100
      `,
    ]);

    res.json({
      sources: sourceCounts[0] ?? { total: 0, active: 0, activePrimary: 0 },
      candidates: candidateCounts[0] ?? { total: 0, queued: 0, clustered: 0, rejected: 0, errors: 0 },
      events: eventCounts[0] ?? { total: 0, candidate: 0, review: 0, verified: 0, published: 0, rejected: 0 },
      reviewQueue,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs Studio dashboard");
  }
});

router.get("/sources", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        id::text AS id,
        source_key AS "sourceKey",
        name,
        source_type AS "sourceType",
        base_url AS "baseUrl",
        feed_url AS "feedUrl",
        trust_score::float8 AS "trustScore",
        is_primary_source AS "isPrimarySource",
        is_active AS "isActive",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM content.current_affairs_sources
      ORDER BY is_active DESC, is_primary_source DESC, trust_score DESC, name
    `;
    res.json({ sources: rows });
  } catch (error) {
    sendError(res, error, "Unable to load current-affairs sources");
  }
});

router.post("/sources", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);

    const sourceKey = text(req.body?.sourceKey, 80).toLowerCase();
    const name = text(req.body?.name, 160);
    const sourceType = text(req.body?.sourceType, 60).toLowerCase();
    const baseUrl = httpsUrl(req.body?.baseUrl, "Base URL");
    const feedUrl = req.body?.feedUrl ? httpsUrl(req.body.feedUrl, "Feed URL") : null;
    const trustScore = numeric(req.body?.trustScore, 0.7, 0, 1);
    const isPrimarySource = booleanValue(req.body?.isPrimarySource);

    if (!/^[a-z0-9][a-z0-9_-]{1,79}$/.test(sourceKey)) {
      throw new CurrentAffairsAdminError("INVALID_SOURCE_KEY", "Source key is invalid.");
    }
    if (name.length < 2) throw new CurrentAffairsAdminError("INVALID_SOURCE_NAME", "Source name is required.");
    if (!sourceTypes.has(sourceType)) throw new CurrentAffairsAdminError("INVALID_SOURCE_TYPE", "Choose a supported source type.");

    const id = randomUUID();
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.current_affairs_sources (
          id, source_key, name, source_type, base_url, feed_url,
          trust_score, is_primary_source, is_active, created_at, updated_at
        ) VALUES (
          ${id}::uuid, ${sourceKey}, ${name}, ${sourceType}, ${baseUrl}, ${feedUrl},
          ${trustScore}, ${isPrimarySource}, true, now(), now()
        )
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'current_affairs.source.created',
          'current_affairs_source',
          ${id}::uuid,
          ${`Registered Current Affairs source ${sourceKey}`},
          ${JSON.stringify({ sourceType, baseUrl, trustScore, isPrimarySource })}
        )
      `;
    });

    res.status(201).json({ source: await sourceByKey(sourceKey) });
  } catch (error) {
    sendError(res, error, "Unable to create current-affairs source");
  }
});

router.post("/candidates", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const sourceKey = text(req.body?.sourceKey, 80).toLowerCase();
    const source = await sourceByKey(sourceKey) as { id?: unknown; isActive?: unknown } | null;
    if (!source || !source.isActive) {
      throw new CurrentAffairsAdminError("SOURCE_UNAVAILABLE", "Choose an active registered source.", 404);
    }

    const sourceUrl = httpsUrl(req.body?.sourceUrl, "Source URL");
    const rawTitle = text(req.body?.rawTitle, 500);
    if (rawTitle.length < 8) throw new CurrentAffairsAdminError("INVALID_CANDIDATE_TITLE", "Candidate title is too short.");
    const dedupeKey = sourceCandidateDedupeKey(sourceKey, sourceUrl, rawTitle);
    const id = randomUUID();
    const publishedAt = isoDateTime(req.body?.publishedAt);
    const payload = req.body?.payload && typeof req.body.payload === "object" && !Array.isArray(req.body.payload)
      ? req.body.payload
      : {};

    const rows = await sqlClient`
      INSERT INTO content.current_affairs_ingestion_candidates (
        id, source_id, source_url, external_id, raw_title, raw_summary,
        published_at, dedupe_key, status, payload, created_at, updated_at
      ) VALUES (
        ${id}::uuid,
        ${String(source.id)}::uuid,
        ${sourceUrl},
        ${nullableText(req.body?.externalId, 240)},
        ${rawTitle},
        ${text(req.body?.rawSummary, 10000)},
        ${publishedAt},
        ${dedupeKey},
        'queued',
        ${JSON.stringify(payload)},
        now(),
        now()
      )
      ON CONFLICT (source_url) DO UPDATE
      SET raw_title = EXCLUDED.raw_title,
          raw_summary = EXCLUDED.raw_summary,
          published_at = COALESCE(EXCLUDED.published_at, content.current_affairs_ingestion_candidates.published_at),
          dedupe_key = EXCLUDED.dedupe_key,
          payload = EXCLUDED.payload,
          updated_at = now()
      RETURNING
        id::text AS id,
        source_url AS "sourceUrl",
        raw_title AS "rawTitle",
        published_at AS "publishedAt",
        dedupe_key AS "dedupeKey",
        status
    `;
    res.status(201).json({ candidate: rows[0] });
  } catch (error) {
    sendError(res, error, "Unable to ingest current-affairs candidate");
  }
});

router.get("/events", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const status = text(req.query.status, 40).toLowerCase();
    const category = text(req.query.category, 60).toLowerCase();
    const rows = await sqlClient`
      SELECT
        event.id::text AS id,
        event.public_code AS "publicCode",
        event.canonical_title AS title,
        event.summary,
        event.event_date AS "eventDate",
        event.category,
        event.subcategory,
        event.status,
        event.verification_confidence::float8 AS "verificationConfidence",
        event.published_learning_resource_id::text AS "publishedLearningResourceId",
        COALESCE(MAX(score.relevance_score), 0)::int AS "maxRelevanceScore",
        COUNT(DISTINCT evidence.source_url)::int AS "evidenceCount",
        COUNT(DISTINCT fact.id)::int AS "factCount",
        event.updated_at AS "updatedAt"
      FROM content.current_affairs_events event
      LEFT JOIN content.current_affairs_exam_scores score ON score.event_id = event.id
      LEFT JOIN content.current_affairs_event_sources evidence ON evidence.event_id = event.id
      LEFT JOIN content.current_affairs_facts fact ON fact.event_id = event.id
      WHERE (${status} = '' OR event.status = ${status})
        AND (${category} = '' OR event.category = ${category})
      GROUP BY event.id
      ORDER BY event.event_date DESC, "maxRelevanceScore" DESC, event.updated_at DESC
      LIMIT 500
    `;
    res.json({ events: rows });
  } catch (error) {
    sendError(res, error, "Unable to load current-affairs events");
  }
});

router.post("/events", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);

    const sourceKey = text(req.body?.sourceKey, 80).toLowerCase();
    const source = await sourceByKey(sourceKey) as {
      id?: unknown;
      trustScore?: unknown;
      isPrimarySource?: unknown;
      isActive?: unknown;
    } | null;
    if (!source || !source.isActive) {
      throw new CurrentAffairsAdminError("SOURCE_UNAVAILABLE", "Choose an active registered source.", 404);
    }

    const candidate = validateEventCandidate({
      title: text(req.body?.title, 240),
      summary: text(req.body?.summary, 5000),
      importanceReason: text(req.body?.importanceReason, 2000),
      eventDate: text(req.body?.eventDate, 10),
      category: text(req.body?.category, 60).toLowerCase() as CurrentAffairsCategory,
      subcategory: nullableText(req.body?.subcategory, 120) ?? undefined,
      sourceKey,
      sourceUrl: httpsUrl(req.body?.sourceUrl, "Source URL"),
      sourceTitle: nullableText(req.body?.sourceTitle, 300) ?? undefined,
      sourcePublishedAt: isoDateTime(req.body?.sourcePublishedAt) ?? undefined,
      sourceTrustScore: Number(source.trustScore ?? 0.7),
      isPrimarySource: Boolean(source.isPrimarySource),
      facts: Array.isArray(req.body?.facts) ? req.body.facts : [],
    } as EventCandidateInput);

    const fingerprint = currentAffairsFingerprint(candidate);
    const publicCode = publicCurrentAffairsCode(candidate.eventDate);
    const eventId = randomUUID();
    const scores = scoreExamRelevance(candidate);

    const existing = await sqlClient`
      SELECT id::text AS id, public_code AS "publicCode", status
      FROM content.current_affairs_events
      WHERE event_fingerprint = ${fingerprint}
      LIMIT 1
    `;
    if (existing[0]) {
      throw new CurrentAffairsAdminError(
        "EVENT_ALREADY_EXISTS",
        `A matching canonical event already exists as ${String(existing[0].publicCode)}.`,
        409,
      );
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.current_affairs_events (
          id, public_code, canonical_title, summary, importance_reason,
          event_date, category, subcategory, status, verification_confidence,
          event_fingerprint, valid_from, metadata, created_by, updated_by,
          created_at, updated_at
        ) VALUES (
          ${eventId}::uuid,
          ${publicCode},
          ${candidate.title},
          ${candidate.summary ?? ""},
          ${candidate.importanceReason ?? ""},
          ${candidate.eventDate},
          ${candidate.category},
          ${candidate.subcategory ?? null},
          'review',
          0,
          ${fingerprint},
          ${candidate.eventDate},
          ${JSON.stringify({ ingestionVersion: "ca-cp001" })},
          ${actorUserId}::uuid,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;

      await tx`
        INSERT INTO content.current_affairs_event_sources (
          event_id, source_id, source_url, source_title, source_published_at,
          is_primary_evidence, evidence_confidence, metadata
        ) VALUES (
          ${eventId}::uuid,
          ${String(source.id)}::uuid,
          ${candidate.sourceUrl},
          ${candidate.sourceTitle ?? ""},
          ${candidate.sourcePublishedAt ?? null},
          ${Boolean(source.isPrimarySource)},
          ${Number(source.trustScore ?? 0.7)},
          '{}'::jsonb
        )
      `;

      for (let index = 0; index < (candidate.facts ?? []).length; index++) {
        const fact = candidate.facts![index];
        await tx`
          INSERT INTO content.current_affairs_facts (
            id, event_id, fact_key, fact_value, fact_type,
            is_verified, confidence, sort_order, created_at, updated_at
          ) VALUES (
            ${randomUUID()}::uuid,
            ${eventId}::uuid,
            ${fact.key},
            ${fact.value},
            ${fact.type ?? "string"},
            false,
            ${fact.confidence ?? Number(source.trustScore ?? 0.7)},
            ${index},
            now(),
            now()
          )
        `;
      }

      for (const score of scores) {
        await tx`
          INSERT INTO content.current_affairs_exam_scores (
            event_id, exam_family_key, relevance_score, include_recommended,
            reasons, created_at, updated_at
          ) VALUES (
            ${eventId}::uuid,
            ${score.examFamily},
            ${score.score},
            ${score.includeRecommended},
            ${JSON.stringify(score.reasons)},
            now(),
            now()
          )
        `;
      }

      await tx`
        UPDATE content.current_affairs_ingestion_candidates
        SET status = 'clustered', updated_at = now()
        WHERE source_url = ${candidate.sourceUrl}
      `;

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'current_affairs.event.created',
          'current_affairs_event',
          ${eventId}::uuid,
          ${`Created canonical Current Affairs event ${publicCode}`},
          ${JSON.stringify({ category: candidate.category, sourceKey, scores })}
        )
      `;
    });

    res.status(201).json({ event: await eventById(eventId), scores });
  } catch (error) {
    sendError(res, error, "Unable to create current-affairs event");
  }
});

router.post("/events/:id/verify", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const eventId = uuid(req.params.id, "Event ID");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const event = await eventById(eventId) as { status?: unknown } | null;
    if (!event) throw new CurrentAffairsAdminError("EVENT_NOT_FOUND", "Current-affairs event not found.", 404);
    if (!["candidate", "review"].includes(String(event.status))) {
      throw new CurrentAffairsAdminError("EVENT_NOT_REVIEWABLE", "Only candidate or review events can be verified.", 409);
    }

    const evidence = await sqlClient`
      SELECT
        evidence.is_primary_evidence AS "isPrimaryEvidence",
        source.trust_score::float8 AS "trustScore"
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id = evidence.source_id
      WHERE evidence.event_id = ${eventId}::uuid
    `;
    const facts = await sqlClient`
      SELECT confidence::float8 AS confidence
      FROM content.current_affairs_facts
      WHERE event_id = ${eventId}::uuid
    `;
    const decision = canAutoVerify({
      evidence: evidence.map((row) => ({
        isPrimaryEvidence: Boolean(row.isPrimaryEvidence),
        trustScore: Number(row.trustScore ?? 0),
      })),
      factConfidences: facts.map((row) => Number(row.confidence ?? 0)),
    });
    const force = req.body?.force === true;
    const reason = text(req.body?.reason, 1000);
    if (!decision.allowed && !force) {
      res.status(409).json({
        error: "Event does not meet the automatic verification gate.",
        code: "VERIFICATION_GATE_FAILED",
        decision,
      });
      return;
    }
    if (force && reason.length < 8) {
      throw new CurrentAffairsAdminError("MANUAL_VERIFICATION_REASON_REQUIRED", "Manual verification requires a reason.");
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE content.current_affairs_events
        SET status = 'verified',
            verification_confidence = ${decision.confidence},
            updated_by = ${actorUserId}::uuid,
            updated_at = now()
        WHERE id = ${eventId}::uuid
      `;
      await tx`
        UPDATE content.current_affairs_facts
        SET is_verified = true, updated_at = now()
        WHERE event_id = ${eventId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'current_affairs.event.verified',
          'current_affairs_event',
          ${eventId}::uuid,
          ${force ? reason : decision.reason},
          'Verified Current Affairs event',
          ${JSON.stringify({ automaticGatePassed: decision.allowed, forced: force, confidence: decision.confidence })}
        )
      `;
    });

    res.json({ event: await eventById(eventId), decision, forced: force });
  } catch (error) {
    sendError(res, error, "Unable to verify current-affairs event");
  }
});

router.post("/events/:id/publish-draft", requireAdminPermission("content.questions.publish"), async (req, res) => {
  try {
    const eventId = uuid(req.params.id, "Event ID");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const event = await eventById(eventId) as {
      publicCode?: unknown;
      title?: unknown;
      summary?: unknown;
      importanceReason?: unknown;
      eventDate?: unknown;
      category?: unknown;
      status?: unknown;
      publishedLearningResourceId?: unknown;
    } | null;
    if (!event) throw new CurrentAffairsAdminError("EVENT_NOT_FOUND", "Current-affairs event not found.", 404);
    if (String(event.status) !== "verified") {
      throw new CurrentAffairsAdminError("EVENT_NOT_VERIFIED", "Verify the event before creating learner content.", 409);
    }
    if (event.publishedLearningResourceId) {
      throw new CurrentAffairsAdminError("LEARNING_DRAFT_ALREADY_EXISTS", "This event already has a linked learning resource.", 409);
    }

    const facts = await sqlClient`
      SELECT fact_key AS key, fact_value AS value
      FROM content.current_affairs_facts
      WHERE event_id = ${eventId}::uuid AND is_verified = true
      ORDER BY sort_order, fact_key
    `;
    const resourceId = randomUUID();
    const markdown = renderEventMarkdown({
      title: String(event.title ?? ""),
      summary: String(event.summary ?? ""),
      importanceReason: String(event.importanceReason ?? ""),
      facts: facts.map((row) => ({ key: String(row.key), value: String(row.value) })),
    });

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${resourceId}::uuid,
          ${String(event.publicCode)},
          'current_affairs',
          'article',
          ${String(event.title)},
          ${String(event.summary ?? "")},
          'en',
          ${String(event.eventDate)},
          ${markdown},
          null,
          'draft',
          ${actorUserId}::uuid,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;
      await tx`
        UPDATE content.current_affairs_events
        SET published_learning_resource_id = ${resourceId}::uuid,
            updated_by = ${actorUserId}::uuid,
            updated_at = now()
        WHERE id = ${eventId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'current_affairs.learning_resource_draft.created',
          'current_affairs_event',
          ${eventId}::uuid,
          ${`Created learner draft for ${String(event.publicCode)}`},
          ${JSON.stringify({ learningResourceId: resourceId, category: event.category })}
        )
      `;
    });

    res.status(201).json({
      event: await eventById(eventId),
      learningResource: {
        id: resourceId,
        publicCode: String(event.publicCode),
        category: "current_affairs",
        format: "article",
        status: "draft",
      },
    });
  } catch (error) {
    sendError(res, error, "Unable to create current-affairs learning draft");
  }
});

router.get("/capabilities", requireAdminPermission("content.questions.read"), (_req, res) => {
  res.json({
    version: "ca-cp001",
    categories: CURRENT_AFFAIRS_CATEGORIES,
    sourceTypes: [...sourceTypes],
    workflow: ["source", "candidate", "event", "verify", "learning_resource_draft"],
    publicationLayer: "content.learning_resources",
  });
});

export default router;
