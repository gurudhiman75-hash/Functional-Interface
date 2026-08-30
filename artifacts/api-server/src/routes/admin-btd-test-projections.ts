import { Router, type Response } from "express";

import { materializeBtdCp014TestProjectionV1 } from "../lib/admin-btd-test-projection-materialization";
import { enableBtdCp015ScoredTestEligibilityV1 } from "../lib/admin-btd-scored-test-eligibility";
import { enableBtdCp017MockTestEligibilityV1 } from "../lib/admin-btd-mock-test-eligibility";
import { QuestionManagementError } from "../lib/admin-question-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import type { BtdPermanentQlId } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { authenticate } from "../middlewares/auth";

const router = Router();

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(asText).filter(Boolean) : [];
}
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function sendError(res: Response, error: unknown): void {
  if (error instanceof QuestionManagementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const statusCode = Number((error as { statusCode?: unknown } | null)?.statusCode);
  if (Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600) {
    res.status(statusCode).json({ error: error instanceof Error ? error.message : "Invalid BTD projection request" });
    return;
  }
  console.error("Unable to update BTD test projection", error);
  res.status(500).json({ error: "Unable to update BTD test projection" });
}

router.use(authenticate);

router.post(
  "/btd-test-projections/materialize",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const qlId = asText(req.body?.qlId).toUpperCase() as BtdPermanentQlId;
      const seed = asText(req.body?.seed);
      const examVersionId = asText(req.body?.examVersionId);
      const primaryTaxonomyNodeId = asText(req.body?.primaryTaxonomyNodeId);
      const taxonomyNodeIds = asStringArray(req.body?.taxonomyNodeIds);

      const result = await sqlClient.begin((tx) => materializeBtdCp014TestProjectionV1(
        tx,
        {
          qlId,
          seed,
          examVersionId,
          primaryTaxonomyNodeId,
          taxonomyNodeIds,
        },
        actorUserId,
      ));
      res.status(result.reused ? 200 : 201).json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  "/btd-test-projections/:id/enable-scored-test",
  requireAdminPermission("tests.create"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const questionId = asText(req.params.id);
      if (!isUuid(questionId)) {
        throw new QuestionManagementError("INVALID_QUESTION_ID", "Invalid BTD projection identifier.", 400);
      }
      const expectedLockVersion = Number(req.body?.expectedLockVersion);
      const result = await sqlClient.begin((tx) => enableBtdCp015ScoredTestEligibilityV1(
        tx,
        questionId,
        expectedLockVersion,
        actorUserId,
      ));
      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  "/btd-test-projections/:id/enable-mock-test",
  requireAdminPermission("tests.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const questionId = asText(req.params.id);
      if (!isUuid(questionId)) {
        throw new QuestionManagementError("INVALID_QUESTION_ID", "Invalid BTD projection identifier.", 400);
      }
      const expectedLockVersion = Number(req.body?.expectedLockVersion);
      const result = await sqlClient.begin((tx) => enableBtdCp017MockTestEligibilityV1(
        tx,
        questionId,
        expectedLockVersion,
        actorUserId,
      ));
      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
