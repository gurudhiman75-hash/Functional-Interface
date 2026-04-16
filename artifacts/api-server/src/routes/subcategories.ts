import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { subcategories } from "@workspace/db";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(subcategories);
  return res.json(rows);
});

export default router;
