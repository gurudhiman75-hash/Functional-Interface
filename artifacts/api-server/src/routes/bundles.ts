import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { bundles } from "@workspace/db";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const allBundles = await db.select().from(bundles);
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

export default router;
