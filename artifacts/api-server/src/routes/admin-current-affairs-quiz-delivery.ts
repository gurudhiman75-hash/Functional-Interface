import { Router, type IRouter, type Response } from "express";

import {
  listCurrentAffairsQuizDeliveryQueue,
  loadCurrentAffairsQuizDeliveryCandidate,
  publishCurrentAffairsQuizDelivery,
  revokeCurrentAffairsQuizDelivery,
} from "../current-affairs/quiz-delivery-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class QuizDeliveryAdminError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!UUID_PATTERN.test(id)) throw new QuizDeliveryAdminError("INVALID_CURRENT_AFFAIRS_QUIZ_ID", `${label} is invalid.`);
  return id;
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof QuizDeliveryAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_QUIZ_SOURCE_NOT_FOUND" });
    return;
  }
  if (/blocked|only an active approved|no promoted quiz items|no question items|cannot be republished|only a published|no longer matches|missing|requires every released question/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_QUIZ_DELIVERY_BLOCKED" });
    return;
  }
  if (/requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "CURRENT_AFFAIRS_QUIZ_REASON_REQUIRED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_QUIZ_DELIVERY_FAILED" });
}

router.use(authenticate);

router.get(
  "/quiz-delivery/queue",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const limit = positiveInteger(req.query.limit, 100, 300);
      res.json({ releases: await listCurrentAffairsQuizDeliveryQueue(limit), generatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs learner quiz delivery queue");
    }
  },
);

router.get(
  "/quiz-delivery/releases/:id",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const releaseId = uuid(req.params.id, "Current Affairs release ID");
      res.json({ candidate: await loadCurrentAffairsQuizDeliveryCandidate(releaseId), generatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs learner quiz candidate");
    }
  },
);

router.post(
  "/quiz-delivery/releases/:id/publish",
  requireAdminPermission("content.questions.publish"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new QuizDeliveryAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const releaseId = uuid(req.params.id, "Current Affairs release ID");
      const reason = text(req.body?.reason, 1000);
      if (reason.length < 8) throw new QuizDeliveryAdminError("CURRENT_AFFAIRS_QUIZ_REASON_REQUIRED", "Provide an editorial quiz publication reason of at least 8 characters.");
      const delivery = await publishCurrentAffairsQuizDelivery({ releaseId, actorUserId, reason });
      res.status(delivery.alreadyPublished ? 200 : 201).json({ delivery });
    } catch (error) {
      sendError(res, error, "Unable to publish Current Affairs learner quiz");
    }
  },
);

router.post(
  "/quiz-delivery/:id/revoke",
  requireAdminPermission("content.questions.publish"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new QuizDeliveryAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const deliveryId = uuid(req.params.id, "Current Affairs quiz delivery ID");
      const reason = text(req.body?.reason, 1000);
      if (reason.length < 8) throw new QuizDeliveryAdminError("CURRENT_AFFAIRS_QUIZ_REASON_REQUIRED", "Provide a quiz revocation reason of at least 8 characters.");
      res.json({ delivery: await revokeCurrentAffairsQuizDelivery({ deliveryId, actorUserId, reason }) });
    } catch (error) {
      sendError(res, error, "Unable to revoke Current Affairs learner quiz");
    }
  },
);

export default router;
