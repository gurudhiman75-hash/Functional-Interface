import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  CURRENT_AFFAIRS_CATEGORIES,
  assertDateOnly,
  currentAffairsFingerprint,
  publicCurrentAffairsCode,
  scoreExamRelevance,
  type CurrentAffairsCategory,
} from "./core";
import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";
import { classifyCurrentAffairsSignal } from "./ingestion";
import { extractHeadlineFactClaims } from "./intelligence";

const PRODUCT_FAMILIES = ["ssc", "banking", "punjab"] as const;

export type CurrentAffairsHeadlineReviewItem = {
  candidateId: string;
  title: string;
  targetDate: string;
  publishedAt: string | null;
  category: CurrentAffairsCategory;
  sourceKey: string;
  sourceName: string;
  sourceUrl: string;
  sourceTrustScore: number;
  isPrimarySource: boolean;
  candidateStatus: string;
  rejectionReason: string | null;
  autoEligible: boolean;
  manualSelected: boolean;
  selectionReason: string | null;
  selectionAt: string | null;
  priorityTier: "routine" | "standard" | "high" | "critical";
  priorityReasons: string[];
  relevanceScore: number;
  discoveryScore: number;
  examScores: Array<{
    examFamily: string;
    score: number;
    includeRecommended: boolean;
    reasons: string[];
  }>;
  clusterId: string | null;
  clusterStatus: string | null;
  linkedEventId: string | null;
  linkedEventCode: string | null;
  linkedEventStatus: string | null;
  linkedEventTitle: string | null;
};

type SelectionCandidate = {
  id: string;
  status: string;
  payload: Record<string, unknown>;
  title: string;
  publishedAt: string | null;
  sourceId: string;
  sourceKey: string;
  sourceName: string;
  sourceUrl: string;
  sourceTrustScore: number;
  isPrimarySource: boolean;
  clusterId: string | null;
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function bool(value: unknown) {
  return value === true || String(value ?? "").toLowerCase() === "true";
}

function category(value: unknown, fallback: CurrentAffairsCategory): CurrentAffairsCategory {
  const candidate = String(value ?? "").trim() as CurrentAffairsCategory;
  return (CURRENT_AFFAIRS_CATEGORIES as readonly string[]).includes(candidate) ? candidate : fallback;
}

export function resolveHeadlineReviewDate(payloadValue: unknown, publishedAt: unknown, fallbackDate: string) {
  const payload = asObject(payloadValue);
  for (const key of ["historicalTargetDate", "discoveryTargetDate"]) {
    const value = String(payload[key] ?? "").trim();
    if (!value) continue;
    try {
      return assertDateOnly(value);
    } catch {
      // Ignore malformed source metadata and continue to the next date signal.
    }
  }
  if (publishedAt) {
    const parsed = new Date(String(publishedAt));
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(parsed);
    }
  }
  return assertDateOnly(fallbackDate);
}

function candidateExamScores(input: {
  title: string;
  eventDate: string;
  category: CurrentAffairsCategory;
  sourceKey: string;
  sourceUrl: string;
  sourceTrustScore: number;
  isPrimarySource: boolean;
}) {
  return scoreExamRelevance({
    title: input.title,
    eventDate: input.eventDate,
    category: input.category,
    sourceKey: input.sourceKey || "unknown_source",
    sourceUrl: input.sourceUrl || "https://example.invalid/",
    sourceTrustScore: input.sourceTrustScore,
    isPrimarySource: input.isPrimarySource,
    facts: [],
  });
}

function closestProductFamily(scores: ReturnType<typeof scoreExamRelevance>) {
  return scores
    .filter((score) => (PRODUCT_FAMILIES as readonly string[]).includes(score.examFamily))
    .sort((a, b) => b.score - a.score || a.examFamily.localeCompare(b.examFamily))[0]?.examFamily ?? "ssc";
}

export function headlineReviewProfile(row: Record<string, unknown>, targetDate: string): CurrentAffairsHeadlineReviewItem {
  const title = String(row.title ?? "").replace(/\s+/g, " ").trim();
  const payload = asObject(row.payload);
  const classified = classifyCurrentAffairsSignal(title);
  const resolvedCategory = category(payload.categoryGuess, classified.category);
  const sourceTrustScore = Number(row.sourceTrustScore ?? 0.5);
  const isPrimarySource = Boolean(row.isPrimarySource);
  const eventDate = resolveHeadlineReviewDate(payload, row.publishedAt, targetDate);
  const examScores = candidateExamScores({
    title,
    eventDate,
    category: resolvedCategory,
    sourceKey: String(row.sourceKey ?? "unknown_source"),
    sourceUrl: String(row.sourceUrl ?? "https://example.invalid/"),
    sourceTrustScore,
    isPrimarySource,
  });
  const productScores = examScores.filter((score) => (PRODUCT_FAMILIES as readonly string[]).includes(score.examFamily));
  const priority = evaluateCurrentAffairsEditorialPriority({ title, category: resolvedCategory });
  const candidateStatus = String(row.candidateStatus ?? "queued");
  const manualSelected = bool(payload.manualEditorialSelected) || bool(row.eventManualSelected);

  return {
    candidateId: String(row.candidateId),
    title,
    targetDate: eventDate,
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    category: resolvedCategory,
    sourceKey: String(row.sourceKey ?? ""),
    sourceName: String(row.sourceName ?? row.sourceKey ?? "Unknown source"),
    sourceUrl: String(row.sourceUrl ?? ""),
    sourceTrustScore,
    isPrimarySource,
    candidateStatus,
    rejectionReason: row.rejectionReason ? String(row.rejectionReason) : null,
    autoEligible: !["rejected", "error"].includes(candidateStatus),
    manualSelected,
    selectionReason: payload.manualEditorialSelectionReason ? String(payload.manualEditorialSelectionReason) : null,
    selectionAt: payload.manualEditorialSelectedAt ? String(payload.manualEditorialSelectedAt) : null,
    priorityTier: priority.tier,
    priorityReasons: priority.reasons,
    relevanceScore: Math.max(0, ...productScores.map((score) => score.score)),
    discoveryScore: Number(payload.discoveryScore ?? classified.score),
    examScores,
    clusterId: row.clusterId ? String(row.clusterId) : null,
    clusterStatus: row.clusterStatus ? String(row.clusterStatus) : null,
    linkedEventId: row.linkedEventId ? String(row.linkedEventId) : null,
    linkedEventCode: row.linkedEventCode ? String(row.linkedEventCode) : null,
    linkedEventStatus: row.linkedEventStatus ? String(row.linkedEventStatus) : null,
    linkedEventTitle: row.linkedEventTitle ? String(row.linkedEventTitle) : null,
  };
}

export async function loadCurrentAffairsHeadlineReview(targetDateInput: string, limit = 1000) {
  const targetDate = assertDateOnly(targetDateInput);
  const safeLimit = Math.max(1, Math.min(1500, Math.floor(limit)));
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS "candidateId",
      candidate.raw_title AS title,
      candidate.published_at::text AS "publishedAt",
      candidate.status AS "candidateStatus",
      candidate.rejection_reason AS "rejectionReason",
      candidate.payload,
      source.source_key AS "sourceKey",
      source.name AS "sourceName",
      candidate.source_url AS "sourceUrl",
      source.trust_score::float8 AS "sourceTrustScore",
      source.is_primary_source AS "isPrimarySource",
      cluster.id::text AS "clusterId",
      cluster.status AS "clusterStatus",
      linked_event.id::text AS "linkedEventId",
      linked_event.public_code AS "linkedEventCode",
      linked_event.status AS "linkedEventStatus",
      linked_event.canonical_title AS "linkedEventTitle",
      COALESCE((linked_event.metadata->>'manualEditorialSelected')::boolean, false) AS "eventManualSelected"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
    LEFT JOIN content.current_affairs_clusters cluster ON cluster.id=member.cluster_id
    LEFT JOIN LATERAL (
      SELECT event.*
      FROM content.current_affairs_event_candidates event_link
      JOIN content.current_affairs_events event ON event.id=event_link.event_id
      WHERE event_link.candidate_id=candidate.id
      ORDER BY
        CASE event.status WHEN 'verified' THEN 0 WHEN 'review' THEN 1 WHEN 'candidate' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END,
        event.updated_at DESC
      LIMIT 1
    ) linked_event ON true
    WHERE COALESCE(
      NULLIF(candidate.payload->>'historicalTargetDate',''),
      NULLIF(candidate.payload->>'discoveryTargetDate',''),
      (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
    )=${targetDate}
    ORDER BY candidate.created_at DESC
    LIMIT ${safeLimit}
  `;

  const items = rows
    .map((row) => headlineReviewProfile(row as Record<string, unknown>, targetDate))
    .sort((a, b) => {
      const selected = Number(b.manualSelected) - Number(a.manualSelected);
      if (selected) return selected;
      const score = b.relevanceScore - a.relevanceScore;
      if (score) return score;
      const priorityOrder = { critical: 3, high: 2, standard: 1, routine: 0 } as const;
      const priority = priorityOrder[b.priorityTier] - priorityOrder[a.priorityTier];
      if (priority) return priority;
      return a.title.localeCompare(b.title);
    });

  return {
    targetDate,
    items,
    counts: {
      total: items.length,
      selected: items.filter((item) => item.manualSelected).length,
      autoWithheld: items.filter((item) => !item.autoEligible).length,
      linkedEvents: items.filter((item) => item.linkedEventId).length,
      critical: items.filter((item) => item.priorityTier === "critical").length,
      high: items.filter((item) => item.priorityTier === "high").length,
    },
    generatedAt: new Date().toISOString(),
    selectionAuthority: "relevance_override_only",
    publicationAuthority: false,
  };
}

async function loadSelectionCandidate(candidateId: string): Promise<SelectionCandidate | null> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.status,
      candidate.payload,
      candidate.raw_title AS title,
      candidate.published_at::text AS "publishedAt",
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      source.name AS "sourceName",
      candidate.source_url AS "sourceUrl",
      source.trust_score::float8 AS "sourceTrustScore",
      source.is_primary_source AS "isPrimarySource",
      member.cluster_id::text AS "clusterId"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
    WHERE candidate.id=${candidateId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    status: String(row.status),
    payload: asObject(row.payload),
    title: String(row.title),
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    sourceName: String(row.sourceName),
    sourceUrl: String(row.sourceUrl),
    sourceTrustScore: Number(row.sourceTrustScore ?? 0.5),
    isPrimarySource: Boolean(row.isPrimarySource),
    clusterId: row.clusterId ? String(row.clusterId) : null,
  };
}

async function ensureManualReviewEvent(
  tx: any,
  candidate: SelectionCandidate,
  selectionMetadata: Record<string, unknown>,
  actorUserId: string,
  reason: string,
) {
  const classified = classifyCurrentAffairsSignal(candidate.title);
  const resolvedCategory = category(candidate.payload.categoryGuess, classified.category);
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const eventDate = resolveHeadlineReviewDate(candidate.payload, candidate.publishedAt, fallbackDate);
  const fingerprint = currentAffairsFingerprint({ title: candidate.title, eventDate, category: resolvedCategory });
  const existing = await tx`
    SELECT event.id::text AS id, event.status, event.public_code AS "publicCode"
    FROM content.current_affairs_events event
    WHERE event.event_fingerprint=${fingerprint}
       OR EXISTS (
         SELECT 1 FROM content.current_affairs_event_candidates link
         WHERE link.event_id=event.id AND link.candidate_id=${candidate.id}::uuid
       )
    ORDER BY CASE event.status WHEN 'verified' THEN 0 WHEN 'review' THEN 1 WHEN 'candidate' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END,
             event.updated_at DESC
    LIMIT 1
  `;

  let eventId = existing[0] ? String(existing[0].id) : randomUUID();
  let created = false;
  if (!existing[0]) {
    created = true;
    await tx`
      INSERT INTO content.current_affairs_events (
        id, public_code, canonical_title, summary, importance_reason,
        event_date, category, status, verification_confidence,
        event_fingerprint, valid_from, metadata, created_by, updated_by,
        created_at, updated_at
      ) VALUES (
        ${eventId}::uuid,
        ${publicCurrentAffairsCode(eventDate)},
        ${candidate.title}, '',
        ${`Admin selected this headline for Current Affairs review. Relevance scores remain advisory; verification is still required. ${reason}`.slice(0, 2000)},
        ${eventDate}::date, ${resolvedCategory}, 'review', 0,
        ${fingerprint}, ${eventDate}::date,
        ${JSON.stringify({
          automationVersion: "ca-cp050-admin-headline-selection",
          autoPromoted: true,
          manualEditorialPromoted: true,
          ...selectionMetadata,
        })}::jsonb,
        ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
      )
    `;
  } else {
    await tx`
      UPDATE content.current_affairs_events
      SET status=CASE
            WHEN status='rejected'
              AND COALESCE((metadata->>'reversibleEditorialExclusion')::boolean, false)=true
            THEN 'review'
            ELSE status
          END,
          metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
            autoPromoted: true,
            manualEditorialPromoted: true,
            ...selectionMetadata,
          })}::jsonb,
          updated_by=${actorUserId}::uuid,
          updated_at=now()
      WHERE id=${eventId}::uuid
    `;
  }

  await tx`
    INSERT INTO content.current_affairs_event_candidates (event_id, candidate_id, cluster_id, created_at)
    VALUES (${eventId}::uuid, ${candidate.id}::uuid, ${candidate.clusterId}::uuid, now())
    ON CONFLICT DO NOTHING
  `;

  await tx`
    INSERT INTO content.current_affairs_event_sources (
      event_id, source_id, source_url, source_title, source_published_at,
      is_primary_evidence, evidence_confidence, metadata, created_at
    ) VALUES (
      ${eventId}::uuid, ${candidate.sourceId}::uuid, ${candidate.sourceUrl}, ${candidate.title},
      ${candidate.publishedAt ?? null}::timestamptz, ${candidate.isPrimarySource}, ${candidate.sourceTrustScore},
      ${JSON.stringify({
        sourceCandidateId: candidate.id,
        manualEditorialSelection: true,
        verificationAuthority: false,
      })}::jsonb,
      now()
    )
    ON CONFLICT (event_id, source_url) DO UPDATE
    SET source_title=EXCLUDED.source_title,
        source_published_at=COALESCE(EXCLUDED.source_published_at, content.current_affairs_event_sources.source_published_at),
        metadata=content.current_affairs_event_sources.metadata || EXCLUDED.metadata
  `;

  for (const claim of extractHeadlineFactClaims(candidate.title)) {
    await tx`
      INSERT INTO content.current_affairs_fact_claims (
        id, cluster_id, event_id, candidate_id, source_id,
        fact_key, fact_value, normalized_value, fact_type, confidence,
        extraction_method, is_primary_evidence, metadata, created_at
      ) VALUES (
        ${randomUUID()}::uuid, ${candidate.clusterId}::uuid, ${eventId}::uuid,
        ${candidate.id}::uuid, ${candidate.sourceId}::uuid,
        ${claim.factKey}, ${claim.factValue}, ${claim.normalizedValue}, ${claim.factType},
        ${claim.confidence}, ${claim.extractionMethod}, ${candidate.isPrimarySource},
        ${JSON.stringify({
          source: "headline",
          claimStage: "manual_editorial_selection",
          intelligenceVersion: "ca-cp050-admin-headline-selection",
        })}::jsonb,
        now()
      )
      ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
      SET event_id=EXCLUDED.event_id,
          cluster_id=COALESCE(EXCLUDED.cluster_id, content.current_affairs_fact_claims.cluster_id),
          source_id=EXCLUDED.source_id,
          fact_value=EXCLUDED.fact_value,
          fact_type=EXCLUDED.fact_type,
          confidence=GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
          is_primary_evidence=content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
          metadata=content.current_affairs_fact_claims.metadata || EXCLUDED.metadata
    `;
  }

  const scores = candidateExamScores({
    title: candidate.title,
    eventDate,
    category: resolvedCategory,
    sourceKey: candidate.sourceKey,
    sourceUrl: candidate.sourceUrl,
    sourceTrustScore: candidate.sourceTrustScore,
    isPrimarySource: candidate.isPrimarySource,
  });
  const bestFamily = closestProductFamily(scores);
  for (const score of scores) {
    const manualClosestFit = score.examFamily === bestFamily;
    const reasons = manualClosestFit
      ? [...score.reasons, `Manual editorial selection override: ${reason}`]
      : score.reasons;
    await tx`
      INSERT INTO content.current_affairs_exam_scores (
        event_id, exam_family_key, relevance_score, include_recommended, reasons, created_at, updated_at
      ) VALUES (
        ${eventId}::uuid, ${score.examFamily}, ${score.score},
        ${score.includeRecommended || manualClosestFit}, ${JSON.stringify(reasons)}::jsonb, now(), now()
      )
      ON CONFLICT (event_id, exam_family_key) DO UPDATE
      SET include_recommended=(
            content.current_affairs_exam_scores.include_recommended
            OR EXCLUDED.include_recommended
          ),
          reasons=CASE
            WHEN EXCLUDED.include_recommended=true
              AND content.current_affairs_exam_scores.include_recommended=false
            THEN content.current_affairs_exam_scores.reasons || ${JSON.stringify([`Manual editorial selection override: ${reason}`])}::jsonb
            ELSE content.current_affairs_exam_scores.reasons
          END,
          updated_at=now()
    `;
  }

  return {
    eventId,
    publicCode: existing[0]?.publicCode ? String(existing[0].publicCode) : null,
    created,
    bestProductFamily: bestFamily,
  };
}

export async function setCurrentAffairsHeadlineSelection(args: {
  candidateId: string;
  selected: boolean;
  reason: string;
  actorUserId: string;
}) {
  const selectedAt = new Date().toISOString();
  const reason = args.reason.replace(/\s+/g, " ").trim().slice(0, 1000);
  const candidate = await loadSelectionCandidate(args.candidateId);
  if (!candidate) throw new Error("Current Affairs headline candidate not found");

  const selectionMetadata = {
    manualEditorialSelected: args.selected,
    manualEditorialSelectedAt: selectedAt,
    manualEditorialSelectedBy: args.actorUserId,
    manualEditorialSelectionReason: reason,
    manualEditorialSelectionAuthority: "relevance_override_only",
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
  };

  let eventResult: Awaited<ReturnType<typeof ensureManualReviewEvent>> | null = null;
  await sqlClient.begin(async (tx) => {
    await tx`
      UPDATE content.current_affairs_ingestion_candidates
      SET status=CASE
            WHEN ${args.selected} AND status='rejected' THEN 'queued'
            ELSE status
          END,
          rejection_reason=CASE
            WHEN ${args.selected} AND status='rejected' THEN NULL
            ELSE rejection_reason
          END,
          payload=COALESCE(payload, '{}'::jsonb) || ${JSON.stringify(selectionMetadata)}::jsonb,
          updated_at=now()
      WHERE id=${args.candidateId}::uuid
    `;

    if (args.selected && candidate.clusterId) {
      await tx`
        UPDATE content.current_affairs_clusters
        SET status=CASE WHEN status='rejected' THEN 'open' ELSE status END,
            metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
              manualEditorialSelected: true,
              manualEditorialSelectedAt: selectedAt,
              manualEditorialSelectedBy: args.actorUserId,
              manualEditorialSelectionReason: reason,
              reversibleEditorialExclusion: true,
            })}::jsonb,
            updated_at=now()
        WHERE id=${candidate.clusterId}::uuid
      `;
    }

    if (args.selected) {
      eventResult = await ensureManualReviewEvent(tx, candidate, selectionMetadata, args.actorUserId, reason);
    } else {
      const linkedEvents = await tx`
        SELECT event.id::text AS id
        FROM content.current_affairs_event_candidates link
        JOIN content.current_affairs_events event ON event.id=link.event_id
        WHERE link.candidate_id=${args.candidateId}::uuid
      `;
      for (const linked of linkedEvents) {
        const eventId = String(linked.id);
        await tx`
          UPDATE content.current_affairs_events
          SET metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify(selectionMetadata)}::jsonb,
              updated_by=${args.actorUserId}::uuid,
              updated_at=now()
          WHERE id=${eventId}::uuid
        `;
        await tx`
          UPDATE content.current_affairs_exam_scores
          SET include_recommended=(relevance_score >= 65),
              reasons=reasons || ${JSON.stringify([`Manual editorial selection removed: ${reason}`])}::jsonb,
              updated_at=now()
          WHERE event_id=${eventId}::uuid
            AND exam_family_key IN ('ssc','banking','punjab')
        `;
      }
    }
  });

  return {
    candidateId: args.candidateId,
    selected: args.selected,
    reason,
    selectedAt,
    event: eventResult,
    selectionAuthority: "relevance_override_only",
    verificationAuthority: false,
    publicationAuthority: false,
  };
}
