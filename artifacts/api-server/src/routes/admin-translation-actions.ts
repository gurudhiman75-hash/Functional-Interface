import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  TranslationOperationsError,
  assertTranslationTransition,
  evaluateTranslationQuality,
  normalizeLanguageConfiguration,
  normalizeTranslationDraft,
  normalizeTranslationStatus,
  type TranslationOptionInput,
  type TranslationTermRule,
} from "../lib/admin-translation-operations";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { loadQuestionTranslationDetail } from "./admin-translations";

const router = Router();
type SqlExecutor = typeof sqlClient;

type AuditInput = {
  actorUserId: string;
  effectiveRoleKey: string | null;
  actionKey: string;
  entityType: string;
  entityId: string;
  entityVersionId?: string | null;
  reason: string;
  summary: string;
  metadata?: Record<string, unknown>;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNullableUuid(value: unknown): string | null {
  const text = asText(value);
  if (!text) return null;
  if (!isUuid(text)) throw new TranslationOperationsError("INVALID_USER_ID", "Invalid administrator identifier.");
  return text;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asOptions(value: unknown): TranslationOptionInput[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => {
    const record = asRecord(entry);
    return {
      key: asText(record.key).toUpperCase(),
      text: asText(record.text),
      sortOrder: Number(record.sortOrder ?? index + 1),
    };
  });
}

function asTermRules(value: unknown): TranslationTermRule[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = asRecord(entry);
    return {
      sourceText: asText(record.sourceText),
      preferredText: asText(record.preferredText),
      forbiddenVariants: Array.isArray(record.forbiddenVariants)
        ? record.forbiddenVariants.map(asText).filter(Boolean)
        : [],
    };
  });
}

function requireReason(value: unknown, label = "reason"): string {
  const reason = asText(value);
  if (reason.length < 4 || reason.length > 1000) {
    throw new TranslationOperationsError("TRANSLATION_REASON_REQUIRED", `A ${label} of 4-1000 characters is required.`);
  }
  return reason;
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TranslationOperationsError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

async function writeAudit(client: SqlExecutor, input: AuditInput): Promise<void> {
  await client`
    INSERT INTO platform.audit_events (
      id,
      actor_type,
      actor_user_id,
      effective_role_key,
      action_key,
      entity_type,
      entity_id,
      entity_version_id,
      reason,
      summary,
      metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${input.actorUserId}::uuid,
      ${input.effectiveRoleKey},
      ${input.actionKey},
      ${input.entityType},
      ${input.entityId}::uuid,
      ${input.entityVersionId ?? null}::uuid,
      ${input.reason},
      ${input.summary},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `;
}

async function assertActiveAdmin(client: SqlExecutor, userId: string | null): Promise<void> {
  if (!userId) return;
  const rows = await client`
    SELECT u.id
    FROM identity.users u
    JOIN identity.admin_profiles ap ON ap.user_id = u.id
    WHERE u.id = ${userId}::uuid
      AND u.status = 'active'::user_status
      AND u.deleted_at IS NULL
      AND ap.is_suspended = false
    LIMIT 1
  `;
  if (rows.length === 0) {
    throw new TranslationOperationsError("TRANSLATION_ASSIGNEE_UNAVAILABLE", "Selected administrator is not active.", 409);
  }
}

async function loadTranslationForReview(translationId: string, client: SqlExecutor) {
  const rows = await client`
    SELECT
      qt.id::text AS id,
      qt.question_version_id::text AS "questionVersionId",
      qt.language_id::text AS "languageId",
      lower(l.code) AS "languageCode",
      qt.stem,
      qt.explanation,
      qt.status,
      qt.translator_user_id::text AS "translatorUserId",
      qt.reviewer_user_id::text AS "reviewerUserId",
      qt.quality_snapshot AS "qualitySnapshot",
      qv.stem AS "sourceStem",
      qv.explanation AS "sourceExplanation",
      q.primary_taxonomy_node_id::text AS "taxonomyNodeId",
      COALESCE(
        (SELECT json_agg(json_build_object(
          'key', qo.option_key,
          'text', qo.text,
          'sortOrder', qo.sort_order
        ) ORDER BY qo.sort_order)
        FROM content.question_options qo
        WHERE qo.question_version_id = qv.id),
        '[]'::json
      ) AS "sourceOptions",
      COALESCE(
        (SELECT json_agg(json_build_object(
          'key', qto.option_key,
          'text', qto.text,
          'sortOrder', qto.sort_order
        ) ORDER BY qto.sort_order)
        FROM content.question_translation_options qto
        WHERE qto.question_translation_id = qt.id),
        '[]'::json
      ) AS options,
      COALESCE(
        (SELECT json_agg(json_build_object(
          'sourceText', tt.source_text,
          'preferredText', tt.preferred_text,
          'forbiddenVariants', tt.forbidden_variants
        ) ORDER BY length(tt.source_text) DESC)
        FROM content.translation_terms tt
        WHERE tt.language_id = qt.language_id
          AND tt.is_active = true
          AND (tt.scope_taxonomy_node_id IS NULL OR tt.scope_taxonomy_node_id = q.primary_taxonomy_node_id)),
        '[]'::json
      ) AS terms
    FROM content.question_translations qt
    JOIN catalog.languages l ON l.id = qt.language_id
    JOIN content.question_versions qv ON qv.id = qt.question_version_id
    JOIN content.questions q ON q.id = qv.question_id
    WHERE qt.id = ${translationId}::uuid
    FOR UPDATE OF qt
  `;
  const row = rows[0];
  if (!row) throw new TranslationOperationsError("TRANSLATION_NOT_FOUND", "Translation no longer exists.", 404);
  return row;
}

router.use(authenticate);

router.put(
  "/questions/:questionVersionId/languages/:languageCode",
  requireAdminPermission("content.translations.update"),
  async (req, res) => {
    try {
      const questionVersionId = asText(req.params.questionVersionId);
      const languageCode = asText(req.params.languageCode).toLowerCase();
      if (!isUuid(questionVersionId)) throw new TranslationOperationsError("INVALID_QUESTION_VERSION_ID", "Invalid question version identifier.");
      if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(languageCode) || languageCode === "en") {
        throw new TranslationOperationsError("INVALID_TARGET_LANGUAGE", "Select a supported non-English target language.");
      }
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const input = normalizeTranslationDraft(req.body);

      const translationId = await sqlClient.begin(async (tx) => {
        const sourceRows = await tx`
          SELECT
            qv.id::text AS id,
            qv.stem,
            qv.explanation,
            q.primary_taxonomy_node_id::text AS "taxonomyNodeId",
            q.public_code AS "publicCode",
            qv.exam_version_id::text AS "examVersionId",
            COALESCE(
              json_agg(json_build_object(
                'key', qo.option_key,
                'text', qo.text,
                'sortOrder', qo.sort_order
              ) ORDER BY qo.sort_order) FILTER (WHERE qo.id IS NOT NULL),
              '[]'::json
            ) AS options
          FROM content.question_versions qv
          JOIN content.questions q ON q.id = qv.question_id
          LEFT JOIN content.question_options qo ON qo.question_version_id = qv.id
          WHERE qv.id = ${questionVersionId}::uuid
            AND q.deleted_at IS NULL
          GROUP BY qv.id, q.id
          LIMIT 1
        `;
        const source = sourceRows[0];
        if (!source) throw new TranslationOperationsError("QUESTION_VERSION_NOT_FOUND", "Question version not found.", 404);

        const languageRows = await tx`
          SELECT l.id::text AS id
          FROM catalog.languages l
          JOIN catalog.exam_version_languages evl
            ON evl.language_id = l.id
           AND evl.exam_version_id = ${String(source.examVersionId)}::uuid
          WHERE lower(l.code) = ${languageCode}
            AND l.is_active = true
          LIMIT 1
        `;
        const languageId = asText(languageRows[0]?.id);
        if (!languageId) {
          throw new TranslationOperationsError(
            "LANGUAGE_NOT_ALLOWED_FOR_EXAM",
            `Language ${languageCode} is not active for this question's exam version.`,
            409,
          );
        }

        const termRows = await tx`
          SELECT
            source_text AS "sourceText",
            preferred_text AS "preferredText",
            forbidden_variants AS "forbiddenVariants"
          FROM content.translation_terms
          WHERE language_id = ${languageId}::uuid
            AND is_active = true
            AND (scope_taxonomy_node_id IS NULL OR scope_taxonomy_node_id = ${source.taxonomyNodeId ?? null}::uuid)
        `;
        const quality = evaluateTranslationQuality({
          source: {
            stem: String(source.stem),
            explanation: String(source.explanation),
            options: asOptions(source.options),
          },
          target: { stem: input.stem, explanation: input.explanation, options: input.options },
          languageCode,
          terms: asTermRules(termRows),
        });

        const savedRows = await tx`
          INSERT INTO content.question_translations (
            question_version_id,
            language_id,
            stem,
            explanation,
            status,
            translator_user_id,
            submitted_at,
            reviewer_user_id,
            reviewed_at,
            quality_snapshot,
            created_at,
            updated_at
          ) VALUES (
            ${questionVersionId}::uuid,
            ${languageId}::uuid,
            ${input.stem},
            ${input.explanation},
            'draft',
            ${actorUserId}::uuid,
            NULL,
            NULL,
            NULL,
            ${JSON.stringify(quality)}::jsonb,
            now(),
            now()
          )
          ON CONFLICT (question_version_id, language_id)
          DO UPDATE SET
            stem = EXCLUDED.stem,
            explanation = EXCLUDED.explanation,
            status = CASE
              WHEN content.question_translations.status IN ('approved', 'in_review', 'rejected', 'archived') THEN 'draft'
              ELSE content.question_translations.status
            END,
            translator_user_id = COALESCE(content.question_translations.translator_user_id, EXCLUDED.translator_user_id),
            submitted_at = NULL,
            reviewer_user_id = CASE
              WHEN content.question_translations.status = 'approved' THEN NULL
              ELSE content.question_translations.reviewer_user_id
            END,
            reviewed_at = NULL,
            quality_snapshot = EXCLUDED.quality_snapshot,
            updated_at = now()
          RETURNING id::text AS id, status
        `;
        const saved = savedRows[0];
        const id = String(saved.id);

        await tx`DELETE FROM content.question_translation_options WHERE question_translation_id = ${id}::uuid`;
        for (const option of input.options) {
          await tx`
            INSERT INTO content.question_translation_options (
              question_translation_id, option_key, text, sort_order, created_at, updated_at
            ) VALUES (
              ${id}::uuid,
              ${option.key},
              ${option.text},
              ${option.sortOrder},
              now(),
              now()
            )
          `;
        }

        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "content.translation.saved",
          entityType: "question_translation",
          entityId: id,
          entityVersionId: questionVersionId,
          reason: input.reason,
          summary: `${languageCode.toUpperCase()} translation saved for ${source.publicCode}`,
          metadata: {
            languageCode,
            status: saved.status,
            qualityScore: quality.score,
            errorCount: quality.errorCount,
            warningCount: quality.warningCount,
            optionCount: input.options.length,
          },
        });
        return id;
      });

      res.json({
        translationId,
        detail: await loadQuestionTranslationDetail(questionVersionId, languageCode),
      });
    } catch (error) {
      sendError(res, error, "Unable to save question translation");
    }
  },
);

router.post(
  "/translations/:translationId/assignment",
  requireAdminPermission("content.translations.review"),
  async (req, res) => {
    try {
      const translationId = asText(req.params.translationId);
      if (!isUuid(translationId)) throw new TranslationOperationsError("INVALID_TRANSLATION_ID", "Invalid translation identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const translatorUserId = asNullableUuid(req.body?.translatorUserId);
      const reviewerUserId = asNullableUuid(req.body?.reviewerUserId);
      const reason = requireReason(req.body?.reason, "assignment reason");
      await sqlClient.begin(async (tx) => {
        await assertActiveAdmin(tx, translatorUserId);
        await assertActiveAdmin(tx, reviewerUserId);
        const rows = await tx`
          SELECT
            qt.id::text AS id,
            qt.question_version_id::text AS "questionVersionId",
            qt.translator_user_id::text AS "beforeTranslatorUserId",
            qt.reviewer_user_id::text AS "beforeReviewerUserId",
            lower(l.code) AS "languageCode"
          FROM content.question_translations qt
          JOIN catalog.languages l ON l.id = qt.language_id
          WHERE qt.id = ${translationId}::uuid
          FOR UPDATE OF qt
        `;
        const before = rows[0];
        if (!before) throw new TranslationOperationsError("TRANSLATION_NOT_FOUND", "Translation no longer exists.", 404);
        if (translatorUserId && reviewerUserId && translatorUserId === reviewerUserId) {
          throw new TranslationOperationsError(
            "TRANSLATION_ROLE_CONFLICT",
            "Translator and reviewer should be different administrators.",
            409,
          );
        }
        await tx`
          UPDATE content.question_translations
          SET translator_user_id = ${translatorUserId}::uuid,
              reviewer_user_id = ${reviewerUserId}::uuid,
              updated_at = now()
          WHERE id = ${translationId}::uuid
        `;
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "content.translation.assignment.changed",
          entityType: "question_translation",
          entityId: translationId,
          entityVersionId: String(before.questionVersionId),
          reason,
          summary: `Translation assignment updated for ${String(before.languageCode).toUpperCase()}`,
          metadata: {
            beforeTranslatorUserId: before.beforeTranslatorUserId ?? null,
            afterTranslatorUserId: translatorUserId,
            beforeReviewerUserId: before.beforeReviewerUserId ?? null,
            afterReviewerUserId: reviewerUserId,
          },
        });
      });
      res.json({ ok: true, translationId });
    } catch (error) {
      sendError(res, error, "Unable to update translation assignment");
    }
  },
);

router.post(
  "/translations/:translationId/transition",
  requireAdminPermission("content.translations.review"),
  async (req, res) => {
    try {
      const translationId = asText(req.params.translationId);
      if (!isUuid(translationId)) throw new TranslationOperationsError("INVALID_TRANSLATION_ID", "Invalid translation identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const targetStatus = normalizeTranslationStatus(req.body?.status);
      const reason = requireReason(req.body?.reason, "review reason");

      const result = await sqlClient.begin(async (tx) => {
        const current = await loadTranslationForReview(translationId, tx);
        const sourceStatus = String(current.status);
        assertTranslationTransition(sourceStatus, targetStatus);
        const quality = evaluateTranslationQuality({
          source: {
            stem: String(current.sourceStem),
            explanation: String(current.sourceExplanation),
            options: asOptions(current.sourceOptions),
          },
          target: {
            stem: String(current.stem),
            explanation: String(current.explanation),
            options: asOptions(current.options),
          },
          languageCode: String(current.languageCode),
          terms: asTermRules(current.terms),
        });

        if (targetStatus === "approved") {
          if (!quality.approvable) {
            throw new TranslationOperationsError(
              "TRANSLATION_QUALITY_GATE_BLOCKED",
              "Resolve all translation quality errors before approval.",
              409,
              quality,
            );
          }
          const assignedReviewer = asText(current.reviewerUserId);
          if (assignedReviewer && assignedReviewer !== actorUserId && req.adminSession?.effectiveRoleKey !== "super_admin") {
            throw new TranslationOperationsError(
              "TRANSLATION_REVIEWER_MISMATCH",
              "Only the assigned reviewer can approve this translation.",
              403,
            );
          }
          if (asText(current.translatorUserId) === actorUserId && req.adminSession?.effectiveRoleKey !== "super_admin") {
            throw new TranslationOperationsError(
              "TRANSLATION_SELF_APPROVAL_BLOCKED",
              "A translator cannot approve their own translation.",
              409,
            );
          }
        }

        await tx`
          UPDATE content.question_translations
          SET status = ${targetStatus},
              submitted_at = CASE WHEN ${targetStatus} = 'in_review' THEN now() ELSE submitted_at END,
              reviewer_user_id = CASE
                WHEN ${targetStatus} IN ('approved', 'needs_fix', 'rejected') THEN ${actorUserId}::uuid
                ELSE reviewer_user_id
              END,
              reviewed_at = CASE
                WHEN ${targetStatus} IN ('approved', 'needs_fix', 'rejected') THEN now()
                ELSE reviewed_at
              END,
              quality_snapshot = ${JSON.stringify(quality)}::jsonb,
              updated_at = now()
          WHERE id = ${translationId}::uuid
        `;

        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "content.translation.status.changed",
          entityType: "question_translation",
          entityId: translationId,
          entityVersionId: String(current.questionVersionId),
          reason,
          summary: `Translation moved from ${sourceStatus} to ${targetStatus}`,
          metadata: {
            from: sourceStatus,
            to: targetStatus,
            languageCode: current.languageCode,
            qualityScore: quality.score,
            errorCount: quality.errorCount,
            warningCount: quality.warningCount,
            superAdminOverride:
              targetStatus === "approved"
              && asText(current.translatorUserId) === actorUserId
              && req.adminSession?.effectiveRoleKey === "super_admin",
          },
        });
        return { questionVersionId: String(current.questionVersionId), languageCode: String(current.languageCode), quality };
      });

      res.json({
        translationId,
        status: targetStatus,
        quality: result.quality,
        detail: await loadQuestionTranslationDetail(result.questionVersionId, result.languageCode),
      });
    } catch (error) {
      sendError(res, error, "Unable to transition question translation");
    }
  },
);

router.post(
  "/translations/:translationId/comments",
  requireAdminPermission("content.translations.read"),
  async (req, res) => {
    try {
      const translationId = asText(req.params.translationId);
      if (!isUuid(translationId)) throw new TranslationOperationsError("INVALID_TRANSLATION_ID", "Invalid translation identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const body = asText(req.body?.body);
      const field = asText(req.body?.field) || "general";
      const parentCommentId = asNullableUuid(req.body?.parentCommentId);
      if (body.length < 2 || body.length > 5000) {
        throw new TranslationOperationsError("INVALID_TRANSLATION_COMMENT", "Comment must contain 2-5000 characters.");
      }
      const rows = await sqlClient`
        SELECT question_version_id::text AS "questionVersionId"
        FROM content.question_translations
        WHERE id = ${translationId}::uuid
        LIMIT 1
      `;
      if (!rows[0]) throw new TranslationOperationsError("TRANSLATION_NOT_FOUND", "Translation no longer exists.", 404);
      const commentId = randomUUID();
      await sqlClient`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, effective_role_key, action_key,
          entity_type, entity_id, entity_version_id, reason, summary, metadata
        ) VALUES (
          ${commentId}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          ${req.adminSession?.effectiveRoleKey ?? null},
          'content.translation.comment.added',
          'question_translation',
          ${translationId}::uuid,
          ${String(rows[0].questionVersionId)}::uuid,
          ${body},
          ${`Translation comment added on ${field}`},
          ${JSON.stringify({ body, field, parentCommentId, resolved: false })}::jsonb
        )
      `;
      res.status(201).json({ id: commentId, translationId });
    } catch (error) {
      sendError(res, error, "Unable to add translation comment");
    }
  },
);

router.post(
  "/translations/:translationId/comments/:commentId/resolution",
  requireAdminPermission("content.translations.review"),
  async (req, res) => {
    try {
      const translationId = asText(req.params.translationId);
      const commentId = asText(req.params.commentId);
      if (!isUuid(translationId) || !isUuid(commentId)) {
        throw new TranslationOperationsError("INVALID_TRANSLATION_COMMENT_ID", "Invalid translation or comment identifier.");
      }
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const resolved = req.body?.resolved !== false;
      const reason = requireReason(req.body?.reason, "comment resolution reason");
      const rows = await sqlClient`
        SELECT qt.question_version_id::text AS "questionVersionId"
        FROM content.question_translations qt
        JOIN platform.audit_events ae
          ON ae.id = ${commentId}::uuid
         AND ae.entity_type = 'question_translation'
         AND ae.entity_id = qt.id
         AND ae.action_key = 'content.translation.comment.added'
        WHERE qt.id = ${translationId}::uuid
        LIMIT 1
      `;
      if (!rows[0]) throw new TranslationOperationsError("TRANSLATION_COMMENT_NOT_FOUND", "Translation comment not found.", 404);
      await writeAudit(sqlClient, {
        actorUserId,
        effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
        actionKey: "content.translation.comment.resolution.changed",
        entityType: "question_translation",
        entityId: translationId,
        entityVersionId: String(rows[0].questionVersionId),
        reason,
        summary: resolved ? "Translation comment resolved" : "Translation comment reopened",
        metadata: { commentId, resolved },
      });
      res.json({ translationId, commentId, resolved });
    } catch (error) {
      sendError(res, error, "Unable to update translation comment");
    }
  },
);

router.post(
  "/terms",
  requireAdminPermission("settings.languages.manage"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const languageCode = asText(req.body?.languageCode).toLowerCase();
      const sourceText = asText(req.body?.sourceText);
      const preferredText = asText(req.body?.preferredText);
      const contextNote = asText(req.body?.contextNote);
      const scopeTaxonomyNodeId = asNullableUuid(req.body?.scopeTaxonomyNodeId);
      const forbiddenVariants = Array.isArray(req.body?.forbiddenVariants)
        ? req.body.forbiddenVariants.map(asText).filter(Boolean).slice(0, 50)
        : [];
      const reason = requireReason(req.body?.reason, "terminology reason");
      if (!sourceText || sourceText.length > 255 || !preferredText || preferredText.length > 255) {
        throw new TranslationOperationsError("INVALID_TRANSLATION_TERM", "Source and preferred terms are required and limited to 255 characters.");
      }
      const term = await sqlClient.begin(async (tx) => {
        const languageRows = await tx`
          SELECT id::text AS id FROM catalog.languages
          WHERE lower(code) = ${languageCode} AND is_active = true
          LIMIT 1
        `;
        const languageId = asText(languageRows[0]?.id);
        if (!languageId || languageCode === "en") {
          throw new TranslationOperationsError("INVALID_TERM_LANGUAGE", "Select an active non-English language.");
        }
        if (scopeTaxonomyNodeId) {
          const scopeRows = await tx`
            SELECT id FROM catalog.taxonomy_nodes
            WHERE id = ${scopeTaxonomyNodeId}::uuid AND deleted_at IS NULL
            LIMIT 1
          `;
          if (!scopeRows[0]) throw new TranslationOperationsError("TERM_SCOPE_NOT_FOUND", "Terminology scope not found.", 404);
        }
        const rows = await tx`
          INSERT INTO content.translation_terms (
            source_text, language_id, preferred_text, forbidden_variants,
            context_note, scope_taxonomy_node_id, is_active,
            created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${sourceText}, ${languageId}::uuid, ${preferredText},
            ${JSON.stringify(forbiddenVariants)}::jsonb, ${contextNote},
            ${scopeTaxonomyNodeId}::uuid, true,
            ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
          )
          RETURNING id::text AS id
        `;
        const id = String(rows[0].id);
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "content.translation.term.created",
          entityType: "translation_term",
          entityId: id,
          reason,
          summary: `Terminology standard created for ${languageCode.toUpperCase()}`,
          metadata: { languageCode, sourceText, preferredText, forbiddenVariants, scopeTaxonomyNodeId },
        });
        return { id, languageCode, sourceText, preferredText, forbiddenVariants, contextNote, scopeTaxonomyNodeId, isActive: true };
      });
      res.status(201).json({ term });
    } catch (error) {
      sendError(res, error, "Unable to create terminology standard");
    }
  },
);

router.patch(
  "/terms/:termId",
  requireAdminPermission("settings.languages.manage"),
  async (req, res) => {
    try {
      const termId = asText(req.params.termId);
      if (!isUuid(termId)) throw new TranslationOperationsError("INVALID_TERM_ID", "Invalid terminology identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const sourceText = asText(req.body?.sourceText);
      const preferredText = asText(req.body?.preferredText);
      const contextNote = asText(req.body?.contextNote);
      const scopeTaxonomyNodeId = asNullableUuid(req.body?.scopeTaxonomyNodeId);
      const forbiddenVariants = Array.isArray(req.body?.forbiddenVariants)
        ? req.body.forbiddenVariants.map(asText).filter(Boolean).slice(0, 50)
        : [];
      const isActive = req.body?.isActive !== false;
      const reason = requireReason(req.body?.reason, "terminology reason");
      if (!sourceText || sourceText.length > 255 || !preferredText || preferredText.length > 255) {
        throw new TranslationOperationsError("INVALID_TRANSLATION_TERM", "Source and preferred terms are required and limited to 255 characters.");
      }
      await sqlClient.begin(async (tx) => {
        const beforeRows = await tx`
          SELECT id::text AS id, source_text AS "sourceText", preferred_text AS "preferredText",
            forbidden_variants AS "forbiddenVariants", context_note AS "contextNote",
            scope_taxonomy_node_id::text AS "scopeTaxonomyNodeId", is_active AS "isActive"
          FROM content.translation_terms
          WHERE id = ${termId}::uuid
          FOR UPDATE
        `;
        const before = beforeRows[0];
        if (!before) throw new TranslationOperationsError("TERM_NOT_FOUND", "Terminology standard not found.", 404);
        await tx`
          UPDATE content.translation_terms
          SET source_text = ${sourceText},
              preferred_text = ${preferredText},
              forbidden_variants = ${JSON.stringify(forbiddenVariants)}::jsonb,
              context_note = ${contextNote},
              scope_taxonomy_node_id = ${scopeTaxonomyNodeId}::uuid,
              is_active = ${isActive},
              updated_by = ${actorUserId}::uuid,
              updated_at = now()
          WHERE id = ${termId}::uuid
        `;
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "content.translation.term.updated",
          entityType: "translation_term",
          entityId: termId,
          reason,
          summary: "Terminology standard updated",
          metadata: {
            before,
            after: { sourceText, preferredText, forbiddenVariants, contextNote, scopeTaxonomyNodeId, isActive },
          },
        });
      });
      res.json({ ok: true, termId });
    } catch (error) {
      sendError(res, error, "Unable to update terminology standard");
    }
  },
);

router.post(
  "/languages",
  requireAdminPermission("settings.languages.manage"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const code = asText(req.body?.code).toLowerCase();
      if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(code)) {
        throw new TranslationOperationsError("INVALID_LANGUAGE_CODE", "Use a valid BCP 47 language code.");
      }
      const config = normalizeLanguageConfiguration(req.body);
      const language = await sqlClient.begin(async (tx) => {
        await assertActiveAdmin(tx, config.fallbackLanguageId);
        const rows = await tx`
          INSERT INTO catalog.languages (
            code, name, native_name, is_active, direction, script_code,
            fallback_language_id, updated_at
          ) VALUES (
            ${code}, ${config.name}, ${config.nativeName}, ${config.isActive},
            ${config.direction}, ${config.scriptCode}, ${config.fallbackLanguageId}::uuid, now()
          )
          RETURNING id::text AS id, code, name, native_name AS "nativeName",
            is_active AS "isActive", direction, script_code AS "scriptCode",
            fallback_language_id::text AS "fallbackLanguageId"
        `;
        const row = rows[0];
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "catalog.language.created",
          entityType: "language",
          entityId: String(row.id),
          reason: config.reason,
          summary: `Language ${config.name} created`,
          metadata: row as Record<string, unknown>,
        });
        return row;
      });
      res.status(201).json({ language });
    } catch (error) {
      sendError(res, error, "Unable to create language");
    }
  },
);

router.patch(
  "/languages/:languageId",
  requireAdminPermission("settings.languages.manage"),
  async (req, res) => {
    try {
      const languageId = asText(req.params.languageId);
      if (!isUuid(languageId)) throw new TranslationOperationsError("INVALID_LANGUAGE_ID", "Invalid language identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const config = normalizeLanguageConfiguration(req.body);
      await sqlClient.begin(async (tx) => {
        if (config.fallbackLanguageId === languageId) {
          throw new TranslationOperationsError("LANGUAGE_FALLBACK_CYCLE", "A language cannot fall back to itself.");
        }
        const beforeRows = await tx`
          SELECT id::text AS id, code, name, native_name AS "nativeName",
            is_active AS "isActive", direction, script_code AS "scriptCode",
            fallback_language_id::text AS "fallbackLanguageId"
          FROM catalog.languages
          WHERE id = ${languageId}::uuid
          FOR UPDATE
        `;
        const before = beforeRows[0];
        if (!before) throw new TranslationOperationsError("LANGUAGE_NOT_FOUND", "Language not found.", 404);
        if (String(before.code).toLowerCase() === "en" && !config.isActive) {
          throw new TranslationOperationsError("SOURCE_LANGUAGE_REQUIRED", "English source language cannot be deactivated.", 409);
        }
        if (config.fallbackLanguageId) {
          const fallbackRows = await tx`
            SELECT fallback_language_id::text AS "fallbackLanguageId"
            FROM catalog.languages
            WHERE id = ${config.fallbackLanguageId}::uuid AND is_active = true
            LIMIT 1
          `;
          if (!fallbackRows[0]) throw new TranslationOperationsError("FALLBACK_LANGUAGE_NOT_FOUND", "Fallback language is unavailable.", 404);
          if (String(fallbackRows[0].fallbackLanguageId ?? "") === languageId) {
            throw new TranslationOperationsError("LANGUAGE_FALLBACK_CYCLE", "Language fallback cannot form a direct cycle.", 409);
          }
        }
        await tx`
          UPDATE catalog.languages
          SET name = ${config.name},
              native_name = ${config.nativeName},
              is_active = ${config.isActive},
              direction = ${config.direction},
              script_code = ${config.scriptCode},
              fallback_language_id = ${config.fallbackLanguageId}::uuid,
              updated_at = now()
          WHERE id = ${languageId}::uuid
        `;
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "catalog.language.updated",
          entityType: "language",
          entityId: languageId,
          reason: config.reason,
          summary: `Language ${config.name} updated`,
          metadata: { before, after: config },
        });
      });
      res.json({ ok: true, languageId });
    } catch (error) {
      sendError(res, error, "Unable to update language");
    }
  },
);

router.put(
  "/exam-versions/:examVersionId/languages",
  requireAdminPermission("settings.languages.manage"),
  async (req, res) => {
    try {
      const examVersionId = asText(req.params.examVersionId);
      if (!isUuid(examVersionId)) throw new TranslationOperationsError("INVALID_EXAM_VERSION_ID", "Invalid exam version identifier.");
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const reason = requireReason(req.body?.reason, "exam language change reason");
      const entries = Array.isArray(req.body?.languages)
        ? req.body.languages.map((entry: unknown) => {
            const record = asRecord(entry);
            const languageId = asText(record.languageId);
            if (!isUuid(languageId)) throw new TranslationOperationsError("INVALID_LANGUAGE_ID", "Invalid language mapping identifier.");
            return { languageId, isPrimary: Boolean(record.isPrimary) };
          })
        : [];
      if (entries.length === 0 || new Set(entries.map((entry) => entry.languageId)).size !== entries.length) {
        throw new TranslationOperationsError("INVALID_EXAM_LANGUAGE_SET", "Choose at least one unique language.");
      }
      if (entries.filter((entry) => entry.isPrimary).length !== 1) {
        throw new TranslationOperationsError("PRIMARY_LANGUAGE_REQUIRED", "Exactly one exam language must be primary.");
      }
      await sqlClient.begin(async (tx) => {
        const examRows = await tx`
          SELECT ev.id::text AS id, ev.name, e.code AS "examCode", e.name AS "examName"
          FROM catalog.exam_versions ev
          JOIN catalog.exams e ON e.id = ev.exam_id
          WHERE ev.id = ${examVersionId}::uuid
          FOR UPDATE OF ev
        `;
        const exam = examRows[0];
        if (!exam) throw new TranslationOperationsError("EXAM_VERSION_NOT_FOUND", "Exam version not found.", 404);
        const activeRows = await tx`
          SELECT id::text AS id FROM catalog.languages
          WHERE id = ANY(${entries.map((entry) => entry.languageId)}::uuid[])
            AND is_active = true
        `;
        if (activeRows.length !== entries.length) {
          throw new TranslationOperationsError("INACTIVE_EXAM_LANGUAGE", "Every mapped exam language must be active.", 409);
        }
        const before = await tx`
          SELECT language_id::text AS "languageId", is_primary AS "isPrimary"
          FROM catalog.exam_version_languages
          WHERE exam_version_id = ${examVersionId}::uuid
          ORDER BY is_primary DESC, language_id
        `;
        await tx`DELETE FROM catalog.exam_version_languages WHERE exam_version_id = ${examVersionId}::uuid`;
        for (const entry of entries) {
          await tx`
            INSERT INTO catalog.exam_version_languages (exam_version_id, language_id, is_primary)
            VALUES (${examVersionId}::uuid, ${entry.languageId}::uuid, ${entry.isPrimary})
          `;
        }
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "catalog.exam_version.languages.changed",
          entityType: "exam_version",
          entityId: examVersionId,
          reason,
          summary: `Language availability updated for ${exam.examCode} ${exam.name}`,
          metadata: { before, after: entries },
        });
      });
      res.json({ ok: true, examVersionId, languages: entries });
    } catch (error) {
      sendError(res, error, "Unable to update exam language mappings");
    }
  },
);

export default router;
