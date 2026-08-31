import { Router } from "express";

import adminQuestionStudioEngineV1Router from "./admin-question-studio-engine-v1";
import adminQuestionStudioExamProfilesRouter from "./admin-question-studio-exam-profiles";

const router = Router();

// Non-Quant engines get first refusal. The engine facade deliberately calls
// next("route") for legacy Quant/Reasoning requests so the established
// exam-profile/mixed-difficulty path remains authoritative for them.
router.use(adminQuestionStudioEngineV1Router);
router.use(adminQuestionStudioExamProfilesRouter);

export default router;
