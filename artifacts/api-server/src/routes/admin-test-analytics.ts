import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const text = (value: unknown, maximum = 180) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';

router.use(authenticate);

router.get('/tests', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search).toLowerCase();
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  const limit = Math.min(100, Math.max(5, Math.floor(Number(req.query.limit) || 25)));

  try {
    const [summaryRows, testRows, trendRows, bandRows] = await Promise.all([
      sqlClient`
        SELECT
          COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated'))::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS "evaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluatedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          COUNT(DISTINCT a.test_publication_id)::int AS "publicationsAttempted",
          ROUND(AVG(a.final_score) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated') AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated'))::numeric, 0)::int AS "averageTimeSeconds"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days})
      `,
      sqlClient`
        SELECT
          t.id::text AS "testId", t.public_code AS "testPublicCode", tv.title AS "testTitle",
          p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
          COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated'))::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS "evaluatedAttempts",
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluatedAttempts",
          COUNT(DISTINCT a.user_id)::int AS "uniqueStudents",
          ROUND(AVG(a.final_score) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated') AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore",
          MIN(a.final_score) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated')) AS "minimumFinalScore",
          MAX(a.final_score) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated')) AS "maximumFinalScore",
          ROUND(AVG(a.time_spent_seconds) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated'))::numeric, 0)::int AS "averageTimeSeconds",
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
        SELECT date_trunc('day', a.started_at)::date::text AS day,
          COUNT(*)::int AS attempts,
          COUNT(*) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated'))::int AS completed,
          ROUND(AVG(a.final_score) FILTER (WHERE a.status::text IN ('evaluated', 'practice_evaluated') AND a.final_score IS NOT NULL)::numeric, 2) AS "averageFinalScore"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days})
        GROUP BY date_trunc('day', a.started_at)
        ORDER BY day ASC
      `,
      sqlClient`
        WITH completed AS (
          SELECT final_score::numeric AS score
          FROM learning.attempts
          WHERE started_at >= now() - make_interval(days => ${days})
            AND status::text IN ('evaluated', 'practice_evaluated')
            AND final_score IS NOT NULL
        ), bounds AS (
          SELECT MIN(score) AS minimum, MAX(score) AS maximum FROM completed
        )
        SELECT
          CASE
            WHEN bounds.minimum IS NULL THEN 'No scored attempts'
            WHEN bounds.minimum = bounds.maximum THEN 'Single score value'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.2 THEN 'Lowest fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.4 THEN 'Second fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.6 THEN 'Middle fifth'
            WHEN completed.score < bounds.minimum + (bounds.maximum - bounds.minimum) * 0.8 THEN 'Fourth fifth'
            ELSE 'Highest fifth'
          END AS band,
          COUNT(completed.score)::int AS count,
          bounds.minimum AS "minimumScore",
          bounds.maximum AS "maximumScore"
        FROM bounds LEFT JOIN completed ON true
        GROUP BY band, bounds.minimum, bounds.maximum
        ORDER BY MIN(completed.score) NULLS LAST
      `,
    ]);

    const summary = summaryRows[0] ?? {};
    const totalAttempts = Number(summary.totalAttempts ?? 0);
    const completedAttempts = Number(summary.completedAttempts ?? 0);

    return res.json({
      windowDays: days,
      summary: {
        ...summary,
        completionRate: totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 10000) / 100 : 0,
      },
      tests: testRows.map((row) => ({
        ...row,
        completionRate: Number(row.totalAttempts) > 0
          ? Math.round((Number(row.completedAttempts) / Number(row.totalAttempts)) * 10000) / 100
          : 0,
      })),
      dailyTrend: trendRows.map((row) => ({
        ...row,
        completionRate: Number(row.attempts) > 0 ? Math.round((Number(row.completed) / Number(row.attempts)) * 10000) / 100 : 0,
      })),
      scoreDistribution: bandRows,
      capabilities: {
        sectionAnalytics: false,
        questionAnalytics: false,
        percentile: false,
        reason: 'The first release intentionally exposes only aggregates directly supported by canonical attempt rows. Section, question and percentile analytics require separately verified canonical response aggregation.',
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load canonical test analytics', error);
    return res.status(500).json({ error: 'Unable to load test analytics', code: 'ADMIN_TEST_ANALYTICS_FAILED' });
  }
});

export default router;
