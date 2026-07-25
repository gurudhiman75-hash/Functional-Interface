import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, maximum = 1000) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maximum) : '';
const CATEGORIES = new Set(['technical_issue', 'score_dispute', 'duplicate_submission', 'suspicious_timing', 'support_request']);
const STATES = new Set(['open', 'under_review', 'resolved', 'rejected']);

router.use(authenticate);

router.get('/investigations', requireAdminPermission('users.students.read'), async (req, res) => {
  const state = text(req.query.state, 40).toLowerCase() || 'all';
  const category = text(req.query.category, 60).toLowerCase() || 'all';
  const search = text(req.query.search, 180).toLowerCase();
  if (state !== 'all' && !STATES.has(state)) return res.status(400).json({ error: 'Unsupported investigation state', code: 'INVALID_INVESTIGATION_STATE' });
  if (category !== 'all' && !CATEGORIES.has(category)) return res.status(400).json({ error: 'Unsupported investigation category', code: 'INVALID_INVESTIGATION_CATEGORY' });

  try {
    const [rows, countRows] = await Promise.all([
      sqlClient`
        WITH opened AS (
          SELECT ae.id, ae.entity_id AS attempt_id, ae.occurred_at AS opened_at,
            ae.reason AS opening_reason, ae.metadata ->> 'caseId' AS case_id,
            ae.metadata ->> 'category' AS category
          FROM platform.audit_events ae
          WHERE ae.action_key = 'student.attempt.investigation.opened'
        )
        SELECT opened.case_id AS "caseId", opened.attempt_id::text AS "attemptId",
          opened.category, opened.opening_reason AS "openingReason", opened.opened_at AS "openedAt",
          COALESCE(latest.metadata ->> 'state', 'open') AS state,
          latest.metadata ->> 'assignedToUserId' AS "assignedToUserId",
          assignee.display_name AS "assignedToName", latest.reason AS "latestReason",
          latest.occurred_at AS "updatedAt", latest.action_key AS "latestActionKey",
          a.status::text AS "attemptStatus", a.final_score AS "finalScore",
          u.id::text AS "studentId", u.display_name AS "studentName", u.email AS "studentEmail",
          sp.registration_code AS "registrationCode", t.public_code AS "testPublicCode", tv.title AS "testTitle"
        FROM opened
        JOIN learning.attempts a ON a.id = opened.attempt_id
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        JOIN LATERAL (
          SELECT e.action_key, e.reason, e.occurred_at, e.metadata
          FROM platform.audit_events e
          WHERE e.entity_type = 'attempt' AND e.entity_id = opened.attempt_id
            AND e.metadata ->> 'caseId' = opened.case_id
          ORDER BY e.occurred_at DESC, e.id DESC LIMIT 1
        ) latest ON true
        LEFT JOIN identity.users assignee ON assignee.id::text = latest.metadata ->> 'assignedToUserId'
        WHERE (${state} = 'all' OR COALESCE(latest.metadata ->> 'state', 'open') = ${state})
          AND (${category} = 'all' OR opened.category = ${category})
          AND (${search} = '' OR lower(u.display_name) LIKE ${`%${search}%`}
            OR lower(u.email) LIKE ${`%${search}%`} OR lower(sp.registration_code) LIKE ${`%${search}%`}
            OR lower(tv.title) LIKE ${`%${search}%`} OR lower(t.public_code) LIKE ${`%${search}%`}
            OR opened.case_id = ${search} OR opened.attempt_id::text = ${search})
        ORDER BY latest.occurred_at DESC
        LIMIT 200
      `,
      sqlClient`
        WITH opened AS (
          SELECT ae.entity_id AS attempt_id, ae.metadata ->> 'caseId' AS case_id
          FROM platform.audit_events ae
          WHERE ae.action_key = 'student.attempt.investigation.opened'
        ), latest_cases AS (
          SELECT COALESCE(latest.metadata ->> 'state', 'open') AS state
          FROM opened
          JOIN LATERAL (
            SELECT e.metadata
            FROM platform.audit_events e
            WHERE e.entity_type = 'attempt' AND e.entity_id = opened.attempt_id
              AND e.metadata ->> 'caseId' = opened.case_id
            ORDER BY e.occurred_at DESC, e.id DESC LIMIT 1
          ) latest ON true
        )
        SELECT
          COUNT(*) FILTER (WHERE state = 'open')::int AS open,
          COUNT(*) FILTER (WHERE state = 'under_review')::int AS "underReview",
          COUNT(*) FILTER (WHERE state = 'resolved')::int AS resolved,
          COUNT(*) FILTER (WHERE state = 'rejected')::int AS rejected,
          COUNT(*)::int AS total
        FROM latest_cases
      `,
    ]);
    const aggregate = countRows[0] ?? {};
    const counts = {
      open: Number(aggregate.open ?? 0),
      under_review: Number(aggregate.underReview ?? 0),
      resolved: Number(aggregate.resolved ?? 0),
      rejected: Number(aggregate.rejected ?? 0),
      total: Number(aggregate.total ?? 0),
    };
    return res.json({ investigations: rows, counts, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load attempt investigations', error);
    return res.status(500).json({ error: 'Unable to load attempt investigations', code: 'ATTEMPT_INVESTIGATION_DIRECTORY_FAILED' });
  }
});

router.post('/:attemptId/investigations', requireAdminPermission('users.students.manage'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  const category = text(req.body?.category, 60).toLowerCase();
  const reason = text(req.body?.reason);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  if (!CATEGORIES.has(category)) return res.status(400).json({ error: 'Select a valid investigation category', code: 'ATTEMPT_INVESTIGATION_CATEGORY_REQUIRED' });
  if (reason.length < 20) return res.status(400).json({ error: 'Provide an investigation reason of at least 20 characters', code: 'ATTEMPT_INVESTIGATION_REASON_REQUIRED' });

  try {
    const result = await sqlClient.begin(async (tx) => {
      const attempts = await tx`SELECT id::text AS id FROM learning.attempts WHERE id = ${attemptId}::uuid LIMIT 1 FOR UPDATE`;
      if (!attempts[0]) throw Object.assign(new Error('Attempt not found'), { status: 404, code: 'ATTEMPT_NOT_FOUND' });
      const active = await tx`
        SELECT opened.metadata ->> 'caseId' AS "caseId"
        FROM platform.audit_events opened
        JOIN LATERAL (
          SELECT e.metadata FROM platform.audit_events e
          WHERE e.entity_type = 'attempt' AND e.entity_id = opened.entity_id
            AND e.metadata ->> 'caseId' = opened.metadata ->> 'caseId'
          ORDER BY e.occurred_at DESC, e.id DESC LIMIT 1
        ) latest ON true
        WHERE opened.action_key = 'student.attempt.investigation.opened'
          AND opened.entity_id = ${attemptId}::uuid
          AND COALESCE(latest.metadata ->> 'state', 'open') IN ('open', 'under_review')
        LIMIT 1
      `;
      if (active[0]) throw Object.assign(new Error('This attempt already has an active investigation'), { status: 409, code: 'ATTEMPT_INVESTIGATION_ALREADY_ACTIVE', caseId: active[0].caseId });
      const caseId = randomUUID();
      const eventId = randomUUID();
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
        VALUES (${eventId}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
          ${req.adminSession?.roles[0] ?? null}, 'student.attempt.investigation.opened', 'attempt', ${attemptId}::uuid,
          ${reason}, 'Opened attempt investigation', ${tx.json({ caseId, category, state: 'open', assignedToUserId: null, scoreMutationAllowed: false })})
      `;
      return { caseId, attemptId, category, state: 'open', auditEventId: eventId };
    });
    return res.status(201).json({ investigation: result, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string; caseId?: string };
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to open investigation', code: typed.code || 'ATTEMPT_INVESTIGATION_OPEN_FAILED', caseId: typed.caseId });
  }
});

router.patch('/investigations/:caseId', requireAdminPermission('users.students.manage'), async (req, res) => {
  const caseId = text(req.params.caseId, 80);
  const nextState = text(req.body?.state, 40).toLowerCase();
  const reason = text(req.body?.reason);
  if (!uuid.test(caseId)) return res.status(400).json({ error: 'Invalid investigation ID', code: 'INVALID_INVESTIGATION_ID' });
  if (!STATES.has(nextState) || nextState === 'open') return res.status(400).json({ error: 'Unsupported investigation transition', code: 'INVALID_INVESTIGATION_TRANSITION' });
  if (reason.length < 20) return res.status(400).json({ error: 'Provide a review or resolution reason of at least 20 characters', code: 'ATTEMPT_INVESTIGATION_REASON_REQUIRED' });

  try {
    const result = await sqlClient.begin(async (tx) => {
      const openedRows = await tx`
        SELECT id, entity_id::text AS "attemptId", metadata ->> 'category' AS category
        FROM platform.audit_events
        WHERE action_key = 'student.attempt.investigation.opened' AND metadata ->> 'caseId' = ${caseId}
        LIMIT 1 FOR UPDATE
      `;
      const opened = openedRows[0];
      if (!opened) throw Object.assign(new Error('Investigation not found'), { status: 404, code: 'ATTEMPT_INVESTIGATION_NOT_FOUND' });
      const latestRows = await tx`
        SELECT metadata ->> 'state' AS state, metadata ->> 'assignedToUserId' AS "assignedToUserId"
        FROM platform.audit_events WHERE entity_type = 'attempt' AND entity_id = ${String(opened.attemptId)}::uuid
          AND metadata ->> 'caseId' = ${caseId}
        ORDER BY occurred_at DESC, id DESC LIMIT 1 FOR UPDATE
      `;
      const currentState = String(latestRows[0]?.state ?? 'open');
      const currentAssignee = latestRows[0]?.assignedToUserId ? String(latestRows[0].assignedToUserId) : null;
      if (currentState === 'resolved' || currentState === 'rejected') throw Object.assign(new Error('Closed investigations cannot be changed'), { status: 409, code: 'ATTEMPT_INVESTIGATION_CLOSED' });
      if ((nextState === 'resolved' || nextState === 'rejected') && currentState !== 'under_review') throw Object.assign(new Error('Investigation must be under review before closure'), { status: 409, code: 'ATTEMPT_INVESTIGATION_REVIEW_REQUIRED' });
      const actorId = req.adminSession?.user.id ?? null;
      if (currentAssignee && currentAssignee !== actorId) throw Object.assign(new Error('Investigation is assigned to another administrator'), { status: 409, code: 'ATTEMPT_INVESTIGATION_ASSIGNED_TO_ANOTHER_ADMIN' });
      const assignedToUserId = nextState === 'under_review' ? actorId : currentAssignee;
      const actionKey = `student.attempt.investigation.${nextState}`;
      const eventId = randomUUID();
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, actor_user_id, effective_role_key, action_key, entity_type, entity_id, reason, summary, metadata)
        VALUES (${eventId}::uuid, 'user'::audit_actor_type, ${actorId}::uuid, ${req.adminSession?.roles[0] ?? null},
          ${actionKey}, 'attempt', ${String(opened.attemptId)}::uuid, ${reason}, ${`Attempt investigation ${nextState.replace('_', ' ')}`},
          ${tx.json({ caseId, category: String(opened.category), state: nextState, assignedToUserId, scoreMutationAllowed: false })})
      `;
      return { caseId, attemptId: String(opened.attemptId), state: nextState, assignedToUserId, auditEventId: eventId };
    });
    return res.json({ investigation: result, generatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to update investigation', code: typed.code || 'ATTEMPT_INVESTIGATION_UPDATE_FAILED' });
  }
});

export default router;
