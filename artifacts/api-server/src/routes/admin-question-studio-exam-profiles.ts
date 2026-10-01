import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { listQuantExamProfiles } from "../question-studio/quant-exam-profile";

const router = Router();

router.use(authenticate);

router.get(
  "/exam-profiles",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      profileVersion: 1,
      profiles: listQuantExamProfiles(),
    });
  },
);

export default router;
