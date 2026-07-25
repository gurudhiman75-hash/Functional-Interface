import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const REVIEW_STATES = new Set(['pending', 'under_review', 'resolved', 'rejected']);
const MUTABLE_REVIEW_STATES = new Set(['under_review', 'rejected']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

router.use(authenticate);

router.get('/recovery-requests', requireAdminPermission('users.students.read'), async (req, res) => {
  const state = text(req.query.state).toLowerCase() || 'pending';
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(req.query.pageSize) || 25)));
  const offset = (page - 1) * pageSize;
  if (!REVIEW_STATES.has(state)) return res.status(400).json({ error: 'Unsupported recovery review state', code: 'INVALID_RECOVERY_REVIEW_STATE' });

  try {
    const [rows, totals] = await Promise.all([
      sqlClient`
        SELECT ae.id::text AS id, ae.entity_id::text AS "studentId", ae.occurred_at AS "occurredAt",
          ae.reason AS explanation, COALESCE(ae.metadata ->> 'reviewState', 'pending') AS "reviewState",
          ae.metadata ->> 'source' AS source, ae.metadata ->> 'identifierType' AS "identifierType",
          ae.metadata ->> 'accountStatusAtRequest' AS "accountStatusAtRequest",
          COALESCE((ae.metadata ->> 'accountDeletedAtRequest')::boolean, false) AS "accountDeletedAtRequest",
          ae.metadata ->> 'reviewedAt' AS "reviewedAt", ae.metadata ->> 'reviewNote' AS "reviewNote",
          ae.metadata ->> 'assignedToUserId' AS "assignedToUserId",
          ae.metadata ->> 'operationAuditEventId' AS "operationAuditEventId",
          ae.metadata ->> 'resolvedAt' AS "resolvedAt",
          u.display_name AS "displayName", u.email AS email, u.status::text AS status,
          u.deleted_at AS "deletedAt", sp.registration_code AS "registrationCode"
        FROM platform.audit_events ae
        JOIN identity.users u ON u.id = ae.entity_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE ae.action_key = 'student.recovery.requested'
          AND COALESCE(ae.metadata ->> 'reviewState', 'pending') = ${state}
        ORDER BY ae.occurred_at ASC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      sqlClient`
        SELECT COUNT(*)::int AS total
        FROM platform.audit_events ae
        WHERE ae.action_key = 'student.recovery.requested'
          AND COALESCE(ae.metadata ->> 'reviewState', 'pending') = ${state}
      `,
    ]);
    return res.json({ requests: rows, state, page, pageSize, total: Number(totals[0]?.total ?? 0), generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load student recovery requests', error);
    return res.status(500).json({ error: 'Unable to load student recovery requests', code: 'RECOVERY_REQUEST_QUEUE_FAILED' });
  }
});

router.patch('/recovery-requests/:requestId', requireAdminPermission('users.students.manage'), async (req, res) => {
  const requestId = text(req.params.requestId);
  const reviewState = text(req.body?.reviewState).toLowerCase();
  const reviewNote = text(req.body?.reviewNote).replace(/\s+/g, ' ').slice(0, 1000);
  if (!uuid.test(requestId)) return res.status(400).json({ error: 'Invalid recovery request ID', code: 'INVALID_RECOVERY_REQUEST_ID' });
  if (reviewState === 'resolved') return res.status(409).json({ error: 'A recovery request is resolved only by a successful verified identity relink', code: 'RECOVERY_RESOLUTION_REQUIRES_RELINK' });
  if (!MUTABLE_REVIEW_STATES.has(reviewState)) return res.status(400).json({ error: 'Choose under review or rejected', code: 'INVALID_RECOVERY_REVIEW_STATE' });
  if (reviewNote.length < 12) return res.status(400).json({ error: 'Provide a review note of at least 12 characters', code: 'RECOVERY_REVIEW_NOTE_REQUIRED' });

  try {
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT id::text AS id, entity_id::text AS "studentId",
          COALESCE(metadata ->> 'reviewState', 'pending') AS "reviewState",
          metadata ->> 'assignedToUserId' AS "assignedToUserId"
        FROM platform.audit_events
        WHERE id = ${requestId}::uuid AND action_key = 'student.recovery.requested'
        LIMIT 1 FOR UPDATE
      `;
      const request = rows[0];
      if (!request) throw Object.assign(new Error('Recovery request not found'), { status: 404, code: 'RECOVERY_REQUEST_NOT_FOUND' });
      const currentState = String(request.reviewState);
      if (currentState === 'resolved' || currentState === 'rejected') {
        throw Object.assign(new Error('This recovery request is already closed'), { status: 409, code: 'RECOVERY_REQUEST_ALREADY_CLOSED' });
      }

      const reviewedAt = new Date().toISOString();
      const assignedToUserId = reviewState === 'under_review'
        ? (request.assignedToUserId || req.adminSession?.user.id || null)
        : (request.assignedToUserId || req.adminSession?.user.id || null);
      const updated = await tx`
        UPDATE platform.audit_events
        SET metadata = metadata || ${tx.json({
          reviewState,
          reviewNote,
          reviewedAt,
          reviewedByUserId: req.adminSession?.user.id ?? null,
          assignedToUserId,
          rejectedAt: reviewState === 'rejected' ? reviewedAt : null,
          rejectedByUserId: reviewState === 'rejected' ? req.adminSession?.user.id ?? null : null,
        })}
        WHERE id = ${requestId}::uuid
        RETURNING id::text AS id, entity_id::text AS "studentId", metadata ->> 'reviewState' AS "reviewState",
          metadata ->> 'reviewedAt' AS "reviewedAt", metadata ->> 'reviewNote' AS "reviewNote",
          metadata ->> 'assignedToUserId' AS "assignedToUserId"
      `;
      return updated[0];
    });
    return res.json({ request: result, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    console.error('Unable to update student recovery request', error);
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to update student recovery request', code: typed.code || 'RECOVERY_REQUEST_UPDATE_FAILED' });
  }
});

export default router;
