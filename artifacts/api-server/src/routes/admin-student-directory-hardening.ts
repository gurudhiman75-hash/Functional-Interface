import { Router } from 'express';

import { normalizeStudentDirectoryQuery } from '../lib/admin-student-administration';
import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
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
            JOIN identity.users linked_user ON linked_user.id = profile.user_id AND linked_user.deleted_at IS NULL
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
    console.error('Unable to load canonical students', error);
    res.status(500).json({ error: 'Unable to load canonical students', code: 'STUDENT_ADMINISTRATION_FAILED' });
  }
});

export default router;
