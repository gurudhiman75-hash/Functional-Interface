import { sqlClient } from "../lib/db";
import {
  CURRENT_AFFAIRS_CATEGORIES,
  assertDateOnly,
  scoreExamRelevance,
  type CurrentAffairsCategory,
} from "./core";
import { evaluateCurrentAffairsEditorialPriority } from "./editorial-priority";
import { classifyCurrentAffairsSignal } from "./ingestion";

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
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
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
  return fallbackDate;
}

export function headlineReviewProfile(row: Record<string, unknown>, targetDate: string): CurrentAffairsHeadlineReviewItem {
  const title = String(row.title ?? "").replace(/\s+/g, " ").trim();
  const payload = asObject(row.payload);
  const classified = classifyCurrentAffairsSignal(title);
  const resolvedCategory = category(payload.categoryGuess, classified.category);
  const sourceTrustScore = Number(row.sourceTrustScore ?? 0.5);
  const isPrimarySource = Boolean(row.isPrimarySource);
  const eventDate = resolveHeadlineReviewDate(payload, row.publishedAt, targetDate);
  const examScores = scoreExamRelevance({
    title,
    eventDate,
    category: resolvedCategory,
    sourceKey: String(row.sourceKey ?? "unknown_source"),
    sourceUrl: String(row.sourceUrl ?? "https://example.invalid/"),
    sourceTrustScore,
    isPrimarySource,
    facts: [],
  });
  const productScores = examScores.filter((score) => ["ssc", "banking", "punjab"].includes(score.examFamily));
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

export async function setCurrentAffairsHeadlineSelection(args: {
  candidateId: string;
  selected: boolean;
  reason: string;
  actorUserId: string;
}) {
  const selectedAt = new Date().toISOString();
  const reason = args.reason.replace(/\s+/g, " ").trim().slice(0, 1000);
  const rows = await sqlClient`
    SELECT id::text AS id, status, payload
    FROM content.current_affairs_ingestion_candidates
    WHERE id=${args.candidateId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new Error("Current Affairs headline candidate not found");

  const selectionMetadata = {
    manualEditorialSelected: args.selected,
    manualEditorialSelectedAt: selectedAt,
    manualEditorialSelectedBy: args.actorUserId,
    manualEditorialSelectionReason: reason,
    manualEditorialSelectionAuthority: "relevance_override_only",
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
  };

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

    if (args.selected) {
      await tx`
        UPDATE content.current_affairs_clusters cluster
        SET status=CASE WHEN cluster.status='rejected' THEN 'open' ELSE cluster.status END,
            metadata=COALESCE(cluster.metadata, '{}'::jsonb) || ${JSON.stringify({
              manualEditorialSelected: true,
              manualEditorialSelectedAt: selectedAt,
              manualEditorialSelectedBy: args.actorUserId,
              manualEditorialSelectionReason: reason,
              reversibleEditorialExclusion: true,
            })}::jsonb,
            updated_at=now()
        WHERE EXISTS (
          SELECT 1 FROM content.current_affairs_cluster_members member
          WHERE member.cluster_id=cluster.id AND member.candidate_id=${args.candidateId}::uuid
        )
      `;
    }

    await tx`
      UPDATE content.current_affairs_events event
      SET status=CASE
            WHEN ${args.selected}
              AND event.status='rejected'
              AND COALESCE((event.metadata->>'reversibleEditorialExclusion')::boolean, false)=true
            THEN 'review'
            ELSE event.status
          END,
          metadata=COALESCE(event.metadata, '{}'::jsonb) || ${JSON.stringify(selectionMetadata)}::jsonb,
          updated_by=${args.actorUserId}::uuid,
          updated_at=now()
      WHERE EXISTS (
        SELECT 1 FROM content.current_affairs_event_candidates event_link
        WHERE event_link.event_id=event.id AND event_link.candidate_id=${args.candidateId}::uuid
      )
    `;
  });

  return {
    candidateId: args.candidateId,
    selected: args.selected,
    reason,
    selectedAt,
    selectionAuthority: "relevance_override_only",
    verificationAuthority: false,
    publicationAuthority: false,
  };
}
