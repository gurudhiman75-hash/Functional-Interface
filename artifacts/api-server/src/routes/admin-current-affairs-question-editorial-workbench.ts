import { Router, type IRouter, type Response } from "express";

import {
  approveCurrentAffairsQuestionEditorialItem,
  createManualCurrentAffairsEnglishQuestionRevision,
  loadCurrentAffairsQuestionEditorialDetail,
  loadCurrentAffairsQuestionEditorialQueue,
} from "../current-affairs/question-editorial-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class QuestionEditorialError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function uuid(value: unknown): string {
  const id = text(value, 80);
  if (!UUID_PATTERN.test(id)) throw new QuestionEditorialError("INVALID_GENERATION_ITEM_ID", "Generation item ID is invalid.");
  return id;
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof QuestionEditorialError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_QUESTION_NOT_FOUND" });
    return;
  }
  if (/blocked|locked|conflict|must remain|preserve|invalid correct index|not editable/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_QUESTION_EDITORIAL_GATE_FAILED" });
    return;
  }
  if (/must contain|requires an editorial reason|reason/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_QUESTION_EDITORIAL_INPUT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_QUESTION_EDITORIAL_FAILED" });
}

router.use(authenticate);

router.get(
  "/question-editorial/queue",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const limit = positiveInteger(req.query.limit, 100, 500);
      res.json(await loadCurrentAffairsQuestionEditorialQueue(limit));
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs question editorial queue");
    }
  },
);

router.get(
  "/question-editorial/:generationItemId",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      res.json(await loadCurrentAffairsQuestionEditorialDetail(uuid(req.params.generationItemId)));
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs question editorial workbench");
    }
  },
);

router.post(
  "/question-editorial/:generationItemId/english",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new QuestionEditorialError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const generationItemId = uuid(req.params.generationItemId);
      const stem = text(req.body?.stem, 20_000);
      const explanation = text(req.body?.explanation, 40_000);
      const reason = text(req.body?.reason, 1000);
      const result = await createManualCurrentAffairsEnglishQuestionRevision({
        generationItemId,
        stem,
        explanation,
        reason,
        actorUserId,
      });
      res.status(201).json(result);
    } catch (error) {
      sendError(res, error, "Unable to save Current Affairs English question revision");
    }
  },
);

router.post(
  "/question-editorial/:generationItemId/approve",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new QuestionEditorialError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const generationItemId = uuid(req.params.generationItemId);
      const reason = text(req.body?.reason, 1000);
      res.json(await approveCurrentAffairsQuestionEditorialItem({ generationItemId, reason, actorUserId }));
    } catch (error) {
      sendError(res, error, "Unable to approve Current Affairs question");
    }
  },
);

export default router;
