import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const SUPPORTED_LANGUAGES = new Set(['en', 'hi', 'pa']);

router.use(authenticate);

router.patch('/:studentId/profile', requireAdminPermission('users.students.manage'), async (req, res) => {
  const studentId = text(req.params.studentId);
  if (!uuid.test(studentId)) return res.status(400).json({ error: 'Invalid student ID', code: 'INVALID_STUDENT_ID' });
  const displayName = text(req.body?.displayName);
  const email = text(req.body?.email).toLowerCase();
  const phone = text(req.body?.phone) || null;
  const preferredLanguageCode = text(req.body?.preferredLanguageCode).toLowerCase();
  const reason = text(req.body?.reason);
  if (displayName.length < 2 || displayName.length > 160) return res.status(400).json({ error: 'Display name must contain 2 to 160 characters', code: 'INVALID_STUDENT_NAME' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email address is required', code: 'INVALID_STUDENT_EMAIL' });
  if (phone && !/^[+0-9()\-\s]{7,24}$/.test(phone)) return res.status(400).json({ error: 'Phone number format is invalid', code: 'INVALID_STUDENT_PHONE' });
  if (!SUPPORTED_LANGUAGES.has(preferredLanguageCode)) return res.status(400).json({ error: 'Preferred language must be en, hi or pa', code: 'INVALID_STUDENT_LANGUAGE' });
  if (reason.length < 3) return res.status(400).json({ error: 'Operational reason is required', code: 'STUDENT_REASON_REQUIRED' });

  try {
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT u.display_name AS "displayName", u.email, u.phone,
          sp.preferred_language_code AS "preferredLanguageCode"
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.id = ${studentId}::uuid AND u.deleted_at IS NULL
        FOR UPDATE OF u, sp
      `;
      const current = rows[0];
      if (!current) throw Object.assign(new Error('Student not found'), { statusCode: 404, code: 'STUDENT_NOT_FOUND' });
      const duplicate = await tx`SELECT id FROM identity.users WHERE lower(email) = ${email} AND id <> ${studentId}::uuid AND deleted_at IS NULL LIMIT 1`;
      if (duplicate[0]) throw Object.assign(new Error('Another active account already uses this email address'), { statusCode: 409, code: 'STUDENT_EMAIL_CONFLICT' });
      await tx`UPDATE identity.users SET display_name = ${displayName}, email = ${email}, phone = ${phone}, updated_at = now() WHERE id = ${studentId}::uuid`;
      await tx`UPDATE identity.student_profiles SET preferred_language_code = ${preferredLanguageCode}, updated_at = now() WHERE user_id = ${studentId}::uuid`;
      const changes = [
        ['identity.users.display_name', current.displayName, displayName],
        ['identity.users.email', current.email, email],
        ['identity.users.phone', current.phone, phone],
        ['identity.student_profiles.preferred_language_code', current.preferredLanguageCode, preferredLanguageCode],
      ].filter((entry) => String(entry[1] ?? '') !== String(entry[2] ?? ''));
      const auditId = randomUUID();
      await tx`INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
        VALUES (${auditId}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
          'student.profile.updated', 'student_profile', ${studentId}::uuid, ${reason}, ${`Updated student profile for ${displayName}`}, ${tx.json({ changedFields: changes.map((entry) => entry[0]) })})`;
      for (const [fieldPath, beforeValue, afterValue] of changes) {
        await tx`INSERT INTO platform.audit_event_changes (id, audit_event_id, field_path, before_value, after_value)
          VALUES (${randomUUID()}::uuid, ${auditId}::uuid, ${fieldPath}, ${tx.json(beforeValue ?? null)}, ${tx.json(afterValue ?? null)})`;
      }
      return { displayName, email, phone, preferredLanguageCode, changedFields: changes.map((entry) => entry[0]), auditEventId: auditId };
    });
    res.json({ profile: result, generatedAt: new Date().toISOString() });
  } catch (error) {
    const statusCode = Number((error as { statusCode?: unknown })?.statusCode);
    res.status(Number.isFinite(statusCode) ? statusCode : 500).json({ error: error instanceof Error ? error.message : 'Unable to update student profile', code: (error as { code?: string })?.code ?? 'STUDENT_PROFILE_UPDATE_FAILED' });
  }
});

router.post('/:studentId/sessions/:sessionId/revoke', requireAdminPermission('users.students.manage'), async (req, res) => {
  const studentId = text(req.params.studentId);
  const sessionId = text(req.params.sessionId);
  const reason = text(req.body?.reason);
  if (!uuid.test(studentId) || !uuid.test(sessionId)) return res.status(400).json({ error: 'Invalid student or session ID', code: 'INVALID_STUDENT_SESSION_ID' });
  if (reason.length < 3) return res.status(400).json({ error: 'Operational reason is required', code: 'STUDENT_REASON_REQUIRED' });
  try {
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`SELECT s.id::text AS id, s.revoked_at AS "revokedAt", s.device_name AS "deviceName", u.display_name AS "displayName"
        FROM identity.sessions s JOIN identity.users u ON u.id = s.user_id
        WHERE s.id = ${sessionId}::uuid AND s.user_id = ${studentId}::uuid FOR UPDATE OF s`;
      const session = rows[0];
      if (!session) throw Object.assign(new Error('Student session not found'), { statusCode: 404, code: 'STUDENT_SESSION_NOT_FOUND' });
      const changed = !session.revokedAt;
      if (changed) await tx`UPDATE identity.sessions SET revoked_at = now() WHERE id = ${sessionId}::uuid`;
      const auditId = randomUUID();
      await tx`INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
        VALUES (${auditId}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
          'student.session.revoked', 'student_profile', ${studentId}::uuid, ${reason}, ${`Revoked session for ${String(session.displayName)}`}, ${tx.json({ sessionId, deviceName: session.deviceName, changed, idempotentNoOp: !changed })})`;
      return { sessionId, changed, auditEventId: auditId };
    });
    res.json({ operation: result, generatedAt: new Date().toISOString() });
  } catch (error) {
    const statusCode = Number((error as { statusCode?: unknown })?.statusCode);
    res.status(Number.isFinite(statusCode) ? statusCode : 500).json({ error: error instanceof Error ? error.message : 'Unable to revoke student session', code: (error as { code?: string })?.code ?? 'STUDENT_SESSION_REVOKE_FAILED' });
  }
});

export default router;
