import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const text = (value: unknown, maximum = 180) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const completedStatus = sqlClient`a.status::text IN ('evaluated', 'practice_evaluated')`;
const rate = (part: unknown, whole: unknown) => Number(whole) > 0 ? Math.round((Number(part) / Number(whole)) * 10000) / 100 : 0;
const relativeDelta = (current: unknown, previous: unknown) => Number(previous) !== 0
  ? Math.round(((Number(current) - Number(previous)) / Math.abs(Number(previous))) * 10000) / 100
  : null;
const pointDelta = (current: unknown, previous: unknown) => Math.round((Number(current) - Number(previous)) * 100) / 100;
const csv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

router.use(authenticate);

router.get('/tests', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search).toLowerCase();
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  const limit = Math.min(100, Math.max(5, Math.floor(Number(req.query.limit) || 25)));

  try {
    const [summaryRows, previousSummaryRows, testRows, previousTestRows, trendRows, bandRows] = await Promise.all([
      sqlClient`
        SELECT COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS "evaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluatedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          COUNT(DISTINCT a.test_publication_id)::int AS "publicationsAttempted",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days})
      `,
      sqlClient`
        SELECT COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          COUNT(DISTINCT a.test_publication_id)::int AS "publicationsAttempted",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days * 2})
          AND a.started_at < now() - make_interval(days => ${days})
      `,
      sqlClient`
        SELECT t.id::text AS "testId", t.public_code AS "testPublicCode", tv.title AS "testTitle",
          p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
          COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS "evaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluatedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          MIN(a.final_score) FILTER (WHERE ${completedStatus}) AS "minimumFinalScore",
          MAX(a.final_score) FILTER (WHERE ${completedStatus}) AS "maximumFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds",
          MAX(COALESCE(a.evaluated_at, a.submitted_at, a.updated_at)) AS "latestActivityAt"
        FROM learning.attempts a
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE a.started_at >= now() - make_interval(days => ${days})
          AND (${search} = '' OR lower(tv.title) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`})
        GROUP BY t.id, t.public_code, tv.title, p.id, p.publication_number
        ORDER BY COUNT(*) DESC, MAX(COALESCE(a.evaluated_at, a.submitted_at, a.updated_at)) DESC
        LIMIT ${limit}
      `,
      sqlClient`
        SELECT p.id::text AS "publicationId", COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds"
        FROM learning.attempts a
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE a.started_at >= now() - make_interval(days => ${days * 2})
          AND a.started_at < now() - make_interval(days => ${days})
          AND (${search} = '' OR lower(tv.title) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`})
        GROUP BY p.id
      `,
      sqlClient`
        SELECT date_trunc('day', a.started_at)::date::text AS day,
          COUNT(*)::int AS attempts,
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS completed,
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days})
        GROUP BY date_trunc('day', a.started_at)
        ORDER BY day ASC
      `,
      sqlClient`
        WITH completed AS (
          SELECT final_score::numeric AS score FROM learning.attempts
          WHERE started_at >= now() - make_interval(days => ${days})
            AND status::text IN ('evaluated', 'practice_evaluated') AND final_score IS NOT NULL
        ), bounds AS (SELECT MIN(score) AS minimum, MAX(score) AS maximum FROM completed)
        SELECT CASE
            WHEN bounds.minimum IS NULL THEN 'No scored attempts'
            WHEN bounds.minimum = bounds.maximum THEN 'Single score value'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.2 THEN 'Lowest fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.4 THEN 'Second fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.6 THEN 'Middle fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.8 THEN 'Fourth fifth'
            ELSE 'Highest fifth' END AS band,
          COUNT(completed.score)::int AS count, bounds.minimum AS "minimumScore", bounds.maximum AS "maximumScore"
        FROM bounds LEFT JOIN completed ON true
        GROUP BY band, bounds.minimum, bounds.maximum
        ORDER BY MIN(completed.score) NULLS LAST
      `,
    ]);

    const summary = summaryRows[0] ?? {};
    const previous = previousSummaryRows[0] ?? {};
    const completionRate = rate(summary.completedAttempts, summary.totalAttempts);
    const previousCompletionRate = rate(previous.completedAttempts, previous.totalAttempts);
    const previousByPublication = new Map(previousTestRows.map((row) => [String(row.publicationId), row]));

    return res.json({
      windowDays: days,
      comparisonWindow: { currentDays: days, previousDays: days },
      summary: { ...summary, completionRate },
      comparison: {
        previous: { ...previous, completionRate: previousCompletionRate },
        deltas: {
          totalAttemptsPercent: relativeDelta(summary.totalAttempts, previous.totalAttempts),
          uniqueStudentsPercent: relativeDelta(summary.uniqueStudents, previous.uniqueStudents),
          publicationsAttemptedPercent: relativeDelta(summary.publicationsAttempted, previous.publicationsAttempted),
          completionRatePoints: pointDelta(completionRate, previousCompletionRate),
          averageFinalScorePercent: relativeDelta(summary.averageFinalScore, previous.averageFinalScore),
          averageTimeSecondsPercent: relativeDelta(summary.averageTimeSeconds, previous.averageTimeSeconds),
        },
      },
      tests: testRows.map((row) => {
        const prior = previousByPublication.get(String(row.publicationId)) ?? {};
        const rowCompletionRate = rate(row.completedAttempts, row.totalAttempts);
        const priorCompletionRate = rate(prior.completedAttempts, prior.totalAttempts);
        return {
          ...row,
          completionRate: rowCompletionRate,
          comparison: {
            previousTotalAttempts: Number(prior.totalAttempts ?? 0),
            attemptsPercent: relativeDelta(row.totalAttempts, prior.totalAttempts),
            uniqueStudentsPercent: relativeDelta(row.uniqueStudents, prior.uniqueStudents),
            completionRatePoints: pointDelta(rowCompletionRate, priorCompletionRate),
            averageFinalScorePercent: relativeDelta(row.averageFinalScore, prior.averageFinalScore),
          },
        };
      }),
      dailyTrend: trendRows.map((row) => ({ ...row, completionRate: rate(row.completed, row.attempts) })),
      scoreDistribution: bandRows,
      capabilities: {
        sectionAnalytics: false,
        questionAnalytics: false,
        cohortPercentiles: true,
        studentRank: false,
        periodComparison: true,
        aggregateCsvExport: true,
        reason: 'Score percentiles and equal-window comparisons are available from canonical attempt aggregates. Section, question and student-rank analytics remain deferred until their separate canonical contracts are verified.',
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load canonical test analytics', error);
    return res.status(500).json({ error: 'Unable to load test analytics', code: 'ADMIN_TEST_ANALYTICS_FAILED' });
  }
});

router.get('/tests/export.csv', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search).toLowerCase();
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  try {
    const rows = await sqlClient`
      SELECT t.public_code AS "testPublicCode", tv.title AS "testTitle",
        p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
        COUNT(*)::int AS "totalAttempts", COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
        COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
        ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
        ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds",
        MAX(COALESCE(a.evaluated_at, a.submitted_at, a.updated_at)) AS "latestActivityAt"
      FROM learning.attempts a
      JOIN assessment.test_publications p ON p.id = a.test_publication_id
      JOIN assessment.tests t ON t.id = p.test_id
      JOIN assessment.test_versions tv ON tv.id = p.test_version_id
      WHERE a.started_at >= now() - make_interval(days => ${days})
        AND (${search} = '' OR lower(tv.title) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`})
      GROUP BY t.public_code, tv.title, p.id, p.publication_number
      ORDER BY COUNT(*) DESC, tv.title ASC
      LIMIT 1000
    `;
    const header = ['testPublicCode', 'testTitle', 'publicationId', 'publicationNumber', 'windowDays', 'totalAttempts', 'completedAttempts', 'completionRatePercent', 'uniqueStudents', 'averageFinalScore', 'averageTimeSeconds', 'latestActivityAt'];
    const lines = rows.map((row) => [
      row.testPublicCode, row.testTitle, row.publicationId, row.publicationNumber, days,
      row.totalAttempts, row.completedAttempts, rate(row.completedAttempts, row.totalAttempts), row.uniqueStudents,
      row.averageFinalScore, row.averageTimeSeconds, row.latestActivityAt ? new Date(String(row.latestActivityAt)).toISOString() : '',
    ].map(csv).join(','));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="examtree-test-analytics-${days}d.csv"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send([header.map(csv).join(','), ...lines].join('\n'));
  } catch (error) {
    console.error('Unable to export canonical test analytics', error);
    return res.status(500).json({ error: 'Unable to export test analytics', code: 'ADMIN_TEST_ANALYTICS_EXPORT_FAILED' });
  }
});

router.get('/tests/:publicationId', requireAdminPermission('users.students.read'), async (req, res) => {
  const publicationId = text(req.params.publicationId, 80);
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  if (!uuid.test(publicationId)) return res.status(400).json({ error: 'Invalid publication ID', code: 'INVALID_TEST_PUBLICATION_ID' });

  try {
    const [publicationRows, summaryRows, previousRows, trendRows, percentileRows, decileRows] = await Promise.all([
      sqlClient`
        SELECT p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
          p.published_at AS "publishedAt", p.closes_at AS "closesAt", t.id::text AS "testId",
          t.public_code AS "testPublicCode", tv.id::text AS "testVersionId", tv.title AS "testTitle",
          tv.duration_seconds AS "durationSeconds"
        FROM assessment.test_publications p
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE p.id = ${publicationId}::uuid LIMIT 1
      `,
      sqlClient`
        SELECT COUNT(*)::int AS "totalAttempts", COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS "evaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'in_progress')::int AS "inProgressAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'abandoned')::int AS "abandonedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          COUNT(*) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::int AS "scoredAttempts",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          MIN(a.final_score) FILTER (WHERE ${completedStatus}) AS "minimumFinalScore",
          MAX(a.final_score) FILTER (WHERE ${completedStatus}) AS "maximumFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds",
          ROUND(AVG(a.correct_count) FILTER (WHERE ${completedStatus})::numeric, 2) AS "averageCorrect",
          ROUND(AVG(a.incorrect_count) FILTER (WHERE ${completedStatus})::numeric, 2) AS "averageIncorrect",
          ROUND(AVG(a.unattempted_count) FILTER (WHERE ${completedStatus})::numeric, 2) AS "averageUnattempted"
        FROM learning.attempts a
        WHERE a.test_publication_id = ${publicationId}::uuid AND a.started_at >= now() - make_interval(days => ${days})
      `,
      sqlClient`
        SELECT COUNT(*)::int AS "totalAttempts", COUNT(*) FILTER (WHERE ${completedStatus})::int AS "completedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE ${completedStatus})::numeric, 0)::int AS "averageTimeSeconds"
        FROM learning.attempts a
        WHERE a.test_publication_id = ${publicationId}::uuid
          AND a.started_at >= now() - make_interval(days => ${days * 2})
          AND a.started_at < now() - make_interval(days => ${days})
      `,
      sqlClient`
        SELECT date_trunc('day', a.started_at)::date::text AS day, COUNT(*)::int AS attempts,
          COUNT(*) FILTER (WHERE ${completedStatus})::int AS completed,
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          ROUND(AVG(a.final_score) FILTER (WHERE ${completedStatus} AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore"
        FROM learning.attempts a
        WHERE a.test_publication_id = ${publicationId}::uuid AND a.started_at >= now() - make_interval(days => ${days})
        GROUP BY date_trunc('day', a.started_at) ORDER BY day ASC
      `,
      sqlClient`
        SELECT percentile_cont(0.10) WITHIN GROUP (ORDER BY a.final_score) AS p10,
          percentile_cont(0.25) WITHIN GROUP (ORDER BY a.final_score) AS p25,
          percentile_cont(0.50) WITHIN GROUP (ORDER BY a.final_score) AS p50,
          percentile_cont(0.75) WITHIN GROUP (ORDER BY a.final_score) AS p75,
          percentile_cont(0.90) WITHIN GROUP (ORDER BY a.final_score) AS p90, COUNT(*)::int AS sample
        FROM learning.attempts a
        WHERE a.test_publication_id = ${publicationId}::uuid
          AND a.started_at >= now() - make_interval(days => ${days})
          AND ${completedStatus} AND a.final_score IS NOT NULL
      `,
      sqlClient`
        WITH ranked AS (
          SELECT a.final_score::numeric AS score, ntile(10) OVER (ORDER BY a.final_score) AS decile
          FROM learning.attempts a
          WHERE a.test_publication_id = ${publicationId}::uuid
            AND a.started_at >= now() - make_interval(days => ${days})
            AND ${completedStatus} AND a.final_score IS NOT NULL
        )
        SELECT decile, COUNT(*)::int AS count, MIN(score) AS "minimumScore",
          MAX(score) AS "maximumScore", ROUND(AVG(score), 2) AS "averageScore"
        FROM ranked GROUP BY decile ORDER BY decile ASC
      `,
    ]);

    const publication = publicationRows[0];
    if (!publication) return res.status(404).json({ error: 'Test publication not found', code: 'TEST_PUBLICATION_NOT_FOUND' });
    const summary = summaryRows[0] ?? {};
    const previous = previousRows[0] ?? {};
    const completionRate = rate(summary.completedAttempts, summary.totalAttempts);
    const previousCompletionRate = rate(previous.completedAttempts, previous.totalAttempts);
    const percentile = percentileRows[0] ?? { sample: 0 };

    return res.json({
      windowDays: days,
      publication,
      summary: { ...summary, completionRate },
      comparison: {
        previous: { ...previous, completionRate: previousCompletionRate },
        deltas: {
          totalAttemptsPercent: relativeDelta(summary.totalAttempts, previous.totalAttempts),
          uniqueStudentsPercent: relativeDelta(summary.uniqueStudents, previous.uniqueStudents),
          completionRatePoints: pointDelta(completionRate, previousCompletionRate),
          averageFinalScorePercent: relativeDelta(summary.averageFinalScore, previous.averageFinalScore),
          averageTimeSecondsPercent: relativeDelta(summary.averageTimeSeconds, previous.averageTimeSeconds),
        },
      },
      cohortPercentiles: {
        sample: Number(percentile.sample ?? 0), p10: percentile.p10, p25: percentile.p25,
        median: percentile.p50, p75: percentile.p75, p90: percentile.p90,
        method: 'PostgreSQL percentile_cont over canonical final_score values for completed attempts in the selected window.',
      },
      scoreDeciles: decileRows,
      dailyTrend: trendRows.map((row) => ({ ...row, completionRate: rate(row.completed, row.attempts) })),
      capabilities: { cohortPercentiles: true, periodComparison: true, studentRank: false, sectionAnalytics: false, questionAnalytics: false },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load publication analytics drilldown', error);
    return res.status(500).json({ error: 'Unable to load publication analytics', code: 'ADMIN_TEST_ANALYTICS_DETAIL_FAILED' });
  }
});

export default router;
