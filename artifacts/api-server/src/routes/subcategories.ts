import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { subcategories } from "@workspace/db";
import { resolveSubcategoryIcon } from "../lib/subcategory-icons";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(subcategories);
  return res.json(
    rows.map((row) => ({
      ...row,
      icon: resolveSubcategoryIcon(row.categoryName, row.name),
    })),
  );
});

export default router;
