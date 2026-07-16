import { Router, type RequestHandler } from "express";
import { eq } from "drizzle-orm";

import { users } from "@workspace/db";
import {
  AdminIdentityError,
  bootstrapAdminIdentity,
  type AdminBootstrapResult,
} from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

export type AdminSessionRouteDependencies = {
  authenticate: RequestHandler;
  isAdminDatabaseConfigured: () => boolean;
  isLegacyAdmin: (firebaseUid: string) => Promise<boolean>;
  bootstrap: (input: {
    firebaseUid: string;
    email?: string;
    displayName?: string;
  }) => Promise<AdminBootstrapResult>;
};

export async function isLegacyAdministrator(firebaseUid: string): Promise<boolean> {
  // Keep the transitional student/admin boundary explicit and lazily loaded so
  // route tests never require a real student database.
  const { db } = await import("../lib/db");
  const legacyUser = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, firebaseUid))
    .limit(1);
  return legacyUser[0]?.role === "admin";
}

export function isProductionAdminDatabaseConfigured(): boolean {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.ADMIN_DATABASE_URL?.trim());
}

export function createAdminSessionRouter(
  dependencies: AdminSessionRouteDependencies = {
    authenticate,
    isAdminDatabaseConfigured: isProductionAdminDatabaseConfigured,
    isLegacyAdmin: isLegacyAdministrator,
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

      if (!dependencies.isAdminDatabaseConfigured()) {
        res.status(503).json({
          error: "The API service is missing ADMIN_DATABASE_URL for the ExamTree admin database",
          code: "ADMIN_DATABASE_URL_REQUIRED",
        });
        return;
      }

      if (!(await dependencies.isLegacyAdmin(req.user.id))) {
        res.status(403).json({ error: "Legacy administrator access required" });
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
          ? "The configured ADMIN_DATABASE_URL does not point to the migrated ExamTree admin database"
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
