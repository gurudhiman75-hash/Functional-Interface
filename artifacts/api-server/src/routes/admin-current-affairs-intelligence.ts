import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  currentAffairsFingerprint,
  publicCurrentAffairsCode,
  scoreExamRelevance,
  type CurrentAffairsCategory,
  type EventCandidateInput,
} from "../current-affairs/core";
import { classifyCurrentAffairsSignal } from "../current-affairs/ingestion";
import {
  buildCandidateClusters,
  extractHeadlineFactClaims,
  publicClusterCode,
  reconcileFactClaims,
  type ClaimEvidence,
  type IntelligenceCandidate,
  type ReconciledFact,
} from "../current-affairs/intelligence";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

class IntelligenceError extends Error {
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

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new IntelligenceError("INVALID_ID", `${label} is invalid.`);
  return id;
}

function positiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function numeric(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof IntelligenceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_INTELLIGENCE_FAILED" });
}

function payloadKeywords(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const raw = (payload as Record<string, unknown>).discoveryKeywords;
  return Array.isArray(raw) ? raw.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 20) : [];
}

function payloadCategory(payload: unknown): CurrentAffairsCategory | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const value = String((payload as Record<string, unknown>).categoryGuess ?? "").trim();
  return value ? value as CurrentAffairsCategory : null;
}

async function loadQueuedCandidates(limit: number): Promise<IntelligenceCandidate[]> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.raw_title AS title,
      candidate.source_url AS "sourceUrl",
      candidate.published_at AS "publishedAt",
      candidate.payload,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      source.base_url AS "baseUrl",
      source.trust_score::float8 AS "trustScore",
      source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id = candidate.id
    WHERE candidate.status = 'queued'
      AND member.candidate_id IS NULL
    ORDER BY candidate.published_at DESC NULLS LAST, candidate.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => {
    const classified = classifyCurrentAffairsSignal(String(row.title ?? ""));
    return {
      id: String(row.id),
      title: String(row.title),
      sourceKey: String(row.sourceKey),
      sourceId: String(row.sourceId),
      sourceUrl: row.sourceUrl ? String(row.sourceUrl) : null,
      publishedAt: row.publishedAt ? String(row.publishedAt) : null,
      categoryGuess: payloadCategory(row.payload) ?? classified.category,
      keywords: payloadKeywords(row.payload).length > 0 ? payloadKeywords(row.payload) : classified.keywords,
      trustScore: Number(row.trustScore ?? 0.5),
      isPrimarySource: Boolean(row.isPrimarySource),
    };
  });
}

async function loadCluster(clusterId: string) {
  const clusters = await sqlClient`
    SELECT
      cluster.id::text AS id,
      cluster.public_code AS "publicCode",
      cluster.representative_title AS "representativeTitle",
      cluster.category_guess AS "categoryGuess",
      cluster.event_date_guess AS "eventDateGuess",
      cluster.confidence::float8 AS confidence,
      cluster.status,
      cluster.promoted_event_id::text AS "promotedEventId"
    FROM content.current_affairs_clusters cluster
    WHERE cluster.id = ${clusterId}::uuid
    LIMIT 1
  `;
  if (!clusters[0]) return null;
  const members = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.raw_title AS title,
      candidate.source_url AS "sourceUrl",
      candidate.published_at AS "publishedAt",
      candidate.payload,
      member.similarity_score::float8 AS similarity,
      member.member_role AS role,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      source.name AS "sourceName",
      source.base_url AS "baseUrl",
      source.trust_score::float8 AS "trustScore",
      source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_cluster_members member
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id = member.candidate_id
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    WHERE member.cluster_id = ${clusterId}::uuid
    ORDER BY CASE WHEN member.member_role = 'representative' THEN 0 ELSE 1 END,
             member.similarity_score DESC,
             candidate.created_at ASC
  `;
  return { ...clusters[0], members };
}

async function claimsForEvent(eventId: string): Promise<ClaimEvidence[]> {
  const rows = await sqlClient`
    SELECT
      claim.fact_key AS "factKey",
      claim.fact_value AS "factValue",
      claim.normalized_value AS "normalizedValue",
      claim.fact_type AS "factType",
      claim.confidence::float8 AS confidence,
      claim.extraction_method AS "extractionMethod",
      claim.candidate_id::text AS "candidateId",
      source.source_key AS "sourceKey",
      source.id::text AS "sourceId",
      source.trust_score::float8 AS "trustScore",
      claim.is_primary_evidence AS "isPrimaryEvidence"
    FROM content.current_affairs_fact_claims claim
    LEFT JOIN content.current_affairs_sources source ON source.id = claim.source_id
    WHERE claim.event_id = ${eventId}::uuid
  `;
  return rows.map((row) => ({
    factKey: String(row.factKey),
    factValue: String(row.factValue),
    normalizedValue: String(row.normalizedValue),
    factType: String(row.factType) as ClaimEvidence["factType"],
    confidence: Number(row.confidence ?? 0.5),
    extractionMethod: String(row.extractionMethod) as ClaimEvidence["extractionMethod"],
    candidateId: row.candidateId ? String(row.candidateId) : undefined,
    sourceKey: row.sourceKey ? String(row.sourceKey) : undefined,
    sourceId: row.sourceId ? String(row.sourceId) : undefined,
    trustScore: Number(row.trustScore ?? 0.5),
    isPrimaryEvidence: Boolean(row.isPrimaryEvidence),
  }));
}

async function materializeFact(eventId: string, fact: ReconciledFact) {
  const existing = await sqlClient`
    SELECT id::text AS id
    FROM content.current_affairs_facts
    WHERE event_id = ${eventId}::uuid
      AND fact_key = ${fact.factKey}
      AND fact_value = ${fact.factValue}
    LIMIT 1
  `;
  if (existing[0]) {
    await sqlClient`
      UPDATE content.current_affairs_facts
      SET confidence = ${fact.confidence},
          support_count = ${fact.supportCount},
          primary_support_count = ${fact.primarySupportCount},
          reconciliation_status = ${fact.reconciliationStatus},
          provenance = ${JSON.stringify(fact.provenance)},
          updated_at = now()
      WHERE id = ${String(existing[0].id)}::uuid
    `;
    return;
  }
  await sqlClient`
    INSERT INTO content.current_affairs_facts (
      id, event_id, fact_key, fact_value, fact_type, is_verified,
      confidence, sort_order, reconciliation_status, support_count,
      primary_support_count, provenance, created_at, updated_at
    ) VALUES (
      ${randomUUID()}::uuid,
      ${eventId}::uuid,
      ${fact.factKey},
      ${fact.factValue},
      ${fact.factType},
      false,
      ${fact.confidence},
      0,
      ${fact.reconciliationStatus},
      ${fact.supportCount},
      ${fact.primarySupportCount},
      ${JSON.stringify(fact.provenance)},
      now(),
      now()
    )
  `;
}

async function reconcileEvent(eventId: string) {
  const claims = await claimsForEvent(eventId);
  const result = reconcileFactClaims(claims);

  await sqlClient`
    DELETE FROM content.current_affairs_fact_conflicts
    WHERE event_id = ${eventId}::uuid
      AND status IN ('open', 'auto_resolved')
  `;

  for (const fact of result.facts) await materializeFact(eventId, fact);

  for (const conflict of result.conflicts) {
    await sqlClient`
      INSERT INTO content.current_affairs_fact_conflicts (
        id, event_id, fact_key, competing_values, status, preferred_value,
        resolution_reason, resolved_at, created_at, updated_at
      ) VALUES (
        ${randomUUID()}::uuid,
        ${eventId}::uuid,
        ${conflict.factKey},
        ${JSON.stringify(conflict.values)},
        ${conflict.autoResolution ? "auto_resolved" : "open"},
        ${conflict.autoResolution?.factValue ?? null},
        ${conflict.resolutionReason ?? null},
        ${conflict.autoResolution ? new Date().toISOString() : null},
        now(),
        now()
      )
    `;
  }
  return result;
}

router.use(authenticate);

router.get("/intelligence/dashboard", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const [clusters, conflicts, claims] = await Promise.all([
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'open')::int AS open,
          COUNT(*) FILTER (WHERE status = 'promoted')::int AS promoted
        FROM content.current_affairs_clusters
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'open')::int AS open,
          COUNT(*) FILTER (WHERE status = 'auto_resolved')::int AS "autoResolved",
          COUNT(*) FILTER (WHERE status = 'manually_resolved')::int AS "manuallyResolved"
        FROM content.current_affairs_fact_conflicts
      `,
      sqlClient`SELECT COUNT(*)::int AS total FROM content.current_affairs_fact_claims`,
    ]);
    res.json({
      clusters: clusters[0] ?? {},
      conflicts: conflicts[0] ?? {},
      claims: claims[0] ?? { total: 0 },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs intelligence dashboard");
  }
});

router.post("/intelligence/cluster-run", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new IntelligenceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const limit = positiveInteger(req.body?.limit, 200, 500);
    const threshold = numeric(req.body?.threshold, 0.52, 0.42, 0.8);
    const candidates = await loadQueuedCandidates(limit);
    const drafts = buildCandidateClusters(candidates, threshold);
    let created = 0;
    let singletonClusters = 0;
    let multiSourceClusters = 0;
    let extractedClaims = 0;

    for (const draft of drafts) {
      const publicCode = publicClusterCode(draft.eventDateGuess);
      const rows = await sqlClient`
        INSERT INTO content.current_affairs_clusters (
          id, public_code, representative_title, category_guess,
          event_date_guess, cluster_fingerprint, confidence, status,
          metadata, created_at, updated_at
        ) VALUES (
          ${draft.id}::uuid,
          ${publicCode},
          ${draft.representative.title},
          ${draft.categoryGuess},
          ${draft.eventDateGuess},
          ${draft.fingerprint},
          ${draft.confidence},
          'open',
          ${JSON.stringify({ threshold, intelligenceVersion: "ca-cp003" })},
          now(),
          now()
        )
        ON CONFLICT (cluster_fingerprint) DO NOTHING
        RETURNING id::text AS id
      `;
      if (!rows[0]) continue;
      created += 1;
      if (draft.members.length === 1) singletonClusters += 1;
      else multiSourceClusters += 1;

      for (const member of draft.members) {
        await sqlClient`
          INSERT INTO content.current_affairs_cluster_members (
            cluster_id, candidate_id, similarity_score, member_role, created_at
          ) VALUES (
            ${draft.id}::uuid,
            ${member.candidate.id}::uuid,
            ${member.similarity},
            ${member.candidate.id === draft.representative.id ? "representative" : "supporting"},
            now()
          )
        `;
        await sqlClient`
          UPDATE content.current_affairs_ingestion_candidates
          SET status = 'clustered', updated_at = now()
          WHERE id = ${member.candidate.id}::uuid
        `;

        const claims = extractHeadlineFactClaims(member.candidate.title);
        for (const claim of claims) {
          const inserted = await sqlClient`
            INSERT INTO content.current_affairs_fact_claims (
              id, cluster_id, candidate_id, source_id, fact_key, fact_value,
              normalized_value, fact_type, confidence, extraction_method,
              is_primary_evidence, metadata, created_at
            ) VALUES (
              ${randomUUID()}::uuid,
              ${draft.id}::uuid,
              ${member.candidate.id}::uuid,
              ${member.candidate.sourceId ?? null}::uuid,
              ${claim.factKey},
              ${claim.factValue},
              ${claim.normalizedValue},
              ${claim.factType},
              ${claim.confidence},
              ${claim.extractionMethod},
              ${Boolean(member.candidate.isPrimarySource)},
              ${JSON.stringify({ source: "headline", intelligenceVersion: "ca-cp003" })},
              now()
            )
            ON CONFLICT (candidate_id, fact_key, normalized_value) DO NOTHING
            RETURNING id
          `;
          if (inserted[0]) extractedClaims += 1;
        }
      }
    }

    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid,
        'user'::audit_actor_type,
        ${actorUserId}::uuid,
        'current_affairs.clustering.run',
        'current_affairs_cluster',
        'Ran Current Affairs same-event clustering',
        ${JSON.stringify({ candidates: candidates.length, created, threshold, extractedClaims })}
      )
    `;

    res.json({
      candidatesConsidered: candidates.length,
      clustersCreated: created,
      singletonClusters,
      multiSourceClusters,
      extractedClaims,
      threshold,
    });
  } catch (error) {
    sendError(res, error, "Unable to run Current Affairs clustering");
  }
});

router.get("/clusters", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const status = text(req.query.status, 30).toLowerCase();
    const rows = await sqlClient`
      SELECT
        cluster.id::text AS id,
        cluster.public_code AS "publicCode",
        cluster.representative_title AS "representativeTitle",
        cluster.category_guess AS "categoryGuess",
        cluster.event_date_guess AS "eventDateGuess",
        cluster.confidence::float8 AS confidence,
        cluster.status,
        cluster.promoted_event_id::text AS "promotedEventId",
        COUNT(member.candidate_id)::int AS "memberCount",
        COUNT(DISTINCT source.id)::int AS "sourceCount",
        COUNT(DISTINCT source.id) FILTER (WHERE source.is_primary_source)::int AS "primarySourceCount",
        cluster.updated_at AS "updatedAt"
      FROM content.current_affairs_clusters cluster
      LEFT JOIN content.current_affairs_cluster_members member ON member.cluster_id = cluster.id
      LEFT JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id = member.candidate_id
      LEFT JOIN content.current_affairs_sources source ON source.id = candidate.source_id
      WHERE (${status} = '' OR cluster.status = ${status})
      GROUP BY cluster.id
      ORDER BY cluster.event_date_guess DESC, cluster.confidence DESC, cluster.updated_at DESC
      LIMIT 500
    `;
    res.json({ clusters: rows });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs clusters");
  }
});

router.get("/clusters/:id", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const clusterId = uuid(req.params.id, "Cluster ID");
    const cluster = await loadCluster(clusterId);
    if (!cluster) throw new IntelligenceError("CLUSTER_NOT_FOUND", "Current Affairs cluster not found.", 404);
    const claims = await sqlClient`
      SELECT
        claim.id::text AS id,
        claim.fact_key AS "factKey",
        claim.fact_value AS "factValue",
        claim.fact_type AS "factType",
        claim.confidence::float8 AS confidence,
        claim.is_primary_evidence AS "isPrimaryEvidence",
        source.source_key AS "sourceKey"
      FROM content.current_affairs_fact_claims claim
      LEFT JOIN content.current_affairs_sources source ON source.id = claim.source_id
      WHERE claim.cluster_id = ${clusterId}::uuid
      ORDER BY claim.fact_key, claim.confidence DESC
    `;
    res.json({ cluster, claims });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs cluster");
  }
});

router.post("/clusters/:id/promote", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const clusterId = uuid(req.params.id, "Cluster ID");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new IntelligenceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const cluster = await loadCluster(clusterId) as Record<string, any> | null;
    if (!cluster) throw new IntelligenceError("CLUSTER_NOT_FOUND", "Current Affairs cluster not found.", 404);
    if (cluster.status !== "open") {
      throw new IntelligenceError("CLUSTER_NOT_OPEN", "Only open clusters can be promoted.", 409);
    }
    const members = Array.isArray(cluster.members) ? cluster.members : [];
    if (members.length === 0) throw new IntelligenceError("EMPTY_CLUSTER", "Cluster has no candidates.", 409);
    const representative = members.find((member: any) => member.role === "representative") ?? members[0];
    const eventDate = String(cluster.eventDateGuess).slice(0, 10);
    const category = String(cluster.categoryGuess) as CurrentAffairsCategory;
    const title = text(req.body?.title, 240) || String(cluster.representativeTitle);
    const eventFingerprint = currentAffairsFingerprint({ title, eventDate, category });
    const duplicate = await sqlClient`
      SELECT id::text AS id, public_code AS "publicCode"
      FROM content.current_affairs_events
      WHERE event_fingerprint = ${eventFingerprint}
      LIMIT 1
    `;
    if (duplicate[0]) {
      throw new IntelligenceError("EVENT_ALREADY_EXISTS", `Matching event already exists as ${String(duplicate[0].publicCode)}.`, 409);
    }

    const eventId = randomUUID();
    const publicCode = publicCurrentAffairsCode(eventDate);
    const summary = text(req.body?.summary, 5000);
    const importanceReason = text(req.body?.importanceReason, 2000);
    const scoringInput: EventCandidateInput = {
      title,
      summary,
      importanceReason,
      eventDate,
      category,
      sourceKey: String(representative.sourceKey),
      sourceUrl: String(representative.sourceUrl ?? representative.baseUrl),
      sourceTrustScore: Number(representative.trustScore ?? 0.5),
      isPrimarySource: Boolean(representative.isPrimarySource),
      facts: [],
    };
    const scores = scoreExamRelevance(scoringInput);

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.current_affairs_events (
          id, public_code, canonical_title, summary, importance_reason,
          event_date, category, status, verification_confidence,
          event_fingerprint, valid_from, metadata, created_by, updated_by,
          created_at, updated_at
        ) VALUES (
          ${eventId}::uuid, ${publicCode}, ${title}, ${summary}, ${importanceReason},
          ${eventDate}, ${category}, 'review', 0, ${eventFingerprint}, ${eventDate},
          ${JSON.stringify({ intelligenceVersion: "ca-cp003", sourceClusterId: clusterId })},
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;

      for (const member of members) {
        await tx`
          INSERT INTO content.current_affairs_event_candidates (event_id, candidate_id, cluster_id)
          VALUES (${eventId}::uuid, ${String(member.id)}::uuid, ${clusterId}::uuid)
          ON CONFLICT DO NOTHING
        `;
        if (member.sourceUrl) {
          await tx`
            INSERT INTO content.current_affairs_event_sources (
              event_id, source_id, source_url, source_title, source_published_at,
              is_primary_evidence, evidence_confidence, metadata
            ) VALUES (
              ${eventId}::uuid,
              ${String(member.sourceId)}::uuid,
              ${String(member.sourceUrl)},
              ${String(member.title)},
              ${member.publishedAt ?? null},
              ${Boolean(member.isPrimarySource)},
              ${Number(member.trustScore ?? 0.5)},
              ${JSON.stringify({ sourceCandidateId: member.id, clusterId })}
            )
            ON CONFLICT (event_id, source_url) DO NOTHING
          `;
        }
      }

      await tx`
        UPDATE content.current_affairs_fact_claims
        SET event_id = ${eventId}::uuid
        WHERE cluster_id = ${clusterId}::uuid
      `;

      for (const score of scores) {
        await tx`
          INSERT INTO content.current_affairs_exam_scores (
            event_id, exam_family_key, relevance_score, include_recommended,
            reasons, created_at, updated_at
          ) VALUES (
            ${eventId}::uuid, ${score.examFamily}, ${score.score},
            ${score.includeRecommended}, ${JSON.stringify(score.reasons)}, now(), now()
          )
        `;
      }

      await tx`
        UPDATE content.current_affairs_clusters
        SET status = 'promoted', promoted_event_id = ${eventId}::uuid, updated_at = now()
        WHERE id = ${clusterId}::uuid
      `;
    });

    const reconciliation = await reconcileEvent(eventId);
    res.status(201).json({
      event: { id: eventId, publicCode, title, eventDate, category, status: "review" },
      scores,
      reconciliation: {
        canonicalFacts: reconciliation.facts.length,
        conflicts: reconciliation.conflicts.length,
        unresolvedConflicts: reconciliation.conflicts.filter((item) => !item.autoResolution).length,
      },
    });
  } catch (error) {
    sendError(res, error, "Unable to promote Current Affairs cluster");
  }
});

router.post("/events/:id/reconcile-facts", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const eventId = uuid(req.params.id, "Event ID");
    const rows = await sqlClient`SELECT id FROM content.current_affairs_events WHERE id = ${eventId}::uuid LIMIT 1`;
    if (!rows[0]) throw new IntelligenceError("EVENT_NOT_FOUND", "Current Affairs event not found.", 404);
    const reconciliation = await reconcileEvent(eventId);
    res.json({
      eventId,
      canonicalFacts: reconciliation.facts,
      conflicts: reconciliation.conflicts,
    });
  } catch (error) {
    sendError(res, error, "Unable to reconcile Current Affairs facts");
  }
});

router.get("/fact-conflicts", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const status = text(req.query.status, 30).toLowerCase();
    const rows = await sqlClient`
      SELECT
        conflict.id::text AS id,
        conflict.event_id::text AS "eventId",
        event.public_code AS "eventPublicCode",
        event.canonical_title AS "eventTitle",
        conflict.fact_key AS "factKey",
        conflict.competing_values AS "competingValues",
        conflict.status,
        conflict.preferred_value AS "preferredValue",
        conflict.resolution_reason AS "resolutionReason",
        conflict.resolved_at AS "resolvedAt",
        conflict.created_at AS "createdAt"
      FROM content.current_affairs_fact_conflicts conflict
      LEFT JOIN content.current_affairs_events event ON event.id = conflict.event_id
      WHERE (${status} = '' OR conflict.status = ${status})
      ORDER BY CASE WHEN conflict.status = 'open' THEN 0 ELSE 1 END, conflict.created_at DESC
      LIMIT 500
    `;
    res.json({ conflicts: rows });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs fact conflicts");
  }
});

router.post("/fact-conflicts/:id/resolve", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const conflictId = uuid(req.params.id, "Conflict ID");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new IntelligenceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const preferredValue = text(req.body?.preferredValue, 2000);
    const reason = text(req.body?.reason, 1000);
    if (!preferredValue) throw new IntelligenceError("PREFERRED_VALUE_REQUIRED", "Choose the verified value.");
    if (reason.length < 8) throw new IntelligenceError("RESOLUTION_REASON_REQUIRED", "Explain why this value is correct.");

    const rows = await sqlClient`
      SELECT
        id::text AS id,
        event_id::text AS "eventId",
        fact_key AS "factKey",
        competing_values AS "competingValues",
        status
      FROM content.current_affairs_fact_conflicts
      WHERE id = ${conflictId}::uuid
      LIMIT 1
    `;
    const conflict = rows[0] as Record<string, any> | undefined;
    if (!conflict) throw new IntelligenceError("CONFLICT_NOT_FOUND", "Fact conflict not found.", 404);
    if (conflict.status !== "open") throw new IntelligenceError("CONFLICT_ALREADY_RESOLVED", "This conflict is already resolved.", 409);
    const variants = Array.isArray(conflict.competingValues) ? conflict.competingValues : [];
    const selected = variants.find((item: any) => String(item.value) === preferredValue);
    if (!selected) throw new IntelligenceError("VALUE_NOT_IN_CONFLICT", "Choose one of the competing values recorded for this conflict.");
    if (!conflict.eventId) throw new IntelligenceError("CONFLICT_HAS_NO_EVENT", "Conflict is not attached to a canonical event.", 409);

    const matchingClaims = await sqlClient`
      SELECT
        claim.fact_type AS "factType",
        claim.candidate_id::text AS "candidateId",
        source.source_key AS "sourceKey",
        claim.confidence::float8 AS confidence,
        claim.is_primary_evidence AS "isPrimaryEvidence"
      FROM content.current_affairs_fact_claims claim
      LEFT JOIN content.current_affairs_sources source ON source.id = claim.source_id
      WHERE claim.event_id = ${String(conflict.eventId)}::uuid
        AND claim.fact_key = ${String(conflict.factKey)}
        AND claim.fact_value = ${preferredValue}
    `;
    const factType = String(matchingClaims[0]?.factType ?? "string");
    const provenance = matchingClaims.map((claim) => ({
      candidateId: claim.candidateId ? String(claim.candidateId) : undefined,
      sourceKey: claim.sourceKey ? String(claim.sourceKey) : undefined,
      confidence: Number(claim.confidence ?? 0.5),
      primary: Boolean(claim.isPrimaryEvidence),
    }));

    await sqlClient.begin(async (tx) => {
      await tx`
        DELETE FROM content.current_affairs_facts
        WHERE event_id = ${String(conflict.eventId)}::uuid
          AND fact_key = ${String(conflict.factKey)}
          AND fact_value <> ${preferredValue}
      `;
      await tx`
        INSERT INTO content.current_affairs_facts (
          id, event_id, fact_key, fact_value, fact_type, is_verified,
          confidence, sort_order, reconciliation_status, support_count,
          primary_support_count, provenance, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid,
          ${String(conflict.eventId)}::uuid,
          ${String(conflict.factKey)},
          ${preferredValue},
          ${factType},
          true,
          1,
          0,
          'manual',
          ${Math.max(1, matchingClaims.length)},
          ${matchingClaims.filter((claim) => claim.isPrimaryEvidence).length},
          ${JSON.stringify(provenance)},
          now(),
          now()
        )
        ON CONFLICT (event_id, fact_key, fact_value) DO UPDATE
        SET is_verified = true,
            confidence = 1,
            reconciliation_status = 'manual',
            support_count = EXCLUDED.support_count,
            primary_support_count = EXCLUDED.primary_support_count,
            provenance = EXCLUDED.provenance,
            updated_at = now()
      `;
      await tx`
        UPDATE content.current_affairs_fact_conflicts
        SET status = 'manually_resolved',
            preferred_value = ${preferredValue},
            resolution_reason = ${reason},
            resolved_by = ${actorUserId}::uuid,
            resolved_at = now(),
            updated_at = now()
        WHERE id = ${conflictId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'current_affairs.fact_conflict.resolved',
          'current_affairs_event',
          ${String(conflict.eventId)}::uuid,
          ${reason},
          ${`Resolved Current Affairs conflict for ${String(conflict.factKey)}`},
          ${JSON.stringify({ conflictId, preferredValue })}
        )
      `;
    });

    res.json({
      conflictId,
      eventId: String(conflict.eventId),
      factKey: String(conflict.factKey),
      preferredValue,
      status: "manually_resolved",
    });
  } catch (error) {
    sendError(res, error, "Unable to resolve Current Affairs fact conflict");
  }
});

export default router;
