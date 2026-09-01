import { createHash, randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  evaluateDailyMasterPackApprovalReadiness,
  type DailyMasterPackApprovalLanguage,
  type DailyMasterPackApprovalReadiness,
} from "./daily-master-pack-approval-policy";

export type DailyMasterPackApprovalSnapshot = {
  id: string;
  publicCode: string;
  contentDate: string;
  approvalVersion: number;
  status: "approved" | "revoked";
  sourceFingerprint: string;
  readinessSnapshot: unknown;
  approvalReason: string;
  approvedBy: string;
  approvedAt: string;
  revokedBy: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
};

export type DailyMasterPackApprovalPackSnapshot = {
  id: string;
  publicCode: string;
  language: DailyMasterPackApprovalLanguage;
  status: string;
  learningResourceId: string;
  learningResourceStatus: string;
  eventCount: number;
  categoryCount: number;
  renderTargets: string[];
  payload: Record<string, unknown>;
  payloadEventIds: string[];
  payloadCategoryCount: number;
  payloadSha256: string;
  generatedAt: string;
};

export type DailyMasterPackApprovalCandidate = {
  contentDate: string;
  packs: DailyMasterPackApprovalPackSnapshot[];
  currentEligibleEventIds: string[];
  census: null | {
    id: string;
    status: string;
    coverageConfidenceScore: number;
    blockers: string[];
    warnings: string[];
    generatedAt: string;
  };
  readiness: DailyMasterPackApprovalReadiness;
  sourceFingerprint: string;
  activeApproval: DailyMasterPackApprovalSnapshot | null;
  latestApproval: DailyMasterPackApprovalSnapshot | null;
  learnerPublicationAuthorized: false;
};

function sha256(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function parseArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function parseStringArray(value: unknown): string[] {
  return parseArray<unknown>(value).map(String).map((item) => item.trim()).filter(Boolean);
}

function normalizeIds(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asLanguage(value: unknown): DailyMasterPackApprovalLanguage | null {
  const language = String(value ?? "").toLowerCase();
  return language === "en" || language === "hi" || language === "pa" ? language : null;
}

function payloadEventIds(payload: Record<string, unknown>) {
  const ids: string[] = [];
  for (const sectionValue of parseArray<unknown>(payload.sections)) {
    const section = asObject(sectionValue);
    for (const eventValue of parseArray<unknown>(section.events)) {
      const event = asObject(eventValue);
      const id = String(event.id ?? "").trim();
      if (id) ids.push(id);
    }
  }
  return ids;
}

function payloadCategoryCount(payload: Record<string, unknown>) {
  return parseArray<unknown>(payload.sections).length;
}

function approvalCode(contentDate: string, version: number) {
  return `CA-MPA-D-${contentDate.replaceAll("-", "")}-V${version}`;
}

async function loadApprovalRows(
  contentDate: string,
  client: typeof sqlClient = sqlClient,
): Promise<DailyMasterPackApprovalSnapshot[]> {
  const rows = await client`
    SELECT id::text AS id, public_code AS "publicCode", content_date::text AS "contentDate",
      approval_version::int AS "approvalVersion", status,
      source_fingerprint AS "sourceFingerprint", readiness_snapshot AS "readinessSnapshot",
      approval_reason AS "approvalReason", approved_by::text AS "approvedBy",
      approved_at::text AS "approvedAt", revoked_by::text AS "revokedBy",
      revoked_at::text AS "revokedAt", revocation_reason AS "revocationReason"
    FROM content.current_affairs_daily_master_pack_approvals
    WHERE content_date=${contentDate}::date
    ORDER BY approval_version DESC
  `;
  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    contentDate: String(row.contentDate).slice(0, 10),
    approvalVersion: Number(row.approvalVersion),
    status: String(row.status) as "approved" | "revoked",
    sourceFingerprint: String(row.sourceFingerprint),
    readinessSnapshot: row.readinessSnapshot,
    approvalReason: String(row.approvalReason),
    approvedBy: String(row.approvedBy),
    approvedAt: String(row.approvedAt),
    revokedBy: row.revokedBy ? String(row.revokedBy) : null,
    revokedAt: row.revokedAt ? String(row.revokedAt) : null,
    revocationReason: row.revocationReason ? String(row.revocationReason) : null,
  }));
}

async function nextApprovalVersion(contentDate: string, client: typeof sqlClient) {
  const rows = await client`
    SELECT COALESCE(MAX(approval_version), 0)::int + 1 AS version
    FROM content.current_affairs_daily_master_pack_approvals
    WHERE content_date=${contentDate}::date
  `;
  return Number(rows[0]?.version ?? 1);
}

export async function loadDailyMasterPackApprovalCandidate(
  contentDate: string,
  client: typeof sqlClient = sqlClient,
): Promise<DailyMasterPackApprovalCandidate> {
  const [packRows, censusRows, currentEligibleRows, approvals] = await Promise.all([
    client`
      SELECT pack.id::text AS id, pack.public_code AS "publicCode",
        pack.language_code AS language, pack.status,
        pack.learning_resource_id::text AS "learningResourceId",
        resource.status AS "learningResourceStatus",
        pack.event_count::int AS "eventCount", pack.category_count::int AS "categoryCount",
        pack.render_targets AS "renderTargets", pack.payload,
        pack.generated_at::text AS "generatedAt"
      FROM content.current_affairs_daily_master_packs pack
      JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
      WHERE pack.content_date=${contentDate}::date
        AND pack.language_code IN ('en','hi','pa')
      ORDER BY pack.language_code
    `,
    client`
      SELECT id::text AS id, status, coverage_confidence_score::int AS "coverageConfidenceScore",
        blockers, warnings, generated_at::text AS "generatedAt"
      FROM content.current_affairs_daily_discovery_census
      WHERE target_date=${contentDate}::date
      LIMIT 1
    `,
    client`
      SELECT event.id::text AS id
      FROM content.current_affairs_events event
      WHERE event.event_date=${contentDate}::date
        AND event.status='verified'
        AND event.learner_authoring_status IN ('ready','manual')
        AND EXISTS (
          SELECT 1 FROM content.current_affairs_exam_scores score
          WHERE score.event_id=event.id AND score.include_recommended=true
        )
        AND NOT EXISTS (
          SELECT 1 FROM content.current_affairs_fact_conflicts conflict
          WHERE conflict.event_id=event.id AND conflict.status='open'
        )
      ORDER BY event.id
    `,
    loadApprovalRows(contentDate, client),
  ]);

  const packs: DailyMasterPackApprovalPackSnapshot[] = packRows.flatMap((row) => {
    const language = asLanguage(row.language);
    if (!language) return [];
    const payload = asObject(row.payload);
    return [{
      id: String(row.id),
      publicCode: String(row.publicCode),
      language,
      status: String(row.status),
      learningResourceId: String(row.learningResourceId),
      learningResourceStatus: String(row.learningResourceStatus),
      eventCount: Number(row.eventCount ?? 0),
      categoryCount: Number(row.categoryCount ?? 0),
      renderTargets: parseStringArray(row.renderTargets),
      payload,
      payloadEventIds: payloadEventIds(payload),
      payloadCategoryCount: payloadCategoryCount(payload),
      payloadSha256: sha256(payload),
      generatedAt: String(row.generatedAt),
    }];
  });

  const englishPack = packs.find((pack) => pack.language === "en");
  const englishEventIds = normalizeIds(englishPack?.payloadEventIds ?? []);
  const eventStateRows = englishEventIds.length === 0 ? [] : await client`
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
    WHERE event.id = ANY(${englishEventIds}::uuid[])
    ORDER BY event.id
  `;

  const censusRow = censusRows[0];
  const census = censusRow ? {
    id: String(censusRow.id),
    status: String(censusRow.status),
    coverageConfidenceScore: Number(censusRow.coverageConfidenceScore ?? 0),
    blockers: parseStringArray(censusRow.blockers),
    warnings: parseStringArray(censusRow.warnings),
    generatedAt: String(censusRow.generatedAt),
  } : null;

  const readiness = evaluateDailyMasterPackApprovalReadiness({
    packs: packs.map((pack) => ({
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
    currentEligibleEventIds: currentEligibleRows.map((row) => String(row.id)),
    verifiedEventCount: eventStateRows.filter((row) => String(row.status) === "verified").length,
    currentAuthoringCount: eventStateRows.filter((row) =>
      ["ready", "manual"].includes(String(row.authoringStatus)) && Boolean(row.authoringVersionId)).length,
    currentHindiLocalizationCount: eventStateRows.filter((row) => Boolean(row.hindiReady)).length,
    currentPunjabiLocalizationCount: eventStateRows.filter((row) => Boolean(row.punjabiReady)).length,
    openConflictCount: eventStateRows.filter((row) => Boolean(row.hasOpenConflict)).length,
    censusStatus: census?.status ?? null,
    censusBlockerCount: census?.blockers.length ?? 1,
  });

  if (!census) {
    readiness.blockers.push("The target-date discovery census has not been materialized");
    readiness.ready = false;
    readiness.checks.censusNotBlocked = false;
  }

  const fingerprintInput = {
    contentDate,
    packs: packs.map((pack) => ({
      id: pack.id,
      language: pack.language,
      status: pack.status,
      learningResourceId: pack.learningResourceId,
      learningResourceStatus: pack.learningResourceStatus,
      payloadSha256: pack.payloadSha256,
      renderTargets: [...pack.renderTargets].sort(),
    })).sort((a, b) => a.language.localeCompare(b.language)),
    currentEligibleEventIds: normalizeIds(currentEligibleRows.map((row) => String(row.id))),
    eventStates: eventStateRows.map((row) => ({
      id: String(row.id),
      status: String(row.status),
      authoringStatus: String(row.authoringStatus),
      authoringVersionId: row.authoringVersionId ? String(row.authoringVersionId) : null,
      hindiReady: Boolean(row.hindiReady),
      punjabiReady: Boolean(row.punjabiReady),
      hasOpenConflict: Boolean(row.hasOpenConflict),
    })),
    census: census ? {
      id: census.id,
      status: census.status,
      coverageConfidenceScore: census.coverageConfidenceScore,
      blockers: census.blockers,
    } : null,
  };

  return {
    contentDate,
    packs,
    currentEligibleEventIds: normalizeIds(currentEligibleRows.map((row) => String(row.id))),
    census,
    readiness,
    sourceFingerprint: sha256(fingerprintInput),
    activeApproval: approvals.find((approval) => approval.status === "approved") ?? null,
    latestApproval: approvals[0] ?? null,
    learnerPublicationAuthorized: false,
  };
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
      WHERE id = ANY(${packIds}::uuid[])
        AND status IN ('draft','review')
      RETURNING id::text AS id
    `;
    if (locked.length !== 3) throw new Error("Canonical Daily Master Pack approval could not atomically lock all three language packs");

    const resourceIds = candidate.packs.map((pack) => pack.learningResourceId);
    const publishedResources = await tx`
      SELECT id::text AS id
      FROM content.learning_resources
      WHERE id = ANY(${resourceIds}::uuid[])
        AND status <> 'draft'
    `;
    if (publishedResources.length > 0) {
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
          sourceFingerprint: candidate.sourceFingerprint,
          masterPackIds: packIds,
          resourceIds,
          languageCodes: candidate.packs.map((pack) => pack.language),
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
      learnerPublicationAuthorized: false as const,
      learningResourcesRemainDraft: true as const,
    };
  });
}

export async function revokeDailyMasterPackApproval(args: {
  approvalId: string;
  actorUserId: string;
  reason: string;
}) {
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Canonical Daily Master Pack approval revocation requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.master-pack-approval.id:${args.approvalId}`}))`;
    const rows = await tx`
      SELECT id::text AS id, public_code AS "publicCode", content_date::text AS "contentDate", status
      FROM content.current_affairs_daily_master_pack_approvals
      WHERE id=${args.approvalId}::uuid
      LIMIT 1
    `;
    const approval = rows[0];
    if (!approval) throw new Error("Canonical Daily Master Pack approval not found");
    if (String(approval.status) !== "approved") throw new Error("Only an active canonical Daily Master Pack approval can be revoked");

    const links = await tx`
      SELECT master_pack_id::text AS "masterPackId", learning_resource_id::text AS "learningResourceId", language_code AS language
      FROM content.current_affairs_daily_master_pack_approval_packs
      WHERE approval_id=${args.approvalId}::uuid
      ORDER BY language_code
    `;
    if (links.length !== 3) throw new Error("Canonical Daily Master Pack approval snapshot is incomplete");
    const packIds = links.map((row) => String(row.masterPackId));
    const resourceIds = links.map((row) => String(row.learningResourceId));

    const publishedResources = await tx`
      SELECT id::text AS id FROM content.learning_resources
      WHERE id = ANY(${resourceIds}::uuid[]) AND status='published'
    `;
    if (publishedResources.length > 0) {
      throw new Error("Cannot revoke canonical master-pack approval after learner publication; a dedicated publication withdrawal flow is required");
    }

    await tx`
      UPDATE content.current_affairs_daily_master_pack_approvals
      SET status='revoked', revoked_by=${args.actorUserId}::uuid, revoked_at=now(),
          revocation_reason=${reason}, updated_at=now()
      WHERE id=${args.approvalId}::uuid AND status='approved'
    `;

    const reopened = await tx`
      UPDATE content.current_affairs_daily_master_packs
      SET status='review', updated_at=now()
      WHERE id = ANY(${packIds}::uuid[]) AND status='approved'
      RETURNING id::text AS id
    `;
    if (reopened.length !== 3) throw new Error("Canonical Daily Master Pack approval revocation could not return all three packs to review");

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.master_pack.approval_revoked', 'current_affairs_master_pack_approval', ${args.approvalId}::uuid,
        ${reason}, ${`Revoked canonical Daily Master Pack approval ${String(approval.publicCode)}`},
        ${JSON.stringify({
          contentDate: String(approval.contentDate).slice(0, 10),
          masterPackIds: packIds,
          resourceIds,
          packsReturnedToReview: true,
          learnerPublicationAuthorized: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_master_pack_approval', ${args.approvalId}::uuid,
        'current_affairs.master_pack.approval_revoked',
        ${JSON.stringify({
          approvalId: args.approvalId,
          publicCode: String(approval.publicCode),
          contentDate: String(approval.contentDate).slice(0, 10),
          masterPackIds: packIds,
          learnerPublicationAuthorized: false,
        })}::jsonb
      )
    `;

    return {
      id: args.approvalId,
      publicCode: String(approval.publicCode),
      contentDate: String(approval.contentDate).slice(0, 10),
      status: "revoked" as const,
      masterPackIds: packIds,
      resourceIds,
      packsReturnedToReview: true as const,
      learnerPublicationAuthorized: false as const,
    };
  });
}

export async function listDailyMasterPackApprovalHistory(contentDate: string, limit = 20) {
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  const rows = await sqlClient`
    SELECT approval.id::text AS id, approval.public_code AS "publicCode",
      approval.content_date::text AS "contentDate", approval.approval_version::int AS "approvalVersion",
      approval.status, approval.source_fingerprint AS "sourceFingerprint",
      approval.readiness_snapshot AS "readinessSnapshot", approval.approval_reason AS "approvalReason",
      approval.approved_by::text AS "approvedBy", approval.approved_at::text AS "approvedAt",
      approval.revoked_by::text AS "revokedBy", approval.revoked_at::text AS "revokedAt",
      approval.revocation_reason AS "revocationReason",
      COALESCE((
        SELECT json_agg(json_build_object(
          'language', link.language_code,
          'masterPackId', link.master_pack_id::text,
          'learningResourceId', link.learning_resource_id::text,
          'payloadSha256', link.payload_sha256
        ) ORDER BY link.language_code)
        FROM content.current_affairs_daily_master_pack_approval_packs link
        WHERE link.approval_id=approval.id
      ), '[]'::json) AS packs
    FROM content.current_affairs_daily_master_pack_approvals approval
    WHERE approval.content_date=${contentDate}::date
    ORDER BY approval.approval_version DESC
    LIMIT ${safeLimit}
  `;
  return rows;
}
