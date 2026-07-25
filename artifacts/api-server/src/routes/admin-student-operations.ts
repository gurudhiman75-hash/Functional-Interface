import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { auth } from '../lib/firebase-admin';
import { authenticate } from '../middlewares/auth';

const router = Router();
const ACTIONS = new Set([
  'suspend',
  'reactivate',
  'disable',
  'enable',
  'revoke-sessions',
  'soft-delete',
  'restore',
]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

type BulkAction = 'suspend' | 'reactivate' | 'disable' | 'enable' | 'revoke-sessions' | 'soft-delete' | 'restore';
type FirebaseTokenRevoker = { revokeRefreshTokens(uid: string): Promise<void> };

function transition(action: BulkAction, currentStatus: string, deleted: boolean) {
  if (action === 'restore') {
    if (!deleted) throw Object.assign(new Error('Only deleted student accounts can be restored'), { code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { nextStatus: 'suspended', deletedAt: null as Date | null, revokeSessions: false, revokeFirebase: false };
  }

  if (deleted) {
    throw Object.assign(new Error('Deleted student accounts must be restored before other actions are used'), { code: 'STUDENT_ACTION_NOT_ALLOWED' });
  }

  if (action === 'suspend') {
    if (currentStatus === 'disabled') throw Object.assign(new Error('Disabled accounts cannot be suspended'), { code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { nextStatus: 'suspended', deletedAt: null, revokeSessions: true, revokeFirebase: true };
  }
  if (action === 'reactivate') {
    if (currentStatus !== 'active' && currentStatus !== 'suspended') {
      throw Object.assign(new Error('Only active or suspended accounts can be reactivated'), { code: 'STUDENT_ACTION_NOT_ALLOWED' });
    }
    return { nextStatus: 'active', deletedAt: null, revokeSessions: false, revokeFirebase: false };
  }
  if (action === 'disable') {
    return { nextStatus: 'disabled', deletedAt: null, revokeSessions: true, revokeFirebase: true };
  }
  if (action === 'enable') {
    if (currentStatus !== 'disabled') throw Object.assign(new Error('Only disabled accounts can be enabled'), { code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { nextStatus: 'suspended', deletedAt: null, revokeSessions: false, revokeFirebase: false };
  }
  if (action === 'soft-delete') {
    return { nextStatus: 'disabled', deletedAt: new Date(), revokeSessions: true, revokeFirebase: true };
  }
  return { nextStatus: currentStatus, deletedAt: null, revokeSessions: true, revokeFirebase: true };
}

router.use(authenticate);

router.get('/deleted', requireAdminPermission('users.students.read'), async (req, res) => {
  const search = text(req.query.search);
  const pattern = search ? `%${search.replace(/[%_\\]/g, '\\$&')}%` : null;
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(req.query.pageSize) || 25)));
  const offset = (page - 1) * pageSize;
  try {
    const [rows, counts] = await Promise.all([
      sqlClient`
        SELECT u.id::text AS id, u.email, u.phone, u.display_name AS "displayName",
          u.status::text AS status, u.deleted_at AS "deletedAt", u.created_at AS "createdAt",
          sp.registration_code AS "registrationCode", sp.preferred_language_code AS "preferredLanguageCode"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.deleted_at IS NOT NULL
          AND (${pattern}::text IS NULL OR u.display_name ILIKE ${pattern} ESCAPE E'\\' OR u.email ILIKE ${pattern} ESCAPE E'\\' OR sp.registration_code ILIKE ${pattern} ESCAPE E'\\')
        ORDER BY u.deleted_at DESC LIMIT ${pageSize} OFFSET ${offset}
      `,
      sqlClient`
        SELECT COUNT(*)::int AS total FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.deleted_at IS NOT NULL
          AND (${pattern}::text IS NULL OR u.display_name ILIKE ${pattern} ESCAPE E'\\' OR u.email ILIKE ${pattern} ESCAPE E'\\' OR sp.registration_code ILIKE ${pattern} ESCAPE E'\\')
      `,
    ]);
    res.json({ students: rows, page, pageSize, total: Number(counts[0]?.total ?? 0) });
  } catch (error) {
    console.error('Unable to load deleted students', error);
    res.status(500).json({ error: 'Unable to load deleted students', code: 'DELETED_STUDENTS_FAILED' });
  }
});

router.get('/:studentId/notes', requireAdminPermission('users.students.read'), async (req, res) => {
  if (!uuid.test(req.params.studentId)) return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
  try {
    const rows = await sqlClient`
      SELECT id::text AS id, occurred_at AS "occurredAt", actor_user_id::text AS "actorUserId",
        reason AS content, metadata ->> 'authorName' AS "authorName"
      FROM platform.audit_events
      WHERE entity_id = ${req.params.studentId}::uuid AND action_key = 'student.note.added'
      ORDER BY occurred_at DESC LIMIT 100
    `;
    res.json({ notes: rows });
  } catch (error) {
    console.error('Unable to load student notes', error);
    res.status(500).json({ error: 'Unable to load student notes', code: 'STUDENT_NOTES_FAILED' });
  }
});

router.post('/:studentId/notes', requireAdminPermission('users.students.manage'), async (req, res) => {
  if (!uuid.test(req.params.studentId)) return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
  const content = text(req.body?.content);
  if (content.length < 2 || content.length > 2000) return res.status(400).json({ error: 'Note must contain 2 to 2000 characters', code: 'INVALID_STUDENT_NOTE' });
  try {
    const student = await sqlClient`SELECT display_name AS "displayName" FROM identity.users WHERE id = ${req.params.studentId}::uuid LIMIT 1`;
    if (!student[0]) return res.status(404).json({ error: 'Student not found', code: 'STUDENT_NOT_FOUND' });
    const id = randomUUID();
    const authorName = req.adminSession?.user.displayName ?? req.adminSession?.user.email ?? 'Administrator';
    await sqlClient`
      INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
      VALUES (${id}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
        'student.note.added', 'student_profile', ${req.params.studentId}::uuid, ${content},
        ${`Added internal note for ${String(student[0].displayName)}`}, ${sqlClient.json({ authorName })})
    `;
    res.status(201).json({ note: { id, content, authorName, occurredAt: new Date().toISOString() } });
  } catch (error) {
    console.error('Unable to add student note', error);
    res.status(500).json({ error: 'Unable to add student note', code: 'STUDENT_NOTE_CREATE_FAILED' });
  }
});

router.post('/bulk/actions/:action', requireAdminPermission('users.students.manage'), async (req, res) => {
  const action = text(req.params.action) as BulkAction;
  if (!ACTIONS.has(action)) return res.status(400).json({ error: 'Unsupported student bulk action', code: 'INVALID_STUDENT_BULK_ACTION' });
  const studentIds = Array.isArray(req.body?.studentIds)
    ? [...new Set(req.body.studentIds.map(text).filter((id: string) => uuid.test(id)))].slice(0, 100)
    : [];
  const reason = text(req.body?.reason).replace(/\s+/g, ' ').slice(0, 500);
  if (!studentIds.length) return res.status(400).json({ error: 'Select at least one valid student', code: 'STUDENT_SELECTION_REQUIRED' });
  if (reason.length < 12) return res.status(400).json({ error: 'Provide a meaningful reason of at least 12 characters', code: 'STUDENT_ACTION_REASON_REQUIRED' });

  const results: Array<Record<string, unknown>> = [];
  for (const studentId of studentIds) {
    try {
      const operation = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT u.display_name AS "displayName", u.status::text AS status, u.deleted_at AS "deletedAt",
            sp.registration_code AS "registrationCode",
            (SELECT ai.provider_subject FROM identity.auth_identities ai
             WHERE ai.user_id = u.id AND ai.provider = 'firebase'
             ORDER BY ai.created_at ASC LIMIT 1) AS "firebaseUid",
            (SELECT COUNT(*)::int FROM identity.sessions s
             WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS "activeSessionCount"
          FROM identity.users u
          JOIN identity.student_profiles sp ON sp.user_id = u.id
          WHERE u.id = ${studentId}::uuid
          LIMIT 1 FOR UPDATE OF u
        `;
        const student = rows[0];
        if (!student) throw Object.assign(new Error('Student not found'), { code: 'STUDENT_NOT_FOUND' });

        const priorStatus = String(student.status);
        const priorDeleted = Boolean(student.deletedAt);
        const plan = transition(action, priorStatus, priorDeleted);
        const statusChanged = priorStatus !== plan.nextStatus;
        const deletionChanged = action === 'restore' ? priorDeleted : action === 'soft-delete' ? !priorDeleted : false;

        if (action === 'restore') {
          await tx`UPDATE identity.users SET deleted_at = NULL, status = 'suspended'::user_status, updated_at = now() WHERE id = ${studentId}::uuid`;
        } else if (action === 'soft-delete') {
          await tx`UPDATE identity.users SET deleted_at = now(), status = 'disabled'::user_status, updated_at = now() WHERE id = ${studentId}::uuid`;
        } else if (statusChanged) {
          await tx`UPDATE identity.users SET status = ${plan.nextStatus}::user_status, updated_at = now() WHERE id = ${studentId}::uuid`;
        }

        let sessionsRevoked = 0;
        if (plan.revokeSessions) {
          const revoked = await tx`
            UPDATE identity.sessions SET revoked_at = now()
            WHERE user_id = ${studentId}::uuid AND revoked_at IS NULL AND expires_at > now()
            RETURNING id
          `;
          sessionsRevoked = revoked.length;
        }

        const auditEventId = randomUUID();
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key, action_key,
            entity_type, entity_id, reason, summary, metadata
          ) VALUES (
            ${auditEventId}::uuid, 'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
            ${`student.bulk.${action}`}, 'student_profile', ${studentId}::uuid, ${reason},
            ${`${action} student ${String(student.displayName)}`},
            ${tx.json({
              action,
              priorStatus,
              nextStatus: plan.nextStatus,
              priorDeleted,
              deleted: action === 'soft-delete',
              restored: action === 'restore',
              sessionsRevoked,
              registrationCode: student.registrationCode,
              firebaseIdentityLinked: Boolean(student.firebaseUid),
            })}
          )
        `;

        return {
          studentId,
          displayName: String(student.displayName),
          status: plan.nextStatus,
          deleted: action === 'soft-delete',
          restored: action === 'restore',
          sessionsRevoked,
          firebaseUid: student.firebaseUid ? String(student.firebaseUid) : null,
          revokeFirebase: plan.revokeFirebase,
          changed: statusChanged || deletionChanged || sessionsRevoked > 0,
          auditEventId,
        };
      });

      let firebaseTokensRevoked = false;
      if (operation.revokeFirebase && operation.firebaseUid) {
        const revoker = auth as Partial<FirebaseTokenRevoker>;
        if (typeof revoker.revokeRefreshTokens !== 'function') {
          throw Object.assign(new Error('Canonical changes completed, but Firebase session revocation is unavailable'), {
            code: 'FIREBASE_SESSION_REVOCATION_UNAVAILABLE',
            partialOperation: operation,
          });
        }
        try {
          await revoker.revokeRefreshTokens(operation.firebaseUid);
          firebaseTokensRevoked = true;
        } catch (error) {
          console.error('Unable to revoke Firebase refresh tokens during bulk student action', { studentId, error });
          throw Object.assign(new Error('Canonical changes completed, but Firebase sessions could not be revoked'), {
            code: 'FIREBASE_SESSION_REVOCATION_FAILED',
            partialOperation: operation,
          });
        }
      }

      const { firebaseUid: _uid, revokeFirebase: _revoke, ...safe } = operation;
      results.push({ ...safe, ok: true, firebaseTokensRevoked });
    } catch (error) {
      const typed = error as { code?: string; message?: string; partialOperation?: Record<string, unknown> };
      const partial = typed.partialOperation ?? {};
      const { firebaseUid: _uid, revokeFirebase: _revoke, ...safePartial } = partial;
      results.push({
        studentId,
        ...safePartial,
        ok: false,
        code: typed.code ?? 'STUDENT_BULK_ITEM_FAILED',
        message: typed.message ?? 'Operation failed',
      });
    }
  }

  res.json({
    attempted: studentIds.length,
    succeeded: results.filter((entry) => entry.ok === true).length,
    failed: results.filter((entry) => entry.ok !== true).length,
    results,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
