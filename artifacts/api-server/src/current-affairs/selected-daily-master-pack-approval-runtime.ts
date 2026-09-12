import { createHash, randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  evaluateDailyMasterPackApprovalReadiness,
  evaluateDailyMasterPackEditorialQuality,
} from "./daily-master-pack-approval-policy";
import {
  listDailyMasterPackApprovalHistory,
  loadDailyMasterPackApprovalCandidate as loadLegacyDailyMasterPackApprovalCandidate,
  revokeDailyMasterPackApproval,
  type DailyMasterPackApprovalCandidate,
} from "./daily-master-pack-approval-runtime";
import {
  evaluateSelectedApprovalCensus,
  SELECTED_APPROVAL_CENSUS_VERSION,
  type SelectedApprovalCensus,
} from "./selected-approval-census";

export { listDailyMasterPackApprovalHistory, revokeDailyMasterPackApproval };

export const SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION = "ca-cp069-selected-master-pack-approval-boundary-v1";
const MALFORMED_SCHEDULED_ACTION = /\bscheduled\s+(?:launch|conduct|inaugurat(?:e|ion)|hold|held|open|unveil|release)\b/i;

export type SelectedDailyMasterPackApprovalCandidate = DailyMasterPackApprovalCandidate & {
  selectedApprovalCensus: SelectedApprovalCensus | null;
};

function parseArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeIds(values: string[]) {
  return [...new Set(values.map(clean).filter(Boolean))].sort();
}

function sha256(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function approvalCode(contentDate: string, version: number) {
  return `CA-MPA-D-${contentDate.replaceAll("-", "")}-V${version}`;
}

function isAdminSelectedPack(candidate: DailyMasterPackApprovalCandidate) {
  const english = candidate.packs.find((pack) => pack.language === "en");
  const membership = asObject(english?.payload.membership);
  return membership.mode === "admin_selected" && Number(membership.selectedEventCount ?? 0) > 0;
}

function payloadEditorialEventsForSelectedApproval(payload: Record<string, unknown>) {
  const events: Array<{
    id: string;
    title: string;
    summary: string;
    oneLiner: string;
    category: string;
    facts: Array<{ key: string; value: string }>;
  }> = [];
  for (const sectionValue of parseArray(payload.sections)) {
    const section = asObject(sectionValue);
    for (const eventValue of parseArray(section.events)) {
      const event = asObject(eventValue);
      const id = clean(event.id);
      if (!id) continue;
      const title = clean(event.title);
      const summary = clean(event.summary);
      const oneLiner = clean(event.oneLiner);
      const learnerCopy = `${title} ${summary} ${oneLiner}`;
      const facts = parseArray(event.facts).map(asObject).map((fact) => ({
        key: clean(fact.key),
        value: clean(fact.value),
      })).filter((fact) => fact.key && fact.value).filter((fact) => {
        return !(fact.key.toLowerCase().replace(/\s+/g, "_") === "official_action"
          && MALFORMED_SCHEDULED_ACTION.test(fact.value)
          && !MALFORMED_SCHEDULED_ACTION.test(learnerCopy));
      });
      events.push({
        id,
        title,
        summary,
        oneLiner,
        category: clean(event.category ?? section.category ?? "other"),
        facts,
      });
    }
  }
  return events;
}

export function selectedApprovalMembershipIds(candidate: DailyMasterPackApprovalCandidate) {
  if (!isAdminSelectedPack(candidate)) return null;
  const english = candidate.packs.find((pack) => pack.language === "en");
  return normalizeIds(english?.payloadEventIds ?? []);
}

async function loadCurrentSelectedHeadlineResolution(
  contentDate: string,
  client: typeof sqlClient,
) {
  const rows = await client`
    SELECT candidate.id::text AS "candidateId", linked_event.id::text AS "eventId"
    FROM content.current_affairs_ingestion_candidates candidate
    LEFT JOIN LATERAL (
      SELECT event.id, event.status, event.updated_at
      FROM content.current_affairs_event_candidates link
      JOIN content.current_affairs_events event ON event.id=link.event_id
      WHERE link.candidate_id=candidate.id
      ORDER BY CASE event.status
        WHEN 'verified' THEN 0
        WHEN 'review' THEN 1
        WHEN 'candidate' THEN 2
        WHEN 'rejected' THEN 3
        ELSE 4
      END,
      event.updated_at DESC
      LIMIT 1
    ) linked_event ON true
    WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${contentDate}
    ORDER BY candidate.id
  `;
  return {
    selectedHeadlineCount: rows.length,
    resolvedSelectedHeadlineCount: rows.filter((row) => Boolean(row.eventId)).length,
    liveSelectedEventIds: normalizeIds(rows.map((row) => row.eventId ? String(row.eventId) : "")),
  };
}

export async function loadDailyMasterPackApprovalCandidate(
  contentDate: string,
  client: typeof sqlClient = sqlClient,
): Promise<SelectedDailyMasterPackApprovalCandidate> {
  const legacy = await loadLegacyDailyMasterPackApprovalCandidate(contentDate, client);
  const storedSelectedIds = selectedApprovalMembershipIds(legacy);
  if (!storedSelectedIds || storedSelectedIds.length === 0) {
    return { ...legacy, selectedApprovalCensus: null };
  }

  const selection = await loadCurrentSelectedHeadlineResolution(contentDate, client);
  const selectedApprovalCensus = evaluateSelectedApprovalCensus({
    broadCensus: legacy.census ? {
      status: legacy.census.status,
      coverageConfidenceScore: legacy.census.coverageConfidenceScore,
      blockers: legacy.census.blockers,
      warnings: legacy.census.warnings,
    } : null,
    selectedHeadlineCount: selection.selectedHeadlineCount,
    resolvedSelectedHeadlineCount: selection.resolvedSelectedHeadlineCount,
    liveSelectedEventIds: selection.liveSelectedEventIds,
    storedPackEventIds: storedSelectedIds,
  });

  const english = legacy.packs.find((pack) => pack.language === "en");
  const editorialQuality = evaluateDailyMasterPackEditorialQuality(
    english ? payloadEditorialEventsForSelectedApproval(english.payload) : [],
  );
  const eventStateRows = selection.liveSelectedEventIds.length === 0 ? [] : await client`
    SELECT event.id::text AS id, event.status,
      event.learner_authoring_status AS "authoringStatus",
      event.learner_authoring_version_id::text AS "authoringVersionId",
      EXISTS (
        SELECT 1 FROM content.current_affairs_localizations localization
        WHERE localization.event_id=event.id
          AND localization.authoring_version_id=event.learner_authoring_version_id
          AND localization.language_code='hi'
          AND localization.status IN ('ready','manual')
      ) AS "hindiReady",
      EXISTS (
        SELECT 1 FROM content.current_affairs_localizations localization
        WHERE localization.event_id=event.id
          AND localization.authoring_version_id=event.learner_authoring_version_id
          AND localization.language_code='pa'
          AND localization.status IN ('ready','manual')
      ) AS "punjabiReady",
      EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      ) AS "hasOpenConflict"
    FROM content.current_affairs_events event
    WHERE event.id=ANY(${selection.liveSelectedEventIds}::uuid[])
    ORDER BY event.id
  `;

  const readiness = evaluateDailyMasterPackApprovalReadiness({
    packs: legacy.packs.map((pack) => ({
      language: pack.language,
      payloadLanguage: String(pack.payload.language ?? ""),
      status: pack.status,
      resourceStatus: pack.learningResourceStatus,
      declaredEventCount: pack.eventCount,
      declaredCategoryCount: pack.categoryCount,
      payloadEventIds: pack.payloadEventIds,
      payloadCategoryCount: pack.payloadCategoryCount,
      renderTargets: pack.renderTargets,
    })),
    currentEligibleEventIds: selection.liveSelectedEventIds,
    verifiedEventCount: eventStateRows.filter((row) => String(row.status) === "verified").length,
    currentAuthoringCount: eventStateRows.filter((row) =>
      ["ready", "manual"].includes(String(row.authoringStatus)) && Boolean(row.authoringVersionId)).length,
    currentHindiLocalizationCount: eventStateRows.filter((row) => Boolean(row.hindiReady)).length,
    currentPunjabiLocalizationCount: eventStateRows.filter((row) => Boolean(row.punjabiReady)).length,
    openConflictCount: eventStateRows.filter((row) => Boolean(row.hasOpenConflict)).length,
    censusStatus: selectedApprovalCensus.status,
    censusBlockerCount: selectedApprovalCensus.blockers.length,
    editorialQuality,
  });

  for (const blocker of selectedApprovalCensus.blockers) {
    if (!readiness.blockers.includes(blocker)) readiness.blockers.push(blocker);
  }
  for (const warning of selectedApprovalCensus.warnings) {
    if (!readiness.warnings.includes(warning)) readiness.warnings.push(warning);
  }
  readiness.ready = readiness.blockers.length === 0;

  const sourceFingerprint = sha256({
    boundaryVersion: SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION,
    selectedApprovalCensusVersion: SELECTED_APPROVAL_CENSUS_VERSION,
    contentDate,
    packs: legacy.packs.map((pack) => ({
      id: pack.id,
      language: pack.language,
      status: pack.status,
      learningResourceId: pack.learningResourceId,
      learningResourceStatus: pack.learningResourceStatus,
      payloadSha256: pack.payloadSha256,
      renderTargets: [...pack.renderTargets].sort(),
    })).sort((a, b) => a.language.localeCompare(b.language)),
    selectedEventIds: selection.liveSelectedEventIds,
    selectedApprovalCensus,
    eventStates: eventStateRows.map((row) => ({
      id: String(row.id),
      status: String(row.status),
      authoringStatus: String(row.authoringStatus),
      authoringVersionId: row.authoringVersionId ? String(row.authoringVersionId) : null,
      hindiReady: Boolean(row.hindiReady),
      punjabiReady: Boolean(row.punjabiReady),
      hasOpenConflict: Boolean(row.hasOpenConflict),
    })),
    broadCensus: legacy.census ? {
      id: legacy.census.id,
      status: legacy.census.status,
      coverageConfidenceScore: legacy.census.coverageConfidenceScore,
      blockers: legacy.census.blockers,
      warnings: legacy.census.warnings,
    } : null,
    editorialQuality: {
      ready: editorialQuality.ready,
      issues: editorialQuality.issues,
    },
  });

  return {
    ...legacy,
    currentEligibleEventIds: selection.liveSelectedEventIds,
    editorialQuality,
    readiness,
    sourceFingerprint,
    selectedApprovalCensus,
  };
}

async function nextApprovalVersion(contentDate: string, client: typeof sqlClient) {
  const rows = await client`
    SELECT COALESCE(MAX(approval_version), 0)::int + 1 AS version
    FROM content.current_affairs_daily_master_pack_approvals
    WHERE content_date=${contentDate}::date
  `;
  return Number(rows[0]?.version ?? 1);
}

export async function approveDailyMasterPackSet(args: {
  contentDate: string;
  actorUserId: string;
  reason: string;
}) {
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Canonical Daily Master Pack approval requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.master-pack-approval:${args.contentDate}`}))`;
    const candidate = await loadDailyMasterPackApprovalCandidate(args.contentDate, tx as typeof sqlClient);
    if (candidate.activeApproval) throw new Error("This date already has an active canonical Daily Master Pack approval");
    if (!candidate.readiness.ready) {
      throw new Error(`Canonical Daily Master Pack approval is blocked: ${candidate.readiness.blockers.join("; ")}`);
    }
    if (candidate.packs.length !== 3) throw new Error("Canonical Daily Master Pack approval requires exactly three language packs");
    if (!candidate.selectedApprovalCensus || candidate.selectedApprovalCensus.status !== "complete") {
      throw new Error("Canonical Daily Master Pack approval requires a complete selection-aware approval census");
    }

    const version = await nextApprovalVersion(args.contentDate, tx as typeof sqlClient);
    const approvalId = randomUUID();
    const publicCode = approvalCode(args.contentDate, version);
    await tx`
      INSERT INTO content.current_affairs_daily_master_pack_approvals (
        id, public_code, content_date, approval_version, status,
        source_fingerprint, readiness_snapshot, approval_reason,
        approved_by, approved_at, created_at, updated_at
      ) VALUES (
        ${approvalId}::uuid, ${publicCode}, ${args.contentDate}::date, ${version}, 'approved',
        ${candidate.sourceFingerprint}, ${JSON.stringify(candidate.readiness)}::jsonb, ${reason},
        ${args.actorUserId}::uuid, now(), now(), now()
      )
    `;

    for (const pack of candidate.packs) {
      await tx`
        INSERT INTO content.current_affairs_daily_master_pack_approval_packs (
          approval_id, master_pack_id, learning_resource_id, language_code,
          payload_sha256, created_at
        ) VALUES (
          ${approvalId}::uuid, ${pack.id}::uuid, ${pack.learningResourceId}::uuid,
          ${pack.language}, ${pack.payloadSha256}, now()
        )
      `;
    }

    const packIds = candidate.packs.map((pack) => pack.id);
    const locked = await tx`
      UPDATE content.current_affairs_daily_master_packs
      SET status='approved', updated_at=now()
      WHERE id=ANY(${packIds}::uuid[]) AND status IN ('draft','review')
      RETURNING id::text AS id
    `;
    if (locked.length !== 3) throw new Error("Canonical Daily Master Pack approval could not atomically lock all three language packs");

    const resourceIds = candidate.packs.map((pack) => pack.learningResourceId);
    const visibleResources = await tx`
      SELECT id::text AS id FROM content.learning_resources
      WHERE id=ANY(${resourceIds}::uuid[]) AND status <> 'draft'
    `;
    if (visibleResources.length > 0) {
      throw new Error("Canonical Daily Master Pack approval must not publish or mutate learner-resource visibility");
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.master_pack.approved', 'current_affairs_master_pack_approval', ${approvalId}::uuid,
        ${reason}, ${`Approved canonical Daily Master Pack set ${publicCode}`},
        ${JSON.stringify({
          contentDate: args.contentDate,
          approvalVersion: version,
          approvalBoundaryVersion: SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION,
          selectedApprovalCensusVersion: SELECTED_APPROVAL_CENSUS_VERSION,
          selectedApprovalCensus: candidate.selectedApprovalCensus,
          sourceFingerprint: candidate.sourceFingerprint,
          masterPackIds: packIds,
          resourceIds,
          languageCodes: candidate.packs.map((pack) => pack.language),
          selectedCanonicalMembership: true,
          broadDiscoveryMonitoringPreserved: true,
          learnerPublicationAuthorized: false,
          learningResourcesRemainDraft: true,
          canonicalQuestionPromotion: false,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_master_pack_approval', ${approvalId}::uuid,
        'current_affairs.master_pack.approved',
        ${JSON.stringify({
          approvalId,
          publicCode,
          contentDate: args.contentDate,
          masterPackIds: packIds,
          resourceIds,
          approvalBoundaryVersion: SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION,
          selectedApprovalCensusVersion: SELECTED_APPROVAL_CENSUS_VERSION,
          learnerPublicationAuthorized: false,
        })}::jsonb
      )
    `;

    return {
      id: approvalId,
      publicCode,
      contentDate: args.contentDate,
      approvalVersion: version,
      status: "approved" as const,
      sourceFingerprint: candidate.sourceFingerprint,
      masterPackIds: packIds,
      resourceIds,
      readiness: candidate.readiness,
      approvalBoundaryVersion: SELECTED_MASTER_PACK_APPROVAL_BOUNDARY_VERSION,
      selectedApprovalCensusVersion: SELECTED_APPROVAL_CENSUS_VERSION,
      learnerPublicationAuthorized: false as const,
      learningResourcesRemainDraft: true as const,
    };
  });
}
