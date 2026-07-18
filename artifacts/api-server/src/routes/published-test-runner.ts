import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function stableQuestionId(id: string, index = 0): number {
  let hash = 17;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || index + 1;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

async function loadPublishedTest(identifier: string) {
  const rows = await sqlClient`
    SELECT
      t.id::text AS id,
      t.public_code AS "publicCode",
      v.id::text AS "publishedVersionId",
      v.title,
      v.description,
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.settings,
      e.code AS "examCode",
      e.name AS "examName",
      ef.code AS "examFamilyCode",
      ef.name AS "examFamilyName"
    FROM assessment.tests t
    JOIN assessment.test_versions v ON v.id = t.published_version_id
    JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    LEFT JOIN LATERAL (
      SELECT publication.closes_at
      FROM assessment.test_publications publication
      WHERE publication.test_id = t.id
        AND publication.test_version_id = v.id
        AND publication.published_at IS NOT NULL
      ORDER BY publication.publication_number DESC
      LIMIT 1
    ) publication ON true
    WHERE t.status = 'live'::test_status
      AND t.deleted_at IS NULL
      AND (publication.closes_at IS NULL OR publication.closes_at > now())
      AND (
        (${isUuid(identifier)}::boolean AND t.id = ${isUuid(identifier) ? identifier : null}::uuid)
        OR lower(t.public_code) = lower(${identifier})
      )
    LIMIT 1
  `;
  return rows[0] ?? null;
}

// Compatibility endpoint for the mature student test-taking engine. It returns
// the legacy Test shape but never includes the answer key or explanations.
router.get("/tests/:id", async (req, res, next) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) return next();

  try {
    const test = await loadPublishedTest(identifier);
    if (!test) return next();

    const sections = await sqlClient`
      SELECT
        s.id::text AS id,
        s.name,
        s.section_key AS "sectionKey",
        s.sort_order AS "sortOrder",
        s.duration_seconds AS "durationSeconds"
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
        v.stem,
        COALESCE(
          json_agg(
            json_build_object(
              'key', o.option_key,
              'text', o.text,
              'sortOrder', o.sort_order
            ) ORDER BY o.sort_order
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) AS options
      FROM assessment.test_questions tq
      JOIN content.question_versions v ON v.id = tq.question_version_id
      LEFT JOIN content.question_options o ON o.question_version_id = v.id
      WHERE tq.test_version_id = ${String(test.publishedVersionId)}::uuid
      GROUP BY tq.test_section_id, tq.question_version_id, tq.position,
        tq.marks, tq.negative_marks, v.stem
      ORDER BY tq.test_section_id, tq.position
    `;

    const questionsBySection = new Map<string, unknown[]>();
    questionRows.forEach((row, index) => {
      const sectionId = String(row.testSectionId);
      const options = Array.isArray(row.options) ? row.options as Array<Record<string, unknown>> : [];
      const list = questionsBySection.get(sectionId) ?? [];
      list.push({
        id: stableQuestionId(String(row.questionVersionId), index),
        text: String(row.stem),
        options: options.map((option) => String(option.text ?? "")),
        correct: -1,
        section: sections.find((section) => String(section.id) === sectionId)?.name ?? "General",
        explanation: "",
      });
      questionsBySection.set(sectionId, list);
    });

    const settings = asRecord(test.settings);
    const difficultyValue = String(settings.difficulty ?? "Medium");
    const difficulty = difficultyValue === "Easy" || difficultyValue === "Hard" ? difficultyValue : "Medium";
    const sectionTimings = sections
      .filter((section) => section.durationSeconds != null)
      .map((section) => ({ name: String(section.name), minutes: Math.max(1, Math.round(Number(section.durationSeconds) / 60)) }));
    const firstQuestion = questionRows[0];

    return res.json({
      id: String(test.id),
      name: String(test.title),
      category: String(test.examFamilyCode),
      categoryName: String(test.examFamilyName),
      categoryId: String(test.examFamilyCode),
      subcategoryId: String(test.examCode),
      subcategoryName: String(test.examName),
      access: "free",
      priceCents: null,
      kind: String(settings.testType ?? "full_mock") === "sectional" ? "sectional" : "full-length",
      duration: Math.max(1, Math.round(Number(test.durationSeconds) / 60)),
      totalQuestions: questionRows.length,
      attempts: 0,
      avgScore: 0,
      difficulty,
      sectionTimingMode: sectionTimings.length > 0 ? "fixed" : "none",
      sectionTimings,
      sectionSettings: sections.map((section) => ({ name: String(section.name), locked: false })),
      sections: sections.map((section) => ({
        id: String(section.id),
        name: String(section.name),
        questions: questionsBySection.get(String(section.id)) ?? [],
      })),
      languages: [String(settings.languageCode ?? "en")],
      marksPerQuestion: firstQuestion ? Number(firstQuestion.marks) : 1,
      negativeMarks: firstQuestion ? Number(firstQuestion.negativeMarks) : 0,
      unattemptedMarks: 0,
    });
  } catch (error) {
    console.error("Unable to adapt published test for runner", error);
    return res.status(500).json({ error: "Unable to load published test" });
  }
});

// Intercept submissions for canonical published tests before the legacy attempt
// route. Correct answers remain server-only and are returned only in the result.
router.post("/attempts", authenticate, async (req, res, next) => {
  const testId = typeof req.body?.testId === "string" ? req.body.testId.trim() : "";
  if (!testId || !isUuid(testId)) return next();

  try {
    const test = await loadPublishedTest(testId);
    if (!test) return next();

    const responseItems = Array.isArray(req.body?.responses)
      ? req.body.responses as Array<{ questionId: number; selectedOption: number | null; timeTaken?: number }>
      : [];
    const answerMap = new Map(responseItems.map((item) => [Number(item.questionId), item.selectedOption ?? null]));
    const flags = asRecord(req.body?.flags);

    const questionRows = await sqlClient`
      SELECT
        tq.test_section_id::text AS "testSectionId",
        tq.question_version_id::text AS "questionVersionId",
        tq.position,
        tq.marks::float8 AS marks,
        tq.negative_marks::float8 AS "negativeMarks",
        s.name AS section,
        v.stem,
        v.explanation,
        COALESCE(
          json_agg(
            json_build_object(
              'key', o.option_key,
              'text', o.text,
              'sortOrder', o.sort_order,
              'isCorrect', o.is_correct
            ) ORDER BY o.sort_order
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'::json
        ) AS options
      FROM assessment.test_questions tq
      JOIN assessment.test_sections s ON s.id = tq.test_section_id
      JOIN content.question_versions v ON v.id = tq.question_version_id
      LEFT JOIN content.question_options o ON o.question_version_id = v.id
      WHERE tq.test_version_id = ${String(test.publishedVersionId)}::uuid
      GROUP BY tq.test_section_id, tq.question_version_id, tq.position,
        tq.marks, tq.negative_marks, s.name, v.stem, v.explanation
      ORDER BY s.sort_order, tq.position
    `;

    let correct = 0;
    let wrong = 0;
    let actualScore = 0;
    const sectionStatsMap = new Map<string, { correct: number; wrong: number; unanswered: number; totalQuestions: number }>();

    const questionReview = questionRows.map((row, index) => {
      const questionId = stableQuestionId(String(row.questionVersionId), index);
      const options = Array.isArray(row.options) ? row.options as Array<Record<string, unknown>> : [];
      const correctIndex = options.findIndex((option) => Boolean(option.isCorrect));
      const selected = answerMap.get(questionId) ?? null;
      const section = String(row.section);
      const stats = sectionStatsMap.get(section) ?? { correct: 0, wrong: 0, unanswered: 0, totalQuestions: 0 };
      stats.totalQuestions += 1;
      if (selected == null) {
        stats.unanswered += 1;
      } else if (selected === correctIndex) {
        correct += 1;
        stats.correct += 1;
        actualScore += Number(row.marks);
      } else {
        wrong += 1;
        stats.wrong += 1;
        actualScore -= Number(row.negativeMarks);
      }
      sectionStatsMap.set(section, stats);
      return {
        questionId,
        section,
        text: String(row.stem),
        options: options.map((option) => String(option.text ?? "")),
        selected,
        correct: correctIndex,
        flagged: Boolean(flags[String(questionId)]),
        explanation: String(row.explanation ?? ""),
      };
    });

    actualScore = Math.round(actualScore * 100) / 100;
    const totalQuestions = questionRows.length;
    const unanswered = totalQuestions - correct - wrong;
    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const sectionStats = Array.from(sectionStatsMap.entries()).map(([name, stats]) => {
      const answered = stats.correct + stats.wrong;
      return {
        name,
        ...stats,
        accuracy: answered > 0 ? Math.round((stats.correct / answered) * 100) : 0,
      };
    });

    return res.status(201).json({
      id: randomUUID(),
      userId: req.user?.id ?? "",
      testId: String(test.id),
      testName: String(test.title),
      category: String(test.examFamilyCode),
      score,
      actualScore,
      correct,
      wrong,
      unanswered,
      totalQuestions,
      timeSpent: Math.max(0, Number(req.body?.timeSpent ?? 0)),
      createdAt: new Date().toISOString(),
      attemptType: req.body?.attemptType === "PRACTICE" ? "PRACTICE" : "REAL",
      sectionStats,
      sectionTimeSpent: Array.isArray(req.body?.sectionTimeSpent) ? req.body.sectionTimeSpent : null,
      questionReview,
    });
  } catch (error) {
    console.error("Unable to score published test attempt", error);
    return res.status(500).json({ error: "Unable to submit published test attempt" });
  }
});

export default router;
