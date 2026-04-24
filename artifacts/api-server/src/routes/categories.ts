import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { categories } from "@workspace/db";
import { Category } from "@workspace/api-zod";
import { resolveCategoryIcon } from "../lib/category-icons";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const allCategories = await db.select().from(categories);
  return res.json(
    allCategories.map((row) =>
      Category.parse({
        ...row,
        icon: resolveCategoryIcon(row.name, row.icon),
      }),
    ),
  );
});

router.get("/:id", async (req, res) => {
  const category = await db.select().from(categories).where(eq(categories.id, req.params.id));
  if (!category.length) return res.status(404).json({ error: "Category not found" });
  const row = category[0];
  return res.json(
    Category.parse({
      ...row,
      icon: resolveCategoryIcon(row.name, row.icon),
    }),
  );
});

export default router;
