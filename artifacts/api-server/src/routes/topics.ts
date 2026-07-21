import { Router } from "express";
import { db } from "../lib/db";
import { topicsGlobal } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

/** GET /api/topics — list all global topics (alphabetical) */
router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(topicsGlobal).orderBy(topicsGlobal.name);
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: "Failed to fetch topics" });
  }
});

/**
 * POST /api/topics
 * Body: { name: string }
 * Idempotent: returns existing record if name already exists.
 */
router.post("/", async (req, res) => {
  try {
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "name is required" });

    // Case-insensitive duplicate check
    const [existing] = await db.select().from(topicsGlobal)
      .where(sql`lower(${topicsGlobal.name}) = lower(${name})`)
      .limit(1);
    if (existing) return res.status(409).json({ error: `Topic "${existing.name}" already exists` });

    const id = `topic-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const [created] = await db.insert(topicsGlobal).values({ id, name }).returning();
    return res.status(201).json(created);
  } catch {
    return res.status(500).json({ error: "Failed to create topic" });
  }
});

/** PATCH /api/topics/:id — rename */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    // Case-insensitive duplicate check (exclude current record)
    const [dup] = await db.select().from(topicsGlobal)
      .where(sql`lower(${topicsGlobal.name}) = lower(${name})`)
      .limit(1);
    if (dup && dup.id !== id) return res.status(409).json({ error: `Topic "${dup.name}" already exists` });

    const [updated] = await db.update(topicsGlobal).set({ name }).where(eq(topicsGlobal.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Topic not found" });
    return res.json(updated);
  } catch {
    return res.status(500).json({ error: "Failed to update topic" });
  }
});

/** DELETE /api/topics/:id */
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(topicsGlobal).where(eq(topicsGlobal.id, req.params.id));
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete topic" });
  }
});

export default router;
