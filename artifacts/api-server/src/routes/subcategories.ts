import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { subcategories } from "@workspace/db";
import { resolveSubcategoryIcon } from "../lib/subcategory-icons";

const router: IRouter = Router();
const RETIRED_CATEGORY_NAMES = new Set(["JEE Main", "NEET", "UPSC", "GATE"]);
const RETIRED_CATEGORY_IDS = new Set(["1", "2", "4", "5"]);

router.get("/", async (_req, res) => {
  const rows = await db.select().from(subcategories);
  return res.json(
    rows
      .filter((row) => !RETIRED_CATEGORY_IDS.has(row.categoryId) && !RETIRED_CATEGORY_NAMES.has(row.categoryName))
      .map((row) => ({
      ...row,
      icon: resolveSubcategoryIcon(row.categoryName, row.name),
    })),
  );
});

export default router;
