import { createHash, randomUUID } from 'node:crypto';
import { Router } from 'express';

import { sqlClient } from '../lib/db';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();
const recoveryRateLimit = rateLimit(5, 60 * 60, 'student-account-recovery');
const GENERIC_MESSAGE = 'If the details match an ExamTree student account, a recovery request has been recorded for support review.';

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function identifierFingerprint(value: string): string {
  return createHash('sha256').update(value.toLowerCase()).digest('hex').slice(0, 20);
}

router.post('/request', recoveryRateLimit, async (req, res) => {
  const identifier = text(req.body?.identifier).slice(0, 180);
  const contactEmail = text(req.body?.contactEmail).toLowerCase().slice(0, 254);
  const explanation = text(req.body?.explanation).replace(/\s+/g, ' ').slice(0, 1000);

  // Validation errors intentionally describe request shape only, never whether an
  // account exists. This keeps the endpoint resistant to account enumeration.
  if (identifier.length < 4) {
    return res.status(400).json({ error: 'Enter your registered email or registration code.', code: 'RECOVERY_IDENTIFIER_REQUIRED' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return res.status(400).json({ error: 'Enter a valid contact email.', code: 'RECOVERY_CONTACT_EMAIL_INVALID' });
  }
  if (explanation.length < 20) {
    return res.status(400).json({ error: 'Explain the access problem in at least 20 characters.', code: 'RECOVERY_EXPLANATION_REQUIRED' });
  }

  try {
    const normalizedIdentifier = identifier.toLowerCase();
    const rows = await sqlClient`
      SELECT u.id::text AS id, u.status::text AS status, u.deleted_at AS "deletedAt",
        sp.registration_code AS "registrationCode"
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE lower(u.email) = ${normalizedIdentifier}
         OR lower(sp.registration_code) = ${normalizedIdentifier}
      LIMIT 1
    `;
    const student = rows[0];

    if (student) {
      const requestId = randomUUID();
      await sqlClient`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${requestId}::uuid,
          'system'::audit_actor_type,
          NULL,
          'student.recovery.requested',
          'student_profile',
          ${String(student.id)}::uuid,
          ${explanation},
          'Student account recovery requested',
          ${sqlClient.json({
            requestId,
            source: 'self_service_login',
            identifierType: normalizedIdentifier.includes('@') ? 'email' : 'registration_code',
            identifierFingerprint: identifierFingerprint(normalizedIdentifier),
            contactEmailFingerprint: identifierFingerprint(contactEmail),
            accountStatusAtRequest: String(student.status),
            accountDeletedAtRequest: Boolean(student.deletedAt),
            reviewState: 'pending',
          })}
        )
      `;
    }

    // Use the same response and similar work regardless of match outcome.
    return res.status(202).json({ accepted: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error('Unable to record student recovery request', error);
    // Do not expose database or account lookup details to an unauthenticated caller.
    return res.status(202).json({ accepted: true, message: GENERIC_MESSAGE });
  }
});

export default router;
