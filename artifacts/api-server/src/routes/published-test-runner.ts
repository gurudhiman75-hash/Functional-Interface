import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { AttemptReliabilityError, resolveAttemptLimit } from "../lib/attempt-reliability";
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

router.get("/tests/:id", async (req, res, next) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) return next();

  try {
    const test = await loadPublishedTest(identifier);
    if (!test) return next();

    const sections = await sqlClient`
      SELECT s.id::text AS id, s.name, s.section_key AS "sectionKey",
        s.sort_order AS "sortOrder", s.duration_seconds AS "durationSeconds"
      FROM assessment.test_sections s
      WHERE s.test_version_id = ${String(test.publishedVersionId)}::uuid
      ORDER BY s.sort_order
    `;

    const questionRows = await sqlClient`
      SELECT concat(tq.test_version_id::text, ':', tq.question_version_id::text) AS "testQuestionId",
        tq.test_section_id::text AS "testSectionId",
        tq.question_version_id::text AS "questionVersionId", tq.position,
        tq.marks::float8 AS marks, tq.negative_marks::float8 AS "negativeMarks", v.stem,
        COALESCE(json_agg(json_build_object('key', o.option_key, 'text', o.text, 'sortOrder', o.sort_order)
          ORDER BY o.sort_order) FILTER (WHERE o.id IS NOT NULL), '[]'::json) AS options
      FROM assessment.test_questions tq
      JOIN content.question_versions v ON v.id = tq.question_version_id
      LEFT JOIN content.question_options o ON o.question_version_id = v.id
      WHERE tq.test_version_id = ${String(test.publishedVersionId)}::uuid
      GROUP BY tq.test_version_id, tq.test_section_id, tq.question_version_id, tq.position,
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
        questionVersionId: String(row.questionVersionId),
        testQuestionId: String(row.testQuestionId),
        testSectionId: sectionId,
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
      id: String(test.id), name: String(test.title), category: String(test.examFamilyCode),
      categoryName: String(test.examFamilyName), categoryId: String(test.examFamilyCode),
      subcategoryId: String(test.examCode), subcategoryName: String(test.examName), access: "free",
      priceCents: null, kind: String(settings.testType ?? "full_mock") === "sectional" ? "sectional" : "full-length",
      duration: Math.max(1, Math.round(Number(test.durationSeconds) / 60)), totalQuestions: questionRows.length,
      attempts: 0, avgScore: 0, difficulty,
      maxAttempts: resolveAttemptLimit(test.settings),
      sectionTimingMode: sectionTimings.length > 0 ? "fixed" : "none", sectionTimings,
      sectionSettings: sections.map((section) => ({ name: String(section.name), locked: false })),
      sections: sections.map((section) => ({ id: String(section.id), name: String(section.name), questions: questionsBySection.get(String(section.id)) ?? [] })),
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

router.post("/attempts", authenticate, async (req, res, next) => {
  const testId = typeof req.body?.testId === "string" ? req.body.testId.trim() : "";
  if (!testId || !isUuid(testId)) return next();

  const attemptId = typeof req.body?.attemptId === "string" ? req.body.attemptId.trim() : "";
  if (!isUuid(attemptId)) return res.status(409).json({ error: "Start or resume this test before submitting it.", code: "ATTEMPT_SESSION_REQUIRED" });

  try {
    const finalized = await sqlClient.begin(async (sql) => {
      const attemptRows = await sql`
        SELECT attempt.id::text AS id, attempt.attempt_number AS "attemptNumber", attempt.status,
          attempt.started_at AS "startedAt", attempt.result_snapshot AS "resultSnapshot",
          publication.id::text AS "publicationId", publication.test_id::text AS "testId",
          publication.test_version_id::text AS "testVersionId", test.public_code AS "publicCode",
          version.title, version.settings, exam.code AS "examCode", exam.name AS "examName",
          family.code AS "examFamilyCode", family.name AS "examFamilyName"
        FROM learning.attempts attempt
        JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
        JOIN assessment.tests test ON test.id = publication.test_id
        JOIN assessment.test_versions version ON version.id = publication.test_version_id
        JOIN catalog.exam_versions exam_version ON exam_version.id = test.exam_version_id
        JOIN catalog.exams exam ON exam.id = exam_version.exam_id
        JOIN catalog.exam_families family ON family.id = exam.family_id
        JOIN identity.auth_identities identity ON identity.user_id = attempt.user_id AND identity.provider = 'firebase'
        WHERE attempt.id = ${attemptId}::uuid AND identity.provider_subject = ${req.user!.id}
        LIMIT 1 FOR UPDATE OF attempt
      `;
      const attempt = attemptRows[0] as Record<string, unknown> | undefined;
      if (!attempt) throw new AttemptReliabilityError("ATTEMPT_SESSION_NOT_FOUND", "Attempt session not found", 404);
      if (String(attempt.testId) !== testId) throw new AttemptReliabilityError("ATTEMPT_SESSION_TEST_MISMATCH", "Attempt session belongs to another test", 409);
      if (["evaluated", "practice_evaluated"].includes(String(attempt.status)) && attempt.resultSnapshot) return { result: attempt.resultSnapshot as Record<string, unknown>, replay: true };
      if (String(attempt.status) !== "in_progress") throw new AttemptReliabilityError("ATTEMPT_SESSION_NOT_ACTIVE", "This attempt is no longer active", 409);

      const responseItems = Array.isArray(req.body?.responses)
        ? req.body.responses as Array<{ questionId: number; selectedOption: number | null; timeTaken?: number }>
        : [];
      const responseMap = new Map<number, { selected: number | null; timeTakenSeconds: number | null }>();
      for (const item of responseItems) {
        const questionId = Number(item.questionId);
        if (!Number.isInteger(questionId) || questionId < 0) {
          throw new AttemptReliabilityError("ATTEMPT_INVALID_QUESTION_RESPONSE", "A question response contains an invalid question ID", 400, { questionId: item.questionId });
        }
        if (responseMap.has(questionId)) {
          throw new AttemptReliabilityError("ATTEMPT_DUPLICATE_QUESTION_RESPONSE", "A question was submitted more than once", 400, { questionId });
        }
        const selected = item.selectedOption == null ? null : Number(item.selectedOption);
        if (selected != null && !Number.isInteger(selected)) {
          throw new AttemptReliabilityError("ATTEMPT_INVALID_OPTION_SELECTION", "A selected option must be an integer index", 400, { questionId, selectedOption: item.selectedOption });
        }
        const rawTime = item.timeTaken == null ? null : Number(item.timeTaken);
        if (rawTime != null && (!Number.isFinite(rawTime) || rawTime < 0)) {
          throw new AttemptReliabilityError("ATTEMPT_INVALID_QUESTION_TIME", "Question time must be a non-negative number of seconds", 400, { questionId, timeTaken: item.timeTaken });
        }
        responseMap.set(questionId, {
          selected,
          timeTakenSeconds: rawTime == null ? null : Math.round(rawTime),
        });
      }
      const flags = asRecord(req.body?.flags);

      const questionRows = await sql`
        SELECT concat(tq.test_version_id::text, ':', tq.question_version_id::text) AS "testQuestionId",
          tq.test_section_id::text AS "testSectionId",
          tq.question_version_id::text AS "questionVersionId", tq.position,
          tq.marks::float8 AS marks, tq.negative_marks::float8 AS "negativeMarks",
          section.name AS section, version.stem, version.explanation,
          COALESCE(json_agg(json_build_object('key', option.option_key, 'text', option.text,
            'sortOrder', option.sort_order, 'isCorrect', option.is_correct) ORDER BY option.sort_order)
            FILTER (WHERE option.id IS NOT NULL), '[]'::json) AS options
        FROM assessment.test_questions tq
        JOIN assessment.test_sections section ON section.id = tq.test_section_id
        JOIN content.question_versions version ON version.id = tq.question_version_id
        LEFT JOIN content.question_options option ON option.question_version_id = version.id
        WHERE tq.test_version_id = ${String(attempt.testVersionId)}::uuid
        GROUP BY tq.test_version_id, tq.test_section_id, tq.question_version_id, tq.position,
          tq.marks, tq.negative_marks, section.name, section.sort_order, version.stem, version.explanation
        ORDER BY section.sort_order, tq.position
      `;
      if (questionRows.length === 0) throw new AttemptReliabilityError("ATTEMPT_TEST_EMPTY", "This test has no scorable questions", 409);

      let correct = 0; let wrong = 0; let actualScore = 0;
      const sectionStatsMap = new Map<string, { correct: number; wrong: number; unanswered: number; totalQuestions: number }>();
      const knownQuestionIds = new Set<number>();
      const questionReview = questionRows.map((row, index) => {
        const questionId = stableQuestionId(String(row.questionVersionId), index);
        knownQuestionIds.add(questionId);
        const options = Array.isArray(row.options) ? row.options as Array<Record<string, unknown>> : [];
        const correctOptions = options.map((option, optionIndex) => Boolean(option.isCorrect) ? optionIndex : -1).filter((optionIndex) => optionIndex >= 0);
        if (correctOptions.length !== 1) {
          throw new AttemptReliabilityError("ATTEMPT_ANSWER_KEY_INVALID", "A question must have exactly one correct option before evaluation", 409, { questionVersionId: String(row.questionVersionId), correctOptionCount: correctOptions.length });
        }
        const correctIndex = correctOptions[0];
        const response = responseMap.get(questionId) ?? { selected: null, timeTakenSeconds: null };
        const selected = response.selected;
        if (selected != null && (selected < 0 || selected >= options.length)) {
          throw new AttemptReliabilityError("ATTEMPT_INVALID_OPTION_SELECTION", "A selected option is outside the immutable option set", 400, { questionId, selectedOption: selected, optionCount: options.length });
        }
        const section = String(row.section);
        const stats = sectionStatsMap.get(section) ?? { correct: 0, wrong: 0, unanswered: 0, totalQuestions: 0 };
        stats.totalQuestions += 1;
        const isCorrect = selected == null ? null : selected === correctIndex;
        const awardedMarks = selected == null ? 0 : isCorrect ? Number(row.marks) : -Number(row.negativeMarks);
        if (selected == null) stats.unanswered += 1;
        else if (isCorrect) { correct += 1; stats.correct += 1; actualScore += Number(row.marks); }
        else { wrong += 1; stats.wrong += 1; actualScore -= Number(row.negativeMarks); }
        sectionStatsMap.set(section, stats);
        return {
          questionId,
          questionVersionId: String(row.questionVersionId),
          testQuestionId: String(row.testQuestionId),
          testSectionId: String(row.testSectionId),
          section,
          text: String(row.stem),
          options: options.map((option) => String(option.text ?? "")),
          optionKeys: options.map((option) => String(option.key ?? "")),
          selected,
          selectedOptionKey: selected == null ? null : String(options[selected]?.key ?? ""),
          correct: correctIndex,
          correctOptionKey: String(options[correctIndex]?.key ?? ""),
          isCorrect,
          awardedMarks,
          timeTakenSeconds: response.timeTakenSeconds,
          flagged: Boolean(flags[String(questionId)]),
          explanation: String(row.explanation ?? ""),
        };
      });

      const unknownResponseIds = Array.from(responseMap.keys()).filter((questionId) => !knownQuestionIds.has(questionId));
      if (unknownResponseIds.length > 0) {
        throw new AttemptReliabilityError("ATTEMPT_UNKNOWN_QUESTION_RESPONSE", "The submission contains responses for questions outside this immutable test version", 400, { questionIds: unknownResponseIds });
      }

      actualScore = Math.round(actualScore * 100) / 100;
      const totalQuestions = questionRows.length;
      const unanswered = totalQuestions - correct - wrong;
      const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
      const sectionStats = Array.from(sectionStatsMap.entries()).map(([name, stats]) => {
        const answered = stats.correct + stats.wrong;
        return { name, ...stats, accuracy: answered > 0 ? Math.round((stats.correct / answered) * 100) : 0 };
      });
      const timeSpent = Math.max(0, Number(req.body?.timeSpent ?? 0));
      const submittedAt = new Date().toISOString();
      const attemptType = req.body?.attemptType === "PRACTICE" ? "PRACTICE" : "REAL";
      const finalStatus = attemptType === "PRACTICE" ? "practice_evaluated" : "evaluated";
      const result = {
        snapshotVersion: 2,
        linkageContract: "direct_question_version_v2",
        questionTimingUnit: "seconds",
        id: attemptId,
        userId: req.user?.id ?? "",
        testId: String(attempt.testId),
        testPublicationId: String(attempt.publicationId),
        testVersionId: String(attempt.testVersionId),
        testName: String(attempt.title), category: String(attempt.examFamilyCode), score, actualScore,
        correct, wrong, unanswered, totalQuestions, timeSpent,
        createdAt: new Date(String(attempt.startedAt)).toISOString(), submittedAt,
        attemptNumber: Number(attempt.attemptNumber), attemptType,
        seriesId: typeof req.body?.seriesId === "string" ? req.body.seriesId : null,
        sectionStats,
        sectionTimeSpent: Array.isArray(req.body?.sectionTimeSpent) ? req.body.sectionTimeSpent : null,
        questionReview,
      };

      for (const review of questionReview) {
        const selectedOptionKeys = review.selectedOptionKey ? [review.selectedOptionKey] : [];
        const responseSnapshot = {
          selectedOptionIndex: review.selected,
          selectedOptionKey: review.selectedOptionKey,
          flagged: review.flagged,
        };
        await sql`
          INSERT INTO learning.attempt_responses (
            attempt_id,
            question_version_id,
            response,
            selected_option_keys,
            is_correct,
            awarded_marks,
            time_spent_seconds,
            answered_at,
            updated_at
          ) VALUES (
            ${attemptId}::uuid,
            ${review.questionVersionId}::uuid,
            ${JSON.stringify(responseSnapshot)}::jsonb,
            ${JSON.stringify(selectedOptionKeys)}::jsonb,
            ${review.isCorrect},
            ${review.awardedMarks},
            ${review.timeTakenSeconds ?? 0},
            ${review.selected == null ? null : submittedAt}::timestamptz,
            now()
          )
          ON CONFLICT (attempt_id, question_version_id)
          DO UPDATE SET
            response = EXCLUDED.response,
            selected_option_keys = EXCLUDED.selected_option_keys,
            is_correct = EXCLUDED.is_correct,
            awarded_marks = EXCLUDED.awarded_marks,
            time_spent_seconds = EXCLUDED.time_spent_seconds,
            answered_at = EXCLUDED.answered_at,
            updated_at = now()
        `;
      }

      await sql`
        UPDATE learning.attempts
        SET status = ${finalStatus}, submitted_at = ${submittedAt}::timestamptz,
          evaluated_at = ${submittedAt}::timestamptz, time_spent_seconds = ${Math.round(timeSpent * 60)},
          raw_score = ${actualScore}, final_score = ${score}, correct_count = ${correct},
          incorrect_count = ${wrong}, unattempted_count = ${unanswered},
          result_snapshot = ${JSON.stringify(result)}::jsonb, updated_at = now()
        WHERE id = ${attemptId}::uuid
      `;
      return { result, replay: false };
    });

    return res.status(finalized.replay ? 200 : 201).json(finalized.result);
  } catch (error) {
    if (error instanceof AttemptReliabilityError) return res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    console.error("Unable to finalize published test attempt", error);
    return res.status(500).json({ error: "Unable to submit published test attempt", code: "ATTEMPT_SUBMIT_FAILED" });
  }
});

export default router;
