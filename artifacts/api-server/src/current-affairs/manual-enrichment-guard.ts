import { sqlClient } from "../lib/db";

const GUARD_VERSION = "ca-cp008-manual-authority-guard-v1";

export async function holdManualAuthorityEventsForReview(limit = 100) {
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
      AND (
        EXISTS (
          SELECT 1
          FROM content.current_affairs_facts fact
          WHERE fact.event_id=event.id
            AND fact.reconciliation_status='manual'
        )
        OR EXISTS (
          SELECT 1
          FROM content.current_affairs_fact_conflicts conflict
          WHERE conflict.event_id=event.id
            AND conflict.status='manually_resolved'
        )
      )
    ORDER BY id
    LIMIT ${safeLimit}
  `;

  const guardedAt = new Date().toISOString();
  for (const row of rows) {
    const eventId = String(row.id);
    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE content.current_affairs_events
        SET status='review',
            verification_confidence=0,
            metadata=metadata || ${JSON.stringify({
              lastPrimaryEnrichmentReconciledAt: guardedAt,
              primaryEnrichmentManualReviewRequired: true,
              primaryEnrichmentManualReviewReason:
                "Late primary-source enrichment touched an event with manual editorial fact authority",
              primaryEnrichmentManualGuardVersion: GUARD_VERSION,
            })}::jsonb,
            updated_at=now()
        WHERE id=${eventId}::uuid
      `;
      await tx`
        UPDATE content.current_affairs_facts
        SET is_verified=false, updated_at=now()
        WHERE event_id=${eventId}::uuid
      `;
    });
  }

  return {
    examined: rows.length,
    heldForEditorialReview: rows.length,
    eventIds: rows.map((row) => String(row.id)),
  };
}
