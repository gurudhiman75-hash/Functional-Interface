import { Router, type RequestHandler } from "express";

import {
  AdminIdentityError,
  bootstrapAdminIdentity,
  type AdminBootstrapResult,
} from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

export type AdminSessionRouteDependencies = {
  authenticate: RequestHandler;
  isDatabaseConfigured: () => boolean;
  isAdministrator: (firebaseUid: string) => Promise<boolean>;
  bootstrap: (input: {
    firebaseUid: string;
    email?: string;
    displayName?: string;
  }) => Promise<AdminBootstrapResult>;
};

export async function isCanonicalAdministrator(firebaseUid: string): Promise<boolean> {
  const rows = await sqlClient`
    SELECT 1
    FROM identity.auth_identities ai
    JOIN identity.user_roles ur
      ON ur.user_id = ai.user_id
     AND ur.revoked_at IS NULL
     AND (ur.valid_until IS NULL OR ur.valid_until > now())
    JOIN identity.roles r
      ON r.id = ur.role_id
     AND r.key = 'super_admin'
     AND r.is_active = true
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;
  return rows.length > 0;
}

export function isProductionDatabaseConfigured(): boolean {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.DATABASE_URL?.trim());
}

export function createAdminSessionRouter(
  dependencies: AdminSessionRouteDependencies = {
    authenticate,
    isDatabaseConfigured: isProductionDatabaseConfigured,
    isAdministrator: isCanonicalAdministrator,
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

      if (!(await dependencies.isAdministrator(req.user.id))) {
        res.status(403).json({ error: "Administrator access required" });
        return;
      }

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
