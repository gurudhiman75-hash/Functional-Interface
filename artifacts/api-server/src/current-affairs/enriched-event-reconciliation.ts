import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { canAutoVerify } from "./core";
import {
  reconcileFactClaims,
  type ClaimEvidence,
  type ReconciledFact,
} from "./intelligence";
import { canAutoVerifyEvent } from "./orchestration-policy";

const RECONCILIATION_VERSION = "ca-cp008-primary-enrichment-reconcile-v1";
const EXPLICIT_RECONCILIATION_CONCURRENCY = 4;

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

async function strictVerificationDecision(eventId: string) {
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
      FROM content.current_affairs_facts
      WHERE event_id=${eventId}::uuid
    `,
    sqlClient`
      SELECT COUNT(*)::int AS count
      FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid AND status='open'
    `,
  ]);
  const decision = canAutoVerify({
    evidence: evidence.map((row) => ({
      isPrimaryEvidence: Boolean(row.isPrimaryEvidence),
      trustScore: Number(row.trustScore ?? 0),
    })),
    factConfidences: facts.map((row) => Number(row.confidence ?? 0)),
  });
  const policy = canAutoVerifyEvent({
    verificationGateAllowed: decision.allowed,
    verificationConfidence: decision.confidence,
    verifiedFactCount: facts.length,
    openConflictCount: Number(conflicts[0]?.count ?? 0),
    evidenceCount: evidence.length,
    primaryEvidenceCount: evidence.filter((row) => Boolean(row.isPrimaryEvidence)).length,
  });
  return {
    allowed: policy.allowed,
    confidence: decision.confidence,
    reason: policy.reason,
    openConflictCount: Number(conflicts[0]?.count ?? 0),
  };
}

async function reconcileOneEvent(eventId: string) {
  const claims = await eventClaims(eventId);
  const result = reconcileFactClaims(claims);

  await sqlClient.begin(async (tx) => {
    // Rebuild automation-derived facts from the complete current claim graph.
    // Manual editorial resolutions are retained as explicit authority.
    await tx`
      DELETE FROM content.current_affairs_facts
      WHERE event_id=${eventId}::uuid
        AND reconciliation_status <> 'manual'
    `;
    await tx`
      DELETE FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid
        AND status IN ('open', 'auto_resolved')
    `;
    for (const fact of result.facts) {
      await materializeFact(tx, eventId, fact);
    }
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

  const verification = await strictVerificationDecision(eventId);
  const reconciledAt = new Date().toISOString();
  await sqlClient.begin(async (tx) => {
    await tx`
      UPDATE content.current_affairs_events
      SET status=${verification.allowed ? "verified" : "review"},
          verification_confidence=${verification.allowed ? verification.confidence : 0},
          metadata=metadata || ${JSON.stringify({
            lastPrimaryEnrichmentReconciledAt: reconciledAt,
            primaryEnrichmentReconciliationVersion: RECONCILIATION_VERSION,
            primaryEnrichmentVerificationReason: verification.reason,
          })}::jsonb,
          updated_at=now()
      WHERE id=${eventId}::uuid
    `;
    await tx`
      UPDATE content.current_affairs_facts
      SET is_verified=${verification.allowed}, updated_at=now()
      WHERE event_id=${eventId}::uuid
    `;
  });

  return {
    eventId,
    claimCount: claims.length,
    canonicalFactCount: result.facts.length,
    conflictCount: result.conflicts.length,
    openConflictCount: verification.openConflictCount,
    verified: verification.allowed,
    verificationReason: verification.reason,
  };
}

async function explicitReconciliationIds(eventIds: string[]) {
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT event.id::text AS id
    FROM content.current_affairs_events event
    WHERE event.id = ANY(${eventIds}::uuid[])
      AND (
        event.status <> 'verified'
        OR EXISTS (
          SELECT 1
          FROM content.current_affairs_event_candidates link
          JOIN content.current_affairs_candidate_enrichments enrichment
            ON enrichment.candidate_id=link.candidate_id
           AND enrichment.status='success'
          WHERE link.event_id=event.id
            AND enrichment.last_enriched_at IS NOT NULL
            AND enrichment.last_enriched_at > COALESCE(
              NULLIF(event.metadata->>'lastPrimaryEnrichmentReconciledAt', '')::timestamptz,
              'epoch'::timestamptz
            )
        )
      )
    ORDER BY event.id
  `;
  return rows.map((row) => String(row.id));
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(Math.max(1, Math.floor(concurrency)), items.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

export async function reconcilePrimaryEnrichedEventIds(eventIdsInput: string[]) {
  const eventIds = [...new Set(eventIdsInput.map(String).filter(Boolean))].slice(0, 300);
  const reconciliationIds = await explicitReconciliationIds(eventIds);
  const results = await mapWithConcurrency(
    reconciliationIds,
    EXPLICIT_RECONCILIATION_CONCURRENCY,
    reconcileOneEvent,
  );
  const reconciledIds = new Set(reconciliationIds);
  return {
    requested: eventIds.length,
    reconciled: results.length,
    skippedUnchanged: eventIds.length - results.length,
    skippedEventIds: eventIds.filter((eventId) => !reconciledIds.has(eventId)),
    verified: results.filter((item) => item.verified).length,
    heldForReview: results.filter((item) => !item.verified).length,
    results,
    scope: "explicit_event_ids_incremental",
  };
}

export async function reconcilePrimaryEnrichedEvents(limit = 100) {
  const safeLimit = Math.max(1, Math.min(300, Math.floor(limit)));
  const rows = await sqlClient`
    SELECT DISTINCT event.id::text AS id
    FROM content.current_affairs_events event
    JOIN content.current_affairs_event_candidates link ON link.event_id=event.id
    JOIN content.current_affairs_candidate_enrichments enrichment
      ON enrichment.candidate_id=link.candidate_id
     AND enrichment.status='success'
    WHERE event.status IN ('review', 'verified')
      AND enrichment.last_enriched_at IS NOT NULL
      AND enrichment.last_enriched_at > COALESCE(
        NULLIF(event.metadata->>'lastPrimaryEnrichmentReconciledAt', '')::timestamptz,
        'epoch'::timestamptz
      )
    ORDER BY id
    LIMIT ${safeLimit}
  `;

  const results = [];
  for (const row of rows) {
    results.push(await reconcileOneEvent(String(row.id)));
  }
  return {
    examined: rows.length,
    reconciled: results.length,
    verified: results.filter((item) => item.verified).length,
    heldForReview: results.filter((item) => !item.verified).length,
    results,
  };
}
