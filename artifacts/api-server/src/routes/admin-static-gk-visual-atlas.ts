import { Router, type IRouter } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { getStaticGkAtlasStatus } from "../static-gk-visual-atlas/status-registry";

const router: IRouter = Router();
router.use(authenticate);

router.get("/", requireAdminPermission("content.questions.read"), (_req, res) => {
  res.json({
    ...getStaticGkAtlasStatus(),
    generatedAt: new Date().toISOString(),
  });
});

export default router;
