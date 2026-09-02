import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { canAutoVerify } from "./core";
import {
  extractHeadlineFactClaims,
  reconcileFactClaims,
  type ClaimEvidence,
  type ReconciledFact,
} from "./intelligence";
import { canAutoVerifyEvent } from "./orchestration-policy";

const REBUILD_VERSION = "ca-cp049-historical-headline-rebuild-v2";

type HistoricalCandidateRow = {
  eventId: string;
  candidateId: string;
  clusterId: string | null;
  sourceId: string;
  sourceKey: string;
  title: string;
  isPrimarySource: boolean;
};

async function loadTargetCandidates(targetDate: string, limit: number): Promise<HistoricalCandidateRow[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS "eventId",
      candidate.id::text AS "candidateId",
      link.cluster_id::text AS "clusterId",
      source.id::text AS "sourceId",
      source.source_key AS "sourceKey",
      candidate.raw_title AS title,
      source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_events event
    JOIN content.current_affairs_event_candidates link ON link.event_id=event.id
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=link.candidate_id
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE event.event_date=${targetDate}::date
      AND event.status IN ('review','verified')
      AND COALESCE((event.metadata->>'autoPromoted')::boolean, false)=true
      AND COALESCE(event.learner_authoring_status, 'pending') <> 'manual'
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.reconciliation_status='manual'
      )
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='manually_resolved'
      )
    ORDER BY event.updated_at DESC, candidate.published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    eventId: String(row.eventId),
    candidateId: String(row.candidateId),
    clusterId: row.clusterId ? String(row.clusterId) : null,
    sourceId: String(row.sourceId),
    sourceKey: String(row.sourceKey),
    title: String(row.title),
    isPrimarySource: Boolean(row.isPrimarySource),
  }));
}

async function replaceHeadlineClaims(row: HistoricalCandidateRow) {
  const nextClaims = extractHeadlineFactClaims(row.title);

  // CP-049: historical replays must apply the current parser, not accumulate old
  // rule-parser mistakes beside the corrected claims. Delete only machine-created
  // headline/rule claims for this exact candidate+event. Manual/model/structured
  // evidence is never touched, and events with manual authority are excluded by
  // loadTargetCandidates above.
  await sqlClient`
    DELETE FROM content.current_affairs_fact_claims
    WHERE event_id=${row.eventId}::uuid
      AND candidate_id=${row.candidateId}::uuid
      AND extraction_method='rule'
      AND COALESCE(metadata->>'source', 'headline')='headline'
  `;

  let materialized = 0;
  for (const claim of nextClaims) {
    const inserted = await sqlClient`
      INSERT INTO content.current_affairs_fact_claims (
        id, cluster_id, event_id, candidate_id, source_id,
        fact_key, fact_value, normalized_value, fact_type, confidence,
        extraction_method, is_primary_evidence, metadata, created_at
      ) VALUES (
        ${randomUUID()}::uuid, ${row.clusterId}::uuid, ${row.eventId}::uuid,
        ${row.candidateId}::uuid, ${row.sourceId}::uuid,
        ${claim.factKey}, ${claim.factValue}, ${claim.normalizedValue}, ${claim.factType},
        ${claim.confidence}, ${claim.extractionMethod}, ${row.isPrimarySource},
        ${JSON.stringify({
          source: "headline",
          claimStage: "historical_rebuild",
          intelligenceVersion: REBUILD_VERSION,
        })}::jsonb,
        now()
      )
      ON CONFLICT (candidate_id, fact_key, normalized_value) DO UPDATE
      SET cluster_id=COALESCE(EXCLUDED.cluster_id, content.current_affairs_fact_claims.cluster_id),
          event_id=EXCLUDED.event_id,
          source_id=EXCLUDED.source_id,
          fact_value=EXCLUDED.fact_value,
          fact_type=EXCLUDED.fact_type,
          confidence=GREATEST(content.current_affairs_fact_claims.confidence, EXCLUDED.confidence),
          is_primary_evidence=content.current_affairs_fact_claims.is_primary_evidence OR EXCLUDED.is_primary_evidence,
          metadata=content.current_affairs_fact_claims.metadata || EXCLUDED.metadata
      RETURNING id
    `;
    if (inserted[0]) materialized += 1;
  }
  return materialized;
}

async function eventClaims(eventId: string): Promise<ClaimEvidence[]> {
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
    LEFT JOIN content.current_affairs_sources source ON source.id=claim.source_id
    WHERE claim.event_id=${eventId}::uuid
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

async function materializeFact(tx: any, eventId: string, fact: ReconciledFact) {
  await tx`
    INSERT INTO content.current_affairs_facts (
      id, event_id, fact_key, fact_value, fact_type, is_verified, confidence,
      sort_order, reconciliation_status, support_count, primary_support_count,
      provenance, created_at, updated_at
    ) VALUES (
      ${randomUUID()}::uuid, ${eventId}::uuid, ${fact.factKey}, ${fact.factValue},
      ${fact.factType}, false, ${fact.confidence}, 0, ${fact.reconciliationStatus},
      ${fact.supportCount}, ${fact.primarySupportCount}, ${JSON.stringify(fact.provenance)}::jsonb,
      now(), now()
    )
    ON CONFLICT (event_id, fact_key, fact_value) DO UPDATE
    SET confidence=EXCLUDED.confidence,
        support_count=EXCLUDED.support_count,
        primary_support_count=EXCLUDED.primary_support_count,
        reconciliation_status=EXCLUDED.reconciliation_status,
        provenance=EXCLUDED.provenance,
        updated_at=now()
  `;
}

async function reconcileRebuiltEvent(eventId: string) {
  const claims = await eventClaims(eventId);
  const result = reconcileFactClaims(claims);

  await sqlClient.begin(async (tx) => {
    await tx`
      DELETE FROM content.current_affairs_facts
      WHERE event_id=${eventId}::uuid AND reconciliation_status <> 'manual'
    `;
    await tx`
      DELETE FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid AND status IN ('open','auto_resolved')
    `;
    for (const fact of result.facts) await materializeFact(tx, eventId, fact);
    for (const conflict of result.conflicts) {
      await tx`
        INSERT INTO content.current_affairs_fact_conflicts (
          id, event_id, fact_key, competing_values, status, preferred_value,
          resolution_reason, resolved_at, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid, ${eventId}::uuid, ${conflict.factKey},
          ${JSON.stringify(conflict.values)}::jsonb,
          ${conflict.autoResolution ? "auto_resolved" : "open"},
          ${conflict.autoResolution?.factValue ?? null},
          ${conflict.resolutionReason ?? null},
          ${conflict.autoResolution ? new Date().toISOString() : null},
          now(), now()
        )
      `;
    }
  });

  const [evidence, facts, conflicts] = await Promise.all([
    sqlClient`
      SELECT evidence.is_primary_evidence AS "isPrimaryEvidence",
             source.trust_score::float8 AS "trustScore"
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=${eventId}::uuid
    `,
    sqlClient`
      SELECT confidence::float8 AS confidence
      FROM content.current_affairs_facts WHERE event_id=${eventId}::uuid
    `,
    sqlClient`
      SELECT COUNT(*)::int AS count
      FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid AND status='open'
    `,
  ]);
  const decision = canAutoVerify({
    evidence: evidence.map((item) => ({
      isPrimaryEvidence: Boolean(item.isPrimaryEvidence),
      trustScore: Number(item.trustScore ?? 0),
    })),
    factConfidences: facts.map((item) => Number(item.confidence ?? 0)),
  });
  const policy = canAutoVerifyEvent({
    verificationGateAllowed: decision.allowed,
    verificationConfidence: decision.confidence,
    verifiedFactCount: facts.length,
    openConflictCount: Number(conflicts[0]?.count ?? 0),
    evidenceCount: evidence.length,
    primaryEvidenceCount: evidence.filter((item) => Boolean(item.isPrimaryEvidence)).length,
  });

  await sqlClient.begin(async (tx) => {
    await tx`
      UPDATE content.current_affairs_events
      SET status=${policy.allowed ? "verified" : "review"},
          verification_confidence=${policy.allowed ? decision.confidence : 0},
          metadata=metadata || ${JSON.stringify({
            historicalClaimRebuildVersion: REBUILD_VERSION,
            historicalClaimRebuildAt: new Date().toISOString(),
            historicalClaimVerificationReason: policy.reason,
          })}::jsonb,
          updated_at=now()
      WHERE id=${eventId}::uuid
    `;
    await tx`
      UPDATE content.current_affairs_facts
      SET is_verified=${policy.allowed}, updated_at=now()
      WHERE event_id=${eventId}::uuid
    `;
  });

  return {
    eventId,
    claimCount: claims.length,
    canonicalFactCount: result.facts.length,
    conflictCount: result.conflicts.length,
    verified: policy.allowed,
    verificationReason: policy.reason,
  };
}

export async function rebuildHistoricalHeadlineClaims(targetDate: string, limit = 600) {
  const safeLimit = Math.max(1, Math.min(1200, Math.floor(limit)));
  const rows = await loadTargetCandidates(targetDate, safeLimit);
  const affectedEventIds = new Set<string>();
  let materializedClaimCount = 0;

  for (const row of rows) {
    const count = await replaceHeadlineClaims(row);
    materializedClaimCount += count;
    affectedEventIds.add(row.eventId);
  }

  const reconciled = [];
  for (const eventId of affectedEventIds) {
    reconciled.push(await reconcileRebuiltEvent(eventId));
  }

  return {
    targetDate,
    candidatesExamined: rows.length,
    materializedClaimCount,
    eventsReconciled: reconciled.length,
    eventsVerified: reconciled.filter((item) => item.verified).length,
    eventsHeldForReview: reconciled.filter((item) => !item.verified).length,
    manualAuthorityExcluded: true,
    staleAutoHeadlineClaimsReplaced: true,
    rebuildVersion: REBUILD_VERSION,
    results: reconciled,
  };
}