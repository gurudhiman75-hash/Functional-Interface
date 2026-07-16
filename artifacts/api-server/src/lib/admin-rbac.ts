import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { sqlClient } from "./db";

export type AdminSession = {
  user: { id: string; firebaseUid: string; email: string | null };
  profile: { id: string; displayName: string | null };
  roles: string[];
  permissions: string[];
};

type SqlExecutor = typeof sqlClient;

export async function getAdminSession(firebaseUid: string, client: SqlExecutor = sqlClient): Promise<AdminSession | null> {
  const rows = await client`
    SELECT
      u.id::text AS "userId", u.firebase_uid AS "firebaseUid", u.email,
      p.id::text AS "profileId", p.display_name AS "displayName",
      COALESCE(array_agg(DISTINCT r.key) FILTER (WHERE r.key IS NOT NULL), '{}') AS roles,
      COALESCE(array_agg(DISTINCT perm.key) FILTER (WHERE perm.key IS NOT NULL), '{}') AS permissions
    FROM identity.users u
    INNER JOIN identity.admin_profiles p ON p.user_id = u.id
    LEFT JOIN identity.user_roles ur ON ur.user_id = u.id
    LEFT JOIN identity.roles r ON r.id = ur.role_id
    LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id
    LEFT JOIN identity.permissions perm ON perm.id = rp.permission_id
    WHERE u.firebase_uid = ${firebaseUid}
    GROUP BY u.id, u.firebase_uid, u.email, p.id, p.display_name
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    user: { id: String(row.userId), firebaseUid: String(row.firebaseUid), email: row.email ? String(row.email) : null },
    profile: { id: String(row.profileId), displayName: row.displayName ? String(row.displayName) : null },
    roles: Array.from(new Set((row.roles ?? []).map(String))).sort(),
    permissions: Array.from(new Set((row.permissions ?? []).map(String))).sort(),
  };
}

export function hasAdminPermission(session: Pick<AdminSession, "permissions">, permissionKey: string): boolean {
  return session.permissions.includes("*") || session.permissions.includes(permissionKey);
}

export async function bootstrapAdminIdentity(input: {
  firebaseUid: string;
  email?: string;
  displayName?: string;
}): Promise<{ session: AdminSession; firstAdministrator: boolean }> {
  const email = input.email?.trim().toLowerCase() || null;
  const displayName = input.displayName?.trim() || null;

  return sqlClient.begin(async (tx) => {
    // Serialize the initial assignment so two first requests cannot both self-assign.
    await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.first-admin'))`;

    const users = await tx`
      INSERT INTO identity.users (id, firebase_uid, email)
      VALUES (${randomUUID()}::uuid, ${input.firebaseUid}, ${email})
      ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email
      RETURNING id::text AS id
    `;
    const userId = String(users[0].id);
    const profiles = await tx`
      INSERT INTO identity.admin_profiles (id, user_id, display_name)
      VALUES (${randomUUID()}::uuid, ${userId}::uuid, ${displayName})
      ON CONFLICT (user_id) DO NOTHING
      RETURNING id::text AS id
    `;
    const profileCreated = profiles.length > 0;

    const existingAdminCount = await tx`
      SELECT COUNT(*)::int AS count FROM identity.admin_profiles
    `;
    // Count includes this profile, which is precisely the first-profile condition.
    const firstAdministrator = profileCreated && Number(existingAdminCount[0]?.count ?? 0) === 1;

    if (firstAdministrator) {
      const role = await tx`SELECT id::text AS id FROM identity.roles WHERE key = 'super_admin' LIMIT 1`;
      if (!role[0]) throw new Error("Seeded super_admin role is missing");
      await tx`
        INSERT INTO identity.user_roles (user_id, role_id)
        VALUES (${userId}::uuid, ${String(role[0].id)}::uuid)
        ON CONFLICT (user_id, role_id) DO NOTHING
      `;
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, action_key, entity_type, entity_id, summary, metadata)
        VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, 'admin.bootstrap.first', 'admin_profile',
          ${userId}::uuid, 'First administrator bootstrapped',
          ${tx.json({ firebaseUid: input.firebaseUid })}
        )
      `;
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, action_key, entity_type, entity_id, summary, metadata)
        VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, 'admin.role.assigned', 'admin_profile',
          ${userId}::uuid, 'Assigned super_admin to first administrator',
          ${tx.json({ firebaseUid: input.firebaseUid, role: 'super_admin' })}
        )
      `;
    }

    if (profileCreated) {
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, action_key, entity_type, entity_id, summary, metadata)
        VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, 'admin.profile.created', 'admin_profile',
          ${userId}::uuid, 'Administrator profile created', ${tx.json({ firebaseUid: input.firebaseUid })}
        )
      `;
    }

    const session = await getAdminSession(input.firebaseUid, tx as SqlExecutor);
    if (!session) throw new Error("Administrator identity could not be loaded after bootstrap");
    return { session, firstAdministrator };
  });
}

export function requireAdminPermission(permissionKey: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    try {
      const session = await getAdminSession(req.user.id);
      if (!session || !hasAdminPermission(session, permissionKey)) {
        res.status(403).json({ error: "Administrator permission required", permission: permissionKey });
        return;
      }
      req.adminSession = session;
      next();
    } catch (error) {
      next(error);
    }
  };
}
