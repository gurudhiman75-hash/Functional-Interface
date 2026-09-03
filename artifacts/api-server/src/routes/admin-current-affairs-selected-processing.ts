import { Router, type IRouter } from "express";

import { processSelectedCurrentAffairs } from "../current-affairs/selected-affairs-processing-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function targetDate(value: unknown) {
  const date = typeof value === "string" ? value.trim() : "";
  if (!DATE_ONLY.test(date)) throw new Error("Current Affairs selected processing requires a YYYY-MM-DD date.");
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Current Affairs selected processing date is invalid.");
  }
  return date;
}

router.use(authenticate);

router.post(
  "/editorial/headlines/process-selected",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required.", code: "ADMIN_SESSION_REQUIRED" });
        return;
      }
      const result = await processSelectedCurrentAffairs({
        targetDate: targetDate(req.body?.date),
        actorUserId,
      });
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to process selected Current Affairs.";
      if (/date|YYYY-MM-DD/i.test(message)) {
        res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_DATE" });
        return;
      }
      console.error("Unable to process selected Current Affairs", error);
      res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_SELECTED_PROCESSING_FAILED" });
    }
  },
);

export default router;
