import { Router, type IRouter } from "express";

import adminQuestionStudioBulkHardeningRouter from "./admin-question-studio-bulk-hardening";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007";
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
 * the legacy catch-all router at the bottom. ARG-001 CP007 is an additive
 * real-paper profile layer mounted before the frozen CP005 adapter. It handles
 * only explicit CP007/profile requests and augments capabilities; all ordinary
 * ARG-001 requests continue to the unchanged CP005 route. SRI remains the
 * immediate fallback for every previously registered package.
 */
const router: IRouter = Router();

router.use(adminQuestionStudioBulkHardeningRouter);
router.use(adminQuestionStudioQualityRouter);
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
