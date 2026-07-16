import { Router } from "express";
import { eq } from "drizzle-orm";

import { users } from "@workspace/db";
import { db } from "../lib/db";
import { bootstrapAdminIdentity } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/bootstrap", authenticate, async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Authentication required" });
    // Transitional boundary: legacy student DB is consulted only for this role check.
    const legacyUser = await db.select({ role: users.role }).from(users).where(eq(users.id, req.user.id)).limit(1);
    if (legacyUser[0]?.role !== "admin") {
      return res.status(403).json({ error: "Legacy administrator access required" });
    }
    const result = await bootstrapAdminIdentity({
      firebaseUid: req.user.id,
      email: req.user.email,
      displayName: typeof req.body?.displayName === "string" ? req.body.displayName : undefined,
    });
    return res.status(200).json({ ...result.session, firstAdministrator: result.firstAdministrator });
  } catch (error) {
    next(error);
  }
});

export default router;
