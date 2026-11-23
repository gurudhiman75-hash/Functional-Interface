import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { likePattern, normalizePickerQuery } from "../lib/admin-test-question-picker";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
router.use(authenticate);

/**
 * GET /api/admin/tests/question-picker
 * Paged, server-side search of questions that may be placed in a test.
 * Eligibility matches the existing draft-selectable inventory: published
 * test-eligible versions, plus approved versions (bank-only items are marked).
 */
router.get("/question-picker", requireAdminPermission("tests.read"), async (req, res) => {
  const f = normalizePickerQuery(req.query as Record<string, unknown>);
  const sql = sqlClient;
  try {
    const rows = await sql`
      WITH RECURSIVE descendants(id) AS (
        SELECT unnest(${f.taxonomyNodeIds}::uuid[])
        UNION
        SELECT edge.child_id
        FROM catalog.taxonomy_edges edge
        JOIN descendants parent ON parent.id = edge.parent_id
      ),
      eligible AS (
        SELECT q.id AS root_question_id, q.public_code, q.status, q.published_at, q.updated_at, v.*
        FROM content.questions q
        JOIN content.question_versions v ON v.id = CASE
          WHEN q.status = 'approved'::question_status THEN q.approved_version_id
          ELSE q.published_version_id END
        WHERE q.deleted_at IS NULL
          AND (
            (q.status = 'published'::question_status
              AND COALESCE(v.answer_model #>> '{generation,questionBankAcceptanceMode}', '') <> 'BANK_ONLY'
              AND COALESCE(v.answer_model #>> '{generation,testEligible}', 'true') <> 'false'
              AND COALESCE(v.answer_model #>> '{generation,publiclyPublishable}', 'true') <> 'false')
            OR q.status = 'approved'::question_status
          )
      ),
      usage AS (
        SELECT tq.question_version_id, COUNT(DISTINCT t.id)::int AS used_in_tests, MAX(t.updated_at) AS last_used_at
        FROM assessment.test_questions tq
        JOIN assessment.tests t ON t.published_version_id = tq.test_version_id
        WHERE t.deleted_at IS NULL AND t.status <> 'archived'::test_status
        GROUP BY tq.question_version_id
      ),
      filtered AS (
        SELECT e.*, COALESCE(u.used_in_tests, 0) AS used_in_tests, u.last_used_at
        FROM eligible e
        LEFT JOIN usage u ON u.question_version_id = e.id
        WHERE TRUE
          ${f.search ? sql`AND (e.stem ILIKE ${likePattern(f.search)} OR e.public_code ILIKE ${likePattern(f.search)})` : sql``}
          ${f.difficulties.length ? sql`AND lower(e.difficulty) = ANY(${f.difficulties}::text[])` : sql``}
          ${f.questionTypes.length ? sql`AND e.question_type = ANY(${f.questionTypes}::text[])` : sql``}
          ${f.examVersionId ? sql`AND e.exam_version_id = ${f.examVersionId}::uuid` : sql``}
          ${f.excludeVersionIds.length ? sql`AND NOT (e.id = ANY(${f.excludeVersionIds}::uuid[]))` : sql``}
          ${f.usage === "unused" ? sql`AND u.question_version_id IS NULL` : sql``}
          ${f.taxonomyNodeIds.length ? sql`AND EXISTS (
            SELECT 1 FROM content.question_taxonomy_links qtl
            JOIN descendants d ON d.id = qtl.taxonomy_node_id
            WHERE qtl.question_version_id = e.id)` : sql``}
          ${f.languages.length ? sql`AND (
            SELECT COUNT(DISTINCT lower(l.code))
            FROM content.question_translations qt
            JOIN catalog.languages l ON l.id = qt.language_id
            WHERE qt.question_version_id = e.id
              AND lower(qt.status) = 'approved'
              AND lower(l.code) = ANY(${f.languages}::text[])
          ) = ${f.languages.length}` : sql``}
      )
      SELECT
        f.root_question_id::text AS "questionId",
        f.id::text AS "versionId",
        f.public_code AS "publicCode",
        f.status::text AS status,
        (f.status = 'approved'::question_status
          AND f.answer_model #>> '{generation,questionBankAcceptanceMode}' = 'BANK_ONLY') AS "draftOnly",
        f.question_type AS "questionType",
        f.difficulty,
        f.stem,
        f.explanation,
        f.exam_version_id::text AS "examVersionId",
        f.used_in_tests AS "usedInTests",
        f.last_used_at AS "lastUsedAt",
        COUNT(*) OVER()::int AS "totalCount",
        COALESCE((
          SELECT json_agg(json_build_object('id', o.id, 'key', o.option_key, 'text', o.text,
                 'sortOrder', o.sort_order, 'isCorrect', o.is_correct) ORDER BY o.sort_order)
          FROM content.question_options o WHERE o.question_version_id = f.id
        ), '[]'::json) AS options,
        COALESCE((
          SELECT json_agg(json_build_object('id', n.id, 'code', n.code, 'nodeType', n.node_type,
                 'name', n.name, 'isPrimary', l.is_primary) ORDER BY l.is_primary DESC, n.node_type, n.name)
          FROM content.question_taxonomy_links l
          JOIN catalog.taxonomy_nodes n ON n.id = l.taxonomy_node_id
          WHERE l.question_version_id = f.id
        ), '[]'::json) AS taxonomy,
        ARRAY(
          SELECT 'en' UNION
          SELECT DISTINCT lower(l.code)
          FROM content.question_translations qt
          JOIN catalog.languages l ON l.id = qt.language_id
          WHERE qt.question_version_id = f.id AND lower(qt.status) = 'approved'
        ) AS languages
      FROM filtered f
      ORDER BY
        ${f.sort === "least_used" ? sql`f.used_in_tests ASC,` : sql``}
        f.published_at DESC NULLS LAST, f.updated_at DESC, f.id
      LIMIT ${f.limit} OFFSET ${f.offset}
    `;
    const total = rows.length ? Number(rows[0].totalCount) : 0;
    // When nothing matches, report how many usable questions exist at all so
    // the builder can say whether the filters or the bank itself is empty.
    let bankTotal: number | null = null;
    if (total === 0) {
      const counts = await sql`
        SELECT COUNT(*)::int AS n
        FROM content.questions q
        JOIN content.question_versions v ON v.id = CASE
          WHEN q.status = 'approved'::question_status THEN q.approved_version_id
          ELSE q.published_version_id END
        WHERE q.deleted_at IS NULL
          AND q.status IN ('published'::question_status, 'approved'::question_status)
      `;
      bankTotal = Number(counts[0]?.n ?? 0);
    }
    console.info("[question-picker]", JSON.stringify({
      search: f.search ? "yes" : "no", difficulties: f.difficulties, languages: f.languages,
      examVersionId: f.examVersionId, usage: f.usage, excluded: f.excludeVersionIds.length,
      taxonomy: f.taxonomyNodeIds.length, offset: f.offset, total, bankTotal,
    }));
    res.json({
      questions: rows.map(({ totalCount: _total, ...row }) => row),
      total,
      bankTotal,
      appliedFilters: {
        search: f.search, difficulties: f.difficulties, languages: f.languages,
        examVersionId: f.examVersionId, usage: f.usage, excludedCount: f.excludeVersionIds.length,
      },
      limit: f.limit,
      offset: f.offset,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to search test question picker", error);
    res.status(500).json({ error: "Unable to search questions for the test", code: "QUESTION_PICKER_FAILED" });
  }
});

/**
 * GET /api/admin/tests/question-picker/info?versionIds=a,b,c
 * Readiness facts for questions already placed in a test: how many other
 * published tests use them, approved languages, correct option and difficulty.
 */
router.get("/question-picker/info", requireAdminPermission("tests.read"), async (req, res) => {
  const raw = typeof req.query.versionIds === "string" ? req.query.versionIds.split(",") : [];
  const ids = [...new Set(raw.map((id) => id.trim()))].filter((id) => UUID_PATTERN.test(id)).slice(0, 500);
  const excludeTestId = typeof req.query.excludeTestId === "string" && UUID_PATTERN.test(req.query.excludeTestId)
    ? req.query.excludeTestId : null;
  if (ids.length === 0) {
    res.json({ questions: [] });
    return;
  }
  try {
    const rows = await sqlClient`
      SELECT
        v.id::text AS "versionId",
        v.difficulty,
        (SELECT o.option_key FROM content.question_options o
          WHERE o.question_version_id = v.id AND o.is_correct ORDER BY o.sort_order LIMIT 1) AS "correctOptionKey",
        (SELECT COUNT(DISTINCT t.id)::int
          FROM assessment.test_questions tq
          JOIN assessment.tests t ON t.published_version_id = tq.test_version_id
          WHERE tq.question_version_id = v.id AND t.deleted_at IS NULL
            AND t.status <> 'archived'::test_status
            AND (${excludeTestId}::uuid IS NULL OR t.id <> ${excludeTestId}::uuid)) AS "usedInTests",
        ARRAY(
          SELECT 'en' UNION
          SELECT DISTINCT lower(l.code)
          FROM content.question_translations qt
          JOIN catalog.languages l ON l.id = qt.language_id
          WHERE qt.question_version_id = v.id AND lower(qt.status) = 'approved'
        ) AS languages
      FROM content.question_versions v
      WHERE v.id = ANY(${ids}::uuid[])
    `;
    res.json({ questions: rows });
  } catch (error) {
    console.error("Unable to load question readiness info", error);
    res.status(500).json({ error: "Unable to load question details", code: "QUESTION_INFO_FAILED" });
  }
});

export default router;
