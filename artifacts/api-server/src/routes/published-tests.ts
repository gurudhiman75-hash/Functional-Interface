import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

router.get("/", async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        t.id::text AS id,
        t.public_code AS "publicCode",
        t.exam_version_id::text AS "examVersionId",
        v.id::text AS "publishedVersionId",
        v.title,
        v.description,
        v.duration_seconds AS "durationSeconds",
        v.total_marks::float8 AS "totalMarks",
        v.settings,
        e.code AS "examCode",
        e.name AS "examName",
        ef.code AS "examFamilyCode",
        ef.name AS "examFamilyName",
        COALESCE((
          SELECT COUNT(*)::int
          FROM assessment.test_questions tq
          WHERE tq.test_version_id = v.id
        ), 0) AS "questionCount",
        p.published_at AS "publishedAt",
        p.closes_at AS "closesAt"
      FROM assessment.tests t
      JOIN assessment.test_versions v ON v.id = t.published_version_id
      JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN LATERAL (
        SELECT publication.published_at, publication.closes_at
        FROM assessment.test_publications publication
        WHERE publication.test_id = t.id
          AND publication.test_version_id = v.id
          AND publication.published_at IS NOT NULL
        ORDER BY publication.publication_number DESC
        LIMIT 1
      ) p ON true
      WHERE t.status = 'live'::test_status
        AND t.deleted_at IS NULL
        AND (p.closes_at IS NULL OR p.closes_at > now())
        AND NOT EXISTS (
          SELECT 1
          FROM assessment.test_series series
          JOIN assessment.test_series_versions series_version
            ON series_version.series_id = series.id
           AND series_version.version_number = series.current_version_number
          JOIN assessment.test_series_items series_item
            ON series_item.series_version_id = series_version.id
           AND series_item.test_id = t.id
          WHERE series.deleted_at IS NULL
        )
      ORDER BY COALESCE(p.published_at, t.updated_at) DESC
    `;

    res.json({ tests: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Unable to load published tests", error);
    res.status(500).json({ error: "Unable to load published tests" });
  }
});

router.get("/:id", async (req, res) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) {
    res.status(400).json({ error: "Missing test identifier" });
    return;
  }

  try {
    const testRows = await sqlClient`
      SELECT
        t.id::text AS id,
        t.public_code AS "publicCode",
        t.exam_version_id::text AS "examVersionId",
        v.id::text AS "publishedVersionId",
        v.title,
        v.description,
        v.duration_seconds AS "durationSeconds",
        v.total_marks::float8 AS "totalMarks",
        v.instructions,
        v.settings,
        e.code AS "examCode",
        e.name AS "examName",
        ef.code AS "examFamilyCode",
        ef.name AS "examFamilyName",
        p.published_at AS "publishedAt",
        p.closes_at AS "closesAt"
      FROM assessment.tests t
      JOIN assessment.test_versions v ON v.id = t.published_version_id
      JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN LATERAL (
        SELECT publication.published_at, publication.closes_at
        FROM assessment.test_publications publication
        WHERE publication.test_id = t.id
          AND publication.test_version_id = v.id
          AND publication.published_at IS NOT NULL
        ORDER BY publication.publication_number DESC
        LIMIT 1
      ) p ON true
      WHERE t.status = 'live'::test_status
        AND t.deleted_at IS NULL
        AND (p.closes_at IS NULL OR p.closes_at > now())
        AND NOT EXISTS (
          SELECT 1
          FROM assessment.test_series series
          JOIN assessment.test_series_versions series_version
            ON series_version.series_id = series.id
           AND series_version.version_number = series.current_version_number
          JOIN assessment.test_series_items series_item
            ON series_item.series_version_id = series_version.id
           AND series_item.test_id = t.id
          WHERE series.deleted_at IS NULL
        )
        AND (${isUuid(identifier)}::boolean AND t.id = ${isUuid(identifier) ? identifier : null}::uuid
          OR lower(t.public_code) = lower(${identifier}))
      LIMIT 1
    `;

    const test = testRows[0];
    if (!test) {
      res.status(404).json({ error: "Published test not found", code: "PUBLISHED_TEST_NOT_FOUND" });
      return;
    }

    const sections = await sqlClient`
      SELECT
        s.id::text AS id,
        s.section_key AS "sectionKey",
        s.name,
        s.sort_order AS "sortOrder",
        s.duration_seconds AS "durationSeconds",
        s.settings
      FROM assessment.test_sections s
      WHERE s.test_version_id = ${String(test.publishedVersionId)}::uuid
      ORDER BY s.sort_order
    `;

    const questionRows = await sqlClient`
      SELECT
        tq.test_section_id::text AS "testSectionId",
        tq.question_version_id::text AS "questionVersionId",
        tq.position,
        tq.marks::float8 AS marks,
        tq.negative_marks::float8 AS "negativeMarks",
        tq.settings,
        q.public_code AS "publicCode",
        v.question_type AS "questionType",
        v.difficulty,
        v.stem,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'key', o.option_key,
              'text', o.text,
              'sortOrder', o.sort_order
            ) ORDER BY o.sort_order
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) AS options
      FROM assessment.test_questions tq
      JOIN content.question_versions v ON v.id = tq.question_version_id
      JOIN content.questions q ON q.id = v.question_id
      LEFT JOIN content.question_options o ON o.question_version_id = v.id
      WHERE tq.test_version_id = ${String(test.publishedVersionId)}::uuid
      GROUP BY tq.test_section_id, tq.question_version_id, tq.position, tq.marks,
        tq.negative_marks, tq.settings, q.public_code, v.question_type,
        v.difficulty, v.stem
      ORDER BY tq.test_section_id, tq.position
    `;

    const questionsBySection = new Map<string, unknown[]>();
    for (const question of questionRows) {
      const sectionId = String(question.testSectionId);
      const current = questionsBySection.get(sectionId) ?? [];
      current.push(question);
      questionsBySection.set(sectionId, current);
    }

    res.json({
      test,
      sections: sections.map((section) => ({
        ...section,
        questions: questionsBySection.get(String(section.id)) ?? [],
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load published test", error);
    res.status(500).json({ error: "Unable to load published test" });
  }
});

export default router;
