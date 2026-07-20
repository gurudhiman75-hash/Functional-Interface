import { Router, type NextFunction, type Request, type Response } from "express";

import { TEST_QA_ACTIONS } from "../lib/admin-test-qa";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function enforceQaGate(req: Request, res: Response, next: NextFunction) {
  const testId = String(req.params.id ?? "");
  const testVersionId = typeof req.body?.expectedCurrentDraftVersionId === "string"
    ? req.body.expectedCurrentDraftVersionId.trim()
    : "";
  if (!isUuid(testId) || !isUuid(testVersionId)) {
    next();
    return;
  }

  try {
    const tests = await sqlClient`
      SELECT current_draft_version_id::text AS "currentDraftVersionId"
      FROM assessment.tests
      WHERE id = ${testId}::uuid
        AND deleted_at IS NULL
      LIMIT 1
    `;
    if (String(tests[0]?.currentDraftVersionId ?? "") !== testVersionId) {
      next();
      return;
    }

    const assignments = await sqlClient`
      SELECT metadata ->> 'assignedReviewerUserId' AS "reviewerUserId"
      FROM platform.audit_events
      WHERE entity_type = 'test'
        AND entity_id = ${testId}::uuid
        AND entity_version_id = ${testVersionId}::uuid
        AND action_key = ${TEST_QA_ACTIONS.assignment}
      ORDER BY occurred_at DESC, id DESC
      LIMIT 1
    `;

    const openCommentRows = await sqlClient`
      WITH comments AS (
        SELECT id
        FROM platform.audit_events
        WHERE entity_type = 'test'
          AND entity_id = ${testId}::uuid
          AND entity_version_id = ${testVersionId}::uuid
          AND action_key = ${TEST_QA_ACTIONS.comment}
      ), latest_resolutions AS (
        SELECT DISTINCT ON (metadata ->> 'commentId')
          metadata ->> 'commentId' AS "commentId",
          COALESCE((metadata ->> 'resolved')::boolean, false) AS resolved
        FROM platform.audit_events
        WHERE entity_type = 'test'
          AND entity_id = ${testId}::uuid
          AND entity_version_id = ${testVersionId}::uuid
          AND action_key = ${TEST_QA_ACTIONS.resolution}
        ORDER BY metadata ->> 'commentId', occurred_at DESC, id DESC
      )
      SELECT COUNT(*)::int AS count
      FROM comments c
      LEFT JOIN latest_resolutions r ON r."commentId" = c.id::text
      WHERE COALESCE(r.resolved, false) = false
    `;

    const issues: Array<{ code: string; message: string }> = [];
    if (!assignments[0]?.reviewerUserId) {
      issues.push({
        code: "TEST_QA_REVIEWER_UNASSIGNED",
        message: "Assign a QA reviewer to this test version before approval or publication.",
      });
    }
    const openCommentCount = Number(openCommentRows[0]?.count ?? 0);
    if (openCommentCount > 0) {
      issues.push({
        code: "TEST_QA_OPEN_COMMENTS",
        message: `Resolve ${openCommentCount} open QA comment(s) before approval or publication.`,
      });
    }

    if (issues.length > 0) {
      res.status(409).json({
        error: issues[0].message,
        code: "TEST_QA_GATE_BLOCKED",
        details: issues,
      });
      return;
    }
    next();
  } catch (error) {
    console.error("Unable to enforce Test QA gate", error);
    res.status(500).json({ error: "Unable to validate the Test QA gate" });
  }
}

router.use(authenticate);
router.post("/:id/actions/approve", requireAdminPermission("tests.approve"), enforceQaGate);
router.post("/:id/actions/schedule", requireAdminPermission("tests.publish"), enforceQaGate);
router.post("/:id/actions/publish", requireAdminPermission("tests.publish"), enforceQaGate);

export default router;
