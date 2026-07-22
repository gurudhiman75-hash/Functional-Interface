import { Router, type Response } from 'express';

import {
  StudentAdministrationError,
  assertStudentUuid,
  maskStudentIp,
  normalizeStudentDirectoryQuery,
} from '../lib/admin-student-administration';
import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof StudentAdministrationError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'STUDENT_ADMINISTRATION_FAILED' });
}

router.use(authenticate);

router.get('/', requireAdminPermission('users.students.read'), async (req, res) => {
  try {
    const filters = normalizeStudentDirectoryQuery(req.query as Record<string, unknown>);
    const [rows, countRows, statsRows, languageRows] = await Promise.all([
      sqlClient`
        SELECT
          u.id::text AS id,
          u.email,
          u.phone,
          u.display_name AS "displayName",
          u.status::text AS status,
          u.last_login_at AS "lastLoginAt",
          u.created_at AS "createdAt",
          u.updated_at AS "updatedAt",
          sp.registration_code AS "registrationCode",
          sp.preferred_language_code AS "preferredLanguageCode",
          COALESCE(attempts."attemptCount", 0)::int AS "attemptCount",
          COALESCE(attempts."evaluatedAttemptCount", 0)::int AS "evaluatedAttemptCount",
          attempts."latestAttemptAt",
          attempts."averageScore",
          COALESCE(sessions."activeSessionCount", 0)::int AS "activeSessionCount"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::int AS "attemptCount",
            COUNT(*) FILTER (WHERE a.status = 'evaluated')::int AS "evaluatedAttemptCount",
            MAX(COALESCE(a.submitted_at, a.updated_at)) AS "latestAttemptAt",
            ROUND(AVG(a.final_score) FILTER (WHERE a.status = 'evaluated'), 2)::float8 AS "averageScore"
          FROM learning.attempts a
          WHERE a.user_id = u.id
        ) attempts ON true
        LEFT JOIN LATERAL (
          SELECT COUNT(*)::int AS "activeSessionCount"
          FROM identity.sessions s
          WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()
        ) sessions ON true
        WHERE u.deleted_at IS NULL
          AND (${filters.status}::text IS NULL OR u.status::text = ${filters.status})
          AND (${filters.language}::text IS NULL OR lower(sp.preferred_language_code) = ${filters.language})
          AND (
            ${filters.searchPattern}::text IS NULL
            OR u.display_name ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR u.email ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR COALESCE(u.phone, '') ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR sp.registration_code ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR u.id::text ILIKE ${filters.searchPattern} ESCAPE E'\\'
          )
        ORDER BY COALESCE(attempts."latestAttemptAt", u.last_login_at, u.created_at) DESC, u.id DESC
        LIMIT ${filters.pageSize} OFFSET ${filters.offset}
      `,
      sqlClient`
        SELECT COUNT(*)::int AS total
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.deleted_at IS NULL
          AND (${filters.status}::text IS NULL OR u.status::text = ${filters.status})
          AND (${filters.language}::text IS NULL OR lower(sp.preferred_language_code) = ${filters.language})
          AND (
            ${filters.searchPattern}::text IS NULL
            OR u.display_name ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR u.email ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR COALESCE(u.phone, '') ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR sp.registration_code ILIKE ${filters.searchPattern} ESCAPE E'\\'
            OR u.id::text ILIKE ${filters.searchPattern} ESCAPE E'\\'
          )
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE u.status = 'active')::int AS active,
          COUNT(*) FILTER (WHERE u.status = 'invited')::int AS invited,
          COUNT(*) FILTER (WHERE u.status = 'suspended')::int AS suspended,
          COUNT(*) FILTER (WHERE u.status = 'disabled')::int AS disabled,
          COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM learning.attempts a WHERE a.user_id = u.id))::int AS "withAttempts",
          COALESCE((
            SELECT COUNT(*)::int
            FROM identity.sessions s
            JOIN identity.student_profiles profile ON profile.user_id = s.user_id
            JOIN identity.users session_user ON session_user.id = profile.user_id AND session_user.deleted_at IS NULL
            WHERE s.revoked_at IS NULL AND s.expires_at > now()
          ), 0)::int AS "activeSessions"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.deleted_at IS NULL
      `,
      sqlClient`
        SELECT sp.preferred_language_code AS code, COUNT(*)::int AS count
        FROM identity.student_profiles sp
        JOIN identity.users u ON u.id = sp.user_id AND u.deleted_at IS NULL
        GROUP BY sp.preferred_language_code
        ORDER BY COUNT(*) DESC, sp.preferred_language_code
      `,
    ]);

    const stats = statsRows[0] ?? {};
    res.json({
      students: rows.map((row) => ({
        ...row,
        attemptCount: number(row.attemptCount),
        evaluatedAttemptCount: number(row.evaluatedAttemptCount),
        averageScore: row.averageScore == null ? null : number(row.averageScore),
        activeSessionCount: number(row.activeSessionCount),
      })),
      page: filters.page,
      pageSize: filters.pageSize,
      total: number(countRows[0]?.total),
      stats: {
        total: number(stats.total),
        active: number(stats.active),
        invited: number(stats.invited),
        suspended: number(stats.suspended),
        disabled: number(stats.disabled),
        withAttempts: number(stats.withAttempts),
        activeSessions: number(stats.activeSessions),
      },
      facets: {
        statuses: ['active', 'invited', 'suspended', 'disabled'],
        languages: languageRows.map((row) => ({ code: String(row.code), count: number(row.count) })),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, 'Unable to load canonical students');
  }
});

router.get('/:studentId', requireAdminPermission('users.students.read'), async (req, res) => {
  try {
    const studentId = assertStudentUuid(req.params.studentId);
    const [profileRows, attemptRows, sessionRows, auditRows] = await Promise.all([
      sqlClient`
        SELECT
          u.id::text AS id,
          u.email,
          u.phone,
          u.display_name AS "displayName",
          u.status::text AS status,
          u.last_login_at AS "lastLoginAt",
          u.created_at AS "createdAt",
          u.updated_at AS "updatedAt",
          sp.registration_code AS "registrationCode",
          sp.preferred_language_code AS "preferredLanguageCode",
          sp.created_at AS "profileCreatedAt",
          sp.updated_at AS "profileUpdatedAt",
          COALESCE((
            SELECT array_agg(DISTINCT ai.provider ORDER BY ai.provider)
            FROM identity.auth_identities ai WHERE ai.user_id = u.id
          ), '{}') AS "authProviders",
          (SELECT COUNT(*)::int FROM learning.attempts a WHERE a.user_id = u.id) AS "attemptCount",
          (SELECT COUNT(*)::int FROM learning.attempts a WHERE a.user_id = u.id AND a.status = 'evaluated') AS "evaluatedAttemptCount",
          (SELECT ROUND(AVG(a.final_score), 2)::float8 FROM learning.attempts a WHERE a.user_id = u.id AND a.status = 'evaluated') AS "averageScore",
          (SELECT MAX(COALESCE(a.submitted_at, a.updated_at)) FROM learning.attempts a WHERE a.user_id = u.id) AS "latestAttemptAt",
          (SELECT COUNT(*)::int FROM identity.sessions s WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS "activeSessionCount"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.id = ${studentId}::uuid AND u.deleted_at IS NULL
        LIMIT 1
      `,
      sqlClient`
        SELECT
          a.id::text AS id,
          a.attempt_number AS "attemptNumber",
          a.status,
          a.started_at AS "startedAt",
          a.submitted_at AS "submittedAt",
          a.evaluated_at AS "evaluatedAt",
          a.time_spent_seconds AS "timeSpentSeconds",
          a.raw_score::float8 AS "rawScore",
          a.final_score::float8 AS "finalScore",
          a.correct_count AS "correctCount",
          a.incorrect_count AS "incorrectCount",
          a.unattempted_count AS "unattemptedCount",
          p.id::text AS "testPublicationId",
          t.id::text AS "testId",
          t.public_code AS "testPublicCode",
          v.title AS "testTitle"
        FROM learning.attempts a
        LEFT JOIN assessment.test_publications p ON p.id = a.test_publication_id
        LEFT JOIN assessment.tests t ON t.id = p.test_id
        LEFT JOIN assessment.test_versions v ON v.id = p.test_version_id
        WHERE a.user_id = ${studentId}::uuid
        ORDER BY COALESCE(a.submitted_at, a.updated_at) DESC, a.id DESC
        LIMIT 50
      `,
      sqlClient`
        SELECT id::text AS id, device_name AS "deviceName", ip_address AS "ipAddress",
          user_agent AS "userAgent", expires_at AS "expiresAt", revoked_at AS "revokedAt", created_at AS "createdAt"
        FROM identity.sessions
        WHERE user_id = ${studentId}::uuid
        ORDER BY created_at DESC
        LIMIT 25
      `,
      sqlClient`
        SELECT id::text AS id, occurred_at AS "occurredAt", action_key AS "actionKey",
          summary, reason, actor_user_id::text AS "actorUserId"
        FROM platform.audit_events
        WHERE entity_id = ${studentId}::uuid
          AND entity_type IN ('student', 'student_profile', 'user')
        ORDER BY occurred_at DESC, id DESC
        LIMIT 50
      `,
    ]);

    const profile = profileRows[0];
    if (!profile) {
      res.status(404).json({ error: 'Canonical student profile not found', code: 'STUDENT_NOT_FOUND' });
      return;
    }

    const sessions = sessionRows.map((row) => ({
      id: String(row.id),
      deviceName: row.deviceName ? String(row.deviceName) : null,
      maskedIpAddress: maskStudentIp(row.ipAddress),
      userAgent: row.userAgent ? String(row.userAgent).slice(0, 240) : null,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      createdAt: row.createdAt,
      state: row.revokedAt ? 'revoked' : new Date(String(row.expiresAt)).getTime() <= Date.now() ? 'expired' : 'active',
    }));

    const attempts = attemptRows.map((row) => ({
      ...row,
      attemptNumber: number(row.attemptNumber),
      timeSpentSeconds: number(row.timeSpentSeconds),
      rawScore: row.rawScore == null ? null : number(row.rawScore),
      finalScore: row.finalScore == null ? null : number(row.finalScore),
      correctCount: row.correctCount == null ? null : number(row.correctCount),
      incorrectCount: row.incorrectCount == null ? null : number(row.incorrectCount),
      unattemptedCount: row.unattemptedCount == null ? null : number(row.unattemptedCount),
    }));

    const timeline = [
      { id: `account-${studentId}`, occurredAt: profile.createdAt, type: 'account.created', title: 'Student account created', detail: profile.registrationCode },
      ...(profile.lastLoginAt ? [{ id: `login-${studentId}`, occurredAt: profile.lastLoginAt, type: 'account.last_login', title: 'Last successful sign-in', detail: null }] : []),
      ...sessions.map((session) => ({ id: `session-${session.id}`, occurredAt: session.createdAt, type: 'session.created', title: 'Session created', detail: session.deviceName || session.maskedIpAddress })),
      ...attempts.map((attempt) => ({ id: `attempt-${attempt.id}`, occurredAt: attempt.submittedAt || attempt.startedAt, type: `attempt.${attempt.status}`, title: attempt.testTitle || attempt.testPublicCode || 'Test attempt', detail: attempt.finalScore == null ? attempt.status : `Score ${attempt.finalScore}` })),
      ...auditRows.map((event) => ({ id: `audit-${event.id}`, occurredAt: event.occurredAt, type: String(event.actionKey), title: String(event.summary), detail: event.reason ? String(event.reason) : null })),
    ].sort((left, right) => new Date(String(right.occurredAt)).getTime() - new Date(String(left.occurredAt)).getTime()).slice(0, 75);

    res.json({
      student: {
        ...profile,
        attemptCount: number(profile.attemptCount),
        evaluatedAttemptCount: number(profile.evaluatedAttemptCount),
        averageScore: profile.averageScore == null ? null : number(profile.averageScore),
        activeSessionCount: number(profile.activeSessionCount),
      },
      attempts,
      sessions,
      timeline,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, 'Unable to load the canonical student profile');
  }
});

export default router;
