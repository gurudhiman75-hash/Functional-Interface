import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { patterns } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";
import { SAMPLE_PATTERNS } from "../lib/patterns.seed";

const router: IRouter = Router();

async function seedPatternsIfMissing() {
  const existing = await db.select({ name: patterns.name }).from(patterns);
  if (existing.length > 0) return false;
  await db.insert(patterns).values(SAMPLE_PATTERNS as any);
  return true;
}

router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);
    await seedPatternsIfMissing();
    const rows = await db.select().from(patterns).orderBy(patterns.createdAt);
    return res.json({ patterns: rows, meta: { total: rows.length } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load patterns";
    return res.status(400).json({ error: message });
  }
});

router.post("/seed", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);

    const existing = await db.select({ name: patterns.name }).from(patterns);
    const existingNames = new Set(existing.map((row) => row.name));
    const toInsert = SAMPLE_PATTERNS.filter((pattern) => !existingNames.has(pattern.name));
    if (toInsert.length > 0) {
      await db.insert(patterns).values(toInsert as any);
    }
    return res.json({ ok: true, seeded: toInsert.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not seed patterns";
    return res.status(400).json({ error: message });
  }
});

export default router;
