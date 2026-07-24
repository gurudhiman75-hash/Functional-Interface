import { Router } from 'express';

import { normalizeStudentDirectoryQuery } from '../lib/admin-student-administration';
import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const n = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

router.use(authenticate);

router.get('/', requireAdminPermission('users.students.read'), async (req, res, next) => {
  try {
    const filters = normalizeStudentDirectoryQuery(req.query as Record<string, unknown>);
    const rows = await sqlClient`
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
        (SELECT COUNT(*)::int FROM learning.attempts a WHERE a.user_id = u.id) AS "attemptCount",
        (SELECT COUNT(*)::int FROM learning.attempts a WHERE a.user_id = u.id AND a.status = 'evaluated') AS "evaluatedAttemptCount",
        (SELECT MAX(COALESCE(a.submitted_at, a.updated_at)) FROM learning.attempts a WHERE a.user_id = u.id) AS "latestAttemptAt",
        (SELECT ROUND(AVG(a.final_score), 2)::float8 FROM learning.attempts a WHERE a.user_id = u.id AND a.status = 'evaluated') AS "averageScore",
        (SELECT COUNT(*)::int FROM identity.sessions s WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS "activeSessionCount"
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE u.deleted_at IS NULL
        AND (${filters.status}::text IS NULL OR u.status::text = ${filters.status}::text)
        AND (${filters.language}::text IS NULL OR lower(sp.preferred_language_code) = ${filters.language}::text)
        AND (
          ${filters.searchPattern}::text IS NULL
          OR u.display_name ILIKE ${filters.searchPattern}::text
          OR u.email ILIKE ${filters.searchPattern}::text
          OR COALESCE(u.phone, '') ILIKE ${filters.searchPattern}::text
          OR sp.registration_code ILIKE ${filters.searchPattern}::text
          OR u.id::text ILIKE ${filters.searchPattern}::text
        )
      ORDER BY COALESCE(
        (SELECT MAX(COALESCE(a.submitted_at, a.updated_at)) FROM learning.attempts a WHERE a.user_id = u.id),
        u.last_login_at,
        u.created_at
      ) DESC, u.id DESC
      LIMIT ${filters.pageSize} OFFSET ${filters.offset}
    `;

    const countRows = await sqlClient`
      SELECT COUNT(*)::int AS total
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE u.deleted_at IS NULL
        AND (${filters.status}::text IS NULL OR u.status::text = ${filters.status}::text)
        AND (${filters.language}::text IS NULL OR lower(sp.preferred_language_code) = ${filters.language}::text)
        AND (
          ${filters.searchPattern}::text IS NULL
          OR u.display_name ILIKE ${filters.searchPattern}::text
          OR u.email ILIKE ${filters.searchPattern}::text
          OR COALESCE(u.phone, '') ILIKE ${filters.searchPattern}::text
          OR sp.registration_code ILIKE ${filters.searchPattern}::text
          OR u.id::text ILIKE ${filters.searchPattern}::text
        )
    `;

    const allRows = await sqlClient`
      SELECT u.status::text AS status, sp.preferred_language_code AS language,
        EXISTS (SELECT 1 FROM learning.attempts a WHERE a.user_id = u.id) AS "hasAttempts",
        (SELECT COUNT(*)::int FROM identity.sessions s WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS sessions
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE u.deleted_at IS NULL
    `;

    const languageCounts = new Map<string, number>();
    for (const row of allRows) languageCounts.set(String(row.language), (languageCounts.get(String(row.language)) ?? 0) + 1);

    res.json({
      students: rows.map((row) => ({
        ...row,
        attemptCount: n(row.attemptCount),
        evaluatedAttemptCount: n(row.evaluatedAttemptCount),
        averageScore: row.averageScore == null ? null : n(row.averageScore),
        activeSessionCount: n(row.activeSessionCount),
      })),
      page: filters.page,
      pageSize: filters.pageSize,
      total: n(countRows[0]?.total),
      stats: {
        total: allRows.length,
        active: allRows.filter((row) => row.status === 'active').length,
        invited: allRows.filter((row) => row.status === 'invited').length,
        suspended: allRows.filter((row) => row.status === 'suspended').length,
        disabled: allRows.filter((row) => row.status === 'disabled').length,
        withAttempts: allRows.filter((row) => row.hasAttempts).length,
        activeSessions: allRows.reduce((sum, row) => sum + n(row.sessions), 0),
      },
      facets: {
        statuses: ['active', 'invited', 'suspended', 'disabled'],
        languages: [...languageCounts.entries()].map(([code, count]) => ({ code, count })),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Resilient student directory failed', error);
    next(error);
  }
});

export default router;
