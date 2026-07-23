import { Router } from "express";

import { listAdminRequestFailures } from "../lib/admin-request-failures";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get(
  "/request-failures",
  requireAdminPermission("jobs.read"),
  (req, res) => {
    const limit = Number(req.query.limit ?? 100);
    const failures = listAdminRequestFailures(Number.isFinite(limit) ? limit : 100);
    res.json({
      failures,
      count: failures.length,
      generatedAt: new Date().toISOString(),
      retention: "Current API process, latest 500 failures",
    });
  },
);

export default router;
