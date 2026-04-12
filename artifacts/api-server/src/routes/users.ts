import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "@workspace/db";
import { User } from "@workspace/api-zod";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const adminEmails = new Set(
  [
    "gurbajdhiman@gmail.com",
    ...(process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  ]
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

function normalizeUserRow(row: typeof users.$inferSelect) {
  return {
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.getTime() : new Date(row.createdAt).getTime(),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.getTime() : new Date(row.updatedAt).getTime(),
  };
}

function resolveRole(email: string, existingRole?: string | null) {
  const normalizedEmail = email.trim().toLowerCase();
  if (adminEmails.has(normalizedEmail)) return "admin" as const;
  if (existingRole === "admin" || existingRole === "student") return existingRole;
  return "student" as const;
}

async function upsertUserFromRequest(payload: {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "student";
}) {
  const existing = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
  const nextRole = resolveRole(payload.email, existing[0]?.role ?? payload.role);
  const [record] = await db
    .insert(users)
    .values({
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: nextRole,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: payload.email,
        name: payload.name,
        role: nextRole,
        updatedAt: new Date(),
      },
    })
    .returning();

  return User.parse(normalizeUserRow(record));
}

router.get("/me", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) return res.status(404).json({ error: "User not found" });
  const currentEmail = req.user?.email ?? user[0].email;
  const nextRole = resolveRole(currentEmail, user[0].role);
  if (nextRole !== user[0].role) {
    const [updated] = await db
      .update(users)
      .set({
        role: nextRole,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return res.json(User.parse(normalizeUserRow(updated)));
  }
  return res.json(User.parse(normalizeUserRow(user[0])));
});

router.post("/", async (req, res) => {
  const { id, email, name, role } = req.body;
  const user = await upsertUserFromRequest({ id, email, name, role });
  return res.json(user);
});

export default router;
