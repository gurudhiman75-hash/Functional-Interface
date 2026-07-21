import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  TranslationOperationsError,
  normalizeLanguageConfiguration,
} from "../lib/admin-translation-operations";
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
  entityType: string;
  entityId: string;
  entityVersionId?: string | null;
  reason: string;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
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
      ${input.entityType},
      ${input.entityId}::uuid,
      ${input.entityVersionId ?? null}::uuid,
      ${input.reason},
      ${input.summary},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `;
}

router.use(authenticate);

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
        if (config.fallbackLanguageId) {
          if (!isUuid(config.fallbackLanguageId)) {
            throw new TranslationOperationsError("INVALID_FALLBACK_LANGUAGE", "Invalid fallback language identifier.");
          }
          const fallbackRows = await tx`
            SELECT id::text AS id
            FROM catalog.languages
            WHERE id = ${config.fallbackLanguageId}::uuid
              AND is_active = true
            LIMIT 1
          `;
          if (!fallbackRows[0]) {
            throw new TranslationOperationsError("FALLBACK_LANGUAGE_NOT_FOUND", "Fallback language is unavailable.", 404);
          }
        }
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

        const requestedIds = entries.map((entry) => entry.languageId);
        const activeRows = await tx`
          WITH requested AS (
            SELECT value::uuid AS id
            FROM jsonb_array_elements_text(${tx.json(requestedIds)}::jsonb)
          )
          SELECT l.id::text AS id
          FROM requested r
          JOIN catalog.languages l ON l.id = r.id
          WHERE l.is_active = true
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

router.put(
  "/tests/:testVersionId/languages/:languageCode",
  requireAdminPermission("content.translations.update"),
  async (req, res, next) => {
    const testVersionId = asText(req.params.testVersionId);
    const languageCode = asText(req.params.languageCode).toLowerCase();
    if (!isUuid(testVersionId) || languageCode === "en") {
      next();
      return;
    }
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new TranslationOperationsError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(languageCode)) {
        throw new TranslationOperationsError("INVALID_TARGET_LANGUAGE", "Select a supported non-English target language.");
      }
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
        throw new TranslationOperationsError("INVALID_TEST_TRANSLATION", "Translated title is required and title/description must stay within allowed length.");
      }
      if (new Set(sections.map((section) => section.testSectionId)).size !== sections.length) {
        throw new TranslationOperationsError("DUPLICATE_TEST_SECTION_TRANSLATION", "Each test section may be translated once.");
      }

      const translationId = await sqlClient.begin(async (tx) => {
        const sourceRows = await tx`
          SELECT tv.id::text AS "testVersionId", tv.test_id::text AS "testId",
            t.public_code AS "publicCode", t.exam_version_id::text AS "examVersionId"
          FROM assessment.test_versions tv
          JOIN assessment.tests t ON t.id = tv.test_id
          WHERE tv.id = ${testVersionId}::uuid
            AND t.deleted_at IS NULL
          FOR UPDATE OF tv
        `;
        const source = sourceRows[0];
        if (!source) throw new TranslationOperationsError("TEST_VERSION_NOT_FOUND", "Test version not found.", 404);

        const sourceSectionRows = await tx`
          SELECT id::text AS id
          FROM assessment.test_sections
          WHERE test_version_id = ${testVersionId}::uuid
          ORDER BY sort_order
        `;
        const sourceSectionIds = sourceSectionRows.map((row) => String(row.id));
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
          entityType: "test_translation",
          entityId: id,
          entityVersionId: testVersionId,
          reason,
          summary: `${languageCode.toUpperCase()} test translation saved for ${source.publicCode}`,
          metadata: { languageCode, title, sectionCount: sections.length, status: saved.status },
        });
        return id;
      });
      res.json({ translationId });
    } catch (error) {
      sendError(res, error, "Unable to save test translation");
    }
  },
);

export default router;
