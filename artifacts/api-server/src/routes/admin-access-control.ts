import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";

import {
  AdminAccessControlError,
  assertFinalSuperAdminSafe,
  assertSuperAdminRoleSafe,
  assertUuid,
  normalizeAdminInvite,
  normalizeAdminProfileUpdate,
  normalizeReason,
  normalizeRoleAssignment,
  normalizeRoleDefinition,
} from "../lib/admin-access-control";
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
  const candidate = error as { code?: string };
  if (candidate?.code === "23505") {
    res.status(409).json({ error: "The requested administrator, role or assignment already exists", code: "ADMIN_CONTROL_CONFLICT" });
    return;
  }
  if (candidate?.code === "23503") {
    res.status(409).json({ error: "A referenced administrator, role or permission no longer exists", code: "ADMIN_CONTROL_REFERENCE_CONFLICT" });
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

function employeeCodeFor(userId: string): string {
  return `ADM-${userId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
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
  return auditEventId;
}

async function loadRoles(client: SqlExecutor = sqlClient) {
  return client`
    SELECT
      r.id::text AS id,
      r.key,
      r.name,
      r.description,
      r.is_system AS "isSystem",
      r.is_active AS "isActive",
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt",
      COALESCE(
        array_agg(DISTINCT p.key ORDER BY p.key) FILTER (WHERE p.key IS NOT NULL),
        '{}'
      ) AS permissions,
      (
        SELECT COUNT(DISTINCT ur.user_id)::int
        FROM identity.user_roles ur
        JOIN identity.users u ON u.id = ur.user_id AND u.deleted_at IS NULL
        JOIN identity.admin_profiles ap ON ap.user_id = u.id
        WHERE ur.role_id = r.id
          AND ur.revoked_at IS NULL
          AND ur.valid_from <= now()
          AND (ur.valid_until IS NULL OR ur.valid_until > now())
          AND u.status IN ('active'::user_status, 'invited'::user_status)
          AND ap.is_suspended = false
      ) AS "memberCount"
    FROM identity.roles r
    LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id
    LEFT JOIN identity.permissions p ON p.id = rp.permission_id
    GROUP BY r.id
    ORDER BY r.is_system DESC, r.name
  `;
}

async function loadPermissions(client: SqlExecutor = sqlClient) {
  return client`
    SELECT id::text AS id, key, description, created_at AS "createdAt"
    FROM identity.permissions
    ORDER BY key
  `;
}

async function loadTeam(client: SqlExecutor = sqlClient) {
  return client`
    SELECT
      u.id::text AS id,
      u.email,
      u.display_name AS "displayName",
      u.status::text AS status,
      u.last_login_at AS "lastLoginAt",
      u.created_at AS "createdAt",
      u.updated_at AS "updatedAt",
      p.employee_code AS "employeeCode",
      p.department,
      p.title,
      p.manager_user_id::text AS "managerUserId",
      manager.display_name AS "managerName",
      p.is_suspended AS "isSuspended",
      p.suspended_at AS "suspendedAt",
      p.suspended_reason AS "suspendedReason",
      COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'grantId', ur.id::text,
          'id', r.id::text,
          'key', r.key,
          'name', r.name,
          'validFrom', ur.valid_from,
          'validUntil', ur.valid_until,
          'isActive', r.is_active
        ) ORDER BY r.name)
        FROM identity.user_roles ur
        JOIN identity.roles r ON r.id = ur.role_id
        WHERE ur.user_id = u.id
          AND ur.revoked_at IS NULL
          AND ur.valid_from <= now()
          AND (ur.valid_until IS NULL OR ur.valid_until > now())
      ), '[]'::jsonb) AS roles,
      COALESCE((
        SELECT array_agg(DISTINCT perm.key ORDER BY perm.key)
        FROM identity.user_roles ur
        JOIN identity.roles r ON r.id = ur.role_id AND r.is_active = true
        JOIN identity.role_permissions rp ON rp.role_id = r.id
        JOIN identity.permissions perm ON perm.id = rp.permission_id
        WHERE ur.user_id = u.id
          AND ur.revoked_at IS NULL
          AND ur.valid_from <= now()
          AND (ur.valid_until IS NULL OR ur.valid_until > now())
      ), '{}') AS permissions,
      (
        SELECT COUNT(*)::int
        FROM identity.sessions s
        WHERE s.user_id = u.id
          AND s.revoked_at IS NULL
          AND s.expires_at > now()
      ) AS "activeSessionCount",
      (
        SELECT MAX(ae.occurred_at)
        FROM platform.audit_events ae
        WHERE ae.actor_user_id = u.id
      ) AS "lastActionAt"
    FROM identity.users u
    JOIN identity.admin_profiles p ON p.user_id = u.id
    LEFT JOIN identity.users manager ON manager.id = p.manager_user_id
    WHERE u.deleted_at IS NULL
    ORDER BY
      CASE WHEN u.status = 'active'::user_status AND p.is_suspended = false THEN 0 ELSE 1 END,
      u.display_name,
      u.email
  `;
}

async function loadControlPlane(client: SqlExecutor = sqlClient) {
  const [members, roles, permissions] = await Promise.all([
    loadTeam(client),
    loadRoles(client),
    loadPermissions(client),
  ]);
  const stats = {
    total: members.length,
    active: members.filter((member) => member.status === "active" && member.isSuspended === false).length,
    invited: members.filter((member) => member.status === "invited").length,
    suspended: members.filter((member) => member.status === "suspended" || member.isSuspended === true).length,
    customRoles: roles.filter((role) => role.isSystem === false).length,
  };
  return { members, roles, permissions, stats, generatedAt: new Date().toISOString() };
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

async function assertRoleIds(client: SqlExecutor, roleIds: string[]) {
  const rows = await client`
    SELECT id::text AS id, key, name
    FROM identity.roles
    WHERE id = ANY(${roleIds}::uuid[]) AND is_active = true
  `;
  if (rows.length !== roleIds.length) {
    throw new AdminAccessControlError("ADMIN_ROLE_MISSING", "One or more selected roles are missing or inactive", 409);
  }
  return rows;
}

async function assertPermissionKeys(client: SqlExecutor, permissionKeys: string[]) {
  if (permissionKeys.length === 0) return [];
  const rows = await client`
    SELECT id::text AS id, key
    FROM identity.permissions
    WHERE key = ANY(${permissionKeys}::text[])
  `;
  if (rows.length !== permissionKeys.length) {
    const found = new Set(rows.map((row) => String(row.key)));
    throw new AdminAccessControlError(
      "ADMIN_PERMISSION_MISSING",
      "One or more selected permissions do not exist",
      409,
      { permissionKeys: permissionKeys.filter((key) => !found.has(key)) },
    );
  }
  return rows;
}

function auditFilters(req: Request) {
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
  if (from && Number.isNaN(from.getTime())) throw new AdminAccessControlError("INVALID_AUDIT_FROM", "Invalid audit start date");
  if (to && Number.isNaN(to.getTime())) throw new AdminAccessControlError("INVALID_AUDIT_TO", "Invalid audit end date");
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

async function loadAuditRows(filters: ReturnType<typeof auditFilters>, limit: number, offset: number) {
  return sqlClient`
    SELECT
      ae.id::text AS id,
      ae.occurred_at AS "occurredAt",
      ae.actor_type::text AS "actorType",
      ae.actor_user_id::text AS "actorUserId",
      actor.display_name AS "actorName",
      actor.email AS "actorEmail",
      ae.effective_role_key AS "effectiveRoleKey",
      ae.action_key AS "actionKey",
      ae.entity_type AS "entityType",
      ae.entity_id::text AS "entityId",
      ae.entity_version_id::text AS "entityVersionId",
      ae.request_id AS "requestId",
      ae.session_id::text AS "sessionId",
      ae.correlation_id::text AS "correlationId",
      ae.approval_request_id::text AS "approvalRequestId",
      ae.reason,
      ae.summary,
      ae.metadata,
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
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}

router.use(authenticate);

router.get("/control-plane", requireAdminPermission("users.admins.read"), async (_req, res) => {
  try {
    res.json(await loadControlPlane());
  } catch (error) {
    sendError(res, error, "Unable to load the admin control plane");
  }
});

router.get("/roles", requireAdminPermission("settings.roles.manage"), async (_req, res) => {
  try {
    const [roles, permissions] = await Promise.all([loadRoles(), loadPermissions()]);
    res.json({ roles, permissions, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load roles and permissions");
  }
});

router.post("/team/invitations", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const input = normalizeAdminInvite(req.body);
    const result = await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-team'))`;
      const selectedRoles = await assertRoleIds(tx as SqlExecutor, input.roleIds);
      const existing = await tx`
        SELECT u.id::text AS id, u.status::text AS status,
          EXISTS(SELECT 1 FROM identity.admin_profiles p WHERE p.user_id = u.id) AS "hasAdminProfile",
          EXISTS(SELECT 1 FROM identity.auth_identities ai WHERE ai.user_id = u.id AND ai.provider = 'firebase') AS "hasFirebaseIdentity"
        FROM identity.users u
        WHERE lower(u.email) = lower(${input.email}) AND u.deleted_at IS NULL
        LIMIT 1
        FOR UPDATE
      `;
      const userId = existing[0]?.id ? String(existing[0].id) : randomUUID();
      const nextStatus = existing[0]?.hasFirebaseIdentity === true ? "active" : "invited";
      if (existing.length === 0) {
        await tx`
          INSERT INTO identity.users (
            id, email, display_name, status, created_at, updated_at
          ) VALUES (
            ${userId}::uuid, ${input.email}, ${input.displayName}, ${nextStatus}::user_status, now(), now()
          )
        `;
      } else {
        await tx`
          UPDATE identity.users
          SET email = ${input.email}, display_name = ${input.displayName}, status = ${nextStatus}::user_status, updated_at = now()
          WHERE id = ${userId}::uuid
        `;
      }
      await tx`
        INSERT INTO identity.admin_profiles (
          user_id, employee_code, department, title, is_suspended
        ) VALUES (
          ${userId}::uuid, ${employeeCodeFor(userId)}, ${input.department}, ${input.title}, false
        )
        ON CONFLICT (user_id) DO UPDATE SET
          department = EXCLUDED.department,
          title = EXCLUDED.title,
          is_suspended = false,
          suspended_at = NULL,
          suspended_reason = NULL
      `;
      for (const role of selectedRoles) {
        await tx`
          INSERT INTO identity.user_roles (
            id, user_id, role_id, granted_by, valid_from
          )
          SELECT ${randomUUID()}::uuid, ${userId}::uuid, ${String(role.id)}::uuid, ${actor.user.id}::uuid, now()
          WHERE NOT EXISTS (
            SELECT 1 FROM identity.user_roles ur
            WHERE ur.user_id = ${userId}::uuid
              AND ur.role_id = ${String(role.id)}::uuid
              AND ur.revoked_at IS NULL
              AND ur.valid_from <= now()
              AND (ur.valid_until IS NULL OR ur.valid_until > now())
          )
        `;
      }
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: existing.length === 0 ? "admin.invited" : "admin.access.authorized",
        entityType: "admin_profile",
        entityId: userId,
        summary: `${input.displayName} was authorized for the ExamTree admin console`,
        reason: input.reason,
        metadata: { email: input.email, roleKeys: selectedRoles.map((role) => role.key), priorStatus: existing[0]?.status ?? null },
        changes: [
          { fieldPath: "identity.users.status", beforeValue: existing[0]?.status ?? null, afterValue: nextStatus },
          { fieldPath: "identity.user_roles", beforeValue: null, afterValue: selectedRoles.map((role) => role.key) },
        ],
      });
      return { userId };
    });
    res.status(201).json({ ...(await loadControlPlane()), selectedUserId: result.userId });
  } catch (error) {
    sendError(res, error, "Unable to invite the administrator");
  }
});

router.put("/team/:userId", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const userId = assertUuid(req.params.userId, "userId");
    const input = normalizeAdminProfileUpdate(req.body);
    await sqlClient.begin(async (tx) => {
      const current = await tx`
        SELECT u.display_name AS "displayName", p.department, p.title, p.manager_user_id::text AS "managerUserId"
        FROM identity.users u JOIN identity.admin_profiles p ON p.user_id = u.id
        WHERE u.id = ${userId}::uuid AND u.deleted_at IS NULL
        LIMIT 1 FOR UPDATE OF u, p
      `;
      if (!current[0]) throw new AdminAccessControlError("ADMIN_MEMBER_NOT_FOUND", "Administrator not found", 404);
      if (input.managerUserId === userId) {
        throw new AdminAccessControlError("ADMIN_MANAGER_SELF_REFERENCE", "An administrator cannot manage themselves");
      }
      if (input.managerUserId) {
        const manager = await tx`
          SELECT 1 FROM identity.admin_profiles p JOIN identity.users u ON u.id = p.user_id
          WHERE p.user_id = ${input.managerUserId}::uuid AND u.deleted_at IS NULL LIMIT 1
        `;
        if (!manager[0]) throw new AdminAccessControlError("ADMIN_MANAGER_NOT_FOUND", "Selected manager is not an administrator", 409);
      }
      await tx`
        UPDATE identity.users SET display_name = ${input.displayName}, updated_at = now()
        WHERE id = ${userId}::uuid
      `;
      await tx`
        UPDATE identity.admin_profiles
        SET department = ${input.department}, title = ${input.title}, manager_user_id = ${input.managerUserId}::uuid
        WHERE user_id = ${userId}::uuid
      `;
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.profile.updated",
        entityType: "admin_profile",
        entityId: userId,
        summary: `Updated administrator profile for ${input.displayName}`,
        reason: input.reason,
        changes: [
          { fieldPath: "identity.users.display_name", beforeValue: current[0].displayName, afterValue: input.displayName },
          { fieldPath: "identity.admin_profiles.department", beforeValue: current[0].department, afterValue: input.department },
          { fieldPath: "identity.admin_profiles.title", beforeValue: current[0].title, afterValue: input.title },
          { fieldPath: "identity.admin_profiles.manager_user_id", beforeValue: current[0].managerUserId, afterValue: input.managerUserId },
        ],
      });
    });
    res.json({ ...(await loadControlPlane()), selectedUserId: userId });
  } catch (error) {
    sendError(res, error, "Unable to update the administrator profile");
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
        SELECT u.display_name AS name FROM identity.users u JOIN identity.admin_profiles p ON p.user_id = u.id
        WHERE u.id = ${userId}::uuid AND u.deleted_at IS NULL LIMIT 1 FOR UPDATE OF u, p
      `;
      if (!member[0]) throw new AdminAccessControlError("ADMIN_MEMBER_NOT_FOUND", "Administrator not found", 404);
      const role = await assertRoleIds(tx as SqlExecutor, [input.roleId]);
      await tx`
        INSERT INTO identity.user_roles (
          id, user_id, role_id, granted_by, valid_from, valid_until
        )
        SELECT ${randomUUID()}::uuid, ${userId}::uuid, ${input.roleId}::uuid, ${actor.user.id}::uuid, now(), ${input.validUntil}::timestamptz
        WHERE NOT EXISTS (
          SELECT 1 FROM identity.user_roles ur
          WHERE ur.user_id = ${userId}::uuid AND ur.role_id = ${input.roleId}::uuid
            AND ur.revoked_at IS NULL AND ur.valid_from <= now()
            AND (ur.valid_until IS NULL OR ur.valid_until > now())
        )
      `;
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.role.assigned",
        entityType: "admin_profile",
        entityId: userId,
        summary: `Assigned ${role[0]?.name} to ${member[0].name}`,
        reason: input.reason,
        metadata: { roleId: input.roleId, roleKey: role[0]?.key, validUntil: input.validUntil },
        changes: [{ fieldPath: "identity.user_roles", beforeValue: null, afterValue: role[0]?.key }],
      });
    });
    res.json({ ...(await loadControlPlane()), selectedUserId: userId });
  } catch (error) {
    sendError(res, error, "Unable to assign the administrator role");
  }
});

router.delete("/team/:userId/roles/:roleId", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const userId = assertUuid(req.params.userId, "userId");
    const roleId = assertUuid(req.params.roleId, "roleId");
    const reason = normalizeReason(req.body?.reason);
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-team'))`;
      const role = await tx`SELECT key, name FROM identity.roles WHERE id = ${roleId}::uuid LIMIT 1`;
      if (!role[0]) throw new AdminAccessControlError("ADMIN_ROLE_NOT_FOUND", "Role not found", 404);
      if (String(role[0].key) === "super_admin") {
        const state = await activeSuperAdminState(tx as SqlExecutor, userId);
        assertFinalSuperAdminSafe({ ...state, action: "remove the role from" });
      }
      const revoked = await tx`
        UPDATE identity.user_roles
        SET revoked_at = now(), revoked_by = ${actor.user.id}::uuid
        WHERE user_id = ${userId}::uuid AND role_id = ${roleId}::uuid AND revoked_at IS NULL
        RETURNING id
      `;
      if (revoked.length === 0) throw new AdminAccessControlError("ADMIN_ROLE_ASSIGNMENT_NOT_FOUND", "Active role assignment not found", 404);
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.role.revoked",
        entityType: "admin_profile",
        entityId: userId,
        summary: `Revoked ${role[0].name} from an administrator`,
        reason,
        metadata: { roleId, roleKey: role[0].key },
        changes: [{ fieldPath: "identity.user_roles", beforeValue: role[0].key, afterValue: null }],
      });
    });
    res.json({ ...(await loadControlPlane()), selectedUserId: userId });
  } catch (error) {
    sendError(res, error, "Unable to revoke the administrator role");
  }
});

router.post("/team/:userId/actions/:action", requireAdminPermission("users.admins.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const userId = assertUuid(req.params.userId, "userId");
    const action = String(req.params.action);
    if (!['suspend', 'restore', 'disable', 'activate', 'revoke-sessions'].includes(action)) {
      throw new AdminAccessControlError("INVALID_ADMIN_ACTION", "Unsupported administrator action");
    }
    const reason = normalizeReason(req.body?.reason);
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-team'))`;
      const current = await tx`
        SELECT u.display_name AS name, u.status::text AS status, p.is_suspended AS "isSuspended",
          EXISTS(SELECT 1 FROM identity.auth_identities ai WHERE ai.user_id = u.id AND ai.provider = 'firebase') AS "hasFirebaseIdentity"
        FROM identity.users u JOIN identity.admin_profiles p ON p.user_id = u.id
        WHERE u.id = ${userId}::uuid AND u.deleted_at IS NULL LIMIT 1 FOR UPDATE OF u, p
      `;
      if (!current[0]) throw new AdminAccessControlError("ADMIN_MEMBER_NOT_FOUND", "Administrator not found", 404);
      if (['suspend', 'disable'].includes(action)) {
        const state = await activeSuperAdminState(tx as SqlExecutor, userId);
        assertFinalSuperAdminSafe({ ...state, action });
      }
      if (action === 'suspend') {
        await tx`UPDATE identity.users SET status = 'suspended'::user_status, updated_at = now() WHERE id = ${userId}::uuid`;
        await tx`UPDATE identity.admin_profiles SET is_suspended = true, suspended_at = now(), suspended_reason = ${reason} WHERE user_id = ${userId}::uuid`;
        await tx`UPDATE identity.sessions SET revoked_at = now() WHERE user_id = ${userId}::uuid AND revoked_at IS NULL`;
      } else if (action === 'restore' || action === 'activate') {
        const status = current[0].hasFirebaseIdentity === true ? 'active' : 'invited';
        await tx`UPDATE identity.users SET status = ${status}::user_status, updated_at = now() WHERE id = ${userId}::uuid`;
        await tx`UPDATE identity.admin_profiles SET is_suspended = false, suspended_at = NULL, suspended_reason = NULL WHERE user_id = ${userId}::uuid`;
      } else if (action === 'disable') {
        await tx`UPDATE identity.users SET status = 'disabled'::user_status, updated_at = now() WHERE id = ${userId}::uuid`;
        await tx`UPDATE identity.admin_profiles SET is_suspended = true, suspended_at = now(), suspended_reason = ${reason} WHERE user_id = ${userId}::uuid`;
        await tx`UPDATE identity.sessions SET revoked_at = now() WHERE user_id = ${userId}::uuid AND revoked_at IS NULL`;
      } else {
        await tx`UPDATE identity.sessions SET revoked_at = now() WHERE user_id = ${userId}::uuid AND revoked_at IS NULL`;
      }
      const actionKey = `admin.${action.replace('-', '.')}`;
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey,
        entityType: "admin_profile",
        entityId: userId,
        summary: `${action.replace('-', ' ')} administrator ${current[0].name}`,
        reason,
        metadata: { priorStatus: current[0].status, priorSuspended: current[0].isSuspended },
        changes: action === 'revoke-sessions'
          ? [{ fieldPath: "identity.sessions.revoked_at", beforeValue: null, afterValue: "now" }]
          : [
              { fieldPath: "identity.users.status", beforeValue: current[0].status, afterValue: action },
              { fieldPath: "identity.admin_profiles.is_suspended", beforeValue: current[0].isSuspended, afterValue: ['suspend', 'disable'].includes(action) },
            ],
      });
    });
    res.json({ ...(await loadControlPlane()), selectedUserId: userId });
  } catch (error) {
    sendError(res, error, "Unable to change administrator access");
  }
});

router.post("/roles", requireAdminPermission("settings.roles.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const input = normalizeRoleDefinition(req.body, { keyRequired: true });
    const roleId = randomUUID();
    await sqlClient.begin(async (tx) => {
      const permissions = await assertPermissionKeys(tx as SqlExecutor, input.permissionKeys);
      await tx`
        INSERT INTO identity.roles (id, key, name, description, is_system, is_active, created_at, updated_at)
        VALUES (${roleId}::uuid, ${input.key}, ${input.name}, ${input.description}, false, ${input.isActive}, now(), now())
      `;
      for (const permission of permissions) {
        await tx`
          INSERT INTO identity.role_permissions (role_id, permission_id, granted_at)
          VALUES (${roleId}::uuid, ${String(permission.id)}::uuid, now())
        `;
      }
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.role.created",
        entityType: "admin_role",
        entityId: roleId,
        summary: `Created administrator role ${input.name}`,
        reason: input.reason,
        metadata: { roleKey: input.key },
        changes: [
          { fieldPath: "identity.roles", beforeValue: null, afterValue: { key: input.key, name: input.name, isActive: input.isActive } },
          { fieldPath: "identity.role_permissions", beforeValue: [], afterValue: input.permissionKeys },
        ],
      });
    });
    res.status(201).json({ roles: await loadRoles(), permissions: await loadPermissions(), selectedRoleId: roleId, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to create the administrator role");
  }
});

router.put("/roles/:roleId", requireAdminPermission("settings.roles.manage"), async (req, res) => {
  try {
    const actor = session(req);
    const roleId = assertUuid(req.params.roleId, "roleId");
    const input = normalizeRoleDefinition(req.body, { keyRequired: false });
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.admin-roles'))`;
      const current = await tx`
        SELECT id::text AS id, key, name, description, is_system AS "isSystem", is_active AS "isActive",
          COALESCE((SELECT array_agg(p.key ORDER BY p.key) FROM identity.role_permissions rp JOIN identity.permissions p ON p.id = rp.permission_id WHERE rp.role_id = r.id), '{}') AS permissions
        FROM identity.roles r WHERE id = ${roleId}::uuid LIMIT 1 FOR UPDATE
      `;
      if (!current[0]) throw new AdminAccessControlError("ADMIN_ROLE_NOT_FOUND", "Role not found", 404);
      const permissions = await assertPermissionKeys(tx as SqlExecutor, input.permissionKeys);
      const allPermissions = await tx`SELECT key FROM identity.permissions ORDER BY key`;
      assertSuperAdminRoleSafe({
        roleKey: String(current[0].key),
        isActive: input.isActive,
        permissionKeys: input.permissionKeys,
        allPermissionKeys: allPermissions.map((permission) => String(permission.key)),
      });
      if (!input.isActive) {
        const assignments = await tx`
          SELECT COUNT(*)::int AS count FROM identity.user_roles
          WHERE role_id = ${roleId}::uuid AND revoked_at IS NULL
            AND valid_from <= now() AND (valid_until IS NULL OR valid_until > now())
        `;
        if (Number(assignments[0]?.count ?? 0) > 0) {
          throw new AdminAccessControlError("ROLE_STILL_ASSIGNED", "Reassign active administrators before deactivating this role", 409);
        }
      }
      await tx`
        UPDATE identity.roles
        SET name = ${input.name}, description = ${input.description}, is_active = ${input.isActive}, updated_at = now()
        WHERE id = ${roleId}::uuid
      `;
      await tx`DELETE FROM identity.role_permissions WHERE role_id = ${roleId}::uuid`;
      for (const permission of permissions) {
        await tx`
          INSERT INTO identity.role_permissions (role_id, permission_id, granted_at)
          VALUES (${roleId}::uuid, ${String(permission.id)}::uuid, now())
        `;
      }
      await writeAuditEvent(tx as SqlExecutor, actor, {
        actionKey: "admin.role.updated",
        entityType: "admin_role",
        entityId: roleId,
        summary: `Updated administrator role ${input.name}`,
        reason: input.reason,
        metadata: { roleKey: current[0].key, isSystem: current[0].isSystem },
        changes: [
          { fieldPath: "identity.roles.name", beforeValue: current[0].name, afterValue: input.name },
          { fieldPath: "identity.roles.description", beforeValue: current[0].description, afterValue: input.description },
          { fieldPath: "identity.roles.is_active", beforeValue: current[0].isActive, afterValue: input.isActive },
          { fieldPath: "identity.role_permissions", beforeValue: current[0].permissions, afterValue: input.permissionKeys },
        ],
      });
    });
    res.json({ roles: await loadRoles(), permissions: await loadPermissions(), selectedRoleId: roleId, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to update the administrator role");
  }
});

router.get("/audit-events", requireAdminPermission("audit.read"), async (req, res) => {
  try {
    const filters = auditFilters(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(200, Math.max(10, Number(req.query.pageSize) || 50));
    const offset = (page - 1) * pageSize;
    const [events, count, facets] = await Promise.all([
      loadAuditRows(filters, pageSize, offset),
      sqlClient`
        SELECT COUNT(*)::int AS count
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE (${filters.actorUserId}::uuid IS NULL OR ae.actor_user_id = ${filters.actorUserId}::uuid)
          AND (${filters.actionKey}::text IS NULL OR ae.action_key = ${filters.actionKey})
          AND (${filters.entityType}::text IS NULL OR ae.entity_type = ${filters.entityType})
          AND (${filters.roleKey}::text IS NULL OR ae.effective_role_key = ${filters.roleKey})
          AND (${filters.from}::timestamptz IS NULL OR ae.occurred_at >= ${filters.from}::timestamptz)
          AND (${filters.to}::timestamptz IS NULL OR ae.occurred_at <= ${filters.to}::timestamptz)
          AND (${filters.search}::text IS NULL OR ae.summary ILIKE ${filters.search} OR ae.action_key ILIKE ${filters.search} OR ae.entity_type ILIKE ${filters.search} OR ae.entity_id::text ILIKE ${filters.search} OR actor.display_name ILIKE ${filters.search} OR actor.email ILIKE ${filters.search})
      `,
      Promise.all([
        sqlClient`SELECT DISTINCT action_key AS value FROM platform.audit_events ORDER BY action_key`,
        sqlClient`SELECT DISTINCT entity_type AS value FROM platform.audit_events ORDER BY entity_type`,
        sqlClient`SELECT DISTINCT effective_role_key AS value FROM platform.audit_events WHERE effective_role_key IS NOT NULL ORDER BY effective_role_key`,
        sqlClient`SELECT DISTINCT u.id::text AS id, u.display_name AS name, u.email FROM platform.audit_events ae JOIN identity.users u ON u.id = ae.actor_user_id ORDER BY u.display_name`,
      ]),
    ]);
    res.json({
      events,
      page,
      pageSize,
      total: Number(count[0]?.count ?? 0),
      facets: {
        actions: facets[0].map((row) => row.value),
        entityTypes: facets[1].map((row) => row.value),
        roles: facets[2].map((row) => row.value),
        actors: facets[3],
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load audit events");
  }
});

router.get("/audit-events/export.csv", requireAdminPermission("audit.read"), async (req, res) => {
  try {
    const filters = auditFilters(req);
    const rows = await loadAuditRows(filters, 5000, 0);
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [
      ['occurred_at', 'actor', 'email', 'role', 'action', 'entity_type', 'entity_id', 'summary', 'reason', 'change_count'].join(','),
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
      ].map(escape).join(',')),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="examtree-audit-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (error) {
    sendError(res, error, "Unable to export audit events");
  }
});

router.get("/audit-events/:auditEventId", requireAdminPermission("audit.read"), async (req, res) => {
  try {
    const auditEventId = assertUuid(req.params.auditEventId, "auditEventId");
    const events = await sqlClient`
      SELECT
        ae.id::text AS id, ae.occurred_at AS "occurredAt", ae.actor_type::text AS "actorType",
        ae.actor_user_id::text AS "actorUserId", actor.display_name AS "actorName", actor.email AS "actorEmail",
        ae.effective_role_key AS "effectiveRoleKey", ae.action_key AS "actionKey", ae.entity_type AS "entityType",
        ae.entity_id::text AS "entityId", ae.entity_version_id::text AS "entityVersionId", ae.request_id AS "requestId",
        ae.session_id::text AS "sessionId", ae.correlation_id::text AS "correlationId",
        ae.approval_request_id::text AS "approvalRequestId", ae.reason, ae.summary, ae.metadata
      FROM platform.audit_events ae
      LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
      WHERE ae.id = ${auditEventId}::uuid LIMIT 1
    `;
    if (!events[0]) throw new AdminAccessControlError("AUDIT_EVENT_NOT_FOUND", "Audit event not found", 404);
    const changes = await sqlClient`
      SELECT id::text AS id, field_path AS "fieldPath", before_value AS "beforeValue", after_value AS "afterValue"
      FROM platform.audit_event_changes WHERE audit_event_id = ${auditEventId}::uuid ORDER BY field_path, id
    `;
    res.json({ event: events[0], changes });
  } catch (error) {
    sendError(res, error, "Unable to load the audit event");
  }
});

export default router;
