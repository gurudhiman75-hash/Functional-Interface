import { Router, type IRouter, type Response } from "express";

import {
  approveCurrentAffairsRelease,
  listCurrentAffairsReleaseHistory,
  loadCurrentAffairsReleaseCandidate,
  loadCurrentAffairsReleaseQueue,
  revokeCurrentAffairsRelease,
  type CurrentAffairsReleaseKey,
} from "../current-affairs/release-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import adminCurrentAffairsQuestionPromotionRouter from "./admin-current-affairs-question-promotion";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const periodTypes = new Set(["daily", "weekly", "monthly"]);
const examFamilies = new Set(["ssc", "banking", "punjab", "railways", "general"]);

class ReleaseAdminError extends Error {
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

function dateOnly(value: unknown, field: string): string {
  const raw = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new ReleaseAdminError("INVALID_RELEASE_PERIOD", `${field} must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw) {
    throw new ReleaseAdminError("INVALID_RELEASE_PERIOD", `${field} is invalid.`);
  }
  return raw;
}

function releaseKey(source: unknown): CurrentAffairsReleaseKey {
  const body = source && typeof source === "object" && !Array.isArray(source)
    ? source as Record<string, unknown>
    : {};
  const periodType = text(body.periodType, 20).toLowerCase();
  const examFamily = text(body.examFamily, 30).toLowerCase();
  if (!periodTypes.has(periodType)) {
    throw new ReleaseAdminError("INVALID_RELEASE_PERIOD_TYPE", "Choose daily, weekly or monthly.");
  }
  if (!examFamilies.has(examFamily)) {
    throw new ReleaseAdminError("INVALID_RELEASE_EXAM_FAMILY", "Choose a supported Current Affairs exam family.");
  }
  const periodStart = dateOnly(body.periodStart, "periodStart");
  const periodEnd = dateOnly(body.periodEnd, "periodEnd");
  if (periodEnd < periodStart) {
    throw new ReleaseAdminError("INVALID_RELEASE_PERIOD", "periodEnd cannot be before periodStart.");
  }
  if (periodType === "daily" && periodStart !== periodEnd) {
    throw new ReleaseAdminError("INVALID_RELEASE_PERIOD", "Daily Current Affairs release start and end dates must match.");
  }
  return {
    periodType: periodType as CurrentAffairsReleaseKey["periodType"],
    periodStart,
    periodEnd,
    examFamily: examFamily as CurrentAffairsReleaseKey["examFamily"],
  };
}

function releaseId(value: unknown): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new ReleaseAdminError("INVALID_RELEASE_ID", "Current Affairs release ID is invalid.");
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof ReleaseAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_RELEASE_NOT_FOUND" });
    return;
  }
  if (/blocked|already has an active approved|only an active approved|exactly three draft|snapshot is incomplete/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_RELEASE_BLOCKED" });
    return;
  }
  if (/requires an editorial reason/i.test(message)) {
    res.status(400).json({ error: message, code: "CURRENT_AFFAIRS_RELEASE_REASON_REQUIRED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_RELEASE_FAILED" });
}

router.use(adminCurrentAffairsQuestionPromotionRouter);
router.use(authenticate);

router.get(
  "/release-control/queue",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const limit = positiveInteger(req.query.limit, 100, 300);
      const candidates = await loadCurrentAffairsReleaseQueue(limit);
      res.json({
        candidates,
        readyCount: candidates.filter((item) => item.readiness.ready).length,
        blockedCount: candidates.filter((item) => !item.readiness.ready).length,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs release queue");
    }
  },
);

router.get(
  "/release-control/candidate",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const key = releaseKey(req.query);
      res.json({ candidate: await loadCurrentAffairsReleaseCandidate(key) });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs release candidate");
    }
  },
);

router.get(
  "/release-control/history",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const limit = positiveInteger(req.query.limit, 100, 500);
      res.json({ releases: await listCurrentAffairsReleaseHistory(limit), generatedAt: new Date().toISOString() });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs release history");
    }
  },
);

router.post(
  "/release-control/approve",
  requireAdminPermission("content.questions.publish"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new ReleaseAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const key = releaseKey(req.body);
      const reason = text(req.body?.reason, 1000);
      if (reason.length < 8) {
        throw new ReleaseAdminError("CURRENT_AFFAIRS_RELEASE_REASON_REQUIRED", "Provide an editorial approval reason of at least 8 characters.");
      }
      const release = await approveCurrentAffairsRelease({ key, actorUserId, reason });
      res.status(201).json({ release });
    } catch (error) {
      sendError(res, error, "Unable to approve Current Affairs release");
    }
  },
);

router.post(
  "/release-control/:id/revoke",
  requireAdminPermission("content.questions.publish"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new ReleaseAdminError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      const id = releaseId(req.params.id);
      const reason = text(req.body?.reason, 1000);
      if (reason.length < 8) {
        throw new ReleaseAdminError("CURRENT_AFFAIRS_RELEASE_REASON_REQUIRED", "Provide a revocation reason of at least 8 characters.");
      }
      res.json({ release: await revokeCurrentAffairsRelease({ releaseId: id, actorUserId, reason }) });
    } catch (error) {
      sendError(res, error, "Unable to revoke Current Affairs release");
    }
  },
);

export default router;
