import { createHash, randomUUID } from 'node:crypto';
import { Router } from 'express';

import { sqlClient } from '../lib/db';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();
const recoveryRateLimit = rateLimit(5, 60 * 60, 'student-account-recovery');
const GENERIC_MESSAGE = 'If the details match an ExamTree student account, a recovery request has been recorded for support review.';
const ACTIVE_REQUEST_WINDOW_DAYS = 7;
const CLOSED_REQUEST_COOLDOWN_HOURS = 24;

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

  // Validation errors describe request shape only, never whether an account exists.
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
      SELECT u.id::text AS id, u.status::text AS status, u.deleted_at AS "deletedAt"
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE lower(u.email) = ${normalizedIdentifier}
         OR lower(sp.registration_code) = ${normalizedIdentifier}
      LIMIT 1
    `;
    const student = rows[0];

    if (student) {
      await sqlClient.begin(async (tx) => {
        const studentId = String(student.id);
        // Serialize unauthenticated recovery submissions per canonical student so
        // simultaneous requests cannot create duplicate queue items.
        await tx`SELECT id FROM identity.users WHERE id = ${studentId}::uuid FOR UPDATE`;

        const recent = await tx`
          SELECT id::text AS id, occurred_at AS "occurredAt",
            COALESCE(metadata ->> 'reviewState', 'pending') AS "reviewState"
          FROM platform.audit_events
          WHERE action_key = 'student.recovery.requested'
            AND entity_id = ${studentId}::uuid
            AND occurred_at > now() - (${ACTIVE_REQUEST_WINDOW_DAYS} * interval '1 day')
          ORDER BY occurred_at DESC
          LIMIT 1
        `;
        const previous = recent[0];
        const previousState = String(previous?.reviewState ?? '');
        const isActiveDuplicate = previous && (previousState === 'pending' || previousState === 'under_review');
        const previousAt = previous?.occurredAt ? new Date(String(previous.occurredAt)).getTime() : 0;
        const isClosedCooldown = previous
          && (previousState === 'resolved' || previousState === 'rejected')
          && Date.now() - previousAt < CLOSED_REQUEST_COOLDOWN_HOURS * 60 * 60 * 1000;

        if (isActiveDuplicate || isClosedCooldown) return;

        const requestId = randomUUID();
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            reason, summary, metadata
          ) VALUES (
            ${requestId}::uuid,
            'system'::audit_actor_type,
            NULL,
            'student.recovery.requested',
            'student_profile',
            ${studentId}::uuid,
            ${explanation},
            'Student account recovery requested',
            ${tx.json({
              requestId,
              source: 'self_service_login',
              identifierType: normalizedIdentifier.includes('@') ? 'email' : 'registration_code',
              identifierFingerprint: identifierFingerprint(normalizedIdentifier),
              contactEmailFingerprint: identifierFingerprint(contactEmail),
              accountStatusAtRequest: String(student.status),
              accountDeletedAtRequest: Boolean(student.deletedAt),
              reviewState: 'pending',
              activeDuplicateWindowDays: ACTIVE_REQUEST_WINDOW_DAYS,
              closedRequestCooldownHours: CLOSED_REQUEST_COOLDOWN_HOURS,
            })}
          )
        `;
      });
    }

    // Always return the same response, including duplicate and cooldown cases.
    return res.status(202).json({ accepted: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error('Unable to record student recovery request', error);
    return res.status(202).json({ accepted: true, message: GENERIC_MESSAGE });
  }
});

export default router;
