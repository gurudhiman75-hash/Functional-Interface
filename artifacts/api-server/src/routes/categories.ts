import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { categories } from "@workspace/db";
import { Category } from "@workspace/api-zod";
import { resolveCategoryIcon } from "../lib/category-icons";

const router: IRouter = Router();
const RETIRED_CATEGORY_IDS = new Set(["1", "2", "4", "5"]);
const RETIRED_CATEGORY_NAMES = new Set(["JEE Main", "NEET", "UPSC", "GATE"]);

router.get("/", async (_req, res) => {
  const allCategories = await db.select().from(categories);
  return res.json(
    allCategories
      .filter((row) => !RETIRED_CATEGORY_IDS.has(row.id) && !RETIRED_CATEGORY_NAMES.has(row.name))
      .map((row) =>
      Category.parse({
        ...row,
        icon: resolveCategoryIcon(row.name, row.icon),
      }),
    ),
  );
});

router.get("/:id", async (req, res) => {
  if (RETIRED_CATEGORY_IDS.has(req.params.id)) {
    return res.status(404).json({ error: "Category not found" });
  }
  const category = await db.select().from(categories).where(eq(categories.id, req.params.id));
  if (!category.length) return res.status(404).json({ error: "Category not found" });
  const row = category[0];
  if (RETIRED_CATEGORY_NAMES.has(row.name)) {
    return res.status(404).json({ error: "Category not found" });
  }
  return res.json(
    Category.parse({
      ...row,
      icon: resolveCategoryIcon(row.name, row.icon),
    }),
  );
});

export default router;
