import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "../lib/db";
import { attempts } from "@workspace/db";
import { TestAttempt } from "@workspace/api-zod";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const userAttempts = await db.select().from(attempts).where(eq(attempts.userId, userId));
  return res.json(userAttempts.map(TestAttempt.parse));
});

router.get("/:id", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, req.params.id), eq(attempts.userId, userId)))
    .limit(1);

  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  return res.json(TestAttempt.parse(attempt));
});


router.post("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // Strip id and userId from frontend payload — both are set server-side
  const { id: _id, userId: _uid, ...rest } = req.body;
  const attemptData = { ...rest, userId, id: randomUUID() };
  const newAttempt = await db.insert(attempts).values(attemptData).returning();
  return res.json(TestAttempt.parse(newAttempt[0]));
});

export default router;
