import { Router } from "express";

import {
  ADMIN_REQUEST_FAILURE_RETENTION_DAYS,
  listAdminRequestFailures,
  updateAdminRequestFailure,
} from "../lib/admin-request-failures";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

router.use(authenticate);

router.get(
  "/request-failures",
  requireAdminPermission("jobs.read"),
  async (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const failures = await listAdminRequestFailures(Number.isFinite(limit) ? limit : 100);
    res.json({
      failures,
      count: failures.length,
      generatedAt: new Date().toISOString(),
      retention: `${ADMIN_REQUEST_FAILURE_RETENTION_DAYS} days with current-process memory fallback`,
      storage: "operations.request_failures",
    });
  },
);

router.post(
  "/request-failures/:failureId/actions",
  requireAdminPermission("jobs.manage"),
  async (req, res) => {
    const failureId = String(req.params.failureId ?? "");
    const action = String(req.body?.action ?? "");
    const actorUserId = req.adminSession?.user.id;

    if (!UUID_RE.test(failureId)) {
      res.status(400).json({ error: "Invalid request failure ID", code: "INVALID_REQUEST_FAILURE_ID" });
      return;
    }
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required", code: "ADMIN_SESSION_REQUIRED" });
      return;
    }
    if (!["acknowledge", "resolve", "reopen"].includes(action)) {
      res.status(400).json({ error: "Unsupported request failure action", code: "INVALID_REQUEST_FAILURE_ACTION" });
      return;
    }
    if (action === "resolve" && String(req.body?.note ?? "").trim().length < 4) {
      res.status(400).json({ error: "A resolution note of at least four characters is required", code: "RESOLUTION_NOTE_REQUIRED" });
      return;
    }

    try {
      const failure = await updateAdminRequestFailure({
        id: failureId,
        actorUserId,
        action: action as "acknowledge" | "resolve" | "reopen",
        note: typeof req.body?.note === "string" ? req.body.note : undefined,
      });
      if (!failure) {
        res.status(404).json({ error: "Request failure not found", code: "REQUEST_FAILURE_NOT_FOUND" });
        return;
      }
      res.json({ failure, action, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Request failure action failed", error);
      res.status(500).json({ error: "Unable to update request failure", code: "REQUEST_FAILURE_UPDATE_FAILED" });
    }
  },
);

export default router;
