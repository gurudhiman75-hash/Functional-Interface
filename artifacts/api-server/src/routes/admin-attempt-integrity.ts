import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, maximum = 1000) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';

type AttemptIntegrityRow = Record<string, unknown>;

type IntegrityIssue = {
  code: string;
  severity: 'warning' | 'critical';
  title: string;
  detail: string;
};

function diagnostics(row: AttemptIntegrityRow): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const status = String(row.status ?? '');
  const completed = status === 'evaluated' || status === 'practice_evaluated';
  const timeSpent = Number(row.timeSpentSeconds ?? 0);
  const durationSeconds = Math.max(0, Number(row.durationSeconds ?? 0));
  const questionCount = Math.max(0, Number(row.questionCount ?? 0));
  const counts = [row.correctCount, row.incorrectCount, row.unattemptedCount];
  const allCountsPresent = counts.every((value) => value !== null && value !== undefined);
  const countTotal = allCountsPresent ? counts.reduce((sum, value) => sum + Number(value), 0) : null;

  if (completed && row.resultSnapshot == null) issues.push({ code: 'MISSING_RESULT_SNAPSHOT', severity: 'critical', title: 'Completed attempt has no result snapshot', detail: 'The immutable result payload is missing for a completed attempt.' });
  if (completed && !row.evaluatedAt) issues.push({ code: 'MISSING_EVALUATED_AT', severity: 'critical', title: 'Completed attempt has no evaluation timestamp', detail: 'The lifecycle status is completed but evaluatedAt is empty.' });
  if (completed && (row.rawScore == null || row.finalScore == null)) issues.push({ code: 'MISSING_SCORE', severity: 'critical', title: 'Completed attempt has incomplete score fields', detail: 'Raw score or final score is missing.' });
  if (timeSpent < 0) issues.push({ code: 'NEGATIVE_TIME', severity: 'critical', title: 'Negative time recorded', detail: 'timeSpentSeconds is below zero.' });
  if (durationSeconds > 0 && timeSpent > Math.max(durationSeconds * 3, durationSeconds + 3600)) issues.push({ code: 'EXCESSIVE_TIME', severity: 'warning', title: 'Time greatly exceeds test duration', detail: `Recorded time ${timeSpent}s exceeds the diagnostic threshold for a ${durationSeconds}s test.` });
  if (completed && allCountsPresent && questionCount > 0 && countTotal !== questionCount) issues.push({ code: 'RESPONSE_COUNT_MISMATCH', severity: 'critical', title: 'Response counts do not match publication', detail: `Correct, incorrect and unattempted total ${countTotal}; publication contains ${questionCount} questions.` });
  if (completed && !allCountsPresent) issues.push({ code: 'MISSING_RESPONSE_COUNTS', severity: 'warning', title: 'Completed attempt has incomplete response counts', detail: 'One or more response-count fields are missing.' });
  if (status === 'in_progress' && (row.submittedAt || row.evaluatedAt || row.rawScore != null || row.finalScore != null)) issues.push({ code: 'ACTIVE_ATTEMPT_HAS_COMPLETION_FIELDS', severity: 'critical', title: 'In-progress attempt contains completion fields', detail: 'Submission, evaluation or score data exists while the lifecycle remains in progress.' });
  return issues;
}

async function loadAttempt(attemptId: string) {
  const rows = await sqlClient`
    SELECT a.id::text AS id, a.status::text AS status, a.started_at AS "startedAt",
      a.submitted_at AS "submittedAt", a.evaluated_at AS "evaluatedAt", a.updated_at AS "updatedAt",
      a.time_spent_seconds AS "timeSpentSeconds", a.raw_score AS "rawScore", a.final_score AS "finalScore",
      a.correct_count AS "correctCount", a.incorrect_count AS "incorrectCount", a.unattempted_count AS "unattemptedCount",
      a.result_snapshot AS "resultSnapshot", tv.duration_seconds AS "durationSeconds", tv.title AS "testTitle",
      u.display_name AS "studentName", sp.registration_code AS "registrationCode",
      (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = p.test_version_id) AS "questionCount"
    FROM learning.attempts a
    JOIN identity.users u ON u.id = a.user_id
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    JOIN assessment.test_publications p ON p.id = a.test_publication_id
    JOIN assessment.test_versions tv ON tv.id = p.test_version_id
    WHERE a.id = ${attemptId}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}

router.use(authenticate);

router.get('/integrity', requireAdminPermission('users.students.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT a.id::text AS id, a.status::text AS status, a.started_at AS "startedAt",
        a.submitted_at AS "submittedAt", a.evaluated_at AS "evaluatedAt", a.updated_at AS "updatedAt",
        a.time_spent_seconds AS "timeSpentSeconds", a.raw_score AS "rawScore", a.final_score AS "finalScore",
        a.correct_count AS "correctCount", a.incorrect_count AS "incorrectCount", a.unattempted_count AS "unattemptedCount",
        a.result_snapshot AS "resultSnapshot", tv.duration_seconds AS "durationSeconds", tv.title AS "testTitle",
        u.display_name AS "studentName", sp.registration_code AS "registrationCode",
        (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = p.test_version_id) AS "questionCount"
      FROM learning.attempts a
      JOIN identity.users u ON u.id = a.user_id
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      JOIN assessment.test_publications p ON p.id = a.test_publication_id
      JOIN assessment.test_versions tv ON tv.id = p.test_version_id
      ORDER BY COALESCE(a.evaluated_at, a.updated_at, a.started_at) DESC
      LIMIT 500
    `;
    const attempts = rows.map((row) => ({ ...row, issues: diagnostics(row) })).filter((row) => row.issues.length > 0);
    const critical = attempts.filter((row) => row.issues.some((issue) => issue.severity === 'critical')).length;
    return res.json({ attempts, scanned: rows.length, affected: attempts.length, critical, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to scan attempt integrity', error);
    return res.status(500).json({ error: 'Unable to scan attempt integrity', code: 'ATTEMPT_INTEGRITY_SCAN_FAILED' });
  }
});

router.get('/:attemptId/integrity', requireAdminPermission('users.students.read'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  try {
    const [attempt, notes] = await Promise.all([
      loadAttempt(attemptId),
      sqlClient`
        SELECT ae.id::text AS id, ae.reason AS content, ae.occurred_at AS "occurredAt",
          ae.actor_user_id::text AS "actorUserId", actor.display_name AS "actorName"
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE ae.entity_type = 'attempt' AND ae.entity_id = ${attemptId}::uuid
          AND ae.action_key = 'student.attempt.review_note.added'
        ORDER BY ae.occurred_at DESC
        LIMIT 100
      `,
    ]);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found', code: 'ATTEMPT_NOT_FOUND' });
    const issues = diagnostics(attempt);
    return res.json({ integrity: { state: issues.length ? (issues.some((issue) => issue.severity === 'critical') ? 'critical' : 'warning') : 'clean', issues }, notes, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load attempt integrity', error);
    return res.status(500).json({ error: 'Unable to load attempt integrity', code: 'ATTEMPT_INTEGRITY_READ_FAILED' });
  }
});

router.post('/:attemptId/notes', requireAdminPermission('users.students.manage'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  const content = text(req.body?.content).replace(/\s+/g, ' ');
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  if (content.length < 12) return res.status(400).json({ error: 'Enter a review note of at least 12 characters', code: 'ATTEMPT_REVIEW_NOTE_REQUIRED' });
  try {
    const attempt = await loadAttempt(attemptId);
    if (!attempt) return res.status(404).json({ error: 'Attempt not found', code: 'ATTEMPT_NOT_FOUND' });
    const noteId = randomUUID();
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, effective_role_key, action_key,
        entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${noteId}::uuid, 'user'::audit_actor_type,
        ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
        'student.attempt.review_note.added', 'attempt', ${attemptId}::uuid,
        ${content}, 'Added immutable attempt review note',
        ${sqlClient.json({ integrityIssuesAtNote: diagnostics(attempt).map((issue) => issue.code), scoreFieldsChanged: false, resultSnapshotChanged: false })}
      )
    `;
    return res.status(201).json({ note: { id: noteId, content, actorUserId: req.adminSession?.user.id ?? null, actorName: req.adminSession?.user.displayName ?? null, occurredAt: new Date().toISOString() } });
  } catch (error) {
    console.error('Unable to add attempt review note', error);
    return res.status(500).json({ error: 'Unable to add attempt review note', code: 'ATTEMPT_REVIEW_NOTE_FAILED' });
  }
});

export default router;
