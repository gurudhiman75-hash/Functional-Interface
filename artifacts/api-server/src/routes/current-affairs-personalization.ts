import { Router, type IRouter, type Response } from "express";

import {
  deleteCurrentAffairsSavedItem,
  loadCurrentAffairsPersonalization,
  saveCurrentAffairsLearnerItem,
  updateCurrentAffairsPreferences,
} from "../current-affairs/personalization-runtime";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (/not found|not active and saveable/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_PERSONALIZATION_TARGET_NOT_FOUND" });
    return;
  }
  if (/canonical active student account/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_STUDENT_PROFILE_REQUIRED" });
    return;
  }
  if (/invalid/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_PERSONALIZATION_REQUEST" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_PERSONALIZATION_FAILED" });
}

router.get("/current-affairs/personalization", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Authentication is required.", code: "AUTH_TOKEN_REQUIRED" });
      return;
    }
    res.json(await loadCurrentAffairsPersonalization(firebaseUid));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs personalization");
  }
});

router.patch("/current-affairs/personalization/preferences", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Authentication is required.", code: "AUTH_TOKEN_REQUIRED" });
      return;
    }
    const preferences = await updateCurrentAffairsPreferences({
      firebaseUid,
      dailyQuestionTarget: req.body?.dailyQuestionTarget,
      preferredLanguage: req.body?.preferredLanguage,
      preferredExamFamily: req.body?.preferredExamFamily,
      revisionSignalEnabled: req.body?.revisionSignalEnabled,
      dailyPackSignalEnabled: req.body?.dailyPackSignalEnabled,
      studyTargetSignalEnabled: req.body?.studyTargetSignalEnabled,
    });
    res.json({ preferences, updatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to update Current Affairs preferences");
  }
});

router.put("/current-affairs/saved-items", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    const targetType = req.body?.targetType === "learning_resource" || req.body?.targetType === "quiz_delivery_item"
      ? req.body.targetType
      : null;
    const targetId = typeof req.body?.targetId === "string" && UUID_PATTERN.test(req.body.targetId) ? req.body.targetId : null;
    if (!firebaseUid || !targetType || !targetId) {
      res.status(400).json({ error: "Provide an active Current Affairs resource/question target.", code: "INVALID_CURRENT_AFFAIRS_SAVED_ITEM" });
      return;
    }
    res.json(await saveCurrentAffairsLearnerItem({
      firebaseUid,
      targetType,
      targetId,
      saveMode: req.body?.saveMode,
      reviewAfter: req.body?.reviewAfter,
    }));
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs item");
  }
});

router.delete("/current-affairs/saved-items/:id", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user?.id ?? "";
    const savedItemId = typeof req.params.id === "string" && UUID_PATTERN.test(req.params.id) ? req.params.id : null;
    if (!firebaseUid || !savedItemId) {
      res.status(400).json({ error: "Saved Current Affairs item ID is invalid.", code: "INVALID_CURRENT_AFFAIRS_SAVED_ITEM" });
      return;
    }
    res.json(await deleteCurrentAffairsSavedItem({ firebaseUid, savedItemId }));
  } catch (error) {
    sendError(res, error, "Unable to remove Current Affairs saved item");
  }
});

export default router;
