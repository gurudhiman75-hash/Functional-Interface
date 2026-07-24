import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { auth } from '../lib/firebase-admin';
import { authenticate } from '../middlewares/auth';

const router = Router();
const ADMIN_EMAIL = 'gurbajdhiman@gmail.com';

type FirebaseAuthWithUsers = typeof auth & {
  listUsers: (maxResults?: number, pageToken?: string) => Promise<{
    users: Array<{ uid: string; email?: string; displayName?: string; disabled?: boolean }>;
    pageToken?: string;
  }>;
};

const registrationCode = (userId: string) => `STU-${userId.replaceAll('-', '').slice(0, 12).toUpperCase()}`;

router.use(authenticate);

router.post('/sync-firebase', requireAdminPermission('users.students.manage'), async (req, res) => {
  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';
  if (reason.length < 3) {
    res.status(400).json({ error: 'Operational reason is required', code: 'STUDENT_REASON_REQUIRED' });
    return;
  }

  const firebaseAuth = auth as FirebaseAuthWithUsers;
  if (typeof firebaseAuth.listUsers !== 'function') {
    res.status(503).json({ error: 'Firebase user listing is unavailable', code: 'FIREBASE_USER_SYNC_UNAVAILABLE' });
    return;
  }

  const results: Array<{ uid: string; email: string | null; status: string; studentId?: string; message?: string }> = [];
  let pageToken: string | undefined;

  try {
    do {
      const page = await firebaseAuth.listUsers(1000, pageToken);
      pageToken = page.pageToken;
      for (const firebaseUser of page.users) {
        const email = firebaseUser.email?.trim().toLowerCase() ?? '';
        if (!email || email === ADMIN_EMAIL) {
          results.push({ uid: firebaseUser.uid, email: email || null, status: 'skipped', message: email === ADMIN_EMAIL ? 'Administrator account' : 'Email missing' });
          continue;
        }
        try {
          const outcome = await sqlClient.begin(async (tx) => {
            const identityRows = await tx`
              SELECT u.id::text AS id
              FROM identity.auth_identities ai
              JOIN identity.users u ON u.id = ai.user_id
              WHERE ai.provider = 'firebase' AND ai.provider_subject = ${firebaseUser.uid}
              LIMIT 1
              FOR UPDATE OF u
            `;
            const emailRows = identityRows.length ? [] : await tx`
              SELECT id::text AS id FROM identity.users
              WHERE lower(email) = ${email} AND deleted_at IS NULL
              LIMIT 1 FOR UPDATE
            `;
            let userId = String(identityRows[0]?.id ?? emailRows[0]?.id ?? '');
            let userCreated = false;
            if (!userId) {
              const created = await tx`
                INSERT INTO identity.users (email, display_name, status, last_login_at)
                VALUES (${email}, ${firebaseUser.displayName?.trim() || email.split('@')[0] || 'Student'}, ${firebaseUser.disabled ? 'disabled' : 'active'}::user_status, now())
                RETURNING id::text AS id
              `;
              userId = String(created[0].id);
              userCreated = true;
            }
            await tx`
              INSERT INTO identity.auth_identities (user_id, provider, provider_subject)
              VALUES (${userId}::uuid, 'firebase', ${firebaseUser.uid})
              ON CONFLICT (provider, provider_subject) DO UPDATE SET user_id = EXCLUDED.user_id, updated_at = now()
            `;
            const profiles = await tx`SELECT user_id FROM identity.student_profiles WHERE user_id = ${userId}::uuid LIMIT 1`;
            let profileCreated = false;
            if (!profiles.length) {
              await tx`
                INSERT INTO identity.student_profiles (user_id, registration_code, preferred_language_code)
                VALUES (${userId}::uuid, ${registrationCode(userId)}, 'en')
              `;
              profileCreated = true;
            }
            await tx`
              INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
              VALUES (${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
                ${req.adminSession?.roles[0] ?? null}, 'student.firebase.reconciled', 'student_profile', ${userId}::uuid,
                ${reason}, ${`Reconciled Firebase student ${email}`}, ${tx.json({ firebaseUid: firebaseUser.uid, email, userCreated, profileCreated })})
            `;
            return { userId, userCreated, profileCreated };
          });
          results.push({ uid: firebaseUser.uid, email, studentId: outcome.userId, status: outcome.profileCreated ? 'created' : outcome.userCreated ? 'linked' : 'already-canonical' });
        } catch (error) {
          results.push({ uid: firebaseUser.uid, email, status: 'failed', message: error instanceof Error ? error.message : 'Reconciliation failed' });
        }
      }
    } while (pageToken);

    res.json({
      scanned: results.length,
      created: results.filter((entry) => entry.status === 'created').length,
      linked: results.filter((entry) => entry.status === 'linked').length,
      existing: results.filter((entry) => entry.status === 'already-canonical').length,
      skipped: results.filter((entry) => entry.status === 'skipped').length,
      failed: results.filter((entry) => entry.status === 'failed').length,
      results,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to reconcile Firebase students', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to reconcile Firebase students', code: 'FIREBASE_STUDENT_SYNC_FAILED' });
  }
});

export default router;
