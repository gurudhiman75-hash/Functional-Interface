import { randomUUID } from "node:crypto";

import { runSourceIndependentAuthoringForEventIds } from "./authoring-runtime";
import { assertDateOnly } from "./core";
import { refreshDailyDiscoveryCensus } from "./daily-discovery-census";
import { materializeDailyMasterPacks } from "./daily-master-pack";
import { reconcilePrimaryEnrichedEventIds } from "./enriched-event-reconciliation";
import { refreshTargetDateExamRelevance } from "./exam-relevance-runtime";
import { runCurrentAffairsLocalizationForEventIds } from "./localization-runtime";
import { isOneDayOfficialRescueMatch } from "./one-day-rescue-policy";
import { runPrimaryFactEnrichmentForCandidateIds } from "./primary-enrichment";
import {
  selectedAffairsProcessingBlockers,
  selectedAffairsProcessingStage,
  SELECTED_AFFAIRS_PROCESSING_VERSION,
  type SelectedAffairsProcessingState,
} from "./selected-affairs-processing-policy";
import { sqlClient } from "../lib/db";

const AUTOMATED_PRIMARY_SOURCE_KEYS = new Set(["pib", "rbi", "sebi", "isro", "punjab_gov"]);
const MAX_SELECTED_HEADLINES = 300;
const MAX_OFFICIAL_EVIDENCE_PER_HEADLINE = 4;

type SelectedHeadlineRow = {
  candidateId: string;
  title: string;
  targetDate: string;
  sourceId: string;
  sourceKey: string;
  sourceUrl: string;
  publishedAt: string | null;
  isPrimarySource: boolean;
  contentPolicy: string;
  clusterId: string | null;
  rescueCandidateId: string | null;
  eventId: string | null;
  publicCode: string | null;
};

type OfficialCandidate = {
  id: string;
  title: string;
  sourceId: string;
  sourceKey: string;
  sourceUrl: string;
  publishedAt: string | null;
  trustScore: number;
  clusterId: string | null;
};

type EvidenceAttachment = {
  selectedCandidateId: string;
  eventId: string;
  officialCandidateId: string;
  sourceKey: string;
  reason: "selected_primary" | "same_cluster" | "cp052_rescue" | "target_day_title_match";
  similarityScore: number | null;
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function mapOfficialCandidate(row: any): OfficialCandidate {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl ?? ""),
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    trustScore: Number(row.trustScore ?? 0.7),
    clusterId: row.clusterId ? String(row.clusterId) : null,
  };
}

async function loadSelectedHeadlines(targetDate: string): Promise<SelectedHeadlineRow[]> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS "candidateId",
      candidate.raw_title AS title,
      COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      ) AS "targetDate",
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      candidate.published_at::text AS "publishedAt",
      source.is_primary_source AS "isPrimarySource",
      source.content_policy AS "contentPolicy",
      member.cluster_id::text AS "clusterId",
      candidate.payload->'oneDayOfficialRescue'->>'officialCandidateId' AS "rescueCandidateId",
      linked_event.id::text AS "eventId",
      linked_event.public_code AS "publicCode"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
    LEFT JOIN LATERAL (
      SELECT event.id, event.public_code, event.status, event.updated_at
      FROM content.current_affairs_event_candidates link
      JOIN content.current_affairs_events event ON event.id=link.event_id
      WHERE link.candidate_id=candidate.id
      ORDER BY CASE event.status WHEN 'verified' THEN 0 WHEN 'review' THEN 1 WHEN 'candidate' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END,
               event.updated_at DESC
      LIMIT 1
    ) linked_event ON true
    WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
    ORDER BY candidate.created_at ASC
    LIMIT ${MAX_SELECTED_HEADLINES}
  `;
  return rows.map((row) => ({
    candidateId: String(row.candidateId),
    title: String(row.title ?? ""),
    targetDate: String(row.targetDate),
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl ?? ""),
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    isPrimarySource: Boolean(row.isPrimarySource),
    contentPolicy: String(row.contentPolicy ?? ""),
    clusterId: row.clusterId ? String(row.clusterId) : null,
    rescueCandidateId: row.rescueCandidateId ? String(row.rescueCandidateId) : null,
    eventId: row.eventId ? String(row.eventId) : null,
    publicCode: row.publicCode ? String(row.publicCode) : null,
  }));
}

async function loadTargetDayOfficialCandidates(targetDate: string) {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.raw_title AS title,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      candidate.published_at::text AS "publishedAt",
      source.trust_score::float8 AS "trustScore",
      member.cluster_id::text AS "clusterId"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
    WHERE source.is_active=true
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.status <> 'error'
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
    ORDER BY source.trust_score DESC, candidate.created_at DESC
    LIMIT 1800
  `;
  return rows.map(mapOfficialCandidate);
}

async function loadOfficialCandidatesByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS id,
      candidate.raw_title AS title,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      candidate.published_at::text AS "publishedAt",
      source.trust_score::float8 AS "trustScore",
      member.cluster_id::text AS "clusterId"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
    WHERE candidate.id = ANY(${ids}::uuid[])
      AND source.is_active=true
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.status <> 'error'
  `;
  return rows.map(mapOfficialCandidate);
}

async function loadClusterOfficialCandidates(clusterIds: string[]) {
  if (clusterIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT DISTINCT ON (candidate.id)
      candidate.id::text AS id,
      candidate.raw_title AS title,
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.source_url AS "sourceUrl",
      candidate.published_at::text AS "publishedAt",
      source.trust_score::float8 AS "trustScore",
      member.cluster_id::text AS "clusterId"
    FROM content.current_affairs_cluster_members member
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=member.candidate_id
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE member.cluster_id = ANY(${clusterIds}::uuid[])
      AND source.is_active=true
      AND source.is_primary_source=true
      AND source.content_policy='primary_facts'
      AND candidate.status <> 'error'
    ORDER BY candidate.id, source.trust_score DESC, candidate.created_at DESC
  `;
  return rows.map(mapOfficialCandidate);
}

function candidateEvidenceForHeadline(args: {
  selected: SelectedHeadlineRow;
  targetDayOfficial: OfficialCandidate[];
  clusterOfficial: OfficialCandidate[];
  rescueById: Map<string, OfficialCandidate>;
}) {
  const selected = args.selected;
  const candidates: Array<{ candidate: OfficialCandidate; reason: EvidenceAttachment["reason"]; similarityScore: number | null }> = [];

  if (selected.isPrimarySource && selected.contentPolicy === "primary_facts") {
    candidates.push({
      candidate: {
        id: selected.candidateId,
        title: selected.title,
        sourceId: selected.sourceId,
        sourceKey: selected.sourceKey,
        sourceUrl: selected.sourceUrl,
        publishedAt: selected.publishedAt,
        trustScore: 1,
        clusterId: selected.clusterId,
      },
      reason: "selected_primary",
      similarityScore: 1,
    });
  }

  if (selected.clusterId) {
    for (const official of args.clusterOfficial.filter((item) => item.clusterId === selected.clusterId)) {
      candidates.push({ candidate: official, reason: "same_cluster", similarityScore: 1 });
    }
  }

  if (selected.rescueCandidateId) {
    const rescued = args.rescueById.get(selected.rescueCandidateId);
    if (rescued) candidates.push({ candidate: rescued, reason: "cp052_rescue", similarityScore: null });
  }

  const currentDayMatches = args.targetDayOfficial
    .filter((official) => official.id !== selected.candidateId)
    .map((official) => ({ official, match: isOneDayOfficialRescueMatch(selected.title, official.title) }))
    .filter((item) => item.match.matched)
    .sort((a, b) => b.match.score - a.match.score || b.official.trustScore - a.official.trustScore)
    .slice(0, 2);
  for (const item of currentDayMatches) {
    candidates.push({ candidate: item.official, reason: "target_day_title_match", similarityScore: item.match.score });
  }

  const deduped = new Map<string, typeof candidates[number]>();
  for (const item of candidates) {
    const existing = deduped.get(item.candidate.id);
    if (!existing || (item.similarityScore ?? 0) > (existing.similarityScore ?? 0)) deduped.set(item.candidate.id, item);
  }
  return [...deduped.values()]
    .sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0) || b.candidate.trustScore - a.candidate.trustScore)
    .slice(0, MAX_OFFICIAL_EVIDENCE_PER_HEADLINE);
}

async function attachOfficialEvidence(
  selected: SelectedHeadlineRow,
  official: OfficialCandidate,
  reason: EvidenceAttachment["reason"],
  similarityScore: number | null,
  actorUserId: string,
) {
  if (!selected.eventId) return;
  const metadata = {
    processingVersion: SELECTED_AFFAIRS_PROCESSING_VERSION,
    selectedCandidateId: selected.candidateId,
    officialCandidateId: official.id,
    attachmentReason: reason,
    similarityScore,
    actorUserId,
    evidenceRole: "verification_candidate_only",
    automaticPublicationAuthority: false,
  };
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.current_affairs_event_candidates (event_id, candidate_id, cluster_id, created_at)
      VALUES (${selected.eventId}::uuid, ${official.id}::uuid, ${official.clusterId}::uuid, now())
      ON CONFLICT (event_id, candidate_id) DO NOTHING
    `;
    await tx`
      INSERT INTO content.current_affairs_event_sources (
        event_id, source_id, source_url, source_title, source_published_at,
        is_primary_evidence, evidence_confidence, metadata, created_at
      ) VALUES (
        ${selected.eventId}::uuid, ${official.sourceId}::uuid, ${official.sourceUrl}, ${official.title},
        ${official.publishedAt ?? null}::timestamptz, true, ${official.trustScore},
        ${JSON.stringify(metadata)}::jsonb, now()
      )
      ON CONFLICT (event_id, source_url) DO UPDATE
      SET source_id=EXCLUDED.source_id,
          source_title=EXCLUDED.source_title,
          source_published_at=COALESCE(EXCLUDED.source_published_at, content.current_affairs_event_sources.source_published_at),
          is_primary_evidence=content.current_affairs_event_sources.is_primary_evidence OR EXCLUDED.is_primary_evidence,
          evidence_confidence=GREATEST(content.current_affairs_event_sources.evidence_confidence, EXCLUDED.evidence_confidence),
          metadata=content.current_affairs_event_sources.metadata || EXCLUDED.metadata
    `;
  });
}

async function cloneEnrichedClaimsToEvent(eventId: string, officialCandidateId: string) {
  const rows = await sqlClient`
    INSERT INTO content.current_affairs_fact_claims (
      id, cluster_id, event_id, candidate_id, source_id,
      fact_key, fact_value, normalized_value, fact_type, confidence,
      extraction_method, is_primary_evidence, metadata, created_at
    )
    SELECT
      gen_random_uuid(), NULL, ${eventId}::uuid, NULL, staged.source_id,
      staged.fact_key, staged.fact_value, staged.normalized_value, staged.fact_type,
      staged.confidence, staged.extraction_method, true,
      staged.metadata || jsonb_build_object(
        'claimStage', 'cp053_selected_processing',
        'selectedProcessingEvidenceCandidateId', ${officialCandidateId},
        'processingVersion', ${SELECTED_AFFAIRS_PROCESSING_VERSION}
      ),
      now()
    FROM content.current_affairs_candidate_fact_claims staged
    WHERE staged.candidate_id=${officialCandidateId}::uuid
      AND NOT EXISTS (
        SELECT 1
        FROM content.current_affairs_fact_claims existing
        WHERE existing.event_id=${eventId}::uuid
          AND existing.source_id IS NOT DISTINCT FROM staged.source_id
          AND existing.fact_key=staged.fact_key
          AND existing.normalized_value=staged.normalized_value
      )
    RETURNING id
  `;
  return rows.length;
}

async function markProcessingAttempt(eventIds: string[], actorUserId: string) {
  if (eventIds.length === 0) return;
  await sqlClient`
    UPDATE content.current_affairs_events
    SET metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
      selectedProcessingVersion: SELECTED_AFFAIRS_PROCESSING_VERSION,
      lastSelectedProcessingAt: new Date().toISOString(),
      lastSelectedProcessingBy: actorUserId,
      automaticPublicationAuthority: false,
      automaticQuestionBankPromotionAuthority: false,
    })}::jsonb,
        updated_by=${actorUserId}::uuid,
        updated_at=now()
    WHERE id = ANY(${eventIds}::uuid[])
  `;
}

async function loadFinalEventStates(eventIds: string[]) {
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      event.id::text AS "eventId",
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.status AS "eventStatus",
      event.learner_authoring_status AS "authoringStatus",
      COALESCE(facts.count, 0)::int AS "verifiedFactCount",
      COALESCE(conflicts.count, 0)::int AS "openConflictCount",
      COALESCE(evidence.official_count, 0)::int AS "officialEvidenceCount",
      COALESCE(evidence.supported_count, 0)::int AS "supportedOfficialEvidenceCount",
      COALESCE(hi.status, 'missing') AS "hindiStatus",
      COALESCE(pa.status, 'missing') AS "punjabiStatus"
    FROM content.current_affairs_events event
    LEFT JOIN LATERAL (
      SELECT count(*)::int AS count
      FROM content.current_affairs_facts fact
      WHERE fact.event_id=event.id AND fact.is_verified=true
    ) facts ON true
    LEFT JOIN LATERAL (
      SELECT count(*)::int AS count
      FROM content.current_affairs_fact_conflicts conflict
      WHERE conflict.event_id=event.id AND conflict.status='open'
    ) conflicts ON true
    LEFT JOIN LATERAL (
      SELECT
        count(*) FILTER (WHERE item.is_primary_evidence=true)::int AS official_count,
        count(*) FILTER (
          WHERE item.is_primary_evidence=true
            AND source.source_key IN ('pib','rbi','sebi','isro','punjab_gov')
        )::int AS supported_count
      FROM content.current_affairs_event_sources item
      JOIN content.current_affairs_sources source ON source.id=item.source_id
      WHERE item.event_id=event.id
    ) evidence ON true
    LEFT JOIN content.current_affairs_localizations hi
      ON hi.event_id=event.id
      AND hi.authoring_version_id=event.learner_authoring_version_id
      AND hi.language_code='hi'
    LEFT JOIN content.current_affairs_localizations pa
      ON pa.event_id=event.id
      AND pa.authoring_version_id=event.learner_authoring_version_id
      AND pa.language_code='pa'
    WHERE event.id = ANY(${eventIds}::uuid[])
  `;
  return rows.map((row) => ({
    eventId: String(row.eventId),
    publicCode: String(row.publicCode),
    title: String(row.title ?? ""),
    eventStatus: String(row.eventStatus),
    authoringStatus: String(row.authoringStatus ?? "pending"),
    verifiedFactCount: Number(row.verifiedFactCount ?? 0),
    openConflictCount: Number(row.openConflictCount ?? 0),
    officialEvidenceCount: Number(row.officialEvidenceCount ?? 0),
    supportedOfficialEvidenceCount: Number(row.supportedOfficialEvidenceCount ?? 0),
    hindiStatus: String(row.hindiStatus ?? "missing"),
    punjabiStatus: String(row.punjabiStatus ?? "missing"),
  }));
}

export async function processSelectedCurrentAffairs(args: {
  targetDate: string;
  actorUserId: string;
}) {
  const targetDate = assertDateOnly(args.targetDate);
  const startedAt = new Date().toISOString();
  const selected = await loadSelectedHeadlines(targetDate);
  const selectedEventIds = [...new Set(selected.map((item) => item.eventId).filter((id): id is string => Boolean(id)))];
  const missingEventCandidateIds = selected.filter((item) => !item.eventId).map((item) => item.candidateId);

  if (selected.length === 0) {
    return {
      targetDate,
      startedAt,
      completedAt: new Date().toISOString(),
      selectedHeadlineCount: 0,
      selectedEventCount: 0,
      summary: { selected: 0, verified: 0, ready: 0, blocked: 0 },
      items: [],
      stages: {},
      canonicalApprovalAuthority: false,
      publicationAuthority: false,
      questionBankPromotionAuthority: false,
    };
  }

  await markProcessingAttempt(selectedEventIds, args.actorUserId);

  const targetDayOfficial = await loadTargetDayOfficialCandidates(targetDate);
  const clusterIds = [...new Set(selected.map((item) => item.clusterId).filter((id): id is string => Boolean(id)))];
  const clusterOfficial = await loadClusterOfficialCandidates(clusterIds);
  const rescueIds = [...new Set(selected.map((item) => item.rescueCandidateId).filter((id): id is string => Boolean(id)))];
  const rescueById = new Map((await loadOfficialCandidatesByIds(rescueIds)).map((candidate) => [candidate.id, candidate]));

  const attachments: EvidenceAttachment[] = [];
  const officialById = new Map<string, OfficialCandidate>();
  const eventOfficialIds = new Map<string, Set<string>>();
  for (const headline of selected) {
    if (!headline.eventId) continue;
    const evidence = candidateEvidenceForHeadline({ selected: headline, targetDayOfficial, clusterOfficial, rescueById });
    for (const item of evidence) {
      officialById.set(item.candidate.id, item.candidate);
      const ids = eventOfficialIds.get(headline.eventId) ?? new Set<string>();
      ids.add(item.candidate.id);
      eventOfficialIds.set(headline.eventId, ids);
      attachments.push({
        selectedCandidateId: headline.candidateId,
        eventId: headline.eventId,
        officialCandidateId: item.candidate.id,
        sourceKey: item.candidate.sourceKey,
        reason: item.reason,
        similarityScore: item.similarityScore,
      });
      await attachOfficialEvidence(headline, item.candidate, item.reason, item.similarityScore, args.actorUserId);
    }
  }

  const officialCandidateIds = [...officialById.keys()];
  const primaryEnrichment = await runPrimaryFactEnrichmentForCandidateIds(officialCandidateIds);
  const enrichmentStatusByCandidate = new Map(
    primaryEnrichment.results.map((item) => [String(item.candidateId), String(item.status)]),
  );

  let clonedClaimCount = 0;
  for (const [eventId, candidateIds] of eventOfficialIds) {
    for (const candidateId of candidateIds) {
      clonedClaimCount += await cloneEnrichedClaimsToEvent(eventId, candidateId);
    }
  }

  const reconciliation = await reconcilePrimaryEnrichedEventIds(selectedEventIds);
  const authoring = await runSourceIndependentAuthoringForEventIds(selectedEventIds);
  const localization = await runCurrentAffairsLocalizationForEventIds(selectedEventIds);

  // Authoring recalculates product scores. Re-run the CP-050 relevance policy so
  // manual selection remains an inclusion override without changing factual authority.
  const relevanceRefresh = await refreshTargetDateExamRelevance(targetDate);
  const discoveryCensus = await refreshDailyDiscoveryCensus(targetDate);
  const dailyMasterPacks = await materializeDailyMasterPacks(targetDate, String(discoveryCensus.id));

  const finalStates = await loadFinalEventStates(selectedEventIds);
  const finalById = new Map(finalStates.map((state) => [state.eventId, state]));
  const selectedByEvent = new Map<string, SelectedHeadlineRow[]>();
  for (const item of selected) {
    if (!item.eventId) continue;
    const group = selectedByEvent.get(item.eventId) ?? [];
    group.push(item);
    selectedByEvent.set(item.eventId, group);
  }

  const items = [...selectedByEvent.entries()].map(([eventId, headlines]) => {
    const state = finalById.get(eventId);
    const officialIds = [...(eventOfficialIds.get(eventId) ?? new Set<string>())];
    const enrichmentFailureCount = officialIds.filter((candidateId) => {
      const status = enrichmentStatusByCandidate.get(candidateId);
      return status === "failure";
    }).length;
    const processingState: SelectedAffairsProcessingState = state ? {
      reviewEventPresent: true,
      eventStatus: state.eventStatus,
      verifiedFactCount: state.verifiedFactCount,
      openConflictCount: state.openConflictCount,
      officialEvidenceCount: state.officialEvidenceCount,
      supportedOfficialEvidenceCount: state.supportedOfficialEvidenceCount,
      enrichmentFailureCount,
      authoringStatus: state.authoringStatus,
      hindiStatus: state.hindiStatus,
      punjabiStatus: state.punjabiStatus,
    } : {
      reviewEventPresent: false,
      eventStatus: null,
      verifiedFactCount: 0,
      openConflictCount: 0,
      officialEvidenceCount: 0,
      supportedOfficialEvidenceCount: 0,
      enrichmentFailureCount,
      authoringStatus: null,
      hindiStatus: null,
      punjabiStatus: null,
    };
    const blockers = selectedAffairsProcessingBlockers(processingState);
    return {
      eventId,
      publicCode: state?.publicCode ?? headlines[0]?.publicCode ?? null,
      title: state?.title ?? headlines[0]?.title ?? "Selected Current Affairs event",
      selectedCandidateIds: headlines.map((headline) => headline.candidateId),
      selectedHeadlineCount: headlines.length,
      eventStatus: state?.eventStatus ?? null,
      authoringStatus: state?.authoringStatus ?? null,
      hindiStatus: state?.hindiStatus ?? null,
      punjabiStatus: state?.punjabiStatus ?? null,
      verifiedFactCount: state?.verifiedFactCount ?? 0,
      officialEvidenceCount: state?.officialEvidenceCount ?? 0,
      supportedOfficialEvidenceCount: state?.supportedOfficialEvidenceCount ?? 0,
      blockers,
      stage: selectedAffairsProcessingStage(processingState),
      ready: blockers.length === 0,
    };
  });

  for (const headline of selected.filter((item) => !item.eventId)) {
    const processingState: SelectedAffairsProcessingState = {
      reviewEventPresent: false,
      eventStatus: null,
      verifiedFactCount: 0,
      openConflictCount: 0,
      officialEvidenceCount: 0,
      supportedOfficialEvidenceCount: 0,
      enrichmentFailureCount: 0,
      authoringStatus: null,
      hindiStatus: null,
      punjabiStatus: null,
    };
    items.push({
      eventId: null,
      publicCode: null,
      title: headline.title,
      selectedCandidateIds: [headline.candidateId],
      selectedHeadlineCount: 1,
      eventStatus: null,
      authoringStatus: null,
      hindiStatus: null,
      punjabiStatus: null,
      verifiedFactCount: 0,
      officialEvidenceCount: 0,
      supportedOfficialEvidenceCount: 0,
      blockers: selectedAffairsProcessingBlockers(processingState),
      stage: selectedAffairsProcessingStage(processingState),
      ready: false,
    });
  }

  const ready = items.filter((item) => item.ready).length;
  const verified = items.filter((item) => item.eventStatus === "verified").length;
  const blocked = items.length - ready;

  return {
    processingVersion: SELECTED_AFFAIRS_PROCESSING_VERSION,
    targetDate,
    startedAt,
    completedAt: new Date().toISOString(),
    selectedHeadlineCount: selected.length,
    selectedEventCount: items.length,
    missingEventCandidateIds,
    summary: {
      selected: items.length,
      verified,
      ready,
      blocked,
      verificationBlocked: items.filter((item) => item.stage === "verification").length,
      englishBlocked: items.filter((item) => item.stage === "english").length,
      localizationBlocked: items.filter((item) => item.stage === "localization").length,
    },
    items,
    stages: {
      evidenceAttachment: {
        attachedLinks: attachments.length,
        distinctOfficialCandidates: officialCandidateIds.length,
        attachments,
      },
      primaryEnrichment,
      clonedClaimCount,
      reconciliation,
      authoring,
      localization,
      relevanceRefresh,
      discoveryCensus: {
        id: String(discoveryCensus.id),
        coverageConfidenceScore: Number((discoveryCensus as any).coverageConfidenceScore ?? 0),
        warnings: (discoveryCensus as any).warnings ?? [],
      },
      dailyMasterPacks,
    },
    packPreviewScope: "canonical_draft_refresh",
    packPreviewNote: "The draft pack still follows existing verified/include-recommended rules; processing selected affairs does not force-exclude other already-recommended events.",
    canonicalApprovalAuthority: false,
    publicationAuthority: false,
    questionBankPromotionAuthority: false,
    auditReference: randomUUID(),
  };
}
