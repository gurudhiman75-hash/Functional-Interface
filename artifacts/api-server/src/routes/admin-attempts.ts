import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, maximum = 500) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';
const STATUSES = new Set(['all', 'in_progress', 'evaluated', 'practice_evaluated', 'abandoned', 'stale']);

router.use(authenticate);

router.get('/', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search, 180).toLowerCase();
  const status = text(req.query.status, 40).toLowerCase() || 'all';
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(req.query.pageSize) || 25)));
  const offset = (page - 1) * pageSize;
  if (!STATUSES.has(status)) return res.status(400).json({ error: 'Unsupported attempt status', code: 'INVALID_ATTEMPT_STATUS' });

  try {
    const stalePredicate = sqlClient`a.status::text = 'in_progress' AND a.updated_at < now() - GREATEST(interval '6 hours', make_interval(secs => GREATEST(tv.duration_seconds * 2, 3600)))`;
    const [rows, totals, stats] = await Promise.all([
      sqlClient`
        SELECT
          a.id::text AS id, a.attempt_number AS "attemptNumber", a.status::text AS status,
          a.started_at AS "startedAt", a.submitted_at AS "submittedAt", a.evaluated_at AS "evaluatedAt",
          a.updated_at AS "updatedAt", a.time_spent_seconds AS "timeSpentSeconds",
          a.raw_score AS "rawScore", a.final_score AS "finalScore", a.correct_count AS "correctCount",
          a.incorrect_count AS "incorrectCount", a.unattempted_count AS "unattemptedCount",
          (${stalePredicate}) AS stale,
          CASE WHEN ${stalePredicate} THEN EXTRACT(EPOCH FROM (now() - a.updated_at))::int ELSE 0 END AS "inactiveSeconds",
          u.id::text AS "studentId", u.display_name AS "studentName", u.email AS "studentEmail",
          sp.registration_code AS "registrationCode", t.id::text AS "testId", t.public_code AS "testPublicCode",
          tv.title AS "testTitle", tv.duration_seconds AS "durationSeconds",
          p.id::text AS "publicationId", p.publication_number AS "publicationNumber"
        FROM learning.attempts a
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE (${status} = 'all' OR (${status} = 'stale' AND ${stalePredicate}) OR (${status} <> 'stale' AND a.status::text = ${status}))
          AND (
            ${search} = '' OR lower(u.display_name) LIKE ${`%${search}%`} OR lower(u.email) LIKE ${`%${search}%`}
            OR lower(sp.registration_code) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`}
            OR lower(tv.title) LIKE ${`%${search}%`} OR a.id::text = ${search}
          )
        ORDER BY COALESCE(a.evaluated_at, a.submitted_at, a.updated_at, a.started_at) DESC, a.id DESC
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
        WHERE (${status} = 'all' OR (${status} = 'stale' AND ${stalePredicate}) OR (${status} <> 'stale' AND a.status::text = ${status}))
          AND (${search} = '' OR lower(u.display_name) LIKE ${`%${search}%`} OR lower(u.email) LIKE ${`%${search}%`}
            OR lower(sp.registration_code) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`}
            OR lower(tv.title) LIKE ${`%${search}%`} OR a.id::text = ${search})
      `,
      sqlClient`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE a.status::text = 'in_progress')::int AS "inProgress",
          COUNT(*) FILTER (WHERE a.status::text = 'evaluated')::int AS evaluated,
          COUNT(*) FILTER (WHERE a.status::text = 'practice_evaluated')::int AS "practiceEvaluated",
          COUNT(*) FILTER (WHERE a.status::text = 'abandoned')::int AS abandoned,
          COUNT(*) FILTER (WHERE ${stalePredicate})::int AS stale
        FROM learning.attempts a
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
      `,
    ]);
    return res.json({ attempts: rows, page, pageSize, total: Number(totals[0]?.total ?? 0), stats: stats[0] ?? {}, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load canonical attempt inventory', error);
    return res.status(500).json({ error: 'Unable to load attempts', code: 'ADMIN_ATTEMPT_DIRECTORY_FAILED' });
  }
});

async function abandonAttempt(tx: typeof sqlClient, input: {
  attemptId: string;
  reason: string;
  expectedUpdatedAt?: string;
  actorUserId: string | null;
  actorRole: string | null;
}) {
  const rows = await tx`
    SELECT a.status::text AS status, a.updated_at AS "updatedAt", a.result_snapshot AS "resultSnapshot",
      a.raw_score AS "rawScore", a.final_score AS "finalScore", tv.duration_seconds AS "durationSeconds",
      u.display_name AS "studentName", sp.registration_code AS "registrationCode", tv.title AS "testTitle"
    FROM learning.attempts a
    JOIN identity.users u ON u.id = a.user_id
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    JOIN assessment.test_publications p ON p.id = a.test_publication_id
    JOIN assessment.test_versions tv ON tv.id = p.test_version_id
    WHERE a.id = ${input.attemptId}::uuid
    LIMIT 1 FOR UPDATE OF a
  `;
  const attempt = rows[0];
  if (!attempt) throw Object.assign(new Error('Attempt not found'), { status: 404, code: 'ATTEMPT_NOT_FOUND' });
  if (String(attempt.status) !== 'in_progress') throw Object.assign(new Error('Only in-progress attempts can be abandoned'), { status: 409, code: 'ATTEMPT_NOT_IN_PROGRESS' });
  if (input.expectedUpdatedAt && new Date(String(attempt.updatedAt)).toISOString() !== new Date(input.expectedUpdatedAt).toISOString()) {
    throw Object.assign(new Error('The attempt changed after it was loaded. Refresh and review it again.'), { status: 409, code: 'ATTEMPT_STATE_CHANGED' });
  }
  const staleAfterSeconds = Math.max(21600, Math.max(Number(attempt.durationSeconds || 0) * 2, 3600));
  const inactiveSeconds = Math.floor((Date.now() - new Date(String(attempt.updatedAt)).getTime()) / 1000);
  if (inactiveSeconds < staleAfterSeconds) throw Object.assign(new Error('This attempt is still within its active reliability window and cannot be abandoned'), { status: 409, code: 'ATTEMPT_NOT_STALE' });

  await tx`UPDATE learning.attempts SET status = 'abandoned', updated_at = now() WHERE id = ${input.attemptId}::uuid`;
  const auditEventId = randomUUID();
  await tx`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key, action_key,
      entity_type, entity_id, reason, summary, metadata
    ) VALUES (
      ${auditEventId}::uuid, 'user'::audit_actor_type,
      ${input.actorUserId}::uuid, ${input.actorRole},
      'student.attempt.abandoned', 'attempt', ${input.attemptId}::uuid,
      ${input.reason}, ${`Abandoned stale attempt for ${String(attempt.studentName)}`},
      ${tx.json({
        registrationCode: String(attempt.registrationCode),
        testTitle: String(attempt.testTitle),
        previousStatus: 'in_progress',
        nextStatus: 'abandoned',
        inactiveSeconds,
        staleAfterSeconds,
        scoreFieldsChanged: false,
        resultSnapshotChanged: false,
        resultSnapshotPresent: attempt.resultSnapshot != null,
        rawScoreAtAction: attempt.rawScore == null ? null : Number(attempt.rawScore),
        finalScoreAtAction: attempt.finalScore == null ? null : Number(attempt.finalScore),
      })}
    )
  `;
  return { attemptId: input.attemptId, previousStatus: 'in_progress', status: 'abandoned', inactiveSeconds, auditEventId, occurredAt: new Date().toISOString() };
}

router.post('/bulk/actions/abandon', requireAdminPermission('users.students.manage'), async (req, res) => {
  const reason = text(req.body?.reason).replace(/\s+/g, ' ');
  const attemptIds = Array.isArray(req.body?.attemptIds)
    ? [...new Set(req.body.attemptIds.map((value: unknown) => text(value, 80)).filter((value: string) => uuid.test(value)))].slice(0, 100)
    : [];
  if (!attemptIds.length) return res.status(400).json({ error: 'Select at least one valid stale attempt', code: 'ATTEMPT_SELECTION_REQUIRED' });
  if (reason.length < 20) return res.status(400).json({ error: 'Provide a bulk abandonment reason of at least 20 characters', code: 'ATTEMPT_ABANDON_REASON_REQUIRED' });

  const results = [];
  for (const attemptId of attemptIds) {
    try {
      const operation = await sqlClient.begin((tx) => abandonAttempt(tx as typeof sqlClient, {
        attemptId,
        reason,
        actorUserId: req.adminSession?.user.id ?? null,
        actorRole: req.adminSession?.roles[0] ?? null,
      }));
      results.push({ ok: true, ...operation });
    } catch (error) {
      const typed = error as { code?: string; message?: string };
      results.push({ attemptId, ok: false, code: typed.code || 'ATTEMPT_ABANDON_FAILED', message: typed.message || 'Unable to abandon attempt' });
    }
  }
  return res.json({
    attempted: attemptIds.length,
    succeeded: results.filter((entry) => entry.ok).length,
    failed: results.filter((entry) => !entry.ok).length,
    results,
    generatedAt: new Date().toISOString(),
  });
});

router.post('/:attemptId/actions/abandon', requireAdminPermission('users.students.manage'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  const reason = text(req.body?.reason).replace(/\s+/g, ' ');
  const expectedUpdatedAt = text(req.body?.expectedUpdatedAt, 80);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  if (reason.length < 20) return res.status(400).json({ error: 'Provide an abandonment reason of at least 20 characters', code: 'ATTEMPT_ABANDON_REASON_REQUIRED' });

  try {
    const operation = await sqlClient.begin((tx) => abandonAttempt(tx as typeof sqlClient, {
      attemptId,
      reason,
      expectedUpdatedAt,
      actorUserId: req.adminSession?.user.id ?? null,
      actorRole: req.adminSession?.roles[0] ?? null,
    }));
    return res.json({ operation, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    console.error('Unable to abandon stale attempt', error);
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to abandon attempt', code: typed.code || 'ATTEMPT_ABANDON_FAILED' });
  }
});

router.get('/:attemptId', requireAdminPermission('users.students.read'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  try {
    const [rows, timeline] = await Promise.all([
      sqlClient`
        SELECT a.id::text AS id, a.attempt_number AS "attemptNumber", a.status::text AS status,
          a.started_at AS "startedAt", a.submitted_at AS "submittedAt", a.evaluated_at AS "evaluatedAt",
          a.updated_at AS "updatedAt", a.time_spent_seconds AS "timeSpentSeconds", a.raw_score AS "rawScore",
          a.final_score AS "finalScore", a.correct_count AS "correctCount", a.incorrect_count AS "incorrectCount",
          a.unattempted_count AS "unattemptedCount", a.result_snapshot AS "resultSnapshot",
          (a.status::text = 'in_progress' AND a.updated_at < now() - GREATEST(interval '6 hours', make_interval(secs => GREATEST(tv.duration_seconds * 2, 3600)))) AS stale,
          EXTRACT(EPOCH FROM (now() - a.updated_at))::int AS "inactiveSeconds",
          GREATEST(21600, GREATEST(tv.duration_seconds * 2, 3600))::int AS "staleAfterSeconds",
          u.id::text AS "studentId", u.display_name AS "studentName", u.email AS "studentEmail",
          u.status::text AS "studentStatus", sp.registration_code AS "registrationCode",
          t.id::text AS "testId", t.public_code AS "testPublicCode", tv.id::text AS "testVersionId",
          tv.title AS "testTitle", tv.duration_seconds AS "durationSeconds", p.id::text AS "publicationId",
          p.publication_number AS "publicationNumber", p.published_at AS "publishedAt", p.closes_at AS "closesAt"
        FROM learning.attempts a
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE a.id = ${attemptId}::uuid LIMIT 1
      `,
      sqlClient`
        SELECT ae.id::text AS id, ae.action_key AS "actionKey", ae.summary, ae.reason,
          ae.occurred_at AS "occurredAt", ae.actor_user_id::text AS "actorUserId",
          actor.display_name AS "actorName", ae.metadata
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE ae.entity_type = 'attempt' AND ae.entity_id = ${attemptId}::uuid
        ORDER BY ae.occurred_at DESC
        LIMIT 100
      `,
    ]);
    if (!rows[0]) return res.status(404).json({ error: 'Attempt not found', code: 'ATTEMPT_NOT_FOUND' });
    return res.json({ attempt: rows[0], timeline, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load canonical attempt detail', error);
    return res.status(500).json({ error: 'Unable to load attempt detail', code: 'ADMIN_ATTEMPT_DETAIL_FAILED' });
  }
});

export default router;
