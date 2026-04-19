import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db } from "../lib/db";
import { diSets } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";

const router: IRouter = Router();

// ── GET /di-sets ──────────────────────────────────────────────────────────────
router.get("/di-sets", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const rows = await db.select().from(diSets).orderBy(asc(diSets.createdAt));
    res.json(rows);
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[di-sets] GET /di-sets", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /di-sets/:id ──────────────────────────────────────────────────────────
router.get("/di-sets/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });
    const [row] = await db.select().from(diSets).where(eq(diSets.id, id)).limit(1);
    if (!row) return void res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err: any) {
    console.error("[di-sets] GET /di-sets/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /di-sets ─────────────────────────────────────────────────────────────
router.post("/di-sets", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const { title, imageUrl, description } = req.body as {
      title: string;
      imageUrl?: string | null;
      description?: string | null;
    };

    if (!title?.trim()) {
      return void res.status(400).json({ error: "title is required" });
    }

    const [inserted] = await db
      .insert(diSets)
      .values({
        title: title.trim(),
        imageUrl: imageUrl?.trim() || null,
        description: description?.trim() || null,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[di-sets] POST /di-sets", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /di-sets/:id ──────────────────────────────────────────────────────────
router.put("/di-sets/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

    const { title, imageUrl, description } = req.body as {
      title?: string;
      imageUrl?: string | null;
      description?: string | null;
    };

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;

    if (Object.keys(updateData).length === 0) {
      return void res.status(400).json({ error: "No fields to update" });
    }

    const [updated] = await db
      .update(diSets)
      .set(updateData as Partial<typeof diSets.$inferInsert>)
      .where(eq(diSets.id, id))
      .returning();

    if (!updated) return void res.status(404).json({ error: "DI set not found" });
    res.json(updated);
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[di-sets] PUT /di-sets/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /di-sets/:id ───────────────────────────────────────────────────────
router.delete("/di-sets/:id", authenticate, async (req, res): Promise<void> => {
  try {
    await assertAdmin(req.user!.id);
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

    await db.delete(diSets).where(eq(diSets.id, id));
    res.status(204).end();
  } catch (err: any) {
    if (err.message === "forbidden") return void res.status(403).json({ error: "Forbidden" });
    console.error("[di-sets] DELETE /di-sets/:id", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
