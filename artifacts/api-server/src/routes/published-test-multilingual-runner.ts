import { Router, type IRouter } from "express";

import { AttemptReliabilityError } from "../lib/attempt-reliability";
import { evaluateTestLocalizationReadiness } from "../lib/admin-test-localization";
import { languageCodesFromSettings } from "../lib/admin-translation-operations";
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

function asOptionList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
}

async function loadPublishedTest(identifier: string) {
  const rows = await sqlClient`
    SELECT
      t.id::text AS id,
      t.public_code AS "publicCode",
      t.exam_version_id::text AS "examVersionId",
      v.id::text AS "publishedVersionId",
      v.title,
      v.description,
      v.instructions,
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

async function loadTranslations(testVersionId: string, languageCodes: string[]) {
  const sectionRows = await sqlClient`
    SELECT
      section.id::text AS "testSectionId",
      lower(language.code) AS "languageCode",
      translation.name
    FROM assessment.test_sections section
    JOIN assessment.test_section_translations translation ON translation.test_section_id = section.id
    JOIN catalog.languages language ON language.id = translation.language_id
    WHERE section.test_version_id = ${testVersionId}::uuid
      AND lower(language.code) = ANY(${languageCodes}::text[])
  `;
  const questionRows = await sqlClient`
    SELECT
      translation.question_version_id::text AS "questionVersionId",
      lower(language.code) AS "languageCode",
      translation.stem,
      translation.explanation,
      COALESCE(
        json_agg(json_build_object(
          'key', option.option_key,
          'text', option.text,
          'sortOrder', option.sort_order
        ) ORDER BY option.sort_order) FILTER (WHERE option.id IS NOT NULL),
        '[]'::json
      ) AS options
    FROM assessment.test_questions test_question
    JOIN content.question_translations translation
      ON translation.question_version_id = test_question.question_version_id
     AND translation.status = 'approved'
    JOIN catalog.languages language ON language.id = translation.language_id
    LEFT JOIN content.question_translation_options option
      ON option.question_translation_id = translation.id
    WHERE test_question.test_version_id = ${testVersionId}::uuid
      AND lower(language.code) = ANY(${languageCodes}::text[])
    GROUP BY translation.id, language.id
  `;
  const testRows = await sqlClient`
    SELECT
      lower(language.code) AS "languageCode",
      translation.title,
      translation.description,
      translation.instructions
    FROM assessment.test_version_translations translation
    JOIN catalog.languages language ON language.id = translation.language_id
    WHERE translation.test_version_id = ${testVersionId}::uuid
      AND translation.status = 'approved'
      AND lower(language.code) = ANY(${languageCodes}::text[])
  `;

  const sections = new Map<string, Map<string, string>>();
  for (const row of sectionRows) {
    const sectionId = String(row.testSectionId);
    const byLanguage = sections.get(sectionId) ?? new Map<string, string>();
    byLanguage.set(String(row.languageCode), String(row.name));
    sections.set(sectionId, byLanguage);
  }
  const questions = new Map<string, Map<string, { stem: string; explanation: string; options: string[] }>>();
  for (const row of questionRows) {
    const questionVersionId = String(row.questionVersionId);
    const byLanguage = questions.get(questionVersionId) ?? new Map<string, { stem: string; explanation: string; options: string[] }>();
    byLanguage.set(String(row.languageCode), {
      stem: String(row.stem),
      explanation: String(row.explanation ?? ""),
      options: asOptionList(row.options).map((option) => String(option.text ?? "")),
    });
    questions.set(questionVersionId, byLanguage);
  }
  const tests = new Map<string, { title: string; description: string; instructions: unknown }>();
  for (const row of testRows) {
    tests.set(String(row.languageCode), {
      title: String(row.title),
      description: String(row.description ?? ""),
      instructions: row.instructions,
    });
  }
  return { sections, questions, tests };
}

// Multilingual tests are served with every approved configured translation in a
// single immutable publication payload. English-only tests continue through the
// proven runner mounted immediately after this focused route.
router.get("/tests/:id", async (req, res, next) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) return next();
  try {
    const test = await loadPublishedTest(identifier);
    if (!test) return next();
    const settings = asRecord(test.settings);
    const languageCodes = languageCodesFromSettings(settings);
    if (!languageCodes.some((code) => code !== "en")) return next();

    const readiness = await evaluateTestLocalizationReadiness({
      testVersionId: String(test.publishedVersionId),
      examVersionId: String(test.examVersionId),
      settings,
    });
    if (!readiness.ready) {
      return res.status(409).json({
        error: readiness.issues[0]?.message ?? "This multilingual test is not ready.",
        code: "PUBLISHED_TEST_LOCALIZATION_INCOMPLETE",
        details: readiness,
      });
    }

    const [sections, questionRows, translations] = await Promise.all([
      sqlClient`
        SELECT id::text AS id, name, section_key AS "sectionKey",
          sort_order AS "sortOrder", duration_seconds AS "durationSeconds"
        FROM assessment.test_sections
        WHERE test_version_id = ${String(test.publishedVersionId)}::uuid
        ORDER BY sort_order
      `,
      sqlClient`
        SELECT
          tq.test_section_id::text AS "testSectionId",
          tq.question_version_id::text AS "questionVersionId",
          tq.position,
          tq.marks::float8 AS marks,
          tq.negative_marks::float8 AS "negativeMarks",
          version.stem,
          COALESCE(
            json_agg(json_build_object(
              'key', option.option_key,
              'text', option.text,
              'sortOrder', option.sort_order
            ) ORDER BY option.sort_order) FILTER (WHERE option.id IS NOT NULL),
            '[]'::json
          ) AS options
        FROM assessment.test_questions tq
        JOIN content.question_versions version ON version.id = tq.question_version_id
        LEFT JOIN content.question_options option ON option.question_version_id = version.id
        WHERE tq.test_version_id = ${String(test.publishedVersionId)}::uuid
        GROUP BY tq.test_section_id, tq.question_version_id, tq.position,
          tq.marks, tq.negative_marks, version.stem
        ORDER BY tq.test_section_id, tq.position
      `,
      loadTranslations(String(test.publishedVersionId), languageCodes.filter((code) => code !== "en")),
    ]);

    const questionsBySection = new Map<string, unknown[]>();
    questionRows.forEach((row, index) => {
      const sectionId = String(row.testSectionId);
      const options = asOptionList(row.options).map((option) => String(option.text ?? ""));
      const localized = translations.questions.get(String(row.questionVersionId));
      const hindi = localized?.get("hi");
      const punjabi = localized?.get("pa");
      const list = questionsBySection.get(sectionId) ?? [];
      list.push({
        id: stableQuestionId(String(row.questionVersionId), index),
        text: String(row.stem),
        options,
        correct: -1,
        section: sections.find((section) => String(section.id) === sectionId)?.name ?? "General",
        explanation: "",
        textHi: hindi?.stem ?? null,
        optionsHi: hindi?.options ?? null,
        explanationHi: null,
        textPa: punjabi?.stem ?? null,
        optionsPa: punjabi?.options ?? null,
        explanationPa: null,
        translations: Object.fromEntries(localized ?? []),
      });
      questionsBySection.set(sectionId, list);
    });

    const difficultyValue = String(settings.difficulty ?? "Medium");
    const difficulty = difficultyValue === "Easy" || difficultyValue === "Hard" ? difficultyValue : "Medium";
    const sectionTimings = sections
      .filter((section) => section.durationSeconds != null)
      .map((section) => ({ name: String(section.name), minutes: Math.max(1, Math.round(Number(section.durationSeconds) / 60)) }));
    const firstQuestion = questionRows[0];
    const hindiTest = translations.tests.get("hi");
    const punjabiTest = translations.tests.get("pa");

    return res.json({
      id: String(test.id),
      name: String(test.title),
      nameHi: hindiTest?.title ?? null,
      namePa: punjabiTest?.title ?? null,
      description: String(test.description ?? ""),
      descriptionHi: hindiTest?.description ?? null,
      descriptionPa: punjabiTest?.description ?? null,
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
      sections: sections.map((section) => {
        const localized = translations.sections.get(String(section.id));
        return {
          id: String(section.id),
          name: String(section.name),
          nameHi: localized?.get("hi") ?? null,
          namePa: localized?.get("pa") ?? null,
          translations: Object.fromEntries(localized ?? []),
          questions: questionsBySection.get(String(section.id)) ?? [],
        };
      }),
      languages: languageCodes,
      marksPerQuestion: firstQuestion ? Number(firstQuestion.marks) : 1,
      negativeMarks: firstQuestion ? Number(firstQuestion.negativeMarks) : 0,
      unattemptedMarks: 0,
      localizationReadiness: readiness,
    });
  } catch (error) {
    console.error("Unable to serve multilingual published test", error);
    return res.status(500).json({ error: "Unable to load multilingual published test" });
  }
});

// Multilingual attempts persist English source evidence plus every approved
// Hindi/Punjabi solution variant. Correctness always comes from source options.
router.post("/attempts", authenticate, async (req, res, next) => {
  const testId = typeof req.body?.testId === "string" ? req.body.testId.trim() : "";
  const attemptId = typeof req.body?.attemptId === "string" ? req.body.attemptId.trim() : "";
  if (!isUuid(testId) || !isUuid(attemptId)) return next();

  try {
    const probeRows = await sqlClient`
      SELECT version.settings
      FROM learning.attempts attempt
      JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
      JOIN assessment.test_versions version ON version.id = publication.test_version_id
      JOIN identity.auth_identities identity
        ON identity.user_id = attempt.user_id
       AND identity.provider = 'firebase'
      WHERE attempt.id = ${attemptId}::uuid
        AND identity.provider_subject = ${req.user!.id}
      LIMIT 1
    `;
    const languageCodes = languageCodesFromSettings(probeRows[0]?.settings);
    if (!languageCodes.some((code) => code !== "en")) return next();

    const finalized = await sqlClient.begin(async (sql) => {
      const attemptRows = await sql`
        SELECT
          attempt.id::text AS id,
          attempt.attempt_number AS "attemptNumber",
          attempt.status,
          attempt.started_at AS "startedAt",
          attempt.result_snapshot AS "resultSnapshot",
          publication.id::text AS "publicationId",
          publication.test_id::text AS "testId",
          publication.test_version_id::text AS "testVersionId",
          test.public_code AS "publicCode",
          test.exam_version_id::text AS "examVersionId",
          version.title,
          version.settings,
          exam.code AS "examCode",
          exam.name AS "examName",
          family.code AS "examFamilyCode",
          family.name AS "examFamilyName"
        FROM learning.attempts attempt
        JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
        JOIN assessment.tests test ON test.id = publication.test_id
        JOIN assessment.test_versions version ON version.id = publication.test_version_id
        JOIN catalog.exam_versions exam_version ON exam_version.id = test.exam_version_id
        JOIN catalog.exams exam ON exam.id = exam_version.exam_id
        JOIN catalog.exam_families family ON family.id = exam.family_id
        JOIN identity.auth_identities identity
          ON identity.user_id = attempt.user_id
         AND identity.provider = 'firebase'
        WHERE attempt.id = ${attemptId}::uuid
          AND identity.provider_subject = ${req.user!.id}
        LIMIT 1
        FOR UPDATE OF attempt
      `;
      const attempt = attemptRows[0] as Record<string, unknown> | undefined;
      if (!attempt) throw new AttemptReliabilityError("ATTEMPT_SESSION_NOT_FOUND", "Attempt session not found", 404);
      if (String(attempt.testId) !== testId) throw new AttemptReliabilityError("ATTEMPT_SESSION_TEST_MISMATCH", "Attempt session belongs to another test", 409);
      if (["evaluated", "practice_evaluated"].includes(String(attempt.status)) && attempt.resultSnapshot) {
        return { result: attempt.resultSnapshot as Record<string, unknown>, replay: true };
      }
      if (String(attempt.status) !== "in_progress") throw new AttemptReliabilityError("ATTEMPT_SESSION_NOT_ACTIVE", "This attempt is no longer active", 409);

      const configuredLanguages = languageCodesFromSettings(attempt.settings);
      const readiness = await evaluateTestLocalizationReadiness({
        testVersionId: String(attempt.testVersionId),
        examVersionId: String(attempt.examVersionId),
        settings: attempt.settings,
        client: sql,
      });
      if (!readiness.ready) {
        throw new AttemptReliabilityError("ATTEMPT_LOCALIZATION_INCOMPLETE", "Published multilingual content is incomplete", 409, readiness);
      }

      const responseItems = Array.isArray(req.body?.responses)
        ? req.body.responses as Array<{ questionId: number; selectedOption: number | null; timeTaken?: number }>
        : [];
      const answerMap = new Map(responseItems.map((item) => [Number(item.questionId), item.selectedOption ?? null]));
      const flags = asRecord(req.body?.flags);
      const questionRows = await sql`
        SELECT
          tq.test_section_id::text AS "testSectionId",
          tq.question_version_id::text AS "questionVersionId",
          tq.position,
          tq.marks::float8 AS marks,
          tq.negative_marks::float8 AS "negativeMarks",
          section.name AS section,
          version.stem,
          version.explanation,
          COALESCE(
            json_agg(json_build_object(
              'key', option.option_key,
              'text', option.text,
              'sortOrder', option.sort_order,
              'isCorrect', option.is_correct
            ) ORDER BY option.sort_order) FILTER (WHERE option.id IS NOT NULL),
            '[]'::json
          ) AS options
        FROM assessment.test_questions tq
        JOIN assessment.test_sections section ON section.id = tq.test_section_id
        JOIN content.question_versions version ON version.id = tq.question_version_id
        LEFT JOIN content.question_options option ON option.question_version_id = version.id
        WHERE tq.test_version_id = ${String(attempt.testVersionId)}::uuid
        GROUP BY tq.test_section_id, tq.question_version_id, tq.position,
          tq.marks, tq.negative_marks, section.name, section.sort_order,
          version.stem, version.explanation
        ORDER BY section.sort_order, tq.position
      `;
      if (questionRows.length === 0) throw new AttemptReliabilityError("ATTEMPT_TEST_EMPTY", "This test has no scorable questions", 409);

      const translated = await loadTranslations(
        String(attempt.testVersionId),
        configuredLanguages.filter((code) => code !== "en"),
      );
      let correct = 0;
      let wrong = 0;
      let actualScore = 0;
      const sectionStatsMap = new Map<string, { correct: number; wrong: number; unanswered: number; totalQuestions: number }>();
      const questionReview = questionRows.map((row, index) => {
        const questionId = stableQuestionId(String(row.questionVersionId), index);
        const options = asOptionList(row.options);
        const correctIndex = options.findIndex((option) => Boolean(option.isCorrect));
        const selected = answerMap.get(questionId) ?? null;
        const section = String(row.section);
        const stats = sectionStatsMap.get(section) ?? { correct: 0, wrong: 0, unanswered: 0, totalQuestions: 0 };
        stats.totalQuestions += 1;
        if (selected == null) stats.unanswered += 1;
        else if (selected === correctIndex) {
          correct += 1;
          stats.correct += 1;
          actualScore += Number(row.marks);
        } else {
          wrong += 1;
          stats.wrong += 1;
          actualScore -= Number(row.negativeMarks);
        }
        sectionStatsMap.set(section, stats);
        const localized = translated.questions.get(String(row.questionVersionId));
        const hindi = localized?.get("hi");
        const punjabi = localized?.get("pa");
        const localizedSections = translated.sections.get(String(row.testSectionId));
        return {
          questionId,
          section,
          sectionHi: localizedSections?.get("hi") ?? null,
          sectionPa: localizedSections?.get("pa") ?? null,
          text: String(row.stem),
          options: options.map((option) => String(option.text ?? "")),
          textHi: hindi?.stem ?? null,
          optionsHi: hindi?.options ?? null,
          explanationHi: hindi?.explanation ?? null,
          textPa: punjabi?.stem ?? null,
          optionsPa: punjabi?.options ?? null,
          explanationPa: punjabi?.explanation ?? null,
          translations: Object.fromEntries(localized ?? []),
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
        return { name, ...stats, accuracy: answered > 0 ? Math.round((stats.correct / answered) * 100) : 0 };
      });
      const timeSpent = Math.max(0, Number(req.body?.timeSpent ?? 0));
      const submittedAt = new Date().toISOString();
      const attemptType = req.body?.attemptType === "PRACTICE" ? "PRACTICE" : "REAL";
      const finalStatus = attemptType === "PRACTICE" ? "practice_evaluated" : "evaluated";
      const hindiTest = translated.tests.get("hi");
      const punjabiTest = translated.tests.get("pa");
      const result = {
        id: attemptId,
        userId: req.user?.id ?? "",
        testId: String(attempt.testId),
        testName: String(attempt.title),
        testNameHi: hindiTest?.title ?? null,
        testNamePa: punjabiTest?.title ?? null,
        category: String(attempt.examFamilyCode),
        score,
        actualScore,
        correct,
        wrong,
        unanswered,
        totalQuestions,
        timeSpent,
        createdAt: new Date(String(attempt.startedAt)).toISOString(),
        submittedAt,
        attemptNumber: Number(attempt.attemptNumber),
        attemptType,
        seriesId: typeof req.body?.seriesId === "string" ? req.body.seriesId : null,
        languages: configuredLanguages,
        sectionStats,
        sectionTimeSpent: Array.isArray(req.body?.sectionTimeSpent) ? req.body.sectionTimeSpent : null,
        questionReview,
      };
      await sql`
        UPDATE learning.attempts
        SET status = ${finalStatus},
            submitted_at = ${submittedAt}::timestamptz,
            evaluated_at = ${submittedAt}::timestamptz,
            time_spent_seconds = ${Math.round(timeSpent * 60)},
            raw_score = ${actualScore},
            final_score = ${score},
            correct_count = ${correct},
            incorrect_count = ${wrong},
            unattempted_count = ${unanswered},
            result_snapshot = ${JSON.stringify(result)}::jsonb,
            updated_at = now()
        WHERE id = ${attemptId}::uuid
      `;
      return { result, replay: false };
    });
    return res.status(finalized.replay ? 200 : 201).json(finalized.result);
  } catch (error) {
    if (error instanceof AttemptReliabilityError) {
      return res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    }
    console.error("Unable to finalize multilingual test attempt", error);
    return res.status(500).json({ error: "Unable to submit multilingual test attempt", code: "ATTEMPT_SUBMIT_FAILED" });
  }
});

export default router;
