import { Router, type IRouter, type Response } from "express";

import {
  listCurrentAffairsQuestionPromotionQueue,
  loadCurrentAffairsQuestionPromotionCandidate,
  promoteCurrentAffairsReleaseQuestions,
} from "../current-affairs/question-promotion-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import adminCurrentAffairsQuizDeliveryRouter from "./admin-current-affairs-quiz-delivery";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class QuestionPromotionAdminError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function releaseId(value: unknown): string {
  const id = text(value, 80);
  if (!UUID_PATTERN.test(id)) {
    throw new QuestionPromotionAdminError(
      "INVALID_CURRENT_AFFAIRS_RELEASE_ID",
      "Current Affairs release ID is invalid.",
    );
  }
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof QuestionPromotionAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_PROMOTION_SOURCE_NOT_FOUND" });
    return;
  }
  if (
    /blocked|only an active approved|no approved question snapshot|could not be converted|changed after|stale|different from|cannot be silently reactivated|no longer|requires the complete|BANK_ONLY|release localization|source generation version|identity changed/i.test(message)
  ) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_QUESTION_PROMOTION_BLOCKED" });
    return;
  }
  if (/requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "CURRENT_AFFAIRS_QUESTION_PROMOTION_REASON_REQUIRED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_QUESTION_PROMOTION_FAILED" });
}

router.use(adminCurrentAffairsQuizDeliveryRouter);
router.use(authenticate);

router.get(
  "/question-promotion/queue",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const limit = positiveInteger(req.query.limit, 100, 300);
      res.json({
        releases: await listCurrentAffairsQuestionPromotionQueue(limit),
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs Question Bank promotion queue");
    }
  },
);

router.get(
  "/question-promotion/releases/:id",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const id = releaseId(req.params.id);
      res.json({
        candidate: await loadCurrentAffairsQuestionPromotionCandidate(id),
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs question promotion candidate");
    }
  },
);

router.post(
  "/question-promotion/releases/:id/promote",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new QuestionPromotionAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const id = releaseId(req.params.id);
      const reason = text(req.body?.reason, 1000);
      if (reason.length < 8) {
        throw new QuestionPromotionAdminError(
          "CURRENT_AFFAIRS_QUESTION_PROMOTION_REASON_REQUIRED",
          "Provide an editorial Question Bank promotion reason of at least 8 characters.",
        );
      }
      const promotion = await promoteCurrentAffairsReleaseQuestions({
        releaseId: id,
        actorUserId,
        reason,
      });
      res.status(201).json({ promotion });
    } catch (error) {
      sendError(res, error, "Unable to promote Current Affairs questions into Question Bank");
    }
  },
);

export default router;
