import { createHash, randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  evaluateCurrentAffairsReleaseReadiness,
  type CurrentAffairsReleaseReadiness,
  type ReleaseCompilationManifest,
  type ReleaseLanguageCode,
} from "./release-policy";

export type CurrentAffairsReleaseKey = {
  periodType: "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  examFamily: "ssc" | "banking" | "punjab" | "railways" | "general";
};

type CompilationSnapshot = {
  id: string;
  publicCode: string;
  languageCode: ReleaseLanguageCode;
  status: string;
  eventCount: number;
  learningResourceId: string;
  learningResourceStatus: string;
  questionRunId: string | null;
  eventIds: string[];
  eventManifestHash: string;
};

type ReleaseQuestionSnapshot = {
  generationItemId: string;
  itemStatus: string;
  acceptedQuestionId: string | null;
  sourceGenerationVersionId: string;
  hindiLocalizationId: string | null;
  hindiLocalizationStatus: string | null;
  punjabiLocalizationId: string | null;
  punjabiLocalizationStatus: string | null;
};

export type CurrentAffairsReleaseCandidate = {
  key: CurrentAffairsReleaseKey;
  compilations: CompilationSnapshot[];
  questions: ReleaseQuestionSnapshot[];
  readiness: CurrentAffairsReleaseReadiness;
  sourceFingerprint: string;
  latestRelease: null | {
    id: string;
    publicCode: string;
    releaseVersion: number;
    status: string;
    approvedAt: string;
    revokedAt: string | null;
  };
};

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function releaseToken(periodType: CurrentAffairsReleaseKey["periodType"]): "D" | "W" | "M" {
  if (periodType === "daily") return "D";
  if (periodType === "weekly") return "W";
  return "M";
}

function releaseCode(key: CurrentAffairsReleaseKey, version: number): string {
  return `CA-RLS-${releaseToken(key.periodType)}-${key.periodEnd.replaceAll("-", "")}-${key.examFamily.toUpperCase()}-V${version}`;
}

function candidateIdentity(key: CurrentAffairsReleaseKey): string {
  return `${key.periodType}:${key.periodStart}:${key.periodEnd}:${key.examFamily}`;
}

function asLanguage(value: unknown): ReleaseLanguageCode | null {
  const code = String(value ?? "").toLowerCase();
  return code === "en" || code === "hi" || code === "pa" ? code : null;
}

function questionReadyStatus(value: string | null): boolean {
  return value === "ready" || value === "manual";
}

async function latestRelease(
  key: CurrentAffairsReleaseKey,
  client: typeof sqlClient = sqlClient,
) {
  const rows = await client`
    SELECT id::text AS id, public_code AS "publicCode", release_version AS "releaseVersion",
           status, approved_at::text AS "approvedAt", revoked_at::text AS "revokedAt"
    FROM content.current_affairs_releases
    WHERE period_type=${key.periodType}
      AND period_start=${key.periodStart}::date
      AND period_end=${key.periodEnd}::date
      AND exam_family_key=${key.examFamily}
    ORDER BY release_version DESC
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    publicCode: String(row.publicCode),
    releaseVersion: Number(row.releaseVersion),
    status: String(row.status),
    approvedAt: String(row.approvedAt),
    revokedAt: row.revokedAt ? String(row.revokedAt) : null,
  };
}

export async function loadCurrentAffairsReleaseCandidate(
  key: CurrentAffairsReleaseKey,
  client: typeof sqlClient = sqlClient,
): Promise<CurrentAffairsReleaseCandidate> {
  const compilationRows = await client`
    SELECT
      compilation.id::text AS id,
      compilation.public_code AS "publicCode",
      compilation.language_code AS "languageCode",
      compilation.status,
      compilation.event_count::int AS "eventCount",
      compilation.learning_resource_id::text AS "learningResourceId",
      compilation.question_run_id::text AS "questionRunId",
      resource.status AS "learningResourceStatus"
    FROM content.current_affairs_compilations compilation
    JOIN content.learning_resources resource ON resource.id=compilation.learning_resource_id
    WHERE compilation.period_type=${key.periodType}
      AND compilation.period_start=${key.periodStart}::date
      AND compilation.period_end=${key.periodEnd}::date
      AND compilation.exam_family_key=${key.examFamily}
      AND compilation.language_code IN ('en','hi','pa')
    ORDER BY compilation.language_code
  `;

  const compilationIds = compilationRows.map((row) => String(row.id));
  const membershipRows = compilationIds.length === 0 ? [] : await client`
    SELECT compilation_id::text AS "compilationId", event_id::text AS "eventId"
    FROM content.current_affairs_compilation_events
    WHERE compilation_id = ANY(${compilationIds}::uuid[])
    ORDER BY compilation_id, sort_order
  `;
  const eventIdsByCompilation = new Map<string, string[]>();
  for (const row of membershipRows) {
    const id = String(row.compilationId);
    const list = eventIdsByCompilation.get(id) ?? [];
    list.push(String(row.eventId));
    eventIdsByCompilation.set(id, list);
  }

  const compilations: CompilationSnapshot[] = compilationRows.flatMap((row) => {
    const languageCode = asLanguage(row.languageCode);
    if (!languageCode || !row.learningResourceId) return [];
    const eventIds = sortedUnique(eventIdsByCompilation.get(String(row.id)) ?? []);
    return [{
      id: String(row.id),
      publicCode: String(row.publicCode),
      languageCode,
      status: String(row.status),
      eventCount: Number(row.eventCount ?? 0),
      learningResourceId: String(row.learningResourceId),
      learningResourceStatus: String(row.learningResourceStatus),
      questionRunId: row.questionRunId ? String(row.questionRunId) : null,
      eventIds,
      eventManifestHash: sha256(eventIds),
    }];
  });

  const english = compilations.find((item) => item.languageCode === "en");
  const englishEventIds = english?.eventIds ?? [];
  const eventStateRows = englishEventIds.length === 0 ? [] : await client`
    SELECT
      event.id::text AS id,
      event.status,
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
  `;

  const threadRows = englishEventIds.length === 0 ? [] : await client`
    SELECT membership.thread_id::text AS "threadId", count(*)::int AS count
    FROM content.current_affairs_story_thread_events membership
    WHERE membership.event_id = ANY(${englishEventIds}::uuid[])
    GROUP BY membership.thread_id
    HAVING count(*) > 1
  `;

  const englishQuestionRunId = english?.questionRunId ?? null;
  const questionRows = englishQuestionRunId ? await client`
    SELECT
      item.id::text AS "generationItemId",
      item.status AS "itemStatus",
      item.accepted_question_id::text AS "acceptedQuestionId",
      version.id::text AS "sourceGenerationVersionId",
      hi.id::text AS "hindiLocalizationId",
      hi.status AS "hindiLocalizationStatus",
      pa.id::text AS "punjabiLocalizationId",
      pa.status AS "punjabiLocalizationStatus"
    FROM content.generation_run_items item
    JOIN content.generation_item_versions version
      ON version.generation_item_id=item.id
      AND version.version_number=item.current_version_number
    LEFT JOIN content.current_affairs_question_localizations hi
      ON hi.source_generation_version_id=version.id
      AND hi.language_code='hi'
    LEFT JOIN content.current_affairs_question_localizations pa
      ON pa.source_generation_version_id=version.id
      AND pa.language_code='pa'
    WHERE item.generation_run_id=${englishQuestionRunId}::uuid
    ORDER BY item.item_number
  ` : [];

  const questions: ReleaseQuestionSnapshot[] = questionRows.map((row) => ({
    generationItemId: String(row.generationItemId),
    itemStatus: String(row.itemStatus),
    acceptedQuestionId: row.acceptedQuestionId ? String(row.acceptedQuestionId) : null,
    sourceGenerationVersionId: String(row.sourceGenerationVersionId),
    hindiLocalizationId: row.hindiLocalizationId ? String(row.hindiLocalizationId) : null,
    hindiLocalizationStatus: row.hindiLocalizationStatus ? String(row.hindiLocalizationStatus) : null,
    punjabiLocalizationId: row.punjabiLocalizationId ? String(row.punjabiLocalizationId) : null,
    punjabiLocalizationStatus: row.punjabiLocalizationStatus ? String(row.punjabiLocalizationStatus) : null,
  }));

  const approvedItems = questions.filter((item) =>
    item.itemStatus === "approved" || Boolean(item.acceptedQuestionId)).length;
  const hindiReadyItems = questions.filter((item) =>
    item.hindiLocalizationId && questionReadyStatus(item.hindiLocalizationStatus)).length;
  const punjabiReadyItems = questions.filter((item) =>
    item.punjabiLocalizationId && questionReadyStatus(item.punjabiLocalizationStatus)).length;

  const compilationManifests: ReleaseCompilationManifest[] = compilations.map((item) => ({
    languageCode: item.languageCode,
    status: item.status,
    eventIds: item.eventIds,
  }));
  const expectedEventCount = englishEventIds.length;
  const readiness = evaluateCurrentAffairsReleaseReadiness({
    compilations: compilationManifests,
    verifiedEventCount: eventStateRows.filter((row) => String(row.status) === "verified").length,
    expectedEventCount,
    currentAuthoringCount: eventStateRows.filter((row) =>
      (String(row.authoringStatus) === "ready" || String(row.authoringStatus) === "manual")
      && Boolean(row.authoringVersionId)).length,
    currentHindiLocalizationCount: eventStateRows.filter((row) => Boolean(row.hindiReady)).length,
    currentPunjabiLocalizationCount: eventStateRows.filter((row) => Boolean(row.punjabiReady)).length,
    openConflictCount: eventStateRows.filter((row) => Boolean(row.hasOpenConflict)).length,
    duplicateStoryThreadCount: threadRows.length,
    questions: {
      required: expectedEventCount >= 5,
      runPresent: Boolean(englishQuestionRunId),
      totalItems: questions.length,
      approvedItems,
      hindiReadyItems,
      punjabiReadyItems,
    },
  });

  const fingerprintInput = {
    key,
    compilations: compilations
      .map((item) => ({
        id: item.id,
        languageCode: item.languageCode,
        status: item.status,
        learningResourceId: item.learningResourceId,
        learningResourceStatus: item.learningResourceStatus,
        eventIds: item.eventIds,
      }))
      .sort((a, b) => a.languageCode.localeCompare(b.languageCode)),
    events: eventStateRows
      .map((row) => ({
        id: String(row.id),
        status: String(row.status),
        authoringStatus: String(row.authoringStatus),
        authoringVersionId: row.authoringVersionId ? String(row.authoringVersionId) : null,
        hindiReady: Boolean(row.hindiReady),
        punjabiReady: Boolean(row.punjabiReady),
        hasOpenConflict: Boolean(row.hasOpenConflict),
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    questions: questions.map((item) => ({
      generationItemId: item.generationItemId,
      itemStatus: item.itemStatus,
      acceptedQuestionId: item.acceptedQuestionId,
      sourceGenerationVersionId: item.sourceGenerationVersionId,
      hindiLocalizationId: item.hindiLocalizationId,
      hindiLocalizationStatus: item.hindiLocalizationStatus,
      punjabiLocalizationId: item.punjabiLocalizationId,
      punjabiLocalizationStatus: item.punjabiLocalizationStatus,
    })),
  };

  return {
    key,
    compilations,
    questions,
    readiness,
    sourceFingerprint: sha256(fingerprintInput),
    latestRelease: await latestRelease(key, client),
  };
}

export async function loadCurrentAffairsReleaseQueue(limit = 100) {
  const safeLimit = Math.max(1, Math.min(300, Math.floor(limit)));
  const rows = await sqlClient`
    SELECT period_type AS "periodType", period_start::text AS "periodStart",
           period_end::text AS "periodEnd", exam_family_key AS "examFamily"
    FROM content.current_affairs_compilations
    WHERE language_code='en' AND status='draft'
      AND exam_family_key IN ('ssc','banking','punjab')
    ORDER BY period_end DESC,
      CASE period_type WHEN 'daily' THEN 0 WHEN 'weekly' THEN 1 ELSE 2 END,
      exam_family_key
    LIMIT ${safeLimit}
  `;
  const results: CurrentAffairsReleaseCandidate[] = [];
  for (const row of rows) {
    results.push(await loadCurrentAffairsReleaseCandidate({
      periodType: String(row.periodType) as CurrentAffairsReleaseKey["periodType"],
      periodStart: String(row.periodStart).slice(0, 10),
      periodEnd: String(row.periodEnd).slice(0, 10),
      examFamily: String(row.examFamily) as CurrentAffairsReleaseKey["examFamily"],
    }));
  }
  return results;
}

async function nextReleaseVersion(key: CurrentAffairsReleaseKey, client: typeof sqlClient) {
  const rows = await client`
    SELECT COALESCE(MAX(release_version), 0)::int + 1 AS version
    FROM content.current_affairs_releases
    WHERE period_type=${key.periodType}
      AND period_start=${key.periodStart}::date
      AND period_end=${key.periodEnd}::date
      AND exam_family_key=${key.examFamily}
  `;
  return Number(rows[0]?.version ?? 1);
}

export async function approveCurrentAffairsRelease(args: {
  key: CurrentAffairsReleaseKey;
  actorUserId: string;
  reason: string;
}) {
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Current Affairs release approval requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.release:${candidateIdentity(args.key)}`}))`;
    const active = await tx`
      SELECT id FROM content.current_affairs_releases
      WHERE period_type=${args.key.periodType}
        AND period_start=${args.key.periodStart}::date
        AND period_end=${args.key.periodEnd}::date
        AND exam_family_key=${args.key.examFamily}
        AND status='approved'
      LIMIT 1
    `;
    if (active[0]) throw new Error("This Current Affairs package already has an active approved release");

    const candidate = await loadCurrentAffairsReleaseCandidate(args.key, tx as typeof sqlClient);
    if (!candidate.readiness.ready) {
      throw new Error(`Current Affairs release is blocked: ${candidate.readiness.blockers.join("; ")}`);
    }
    const version = await nextReleaseVersion(args.key, tx as typeof sqlClient);
    const releaseId = randomUUID();
    const publicCode = releaseCode(args.key, version);
    const compilationIds = candidate.compilations.map((item) => item.id);
    const resourceIds = candidate.compilations.map((item) => item.learningResourceId);

    await tx`
      INSERT INTO content.current_affairs_releases (
        id, public_code, period_type, period_start, period_end, exam_family_key,
        release_version, status, source_fingerprint, readiness_snapshot,
        approval_reason, approved_by, approved_at, created_at, updated_at
      ) VALUES (
        ${releaseId}::uuid, ${publicCode}, ${args.key.periodType}, ${args.key.periodStart}, ${args.key.periodEnd},
        ${args.key.examFamily}, ${version}, 'approved', ${candidate.sourceFingerprint},
        ${JSON.stringify(candidate.readiness)}::jsonb, ${reason}, ${args.actorUserId}::uuid,
        now(), now(), now()
      )
    `;

    for (const compilation of candidate.compilations) {
      await tx`
        INSERT INTO content.current_affairs_release_compilations (
          release_id, compilation_id, learning_resource_id, language_code,
          event_manifest_hash, created_at
        ) VALUES (
          ${releaseId}::uuid, ${compilation.id}::uuid, ${compilation.learningResourceId}::uuid,
          ${compilation.languageCode}, ${compilation.eventManifestHash}, now()
        )
      `;
    }

    for (const question of candidate.questions) {
      if (!question.hindiLocalizationId || !question.punjabiLocalizationId) {
        throw new Error("Current Affairs release question localization snapshot is incomplete");
      }
      await tx`
        INSERT INTO content.current_affairs_release_question_items (
          release_id, generation_item_id, source_generation_version_id,
          hindi_localization_id, punjabi_localization_id, created_at
        ) VALUES (
          ${releaseId}::uuid, ${question.generationItemId}::uuid,
          ${question.sourceGenerationVersionId}::uuid,
          ${question.hindiLocalizationId}::uuid, ${question.punjabiLocalizationId}::uuid, now()
        )
      `;
    }

    const publishedResources = await tx`
      UPDATE content.learning_resources
      SET status='published', published_at=now(), updated_by=${args.actorUserId}::uuid, updated_at=now()
      WHERE id = ANY(${resourceIds}::uuid[]) AND status='draft'
      RETURNING id::text AS id
    `;
    if (publishedResources.length !== 3) {
      throw new Error("Current Affairs release requires exactly three draft learning resources");
    }
    const publishedCompilations = await tx`
      UPDATE content.current_affairs_compilations
      SET status='published', updated_by=${args.actorUserId}::uuid, updated_at=now()
      WHERE id = ANY(${compilationIds}::uuid[]) AND status='draft'
      RETURNING id::text AS id
    `;
    if (publishedCompilations.length !== 3) {
      throw new Error("Current Affairs release requires exactly three draft compilation manifests");
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.release.approved', 'current_affairs_release', ${releaseId}::uuid,
        ${reason}, ${`Approved and published Current Affairs release ${publicCode}`},
        ${JSON.stringify({
          key: args.key,
          releaseVersion: version,
          sourceFingerprint: candidate.sourceFingerprint,
          compilationIds,
          resourceIds,
          questionItemCount: candidate.questions.length,
          canonicalQuestionPromotion: false,
          automaticStudentQuestionPublication: false,
        })}::jsonb
      )
    `;
    for (const resourceId of resourceIds) {
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
          'content.learning_resource.published', 'learning_resource', ${resourceId}::uuid,
          ${reason}, 'Published via approved Current Affairs editorial release',
          ${JSON.stringify({ currentAffairsReleaseId: releaseId, currentAffairsReleaseCode: publicCode })}::jsonb
        )
      `;
    }
    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_release', ${releaseId}::uuid,
        'current_affairs.release.approved',
        ${JSON.stringify({
          releaseId,
          publicCode,
          key: args.key,
          resourceIds,
          questionItemCount: candidate.questions.length,
          learnerNotesPublished: true,
          learnerQuestionsPublished: false,
        })}::jsonb
      )
    `;

    return {
      id: releaseId,
      publicCode,
      releaseVersion: version,
      status: "approved" as const,
      sourceFingerprint: candidate.sourceFingerprint,
      resourceIds,
      compilationIds,
      questionItemCount: candidate.questions.length,
      readiness: candidate.readiness,
    };
  });
}

export async function revokeCurrentAffairsRelease(args: {
  releaseId: string;
  actorUserId: string;
  reason: string;
}) {
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Current Affairs release revocation requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.release.id:${args.releaseId}`}))`;
    const rows = await tx`
      SELECT id::text AS id, public_code AS "publicCode", status
      FROM content.current_affairs_releases
      WHERE id=${args.releaseId}::uuid
      LIMIT 1
    `;
    const release = rows[0];
    if (!release) throw new Error("Current Affairs release not found");
    if (String(release.status) !== "approved") throw new Error("Only an active approved Current Affairs release can be revoked");

    const links = await tx`
      SELECT compilation_id::text AS "compilationId", learning_resource_id::text AS "learningResourceId"
      FROM content.current_affairs_release_compilations
      WHERE release_id=${args.releaseId}::uuid
      ORDER BY language_code
    `;
    const compilationIds = links.map((row) => String(row.compilationId));
    const resourceIds = links.map((row) => String(row.learningResourceId));

    await tx`
      UPDATE content.current_affairs_releases
      SET status='revoked', revoked_by=${args.actorUserId}::uuid, revoked_at=now(),
          revocation_reason=${reason}, updated_at=now()
      WHERE id=${args.releaseId}::uuid
    `;
    if (resourceIds.length) {
      await tx`
        UPDATE content.learning_resources
        SET status='archived', updated_by=${args.actorUserId}::uuid, updated_at=now()
        WHERE id = ANY(${resourceIds}::uuid[]) AND status='published'
      `;
    }
    if (compilationIds.length) {
      await tx`
        UPDATE content.current_affairs_compilations
        SET status='archived', updated_by=${args.actorUserId}::uuid, updated_at=now()
        WHERE id = ANY(${compilationIds}::uuid[]) AND status='published'
      `;
    }
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.release.revoked', 'current_affairs_release', ${args.releaseId}::uuid,
        ${reason}, ${`Revoked Current Affairs release ${String(release.publicCode)}`},
        ${JSON.stringify({ compilationIds, resourceIds, learnerQuestionsPublished: false })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_release', ${args.releaseId}::uuid,
        'current_affairs.release.revoked',
        ${JSON.stringify({
          releaseId: args.releaseId,
          publicCode: String(release.publicCode),
          resourceIds,
          compilationIds,
        })}::jsonb
      )
    `;
    return {
      id: args.releaseId,
      publicCode: String(release.publicCode),
      status: "revoked" as const,
      resourceIds,
      compilationIds,
    };
  });
}

export async function listCurrentAffairsReleaseHistory(limit = 100) {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  return sqlClient`
    SELECT
      release.id::text AS id,
      release.public_code AS "publicCode",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version AS "releaseVersion",
      release.status,
      release.source_fingerprint AS "sourceFingerprint",
      release.readiness_snapshot AS "readinessSnapshot",
      release.approval_reason AS "approvalReason",
      release.approved_by::text AS "approvedBy",
      release.approved_at AS "approvedAt",
      release.revoked_by::text AS "revokedBy",
      release.revoked_at AS "revokedAt",
      release.revocation_reason AS "revocationReason",
      COALESCE((
        SELECT json_agg(json_build_object(
          'languageCode', link.language_code,
          'compilationId', link.compilation_id::text,
          'learningResourceId', link.learning_resource_id::text,
          'eventManifestHash', link.event_manifest_hash
        ) ORDER BY link.language_code)
        FROM content.current_affairs_release_compilations link
        WHERE link.release_id=release.id
      ), '[]'::json) AS compilations,
      (SELECT count(*)::int FROM content.current_affairs_release_question_items item WHERE item.release_id=release.id) AS "questionItemCount"
    FROM content.current_affairs_releases release
    ORDER BY release.approved_at DESC, release.release_version DESC
    LIMIT ${safeLimit}
  `;
}
