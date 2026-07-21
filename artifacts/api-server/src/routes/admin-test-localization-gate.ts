import { Router, type NextFunction, type Request, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { evaluateTestLocalizationReadiness } from "../lib/admin-test-localization";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function enforceLocalizationGate(req: Request, res: Response, next: NextFunction) {
  const testId = String(req.params.id ?? "").trim();
  const testVersionId = typeof req.body?.expectedCurrentDraftVersionId === "string"
    ? req.body.expectedCurrentDraftVersionId.trim()
    : "";
  if (!isUuid(testId) || !isUuid(testVersionId)) {
    next();
    return;
  }

  try {
    const rows = await sqlClient`
      SELECT
        t.current_draft_version_id::text AS "currentDraftVersionId",
        t.exam_version_id::text AS "examVersionId",
        v.settings
      FROM assessment.tests t
      JOIN assessment.test_versions v ON v.id = ${testVersionId}::uuid
      WHERE t.id = ${testId}::uuid
        AND v.test_id = t.id
        AND t.deleted_at IS NULL
      LIMIT 1
    `;
    const test = rows[0];
    if (!test || String(test.currentDraftVersionId ?? "") !== testVersionId) {
      next();
      return;
    }

    const readiness = await evaluateTestLocalizationReadiness({
      testVersionId,
      examVersionId: String(test.examVersionId),
      settings: test.settings,
    });
    if (!readiness.ready) {
      res.status(409).json({
        error: readiness.issues[0]?.message ?? "Test localization is incomplete.",
        code: "TEST_LOCALIZATION_GATE_BLOCKED",
        details: readiness,
      });
      return;
    }
    next();
  } catch (error) {
    console.error("Unable to enforce Test localization gate", error);
    res.status(500).json({ error: "Unable to validate the Test localization gate" });
  }
}

router.use(authenticate);
router.post("/:id/actions/approve", requireAdminPermission("tests.approve"), enforceLocalizationGate);
router.post("/:id/actions/schedule", requireAdminPermission("tests.publish"), enforceLocalizationGate);
router.post("/:id/actions/publish", requireAdminPermission("tests.publish"), enforceLocalizationGate);

export default router;
