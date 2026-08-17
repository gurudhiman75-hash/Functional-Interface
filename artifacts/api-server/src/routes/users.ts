import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const ADMIN_EMAIL = "gurbajdhiman@gmail.com";

type CanonicalUserRow = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isAdmin: boolean;
};

class CanonicalAccountAccessError extends Error {
  constructor(public readonly status: string) {
    super(status === "suspended" ? "This ExamTree account is suspended" : "This ExamTree account is unavailable");
  }
}

function toEpoch(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function toAppUser(row: CanonicalUserRow, firebaseUid: string) {
  return {
    id: firebaseUid,
    canonicalUserId: row.id,
    email: row.email,
    name: row.displayName,
    role: row.isAdmin ? "admin" : "student",
    status: row.status,
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
      u.status::text AS status,
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

function registrationCode(userId: string): string {
  return `STU-${userId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

async function ensureCanonicalUser(input: {
  firebaseUid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}): Promise<CanonicalUserRow> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim() || normalizedEmail.split("@")[0] || "User";
  if (!input.firebaseUid) throw new Error("Firebase account does not contain a UID");
  if (!normalizedEmail) throw new Error("Firebase account does not contain an email address");

  await sqlClient.begin(async (tx) => {
    let rows = await tx`
      SELECT
        u.id::text AS id,
        u.email,
        u.display_name AS "displayName",
        u.status::text AS status,
        u.created_at AS "createdAt",
        u.updated_at AS "updatedAt"
      FROM identity.users u
      LEFT JOIN identity.auth_identities ai
        ON ai.user_id = u.id
       AND ai.provider = 'firebase'
      WHERE u.deleted_at IS NULL
        AND (
          ai.provider_subject = ${input.firebaseUid}
          OR (${input.emailVerified}::boolean AND lower(u.email) = ${normalizedEmail})
        )
      ORDER BY (ai.provider_subject = ${input.firebaseUid}) DESC
      LIMIT 1
      FOR UPDATE OF u
    `;

    let userId: string;
    if (rows[0]) {
      userId = String(rows[0].id);
      await tx`
        UPDATE identity.users
        SET email = ${normalizedEmail},
            display_name = ${displayName},
            last_login_at = now(),
            updated_at = now()
        WHERE id = ${userId}::uuid
      `;
    } else {
      rows = await tx`
        INSERT INTO identity.users (email, display_name, status, last_login_at)
        VALUES (${normalizedEmail}, ${displayName}, 'active', now())
        RETURNING id::text AS id
      `;
      userId = String(rows[0].id);
    }

    const conflictingIdentity = await tx`
      SELECT user_id::text AS "userId"
      FROM identity.auth_identities
      WHERE provider = 'firebase' AND provider_subject = ${input.firebaseUid}
      LIMIT 1
      FOR UPDATE
    `;
    if (conflictingIdentity[0] && String(conflictingIdentity[0].userId) !== userId) {
      throw new Error("Firebase identity is already linked to another canonical account");
    }

    const existingUserIdentity = await tx`
      SELECT id::text AS id, provider_subject AS "providerSubject"
      FROM identity.auth_identities
      WHERE user_id = ${userId}::uuid
        AND provider = 'firebase'
      LIMIT 1
      FOR UPDATE
    `;

    const existingIdentityId = existingUserIdentity[0]?.id
      ? String(existingUserIdentity[0].id)
      : null;
    const previousProviderSubject = existingUserIdentity[0]?.providerSubject
      ? String(existingUserIdentity[0].providerSubject)
      : null;

    if (existingIdentityId) {
      if (previousProviderSubject !== input.firebaseUid) {
        if (!input.emailVerified) {
          throw new Error("Verified Firebase email is required to relink an existing canonical account");
        }
        await tx`
          UPDATE identity.auth_identities
          SET provider_subject = ${input.firebaseUid},
              updated_at = now()
          WHERE id = ${existingIdentityId}::uuid
        `;

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${userId}::uuid,
            'student.identity.firebase_uid_reconciled',
            'student_profile',
            ${userId}::uuid,
            'Verified Firebase email matched an existing canonical account during /users/me provisioning',
            'Reconciled Firebase UID during student profile sync',
            ${tx.json({
              provider: "firebase",
              verifiedEmail: normalizedEmail,
              previousProviderSubject,
              newProviderSubject: input.firebaseUid,
              source: "users-me-provisioning",
            })}
          )
        `;
      } else {
        await tx`
          UPDATE identity.auth_identities
          SET updated_at = now()
          WHERE id = ${existingIdentityId}::uuid
        `;
      }
    } else {
      await tx`
        INSERT INTO identity.auth_identities (user_id, provider, provider_subject)
        VALUES (${userId}::uuid, 'firebase', ${input.firebaseUid})
      `;
    }

    const existingProfile = await tx`
      SELECT user_id FROM identity.student_profiles
      WHERE user_id = ${userId}::uuid
      LIMIT 1
    `;

    if (existingProfile.length === 0) {
      const code = registrationCode(userId);
      await tx`
        INSERT INTO identity.student_profiles (
          user_id, registration_code, preferred_language_code
        ) VALUES (
          ${userId}::uuid, ${code}, 'en'
        )
      `;

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${userId}::uuid,
          'student.account.provisioned',
          'student_profile',
          ${userId}::uuid,
          'Automatic first-login canonical provisioning',
          ${`Provisioned canonical student account for ${displayName}`},
          ${tx.json({
            registrationCode: code,
            provider: "firebase",
            providerSubject: input.firebaseUid,
            email: normalizedEmail,
            preferredLanguageCode: "en",
          })}
        )
      `;
    }

    if (normalizedEmail === ADMIN_EMAIL) {
      await tx`
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
  });

  const loaded = await loadCanonicalUser(input.firebaseUid);
  if (!loaded) throw new Error("Unable to load canonical user after provisioning");
  return loaded;
}

async function userFromRequest(req: Parameters<typeof authenticate>[0]) {
  const firebaseUid = req.user?.id ?? "";
  const email = req.user?.email ?? "";
  const displayName = req.user?.displayName ?? email.split("@")[0] ?? "User";
  const row = await ensureCanonicalUser({
    firebaseUid,
    email,
    displayName,
    emailVerified: req.user?.emailVerified === true,
  });

  if (!row.isAdmin && row.status !== "active") {
    throw new CanonicalAccountAccessError(row.status);
  }

  return toAppUser(row, firebaseUid);
}

function sendUserError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CanonicalAccountAccessError) {
    return res.status(403).json({
      error: error.message,
      code: error.status === "suspended" ? "ACCOUNT_SUSPENDED" : "ACCOUNT_UNAVAILABLE",
      status: error.status,
    });
  }
  console.error(fallback, error);
  return res.status(500).json({ error: fallback });
}

router.get("/me", authenticate, async (req, res) => {
  try {
    return res.json(await userFromRequest(req));
  } catch (error) {
    return sendUserError(res, error, "Unable to load user profile");
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    return res.json(await userFromRequest(req));
  } catch (error) {
    return sendUserError(res, error, "Unable to create user profile");
  }
});

router.get("/me/entitlements", authenticate, (_req, res) => res.json({ testIds: [] }));
router.get("/my-packages", authenticate, (_req, res) => res.json([]));
router.get("/my-bundles", authenticate, (_req, res) => res.json([]));

export default router;
