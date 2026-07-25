import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stableQuestionId(id: string, index = 0): number {
  let hash = 17;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || index + 1;
}

const rate = (part: number, whole: number) => whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;

router.use(authenticate);

router.get('/questions/:questionVersionId', requireAdminPermission('users.students.read'), async (req, res) => {
  const questionVersionId = String(req.params.questionVersionId ?? '').trim();
  const publicationId = String(req.query.publicationId ?? '').trim();
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  if (!uuid.test(questionVersionId)) return res.status(400).json({ error: 'Invalid question-version ID', code: 'INVALID_QUESTION_VERSION_ID' });
  if (!uuid.test(publicationId)) return res.status(400).json({ error: 'A valid publication ID is required', code: 'INVALID_TEST_PUBLICATION_ID' });

  try {
    const catalogueRows = await sqlClient`
      SELECT p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
        t.public_code AS "testPublicCode", tv.title AS "testTitle",
        tq.question_version_id::text AS "questionVersionId", section.name AS "sectionName",
        v.stem, v.explanation, tq.position,
        row_number() OVER (PARTITION BY p.id ORDER BY section.sort_order, tq.position) - 1 AS "questionIndex",
        COALESCE(json_agg(json_build_object(
          'key', o.option_key, 'text', o.text, 'sortOrder', o.sort_order, 'isCorrect', o.is_correct
        ) ORDER BY o.sort_order) FILTER (WHERE o.id IS NOT NULL), '[]'::json) AS options
      FROM assessment.test_publications p
      JOIN assessment.tests t ON t.id = p.test_id
      JOIN assessment.test_versions tv ON tv.id = p.test_version_id
      JOIN assessment.test_questions tq ON tq.test_version_id = tv.id
      JOIN assessment.test_sections section ON section.id = tq.test_section_id
      JOIN content.question_versions v ON v.id = tq.question_version_id
      LEFT JOIN content.question_options o ON o.question_version_id = v.id
      WHERE p.id = ${publicationId}::uuid AND tq.question_version_id = ${questionVersionId}::uuid
      GROUP BY p.id, p.publication_number, t.public_code, tv.title, tq.question_version_id,
        section.name, section.sort_order, v.stem, v.explanation, tq.position
      LIMIT 1
    `;
    const question = catalogueRows[0];
    if (!question) return res.status(404).json({ error: 'Question version is not part of this publication', code: 'QUESTION_ANALYTICS_NOT_FOUND' });

    const stableId = stableQuestionId(questionVersionId, Number(question.questionIndex));
    const attemptRows = await sqlClient`
      SELECT a.id::text AS "attemptId", a.evaluated_at AS "evaluatedAt", a.result_snapshot AS "resultSnapshot"
      FROM learning.attempts a
      WHERE a.test_publication_id = ${publicationId}::uuid
        AND a.started_at >= now() - make_interval(days => ${days})
        AND a.status::text IN ('evaluated', 'practice_evaluated')
        AND a.result_snapshot IS NOT NULL
      ORDER BY a.evaluated_at ASC NULLS LAST
      LIMIT 10000
    `;

    const options = Array.isArray(question.options) ? question.options as Array<Record<string, unknown>> : [];
    const optionCounts = Array.from({ length: options.length }, () => 0);
    const daily = new Map<string, { exposures: number; answered: number; correct: number; skipped: number; flagged: number }>();
    let exposures = 0; let answered = 0; let skipped = 0; let correct = 0; let incorrect = 0; let flagged = 0; let unmatchedAttempts = 0;

    for (const attempt of attemptRows) {
      const snapshot = attempt.resultSnapshot && typeof attempt.resultSnapshot === 'object' ? attempt.resultSnapshot as Record<string, unknown> : {};
      const review = Array.isArray(snapshot.questionReview) ? snapshot.questionReview as Array<Record<string, unknown>> : [];
      const item = review.find((entry) => Number(entry.questionId) === stableId);
      if (!item) { unmatchedAttempts += 1; continue; }
      exposures += 1;
      const selected = item.selected == null ? null : Number(item.selected);
      const correctIndex = item.correct == null ? null : Number(item.correct);
      const day = attempt.evaluatedAt ? new Date(String(attempt.evaluatedAt)).toISOString().slice(0, 10) : 'unknown';
      const bucket = daily.get(day) ?? { exposures: 0, answered: 0, correct: 0, skipped: 0, flagged: 0 };
      bucket.exposures += 1;
      if (selected == null) { skipped += 1; bucket.skipped += 1; }
      else {
        answered += 1; bucket.answered += 1;
        if (selected >= 0 && selected < optionCounts.length) optionCounts[selected] += 1;
        if (correctIndex != null && selected === correctIndex) { correct += 1; bucket.correct += 1; }
        else incorrect += 1;
      }
      if (Boolean(item.flagged)) { flagged += 1; bucket.flagged += 1; }
      daily.set(day, bucket);
    }

    const optionSelection = options.map((option, index) => ({
      key: String(option.key ?? index + 1),
      text: String(option.text ?? ''),
      isCorrect: Boolean(option.isCorrect),
      count: optionCounts[index] ?? 0,
      shareOfAnswered: rate(optionCounts[index] ?? 0, answered),
    }));
    const strongestWrongOption = optionSelection.filter((option) => !option.isCorrect).sort((a, b) => b.count - a.count)[0] ?? null;
    const diagnostics = [
      ...(exposures < 20 ? [{ code: 'LIMITED_SAMPLE', severity: 'warning', message: 'Fewer than 20 matched exposures are available in this reporting window.' }] : []),
      ...(rate(skipped, exposures) >= 40 ? [{ code: 'HIGH_SKIP_RATE', severity: 'warning', message: 'At least 40% of matched exposures were skipped.' }] : []),
      ...(rate(flagged, exposures) >= 10 ? [{ code: 'HIGH_FLAG_RATE', severity: 'warning', message: 'At least 10% of matched exposures were flagged by students.' }] : []),
      ...(strongestWrongOption && strongestWrongOption.shareOfAnswered >= 60 ? [{ code: 'DOMINANT_WRONG_OPTION', severity: 'critical', message: 'A wrong option attracted at least 60% of answered responses.' }] : []),
      ...(unmatchedAttempts > 0 ? [{ code: 'LINKAGE_GAP', severity: 'critical', message: 'Some completed attempts could not be linked to this question snapshot item.' }] : []),
    ];

    return res.json({
      windowDays: days,
      question: {
        publicationId: String(question.publicationId), publicationNumber: Number(question.publicationNumber),
        testPublicCode: String(question.testPublicCode), testTitle: String(question.testTitle),
        questionVersionId, sectionName: String(question.sectionName), stem: String(question.stem),
        explanation: String(question.explanation ?? ''), stableQuestionId: stableId,
      },
      summary: {
        completedAttemptsScanned: attemptRows.length, matchedExposures: exposures, unmatchedAttempts,
        answered, skipped, correct, incorrect, flagged,
        answerRate: rate(answered, exposures), skipRate: rate(skipped, exposures),
        accuracy: answered > 0 ? rate(correct, answered) : null,
        facility: rate(correct, exposures), flagRate: rate(flagged, exposures),
      },
      optionSelection,
      dailyTrend: Array.from(daily.entries()).map(([day, row]) => ({
        day, ...row, accuracy: row.answered > 0 ? rate(row.correct, row.answered) : null,
        skipRate: rate(row.skipped, row.exposures), flagRate: rate(row.flagged, row.exposures),
      })),
      diagnostics,
      qualityState: diagnostics.some((item) => item.severity === 'critical') ? 'critical' : diagnostics.length ? 'warning' : 'clean',
      capabilities: { optionSelection: true, correctness: true, dailyTrend: true, questionTiming: false, discrimination: false },
      readOnly: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load Question Analytics drilldown', error);
    return res.status(500).json({ error: 'Unable to load question analytics drilldown', code: 'ADMIN_QUESTION_ANALYTICS_DETAIL_FAILED' });
  }
});

export default router;
