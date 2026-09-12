import { Router, type IRouter } from "express";

import {
  getSelectedAffairsProcessingRun,
  startSelectedAffairsProcessingRun,
} from "../current-affairs/selected-affairs-processing-job";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function targetDate(value: unknown) {
  const date = typeof value === "string" ? value.trim() : "";
  if (!DATE_ONLY.test(date)) throw new Error("Current Affairs selected processing requires a YYYY-MM-DD date.");
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Current Affairs selected processing date is invalid.");
  }
  return date;
}

function runId(value: unknown) {
  const id = typeof value === "string" ? value.trim() : "";
  if (!UUID.test(id)) throw new Error("Current Affairs selected processing run id is invalid.");
  return id;
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
      const date = targetDate(req.body?.date);
      const run = await startSelectedAffairsProcessingRun({
        targetDate: date,
        actorUserId,
      });
      res.status(run.status === "completed" ? 200 : 202).json(run);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start selected Current Affairs processing.";
      if (/date|YYYY-MM-DD/i.test(message)) {
        res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_DATE" });
        return;
      }
      console.error("Unable to start selected Current Affairs processing", error);
      res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_SELECTED_PROCESSING_START_FAILED" });
    }
  },
);

router.get(
  "/editorial/headlines/process-selected/:runId",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const id = runId(req.params.runId);
      const run = await getSelectedAffairsProcessingRun(id);
      if (!run) {
        res.status(404).json({ error: "Selected Current Affairs processing run was not found.", code: "CURRENT_AFFAIRS_SELECTED_PROCESSING_RUN_NOT_FOUND" });
        return;
      }
      res.json(run);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to read selected Current Affairs processing status.";
      if (/run id/i.test(message)) {
        res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_SELECTED_PROCESSING_RUN" });
        return;
      }
      console.error("Unable to read selected Current Affairs processing status", error);
      res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_SELECTED_PROCESSING_STATUS_FAILED" });
    }
  },
);

export default router;
