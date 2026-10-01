import { Router } from "express";

import adminQuestionStudioExamProfilesRouter from "./admin-question-studio-exam-profiles";

const router = Router();

// Quant mixed-difficulty generation now runs through the canonical engine-v1
// /runs handler. This compatibility router only exposes the read-only exam
// profile catalog used by calibration/profile administration surfaces.
router.use(adminQuestionStudioExamProfilesRouter);

export default router;
