import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { auth } from '../lib/firebase-admin';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SINGLE_ACTIONS = new Set(['suspend', 'reactivate', 'disable', 'enable', 'revoke-sessions']);
const BULK_ACTIONS = new Set([...SINGLE_ACTIONS, 'soft-delete', 'restore']);
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

type FirebaseTokenRevoker = { revokeRefreshTokens(uid: string): Promise<void> };
type LifecycleAction = 'suspend' | 'reactivate' | 'disable' | 'enable' | 'revoke-sessions' | 'soft-delete' | 'restore';

type StudentSnapshot = {
  status: string;
  deletedAt: unknown;
  displayName: string;
  registrationCode: string;
  firebaseUid: string | null;
};

function revoker(): FirebaseTokenRevoker | null {
  const candidate = auth as Partial<FirebaseTokenRevoker> | null;
  return candidate && typeof candidate.revokeRefreshTokens === 'function'
    ? candidate as FirebaseTokenRevoker
    : null;
}

function needsFirebaseRevocation(action: LifecycleAction): boolean {
  return action === 'suspend'
    || action === 'disable'
    || action === 'revoke-sessions'
    || action === 'soft-delete';
}

function nextState(action: LifecycleAction, currentStatus: string, deletedAt: unknown) {
  if (action === 'suspend') {
    if (deletedAt || currentStatus === 'disabled') throw Object.assign(new Error('Disabled or deleted students cannot be suspended'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'suspended', deleted: false, revokeSessions: true };
  }
  if (action === 'reactivate') {
    if (deletedAt || currentStatus === 'disabled' || currentStatus === 'invited') throw Object.assign(new Error('Only active or suspended students can be reactivated'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'active', deleted: false, revokeSessions: false };
  }
  if (action === 'disable') {
    if (deletedAt) throw Object.assign(new Error('Deleted students must be restored before disabling'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'disabled', deleted: false, revokeSessions: true };
  }
  if (action === 'enable') {
    if (deletedAt || currentStatus !== 'disabled') throw Object.assign(new Error('Only disabled students can use the enable workflow'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'suspended', deleted: false, revokeSessions: false };
  }
  if (action === 'soft-delete') {
    if (deletedAt) throw Object.assign(new Error('Student is already deleted'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'disabled', deleted: true, revokeSessions: true };
  }
  if (action === 'restore') {
    if (!deletedAt) throw Object.assign(new Error('Only deleted students can be restored'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
    return { status: 'suspended', deleted: false, revokeSessions: false };
  }
  if (deletedAt) throw Object.assign(new Error('Deleted students cannot have sessions revoked through this workflow'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
  return { status: currentStatus, deleted: false, revokeSessions: true };
}

async function snapshot(studentId: string): Promise<StudentSnapshot> {
  const rows = await sqlClient`
    SELECT u.status::text AS status, u.deleted_at AS "deletedAt", u.display_name AS "displayName",
      sp.registration_code AS "registrationCode",
      (SELECT ai.provider_subject FROM identity.auth_identities ai
       WHERE ai.user_id = u.id AND ai.provider = 'firebase'
       ORDER BY ai.created_at ASC LIMIT 1) AS "firebaseUid"
    FROM identity.users u
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE u.id = ${studentId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw Object.assign(new Error('Canonical student profile not found'), { status: 404, code: 'STUDENT_NOT_FOUND' });
  return {
    status: String(row.status),
    deletedAt: row.deletedAt,
    displayName: String(row.displayName),
    registrationCode: String(row.registrationCode),
    firebaseUid: row.firebaseUid ? String(row.firebaseUid) : null,
  };
}

async function revokeFirebaseBeforeCommit(action: LifecycleAction, student: StudentSnapshot): Promise<boolean> {
  if (!needsFirebaseRevocation(action) || !student.firebaseUid) return false;
  const tokenRevoker = revoker();
  if (!tokenRevoker) throw Object.assign(new Error('Firebase session revocation is unavailable; no account changes were committed'), { status: 503, code: 'FIREBASE_SESSION_REVOCATION_UNAVAILABLE' });
  try {
    await tokenRevoker.revokeRefreshTokens(student.firebaseUid);
    return true;
  } catch (error) {
    console.error('Unable to revoke Firebase refresh tokens before lifecycle commit', error);
    throw Object.assign(new Error('Firebase sessions could not be revoked; no account changes were committed'), { status: 502, code: 'FIREBASE_SESSION_REVOCATION_FAILED' });
  }
}

async function commitLifecycle(input: {
  studentId: string;
  action: LifecycleAction;
  reason: string;
  expectedStatus?: string;
  expectedDeletedAt?: unknown;
  firebaseTokensRevoked: boolean;
  actorUserId: string | null;
  actorRole: string | null;
}) {
  return sqlClient.begin(async (tx) => {
    const rows = await tx`
      SELECT u.status::text AS status, u.deleted_at AS "deletedAt", u.display_name AS "displayName",
        sp.registration_code AS "registrationCode",
        (SELECT COUNT(*)::int FROM identity.sessions s
         WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS "activeSessionCount"
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE u.id = ${input.studentId}::uuid
      LIMIT 1 FOR UPDATE OF u
    `;
    const student = rows[0];
    if (!student) throw Object.assign(new Error('Canonical student profile not found'), { status: 404, code: 'STUDENT_NOT_FOUND' });

    const currentStatus = String(student.status);
    const currentDeletedAt = student.deletedAt;
    if (input.expectedStatus && input.expectedStatus !== currentStatus) {
      throw Object.assign(new Error('The student account changed after it was loaded. Refresh and review the current state.'), { status: 409, code: 'STUDENT_STATE_CHANGED' });
    }
    if (input.expectedDeletedAt !== undefined && Boolean(input.expectedDeletedAt) !== Boolean(currentDeletedAt)) {
      throw Object.assign(new Error('The student deletion state changed during the operation. Refresh and retry.'), { status: 409, code: 'STUDENT_STATE_CHANGED' });
    }

    const plan = nextState(input.action, currentStatus, currentDeletedAt);
    if (input.action === 'soft-delete') {
      await tx`UPDATE identity.users SET status = 'disabled'::user_status, deleted_at = now(), updated_at = now() WHERE id = ${input.studentId}::uuid`;
    } else if (input.action === 'restore') {
      await tx`UPDATE identity.users SET status = 'suspended'::user_status, deleted_at = NULL, updated_at = now() WHERE id = ${input.studentId}::uuid`;
    } else if (plan.status !== currentStatus) {
      await tx`UPDATE identity.users SET status = ${plan.status}::user_status, updated_at = now() WHERE id = ${input.studentId}::uuid`;
    }

    let sessionsRevoked = 0;
    if (plan.revokeSessions) {
      const revoked = await tx`
        UPDATE identity.sessions SET revoked_at = now()
        WHERE user_id = ${input.studentId}::uuid AND revoked_at IS NULL AND expires_at > now()
        RETURNING id
      `;
      sessionsRevoked = revoked.length;
    }

    const changed = plan.status !== currentStatus || Boolean(currentDeletedAt) !== plan.deleted || sessionsRevoked > 0;
    const auditEventId = randomUUID();
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, effective_role_key, action_key,
        entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${auditEventId}::uuid, 'user'::audit_actor_type, ${input.actorUserId}::uuid, ${input.actorRole},
        ${`student.account.${input.action}`}, 'student_profile', ${input.studentId}::uuid,
        ${input.reason}, ${`${input.action} student ${String(student.displayName)}`},
        ${tx.json({
          action: input.action,
          priorStatus: currentStatus,
          nextStatus: plan.status,
          priorDeleted: Boolean(currentDeletedAt),
          nextDeleted: plan.deleted,
          sessionsRevoked,
          firebaseTokensRevoked: input.firebaseTokensRevoked,
          registrationCode: student.registrationCode,
          changed,
        })}
      )
    `;

    return {
      studentId: input.studentId,
      action: input.action,
      changed,
      previousStatus: currentStatus,
      status: plan.status,
      deleted: plan.deleted,
      sessionsRevoked,
      firebaseTokensRevoked: input.firebaseTokensRevoked,
      auditEventId,
      occurredAt: new Date().toISOString(),
    };
  });
}

router.use(authenticate);

router.post('/:studentId/actions/:action', requireAdminPermission('users.students.manage'), async (req, res, next) => {
  const action = text(req.params.action) as LifecycleAction;
  if (!SINGLE_ACTIONS.has(action)) return next();
  const studentId = text(req.params.studentId);
  const reason = text(req.body?.reason).replace(/\s+/g, ' ').slice(0, 500);
  const expectedStatus = text(req.body?.expectedStatus) || undefined;
  if (!uuid.test(studentId)) return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
  if (reason.length < 12) return res.status(400).json({ error: 'Provide a meaningful reason of at least 12 characters', code: 'STUDENT_ACTION_REASON_REQUIRED' });

  try {
    const before = await snapshot(studentId);
    nextState(action, before.status, before.deletedAt);
    if (expectedStatus && expectedStatus !== before.status) return res.status(409).json({ error: 'The student account changed after it was loaded. Refresh and review the current state.', code: 'STUDENT_STATE_CHANGED' });
    const firebaseTokensRevoked = await revokeFirebaseBeforeCommit(action, before);
    const operation = await commitLifecycle({
      studentId, action, reason, expectedStatus: before.status, expectedDeletedAt: before.deletedAt,
      firebaseTokensRevoked,
      actorUserId: req.adminSession?.user.id ?? null,
      actorRole: req.adminSession?.roles[0] ?? null,
    });
    return res.json({ operation, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    console.error('Unable to complete consistent student lifecycle operation', error);
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to complete the student account operation', code: typed.code || 'STUDENT_ACCOUNT_OPERATION_FAILED' });
  }
});

router.post('/bulk/actions/:action', requireAdminPermission('users.students.manage'), async (req, res, next) => {
  const action = text(req.params.action) as LifecycleAction;
  if (!BULK_ACTIONS.has(action)) return next();
  const reason = text(req.body?.reason).replace(/\s+/g, ' ').slice(0, 500);
  const studentIds = Array.isArray(req.body?.studentIds)
    ? [...new Set(req.body.studentIds.map(text).filter((id: string) => uuid.test(id)))].slice(0, 100)
    : [];
  if (!studentIds.length) return res.status(400).json({ error: 'Select at least one valid student', code: 'STUDENT_SELECTION_REQUIRED' });
  if (reason.length < 12) return res.status(400).json({ error: 'Provide a meaningful reason of at least 12 characters', code: 'STUDENT_ACTION_REASON_REQUIRED' });

  const results = [];
  for (const studentId of studentIds) {
    try {
      const before = await snapshot(studentId);
      nextState(action, before.status, before.deletedAt);
      const firebaseTokensRevoked = await revokeFirebaseBeforeCommit(action, before);
      const operation = await commitLifecycle({
        studentId, action, reason, expectedStatus: before.status, expectedDeletedAt: before.deletedAt,
        firebaseTokensRevoked,
        actorUserId: req.adminSession?.user.id ?? null,
        actorRole: req.adminSession?.roles[0] ?? null,
      });
      results.push({ ok: true, ...operation });
    } catch (error) {
      const typed = error as { code?: string; message?: string };
      results.push({ studentId, ok: false, code: typed.code || 'STUDENT_ACCOUNT_OPERATION_FAILED', message: typed.message || 'Operation failed' });
    }
  }

  return res.json({
    attempted: studentIds.length,
    succeeded: results.filter((entry) => entry.ok).length,
    failed: results.filter((entry) => !entry.ok).length,
    results,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
