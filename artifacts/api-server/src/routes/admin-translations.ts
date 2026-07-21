import { Router, type Response } from "express";

import {
  TranslationOperationsError,
  evaluateTranslationQuality,
  languageCodesFromSettings,
  type TranslationOptionInput,
  type TranslationTermRule,
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

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TranslationOperationsError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

export async function loadQuestionTranslationDetail(
  questionVersionId: string,
  languageCode: string,
  client: SqlExecutor = sqlClient,
) {
  const sourceRows = await client`
    SELECT
      qv.id::text AS "questionVersionId",
      qv.question_id::text AS "questionId",
      q.public_code AS "publicCode",
      q.status::text AS "questionStatus",
      qv.version_number AS "versionNumber",
      qv.exam_version_id::text AS "examVersionId",
      qv.question_type AS "questionType",
      qv.difficulty,
      qv.stem,
      qv.explanation,
      qv.answer_model AS "answerModel",
      qv.created_at AS "sourceCreatedAt",
      e.code AS "examCode",
      e.name AS "examName",
      ev.name AS "examVersionName",
      tn.id::text AS "taxonomyNodeId",
      tn.code AS "taxonomyCode",
      tn.name AS "taxonomyName",
      COALESCE(
        json_agg(
          json_build_object(
            'key', qo.option_key,
            'text', qo.text,
            'sortOrder', qo.sort_order,
            'isCorrect', qo.is_correct
          ) ORDER BY qo.sort_order
        ) FILTER (WHERE qo.id IS NOT NULL),
        '[]'::json
      ) AS options
    FROM content.question_versions qv
    JOIN content.questions q ON q.id = qv.question_id
    LEFT JOIN catalog.exam_versions ev ON ev.id = qv.exam_version_id
    LEFT JOIN catalog.exams e ON e.id = ev.exam_id
    LEFT JOIN catalog.taxonomy_nodes tn ON tn.id = q.primary_taxonomy_node_id
    LEFT JOIN content.question_options qo ON qo.question_version_id = qv.id
    WHERE qv.id = ${questionVersionId}::uuid
      AND q.deleted_at IS NULL
    GROUP BY qv.id, q.id, e.id, ev.id, tn.id
    LIMIT 1
  `;
  const source = sourceRows[0];
  if (!source) {
    throw new TranslationOperationsError("QUESTION_VERSION_NOT_FOUND", "Question version not found.", 404);
  }

  const languageRows = await client`
    SELECT
      l.id::text AS id,
      l.code,
      l.name,
      l.native_name AS "nativeName",
      l.direction,
      l.script_code AS "scriptCode",
      l.is_active AS "isActive"
    FROM catalog.languages l
    WHERE lower(l.code) = ${languageCode.toLowerCase()}
    LIMIT 1
  `;
  const language = languageRows[0];
  if (!language) {
    throw new TranslationOperationsError("LANGUAGE_NOT_FOUND", "Target language not found.", 404);
  }

  const targetRows = await client`
    SELECT
      qt.id::text AS id,
      qt.question_version_id::text AS "questionVersionId",
      qt.language_id::text AS "languageId",
      qt.stem,
      qt.explanation,
      qt.status,
      qt.translator_user_id::text AS "translatorUserId",
      translator.display_name AS "translatorName",
      translator.email AS "translatorEmail",
      qt.reviewer_user_id::text AS "reviewerUserId",
      reviewer.display_name AS "reviewerName",
      reviewer.email AS "reviewerEmail",
      qt.submitted_at AS "submittedAt",
      qt.reviewed_at AS "reviewedAt",
      qt.quality_snapshot AS "qualitySnapshot",
      qt.created_at AS "createdAt",
      qt.updated_at AS "updatedAt",
      COALESCE(
        json_agg(
          json_build_object(
            'key', qto.option_key,
            'text', qto.text,
            'sortOrder', qto.sort_order
          ) ORDER BY qto.sort_order
        ) FILTER (WHERE qto.id IS NOT NULL),
        '[]'::json
      ) AS options
    FROM content.question_translations qt
    JOIN catalog.languages l ON l.id = qt.language_id
    LEFT JOIN identity.users translator ON translator.id = qt.translator_user_id
    LEFT JOIN identity.users reviewer ON reviewer.id = qt.reviewer_user_id
    LEFT JOIN content.question_translation_options qto ON qto.question_translation_id = qt.id
    WHERE qt.question_version_id = ${questionVersionId}::uuid
      AND lower(l.code) = ${languageCode.toLowerCase()}
    GROUP BY qt.id, translator.id, reviewer.id
    LIMIT 1
  `;
  const target = targetRows[0] ?? null;

  const termRows = await client`
    SELECT
      tt.id::text AS id,
      tt.source_text AS "sourceText",
      tt.preferred_text AS "preferredText",
      tt.forbidden_variants AS "forbiddenVariants",
      tt.context_note AS "contextNote",
      tt.scope_taxonomy_node_id::text AS "scopeTaxonomyNodeId",
      tn.code AS "scopeTaxonomyCode",
      tn.name AS "scopeTaxonomyName",
      tt.is_active AS "isActive",
      tt.updated_at AS "updatedAt"
    FROM content.translation_terms tt
    JOIN catalog.languages l ON l.id = tt.language_id
    LEFT JOIN catalog.taxonomy_nodes tn ON tn.id = tt.scope_taxonomy_node_id
    WHERE lower(l.code) = ${languageCode.toLowerCase()}
      AND tt.is_active = true
      AND (
        tt.scope_taxonomy_node_id IS NULL
        OR tt.scope_taxonomy_node_id = ${source.taxonomyNodeId ?? null}::uuid
      )
    ORDER BY length(tt.source_text) DESC, lower(tt.source_text)
  `;

  const historyRows = target
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
        WHERE ae.entity_type = 'question_translation'
          AND ae.entity_id = ${String(target.id)}::uuid
        ORDER BY ae.occurred_at DESC, ae.id DESC
        LIMIT 200
      `
    : [];

  const quality = target
    ? evaluateTranslationQuality({
        source: {
          stem: String(source.stem),
          explanation: String(source.explanation),
          options: asOptions(source.options),
        },
        target: {
          stem: String(target.stem),
          explanation: String(target.explanation),
          options: asOptions(target.options),
        },
        languageCode,
        terms: asTermRules(termRows),
      })
    : null;

  return {
    source: { ...source, options: asOptions(source.options) },
    language,
    target: target ? { ...target, options: asOptions(target.options) } : null,
    terms: termRows,
    quality,
    history: historyRows,
  };
}

async function loadOverview(client: SqlExecutor = sqlClient) {
  const [languageRows, queueRows, examMappingRows, reviewerRows, termRows, testRows, testTranslationRows] = await Promise.all([
    client`
      WITH source_versions AS (
        SELECT
          q.id AS question_id,
          COALESCE(q.published_version_id, q.approved_version_id) AS question_version_id,
          qv.exam_version_id
        FROM content.questions q
        JOIN content.question_versions qv
          ON qv.id = COALESCE(q.published_version_id, q.approved_version_id)
        WHERE q.deleted_at IS NULL
          AND q.status IN ('approved'::question_status, 'published'::question_status)
      ), eligible AS (
        SELECT sv.question_version_id, l.id AS language_id, lower(l.code) AS language_code
        FROM source_versions sv
        JOIN catalog.exam_version_languages evl ON evl.exam_version_id = sv.exam_version_id
        JOIN catalog.languages l ON l.id = evl.language_id
        WHERE l.is_active = true
      )
      SELECT
        l.id::text AS id,
        lower(l.code) AS code,
        l.name,
        l.native_name AS "nativeName",
        l.direction,
        l.script_code AS "scriptCode",
        l.fallback_language_id::text AS "fallbackLanguageId",
        l.is_active AS "isActive",
        COUNT(DISTINCT e.question_version_id)::int AS "eligibleQuestionCount",
        COUNT(DISTINCT qt.question_version_id)::int AS "translatedQuestionCount",
        COUNT(DISTINCT qt.question_version_id) FILTER (WHERE qt.status = 'approved')::int AS "approvedQuestionCount",
        COUNT(DISTINCT qt.question_version_id) FILTER (WHERE qt.status = 'in_review')::int AS "inReviewQuestionCount",
        COUNT(DISTINCT qt.question_version_id) FILTER (WHERE qt.status = 'needs_fix')::int AS "needsFixQuestionCount",
        COUNT(DISTINCT evl.exam_version_id)::int AS "examVersionCount"
      FROM catalog.languages l
      LEFT JOIN eligible e ON e.language_id = l.id
      LEFT JOIN content.question_translations qt
        ON qt.question_version_id = e.question_version_id
       AND qt.language_id = l.id
      LEFT JOIN catalog.exam_version_languages evl ON evl.language_id = l.id
      GROUP BY l.id
      ORDER BY CASE lower(l.code) WHEN 'en' THEN 0 WHEN 'hi' THEN 1 WHEN 'pa' THEN 2 ELSE 10 END, l.name
    `,
    client`
      WITH source_versions AS (
        SELECT
          q.id AS question_id,
          q.public_code,
          q.status,
          q.primary_taxonomy_node_id,
          COALESCE(q.published_version_id, q.approved_version_id) AS question_version_id
        FROM content.questions q
        WHERE q.deleted_at IS NULL
          AND q.status IN ('approved'::question_status, 'published'::question_status)
          AND COALESCE(q.published_version_id, q.approved_version_id) IS NOT NULL
      )
      SELECT
        sv.question_id::text AS "questionId",
        sv.question_version_id::text AS "questionVersionId",
        sv.public_code AS "publicCode",
        sv.status::text AS "questionStatus",
        qv.version_number AS "versionNumber",
        qv.stem AS "sourceStem",
        qv.difficulty,
        qv.question_type AS "questionType",
        ev.id::text AS "examVersionId",
        ev.name AS "examVersionName",
        e.code AS "examCode",
        e.name AS "examName",
        tn.id::text AS "taxonomyNodeId",
        tn.code AS "taxonomyCode",
        tn.name AS "taxonomyName",
        l.id::text AS "languageId",
        lower(l.code) AS "languageCode",
        l.name AS "languageName",
        l.native_name AS "languageNativeName",
        qt.id::text AS "translationId",
        COALESCE(qt.status, 'missing') AS status,
        qt.translator_user_id::text AS "translatorUserId",
        translator.display_name AS "translatorName",
        qt.reviewer_user_id::text AS "reviewerUserId",
        reviewer.display_name AS "reviewerName",
        qt.submitted_at AS "submittedAt",
        qt.reviewed_at AS "reviewedAt",
        qt.updated_at AS "updatedAt",
        qt.quality_snapshot AS "qualitySnapshot",
        (SELECT COUNT(*)::int FROM content.question_options qo WHERE qo.question_version_id = qv.id) AS "sourceOptionCount",
        (SELECT COUNT(*)::int FROM content.question_translation_options qto WHERE qto.question_translation_id = qt.id) AS "translatedOptionCount"
      FROM source_versions sv
      JOIN content.question_versions qv ON qv.id = sv.question_version_id
      JOIN catalog.exam_versions ev ON ev.id = qv.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_version_languages evl ON evl.exam_version_id = ev.id
      JOIN catalog.languages l ON l.id = evl.language_id AND l.is_active = true AND lower(l.code) <> 'en'
      LEFT JOIN catalog.taxonomy_nodes tn ON tn.id = sv.primary_taxonomy_node_id
      LEFT JOIN content.question_translations qt
        ON qt.question_version_id = qv.id
       AND qt.language_id = l.id
      LEFT JOIN identity.users translator ON translator.id = qt.translator_user_id
      LEFT JOIN identity.users reviewer ON reviewer.id = qt.reviewer_user_id
      ORDER BY
        CASE COALESCE(qt.status, 'missing')
          WHEN 'needs_fix' THEN 0
          WHEN 'in_review' THEN 1
          WHEN 'missing' THEN 2
          WHEN 'draft' THEN 3
          WHEN 'rejected' THEN 4
          WHEN 'approved' THEN 5
          ELSE 6
        END,
        qt.updated_at DESC NULLS LAST,
        sv.public_code,
        lower(l.code)
      LIMIT 1000
    `,
    client`
      SELECT
        ev.id::text AS "examVersionId",
        ev.name AS "examVersionName",
        ev.version_number AS "versionNumber",
        ev.is_current AS "isCurrent",
        e.id::text AS "examId",
        e.code AS "examCode",
        e.name AS "examName",
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'code', lower(l.code),
              'name', l.name,
              'nativeName', l.native_name,
              'isPrimary', evl.is_primary,
              'isActive', l.is_active
            ) ORDER BY evl.is_primary DESC, l.name
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::json
        ) AS languages
      FROM catalog.exam_versions ev
      JOIN catalog.exams e ON e.id = ev.exam_id
      LEFT JOIN catalog.exam_version_languages evl ON evl.exam_version_id = ev.id
      LEFT JOIN catalog.languages l ON l.id = evl.language_id
      GROUP BY ev.id, e.id
      ORDER BY e.name, ev.version_number DESC
    `,
    client`
      SELECT DISTINCT
        u.id::text AS id,
        u.display_name AS "displayName",
        u.email,
        ap.department,
        ap.title,
        COALESCE(
          array_agg(DISTINCT p.key) FILTER (WHERE p.key LIKE 'content.translations.%'),
          ARRAY[]::varchar[]
        ) AS permissions
      FROM identity.users u
      JOIN identity.admin_profiles ap ON ap.user_id = u.id
      LEFT JOIN identity.user_roles ur
        ON ur.user_id = u.id
       AND ur.revoked_at IS NULL
       AND (ur.expires_at IS NULL OR ur.expires_at > now())
      LEFT JOIN identity.role_permissions rp ON rp.role_id = ur.role_id
      LEFT JOIN identity.permissions p ON p.id = rp.permission_id
      WHERE u.status = 'active'::user_status
        AND u.deleted_at IS NULL
        AND ap.is_suspended = false
      GROUP BY u.id, ap.user_id
      HAVING bool_or(p.key IN ('content.translations.update', 'content.translations.review'))
      ORDER BY u.display_name, u.email
    `,
    client`
      SELECT
        tt.id::text AS id,
        tt.source_text AS "sourceText",
        l.id::text AS "languageId",
        lower(l.code) AS "languageCode",
        l.name AS "languageName",
        l.native_name AS "languageNativeName",
        tt.preferred_text AS "preferredText",
        tt.forbidden_variants AS "forbiddenVariants",
        tt.context_note AS "contextNote",
        tt.scope_taxonomy_node_id::text AS "scopeTaxonomyNodeId",
        tn.code AS "scopeTaxonomyCode",
        tn.name AS "scopeTaxonomyName",
        tt.is_active AS "isActive",
        tt.created_at AS "createdAt",
        tt.updated_at AS "updatedAt"
      FROM content.translation_terms tt
      JOIN catalog.languages l ON l.id = tt.language_id
      LEFT JOIN catalog.taxonomy_nodes tn ON tn.id = tt.scope_taxonomy_node_id
      ORDER BY tt.is_active DESC, l.name, lower(tt.source_text)
      LIMIT 2000
    `,
    client`
      SELECT
        t.id::text AS "testId",
        t.public_code AS "publicCode",
        t.status::text AS status,
        t.exam_version_id::text AS "examVersionId",
        v.id::text AS "testVersionId",
        v.version_number AS "versionNumber",
        v.title,
        v.settings,
        v.created_at AS "createdAt",
        e.code AS "examCode",
        e.name AS "examName",
        ev.name AS "examVersionName",
        (SELECT COUNT(*)::int FROM assessment.test_sections s WHERE s.test_version_id = v.id) AS "sectionCount",
        (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = v.id) AS "questionCount"
      FROM assessment.tests t
      JOIN assessment.test_versions v
        ON v.id = COALESCE(t.current_draft_version_id, t.published_version_id)
      JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      WHERE t.deleted_at IS NULL
      ORDER BY t.updated_at DESC
      LIMIT 300
    `,
    client`
      SELECT
        tvt.id::text AS id,
        tvt.test_version_id::text AS "testVersionId",
        lower(l.code) AS "languageCode",
        l.name AS "languageName",
        tvt.status,
        tvt.title,
        tvt.translator_user_id::text AS "translatorUserId",
        translator.display_name AS "translatorName",
        tvt.reviewer_user_id::text AS "reviewerUserId",
        reviewer.display_name AS "reviewerName",
        tvt.updated_at AS "updatedAt",
        tvt.quality_snapshot AS "qualitySnapshot",
        (SELECT COUNT(*)::int FROM assessment.test_section_translations tst
          JOIN assessment.test_sections s ON s.id = tst.test_section_id
          WHERE s.test_version_id = tvt.test_version_id AND tst.language_id = tvt.language_id) AS "translatedSectionCount"
      FROM assessment.test_version_translations tvt
      JOIN catalog.languages l ON l.id = tvt.language_id
      LEFT JOIN identity.users translator ON translator.id = tvt.translator_user_id
      LEFT JOIN identity.users reviewer ON reviewer.id = tvt.reviewer_user_id
      ORDER BY tvt.updated_at DESC
    `,
  ]);

  const testTranslationMap = new Map<string, Record<string, unknown>>();
  for (const row of testTranslationRows) {
    testTranslationMap.set(`${String(row.testVersionId)}:${String(row.languageCode)}`, row as Record<string, unknown>);
  }
  const tests = testRows.map((row) => {
    const settings = row.settings;
    const languageCodes = languageCodesFromSettings(settings);
    const languages = languageCodes.map((languageCode) => {
      if (languageCode === "en") {
        return {
          languageCode,
          status: "source",
          complete: true,
          translatedSectionCount: Number(row.sectionCount ?? 0),
          sectionCount: Number(row.sectionCount ?? 0),
        };
      }
      const translation = testTranslationMap.get(`${String(row.testVersionId)}:${languageCode}`);
      const translatedSectionCount = Number(translation?.translatedSectionCount ?? 0);
      const sectionCount = Number(row.sectionCount ?? 0);
      return {
        languageCode,
        status: String(translation?.status ?? "missing"),
        complete: String(translation?.status ?? "") === "approved" && translatedSectionCount === sectionCount,
        translatedSectionCount,
        sectionCount,
        translation: translation ?? null,
      };
    });
    return {
      ...row,
      languageCodes,
      languages,
      localizationReady: languages.every((entry) => entry.complete),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    languages: languageRows.map((row) => {
      const code = String(row.code);
      const eligibleQuestionCount = Number(row.eligibleQuestionCount ?? 0);
      const sourceLanguage = code === "en";
      const approvedQuestionCount = sourceLanguage ? eligibleQuestionCount : Number(row.approvedQuestionCount ?? 0);
      return {
        ...row,
        eligibleQuestionCount,
        translatedQuestionCount: sourceLanguage ? eligibleQuestionCount : Number(row.translatedQuestionCount ?? 0),
        approvedQuestionCount,
        inReviewQuestionCount: sourceLanguage ? 0 : Number(row.inReviewQuestionCount ?? 0),
        needsFixQuestionCount: sourceLanguage ? 0 : Number(row.needsFixQuestionCount ?? 0),
        examVersionCount: Number(row.examVersionCount ?? 0),
        completionPercent: eligibleQuestionCount === 0 ? 0 : Math.round((approvedQuestionCount / eligibleQuestionCount) * 100),
        sourceLanguage,
      };
    }),
    queue: queueRows,
    examMappings: examMappingRows,
    reviewers: reviewerRows,
    terms: termRows,
    tests,
    metrics: {
      eligiblePairs: queueRows.length,
      missing: queueRows.filter((row) => String(row.status) === "missing").length,
      draft: queueRows.filter((row) => String(row.status) === "draft").length,
      inReview: queueRows.filter((row) => String(row.status) === "in_review").length,
      needsFix: queueRows.filter((row) => String(row.status) === "needs_fix").length,
      approved: queueRows.filter((row) => String(row.status) === "approved").length,
      testsBlocked: tests.filter((test) => !test.localizationReady).length,
    },
  };
}

router.use(authenticate);

router.get(
  "/overview",
  requireAdminPermission("content.translations.read"),
  async (_req, res) => {
    try {
      res.json(await loadOverview());
    } catch (error) {
      sendError(res, error, "Unable to load canonical translation operations");
    }
  },
);

router.get(
  "/questions/:questionVersionId/languages/:languageCode",
  requireAdminPermission("content.translations.read"),
  async (req, res) => {
    try {
      const questionVersionId = asText(req.params.questionVersionId);
      const languageCode = asText(req.params.languageCode).toLowerCase();
      if (!isUuid(questionVersionId)) {
        throw new TranslationOperationsError("INVALID_QUESTION_VERSION_ID", "Invalid question version identifier.");
      }
      if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(languageCode)) {
        throw new TranslationOperationsError("INVALID_LANGUAGE_CODE", "Invalid language code.");
      }
      res.json(await loadQuestionTranslationDetail(questionVersionId, languageCode));
    } catch (error) {
      sendError(res, error, "Unable to load question translation detail");
    }
  },
);

export default router;
