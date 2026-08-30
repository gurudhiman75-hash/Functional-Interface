import { Router, type IRouter, type Response } from "express";

import {
  loadCurrentAffairsNotificationInbox,
  markAllCurrentAffairsNotificationsRead,
  updateCurrentAffairsNotificationPreferences,
  updateCurrentAffairsNotificationStatus,
} from "../current-affairs/notification-runtime";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_NOTIFICATION_NOT_FOUND" });
    return;
  }
  if (/canonical active student account/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_STUDENT_PROFILE_REQUIRED" });
    return;
  }
  if (/invalid/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_NOTIFICATION_REQUEST" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_NOTIFICATION_FAILED" });
}

router.get("/current-affairs/notifications", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Authentication is required.", code: "AUTH_TOKEN_REQUIRED" });
      return;
    }
    const parsed = req.query.limit == null ? 20 : Number(req.query.limit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
      res.status(400).json({ error: "Notification limit must be between 1 and 50.", code: "INVALID_CURRENT_AFFAIRS_NOTIFICATION_LIMIT" });
      return;
    }
    res.json(await loadCurrentAffairsNotificationInbox({ firebaseUid, limit: parsed }));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs notifications");
  }
});

router.patch("/current-affairs/notifications/preferences", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Authentication is required.", code: "AUTH_TOKEN_REQUIRED" });
      return;
    }
    const preferences = await updateCurrentAffairsNotificationPreferences({
      firebaseUid,
      inAppNotificationsEnabled: req.body?.inAppNotificationsEnabled,
      quietHoursStart: req.body?.quietHoursStart,
      quietHoursEnd: req.body?.quietHoursEnd,
      dailyNotificationCap: req.body?.dailyNotificationCap,
      notificationGapMinutes: req.body?.notificationGapMinutes,
      notificationsMutedUntil: req.body?.notificationsMutedUntil,
    });
    res.json({ preferences, updatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to update Current Affairs notification preferences");
  }
});

router.patch("/current-affairs/notifications/:id", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    const notificationId = typeof req.params.id === "string" && UUID_PATTERN.test(req.params.id) ? req.params.id : null;
    const status = req.body?.status === "read" || req.body?.status === "dismissed" ? req.body.status : null;
    if (!firebaseUid || !notificationId || !status) {
      res.status(400).json({ error: "Provide a valid Current Affairs notification and status.", code: "INVALID_CURRENT_AFFAIRS_NOTIFICATION_REQUEST" });
      return;
    }
    res.json(await updateCurrentAffairsNotificationStatus({ firebaseUid, notificationId, status }));
  } catch (error) {
    sendError(res, error, "Unable to update Current Affairs notification");
  }
});

router.post("/current-affairs/notifications/read-all", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Authentication is required.", code: "AUTH_TOKEN_REQUIRED" });
      return;
    }
    res.json(await markAllCurrentAffairsNotificationsRead(firebaseUid));
  } catch (error) {
    sendError(res, error, "Unable to mark Current Affairs notifications read");
  }
});

export default router;
