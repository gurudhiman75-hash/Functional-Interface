import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../lib/db";
import { bundles, bundlePackages } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const allBundles = await db
    .select({
      id: bundles.id,
      name: bundles.name,
      description: bundles.description,
      price: bundles.price,
      categoryId: bundles.categoryId,
      isPopular: bundles.isPopular,
      order: bundles.order,
      createdAt: bundles.createdAt,
      packageCount: sql<number>`(select count(*) from bundle_packages where bundle_id = ${bundles.id})`,
    })
    .from(bundles)
    .orderBy(bundles.order);
  return res.json(allBundles);
});

router.get("/:id", async (req, res) => {
  const bundle = await db.select().from(bundles).where(eq(bundles.id, req.params.id));
  if (!bundle.length) return res.status(404).json({ error: "Bundle not found" });
  return res.json(bundle[0]);
});

router.get("/category/:categoryId", async (req, res) => {
  const categoryBundles = await db.select().from(bundles).where(eq(bundles.categoryId, req.params.categoryId));
  return res.json(categoryBundles);
});

// POST /api/bundles - Admin: create a bundle with package mappings
router.post("/", authenticate, async (req, res) => {
  const { users } = await import("@workspace/db");

  // Assert admin
  const userId = req.user!.id;
  const adminRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (adminRows.length === 0 || adminRows[0].role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { name, description, price, packageIds } = req.body as {
    name?: string;
    description?: string;
    price?: number;
    packageIds?: string[];
  };

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "description is required" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "price must be a positive number" });
  }
  if (!Array.isArray(packageIds) || packageIds.length === 0) {
    return res.status(400).json({ error: "packageIds must be a non-empty array" });
  }

  try {
    const bundleId = randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(bundles).values({
        id: bundleId,
        name: name.trim(),
        description: description.trim(),
        categoryId: "",
        price,
        features: [],
      });

      for (const packageId of packageIds) {
        await tx.insert(bundlePackages).values({
          id: randomUUID(),
          bundleId,
          packageId,
        }).onConflictDoNothing();
      }
    });

    logger.info({ bundleId, name, packageCount: packageIds.length, action: "bundle_created" });

    return res.status(201).json({ id: bundleId });
  } catch (error) {
    logger.error({ error }, "Failed to create bundle");
    return res.status(500).json({ error: "Failed to create bundle" });
  }
});

export default router;
