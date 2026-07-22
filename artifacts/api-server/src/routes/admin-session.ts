import { randomUUID } from "node:crypto";
import { Router, type RequestHandler } from "express";

import {
  AdminIdentityError,
  bootstrapAdminIdentity,
  type AdminBootstrapResult,
} from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

export type AdminBootstrapIdentity = {
  firebaseUid: string;
  email?: string;
  emailVerified?: boolean;
};

export type AdminSessionRouteDependencies = {
  authenticate: RequestHandler;
  isDatabaseConfigured: () => boolean;
  isAdministrator: (identity: AdminBootstrapIdentity) => Promise<boolean>;
  activateInvitation: (identity: AdminBootstrapIdentity) => Promise<void>;
  relinkIdentity: (identity: AdminBootstrapIdentity) => Promise<void>;
  bootstrap: (input: {
    firebaseUid: string;
    email?: string;
    displayName?: string;
  }) => Promise<AdminBootstrapResult>;
};

export async function isCanonicalAdministrator(identity: AdminBootstrapIdentity): Promise<boolean> {
  const normalizedEmail = identity.email?.trim().toLowerCase() || null;
  const rows = await sqlClient`
    SELECT 1
    FROM identity.users u
    JOIN identity.admin_profiles p
      ON p.user_id = u.id
     AND p.is_suspended = false
    LEFT JOIN identity.auth_identities ai
      ON ai.user_id = u.id
     AND ai.provider = 'firebase'
    WHERE u.deleted_at IS NULL
      AND u.status IN ('active'::user_status, 'invited'::user_status)
      AND (
        ai.provider_subject = ${identity.firebaseUid}
        OR (
          ${identity.emailVerified === true}
          AND ${normalizedEmail}::text IS NOT NULL
          AND lower(u.email) = lower(${normalizedEmail})
        )
      )
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function activateCanonicalAdminInvitation(identity: AdminBootstrapIdentity): Promise<void> {
  const normalizedEmail = identity.email?.trim().toLowerCase() || null;
  if (!identity.emailVerified || !normalizedEmail) return;
  await sqlClient`
    UPDATE identity.users u
    SET status = 'active'::user_status, updated_at = now()
    WHERE u.deleted_at IS NULL
      AND u.status = 'invited'::user_status
      AND lower(u.email) = lower(${normalizedEmail})
      AND EXISTS (
        SELECT 1 FROM identity.admin_profiles p
        WHERE p.user_id = u.id AND p.is_suspended = false
      )
  `;
}

export async function relinkCanonicalAdminFirebaseIdentity(identity: AdminBootstrapIdentity): Promise<void> {
  const normalizedEmail = identity.email?.trim().toLowerCase() || null;
  if (!identity.emailVerified || !normalizedEmail) return;

  try {
    await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.identity.firebase-admin-bootstrap'))`;

      const administrators = await tx`
        SELECT u.id::text AS "userId"
        FROM identity.users u
        JOIN identity.admin_profiles p
          ON p.user_id = u.id
         AND p.is_suspended = false
        WHERE u.deleted_at IS NULL
          AND u.status IN ('active'::user_status, 'invited'::user_status)
          AND lower(u.email) = lower(${normalizedEmail})
        LIMIT 1
        FOR UPDATE
      `;
      const userId = administrators[0]?.userId ? String(administrators[0].userId) : "";
      if (!userId) return;

      const conflicting = await tx`
        SELECT user_id::text AS "userId"
        FROM identity.auth_identities
        WHERE provider = 'firebase'
          AND provider_subject = ${identity.firebaseUid}
        FOR UPDATE
      `;
      if (conflicting[0] && String(conflicting[0].userId) !== userId) {
        throw new AdminIdentityError(
          "FIREBASE_IDENTITY_CONFLICT",
          "This Firebase identity is already linked to another ExamTree user",
          409,
        );
      }

      await tx`
        INSERT INTO identity.auth_identities (
          id, user_id, provider, provider_subject, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid,
          ${userId}::uuid,
          'firebase',
          ${identity.firebaseUid},
          now(),
          now()
        )
        ON CONFLICT (user_id, provider) DO UPDATE
          SET provider_subject = EXCLUDED.provider_subject,
              updated_at = now()
      `;
    });
  } catch (error) {
    if (error instanceof AdminIdentityError) throw error;
    if ((error as { code?: string })?.code === "23505") {
      throw new AdminIdentityError(
        "FIREBASE_IDENTITY_CONFLICT",
        "This Firebase identity is already linked to another ExamTree user",
        409,
      );
    }
    throw error;
  }
}

export function isProductionDatabaseConfigured(): boolean {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.DATABASE_URL?.trim());
}

export function createAdminSessionRouter(
  dependencies: AdminSessionRouteDependencies = {
    authenticate,
    isDatabaseConfigured: isProductionDatabaseConfigured,
    isAdministrator: isCanonicalAdministrator,
    activateInvitation: activateCanonicalAdminInvitation,
    relinkIdentity: relinkCanonicalAdminFirebaseIdentity,
    bootstrap: bootstrapAdminIdentity,
  },
) {
  const router = Router();

  router.post("/bootstrap", dependencies.authenticate, async (req, res, next) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (!dependencies.isDatabaseConfigured()) {
        res.status(503).json({
          error: "The API service is missing DATABASE_URL for the canonical ExamTree database",
          code: "DATABASE_URL_REQUIRED",
        });
        return;
      }

      const identity = {
        firebaseUid: req.user.id,
        email: req.user.email,
        emailVerified: req.user.emailVerified,
      };
      if (!(await dependencies.isAdministrator(identity))) {
        res.status(403).json({ error: "Administrator access required" });
        return;
      }

      await dependencies.activateInvitation(identity);
      await dependencies.relinkIdentity(identity);
      const result = await dependencies.bootstrap({
        firebaseUid: req.user.id,
        email: req.user.email,
        displayName: req.user.displayName,
      });

      res.status(200).json({
        ...result.session,
        firstAdministrator: result.firstAdministrator,
        pendingRoleAssignment: result.pendingRoleAssignment,
      });
    } catch (error) {
      if (error instanceof AdminIdentityError) {
        const message = error.code === "ADMIN_IDENTITY_SCHEMA_REQUIRED"
          ? "The configured database does not contain the migrated ExamTree identity schema"
          : error.message;
        res.status(error.statusCode).json({ error: message, code: error.code });
        return;
      }
      next(error);
    }
  });

  return router;
}

export default createAdminSessionRouter();
