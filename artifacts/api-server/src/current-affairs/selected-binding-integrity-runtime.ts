import { sqlClient } from "../lib/db";
import { assertDateOnly } from "./core";

export const SELECTED_BINDING_INTEGRITY_VERSION = "ca-cp073-selected-binding-integrity-v1";

type SelectedBindingRow = {
  candidateId: string;
  title: string;
  eventId: string | null;
  publicCode: string | null;
  eventStatus: string | null;
};

type PackSnapshotRow = {
  id: string;
  languageCode: string;
  status: string;
  censusId: string | null;
  learningResourceId: string;
  eventCount: number;
  categoryCount: number;
  bodyMarkdown: string;
  payload: Record<string, unknown>;
  renderTargets: unknown;
  generatedAt: string;
  resourceTitle: string;
  resourceSummary: string;
  resourceBodyMarkdown: string;
  resourceStatus: string;
};

export type SelectedPackSnapshot = {
  targetDate: string;
  capturedAt: string;
  rows: PackSnapshotRow[];
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

async function loadSelectedBindings(targetDate: string): Promise<SelectedBindingRow[]> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS "candidateId",
      candidate.raw_title AS title,
      COALESCE(explicit_event.id, direct_event.id)::text AS "eventId",
      COALESCE(explicit_event.public_code, direct_event.public_code) AS "publicCode",
      COALESCE(explicit_event.status, direct_event.status) AS "eventStatus"
    FROM content.current_affairs_ingestion_candidates candidate
    LEFT JOIN content.current_affairs_events explicit_event
      ON explicit_event.id::text=NULLIF(candidate.payload->>'manualEditorialSelectedEventId','')
    LEFT JOIN LATERAL (
      SELECT event.id, event.public_code, event.status
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_events event ON event.id=evidence.event_id
      WHERE (
        COALESCE((evidence.metadata->>'manualEditorialSelection')::boolean, false)=true
        AND evidence.metadata->>'sourceCandidateId'=candidate.id::text
      ) OR (
        evidence.metadata->>'selectedCandidateId'=candidate.id::text
        AND evidence.metadata->>'officialCandidateId'=candidate.id::text
        AND evidence.metadata->>'attachmentReason'='selected_primary'
      )
      ORDER BY
        CASE
          WHEN COALESCE((evidence.metadata->>'manualEditorialSelection')::boolean, false)=true
            AND evidence.metadata->>'sourceCandidateId'=candidate.id::text
          THEN 0
          ELSE 1
        END,
        CASE event.status
          WHEN 'verified' THEN 0
          WHEN 'review' THEN 1
          WHEN 'candidate' THEN 2
          WHEN 'rejected' THEN 3
          ELSE 4
        END,
        evidence.created_at ASC
      LIMIT 1
    ) direct_event ON true
    WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
    ORDER BY candidate.created_at ASC, candidate.id ASC
  `;
  return rows.map((row) => ({
    candidateId: String(row.candidateId),
    title: String(row.title ?? ""),
    eventId: row.eventId ? String(row.eventId) : null,
    publicCode: row.publicCode ? String(row.publicCode) : null,
    eventStatus: row.eventStatus ? String(row.eventStatus) : null,
  }));
}

export async function repairSelectedCandidateEventBindings(args: {
  targetDate: string;
  actorUserId: string;
}) {
  const targetDate = assertDateOnly(args.targetDate);
  const bindings = await loadSelectedBindings(targetDate);
  const bound = bindings.filter((item): item is SelectedBindingRow & { eventId: string } => Boolean(item.eventId));
  const unboundCandidateIds = bindings.filter((item) => !item.eventId).map((item) => item.candidateId);
  let crossEvidenceQuarantined = 0;
  let crossLinksRemoved = 0;
  let reviewEventsRearmed = 0;

  await sqlClient.begin(async (tx) => {
    for (const binding of bound) {
      await tx`
        UPDATE content.current_affairs_ingestion_candidates
        SET payload=COALESCE(payload, '{}'::jsonb) || ${JSON.stringify({
          manualEditorialSelectedEventId: binding.eventId,
          manualEditorialSelectedEventBindingVersion: SELECTED_BINDING_INTEGRITY_VERSION,
          manualEditorialSelectedEventBoundAt: new Date().toISOString(),
        })}::jsonb,
            updated_at=now()
        WHERE id=${binding.candidateId}::uuid
          AND COALESCE((payload->>'manualEditorialSelected')::boolean, false)=true
      `;

      const quarantined = await tx`
        UPDATE content.current_affairs_event_sources evidence
        SET is_primary_evidence=false,
            metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
              selectedBindingIntegrityVersion: SELECTED_BINDING_INTEGRITY_VERSION,
              selectedBindingQuarantined: true,
              selectedBindingQuarantineReason: "cross_event_target_day_title_match",
              selectedBindingQuarantinedAt: new Date().toISOString(),
            })}::jsonb
        WHERE evidence.event_id<>${binding.eventId}::uuid
          AND evidence.metadata->>'officialCandidateId'=${binding.candidateId}
          AND evidence.metadata->>'attachmentReason'='target_day_title_match'
          AND COALESCE(evidence.metadata->>'selectedCandidateId','')<>${binding.candidateId}
        RETURNING evidence.event_id::text AS "eventId"
      `;
      crossEvidenceQuarantined += quarantined.length;
      const crossEventIds = [...new Set(quarantined.map((row) => String(row.eventId)))];
      if (crossEventIds.length > 0) {
        const removed = await tx`
          DELETE FROM content.current_affairs_event_candidates link
          WHERE link.candidate_id=${binding.candidateId}::uuid
            AND link.event_id = ANY(${crossEventIds}::uuid[])
          RETURNING link.event_id::text AS "eventId"
        `;
        crossLinksRemoved += removed.length;
      }

      if (binding.eventStatus === "review") {
        const rearmed = await tx`
          UPDATE content.current_affairs_events
          SET metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
            selectedPrimaryRecoveryVersion: SELECTED_BINDING_INTEGRITY_VERSION,
            selectedBindingRecoveryRearmedAt: new Date().toISOString(),
            selectedBindingRecoveryRearmedBy: args.actorUserId,
            automaticVerificationAuthority: false,
            automaticPublicationAuthority: false,
          })}::jsonb,
              updated_by=${args.actorUserId}::uuid,
              updated_at=now()
          WHERE id=${binding.eventId}::uuid
            AND status='review'
          RETURNING id
        `;
        reviewEventsRearmed += rearmed.length;
      }
    }
  });

  return {
    bindingVersion: SELECTED_BINDING_INTEGRITY_VERSION,
    targetDate,
    selectedHeadlineCount: bindings.length,
    boundHeadlineCount: bound.length,
    distinctBoundEventCount: new Set(bound.map((item) => item.eventId)).size,
    unboundCandidateIds,
    crossEvidenceQuarantined,
    crossLinksRemoved,
    reviewEventsRearmed,
    verificationAuthority: false,
    publicationAuthority: false,
    questionBankPromotionAuthority: false,
  };
}

export async function pruneSupersededSelectedRecoveryClaims(targetDateInput: string) {
  const targetDate = assertDateOnly(targetDateInput);
  const rows = await sqlClient`
    WITH selected_events AS (
      SELECT DISTINCT NULLIF(candidate.payload->>'manualEditorialSelectedEventId','')::uuid AS event_id
      FROM content.current_affairs_ingestion_candidates candidate
      WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
        AND COALESCE(
          NULLIF(candidate.payload->>'historicalTargetDate',''),
          NULLIF(candidate.payload->>'discoveryTargetDate',''),
          (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
        )=${targetDate}
        AND NULLIF(candidate.payload->>'manualEditorialSelectedEventId','') IS NOT NULL
    ), superseded AS (
      SELECT old.id, old.event_id
      FROM content.current_affairs_fact_claims old
      JOIN selected_events selected ON selected.event_id=old.event_id
      WHERE COALESCE(old.metadata->>'claimStage','')='cp054_selected_recovery'
        AND EXISTS (
          SELECT 1
          FROM content.current_affairs_fact_claims stronger
          WHERE stronger.event_id=old.event_id
            AND stronger.fact_key=old.fact_key
            AND stronger.normalized_value<>old.normalized_value
            AND COALESCE(stronger.metadata->>'claimStage','') IN (
              'cp063_selected_blocker_closure',
              'cp064_selected_residual_closure',
              'cp066_rbi_final_mile'
            )
        )
    )
    DELETE FROM content.current_affairs_fact_claims claim
    USING superseded
    WHERE claim.id=superseded.id
    RETURNING claim.event_id::text AS "eventId"
  `;
  const eventIds = [...new Set(rows.map((row) => String(row.eventId)))];
  if (eventIds.length > 0) {
    await sqlClient`
      UPDATE content.current_affairs_events
      SET metadata=COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
        selectedBindingIntegrityVersion: SELECTED_BINDING_INTEGRITY_VERSION,
        supersededSelectedRecoveryClaimsPrunedAt: new Date().toISOString(),
      })}::jsonb,
          updated_at=now()
      WHERE id = ANY(${eventIds}::uuid[])
    `;
  }
  return {
    bindingVersion: SELECTED_BINDING_INTEGRITY_VERSION,
    targetDate,
    prunedClaimCount: rows.length,
    affectedEventIds: eventIds,
    verificationAuthority: false,
    publicationAuthority: false,
  };
}

export async function captureSelectedPackSnapshot(targetDateInput: string): Promise<SelectedPackSnapshot> {
  const targetDate = assertDateOnly(targetDateInput);
  const rows = await sqlClient`
    SELECT
      pack.id::text AS id,
      pack.language_code AS "languageCode",
      pack.status,
      pack.census_id::text AS "censusId",
      pack.learning_resource_id::text AS "learningResourceId",
      pack.event_count::int AS "eventCount",
      pack.category_count::int AS "categoryCount",
      pack.body_markdown AS "bodyMarkdown",
      pack.payload,
      pack.render_targets AS "renderTargets",
      pack.generated_at::text AS "generatedAt",
      resource.title AS "resourceTitle",
      resource.summary AS "resourceSummary",
      resource.body_markdown AS "resourceBodyMarkdown",
      resource.status AS "resourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${targetDate}::date
      AND pack.language_code IN ('en','hi','pa')
    ORDER BY pack.language_code
  `;
  return {
    targetDate,
    capturedAt: new Date().toISOString(),
    rows: rows.map((row) => ({
      id: String(row.id),
      languageCode: String(row.languageCode),
      status: String(row.status),
      censusId: row.censusId ? String(row.censusId) : null,
      learningResourceId: String(row.learningResourceId),
      eventCount: Number(row.eventCount ?? 0),
      categoryCount: Number(row.categoryCount ?? 0),
      bodyMarkdown: String(row.bodyMarkdown ?? ""),
      payload: asObject(row.payload),
      renderTargets: row.renderTargets,
      generatedAt: String(row.generatedAt),
      resourceTitle: String(row.resourceTitle ?? ""),
      resourceSummary: String(row.resourceSummary ?? ""),
      resourceBodyMarkdown: String(row.resourceBodyMarkdown ?? ""),
      resourceStatus: String(row.resourceStatus),
    })),
  };
}

export async function restoreSelectedPackSnapshot(snapshot: SelectedPackSnapshot) {
  if (snapshot.rows.length === 0) {
    return { restored: false, restoredPackCount: 0, reason: "no_existing_pack_snapshot" };
  }
  let restoredPackCount = 0;
  await sqlClient.begin(async (tx) => {
    for (const row of snapshot.rows) {
      const restored = await tx`
        UPDATE content.current_affairs_daily_master_packs
        SET status=${row.status},
            census_id=${row.censusId}::uuid,
            learning_resource_id=${row.learningResourceId}::uuid,
            event_count=${row.eventCount},
            category_count=${row.categoryCount},
            body_markdown=${row.bodyMarkdown},
            payload=${JSON.stringify(row.payload)}::jsonb,
            render_targets=${JSON.stringify(row.renderTargets)}::jsonb,
            generated_at=${row.generatedAt}::timestamptz,
            updated_at=now()
        WHERE id=${row.id}::uuid
          AND content_date=${snapshot.targetDate}::date
          AND language_code=${row.languageCode}
          AND status IN ('draft','review')
        RETURNING id
      `;
      restoredPackCount += restored.length;
      await tx`
        UPDATE content.learning_resources
        SET title=${row.resourceTitle},
            summary=${row.resourceSummary},
            body_markdown=${row.resourceBodyMarkdown},
            status=${row.resourceStatus},
            updated_at=now()
        WHERE id=${row.learningResourceId}::uuid
          AND status='draft'
      `;
    }
  });
  return {
    restored: restoredPackCount > 0,
    restoredPackCount,
    reason: restoredPackCount > 0 ? "selected_finalization_failed_snapshot_restored" : "snapshot_restore_not_applicable",
  };
}
