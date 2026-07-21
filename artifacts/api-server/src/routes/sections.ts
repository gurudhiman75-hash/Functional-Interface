import { Router } from "express";
import { db } from "../lib/db";
import { sections } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "name is required" });

    // Check for existing section with same name
    const existing = await db.select().from(sections).where(eq(sections.name, name)).limit(1);
    if (existing.length > 0) return res.json(existing[0]); // idempotent

    const id = `section-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const [created] = await db.insert(sections).values({ id, name }).returning();
    return res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create section" });
  }
});

router.delete("/:sectionId", async (req, res) => {
  try {
    await db.delete(sections).where(eq(sections.id, req.params.sectionId));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete section" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(sections).orderBy(sections.name);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

export default router;
