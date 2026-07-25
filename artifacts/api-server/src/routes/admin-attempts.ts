import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, maximum = 180) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';
const STATUSES = new Set(['all', 'in_progress', 'submitted', 'evaluated', 'practice_evaluated', 'abandoned']);

router.use(authenticate);

router.get('/', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search).toLowerCase();
  const status = text(req.query.status, 40).toLowerCase() || 'all';
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(req.query.pageSize) || 25)));
  const offset = (page - 1) * pageSize;
  if (!STATUSES.has(status)) return res.status(400).json({ error: 'Unsupported attempt status', code: 'INVALID_ATTEMPT_STATUS' });

  try {
    const [rows, totals, stats] = await Promise.all([
      sqlClient`
        SELECT
          a.id::text AS id,
          a.attempt_number AS "attemptNumber",
          a.status::text AS status,
          a.started_at AS "startedAt",
          a.submitted_at AS "submittedAt",
          a.evaluated_at AS "evaluatedAt",
          a.updated_at AS "updatedAt",
          a.time_spent_seconds AS "timeSpentSeconds",
          a.raw_score AS "rawScore",
          a.final_score AS "finalScore",
          a.correct_count AS "correctCount",
          a.incorrect_count AS "incorrectCount",
          a.unattempted_count AS "unattemptedCount",
          u.id::text AS "studentId",
          u.display_name AS "studentName",
          u.email AS "studentEmail",
          sp.registration_code AS "registrationCode",
          t.id::text AS "testId",
          t.public_code AS "testPublicCode",
          tv.title AS "testTitle",
          p.id::text AS "publicationId",
          p.publication_number AS "publicationNumber"
        FROM learning.attempts a
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE (${status} = 'all' OR a.status::text = ${status})
          AND (
            ${search} = ''
            OR lower(u.display_name) LIKE ${`%${search}%`}
            OR lower(u.email) LIKE ${`%${search}%`}
            OR lower(sp.registration_code) LIKE ${`%${search}%`}
            OR lower(t.public_code) LIKE ${`%${search}%`}
            OR lower(tv.title) LIKE ${`%${search}%`}
            OR a.id::text = ${search}
          )
        ORDER BY COALESCE(a.submitted_at, a.started_at) DESC, a.id DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      sqlClient`
        SELECT COUNT(*)::int AS total
        FROM learning.attempts a
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE (${status} = 'all' OR a.status::text = ${status})
          AND (
            ${search} = ''
            OR lower(u.display_name) LIKE ${`%${search}%`}
            OR lower(u.email) LIKE ${`%${search}%`}
            OR lower(sp.registration_code) LIKE ${`%${search}%`}
            OR lower(t.public_code) LIKE ${`%${search}%`}
            OR lower(tv.title) LIKE ${`%${search}%`}
            OR a.id::text = ${search}
          )
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'in_progress')::int AS "inProgress",
          COUNT(*) FILTER (WHERE status = 'submitted')::int AS submitted,
          COUNT(*) FILTER (WHERE status IN ('evaluated', 'practice_evaluated'))::int AS evaluated,
          COUNT(*) FILTER (WHERE status = 'abandoned')::int AS abandoned
        FROM learning.attempts
      `,
    ]);
    return res.json({ attempts: rows, page, pageSize, total: Number(totals[0]?.total ?? 0), stats: stats[0] ?? {}, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load canonical attempt inventory', error);
    return res.status(500).json({ error: 'Unable to load attempts', code: 'ADMIN_ATTEMPT_DIRECTORY_FAILED' });
  }
});

router.get('/:attemptId', requireAdminPermission('users.students.read'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });

  try {
    const rows = await sqlClient`
      SELECT
        a.id::text AS id,
        a.attempt_number AS "attemptNumber",
        a.status::text AS status,
        a.started_at AS "startedAt",
        a.submitted_at AS "submittedAt",
        a.evaluated_at AS "evaluatedAt",
        a.updated_at AS "updatedAt",
        a.time_spent_seconds AS "timeSpentSeconds",
        a.raw_score AS "rawScore",
        a.final_score AS "finalScore",
        a.correct_count AS "correctCount",
        a.incorrect_count AS "incorrectCount",
        a.unattempted_count AS "unattemptedCount",
        a.result_snapshot AS "resultSnapshot",
        u.id::text AS "studentId",
        u.display_name AS "studentName",
        u.email AS "studentEmail",
        u.status::text AS "studentStatus",
        sp.registration_code AS "registrationCode",
        t.id::text AS "testId",
        t.public_code AS "testPublicCode",
        tv.id::text AS "testVersionId",
        tv.title AS "testTitle",
        tv.duration_seconds AS "durationSeconds",
        p.id::text AS "publicationId",
        p.publication_number AS "publicationNumber",
        p.published_at AS "publishedAt",
        p.closes_at AS "closesAt"
      FROM learning.attempts a
      JOIN identity.users u ON u.id = a.user_id
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      JOIN assessment.test_publications p ON p.id = a.test_publication_id
      JOIN assessment.tests t ON t.id = p.test_id
      JOIN assessment.test_versions tv ON tv.id = p.test_version_id
      WHERE a.id = ${attemptId}::uuid
      LIMIT 1
    `;
    if (!rows[0]) return res.status(404).json({ error: 'Attempt not found', code: 'ATTEMPT_NOT_FOUND' });
    return res.json({ attempt: rows[0], generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load canonical attempt detail', error);
    return res.status(500).json({ error: 'Unable to load attempt detail', code: 'ADMIN_ATTEMPT_DETAIL_FAILED' });
  }
});

export default router;
