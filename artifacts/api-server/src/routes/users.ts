import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "@workspace/db";
import { User } from "@workspace/api-zod";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/me", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) return res.status(404).json({ error: "User not found" });
  res.json(User.parse(user[0]));
});

router.post("/", async (req, res) => {
  const { id, email, name, role } = req.body;
  const newUser = await db.insert(users).values({
    id,
    email,
    name,
    role: role || "student",
  }).returning();
  res.json(User.parse(newUser[0]));
});

export default router;