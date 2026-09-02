import { sqlClient } from "../lib/db";

export async function rejectBroadOnlyLowSignalDiscoveryEvents(targetDate: string) {
  const rows = await sqlClient`
    WITH low_signal_events AS (
      SELECT event.id
      FROM content.current_affairs_events event
      JOIN content.current_affairs_event_candidates link ON link.event_id=event.id
      JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=link.candidate_id
      WHERE event.event_date=${targetDate}::date
        AND event.status='review'
        AND COALESCE((event.metadata->>'manualEditorialSelected')::boolean, false)=false
      GROUP BY event.id
      HAVING bool_and(COALESCE(candidate.payload->>'discoveryProvider','')='gdelt_doc_2')
         AND bool_and(COALESCE(candidate.payload->>'discoveryTargetDate','')=${targetDate})
         AND bool_and(COALESCE((candidate.payload->>'discoveryEligible')::boolean, false)=false)
         AND bool_and(COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=false)
         AND NOT EXISTS (
           SELECT 1
           FROM content.current_affairs_event_sources evidence
           WHERE evidence.event_id=event.id AND evidence.is_primary_evidence=true
         )
    )
    UPDATE content.current_affairs_events event
    SET status='rejected',
        metadata=event.metadata || ${JSON.stringify({
          rejectedBy: "cp043_open_news_triage",
          rejectionReason: "gdelt_broad_only_low_signal_discovery_event",
          reversibleEditorialExclusion: true,
        })}::jsonb,
        updated_at=now()
    WHERE event.id IN (SELECT id FROM low_signal_events)
    RETURNING event.id::text AS id, event.public_code AS "publicCode"
  `;

  return {
    targetDate,
    rejectedReviewEvents: rows.length,
    publicCodes: rows.map((row) => String(row.publicCode)).slice(0, 50),
    rule: "all-linked-candidates-gdelt+broad-only-low-signal+no-primary-evidence+not-manually-selected",
    manualEditorialSelectionsProtected: true,
  };
}
