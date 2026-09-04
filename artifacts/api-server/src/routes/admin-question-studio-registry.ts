import { Router, type IRouter } from "express";

import adminQuestionStudioBulkHardeningRouter from "./admin-question-studio-bulk-hardening";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioArgumentsCp015Router from "./admin-question-studio-arguments-cp015";
import adminQuestionStudioArgumentsCp014Router from "./admin-question-studio-arguments-cp014";
import adminQuestionStudioArgumentsCp013Router from "./admin-question-studio-arguments-cp013";
import adminQuestionStudioArgumentsCp012Router from "./admin-question-studio-arguments-cp012";
import adminQuestionStudioArgumentsCp010Router from "./admin-question-studio-arguments-cp010";
import adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007-v2";
import adminQuestionStudioArgumentsRouter from "./admin-question-studio-arguments";
import adminQuestionStudioSriRouter from "./admin-question-studio-sri";
import adminQuestionStudioDataSufficiencyCurrentRouter from "./admin-question-studio-data-sufficiency-current";
import adminQuestionStudioCp014Router from "./admin-question-studio-cp014";
import adminQuestionStudioTrigonometryRouter from "./admin-question-studio-trigonometry";
import adminQuestionStudioCp013Router from "./admin-question-studio-cp013";
import adminQuestionStudioAverageRouter from "./admin-question-studio-average";
import adminQuestionStudioRegenerationRouter from "./admin-question-studio-regeneration";
import adminQuestionStudioCalibrationRouter from "./admin-question-studio-calibration";
import adminQuestionStudioMixedDifficultyRouter from "./admin-question-studio-mixed-difficulty";
import adminQuestionStudioSeriesRouter from "./admin-question-studio-series";
import adminQuestionStudioInterestRouter from "./admin-question-studio-interest";
import adminQuestionStudioMensurationRouter from "./admin-question-studio-mensuration";
import adminQuestionStudioMensurationFullRouter from "./admin-question-studio-mensuration-full";
import adminQuestionStudioAlgebraRouter from "./admin-question-studio-algebra";
import adminQuestionStudioDataSufficiencyRouter from "./admin-question-studio-data-sufficiency";
import adminQuestionStudioProbabilityRouter from "./admin-question-studio-probability";
import adminQuestionStudioCalendarRouter from "./admin-question-studio-calendar";
import adminQuestionStudioSpatialRouter from "./admin-question-studio-spatial";
import adminQuestionStudioRouter from "./admin-question-studio";

/**
 * Canonical Question Studio route registry.
 *
 * Chapter/package integrations belong here instead of routes/index.ts. Keeping
 * the global route index stable prevents unrelated chapter workflows from
 * firing whenever one Question Studio package is added or reordered.
 *
 * Order is intentional: hardening/specialized additive routers must run before
 * the legacy catch-all router at the bottom. ARG-001 CP015 is the current
 * diversity-hardened internal authority. It preserves CP014's explicit manual
 * approval and internal lifecycle, expands two-argument SSC/banking variety
 * from the approved core semantic pool, and keeps all public/student delivery
 * gates closed. CP014/CP013/CP012/CP010/CP007/CP005 remain historical fallbacks.
 */
const router: IRouter = Router();

router.use(adminQuestionStudioBulkHardeningRouter);
router.use(adminQuestionStudioQualityRouter);
router.use(adminQuestionStudioArgumentsCp015Router);
router.use(adminQuestionStudioArgumentsCp014Router);
router.use(adminQuestionStudioArgumentsCp013Router);
router.use(adminQuestionStudioArgumentsCp012Router);
router.use(adminQuestionStudioArgumentsCp010Router);
router.use(adminQuestionStudioArgumentsCp007Router);
router.use(adminQuestionStudioArgumentsRouter);
router.use(adminQuestionStudioSriRouter);
router.use(adminQuestionStudioDataSufficiencyCurrentRouter);
router.use(adminQuestionStudioCp014Router);
router.use(adminQuestionStudioTrigonometryRouter);
router.use(adminQuestionStudioCp013Router);
router.use(adminQuestionStudioAverageRouter);
router.use(adminQuestionStudioRegenerationRouter);
router.use(adminQuestionStudioCalibrationRouter);
router.use(adminQuestionStudioMixedDifficultyRouter);
router.use(adminQuestionStudioSeriesRouter);
router.use(adminQuestionStudioInterestRouter);
router.use(adminQuestionStudioMensurationRouter);
router.use(adminQuestionStudioMensurationFullRouter);
router.use(adminQuestionStudioAlgebraRouter);
router.use(adminQuestionStudioDataSufficiencyRouter);
router.use(adminQuestionStudioProbabilityRouter);
router.use(adminQuestionStudioCalendarRouter);
router.use(adminQuestionStudioSpatialRouter);
router.use(adminQuestionStudioRouter);

export default router;
