import { Router } from "express";

import {
  BtdTestProjectionMaterializationError,
  materializeBtdCp014ScoredTestProjectionV1,
} from "../lib/admin-btd-test-projection-materialization";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function text(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }

router.use(authenticate);

router.post(
  "/btd-test-projections",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required", code: "ADMIN_SESSION_REQUIRED" });
        return;
      }
      const result = await sqlClient.begin((tx) => materializeBtdCp014ScoredTestProjectionV1(
        tx as typeof sqlClient,
        {
          generationItemId: text(req.body?.generationItemId),
          examVersionId: text(req.body?.examVersionId),
          primaryTaxonomyNodeId: text(req.body?.primaryTaxonomyNodeId),
          actorUserId,
          reason: text(req.body?.reason),
        },
      ));
      res.status(result.reused ? 200 : 201).json({
        ...result,
        chapter: "BTD-001",
        checkpoint: "BTD-CP-014",
        status: "approved",
        testProjectionMaterialized: true,
        testEligibilityApprovalGranted: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      if (error instanceof BtdTestProjectionMaterializationError) {
        res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
        return;
      }
      console.error("Unable to materialize BTD test projection", error);
      res.status(500).json({ error: "Unable to materialize BTD test projection" });
    }
  },
);

export default router;
