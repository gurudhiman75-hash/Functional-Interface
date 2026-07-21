import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { responses, attempts } from "@workspace/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/", authenticate, async (req, res) => {
  const { attemptId } = req.query;
  if (!attemptId || typeof attemptId !== "string") {
    return res.status(400).json({ error: "Missing or invalid attemptId" });
  }

  const rows = await db.select().from(responses).where(eq(responses.attemptId, attemptId));
  return res.json(rows);
});

router.post("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { attemptId, responses: responseItems } = req.body as {
    attemptId: string;
    responses: { questionId: number; selectedOption: number | null; timeTaken: number }[];
  };

  if (!attemptId || typeof attemptId !== "string") {
    return res.status(400).json({ error: "Missing attemptId" });
  }
  if (!Array.isArray(responseItems) || responseItems.length === 0) {
    return res.status(400).json({ error: "responses must be a non-empty array" });
  }

  // Verify ownership and insert atomically in a transaction
  const inserted = await db.transaction(async (tx) => {
    const [attempt] = await tx
      .select({ id: attempts.id })
      .from(attempts)
      .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
      .limit(1);

    if (!attempt) {
      return null;
    }

    // Force attemptId from server — never trust per-row values from client
    const rows = responseItems.map(({ questionId, selectedOption, timeTaken }) => ({
      attemptId,
      questionId,
      selectedOption: selectedOption ?? null,
      timeTaken: timeTaken ?? 0,
    }));

    return tx.insert(responses).values(rows).returning();
  });

  if (!inserted) {
    return res.status(403).json({ error: "Attempt not found or access denied" });
  }

  return res.json(inserted);
});

export default router;
