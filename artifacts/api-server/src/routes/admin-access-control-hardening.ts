import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";

import {
  AdminAccessControlError,
  assertFinalSuperAdminSafe,
  assertUuid,
  normalizeAdminProfileUpdate,
  normalizeReason,
  normalizeRoleAssignment,
} from "../lib/admin-access-control";
import {
  assertActiveRoleGrantInserted,
  assertManagerChainSafe,
  escapeCsvCell,
  normalizeAuditPagination,
  resolveAdminAccessTransition,
  type AdminAccessAction,
} from "../lib/admin-control-plane-hardening";
import { requireAdminPermission, type AdminSession } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

type AuditChange = {
  fieldPath: string;
  beforeValue?: unknown;
  afterValue?: unknown;
};

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof AdminAccessControlError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function session(req: Request): AdminSession {
  if (!req.adminSession) {
    throw new AdminAccessControlError("ADMIN_SESSION_REQUIRED", "Administrator session is required", 401);
  }
  return req.adminSession;
}

async function writeAuditEvent(
  client: SqlExecutor,
  actor: AdminSession,
  input: {
    actionKey: string;
    entityType: string;
    entityId: string;
    summary: string;
    reason: string;
    metadata?: Record<string, unknown>;
    changes?: AuditChange[];
  },
): Promise<void> {
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
      ${input.entityType},
      ${input.entityId}::uuid,
      ${input.reason},
      ${input.summary},
      ${client.json(input.metadata ?? {})}
    )
  `;
  for (const change of input.changes ?? []) {
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
}

async function activeSuperAdminState(client: SqlExecutor, userId: string) {
  const [target, count] = await Promise.all([
    client`
      SELECT EXISTS(
        SELECT 1
        FROM identity.user_roles ur
        JOIN identity.roles r ON r.id = ur.role_id
        WHERE ur.user_id = ${userId}::uuid
          AND r.key = 'super_admin'
          AND r.is_active = true
          AND ur.revoked_at IS NULL
          AND ur.valid_from <= now()
          AND (ur.valid_until IS NULL OR ur.valid_until > now())
      ) AS "hasSuperAdmin"
    `,
    client`
      SELECT COUNT(DISTINCT u.id)::int AS count
      FROM identity.users u
      JOIN identity.admin_profiles p ON p.user_id = u.id
      JOIN identity.user_roles ur ON ur.user_id = u.id
      JOIN identity.roles r ON r.id = ur.role_id
      WHERE u.deleted_at IS NULL
        AND u.status = 'active'::user_status
        AND p.is_suspended = false
        AND r.key = 'super_admin'
        AND r.is_active = true
        AND ur.revoked_at IS NULL
        AND ur.valid_from <= now()
        AND (ur.valid_until IS NULL OR ur.valid_until > now())
    `,
  ]);
  return {
    targetHasSuperAdmin: target[0]?.hasSuperAdmin === true,
    activeSuperAdminCount: Number(count[0]?.count ?? 0),
  };
}

function parseAuditFilters(req: Request) {
  const actorUserId = typeof req.query.actorUserId === "string" && req.query.actorUserId
    ? assertUuid(req.query.actorUserId, "actorUserId")
    : null;
  const actionKey = typeof req.query.actionKey === "string" && req.query.actionKey.trim()
    ? req.query.actionKey.trim().slice(0, 160)
    : null;
  const entityType = typeof req.query.entityType === "string" && req.query.entityType.trim()
    ? req.query.entityType.trim().slice(0, 160)
    : null;
  const roleKey = typeof req.query.roleKey === "string" && req.query.roleKey.trim()
    ? req.query.roleKey.trim().slice(0, 120)
    : null;
  const search = typeof req.query.search === "string" && req.query.search.trim()
    ? `%${req.query.search.trim().slice(0, 200)}%`
    : null;
  const from = typeof req.query.from === "string" && req.query.from ? new Date(req.query.from) : null;
  const to = typeof req.query.to === "string" && req.query.to ? new Date(req.query.to) : null;
  if (from && Number.isNaN(from.getTime())) {
    throw new AdminAccessControlError("INVALID_AUDIT_FROM", "Invalid audit start date");
  }
  if (to && Number.isNaN(to.getTime())) {
    throw new AdminAccessControlError("INVALID_AUDIT_TO", "Invalid audit end date");
  }
  return {
    actorUserId,
    actionKey,
    entityType,
    roleKey,
    search,
    from: from?.toISOString() ?? null,
    to: to?.toISOString() ?? null,
  };
}

router.use(authenticate);

// Validate reporting lines before the canonical profile route performs its update.
router.put("/team/:userId", requireAdminPermission("users.admins.manage"), async (req, res, next) => {
  try {
    const userId = assertUuid(req.params.userId, "userId");
    const input = normalizeAdminProfileUpdate(req.body);
    if (!input.managerUserId) {
      next();
      return;
    }
    if (input.managerUserId === userId) {
      throw new AdminAccessControlError("ADMIN_MANAGER_SELF_REFERENCE", "An administrator cannot manage themselves");
    }
    const chain = await sqlClient`
      WITH RECURSIVE manager_chain AS (
        SELECT p.user_id, p.manager_user_id, ARRAY[p.user_id]::uuid[] AS path
        FROM identity.admin_profiles p
        JOIN identity.users u ON u.id = p.user_id AND u.deleted_at IS NULL
        WHERE p.user_id = ${input.managerUserId}::uuid
        UNION ALL
        SELECT p.user_id, p.manager_user_id, chain.path || p.user_id
        FROM identity.admin_profiles p
        JOIN identity.users u ON u.id = p.user_id AND u.deleted_at IS NULL
        JOIN manager_chain chain ON p.user_id = chain.manager_user_id
        WHERE NOT p.user_id = ANY(chain.path)
      )
      SELECT user_id::text AS "userId"
      FROM manager_chain
    `;
    if (chain.length === 0) {
      throw new AdminAccessControlError("ADMIN_MANAGER_NOT_FOUND", "Selected manager is not an administrator", 409);
    }
    assertManagerChainSafe(userId, chain.map((row) => String(row.userId)));
    next();
  } catch (error) {
    sendError(res, error, "Unable to validate the administrator reporting line");
  }
});

router.post("/team/:userId/roles", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const userId = assertUuid(req.params.userId, "userId");
    const input = normalizeRoleAssignment(req.body);
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-team'))`;
      const member = await tx`
        SELECT u.display_name AS name
        FROM identity.users u
        JOIN identity.admin_profiles p ON p.user_id = u.id
        WHERE u.id = ${userId}::uuid AND u.deleted_at IS NULL
        LIMIT 1
        FOR UPDATE OF u, p
      `;
      if (!member[0]) {
        throw new AdminAccessControlError("ADMIN_MEMBER_NOT_FOUND", "Administrator not found", 404);
      }
      const role = await tx`
        SELECT id::text AS id, key, name
        FROM identity.roles
        WHERE id = ${input.roleId}::uuid AND is_active = true
        LIMIT 1
      `;
      if (!role[0]) {
        throw new AdminAccessControlError("ADMIN_ROLE_MISSING", "The selected role is missing or inactive", 409);
      }
      const inserted = await tx`
        INSERT INTO identity.user_roles (
          id, user_id, role_id, granted_by, valid_from, valid_until
        )
        SELECT ${randomUUID()}::uuid, ${userId}::uuid, ${input.roleId}::uuid,
          ${actor.user.id}::uuid, now(), ${input.validUntil}::timestamptz
        WHERE NOT EXISTS (
          SELECT 1 FROM identity.user_roles ur
          WHERE ur.user_id = ${userId}::uuid
            AND ur.role_id = ${input.roleId}::uuid
            AND ur.revoked_at IS NULL
            AND ur.valid_from <= now()
            AND (ur.valid_until IS NULL OR ur.valid_until > now())
        )
        RETURNING id::text AS id
      `;
      assertActiveRoleGrantInserted(inserted);
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.role.assigned",
        entityType: "admin_profile",
        entityId: userId,
        summary: `Assigned ${role[0].name} to ${member[0].name}`,
        reason: input.reason,
        metadata: { roleId: input.roleId, roleKey: role[0].key, validUntil: input.validUntil },
        changes: [{ fieldPath: "identity.user_roles", beforeValue: null, afterValue: role[0].key }],
      });
    });
    res.redirect(303, "/api/admin/access-control/control-plane");
  } catch (error) {
    sendError(res, error, "Unable to assign the administrator role");
  }
});

router.post("/team/:userId/actions/:action", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const userId = assertUuid(req.params.userId, "userId");
    const action = String(req.params.action) as AdminAccessAction;
    if (!["suspend", "restore", "disable", "activate", "revoke-sessions"].includes(action)) {
      throw new AdminAccessControlError("INVALID_ADMIN_ACTION", "Unsupported administrator action");
    }
    const reason = normalizeReason(req.body?.reason);
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-team'))`;
      const current = await tx`
        SELECT u.display_name AS name, u.status::text AS status,
          p.is_suspended AS "isSuspended",
          EXISTS(
            SELECT 1 FROM identity.auth_identities ai
            WHERE ai.user_id = u.id AND ai.provider = 'firebase'
          ) AS "hasFirebaseIdentity"
        FROM identity.users u
        JOIN identity.admin_profiles p ON p.user_id = u.id
        WHERE u.id = ${userId}::uuid AND u.deleted_at IS NULL
        LIMIT 1
        FOR UPDATE OF u, p
      `;
      if (!current[0]) {
        throw new AdminAccessControlError("ADMIN_MEMBER_NOT_FOUND", "Administrator not found", 404);
      }
      if (action === "suspend" || action === "disable") {
        const state = await activeSuperAdminState(tx as SqlExecutor, userId);
        assertFinalSuperAdminSafe({ ...state, action });
      }
      const transition = resolveAdminAccessTransition({
        action,
        currentStatus: String(current[0].status),
        currentIsSuspended: current[0].isSuspended === true,
        hasFirebaseIdentity: current[0].hasFirebaseIdentity === true,
      });
      if (action !== "revoke-sessions") {
        await tx`
          UPDATE identity.users
          SET status = ${transition.status}::user_status, updated_at = now()
          WHERE id = ${userId}::uuid
        `;
        if (transition.isSuspended) {
          await tx`
            UPDATE identity.admin_profiles
            SET is_suspended = true, suspended_at = now(), suspended_reason = ${reason}
            WHERE user_id = ${userId}::uuid
          `;
        } else {
          await tx`
            UPDATE identity.admin_profiles
            SET is_suspended = false, suspended_at = NULL, suspended_reason = NULL
            WHERE user_id = ${userId}::uuid
          `;
        }
      }
      const revokedSessions = transition.revokesSessions
        ? await tx`
            UPDATE identity.sessions
            SET revoked_at = now()
            WHERE user_id = ${userId}::uuid AND revoked_at IS NULL
            RETURNING id
          `
        : [];
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: `admin.${action.replace("-", ".")}`,
        entityType: "admin_profile",
        entityId: userId,
        summary: `${action.replace("-", " ")} administrator ${current[0].name}`,
        reason,
        metadata: {
          priorStatus: current[0].status,
          resultingStatus: transition.status,
          priorSuspended: current[0].isSuspended,
          resultingSuspended: transition.isSuspended,
          revokedSessionCount: revokedSessions.length,
        },
        changes: action === "revoke-sessions"
          ? [{
              fieldPath: "identity.sessions.revoked_at",
              beforeValue: null,
              afterValue: { revokedSessionCount: revokedSessions.length },
            }]
          : [
              {
                fieldPath: "identity.users.status",
                beforeValue: current[0].status,
                afterValue: transition.status,
              },
              {
                fieldPath: "identity.admin_profiles.is_suspended",
                beforeValue: current[0].isSuspended,
                afterValue: transition.isSuspended,
              },
            ],
      });
    });
    res.redirect(303, "/api/admin/access-control/control-plane");
  } catch (error) {
    sendError(res, error, "Unable to change administrator access");
  }
});

router.get("/audit-events/export.csv", requireAdminPermission("audit.read"), async (req, res) => {
  try {
    const filters = parseAuditFilters(req);
    const rows = await sqlClient`
      SELECT
        ae.occurred_at AS "occurredAt",
        ae.actor_type::text AS "actorType",
        actor.display_name AS "actorName",
        actor.email AS "actorEmail",
        ae.effective_role_key AS "effectiveRoleKey",
        ae.action_key AS "actionKey",
        ae.entity_type AS "entityType",
        ae.entity_id::text AS "entityId",
        ae.summary,
        ae.reason,
        (SELECT COUNT(*)::int FROM platform.audit_event_changes c WHERE c.audit_event_id = ae.id) AS "changeCount"
      FROM platform.audit_events ae
      LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
      WHERE (${filters.actorUserId}::uuid IS NULL OR ae.actor_user_id = ${filters.actorUserId}::uuid)
        AND (${filters.actionKey}::text IS NULL OR ae.action_key = ${filters.actionKey})
        AND (${filters.entityType}::text IS NULL OR ae.entity_type = ${filters.entityType})
        AND (${filters.roleKey}::text IS NULL OR ae.effective_role_key = ${filters.roleKey})
        AND (${filters.from}::timestamptz IS NULL OR ae.occurred_at >= ${filters.from}::timestamptz)
        AND (${filters.to}::timestamptz IS NULL OR ae.occurred_at <= ${filters.to}::timestamptz)
        AND (
          ${filters.search}::text IS NULL
          OR ae.summary ILIKE ${filters.search}
          OR ae.action_key ILIKE ${filters.search}
          OR ae.entity_type ILIKE ${filters.search}
          OR ae.entity_id::text ILIKE ${filters.search}
          OR actor.display_name ILIKE ${filters.search}
          OR actor.email ILIKE ${filters.search}
        )
      ORDER BY ae.occurred_at DESC, ae.id DESC
      LIMIT 5000
    `;
    const csv = [
      ["occurred_at", "actor", "email", "role", "action", "entity_type", "entity_id", "summary", "reason", "change_count"].join(","),
      ...rows.map((row) => [
        row.occurredAt,
        row.actorName ?? row.actorType,
        row.actorEmail,
        row.effectiveRoleKey,
        row.actionKey,
        row.entityType,
        row.entityId,
        row.summary,
        row.reason,
        row.changeCount,
      ].map(escapeCsvCell).join(",")),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="examtree-audit-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(`\uFEFF${csv}`);
  } catch (error) {
    sendError(res, error, "Unable to export audit events");
  }
});

// Normalize pagination before the canonical explorer route calculates its offset.
router.get("/audit-events", requireAdminPermission("audit.read"), (req, _res, next) => {
  const pagination = normalizeAuditPagination(req.query.page, req.query.pageSize);
  const query = req.query as Record<string, unknown>;
  query.page = String(pagination.page);
  query.pageSize = String(pagination.pageSize);
  next();
});

export default router;
