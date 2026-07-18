import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function serializeTest(row: Record<string, unknown>) {
  const settings = asRecord(row.settings);
  const difficultyValue = String(settings.difficulty ?? "Medium");
  const difficulty = difficultyValue === "Easy" || difficultyValue === "Hard"
    ? difficultyValue
    : "Medium";
  const testType = String(settings.testType ?? "full_mock");

  return {
    id: String(row.id),
    name: String(row.title),
    category: String(row.examFamilyCode),
    categoryName: String(row.examFamilyName),
    categoryId: String(row.examFamilyCode),
    subcategoryId: String(row.examCode),
    subcategoryName: String(row.examName),
    access: "free",
    priceCents: null,
    kind: testType === "sectional" ? "sectional" : "full-length",
    duration: Math.max(1, Math.round(Number(row.durationSeconds ?? 60) / 60)),
    totalQuestions: Number(row.questionCount ?? 0),
    attempts: 0,
    avgScore: 0,
    difficulty,
    sectionTimingMode: "none",
    sectionTimings: [],
    sectionSettings: [],
    sections: [],
    languages: [String(settings.languageCode ?? "en")],
    marksPerQuestion: Number(row.marksPerQuestion ?? 1),
    negativeMarks: Number(row.negativeMarks ?? 0),
    unattemptedMarks: 0,
  };
}

async function loadPublishedTests(category?: string) {
  const normalizedCategory = category?.trim() || null;
  return sqlClient`
    SELECT
      t.id::text AS id,
      v.title,
      v.duration_seconds AS "durationSeconds",
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
      COALESCE((
        SELECT tq.marks::float8
        FROM assessment.test_questions tq
        WHERE tq.test_version_id = v.id
        ORDER BY tq.position
        LIMIT 1
      ), 1) AS "marksPerQuestion",
      COALESCE((
        SELECT tq.negative_marks::float8
        FROM assessment.test_questions tq
        WHERE tq.test_version_id = v.id
        ORDER BY tq.position
        LIMIT 1
      ), 0) AS "negativeMarks",
      p.published_at AS "publishedAt"
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
      AND (
        ${normalizedCategory}::text IS NULL
        OR lower(ef.code) = lower(${normalizedCategory})
        OR lower(ef.name) = lower(${normalizedCategory})
      )
    ORDER BY COALESCE(p.published_at, t.updated_at) DESC
  `;
}

router.get("/tests", async (_req, res) => {
  try {
    const rows = await loadPublishedTests();
    return res.json(rows.map((row) => serializeTest(row as Record<string, unknown>)));
  } catch (error) {
    console.error("Unable to list canonical published tests", error);
    return res.status(500).json({ error: "Unable to load tests" });
  }
});

router.get("/tests/category-free-ids", async (req, res) => {
  try {
    const rows = await loadPublishedTests(String(req.query.category ?? ""));
    return res.json(rows.map((row) => ({ id: String(row.id), name: String(row.title) })));
  } catch (error) {
    console.error("Unable to list canonical category tests", error);
    return res.status(500).json({ error: "Unable to load category tests" });
  }
});

// Legacy purchases are intentionally not migrated.
router.get("/tests/my-tests", authenticate, (_req, res) => {
  return res.json({ purchasedTests: [] });
});

router.get("/attempts", authenticate, async (req, res) => {
  try {
    const rows = await sqlClient`
      SELECT a.result_snapshot AS result
      FROM learning.attempts a
      JOIN identity.auth_identities ai
        ON ai.user_id = a.user_id
       AND ai.provider = 'firebase'
      WHERE ai.provider_subject = ${req.user!.id}
        AND a.status = 'evaluated'
        AND a.result_snapshot IS NOT NULL
      ORDER BY a.submitted_at DESC NULLS LAST, a.created_at DESC
    `;
    return res.json(rows.map((row) => row.result));
  } catch (error) {
    console.error("Unable to list canonical attempts", error);
    return res.status(500).json({ error: "Unable to load attempts" });
  }
});

export default router;
