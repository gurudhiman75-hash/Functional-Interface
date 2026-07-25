import { createHash, randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { auth } from '../lib/firebase-admin';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const normalizeEmail = (value: unknown) => text(value).toLowerCase();
const fingerprint = (value: string | null) => value ? createHash('sha256').update(value).digest('hex').slice(0, 16) : null;

type FirebaseRecoveryAuth = {
  getUserByEmail(email: string): Promise<{
    uid: string;
    email?: string;
    emailVerified?: boolean;
    disabled?: boolean;
  }>;
  revokeRefreshTokens(uid: string): Promise<void>;
};

router.use(authenticate);

router.post(
  '/:studentId/recovery/relink-firebase',
  requireAdminPermission('users.students.manage'),
  async (req, res) => {
    const studentId = text(req.params.studentId);
    const reason = text(req.body?.reason).replace(/\s+/g, ' ').slice(0, 500);
    const confirmationEmail = normalizeEmail(req.body?.confirmationEmail);
    const expectedStatus = text(req.body?.expectedStatus).toLowerCase();

    if (!uuid.test(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
    }
    if (reason.length < 20) {
      return res.status(400).json({
        error: 'Provide a detailed recovery reason of at least 20 characters',
        code: 'STUDENT_RECOVERY_REASON_REQUIRED',
      });
    }

    try {
      const targetRows = await sqlClient`
        SELECT u.email, u.status::text AS status, u.display_name AS "displayName", u.deleted_at AS "deletedAt",
          sp.registration_code AS "registrationCode",
          (SELECT ai.provider_subject FROM identity.auth_identities ai
           WHERE ai.user_id = u.id AND ai.provider = 'firebase'
           ORDER BY ai.created_at ASC LIMIT 1) AS "currentFirebaseUid"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.id = ${studentId}::uuid
        LIMIT 1
      `;
      const target = targetRows[0];
      if (!target || target.deletedAt) {
        return res.status(404).json({ error: 'Recoverable canonical student not found', code: 'STUDENT_NOT_FOUND' });
      }

      const canonicalEmail = normalizeEmail(target.email);
      if (!confirmationEmail || confirmationEmail !== canonicalEmail) {
        return res.status(400).json({
          error: 'Enter the student canonical email exactly to confirm identity recovery',
          code: 'STUDENT_RECOVERY_EMAIL_CONFIRMATION_FAILED',
        });
      }
      if (expectedStatus && expectedStatus !== String(target.status)) {
        return res.status(409).json({
          error: 'The student account changed after this profile was loaded. Refresh before recovering it.',
          code: 'STUDENT_STATE_CHANGED',
        });
      }

      const firebaseAuth = auth as Partial<FirebaseRecoveryAuth>;
      if (typeof firebaseAuth.getUserByEmail !== 'function' || typeof firebaseAuth.revokeRefreshTokens !== 'function') {
        return res.status(503).json({
          error: 'Firebase identity recovery is unavailable',
          code: 'FIREBASE_RECOVERY_UNAVAILABLE',
        });
      }

      let firebaseUser: Awaited<ReturnType<FirebaseRecoveryAuth['getUserByEmail']>>;
      try {
        firebaseUser = await firebaseAuth.getUserByEmail(canonicalEmail);
      } catch (error) {
        console.error('Unable to resolve Firebase recovery identity', error);
        return res.status(404).json({
          error: 'No Firebase account exists for the canonical student email',
          code: 'FIREBASE_RECOVERY_IDENTITY_NOT_FOUND',
        });
      }

      if (!firebaseUser.emailVerified) {
        return res.status(409).json({
          error: 'The Firebase email must be verified before recovery',
          code: 'FIREBASE_RECOVERY_EMAIL_NOT_VERIFIED',
        });
      }
      if (firebaseUser.disabled) {
        return res.status(409).json({
          error: 'The Firebase account is disabled and cannot be linked for recovery',
          code: 'FIREBASE_RECOVERY_IDENTITY_DISABLED',
        });
      }
      if (normalizeEmail(firebaseUser.email) !== canonicalEmail) {
        return res.status(409).json({
          error: 'The resolved Firebase email does not match the canonical student email',
          code: 'FIREBASE_RECOVERY_EMAIL_MISMATCH',
        });
      }

      const conflict = await sqlClient`
        SELECT user_id::text AS "userId"
        FROM identity.auth_identities
        WHERE provider = 'firebase' AND provider_subject = ${firebaseUser.uid}
        LIMIT 1
      `;
      if (conflict[0] && String(conflict[0].userId) !== studentId) {
        return res.status(409).json({
          error: 'This Firebase identity is already linked to another canonical account',
          code: 'FIREBASE_RECOVERY_IDENTITY_CONFLICT',
        });
      }

      const oldUid = target.currentFirebaseUid ? String(target.currentFirebaseUid) : null;
      const uidsToRevoke = [...new Set([oldUid, firebaseUser.uid].filter((uid): uid is string => Boolean(uid)))];
      try {
        for (const uid of uidsToRevoke) await firebaseAuth.revokeRefreshTokens(uid);
      } catch (error) {
        console.error('Unable to revoke Firebase sessions before account recovery', error);
        return res.status(502).json({
          error: 'Identity recovery was not applied because Firebase sessions could not be revoked',
          code: 'FIREBASE_RECOVERY_REVOCATION_FAILED',
        });
      }

      const operation = await sqlClient.begin(async (tx) => {
        const lockedRows = await tx`
          SELECT u.email, u.status::text AS status, u.deleted_at AS "deletedAt",
            (SELECT ai.provider_subject FROM identity.auth_identities ai
             WHERE ai.user_id = u.id AND ai.provider = 'firebase'
             ORDER BY ai.created_at ASC LIMIT 1) AS "currentFirebaseUid"
          FROM identity.users u
          JOIN identity.student_profiles sp ON sp.user_id = u.id
          WHERE u.id = ${studentId}::uuid
          LIMIT 1 FOR UPDATE OF u
        `;
        const locked = lockedRows[0];
        if (!locked || locked.deletedAt) throw Object.assign(new Error('Recoverable canonical student not found'), { status: 404, code: 'STUDENT_NOT_FOUND' });
        if (normalizeEmail(locked.email) !== canonicalEmail || String(locked.status) !== String(target.status)) {
          throw Object.assign(new Error('The student account changed during recovery. Refresh and retry.'), { status: 409, code: 'STUDENT_STATE_CHANGED' });
        }

        const lockedUid = locked.currentFirebaseUid ? String(locked.currentFirebaseUid) : null;
        if (lockedUid !== oldUid) {
          throw Object.assign(new Error('The linked Firebase identity changed during recovery. Refresh and retry.'), { status: 409, code: 'STUDENT_IDENTITY_CHANGED' });
        }

        const lockedConflict = await tx`
          SELECT user_id::text AS "userId"
          FROM identity.auth_identities
          WHERE provider = 'firebase' AND provider_subject = ${firebaseUser.uid}
          LIMIT 1 FOR UPDATE
        `;
        if (lockedConflict[0] && String(lockedConflict[0].userId) !== studentId) {
          throw Object.assign(new Error('This Firebase identity is already linked to another canonical account'), { status: 409, code: 'FIREBASE_RECOVERY_IDENTITY_CONFLICT' });
        }

        await tx`DELETE FROM identity.auth_identities WHERE user_id = ${studentId}::uuid AND provider = 'firebase'`;
        await tx`
          INSERT INTO identity.auth_identities (user_id, provider, provider_subject)
          VALUES (${studentId}::uuid, 'firebase', ${firebaseUser.uid})
        `;

        const priorStatus = String(locked.status);
        const nextStatus = priorStatus === 'disabled' ? 'disabled' : 'suspended';
        await tx`
          UPDATE identity.users
          SET status = ${nextStatus}::user_status, updated_at = now()
          WHERE id = ${studentId}::uuid
        `;
        const revokedSessions = await tx`
          UPDATE identity.sessions SET revoked_at = now()
          WHERE user_id = ${studentId}::uuid AND revoked_at IS NULL AND expires_at > now()
          RETURNING id
        `;

        const auditEventId = randomUUID();
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key, action_key,
            entity_type, entity_id, reason, summary, metadata
          ) VALUES (
            ${auditEventId}::uuid, 'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
            'student.account.firebase_identity_relinked', 'student_profile', ${studentId}::uuid,
            ${reason}, ${`Recovered Firebase access for ${String(target.displayName)}`},
            ${tx.json({
              registrationCode: String(target.registrationCode),
              canonicalEmail,
              oldIdentityFingerprint: fingerprint(oldUid),
              newIdentityFingerprint: fingerprint(firebaseUser.uid),
              identityChanged: oldUid !== firebaseUser.uid,
              priorStatus,
              nextStatus,
              canonicalSessionsRevoked: revokedSessions.length,
              firebaseIdentitiesRevoked: uidsToRevoke.length,
              verification: 'firebase-email-verified-and-canonical-email-match',
            })}
          )
        `;

        return {
          studentId,
          canonicalEmail,
          previousStatus: priorStatus,
          status: nextStatus,
          identityChanged: oldUid !== firebaseUser.uid,
          sessionsRevoked: revokedSessions.length,
          firebaseIdentitiesRevoked: uidsToRevoke.length,
          auditEventId,
          occurredAt: new Date().toISOString(),
        };
      });

      return res.json({ operation, generatedAt: new Date().toISOString() });
    } catch (error) {
      const typed = error as { status?: number; code?: string; message?: string };
      console.error('Unable to recover student Firebase identity', error);
      return res.status(typed.status ?? 500).json({
        error: typed.message || 'Unable to recover the student account',
        code: typed.code || 'STUDENT_ACCOUNT_RECOVERY_FAILED',
      });
    }
  },
);

export default router;
