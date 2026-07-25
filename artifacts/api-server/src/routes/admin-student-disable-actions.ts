import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { auth } from '../lib/firebase-admin';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

type FirebaseTokenRevoker = { revokeRefreshTokens(uid: string): Promise<void> };

router.use(authenticate);

router.post('/:studentId/actions/:action', requireAdminPermission('users.students.manage'), async (req, res, next) => {
  const studentId = text(req.params.studentId);
  const rawAction = text(req.params.action);
  if (rawAction !== 'disable' && rawAction !== 'enable') return next();
  const action = rawAction as 'disable' | 'enable';
  const reason = text(req.body?.reason);
  const expectedStatus = text(req.body?.expectedStatus);

  if (!uuid.test(studentId)) return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
  if (reason.length < 12) return res.status(400).json({ error: 'Provide a meaningful reason of at least 12 characters', code: 'STUDENT_ACTION_REASON_REQUIRED' });

  try {
    const operation = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT u.status::text AS status, u.display_name AS "displayName",
          sp.registration_code AS "registrationCode",
          (SELECT ai.provider_subject FROM identity.auth_identities ai
           WHERE ai.user_id = u.id AND ai.provider = 'firebase'
           ORDER BY ai.created_at ASC LIMIT 1) AS "firebaseUid",
          (SELECT COUNT(*)::int FROM identity.sessions s
           WHERE s.user_id = u.id AND s.revoked_at IS NULL AND s.expires_at > now()) AS "activeSessionCount"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.id = ${studentId}::uuid AND u.deleted_at IS NULL
        LIMIT 1 FOR UPDATE OF u
      `;
      const student = rows[0];
      if (!student) throw Object.assign(new Error('Canonical student profile not found'), { status: 404, code: 'STUDENT_NOT_FOUND' });

      const currentStatus = String(student.status);
      if (expectedStatus && expectedStatus !== currentStatus) {
        throw Object.assign(new Error('The student account changed after this profile was loaded. Refresh and review the current state.'), { status: 409, code: 'STUDENT_STATE_CHANGED' });
      }
      if (action === 'enable' && currentStatus !== 'disabled') {
        throw Object.assign(new Error('Only disabled student accounts can use the enable workflow'), { status: 409, code: 'STUDENT_ACTION_NOT_ALLOWED' });
      }

      const nextStatus = action === 'disable' ? 'disabled' : 'suspended';
      const statusChanged = currentStatus !== nextStatus;
      if (statusChanged) {
        await tx`UPDATE identity.users SET status = ${nextStatus}::user_status, updated_at = now() WHERE id = ${studentId}::uuid`;
      }

      let sessionsRevoked = 0;
      if (action === 'disable') {
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
          ${action === 'disable' ? 'student.account.disabled' : 'student.account.enabled'},
          'student_profile', ${studentId}::uuid, ${reason},
          ${`${action === 'disable' ? 'Disabled' : 'Enabled'} student ${String(student.displayName)}`},
          ${tx.json({ action, priorStatus: currentStatus, nextStatus, sessionsRevoked, registrationCode: student.registrationCode })}
        )
      `;

      return {
        action,
        changed: statusChanged || sessionsRevoked > 0,
        previousStatus: currentStatus,
        status: nextStatus,
        sessionsRevoked,
        firebaseUid: student.firebaseUid ? String(student.firebaseUid) : null,
        auditEventId,
        occurredAt: new Date().toISOString(),
      };
    });

    let firebaseTokensRevoked = false;
    if (action === 'disable' && operation.firebaseUid) {
      const revoker = auth as Partial<FirebaseTokenRevoker>;
      if (typeof revoker.revokeRefreshTokens !== 'function') {
        return res.status(503).json({ error: 'Canonical sessions were revoked, but Firebase session revocation is unavailable', code: 'FIREBASE_SESSION_REVOCATION_UNAVAILABLE' });
      }
      await revoker.revokeRefreshTokens(operation.firebaseUid);
      firebaseTokensRevoked = true;
    }

    const { firebaseUid: _firebaseUid, ...safeOperation } = operation;
    return res.json({ operation: { ...safeOperation, firebaseTokensRevoked }, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    console.error('Unable to complete disable/enable student operation', error);
    return res.status(typed.status ?? 500).json({
      error: typed.message || 'Unable to complete the student account operation',
      code: typed.code || 'STUDENT_ACCOUNT_OPERATION_FAILED',
    });
  }
});

export default router;
