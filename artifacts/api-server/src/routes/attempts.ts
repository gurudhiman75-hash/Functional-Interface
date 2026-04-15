import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
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


router.post("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const attemptData = { ...req.body, userId, id: `${userId}-${Date.now()}` };
  const newAttempt = await db.insert(attempts).values(attemptData).returning();
  return res.json(TestAttempt.parse(newAttempt[0]));
});

export default router;
