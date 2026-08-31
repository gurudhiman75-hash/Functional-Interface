import { randomUUID } from "node:crypto";

import {
  convertApprovedGenerationItem,
  optionKey,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import { sqlClient } from "../lib/db";
import {
  evaluateCurrentAffairsQuestionPromotionReadiness,
  promotionPayloadHash,
  promotionQuestionPayload,
  type PromotionQuestionPayload,
} from "./question-promotion-policy";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PromotionSourceRow = {
  generationItemId: string;
  generationItemStatus: string;
  currentSourceGenerationVersionId: string;
  frozenSourceGenerationVersionId: string;
  sourcePayload: Record<string, unknown>;
  acceptedQuestionId: string | null;
  acceptedQuestionVersionId: string | null;
  hindi: {
    id: string;
    status: string;
    generationItemId: string;
    sourceGenerationVersionId: string;
    updatedAt: string;
    inputFingerprint: string;
    qualitySnapshot: unknown;
    createdBy: string | null;
    payload: Record<string, unknown>;
  };
  punjabi: {
    id: string;
    status: string;
    generationItemId: string;
    sourceGenerationVersionId: string;
    updatedAt: string;
    inputFingerprint: string;
    qualitySnapshot: unknown;
    createdBy: string | null;
    payload: Record<string, unknown>;
  };
  existingPromotion: null | {
    id: string;
    status: string;
    questionId: string;
    questionVersionId: string;
    hindiQuestionTranslationId: string;
    punjabiQuestionTranslationId: string;
  };
};

type ReleaseSnapshot = {
  id: string;
  publicCode: string;
  status: string;
  approvedAt: string;
  releaseVersion: number;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  examFamily: string;
  resourceCount: number;
  publishedResourceCount: number;
  publishedCompilationCount: number;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function optionsFromRows(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => String(record(item).text ?? "").replace(/\s+/g, " ").trim()).filter(Boolean)
    : [];
}

function assertReleaseId(value: string): string {
  if (!UUID_PATTERN.test(value)) throw new Error("Invalid Current Affairs release ID");
  return value;
}

async function loadReleaseSnapshot(releaseId: string, client: QuestionSqlExecutor): Promise<ReleaseSnapshot> {
  const rows = await client`
    SELECT
      release.id::text AS id,
      release.public_code AS "publicCode",
      release.status,
      release.approved_at::text AS "approvedAt",
      release.release_version::int AS "releaseVersion",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      count(link.language_code)::int AS "resourceCount",
      count(*) FILTER (WHERE resource.status='published')::int AS "publishedResourceCount",
      count(*) FILTER (WHERE compilation.status='published')::int AS "publishedCompilationCount"
    FROM content.current_affairs_releases release
    LEFT JOIN content.current_affairs_release_compilations link ON link.release_id=release.id
    LEFT JOIN content.learning_resources resource ON resource.id=link.learning_resource_id
    LEFT JOIN content.current_affairs_compilations compilation ON compilation.id=link.compilation_id
    WHERE release.id=${releaseId}::uuid
    GROUP BY release.id
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Current Affairs release not found");
  return {
    id: String(row.id),
    publicCode: String(row.publicCode),
    status: String(row.status),
    approvedAt: String(row.approvedAt),
    releaseVersion: Number(row.releaseVersion),
    periodType: String(row.periodType),
    periodStart: String(row.periodStart).slice(0, 10),
    periodEnd: String(row.periodEnd).slice(0, 10),
    examFamily: String(row.examFamily),
    resourceCount: Number(row.resourceCount ?? 0),
    publishedResourceCount: Number(row.publishedResourceCount ?? 0),
    publishedCompilationCount: Number(row.publishedCompilationCount ?? 0),
  };
}

async function loadPromotionSourceRows(releaseId: string, client: QuestionSqlExecutor): Promise<PromotionSourceRow[]> {
  const rows = await client`
    SELECT
      release_item.generation_item_id::text AS "generationItemId",
      item.status AS "generationItemStatus",
      current_version.id::text AS "currentSourceGenerationVersionId",
      release_item.source_generation_version_id::text AS "frozenSourceGenerationVersionId",
      frozen_version.payload AS "sourcePayload",
      item.accepted_question_id::text AS "acceptedQuestionId",
      item.accepted_question_version_id::text AS "acceptedQuestionVersionId",
      hi.id::text AS "hindiId",
      hi.status AS "hindiStatus",
      hi.generation_item_id::text AS "hindiGenerationItemId",
      hi.source_generation_version_id::text AS "hindiSourceGenerationVersionId",
      hi.updated_at::text AS "hindiUpdatedAt",
      hi.input_fingerprint AS "hindiInputFingerprint",
      hi.quality_snapshot AS "hindiQualitySnapshot",
      hi.created_by::text AS "hindiCreatedBy",
      hi.localized_payload AS "hindiPayload",
      pa.id::text AS "punjabiId",
      pa.status AS "punjabiStatus",
      pa.generation_item_id::text AS "punjabiGenerationItemId",
      pa.source_generation_version_id::text AS "punjabiSourceGenerationVersionId",
      pa.updated_at::text AS "punjabiUpdatedAt",
      pa.input_fingerprint AS "punjabiInputFingerprint",
      pa.quality_snapshot AS "punjabiQualitySnapshot",
      pa.created_by::text AS "punjabiCreatedBy",
      pa.localized_payload AS "punjabiPayload",
      promotion.id::text AS "promotionId",
      promotion.status AS "promotionStatus",
      promotion.question_id::text AS "promotedQuestionId",
      promotion.question_version_id::text AS "promotedQuestionVersionId",
      promotion.hindi_question_translation_id::text AS "promotedHindiTranslationId",
      promotion.punjabi_question_translation_id::text AS "promotedPunjabiTranslationId"
    FROM content.current_affairs_release_question_items release_item
    JOIN content.generation_run_items item ON item.id=release_item.generation_item_id
    JOIN content.generation_item_versions current_version
      ON current_version.generation_item_id=item.id
     AND current_version.version_number=item.current_version_number
    JOIN content.generation_item_versions frozen_version
      ON frozen_version.id=release_item.source_generation_version_id
    JOIN content.current_affairs_question_localizations hi
      ON hi.id=release_item.hindi_localization_id
    JOIN content.current_affairs_question_localizations pa
      ON pa.id=release_item.punjabi_localization_id
    LEFT JOIN content.current_affairs_question_promotions promotion
      ON promotion.generation_item_id=release_item.generation_item_id
    WHERE release_item.release_id=${releaseId}::uuid
    ORDER BY item.item_number
  `;
  return rows.map((row) => ({
    generationItemId: String(row.generationItemId),
    generationItemStatus: String(row.generationItemStatus),
    currentSourceGenerationVersionId: String(row.currentSourceGenerationVersionId),
    frozenSourceGenerationVersionId: String(row.frozenSourceGenerationVersionId),
    sourcePayload: record(row.sourcePayload),
    acceptedQuestionId: row.acceptedQuestionId ? String(row.acceptedQuestionId) : null,
    acceptedQuestionVersionId: row.acceptedQuestionVersionId ? String(row.acceptedQuestionVersionId) : null,
    hindi: {
      id: String(row.hindiId),
      status: String(row.hindiStatus),
      generationItemId: String(row.hindiGenerationItemId),
      sourceGenerationVersionId: String(row.hindiSourceGenerationVersionId),
      updatedAt: String(row.hindiUpdatedAt),
      inputFingerprint: String(row.hindiInputFingerprint),
      qualitySnapshot: row.hindiQualitySnapshot,
      createdBy: row.hindiCreatedBy ? String(row.hindiCreatedBy) : null,
      payload: record(row.hindiPayload),
    },
    punjabi: {
      id: String(row.punjabiId),
      status: String(row.punjabiStatus),
      generationItemId: String(row.punjabiGenerationItemId),
      sourceGenerationVersionId: String(row.punjabiSourceGenerationVersionId),
      updatedAt: String(row.punjabiUpdatedAt),
      inputFingerprint: String(row.punjabiInputFingerprint),
      qualitySnapshot: row.punjabiQualitySnapshot,
      createdBy: row.punjabiCreatedBy ? String(row.punjabiCreatedBy) : null,
      payload: record(row.punjabiPayload),
    },
    existingPromotion: row.promotionId ? {
      id: String(row.promotionId),
      status: String(row.promotionStatus),
      questionId: String(row.promotedQuestionId),
      questionVersionId: String(row.promotedQuestionVersionId),
      hindiQuestionTranslationId: String(row.promotedHindiTranslationId),
      punjabiQuestionTranslationId: String(row.promotedPunjabiTranslationId),
    } : null,
  }));
}

async function ensureCanonicalTranslation(args: {
  client: QuestionSqlExecutor;
  questionVersionId: string;
  languageCode: "hi" | "pa";
  payload: PromotionQuestionPayload;
  sourceLocalizationId: string;
  sourceInputFingerprint: string;
  sourceQualitySnapshot: unknown;
  sourceCreatedBy: string | null;
  actorUserId: string;
  releaseId: string;
  releaseCode: string;
}) {
  const languageRows = await args.client`
    SELECT id::text AS id
    FROM catalog.languages
    WHERE lower(code)=${args.languageCode} AND is_active=true
    LIMIT 1
  `;
  const languageId = languageRows[0]?.id ? String(languageRows[0].id) : "";
  if (!languageId) throw new Error(`Active canonical language ${args.languageCode} is unavailable`);

  const existingRows = await args.client`
    SELECT
      translation.id::text AS id,
      translation.stem,
      translation.explanation,
      translation.status,
      COALESCE((
        SELECT json_agg(json_build_object('text', option.text, 'sortOrder', option.sort_order)
          ORDER BY option.sort_order)
        FROM content.question_translation_options option
        WHERE option.question_translation_id=translation.id
      ), '[]'::json) AS options
    FROM content.question_translations translation
    WHERE translation.question_version_id=${args.questionVersionId}::uuid
      AND translation.language_id=${languageId}::uuid
    LIMIT 1
    FOR UPDATE OF translation
  `;
  const existing = existingRows[0];
  if (existing) {
    const existingOptions = optionsFromRows(existing.options);
    const same = String(existing.stem).replace(/\s+/g, " ").trim() === args.payload.stem
      && String(existing.explanation).replace(/\s+/g, " ").trim() === args.payload.explanation
      && existingOptions.length === args.payload.options.length
      && existingOptions.every((value, index) => value === args.payload.options[index]);
    if (!same) {
      throw new Error(`${args.languageCode.toUpperCase()} canonical translation already exists with content different from the approved release snapshot`);
    }
    await args.client`
      UPDATE content.question_translations
      SET status='approved',
          reviewer_user_id=${args.actorUserId}::uuid,
          reviewed_at=now(),
          quality_snapshot=${JSON.stringify({
            source: "current_affairs_cp015_release_promotion",
            sourceLocalizationId: args.sourceLocalizationId,
            sourceInputFingerprint: args.sourceInputFingerprint,
            sourceQualitySnapshot: args.sourceQualitySnapshot,
            currentAffairsReleaseId: args.releaseId,
            currentAffairsReleaseCode: args.releaseCode,
            exactReleaseSnapshotMatch: true,
          })}::jsonb,
          updated_at=now()
      WHERE id=${String(existing.id)}::uuid
    `;
    return String(existing.id);
  }

  const inserted = await args.client`
    INSERT INTO content.question_translations (
      question_version_id, language_id, stem, explanation, status,
      translator_user_id, submitted_at, reviewer_user_id, reviewed_at,
      quality_snapshot, created_at, updated_at
    ) VALUES (
      ${args.questionVersionId}::uuid,
      ${languageId}::uuid,
      ${args.payload.stem},
      ${args.payload.explanation},
      'approved',
      ${args.sourceCreatedBy ?? args.actorUserId}::uuid,
      now(),
      ${args.actorUserId}::uuid,
      now(),
      ${JSON.stringify({
        source: "current_affairs_cp015_release_promotion",
        sourceLocalizationId: args.sourceLocalizationId,
        sourceInputFingerprint: args.sourceInputFingerprint,
        sourceQualitySnapshot: args.sourceQualitySnapshot,
        currentAffairsReleaseId: args.releaseId,
        currentAffairsReleaseCode: args.releaseCode,
        exactReleaseSnapshotMatch: true,
      })}::jsonb,
      now(), now()
    )
    RETURNING id::text AS id
  `;
  const translationId = String(inserted[0].id);
  for (let index = 0; index < args.payload.options.length; index += 1) {
    await args.client`
      INSERT INTO content.question_translation_options (
        question_translation_id, option_key, text, sort_order, created_at, updated_at
      ) VALUES (
        ${translationId}::uuid, ${optionKey(index)}, ${args.payload.options[index]}, ${index + 1}, now(), now()
      )
    `;
  }
  return translationId;
}

export async function loadCurrentAffairsQuestionPromotionCandidate(releaseId: string) {
  const id = assertReleaseId(releaseId);
  const release = await loadReleaseSnapshot(id, sqlClient);
  const items = await loadPromotionSourceRows(id, sqlClient);
  const candidates = items.map((item) => ({
    generationItemId: item.generationItemId,
    frozenSourceGenerationVersionId: item.frozenSourceGenerationVersionId,
    existingPromotion: item.existingPromotion,
    readiness: evaluateCurrentAffairsQuestionPromotionReadiness({
      releaseStatus: release.status,
      releaseApprovedAt: release.approvedAt,
      generationItemId: item.generationItemId,
      generationItemStatus: item.generationItemStatus,
      currentSourceGenerationVersionId: item.currentSourceGenerationVersionId,
      frozenSourceGenerationVersionId: item.frozenSourceGenerationVersionId,
      sourcePayload: item.sourcePayload,
      hindi: {
        languageCode: "hi",
        status: item.hindi.status,
        generationItemId: item.hindi.generationItemId,
        sourceGenerationVersionId: item.hindi.sourceGenerationVersionId,
        updatedAt: item.hindi.updatedAt,
        payload: item.hindi.payload,
      },
      punjabi: {
        languageCode: "pa",
        status: item.punjabi.status,
        generationItemId: item.punjabi.generationItemId,
        sourceGenerationVersionId: item.punjabi.sourceGenerationVersionId,
        updatedAt: item.punjabi.updatedAt,
        payload: item.punjabi.payload,
      },
    }),
  }));
  const releaseActive = release.status === "approved"
    && release.resourceCount === 3
    && release.publishedResourceCount === 3
    && release.publishedCompilationCount === 3;
  const blockerCount = candidates.reduce((sum, item) => sum + item.readiness.blockers.length, 0)
    + (releaseActive ? 0 : 1);
  return {
    release,
    releaseActive,
    releaseBlockers: releaseActive ? [] : ["CP015 promotion requires the complete CP014 release to remain active and published in EN/HI/PA"],
    items: candidates,
    totalItems: items.length,
    promotedItems: items.filter((item) => item.existingPromotion?.status === "active").length,
    readyToPromoteItems: candidates.filter((item) => item.readiness.ready && !item.existingPromotion).length,
    blockerCount,
    ready: releaseActive && items.length > 0 && blockerCount === 0,
  };
}

export async function listCurrentAffairsQuestionPromotionQueue(limit = 100) {
  const safeLimit = Math.max(1, Math.min(300, Math.floor(limit)));
  return sqlClient`
    SELECT
      release.id::text AS id,
      release.public_code AS "publicCode",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version::int AS "releaseVersion",
      release.approved_at AS "approvedAt",
      count(item.generation_item_id)::int AS "questionItemCount",
      count(promotion.id) FILTER (WHERE promotion.status='active')::int AS "promotedItemCount"
    FROM content.current_affairs_releases release
    JOIN content.current_affairs_release_question_items item ON item.release_id=release.id
    LEFT JOIN content.current_affairs_question_promotions promotion
      ON promotion.release_id=release.id AND promotion.generation_item_id=item.generation_item_id
    WHERE release.status='approved'
    GROUP BY release.id
    ORDER BY release.approved_at DESC
    LIMIT ${safeLimit}
  `;
}

export async function promoteCurrentAffairsReleaseQuestions(args: {
  releaseId: string;
  actorUserId: string;
  reason: string;
}) {
  const releaseId = assertReleaseId(args.releaseId);
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Current Affairs question promotion requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    const client = tx as QuestionSqlExecutor;
    await client`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.question-promotion:${releaseId}`}))`;
    const release = await loadReleaseSnapshot(releaseId, client);
    if (release.status !== "approved") throw new Error("Only an active approved Current Affairs release can promote questions");
    if (release.resourceCount !== 3 || release.publishedResourceCount !== 3 || release.publishedCompilationCount !== 3) {
      throw new Error("Current Affairs question promotion is blocked because the complete EN/HI/PA release is no longer published");
    }

    const items = await loadPromotionSourceRows(releaseId, client);
    if (items.length === 0) throw new Error("Current Affairs release contains no approved question snapshot to promote");

    const evaluated = items.map((item) => ({
      item,
      readiness: evaluateCurrentAffairsQuestionPromotionReadiness({
        releaseStatus: release.status,
        releaseApprovedAt: release.approvedAt,
        generationItemId: item.generationItemId,
        generationItemStatus: item.generationItemStatus,
        currentSourceGenerationVersionId: item.currentSourceGenerationVersionId,
        frozenSourceGenerationVersionId: item.frozenSourceGenerationVersionId,
        sourcePayload: item.sourcePayload,
        hindi: {
          languageCode: "hi",
          status: item.hindi.status,
          generationItemId: item.hindi.generationItemId,
          sourceGenerationVersionId: item.hindi.sourceGenerationVersionId,
          updatedAt: item.hindi.updatedAt,
          payload: item.hindi.payload,
        },
        punjabi: {
          languageCode: "pa",
          status: item.punjabi.status,
          generationItemId: item.punjabi.generationItemId,
          sourceGenerationVersionId: item.punjabi.sourceGenerationVersionId,
          updatedAt: item.punjabi.updatedAt,
          payload: item.punjabi.payload,
        },
      }),
    }));
    const blocked = evaluated.filter((entry) => !entry.readiness.ready);
    if (blocked.length) {
      throw new Error(`Current Affairs question promotion blocked: ${blocked.map((entry) =>
        `${entry.item.generationItemId}: ${entry.readiness.blockers.join("; ")}`).join(" | ")}`);
    }

    const results: Array<Record<string, unknown>> = [];
    for (const entry of evaluated) {
      const { item, readiness } = entry;
      if (item.existingPromotion?.status === "active") {
        results.push({
          generationItemId: item.generationItemId,
          promotionId: item.existingPromotion.id,
          questionId: item.existingPromotion.questionId,
          questionVersionId: item.existingPromotion.questionVersionId,
          status: "already_promoted",
        });
        continue;
      }
      if (item.existingPromotion?.status === "revoked") {
        throw new Error("A revoked Current Affairs promotion cannot be silently reactivated; approve a new Current Affairs release version instead");
      }

      const converted = await convertApprovedGenerationItem(client, item.generationItemId, args.actorUserId);
      if (!converted) throw new Error(`Approved generation item ${item.generationItemId} could not be converted to Question Bank`);
      if (item.acceptedQuestionId && converted.questionId !== item.acceptedQuestionId) {
        throw new Error(`Existing accepted question identity changed for generation item ${item.generationItemId}`);
      }
      if (item.acceptedQuestionVersionId && converted.questionVersionId !== item.acceptedQuestionVersionId) {
        throw new Error(`Existing accepted question version changed for generation item ${item.generationItemId}`);
      }

      const source = readiness.source ?? promotionQuestionPayload(item.sourcePayload);
      const hindi = readiness.hindi ?? promotionQuestionPayload(item.hindi.payload);
      const punjabi = readiness.punjabi ?? promotionQuestionPayload(item.punjabi.payload);
      if (!source || !hindi || !punjabi) throw new Error("Current Affairs promotion payload normalization unexpectedly failed");

      const hindiTranslationId = await ensureCanonicalTranslation({
        client,
        questionVersionId: converted.questionVersionId,
        languageCode: "hi",
        payload: hindi,
        sourceLocalizationId: item.hindi.id,
        sourceInputFingerprint: item.hindi.inputFingerprint,
        sourceQualitySnapshot: item.hindi.qualitySnapshot,
        sourceCreatedBy: item.hindi.createdBy,
        actorUserId: args.actorUserId,
        releaseId,
        releaseCode: release.publicCode,
      });
      const punjabiTranslationId = await ensureCanonicalTranslation({
        client,
        questionVersionId: converted.questionVersionId,
        languageCode: "pa",
        payload: punjabi,
        sourceLocalizationId: item.punjabi.id,
        sourceInputFingerprint: item.punjabi.inputFingerprint,
        sourceQualitySnapshot: item.punjabi.qualitySnapshot,
        sourceCreatedBy: item.punjabi.createdBy,
        actorUserId: args.actorUserId,
        releaseId,
        releaseCode: release.publicCode,
      });

      const promotionId = randomUUID();
      await client`
        INSERT INTO content.current_affairs_question_promotions (
          id, release_id, generation_item_id, source_generation_version_id,
          hindi_source_localization_id, punjabi_source_localization_id,
          question_id, question_version_id,
          hindi_question_translation_id, punjabi_question_translation_id,
          source_payload_hash, hindi_payload_hash, punjabi_payload_hash,
          status, promoted_by, promoted_at, metadata, created_at, updated_at
        ) VALUES (
          ${promotionId}::uuid, ${releaseId}::uuid, ${item.generationItemId}::uuid,
          ${item.frozenSourceGenerationVersionId}::uuid, ${item.hindi.id}::uuid, ${item.punjabi.id}::uuid,
          ${converted.questionId}::uuid, ${converted.questionVersionId}::uuid,
          ${hindiTranslationId}::uuid, ${punjabiTranslationId}::uuid,
          ${promotionPayloadHash(item.sourcePayload)}, ${promotionPayloadHash(item.hindi.payload)}, ${promotionPayloadHash(item.punjabi.payload)},
          'active', ${args.actorUserId}::uuid, now(),
          ${JSON.stringify({
            currentAffairsReleaseCode: release.publicCode,
            currentAffairsReleaseVersion: release.releaseVersion,
            examFamily: release.examFamily,
            periodType: release.periodType,
            periodStart: release.periodStart,
            periodEnd: release.periodEnd,
            hindiInputFingerprint: item.hindi.inputFingerprint,
            punjabiInputFingerprint: item.punjabi.inputFingerprint,
            questionBankAcceptanceMode: "BANK_ONLY",
            taxonomyAssigned: false,
            examVersionAssigned: false,
            testEligible: false,
            publiclyPublishable: false,
            automaticStudentPublication: false,
          })}::jsonb,
          now(), now()
        )
      `;

      await client`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
          'current_affairs.question.promoted_to_bank', 'question', ${converted.questionId}::uuid,
          ${converted.questionVersionId}::uuid, ${reason},
          ${`Promoted released Current Affairs item from ${release.publicCode} to Question Bank`},
          ${JSON.stringify({
            promotionId,
            currentAffairsReleaseId: releaseId,
            currentAffairsReleaseCode: release.publicCode,
            generationItemId: item.generationItemId,
            sourceGenerationVersionId: item.frozenSourceGenerationVersionId,
            hindiSourceLocalizationId: item.hindi.id,
            punjabiSourceLocalizationId: item.punjabi.id,
            hindiQuestionTranslationId: hindiTranslationId,
            punjabiQuestionTranslationId: punjabiTranslationId,
            bankOnly: true,
          })}::jsonb
        )
      `;

      results.push({
        generationItemId: item.generationItemId,
        promotionId,
        questionId: converted.questionId,
        questionVersionId: converted.questionVersionId,
        publicCode: converted.publicCode,
        hindiQuestionTranslationId: hindiTranslationId,
        punjabiQuestionTranslationId: punjabiTranslationId,
        status: "promoted",
      });
    }

    await client`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_release', ${releaseId}::uuid,
        'current_affairs.questions.promoted_to_bank',
        ${JSON.stringify({
          releaseId,
          releaseCode: release.publicCode,
          itemCount: items.length,
          promotedNow: results.filter((item) => item.status === "promoted").length,
          alreadyPromoted: results.filter((item) => item.status === "already_promoted").length,
          questionBankAcceptanceMode: "BANK_ONLY",
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;

    return {
      release,
      itemCount: items.length,
      promotedNow: results.filter((item) => item.status === "promoted").length,
      alreadyPromoted: results.filter((item) => item.status === "already_promoted").length,
      results,
      lifecycle: {
        questionStatus: "approved",
        questionBankAcceptanceMode: "BANK_ONLY",
        examVersionAssigned: false,
        taxonomyAssigned: false,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      },
    };
  });
}
