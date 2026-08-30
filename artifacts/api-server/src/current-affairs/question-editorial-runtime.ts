import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  evaluateCurrentAffairsQuestionEditorialReadiness,
  type QuestionEditorialLocalizationSnapshot,
} from "./question-editorial-policy";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SqlExecutor = any;
type QuestionRow = Record<string, unknown>;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => normalizeText(item)).filter(Boolean) : [];
}

function sourceOptions(payload: Record<string, unknown>): string[] {
  return stringArray(payload.options);
}

function assertGenerationItemId(value: string): string {
  if (!UUID_PATTERN.test(value)) throw new Error("Invalid Current Affairs generation item ID");
  return value;
}

function localizationSnapshot(row: QuestionRow, languageCode: "hi" | "pa"): QuestionEditorialLocalizationSnapshot | null {
  const prefix = languageCode === "hi" ? "hindi" : "punjabi";
  const id = row[`${prefix}Id`];
  if (!id) return null;
  return {
    id: String(id),
    languageCode,
    status: String(row[`${prefix}Status`] ?? "missing"),
    generationItemId: String(row[`${prefix}GenerationItemId`] ?? ""),
    sourceGenerationVersionId: String(row[`${prefix}SourceGenerationVersionId`] ?? ""),
    payload: record(row[`${prefix}Payload`]),
  };
}

async function expectedAssociationOptions(
  client: SqlExecutor,
  payload: Record<string, unknown>,
  family: string,
): Promise<{ hindi: string[]; punjabi: string[] }> {
  if (family !== "CA-QL-002") return { hindi: [], punjabi: [] };
  const englishOptions = sourceOptions(payload);
  if (englishOptions.length === 0) return { hindi: [], punjabi: [] };

  const rows = await client`
    SELECT
      authoring.learner_title AS "englishTitle",
      hi.localized_title AS "hindiTitle",
      pa.localized_title AS "punjabiTitle"
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_localizations hi
      ON hi.event_id=event.id
      AND hi.authoring_version_id=event.learner_authoring_version_id
      AND hi.language_code='hi'
      AND hi.status IN ('ready','manual')
    LEFT JOIN content.current_affairs_localizations pa
      ON pa.event_id=event.id
      AND pa.authoring_version_id=event.learner_authoring_version_id
      AND pa.language_code='pa'
      AND pa.status IN ('ready','manual')
    WHERE event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
      AND authoring.status IN ('ready','manual')
      AND authoring.learner_title = ANY(${englishOptions}::text[])
    ORDER BY event.updated_at DESC
  `;

  const translations = new Map<string, { hindi: Set<string>; punjabi: Set<string> }>();
  for (const row of rows) {
    const englishTitle = normalizeText(row.englishTitle);
    if (!englishTitle) continue;
    const entry = translations.get(englishTitle) ?? { hindi: new Set<string>(), punjabi: new Set<string>() };
    const hindiTitle = normalizeText(row.hindiTitle);
    const punjabiTitle = normalizeText(row.punjabiTitle);
    if (hindiTitle) entry.hindi.add(hindiTitle);
    if (punjabiTitle) entry.punjabi.add(punjabiTitle);
    translations.set(englishTitle, entry);
  }

  const hindi: string[] = [];
  const punjabi: string[] = [];
  for (const englishTitle of englishOptions) {
    const entry = translations.get(englishTitle);
    if (!entry || entry.hindi.size !== 1 || entry.punjabi.size !== 1) {
      return { hindi: [], punjabi: [] };
    }
    hindi.push([...entry.hindi][0]!);
    punjabi.push([...entry.punjabi][0]!);
  }
  return { hindi, punjabi };
}

async function loadQuestionRow(client: SqlExecutor, generationItemId: string): Promise<QuestionRow | null> {
  const rows = await client`
    SELECT
      item.id::text AS "generationItemId",
      item.item_number AS "itemNumber",
      item.status AS "generationItemStatus",
      item.current_version_number AS "currentVersionNumber",
      item.accepted_question_id::text AS "acceptedQuestionId",
      item.accepted_question_version_id::text AS "acceptedQuestionVersionId",
      run.id::text AS "generationRunId",
      run.public_code AS "generationRunCode",
      run.status AS "generationRunStatus",
      version.id::text AS "currentSourceGenerationVersionId",
      version.version_number AS "sourceVersionNumber",
      version.payload AS "sourcePayload",
      version.provider_item_id AS "providerItemId",
      link.event_id::text AS "eventId",
      event.public_code AS "eventPublicCode",
      event.canonical_title AS "eventTitle",
      event.event_date::text AS "eventDate",
      event.category,
      event.status AS "eventStatus",
      link.fact_id::text AS "factId",
      link.fact_key AS "factKey",
      link.question_family AS "questionFamily",
      COALESCE(fact.fact_value, version.payload->'provenance'->>'factValue', '') AS "factValue",
      fact.fact_type AS "factType",
      fact.confidence::float8 AS "factConfidence",
      fact.reconciliation_status AS "factReconciliationStatus",
      fact.support_count::int AS "factSupportCount",
      fact.primary_support_count::int AS "factPrimarySupportCount",
      hi.id::text AS "hindiId",
      hi.status AS "hindiStatus",
      hi.generation_item_id::text AS "hindiGenerationItemId",
      hi.source_generation_version_id::text AS "hindiSourceGenerationVersionId",
      hi.localized_payload AS "hindiPayload",
      hi.quality_snapshot AS "hindiQualitySnapshot",
      hi.reasons AS "hindiReasons",
      hi.updated_at::text AS "hindiUpdatedAt",
      pa.id::text AS "punjabiId",
      pa.status AS "punjabiStatus",
      pa.generation_item_id::text AS "punjabiGenerationItemId",
      pa.source_generation_version_id::text AS "punjabiSourceGenerationVersionId",
      pa.localized_payload AS "punjabiPayload",
      pa.quality_snapshot AS "punjabiQualitySnapshot",
      pa.reasons AS "punjabiReasons",
      pa.updated_at::text AS "punjabiUpdatedAt",
      promotion.id::text AS "promotionId",
      promotion.status AS "promotionStatus",
      active_release.id::text AS "activeReleaseId",
      active_release.public_code AS "activeReleaseCode",
      active_release.status AS "activeReleaseStatus",
      EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      ) AS "hasOpenConflict"
    FROM content.generation_run_items item
    JOIN content.generation_runs run ON run.id=item.generation_run_id
    JOIN content.generation_item_versions version
      ON version.generation_item_id=item.id
      AND version.version_number=item.current_version_number
    JOIN content.current_affairs_question_links link ON link.generation_item_id=item.id
    JOIN content.current_affairs_events event ON event.id=link.event_id
    LEFT JOIN content.current_affairs_facts fact ON fact.id=link.fact_id
    LEFT JOIN content.current_affairs_question_localizations hi
      ON hi.source_generation_version_id=version.id AND hi.language_code='hi'
    LEFT JOIN content.current_affairs_question_localizations pa
      ON pa.source_generation_version_id=version.id AND pa.language_code='pa'
    LEFT JOIN content.current_affairs_question_promotions promotion
      ON promotion.generation_item_id=item.id AND promotion.status='active'
    LEFT JOIN LATERAL (
      SELECT release.id, release.public_code, release.status
      FROM content.current_affairs_release_question_items release_item
      JOIN content.current_affairs_releases release ON release.id=release_item.release_id
      WHERE release_item.generation_item_id=item.id AND release.status='approved'
      ORDER BY release.approved_at DESC
      LIMIT 1
    ) active_release ON true
    WHERE item.id=${generationItemId}::uuid
      AND version.payload->>'language'='en'
      AND version.payload->'generationContext'->>'questionBankAcceptanceMode'='BANK_ONLY'
    LIMIT 1
  `;
  const row = rows[0] as QuestionRow | undefined;
  if (!row) return null;
  const expected = await expectedAssociationOptions(
    client,
    record(row.sourcePayload),
    String(row.questionFamily),
  );
  return {
    ...row,
    expectedHindiOptions: expected.hindi,
    expectedPunjabiOptions: expected.punjabi,
  };
}

function readinessFromRow(row: QuestionRow) {
  return evaluateCurrentAffairsQuestionEditorialReadiness({
    generationItemId: String(row.generationItemId),
    generationItemStatus: String(row.generationItemStatus),
    currentSourceGenerationVersionId: String(row.currentSourceGenerationVersionId),
    sourcePayload: record(row.sourcePayload),
    questionFamily: String(row.questionFamily),
    factValue: String(row.factValue ?? ""),
    eventVerified: String(row.eventStatus) === "verified",
    hasOpenConflict: Boolean(row.hasOpenConflict),
    acceptedQuestionId: row.acceptedQuestionId ? String(row.acceptedQuestionId) : null,
    activePromotion: Boolean(row.promotionId),
    activeApprovedRelease: Boolean(row.activeReleaseId),
    expectedHindiOptions: stringArray(row.expectedHindiOptions),
    expectedPunjabiOptions: stringArray(row.expectedPunjabiOptions),
    hindi: localizationSnapshot(row, "hi"),
    punjabi: localizationSnapshot(row, "pa"),
  });
}

function publicRow(row: QuestionRow) {
  return {
    ...row,
    sourcePayload: record(row.sourcePayload),
    hindiPayload: row.hindiId ? record(row.hindiPayload) : null,
    punjabiPayload: row.punjabiId ? record(row.punjabiPayload) : null,
    expectedHindiOptions: stringArray(row.expectedHindiOptions),
    expectedPunjabiOptions: stringArray(row.expectedPunjabiOptions),
    readiness: readinessFromRow(row),
  };
}

export async function loadCurrentAffairsQuestionEditorialQueue(limit = 100) {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  const rows = await sqlClient`
    SELECT item.id::text AS id
    FROM content.current_affairs_question_links link
    JOIN content.generation_run_items item ON item.id=link.generation_item_id
    JOIN content.generation_item_versions version
      ON version.generation_item_id=item.id AND version.version_number=item.current_version_number
    JOIN content.generation_runs run ON run.id=item.generation_run_id
    WHERE run.status='review'
      AND version.payload->>'language'='en'
      AND version.payload->'generationContext'->>'questionBankAcceptanceMode'='BANK_ONLY'
    ORDER BY
      CASE item.status WHEN 'unreviewed' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
      run.created_at DESC,
      item.item_number ASC
    LIMIT ${safeLimit}
  `;
  const items = [];
  for (const row of rows) {
    const detail = await loadQuestionRow(sqlClient, String(row.id));
    if (detail) items.push(publicRow(detail));
  }
  return {
    items,
    counts: {
      total: items.length,
      unreviewed: items.filter((item) => String(item.generationItemStatus) === "unreviewed").length,
      approvable: items.filter((item) => item.readiness.approvable).length,
      approved: items.filter((item) => String(item.generationItemStatus) === "approved").length,
      locked: items.filter((item) => !item.readiness.editable).length,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function loadCurrentAffairsQuestionEditorialDetail(generationItemId: string) {
  const id = assertGenerationItemId(generationItemId);
  const row = await loadQuestionRow(sqlClient, id);
  if (!row) throw new Error("Eligible Current Affairs question not found");
  const eventId = String(row.eventId);
  const [sources, eventFacts, versions, releases] = await Promise.all([
    sqlClient`
      SELECT
        source.source_key AS "sourceKey", source.name AS "sourceName",
        source.trust_score::float8 AS "trustScore",
        evidence.source_url AS "sourceUrl", evidence.source_title AS "sourceTitle",
        evidence.source_published_at::text AS "sourcePublishedAt",
        evidence.is_primary_evidence AS "isPrimaryEvidence",
        evidence.evidence_confidence::float8 AS "evidenceConfidence"
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=${eventId}::uuid
      ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC
    `,
    sqlClient`
      SELECT id::text AS id, fact_key AS "factKey", fact_value AS "factValue",
             fact_type AS "factType", is_verified AS "isVerified", confidence::float8 AS confidence,
             reconciliation_status AS "reconciliationStatus", support_count::int AS "supportCount",
             primary_support_count::int AS "primarySupportCount", sort_order AS "sortOrder"
      FROM content.current_affairs_facts
      WHERE event_id=${eventId}::uuid
      ORDER BY sort_order, fact_key, fact_value
    `,
    sqlClient`
      SELECT id::text AS id, version_number AS "versionNumber", payload,
             provider_item_id AS "providerItemId", created_at::text AS "createdAt"
      FROM content.generation_item_versions
      WHERE generation_item_id=${id}::uuid
      ORDER BY version_number DESC
      LIMIT 12
    `,
    sqlClient`
      SELECT release.id::text AS id, release.public_code AS "publicCode",
             release.status, release.release_version::int AS "releaseVersion",
             release.approved_at::text AS "approvedAt", release.revoked_at::text AS "revokedAt"
      FROM content.current_affairs_release_question_items release_item
      JOIN content.current_affairs_releases release ON release.id=release_item.release_id
      WHERE release_item.generation_item_id=${id}::uuid
      ORDER BY release.release_version DESC
      LIMIT 12
    `,
  ]);
  return {
    item: publicRow(row),
    sources,
    eventFacts,
    versionHistory: versions,
    releaseHistory: releases,
    generatedAt: new Date().toISOString(),
  };
}

export async function createManualCurrentAffairsEnglishQuestionRevision(args: {
  generationItemId: string;
  stem: string;
  explanation: string;
  reason: string;
  actorUserId: string;
}) {
  const id = assertGenerationItemId(args.generationItemId);
  const stem = normalizeText(args.stem);
  const explanation = normalizeText(args.explanation);
  const reason = normalizeText(args.reason);
  if (stem.length < 8) throw new Error("English question stem must contain at least 8 characters");
  if (explanation.length < 12) throw new Error("English question explanation must contain at least 12 characters");
  if (reason.length < 8) throw new Error("English question revision requires an editorial reason");

  let result: Record<string, unknown> = {};
  await sqlClient.begin(async (tx) => {
    await tx`SELECT id FROM content.generation_run_items WHERE id=${id}::uuid FOR UPDATE`;
    const row = await loadQuestionRow(tx, id);
    if (!row) throw new Error("Eligible Current Affairs question not found");
    const readiness = readinessFromRow(row);
    if (!readiness.editable) throw new Error(readiness.blockers.join("; ") || "Current Affairs question is not editable");

    const sourcePayload = record(row.sourcePayload);
    const options = sourceOptions(sourcePayload);
    const sourceCorrectIndex = Number(sourcePayload.correctIndex);
    if (!Number.isInteger(sourceCorrectIndex) || sourceCorrectIndex < 0 || sourceCorrectIndex >= options.length) {
      throw new Error("Source Current Affairs question has invalid correct index");
    }
    const factValue = normalizeText(row.factValue);
    const composite = [stem, explanation, ...options].join(" ");
    if (!factValue || !composite.includes(factValue)) {
      throw new Error("Edited English question must preserve the linked canonical fact value");
    }

    const nextRows = await tx`
      SELECT COALESCE(MAX(version_number), 0)::int + 1 AS next
      FROM content.generation_item_versions
      WHERE generation_item_id=${id}::uuid
    `;
    const nextVersionNumber = Number(nextRows[0]?.next ?? 1);
    const versionId = randomUUID();
    const generationContext = record(sourcePayload.generationContext);
    const provenance = record(sourcePayload.provenance);
    const revisedPayload = {
      ...sourcePayload,
      text: stem,
      stem,
      explanation,
      options,
      correctIndex: sourceCorrectIndex,
      canonicalAnswer: options[sourceCorrectIndex],
      language: "en",
      generationContext: {
        ...generationContext,
        reviewStatus: "PENDING_EDITORIAL_REVIEW",
        questionBankAcceptanceMode: "BANK_ONLY",
        publiclyPublishable: false,
        automaticStudentPublication: false,
        editorialRevisionAuthority: "CURRENT_AFFAIRS_STUDIO_CP024",
      },
      provenance: {
        ...provenance,
        editorialRevision: "manual_cp024",
        parentGenerationVersionId: String(row.currentSourceGenerationVersionId),
        factValue,
      },
    };
    await tx`
      INSERT INTO content.generation_item_versions (
        id, generation_item_id, version_number, payload, provider_item_id, created_at
      ) VALUES (
        ${versionId}::uuid, ${id}::uuid, ${nextVersionNumber}, ${JSON.stringify(revisedPayload)}::jsonb,
        ${row.providerItemId ? String(row.providerItemId) : null}, now()
      )
    `;
    await tx`
      UPDATE content.generation_run_items
      SET current_version_number=${nextVersionNumber}, status='unreviewed', updated_at=now()
      WHERE id=${id}::uuid
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.question.english_revised', 'generation_run_item', ${id}::uuid,
        ${reason}, 'Created a new immutable English Current Affairs question version',
        ${JSON.stringify({
          previousGenerationVersionId: String(row.currentSourceGenerationVersionId),
          newGenerationVersionId: versionId,
          newVersionNumber: nextVersionNumber,
          optionsAndCorrectIndexFrozen: true,
          bankOnly: true,
        })}::jsonb
      )
    `;
    result = {
      generationItemId: id,
      sourceGenerationVersionId: versionId,
      versionNumber: nextVersionNumber,
      status: "unreviewed",
      payload: revisedPayload,
      localizationsRequireReview: true,
    };
  });
  return result;
}

export async function approveCurrentAffairsQuestionEditorialItem(args: {
  generationItemId: string;
  reason: string;
  actorUserId: string;
}) {
  const id = assertGenerationItemId(args.generationItemId);
  const reason = normalizeText(args.reason);
  if (reason.length < 8) throw new Error("Question approval requires an editorial reason");
  let output: Record<string, unknown> = {};
  await sqlClient.begin(async (tx) => {
    await tx`SELECT id FROM content.generation_run_items WHERE id=${id}::uuid FOR UPDATE`;
    const row = await loadQuestionRow(tx, id);
    if (!row) throw new Error("Eligible Current Affairs question not found");
    const readiness = readinessFromRow(row);
    if (!readiness.approvable) {
      throw new Error(`Question approval blocked: ${readiness.blockers.join("; ")}`);
    }
    await tx`
      UPDATE content.generation_run_items
      SET status='approved', updated_at=now()
      WHERE id=${id}::uuid
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.question.approved', 'generation_run_item', ${id}::uuid,
        ${reason}, 'Approved Current Affairs English question with current Hindi/Punjabi parity',
        ${JSON.stringify({
          sourceGenerationVersionId: String(row.currentSourceGenerationVersionId),
          hindiLocalizationId: row.hindiId ? String(row.hindiId) : null,
          punjabiLocalizationId: row.punjabiId ? String(row.punjabiId) : null,
          correctIndexFrozen: Number(record(row.sourcePayload).correctIndex),
          optionSemanticParity: true,
          bankOnly: true,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;
    output = {
      generationItemId: id,
      status: "approved",
      sourceGenerationVersionId: String(row.currentSourceGenerationVersionId),
      readiness,
      bankOnly: true,
      automaticStudentPublication: false,
    };
  });
  return output;
}
