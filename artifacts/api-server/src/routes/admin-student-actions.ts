import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';

import {
  StudentAdministrationError,
  assertExpectedStudentStatus,
  assertStudentUuid,
  normalizeStudentAccountAction,
  normalizeStudentActionRequest,
  planStudentAccountAction,
  type StudentStatus,
} from '../lib/admin-student-administration';
import { requireAdminPermission, type AdminSession } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
type SqlExecutor = typeof sqlClient;

type AuditChange = {
  fieldPath: string;
  beforeValue?: unknown;
  afterValue?: unknown;
};

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof StudentAdministrationError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'STUDENT_ACCOUNT_OPERATION_FAILED' });
}

function session(req: Request): AdminSession {
  if (!req.adminSession) {
    throw new StudentAdministrationError(
      'ADMIN_SESSION_REQUIRED',
      'Administrator session is required',
      401,
    );
  }
  return req.adminSession;
}

async function writeStudentAuditEvent(
  client: SqlExecutor,
  actor: AdminSession,
  input: {
    actionKey: string;
    studentId: string;
    summary: string;
    reason: string;
    metadata: Record<string, unknown>;
    changes: AuditChange[];
  },
): Promise<string> {
  const auditEventId = randomUUID();
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key,
      action_key, entity_type, entity_id, reason, summary, metadata
    ) VALUES (
      ${auditEventId}::uuid,
      'user'::audit_actor_type,
      ${actor.user.id}::uuid,
      ${actor.roles[0] ?? null},
      ${input.actionKey},
      'student_profile',
      ${input.studentId}::uuid,
      ${input.reason},
      ${input.summary},
      ${client.json(input.metadata)}
    )
  `;

  for (const change of input.changes) {
    await client`
      INSERT INTO platform.audit_event_changes (
        id, audit_event_id, field_path, before_value, after_value
      ) VALUES (
        ${randomUUID()}::uuid,
        ${auditEventId}::uuid,
        ${change.fieldPath},
        ${change.beforeValue === undefined ? null : client.json(change.beforeValue)},
        ${change.afterValue === undefined ? null : client.json(change.afterValue)}
      )
    `;
  }

  return auditEventId;
}

router.use(authenticate);

router.post(
  '/:studentId/actions/:action',
  requireAdminPermission('users.students.manage'),
  async (req, res) => {
    try {
      const actor = session(req);
      const studentId = assertStudentUuid(req.params.studentId);
      const action = normalizeStudentAccountAction(req.params.action);
      const input = normalizeStudentActionRequest(req.body);

      const operation = await sqlClient.begin(async (tx) => {
        const client = tx as SqlExecutor;
        const targetRows = await client`
          SELECT
            u.status::text AS status,
            u.display_name AS "displayName",
            u.updated_at AS "updatedAt",
            sp.registration_code AS "registrationCode",
            (
              SELECT COUNT(*)::int
              FROM identity.sessions s
              WHERE s.user_id = u.id
                AND s.revoked_at IS NULL
                AND s.expires_at > now()
            ) AS "activeSessionCount"
          FROM identity.users u
          JOIN identity.student_profiles sp ON sp.user_id = u.id
          WHERE u.id = ${studentId}::uuid
            AND u.deleted_at IS NULL
          LIMIT 1
          FOR UPDATE OF u
        `;

        const target = targetRows[0];
        if (!target) {
          throw new StudentAdministrationError(
            'STUDENT_NOT_FOUND',
            'Canonical student profile not found',
            404,
          );
        }

        const currentStatus = String(target.status) as StudentStatus;
        const plan = planStudentAccountAction({ action, currentStatus });
        assertExpectedStudentStatus({
          expectedStatus: input.expectedStatus,
          currentStatus,
          desiredStatus: plan.nextStatus,
        });

        if (plan.statusChanged) {
          await client`
            UPDATE identity.users
            SET status = ${plan.nextStatus}::user_status, updated_at = now()
            WHERE id = ${studentId}::uuid
          `;
        }

        let sessionsRevoked = 0;
        if (plan.revokeActiveSessions) {
          const revokedRows = await client`
            UPDATE identity.sessions
            SET revoked_at = now()
            WHERE user_id = ${studentId}::uuid
              AND revoked_at IS NULL
              AND expires_at > now()
            RETURNING id
          `;
          sessionsRevoked = revokedRows.length;
        }

        const actionKey = action === 'suspend'
          ? 'student.account.suspended'
          : action === 'reactivate'
            ? 'student.account.reactivated'
            : 'student.sessions.revoked';
        const actionLabel = action === 'suspend'
          ? 'Suspended'
          : action === 'reactivate'
            ? 'Reactivated'
            : 'Revoked sessions for';
        const changed = plan.statusChanged || sessionsRevoked > 0;
        const changes: AuditChange[] = [];

        if (plan.statusChanged) {
          changes.push({
            fieldPath: 'identity.users.status',
            beforeValue: currentStatus,
            afterValue: plan.nextStatus,
          });
        }
        if (sessionsRevoked > 0) {
          changes.push({
            fieldPath: 'identity.sessions.revoked_at',
            beforeValue: { activeSessionCount: number(target.activeSessionCount) },
            afterValue: { revokedCount: sessionsRevoked },
          });
        }

        const auditEventId = await writeStudentAuditEvent(client, actor, {
          actionKey,
          studentId,
          summary: `${actionLabel} student ${String(target.displayName)}`,
          reason: input.reason,
          metadata: {
            registrationCode: String(target.registrationCode),
            action,
            priorStatus: currentStatus,
            nextStatus: plan.nextStatus,
            activeSessionCountBefore: number(target.activeSessionCount),
            sessionsRevoked,
            changed,
            idempotentNoOp: !changed,
          },
          changes,
        });

        return {
          action,
          changed,
          previousStatus: currentStatus,
          status: plan.nextStatus,
          sessionsRevoked,
          auditEventId,
          occurredAt: new Date().toISOString(),
        };
      });

      res.json({ operation, generatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error, 'Unable to complete the student account operation');
    }
  },
);

export default router;
