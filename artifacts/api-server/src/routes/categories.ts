import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { categories } from "@workspace/db";
import { Category } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const allCategories = await db.select().from(categories);
  res.json(allCategories.map(Category.parse));
});

router.get("/:id", async (req, res) => {
  const category = await db.select().from(categories).where(eq(categories.id, req.params.id));
  if (!category.length) return res.status(404).json({ error: "Category not found" });
  res.json(Category.parse(category[0]));
});

export default router;