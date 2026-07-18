import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const ADMIN_EMAIL = "gurbajdhiman@gmail.com";

type CanonicalUserRow = {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isAdmin: boolean;
};

function toEpoch(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function toAppUser(row: CanonicalUserRow, firebaseUid: string) {
  return {
    id: firebaseUid,
    email: row.email,
    name: row.displayName,
    role: row.isAdmin ? "admin" : "student",
    createdAt: toEpoch(row.createdAt),
    updatedAt: toEpoch(row.updatedAt),
  };
}

async function loadCanonicalUser(firebaseUid: string): Promise<CanonicalUserRow | null> {
  const rows = await sqlClient`
    SELECT
      u.id::text AS id,
      u.email,
      u.display_name AS "displayName",
      u.created_at AS "createdAt",
      u.updated_at AS "updatedAt",
      EXISTS (
        SELECT 1
        FROM identity.user_roles ur
        JOIN identity.roles r ON r.id = ur.role_id
        WHERE ur.user_id = u.id
          AND ur.revoked_at IS NULL
          AND (ur.valid_until IS NULL OR ur.valid_until > now())
          AND r.key = 'super_admin'
          AND r.is_active = true
      ) AS "isAdmin"
    FROM identity.users u
    JOIN identity.auth_identities ai
      ON ai.user_id = u.id
     AND ai.provider = 'firebase'
    WHERE ai.provider_subject = ${firebaseUid}
      AND u.deleted_at IS NULL
    LIMIT 1
  `;
  return (rows[0] as CanonicalUserRow | undefined) ?? null;
}

async function ensureCanonicalUser(input: {
  firebaseUid: string;
  email: string;
  displayName: string;
}): Promise<CanonicalUserRow> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim() || normalizedEmail.split("@")[0] || "User";
  if (!normalizedEmail) throw new Error("Firebase account does not contain an email address");

  let rows = await sqlClient`
    SELECT
      u.id::text AS id,
      u.email,
      u.display_name AS "displayName",
      u.created_at AS "createdAt",
      u.updated_at AS "updatedAt"
    FROM identity.users u
    LEFT JOIN identity.auth_identities ai
      ON ai.user_id = u.id
     AND ai.provider = 'firebase'
    WHERE u.deleted_at IS NULL
      AND (
        ai.provider_subject = ${input.firebaseUid}
        OR lower(u.email) = ${normalizedEmail}
      )
    ORDER BY (ai.provider_subject = ${input.firebaseUid}) DESC
    LIMIT 1
  `;

  let userId: string;
  if (rows[0]) {
    userId = String(rows[0].id);
    rows = await sqlClient`
      UPDATE identity.users
      SET email = ${normalizedEmail},
          display_name = ${displayName},
          status = 'active',
          last_login_at = now(),
          updated_at = now()
      WHERE id = ${userId}::uuid
      RETURNING id::text AS id, email, display_name AS "displayName",
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
  } else {
    rows = await sqlClient`
      INSERT INTO identity.users (email, display_name, status, last_login_at)
      VALUES (${normalizedEmail}, ${displayName}, 'active', now())
      RETURNING id::text AS id, email, display_name AS "displayName",
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    userId = String(rows[0].id);
  }

  const identityRows = await sqlClient`
    UPDATE identity.auth_identities
    SET provider_subject = ${input.firebaseUid}, updated_at = now()
    WHERE user_id = ${userId}::uuid
      AND provider = 'firebase'
    RETURNING id
  `;
  if (identityRows.length === 0) {
    await sqlClient`
      INSERT INTO identity.auth_identities (user_id, provider, provider_subject)
      VALUES (${userId}::uuid, 'firebase', ${input.firebaseUid})
      ON CONFLICT (provider, provider_subject)
      DO UPDATE SET user_id = EXCLUDED.user_id, updated_at = now()
    `;
  }

  if (normalizedEmail === ADMIN_EMAIL) {
    await sqlClient`
      INSERT INTO identity.user_roles (user_id, role_id)
      SELECT ${userId}::uuid, r.id
      FROM identity.roles r
      WHERE r.key = 'super_admin'
        AND r.is_active = true
        AND NOT EXISTS (
          SELECT 1
          FROM identity.user_roles existing
          WHERE existing.user_id = ${userId}::uuid
            AND existing.role_id = r.id
            AND existing.revoked_at IS NULL
            AND existing.scope_type IS NULL
            AND existing.scope_id IS NULL
        )
      LIMIT 1
    `;
  }

  const loaded = await loadCanonicalUser(input.firebaseUid);
  if (!loaded) throw new Error("Unable to load canonical user after upsert");
  return loaded;
}

async function userFromRequest(req: Parameters<typeof authenticate>[0]) {
  const firebaseUid = req.user?.id ?? "";
  const email = req.user?.email ?? "";
  const displayName = req.user?.displayName ?? email.split("@")[0] ?? "User";
  const row = await ensureCanonicalUser({ firebaseUid, email, displayName });
  return toAppUser(row, firebaseUid);
}

router.get("/me", authenticate, async (req, res) => {
  try {
    return res.json(await userFromRequest(req));
  } catch (error) {
    console.error("Unable to load canonical user", error);
    return res.status(500).json({ error: "Unable to load user profile" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    return res.json(await userFromRequest(req));
  } catch (error) {
    console.error("Unable to create canonical user", error);
    return res.status(500).json({ error: "Unable to create user profile" });
  }
});

// Legacy commerce data is intentionally not migrated to the canonical database.
router.get("/me/entitlements", authenticate, (_req, res) => res.json({ testIds: [] }));
router.get("/my-packages", authenticate, (_req, res) => res.json([]));
router.get("/my-bundles", authenticate, (_req, res) => res.json([]));

export default router;
