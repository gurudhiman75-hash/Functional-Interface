import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { sqlClient } from "./db";

export type AdminSession = {
  user: {
    id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
  };
  profile: {
    userId: string;
    employeeCode: string;
    department: string | null;
    title: string | null;
  };
  roles: string[];
  permissions: string[];
};

export type AdminBootstrapResult = {
  session: AdminSession;
  firstAdministrator: boolean;
  pendingRoleAssignment: boolean;
};

type SqlExecutor = typeof sqlClient;
export type AdminSessionLoader = (firebaseUid: string) => Promise<AdminSession | null>;

export class AdminIdentityError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AdminIdentityError";
  }
}

function stringArray(value: unknown): string[] {
  return Array.from(new Set(Array.isArray(value) ? value.map(String) : [])).sort();
}

function employeeCodeFor(userId: string): string {
  return `ADM-${userId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

export async function getAdminSession(
  firebaseUid: string,
  client: SqlExecutor = sqlClient,
): Promise<AdminSession | null> {
  const rows = await client`
    SELECT
      u.id::text AS "userId",
      ai.provider_subject AS "firebaseUid",
      u.email,
      u.display_name AS "displayName",
      p.employee_code AS "employeeCode",
      p.department,
      p.title,
      COALESCE(
        array_agg(DISTINCT r.key) FILTER (WHERE r.key IS NOT NULL),
        '{}'
      ) AS roles,
      COALESCE(
        array_agg(DISTINCT perm.key) FILTER (WHERE perm.key IS NOT NULL),
        '{}'
      ) AS permissions
    FROM identity.auth_identities ai
    INNER JOIN identity.users u
      ON u.id = ai.user_id
     AND u.deleted_at IS NULL
     AND u.status = 'active'::user_status
    INNER JOIN identity.admin_profiles p
      ON p.user_id = u.id
     AND p.is_suspended = false
    LEFT JOIN identity.user_roles ur
      ON ur.user_id = u.id
     AND ur.revoked_at IS NULL
     AND ur.valid_from <= now()
     AND (ur.valid_until IS NULL OR ur.valid_until > now())
    LEFT JOIN identity.roles r
      ON r.id = ur.role_id
     AND r.is_active = true
    LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id
    LEFT JOIN identity.permissions perm ON perm.id = rp.permission_id
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUid}
    GROUP BY
      u.id,
      ai.provider_subject,
      u.email,
      u.display_name,
      p.employee_code,
      p.department,
      p.title
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    user: {
      id: String(row.userId),
      firebaseUid: String(row.firebaseUid),
      email: String(row.email),
      displayName: String(row.displayName),
    },
    profile: {
      userId: String(row.userId),
      employeeCode: String(row.employeeCode),
      department: row.department ? String(row.department) : null,
      title: row.title ? String(row.title) : null,
    },
    roles: stringArray(row.roles),
    permissions: stringArray(row.permissions),
  };
}

export function hasAdminPermission(
  session: Pick<AdminSession, "permissions">,
  permissionKey: string,
): boolean {
  return session.permissions.includes("*") || session.permissions.includes(permissionKey);
}

export async function bootstrapAdminIdentity(input: {
  firebaseUid: string;
  email?: string;
  displayName?: string;
}): Promise<AdminBootstrapResult> {
  const firebaseUid = input.firebaseUid.trim();
  const email = input.email?.trim().toLowerCase() ?? "";
  const displayName = input.displayName?.trim() || email.split("@")[0] || "ExamTree Administrator";

  if (!firebaseUid) {
    throw new AdminIdentityError("INVALID_FIREBASE_SUBJECT", "Firebase subject is required", 400);
  }
  if (!email) {
    throw new AdminIdentityError("ADMIN_EMAIL_REQUIRED", "An administrator email is required", 400);
  }

  try {
    return await sqlClient.begin(async (tx) => {
      // Serializes user linking, first-admin selection and global role assignment.
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.firebase-admin-bootstrap'))`;

      const existingLink = await tx`
        SELECT user_id::text AS "userId"
        FROM identity.auth_identities
        WHERE provider = 'firebase' AND provider_subject = ${firebaseUid}
        FOR UPDATE
      `;

      let userId = existingLink[0]?.userId ? String(existingLink[0].userId) : "";
      let userCreated = false;

      if (!userId) {
        const existingUser = await tx`
          SELECT id::text AS id
          FROM identity.users
          WHERE lower(email) = lower(${email}) AND deleted_at IS NULL
          LIMIT 1
          FOR UPDATE
        `;

        userId = existingUser[0]?.id ? String(existingUser[0].id) : randomUUID();

        if (existingUser.length === 0) {
          await tx`
            INSERT INTO identity.users (
              id, email, display_name, status, last_login_at, created_at, updated_at
            ) VALUES (
              ${userId}::uuid,
              ${email},
              ${displayName},
              'active'::user_status,
              now(),
              now(),
              now()
            )
          `;
          userCreated = true;
        }

        const linked = await tx`
          INSERT INTO identity.auth_identities (
            id, user_id, provider, provider_subject, created_at, updated_at
          ) VALUES (
            ${randomUUID()}::uuid,
            ${userId}::uuid,
            'firebase',
            ${firebaseUid},
            now(),
            now()
          )
          ON CONFLICT (provider, provider_subject) DO UPDATE
            SET updated_at = now()
            WHERE identity.auth_identities.user_id = EXCLUDED.user_id
          RETURNING user_id::text AS "userId"
        `;

        if (!linked[0] || String(linked[0].userId) !== userId) {
          throw new AdminIdentityError(
            "FIREBASE_IDENTITY_CONFLICT",
            "This Firebase identity is already linked to another ExamTree user",
            409,
          );
        }
      }

      await tx`
        UPDATE identity.users
        SET
          email = ${email},
          display_name = ${displayName},
          last_login_at = now(),
          updated_at = now()
        WHERE id = ${userId}::uuid
      `;

      const activeAdminCount = await tx`
        SELECT COUNT(*)::int AS count
        FROM identity.admin_profiles p
        INNER JOIN identity.users u ON u.id = p.user_id
        WHERE u.deleted_at IS NULL
          AND u.status = 'active'::user_status
          AND p.is_suspended = false
      `;
      const firstAdministrator = Number(activeAdminCount[0]?.count ?? 0) === 0;

      const profile = await tx`
        INSERT INTO identity.admin_profiles (
          user_id, employee_code, department, title, is_suspended
        ) VALUES (
          ${userId}::uuid,
          ${employeeCodeFor(userId)},
          'Administration',
          'Administrator',
          false
        )
        ON CONFLICT (user_id) DO NOTHING
        RETURNING user_id::text AS "userId"
      `;
      const profileCreated = profile.length > 0;

      if (firstAdministrator) {
        const role = await tx`
          SELECT id::text AS id
          FROM identity.roles
          WHERE key = 'super_admin' AND is_active = true
          LIMIT 1
        `;
        if (!role[0]) {
          throw new AdminIdentityError(
            "SUPER_ADMIN_ROLE_MISSING",
            "Seeded super_admin role is missing",
            503,
          );
        }

        const roleId = String(role[0].id);
        await tx`
          INSERT INTO identity.user_roles (
            id, user_id, role_id, scope_type, scope_id, granted_by, valid_from
          )
          SELECT
            ${randomUUID()}::uuid,
            ${userId}::uuid,
            ${roleId}::uuid,
            NULL,
            NULL,
            ${userId}::uuid,
            now()
          WHERE NOT EXISTS (
            SELECT 1
            FROM identity.user_roles ur
            WHERE ur.user_id = ${userId}::uuid
              AND ur.role_id = ${roleId}::uuid
              AND ur.scope_type IS NULL
              AND ur.scope_id IS NULL
              AND ur.revoked_at IS NULL
              AND ur.valid_from <= now()
              AND (ur.valid_until IS NULL OR ur.valid_until > now())
          )
        `;

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key,
            action_key, entity_type, entity_id, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${userId}::uuid,
            'super_admin',
            'admin.bootstrap.first',
            'admin_profile',
            ${userId}::uuid,
            'First administrator bootstrapped',
            ${tx.json({ firebaseUid, userCreated })}
          )
        `;

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key,
            action_key, entity_type, entity_id, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${userId}::uuid,
            'super_admin',
            'admin.role.assigned',
            'admin_profile',
            ${userId}::uuid,
            'Assigned super_admin to first administrator',
            ${tx.json({ firebaseUid, role: 'super_admin' })}
          )
        `;
      }

      if (profileCreated) {
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key,
            action_key, entity_type, entity_id, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${userId}::uuid,
            ${firstAdministrator ? 'super_admin' : null},
            'admin.profile.created',
            'admin_profile',
            ${userId}::uuid,
            'Administrator profile created',
            ${tx.json({ firebaseUid, employeeCode: employeeCodeFor(userId) })}
          )
        `;
      }

      const session = await getAdminSession(firebaseUid, tx as SqlExecutor);
      if (!session) {
        throw new AdminIdentityError(
          "ADMIN_SESSION_UNAVAILABLE",
          "Administrator identity is disabled, deleted or suspended",
          403,
        );
      }

      return {
        session,
        firstAdministrator,
        pendingRoleAssignment: session.roles.length === 0,
      };
    });
  } catch (error) {
    if (error instanceof AdminIdentityError) throw error;
    if ((error as { code?: string })?.code === "23505") {
      throw new AdminIdentityError(
        "ADMIN_IDENTITY_CONFLICT",
        "The administrator email or Firebase identity is already linked",
        409,
      );
    }
    if ((error as { code?: string })?.code === "42P01") {
      throw new AdminIdentityError(
        "ADMIN_IDENTITY_SCHEMA_REQUIRED",
        "The admin identity schema migration has not been applied",
        503,
      );
    }
    throw error;
  }
}

export function requireAdminPermission(
  permissionKey: string,
  loadSession: AdminSessionLoader = getAdminSession,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    try {
      const session = await loadSession(req.user.id);
      if (!session || !hasAdminPermission(session, permissionKey)) {
        res.status(403).json({
          error: "Administrator permission required",
          permission: permissionKey,
        });
        return;
      }
      req.adminSession = session;
      next();
    } catch (error) {
      next(error);
    }
  };
}
