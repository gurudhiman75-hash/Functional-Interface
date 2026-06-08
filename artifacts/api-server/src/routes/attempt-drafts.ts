import { Router, type IRouter, type Request } from "express";
import { authenticate } from "../middlewares/auth";
import {
  attemptDraftService,
  StaleAttemptDraftError,
} from "../services/attempt-draft-service";
import {
  isAttemptDraftState,
  type AttemptDraftStatus,
  type AttemptDraftType,
} from "../types/attempt-drafts";

const router: IRouter = Router();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAttemptType(value: unknown): AttemptDraftType | null {
  return value === "REAL" || value === "PRACTICE" ? value : null;
}

function parseStatus(value: unknown): AttemptDraftStatus | null {
  return value === "in_progress" || value === "paused" ? value : null;
}

function parseOptionalDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function deviceFromRequest(req: Request, body: Record<string, unknown>): string {
  const bodyDevice = body.lastDevice;
  if (typeof bodyDevice === "string" && bodyDevice.trim()) return bodyDevice.trim();
  const headerDevice = req.get("x-examtree-device");
  if (typeof headerDevice === "string" && headerDevice.trim()) return headerDevice.trim();
  return "web";
}

router.get("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const attemptType = req.query.attemptType
    ? parseAttemptType(req.query.attemptType)
    : undefined;
  if (req.query.attemptType && !attemptType) {
    return res.status(400).json({ error: "attemptType must be REAL or PRACTICE" });
  }

  const testId = typeof req.query.testId === "string" ? req.query.testId : undefined;
  const drafts = await attemptDraftService.listDrafts({ userId, testId, attemptType });
  return res.json({ drafts });
});

router.get("/:id", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const draft = await attemptDraftService.getDraft(userId, req.params.id);
  if (!draft) return res.status(404).json({ error: "Attempt draft not found" });
  return res.json(draft);
});

router.put("/", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!isRecord(req.body)) return res.status(400).json({ error: "Invalid request body" });

  const {
    testId,
    testName,
    category,
    attemptType: rawAttemptType,
    originalAttemptId,
    state,
    expectedVersion,
    status: rawStatus,
    expiresAt,
  } = req.body;

  if (typeof testId !== "string" || !testId.trim()) {
    return res.status(400).json({ error: "Missing testId" });
  }
  if (typeof testName !== "string" || !testName.trim()) {
    return res.status(400).json({ error: "Missing testName" });
  }
  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({ error: "Missing category" });
  }

  const attemptType = parseAttemptType(rawAttemptType);
  if (!attemptType) {
    return res.status(400).json({ error: "attemptType must be REAL or PRACTICE" });
  }
  if (!isAttemptDraftState(state)) {
    return res.status(400).json({ error: "Invalid attempt draft state" });
  }
  if (expectedVersion !== undefined && (!Number.isInteger(expectedVersion) || expectedVersion < 1)) {
    return res.status(400).json({ error: "expectedVersion must be a positive integer" });
  }

  const status = rawStatus === undefined ? undefined : parseStatus(rawStatus);
  if (rawStatus !== undefined && !status) {
    return res.status(400).json({ error: "status must be in_progress or paused" });
  }

  const parsedExpiresAt = parseOptionalDate(expiresAt);
  if (expiresAt !== undefined && parsedExpiresAt === undefined) {
    return res.status(400).json({ error: "expiresAt must be an ISO date string or null" });
  }

  try {
    const draft = await attemptDraftService.saveDraft({
      userId,
      testId,
      testName,
      category,
      attemptType,
      originalAttemptId: typeof originalAttemptId === "string" ? originalAttemptId : null,
      state,
      expectedVersion,
      status,
      lastDevice: deviceFromRequest(req, req.body),
      expiresAt: parsedExpiresAt,
    });

    return res.json({
      id: draft.id,
      version: draft.version,
      updatedAt: draft.updatedAt,
    });
  } catch (error) {
    if (error instanceof StaleAttemptDraftError) {
      return res.status(409).json({
        error: "Attempt draft version is stale",
        draftId: error.draftId,
        currentVersion: error.currentVersion,
      });
    }
    throw error;
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  await attemptDraftService.deleteDraft(userId, req.params.id);
  return res.json({ ok: true });
});

export default router;
