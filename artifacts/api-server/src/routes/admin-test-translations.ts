import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  TranslationOperationsError,
  assertTranslationTransition,
  normalizeTranslationStatus,
} from "../lib/admin-translation-operations";
import { evaluateTestLocalizationReadiness } from "../lib/admin-test-localization";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asNullableUuid(value: unknown): string | null {
  const text = asText(value);
  if (!text) return null;
  if (!isUuid(text)) throw new TranslationOperationsError("INVALID_USER_ID", "Invalid administrator identifier.");
  return text;
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

async function writeAudit(client: SqlExecutor, input: {
  actorUserId: string;
  effectiveRoleKey: string | null;
  actionKey: string;
  entityId: string;
  entityVersionId: string;
  reason: string;
  summary: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key, action_key,
      entity_type, entity_id, entity_version_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${input.actorUserId}::uuid,
      ${input.effectiveRoleKey},
      ${input.actionKey},
      'test_translation',
      ${input.entityId}::uuid,
      ${input.entityVersionId}::uuid,
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
  if (!rows[0]) throw new TranslationOperationsError("TRANSLATION_ASSIGNEE_UNAVAILABLE", "Selected administrator is not active.", 409);
}

async function loadTestTranslationDetail(
  testVersionId: string,
  languageCode: string,
  client: SqlExecutor = sqlClient,
) {
  const sourceRows = await client`
    SELECT
      t.id::text AS "testId",
      t.public_code AS "publicCode",
      t.status::text AS "testStatus",
      t.exam_version_id::text AS "examVersionId",
      tv.id::text AS "testVersionId",
      tv.version_number AS "versionNumber",
      tv.title,
      tv.description,
      tv.instructions,
      tv.settings,
      tv.created_at AS "sourceCreatedAt",
      e.code AS "examCode",
      e.name AS "examName",
      ev.name AS "examVersionName",
      COALESCE(
        json_agg(json_build_object(
          'id', section.id,
          'sectionKey', section.section_key,
          'name', section.name,
          'sortOrder', section.sort_order
        ) ORDER BY section.sort_order) FILTER (WHERE section.id IS NOT NULL),
        '[]'::json
      ) AS sections
    FROM assessment.test_versions tv
    JOIN assessment.tests t ON t.id = tv.test_id
    JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    LEFT JOIN assessment.test_sections section ON section.test_version_id = tv.id
    WHERE tv.id = ${testVersionId}::uuid
      AND t.deleted_at IS NULL
    GROUP BY t.id, tv.id, e.id, ev.id
    LIMIT 1
  `;
  const source = sourceRows[0];
  if (!source) throw new TranslationOperationsError("TEST_VERSION_NOT_FOUND", "Test version not found.", 404);

  const languageRows = await client`
    SELECT id::text AS id, lower(code) AS code, name, native_name AS "nativeName",
      direction, script_code AS "scriptCode", is_active AS "isActive"
    FROM catalog.languages
    WHERE lower(code) = ${languageCode.toLowerCase()}
    LIMIT 1
  `;
  const language = languageRows[0];
  if (!language) throw new TranslationOperationsError("LANGUAGE_NOT_FOUND", "Target language not found.", 404);

  const targetRows = await client`
    SELECT
      tvt.id::text AS id,
      tvt.test_version_id::text AS "testVersionId",
      tvt.language_id::text AS "languageId",
      tvt.title,
      tvt.description,
      tvt.instructions,
      tvt.status,
      tvt.translator_user_id::text AS "translatorUserId",
      translator.display_name AS "translatorName",
      translator.email AS "translatorEmail",
      tvt.reviewer_user_id::text AS "reviewerUserId",
      reviewer.display_name AS "reviewerName",
      reviewer.email AS "reviewerEmail",
      tvt.submitted_at AS "submittedAt",
      tvt.reviewed_at AS "reviewedAt",
      tvt.quality_snapshot AS "qualitySnapshot",
      tvt.created_at AS "createdAt",
      tvt.updated_at AS "updatedAt",
      COALESCE(
        json_agg(json_build_object(
          'testSectionId', tst.test_section_id,
          'name', tst.name,
          'sectionKey', section.section_key,
          'sortOrder', section.sort_order
        ) ORDER BY section.sort_order) FILTER (WHERE tst.id IS NOT NULL),
        '[]'::json
      ) AS sections
    FROM assessment.test_version_translations tvt
    JOIN catalog.languages l ON l.id = tvt.language_id
    LEFT JOIN identity.users translator ON translator.id = tvt.translator_user_id
    LEFT JOIN identity.users reviewer ON reviewer.id = tvt.reviewer_user_id
    LEFT JOIN assessment.test_sections section ON section.test_version_id = tvt.test_version_id
    LEFT JOIN assessment.test_section_translations tst
      ON tst.test_section_id = section.id
     AND tst.language_id = tvt.language_id
    WHERE tvt.test_version_id = ${testVersionId}::uuid
      AND lower(l.code) = ${languageCode.toLowerCase()}
    GROUP BY tvt.id, translator.id, reviewer.id
    LIMIT 1
  `;
  const target = targetRows[0] ?? null;

  const readiness = await evaluateTestLocalizationReadiness({
    testVersionId,
    examVersionId: String(source.examVersionId),
    settings: source.settings,
    client,
  });

  const history = target
    ? await client`
        SELECT
          ae.id::text AS id,
          ae.action_key AS "actionKey",
          ae.reason,
          ae.summary,
          ae.metadata,
          ae.occurred_at AS "occurredAt",
          ae.actor_user_id::text AS "actorUserId",
          actor.display_name AS "actorName",
          actor.email AS "actorEmail"
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE ae.entity_type = 'test_translation'
          AND ae.entity_id = ${String(target.id)}::uuid
        ORDER BY ae.occurred_at DESC, ae.id DESC
        LIMIT 200
      `
    : [];

  return { source, language, target, readiness, history };
}

router.use(authenticate);

router.get(
  "/tests/:testVersionId/languages/:languageCode",
  requireAdminPermission("content.translations.read"),
  async (req, res) => {
    try {
      const testVersionId = asText(req.params.testVersionId);
      const languageCode = asText(req.params.languageCode).toLowerCase();
      if (!isUuid(testVersionId)) throw new TranslationOperationsError("INVALID_TEST_VERSION_ID", "Invalid test version identifier.");
      res.json(await loadTestTranslationDetail(testVersionId, languageCode));
    } catch (error) {
      sendError(res, error, "Unable to load test translation detail");
    }
  },
);

router.put(
  "/tests/:testVersionId/languages/:languageCode",
  requireAdminPermission("content.translations.update"),
  async (req, res) => {
    try {
      const testVersionId = asText(req.params.testVersionId);
      const languageCode = asText(req.params.languageCode).toLowerCase();
      if (!isUuid(testVersionId)) throw new TranslationOperationsError("INVALID_TEST_VERSION_ID", "Invalid test version identifier.");
      if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(languageCode) || languageCode === "en") {
        throw new TranslationOperationsError("INVALID_TARGET_LANGUAGE", "Select a supported non-English target language.");
      }
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const title = asText(req.body?.title);
      const description = asText(req.body?.description);
      const instructions = asRecord(req.body?.instructions);
      const reason = requireReason(req.body?.reason, "test translation reason");
      const sections = Array.isArray(req.body?.sections)
        ? req.body.sections.map((entry: unknown) => {
            const record = asRecord(entry);
            const testSectionId = asText(record.testSectionId);
            const name = asText(record.name);
            if (!isUuid(testSectionId) || !name || name.length > 255) {
              throw new TranslationOperationsError("INVALID_TEST_SECTION_TRANSLATION", "Every translated section requires a valid section and name.");
            }
            return { testSectionId, name };
          })
        : [];
      if (!title || title.length > 255 || description.length > 20_000) {
        throw new TranslationOperationsError("INVALID_TEST_TRANSLATION", "Translated title is required; title and description exceed allowed length.");
      }
      if (new Set(sections.map((section) => section.testSectionId)).size !== sections.length) {
        throw new TranslationOperationsError("DUPLICATE_TEST_SECTION_TRANSLATION", "Each test section may be translated once.");
      }

      const translationId = await sqlClient.begin(async (tx) => {
        const sourceRows = await tx`
          SELECT
            tv.id::text AS "testVersionId",
            tv.test_id::text AS "testId",
            tv.settings,
            t.public_code AS "publicCode",
            t.exam_version_id::text AS "examVersionId",
            COALESCE(array_agg(section.id::text ORDER BY section.sort_order)
              FILTER (WHERE section.id IS NOT NULL), ARRAY[]::text[]) AS "sectionIds"
          FROM assessment.test_versions tv
          JOIN assessment.tests t ON t.id = tv.test_id
          LEFT JOIN assessment.test_sections section ON section.test_version_id = tv.id
          WHERE tv.id = ${testVersionId}::uuid
            AND t.deleted_at IS NULL
          GROUP BY tv.id, t.id
          FOR UPDATE OF tv
        `;
        const source = sourceRows[0];
        if (!source) throw new TranslationOperationsError("TEST_VERSION_NOT_FOUND", "Test version not found.", 404);
        const sourceSectionIds = Array.isArray(source.sectionIds) ? source.sectionIds.map(String) : [];
        if (sections.length !== sourceSectionIds.length || sections.some((section) => !sourceSectionIds.includes(section.testSectionId))) {
          throw new TranslationOperationsError("TEST_SECTION_TRANSLATION_INCOMPLETE", "Translate every current test section exactly once.", 409);
        }
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
        if (!languageId) throw new TranslationOperationsError("LANGUAGE_NOT_ALLOWED_FOR_EXAM", "Language is not active for this exam version.", 409);

        const qualitySnapshot = {
          titlePresent: true,
          sectionCount: sourceSectionIds.length,
          translatedSectionCount: sections.length,
          errorCount: 0,
          warningCount: 0,
          score: 100,
        };
        const savedRows = await tx`
          INSERT INTO assessment.test_version_translations (
            test_version_id, language_id, title, description, instructions, status,
            translator_user_id, reviewer_user_id, submitted_at, reviewed_at,
            quality_snapshot, created_at, updated_at
          ) VALUES (
            ${testVersionId}::uuid, ${languageId}::uuid, ${title}, ${description},
            ${JSON.stringify(instructions)}::jsonb, 'draft', ${actorUserId}::uuid,
            NULL, NULL, NULL, ${JSON.stringify(qualitySnapshot)}::jsonb, now(), now()
          )
          ON CONFLICT (test_version_id, language_id)
          DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            instructions = EXCLUDED.instructions,
            status = CASE
              WHEN assessment.test_version_translations.status IN ('approved', 'in_review', 'rejected', 'archived') THEN 'draft'
              ELSE assessment.test_version_translations.status
            END,
            translator_user_id = COALESCE(assessment.test_version_translations.translator_user_id, EXCLUDED.translator_user_id),
            submitted_at = NULL,
            reviewer_user_id = CASE
              WHEN assessment.test_version_translations.status = 'approved' THEN NULL
              ELSE assessment.test_version_translations.reviewer_user_id
            END,
            reviewed_at = NULL,
            quality_snapshot = EXCLUDED.quality_snapshot,
            updated_at = now()
          RETURNING id::text AS id, status
        `;
        const saved = savedRows[0];
        const id = String(saved.id);
        for (const section of sections) {
          await tx`
            INSERT INTO assessment.test_section_translations (
              test_section_id, language_id, name, created_at, updated_at
            ) VALUES (
              ${section.testSectionId}::uuid, ${languageId}::uuid, ${section.name}, now(), now()
            )
            ON CONFLICT (test_section_id, language_id)
            DO UPDATE SET name = EXCLUDED.name, updated_at = now()
          `;
        }
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "assessment.test_translation.saved",
          entityId: id,
          entityVersionId: testVersionId,
          reason,
          summary: `${languageCode.toUpperCase()} test translation saved for ${source.publicCode}`,
          metadata: { languageCode, title, sectionCount: sections.length, status: saved.status },
        });
        return id;
      });
      res.json({ translationId, detail: await loadTestTranslationDetail(testVersionId, languageCode) });
    } catch (error) {
      sendError(res, error, "Unable to save test translation");
    }
  },
);

router.post(
  "/test-translations/:translationId/assignment",
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
      if (translatorUserId && reviewerUserId && translatorUserId === reviewerUserId) {
        throw new TranslationOperationsError("TRANSLATION_ROLE_CONFLICT", "Translator and reviewer should be different administrators.", 409);
      }
      await sqlClient.begin(async (tx) => {
        await assertActiveAdmin(tx, translatorUserId);
        await assertActiveAdmin(tx, reviewerUserId);
        const rows = await tx`
          SELECT id::text AS id, test_version_id::text AS "testVersionId",
            translator_user_id::text AS "beforeTranslatorUserId",
            reviewer_user_id::text AS "beforeReviewerUserId"
          FROM assessment.test_version_translations
          WHERE id = ${translationId}::uuid
          FOR UPDATE
        `;
        const before = rows[0];
        if (!before) throw new TranslationOperationsError("TRANSLATION_NOT_FOUND", "Test translation not found.", 404);
        await tx`
          UPDATE assessment.test_version_translations
          SET translator_user_id = ${translatorUserId}::uuid,
              reviewer_user_id = ${reviewerUserId}::uuid,
              updated_at = now()
          WHERE id = ${translationId}::uuid
        `;
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "assessment.test_translation.assignment.changed",
          entityId: translationId,
          entityVersionId: String(before.testVersionId),
          reason,
          summary: "Test translation assignment updated",
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
      sendError(res, error, "Unable to update test translation assignment");
    }
  },
);

router.post(
  "/test-translations/:translationId/transition",
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
        const rows = await tx`
          SELECT
            tvt.id::text AS id,
            tvt.test_version_id::text AS "testVersionId",
            tvt.status,
            tvt.translator_user_id::text AS "translatorUserId",
            tvt.reviewer_user_id::text AS "reviewerUserId",
            lower(l.code) AS "languageCode",
            t.exam_version_id::text AS "examVersionId",
            tv.settings,
            t.public_code AS "publicCode"
          FROM assessment.test_version_translations tvt
          JOIN catalog.languages l ON l.id = tvt.language_id
          JOIN assessment.test_versions tv ON tv.id = tvt.test_version_id
          JOIN assessment.tests t ON t.id = tv.test_id
          WHERE tvt.id = ${translationId}::uuid
          FOR UPDATE OF tvt
        `;
        const current = rows[0];
        if (!current) throw new TranslationOperationsError("TRANSLATION_NOT_FOUND", "Test translation not found.", 404);
        const sourceStatus = String(current.status);
        assertTranslationTransition(sourceStatus, targetStatus);
        if (targetStatus === "approved") {
          const assignedReviewer = asText(current.reviewerUserId);
          if (assignedReviewer && assignedReviewer !== actorUserId && req.adminSession?.effectiveRoleKey !== "super_admin") {
            throw new TranslationOperationsError("TRANSLATION_REVIEWER_MISMATCH", "Only the assigned reviewer can approve this test translation.", 403);
          }
          if (asText(current.translatorUserId) === actorUserId && req.adminSession?.effectiveRoleKey !== "super_admin") {
            throw new TranslationOperationsError("TRANSLATION_SELF_APPROVAL_BLOCKED", "A translator cannot approve their own test translation.", 409);
          }
        }
        await tx`
          UPDATE assessment.test_version_translations
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
              updated_at = now()
          WHERE id = ${translationId}::uuid
        `;
        const readiness = await evaluateTestLocalizationReadiness({
          testVersionId: String(current.testVersionId),
          examVersionId: String(current.examVersionId),
          settings: current.settings,
          client: tx,
        });
        if (targetStatus === "approved") {
          const language = readiness.languages.find((entry) => entry.languageCode === String(current.languageCode));
          if (!language?.complete) {
            throw new TranslationOperationsError(
              "TEST_TRANSLATION_QUALITY_GATE_BLOCKED",
              `Complete all ${String(current.languageCode)} test and question translations before approval.`,
              409,
              readiness,
            );
          }
        }
        await tx`
          UPDATE assessment.test_version_translations
          SET quality_snapshot = ${JSON.stringify(readiness)}::jsonb
          WHERE id = ${translationId}::uuid
        `;
        await writeAudit(tx, {
          actorUserId,
          effectiveRoleKey: req.adminSession?.effectiveRoleKey ?? null,
          actionKey: "assessment.test_translation.status.changed",
          entityId: translationId,
          entityVersionId: String(current.testVersionId),
          reason,
          summary: `Test translation moved from ${sourceStatus} to ${targetStatus}`,
          metadata: {
            from: sourceStatus,
            to: targetStatus,
            languageCode: current.languageCode,
            readiness,
            superAdminOverride:
              targetStatus === "approved"
              && asText(current.translatorUserId) === actorUserId
              && req.adminSession?.effectiveRoleKey === "super_admin",
          },
        });
        return { testVersionId: String(current.testVersionId), languageCode: String(current.languageCode), readiness };
      });
      res.json({
        translationId,
        status: targetStatus,
        readiness: result.readiness,
        detail: await loadTestTranslationDetail(result.testVersionId, result.languageCode),
      });
    } catch (error) {
      sendError(res, error, "Unable to transition test translation");
    }
  },
);

export default router;
