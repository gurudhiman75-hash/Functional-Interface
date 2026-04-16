import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { packages, packageTests, userPackages, userTestEntitlements } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// POST /api/purchase - Directly purchase a package (no payment gateway)
router.post("/", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const packageId = typeof req.body?.packageId === "string" ? req.body.packageId.trim() : "";

  if (!packageId) {
    return res.status(400).json({ error: "packageId is required" });
  }

  try {
    // Verify package exists
    const pkgs = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (pkgs.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Check if user already owns this package
    const existing = await db
      .select()
      .from(userPackages)
      .where(and(eq(userPackages.userId, userId), eq(userPackages.packageId, packageId)))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "You already own this package" });
    }

    // Create purchase and grant test entitlements in a transaction
    await db.transaction(async (tx) => {
      await tx.insert(userPackages).values({
        id: randomUUID(),
        userId,
        packageId,
      });

      const pkgTests = await tx
        .select({ testId: packageTests.testId })
        .from(packageTests)
        .where(eq(packageTests.packageId, packageId));

      for (const { testId } of pkgTests) {
        await tx
          .insert(userTestEntitlements)
          .values({ userId, testId, source: "mock" })
          .onConflictDoNothing();
      }
    });

    logger.info({ userId, packageId, action: "package_purchased_direct" });

    return res.status(201).json({ ok: true, message: "Package purchased successfully" });
  } catch (error) {
    logger.error({ userId, packageId, error }, "Direct purchase failed");
    return res.status(500).json({ error: "Purchase failed" });
  }
});

export default router;
