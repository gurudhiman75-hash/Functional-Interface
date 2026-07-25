import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const text = (value: unknown, maximum = 180) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';
const completed = `('evaluated', 'practice_evaluated')`;

router.use(authenticate);

router.get('/tests/quality', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search).toLowerCase();
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));

  try {
    const rows = await sqlClient`
      WITH publication_questions AS (
        SELECT p.id AS publication_id, COUNT(tq.id)::int AS question_count
        FROM assessment.test_publications p
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        LEFT JOIN assessment.test_questions tq ON tq.test_version_id = tv.id
        GROUP BY p.id
      ), quality AS (
        SELECT p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
          t.public_code AS "testPublicCode", tv.title AS "testTitle",
          COUNT(*)::int AS "totalAttempts",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)})::int AS "completedAttempts",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)} AND a.final_score IS NULL)::int AS "missingFinalScore",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)} AND a.evaluated_at IS NULL)::int AS "missingEvaluatedAt",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)} AND a.result_snapshot IS NULL)::int AS "missingResultSnapshot",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)} AND (a.correct_count IS NULL OR a.incorrect_count IS NULL OR a.unattempted_count IS NULL))::int AS "missingResponseCounts",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)}
            AND a.correct_count IS NOT NULL AND a.incorrect_count IS NOT NULL AND a.unattempted_count IS NOT NULL
            AND a.correct_count + a.incorrect_count + a.unattempted_count <> pq.question_count)::int AS "responseCountMismatch",
          COUNT(*) FILTER (WHERE a.time_spent_seconds < 0)::int AS "negativeTimeSpent",
          COUNT(*) FILTER (WHERE a.status::text IN ${sqlClient.unsafe(completed)} AND a.final_score IS NOT NULL)::int AS "scoredSample",
          MAX(COALESCE(a.evaluated_at, a.submitted_at, a.updated_at)) AS "latestActivityAt",
          pq.question_count AS "questionCount"
        FROM learning.attempts a
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        JOIN publication_questions pq ON pq.publication_id = p.id
        WHERE a.started_at >= now() - make_interval(days => ${days})
          AND (${search} = '' OR lower(tv.title) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`})
        GROUP BY p.id, p.publication_number, t.public_code, tv.title, pq.question_count
      )
      SELECT *,
        ("missingFinalScore" + "missingEvaluatedAt" + "missingResultSnapshot" + "missingResponseCounts" + "responseCountMismatch" + "negativeTimeSpent")::int AS "issueCount",
        CASE
          WHEN ("missingFinalScore" + "missingEvaluatedAt" + "missingResultSnapshot" + "responseCountMismatch" + "negativeTimeSpent") > 0 THEN 'critical'
          WHEN "missingResponseCounts" > 0 OR "scoredSample" < 20 THEN 'warning'
          ELSE 'clean'
        END AS state,
        CASE WHEN "scoredSample" >= 50 THEN 'strong' WHEN "scoredSample" >= 20 THEN 'usable' ELSE 'limited' END AS "sampleReliability"
      FROM quality
      ORDER BY
        CASE WHEN ("missingFinalScore" + "missingEvaluatedAt" + "missingResultSnapshot" + "responseCountMismatch" + "negativeTimeSpent") > 0 THEN 0
             WHEN "missingResponseCounts" > 0 OR "scoredSample" < 20 THEN 1 ELSE 2 END,
        "issueCount" DESC, "latestActivityAt" DESC
      LIMIT 250
    `;

    const summary = rows.reduce((acc, row) => {
      acc.publications += 1;
      acc.critical += String(row.state) === 'critical' ? 1 : 0;
      acc.warning += String(row.state) === 'warning' ? 1 : 0;
      acc.clean += String(row.state) === 'clean' ? 1 : 0;
      acc.issues += Number(row.issueCount || 0);
      acc.limitedSamples += String(row.sampleReliability) === 'limited' ? 1 : 0;
      return acc;
    }, { publications: 0, critical: 0, warning: 0, clean: 0, issues: 0, limitedSamples: 0 });

    return res.json({
      windowDays: days,
      summary,
      publications: rows,
      thresholds: { usableSample: 20, strongSample: 50 },
      freshness: {
        latestActivityAt: rows.reduce<string | null>((latest, row) => {
          const value = row.latestActivityAt ? new Date(String(row.latestActivityAt)).toISOString() : null;
          return !value || (latest && latest >= value) ? latest : value;
        }, null),
      },
      readOnly: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load Test Analytics quality diagnostics', error);
    return res.status(500).json({ error: 'Unable to load analytics quality diagnostics', code: 'ADMIN_TEST_ANALYTICS_QUALITY_FAILED' });
  }
});

export default router;
